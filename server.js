var fs = require('fs');            // 用于处理本地文件
var express = require('express');
var app = express();

// 让req获取到参数
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	next();
});

// 放在最前，返回dist里的index
app.get('/', function(req, res) {
	fs.readFile('./dist/index.html', function(err, content) {
		if(err) {
			res.setHeader('Content-Type', 'text/plain');
			res.status(400).send(err.message);
		} else {
			res.setHeader('Content-Type', 'text/html');
			res.status(200).send(content);
		}
		res.end();
	});
});

/* 开始写接口 */
// 登录
var login = require('./server/login.js');
app.post('/login', function(req, res) {
	login.checkLogin(req, res);
});
// app.get()
/* 结束 */

// 放在最后，用于传递文件
app.get('*', function(req, res) {
	// console.log(req.baseUrl);    // 这个拿不到值
	// console.log(req.path)        // 这个可以
	// console.log(req.originalUrl) // 这个也可以
	fs.readFile("./dist" + req.path, function(err, data) {
		if(err) {
			res.setHeader("Content-Type", "text/html");
			res.status(400).send(err.message);
			console.log("拿不到文件:%s", req.path);
		}
		else {
			var filename = req.path.substring(1);    // 去掉前导'/'
      var type = getType(filename.substring(filename.lastIndexOf('.') + 1));
			res.writeHead(200, { "Content-Type": type });
			res.write(data.toString());
		}
		res.end();
	});
});

// 起服务
var server = app.listen(3000, 'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Graduation app listening at http://%s:%s', host, port);
});

// 获取文件类型, element的字体类型暂时没办法
function getType(endTag){
	var type=null;
	switch(endTag){
	case 'html' :
	case 'htm' :
			type = 'text/html; charset=UTF-8';
			break;
	case 'js' : 
			type = 'application/javascript; charset="UTF-8"';
			break;
	case 'css' :
			type = 'text/css; charset="UTF-8"';
			break;
	case 'txt' :
			type = 'text/plain; charset="UTF-8"';
			break;
	case 'manifest' :
			type = 'text/cache-manifest; charset="UTF-8"';
			break;
	default :
			type = 'application/octet-stream';
			break;
	}
	return type;
}