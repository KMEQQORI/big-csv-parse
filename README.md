
# csv-big

`csvBig` is a Node.js library for processing and extracting data from large CSV files. It is designed to efficiently handle large CSV files using streaming.

## Installation

To use `csvBig`, you must first install it via npm. In your project directory, run:

```
npm install csvBig
```

## Usage

Here’s how to use `csvParseBig` to process your CSV files.

### Code Example

```
const csvBig = require('csvBig');

// Create an instance of the parser with the CSV file path and options
const parser = new csvBig('path/to/largefile.csv', {
    outputFilePath: 'output.json',
    maxLines: 1000,
    delimiter: ','
});

// Extract the first lines
parser.extractFirstLines(10).then((records) => {
    console.log('First 10 records:', records);
});

// Extract lines that meet certain conditions
parser.extractWhere([
    { attribute: 'status', filter: value => value === 'active' }
], 50).then((records) => {
    console.log('Filtered records:', records);
});
```

## Methods

### extractFirstLines(numberOfLines)
Extracts the first "numberOfLines" lines from the CSV file.

#### Parameters:

- **numberOfLines (Number):** Number of lines to extract.
- ***Returns:*** A promise that resolves to an array of extracted records.

### extractWhere(conditions, numberOfLines)
Extracts up to `numberOfLines` lines from the CSV file that meet the specified conditions.

#### Parameters:

- **conditions (Array):** List of conditions where each condition is an object { attribute, filter }.
  - **attribute (String):** Name of the attribute to filter.
  - **filter (Function):** Filtering function that returns true or false for the given attribute.
- **numberOfLines (Number):** Maximum number of lines to extract.
- ***Returns:*** A promise that resolves to an array of extracted records.

### Constructor Options
- **inputFilePath (String):** The path to the CSV file to be processed (required).
- **outputFilePath (String):** The path to the output JSON file (optional, defaults to `output.json`).
- **maxLines (Number):** Maximum number of lines to keep for full analysis (optional).
- **delimiter (String):** Delimiter used in the CSV file (optional, defaults to `,`).

### Notes
Ensure that the CSV file is properly formatted and that the column headers match the data.

### Contributing
Contributions are welcome! If you have suggestions or corrections, please submit a pull request or open an issue on the project’s GitHub repository.

### License
This project is licensed under the MIT License. See the LICENSE file for more information.

### Authors
Khalil MEQQORI - Module Creator
For more information or any questions, please open an issue on the GitHub repository or contact us at meqqorikhalil@gmail.com.
