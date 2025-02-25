const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const IconfontWebpackPlugin = require('iconfont-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
    entry: {
        'error-handler': './src/error-handler.js',
        general: './src/general.js',
        home: './src/home.js',
        generator: './src/generator.js',
        'company-list': './src/company-list.js',
        'my-requests': './src/my-requests.js',
        'privacy-controls': './src/privacy-controls.js',
        'suggest-edit': './src/suggest-edit.js',
        'id-data-controls': './src/id-data-controls.js',
        'sva-finder': './src/Components/SvaFinder.js',
        'act-widget': './src/Components/ActWidget.js',
        pdfworker: './src/Utility/PdfWorker.js',
        style: './src/styles/main.scss',
        'test-interface': './src/test-interface.js'
    },
    output: {
        filename: 'js/[name].gen.js',
        chunkFilename: 'js/[name].bundle.gen.js',
        publicPath: '/',
        path: path.resolve(__dirname, 'static')
    },
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})],
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'style',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 2 }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: loader => [
                                new IconfontWebpackPlugin(loader),
                                postcssPresetEnv(),
                                require('cssnano')
                            ]
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            },
            {
                test: /\.svg/,
                use: {
                    loader: 'svg-url-loader',
                    options: {}
                }
            }
        ]
    },
    plugins: [
        new MinifyPlugin({
            mangle: {
                exclude: {
                    ActionButtonPlaceholder: true,
                    NewRequestButtonPlaceholder: true,
                    CompanySelectorPlaceholder: true,
                    RequestFormPlaceholder: true,
                    DynamicInputContainerPlaceholder: true,
                    SignatureInputPlaceholder: true,
                    RequestTypeChooserPlaceholder: true,
                    RecipientInputPlaceholder: true,
                    TransportMediumChooserPlaceholder: true
                }
            }
        }),

        new MiniCssExtractPlugin({
            filename: 'css/[name].gen.css'
        }),

        new webpack.BannerPlugin(
            '[file]\nThis code is part of the Datenanfragen.de project. We want to help you exercise your rights under the GDPR.\n\n@license MIT\n@author the Datenanfragen.de project\n@version ' +
                process.env.npm_package_version +
                '\n@updated ' +
                new Date().toISOString() +
                '\n@see {@link https://github.com/datenanfragen/website|Code repository}\n@see {@link https://www.datenanfragen.de|German website}\n@see {@link https://datarequests.org|English website}'
        ),

        // Make the version number available in the code, see https://github.com/webpack/webpack/issues/237
        new webpack.DefinePlugin({
            CODE_VERSION: JSON.stringify(process.env.npm_package_version)
        })
    ],
    resolve: {
        modules: ['src', 'node_modules', 'i18n', 'res/icons'],
        alias: {
            react: 'preact-compat',
            'react-dom': 'preact-compat',
            // Not necessary unless you consume a module using `createClass`
            'create-react-class': 'preact-compat/lib/create-react-class'
        }
    }
};
