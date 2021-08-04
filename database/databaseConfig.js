const mysql = require("../backend/node_modules/mysql");

var dbconnect = {
    getConnection: function () {
  
      var conn = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '#411Project',
        database: 'ades_ca3_p2020952',
        dateStrings: true
      });
  
      return conn;
    }
  };
  
  module.exports = dbconnect;