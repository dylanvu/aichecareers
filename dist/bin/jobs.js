"use strict";
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
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetJobArray = exports.GetAccessToken = exports.WeeklyPostings = exports.DailyEmails = void 0;
var cron = require("cron");
var dotenv = require("dotenv");
var cheerio = require("cheerio");
var job_1 = require("../classes/job");
dotenv.config();
var axios = require('axios').default; // Do this for typescript: https://github.com/axios/axios
var DailyEmails = function (client, mongoclient) { return __awaiter(void 0, void 0, void 0, function () {
    var dailyJob;
    return __generator(this, function (_a) {
        // Every day, look through gmail to get the newest job alerts that haven't been read
        // Project is in the fake email
        // Refresh token: ibm.com/docs/en/app-connect/cloud?topic=gmail-connecting-google-application-by-providing-credentials-app-connect-use-basic-oauth
        // Define the daily email getting job at 11:59 PM
        (0, exports.GetAccessToken)().then(function (accessToken) {
            // Now that we have an access token, make call to the API to get the messages
            GetEmails(accessToken).then(function (emailList) {
                console.log("Success", emailList);
            });
        });
        dailyJob = new cron.CronJob('0 59 23 * * *', function () {
            console.log("Getting today's postings");
            try {
                // Generate new access token: https://stackoverflow.com/questions/10631042/how-to-generate-access-token-using-refresh-token-through-google-drive-api
                (0, exports.GetAccessToken)().then(function (accessToken) {
                    // Now that we have an access token, make call to the API to get the messages
                    GetEmails(accessToken).then(function (emailList) {
                        emailList.forEach(function (emailId) {
                            UploadEmail(accessToken, emailId, mongoclient);
                        });
                    });
                });
            }
            catch (error) {
                console.error(error);
                // client.channels.cache.get(process.env.DEBUG_CHANNEL_ID).send("Error in QOTD!");
                // client.channels.cache.get(process.env.DEBUG_CHANNEL_ID).send(error);
            }
        }, null, true, 'America/Los_Angeles');
        dailyJob.start();
        return [2 /*return*/];
    });
}); };
exports.DailyEmails = DailyEmails;
var WeeklyPostings = function (client) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}); };
exports.WeeklyPostings = WeeklyPostings;
var GetAccessToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.post("https://www.googleapis.com/oauth2/v4/token", {
                    client_id: process.env.GMAIL_CLIENT_ID,
                    client_secret: process.env.GMAIL_CLIENT_SECRET,
                    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
                    grant_type: "refresh_token"
                })];
            case 1:
                res = _a.sent();
                return [2 /*return*/, res.data.access_token];
        }
    });
}); };
exports.GetAccessToken = GetAccessToken;
var GetEmails = function (access) { return __awaiter(void 0, void 0, void 0, function () {
    var labelId, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                labelId = "Label_4791209953381529751";
                return [4 /*yield*/, axios.get("https://gmail.googleapis.com/gmail/v1/users/".concat(process.env.EMAIL, "%40gmail.com/messages?key=").concat(process.env.GMAIL_API_KEY), {
                        headers: {
                            Authorization: "Bearer ".concat(access)
                        }
                    })];
            case 1:
                res = _a.sent();
                return [2 /*return*/, res.data.messages];
        }
    });
}); };
var UploadEmail = function (access, emailId, mongoclient) { return __awaiter(void 0, void 0, void 0, function () {
    var res, html, jobs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.get("https://gmail.googleapis.com/gmail/v1/users/".concat(process.env.EMAIL, "%40gmail.com/messages/").concat(emailId, "?key=").concat(process.env.GMAIL_API_KEY), {
                    headers: {
                        Authorization: "Bearer ".concat(access)
                    }
                })];
            case 1:
                res = _a.sent();
                html = atob(res.data.payload.parts[-1].body.data);
                jobs = (0, exports.GetJobArray)(html);
                // Iterate through each job and add it to the correct mongodb collection
                jobs.forEach(function (job) {
                });
                return [2 /*return*/];
        }
    });
}); };
var GetJobArray = function (html) {
    var jobList = [];
    // Parse the html and format the posting
    var $ = cheerio.load(html, null, false);
    // See: https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/ for general guide
    // https://stackoverflow.com/questions/54463522/is-there-a-cheerio-selector-for-style for getting style selector
    var jobs = $('td[style="-webkit-text-size-adjust:100%;mso-table-rspace:0pt;mso-table-lspace:0pt;padding-bottom:4px;-ms-text-size-adjust:100%;"] > a'); // Get the links and titles containing the post and the position name
    var companies = $('td[style="-webkit-text-size-adjust:100%;mso-table-rspace:0pt;mso-table-lspace:0pt;-ms-text-size-adjust:100%;"] > p'); // Get companies
    // Parse the jobs and make job objects
    for (var i = 0; i < jobs.length; i++) {
        // Weird bug? where node does not have data, so: https://github.com/cheeriojs/cheerio/issues/1925
        var jobTitle = jobs[i].children[0];
        var companyName = companies[i].children[0];
        // jobList.push(new Job(ParseJobLink(jobs[i].attribs.href), jobTitle.data, ParseCompanyName(companyName.data))); // Create Job object with company name wihout location
        jobList.push(new job_1.Job(ParseJobLink(jobs[i].attribs.href), jobTitle.data, companyName.data, isInternship(jobTitle.data)));
    }
    console.log(jobList);
    return jobList;
};
exports.GetJobArray = GetJobArray;
var ParseJobLink = function (url) {
    // Example split job link: https://www.linkedin.com/comm/jobs/view/2829788548'
    // Job links unsplit: https://www.linkedin.com/comm/jobs/view/2829788548?REALLYLONGSTUFFHEREAFTERWARDS
    return url.split("?")[0];
};
var ParseCompanyName = function (name) {
    // This function removes the location
    // Sample input: 'AveXis, Inc. · Durham, North Carolina, United States'
    // Sample output: 'AveXis, Inc.'
    return name.split(" · ")[0];
};
var isInternship = function (title) {
    // Issue: what if the title contains international, or something with intern like internal? oh well
    var lowerTitle = title.toLowerCase();
    return lowerTitle.includes("intern") || lowerTitle.includes("co-op");
};
//# sourceMappingURL=jobs.js.map