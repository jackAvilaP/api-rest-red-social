const mongoose = require("mongoose");

const connection = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect("mongodb://127.0.0.1:27017/mi_redsocial");

    console.log("connection success in mi_redsocial :D ");
  } catch (error) {
    console.log(error);
    throw new Error("Not connection :( !!");
  }
};

module.exports = connection;
