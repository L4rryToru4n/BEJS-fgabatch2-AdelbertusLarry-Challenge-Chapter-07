# Deblog SocMail
## Introduction
Deblog SocMail is a backend web application that handles real-time notifications using WebSocket protocol to notify users of a new account creation, an update of a successful password change and serves APIs for password reset. The application also implements debugging and loggings for errors using Sentry platform.

There are several main endpoints served in this application. These endpoints are:
- Users
- Registration
- Mail
- Auth

There are two types of backend application specifically for this project. These are clients and server. Clients would be able to authenticate users and requests password resets while only able to receive real-time notifications. Server would be able to do in similar fashion but able to send real-time notifications when there is an update of a password resets and sending emails.
Because of a lack of frontends, the best possible way to emulate client-server communications is creating a backend client APIs and a server APIs.

## API Functionalities
### Users
`Users` endpoint will manage the data of a user. The API functionalities can be accessed using the following uri:
- `/users`
- `/users/{id}`
- `/users/create`
- `/update/{id}`
- `/delete/{id}`

### Registration
`Registration` endpoint will be able to create a new user account The API functionalities can be accessed using the following uri:
- `/registration`

### Mail
`Mail` endpoint will be able to send emails using a template. The API functionalities can be accessed using the following uri:
- `/mail/send`

### Auth
`Auth` endpoint will manage the authentication of the user accounts. The API functionalities can be accessed using the following uri:
- `/auth/login`
- `/auth/logout`
- `/auth/verify-otp`
- `/auth/forgot-password`
- `/auth/reset-password`

## Setup
In order to do demo, clone the project by typing this command into the terminal: 
```
git clone https://github.com/L4rryToru4n/BEJS-fgabatch2-AdelbertusLarry-Challenge-Chapter-07.git
```
or download the project then extract the .zip file.

## Usage Instructions
After downloading or cloning the repository, head to the main directory using a CLI to get the project started and initialize the project's database by running the command
```
npx prisma migrate dev --name init
```
Next, install all of the Node packages by running the command
```
npm install
```
Lastly, to get the project's server running enter the command
```
npm run start
```
All endpoints then can be accessed starting from `localhost:5000/api/v1/{name_of_the_main_endpoint}`.
