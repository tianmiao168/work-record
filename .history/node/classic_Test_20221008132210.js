const http =require('http')
const server =http.createServer()
server.on('require',function(req,res){
    console.log('someing is visiting our web')
})
server.listen(8080,function(){
console.log('server running at http://127.0.0.1:8080')
})