## 理解跨域请求及原理 https://cloud.tencent.com/developer/article/1838493

不同端口之间可以共享 cookie
cookie 是不可以跨域的不包括端口

- cookie 的生命周期：
  maxage>0 持久化到内存和硬盘中。
  maxage<0 在内存中，session 级别
  maxage=0 删除已存在 cookie
  除了后端可以设置 cookie 有效期外，前端可通过 js，或浏览器开发者模式

````javascript {.line-numbers}
// 取cookie：
function getCookie(name) {
    var arr = document.cookie.split(';');
    for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split('=');
        var arrTest = arr2[0].trim(); // 此处的trim一定要加
        if (arrTest == name) {
            return arr2[1];
        }
    }

}
// 删cookie：
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) {
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
}
```
````

跨域 cookie 共享的方法
