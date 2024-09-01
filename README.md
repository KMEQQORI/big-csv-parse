# CSV to JSON Library

A simple library to parse CSV files into JSON format with optional grouping.

## Installation

```bash
npm install csv-to-json-lib
```

## Usage
```js
const { parseCsvToJson } = require('csv-to-json-lib');

parseCsvToJson('data.csv', 'users.json', {
    groupAttributeName: 'uid',
    sortingAttributeName: 'createdAt',
    maxLines: 10,
    delimiter: ','
}).then(() => {
    console.log('Conversion complete!');
}).catch(error => {
    console.error('Error:', error);
});
``