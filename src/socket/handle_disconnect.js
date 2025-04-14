export default function handleDisconnect(io, socket, roomUsers, table) {
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  
    // Handle removal from roomUsers
    for (const roomId in roomUsers) {
      const userIndex = roomUsers[roomId].findIndex(user => user.id === socket.id);
      if (userIndex !== -1) {
        const userId = roomUsers[roomId][userIndex].userId;
        roomUsers[roomId].splice(userIndex, 1);
        socket.to(roomId).emit('user-left', userId);
        console.log(`User ${userId} removed from room ${roomId} on disconnect`);
      }
    }
  
    // Handle removal from table
    for (const tableId in table) {
      const userIndex = table[tableId].findIndex(user => user.id === socket.id);
      if (userIndex !== -1) {
        const userId = table[tableId][userIndex].userId;
        table[tableId].splice(userIndex, 1);
        socket.to(tableId).emit('user-left', userId);
        console.log(`User ${userId} removed from table ${tableId} on disconnect`);
      }
    }
  
    // Broadcast updated state
    io.emit('connected-users-table', table);
  });    
}
  