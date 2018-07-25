/** 数据库信息配置 */
var mysql = require('mysql');

var pool = mysql.createPool({
	host: "123.207.5.131", // 服务器地址
	user: "root",
	password: "zybzyb",
	database: "myblog",
	post: 3306,
});

exports.pool = pool;
