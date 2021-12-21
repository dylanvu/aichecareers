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
exports.ParseCompanyName = exports.GetJobArray = exports.GetAccessToken = exports.SendAllJobsToOne = exports.DebugWeekly = exports.WeeklyPostings = exports.DebugDailyEmails = exports.DailyEmails = void 0;
var cron = require("cron");
var dotenv = require("dotenv");
var cheerio = require("cheerio");
var base64 = require("js-base64");
var createLog_1 = require("./createLog");
var job_1 = require("../classes/job");
var mongo_1 = require("./mongo");
dotenv.config();
var axios = require('axios').default; // Do this for typescript: https://github.com/axios/axios
var DailyEmails = function (client, mongoclient) { return __awaiter(void 0, void 0, void 0, function () {
    var dailyJob;
    return __generator(this, function (_a) {
        dailyJob = new cron.CronJob('0 59 23 * * *', function () {
            console.log("Getting today's postings");
            try {
                // Generate new access token: https://stackoverflow.com/questions/10631042/how-to-generate-access-token-using-refresh-token-through-google-drive-api
                (0, exports.GetAccessToken)().then(function (accessToken) {
                    // Now that we have an access token, make call to the API to get the messages
                    GetEmails(accessToken).then(function (emailList) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, emailList.forEach(function (emailId) {
                                        UploadEmail(accessToken, emailId, mongoclient);
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
            }
            catch (error) {
                console.error(error);
                var debugChannel = client.channels.cache.get(process.env.DEBUG_CHANNEL_ID);
                debugChannel.send("Error in AIChE Careers Daily!");
                debugChannel.send(error);
                (0, createLog_1.CreateErrorLog)(error);
            }
        }, null, true, 'America/Los_Angeles');
        console.log("Daily Email Job");
        dailyJob.start();
        return [2 /*return*/];
    });
}); };
exports.DailyEmails = DailyEmails;
var DebugDailyEmails = function (client, mongoclient) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Every day, look through gmail to get the newest job alerts that haven't been read
        // Project is in the fake email
        // Refresh token: ibm.com/docs/en/app-connect/cloud?topic=gmail-connecting-google-application-by-providing-credentials-app-connect-use-basic-oauth
        // Define the daily email getting job at 11:59 PM
        console.log("Getting today's postings");
        try {
            // Generate new access token: https://stackoverflow.com/questions/10631042/how-to-generate-access-token-using-refresh-token-through-google-drive-api
            (0, exports.GetAccessToken)().then(function (accessToken) {
                // Now that we have an access token, make call to the API to get the messages
                GetEmails(accessToken).then(function (emailList) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, emailList.forEach(function (emailId) {
                                    UploadEmail(accessToken, emailId, mongoclient);
                                })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        }
        catch (error) {
            console.error(error);
            (0, createLog_1.CreateErrorLog)(error);
        }
        return [2 /*return*/];
    });
}); };
exports.DebugDailyEmails = DebugDailyEmails;
// Possible TODO: repeat on Wednesday and Saturdays? https://stackoverflow.com/questions/31260837/how-to-run-a-cron-job-on-every-monday-wednesday-and-friday
var WeeklyPostings = function (client, mongoclient) { return __awaiter(void 0, void 0, void 0, function () {
    var weeklyJob;
    return __generator(this, function (_a) {
        weeklyJob = new cron.CronJob('0 0 9 * * 6', function () {
            // Literally the most horrific promise code I've written, since I can't put awaits when it's not top level in typescript which sucks
            (0, mongo_1.EmbedGetAllJobs)(mongoclient, true).then(function (embeds) { return __awaiter(void 0, void 0, void 0, function () {
                var _i, embeds_1, embed;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _i = 0, embeds_1 = embeds;
                            _a.label = 1;
                        case 1:
                            if (!(_i < embeds_1.length)) return [3 /*break*/, 4];
                            embed = embeds_1[_i];
                            return [4 /*yield*/, SendtoAll(client, mongoclient, "ActiveChannelsInternships", embed)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            }); }).then(function () {
                // Then find all the entry level jobs
                (0, mongo_1.EmbedGetAllJobs)(mongoclient, false).then(function (embeds) { return __awaiter(void 0, void 0, void 0, function () {
                    var _i, embeds_2, embed;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _i = 0, embeds_2 = embeds;
                                _a.label = 1;
                            case 1:
                                if (!(_i < embeds_2.length)) return [3 /*break*/, 4];
                                embed = embeds_2[_i];
                                return [4 /*yield*/, SendtoAll(client, mongoclient, "ActiveChannelsEntryLevel", embed)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }).then(function () {
                    // Clear database for new jobs
                    (0, mongo_1.WipeCollection)(mongoclient, true);
                    (0, mongo_1.WipeCollection)(mongoclient, false);
                });
            });
        }, null, true, 'America/Los_Angeles');
        console.log("Weekly posting started");
        weeklyJob.start();
        return [2 /*return*/];
    });
}); };
exports.WeeklyPostings = WeeklyPostings;
var DebugWeekly = function (client, mongoclient, channel_id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Parse MongoDB collections, create the giant posting message, and send
        // 2000 character message limit!
        // Send job postings every Saturday at 10 AM PST
        // Literally the most horrific promise code I've written, since I can't put awaits when it's not top level in typescript which sucks
        (0, mongo_1.EmbedGetAllJobs)(mongoclient, true).then(function (embeds) { return __awaiter(void 0, void 0, void 0, function () {
            var _i, embeds_3, embed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, embeds_3 = embeds;
                        _a.label = 1;
                    case 1:
                        if (!(_i < embeds_3.length)) return [3 /*break*/, 4];
                        embed = embeds_3[_i];
                        return [4 /*yield*/, SendToOne(client, channel_id, embed)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); }).then(function () {
            // Then find all the entry level jobs
            (0, mongo_1.EmbedGetAllJobs)(mongoclient, false).then(function (embeds) { return __awaiter(void 0, void 0, void 0, function () {
                var _i, embeds_4, embed;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _i = 0, embeds_4 = embeds;
                            _a.label = 1;
                        case 1:
                            if (!(_i < embeds_4.length)) return [3 /*break*/, 4];
                            embed = embeds_4[_i];
                            return [4 /*yield*/, SendToOne(client, channel_id, embed)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            }); }).then(function () {
                // Clear database for new jobs
                // WipeCollection(mongoclient, true);
                // WipeCollection(mongoclient, false);
            });
        });
        return [2 /*return*/];
    });
}); };
exports.DebugWeekly = DebugWeekly;
var SendAllJobsToOne = function (client, mongoclient, channel_id, internships) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Parse MongoDB collections, create the giant posting message, and send
        // 2000 character message limit!
        // Send job postings every Saturday at 10 AM PST
        (0, mongo_1.EmbedGetAllJobs)(mongoclient, internships).then(function (embeds) { return __awaiter(void 0, void 0, void 0, function () {
            var _i, embeds_5, embed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, embeds_5 = embeds;
                        _a.label = 1;
                    case 1:
                        if (!(_i < embeds_5.length)) return [3 /*break*/, 4];
                        embed = embeds_5[_i];
                        return [4 /*yield*/, SendToOne(client, channel_id, embed)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.SendAllJobsToOne = SendAllJobsToOne;
var SendtoAll = function (client, mongoclient, collectionName, embed) { return __awaiter(void 0, void 0, void 0, function () {
    var channelCollection, allCursor, channelDeletion;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mongoclient.db().collection(collectionName)];
            case 1:
                channelCollection = _a.sent();
                allCursor = channelCollection.find();
                channelDeletion = [];
                return [4 /*yield*/, allCursor.forEach(function (thisChannel) {
                        // There was a bug where a channel did not exist for some reason except it was in the database, and I couldn't find it at all
                        // If DiscordJS can find the channel, send the question. Else, DiscordJS can't find a channel and delete it from the database
                        if (client.channels.cache.get(thisChannel.channel_id)) {
                            var channel_1 = client.channels.cache.get(thisChannel.channel_id); // Cast to text channel: https://github.com/discordjs/discord.js/issues/3622
                            channel_1.send({ embeds: [embed] });
                        }
                        else {
                            console.log(thisChannel.channel_id + " does not exist. Deleting from database.");
                            channelDeletion.push(thisChannel.channel_id);
                        }
                    })
                    // Delete all undefined channels
                ];
            case 2:
                _a.sent();
                // Delete all undefined channels
                if (channelDeletion.length != 0) {
                    channelDeletion.forEach(function (channelid) {
                        channelCollection.deleteOne({
                            channel_id: channelid
                        });
                    });
                }
                return [2 /*return*/];
        }
    });
}); };
var SendToOne = function (client, channel_id, embed) { return __awaiter(void 0, void 0, void 0, function () {
    var channel;
    return __generator(this, function (_a) {
        channel = client.channels.cache.get(channel_id);
        channel.send({ embeds: [embed] });
        return [2 /*return*/];
    });
}); };
// <----------------- Gmail API and related -------------------->
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
    var emailIdlist, labelId, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                emailIdlist = [];
                labelId = "Label_4791209953381529751";
                return [4 /*yield*/, axios.get("https://gmail.googleapis.com/gmail/v1/users/".concat(process.env.EMAIL, "%40gmail.com/messages?labelIds=").concat(labelId, "&key=").concat(process.env.GMAIL_API_KEY), {
                        headers: {
                            Authorization: "Bearer ".concat(access)
                        }
                    })];
            case 1:
                res = _a.sent();
                // Version without label ID
                // let res = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/${process.env.EMAIL!}%40gmail.com/messages?key=${process.env.GMAIL_API_KEY!}`, {
                //     headers: {
                //         Authorization: `Bearer ${access}`
                //     }
                // });
                return [4 /*yield*/, res.data.messages.forEach(function (emailObject) {
                        emailIdlist.push(emailObject.id);
                    })];
            case 2:
                // Version without label ID
                // let res = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/${process.env.EMAIL!}%40gmail.com/messages?key=${process.env.GMAIL_API_KEY!}`, {
                //     headers: {
                //         Authorization: `Bearer ${access}`
                //     }
                // });
                _a.sent();
                return [2 /*return*/, emailIdlist];
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
                html = base64.decode(res.data.payload.parts.at(-1).body.data.replace(/-/g, '+').replace(/_/g, '/'));
                jobs = (0, exports.GetJobArray)(html);
                // Iterate through each job and add it to the correct mongodb collection
                return [4 /*yield*/, jobs.forEach(function (job) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, mongo_1.UploadJob)(mongoclient, job)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                    // Now delete the email
                    // Axios has headers as the third argument: https://stackoverflow.com/questions/44617825/passing-headers-with-axios-post-request
                ];
            case 2:
                // Iterate through each job and add it to the correct mongodb collection
                _a.sent();
                // Now delete the email
                // Axios has headers as the third argument: https://stackoverflow.com/questions/44617825/passing-headers-with-axios-post-request
                return [4 /*yield*/, axios.post("https://gmail.googleapis.com/gmail/v1/users/".concat(process.env.EMAIL, "%40gmail.com/messages/").concat(emailId, "/trash?key=").concat(process.env.GMAIL_API_KEY), {}, {
                        headers: {
                            Authorization: "Bearer ".concat(access)
                        }
                    })];
            case 3:
                // Now delete the email
                // Axios has headers as the third argument: https://stackoverflow.com/questions/44617825/passing-headers-with-axios-post-request
                _a.sent();
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
        if (!isInvalidEntry(jobTitle.data)) {
            jobList.push(new job_1.Job(jobTitle.data, ParseJobLink(jobs[i].attribs.href), companyName.data, isInternship(jobTitle.data)));
        }
    }
    return jobList;
};
exports.GetJobArray = GetJobArray;
// <---------------- Utility Functions -------------->
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
exports.ParseCompanyName = ParseCompanyName;
var isInternship = function (title) {
    // Issue: what if the title contains international, or something with intern like internal? oh well
    var lowerTitle = title.toLowerCase();
    return lowerTitle.includes("intern") || lowerTitle.includes("co-op") || lowerTitle.includes("coop") || lowerTitle.includes("student");
};
var isInvalidEntry = function (title) {
    // Check to see if there are some "fake" entry level jobs
    return title.includes("II") || title.toLowerCase().includes("senior") || title.toLowerCase().includes("experienced") || title.toLowerCase().includes("principal");
};
//# sourceMappingURL=cron.js.map