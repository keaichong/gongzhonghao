//1.导入第三方模块
const express =require ('express');
const sha1 = require('sha1')
//2.创建express的核心对象app
const app =express();
const auth = require('./wechat/auth')

// 验证模块
app.use(auth())

//处理错误的中间件
app.use((err, req, res, next) => {
    if (err) {
      // 记录日志 因为(err)内容太多 err.stack打印关键内容
      console.log(err.stack);
  
      //express  500 状态码是服务器内部错误
      res.status(500).send('这是服务器内部错误，500页面');
    }
  });

//5.监听端口
app.listen(3000,()=>{
    console.log('开始监听 3000');
});

