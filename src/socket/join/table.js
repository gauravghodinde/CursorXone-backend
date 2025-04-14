export default function handle_table(io, socket, roomUsers, table) {
  socket.on("join-table", ({ tableId, userId }) => {
    console.log("Socket connection Start");
    socket.join(tableId);
    console.log(
      "Connected with socket id:" +
        socket.id +
        "  tableid:" +
        tableId +
        " user:" +
        userId
    );

    // Initialize the room in the roomUsers object if it doesn't exist
    if (typeof table[tableId] === "undefined") {
      console.log(`Initializing tableusers for tableid: ${tableId}`);
      table[tableId] = [];
    }

    // Check if the user is already in the room to prevent duplicate entries
    var existingUser = null;
    var userFound = false;
    Object.keys(table).forEach((tableKey) => {
      if (userFound) return; // If the user is already found, exit the loop

      console.log("Checking table:", tableKey);

      // Find the user in the current table
      const existingUser = table[tableKey]?.find(
        (user) => user.userId === userId
      );

      if (existingUser) {
        console.log("User found in table:", tableKey);
        userFound = true; // Set the flag to true since the user is found
      }
    });

    if (!existingUser && !userFound) {
      console.log(`Adding new user ${userId} to table ${tableId}`);
      table[tableId].push({ id: socket.id, userId });

      // Notify other users in the room that a new user has joined
      // socket.to(roomId).emit('user-joined', userId);
      socket.broadcast.to(tableId).emit("user-joined", userId);
      console.log(
        `Notified other users on table ${tableId} of new user ${userId}`
      );
    } else {
      console.log(
        `User ${userId} already in table ${tableId}, not re-adding or notifying.`
      );
    }
    console.log(JSON.stringify(table));
    //Broadcast the list of connected users to everyone in the room except him
    // io.in(tableId).emit('connected-users-table', table[tableId].map(user => user.userId));  // send array of userIds
    io.emit("connected-users-table", table); // send array of userIds
  });

  socket.on('leave-table', ({ tableId, userId }) => {
    console.log(tableId)
    socket.leave(tableId);
    console.log(`User  ${userId}  left from table: ${tableId}`);
    console.log(` table: ${JSON.stringify(table)}`);
    // Remove the user from the room list
    table[tableId] = table[tableId]?.filter(user => user.userId !== userId);

    // Notify other users in the room
    socket.to(tableId).emit('user-left', userId);

    // Update the list of connected users in Current ROOM // Broadcasting not on all available rooms
    // io.in(tableId).emit('connected-users-table', table[tableId]);
    io.emit('connected-users-table', table);
    // io.in(tableId).emit('connected-users', table[tableId].map(user => user.userId)); 
  });
}
