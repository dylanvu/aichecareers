import * as cron from 'cron';
import * as Discord from 'discord.js';
import * as mongo from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const axios = require('axios').default; // Do this for typescript: https://github.com/axios/axios

export const DailyEmails = async (client: Discord.Client) => {
    // Every day, look through gmail to get the newest job alerts that haven't been read
    // Project is in the fake email
    // Refresh token: ibm.com/docs/en/app-connect/cloud?topic=gmail-connecting-google-application-by-providing-credentials-app-connect-use-basic-oauth

    // Define the daily email getting job at 11:59 PM
    let dailyJob = new cron.CronJob('0 59 23 * * *', () => {
        console.log("Getting today's postings");
        try {
            // Generate new access token: https://stackoverflow.com/questions/10631042/how-to-generate-access-token-using-refresh-token-through-google-drive-api
            axios.post("https://www.googleapis.com/oauth2/v4/token", {
                client_id: process.env.GMAIL_CLIENT_ID!,
                client_secret: process.env.GMAIL_CLIENT_SECRET,
                refresh_token: process.env.GMAIL_REFRESH_TOKEN,
                grant_type: "refresh_token"
            }).then((res: any) => {
                console.log(res);
            })
        } catch (error) {
            console.error(error);
            // client.channels.cache.get(process.env.DEBUG_CHANNEL_ID).send("Error in QOTD!");
            // client.channels.cache.get(process.env.DEBUG_CHANNEL_ID).send(error);
        }
    }, null, true, 'America/Los_Angeles');

    dailyJob.start();
}

export const WeeklyPostings = async (client: Discord.Client) => {
    // Parse MongoDB collections, create the giant posting message, and send
    // 2000 character message limit!
}

export const GetAccessToken = async (): Promise<string> => {
    try {
        // Generate new access token: https://stackoverflow.com/questions/10631042/how-to-generate-access-token-using-refresh-token-through-google-drive-api
        let res = await axios.post("https://www.googleapis.com/oauth2/v4/token", {
            client_id: process.env.GMAIL_CLIENT_ID!,
            client_secret: process.env.GMAIL_CLIENT_SECRET,
            refresh_token: process.env.GMAIL_REFRESH_TOKEN,
            grant_type: "refresh_token"
        });
        console.log(res);
        return "Success";
    } catch (error) {
        console.error(error);
        // client.channels.cache.get(process.env.DEBUG_CHANNEL_ID).send("Error in QOTD!");
        // client.channels.cache.get(process.env.DEBUG_CHANNEL_ID).send(error);
        return "Failure";
    }
}