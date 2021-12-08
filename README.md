# UCSB AIChE Careers Bot
## About
This is a Discord bot to send chemical engineering internship and full-time job postings to the UCSB AIChE Discord Channel to help students find professional opportunities.

## How It Works
* I made a fake GMail and LinkedIn account and signed up for job postings
* Every day, I search in my filter to get new job opportunities and put it into my database
* Once a week, I look through MongoDB, format the listings, and send a message of the week's job opportunities to the channel

## Adding the Bot
* Make sure you're an admin
* Use this link: https://discord.com/api/oauth2/authorize?client_id=917917515542310942&permissions=3072&scope=bot
## Removing the Bot

## All Commands

## Technologies Used
* [Typescript](https://www.typescriptlang.org/) - I wanted to learn some basic Typescript
* [MongoDB + NodeJS Driver](https://docs.mongodb.com/drivers/node/current/) - my nosql databse of choice
* [Discord.js](https://discord.js.org/#/) - Discord bot
* [cron](https://www.npmjs.com/package/cron) - regularly scheduling tasks (talking to GMail, sending weekly messages)
* [Google API (GMail)](https://developers.google.com/gmail/api) - to get the postings sent by LinkedIn to the GMail
* [Cheerio.js](https://cheerio.js.org/) - Parse Job Alert (in HTML) 
* [Axios](https://www.npmjs.com/package/axios) - Make requests to Google API

## Resources Used
* https://ibm.com/docs/en/app-connect/cloud?topic=gmail-connecting-google-application-by-providing-credentials-app-connect-use-basic-oauth
* https://stackoverflow.com/questions/10631042/how-to-generate-access-token-using-refresh-token-through-google-drive-api
* https://stackoverflow.com/questions/24811008/gmail-api-decoding-messages-in-javascript