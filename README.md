# 商城app react-native 项目重构

### NetUtils使用说明( `/app/utils/NetUtils` )：
---

#### 引入
``` javascript
import { post, get } from '../utils/NetUtils';

//可以自定义函数名
import { post as $post, get as $get } from '../utils/NetUtils';
```
#### 使用方式
``` javascript
/**
 *  POST方式发送请求
 * @param url String 请求连接
 * @param params Object 请求参数
 * @returns {*}
 */
post('http://192.168.4.240:8097/member/front-user-center/v1/baseop/login',{
    user_id:'13728620010',
    pass_word : MD5('123456'),
}).then((rs)=>{
    console.log('返回结果:',rs);
}).catch((error)=> {
    console.log('出错了:',error);
}).done();

/**
 *  Get方式发送请求
 * @param url String 请求连接
 * @param params Object 请求参数
 * @returns {*}
 */
get('http://192.168.4.240:8097/member/front-user-center/v1/baseop/XXXX',{
    firstParams:'123',
    secendParams :'456',
}).then((rs)=>{
    console.log('返回结果:',rs);
}).catch((error)=> {
    console.log('出错了:',error);
}).done();

```

注意：clientID 和 clientKey 在`app/constant/Consts.js`中配置

---
