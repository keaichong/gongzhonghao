//1.导入第三方模块
const express =require ('express');
const sha1 = require('sha1')
const path = require('path');
const bodyParser = require('body-parser');
const {url,appID,appsecret} = require('./config')
const cookieParser = require('cookie-parser');
const menu = require('./wechat/menu');
// 配置使用 express-session 中间件 express-session是内存存储服务器挂掉就丢失session 
// 配置好后请求对象上会有req.session.对象
const session = require('express-session');
// session 数据持久化 目的:解决服务器重启或者崩溃导致session数据丢失 所以把session存到数据库 会在数据库中创建一个sessions表 存储session数据
const MySQLStore = require('express-mysql-session')(session)
const db = require('./utils/db');
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

const options = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'gongzhonghoa'
}

// 创建一个 sessionStore 持久化 Session 数据
const sessionStore = new MySQLStore(options);

app.use(session({                         
  //   secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: sessionStore, // 告诉 express-session 中间件，使用 sessionStore 持久化 Session 数据
  }))
  
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
 app.use(express.static(path.join(__dirname, '../dist')));
// 后端api路由
// app.use('/api', routerApi);

const wxInterface = require('./modules/wxInterface');
/**
 * 获取用户信息
 */
app.post('/api/wxinterface',function(req,res,next){
    // let myUrl = req.body.url;
    let myCode = req.body.code;
    wxInterface.prototype.getUserInfo(myCode,function(data){
        if(data){
           res.end(JSON.stringify(data));
            // res.json(data);
        }else{
          res.end(JSON.stringify({"ResultCode": 0, "Message": "token获取失败" }));
            // res.json({ "ResultCode": 0, "Message": "token获取失败" });
        }
    });
})

// [查询] 登陆
app.post('/api/login',async(req,res)=>{
  let body = req.body;
  console.log(body,'body')
  db.query('select * from login where name = ?',body.name ,(err, results) => {
    if (err) return console.log(err);
      //没找到 对应 数据
      console.log(results[0],'results')
    if (!results[0]) {
        return res.send({
            success: false,
            message: '用户不存在'
        }) 
    };
    if (results[0].pwd == body.pwd) {
         // 下面代码的意思是往 Session 中存储了一个名字叫 user，值是我们从数据库中查询到的用户数据user对象 
      req.session.user =results[0]
      res.send(
        {
          success: true,
          code:200,
          message: '登陆成功'
      })
    }else{
      res.send(
        {
          success: true,
          code:404,
          message: '密码错误'
      })
    }
  })
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


/**
 /* [增]
 */
app.post('/api/add', (req, res) => {
  let body = req.body;
  db.query('select * from login where name = ? ', [body.name], (err, results) => {
      if (err) {
          return console.log(err)
      };
      if (results.length !== 0) {
          return res.send({
              success: false,
              message: '用户名存在'
          })
      }
  });
  db.query('insert into login set name=? , pwd = ?', [body.name, body.pwd], (err, results) => {
      if (err) {
          return console.log(err)
      };
      res.send({
          success: true,
          message: '注册成功'
      })
  });
})

app.get('/api/auth',async(req,res)=>{
 // 第一步：用户同意授权，获取code
 // 这是编码后的地址
 const router = encodeURI('http://81.69.23.175:8080')
 var return_uri = router;  
 var scope = 'snsapi_userinfo';
//  res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appID+'&redirect_uri='+return_uri+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect');
  res.end({code:200})
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

