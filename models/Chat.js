const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  userA: {
    userId: { type: mongoose.Schema.ObjectId, require: true },
    isConnected: { type: Boolean, default: false }
  },
  userB: {
    userId: { type: mongoose.Schema.ObjectId, require: true },
    isConnected: { type: Boolean, default: false }
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
