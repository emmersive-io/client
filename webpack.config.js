var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var path = require('path');
var outputPath = path.resolve(__dirname, 'www');

module.exports = {
    entry: "./src/app.js",
    output: {
        path: outputPath,
        filename: "bundle.[hash].js"
    },
    module: {
        loaders: [
            {test: /\.html$/, loader: 'html-loader?minimize=false'},
            {test: /\.(gif|jpg|png|svg|woff|woff2)$/, loader: 'file-loader'},
            {test: /\.handlebars$/, loader: 'handlebars-loader'},
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([outputPath]),
        new CopyWebpackPlugin([
            {from: 'src/resources', to: 'resources'},
            {from: 'src/manifest.json'}
        ]),
        new ExtractTextPlugin('styles.[hash].css', {allChunks: true}),
        new HtmlWebpackPlugin({template: 'src/index.html', inject: 'head'})
    ],
    postcss: function (webpack) {
        return [
            require('postcss-import')({addDependencyTo: webpack}),
            require('postcss-custom-properties'),
            require('postcss-nested'),
            require('autoprefixer')({browsers: ['last 2 versions']})
        ];
    }
};