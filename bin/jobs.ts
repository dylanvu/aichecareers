import * as cron from 'cron';
import * as Discord from 'discord.js';
import * as mongo from 'mongodb';
import * as dotenv from 'dotenv';
import * as cheerio from 'cheerio';

import {Job} from '../classes/job';
import { title } from 'process';

dotenv.config();

const axios = require('axios').default; // Do this for typescript: https://github.com/axios/axios

export const DailyEmails = async (client: Discord.Client, mongoclient: mongo.MongoClient) => {
    // Every day, look through gmail to get the newest job alerts that haven't been read
    // Project is in the fake email
    // Refresh token: ibm.com/docs/en/app-connect/cloud?topic=gmail-connecting-google-application-by-providing-credentials-app-connect-use-basic-oauth

    // Define the daily email getting job at 11:59 PM

    GetAccessToken().then((accessToken: string) => {
        // Now that we have an access token, make call to the API to get the messages
        GetEmails(accessToken).then((emailList: string[]) => {
            console.log("Success", emailList)
        });
    });

    let dailyJob = new cron.CronJob('0 59 23 * * *', () => {
        console.log("Getting today's postings");
        try {
            // Generate new access token: https://stackoverflow.com/questions/10631042/how-to-generate-access-token-using-refresh-token-through-google-drive-api
            GetAccessToken().then((accessToken: string) => {
                // Now that we have an access token, make call to the API to get the messages
                GetEmails(accessToken).then((emailList: string[]) => {
                    emailList.forEach((emailId:string) => {
                        UploadEmail(accessToken, emailId, mongoclient);
                    })
                });
            });
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
    // Generate new access token: https://stackoverflow.com/questions/10631042/how-to-generate-access-token-using-refresh-token-through-google-drive-api
    let res = await axios.post("https://www.googleapis.com/oauth2/v4/token", {
        client_id: process.env.GMAIL_CLIENT_ID!,
        client_secret: process.env.GMAIL_CLIENT_SECRET,
        refresh_token: process.env.GMAIL_REFRESH_TOKEN,
        grant_type: "refresh_token"
    });
    return res.data.access_token;
}

const GetEmails = async (access: string): Promise<string[]> => {
    // in the .env, have the email portion before the @
    let labelId: string = "Label_4791209953381529751";
    // let res = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/${process.env.EMAIL!}%40gmail.com/messages?labelIds=${labelId}&key=${process.env.GMAIL_API_KEY!}`, {
    //     headers: {
    //         Authorization: `Bearer ${access}`
    //     }
    // });
    let res = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/${process.env.EMAIL!}%40gmail.com/messages?key=${process.env.GMAIL_API_KEY!}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    return res.data.messages
}

const UploadEmail = async (access: string, emailId: string, mongoclient: mongo.MongoClient) => {

    // Get the specific email
    let res = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/${process.env.EMAIL}%40gmail.com/messages/${emailId}?key=${process.env.GMAIL_API_KEY!}`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    });
    // Read request and decode out of base64 to html
    let html = atob(res.data.payload.parts[-1].body.data);

    const jobs: Job[] = GetJobArray(html);

    // Iterate through each job and add it to the correct mongodb collection
    jobs.forEach((job: Job) => {
        
    })

}

export const GetJobArray = (html: string): Job[] => {
    let jobList: Job[] = [];

    // Parse the html and format the posting
    const $ = cheerio.load(html, null, false);

    // See: https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/ for general guide
    // https://stackoverflow.com/questions/54463522/is-there-a-cheerio-selector-for-style for getting style selector
    const jobs = $('td[style="-webkit-text-size-adjust:100%;mso-table-rspace:0pt;mso-table-lspace:0pt;padding-bottom:4px;-ms-text-size-adjust:100%;"] > a') // Get the links and titles containing the post and the position name
    const companies = $('td[style="-webkit-text-size-adjust:100%;mso-table-rspace:0pt;mso-table-lspace:0pt;-ms-text-size-adjust:100%;"] > p') // Get companies
    // Parse the jobs and make job objects
    for (let i: number = 0; i < jobs.length; i++) {
        // Weird bug? where node does not have data, so: https://github.com/cheeriojs/cheerio/issues/1925
        let jobTitle: any = jobs[i].children[0] as any;
        let companyName: any = companies[i].children[0] as any;
        // jobList.push(new Job(ParseJobLink(jobs[i].attribs.href), jobTitle.data, ParseCompanyName(companyName.data))); // Create Job object with company name wihout location
        jobList.push(new Job(ParseJobLink(jobs[i].attribs.href), jobTitle.data, companyName.data, isInternship(jobTitle.data)));
    }

    console.log(jobList)
    
    return jobList;
}

const ParseJobLink = (url: string): string => {
    // Example split job link: https://www.linkedin.com/comm/jobs/view/2829788548'
    // Job links unsplit: https://www.linkedin.com/comm/jobs/view/2829788548?REALLYLONGSTUFFHEREAFTERWARDS
    return url.split("?")[0];
}

const ParseCompanyName = (name: string): string => {
    // This function removes the location
    // Sample input: 'AveXis, Inc. · Durham, North Carolina, United States'
    // Sample output: 'AveXis, Inc.'
    return name.split(" · ")[0];
}

const isInternship = (title: string): boolean => {
    // Issue: what if the title contains international, or something with intern like internal? oh well
    let lowerTitle: string = title.toLowerCase();
    return lowerTitle.includes("intern") || lowerTitle.includes("co-op");
}