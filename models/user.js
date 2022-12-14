const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  surname: String,
  bio: String,
  nick: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
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

userSchema.plugin(mongoosePaginate);

module.exports = model("User", userSchema, "users");
