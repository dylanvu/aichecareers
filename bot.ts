// https://code.visualstudio.com/docs/typescript/typescript-compiling TS Compiling

import * as dotenv from 'dotenv';
import * as Discord from 'discord.js';
import * as mongo from 'mongodb';
import * as express from 'express';
import { DailyEmails, DebugWeekly, WeeklyPostings, SendAllJobsToOne } from './bin/cron';
import { AddChanneltoDatabase, RemoveChannelFromDatabase, WipeCollection } from './bin/mongo';

dotenv.config();

const APP = express();
const PORT: number = 3000;

APP.get('/', (req: any, res: any) => res.send('UCSB AIChE LinkedIn Bot!'));
APP.listen(PORT, () => console.log(`Discord LinkedIn bot app listening at http://localhost:${PORT}`));

const client = new Discord.Client({intents: [
    Discord.Intents.FLAGS.GUILDS,
    // Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    // Discord.Intents.FLAGS.GUILD_VOICE_STATES,
  ],}); // Client requires one parameter, which is intents.

//.GUILDS INTENT IS NEEDED TO ACTUALLY RESPOND. WEIRD BUG

// See: https://github.com/oceanroleplay/discord.ts-example/blob/main/src/client.ts
// https://discord.js.org/#/docs/main/stable/class/Intents?scrollTo=s-FLAGS
// https://discord.com/developers/docs/topics/gateway#list-of-intents


client.options.http.api = "https://discord.com/api"; // Avoid 429 Status: https://support.glitch.com/t/discord-bot-not-connecting-or-429-status-code/28349

// MongoDB client
const mongoclient = new mongo.MongoClient(process.env.MONGO_DB_CONNECTION!); // Use the ! for non null assertion operator: https://stackoverflow.com/questions/54496398/typescript-type-string-undefined-is-not-assignable-to-type-string

// Connect to MongoDB, you only have to do this once at the beginning
const MongoConnect = async () => {
    try {
        await mongoclient.connect()
        // Start cron jobs, we should really do this after connecting to the database
        DailyEmails(client, mongoclient);
        WeeklyPostings(client, mongoclient);
    } catch (e) {
        console.error(e);
    }
}

MongoConnect();

const GetMessageIDs = (msg: Discord.Message) => {
    let textChannel = msg.channel as Discord.TextChannel
    let channelid = textChannel.id;
    let guildid = textChannel.guild.id;
    return [channelid, guildid]
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`); // Use ? to enable this to be undefined: https://stackoverflow.com/questions/37632760/what-is-the-question-mark-for-in-a-typescript-parameter-name
});

client.on("messageCreate", (msg: Discord.Message) => {
    // Add the bot to the database, internships only
    if (msg.content === "!internships") {
        let [channelid, guildid] = GetMessageIDs(msg);
        AddChanneltoDatabase(mongoclient, channelid, guildid, msg, "ActiveChannelsInternships");
    }

    // Entry level database subscription
    if (msg.content === "!entrylevel") {
        let [channelid, guildid] = GetMessageIDs(msg);
        AddChanneltoDatabase(mongoclient, channelid, guildid, msg, "ActiveChannelsEntryLevel");
    }

    if (msg.content === "!unsubscribe_internships") {
        let [channelid, guildid] = GetMessageIDs(msg);
        RemoveChannelFromDatabase(mongoclient, channelid, guildid, msg, "ActiveChannelsInternships");
    }

    if (msg.content === "!unsubscribe_entrylevel") {
        let [channelid, guildid] = GetMessageIDs(msg);
        RemoveChannelFromDatabase(mongoclient, channelid, guildid, msg, "ActiveChannelsEntryLevel");
    }

    if (msg.content === "!help") {
        msg.reply("To subscribe the Chemical Engineering Jobs bot to this channel, type in `!subscribe` \n \n To unsubscribe the bot, type in `!unsubscribe` \n \n To get all current job listings, type in `!money`, `!money_internships`, or `!money_entry` for all postings, internships only, or entry level only");
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
        // Send both jobs and internships
        let [channelid, _] = GetMessageIDs(msg);
        DebugWeekly(client, mongoclient, channelid);
    }

    if (msg.content === "!money_internships") {
        let [channelid, _] = GetMessageIDs(msg);
        SendAllJobsToOne(client, mongoclient, channelid, true);
    }

    if (msg.content === "!money_entry") {
        let [channelid, _] = GetMessageIDs(msg);
        SendAllJobsToOne(client, mongoclient, channelid, false);
    }

    // if (msg.content === "!purge") {
    //     WipeCollection(mongoclient, true);
    //     WipeCollection(mongoclient, false);
    // }
})


// 429 is a rate limit
client.on('debug', console.log);

client.login(process.env.DISCORD_BOT_TOKEN);