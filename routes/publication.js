const express = require("express");

const router = express.Router();

const { auth } = require("../middlewares/auth");
const multer = require("multer");
const publicationController = require("../controllers/publication");

//config. upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/publications/");
  },
  filename: (req, file, cb) => {
    cb(null, "pub-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });

//Defi. routers
router.get("/prueba-publication", publicationController.examplePublication);
router.post("/save", auth, publicationController.savePublication);
router.get("/detail/:id", auth, publicationController.getPublicationById);
router.delete("/delete/:id", auth, publicationController.deletePublication);
router.get(
  "/list-user/:page?/:limit?",
  auth,
  publicationController.getPublicationList
);
router.get(
  "/list-all/:page?/:limit?",
  auth,
  publicationController.getPublicationAll
);

router.post(
  "/oupload/:id",
  [auth, uploads.single("file0")],
  publicationController.uploadFile
);

router.post("/media/:file", publicationController.media);

module.exports = router;
