// 这是一个简单的Node HTTP服务器,能处理当前目录的文件
// 并能实现两种特殊的URL用于测试
// 首先加载所有需要用到的模块

var http = require('http');// Http服务器API
var fs = require('fs');            // 用于处理本地文件
var server = new http.Server();    // 创建新的HTTP服务器
server.listen(8085);            // 监听端口8000
// 使用on方法注册时间处理
server.on('request', function(request, response) { // 当有request请求的时候触发处理函数
    var url = require('url').parse(request.url);
    console.log(url);
    // 特殊URL会让服务器在发送响应前先等待
    switch(url.pathname) {
      case '' || '/' : // 模拟欢迎页,nodejs是高效流处理的方案,也可以通过配置文件来配置
          fs.readFile('./emailTemplate.html', function(err, content){
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
          break;
      case '/test/delay':// 此处用于模拟缓慢的网络连接
          // 使用查询字符串来获取延迟时长,或者2000毫秒
          var delay = parseInt(url.query) || 2000;
          // 设置响应状态和头
          response.writeHead(200, {'Content-type':'text/plain; charset=UTF-8'});
          // 立即开始编写响应主体
          response.write('Sleeping for ' + delay + ' milliseconds...');
          // 在之后调用的另一个函数中完成响应
          setTimeout(function(){
              response.write('done.');
              response.end();
          }, delay);
          break;
      case '/json' : // 模拟JSON数据返回
          // 响应状态和头
          response.writeHead(200, {'Content-type':'application/json; charset=UTF-8'});
          response.write(JSON.stringify({test:'success'}));
          response.end();
          break;
      default:// 处理来自本地目录的文件
          var filename = url.pathname.substring(1);    // 去掉前导'/'
          var type = getType(filename.substring(filename.lastIndexOf('.')+1));
          // 异步读取文件,并将内容作为单独的数据模块传给回调函数
          // 对于确实很大的文件,使用流API fs.createReadStream()更好
          fs.readFile(filename, function(err, content){
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
          break;
    }
});
console.log("server %s start ...", "http://127.0.0.1:8085");
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
      default :
          type = 'application/octet-stream';
          break;
    }
    return type;
}