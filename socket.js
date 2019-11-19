const socketio = require("socket.io");
const socketioJwt = require("socketio-jwt");
const { onMessage, updateSocketToUser } = require("./controllers/socket");
const { updateUserConnection } = require("./controllers/chats");

module.exports.listen = function(app) {
  var io = socketio.listen(app);

  io.on(
    "connection",
    socketioJwt.authorize({
      secret: process.env.JWT_SECRET,
      timeout: 15000 // 15 seconds to send the authentication message
    })
  ).on("authenticated", async function(socket) {
    //First match User ID w/ Socket Id
    updateSocketToUser(socket);

    //New message?
    socket.on("message", data => onMessage(data, socket));
    socket.on("connected", () => updateUserConnection(socket, true));
    socket.on("disconnect", () => updateUserConnection(socket, false));
    socket.on("disconnect-user", () => updateUserConnection(socket, false));
  });

  return io;
};
