const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const preCSS = require('precss');
const autoPrefixer = require('autoprefixer');

const extractCSS = new ExtractTextPlugin({
    filename: '[name].fonts.css',
    allChunks: true,
});
const extractSCSS = new ExtractTextPlugin({
    filename: '[name].styles.css',
    allChunks: true,
});

const BUILD_DIR = path.resolve(__dirname, 'build');
const SRC_DIR = path.resolve(__dirname, 'src');

const prodPlugins = [
    new webpack.DefinePlugin({ // <-- key to reducing React's size
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }),
    new webpack.optimize.AggressiveMergingPlugin(), // Merge chunks
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HardSourceWebpackPlugin(),
    extractCSS,
    extractSCSS,
    new HtmlWebpackPlugin({
        inject: true,
        template: './public/index.html',
    }),
    new CopyWebpackPlugin(
        [
            { from: './public/img', to: 'img' },
        ],
        { copyUnmodified: false },
    ),
    new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
    }),
];
const devPlugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HardSourceWebpackPlugin(),
    extractCSS,
    extractSCSS,
    new HtmlWebpackPlugin({
        inject: true,
        template: './public/index.html',
    }),
    new CopyWebpackPlugin(
        [
            { from: './public/img', to: 'img' },
        ],
        { copyUnmodified: false },
    ),
    new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
    }),
];

module.exports = (env = {}) => ({
    mode: env.prod ? 'production' : 'development',
    entry: {
        index: ['babel-polyfill', `${SRC_DIR}/index.js`],
    },
    output: {
        path: BUILD_DIR,
        filename: '[name].bundle.js',
    },
    // watch: true,
    devtool: env.prod ? 'source-map' : 'cheap-module-eval-source-map',
    devServer: {
        contentBase: BUILD_DIR,
        //   port: 9001,
        compress: true,
        hot: true,
        open: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['es2015', 'react', 'env'],
                        plugins: ['transform-es2015-destructuring', 'transform-object-rest-spread', 'transform-class-properties'],
                    },
                },
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.(scss)$/,
                use: [{
                    loader: 'style-loader', // inject CSS to page
                    options: {
                        injectType: 'singletonStyleTag'
                    }
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                }, {
                    loader: 'postcss-loader', // Run postcss actions
                    options: {
                        plugins: function () { // postcss plugins, can be exported to postcss.config.js
                            return [
                                require('autoprefixer')
                            ];
                        }
                    }
                }, {
                    loader: 'sass-loader' // compiles Sass to CSS
                }]
            },
            {
                test: /\.css$/,
                use: extractCSS.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico)$/,
                use: [
                    {
                        // loader: 'url-loader'
                        loader: 'file-loader',
                        options: {
                            name: './img/[name].[hash].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: './fonts/[name].[hash].[ext]',
                },
            }],
    },
    plugins: env.prod ? prodPlugins : devPlugins,
});