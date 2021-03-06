const
path = require('path'),
webpack = require('webpack'),
package = require('./package.json'),
HtmlWebpackPlugin = require('html-webpack-plugin'),
ExtractTextPlugin = require('extract-text-webpack-plugin'),
UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
FaviconsWebpackPlugin = require('favicons-webpack-plugin'),
NODE_ENV = process.env.NODE_ENV,
config = {
    entry: './src/app.js',
    output: {
        filename: 'app.[hash].js',
        sourceMapFilename: 'app.[hash].js.map',
        path: path.resolve(__dirname, 'dist')
    },
    watch: (NODE_ENV === 'development' ? true : false),
    watchOptions: {
        aggregateTimeout: 100,
        ignored: /node_modules/
    },
    devtool: (NODE_ENV === 'development' ? 'source-map' : false),
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                // exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(sass|scss)$/,
                use: NODE_ENV === 'production' ? ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: 'postcss-loader'
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                }) : [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]?[hash]'
                    }
                }
            },
            {
                test: /\.png$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'img/brands/[name].[ext]?[hash]'
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: package.name,
            filename: 'index.html', // Output filename: ./dist/index.html
            template: './src/template.html',
            inject: 'body',

            language: package.config.language,
            charset: package.config.charset,
            author: package.author,
            description: package.description,
            keywords: package.keywords.join(),
            pragma: (NODE_ENV === 'development' ? 'no-cache' : ''),
            expires: (NODE_ENV === 'development' ? '0' : 'Friday, 25-May-18 00:00:00 GMT'), // Standart: RFC 850.
            cache_control: (NODE_ENV === 'production' ? 'public, max-age: 3600, must-revalidate' : 'no-cache, no-store')
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: 'popper.js'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new FaviconsWebpackPlugin({
            logo: './src/logo.svg',
            prefix: 'img/favicons/icons-[hash]',
            persistentCache: false,
            inject: true,
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: true,
                coast: false,
                favicons: true,
                firefox: true,
                opengraph: false,
                twitter: false,
                yandex: false,
                windows: false
            }
        })
    ],
    devServer: {
        compress: true, // gzip compression.
        host: package.config.host,
        https: false,
        historyApiFallback: true,
        port: process.env.WEBPACK_PORT || package.config.port,
        index: 'index.html', // Index filename.
        contentBase: path.join(__dirname, 'dist'),
        publicPath: '/',
        open: false, // Auto open in the browser.
        allowedHosts: [
            package.config.host
        ],
        hot: true
    }
};


if(NODE_ENV === 'production') {
    config.plugins.push(
        new ExtractTextPlugin('style.[hash].css'),
        new UglifyJsPlugin()
    );
}

module.exports = config;
