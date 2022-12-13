const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

const { auth } = require("../middlewares/auth");

//Defi. routers
router.get("/prueba-user", auth, userController.exampleUser);
router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/getUser/:id", auth, userController.getUser);
//Paginacion opcional
router.get("/listUser/:page?", auth, userController.listUser);

module.exports = router;
