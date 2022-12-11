const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

//Defi. routers
router.get("/prueba-user", userController.exampleUser);

module.exports = router;
