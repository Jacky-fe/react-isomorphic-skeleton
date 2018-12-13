import request from 'superagent';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import cookie from 'cookie';

function getUrl(path) {
  if (path.indexOf('http') === 0 || canUseDOM) {
    return path;
  }
  return `${global.config.api}${path}`;
}
let contextHelper = null;
/* eslint-disable */
if (!IS_BROWSER) {
/* eslint-enable */
  // 在服务端拿req和res必备
  contextHelper = require('express-httpcontext');
}
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
};
const HttpClient = {
  get: (path, config = {}) => new Promise((resolve, reject) => {
    preProcess(config);
    request.get(getUrl(path))
      .accept('application/json')
      .set(config.headers)
      .query(config.data)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.body);
        }
      });
  }),
  put: (path, config = {}) => new Promise((resolve, reject) => {
    preProcess(config);
    request
      .accept('application/json')
      .put(getUrl(path))
      .set(config.headers)
      .send(config.data)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.body);
        }
      });
  }),
  post: (path, config = {}) => new Promise((resolve, reject) => {
    preProcess(config);
    request
      .accept('application/json')
      .post(getUrl(path))
      .set(config.headers)
      .send(config.data)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.body);
        }
      });
  }),
  delete: (path, config = {}) => new Promise((resolve, reject) => {
    preProcess(config);
    request
      .accept('application/json')
      .del(getUrl(path))
      .set(config.headers)
      .query(config.data)
      .end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
  }),
};

export default HttpClient;
