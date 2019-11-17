const express = require("express");
const {
  createChat,
  getChats
  //   addMessage,
  //   getMessages,
} = require("../controllers/chats");

const Chat = require("../models/Chat");
const router = express.Router();

const { protect } = require("../middleware/auth");

//Protect ALL routes
router.use(protect);

router.route("/").post(createChat);
router.route("/").get(getChats);

// router
//   .route("/:id")
//   .post(addMessage);

module.exports = router;
