const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost/bags-ecommerce";
    await mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 60000, // Increase timeout to 60 seconds
        socketTimeoutMS: 45000, // Increase socket timeout
        connectTimeoutMS: 60000, // Increase connection timeout
        maxPoolSize: 100 // Increase pool size
    }).catch((error) => console.log("Mongo Connection Error: "+error));
    const connection = mongoose.connection;
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useFindAndModify', false);
    console.log("MONGODB CONNECTED SUCCESSFULLY!");
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = connectDB;