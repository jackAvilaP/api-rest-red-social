const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const followController = require("../controllers/follow");

//Defi. routers
router.get("/prueba-follow", followController.exampleFollow);
router.post("/save", auth, followController.saveFollow);
router.delete("/delete/:id", auth, followController.stopFollow);
router.get("/list/:id?/:page?/:limit?", auth, followController.listFollowing);
router.get("/mefollow/:id?/:page?/:limit?", auth, followController.meFollow);

module.exports = router;
