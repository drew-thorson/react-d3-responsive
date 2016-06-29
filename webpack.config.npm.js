import webpack from 'webpack';
import path from 'path';
import TransferWebpackPlugin from 'transfer-webpack-plugin';

const config = {
  entry: __dirname + '/src/app/d3components',
  output: {
    filename: '[name].js',
    path: __dirname + '/lib'
  },
  devtool: 'source-map',
  noInfo: false,
  plugins: [
    new TransferWebpackPlugin([
      {from: 'app/d3components'}
    ], path.resolve(__dirname,"src")),
    new TransferWebpackPlugin([
      {from: ''}
    ], path.resolve(__dirname,"build"))
  ],
  module: {
    loaders: [
      {
        // "test" is commonly used to match the file extension
        test: /(\.js|\.jsx)$/,

        // "include" is commonly used to match the directories
        include: [
          path.resolve(__dirname, "src/app")
        ],

        // "exclude" should be used to exclude exceptions
        // try to prefer "include" when possible

        // the "loader"
        loader: "babel-loader", // or "babel" because webpack adds the '-loader' automatically
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};

module.exports = config;
