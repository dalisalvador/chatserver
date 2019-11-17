const socketio = require("socket.io");
const socketioJwt = require("socketio-jwt");
const Chat = require("../models/Chat");
const SocketToUser = require("../models/SocketToUser");

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
    let socketToUser = await SocketToUser.findOneAndUpdate(
      { userId: socket.decoded_token.id },
      { socketId: socket.id }
    );

    if (!socketToUser) {
      SocketToUser.create({
        userId: socket.decoded_token.id,
        socketId: socket.id
      });
      socketToUser = await SocketToUser.findOne({
        userId: socket.decoded_token.id
      });
    }

    socket.on("message", async data => {
      let socketTo = await SocketToUser.findOne({ userId: data.to });

      let chat = await Chat.findOne({
        $or: [
          { $and: [{ userA: data.from }, { userB: data.to }] },
          { $and: [{ userA: data.to }, { userB: data.from }] }
        ]
      });
      if (!chat) {
        //No chats yet.
        chat = await Chat.create({
          userA: data.from,
          userB: data.to,
          messages: [{ from: data.from, message: data.message }]
        });
        chat = await Chat.findOne({
          $and: [{ userA: data.from }, { userB: data.to }]
        });

        if (socketTo) {
          socket.to(`${socketTo.socketId}`).emit("new-chat", {
            success: true,
            chat
          });
        }
        //If the user has never connected socketTo does not exists yet.
        socket.emit("new-chat", {
          success: true,
          chat
        });
      } else {
        chat.messages.push({ from: data.from, message: data.message });
        chat = await chat.save();
        if (socketTo) {
          socket.to(`${socketTo.socketId}`).emit("new-message", {
            success: true,
            message: chat.messages.slice(-1)[0],
            chatId: chat._id
          });
        }
        socket.emit("new-message", {
          success: true,
          message: chat.messages.slice(-1)[0],
          chatId: chat._id
        });
      }
    });
  });

  return io;
};
