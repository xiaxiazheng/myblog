var fs = require('fs');            // 用于处理本地文件
var express = require('express');
var app = express();
// app.use(express.static('public'));

// 让req获取到参数
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 给所有的加该请求头
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
	// 操作树节点
	var tree = require('./server/tree.js');
	app.get('/tree', function(req, res) {
    tree.getTree(req, res);
	});
	app.get('/addtreenode', function(req, res) {
		tree.addTreeNode(req, res);
	});
	app.get('/modifytreenode', function(req, res) {
		tree.modifyTreeNode(req, res);
	});
	app.get('/deletetreenode', function(req, res) {
		tree.deleteTreeNode(req, res);
	});
	// 操作子节点
	var cont = require('./server/cont.js');
	app.get('/cont', function(req, res) {
    cont.getNodeCont(req, res);
	});
	app.post('/addnodecont', function(req, res) {
		cont.addNodeCont(req, res);
	});
	app.post('/modifynodecont', function(req, res) {
		cont.modifyNodeCont(req, res);
	});
	app.get('/deletenodecont', function(req, res) {
		cont.deleteNodeCont(req, res);
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
			// res.write(data.toString(), 'binary');
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
	case 'ico' :
			type = 'image/x-icon; charset="UTF-8"';
			break;
	case 'jpeg' :
	case 'jpg' :
			type = 'image/jpeg; charset="UTF-8"';
			break;
	case 'png' :
			type = 'image/png; charset="UTF-8"';
			break;
	default :
			type = 'application/octet-stream';
			break;
	}
	return type;
}