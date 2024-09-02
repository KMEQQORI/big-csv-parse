const fs = require('fs');
const readline = require('readline');
const { MinPriorityQueue } = require('@datastructures-js/priority-queue');

const csvParseBig = async (inputFilePath, outputFilePath, options = {}) => {
    const {
        maxLines = null,
        delimiter = ','
    } = options;

    let csvHeaders = null;
    let lineCounter = 0;
    const topRecordsHeap = new MinPriorityQueue({ priority: record => new Date(record.date).getTime() });

    const fileStream = fs.createReadStream(inputFilePath);
    const lineReader = readline.createInterface({ input: fileStream });

    for await (const line of lineReader) {
        if (!csvHeaders) {
            csvHeaders = splitLineToColumns(line, delimiter);
            continue;
        }

        const record = convertLineToJsonRecord(csvHeaders, line, delimiter);
        maintainTopRecords(record, topRecordsHeap, maxLines);
        lineCounter++;
    }

    const topRecords = extractRecordsFromHeap(topRecordsHeap);
    fs.writeFileSync(outputFilePath, JSON.stringify(topRecords, null, 2));
    console.log(`Done. Processed ${lineCounter} lines! Output file has been generated successfully.`);
};

function maintainTopRecords(record, topRecordsHeap, maxLines) {
    topRecordsHeap.enqueue(record);
    if (topRecordsHeap.size() > maxLines) {
        topRecordsHeap.dequeue();
    }
}

function extractRecordsFromHeap(heap) {
    return heap.toArray().map(entry => entry.element);
}

function convertLineToJsonRecord(headers, line, delimiter) {
    const data = splitLineToColumns(line, delimiter);
    if (headers.length !== data.length) {
        throw new Error('The CSV file may be corrupted');
    }

    return headers.reduce((acc, header, index) => {
        acc[header] = parseJsonField(data[index]);
        return acc;
    }, {});
}

function splitLineToColumns(line, delimiter) {
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

function parseJsonField(value) {
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

module.exports = { csvParseBig };