/** 上传图片 */
var db = require('./db.js');
var Common = require('./common.js');
var fs = require('fs');

/** 获取上传的图片保存到本地，并将文件名保存到数据库 */
// 主页的，main
exports.saveMainImg = function(req, res) {
  // console.log(req.file);  /* 上传的文件信息 */
  let img_id = Common.getRandomNum();
  let filename = Common.getImageName(req.file.originalname, img_id);
  let des_file = __dirname + "/img/main/" + filename; /* 这里要注意，因为这个文件已经在server里了，所以这里的__dirname是有server的 */
  fs.readFile(req.file.path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if( err ){
        console.log( err );
      } else {
        let time = Common.getNowFormatDate();
        var sql = "INSERT INTO image VALUES (?, ?, ?, 'main', ?)";
        db.pool.getConnection(function(err, connection) {
          if(err) {
            res.json({ resultsCode: 'error', message: '连接数据库失败' });
            console.log(err);
            return;
          }
          var array = [img_id, req.file.originalname, filename, time];
          connection.query(sql, array, function(err, results) {
            if(err) {
              res.json({ resultsCode: 'error', message: '保存图片信息失败' });
              return;
            }
            fs.unlink(req.file.path, function (err) {  // 删除缓存
              if(err) {
                res.json({ resultsCode: 'error', message: err });
              } else {
                res.json({ resultsCode: 'success', message: '保存图片成功' });
              }
            });

            connection.release();
          });
        });
      }
    });
  });
};
// 图片墙的，wall
exports.saveWallImg = function(req, res) {
  // console.log(req.file);  /* 上传的文件信息 */
  let img_id = Common.getRandomNum();
  let filename = Common.getImageName(req.file.originalname, img_id);
  let des_file = __dirname + "/img/wall/" + filename; /* 这里要注意，因为这个文件已经在server里了，所以这里的__dirname是有server的 */
  fs.readFile(req.file.path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if( err ){
        console.log( err );
      } else {
        let time = Common.getNowFormatDate();
        var sql = "INSERT INTO image VALUES (?, ?, ?, 'wall', ?)";
        db.pool.getConnection(function(err, connection) {
          if(err) {
            res.json({ resultsCode: 'error', message: '连接数据库失败' });
            console.log(err);
            return;
          }
          var array = [img_id, req.file.originalname, filename, time];
          connection.query(sql, array, function(err, results) {
            if(err) {
              res.json({ resultsCode: 'error', message: '保存图片信息失败' });
              return;
            }
            fs.unlink(req.file.path, function (err) {  // 删除缓存
              if(err) {
                res.json({ resultsCode: 'error', message: err });
              } else {
                res.json({ resultsCode: 'success', message: '保存图片成功' });
              }
            });

            connection.release();
          });
        });
      }
    });
  });
};
// 树详细内容的，treeCont
exports.saveTreeContImg = function(req, res) {
  // console.log(req.file);  /* 上传的文件信息 */
  console.log(req.file);
  console.log(req.body.c_id);
  let filename = Common.getImageName(req.file.originalname, (req.body.c_id + '.' + Common.getRandomNum()));
  console.log(filename);
  let des_file = __dirname + "/img/treecont/" + filename; /* 这里要注意，因为这个文件已经在server里了，所以这里的__dirname是有server的 */
  fs.readFile(req.file.path, function (err, data) {
    if(err){
      console.log(err);
      return;
    }
    fs.writeFile(des_file, data, function (err) {
      if(err){
        res.json({ resultsCode: 'error', message: '保存本地图片失败' });
        console.log(err);
        return;
      } else {
        let time = Common.getNowFormatDate();
        db.pool.getConnection(function(err, connection) {
          if(err) {
            res.json({ resultsCode: 'error', message: '连接数据库失败' });
            console.log(err);
            return;
          }
          var sql = "UPDATE cont SET filename=?, mTime=? WHERE c_id=? && sort=?";
          var array = [filename, time, req.body.c_id, req.body.sort];
          connection.query(sql, array, function(err, results) {
            if(err) {
              res.json({ resultsCode: 'error', message: '保存图片信息失败' });
              console.log(err);
              return;
            }
            fs.unlink(req.file.path, function (err) {  // 删除缓存
              if(err) {
                res.json({ resultsCode: 'error', message: '删除缓存失败' });
                console.log(err);
                return;
              } else {
                res.json({ resultsCode: 'success', message: '保存图片成功' });
              }
            });

            connection.release();
          });
        });
      }
    });
  });
};

// 获取image中某个type的所有图片名称，然后可以通过express静态资源获取
exports.getImgList = function(req, res) {
  var sql = "SELECT * FROM image WHERE type=? ORDER BY cTime";
  db.pool.getConnection(function(err, connection) {
    if(err) {
      res.json({ resultsCode: 'error', message: '连接数据库失败' });
      console.log(err);
      return;
    }
    var array = [req.query.type];
    connection.query(sql, array, function(err, results) {
      if(err) {
        res.json({ resultsCode: 'error', message: '查询image失败' });
        return;
      }
      res.json(results);

      connection.release();
    });
  });
};

// 删除某张图片，删掉本地的还要删掉image数据库的记录
exports.deleteImg = function(req, res) {
  let des_file = '';
  if(req.query.type === 'main') {
    des_file = __dirname + "/img/main/" + req.query.filename;
  }
  if(req.query.type === 'wall') {
    des_file = __dirname + "/img/wall/" + req.query.filename;
  }
  fs.unlink(des_file, function (err) {
    if( err ){
      console.log( err );
    } else {
      var sql = "DELETE FROM image WHERE img_id=? && type=?";
      db.pool.getConnection(function(err, connection) {
        if(err) {
          res.json({ resultsCode: 'error', message: '连接数据库失败' });
          console.log(err);
          return;
        }
        var array = [req.query.img_id, req.query.type];
        connection.query(sql, array, function(err, results) {
          if(err) {
            res.json({ resultsCode: 'error', message: '保存图片信息失败' });
            return;
          }
          res.json({ resultsCode: 'success', message: '删除成功' })

          connection.release();
        });
      });
    }
  });
}

// 删除树的某图片，删掉本地的图片，还要把cont数据库的对应filename设为''
exports.deleteTreeContImg = function(req, res) {
  let des_file = __dirname + "/img/treecont/" + req.query.filename;
  fs.unlink(des_file, function (err) {
    if(err){
      res.json({ resultsCode: 'error', message: '删除本地图片失败' });
    } else {
      db.pool.getConnection(function(err, connection) {
        if(err) {
          res.json({ resultsCode: 'error', message: '连接数据库失败' });
          console.log(err);
          return;
        }
        var sql = "UPDATE cont SET filename='' WHERE filename=?";
        var array = [req.query.filename];
        connection.query(sql, array, function(err, results) {
          if(err) {
            res.json({ resultsCode: 'error', message: '更改cont的filename为\'\'失败' });
            return;
          }
          res.json({ resultsCode: 'success', message: '删除成功' })

          connection.release();
        });
      });
    }
  });
}