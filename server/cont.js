/** 操作子节点内容 */
var db = require('./db.js');

exports.getNodeCont = function(req, res) {
	var sql = "SELECT * FROM cont WHERE c_id=? ORDER BY sort";
  db.pool.getConnection(function(err, connection) {
    if(err) {
      console.log("连接数据库失败");
      console.log(err);
      return;
    }
    var array = [req.query.id];
    connection.query(sql, array, function(err, results) {
      if(err) {
        console.log("查询失败");
        return;
      }
      if(results.length !== 0) {
        var contObj = {};
        for(let i in results) {
          if(i == 0) {
            contObj = {
              id: results[0].c_id,
              motifytime: results[0].mTime,
              list: [{
                title: results[0].title,
                cont: results[0].cont,
                sort: results[0].sort,
              }]
            };
            continue;
          }
          contObj.list.push({
            title: results[i].title,
            cont: results[i].cont,
            sort: results[i].sort,
          });
        }
        res.json(contObj);
      } else {
        res.json({ resultsCode: 'error', message: '没找到子节点数据' })
      }

      connection.release();
    });
  });
};
// exports.deleteNodeCont = function(req, res) {
// 	var sql = "DELETE * FROM cont WHERE c_id=?";
//   db.pool.getConnection(function(err, connection) {
//     if(err) {
//       console.log("连接数据库失败");
//       console.log(err);
//       return;
//     }
//     var array = [req.query.id];
//     connection.query(sql, array, function(err, results) {
//       if(err) {
//         res.json({ resultsCode: 'error', message: err.message })
//         return;
//       }
//       res.json({ resultsCode: 'success', message: '删除成功' })

//       connection.release();
//     });
//   });
// };