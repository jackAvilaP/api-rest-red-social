//import dependencies
const jwt = require("jwt-simple");
const moment = require("moment");

const secret = "My_seCrect_toKeN_paRa_AaPp_652341";

const createToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    surname: user.surname,
    nick: user.nick,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, "day").unix()
  };

  return jwt.encode(payload, secret);
};

module.exports = { 
  createToken, 
  secret 
};
