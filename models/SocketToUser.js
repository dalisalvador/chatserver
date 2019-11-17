const mongoose = require("mongoose");

const SocketToUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    require: true
  },
  socketId: {
    type: String,
    require: true
  }
});

module.exports = mongoose.model("SocketToUser", SocketToUserSchema);
