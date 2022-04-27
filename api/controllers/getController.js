'use strict';
module.exports = {
  getData: async (req, res) => {
    let name = req.params.name;
    let maNhanVien = req.body.MaNhanVien;
    let server = req.body.server;
    let status = 200;
    let message = "";
    let data;
    if(!name) {
      status = 400;
      message = "Missing parameter";
    }
    else if(!maNhanVien || !server) {
      status = 400;
      message = "Access denied";
    }
    else {
      let serverName = `sqlServer${server}`.replaceAll("\"", "");
      let sql = `SELECT * FROM ${name}`;
      // console.log(serverName)
      try {
        let result = await req.app.locals.db[serverName].query(sql);
        data = result.recordset;
        data.forEach(row => {
          for (const key in row) {
            if(Buffer.isBuffer(row[key])) {
              console.log(new Date(row[key].readDoubleBE()))
              // row[key] = new Date(row[key])
            }
          }
        });
        message = "Success";
      }
      catch(err) {
        console.log(err)
        status = 500;
        message = err;
      };
    }
    res.status(status).send({
      message,
      data
    });
  }
}