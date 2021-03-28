/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { join, resolve } = require('path')
const webpack = require('webpack')


const ROOT_DIR = resolve(__dirname)
const SRC_DIR = join(ROOT_DIR, 'src');
const IS_PRODUCTION = process.argv.some((arg) => arg === 'production' || arg === '--production')

module.exports = {
    mode: IS_PRODUCTION ? 'production' : 'development',
    target: 'web',
    entry: {
        index: [
            join(SRC_DIR, 'index.ts'),
        ],
    },
    output: {
        path: join(ROOT_DIR, 'dist'),
        filename: '[name].js',
    },
    devtool: IS_PRODUCTION ? false : 'inline-source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
            'path': require.resolve('path-browserify'),
            'react-dom': '@hot-loader/react-dom',
            'src/common': join(SRC_DIR, 'common'),
            'src/components': join(SRC_DIR, 'components'),
            'src/constants': join(SRC_DIR, 'constants'),
        },
    },
    module: {
        rules: [
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
            { test: /\.html$/, use: 'html-loader' },
            { test: /\.svg$/, use: 'svg-loader?name=img/[name].[ext]?[hash]' },
            { test: /\.jpg$/, use: 'file-loader?name=img/[name].[ext]?[hash]' },
            { test: /\.png$/, use: 'file-loader?name=img/[name].[ext]?[hash]' },
            {
                test: /\.(j|t)sx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,  // disable type checker - we will use it in fork plugin
                    compilerOptions: {
                        incremental: false,
                    },
                },
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(IS_PRODUCTION ? 'production' : 'development'),
        }),
        // Skip on JSON output not to pollute it..
        !process.argv.includes('--json') && new ForkTsCheckerWebpackPlugin({ typescript: { configFile: 'tsconfig.json' } }),
        new HtmlWebpackPlugin({
            template: join('static', 'index.html'),
        }),
    ].filter(Boolean),

    cache: {
        // 1. Set cache type to filesystem
        type: 'filesystem',

        buildDependencies: {
        // 2. Add your config as buildDependency to get cache invalidation on config change
            config: [__filename],

        // 3. If you have other things the build depends on you can add them here
        // Note that webpack, loaders and all modules referenced from your config are automatically added
        },
    },
    // Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                },
            },
        },
    },

    devServer: {
        contentBase: join(ROOT_DIR, 'dist'),
        https: false,  // Annoying security notice.
        host: '0.0.0.0',
    },

}
