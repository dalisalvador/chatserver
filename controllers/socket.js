const Chat = require("../models/Chat");
const SocketToUser = require("../models/SocketToUser");

exports.onMessage = async (data, socket) => {
  let socketTo = await SocketToUser.findOne({ userId: data.to });
  let chat = await Chat.findOne({
    $or: [
      { $and: [{ userA: data.from }, { userB: data.to }] },
      { $and: [{ userA: data.to }, { userB: data.from }] }
    ]
  });
  if (!chat) {
    //No chats yet. Create a newone.
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
        chat,
        from: data.from,
        to: data.to
      });
    }
    //If the user has never connected socketTo does not exists yet.
    socket.emit("new-chat", {
      success: true,
      chat,
      from: data.from,
      to: data.to
    });
    console.log(`New Chat from user ${data.from} to user ${data.to}`.cyan);
  } else {
    chat.messages.push({ from: data.from, message: data.message });
    chat = await chat.save();
    if (socketTo) {
      socket.to(`${socketTo.socketId}`).emit("new-message", {
        success: true,
        message: chat.messages.slice(-1)[0],
        chatId: chat._id,
        from: data.from,
        to: data.to
      });
    }
    socket.emit("new-message", {
      success: true,
      message: chat.messages.slice(-1)[0],
      chatId: chat._id,
      from: data.from,
      to: data.to
    });
    console.log(`New Message from user ${data.from} to user ${data.to}`.cyan);
  }
};

exports.updateSocketToUser = async socket => {
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
};
