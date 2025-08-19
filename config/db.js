const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost/bags-ecommerce";
    mongoose.set("strictQuery", false);
    await mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch((error) => console.log("Mongo Connection Error: " + error));
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
