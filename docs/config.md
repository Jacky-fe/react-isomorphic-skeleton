[起步](./startup.md)

## 配置

``` js
// 这个文件仅仅在服务端使用，不要在客户端读取这份文件
export default {
  // api服务器地址
  'api': 'http://localhost:3006',
  // 端口
  'port': 3006,
  // csp策略，参考https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP
  'csp' : {
    defaultSrc: ["'self'", '*.pstatp.com', '*.snssdk.com'],
    scriptSrc: ["'self'", '*.pstatp.com', '*.snssdk.com'],
    styleSrc: ["'self'", '*.pstatp.com', '*.snssdk.com'],
    imgSrc: ["'self'", '*.pstatp.com', '*.snssdk.com'],
    connectSrc: ["'self'", 'ws:'],
    fontSrc: ["'self'", '*.pstatp.com', '*.snssdk.com'],
    objectSrc: ["'none'"],
    mediaSrc: ["'none'"],
    frameSrc: ["'none'"],
  },
}

```