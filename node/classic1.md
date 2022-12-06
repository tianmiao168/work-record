 浏览器就是一个运行环境，node也是一个运行环境。
 * 浏览器运行环境：浏览器运行环境中内置的api+chrome浏览器的v8js解析引擎 保证js代码执行

nodejs,是一个基于v8引擎的JavaScript运行环境。
* node运行环境：v8js解析引擎+node内置的api(express来构建web应用，electron构建跨平台桌面应用,restify构建api接口)
* js代码在浏览器中执行就是前端开发，在node中执行就是后端开发
* node中无法调用浏览器内置的api

（学习路线：node内置api和第三方api）

（常用终端命令-》tab快速补全路径-》esc清空当前已输命令-》cls清空终端）

fs模块，是node提供的用来操作文件的模块。
* fs.readFile()读取 
* fs.writeFile()写入
path路径模块，用来处理路径的模块
const  path=path.join(_dirname,'./file/1.txt')
<!-- dirname为当前文件目录 -->
## http模块
http模块是node提供的用来创建web服务器的模块
* 服务器和普通电脑的区别就是，服务器上安装了web服务器软件就能把普通电脑变为web服务器
* ip地址每台计算机都会有一个唯一的ip地址 只有知道对方的ip地址才能进行通信（127.0.0.1相当于本地的ip地址）
* 端口 相当于与外界通信交流的一个出口，只有开启端口才能与外界进行通讯，ip地址比作一个房子，那端口就是房子的多扇门，ip地址可以有多个端口。(一个电脑可运行多个web服务，一个web服务对应一个端口号)
* 一个拥有ip地址的主机可以提供多种服务，web服务，stp,smtp服务，那么主机是如何来区分不同的服务呢？通过ip地址+端口号来区分不同的服务
* ip地址和域名是一一对应的关系（为了方便记忆），通过域名服务器DNS来进行将域名转换为ip地址
* 创建一个基础的web服务器：1.导入http模块
const http =require('http')

2.创建web服务器实例
const server=http.createServer()
3.为web服务器绑定request事件（监听客户端请求）
server.on('require',function(req,res){
    console.log('someone visit our web server')
})
4.启动web服务器
server.listen(8080,function(){
    console.log('server running at http://127.0.0.1:8080')
})
* node中模块的分类：三大类
内置模块（fs,path,http），自定义模块，第三方模块
