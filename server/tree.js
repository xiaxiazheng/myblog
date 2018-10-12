/** 操作树 */
var db = require('./db.js');
var Common = require('./common.js');

// 查
exports.getTree = function(req, res) {
  db.pool.getConnection(function(err, connection) {
    if(err) {
      res.json({ resultsCode:'error', message:'连接数据库失败' });
      console.log(err);
      return;
    }
    var sql1 = "SELECT * FROM category ORDER BY sort";
    var array1 = [];
    connection.query(sql1, array1, function(err, res1) {
      if(err) {
        res.json({ resultsCode:'error', message:'查找失败，操作categroy失败' });
        return;
      }
      var sql2 = "SELECT * FROM tree ORDER BY f_sort, c_sort";
      var array2 = [];
      connection.query(sql2, array2, function(err, res2) {
        if(err) {
          res.json({ resultsCode:'error', message:'查找失败，操作tree失败' });
          return;
        }
        /* 先把tree里的二级树整理好 */
        let list = [];
        for(let i in res2) {
          let find = false;
          if(i !== 0) {
            for(let j in list) {
              if(list[j].id === res2[i].f_id) {
                list[j].children.push({
                  id: res2[i].c_id,
                  label: res2[i].c_label,
                  sort: res2[i].c_sort,
                  category_id: res2[i].category_id
                });
                find = true;
                break;
              }
            }
          }
          if(!find) {
            list.push({
              id: res2[i].f_id,
              label: res2[i].f_label,
              sort: res2[i].f_sort,
              category_id: res2[i].category_id,
              children: [{
                id: res2[i].c_id,
                label: res2[i].c_label,
                sort: res2[i].c_sort,
                category_id: res2[i].category_id
              }]
            });
          }
        }
        /* 然后再把分类套在上面 */
        let flist = [];
        for(let item of res1) {
          let clist = [];
          if(item.label === 'My Secret Place' && req.query.type === 'home') {
            continue;
          }
          for(let j in list) {
            if(item.category_id === list[j].category_id) {
              clist.push(list[j]);
            }
          }
          flist.push({
            id: item.category_id,
            label: item.label,
            sort: item.sort,
            children: clist
          });
        }
        res.json(flist);

        connection.release();
      });
    });
  });
};
// 查三级节点名
exports.getChildName = function(req, res) {
  db.pool.getConnection(function(err, connection) {
    if(err) {
      res.json({ resultsCode:'error', message:'连接数据库失败' });
      console.log(err);
      return;
    }
    var sql = "SELECT c_label FROM tree WHERE c_id=?";
    var array = [req.query.id];
    connection.query(sql, array, function(err, result) {
      if(err) {
        res.json({ resultsCode:'error', message:'查找失败，操作tree失败' });
        return;
      }
      res.json(result);

      connection.release();
    });
  });
}

// 增
exports.addTreeNode = function(req, res) {
  db.pool.getConnection(function(err, connection) {
    if(err) {
      res.json({ resultsCode:'error', message:'连接数据库失败' });
      console.log(err);
      return;
    }
    var sql = '';
    var newchildId = Common.getRandomNum();
    if(req.query.level === '1') { // 若为一个大类
      let newfathId = Common.getRandomNum();
      let newcateId = Common.getRandomNum();
      sql = "INSERT INTO category VALUES (?, ?, ?)";
      let array = [newcateId, 'newCategory', (parseInt(req.query.sort) + 1)];
      connection.query(sql, array, function(err, res1) {
        if(err) {
          res.json({ resultsCode:'error', message:'添加失败，操作category失败' });
          return;
        }
        sql = "INSERT INTO tree VALUES (?, ?, ?, ?, ?, ?, ?)";
        array = [newfathId, 'newNode', 1, newchildId, 'newChildNode', 1, newcateId];
        connection.query(sql, array, function(err, res2) {
          if(err) {
            res.json({ resultsCode:'error', message:'添加失败，操作tree失败' });
            return;
          }
          let time = Common.getNowFormatDate();
          sql = "INSERT INTO cont VALUES(" + newchildId + ", '" + time + "', '" + time + "', '标题', '内容', 1, '')";
          var array = [];
          connection.query(sql, array, function(err, res3) {
            if(err) {
              res.json({ resultsCode:'error', message:'添加失败，操作cont失败' });
              return;
            }
            res.json({ resultsCode:'success', message:'添加成功' });
            connection.release();
          });
        });
      });
    }
    else {
      if(req.query.level === '2') { // 若是父节点
        let newfathId = Common.getRandomNum();
        sql = "INSERT INTO tree VALUES (" + newfathId + ", 'newNode', " + (parseInt(req.query.sort) + 1) + ", " + newchildId + ", 'newChildNode', " + 1 + ", " + req.query.category_id + ")";
      }
      if(req.query.level === '3') { // 若是子节点
        sql = "INSERT INTO tree VALUES (" + req.query.id + ", '" + req.query.label + "', " + req.query.f_sort + ", " + newchildId + ", 'newChildNode', " + (parseInt(req.query.c_sort) + 1) + ", " + req.query.category_id + ")";
      }
      var array = [];
      connection.query(sql, array, function(err, results) {
        if(err) {
          console.log("操作失败1");
          return;
        }
        let time = Common.getNowFormatDate();
        var sql1 = "INSERT INTO cont VALUES(" + newchildId + ", '" + time + "', '" + time + "', '标题', '内容', 1, '')";
        var array1 = [];
        connection.query(sql1, array1, function(err, results) {
          if(err) {
            console.log("操作失败2");
            return;
          }
          res.json({ resultsCode:'success', message:'添加成功' });
          connection.release();
        });
      });
    }
  });
};

// 改
exports.modifyTreeNode = function(req, res) {
  db.pool.getConnection(function(err, connection) {
    if(err) {
      res.json({ resultsCode:'error', message:'连接数据库失败' });
      console.log(err);
      return;
    }
    var flag = '';
    if(req.query.level === '1') {
      var sql = "UPDATE category SET label=? WHERE category_id=?";
      var array = [req.query.label, req.query.id];
      connection.query(sql, array, function(err, results) {
        if(err) {
          res.json({ resultsCode:'error', message:'修改失败' });
          return;
        }
        res.json({ resultsCode:'success', message:'修改成功' });
        connection.release();
      });
    } else {
      if(req.query.level === '3') {
        flag = 'c';
      }
      if(req.query.level === '2') {
        flag = 'f';
      }
      var sql = "UPDATE tree SET " + flag + "_label=? WHERE " + flag + "_id=?";
      var array = [req.query.label, req.query.id];
      connection.query(sql, array, function(err, results) {
        if(err) {
          res.json({ resultsCode:'error', message:'修改失败' });
          return;
        }
        res.json({ resultsCode:'success', message:'修改成功' });
        connection.release();
      });
    }
    
  });
};

// 删
exports.deleteTreeNode = function(req, res) {
  db.pool.getConnection(function(err, connection) {
    if(err) {
      res.json({ resultsCode:'error', message:'连接数据库失败' });
      console.log(err);
      return;
    }
    if(req.query.level === '1') { // 若为一级节点
      // 先找到该一级节点的所有三级节点
      var sql = "SELECT c_id FROM tree WHERE category_id=?";
      var array = [req.query.id];
      connection.query(sql, array, function(err, res1) {
        if(err) {
          res.json({ resultsCode:'error', message:'删除失败，操作tree失败1' });
          return;
        }
        // 再根据三级节点id逐个逐个删除三级节点的具体信息
        for(let i in res1) {
          var sql2 = "DELETE FROM cont WHERE c_id=?";
          var array2 = [res1[i].c_id];
          connection.query(sql2, array2, function(err, res2) {
            if(err) {
              res.json({ resultsCode: 'error', message: '删除失败，操作cont失败' });
              return;
            }
          });
        }
      });
      // 再删除树上的该一级节点及其二三级节点
      var sql = "DELETE FROM tree WHERE category_id=?";
      var array = [req.query.id];
      connection.query(sql, array, function(err, res1) {
        if(err) {
          res.json({ resultsCode: 'error', message: '删除失败，操作tree失败2' });
          return;
        }
        // 最后删除category表上的一级节点
        var sql2 = "DELETE FROM category WHERE category_id=?";
        connection.query(sql2, array, function(err, res2) {
          if(err) {
            res.json({ resultsCode: 'error', message: '删除失败，操作category失败' });
            return;
          }
          res.json({ resultsCode: 'success', message: '删除成功' });
          connection.release();
        });
      });
    }
    if(req.query.level === '2') { // 若为二级节点
      // 先找到该二级节点的所有三级节点
      var sql = "SELECT c_id FROM tree WHERE f_id=?";
      var array = [req.query.id];
      connection.query(sql, array, function(err, results) {
        if(err) {
          res.json({ resultsCode: 'error', message: '删除失败，操作tree失败1' });
          return;
        }
        // 再根据三级节点id逐个逐个删除三级节点的具体信息
        for(let i in results) {
          var sql2 = "DELETE FROM cont WHERE c_id=?";
          var array2 = [results[i].c_id];
          connection.query(sql2, array2, function(err, results) {
            if(err) {
              res.json({ resultsCode: 'error', message: '删除失败，操作cont失败' });
              return;
            }
          });
        }
      });
      // 最后删除树上的该二级节点及其三级节点
      var sql = "DELETE FROM tree WHERE f_id=?";
      var array = [req.query.id];
      connection.query(sql, array, function(err, results) {
        if(err) {
          res.json({ resultsCode: 'error', message: '删除失败，操作tree失败2' });
          return;
        }
        res.json({ resultsCode: 'success', message: '删除成功' });
        connection.release();
      });
    }
    if(req.query.level === '3') { // 若为三级节点
      // 删除该子节点的具体信息
      var sql = "DELETE FROM cont WHERE c_id=?";
      var array = [req.query.id];
      connection.query(sql, array, function(err, results) {
        if(err) {
          res.json({ resultsCode: 'error', message: '删除失败，操作cont失败' });
          return;
        }
      });
      // 删除树上的点
      var sql = "DELETE FROM tree WHERE c_id=?";
      connection.query(sql, array, function(err, results) {
        if(err) {
          res.json({ resultsCode: 'error', message: '删除失败，操作tree失败' });
          return;
        }
        res.json({ resultsCode:'success', message:'删除成功' });

        connection.release();
      });
    }
  });
};


// 交换顺序，上移或下移
exports.changeSort = function(req, res) {
  db.pool.getConnection(function(err, connection) {
    if(err) {
      console.log("连接数据库失败");
      console.log(err);
      return;
    }
    if(req.query.level === '1') {
      var sql1 = "UPDATE category SET sort=? WHERE category_id=?";
      var array1 = [req.query.otherSort, req.query.thisId];
      connection.query(sql1, array1, function(err, results) {
        if(err) {
          console.log("操作category失败1");
          return;
        }
        var sql2 = "UPDATE category SET sort=? WHERE category_id=?";
        var array2 = [req.query.thisSort, req.query.otherId];
        connection.query(sql2, array2, function(err, results) {
          if(err) {
            console.log("操作category失败2");
            return;
          }
          res.json({ resultsCode: 'success', message: '移动成功' })
          connection.release();
        });
      });
    } else {
      var flag = '';
      if(req.query.level === '3') {
        flag = 'c';
      }
      if(req.query.level === '2') {
        flag = 'f';
      }
      var sql1 = "UPDATE tree SET " + flag + "_sort=? WHERE " + flag + "_id=?";
      var array1 = [req.query.otherSort, req.query.thisId];
      connection.query(sql1, array1, function(err, results) {
        if(err) {
          console.log("操作tree失败1");
          return;
        }
        var sql2 = "UPDATE tree SET " + flag + "_sort=? WHERE " + flag + "_id=?";
        var array2 = [req.query.thisSort, req.query.otherId];
        connection.query(sql2, array2, function(err, results) {
          if(err) {
            console.log("操作tree失败2");
            return;
          }
          res.json({ resultsCode: 'success', message: '移动成功' })
          connection.release();
        });
      });
    }
  });
};

// 穿梭，子节点改变父节点（加到别的树枝下）
exports.changeFather = function(req, res) {
  db.pool.getConnection(function(err, connection) {
    if(err) {
      console.log("连接数据库失败");
      console.log(err);
      return;
    }
    let sql = '', array = [];
    if(req.query.shuttleLevel === '2') { // 二级节点要穿梭
      sql = "UPDATE tree SET category_id=?, f_sort=? WHERE f_id=?";
      array = [req.query.category_id, req.query.f_sort, req.query.f_id];
    }
    if(req.query.shuttleLevel === '3') {  // 三级节点要穿梭
      sql = "UPDATE tree SET f_id=?, f_label=?, f_sort=?, c_sort=? WHERE c_id=?";
      array = [req.query.fatherid, req.query.fatherlabel, req.query.fathersort, req.query.newchildsort, req.query.childid];
    }
    connection.query(sql, array, function(err, results) {
      if(err) {
        console.log("穿梭失败");
        return;
      }
      res.json({ resultsCode: 'success', message: '穿梭成功' });
      connection.release();
    });
  });
};