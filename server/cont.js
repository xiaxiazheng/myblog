/** 操作子节点内容 */
var db = require('./db.js');
var Common = require('./common.js');

// 查
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
              list: [{
                title: results[0].title,
                cont: results[0].cont,
                sort: results[0].sort,
                motifytime: results[0].mTime,
              }]
            };
            continue;
          }
          contObj.list.push({
            title: results[i].title,
            cont: results[i].cont,
            sort: results[i].sort,
            motifytime: results[i].mTime,
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

// 增
exports.addNodeCont = function(req, res) {
	var sql = "INSERT INTO cont VALUES (" + req.body.id + ", '" + Common.getNowFormatDate() + "', '请输入标题', '请输入内容'," + (req.body.sort + 1) +")";
  db.pool.getConnection(function(err, connection) {
    if(err) {
      console.log("连接数据库失败");
      console.log(err);
      return;
    }
    var array = [req.query.id];
    connection.query(sql, array, function(err, results) {
      if(err) {
        res.json({ resultsCode: 'error', message: '添加失败' })
        return;
      }
      res.json({ resultsCode: 'success', message: '添加成功' })

      connection.release();
    });
  });
};

// 改
exports.modifyNodeCont = function(req, res) {
  db.pool.getConnection(function(err, connection) {
    if(err) {
      console.log("连接数据库失败");
      console.log(err);
      return;
    }
    // 先取
    var sql1 = "SELECT * FROM cont WHERE c_id=? ORDER BY sort";
    var array1 = [req.body.id];
    connection.query(sql1, array1, function(err, results1) {
      if(err) {
        console.log("查询失败");
        return;
      }
      for(let i in results1) {
        // 后判断
        var sql2 = '';
        if(results1[i].title !== req.body.list[i] || results1.cont !== req.body.list[i].cont) {
          // 有修改就更新
          sql2 = "UPDATE cont SET mTime='" + Common.getNowFormatDate() + "', title=?, cont=? WHERE c_id=? && sort=?";
          var array2 = [req.body.list[i].title, req.body.list[i].cont, req.body.id, req.body.list[i].sort];
          connection.query(sql2, array2, function(err, results) {
            if(err) {
              console.log("查询失败");
              return;
            }
          });
        }
      }
      res.json({ resultsCode: 'success', message: '保存成功' });
      connection.release();
    });
  });
};

// 删
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