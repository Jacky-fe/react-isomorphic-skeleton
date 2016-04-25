'use strict';
var path = require('path');
var webpack = require('webpack');
import AssetsPlugin from 'assets-webpack-plugin';
const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');
var isProduction = !DEBUG;
var isDevelopment = !isProduction;
var getArray = function getArray() {
	var _ref;
	return (_ref = []).concat.apply(_ref, arguments).filter(Boolean);
};
var stats = {
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
 
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];
const postcss = function (webpackBundler) {
    return [
      require('postcss-import')({ addDependencyTo: webpackBundler }),
      require('precss')(),
      require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
    ];
};
const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  __DEV__: DEBUG,
};
var clientConfig = {
	postcss,
	stats : stats,
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
		path: path.resolve(__dirname,'../dist/static/js/'),
		filename: 'index.[hash].js',
		publicPath: '/js/',
		chunkFilename: '[id].[hash].js',
	},
	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json']
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
		new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.[hash].js'),
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
	        loader: 'url-loader?limit=10000',
	    },],
	}
};
var serverConfig = {
	postcss,
	entry: getArray(['./src/server.js']),
	output: {
		path: './dist',
		filename: 'server.js',
		libraryTarget: 'commonjs2',
		publicPath: '/'
	},
	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json']
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
		isProduction && new webpack.optimize.DedupePlugin(), 
		isProduction && new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			sourceMap: true
		}),
		isDevelopment && new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({ ...GLOBALS, 'process.env.BROWSER': false }),
		new webpack.ProvidePlugin({
			"React": "react"
		})
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
	        loader: 'url-loader?limit=10000',
	    }, {
	        test: /\.(eot|ttf|wav|mp3)$/,
	        loader: 'file-loader',
	    },]
	}
};
module.exports = [clientConfig, serverConfig];