const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected:", conn.connection.host);
  } catch (err) {
    console.error("FULL ERROR:");
    console.error(err);
    throw err;
  }
};

module.exports = connectDB;