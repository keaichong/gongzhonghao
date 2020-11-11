var request = require('request');
const {readFile} = require ('fs');
const {resolve} =require('path')
const config = require ('../config');

class wxInterface {
    userAccessToken(code,callback){ // 获取access_token 获取用户信息的access_token与基本的accessToken不同,通过code获取到openid
        let tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.appID}&secret=${config.appSecret}&code=${code}&grant_type=authorization_code`;
        request(tokenUrl,(error, response, body)=> {
          if (response && response.statusCode && response.statusCode === 200) {
            try{
                body = JSON.parse(body);
            }catch(e){
                body = null;
            } 
            callback&&callback(body);
          }
        });
    };
    getUserInfo(code,callback){     //获取用户信息
        let self = this;
        self.userAccessToken(code,(data)=>{
            if(data){//通过openid 就可以获取到用户信息
                var tokenUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${data.access_token}&openid=${data.openid}&lang=zh_CN`;
                request(tokenUrl, function (error, response, body) {
                  if (response && response.statusCode && response.statusCode === 200) {
                    try{
                        body = JSON.parse(body);
                        body.access_token = data.access_token;
                        body.refresh_token = data.refresh_token;
                    }catch(e){
                        body = null;
                    } 
                    // 发送模板消息(openid,userInfo)
                    self.sendTemplateMsg(data.openid,body)
                    // 模板消息结束
                    callback&&callback(body);
                  }
                });
            }
        });
    };


        /**
         * 发送模板消息
         * @param  { string } openid [发送模板消息的接口需要用到openid参数]
         * @param  { string } access_token [发送模板消息的接口需要用到access_token参数]
         */

    sendTemplateMsg(openid,userInfo) {
        const filePath = resolve(__dirname,'../wechat/AccessToken.txt')
        new Promise ((resolve, reject) => {
          readFile (filePath, (err, data) => {
            if (!err) {
                console.log('access_token',JSON.parse(data).access_token)
              resolve (JSON.parse(data));
            } else {
              reject ('读取失败');
            }
          })
        }).then(res =>{
              // 模板消息
              const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${res.access_token}`; //发送模板消息的接口
              const requestData = { //发送模板消息的数据
                  touser: openid,
                  template_id: 'RQQMhFy8gRzE87zV7i30Hktr556RRt5E09zltCzt5rU',//你配置的对应模板
                  url: 'http://weixin.qq.com/download',
                  data: {
                      first: {
                          value: '身份信息',
                          color: "#173177"
                      },
                      key1: {
                          value: userInfo.nickname,
                          color: '#1d1d1d'
                      },
                      key2: {
                          value: userInfo.sex == 1 ?'男':'女',
                          color: '#1d1d1d'
                      },
                      key3: {
                          value: userInfo.country,
                          color: '#1d1d1d'
                      },
                      remark: {
                          value: '已登记！',
                          color: '#173177'
                      }
                  }
              };
              request({
                  url: url,
                  method: 'post',
                  body: JSON.stringify(requestData),
              }, function(error, response, body) {
                  if (response && response.statusCode && response.statusCode === 200) {
                      console.log('模板消息推送成功'); 
                    }
              });  
        });
    }

}
module.exports=wxInterface;