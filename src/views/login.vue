<template>
  <div class="home">
    用户名<input type="text" v-model="userName">
    密码<input type="text" v-model="pwd">
    <button @click="login">登陆</button>
    <button @click="resign">注册</button>
        <!-- "serve:prod": "cross-env VUE_APP_SECRET=sit vue-cli-service build && cross-env VUE_APP_SECRET=sit node ./deploy",//打包之后在进行部署 -->

  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'login',
  data() {
    return {
      pwd:'',
      userName:'',
      src:require("../assets/logo.png"),
      queryData:''
    }
  },
 async created(){
    // https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect
    var AppID = 'wxdac46b7ab0d6f17c';
    var AppSecret = 'f6a63ea37893de1582e4f5362b4dc51b';
      this.$http.get('/api/auth').then(res=>{
        console.log({res})
      });
    this.get3()
  },
  methods:{
    login(){
      this.$http.post('/api/login',{pwd:this.pwd,name:this.userName}).then(res=>{
          if(+res.data.code === 200){
              this.$router.push('404')
          }else{
            alert(res.data.message)
          }
      })
    },
    resign(){
       this.$http.post('/api/add',{pwd:this.pwd,name:this.userName}).then(res=>{
           alert(res.data.message)
      })
    },
     get1 () {
         console.log(this.queryData,'this.queryData1')
        //  必须return 一个promise await 才生效
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let num1 = 1
          console.log('get1执行')
           this.queryData = {a:1,b:2}
          resolve(num1)
          
        }, 3000)
      })
    },
    get2 () {
      console.log(this.queryData,'this.queryData2')
      return new Promise((resolve, reject) => {
        setTimeout(() => {
         let num2 = 2
          console.log('get2执行')
          resolve(num2)
        }, 1000)
      })
    },
    async get3 () {
      // Promise.all([await this.get1(), await this.get2()]).then((data) => {
      //   console.log(data)
      // })
      // then 和 catch 中返回 promise，会在这个 promise resolve 或 reject 的时候，把 resolve 或 reject 的结果作为参数传给后面的 then 或 catch。如果返回普通类型的值，就直接作为参数传给下一个 then
      // 传给 then 的函数内返回的值会传给传给下一个 then 的函数
      // return {a:1,b:2} 等价于  Promise.resolve({a:1,b:2})
      await this.get1()
       this.get2().then(res => { return {a:1,b:2} } ).then(res => console.log(res,'res1')).catch(err=>console.log(err,'err'))
    }
  }
  
}
</script>
<style lang="">

</style>