import path from 'path';
import webpack from 'webpack';
import extend from 'extend';
import AssetsPlugin from 'assets-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import { ReactLoadablePlugin } from 'react-loadable/webpack';
import config from './webpack.base.config';
const DEBUG = !process.argv.includes('--release');
const isAnalyze =
  process.argv.includes('--analyze') || process.argv.includes('--analyse');

const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  __DEV__: DEBUG,
};

const clientConfig = extend(true, {}, config, {
  entry: {
    client: ['./client.js'],
  },
  name: 'client',
  output: {
    filename: DEBUG ? '[name].js?[chunkhash]' : '[name].[chunkhash].js',
    chunkFilename: DEBUG ? '[name].js?[chunkhash]' : '[name].[chunkhash].js',
  },

  target: 'web',
  optimization: {
    minimize: !DEBUG,
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
        },
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({ ...GLOBALS, 'process.env.BROWSER': true, IS_BROWSER: true }),
    // css切割
    new ExtractCssChunks({
      filename:'[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css',
      hot: true, // if you want HMR - we try to automatically inject hot reloading but if it's not working, add it to the config
      orderWarning: true, // Disable to remove warnings about conflicting order between imports
      reloadAll: true, // when desperation kicks in - this is a brute force HMR flag
      cssModules: true, // if you use cssModules, this can help.
    }),
    new ReactLoadablePlugin({
      filename: path.resolve(__dirname, '../dist/loadable.json'),
    }),
    new AssetsPlugin({
      path: path.resolve(__dirname, '../dist'),
      filename: 'assets.js',
      processOutput: x => `module.exports = ${JSON.stringify(x)};`,
    }),
    ...DEBUG ? [] : [
      new webpack.optimize.AggressiveMergingPlugin(),
      ...isAnalyze? [new BundleAnalyzerPlugin()]: [],
    ],
  ],
  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
});

const serverConfig = extend(true, {}, config, {
  entry: './server.js',
  name: 'server',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'server.js',
    chunkFilename: 'chunks/[name].js',
    libraryTarget: 'commonjs2',
  },
  optimization: {
    minimize: false, // 服务端不压缩代码，方便定位问题
  },
  target: 'node',

  externals: [/^[a-z\-0-9]+$/, /^\.\/assets$/, /\.\/loadable.json/],

  plugins: [
    // css切割
    new ExtractCssChunks({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css',
      hot: true, // if you want HMR - we try to automatically inject hot reloading but if it's not working, add it to the config
      orderWarning: true, // Disable to remove warnings about conflicting order between imports
      reloadAll: true, // when desperation kicks in - this is a brute force HMR flag
      cssModules: true, // if you use cssModules, this can help.
    }),
    new webpack.DefinePlugin({ ...GLOBALS, 'process.env.BROWSER': false, IS_BROWSER: false }),
    new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: false }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  ],

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },

  devtool: 'source-map',
});

export default [clientConfig, serverConfig];
