import webpack from 'webpack';
import path from 'path';
import TransferWebpackPlugin from 'transfer-webpack-plugin';

// __dirname is referencing the name of the directory that the currently executing script resides in

const config = {
  entry: [
    __dirname + '/src/app/d3components/index.js'
  ],
  output: {
    filename: '[name].js',
    path: __dirname + '/lib',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  noInfo: false,
  plugins: [
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   compressor: {
    //     screw_ie8: true,
    //     keep_fnames: false,
    //     warnings: false
    //   },
    //   mangle: {
    //     screw_ie8: true,
    //     keep_fnames: false
    //   }
    // }),
    // new TransferWebpackPlugin([
    //   {from: 'app/d3components'}
    // ], path.resolve(__dirname,"src")),
    // new TransferWebpackPlugin([
    //   {from: ''}
    // ], path.resolve(__dirname,"build"))
  ],
  module: {
    loaders: [
      {
        // the "loader"
        loader: "babel-loader", // or "babel" because webpack adds the '-loader' automatically

        // "include" is commonly used to match the directories
        include: [
          path.resolve(__dirname, "src/app/d3components")
        ],

        // "exclude" should be used to exclude exceptions
        // try to prefer "include" when possible
        // exclude: [
        //   path.resolve(__dirname, "src/app/d3components")
        // ],

        // "test" is commonly used to match the file extension
        test: /(\.js|\.jsx)$/,

        query: {
          presets: ['es2015','react']
        }
      }
    ]
  }
};

module.exports = config;
