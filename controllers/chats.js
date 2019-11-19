const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Chat = require("../models/Chat");
const SocketToUser = require("../models/SocketToUser");

// @desc      Create user
// @route     POST /api/v1/users
// @access    Private
exports.createChat = asyncHandler(async (req, res, next) => {
  const chat = await Chat.create(req.body);

  res.status(200).json({
    success: true,
    data: chat
  });
});

// @desc      Get all chats from user
// @route     GET /api/v1/chats/:id
// @access    Public
exports.getChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({
    $or: [{ "userA.userId": req.user.id }, { "userB.userId": req.user.id }]
  });

  // if (chats.length === 0) {
  //   return next(new ErrorResponse("No se encontraron chats", 404));
  // }

  if (chats.length > 0) {
    //limit Number of messages to 20
    chats.forEach(chat => {
      if (chat.messages.length > process.env.MESSAGES_LIMIT) {
        chat.messages = [...chat.messages.slice(-process.env.MESSAGES_LIMIT)];
      }
    });
  }

  res.status(200).json({ success: true, chats });
});

exports.updateUserConnection = async (socket, isConnected) => {
  const socketToUser = await SocketToUser.findOne({ socketId: socket.id });
  if (socketToUser) {
    const { userId } = socketToUser;

    // let chats = await Chat.updateMany(
    //   { "userA.userId": userId },
    //   { "userA.connected": isConnected }
    // );

    // console.log("A", chats);
    // // if (chats.length === 0) {
    // //   return next(new ErrorResponse("No se encontraron chats", 404));
    // // }

    // chats = await Chat.updateMany(
    //   { "userB.userId": userId },
    //   { "userB.connected": isConnected }
    // );

    // console.log("B", chats);

    console.log("User connected: ", userId);

    socket.broadcast.emit("user-connection-status", {
      success: true,
      connected: isConnected,
      userId
    });
  } else
    socket.emit(
      "error",
      "could not Update Chat State. Socket To User not Found"
    );
};
