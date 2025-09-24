## Description
Markopolo Assesment Project

## Stack Information
* NodeJS
* NestJS
* Redis
* PostgreSQL
* Node Bull

## Project setup
* Install NodeJS
* Setup PostgreSQL and have it running
* Setup Redis and have this running
* Create a .env file and copy the environment variables from .env.example into the .env file. Replace values with your own
* Install the dependency using the following command
```bash
$ yarn install
```
* Run the following command to start in development mode.
```bash
$ yarn start:dev
```
* For convenience of development, TypeORM synchronize has been enabled. However, in production it must be turned off.


## Assumptions
* It has been assumed that the SMS and Email service is able to process contact list in bulk. The flow has been designed keeping that in mind.
* It has been assumed that, for the sake of simplicity, the campaigns and contact list are managable by any user, regardless of whether the user has created it or not. Further authorization on management of campaigns or contact list can be enforced later.
* It has also been assumed that, for the sake of simplicity, contacts can have duplicates in them. Hence, any type of duplicates has been ignored (for example, same email and phone combination etc).

## Data Model
User [id, name, email, password]
ContactList [id, name]
Contact [id, name, email, sms]
ContactListContact [ContactListId, ContactId]
Campaign [id, name, description, channels, workflow(JSONB), userListId, startDate, endDate, status, stepIndex]

## Features
* Modules
* Services
* Controllers
* Repository
* Dependency Injection
* TypeORM
* Usage of built in exceptions
* Request Validation
* Authentication
* Global authencation guard for securing private routes
* Use of custom decorator
* Config Module
* DTO pattern
* Node Bull
    * Offloading the background job management task
    * Using retries with backoff
    * Event Listeners for job to monitor errors

## What would have been nice to cover within the timeframe
* Not using TypeORM synchronize to migrate database schema. Used for the convience for development. 
* Uniform response structure
* Centralized loggin service
* Custom error handling with exception filters
* API documentation using Swagger
* Using docker compose to orchestrate the dependencies together 


