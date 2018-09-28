/** 操作子节点内容 */
var db = require('./db.js');
var Common = require('./common.js');

// 查
exports.getNodeCont = function(req, res) {
	var sql = "SELECT * FROM cont WHERE c_id=? ORDER BY sort";
  db.pool.getConnection(function(err, connection) {
    if(err) {
      res.json({ resultsCode:'error', message:'连接数据库失败' });
      console.log(err);
      return;
    }
    var array = [req.query.id];
    connection.query(sql, array, function(err, results) {
      if(err) {
        res.json({ resultsCode:'error', message:'查询cont失败' });
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
                cont: results[0].cont.replace(/<br\/>/g, "\n"),
                sort: results[0].sort,
                createtime: results[0].cTime,
                motifytime: results[0].mTime,
                filename: results[0].filename
              }]
            };
            continue;
          }
          contObj.list.push({
            title: results[i].title,
            cont: results[i].cont.replace(/<br\/>/g, "\n"),
            sort: results[i].sort,
            createtime: results[i].cTime,
            motifytime: results[i].mTime,
            filename: results[i].filename
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
  let time = Common.getNowFormatDate();
	var sql = "INSERT INTO cont VALUES (" + req.body.id + ", '" + time + "', '" + time + "', '请输入标题', '请输入内容'," + (parseInt(req.body.sort) + 1) +", '')";
  db.pool.getConnection(function(err, connection) {
    if(err) {
      res.json({ resultsCode:'error', message:'连接数据库失败' });
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
      res.json({ resultsCode:'error', message:'连接数据库失败' });
      console.log(err);
      return;
    }
    // 先取
    var sql1 = "SELECT * FROM cont WHERE c_id=? ORDER BY sort";
    var array1 = [req.body.id];
    connection.query(sql1, array1, function(err, results1) {
      if(err) {
        res.json({ resultsCode:'error', message:'查询cont失败' });
        return;
      }
      let isUpdate = false;
      for(let i in results1) {
        // 后判断
        let cont = req.body.list[i].cont.replace(/\n|\r\n/g, "<br/>");  // 处理换行再对比，对比统一用<br/>
        if(results1[i].title != req.body.list[i].title || results1[i].cont != cont) {
          // 有修改就更新
          var sql2 = "UPDATE cont SET mTime='" + Common.getNowFormatDate() + "', title=?, cont=? WHERE c_id=? && sort=?";
          var array2 = [req.body.list[i].title, cont, req.body.id, req.body.list[i].sort];
          connection.query(sql2, array2, function(err, results) {
            if(err) {
              res.json({ resultsCode:'error', message:'查询cont失败' });
              return;
            }
          });
          isUpdate = true;
        }
      }
      if(isUpdate) {
        res.json({ resultsCode: 'success', message: '修改保存成功' });
      } else {
        res.json({ resultsCode: 'success', message: '当前页面无修改' });
      }
      connection.release();
    });
  });
};

// 删
exports.deleteNodeCont = function(req, res) {
  db.pool.getConnection(function(err, connection) {
    if(err) {
      res.json({ resultsCode:'error', message:'连接数据库失败' });
      console.log(err);
      return;
    }
    var sql = "DELETE FROM cont WHERE c_id=? && sort=?";
    var array = [req.query.id, req.query.sort];
    connection.query(sql, array, function(err, results) {
      if(err) {
        res.json({ resultsCode: 'error', message: err.message })
        return;
      }
      res.json({ resultsCode: 'success', message: '删除成功' })

      connection.release();
    });
  });
};

// 交换顺序，上移或下移
exports.changeSort = function(req, res) {
  db.pool.getConnection(function(err, connection) {
    if(err) {
      res.json({ resultsCode:'error', message:'连接数据库失败' });
      console.log(err);
      return;
    }
    var sql1 = "UPDATE cont SET sort=? WHERE cTime=?";
      var array1 = [req.query.otherSort, req.query.thiscTime];
      connection.query(sql1, array1, function(err, results) {
        if(err) {
          res.json({ resultsCode:'error', message:'查询cont失败' });
          return;
        }
        var sql2 = "UPDATE cont SET sort=? WHERE cTime=?";
        var array2 = [req.query.thisSort, req.query.othercTime];
        connection.query(sql2, array2, function(err, results) {
          if(err) {
            res.json({ resultsCode:'error', message:'查询cont失败' });
            return;
          }
          res.json({ resultsCode: 'success', message: '移动成功' })
          connection.release();
        });
      });
  });
};