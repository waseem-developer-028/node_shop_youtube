const mongoose = require("mongoose");

const connect = new Promise(function (resolve, reject) {
  const error = true;
  const uri = process.env.MONGO_URI;
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => resolve("Mongodb connected to jest successfully"))
    .catch((error) => reject("Mongo Connection Error: " + error));
});

module.exports = connect;
