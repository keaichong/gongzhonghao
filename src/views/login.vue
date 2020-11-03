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
      src:require("../assets/logo.png")
    }
  },
  created(){
    // https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect
    var AppID = 'wxdac46b7ab0d6f17c';
    var AppSecret = 'f6a63ea37893de1582e4f5362b4dc51b';
      this.$http.get('/api/auth').then(res=>{
        console.log({res})
      })
  },
  methods:{
    login(){
      this.$http.post('/api/login',{pwd:this.pwd,userName:this.userName}).then(res=>{
          if(+res.data.code === 200){
              this.$router.push('404')
          }else{
            alert('密码错误')
          }
      })
    },
    resign(){

    }
  }
}
</script>
<style lang="">

</style>