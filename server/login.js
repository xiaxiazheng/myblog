/** 登录 */
var db = require('./db.js');

exports.checkLogin = function(req, res) {
	var sql = "SELECT * FROM login";
  db.pool.getConnection(function(err, connection) {
    if(err) {
      console.log("连接数据库失败");
      console.log(err);
      return;
    }
    var array = [];
    connection.query(sql, array, function(err, results) {
      if(err) {
        console.log("查询失败");
        return;
      }
      // 前端传数据到这，取出数据库数据到这，直接做判断并且直接返回resultsCode
      var find = false;
      for(var i = 0; i < results.length; i++) {
        if(results[i].username === req.body.username) {
          if(results[i].userpword === req.body.userpword) {
            find = true;
            res.json({ resultsCode: 'success' });
            break;
          }
          else {
            find = true;
            res.json({ resultsCode: 'error' });
            break;
          }
        }
      }
      if(!find) {
        res.json({ resultsCode: 'warning' });
      }

      connection.release();
    });
  });
};