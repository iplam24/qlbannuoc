const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createPool({
    host: process.env.DB_SERVER,  // mysql là tên dịch vụ trong Docker Compose
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0,
    charset: 'utf8mb4'
});

connection.query('SELECT 1', (err, results) => {
  if (err) {
      console.error('Lỗi kết nối MySQL:', err);
  } else {
      console.log('Kết nối MySQL thành công!');
  }
});

module.exports=connection;