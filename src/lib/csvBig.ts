import * as fs from 'fs';
import * as readline from 'readline';
import { Condition, CsvBigOptions, CsvRecord, ProcessOptions } from './types';

export class CsvBig {
	private inputFilePath: string;
	private outputFilePath: string | null;
	private maxLines: number | null;
	private delimiter: string;
	private csvHeaders: string[] | null;
	private topRecords: CsvRecord[];

	constructor(inputFilePath: string, options: CsvBigOptions = {}) {
		this.inputFilePath = inputFilePath;
		this.outputFilePath = options.outputFilePath || null;
		this.maxLines = options.maxLines && Number.isInteger(options.maxLines) ? options.maxLines : null;
		this.delimiter = options.delimiter || ',';
		this.csvHeaders = null;
		this.topRecords = [];
	}

	async extractLines(numberOfLines: number): Promise<CsvRecord[]> {
		return this.processLines({
			condition: () => true,
			limit: numberOfLines
		}) as CsvRecord[];
	}

	async extractWhere(conditions: Condition[], numberOfLines?: number): Promise<CsvRecord[]> {
		return this.processLines({
			condition: (record: CsvRecord) => {
				return conditions.every(({ attribute, filter }) => filter(record[attribute]));
			},
			limit: numberOfLines
		}) as CsvRecord[];
	}

	private async processLines({ condition, limit }: ProcessOptions): Promise<CsvRecord[] | void> {
		this.topRecords = [];
		let lineCounter = 0;

		const fileStream = fs.createReadStream(this.inputFilePath);
		const lineReader = readline.createInterface({ input: fileStream });

		for await (const line of lineReader) {
			if (!this.csvHeaders) {
				this.csvHeaders = this.splitLineToColumns(line, this.delimiter);
				continue;
			}

			const record = this.convertLineToJsonRecord(this.csvHeaders, line, this.delimiter);

			if (condition(record)) {
				this.topRecords.push(record);
				lineCounter++;

				if (limit && lineCounter >= limit) {
					break;
				}
			}
		}

		if (this.outputFilePath) {
			try {
				fs.writeFileSync(this.outputFilePath, JSON.stringify(this.topRecords, null, 2));
				console.log(`Done. Processed ${lineCounter} lines! Output file has been generated successfully.`);
			} catch (err) {
				console.error(`Failed to write output file: ${(err as Error).message}`);
			}
		} else {
			return this.topRecords;
		}
	}

	private convertLineToJsonRecord(headers: string[], line: string, delimiter: string): CsvRecord {
		const data = this.splitLineToColumns(line, delimiter);
		if (headers.length !== data.length) {
			throw new Error('The CSV file may be corrupted');
		}

		return headers.reduce((acc, header, index) => {
			acc[header] = this.parseJsonField(data[index]);
			return acc;
		}, {} as CsvRecord);
	}

	private splitLineToColumns(line: string, delimiter: string): string[] {
		const columns: string[] = [];
		let currentColumn = '';
		let insideQuotes = false;

		for (let i = 0; i < line.length; i++) {
			const char = line[i];
			if (char === '"' && line[i + 1] === '"') {
				currentColumn += '"';
				i++; // Skip the escaped quote
			} else if (char === '"') {
				insideQuotes = !insideQuotes;
			} else if (char === delimiter && !insideQuotes) {
				columns.push(currentColumn);
				currentColumn = '';
			} else {
				currentColumn += char;
			}
		}

		columns.push(currentColumn);
		return columns;
	}

	private parseJsonField(value: string): string | number | boolean | null {
		try {
			return JSON.parse(value);
		} catch {
			return value;
		}
	}
}
