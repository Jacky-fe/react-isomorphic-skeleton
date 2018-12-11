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
if (!IS_BROWSER) {
  // 在服务端拿req和res必备
  contextHelper = require('express-httpcontext');
}
const preProcess = (config) => {
  if (canUseDOM) {
    // 客户端需要加上csrf_secret
    const csrfSecret =  cookie.parse(document.cookie)['csrf-secret'];
    config.headers = {
      ...config.headers,
      ...csrfSecret ? {
        'x-csrf-secret': csrfSecret,
      } : {},
    };
  } else {
    const { req } = contextHelper.getContext();
    const csrfSecret =  req.cookies['csrf-secret'];
    config.headers = {
      ...config.headers,
      ...req.headers,
      ...csrfSecret ? {
        'x-csrf-secret': csrfSecret,
      } : {},
    };
  }
  // console.log(config);
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
