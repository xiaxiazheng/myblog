/** 数据库信息配置 */
var mysql = require('mysql');

var pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "zybzyb",
	database: "graduation",
	post: 3306,
});

exports.pool = pool;
