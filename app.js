require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./config/db/db");

// for image is folder is not exist
var fs = require("fs");
var dir = "./public/uploads";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const users = require("./routes/usersRoute");

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// app.use('/uploads',express.static('uploads'));
app.use("/", express.static("public/uploads"));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

app.use("/api/v1/users", users);

//never turn to true otherwise db will delete and create again
db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and re-sync Database.");
});

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
