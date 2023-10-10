const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//css文件提取
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");//css压缩
const TerserPlugin = require("terser-webpack-plugin");//css压缩之后，js也要压缩，否者出问题
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");


const isProduction = process.env.NODE_ENV === "production"

function getStyleLoders(pre) {
    return [isProduction ? MiniCssExtractPlugin.loader : "style-loader", "css-loader", {
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
        path: isProduction ? path.resolve(__dirname, "../dist") : undefined,
        filename: isProduction ? "static/js/[name].[contenthash:10].js" : "static/js/[name].js",
        chunkFilename: isProduction ? "static/js/[name].[contenthash:10].chunk.js" : "static/js/[name].chunk.js",//代码分割后代码块文件名统一设置
        assetModuleFilename: "static/media/[hash:10][ext][query]",
        clean: true
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
                        plugins: [!isProduction && 'react-refresh/babel'].filter(Boolean),  // js 实现HMR
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
        !isProduction && new ReactRefreshWebpackPlugin(),
        //提取css为单独文件
        isProduction && new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash:10].css",
            chunkFilename: "static/css/[name].[contenthash:10].chunk.css"
        }),
        isProduction && new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../public"), to: path.resolve(__dirname, "../dist"),
                    globOptions: {
                        ignore: ["**/index.html"],
                    },
                },
            ],
        }),
    ].filter(Boolean),
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
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? "source-map" : 'cheap-module-source-map',//源代码和编译后的代码，进行列映射
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                // react react-dom react-router-dom 一起打包成一个js文件
                react: {
                  test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
                  name: "chunk-react",
                  priority: 40,
                },
                // antd 单独打包
                antd: {
                  test: /[\\/]node_modules[\\/]antd[\\/]/,
                  name: "chunk-antd",
                  priority: 30,
                },
                // 剩下node_modules单独打包
                libs: {
                  test: /[\\/]node_modules[\\/]/,
                  name: "chunk-libs",
                  priority: 20,
                },
              },
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}.js`
        },
        minimize:isProduction,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        "preset-default",
                                        "prefixIds",
                                        {
                                            name: "sortAttrs",
                                            params: {
                                                xmlnsOrder: "alphabetical",
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }),
        ]
    }
}