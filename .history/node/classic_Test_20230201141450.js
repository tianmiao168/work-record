const http = require("http");
const server = http.createServer();
server.on("require", function (req, res) {
  // 客户端url
  const url = req.url;
  // 在此处可以通过判断不同的url来给客户端返回不同的content /**** const content = "<h1>test</h1>";*******
  // 客户端请求方法
  const method = req.method;
  // 为了防止中文显示乱码的问题，需要设置响应头
  res.setHeader("content-Type", "text/html;charset=utf-8");
  // 服务端可以向客户端发送指定内容来结束本次请求
  res.end("server end");
  //  ****** res.end(content);*********
  console.log("someing is visiting our web");
});
server.listen(8080, function () {
  console.log("server running at http://127.0.0.1:8080");
});
