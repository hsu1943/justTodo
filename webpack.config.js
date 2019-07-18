const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WebpackAliOSSPlugin = require('webpack-oss')

const localConfig = require('./config');
const isDev = process.env.NODE_ENV === 'development'

const config = {
    // 部署目标
    target: 'web',
    // 生产环境
    mode: 'development',
    // 入口文件
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        // 输出文件
        filename: 'bundle.[hash:8].js',
        // 输出目录
        path: path.join(__dirname, 'dist')
    },
    plugins: [
        // vue文件loader
        new VueLoaderPlugin(),
        // 生成html文件
        new HtmlPlugin({
            favicon: './dist/favicon.ico',
            title: 'Just Todo',
        }),
        // 环境变量插件，看package.json的命令
        new webpack.DefinePlugin({
            'process.env': {
                // 将输入的环境变量变成可使用变量
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
         }),
    ],
    module: {
        rules:[
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: 'static-[name].[ext]'
                        }
                    }
                ]
            },
        ]
    }
}

if (isDev) {
    config.module.rules.push(
        {
            test: /\.styl/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                    }
                },
                'stylus-loader',
            ]
        },
        {
            test: /\.css$/,
            use: ['style-loader','css-loader']
        },
    )
    // 显示原始代码
    config.devtool = '#cheap-module-eval-source-map'
    // webpack-dev-server配置
    config.devServer = {
        port: 8000,
        host: '0.0.0.0',
        overlay: {
            errors: true,
        },
        // 开启热更新
        hot: true,
        // historyFallback: {
            
        // },
        // 是否自动打开浏览器
        // open: true
    }
    config.plugins.push(
        // 热更新
        new webpack.HotModuleReplacementPlugin(),
        // 设置跳过编译时报错
        new webpack.NoEmitOnErrorsPlugin
    )
} else {
    config.mode = 'production'
    config.entry = {
        app: path.join(__dirname, 'src/index.js'),
        vendor: ['vue']
    }
    config.output.filename = '[name].[chunkhash:8].js'
    config.output.publicPath = 'https://beltxman.oss-cn-shanghai.aliyuncs.com/justtodo/'
    config.module.rules.push(
        {
            test: /\.styl/,
            use: [
                // 'style-loader',
                MiniCssExtractPlugin.loader,
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                    }
                },
                'stylus-loader',
            ]
        },
        {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader'
            ]
        },

    )
    config.plugins.push(
        // CSS 分离 这个因为版本不一样，这里代码不一样
        new MiniCssExtractPlugin({
            filename: 'style-[contentHash:8].css',
            chunkFilename: '[id]-[contentHash:8].css',
        }),
        // 生产环境使用webpack-oss插件上传静态文件
        new WebpackAliOSSPlugin({
            accessKeyId: localConfig.oss.id,
            accessKeySecret: localConfig.oss.secret,
            region: 'oss-cn-shanghai',
            bucket: 'beltxman',
            prefix: 'justtodo',   // "<bucket>/<prefix>/icon_696aaa22.ttf"
            exclude: [/.*\.(html)$/], // 或者 /.*\.html$/,排除.html文件的上传  
            deleteAll: true,	  // 优先匹配format配置项
            // format: Date.now(), // 备份最近版本的oss文件，删除其他版本文件
            local: true   // 上传打包输出目录里的文件
        }),
          // 清理dist目录！排除
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!favicon.ico', '!static-*'],
        })
    )
    // config.optimization.splitChunks 配置框架单独打包
    config.optimization = {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: "vendor",
                    chunks: "initial",
                    minChunks: 2,
                    // 最小多少字节，文件太小，为了测试，这个参数设置为0，这个值默认30000
                    minSize:0
                }
            }
        },
        // runtime缓存单独打包
        runtimeChunk: {
            name: 'runtime'
        },
        // 设置跳过编译时报错
        // noEmitOnErrors: true,
        // 环境变量
        // nodeEnv: 'production'
    }
}

module.exports = config