'use strict';
import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import rucksack from 'rucksack-css';
import autoprefixer from 'autoprefixer';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');
const isProduction = !DEBUG;
const isDevelopment = !isProduction;
const getArray = function getArray() {
    const _ref = [];
    return _ref.concat.apply(_ref, arguments).filter(Boolean);
};
const stats = {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
 };
 
const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  __DEV__: DEBUG,
};

const loaders = [
    {
      test(filePath) {
        return /\.css$/.test(filePath) && !/\.module\.css$/.test(filePath);
      },
      loader: 'isomorphic-style-loader!css?sourceMap&-restructuring!postcss',
    },
    {
      test: /\.module\.css$/,
      loader: 'isomorphic-style-loader!css?sourceMap&-restructuring&modules&localIdentName=[local]___[hash:base64:5]!' +
        'postcss'
    },
    {
      test(filePath) {
        return /\.less$/.test(filePath) && !/\.module\.less$/.test(filePath);
      },
      loader: 
        'isomorphic-style-loader!css?sourceMap!' +
        'postcss!' +
        `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify({})},"minimize":${!DEBUG}}`
      ,
    },
    {
        test: /\.scss$/,
        loaders: [
          'isomorphic-style-loader',
          `css-loader?${JSON.stringify({ sourceMap: DEBUG, minimize: !DEBUG })}`,
          'postcss',
          'sass-loader',
        ],
    },
    {
      test: /\.module\.less$/,
      loader: 
        'isomorphic-style-loader!css?sourceMap&modules&localIdentName=[local]___[hash:base64:5]!' +
        'postcss!' +
        `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify({})}}`
      ,
    },
];

const postcss = [
    rucksack(),
        autoprefixer({
        browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8'],
    }),
];
const clientConfig = {
    stats,
    postcss,
    entry: {
        app: getArray([isDevelopment && 'webpack-hot-middleware/client', './src/client.js']),
        vendors: [  
            'react',
            'react-dom',
            'react-redux',
            'react-router',
            'redux',
        ],
    },
    output: {
        path: path.resolve(__dirname,'../dist/static/assets/'),
        filename: 'index.[hash:6].js',
        publicPath: '/assets/',
        chunkFilename: '[id].[hash:6].js',
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
        modulesDirectories: ['node_modules', path.resolve(__dirname, '../node_modules')],
    },
    plugins: getArray([
        new webpack.optimize.OccurenceOrderPlugin(), 
        isProduction && new webpack.optimize.DedupePlugin(), 
        isProduction && new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: true,
            compress: {
                unused: true,
                dead_code: true,
                warnings: false,
                screw_ie8: true,
            }
        }),
        new webpack.ProvidePlugin({
            "React": "react"
        }), 
        new webpack.DefinePlugin({ ...GLOBALS, 'process.env.BROWSER': true }),
        isDevelopment && new webpack.HotModuleReplacementPlugin(),
        isDevelopment && new webpack.NoErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.[hash:6].js'),
        new AssetsPlugin({
            path: path.join(__dirname, '../dist'),
            filename: 'assets.js',
            processOutput: x => `module.exports = ${JSON.stringify(x)};`,
        }),
    ]),
    devtool: isDevelopment ? 'cheap-module-eval-source-map' : false,
    module: {
        loaders: [{
            test: /\.jsx?$/, 
            loaders: getArray(isDevelopment && 'react-hot', 'babel-loader'),
            include: path.resolve(__dirname, '../src'),
        }, {
            test: /\.json$/,
            loader: 'json-loader',
        }, {
            test: /\.txt$/,
            loader: 'raw-loader',
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
            loader: 'url-loader?limit=10000&name=[hash:6].[ext]',
        },
        ...loaders],
    }
};
const serverConfig = {
    postcss,
    entry: getArray(['./src/server.js']),
    output: {
        path: './dist',
        filename: 'server.js',
        libraryTarget: 'commonjs2',
        publicPath: '/assets/'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
        modulesDirectories: ['node_modules', path.resolve(__dirname, '../node_modules')],
    },
    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false
    },
    devtool: 'source-map',
    plugins: getArray([
        new webpack.optimize.OccurenceOrderPlugin(), 
        new webpack.DefinePlugin({ ...GLOBALS, 'process.env.BROWSER': false }),
        new webpack.ProvidePlugin({
            "React": "react"
        }),
    ]),
    externals: [/^[a-z\-0-9]+$/,  /^\.\/assets$/],
    target: 'node',
    module: {
        loaders: [{
            test: /\.jsx?$/, 
            loaders: getArray(isDevelopment && 'react-hot', 'babel-loader'),
            include: path.resolve(__dirname, '../src'),
        }, {
        test: /\.json$/,
        loader: 'json-loader',
        }, {
            test: /\.json$/,
            loader: 'json-loader',
        }, {
            test: /\.txt$/,
            loader: 'raw-loader',
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
            loader: 'url-loader?limit=10000&name=[hash:6].[ext]',
        }, {
            test: /\.(eot|ttf|wav|mp3)$/,
            loader: 'file-loader',
        },
        ...loaders]
    }
};
module.exports = [clientConfig, serverConfig];