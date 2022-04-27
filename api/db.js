const sql = require("mssql/msnodesqlv8");

const connectionStringServer1 = `Driver=msnodesqlv8;Server=${process.env.DB_HOST}\\SQLSERVER1,8001;Database=${process.env.DB_NAME};UID=${process.env.DB_USER};PWD=${process.env.DB_PWD};Encrypt=false;TrustServerCertificate=True`;
const connectionStringServer2 = `Driver=msnodesqlv8;Server=${process.env.DB_HOST}\\SQLSERVER2,1435;Database=${process.env.DB_NAME};UID=${process.env.DB_USER};PWD=${process.env.DB_PWD};Encrypt=false;TrustServerCertificate=True`;
const connectionStringServer3 = `Driver=msnodesqlv8;Server=${process.env.DB_HOST}\\SQLSERVER3,1436;Database=${process.env.DB_NAME};UID=${process.env.DB_USER};PWD=${process.env.DB_PWD};Encrypt=false;TrustServerCertificate=True`;
const sqlServer1 = new sql.ConnectionPool(connectionStringServer1);
const sqlServer2 = new sql.ConnectionPool(connectionStringServer2);
const sqlServer3 = new sql.ConnectionPool(connectionStringServer3);

module.exports = {
  sqlServer1,
  sqlServer2,
  sqlServer3,
};
