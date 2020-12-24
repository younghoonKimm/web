const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
require('@babel/polyfill');

module.exports = (env, opts) => {
  const config = {
    resolve: {
      extensions: ['.js', '.vue'],

      alias: {
        '~': path.resolve(__dirname),
        scss: path.resolve(__dirname, './scss/'),
      },
    },
    entry: {
      app: ['@babel/polyfill', path.join(__dirname, 'main.js')],
    },
    output: {
      filename: '[name].bundle.js',
      path: path.join(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: 'vue-loader',
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.scss$/,
          use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: /\.?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.(png|jpe?g|gif|woff2?|ttf|otf|eot|mp4)$/,
          exclude: /node_modules/,
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            esModule: false,
          },
        },
        {
          test: /\.(svg|ico)$/,
          use: [
            {
              loader: 'url-loader',
              options: { limit: 5000, esModule: false },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html'),
      }),
      new VueLoaderPlugin(),
    ],
  };

  if (opts.mode === 'development') {
    return merge(config, {
      devtool: 'eval',
      devServer: {
        open: true,
        hot: true,
      },
      plugins: [
        new BundleAnalyzerPlugin({
          // analyzerMode: 'disabled'
        }),
      ],
    });
  } else {
    return merge(config, {
      devtool: 'cheap-module-source-map',
      plugins: [new CleanWebpackPlugin()],
    });
  }
};
