import axios from 'axios';
import qs from 'qs';

// 创建axios实例
const service=axios.create({
    // https://api-m.mtime.cn
    baseURL:'http://localhost:3000',
    timeout:5000,
    // headers:{
    //   'Host':'api-m.mtime.cn'
    // },
    // 处理参数
    transformRequest:[function(data){
      data=qs.stringify(data);
      return data;
    }]
  })
  
  // request拦截器
//   ...
  // respone拦截器
//   ...
export default service