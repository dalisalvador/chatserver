const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Chat = require("../models/Chat");

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
exports.getChats = asyncHandler(async (req, res, next) => {
  const chats = await Chat.find({
    $or: [{ userA: req.user.id }, { userB: req.user.id }]
  });

  if (chats.length === 0) {
    return next(new ErrorResponse("No se encontraron chats", 404));
  }

  //limit Number of messages to 20
  chats.forEach(chat => {
    if (chat.messages.length > process.env.MESSAGES_LIMIT) {
      chat.messages = [...chat.messages.slice(-process.env.MESSAGES_LIMIT)];
    }
  });

  res.status(200).json({ success: true, chats });
});
