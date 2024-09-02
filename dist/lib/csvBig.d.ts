interface Condition {
    attribute: string;
    filter: (value: any) => boolean;
}
interface CsvBigOptions {
    outputFilePath?: string | null;
    maxLines?: number | null;
    delimiter?: string;
}
export declare class CsvBig {
    private inputFilePath;
    private outputFilePath;
    private maxLines;
    private delimiter;
    private csvHeaders;
    private topRecords;
    constructor(inputFilePath: string, options?: CsvBigOptions);
    extractLines(numberOfLines: number): Promise<Record<string, any>[] | void>;
    extractWhere(conditions: Condition[], numberOfLines?: number): Promise<Record<string, any>[] | void>;
    private processLines;
    private convertLineToJsonRecord;
    private splitLineToColumns;
    private parseJsonField;
}
export {};
