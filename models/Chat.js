const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  userA: {
    type: mongoose.Schema.ObjectId,
    require: true
  },
  userB: {
    type: mongoose.Schema.ObjectId,
    require: true
  },
  messages: [
    {
      from: {
        type: mongoose.Schema.ObjectId,
        require: true
      },
      message: {
        type: String,
        require: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Chat", ChatSchema);
