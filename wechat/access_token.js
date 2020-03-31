/*
access_token是公众号的全局唯一接口调用凭据，公众号调用各接口时都需使用
access_token的有效期目前为2个小时，需定时刷新，重复获取将导致上次获取的access_token失效。 
https请求方 式: GET https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET

*/
// 使用request库 和request-promise-native库发请求 第二个库依赖第一个
const rp = require("request-promise-native");
const {
    readFile,
    writeFile
} = require("fs");
const {
    appID,
    appsecret
} = require("../config");
const menu = require("./menu");
class Wechat {
    constructor() { }
    getAccessToken() {
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
        return new Promise((resolve, reject) => {
            // 给微信服务器端发送请求
            // json吧请求数据转换为json数据
            rp({
                method: "GET",
                url,
                json: true
            })
                .then(res => {
                    //    提前五分钟更新access_token
                    res.expires_in = Date.now() + (res.expires_in - 300 * 1000);
                    resolve(res);
                    /*
     { access_token:
    '31_5fWXdry_XxiuKtf7u16gs6JVZVpVcebqBg_0YKL3hM6sQ9iUAmJl8g6n5NGQ66lRr2MX_Uw7OyOUWb6jxjpWbHzSQecvgkBY5zenhTboCwW-IxTLLFueYN2fWUsO7saM2rABhvz9zy2RksQ7IMReAEASWB',
    expires_in: 7200 } }
    */
                })
                .catch(err => {
                    console.log({
                        err
                    });
                    reject(err);
                });
        });
    }
    saveAccessToken(AccessToken) {
        return new Promise((resolve, reject) => {
            writeFile("./AccessToken.txt", JSON.stringify(AccessToken), err => {
                if (!err)
                {
                    console.log("AccessToken保存成功");
                    resolve();
                } else
                {
                    reject(err);
                }
            });
        });
    }
    readAccessToken(AccessToken) {
        return new Promise((resolve, reject) => {
            readFile("./AccessToken.txt", (err, data) => {
                if (!err)
                {
                    console.log("AccessToken读取成功", data);
                    data = JSON.parse(data);
                    resolve(data);
                } else
                {
                    reject("读取失败");
                }
            });
        });
    }
    isVaildAccessToken(data) {
        // 检测传入参数是否有效
        if (!data && !data.access_token && !data.expires_in)
        {
            // access_token无效
            return false;
        }
        // 检测access_token是否在有效期内
        return data.expires_in < Date.now();
    }
    fetchAccessToken() {
        // 优化 内存里面有access——token就不用去文件中读取
        if (this.access_token && this.expires_in && this.isVaildAccessToken(this))
        {
            console.log("缓存");
            return Promise.resolve({
                access_token: res.access_token,
                expires_in: res.expires_in
            });
        }
        return new Promise((resolve, reject) => {
            //，只要一个 await 后面的Promise状态变为 rejected ，整个 async 函数都会中断执行 进入到try catch里面的catch里面
            this.readAccessToken().then(res => {
                if (this.isVaildAccessToken(res))
                {
                    // 没有过期
                    resolve(res);
                } else
                {
                    const res = this.getAccessToken();
                    this.saveAccessToken(res);
                    // 不用 resolve(res) 这样可以返回一个promise对象然后在catch后面继续点then 把res数据做个对象缓存
                    return Promise.resolve(res);
                }
            }).catch(async err => {
                console.log("失败" + err);
                const res = await this.getAccessToken();
                this.saveAccessToken(res);
                return Promise.resolve(res);
            })
                .then(res => {
                    //在内存里存下 不然每次都需要去读取文件
                    console.log("设置缓存");
                    this.access_token = res.access_token;
                    this.expires_in = res.expires_in;
                    return Promise.resolve(res);
                });;
        })

    }
    // 创建自定义菜单
    creatMenu(menu) {
        //获取菜单
        return new Promise(async (resolve, reject) => {
            try
            {
                //async await 不会抛出异常 所以用trycatch  只有一行报错就会走catch 只要一个 await 后面的Promise状态变为 rejected ，整个 async 函数都会中断执行 进入到try catch里面的catch里面
                const data = await this.fetchAccessToken();
                // 地址
                const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`;
                // 发送请求
                const result = await rp({
                    method: "POST",
                    url,
                    json: true,
                    body: menu
                });
                resolve(result);
            } catch (e)
            {
                reject("creatmenu报错" + e);
            }
        });
    }
    // 删除自定义菜单
    deleteMenu() {
        return new Promise(async (resolve, reject) => {
            try
            {
                const data = await this.fetchAccessToken();
                console.log({data})
                //定义请求地址
                const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`;
                const result = await rp({
                    method: "GET",
                    url,
                    json: true
                });
                resolve(result);
            } catch (e)
            {
                reject("deleteMenu报错" + e);
            }
        });
    }
}

(async () => {
    // 模拟测试
    const w = new Wechat();
    // 删除之前定义的菜单 才能创建新的菜单
    let result = await w.deleteMenu();
    console.log(result);
    result = await w.creatMenu(menu);
    console.log(result);
})();