const bcrypt = require("bcrypt");
const User = require("../models/user");

//Action example
const exampleUser = (req, res) => {
  return res.status(200).send({
    message: "Message sent from: controllers/user.js",
  });
};

//Registre users
const register = (req, res) => {
  //get data from the request
  const { name, nick, email, password, role } = req.body;

  //validate request data
  if (!name || !nick || !email || !role || !password) {
    return res.status(400).json({
      message: "missing data :( ",
    });
  }
  //Repeated user control
  User.find({
    $or: [
      { name: name.toLowerCase() },
      { email: email.toLowerCase() },
      { nick: nick.toLowerCase() },
    ],
  }).exec(async (error, users) => {
    if (error)
      return res
        .status(500)
        .json({ status: "error", message: "Error query :(" });

    if (users && users.length >= 1) {
      return res
        .status(200)
        .json({ status: "success", message: "users exist" });
    }

    //Encrypt password JWT
    const pwd = await bcrypt.hash(password, 10);

    //create object user
    const userSave = new User({
      name,
      nick,
      email,
      password: pwd,
      role,
    });

    //Save user in data base
    userSave.save((err, userStore) => {
      if (err || userStore)
        return res.status(500).send({ status: "error", message: "error add" });

      if (userStore) {
        return res.status(200).json({
          message: "success",
          userSave: userStore,
        });
      }
    });
  });
};
module.exports = {
  exampleUser,
  register,
};
