import { CsvBig } from '../csvBig'; // chemin relatif à votre fichier CsvBig.ts
import * as fs from 'fs';
import * as readline from 'readline';

// Mock des modules fs et readline
jest.mock('fs');
jest.mock('readline');

describe('CsvBig', () => {
	const mockFilePath = 'mock.csv';
	const mockOutputPath = 'output.json';

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('constructor', () => {
		it('should initialize with given options', () => {
			const csvBig = new CsvBig(mockFilePath, {
				outputFilePath: mockOutputPath,
				maxLines: 10,
				delimiter: ';'
			});

			expect(csvBig['inputFilePath']).toBe(mockFilePath);
			expect(csvBig['outputFilePath']).toBe(mockOutputPath);
			expect(csvBig['maxLines']).toBe(10);
			expect(csvBig['delimiter']).toBe(';');
		});

		it('should initialize with default options', () => {
			const csvBig = new CsvBig(mockFilePath);

			expect(csvBig['inputFilePath']).toBe(mockFilePath);
			expect(csvBig['outputFilePath']).toBeNull();
			expect(csvBig['maxLines']).toBeNull();
			expect(csvBig['delimiter']).toBe(',');
		});
	});

	describe('extractLines', () => {
		it('should call processLines with the correct limit', async () => {
			const csvBig = new CsvBig(mockFilePath);
			const processLinesSpy = jest.spyOn<any, any>(csvBig, 'processLines').mockResolvedValue([]);

			await csvBig.extractLines(5);

			expect(processLinesSpy).toHaveBeenCalledWith({ condition: expect.any(Function), limit: 5 });
		});
	});

	describe('extractWhere', () => {
		it('should call processLines with correct condition and limit', async () => {
			const csvBig = new CsvBig(mockFilePath);
			const processLinesSpy = jest.spyOn<any, any>(csvBig, 'processLines').mockResolvedValue([]);
			const mockConditions = [{ attribute: 'name', filter: jest.fn().mockReturnValue(true) }];

			await csvBig.extractWhere(mockConditions, 5);

			expect(processLinesSpy).toHaveBeenCalledWith({ condition: expect.any(Function), limit: 5 });
		});
	});

	describe('processLines', () => {
		it('should process the lines and apply condition', async () => {
			const mockReadStream = jest.fn();
			const mockInterface = {
				on: jest.fn(),
				[Symbol.asyncIterator]: jest.fn().mockReturnValue({
					async next() {
						return { done: true, value: 'mockLine' };
					}
				})
			};

			(fs.createReadStream as jest.Mock).mockReturnValue(mockReadStream);
			(readline.createInterface as jest.Mock).mockReturnValue(mockInterface);

			const csvBig = new CsvBig(mockFilePath);
			const result = await csvBig['processLines']({
				condition: () => true,
				limit: 5
			});

			expect(result).toEqual([]);
		});

		it('should write output file if outputFilePath is set', async () => {
			const mockReadStream = jest.fn();
			const mockInterface = {
				on: jest.fn(),
				[Symbol.asyncIterator]: jest.fn().mockReturnValue({
					async next() {
						return { done: true, value: 'mockLine' };
					}
				})
			};

			(fs.createReadStream as jest.Mock).mockReturnValue(mockReadStream);
			(readline.createInterface as jest.Mock).mockReturnValue(mockInterface);
			const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

			const csvBig = new CsvBig(mockFilePath, { outputFilePath: mockOutputPath });
			await csvBig['processLines']({
				condition: () => true,
				limit: 5
			});

			expect(writeFileSyncSpy).toHaveBeenCalledWith(mockOutputPath, JSON.stringify([], null, 2));
		});
	});

	describe('convertLineToJsonRecord', () => {
		it('should convert line to json record correctly', () => {
			const csvBig = new CsvBig(mockFilePath);
			const headers = ['name', 'age'];
			const line = 'John,30';

			const result = csvBig['convertLineToJsonRecord'](headers, line, ',');

			expect(result).toEqual({ name: 'John', age: 30 });
		});

		it('should throw error if headers and data length do not match', () => {
			const csvBig = new CsvBig(mockFilePath);
			const headers = ['name', 'age'];
			const line = 'John';

			expect(() => {
				csvBig['convertLineToJsonRecord'](headers, line, ',');
			}).toThrow('The CSV file may be corrupted');
		});
	});

	describe('splitLineToColumns', () => {
		it('should split line into columns correctly', () => {
			const csvBig = new CsvBig(mockFilePath);
			const line = '"John, Doe",30,"New York"';

			const result = csvBig['splitLineToColumns'](line, ',');

			expect(result).toEqual(['John, Doe', '30', 'New York']);
		});
	});

	describe('parseJsonField', () => {
		it('should parse JSON field correctly', () => {
			const csvBig = new CsvBig(mockFilePath);
			expect(csvBig['parseJsonField']('"string"')).toBe('string');
			expect(csvBig['parseJsonField']('123')).toBe(123);
			expect(csvBig['parseJsonField']('true')).toBe(true);
			expect(csvBig['parseJsonField']('null')).toBeNull();
			expect(csvBig['parseJsonField']('not-a-json')).toBe('not-a-json');
		});
	});
});
