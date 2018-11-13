import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from  'http';
import hpp from 'hpp';
import assets from './assets';
import ReactDom from 'react-dom/server';
import { createMemoryHistory, RouterContext, match } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { trigger } from 'redial';
import { callAPIMiddleware } from './middleware/callAPIMiddleware';
import { configureStore } from './store';
import Helm from 'react-helmet'; // because we are already using helmet
import reducer from './createReducer';
import helmet from 'helmet';
import Wrapper from './components/Wrapper';
import React from 'react';
import createRoutes from './routes/root';

const isProduction = process.env.NODE_ENV === 'production';
const app = global.server = express();
// view engine setu
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// uncomment after placing your favicon in ./static
//app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(hpp());
app.use(helmet.contentSecurityPolicy({
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'"],
  imgSrc: ["'self'"],
  connectSrc: ["'self'", 'ws:'],
  fontSrc: ["'self'"],
  objectSrc: ["'none'"],
  mediaSrc: ["'none'"],
  frameSrc: ["'none'"],
}));
app.use(helmet.xssFilter());
app.use(helmet.frameguard('deny'));
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './static')));
// API
app.use('/api/v0/posts', require('./api/posts'));
app.use('/api/v0/post', require('./api/post'));
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
        const { components, routes: sourceRoutes } = renderProps;
        const allStyles = [];
        const cssByLoader = [];
        const insertCss = (...styles) => {
          styles.forEach( (item, index, array) => {
            // avoid repeat rendering
            if (allStyles.indexOf(item) < 0) {
              allStyles.push(item);
              cssByLoader.push(item._getCss());
            }
          });
        };
        const context = {insertCss};
        // Define locals to be provided to all lifecycle hooks:
        const locals = {
          path: renderProps.location.pathname,
          query: renderProps.location.query,
          params: renderProps.params,
          // Allow lifecycle hooks to dispatch Redux actions:
          dispatch,
        };
        trigger('fetch', components, locals)
          .then(() => {
            
            const initialState = store.getState();
            const InitialView = (
              <Wrapper context={context}>
                <Provider store={store}>
                  <RouterContext {...renderProps} />
                </Provider>
               </Wrapper> 
            );
            const data = ReactDom.renderToString(InitialView);
        
            const head = Helm.rewind();
            const outputhtml = `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8"/>
                ${head.title.toString()}
                ${head.meta.toString()}
                ${head.link.toString()}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <style rel="stylesheet" type="text/css">
                  body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,form,fieldset,input,textarea,p,blockquote,th,td{margin:0;padding:0;font-family:'微软雅黑'}table{border-collapse:collapse;border-spacing:0}fieldset,img{border:0}address,caption,cite,code,dfn,em,strong,th,var{font-style:normal;font-weight:normal}ol,ul,li{list-style:none}caption,th{text-align:left}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:normal}q:before,q:after{content:''}abbr,acronym{border:0}a{color:#000;text-decoration:none}a:active{color:#000}.clearfix:after{content:".";display:block;height:0;clear:both;visibility:hidden}.clear{clear:both}html{-webkit-text-size-adjust:none}
                </style>
                <style id="css">${cssByLoader.join('')}</style>
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
      error: err
    });
  });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

const port = 3000;
app.set('port', port);

if (!module.hot) {
  const server = http.createServer(app);
  server.listen(port, () => {
      //for tools/runserver.js enable callback
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
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./server.js');
  /*\
  module.hot.accept('./routes/root', () => {
    console.log('server changed==============================');
  });*/
}

export default app;
