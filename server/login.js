/** 登录 */
var db = require('./db.js');

exports.checkLogin = function(req, res) {
	var sql = "SELECT * FROM login";
  db.pool.getConnection(function(err, connection) {
    if(err) {
      res.json({ resultsCode: 'error', message: '连接数据库失败' });
      console.log(err);
      return;
    }
    var array = [];
    connection.query(sql, array, function(err, results) {
      if(err) {
        res.json({ resultsCode: 'error', message: '查询login失败' });
        return;
      }
      // 前端传数据到这，取出数据库数据到这，直接做判断并且直接返回resultsCode
      var find = false;
      for(var i = 0; i < results.length; i++) {
        if(results[i].username === req.body.username) {
          if(results[i].userpword === req.body.userpword) {
            find = true;
            res.json({ resultsCode: 'success', message: '登录成功' });
            break;
          }
          else {
            find = true;
            res.json({ resultsCode: 'error', message: '登录失败' });
            break;
          }
        }
      }
      if(!find) {
        res.json({ resultsCode: 'warning', message: '登录失败' });
      }

      connection.release();
    });
  });
};