[起步](./startup.md)
## SSR的网络请求
我们封装了网络请求的模块，基于[superagent](https://github.com/visionmedia/superagent)
### 使用
``` js
import http from 'utils/http-client';
async function demoFunc() {
  const { data } = await http.post('/api/xxx', {
    // 要传输的数据
    data: {
      field1 : '1 ',
      field2 : '2',
      field3 : '3 ',
    },
    headers: {
      header1: '1',
      header2: '2',
      header3: '3',
    }
  })
}
```
### 请求参数
url: 接口url
config: {
  data: object 要传输的数据,
  headers: object 要传输的头
}

### 返回
response.body
response header里如果有“Content-Type”为“application/json”，则返回object

### 背景
 在客户端，我们使用ajax请求时，会自动带上referer, cookie，nginx也会加上来源ip等信息。在服务端这些都是没有的，需要将客户端的信息带过去。因此我们封装了http-client, 在服务端发送请求前做了一些预处理
 ``` js
const preProcess = (config) => {
  config.headers = config.headers || {};
  if (!canUseDOM) {
    // 服务端请求后台时需要带上客户端的信息
    const { req } = contextHelper.getContext();
    config.headers = {
      ...config.headers,
      ...req.headers,
    };
  } 
}
 ```
