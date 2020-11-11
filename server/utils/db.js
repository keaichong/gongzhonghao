var mysql = require('mysql')

// 创建一个连接池，连接池中有多个连接
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'gongzhonghoa'
})
module.exports = pool