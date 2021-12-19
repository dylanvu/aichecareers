"use strict";
// https://code.visualstudio.com/docs/typescript/typescript-compiling TS Compiling
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
var dotenv = require("dotenv");
var Discord = require("discord.js");
var mongo = require("mongodb");
var express = require("express");
var cron_1 = require("./bin/cron");
var mongo_1 = require("./bin/mongo");
dotenv.config();
var APP = express();
var PORT = 3000;
APP.get('/', function (req, res) { return res.send('UCSB AIChE LinkedIn Bot!'); });
APP.listen(PORT, function () { return console.log("Discord LinkedIn bot app listening at http://localhost:".concat(PORT)); });
var client = new Discord.Client({ intents: [
        Discord.Intents.FLAGS.GUILDS,
        // Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
        // Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    ], }); // Client requires one parameter, which is intents.
//.GUILDS INTENT IS NEEDED TO ACTUALLY RESPOND. WEIRD BUG
// See: https://github.com/oceanroleplay/discord.ts-example/blob/main/src/client.ts
// https://discord.js.org/#/docs/main/stable/class/Intents?scrollTo=s-FLAGS
// https://discord.com/developers/docs/topics/gateway#list-of-intents
// MongoDB client
var mongoclient = new mongo.MongoClient(process.env.MONGO_DB_CONNECTION); // Use the ! for non null assertion operator: https://stackoverflow.com/questions/54496398/typescript-type-string-undefined-is-not-assignable-to-type-string
// Connect to MongoDB, you only have to do this once at the beginning
var MongoConnect = function () { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, mongoclient.connect()
                    // Start cron jobs, we should really do this after connecting to the database
                ];
            case 1:
                _a.sent();
                // Start cron jobs, we should really do this after connecting to the database
                (0, cron_1.DailyEmails)(client, mongoclient);
                (0, cron_1.WeeklyPostings)(client, mongoclient);
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.error(e_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
MongoConnect();
var GetMessageIDs = function (msg) {
    var textChannel = msg.channel;
    var channelid = textChannel.id;
    var guildid = textChannel.guild.id;
    return [channelid, guildid];
};
client.on("ready", function () {
    var _a;
    console.log("Logged in as ".concat((_a = client.user) === null || _a === void 0 ? void 0 : _a.tag, "!")); // Use ? to enable this to be undefined: https://stackoverflow.com/questions/37632760/what-is-the-question-mark-for-in-a-typescript-parameter-name
});
client.on("messageCreate", function (msg) {
    // Add the bot to the database, internships only
    if (msg.content === "!internships") {
        var _a = GetMessageIDs(msg), channelid = _a[0], guildid = _a[1];
        (0, mongo_1.AddChanneltoDatabase)(mongoclient, channelid, guildid, msg, "ActiveChannelsInternships");
    }
    // Entry level database subscription
    if (msg.content === "!entrylevel") {
        var _b = GetMessageIDs(msg), channelid = _b[0], guildid = _b[1];
        (0, mongo_1.AddChanneltoDatabase)(mongoclient, channelid, guildid, msg, "ActiveChannelsEntryLevel");
    }
    if (msg.content === "!unsubscribe_internships") {
        var _c = GetMessageIDs(msg), channelid = _c[0], guildid = _c[1];
        (0, mongo_1.RemoveChannelFromDatabase)(mongoclient, channelid, guildid, msg, "ActiveChannelsInternships");
    }
    if (msg.content === "!unsubscribe_entrylevel") {
        var _d = GetMessageIDs(msg), channelid = _d[0], guildid = _d[1];
        (0, mongo_1.RemoveChannelFromDatabase)(mongoclient, channelid, guildid, msg, "ActiveChannelsEntryLevel");
    }
    if (msg.content === "!help") {
        msg.reply("To add the Chemical Engineering Jobs bot to the channel, type in `!subscribe` \n \n To remove the bot, type in `!unsubscribe`");
    }
    if (msg.content === "!github") {
        msg.reply("<https://github.com/vu-dylan/aichecareers>");
    }
    // if (msg.content === "!nothing") {
    //     DebugWeekly(client, mongoclient);
    // }
    // if (msg.content === "!debug") {
    //     console.log("Debug")
    //     DebugDailyEmails(client, mongoclient);
    // }
    if (msg.content === "!money") {
        var _e = GetMessageIDs(msg), channelid = _e[0], guildid = _e[1];
        (0, cron_1.DebugWeekly)(client, mongoclient, channelid);
    }
    // if (msg.content === "!purge") {
    //     WipeCollection(mongoclient, true);
    //     WipeCollection(mongoclient, false);
    // }
});
client.login(process.env.DISCORD_BOT_TOKEN);
//# sourceMappingURL=bot.js.map