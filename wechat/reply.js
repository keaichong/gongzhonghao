
/**
 * 处理用户发送的消息类型和内容，决定返回不同的内容给用户
 */
module.exports = (message)=> {
    let options ={
        ToUserName: message.FromUserName,
        FromUserName:message.ToUserName,
        CreateTime:Date.now(),
        MsgType:'text',
       
     }
            /**  简单自动回复
             * 一旦遇到以下情况，微信都会在公众号会话中，向用户下发系统提示“该公众号暂时无法提供服务，请稍后再试”：
                    1、开发者在5秒内未回复任何内容 2、开发者回复了异常数据，比如JSON数据等
             */
            // 判断用户消息是不是文本
     let content = "听不懂你在说什么"
     if(message.MsgType === 'text'){
         if(message.Content === '1'){//判断内容具体是什么
             content ='不要耍微信了'
         }else if(message.Content.includes('爱')){
             content = "我也爱你~"
         }
     }else if(message.MsgType === 'image'){//图片
        options.MsgType = 'image'
        options.MediaId = message.MediaId

     }else if(message.MsgType === 'voice'){
        options.MsgType = 'voice'
        options.MediaId = message.MediaId
        // 语音识别消息
        console.log(message.Recognition)
     }else if(message.MsgType === 'location'){
        //  简单回复一个文本 信息
        content =`纬度信息${ message.Location_X}`
     }else if(message.MsgType === 'event'){//订阅 消息
        if(message.Event === 'subscribe'){//订阅
            content="欢迎您的关注"
            if(message.Eventkey){
                content = '用户扫描带参数的二维码关注公众号'
            }
        }else if(message.Event === 'unsubscribe'){//取消订阅
            console.log('有个用户取消了订阅')
        }
     }else if(message.MsgType === 'SCAN'){
            content = '用户扫描过 再次扫描带参数的二维码关注公众号'
     }else if(message.MsgType === 'LOCATION'){
            content = `纬度${message.Location_X}`
     }else if(message.MsgType === 'CLICK'){
        content = `你点击了按钮${message.Eventkey}`
     }
     options.content = content
     return options
}