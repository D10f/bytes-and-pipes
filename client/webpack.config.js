const path = require('path');
const fs = require('fs');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

class RunAfterCompile{
  apply(compiler){
    compiler.hooks.done.tap('Copy public files', function(){
      ['serviceWorker.js'].forEach(file => {
        fs.copyFile(`./public/${file}`, `../dist/${file}`, (err) => {
          if (err) throw err;
        });
      });
    });
  }
};

let mode = 'development';
let target = 'web';
let devtool = 'source-map';
let plugins = [
  new HtmlWebpackPlugin({ template: './public/index.html' })
];

if (process.env.NODE_ENV === 'production') {
  mode = 'production';
  target = 'browserslist';
  devtool = false;
  plugins.push(new CleanWebpackPlugin());
  plugins.push(new RunAfterCompile());
}

plugins.push(new MiniCssExtractPlugin({
  filename: mode === 'production' ? "[name].[contenthash].css" : "[name].css"
}));

module.exports = {
  mode: mode,
  target: target,
  entry: './src/app.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '..', 'dist'),
    assetModuleFilename: 'images/[name][ext][query]'
  },
  module: {
    rules: [
      {
        test: /\.(webp|png|jpe?g|gif|svg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(webm|mp4)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'videos/[name][ext][query]'
        }
      },
      {
        test: /\.(ttf|otf|woff|woff2)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext][query]'
        }
      },
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(s[c|a]|c)ss/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: '' }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      },
    ]
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: devtool,
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    watchOptions: {
      aggregateTimeout: 1000,
      ignored: /node_modules/
    },
    hot: true
  }
};
