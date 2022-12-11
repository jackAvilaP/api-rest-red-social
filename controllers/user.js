//Action example

const exampleUser = (req, res) => {
  return res.status(200).send({
    message: "Message sent from: controllers/user.js",
  });
};

module.exports = {
  exampleUser,
};
