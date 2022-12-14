const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const multer = require("multer");

const { auth } = require("../middlewares/auth");

//config. upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatars/");
  },
  filename: (req, file, cb) => {
    cb(null, "avatar-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });

//Defi. routers
router.get("/prueba-user", auth, userController.exampleUser);
router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/getUser/:id", auth, userController.getUser);

//Paginacion opcional por query es decir http://localhost:3800/api/v1/user/list?limit=6&page=2
router.get("/list", auth, userController.listUser);
router.put("/update", auth, userController.updateUser);
router.post("/upload", [auth, uploads.single("file0")], userController.uploadFile);

module.exports = router;
