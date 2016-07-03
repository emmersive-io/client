var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var SvgStore = require('webpack-svgstore-plugin');

var path = require('path');
var outputPath = path.resolve(__dirname, 'www');

module.exports = {
    entry: './src/app.js',
    output: {
        path: outputPath,
        filename: 'bundle.[hash].js'
    },
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.html$/, loader: 'html-loader'},
            {test: /\.(gif|jpg|png|svg)$/, loader: 'file-loader'},
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([outputPath]),
        new ExtractTextPlugin('styles.[hash].css', {allChunks: true}),
        new SvgStore(path.join('src', 'icons', '*.svg'), '', {
            name: 'icons.svg',
            prefix: '',
            svgoOptions: {
                plugins: [
                    {removeTitle: true}
                ]
            }
        }),
        new HtmlWebpackPlugin({template: 'src/index.html', inject: 'head'}),
        new CopyWebpackPlugin([
            {from: 'src/resources', to: 'resources'},
            {from: 'src/manifest.json'}
        ])
    ],
    postcss: function (webpack) {
        return [
            require('postcss-import')({addDependencyTo: webpack}),
            require('postcss-custom-properties'),
            require('autoprefixer')({browsers: ['last 2 version', 'Safari 8', 'iOS 8.4']})
        ];
    }
};