# Getting Started

This project is a web app for chat app that includes the features: Login/Resgister, add friend, create group, chat realtime, video call.

## Prerequisites

- Install [Node.js](https://nodejs.org/en/) version 18.x.x

## Installation & Configuration

- Clone the repository

```
git clone  https://github.com/ssang-hub/ChatApp.git
```

- Install dependencies on server

```
cd <project_name>
cd api
yarn install
```

- Install dependencies on client

```
cd ..
cd client
yarn install
```

- Change 2 files `.env.examples` to `.env`

## Running the Application

- Run server

```
cd server
yarn dev
```

- Run client

```
cd client
yarn start
```

### Building and running your application with docker

- Clone the repository

```
git clone  https://github.com/ssang-hub/ChatApp.git
```

When you're ready, start your application by running:

- Run server

```
cd api
```

```
docker compose up
```

- Run client

```
cd client
```

```
docker compose up
```

Your application will be available at http://localhost:3000.
