export default function handle_room(io, socket, roomUsers, table) {
    socket.on("join-room", ({ roomId, userId }) => {
      console.log("Socket connection Start");
      socket.join(roomId);
      console.log(
        "Connected with socket id:" +
          socket.id +
          "  roomId:" +
          roomId +
          " user:" +
          userId
      );
  
      if (typeof roomUsers[roomId] === "undefined") {
        console.log(`Initializing roomUsers for roomId: ${roomId}`);
        roomUsers[roomId] = [];
      }
  
      // Check if the user is already in the room to prevent duplicate entries
      const existingUser = roomUsers[roomId].find(
        (user) => user.userId === userId
      );
      if (!existingUser) {
        console.log(`Adding new user ${userId} to room ${roomId}`);
        roomUsers[roomId].push({ id: socket.id, userId });
  
        // Notify other users in the room that a new user has joined
        // socket.to(roomId).emit('user-joined', userId);
        socket.broadcast.to(roomId).emit("user-joined", userId);
        console.log(
          `Notified other users in room ${roomId} of new user ${userId}`
        );
      } else {
        console.log(
          `User ${userId} already in room ${roomId}, not re-adding or notifying.`
        );
      }
      console.log(JSON.stringify(roomUsers));
      //Broadcast the list of connected users to everyone in the room except him
      io.in(roomId).emit(
        "connected-users",
        roomUsers[roomId].map((user) => user.userId)
      ); // send array of userIds
    });


    socket.on('leave-room', ({ roomId, userId }) => {
        socket.leave(roomId);
        console.log(`User  ${userId}  left from Room: ${roomId}`);
        console.log(` Room: ${JSON.stringify(roomUsers)}`);
        // Remove the user from the room list
        roomUsers[roomId] = roomUsers[roomId].filter(user => user.userId !== userId);
        socket.to(roomId).emit('user-left', userId);
        io.emit('connected-users-table', table);
      });
  }
  