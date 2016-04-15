const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const _ = require('lodash');
const settings = require('config');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Purify = require("purifycss-webpack-plugin");
const S3Plugin = require('webpack-s3-plugin');

const PROD = JSON.parse(process.env.PROD || '0');
const DEPLOY = JSON.parse(process.env.DEPLOY || '0');

const STATIC_PAGES = [
  'index.jade',
  // 'cb.jade'
];

const extractCSS = new ExtractTextPlugin('styles/[name].[contenthash].css');

var config = {
  context: path.resolve(__dirname, 'src'),
  output: {
    filename: 'scripts/[name].[chunkhash].js',
    path: path.resolve(__dirname, 'build/assets'),
    // publicPath: `${settings.cdnEndpoint}/`
    publicPath: '/'
  },
  entry: {
    index: './js/index.js'
  },
  module: {
    loaders: [
      // {
      //   test: /\.jade$/,
      //   loaders: ['file?name=templates/[name].[hash].html', 'jade-html'],
      //   exclude: path.resolve(__dirname, 'src/static')
      // },
      {
        test: /\.jade$/,
        loader: 'jade'
      },
      {
        test: /\.js$/,
        loaders: ['ng-annotate', 'babel'],
        exclude: /(node_modules|angular-common)/
      },
      {
        test: /\.js$/,
        loader: 'source-map',
        include: /node_modules\/@ortoo/
      },
      {
        test: /\.(yml|yaml)$/,
        loaders: ['json', 'yaml']
      },
      {
        test: /\.scss$/,
        loader: extractCSS.extract(['css', 'postcss', 'sass'])
      },
      {
        test: /\.less$/,
        loader: extractCSS.extract(['css', 'postcss', 'less'])
      },
      {
        test: /\.css$/,
        loader: extractCSS.extract(['css', 'postcss'])
      },
      {
        test: /\.(woff|ttf|svg|woff2|eot)(\?.*)?$/,
        loader: 'file?name=fonts/[name].[hash].[ext]'
      },
      {
        test: /\.(png|jpg|bmp|jpeg)(\?.*)?$/,
        loader: 'file?name=images/[name].[hash].[ext]'
      },

      // {
      //   test: require.resolve('angular-localforage'),
      //   loader: 'imports?this=>{angular: angular}'
      // },
      // {
      //   test: require.resolve('jquery'),
      //   loader: 'expose?jQuery'
      // }
    ]
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      __CONFIG__: JSON.stringify(settings)
    }),
    new CleanWebpackPlugin(['build']),
    extractCSS,
    new Purify({
      basePath: __dirname,
      paths: ['src/**/*.jade']
    })
  ],

  resolve: { fallback: path.join(__dirname, 'node_modules') },
  resolveLoader: { fallback: path.join(__dirname, 'node_modules') },

  postcss: function() {
    return [autoprefixer({
      browsers: [
        'last 2 versions',
        'iOS >= 7',
        'Android >= 4',
        'Explorer >= 10',
        'ExplorerMobile >= 11'
      ],
      cascade: false
    })];
  }
};

// Add in the static page generation
var staticPages = STATIC_PAGES.map((template) => {
  var options = {
    filename: `../site/${template.replace(/\.jade$/, '.html')}`,
    template: `${template}`,
    inject: false
  };

  _.defaults(options, settings);
  return new HtmlWebpackPlugin(options);
});
config.plugins.push.apply(config.plugins, staticPages);

if (DEPLOY) {
  config.plugins.push(new S3Plugin({
    directory: 'build/assets',
    s3Options: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'eu-west-1'
    },
    s3UploadOptions: {
      Bucket: 'static.governorhub.com'
    },
    basePath: 'assets'
  }));
}

module.exports = config;
