'use strict';
import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
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
 
const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  __DEV__: DEBUG,
};
const loaders = [
   
    {
        // third pard ui componnet has compiled, so dynamic className is not fit
        // eg: antd 
        test: /\.css$/,
        include: [
            path.join(__dirname, "../node_modules"),
        ],
        loader: 'isomorphic-style-loader!css?sourceMap&-restructuring!postcss?pack=default'
    },
    {
        // add dynamic className for our project
        test: /\.css$/,
        include: [
            path.join(__dirname, "../src"),
        ],
        loaders: [
            'isomorphic-style-loader',
            `css-loader?${JSON.stringify({
                sourceMap: DEBUG,
                // CSS Modules https://github.com/css-modules/css-modules
                modules: true,
                localIdentName: DEBUG ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:6]',
                // CSS Nano http://cssnano.co/options/
                minimize: !DEBUG,
            })}`,
            'postcss-loader?pack=default',
        ],
    },
    {
        test: /\.scss$/,
        loaders: [
          'isomorphic-style-loader',
          `css-loader?${JSON.stringify({ sourceMap: DEBUG, minimize: !DEBUG })}`,
          'postcss-loader?pack=sass',
          'sass-loader',
        ],
    }, {
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
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader?limit=10000&name=[hash:6].[ext]!image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
    }, {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader?limit=10000&name=[hash:6].[ext]',
    },{
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
    },
];
/*
const postcss = [
    rucksack(),
        autoprefixer({
        browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8'],
    }),
];*/
function postcss (bundler) {
    return {
      default: [
        // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
        // https://github.com/postcss/postcss-import
        require('postcss-import')({ addDependencyTo: bundler }),
        // W3C variables, e.g. :root { --color: red; } div { background: var(--color); }
        // https://github.com/postcss/postcss-custom-properties
        require('postcss-custom-properties')(),
        // W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
        // https://github.com/postcss/postcss-custom-media
        require('postcss-custom-media')(),
        // CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
        // https://github.com/postcss/postcss-media-minmax
        require('postcss-media-minmax')(),
        // W3C CSS Custom Selectors, e.g. @custom-selector :--heading h1, h2, h3, h4, h5, h6;
        // https://github.com/postcss/postcss-custom-selectors
        require('postcss-custom-selectors')(),
        // W3C calc() function, e.g. div { height: calc(100px - 2em); }
        // https://github.com/postcss/postcss-calc
        require('postcss-calc')(),
        // Allows you to nest one style rule inside another
        // https://github.com/jonathantneal/postcss-nesting
        require('postcss-nesting')(),
        // W3C color() function, e.g. div { background: color(red alpha(90%)); }
        // https://github.com/postcss/postcss-color-function
        require('postcss-color-function')(),
        // Convert CSS shorthand filters to SVG equivalent, e.g. .blur { filter: blur(4px); }
        // https://github.com/iamvdo/pleeease-filters
        require('pleeease-filters')(),
        // Generate pixel fallback for "rem" units, e.g. div { margin: 2.5rem 2px 3em 100%; }
        // https://github.com/robwierzbowski/node-pixrem
        require('pixrem')(),
        // W3C CSS Level4 :matches() pseudo class, e.g. p:matches(:first-child, .special) { }
        // https://github.com/postcss/postcss-selector-matches
        require('postcss-selector-matches')(),
        // Transforms :not() W3C CSS Level 4 pseudo class to :not() CSS Level 3 selectors
        // https://github.com/postcss/postcss-selector-not
        require('postcss-selector-not')(),
        // Add vendor prefixes to CSS rules using values from caniuse.com
        // https://github.com/postcss/autoprefixer
        require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
      ],
      sass: [
        require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
      ],
    }
}
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
        publicPath: '/assets/',
        filename: DEBUG ? '[name].js?[chunkhash:6]' : '[name].[chunkhash:6].js',
        chunkFilename: DEBUG ? '[id].js?[chunkhash:6]' : '[id].[chunkhash:6].js',
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
        loaders
    }
};
const serverConfig = {
    postcss,
    entry: getArray(['./src/server.js']),
    output: {
        path: './dist/static/assets',
        filename: '../../server.js',
        libraryTarget: 'commonjs2',
        publicPath: '/assets/',
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
        new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
    ]),
    externals: [/^[a-z\-0-9]+$/,  /^\.\/assets$/],
    target: 'node',
    module: {
        loaders
    }
};
module.exports = [clientConfig, serverConfig];