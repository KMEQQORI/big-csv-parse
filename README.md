# csv-parse-big

csv parsing library, handling big csv files

## Installation

```bash
npm install csv-parse-big
```

## Usage
```js
const { csvParseBig } = require('csv-parse-big');

    try {
        await csvParseBig('data.csv', 'users.json', {
            maxLines: 10,
            delimiter: ','
        })
    } catch (error) {
        console.error('Error:', error);
    }
``