import express from 'express';
import { createServer } from 'http';
import {Server} from 'socket.io';
  import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/database/index.js';

// import {connectDB}
dotenv.config();
const app = express();
app.use(express.json({limit: "10mb"}))
const port = process.env.PORT || 3000;

// const allowedOrigins = ['http://localhost:3000'];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

app.use(cors());

//routes
import userRouter from "./src/routes/user.routes.js"
app.use("/users", userRouter)
import cursorimageRouter from "./src/routes/cursorImage.routes.js"

app.use("/cursors", cursorimageRouter)


// Object to track connected users in each room
const roomUsers = {};  /* room: {"s1cxvbyz":[
                                            {"id":"eIJRRJ29ILtHNFvKAAAC","username":"ben"},
                                            {"id":"S-ieWknyyqKaHCVkAAAD","username":"kiran"},
                                            {"id":"DwCwJ1BmFst5-jLpAAAJ","username":"ka e"}
                                            ]}  
                                            */


const table = {}


const server = createServer(app); //Creating a Server

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// import rtcMultiConnectionServer from 'rtcmulticonnection-server';


// rtcMultiConnectionServer.addSocket(io);
io.on('connection', (socket) => {
  

  
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

  socket.on('join-table', ({ tableId, username }) => {

    console.log("Socket connection Start");
    socket.join(tableId);
    console.log("Connected with socket id:" + socket.id + "  tableid:" + tableId + " user:" + username);

    // Initialize the room in the roomUsers object if it doesn't exist
    if (typeof table[tableId] === 'undefined') {
      console.log(`Initializing tableusers for tableid: ${tableId}`);
      table[tableId] = [];
      
    }

    // Check if the user is already in the room to prevent duplicate entries
    var existingUser = null
    var userFound = false
    Object.keys(table).forEach((tableKey) => {
      if (userFound) return; // If the user is already found, exit the loop
    
      console.log('Checking table:', tableKey);
    
      // Find the user in the current table
      const existingUser = table[tableKey].find((user) => user.username === username);
    
      if (existingUser) {
        console.log('User found in table:', tableKey);
        userFound = true;  // Set the flag to true since the user is found
      }
    });
    
    if (!existingUser && !userFound)  {
      console.log(`Adding new user ${username} to table ${tableId}`);
      table[tableId].push({ id: socket.id, username });

      // Notify other users in the room that a new user has joined
     // socket.to(roomId).emit('user-joined', username);
      socket.broadcast.to(tableId).emit('user-joined', username);
      console.log(`Notified other users on table ${tableId} of new user ${username}`);
    } else {
      console.log(`User ${username} already in table ${tableId}, not re-adding or notifying.`);
    }
    console.log(JSON.stringify(table));
    //Broadcast the list of connected users to everyone in the room except him
    io.in(tableId).emit('connected-users-table', table[tableId].map(user => user.username));  // send array of UserNames

    
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
    io.in(roomId).emit('connected-users', table[tableId]);
  });

  socket.on('leave-table', ({ tableId, username }) => {
    socket.leave(tableId);
    console.log(`User  ${username}  left from table: ${tableId}`);
    console.log(` table: ${JSON.stringify(table)}`);
    // Remove the user from the room list
    table[tableId] = table[tableId].filter(user => user.username !== username);

    // Notify other users in the room
    socket.to(tableId).emit('user-left', username);

    // Update the list of connected users in Current ROOM // Broadcasting not on all available rooms
    io.in(tableId).emit('connected-users-table', table[tableId]);
    // io.in(tableId).emit('connected-users', table[tableId].map(user => user.username)); 
  });

  socket.on('audioStream', (audioBlob) => {

    console.log(audioBlob);
    console.log(audioBlob.tableId);
    console.log(io.sockets.adapter.rooms.get(audioBlob.tableId));
    io.in(audioBlob.tableId).emit('audioStream', audioBlob); 
    // io.in(tableId).emit('connected-users', table[tableId].map(user => user.username)); 
  });

  // function getUsersInRoom(roomId) {
  //   const room = ;
  //   if (!room) return [];

  //   // Get all socket IDs in the room
  //   const users = Array.from(room);

  //   // Map to get usernames (you will need to store usernames somewhere, such as in a Map or object)
  //   return users.map((socketId) => {
  //     const socket = io.sockets.sockets.get(socketId);
  //     return socket.username; // Assume you set the username somewhere
  //   });
  // }

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