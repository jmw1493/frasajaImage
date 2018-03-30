const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use:{
          loader:'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
  ]
};

// const path = require('path');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

// module.exports = {
//   entry: './client/index.js',
//   output: {
//     path: path.resolve(__dirname, 'build'),
//     filename: 'bundle.js'
//   },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use:{
//           loader:'babel-loader'
//         }
//       },
//       {
//         test: /\.scss$/,
//         use: [{
//           loader: "style-loader" // creates style nodes from JS strings
//         }, {
//           loader: "css-loader" // translates CSS into CommonJS
//         }, {
//           loader: "sass-loader" // compiles Sass to CSS
//         }]
//         // use: ExtractTextPlugin.extract({
//         //   fallback: "style-loader",
//         //   use: ["css-loader", "sass-loader"]
//         // })
//       }
//     ]
//   }
//   // ,
//   // plugins: [
//   //   new ExtractTextPlugin("styles.css"),
//   // ]
// };


