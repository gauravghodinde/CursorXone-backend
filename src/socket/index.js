import handleDisconnect from "./handle_disconnect.js";
import handle_room from "./join/room.js";
import handle_table from "./join/table.js";



const roomUsers = {};
const table = {};

export default function socketConnection(io) {
  io.on('connection', (socket) => {


  handleDisconnect(io, socket, roomUsers, table);
  handle_room(io, socket, roomUsers, table);
  handle_table(io, socket, roomUsers, table);
  

  socket.on('cursor-move', ({roomId, userId, username ,cursorPos , currImg }) => {
    console.log("cursor movement change for " + userId + JSON.stringify(cursorPos) );
    io.in(roomId).emit('remote-cursor-move', {userId, username ,cursorPos,currImg});
  });




  

  socket.on('audioStream', (audioBlob) => {

    console.log(audioBlob);
    console.log(audioBlob.tableId);
    console.log(audioBlob.userId);
    console.log(io.sockets.adapter.rooms.get(audioBlob.tableId));
    // io.in(audioBlob.tableId).emit('audioStream', audioBlob); 
    io.in(audioBlob.tableId).emit('audioStream', audioBlob); 
    // io.in(tableId).emit('connected-users', table[tableId].map(user => user.userId)); 
  });
  socket.on('message-global' , (data) => {
    console.log("message by " , data.userId);
    console.log(data.text);
    io.emit('messageResponse' , data)
  })

  socket.on('emoji' , (emoji) => {
    console.log("message by " , emoji.userId);
    console.log(emoji.emojiText);
    io.emit('emoji-changed' , emoji)
  })

  });
}
