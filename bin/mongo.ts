import * as mongo from 'mongodb';
import * as Discord from 'discord.js'
import * as moment from 'moment';
import { Job } from '../classes/job';
import { ParseCompanyName } from './cron';

export const AddChanneltoDatabase = async (mongoclient: mongo.MongoClient, channelid: string, guildid: string, msg: Discord.Message, collectionName: string) => {
    let channelCollection = await mongoclient.db().collection(collectionName);

    // Check if the channel exists in the database
    let someCursor = await channelCollection.findOne(
        {
            channel_id : channelid,
            guild_id : guildid,
        }
    )
    if (!someCursor) {
        console.log("Adding new channel with id: " + channelid);
        if (collectionName == "ActiveChannels") {
            msg.reply("You've subscribed to Chemical Engineering jobs! Jobs will be posted on Saturday at 9:00 AM PST!");
        } else {
            console.log("No collection name of <" + collectionName + "> matched but new channel added");
        }

        channelCollection.insertOne({
            channel_id : channelid,
            guild_id : guildid,
        })
    } else {
        console.log(channelid + " already exists in database");
        if (collectionName == "ActiveChannels") {
            msg.reply("Chemical Engineering jobs has already been added. Please wait until Friday at 8:00 PM PST.");
        } else {
            console.log("No collection name of <" + collectionName + "> matches and current channel is already added");
        }
    }
}

export const RemoveChannelFromDatabase = async (mongoclient: mongo.MongoClient, channelid: string, guildid: string, msg: Discord.Message, collectionName: string) => {
    let channelCollection = await mongoclient.db().collection(collectionName);

    // Check if the channel exists in the database
    let someCursor = await channelCollection.findOne(
        {
            channel_id : channelid,
            guild_id : guildid
        }
    )
    if (someCursor) {
        console.log("Deleting channel " + channelid);
        if (collectionName == "ActiveChannels") {
            msg.reply("Chemical Engineering jobs has been removed. Good luck in your job searches!");
        } else {
            console.log("Attempting to delete channel from <" + collectionName + "> but cannot find match to collection")
        }
        
        channelCollection.deleteOne({
            channel_id : channelid,
            guild_id : guildid
        })
    } else {
        console.log("Cannot delete channel that doesn't exist");
        if (collectionName == "ActiveChannels") {
            msg.reply("It appears you haven't added Chemical Engineering jobs to this channel yet. Give your career a shot before you remove me!");
        } else {
            console.log("Attempting to delete channel from <" + collectionName + "> when it doesn't exist in database, but cannot find match to collection")
        }
        
    }
}

export const UploadJob = async (mongoclient: mongo.MongoClient, job: Job) => {
    try {
        let collection;
        if (job.internship) {
            collection = mongoclient.db().collection('Internships');
        } else {
            collection = mongoclient.db().collection('EntryLevel');
        }

        // Check if the job already exists
        let unique = await CheckUnique(collection, job);

        // Only add job to databse if it's unique
        if (unique) {
            collection.insertOne({
                title: job.title,
                link: job.link,
                company: job.company
            });
        }

    } catch (error) {
        console.error(error);
    }
};

export const GetAllJobs = async (mongoclient: mongo.MongoClient, isInternship: boolean): Promise<string[]> => {
    let collection;
    if (isInternship) {
        collection = mongoclient.db().collection('Internships');
    } else {
        collection = mongoclient.db().collection('EntryLevel');
    }

    let messageList: string[] = []
    let message: string;
    if (isInternship) {
        message = `:rotating_light: :rotating_light:     **Internship/Co-Op Postings for the Week: ${moment().format("MMM Do YY")}**     :rotating_light: :rotating_light:\n\n`;
    } else {
        message = `:exclamation: :exclamation:     **Entry Level Job Postings for the Week: ${moment().format("MMM Do YY")}**     :exclamation: :exclamation:\n\n`;
    }
    let allJobs = await collection.find({});
    if (await allJobs.count() === 0) {
        // No jobs
        message = message + "No jobs this week... check back next week!\n\n";
    } else {
        await allJobs.forEach((job: any) => {
            // Format into a message
            let newMessage: string = job.title + ' at ' + job.company + '\n' + '<' + job.link + '>' + '\n\n';
    
            // Discord has a 2000 character limit
            if (message.length + newMessage.length < 2000) {
                message = message + newMessage
            } else {
                messageList.push(message);
                message = newMessage;
            }
        })
    }
    // Push remaining message to array
    messageList.push(message);
    // Make divider between posting blocks
    let divider: string = "";
    let hyphens: number = 5;
    let breaks: number = 10;
    for (let i: number = 0; i < hyphens; i++) {
        divider = divider + "-";
    }
    for (let i: number = 0; i < breaks; i++) {
        divider = divider + "\n";
    }
    for (let i: number = 0; i < hyphens; i++) {
        divider = divider + "-";
    }
    messageList.push(divider);

    return messageList;
} 

export const EmbedGetAllJobs = async (mongoclient: mongo.MongoClient, isInternship: boolean): Promise<Discord.MessageEmbed[]> => {
    let collection;
    if (isInternship) {
        collection = mongoclient.db().collection('Internships');
    } else {
        collection = mongoclient.db().collection('EntryLevel');
    }

    // Two arrays: one of embeds to send
    let embedList: Discord.MessageEmbed[] = [];

    // Array of job objects
    let jobList = []

    // Generate initial embed
    let embed: Discord.MessageEmbed = new Discord.MessageEmbed()
    .setColor('#0072b1');

    if (isInternship) {
        embed.setTitle(`:rotating_light: :rotating_light:     **Internship/Co-Op Postings for the Week: ${moment().format("MMM Do YY")}**     :rotating_light: :rotating_light:\n\n`)
    } else {
        embed.setTitle(`:exclamation: :exclamation:     **Entry Level Job Postings for the Week: ${moment().format("MMM Do YY")}**     :exclamation: :exclamation:\n\n`)
    }

    let allJobs = await collection.find({});
    if (await allJobs.count() === 0) {
        // No jobs
        embed.setDescription("No jobs found this week... check back next week!");
    } else {
        await allJobs.forEach((job: any) => {
            let jobHeader: string = job.title + ' at ' + job.company;

            // Discord has a 256 field name length: https://discord.com/developers/docs/resources/channel#embed-limits
            let headerOption = 0;
            while (jobHeader.length > 256) {
                if (headerOption === 0) {
                    // First, try removing the location
                    jobHeader = job.title + ' at ' + ParseCompanyName(job.company);
                } else if (headerOption === 1) {
                    // Then, just try sending the title
                    jobHeader = job.title;
                } else {
                    // Send generic title
                    jobHeader = "Job title is too long! Open the link!";
                }
                headerOption++;
            }


            // Embeds have a 25 field limit
            if (jobList.length <= 25) {
                // Push as an object
                jobList.push({name: jobHeader, value: '<' + job.link + '>'});
            } else {
                // Format the embed fields and push embed to embed array, reset embed and jobList
                jobList.forEach((job) => {
                    embed.addField(job.name, job.value);
                });

                embedList.push(embed);
                embed = new Discord.MessageEmbed()
                .setColor('#0072b1');

                if (isInternship) {
                    embed.setTitle(`:rotating_light: :rotating_light:     **Internship/Co-Op Postings Part ${embedList.length + 1} for the Week: ${moment().format("MMM Do YY")}**     :rotating_light: :rotating_light:\n\n`)
                } else {
                    embed.setTitle(`:exclamation: :exclamation:     **Entry Level Job Postings Part ${embedList.length + 1} for the Week: ${moment().format("MMM Do YY")}**     :exclamation: :exclamation:\n\n`)
                }
                jobList = [];
            }
        })
    }
    // Push remaining jobs to embed
    jobList.forEach((job) => {
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

    return embedList;
} 

export const WipeCollection = async (mongoclient: mongo.MongoClient, isInternship: boolean) => {
    let collection;
    if (isInternship) {
        collection = mongoclient.db().collection('Internships');
    } else {
        collection = mongoclient.db().collection('EntryLevel');
    }
    collection.deleteMany({});
}

const CheckUnique = async (collection: any, job: Job): Promise<boolean> => {
    // used any type cuz I'm too lazy to figure out what exactly the type of this mongodb collection object is
    let duplicate = await collection.findOne({
        // title: job.title,
        link: job.link,
        // company: job.company
    });

    if (duplicate) {
        console.log("Duplicate")
        return false;
    } else {
        return true;
    }
}