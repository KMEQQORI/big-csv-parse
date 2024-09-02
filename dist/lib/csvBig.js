"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvBig = void 0;
var fs = __importStar(require("fs"));
var readline = __importStar(require("readline"));
var CsvBig = /** @class */ (function () {
    function CsvBig(inputFilePath, options) {
        if (options === void 0) { options = {}; }
        this.inputFilePath = inputFilePath;
        this.outputFilePath = options.outputFilePath || null;
        this.maxLines = options.maxLines && Number.isInteger(options.maxLines) ? options.maxLines : null;
        this.delimiter = options.delimiter || ',';
        this.csvHeaders = null;
        this.topRecords = [];
    }
    CsvBig.prototype.extractLines = function (numberOfLines) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.processLines({
                        condition: function () { return true; },
                        limit: numberOfLines
                    })];
            });
        });
    };
    CsvBig.prototype.extractWhere = function (conditions, numberOfLines) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.processLines({
                        condition: function (record) {
                            return conditions.every(function (_a) {
                                var attribute = _a.attribute, filter = _a.filter;
                                return filter(record[attribute]);
                            });
                        },
                        limit: numberOfLines
                    })];
            });
        });
    };
    CsvBig.prototype.processLines = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var lineCounter, fileStream, lineReader, _c, lineReader_1, lineReader_1_1, line, record, e_1_1;
            var _d, e_1, _e, _f;
            var condition = _b.condition, limit = _b.limit;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        this.topRecords = [];
                        lineCounter = 0;
                        fileStream = fs.createReadStream(this.inputFilePath);
                        lineReader = readline.createInterface({ input: fileStream });
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 6, 7, 12]);
                        _c = true, lineReader_1 = __asyncValues(lineReader);
                        _g.label = 2;
                    case 2: return [4 /*yield*/, lineReader_1.next()];
                    case 3:
                        if (!(lineReader_1_1 = _g.sent(), _d = lineReader_1_1.done, !_d)) return [3 /*break*/, 5];
                        _f = lineReader_1_1.value;
                        _c = false;
                        line = _f;
                        if (!this.csvHeaders) {
                            this.csvHeaders = this.splitLineToColumns(line, this.delimiter);
                            return [3 /*break*/, 4];
                        }
                        record = this.convertLineToJsonRecord(this.csvHeaders, line, this.delimiter);
                        if (condition(record)) {
                            this.topRecords.push(record);
                            lineCounter++;
                            if (limit && lineCounter >= limit) {
                                return [3 /*break*/, 5];
                            }
                        }
                        _g.label = 4;
                    case 4:
                        _c = true;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _g.trys.push([7, , 10, 11]);
                        if (!(!_c && !_d && (_e = lineReader_1.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _e.call(lineReader_1)];
                    case 8:
                        _g.sent();
                        _g.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        if (this.outputFilePath) {
                            try {
                                fs.writeFileSync(this.outputFilePath, JSON.stringify(this.topRecords, null, 2));
                                console.log("Done. Processed ".concat(lineCounter, " lines! Output file has been generated successfully."));
                            }
                            catch (err) {
                                console.error("Failed to write output file: ".concat(err.message));
                            }
                        }
                        else {
                            return [2 /*return*/, this.topRecords];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CsvBig.prototype.convertLineToJsonRecord = function (headers, line, delimiter) {
        var _this = this;
        var data = this.splitLineToColumns(line, delimiter);
        if (headers.length !== data.length) {
            throw new Error('The CSV file may be corrupted');
        }
        return headers.reduce(function (acc, header, index) {
            acc[header] = _this.parseJsonField(data[index]);
            return acc;
        }, {});
    };
    CsvBig.prototype.splitLineToColumns = function (line, delimiter) {
        var columns = [];
        var currentColumn = '';
        var insideQuotes = false;
        for (var i = 0; i < line.length; i++) {
            var char = line[i];
            if (char === '"' && line[i + 1] === '"') {
                currentColumn += '"';
                i++; // Skip the escaped quote
            }
            else if (char === '"') {
                insideQuotes = !insideQuotes;
            }
            else if (char === delimiter && !insideQuotes) {
                columns.push(currentColumn);
                currentColumn = '';
            }
            else {
                currentColumn += char;
            }
        }
        columns.push(currentColumn);
        return columns;
    };
    CsvBig.prototype.parseJsonField = function (value) {
        try {
            return JSON.parse(value);
        }
        catch (_a) {
            return value;
        }
    };
    return CsvBig;
}());
exports.CsvBig = CsvBig;
