//https://code.visualstudio.com/docs/typescript/typescript-compiling TS Compiling

import * as dotenv from 'dotenv';
import * as Discord from 'discord.js';
import * as cron from 'cron';
import * as mongo from 'mongodb';
import * as express from 'express';

dotenv.config();

const APP = express();
const PORT: number = 3000;

APP.get('/', (req: any, res: any) => res.send('UCSB AIChE LinkedIn Bot!'));
APP.listen(PORT, () => console.log(`Discord QOTD app listening at http://localhost:${PORT}`));

const client = new Discord.Client({intents: [
    Discord.Intents.FLAGS.GUILD_MESSAGES
]}); // Client requires one parameter, which is intents. See: https://github.com/oceanroleplay/discord.ts-example/blob/main/src/client.ts

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`); // Use ? to enable this to be undefined: https://stackoverflow.com/questions/37632760/what-is-the-question-mark-for-in-a-typescript-parameter-name
});

client.login(process.env.DISCORD_BOT_TOKEN);