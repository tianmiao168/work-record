const http =require('http')
const server =http.createServer()
server.on('require',function(req,res){
    // 客户端url
    const url=req.url
    // 客户端请求方法
    const method=req.method 

    // 服务端可以向客户端发送指定内容来结束本次请求
    res.end('server end')
    console.log('someing is visiting our web')
})
server.listen(8080,function(){
console.log('server running at http://127.0.0.1:8080')
})