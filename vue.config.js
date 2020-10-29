console.log('****************************')
console.log('当前环境'+process.env.VUE_APP_SECRET)
console.log('****************************')
console.log()
const precessEnv = process.env;
switch( precessEnv.VUE_APP_SECRET )
{

    case 'sit':

       console.log('sit地址')

        break

    case 'uat':

       console.log('uat地址')
       console.log('uat地址'+process.env.VUE_APP_BASEURL)

//         curBaseUrl = 'http://192.168.2.2:8080';

        break

    default:

       console.log('默认地址')

}
module.exports = {
    // 基本路路径, vue.cli 3.3以前请使用baseUrl
    publicPath: './', //之前是  / 
    // 打包输出文件目录
    outputDir: 'docs', //之前是  dist
    // ⽤用于嵌套生成的静态资产（js，css，img，fonts）的目录。
    assetsDir: './assets',
    // ⽣生产环境sourceMap
    productionSourceMap: true,
    // webpack配置
    configureWebpack: () => {},
    chainWebpack: () => {},
    // css相关配置
    css: {
    // 启⽤用 CSS modules
    // modules: false,
    requireModuleExtension:false,
    // 是否使⽤用css分离插件
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器器配置项
    loaderOptions: {},
    },
    // webpack-dev-server 相关配置
    devServer: {
    open:true,
    host: '0.0.0.0',
    port: 8080,
    // proxy:null,
    proxy: {
        '/': {
          target: 'https://b964e5521ccf.ngrok.io',
          // target: 'http:/192.168.7.174:3000/api',
          ws: true,
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            '^/api': ''
          }
        },
        // '/test': {
        //   target: 'http://localhost:3000',//遇见/test就用target替换请求中的地址
        //   ws: true,
        //   changeOrigin: true,
        //   secure: false,
        //   pathRewrite: {//后端接口没有/test就用空字符串替换掉
        //     '^/test': ''
        //   }
        // },
      // }, // 设置代理理
    },
    // 第三⽅方插件配置
    // pluginOptions: {
    // ...
    // }
    }
  }