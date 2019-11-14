const express = require("express");
const {
  createChat
  //   addMessage,
  //   getMessages,
} = require("../controllers/chats");

const Chat = require("../models/Chat");
const router = express.Router();

router.route("/").post(createChat);

// router
//   .route("/:id")
//   .post(addMessage);

module.exports = router;
