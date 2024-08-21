import express from 'express';
import { createServer } from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../src/database/index.js';

// import {connectDB}
dotenv.config();
const app = express();
app.use(express.json({limit: "10mb"}))
const port = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors());

//routes
import userRouter from "../src/routes/user.routes.js"
app.use("/users", userRouter)


// Object to track connected users in each room
const roomUsers = {};  /* room: {"s1cxvbyz":[
                                            {"id":"eIJRRJ29ILtHNFvKAAAC","username":"ben"},
                                            {"id":"S-ieWknyyqKaHCVkAAAD","username":"kiran"},
                                            {"id":"DwCwJ1BmFst5-jLpAAAJ","username":"ka e"}
                                            ]}  
                                            */


const server = createServer(app); //Creating a Server

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});


io.on('connection', (socket) => {
  //Join-Room event listener
  socket.on('join-room', ({ roomId, username }) => {

    console.log("Socket connection Start");
    socket.join(roomId);
    console.log("Connected with socket id:" + socket.id + "  roomId:" + roomId + " user:" + username);

    // Initialize the room in the roomUsers object if it doesn't exist
    if (typeof roomUsers[roomId] === 'undefined') {
      console.log(`Initializing roomUsers for roomId: ${roomId}`);
      roomUsers[roomId] = [];
    }

    // Check if the user is already in the room to prevent duplicate entries
    const existingUser = roomUsers[roomId].find(user => user.username === username);
    if (!existingUser) {
      console.log(`Adding new user ${username} to room ${roomId}`);
      roomUsers[roomId].push({ id: socket.id, username });

      // Notify other users in the room that a new user has joined
     // socket.to(roomId).emit('user-joined', username);
      socket.broadcast.to(roomId).emit('user-joined', username);
      console.log(`Notified other users in room ${roomId} of new user ${username}`);
    } else {
      console.log(`User ${username} already in room ${roomId}, not re-adding or notifying.`);
    }
    console.log(JSON.stringify(roomUsers));
    //Broadcast the list of connected users to everyone in the room except him
    io.in(roomId).emit('connected-users', roomUsers[roomId].map(user => user.username));  // send array of UserNames

    
  });
  // Join-Room Ends


  socket.on('cursor-move', ({roomId, username, cursorPos}) => {
    console.log("cursor movement change for " + username + JSON.stringify(cursorPos) );
    // socket.to(roomId).emit('remote-cursor-move', {username, cursorPos});
    // socket.broadcast(roomId).emit('remote-cursor-broadcast' , {username,cursorPos})
    io.in(roomId).emit('remote-cursor-move', {username, cursorPos});
  });


  socket.on('leave-room', ({ roomId, username }) => {
    socket.leave(roomId);
    console.log(`User  ${username}  left from Room: ${roomId}`);
    console.log(` Room: ${JSON.stringify(roomUsers)}`);
    // Remove the user from the room list
    roomUsers[roomId] = roomUsers[roomId].filter(user => user.username !== username);

    // Notify other users in the room
    socket.to(roomId).emit('user-left', username);

    // Update the list of connected users in Current ROOM // Broadcasting not on all available rooms
    io.in(roomId).emit('connected-users', roomUsers[roomId]);
  });

});

// Start the server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

connectDB().then(() => {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
})