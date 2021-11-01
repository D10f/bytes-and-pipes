const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const plugins = [
  new HtmlWebpackPlugin({ template: './public/index.html' }),
];

let mode = 'development';
let target = 'web';
let devtool = 'source-map';

if (process.env.NODE_ENV === 'production') {
  mode = 'production';
  target = 'browserslist';
  devtool = false;
  plugins.push(
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' })
  );
} else {
  plugins.push(
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new ReactRefreshWebpackPlugin()
  );
}

module.exports = {
  mode: mode,
  target: target,
  entry: './src/index',
  output: {
    filename: mode === 'development' ? '[name].js' : '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
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
        test: /\.(j|t)sx?/,
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
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@icons': path.resolve(__dirname, 'src/components/Icons'),
      '@layout': path.resolve(__dirname, 'src/layout'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@redux': path.resolve(__dirname, 'src/redux'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@constants': path.resolve(__dirname, 'src/utils/constants'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@styles': path.resolve(__dirname, 'src/styles'),
    }
  },
  devtool: devtool,
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
      publicPath: '/assets',
    },
    watchFiles: {
      paths: path.resolve(__dirname, 'src'),
      options: {
        ignored: /node_modules/
      }
    },
    historyApiFallback: true,
    compress: false, // <- true is default
    hot: true // <- true is default
  },
  optimization: {
    splitChunks: {
      chunks: mode === 'production' ? 'all' : 'async'
    }
  }
};
