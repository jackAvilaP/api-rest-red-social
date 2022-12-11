const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publication");

//Defi. routers
router.get("/prueba-publication", publicationController.examplePublication);

module.exports = router;
