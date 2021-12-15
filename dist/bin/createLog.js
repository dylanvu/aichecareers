"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateErrorLog = void 0;
var fs = require("fs");
var moment = require("moment");
var CreateErrorLog = function (errorData) {
    fs.writeFile("../error-logs/".concat(moment().format(), ".txt"), errorData, function (err) {
        if (err) {
            return console.error(err);
        }
    });
};
exports.CreateErrorLog = CreateErrorLog;
//# sourceMappingURL=createLog.js.map