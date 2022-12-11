const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

//Routers
const UserRoutes = require("./routes/user");
const PublicationRoutes = require("./routes/publication");
const FollowRoutes = require("./routes/follow");

//Welcome
console.log("API NODE for RED SOCIAL Run !!");

//Conection bd
connection();

//Create sever node
const app = express();
const PORT = 3800;

//Config cors
app.use(cors());

//Convertion the data body in object js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Upload config routers
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/publication", PublicationRoutes);
app.use("/api/v1/follow", FollowRoutes);

//Route example
app.get("/ruta-prueba", (req, res) => {
  return res.status(200).json({
    id: 1,
    name: "jackson",
    email: "jackpower@hotmail.es",
  });
});

//Server listener riquest http
app.listen(PORT, () => {
  console.log(`server in Node run PORT: ${PORT}`);
});
