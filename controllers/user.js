const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("../services/jwt");
// const mongoosePagination = require("mongoose-pagination");

//Action example
const exampleUser = (req, res) => {
  return res.status(200).send({
    message: "Message sent from: controllers/user.js",
    user: req.user,
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
      if (err || !userStore)
        return res.status(500).send({ status: "error", message: "error add" });

      return res.status(200).json({
        message: "success",
        userSave: userStore,
      });
    });
  });
};

//Login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.tatus(400).send({
      status: "error",
      message: "value null",
    });
  }
  User.findOne({ email: email })
    //.select({ password: 0 })
    .exec((error, user) => {
      if (error || !user)
        return res
          .status(404)
          .send({ status: "error", message: "error not exist" });

      //validate password
      const pwd = bcrypt.compareSync(password, user.password);

      if (!pwd) {
        res.status(400).send({
          status: "error",
          message: "identification failure",
        });
      }

      const token = jwt.createToken(user);

      return res.status(200).send({
        status: "success",
        message: "Action login",
        user: {
          id: user._id,
          name: user.name,
          nick: user.nick,
        },
        token,
      });
    });
};

const getUser = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .select({ password: 0, role: 0 })
    .exec((error, user) => {
      if (error || !user) {
        return res.status(404).send({
          status: "error",
          message: "no exist user",
        });
      }

      return res.status(200).send({
        status: "success",
        user,
      });
    });
};

const listUser = (req, res) => {
  const page = 1;
  if (req.params.page) {
    page = req.params.page;
  }
  page = parseInt(page);

  //number of items per page 
  const itemsPage = 5;

  
  return res.status(200).send({
    status: "success",
    message: "list users",
    page,
  });
};

module.exports = {
  exampleUser,
  register,
  login,
  getUser,
  listUser,
};
