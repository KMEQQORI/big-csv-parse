export type CsvRecord = Record<string, string | number | boolean | null>;

export interface Condition {
	attribute: string;
	filter: (value: string | number | boolean | null) => boolean;
}

export interface ProcessOptions {
	condition: (record: CsvRecord) => boolean;
	limit?: number;
}

export interface CsvBigOptions {
	outputFilePath?: string | null;
	maxLines?: number | null;
	delimiter?: string;
}
