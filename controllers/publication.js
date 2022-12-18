const Publication = require("../models/publication");

const fs = require("fs");
const path = require("path");

const examplePublication = (req, res) => {
  return res.status(200).send({
    message: "Message sent from: controllers/publication.js",
  });
};

//Save publication
const savePublication = (req, res) => {
  const { text, file } = req.body;
  const userSession = req.user;

  if (!text) {
    return res.status(400).send({
      status: "error",
      message: "missing data :( ",
    });
  }

  const publicationSave = new Publication({
    user: userSession.id,
    text,
    file,
  });

  publicationSave.save((error, publication) => {
    if (error || !publication) {
      return res.status(400).send({
        status: "error",
        message: "failed to save :( ",
      });
    }
    return res.status(200).send({
      message: "success",
      publication,
    });
  });
};

//get publication by id
const getPublicationById = (req, res) => {
  const id = req.params.id;

  Publication.findById(id, (error, publicationStore) => {
    if (error || !publicationStore) {
      return res.status(400).send({
        status: "error",
        message: "could not search",
      });
    }

    return res.status(200).send({
      message: "success",
      publication: publicationStore,
    });
  });
};

//Delete publication
const deletePublication = (req, res) => {
  const id = req.params.id;
  const userSession = req.user.id;

  Publication.find({ user: userSession, _id: id }).remove((error) => {
    if (error) {
      return res.status(500).send({
        status: "error",
        message: "could not search",
      });
    }

    return res.status(200).send({
      status: "success",
      message: "delete publication",
    });
  });
};

//get list publication of user session
const getPublicationList = (req, res) => {
  const userSession = req.user.id;
  const limit = parseInt(req.params.limit) || 20;
  const page = parseInt(req.params.page) || 1;

  Publication.paginate(
    { user: userSession },
    { limit, page },
    (error, publication) => {
      if (error || !publication) {
        return res.status(400).send({
          status: "error",
          message: "could not search",
        });
      }

      return res.status(200).send({
        message: "success",
        publication: publication,
      });
    }
  );
};

//get all publication
const getPublicationAll = (req, res) => {
  const limit = parseInt(req.params.limit) || 20;
  const page = parseInt(req.params.page) || 1;

  Publication.paginate({}, { limit, page }, (error, publication) => {
    if (error || !publication) {
      return res.status(400).send({
        status: "error",
        message: "could not search",
      });
    }

    return res.status(200).send({
      message: "success",
      publication: publication,
    });
  });
};

//Update publication
const updatePublication = (req, res) => {
  return res.status(200).send({
    message: "success",
  });
};

//Upload file
const uploadFile = async (req, res) => {
  const userSession = req.user;
  const publicationId = req.params.id;

  if (!req.file) {
    return res.status(404).send({
      status: "error",
      message: "upload not image",
    });
  }

  const img = req.file.originalname;

  const imgSplit = img.split(".");
  const ext = imgSplit[1];

  if (ext != "png" && ext != "jpg" && ext != "gif") {
    const filePath = req.file.path;
    const fileDeleted = fs.unlinkSync(filePath);

    return res.status(400).send({
      status: "error",
      message: "invalid file extend",
    });
  }

  Publication.findByIdAndUpdate(
    { user: userSession.id, _id: publicationId },
    { file: req.file.filename },
    { new: true },
    (error, publicationUpdate) => {
      if (error || !publicationUpdate) {
        return res.status(500).send({
          status: "error",
          message: "error in update image",
        });
      }
      return res.status(200).send({
        message: "success",
        publication: publicationUpdate,
        file: req.file,
      });
    }
  );
};

//return file (image)
const media = (req, res) => {
  const file = req.params.file;
  const filePath = "./uploads/publications/" + file;

  fs.stat(filePath, (error, exists) => {
    if (!exists) {
      return res.status(404).send({
        status: "error",
        message: "media does not exist",
      });
    }
    return res.sendFile(path.resolve(filePath));
  });
};




module.exports = {
  examplePublication,
  getPublicationAll,
  getPublicationById,
  getPublicationList,
  savePublication,
  updatePublication,
  deletePublication,
  uploadFile,
  media,
};
