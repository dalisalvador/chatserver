const socketio = require("socket.io");
const socketioJwt = require("socketio-jwt");

module.exports.listen = function(app) {
  var io = socketio.listen(app);

  io.on(
    "connection",
    socketioJwt.authorize({
      secret: process.env.JWT_SECRET,
      timeout: 15000 // 15 seconds to send the authentication message
    })
  ).on("authenticated", function(socket) {
    console.log(
      "connected & authenticated: " + JSON.stringify(socket.decoded_token)
    );
    socket.emit("authenticated", { fede: "capo" });

    // socket.on("sensor", function(msg) {
    //   var userData = socket.decoded_token;
    //   var sensorData = JSON.parse(msg);

    //   //we can save the data sent through the socket using userData.id to identify the user

    //   //save data
    //   console.log(userData.id);
    //   console.log(new ObjectId(userData.id));
    //   Sensors.findOne({ userId: new ObjectId(userData.id) }, function(
    //     err,
    //     sensor
    //   ) {
    //     if (err) throw err;

    //     if (sensor) {
    //       console.log("Sensor found");
    //       sensor.updateData(sensorData);
    //     } else {
    //       console.log("Invalid Sensor");
    //     }
    //   });
    // });
  });

  return io;
};
