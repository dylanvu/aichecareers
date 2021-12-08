# UCSB AIChE Careers Bot
## About
This is a Discord bot to send chemical engineering internship and full-time job postings to the UCSB AIChE Discord Channel to help students find professional opportunities.

## How It Works
* I made a fake GMail and LinkedIn account and signed up for job postings which get sent to my email and put into a gmail filter
* Every day, I search in my filter to get new job opportunities and put it into my MongoDB database
* Once a week, I look through MongoDB, format the listings, and send a message of the week's job opportunities to subscribed channels

## Adding the Bot
* Make sure you're an admin
* Use this link: https://discord.com/api/oauth2/authorize?client_id=917917515542310942&permissions=3072&scope=bot
## Removing the Bot
* Type in `!unsubscribe` in all subscribed channels
* Kick the bot out of the server

## All Commands
* `!subscribe` - Subscribe the channel to job alerts
* `!unsubscribe` - Unsubscribe from the job alerts
* `!help` - List of commands
* `!github` - Link this repository

## Technologies Used
* [Typescript](https://www.typescriptlang.org/) - I wanted to learn some basic Typescript
* [MongoDB + NodeJS Driver](https://docs.mongodb.com/drivers/node/current/) - my nosql databse of choice
* [Express](https://expressjs.com/) - Webserver to host the bot
* [Discord.js](https://discord.js.org/#/) - Interact with the Discord API to make bots
* [cron](https://www.npmjs.com/package/cron) - regularly scheduling tasks (talking to GMail, sending weekly messages)
* [Google API (GMail)](https://developers.google.com/gmail/api) - to get the postings sent by LinkedIn to the GMail
* [Cheerio.js](https://cheerio.js.org/) - Parse Job Alert (in HTML) 
* [Axios](https://www.npmjs.com/package/axios) - Make requests to Google API
* [Moment.js](https://momentjs.com/) - Get the date to display
* [Replit](https://replit.com/) - Online IDE that I'm using to host this bot
* [Uptimerobot](https://uptimerobot.com/) - Website to ping and keep my Replit-hosted application on (if you don't have a student account)

## Resources Used While Learning

### Learning Typescript
* https://code.visualstudio.com/docs/typescript/typescript-compiling
* https://stackoverflow.com/questions/54496398/typescript-type-string-undefined-is-not-assignable-to-type-string
* https://stackoverflow.com/questions/37632760/what-is-the-question-mark-for-in-a-typescript-parameter-name

### Discord.js + Typescript
* https://github.com/oceanroleplay/discord.ts-example/blob/main/src/client.ts
* https://discord.js.org/#/docs/main/stable/class/Intents?scrollTo=s-FLAGS
* https://discord.com/developers/docs/topics/gateway#list-of-intents


### GMail API and Related to OAuth/Access
* https://ibm.com/docs/en/app-connect/cloud?topic=gmail-connecting-google-application-by-providing-credentials-app-connect-use-basic-oauth
* https://stackoverflow.com/questions/10631042/how-to-generate-access-token-using-refresh-token-through-google-drive-api
* https://stackoverflow.com/questions/24811008/gmail-api-decoding-messages-in-javascript
* https://stackoverflow.com/questions/44617825/passing-headers-with-axios-post-request
* https://github.com/axios/axios

### Cheerio
* https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/
* https://stackoverflow.com/questions/54463522/is-there-a-cheerio-selector-for-style