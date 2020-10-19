

1.速度分析:speed-measure-webpack-plugin
作用:
分析整个打包总耗时
每个插件和loader的耗时情况
使用:
const SpeedMeasureWebpackPlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasureWebpackPlugin();
module.exports = smp.wrap({
    ...,
    plugins
})

2.体积分析:
webpack-bundle-analyzer:
使用:
cnpm install webpack-bundle-analyzer -D
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
new BundleAnalyzerPlugin()
在8888端口即可打开
3.使用高版本的webpack和node:
构建速度会大大提高 
使用webpack4优化原因:
(1).V8带来的优化(for of代替forEach,Map和Set代替Object，includes代替indexOf)
(2).默认使用更快的md4 hash
(3).webpack AST可以直接从loader传递AST，减少解析时间
(4).使用字符串的方法代替正则表达式

4.多进程多实例:thread-loader或者happy-pack
happy-pack:
cnpm install --save-dev happypack
const HappyPack = require("happypack");
{
    test:/.js$/,
    use:[
        "Happypack/loader"
        // "babel-loader",
        // "eslint-loader"
    ]
},
plugins:[
    new HappyPack({
        // 3) re-add the loaders you replaced above in #1:
        loaders: [ 'babel-loader',"eslint-loader" ]
      })
]
thread-loader:可在github查找用法
5.多进程多实例压缩:
webpack4建议使用terser-webpack-plugin:
const TerserPlugin = require("terser-webpack-plugin")
optimization: {
    minimizer:[
        new TerserPlugin({
            parallel:true
        })
    ],
}
6.分包:
webpack.dll.js:
(1).html-webpack-externals-plugin
(2).split-chunk-plugin
(3).DLLPlugin分包：
创建webpack.dll.js
package.json文件夹内加上dll命令: 
"scripts":{
    "dll":"webpack --config webpack.dll.js"
}

webpack.config.js:
plugins:[
    new webpack.DllReferencePlugin({
        manifest:require("./build/library/library.json")
    })
]
7.利用缓存提升二次构建速度:
babel-loader开启缓存:
{
    test:/\.js$/,
    use:[
        "babel-loader?cacheDirectory=true"
    ]
}
terser-webpack-plugin开启缓存:
optimization: {
    minimizer:[
        new TerserPlugin({
            parallel:true,
            cache:true
        })
    ],
}
使用css-loader或者hard-source-webpack-plugin
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const { extension } = require("mime-types");
plugins:[
    new HardSourceWebpackPlugin()
]
8.缩小构建目标:
node_modules:
{
    test:/\.js$/,
    use:[
        "babel-loader?cacheDirectory=true"
    ],
    exclude:/node_modules/
}
优化resolve.modules配置(减少模块搜索层级):

优化resolve.mainFields配置:

优化resolve.extensions配置:

合理使用alias:
resolve:{
    alias:{
        "react":path.resolve(__dirname,"./node_modules/react/umd/react.production.min.js"),
        "react-dom":path.resolve(__dirname,"./node_modules/react-dom/umd/react-dom.production.min.js")
    },
    extension:[".js"],
    mainFields:["main"]
}
9.使用Tree shaking擦除无效的JS和CSS代码
(1).擦除无用的CSS代码：具体可看官网
PurifyCSS:遍历代码，识别已经用到的CSS Class,但是这个插件没有维护了，所以采用purgecss-webpack-plugin和mini-css-extract-plugin配合使用
npm i purgecss-webpack-plugin -D
const glob = require('glob')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
{
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      "css-loader"
    ]
  }
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
    }),
  ]

uncss:HTML需要通过jsdom加载，所有样式通过PostCss解析，通过document.querySelector来识别html文件里面不存在的选择器

10.使用webpack对图片进行压缩:
使用imagemin、image-webpack-loader
npm install image-webpack-loader --save-dev
rules: [{
    test: /\.(gif|png|jpe?g|svg)$/i,
    use: [
      'file-loader',
      {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true,
          },
          // optipng.enabled: false will disable optipng
          optipng: {
            enabled: false,
          },
          pngquant: {
            quality: [0.65, 0.90],
            speed: 4
          },
          gifsicle: {
            interlaced: false,
          },
          // the webp option will enable WEBP
          webp: {
            quality: 75
          }
        }
      },
    ],
  }]
11.动态polyfill:
polyfill Service原理：识别不同的User Agent，下发不同的polyfill，但是有个缺点就是国内有些奇葩的UA浏览器出问题，但是可以降级全部polyfill






