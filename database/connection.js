const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mi_redsocial");

    console.log("connection success in mi_redsocial :D ");
  } catch (error) {
    console.log(error);
    throw new Error("Not connection :( !!");
  }
};

module.exports = connection;
