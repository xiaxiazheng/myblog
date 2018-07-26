/** 操作树 */
var db = require('./db.js');
var Common = require('./common.js');

// 查
exports.getTree = function(req, res) {
  db.pool.getConnection(function(err, connection) {
    if(err) {
      console.log("连接数据库失败");
      console.log(err);
      return;
    }
    var sql = "SELECT * FROM tree ORDER BY f_sort, c_sort";
    var array = [];
    connection.query(sql, array, function(err, results) {
      if(err) {
        console.log("查询失败");
        return;
      }
      let list = [];
      for(let i in results) {
        let find = false;
        if(i !== 0) {
          for(let j in list) {
            if(list[j].id === results[i].f_id) {
              list[j].children.push({
                id: results[i].c_id,
                label: results[i].c_label,
                sort: results[i].c_sort
              });
              find = true;
              break;
            }
          }
        }
        if(!find) {
          list.push({
            id: results[i].f_id,
            label: results[i].f_label,
            sort: results[i].f_sort,
            children: [{
              id: results[i].c_id,
              label: results[i].c_label,
              sort: results[i].c_sort,
            }]
          });
        }
      }
      res.json(list);

      connection.release();
    });
  });
};

// 增
exports.addTreeNode = function(req, res) {
  db.pool.getConnection(function(err, connection) {
    if(err) {
      console.log("连接数据库失败");
      console.log(err);
      return;
    }
    var sql = '';
    var newchildId = Common.getRandomNum();
    if(req.query.isLeaf === 'false') { // 若是父节点
      sql = "INSERT INTO tree VALUES (" + Common.getRandomNum() + ", 'newNode', " + (req.query.sort + 1) + ", " + newchildId + ", 'newChildNode', " + 1 + ")";
    } else { // 若是子节点
      sql = "INSERT INTO tree VALUES (" + req.query.id + ", '" + req.query.label + "', " + req.query.f_sort + ", " + newchildId + ", 'newChildNode', " + (req.query.c_sort + 1) + ")";
    }
    var array = [];
    connection.query(sql, array, function(err, results) {
      if(err) {
        console.log("查询失败1");
        return;
      }
      var sql1 = "INSERT INTO cont VALUES(" + newchildId + ", '" + Common.getNowFormatDate() + "', '标题一', '内容一', 1)";
      var array1 = [];
      connection.query(sql1, array1, function(err, results) {
        if(err) {
          console.log("查询失败2");
          return;
        }
        res.json({ resultsCode:'success', message:'添加成功' });
        connection.release();
      });
    });
  });
};

// 改
exports.modifyTreeNode = function(req, res) {
  db.pool.getConnection(function(err, connection) {
    if(err) {
      console.log("连接数据库失败");
      console.log(err);
      return;
    }
    var sql = '';
    if(req.query.isLeaf) {
      sql = "UPDATE tree SET c_label=? WHERE c_id=?";
    } else {
      sql = "UPDATE tree SET f_label=? WHERE f_id=?";
    }
    var array = [req.query.label, req.query.id];
    connection.query(sql, array, function(err, results) {
      if(err) {
        console.log("查询失败");
        return;
      }
      res.json({ resultsCode:'success', message:'修改成功' });

      connection.release();
    });
  });
};

// 删
exports.deleteTreeNode = function(req, res) {
  db.pool.getConnection(function(err, connection) {
    if(err) {
      console.log("连接数据库失败");
      console.log(err);
      return;
    }
    if(req.query.isLeaf == 'false') { // 若为父节点
      // 先找到该父节点的所有子节点
      var sql = "SELECT c_id FROM tree WHERE f_id=?";
      var array = [req.query.id];
      connection.query(sql, array, function(err, results) {
        if(err) {
          res.json({ resultsCode: 'error', message: err.message })
          return;
        }
        // 再根据子节点id逐个逐个删除子节点的具体信息
        for(let i in results) {
          var sql2 = "DELETE FROM cont WHERE c_id=?";
          var array2 = [results[i].c_id];
          connection.query(sql2, array2, function(err, results) {
            if(err) {
              res.json({ resultsCode: 'error', message: err.message })
              return;
            }
          });
        }
      });
      // 最后删除树上的该父节点及其子节点
      var sql = "DELETE FROM tree WHERE f_id=?";
      var array = [req.query.id];
      connection.query(sql, array, function(err, results) {
        if(err) {
          res.json({ resultsCode: 'error', message: err.message })
          return;
        }
        res.json({ resultsCode: 'success', message: '删除成功' })
        connection.release();
      });
    } else { // 若为子节点
      // 删除该子节点的具体信息
      var sql = "DELETE FROM cont WHERE c_id=?";
      var array = [req.query.id];
      connection.query(sql, array, function(err, results) {
        if(err) {
          res.json({ resultsCode: 'error', message: err.message })
          return;
        }
      });
      // 删除树上的点
      var sql = "DELETE FROM tree WHERE c_id=?";
      connection.query(sql, array, function(err, results) {
        if(err) {
          res.json({ resultsCode: 'error', message: err.message })
          return;
        }
        res.json({ resultsCode:'success', message:'删除成功' });

        connection.release();
      });
    }
  });
};