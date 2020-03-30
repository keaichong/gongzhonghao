/**
 * 加工回复用户消息的模板(xml数据) 一般只会对文本进行回复
 */
module.exports = options => {
    let replyMessage = `<xml>
    <ToUserName><![CDATA[${options.ToUserName}]]></ToUserName>
    <FromUserName><![CDATA[${options.FromUserName}]]></FromUserName>
    <CreateTime>${options.CreateTime}</CreateTime>
    <MsgType><![CDATA[${options.MsgType}]]></MsgType>`
    if (options.MsgType === 'text') {
        replyMessage += `<Content><![CDATA[${options.content}]]></Content>`
    } else if (options.MsgType === 'image') {
        replyMessage += `<Image><MediaId><![CDATA[${options.MediaId}]]></MediaId></Image>`
    } else if (options.MsgType === 'voice') {
        replyMessage += `<Voice><MediaId><![CDATA[${options.MediaId}]]></MediaId></Voice>`
    } else if (options.MsgType === 'video') {
        replyMessage += `<Video><MediaId><![CDATA[${options.MediaId}]]></MediaId><Title><![CDATA[${options.title}]]></Title><Description><![CDATA[${options.description}]]></Description></Video>`
    }else if(options.MsgType === 'music'){
        replyMessage += `<Music><Title><![CDATA[${options.TITLE}]]></Title><Description><![CDATA[${options.DESCRIPTION}]]></Description><MusicUrl><![CDATA[${options.MUSIC_Url}]]></MusicUrl><HQMusicUrl><![CDATA[${options.HQ_MUSIC_Url}]]></HQMusicUrl><ThumbMediaId><![CDATA[${options.media_id}]]></ThumbMediaId></Music>`       
    }else if(options.MsgType === 'news'){
        // 可能会有多个item
        replyMessage += `<ArticleCount>${options.content.length}</ArticleCount>
        <Articles>`
      
            
        options.content.forEach(item => {
            replyMessage += `<item>
            <Title><![CDATA[${item.title}]]></Title>
            <Description><![CDATA[${item.description}]]></Description>
            <PicUrl><![CDATA[${item.picurl}]]></PicUrl>
            <Url><![CDATA[${item.url}]]></Url>
          </item>`
        }); 
        replyMessage   += '</Articles>'
    }
    console.log(replyMessage)
    replyMessage += '</xml>'
    return replyMessage
}