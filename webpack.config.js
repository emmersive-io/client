var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var outputPath = require('path').resolve(__dirname, 'www');

module.exports = {
    entry: "./src/app.js",
    output: {
        path: outputPath,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {test: /\.html$/, loader: 'html-loader'},
            {test: /\.(gif|jpg|png|svg|woff|woff2)$/, loader: 'file-loader'},
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([outputPath]),
        new ExtractTextPlugin("styles.css", {allChunks: true}),
        new HtmlWebpackPlugin({template: 'src/index.html', inject: 'head'})
    ],
    postcss: function (webpack) {
        return [
            require('postcss-import')({addDependencyTo: webpack}),
            require("postcss-custom-properties"),
            require('postcss-nested'),
            require('autoprefixer')({browsers: ['last 2 versions']})
        ];
    }
};