'use strict';
const sha256 = require('sha256');
module.exports = {
  login: (req, res) => {
    if(!req.body.username || !req.body.password || !req.body.server) {
      res.status(200).send({ 
        status: false,
        message: 'Username or password is incorrect'
      });
      return;
    }
    let serverName = `sqlServer${req.body.server}`;
    let sql = req.app.locals.db[serverName];
    let sqlQuery = `SELECT * FROM dbo.TaiKhoan WHERE TenDangNhap = '${req.body.username}' AND MatKhau = '${sha256(req.body.password)}'`;
    sql.query(sqlQuery)
    .then((result) => {
        if (result.recordset.length > 0) {
          res.status(200).send({
            MaNhanVien: result.recordset[0].MaNhanVien,
            status: true,
            message: "Login successfully",
          });
        } else {
          res.status(200).send({ 
            status: false,
            message: 'Username or password is incorrect'
          });
        }
    })
    .catch((err) => {
      if (err) {
        res.status(500).send({ 
          status: false,
          message: err 
        });
      }
    });
  },


  addTicket: async(req, res) => {
    let MaVe = Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
    let MaChuyenBay = req.body.MaChuyenBay;
    let MaLoaiVe = req.body.MaLoaiVe;
    let server = req.body.MaDonViBan;
    let MaKhachHang = req.body.MaKhachHang;
    let ThoiGianLap = req.body.ThoiGianLap;
    let TrangThai = req.body.TrangThai;
    let MaNhanVien = req.body.MaNhanVien;

    let status = 200;
    let message = 0;
    let data;

    if(!MaNhanVien || !server) {
      status = 400;
      message = "Access denied";
    }
    else {
      let serverName = `sqlServer${server}`.replaceAll("\"", "");
      let DonViBan = `DV${server}`.replaceAll("\"", "");

      let giaVeGoc = await req.app.locals.db[serverName].query(`SELECT GiaVeGoc FROM LoaiVe WHERE MaLoaiVe LIKE '${MaLoaiVe}'`);
      let heSo = await req.app.locals.db[serverName].query(`SELECT HeSoVe FROM ChuyenBay WHERE MaChuyenBay LIKE '${MaChuyenBay}'`);
      if(giaVeGoc.recordset.length < 1 || heSo.recordset.length < 1) {
        data = null;
        message = 0;
      }
      else {
        heSo = heSo.recordset[0].HeSoVe;
        giaVeGoc = giaVeGoc.recordset[0].GiaVeGoc;
        let GiaVe = heSo * giaVeGoc;
        let sql = `INSERT INTO Ve(Mave, MaChuyenBay, MaLoaiVe, GiaVe, MaDonViBan, MaKhachHang, ThoiGianLap, TrangThaiVe) VALUES ('${MaVe}', '${MaChuyenBay}', '${MaLoaiVe}', ${GiaVe}, '${DonViBan}', '${MaKhachHang}', '${ThoiGianLap}', '${TrangThai}')`;
        try {
          let result = await req.app.locals.db[serverName].query(sql);
          data = result.recordset;
          message = 1;
        } catch (err) {
          console.log(err)
          status = 500;
          message = 0;
        }
        res.status(status).send({
          message
        });
      }

    }
  },


  deleteTicket: async(req, res) => {
      let MaVe = req.body.MaVe;
      let MaNhanVien = req.body.MaNhanVien;
      let server = req.body.server;
      let status = 200;
      let message = 0;
      let data;
  
      if(!MaNhanVien || !server) {
        status = 400;
        message = "Access denied";
      }
      else {
        let serverName = `sqlServer${server}`.replaceAll("\"", "");
        let sql = `DELETE  from Ve WHERE MaVe = '${MaVe}'`;
        try {
          let result = await req.app.locals.db[serverName].query(sql);
          data = result.recordset;
          message = 1;
        } catch (err) {
          console.log(err)
          status = 500;
          message = 0;
        }
        res.status(status).send({
          message
        });
      }
  },

  updateTicket: async(req, res) => {
    let MaChuyenBay = req.body.MaChuyenBay;
    let MaLoaiVe = req.body.MaLoaiVe;
    let TrangThai = req.body.TrangThai;
    let MaVe = req.body.MaVe;
    let MaNhanVien = req.body.MaNhanVien;
    let server = req.body.server;
    let status = 200;
    let message = 0;
    let data;

    if(!MaNhanVien || !server) {
      status = 400;
      message = "Access denied";
    }
    else {
      let serverName = `sqlServer${server}`.replaceAll("\"", "");
      let giaVeGoc = await req.app.locals.db[serverName].query(`SELECT GiaVeGoc FROM LoaiVe WHERE MaLoaiVe LIKE '${MaLoaiVe}'`);
      let heSo = await req.app.locals.db[serverName].query(`SELECT HeSoVe FROM ChuyenBay WHERE MaChuyenBay LIKE '${MaChuyenBay}'`);
      if(giaVeGoc.recordset.length < 1 || heSo.recordset.length < 1) {
        data = null;
        message = 0;
      }
      else {
        let serverName = `sqlServer${server}`.replaceAll("\"", "");
        heSo = heSo.recordset[0].HeSoVe;
        giaVeGoc = giaVeGoc.recordset[0].GiaVeGoc;
        let GiaVe = heSo * giaVeGoc;
        let sql = `UPDATE Ve SET MaLoaiVe = '${MaLoaiVe}', GiaVe = '${GiaVe}', TrangThaiVe = '${TrangThai}' WHERE MaVe LIKE '${MaVe}'`;
        try {
          let result = await req.app.locals.db[serverName].query(sql);
          data = result.recordset;
          message = 1;
        } catch (err) {
          console.log(err)
          status = 500;
          message = 0;
        }
        res.status(status).send({
          message
        });
      }
    }
}
}