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
exports.WipeCollection = exports.EmbedGetAllJobs = exports.GetAllJobs = exports.UploadJob = exports.RemoveChannelFromDatabase = exports.AddChanneltoDatabase = void 0;
var Discord = require("discord.js");
var moment = require("moment");
var cron_1 = require("./cron");
var AddChanneltoDatabase = function (mongoclient, channelid, guildid, msg, collectionName) { return __awaiter(void 0, void 0, void 0, function () {
    var channelCollection, someCursor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mongoclient.db().collection(collectionName)];
            case 1:
                channelCollection = _a.sent();
                return [4 /*yield*/, channelCollection.findOne({
                        channel_id: channelid,
                        guild_id: guildid,
                    })];
            case 2:
                someCursor = _a.sent();
                if (!someCursor) {
                    console.log("Adding new channel with id: " + channelid);
                    if (collectionName == "ActiveChannels") {
                        msg.reply("You've subscribed to Chemical Engineering jobs! Jobs will be posted on Saturday at 9:00 AM PST!");
                    }
                    else {
                        console.log("No collection name of <" + collectionName + "> matched but new channel added");
                    }
                    channelCollection.insertOne({
                        channel_id: channelid,
                        guild_id: guildid,
                    });
                }
                else {
                    console.log(channelid + " already exists in database");
                    if (collectionName == "ActiveChannels") {
                        msg.reply("Chemical Engineering jobs has already been added. Please wait until Friday at 8:00 PM PST.");
                    }
                    else {
                        console.log("No collection name of <" + collectionName + "> matches and current channel is already added");
                    }
                }
                return [2 /*return*/];
        }
    });
}); };
exports.AddChanneltoDatabase = AddChanneltoDatabase;
var RemoveChannelFromDatabase = function (mongoclient, channelid, guildid, msg, collectionName) { return __awaiter(void 0, void 0, void 0, function () {
    var channelCollection, someCursor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mongoclient.db().collection(collectionName)];
            case 1:
                channelCollection = _a.sent();
                return [4 /*yield*/, channelCollection.findOne({
                        channel_id: channelid,
                        guild_id: guildid
                    })];
            case 2:
                someCursor = _a.sent();
                if (someCursor) {
                    console.log("Deleting channel " + channelid);
                    if (collectionName == "ActiveChannels") {
                        msg.reply("Chemical Engineering jobs has been removed. Good luck in your job searches!");
                    }
                    else {
                        console.log("Attempting to delete channel from <" + collectionName + "> but cannot find match to collection");
                    }
                    channelCollection.deleteOne({
                        channel_id: channelid,
                        guild_id: guildid
                    });
                }
                else {
                    console.log("Cannot delete channel that doesn't exist");
                    if (collectionName == "ActiveChannels") {
                        msg.reply("It appears you haven't added Chemical Engineering jobs to this channel yet. Give your career a shot before you remove me!");
                    }
                    else {
                        console.log("Attempting to delete channel from <" + collectionName + "> when it doesn't exist in database, but cannot find match to collection");
                    }
                }
                return [2 /*return*/];
        }
    });
}); };
exports.RemoveChannelFromDatabase = RemoveChannelFromDatabase;
var UploadJob = function (mongoclient, job) { return __awaiter(void 0, void 0, void 0, function () {
    var collection, unique, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                collection = void 0;
                if (job.internship) {
                    collection = mongoclient.db().collection('Internships');
                }
                else {
                    collection = mongoclient.db().collection('EntryLevel');
                }
                return [4 /*yield*/, CheckUnique(collection, job)];
            case 1:
                unique = _a.sent();
                // Only add job to databse if it's unique
                if (unique) {
                    collection.insertOne({
                        title: job.title,
                        link: job.link,
                        company: job.company
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.UploadJob = UploadJob;
var GetAllJobs = function (mongoclient, isInternship) { return __awaiter(void 0, void 0, void 0, function () {
    var collection, messageList, message, allJobs, divider, hyphens, breaks, i, i, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (isInternship) {
                    collection = mongoclient.db().collection('Internships');
                }
                else {
                    collection = mongoclient.db().collection('EntryLevel');
                }
                messageList = [];
                if (isInternship) {
                    message = ":rotating_light: :rotating_light:     **Internship/Co-Op Postings for the Week: ".concat(moment().format("MMM Do YY"), "**     :rotating_light: :rotating_light:\n\n");
                }
                else {
                    message = ":exclamation: :exclamation:     **Entry Level Job Postings for the Week: ".concat(moment().format("MMM Do YY"), "**     :exclamation: :exclamation:\n\n");
                }
                return [4 /*yield*/, collection.find({})];
            case 1:
                allJobs = _a.sent();
                return [4 /*yield*/, allJobs.count()];
            case 2:
                if (!((_a.sent()) === 0)) return [3 /*break*/, 3];
                // No jobs
                message = message + "No jobs this week... check back next week!\n\n";
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, allJobs.forEach(function (job) {
                    // Format into a message
                    var newMessage = job.title + ' at ' + job.company + '\n' + '<' + job.link + '>' + '\n\n';
                    // Discord has a 2000 character limit
                    if (message.length + newMessage.length < 2000) {
                        message = message + newMessage;
                    }
                    else {
                        messageList.push(message);
                        message = newMessage;
                    }
                })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                // Push remaining message to array
                messageList.push(message);
                divider = "";
                hyphens = 5;
                breaks = 10;
                for (i = 0; i < hyphens; i++) {
                    divider = divider + "-";
                }
                for (i = 0; i < breaks; i++) {
                    divider = divider + "\n";
                }
                for (i = 0; i < hyphens; i++) {
                    divider = divider + "-";
                }
                messageList.push(divider);
                return [2 /*return*/, messageList];
        }
    });
}); };
exports.GetAllJobs = GetAllJobs;
var EmbedGetAllJobs = function (mongoclient, isInternship) { return __awaiter(void 0, void 0, void 0, function () {
    var collection, embedList, jobList, embed, allJobs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (isInternship) {
                    collection = mongoclient.db().collection('Internships');
                }
                else {
                    collection = mongoclient.db().collection('EntryLevel');
                }
                embedList = [];
                jobList = [];
                embed = new Discord.MessageEmbed()
                    .setColor('#0072b1');
                if (isInternship) {
                    embed.setTitle(":rotating_light: :rotating_light:     **Internship/Co-Op Postings for the Week: ".concat(moment().format("MMM Do YY"), "**     :rotating_light: :rotating_light:\n\n"));
                }
                else {
                    embed.setTitle(":exclamation: :exclamation:     **Entry Level Job Postings for the Week: ".concat(moment().format("MMM Do YY"), "**     :exclamation: :exclamation:\n\n"));
                }
                return [4 /*yield*/, collection.find({})];
            case 1:
                allJobs = _a.sent();
                return [4 /*yield*/, allJobs.count()];
            case 2:
                if (!((_a.sent()) === 0)) return [3 /*break*/, 3];
                // No jobs
                embed.setDescription("No jobs found this week... check back next week!");
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, allJobs.forEach(function (job) {
                    var jobHeader = job.title + ' at ' + job.company;
                    // Discord has a 256 field name length: https://discord.com/developers/docs/resources/channel#embed-limits
                    var headerOption = 0;
                    while (jobHeader.length > 256) {
                        if (headerOption === 0) {
                            // First, try removing the location
                            jobHeader = job.title + ' at ' + (0, cron_1.ParseCompanyName)(job.company);
                        }
                        else if (headerOption === 1) {
                            // Then, just try sending the title
                            jobHeader = job.title;
                        }
                        else {
                            // Send generic title
                            jobHeader = "Job title is too long! Open the link!";
                        }
                        headerOption++;
                    }
                    // Embeds have a 25 field limit
                    if (jobList.length <= 25) {
                        // Push as an object
                        jobList.push({ name: jobHeader, value: '<' + job.link + '>' });
                    }
                    else {
                        // Format the embed fields and push embed to embed array, reset embed and jobList
                        jobList.forEach(function (job) {
                            embed.addField(job.name, job.value);
                        });
                        embedList.push(embed);
                        embed = new Discord.MessageEmbed()
                            .setColor('#0072b1');
                        if (isInternship) {
                            embed.setTitle(":rotating_light: :rotating_light:     **Internship/Co-Op Postings Part ".concat(embedList.length + 1, " for the Week: ").concat(moment().format("MMM Do YY"), "**     :rotating_light: :rotating_light:\n\n"));
                        }
                        else {
                            embed.setTitle(":exclamation: :exclamation:     **Entry Level Job Postings Part ".concat(embedList.length + 1, " for the Week: ").concat(moment().format("MMM Do YY"), "**     :exclamation: :exclamation:\n\n"));
                        }
                        jobList = [];
                    }
                })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                // Push remaining jobs to embed
                jobList.forEach(function (job) {
                    embed.addField(job.name, job.value);
                });
                embedList.push(embed);
                // // Make divider between posting blocks
                // let divider: string = "";
                // let hyphens: number = 5;
                // let breaks: number = 10;
                // for (let i: number = 0; i < hyphens; i++) {
                //     divider = divider + "-";
                // }
                // for (let i: number = 0; i < breaks; i++) {
                //     divider = divider + "\n";
                // }
                // for (let i: number = 0; i < hyphens; i++) {
                //     divider = divider + "-";
                // }
                // messageList.push(divider);
                return [2 /*return*/, embedList];
        }
    });
}); };
exports.EmbedGetAllJobs = EmbedGetAllJobs;
var WipeCollection = function (mongoclient, isInternship) { return __awaiter(void 0, void 0, void 0, function () {
    var collection;
    return __generator(this, function (_a) {
        if (isInternship) {
            collection = mongoclient.db().collection('Internships');
        }
        else {
            collection = mongoclient.db().collection('EntryLevel');
        }
        collection.deleteMany({});
        return [2 /*return*/];
    });
}); };
exports.WipeCollection = WipeCollection;
var CheckUnique = function (collection, job) { return __awaiter(void 0, void 0, void 0, function () {
    var duplicate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, collection.findOne({
                    title: job.title,
                    link: job.link,
                    company: job.company
                })];
            case 1:
                duplicate = _a.sent();
                if (duplicate) {
                    console.log("Duplicate");
                    return [2 /*return*/, false];
                }
                else {
                    return [2 /*return*/, true];
                }
                return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=mongo.js.map