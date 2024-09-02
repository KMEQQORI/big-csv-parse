const fs = require('fs');
const readline = require('readline');

class csvParseBig {
    constructor(inputFilePath, options = {}) {
        this.inputFilePath = inputFilePath;
        this.outputFilePath = options.outputFilePath || null;
        this.maxLines = options.maxLines && Number.isInteger(options.maxLines) ? options.maxLines : null;
        this.delimiter = options.delimiter || ',';
        this.csvHeaders = null;
        this.topRecords = [];
    }

    async extractFirstLines(numberOfLines) {
        return this.processLines({
            condition: () => true,
            limit: numberOfLines
        });
    }

    async extractWhere(conditions, numberOfLines) {
        return this.processLines({
            condition: (record) => {
                return conditions.every(({ attribute, filter }) => filter(record[attribute]));
            },
            limit: numberOfLines
        });
    }

    async processLines({ condition, limit }) {
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
                console.error(`Failed to write output file: ${err.message}`);
            }
        } else {
            return this.topRecords;
        }
    }

    async parseCsv() {
        let lineCounter = 0;
        this.topRecords = [];

        const fileStream = fs.createReadStream(this.inputFilePath);
        const lineReader = readline.createInterface({ input: fileStream });

        for await (const line of lineReader) {
            if (!this.csvHeaders) {
                this.csvHeaders = this.splitLineToColumns(line, this.delimiter);
                continue;
            }

            const record = this.convertLineToJsonRecord(this.csvHeaders, line, this.delimiter);
            this.maintainTopRecords(record);
            lineCounter++;
        }

        try {
            fs.writeFileSync(this.outputFilePath, JSON.stringify(this.topRecords, null, 2));
            console.log(`Done. Processed ${lineCounter} lines! Output file has been generated successfully.`);
        } catch (err) {
            console.error(`Failed to write output file: ${err.message}`);
        }
    }

    maintainTopRecords(record) {
        this.topRecords.push(record);

        // Optimize: Consider a more efficient way to maintain a fixed number of records
        if (this.maxLines && this.topRecords.length > this.maxLines) {
            this.topRecords = this.topRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, this.maxLines);
        }
    }

    convertLineToJsonRecord(headers, line, delimiter) {
        const data = this.splitLineToColumns(line, delimiter);
        if (headers.length !== data.length) {
            throw new Error('The CSV file may be corrupted');
        }

        return headers.reduce((acc, header, index) => {
            acc[header] = this.parseJsonField(data[index]);
            return acc;
        }, {});
    }

    splitLineToColumns(line, delimiter) {
        const columns = [];
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

    parseJsonField(value) {
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }
}

module.exports = csvParseBig;
