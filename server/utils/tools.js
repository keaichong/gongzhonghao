// 解析xml数据为js
const {
    parseString
} = require('xml2js')
module.exports = {
    getUserDataAsync(req) {
        return new Promise((resolve, reject) => {
            let xmlData = ''
            req.on('data', chunk => {
                    // 请求体数据传递过来 会触发当前时间 会将数据注入到当前回调函数中
                    // 读取的数据是buffer数据 还要装换成字符串
                    xmlData += chunk.toString()
                })
                .on('end', () => {
                    // 请求体数据接收完毕会触发
                    resolve(xmlData)
                })
        })
    },
    parseXMLAsync(xmlData) {
        return new Promise((resolve, reject) => {
            parseString(xmlData, {
                trim: true
            }, (err, data) => {
                if (!err) {
                    resolve(data)
                } else {
                    reject('解析错误xml' + err)
                }
            })
        })
    },
    formatMessage(jsData) {
        let message = {};
        jsData = jsData.xml;
        /**  解析后的数据
               * { xml:
   { ToUserName: [ 'gh_bb2ad240deff' ],
     FromUserName: [ 'o2XvA0bWf5o_BG6sOM2aqrkBCJEs' ],
     CreateTime: [ '1585549853' ],
     MsgType: [ 'text' ],
     Content: [ '你是谁' ],
     MsgId: [ '22699619216575937' ] } }
               */
        if (typeof jsData === 'object') {
            for (let key in jsData) {
                //获取属性值
                let value = jsData[key]
                // 值是否是一个数组并且长度大于0
                if (Array.isArray(value) && value.length > 0) {
                    // 将合法数据赋值到message对象上
                    message[key] = value[0]
                }
            }
        }
        return message
    }
}