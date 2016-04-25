/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Browsersync from 'browser-sync';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import run from './run';
import runServer from './runServer';
import webpackConfig from './webpack.config';
import clean from './clean';
import copy from './copy';
const DEBUG = !process.argv.includes('--release');
/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
async function start() {
  await run(clean);
  await run(copy.bind(undefined, {
    watch: true
  }));
  await new Promise(resolve => {
    // Patch the client-side bundle configurations
    // to enable Hot Module Replacement (HMR) and React Transform
    webpackConfig.filter(x => x.target !== 'node').forEach(config => {
      config
        .module
        .loaders
        .filter(x => x.loader === 'babel-loader')
        .forEach(x => (x.query = { // eslint-disable-line no-param-reassign
          // Wraps all React components into arbitrary transforms
          // https://github.com/gaearon/babel-plugin-react-transform
          plugins: [
            ['react-transform', {
              transforms: [{
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module'],
              }, {
                transform: 'react-transform-catch-errors',
                imports: ['react', 'redbox-react'],
              }, ],
            }, ],
          ],
        }));
    });

    const bundler = webpack(webpackConfig);
    const wpMiddleware = webpackMiddleware(bundler, {

      // IMPORTANT: webpack middleware can't access config,
      // so we should provide publicPath by ourselves
      publicPath: webpackConfig[0].output.publicPath,

      // Pretty colored output
      stats: webpackConfig[0].stats,
      // For other settings see
      // https://webpack.github.io/docs/webpack-dev-middleware
    });
    const hotMiddlewares = bundler
      .compilers
      .filter(compiler => compiler.options.target !== 'node')
      .map(compiler => webpackHotMiddleware(compiler));

    let handleServerBundleComplete = () => {
      console.log('webpack compile done');
      runServer((err, host) => {
        if (!err) {

          const bs = Browsersync.create();
          bs.init({
            ...(DEBUG ? {} : {
              notify: false,
              ui: false
            }),

            proxy: {
                target: host,
                middleware: [wpMiddleware, ...hotMiddlewares],
              },

              // no need to watch '*.js' here, webpack will take care of it for us,
              // including full page reloads if HMR won't work
              files: ['dist/views/**/*.*'],
          }, resolve);
          handleServerBundleComplete = runServer;
        }
      });
    };

    bundler.plugin('done', (states) => { handleServerBundleComplete(); });
  });
}

export default start;