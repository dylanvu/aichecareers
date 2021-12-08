//https://code.visualstudio.com/docs/typescript/typescript-compiling TS Compiling

import * as dotenv from 'dotenv';
import * as Discord from 'discord.js';
import * as mongo from 'mongodb';
import * as express from 'express';
// import {GetAccessToken} from './bin/jobs';

dotenv.config();

const APP = express();
const PORT: number = 3000;

APP.get('/', (req: any, res: any) => res.send('UCSB AIChE LinkedIn Bot!'));
APP.listen(PORT, () => console.log(`Discord QOTD app listening at http://localhost:${PORT}`));

const client = new Discord.Client({intents: [
    Discord.Intents.FLAGS.GUILD_MESSAGES
]}); // Client requires one parameter, which is intents.
// See: https://github.com/oceanroleplay/discord.ts-example/blob/main/src/client.ts
// https://discord.js.org/#/docs/main/stable/class/Intents?scrollTo=s-FLAGS
// https://discord.com/developers/docs/topics/gateway#list-of-intents

// MongoDB client
const mongoclient = new mongo.MongoClient(process.env.MONGO_DB_CONNECTION!); // Use the ! for non null assertion operator: https://stackoverflow.com/questions/54496398/typescript-type-string-undefined-is-not-assignable-to-type-string

// Connect to MongoDB, you only have to do this once at the beginning
const MongoConnect = async () => {
    try {
        await mongoclient.connect()
    } catch (e) {
        console.error(e);
    }
}

MongoConnect();

// GetAccessToken();


client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`); // Use ? to enable this to be undefined: https://stackoverflow.com/questions/37632760/what-is-the-question-mark-for-in-a-typescript-parameter-name
});

client.login(process.env.DISCORD_BOT_TOKEN);