# Backend Service

A realtime feed backend built with Node.js, Express, MongoDB, Redis, and WebSockets.

## What this does

- Runs the API server from `src/server.js`
- Connects to MongoDB using `MONGO_URI`
- Connects to Redis using `REDIS_URL`
- Uses `nodemon` in development mode
- Exposes the app on port `5000` by default

## Prerequisites

- Docker installed
- MongoDB instance available
- Redis instance available

## Required environment variables

Create a `.env` file or pass these values when running the container:

```env
MONGO_URI=mongodb://<host>:<port>/<database>
REDIS_URL=redis://<host>:<port>
PORT=5000
```

## Run locally

Install dependencies and start the app in development mode:

```bash
npm install
npm run dev
```

The server will start on `http://localhost:5000` unless you override `PORT`.

## Build the Docker image

From the project root:

```bash
docker build -t backend-dev .
```

## Run with Docker

Run the container and map the app port:

```bash
docker run --rm -p 5000:5000 \
  -e MONGO_URI="mongodb://host:27017/mydb" \
  -e REDIS_URL="redis://host:6379" \
  backend-dev
```

Or use an env file:

```bash
docker run --rm -p 5000:5000 --env-file .env backend-dev
```

## Notes

- This Dockerfile is optimized for development and uses `npm run dev`.
- If you want production mode, use `npm start` and install production dependencies only.
- Make sure MongoDB and Redis are reachable from the container network.
