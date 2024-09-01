const fs = require('fs');
const readline = require('readline');

const bigCSVParse = async (inputFilePath, outputFilePath, options = {}) => {
    const {
        groupAttributeName = null,
        sortingAttributeName = 'createdAt',
        maxLines = 10,
        progressInterval = 10000
    } = options;

    const latestRecordMap = new Map();
    let csvHeaders = null;
    let lineCounter = 0;
    let topRecords = [];

    const fileStream = fs.createReadStream(inputFilePath);
    const lineReader = readline.createInterface({ input: fileStream });

    for await (const line of lineReader) {
        if (!csvHeaders) {
            csvHeaders = splitLineToColumns(line);
        } else {
            const record = convertLineToJsonRecord(csvHeaders, line);
            saveRecord(record, latestRecordMap, topRecords, groupAttributeName, sortingAttributeName, maxLines);
        }

        if (lineCounter % progressInterval === 0) console.log(`${lineCounter} lines processed`);
        lineCounter++;
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(topRecords, null, 2));
    console.log(`Done. ${lineCounter} lines processed! The result file was generated successfully.`);
};

function saveRecord(record, recordMap, topRecords, groupAttributeName, sortingAttributeName, maxLines) {
    if (!groupAttributeName) {
        topRecords.push(record);

        if (topRecords.length > maxLines) {
            topRecords.sort((a, b) => new Date(b[sortingAttributeName]) - new Date(a[sortingAttributeName]));
            topRecords.pop();
        }
        return;
    }

    const existingRecord = recordMap.get(record[groupAttributeName]);
    const newRecordDate = new Date(record[sortingAttributeName]);

    if (!existingRecord || new Date(existingRecord[sortingAttributeName]) <= newRecordDate) {
        recordMap.set(record[groupAttributeName], record);

        if (!existingRecord) {
            topRecords.push(record);
        } else {
            const index = topRecords.findIndex(r => r[groupAttributeName] === record[groupAttributeName]);
            topRecords[index] = record;
        }

        if (topRecords.length > maxLines) {
            topRecords.sort((a, b) => new Date(b[sortingAttributeName]) - new Date(a[sortingAttributeName]));
            topRecords.pop();
        }
    }
}

function convertLineToJsonRecord(headers, line) {
    const data = splitLineToColumns(line);
    if (headers.length !== data.length) {
        throw new Error('The CSV file may be corrupted');
    }

    return headers.reduce((acc, header, index) => {
        acc[header] = parseJsonField(data[index]);
        return acc;
    }, {});
}

function splitLineToColumns(line) {
    const columns = [];
    let currentColumn = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"' && line[i + 1] === '"') {
            currentColumn += '"';
            i++;
        } else if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            columns.push(currentColumn);
            currentColumn = '';
        } else {
            currentColumn += char;
        }
    }

    columns.push(currentColumn);
    return columns;
}

function parseJsonField(value) {
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

module.exports = { bigCSVParse };