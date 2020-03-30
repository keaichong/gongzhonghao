/*
验证服务器有效性模块

*/
const sha1 = require('sha1')
const config = require('../config')
const {
    getUserDataAsync,
    parseXMLAsync,
    formatMessage
} = require('../utils/tools')
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
        const {
            signature,
            echostr,
            timestamp,
            nonce
        } = req.query
        const {
            token
        } = config
        const arr = [timestamp, nonce, token]
        const arrstr = arr.sort().join('')
        const sha1Str = sha1(arrstr)
        if (req.method === 'GET') {
            if (sha1Str == signature) {
                console.log('来自微信get', req.query)
                res.send(echostr)
            } else {
                console.log('get来自其他服务器')
                res.end('error')
            }
        } else if (req.method === 'POST') {
            if (sha1Str == signature) {
                console.log('来自微信post', req.query)
                const xmlData = await getUserDataAsync(req) //获取请求体数据 用户发送的消息
                /**微信发送的xml数据
                 *  <xml><ToUserName><![CDATA[gh_bb2ad240deff]]></ToUserName> 开发者id
<FromUserName><![CDATA[o2XvA0bWf5o_BG6sOM2aqrkBCJEs]]></FromUserName> 用户id
<CreateTime>1585499129</CreateTime>  发送时间抽
<MsgType><![CDATA[text]]></MsgType>  发送消息类型text文本
<Content><![CDATA[123]]></Content>     内容123
<MsgId>22698890679518508</MsgId>        微信服务器会默认保存三天用户发送的数据，通过此id三天内就能找到消息数据 
</xml>
                */
                //    将xml数据解析为js对象
                const jsData = await parseXMLAsync(xmlData)
                /**  解析后的数据
               * { xml:
   { ToUserName: [ 'gh_bb2ad240deff' ],
     FromUserName: [ 'o2XvA0bWf5o_BG6sOM2aqrkBCJEs' ],
     CreateTime: [ '1585549853' ],
     MsgType: [ 'text' ],
     Content: [ '你是谁' ],
     MsgId: [ '22699619216575937' ] } }
               */
            //   格式化数据
            const message = formatMessage(jsData )
            console.log(message)

            /**  简单自动回复
             * 一旦遇到以下情况，微信都会在公众号会话中，向用户下发系统提示“该公众号暂时无法提供服务，请稍后再试”：
                    1、开发者在5秒内未回复任何内容 2、开发者回复了异常数据，比如JSON数据等
             */
            // 判断用户消息是不是文本
            if(message.MsgType === 'text'){
                if(message.Content === '1'){//判断内容具体是什么
                    content ='不要耍微信了'
                }else if(message.Content.includes('爱')){
                    content = "我也爱你~"
                }else{
                    content = "我听不懂你在什么 ,你不要发了~"
                }
            }
                let replyMessage = `<xml>
                <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                <CreateTime>${Date.now}</CreateTime>
                <MsgType><![CDATA[text]]></MsgType>
                <Content><![CDATA[${content}]]></Content>
              </xml>`
            // 返回响应给微信服务器
                res.end(replyMessage)
            } else {
                console.log('post来自其他服务器')

            }
        } else {
            res.end('error')
        }

        // next()
    }
}