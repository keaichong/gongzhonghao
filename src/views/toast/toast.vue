<template>
    <div class="toast" v-show="isshow">
       <div>{{msg}}</div>
    </div>
</template>
<script>
import $ from 'jquery'
export default {
    data() {
        return {
           msg:'',
           isshow:false 
        }
    },
    methods: {
        show(msg,time=1500){
            this.msg=msg
            this.isshow =true
            setTimeout(() => {
                this.msg='';
                this.isshow = false;
            }, time);
        }
    },
}
</script>
<style lang="less" scoped>
.toast{
    padding:8px;
    color:#fff;
    background-color:#000;
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%)
}
</style>