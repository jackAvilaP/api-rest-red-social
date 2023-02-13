const bcrypt = require("bcrypt");

const User = require("../models/user");
const Follow = require("../models/follow");

const jwt = require("../services/jwt");

const fs = require("fs");
const path = require("path");
const publication = require("../models/publication");
const { deleteMany } = require("../models/publication");

// const mongoosePagination = require("mongoose-pagination");

//Action example
const exampleUser = (req, res) => {
  return res.status(200).send({
    message: "Message sent from: controllers/user.js",
    user: req.user,
  });
};

//Register users
const register = (req, res) => {
  //get data from the request
  const { name, nick, email, password, role } = req.body;

  //validate request data
  if (!name || !nick || !email || !password) {
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
        message: "success",
        user: {
          id: user._id,
          name: user.name,
          nick: user.nick,
        },
        token,
      });
    });
};

//get by id user
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

//get users by limit and page
const listUser = (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 15;
  const page = parseInt(req.query.page, 10) || 1;

  User.paginate({}, { limit, page }, (err, user) => {
    if (err || !user) {
      return res.status(404).send({
        status: "error",
        message: "no users available",
      });
    }

    return res.status(200).send({
      status: "success",
      user,
    });
  });
};

//update user in session
const updateUser = async (req, res) => {
  //user in session
  const userSession = req.user;
  //data new user
  const userUpdate = req.body;

  delete userSession.iat;
  delete userSession.exp;

  if (userUpdate.password) {
    //Encrypt password JWT
    const pwd = await bcrypt.hash(userUpdate.password, 10);
    userUpdate.password = pwd;
  } else {
    delete userUpdate.password;
  }

  if (userUpdate.name === "") {
    delete userUpdate.name;
  }

  if (userUpdate.nick === "") {
    delete userUpdate.nick;
  }

  if (userUpdate.email === "") {
    delete userUpdate.email;
  }

  if (userUpdate.image === "") {
    userUpdate.image = "default.png";
  }

  try {
    //method for find by id and update(id user, obj update, new update user)
    const userToUpdate = await User.findByIdAndUpdate(
      { _id: userSession.id },
      userUpdate,
      { new: true }
    ).select({ password: 0 });

    if (!userToUpdate) {
      return res.status(400).send({
        status: "error",
        message: "update fails",
      });
    }

    return res.status(200).send({
      status: "success",
      user: userToUpdate,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "update fails",
    });
  }
};

const uploadFile = async (req, res) => {
  const userSession = req.user;

  if (!req.file) {
    return res.status(404).send({
      status: "error",
      message: "upload not image",
    });
  }

  const img = req.file.originalname;

  const imgSplit = img.split(".");
  const ext = imgSplit[1];

  if (ext != "png" && ext != "jpg" && ext != "gif") {
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);

    return res.status(400).send({
      status: "error",
      message: "invalid file extend",
    });
  }

  User.findByIdAndUpdate(
    { _id: userSession.id },
    { image: req.file.filename },
    { new: true },
    (error, userUpdate) => {
      if (error || !userUpdate) {
        return res.status(500).send({
          status: "error",
          message: "error in update image",
        });
      }
      return res.status(200).send({
        message: "success",
        user: userUpdate,
        file: req.file,
      });
    }
  );
};

//return the image save in the data base
const avatar = (req, res) => {
  const file = req.params.file;
  const filePath = "./uploads/avatars/" + file;

  fs.stat(filePath, (error, exists) => {
    if (!exists) {
      return res.status(404).send({
        status: "error",
        message: "image does not exist",
      });
    }
    return res.sendFile(path.resolve(filePath));
  });
};

const count = async (req, res) => {
  //user in session
  const userSession = req.user.id || req.params.id;

  try {
    const following = await Follow.count({ user: userSession });

    const followed = await Follow.count({ followed: userSession });

    const publications = await publication.count({ user: userSession });

    return res.status(200).send({
      status: "success",
      userSession,
      following,
      followed,
      publications,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "no count",
    });
  }
};
module.exports = {
  exampleUser,
  register,
  login,
  getUser,
  listUser,
  updateUser,
  uploadFile,
  avatar,
  count,
};
