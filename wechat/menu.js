/**
 * 自定义菜单
 */
module.exports = {
    "button": [{
        "type": "click",
        "name": "今日歌曲",
        "key": "V1001_TODAY_MUSIC"
    },
    {
        "name": "菜单",
        "sub_button": [{
            "type": "view",
            "name": "去百度",
            "url": "http://www.baidu.com/"
        },
        {
            "type": "click",
            "name": "赞一下我们",
            "key": "V1001_GOOD"
        },
        ]
    },
    {
        "name": "发图",
        "sub_button": [
            {
                "type": "pic_sysphoto",
                "name": "系统拍照发图",
                "key": "系统拍照发图1",
            },
            {
                "type": "pic_photo_or_album",
                "name": "拍照或者相册发图",
                "key": "拍照或者相册发图1",
            },
            {
                "type": "pic_weixin",
                "name": "微信相册发图",
                "key": "微信相册发图1",
            }
        ]
    },

    ]

}