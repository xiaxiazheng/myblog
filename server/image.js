/** 上传图片 */
var db = require('./db.js');
var Common = require('./common.js');
var fs = require('fs');

// 获取上传的图片保存到本地，并将文件名保存到数据库
exports.saveMainImg = function(req, res) {
  console.log(req.file);  /* 上传的文件信息 */
  var des_file = __dirname + "/img/" + req.file.originalname; /* 这里要注意，因为这个文件已经在server里了，所以这里的__dirname是由server的 */
  fs.readFile(req.file.path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if( err ){
        console.log( err );
      } else {
        let img_id = Common.getRandomNum();
        var sql = "INSERT INTO image VALUES (" + img_id + ", ?, 'main')";
        db.pool.getConnection(function(err, connection) {
          if(err) {
            console.log("连接数据库失败");
            console.log(err);
            return;
          }
          var array = [req.file.originalname];
          connection.query(sql, array, function(err, results) {
            if(err) {
              console.log("保存图片信息失败");
              return;
            }
            res.json({ resultsCode: 'success', message: '保存图片成功' })

            connection.release();
          });
        });
      }
    });
  });
};

// 获取某个type的所有图片名称
exports.getImgList = function(req, res) {
  var sql = "SELECT * FROM image WHERE type=?";
  db.pool.getConnection(function(err, connection) {
    if(err) {
      console.log("连接数据库失败");
      console.log(err);
      return;
    }
    var array = [req.query.type];
    connection.query(sql, array, function(err, results) {
      if(err) {
        console.log("查询失败");
        return;
      }
      res.json(results);

      connection.release();
    });
  });
};