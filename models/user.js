const { Schema, model } = require("mongoose");

const userSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  surname: String,
  nick: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password:{
    type:String,
    require:true,
  },
  role: {
    type: String,
    require: true,
    default: "role_user",
  },
  image: {
    type: String,
    default: "default.png",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("User", userSchema, "users");
