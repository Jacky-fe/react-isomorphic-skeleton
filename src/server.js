import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
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
import { StyleSheetServer } from 'aphrodite';
import { configureStore } from './store';
import Helm from 'react-helmet'; // because we are already using helmet
import reducer from './createReducer';
import createRoutes from './routes/root';
import helmet from 'helmet';
import Wrapper from './components/Wrapper';

const isProduction = process.env.NODE_ENV === 'production';
const app = global.server = express();
// view engine setu
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(compression());
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
  const cssByLoader = [];
  const store = configureStore();
  const routes = createRoutes(store);
  const history = createMemoryHistory(req.path);
  const { dispatch } = store;
  try{
    match({ routes, history }, (error, redirectLocation, renderProps) => {
      if (error){
        next(error);
      }
      else if (redirectLocation) {
        res.writeHead(302, { 'Location': redirectLocation.pathname + redirectLocation.search });
        res.end();
      }
      else if (renderProps) {
        
        const { components } = renderProps;
        const allStyles = [];
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
            const data = StyleSheetServer.renderStatic(
              () => ReactDom.renderToString(InitialView)
            );
            const head = Helm.rewind();
            res.status(200).render('layout', {
              content: data.html,
              app: assets.app.js,
              vendors: assets.vendors.js,
              initialState,
              head,
              data,
              cssByLoader: cssByLoader.join('')
            });
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

const server = http.createServer(app);
server.listen(port, () => {
  //for tools/runserver.js enable callback
  console.log(`The server is running at http://localhost:${port}/`);
});
server.on('error', onError);

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

