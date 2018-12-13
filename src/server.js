import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from  'http';
import hpp from 'hpp';
import ReactDom from 'react-dom/server';
import { createMemoryHistory, RouterContext, match } from 'react-router';
import { Provider } from 'react-redux';
import { trigger } from 'redial';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import helmet from 'helmet';
import React from 'react';
import  { middleware as contextMiddleware }  from 'express-httpcontext';
import Helm from 'react-helmet'; // because we are already using helmet
import { configureStore } from './store';
import createRoutes from './routes/root';
import ConvertLoadableComponents from 'utils/convert-loadable-components'
import assets from './assets';
import config from './config';
import stats from'./loadable.json';
const app = global.server = express();
global.config = config;
// view engine setu
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(morgan('dev'));
// 方便随时获取req, res 参见https://github.com/Jacky-fe/express-httpcontext
app.use(contextMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(hpp());
app.use(helmet.contentSecurityPolicy(config.csp));
app.use(helmet.xssFilter());
app.use(helmet.frameguard('deny'));
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './static')));
// API
app.use('/api/v0/posts', require('./api/posts').default);
app.use('/api/v0/post', require('./api/post').default);
// core render
app.get('*', async (req, res, next) => {
  const store = configureStore();
  const routes = createRoutes(store);
  const history = createMemoryHistory(req.path);
  const { dispatch } = store;
  try{
    match({ routes, history }, async (error, redirectLocation, renderProps) => {
      if (error){
        next(error);
      }
      else if (redirectLocation) {
        res.writeHead(302, { 'Location': redirectLocation.pathname + redirectLocation.search });
        res.end();
      }
      else if (renderProps) {
        const { components } = renderProps;
        // Define locals to be provided to all lifecycle hooks:
        const locals = {
          path: renderProps.location.pathname,
          query: renderProps.location.query,
          params: renderProps.params,
          // Allow lifecycle hooks to dispatch Redux actions:
          dispatch,
        };
        const preloadCompoents = await ConvertLoadableComponents(components);
        trigger('fetch', preloadCompoents, locals)
          .then(() => {
            const initialState = store.getState();
            const modules = [];
            const InitialView = (<Loadable.Capture report={moduleName => modules.push(moduleName)}>
              <Provider store={store}>
                <RouterContext {...renderProps} />
              </Provider>
            </Loadable.Capture>);
            const data = ReactDom.renderToString(InitialView);
            const allBundles = getBundles(stats, modules);
            const cssBundles = [];
            const jsBundles = [];
            allBundles.forEach(item => item.file.endsWith('.css') ? cssBundles.push(item.publicPath) : jsBundles.push(item.publicPath) );
            const head = Helm.rewind();
            const outputhtml = `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8"/>
                ${head.title.toString()}
                ${head.meta.toString()}
                ${head.link.toString()}
                ${cssBundles.map(item => `<link rel="stylesheet" href="${item}" type="text/css" />`)}
                ${assets.vendors.css ? `<link rel="stylesheet" href="${assets.vendors.css}" type="text/css" />` : ''}
                <link rel="stylesheet" href="${assets.client.css}" type="text/css" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <style rel="stylesheet" type="text/css">
                  body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,form,fieldset,input,textarea,p,blockquote,th,td{margin:0;padding:0;font-family:'微软雅黑'}table{border-collapse:collapse;border-spacing:0}fieldset,img{border:0}address,caption,cite,code,dfn,em,strong,th,var{font-style:normal;font-weight:normal}ol,ul,li{list-style:none}caption,th{text-align:left}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:normal}q:before,q:after{content:''}abbr,acronym{border:0}a{color:#000;text-decoration:none}a:active{color:#000}.clearfix:after{content:".";display:block;height:0;clear:both;visibility:hidden}.clear{clear:both}html{-webkit-text-size-adjust:none}
                </style>
              </head>
              <body>
                <div id="root" className="container-fluid">${data}</div>
                <script>
                window.INITIAL_STATE = ${JSON.stringify(initialState)};
                </script>
                <script type="text/javascript" src='${assets.vendors.js}'></script>
                <script type="text/javascript" src='${assets.client.js}'></script>
              </body>
            </html>
            `
            res.status(200).send(outputhtml);
          })
          .catch(e => console.log(e));
      }
      else{
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('Not Found');
        res.end();
      }
    })
  } catch (err) {
    console.log(err);
    next(err);
  }
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

const { port } = config;
app.set('port', port);

if (!module.hot) {
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}/`);
  });
  server.on('error', onError);
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

if (module.hot) {
  // 开启热更新，其实没什么卵用，就是为了reload App
  app.hot = module.hot;
}

export default app;
