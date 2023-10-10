const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

function getStyleLoders(pre) {
    return ["style-loader", "css-loader", {
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                plugins: [
                    [
                        'postcss-preset-env',
                    ],
                ],
            },
        },
    }, pre].filter(Boolean)

}
module.exports = {
    entry: './src/main.js',
    output: {
        path: undefined,
        filename: "static/js/[name].js",
        chunkFilename: "static/js/[name].chunk.js",//代码分割后代码块文件名统一设置
        assetModuleFilename: "static/media/[hash:10][ext][query]"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, "../src"),
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                        plugins: ['react-refresh/babel'],  // js 实现HMR
                    }
                }
            },
            {
                // 用来匹配 .css 结尾的文件
                test: /\.css$/,
                // use 数组里面 Loader 执行顺序是从右到左
                use: getStyleLoders(),
            },
            {
                test: /\.less$/i,
                use: getStyleLoders('less-loader')
            },
            {
                test: /\.s[ac]ss$/i,
                use: getStyleLoders('sass-loader'),
            },
            {
                test: /\.styl$/,
                use: getStyleLoders("stylus-loader")
            },
            {
                test: /\.(jpe?g|png|svg|gif|webp)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024
                    }
                }
            },
            {
                test: /\.(tff|woff2|mp4|avi)$/,
                type: "asset/resource"
            }

        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html")
        }),
        new ESLintWebpackPlugin(
            {
                // 指定检查文件的根目录
                context: path.resolve(__dirname, "../src"),
                exclude: "node_modules",
                cache: true,
                cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"),
            }
        ),
        // js 实现HMR
        new ReactRefreshWebpackPlugin()
    ],
    //webpack解析模块加载选项
    resolve: {
        extensions: [".jsx", ".js", ".json"]//自动补全文件扩展名
    },
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3001", // 启动服务器端口号
        open: true, // 是否自动打开浏览器
        hot: true,
        historyApiFallback: true, //解决页面刷新404的问题
    },
    mode: "development",
    devtool: 'cheap-module-source-map',//源代码和编译后的代码，进行列映射
    optimization: {
        splitChunks: {
            chunks: "all"
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}.js`
        },
    }
}