/**
 * 加工回复用户消息的模板(xml数据)
 */
module.exports = options => {
    let replyMessage = `<xml>
    <ToUserName><![CDATA[${options.FromUserName}]]></ToUserName>
    <FromUserName><![CDATA[${options.ToUserName}]]></FromUserName>
    <CreateTime>${options.CreateTime}</CreateTime>
    <MsgType><![CDATA[${options.msgType}]]></MsgType>`
    if (options.msgType === 'text') {
        replyMessage += `<Content><![CDATA[${options.content}]]></Content>`
    } else if (options.msgType === 'image') {
        replyMessage += `<Image><MediaId><![CDATA[${options.media_id}]]></MediaId></Image>`
    } else if (options.msgType === 'voice') {
        replyMessage += `<Voice><MediaId><![CDATA[${options.media_id}]]></MediaId></Voice>`
    } else if (options.msgType === 'video') {
        replyMessage += `<Video><MediaId><![CDATA[${options.media_id}]]></MediaId><Title><![CDATA[${options.title}]]></Title><Description><![CDATA[${options.description}]]></Description></Video>`
    }else if(options.msgType === 'music'){
        replyMessage += `<Music><Title><![CDATA[${options.TITLE}]]></Title><Description><![CDATA[${options.DESCRIPTION}]]></Description><MusicUrl><![CDATA[${options.MUSIC_Url}]]></MusicUrl><HQMusicUrl><![CDATA[${options.HQ_MUSIC_Url}]]></HQMusicUrl><ThumbMediaId><![CDATA[${options.media_id}]]></ThumbMediaId></Music>`       
    }else if(options.msgType === 'news'){
        // 可能会有多个item
        replyMessage += `<ArticleCount>1</ArticleCount>
        <Articles>
          <item>
            <Title><![CDATA[title1]]></Title>
            <Description><![CDATA[description1]]></Description>
            <PicUrl><![CDATA[picurl]]></PicUrl>
            <Url><![CDATA[url]]></Url>
          </item>
        </Articles>`      
    }

    replyMessage += '</xml>'
    return replyMessage
}