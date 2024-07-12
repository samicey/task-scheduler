# Serverless Schedule Management Application

This project is a serverless application built using AWS services that processes and stores a user’s schedule configuration. The application allows users to manage their weekly repeating schedules, ensuring no overlapping or invalid entries.

## Features

- Create, read, update, and delete user schedules
- Validate schedules to prevent overlaps
- Check if a user is scheduled to be online at a given timestamp
- Store schedule data in Amazon Aurora PostgreSQL
- Infrastructure as Code using AWS CDK
- Bonus: Use SQS for message queueing and S3 for storing request payloads

## Prerequisites

- Node.js and npm
- Docker and Docker Compose
- AWS CLI configured with appropriate credentials
- PostgreSQL (or Docker for local testing)
- Serverless Framework

## Setup

1. **Clone the Repository**

```sh
   git clone https://github.com/samicey/task-scheduler.git
   cd task-scheduler
```

## Setting up local 
Install Dependencies
```sh
yarn install
```
- Set up local postgresql db using docker
```sh
yarn db:docker
```
update env variable
```javascript
    TASK_SCHEDULER_WAF_NAME='TASK_SCHEDULER_WAF_NAME'
    AWS_ACCESS_KEY_ID='AWS_ACCESS_KEY_ID'
    AWS_BUCKET_NAME='AWS_BUCKET_NAME'
    AWS_SECRET_ACCESS_KEY='AWS_SECRET_ACCESS_KEY'
    SERVERLESS_PROVIDER_REGION='SERVERLESS_PROVIDER_REGION'
    NODE_ENV='dev'
    DB_HOST='DB_HOST'
    DB_NAME='DB_NAME'
    DB_PASSWORD='DB_PASSWORD'
    DB_USER='DB_USER'
```
And run migration
```sh
yarn migrate-db-local
```
## Testing APIs
The following apis are exposed in this project.

POST '/schedule';
    To create new schedule.

GET '/schedule/user/:userId/:scheduleId';
    Return one schedule

PATCH '/schedule/:userId/:scheduleId'; 
    update existing schedule

GET '/schedule/check-status/:scheduleId/:timestamp'; 
    check online status

DELETE '/schedule/user/:userId/:scheduleId'; 
    delete existing schedule

## Deploy
to deploy, run the following script
```sh
yarn deploy
```
