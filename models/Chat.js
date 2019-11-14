const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  message: [
    {
      senderId: {
        type: mongoose.Schema.ObjectId,
        require: true
      },
      receiverId: {
        type: mongoose.Schema.ObjectId,
        require: true
      },
      message: {
        type: String,
        require: true
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Chat", ChatSchema);
