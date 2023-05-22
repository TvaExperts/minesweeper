const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  const config = {
    mode: isProduction ? 'production' : 'development',

    devtool: 'source-map',

    entry: {
      main: './src/index.js',
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].js',
      assetModuleFilename: 'assets/[name][ext]',
    },

    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'style/[name].css',
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|jpg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(mp3|wav)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(svg)$/i,
          type: 'asset/inline',
        },
      ],
    },
    devServer: {
      compress: true,
      port: 3000,
    },
  };
  return config;
};
