import path from 'path';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import { defaultPostcss, sassPostcss } from './postcss.config';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');
export default {
  context: path.resolve(__dirname, '../src'),
  mode: DEBUG ? 'development' : 'production',
  output: {
    path: path.resolve(__dirname, '../dist/static/assets'),
    publicPath: '/assets/',
    sourcePrefix: '  ',
  },

  module: {
    rules: [
      {
        test: /.(jsx?|tsx?)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: DEBUG,
              babelrc: false,
              presets: [
                [
                  '@babel/env',
                  {
                      modules: false,
                      useBuiltIns: 'usage',
                      targets: {
                        browsers: ['last 2 versions'],
                        node: 'current',
                      },
                  },
              ],
              '@babel/react',
              '@babel/typescript',
              ],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                'react-loadable/babel',
                '@babel/plugin-transform-runtime',
                [
                  '@babel/plugin-proposal-decorators',
                  {
                    'legacy': true,
                  },
                ],
                '@babel/proposal-class-properties',
                [
                  'import',
                  {
                    'libraryName': 'antd',
                    'style': 'css',
                  },
                ],
                ...DEBUG ? [] : [
                  'transform-react-remove-prop-types',
                ],
              ],
            },
          },
        ],
        include: [
          path.resolve(__dirname, '../src'),
        ],
      },
      {
        // 第三方UI组件库不适合module=true，所以单独处理
        test: /\.css$/,
        include: [
          path.resolve(__dirname, '../src/thirdpart/'),
          path.resolve(__dirname, '../node_modules/'),
        ],
        use: [
          ExtractCssChunks.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              minimize: !DEBUG,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: loader => defaultPostcss(loader),
            },
          },
        ],
      },
      {
        // add dynamic className for our project
        test(filePath) {
          return /\.css$/.test(filePath) && filePath.startsWith(path.resolve(__dirname, '../src'))
            && !filePath.startsWith(path.resolve(__dirname, '../src/thirdpart'));
        },
        use: [
          ExtractCssChunks.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: DEBUG,
              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: DEBUG ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:6]',
              // CSS Nano http://cssnano.co/options/
              minimize: !DEBUG,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: loader => defaultPostcss(loader),
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          ExtractCssChunks.loader,
          // `css-loader?${JSON.stringify({ sourceMap: DEBUG, minimize: !DEBUG })}`,
          {
            loader: 'css-loader',
            options: {
              sourceMap: DEBUG,
              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: DEBUG ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:6]',
              // CSS Nano http://cssnano.co/options/
              minimize: !DEBUG,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: loader => sassPostcss(loader),
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [{
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[hash:6].[ext]',
            },
          }, {
            loader: 'image-webpack-loader',
            options: {
              progressive: true,
              optimizationLevel: 7,
              interlaced: false,
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[hash:6].[ext]',
          },
        }],
      },
      {
        test: /\.(eot|ttf|wav|mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: DEBUG ? '[path][name].[ext]?[hash]' : '[hash].[ext]',
            },
          },
        ],
      },
      ...(DEBUG
        ? []
        : [
            {
              test: path.resolve(__dirname, '../node_modules/react-deep-force-update/lib/index.js'),
              loader: 'null-loader',
            },
          ]),
    ],
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      components: path.resolve(__dirname, '../src/components'),
      utils: path.resolve(__dirname, '../src/utils'),
    },
  },

  cache: DEBUG,

  stats: {
    assets: true,
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },
};
