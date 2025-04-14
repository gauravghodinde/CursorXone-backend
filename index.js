import cursorimageRouter from "./src/routes/cursorImage.routes.js"
import express from 'express';
import { createServer } from 'http';
import {Server} from 'socket.io';
import userRouter from "./src/routes/user.routes.js"
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/database/index.js';
import socketConnection from "./src/socket/index.js";


dotenv.config();
const app = express();
app.use(express.json({limit: "10mb"}))
const port = process.env.PORT || 3000;


app.use(cors({
  origin: '*', // Allows requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all common methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow standard headers
  credentials: true, // Allow cookies if needed
}));

// Handle preflight requests for all routes
app.options('*', cors());
//routes
app.use("/users", userRouter)

app.use("/cursors", cursorimageRouter)


const server = createServer(app); 
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});


socketConnection(io);

connectDB().then(() => {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
})