import * as mongo from 'mongodb';
import {Job} from '../classes/job';

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
        message = ":rotating_light: :rotating_light:     **Internship/Co-Op Postings for the week:**     :rotating_light: :rotating_light:\n\n";
    } else {
        message = ":exclamation: :exclamation:     **Entry Level Job Postings for the week:**     :exclamation: :exclamation:\n\n";
    }
    let allJobs = await collection.find({});
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
    // Push remaining message to array
    messageList.push(message);

    return messageList;
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
    let duplicates = await collection.find({
        title: job.title,
        link: job.link,
        company: job.company
    });

    if (duplicates) {
        return false;
    } else {
        return true;
    }
}