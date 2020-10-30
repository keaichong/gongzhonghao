import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import axios from './utils/axios'
import axios from 'axios'
import toast from './views/toast'
import wx from 'weixin-js-sdk'
// var wx = require('weixin-js-sdk');
// 如果是非线上环境，加载 VConsole（移动端适用）
// if (process.env.NODE_ENV !== 'production') {
    var VConsole = require('vconsole/dist/vconsole.min.js');
    var vConsole = new VConsole();
// }
Vue.config.productionTip = false
Vue.prototype.$http = axios
// 添加事件总线对象
Vue.prototype.$bus = new Vue()
//安装toast插件
Vue.use(toast)//会自动执行toast里面的install函数
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
