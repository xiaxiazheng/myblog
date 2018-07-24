var http = require('http');        // Http服务器API
var fs = require('fs');            // 用于处理本地文件
var server = new http.Server();    // 创建新的HTTP服务器
server.listen(8080);            // 监听端口8080
console.log("listen on port 8080");



const dist = 'dist/';


// 使用on方法注册时间处理
server.on('request', function(request, response) { // 当有request请求的时候触发处理函数
    console.log('request');
    // 解析请求的URL
    var url = require('url').parse(request.url);
    // 特殊URL会让服务器在发送响应前先等待
    if(url.pathname === '' || url.pathname === '/') { // 模拟欢迎页,nodejs是高效流处理的方案,也可以通过配置文件来配置
        fs.readFile('./' + dist + 'index.html', function(err, content){
            if(err) {
                response.writeHead(404, { 'Content-Type':'text/plain; charset="UTF-8"' });
                response.write(err.message);
                response.end();
            } else {
                response.writeHead(200, { 'Content-Type' : 'text/html; charset=UTF-8' });
                response.write(content);
                response.end();
            }
        });
    } else { // 处理来自本地目录的文件
        var filename = url.pathname.substring(1);    // 去掉前导'/'
        var type = getType(filename.substring(filename.lastIndexOf('.')+1));
        // 异步读取文件,并将内容作为单独的数据模块传给回调函数
        // 对于确实很大的文件,使用流API fs.createReadStream()更好
        fs.readFile(dist + '' + filename, function(err, content){
            if(err) {
                response.writeHead(404, { 'Content-Type':'text/plain; charset="UTF-8"' });
                response.write(err.message);
                response.end();
            } else {
                response.writeHead(200, { 'Content-Type' : type });
                response.write(content);
                response.end();
            }
        });
    }
});

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