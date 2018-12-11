export default {
  'api': 'http://localhost:3006',
  // 只在服务端有用
  'port': 3006,
  // csp策略，参考https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP
  // 目前加了常用的cdn和端上的域名，视业务再加
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