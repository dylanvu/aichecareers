// https://code.visualstudio.com/docs/typescript/typescript-compiling TS Compiling

import * as dotenv from 'dotenv';
import * as Discord from 'discord.js';
import * as mongo from 'mongodb';
import * as express from 'express';
import { DailyEmails, WeeklyPostings, DebugDaily } from './bin/cron';
import { AddChanneltoDatabase, RemoveChannelFromDatabase, WipeCollection } from './bin/mongo';

import * as base64 from 'js-base64';

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

client.on("message", (msg: Discord.Message) => {
    // Add the bot to the database
    if (msg.content === "!subscribe") {
        let [channelid, guildid] = GetMessageIDs(msg);
        AddChanneltoDatabase(mongoclient, channelid, guildid, msg, "ActiveChannels");
    }

    if (msg.content === "!unsubscribe") {
        let [channelid, guildid] = GetMessageIDs(msg);
        RemoveChannelFromDatabase(mongoclient, channelid, guildid, msg, "ActiveChannels");
    }

    if (msg.content === "!help") {
        msg.reply("To add the Chemical Engineering Jobs bot to the channel, type in `!subscribe` \n \n To remove the bot, type in `!unsubscribe`");
    }

    if (msg.content === "!github") {
        msg.reply("<https://github.com/vu-dylan/aichecareers>");
    }

    // if (msg.content === "!debug") {
    //     console.log("Debug");
    //     DebugDaily(client, mongoclient);
    // }

    // if (msg.content === "!money") {
    //     WeeklyPostings(client, mongoclient);
    // }

    // if (msg.content === "!purge") {
    //     WipeCollection(mongoclient, true);
    //     WipeCollection(mongoclient, false);
    // }
})

client.login(process.env.DISCORD_BOT_TOKEN);