require("dotenv").config();
const sql = require("mssql/msnodesqlv8");
const sqlConfig = require("./api/db");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const route = require("./api/routes");

(async () => {
  
  let app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  route(app);

  app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + " not found" });
  });

  let port = process.env.PORT || 8000;
  let host = process.env.HOST || "localhost";

  sqlConfig.sqlServer1 = await sqlConfig.sqlServer1.connect();
  sqlConfig.sqlServer2 = await sqlConfig.sqlServer2.connect();
  sqlConfig.sqlServer3 = await sqlConfig.sqlServer3.connect();

  app.locals.db = sqlConfig;


  app.listen(port, () => {
    console.log("RESTful API server started on: http://%s:%s", host, port);
  });
})();
