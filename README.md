# UCSB AIChE Careers Bot
## About
This is a Discord bot to send chemical engineering internship and full-time job postings to the UCSB AIChE Discord Channel to help students find professional opportunities.

## How It Works
* I made a fake GMail and LinkedIn account and signed up for job postings
* Every day, I search in my filter to get new job opportunities and put it into my database
* Once a week, I look through MongoDB, format the listings, and send a message of the week's job opportunities to the channel

## Adding the Bot

## Removing the Bot

## All Commands

## Technologies Used
* Typescript - I wanted to learn some basic Typescript
* MongoDB - my databse of choice
* Discord.js - Discord bot
* cron - regularly scheduling tasks (talking to GMail, sending weekly messages)
* Google API (GMail) - to get the postings sent by LinkedIn to the GMail