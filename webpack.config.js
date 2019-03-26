const webpack = require('webpack');

module.exports = {
  entry: './main.tsx',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(png|jpg|gif|ico)$/,
        include: /assets/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              // publicPath: 'assets',
            },
          },
        ],
      },

    ]
  },
  resolve: {
    extensions: ['*', '.mjs', '.ts', '.tsx', '.js'],
    alias: {
      'react-native': 'react-native-web',
    },
  },
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './public',
    hot: true
  }
};
