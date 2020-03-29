module.exports = {
    getUserDataAsync(req){
        return new Promise((resolve,reject)=>{
            let xmlData = ''
            req.on('data',data=>{
                // 数据传递过来 会触发当前时间 会将数据注入到当前回调函数中
                console.log('data')
                // 读取的数据是buffer数据 还要装换成字符串
                xmlData += data.toString()
            })
            .on('end',()=>{
                // 数据接收完毕会触发
                console.log('end')
                resolve(xmlData)
            })
        })
    }
}