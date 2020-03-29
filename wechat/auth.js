/*
验证服务器有效性模块

*/
const sha1 = require('sha1')
const config = require('../config')
const { getUserDataAsync } = require('../utils/tools')
module.exports = () => {
    return async (req, res, next) => {

        /*
        { signature: '0b0974c104fdb1d58c4fe80f9f618cd7b5fda9fe', 签名
      echostr: '6144413067472975263', 随机字符串 
      timestamp: '1585325454', 时间戳
      nonce: '854256958' } 随机数字
        开发者通过检验signature对请求进行校验（下面有校验方式）。若确认此次GET请求来自微信服务器，请原样返回echostr参数内容，则接入生效，成为开发者成功，否则接入失败。加密/校验流程如下：
    
    1）将token、timestamp、nonce三个参数进行字典序排序 2）将三个参数字符串拼接成一个字符串进行sha1加密 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
        */
        const { signature, echostr, timestamp, nonce } = req.query
        const { token } = config
        const arr = [timestamp, nonce, token]
        const arrstr = arr.sort().join('')
        const sha1Str = sha1(arrstr)
        if (req.method === 'GET') {
            if (sha1Str == signature) {
                console.log('来自微信get', req.query)
                res.send(echostr)
            }
            else {
                console.log('来自其他服务器1')
                res.end('error')
            }
        } else if (req.method === 'POST') {
            if (sha1Str == signature) {
                console.log('来自微信post', req.query)
                const xmlData = await getUserDataAsync(req)
                console.log('xmlData', xmlData)
                /**
                 *  <xml><ToUserName><![CDATA[gh_bb2ad240deff]]></ToUserName> 开发者id
<FromUserName><![CDATA[o2XvA0bWf5o_BG6sOM2aqrkBCJEs]]></FromUserName> 用户id
<CreateTime>1585499129</CreateTime>  发送时间抽
<MsgType><![CDATA[text]]></MsgType>  发送消息类型text文本
<Content><![CDATA[123]]></Content>     内容123
<MsgId>22698890679518508</MsgId>        微信服务器会默认保存三天用户发送的数据，通过此id三天内就能找到消息数据 
</xml>
                */
            //    将xml数据解析为js对象
            
                res.end('')
            }
            else {
                console.log('来自其他服务器2')

            }
        } else {
            res.end('error')
        }

        // next()
    }
}