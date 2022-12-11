const express = require("express");
const router = express.Router();
const followController = require("../controllers/follow");

//Defi. routers
router.get("/prueba-follow", followController.exampleFollow);

module.exports = router;
