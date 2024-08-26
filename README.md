# CursorXone-backend


# Real-Time Node.js Application

## Overview

This Node.js application is a real-time server that manages user connections, rooms, tables, and cursor movements. It uses Express.js for the web server, Socket.IO for real-time communication, and MongoDB for data persistence.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Main Components](#main-components)
4. [API Routes](#api-routes)
5. [Socket Events](#socket-events)
6. [Database Models](#database-models)
7. [Authentication](#authentication)
8. [Error Handling](#error-handling)
9. [Deployment](#deployment)
10. [Contributing](#contributing)

## Installation

1. Clone the repository:
``` git clone [repository-url]```
2. Install dependencies:
```npm install```
3. Set up environment variables (see [Configuration](#configuration))
4. Start the server:
```npm start```


## Configuration

Create a `.env` file in the root directory with the following variables:

```PORT=3000```
```MONGODB_URI=your_mongodb_connection_string```


## Main Components

1. **Server Setup** (index.js): Configures Express, Socket.IO, and handles real-time events.
2. **User Routes** (user.routes.js): Defines API routes for user operations.
3. **Cursor Image Routes** (cursorImage.routes.js): Defines API routes for cursor image operations.
4. **User Controller** (user.controller.js): Handles user-related logic and database interactions.
5. **Cursor Image Controller** (cursorImage.controller.js): Manages cursor image operations.

## API Routes

### User Routes
- POST `/users/auth/signup`: Register a new user
- POST `/users/auth/login`: User login
- POST `/users/update`: Update user information
- POST `/users`: Get user information

### Cursor Image Routes
- POST `/cursors/upload`: Upload a cursor image
- POST `/cursors/get`: Get cursor images
- POST `/cursors/delete`: Delete a cursor image

## Socket Events

- `join-room`: User joins a room
- `join-table`: User joins a table
- `cursor-move`: Broadcasts cursor movement
- `leave-room`: User leaves a room
- `leave-table`: User leaves a table
- `audioStream`: Broadcasts audio streams within a table
- `message-global`: Broadcasts global messages
- `emoji`: Broadcasts emoji changes

## Database Models

- User
- CursorImage

## Authentication

The application uses bcrypt for password hashing and comparison.

## Error Handling

Controllers include basic error handling and input validation. Errors are logged to the console and appropriate HTTP status codes are returned.

## Deployment

The application listens on the port specified in the environment variables or defaults to port 3000.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[MIT]

## Contact

[Gaurav Ghodinde] - [gauravghodinde@gmail.com]
[karan Agarwal] - [karanagarwal200505@gmail.com]

Project Link: [https://github.com/gauravghodinde/cursorXone-backend](https://github.com/gauravghodinde/cursorXone-backend)
