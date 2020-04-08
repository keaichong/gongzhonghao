import toastComponent from './toast.vue' 
const toast = {

}

// 1.extend创建的是一个组件构造器,而不是一个具体的组件实例,所以他不能直接再new Vue中这样使用: new Vue({components:first}),最终还是要通过Vue.components注册才可以使用
//2.实例化extnds组件构造器时候,传入属性必须是propsData,而不是props
//构建一个子组件
// var todoItem = Vue.extend({
//     template:`<li>{{text}}</li>`,
//     props:{
//         text:{
//             type:String,
//             default:''
//         }
//     }
// })
toast.install=function(Vue,config){
    //install再执行的时候会默认导入Vue
    // 创建组件构造器
    var toastConstructor = Vue.extend(toastComponent)
    //new的方式根据组件构造器创建一个组件对象
    var instance = new toastConstructor()
    // 将组件对象挂载到一个元素上
    instance.$mount(document.createElement('div'))
    // toast.$el就是对应的div
    document.body.appendChild(instance.$el)
    // 可以获取到instance里面所有的方法data属性 instance.方法名 instance.属性名(两种方式)
    // Vue.prototype.$toast = instance
    Vue.prototype.$toast = (msg,time=2000)=>{
        instance.msg = msg
        instance.isshow = true
        setTimeout(()=>{
            instance.isshow = false
        },time)
    } 

    console.log('执行obj的install函数')
}
export default toast
