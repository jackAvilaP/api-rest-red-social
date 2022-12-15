const Follow = require("../models/follow");
const User = require("../models/user");

const exampleFollow = (req, res) => {
  return res.status(200).send({
    message: "Message sent from: controllers/follow.js",
  });
};

//save follow(seguir)
const saveFollow = (req, res) => {
  const { followed } = req.body;
  const userSession = req.user.id;

  const newFollow = new Follow({
    user: userSession,
    followed,
  });

  newFollow.save((error, followeStore) => {
    if (error || !followeStore) {
      return res.status(400).send({
        status: "error",
        message: "Error save follow",
      });
    }

    return res.status(200).send({
      status: "success",
      follow: followeStore,
    });
  });
};

//stop following
const stopFollow = (req, res) => {
  const userSession = req.user.id;
  const followedId = req.params.id;

  Follow.find({
    user: userSession,
    followed: followedId,
  }).remove((error, followDelete) => {
    if (error || !followDelete) {
      return res.status(400).send({
        status: "error",
        message: "Error save follow",
      });
    }
    return res.status(200).send({
      status: "success",
      message: "Followed delete",
    });
  });
};

//list of users i`m following
const listFollowing = (req, res) => {
  const userSession = req.user.id;

  const limit = parseInt(req.query.limit, 10) || 15;
  const page = parseInt(req.query.page, 10) || 1;

  Follow.paginate({ user: userSession }, { limit, page }, (error, follow) => {

    if (error || !follow) {
      return res.status(404).send({
        status: "error",
        message: "no follow",
      });
    }
    return res.status(200).send({
      status: "success",
      follow,
    });
  });

  // Follow.find({
  //   user: userSession,
  // }).exec((error, getFollow) => {
  //   if (error || !getFollow) {
  //     return res.status(400).send({
  //       status: "error",
  //       message: "Error list of users i`m following",
  //     });
  //   }
  //   return res.status(200).send({
  //     status: "success",
  //     getFollow,
  //   });
  // });
};

// list of users who follow me
const meFollow = (req, res) => {
  const userSession = req.user.id;

  Follow.find({
    followed: userSession,
  }).exec((error, getFollow) => {
    if (error || getFollow) {
      return res.status(400).send({
        status: "error",
        message: "Error list of users who follow me",
      });
    }
    return res.status(200).send({
      status: "success",
      getFollow,
    });
  });
};

module.exports = {
  exampleFollow,
  saveFollow,
  stopFollow,
  listFollowing,
  meFollow,
};
