/*
access_token是公众号的全局唯一接口调用凭据，公众号调用各接口时都需使用
access_token的有效期目前为2个小时，需定时刷新，重复获取将导致上次获取的access_token失效。 
https请求方 式: GET https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET

*/
// 使用request库 和request-promise-native库发请求 第二个库依赖第一个
const rp = require ('request-promise-native');
const {readFile, writeFile} = require ('fs');
const {appID, appsecret} = require ('../config');
const menu = require ('./menu');
const api = require ('../utils/api');
const {resolve} =require('path')
class Wechat {
  constructor () {}
  getAccessToken () {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
    return new Promise ((resolve, reject) => {
      // 给微信服务器端发送请求
      // json吧请求数据转换为json数据
      rp ({
        method: 'GET',
        url,
        json: true,
      })
        .then (res => {
          //    提前五分钟更新access_token
          res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
          resolve (res);
          /*
     { access_token:
    '31_5fWXdry_XxiuKtf7u16gs6JVZVpVcebqBg_0YKL3hM6sQ9iUAmJl8g6n5NGQ66lRr2MX_Uw7OyOUWb6jxjpWbHzSQecvgkBY5zenhTboCwW-IxTLLFueYN2fWUsO7saM2rABhvz9zy2RksQ7IMReAEASWB',
    expires_in: 7200 } }
    */
        })
        .catch (err => {
          console.log ({
            err,
          });
          reject (err);
        });
    });
  }
  saveAccessToken (AccessToken) {
    const filePath = resolve(__dirname,'AccessToken.txt')
    return new Promise ((resolve, reject) => {
      writeFile (filePath,JSON.stringify (AccessToken), err => {
        if (!err) {
          console.log ('AccessToken保存成功');
          resolve ();
        } else {
          reject (err);
        }
      });
    });
  }
  readAccessToken () {
    const filePath = resolve(__dirname,'AccessToken.txt')
    return new Promise ((resolve, reject) => {
      readFile (filePath, (err, data) => {
        if (!err) {
            data = JSON.parse (data);
            console.log ('AccessToken读取成功', data);
          resolve (data);
        } else {
          reject ('读取失败');
        }
      });
    });
  }
  isVaildAccessToken (data) {
    // 检测传入参数是否有效
    if (!data && !data.access_token && !data.expires_in) {
      // access_token无效
      return false;
    }
    // 检测access_token是否在有效期内
    return data.expires_in < Date.now();
  }
  fetchAccessToken () {
    // 优化 内存里面有access——token就不用去文件中读取
    if (
      this.access_token &&
      this.expires_in &&
      this.isVaildAccessToken (this)
    ) {
      console.log ('有缓存');
      return Promise.resolve ({
        access_token: this.access_token,
        expires_in: this.expires_in,
      });
    }

    //return 一个promise对象
    return this.readAccessToken ()
      .then (async res => {
        if (this.isVaildAccessToken (res)) {
          console.log ('没有过期');
          // 没有过期（return一个promise对象 会进入下一个点then）
          return Promise.resolve (res);
        } else {
          console.log ('已经过期了');
          const res = await this.getAccessToken ();
          await this.saveAccessToken (res);
          // 不用 resolve(res) 这样可以返回一个promise对象然后在catch后面继续点then 把res数据做个对象缓存
          return Promise.resolve (res);
        }
      })
      .catch (async err => {
        console.log ('失败' + err);
        const res = await this.getAccessToken ();
        this.saveAccessToken (res);
        return Promise.resolve (res);
      })
      .then (res => {
        //在内存里存下 不然每次都需要去读取文件
        this.access_token = res.access_token;
        this.expires_in = res.expires_in;
        // return一个promise对象  在通过return 返回给调用
        return Promise.resolve (res);
      });
  }
  // 创建自定义菜单
  creatMenu (menu) {
    //获取菜单
    return new Promise (async (resolve, reject) => {
      try {
        //async await 不会抛出异常 所以用trycatch  只有一行报错就会走catch 只要一个 await 后面的Promise状态变为 rejected ，整个 async 函数都会中断执行 进入到try catch里面的catch里面
        const data = await this.fetchAccessToken ();
        // 地址
        const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`;
        // 发送请求
        const result = await rp ({
          method: 'POST',
          url,
          json: true,
          body: menu,
        });
        resolve (result);
      } catch (e) {
        reject ('creatmenu报错' + e);
      }
    });
  }
  // 删除自定义菜单
  deleteMenu () {
    return new Promise (async (resolve, reject) => {
      try {
        const data = await this.fetchAccessToken ();
        //定义请求地址
        const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`;
        const result = await rp ({
          method: 'GET',
          url,
          json: true,
        });
        resolve (result);
      } catch (e) {
        reject ('deleteMenu报错' + e);
      }
    });
  }
  //获取临时票据
  getJsapiTicket () {
    return new Promise (async (resolve, reject) => {
      // 获取access_token
      const data = await this.fetchAccessToken ();
      console.log('acctoken',{data})
      const url = `${api.ticket}&access_token=${data.access_token}`;
      rp ({
        method: 'GET',
        url,
        json: true,
      })
        .then (res => {
          //    提前五分钟更新ticket
          res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
          resolve ({ticket: res.ticket, expires_in: res.expires_in});
        })
        .catch (err => {
          reject ('getJsapiTicket方法错误' + err);
        });
    });
  }
  saveJsapiTicket (JsapiTicket) {
    const filePath = resolve(__dirname,'JsapiTicket.txt')
    return new Promise ((resolve, reject) => {
      writeFile (filePath, JSON.stringify (JsapiTicket), err => {
        if (!err) {
          console.log ('JsapiTicket保存成功');
          resolve ();
        } else {
          reject (err);
        }
      });
    });
  }
  readJsapiTicket (JsapiTicket) {
    const filePath = resolve(__dirname,'JsapiTicket.txt')
    return new Promise ((resolve, reject) => {
      readFile (filePath, (err, data) => {
        if (!err) {
          console.log ('JsapiTicket读取成功', data);
          data = JSON.parse (data);
          resolve (data);
        } else {
          reject ('读取JsapiTicket失败');
        }
      });
    });
  }
  isVaildJsapiTicket (data) {
    // 检测传入参数是否有效
    if (!data && !data.JsapiTicket && !data.ticket_expires_in) {
      return false;
    }
    return data.expires_in < Date.now();
  }
  fetchJsapiTicket () {
    // 优化 内存里面有access——token就不用去文件中读取
    if (
      this.JsapiTicket &&
      this.ticket_expires_in &&
      this.isVaildJsapiTicket (this)
    ) {
      console.log ('JsapiTicket有缓存');
      return Promise.resolve ({
        ticket: this.JsapiTicket,
        expires_in: this.ticket_expires_in,
      });
    }

    //return 一个promise对象
    return this.readJsapiTicket ()
      .then (async res => {
        if (this.isVaildJsapiTicket (res)) {
          console.log ('JsapiTicket没有过期');
          // 没有过期（return一个promise对象 会进入下一个点then）
          return Promise.resolve (res);
        } else {
          console.log ('JsapiTicket已经过期了');
          const res = await this.getJsapiTicket ();
          this.saveJsapiTicket (res);
          // 不用 resolve(res) 这样可以返回一个promise对象然后在catch后面继续点then 把res数据做个对象缓存
          return Promise.resolve (res);
        }
      })
      .catch (async err => {
        console.log ('失败' + err);
        const res = await this.getJsapiTicket ();
        console.log('获取ticket',res)
        await this.saveJsapiTicket (res);
        return Promise.resolve (res);
      })
      .then (res => {
        //在内存里存下 不然每次都需要去读取文件
        this.JsapiTicket = res.ticket;
        this.ticket_expires_in = res.expires_in;
        // return一个promise对象  在通过return 返回给调用
        return Promise.resolve (res);
      });
  }
}

// (async () => {
//   // 模拟测试
//   const w = new Wechat ();
//   // 删除之前定义的菜单 才能创建新的菜单
//     let result = await w.deleteMenu ();
//     console.log (result, '删除菜单成功');
//     result = await w.creatMenu (menu);
//     console.log (result, '创建菜单成功');
//   const data = await w.fetchJsapiTicket ();
// }) ();
module.exports = Wechat