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
  },

  addCustomer: async(req, res) => {
    let MaKhachHang = Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
    let TenKhachHang = req.body.TenKhachHang;
    let SDT = req.body.SDT;
    let Email = req.body.Email;
    let CMND = req.body.CMND;
    let server = req.body.server;
    let MaNhanVien = req.body.MaNhanVien;
    let NgaySinh = req.body.NgaySinh;
    let GioiTinh = req.body.GioiTinh;

    let status = 200;
    let message = 0;
    let data;

    if(!MaNhanVien || !server) {
      status = 400;
      message = "Access denied";
    }
    else {
      let serverName = `sqlServer${server}`.replaceAll("\"", "");
      let sql = `INSERT INTO KhachHang(MaKhachHang, TenKhachHang, SDT, Email, CMND, NgaySinh, GioiTinh) VALUES ('${MaKhachHang}', '${TenKhachHang}', '${SDT}', '${Email}', '${CMND}', '${NgaySinh}', '${GioiTinh}')`;
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

  addFlight: async(req, res) => {
    let MaChuyenBay = Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    let MaMayBay = req.body.MaMayBay;
    let ThoiGian = req.body.ThoiGian;
    let MaSanBayDi = req.body.MaSanBayDi;
    let MaSanBayDen = req.body.MaSanBayDen;
    let server = req.body.server;
    let MaNhanVien = req.body.MaNhanVien;
    let HeSoVe = 1;

    let status = 200;
    let message = 0;
    let data;

    if(!MaNhanVien || !server) {
      status = 400;
      message = "Access denied";
    }
    else {
      let serverName = `sqlServer${server}`.replaceAll("\"", "");
      let sql = `INSERT INTO ChuyenBay(MaChuyenBay, MaMayBay, ThoiGian, MaSanBayDi, MaSanBayDen, HeSoVe) VALUES ('${MaChuyenBay}', '${MaMayBay}', CONVERT(datetime, '${ThoiGian}'), '${MaSanBayDi}', '${MaSanBayDen}', ${HeSoVe})`;
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

  deleteFlight: async(req, res) => {
    let MaChuyenBay = req.body.MaChuyenBay;
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
      let sql = `DELETE from ChuyenBay WHERE MaChuyenBay = '${MaChuyenBay}'`;
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

  addAirport: async(req, res) => {
    let MaSanBay = req.body.MaSanBay;
    let TenSanBay = req.body.TenSanBay;
    let DiaChi = req.body.DiaChi;
    let server = req.body.MaDonViBan;
    let SoDuongBang = req.body.SoDuongBang;
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
      let sql = `INSERT INTO SanBay(MaSanBay, TenSanBay, DiaChi, SoDuongBang) VALUES ('${MaSanBay}', '${TenSanBay}', '${DiaChi}', ${SoDuongBang})`;
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

  deleteAirport: async(req, res) => {
    let MaSanBay = req.body.MaSanBay;
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
      let sql = `DELETE  from SanBay WHERE MaSanBay = '${MaSanBay}'`;
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

  updateAirport: async(req, res) => {
    let MaSanBay = req.body.MaSanBay;
    let TenSanBay = req.body.TenSanBay;
    let DiaChi = req.body.DiaChi;
    let server = req.body.server;
    let SoDuongBang = req.body.SoDuongBang;
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
      let sql = `UPDATE SanBay SET TenSanBay = '${TenSanBay}', DiaChi = '${DiaChi}', SoDuongBang = '${SoDuongBang}' WHERE MaSanBay LIKE '${MaSanBay}'`;
      // console.log(sql);
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

  addEmployee: async(req, res) => {
    let TenNhanVien = req.body.TenNhanVien;
    let NgaySinh = req.body.NgaySinh;
    let QueQuan = req.body.QueQuan;
    let server = req.body.server.replaceAll("\"", "");
    let SoCMND = req.body.SoCMND;
    let MaNhanVien = req.body.MaNhanVien;

    let TenDangNhap = req.body.TenDangNhap;
    let MatKhau = req.body.MatKhau;
    let MaNhanVienThem = Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .toUpperCase();

    let status = 200;
    let message = 0;

    let data;
    if(!MaNhanVien || !server) {
      status = 400;
      message = "Access denied";
    }
    else {
      let serverName = `sqlServer${server}`;
      let sql = `INSERT INTO NhanVien(MaNhanVien, MaDonViBan, TenNhanVien, NgaySinh, QueQuan, SoCMND) VALUES ('${MaNhanVienThem}', 'DV${server}', N'${TenNhanVien}', '${NgaySinh}', N'${QueQuan}', '${SoCMND}')`;
      try {
        let result = await req.app.locals.db[serverName].query(sql);
        if(result.rowsAffected[0] > 0) {
          sql = `INSERT INTO TaiKhoan(MaNhanVien, TenDangNhap, MatKhau) VALUES ('${MaNhanVienThem}', '${TenDangNhap}', '${sha256(MatKhau)}')`;
          result = await req.app.locals.db[serverName].query(sql);
          if(result.rowsAffected[0] > 0) {
            data = result.recordset;
            message = 1;
          }
        }
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

  deleteEmployee: async(req, res) => {
    let MaNhanVien = req.body.MaNhanVien;
    let MaNhanVienDelete = req.body.MaNhanVienDelete;
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
      
      let sql = `DELETE FROM NhanVien WHERE MaNhanVien = '${MaNhanVienDelete}'`;
      try {
        let result = await req.app.locals.db[serverName].query(sql);
        if(result.rowsAffected[0] > 0) {
          sql = `DELETE FROM TaiKhoan WHERE MaNhanVien = '${MaNhanVienDelete}'`;
          result = await req.app.locals.db[serverName].query(sql);
          if(result.rowsAffected[0] > 0) {
            data = result.recordset;
            message = 1;
          }
        }
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

  updateEmployee: async(req, res) => {
    let TenNhanVien = req.body.TenNhanVien;
    let NgaySinh = req.body.NgaySinh;
    let QueQuan = req.body.QueQuan;
    let server = req.body.server.replaceAll("\"", "");
    let SoCMND = req.body.SoCMND;
    let MaNhanVien = req.body.MaNhanVien;

    let TenDangNhap = req.body.TenDangNhap;
    let MatKhau = req.body.MatKhau;
    let MaNhanVienUpdate = req.body.MaNhanVienUpdate

    let status = 200;
    let message = 0;

    let data;

    if(!MaNhanVien || !server) {
      status = 400;
      message = "Access denied";
    }
    else {
      let serverName = `sqlServer${server}`;
      let sql = `UPDATE NhanVien SET TenNhanVien = N'${TenNhanVien}', NgaySinh = '${NgaySinh}', QueQuan = N'${QueQuan}', SoCMND = '${SoCMND}' WHERE MaNhanVien = '${MaNhanVienUpdate}'`;
      try {
        let result = await req.app.locals.db[serverName].query(sql);
        if(result.rowsAffected[0] > 0) {
          sql = `UPDATE TaiKhoan SET TenDangNhap = '${TenDangNhap}', MatKhau = '${sha256(MatKhau)}' WHERE MaNhanVien = '${MaNhanVienUpdate}'`;
          result = await req.app.locals.db[serverName].query(sql);
          if(result.rowsAffected[0] > 0) {
            data = result.recordset;
            message = 1;
          }
        }
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

  addPlane: async(req, res) => {
    let MaMayBay = Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
    let TenMayBay = req.body.TenMayBay;
    let SoGheLoai1 = req.body.SoGheLoai1;
    let SoGheLoai2 = req.body.SoGheLoai2;
    let HangSanXuat = req.body.HangSanXuat;
    let server = req.body.server;
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
      let sql = `INSERT INTO MayBay(MaMayBay, TenMayBay, SoGheLoai1, SoGheLoai2, HangSanXuat) VALUES ('${MaMayBay}', '${TenMayBay}', '${SoGheLoai1}', ${SoGheLoai2}, '${HangSanXuat}')`;
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

  deletePlane: async(req, res) => {
    let MaMayBay = req.body.MaMayBay;
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
      let sql = `DELETE from MayBay WHERE MaMayBay = '${MaMayBay}'`;
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

  updatePlane: async(req, res) => {
    let MaMayBay = req.body.MaMayBay;
    let TenMayBay = req.body.TenMayBay;
    let SoGheLoai1 = req.body.SoGheLoai1;
    let SoGheLoai2 = req.body.SoGheLoai2;
    let HangSanXuat = req.body.HangSanXuat;
    let MaNhanVien = req.body.MaNhanVien;
    let server = req.body.server;

    console.log(req.body)
    let status = 200;
    let message = 0;
    let data;

    if(!MaNhanVien || !server) {
      status = 400;
      message = "Access denied";
    }
    else {
      let serverName = `sqlServer${server}`.replaceAll("\"", "");
      let sql = `UPDATE MayBay SET TenMayBay = '${TenMayBay}', SoGheLoai1 = '${SoGheLoai1}', SoGheLoai2 = '${SoGheLoai2}', HangSanXuat = '${HangSanXuat}' WHERE MaMayBay LIKE '${MaMayBay}'`;
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

}