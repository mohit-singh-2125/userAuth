const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const DB = require("./config/mysql");
const { PORT } = process.env;
const app = express();

app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});

process
  .on("unhandledRejection", (err) => {
    console.log("unhandledRejection", err);
  })
  .on("unhandledException", (err) => {
    console.log("unhandledException", err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
DB.bootstrap();

app.use("/tvisha/", routes);

module.exports = app;
