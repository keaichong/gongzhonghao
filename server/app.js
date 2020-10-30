//1.导入第三方模块
const express =require ('express');
const sha1 = require('sha1')
const path = require('path');
const bodyParser = require('body-parser');
const {url,appID,appsecret} = require('./config')
const cookieParser = require('cookie-parser');
const menu = require('./wechat/menu');
// const session = require('express-session');

// app.use(session({
//     secret: '8023',
//     // cookie: {maxAge: 60000},
//     resave: false,
//     saveUninitialized: true
// }));


//2.创建express的核心对象app
const app =express();
const auth = require('./wechat/auth')
const WeChat = require('./wechat/wechat')
//后端配置history 路由插件
const history = require('connect-history-api-fallback');//
const wechatApi = new WeChat()
var a = async function (){
  let result = await wechatApi.deleteMenu ();
    console.log ('删除菜单成功');
    result = await wechatApi.creatMenu (menu);
    console.log ('创建菜单成功');
}
a()
//后端配置history模式
app.use(history());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
// 部署上线时读取静态文件
 app.use(express.static(path.join(__dirname, '../../dist')));
// 后端api路由
// app.use('/api', routerApi);

app.post('/api/login',async(req,res)=>{
  // 随机字符串
  if(+req.body.pwd === '111111'){
    res.send({code:200})
  }
  const noncestrc= (''+Math.random()).split('.')[1]
  // 时间戳
  const timestamp = Date.now()
  // 获取票据
  const {ticket} = await wechatApi.fetchJsapiTicket();
  const arr = [`jsapi_ticket=${ticket}`,`noncestrc=${noncestrc}`,`timestamp${timestamp}`,`url=${url}/api/login`]
  const str = arr.sort().join('&')
  const signature  = sha1(str)
  // res.send({signature,noncestrc,timestamp})//返回给微信服务器 微信知道你的ticket 所以微信会校验你的签名
})
app.get('/api/auth',async(req,res)=>{
 // 第一步：用户同意授权，获取code
 // 这是编码后的地址
 const router = encodeURI('http://81.69.23.175:8080')
 var return_uri = router;  
 var scope = 'snsapi_userinfo';

 res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appID+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect');

})

// // 验证模块
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

