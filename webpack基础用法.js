/*
    webpack基础用法:
*/

1.entry(入口):
(1).单页面应用配置:
entry : "./src/index.js"
(2).多页面应用配置:
entry:{
    app1:"./src/app1.js",
    app2:"./src/app2.js"
}

2.output(输出):
(1).单入口配置:
output :{
    filename:"bundle.js",
    path:__dirname+"/dist"
}
(2).多入口配置:
output:{
    filename:"[name].js",
    path:__dirname+"/dist"
}
3.Loader:webpack只支持JS和JSON这两种文件类型，通过Loader去支持其文件，它本身是一个函数，接受源文件作为参数，返回转换得结果
常见的loader：
babel-loader:转换ES6,7等JS新特性语法
css-loader:支持.css文件的加载和解析
less-loader:将less文件转换为css
ts-loader:将TS转换为JS
file-loader:进行图片和字体等打包
raw-loader:将文件以字符串的形式导入
thread-loader:多进程打包JS和CSS
Loader用法:
module:{
    rules:[
        {
            test:/\.txt$/,//test是用来匹配指定的规则
            use:"raw-loader"//use则是用来使用loader的名称
        }
    ]
}
4.plugins:它是对webpack的增强，一般用于对bundle文件的优化，资源管理和环境变量的注入，作用于整个过程
常见的plugins:
commonsChunkPlugin:将chunk相同的模块代码提取成公共的代码
cleanWebpackPlugin:清理构建目录
ExtractTextWebpackPlugin:将CSS从bundle文件中提取成一个独立的CSS文件
copyWebpackPlugin:将文件或者文件夹拷贝到构建输出目录
HTMLWebpackPlugin:创建的HTML文件去承载输出的bundle文件
UglifyjsWebpackPlugin:压缩JS
ZipWebpackPlugin：将打包出的资源生成一个ZIP包

5.Mode模式:它是用来指定当前的构建环境，来确定相应的默认配置(默认值为production):
production(生产环境):
会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 production . 启用 FlagDependencyUsagePlugin , FlagIncludedChunksPlugin , ModuleConcatenationPlugin , NoEmitOnErrorsPlugin , OccurrenceOrderPlugin , SideEffectsFlagPlugin 和 TerserPlugin 。
development(开发环境):
会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 development . 启用 NamedChunksPlugin 和 NamedModulesPlugin
none:不指定环境,不使用任何默认优化选项

6.使用ES6+等相关语法配置:
(1).安装相关库:npm i @babel/core @babel/preset-env babel-loader -D
(2). babelrc文件写入:
{
    "presets": [
        "@babel/preset-env"
    ]
}
(3). webpack中配置loader:
module:{
    rules:[
        {
            test:/.js/,
            use:"babel-loader"
        }
    ]
}
7.配置React的jsx语法:
(1).安装@babel/preset-react
(2). babelrc文件配置：
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ]
}
8.解析CSS: 
style-loader的作用为：将样式通过<style>标签插入到head中，
css-loader用于加载.css文件，并且会转化为common.js对象(这样就可以对其进行import引入)
(1).下载style-loader，css-loader:
npm i style-loader css-loader -D
(2).在loader中进行配置:
{
    test:/\.css$/,
    use:[
        "style-loader",
        "css-loader"
    ]
}
9.解析Less:
(1).安装Less，Less-loader：npm i less less-loader  -D
(2).配置：
{
    test:/.less$/,
    use:[
        "style-loader",
        "css-loader",
        "less-loader"
    ]
}
10.解析图片资源
(1).安装file-loader:
npm i file-loader -D
(2).配置:
{
    test:/.(jpg|jpeg|gif|png)$/,
    use:"file-loader"
}
10.1 也可以使用url-loader进行解析和优化:
{
    test:/.(jpg|jpeg|gif|png)$/,
    use:[{
        loader:"url-loader",
        options:{
            limit:10240 //当小于10204字节的时候会将其转化为base64编码
        }
    }]
}

11.字体的使用和解析:
使用:
在css文件下写入：
@font-face {
    font-family:"fontName";名字
    src:url("./xxx");路径
}
html {
    font-family:"fontName";
}
配置:
{
    test:/.(woff|woff2|eot|ttf|otf)$/,
    use:"file-loader"
}
12.文件监听:在每次修改源代码都需要重新打包出输出文件(注意此时还是需要手动刷新浏览器)，因此文件监听是解决这个问题的方法。
(1).在package.json加个watch参数:
"watch":"webpack watch"
(2).在webpack配置文件中添加：
watch:true
原理:
轮询判断文件的最后编辑时间是否发生变化,某个文件发生变化，并不会立刻告诉监听者，而是缓存起来，等待aggregateTimeout
相关配置参数:
module.export = {
    //默认false，也就是不立即开启
    watch:true,
    //只有watch开启，这个选项才有意义
    watchOptions:{
        //表示需要忽略的文件，默认为空，支持正则匹配
        ignored:/node_modules/,
        //监听后变化后等300ms再去执行，默认为300ms
        aggregateTimeout:300,
        //判断文件是否发生变化，它是通过不停询问系统指定文件有没有变化实现的，默认每秒问1000次
        poll:1000
    }
}
13.热更新:随着代码变化，不需要手动刷新浏览器,
(1).webpack-dev-server
原理：不刷新浏览器，不输出文件而是直接放在内存中，使用HotModuleReplacementPlugin插件
使用:
cnpm install webpack-dev-server --save
webpack文件中配置:
const webpack=require("webpack");
plugins:[
    new webpack.HotModuleReplacementPlugin()
],
devServer:{
    contentBase:"./dist",
    hot:true
}
package.json文件中开启命令:
"dev":"webpack-dev-server --watch"
(2).express中使用热更新:webpack-dev-middleware
const express = require("express");
const webpack=require("webpack")
const webpackDevMiddleware =require("webpack-dev-middleware");
const app = express();
const config = require("./webpack.config.js");
const compiler=webpack(config);
app.use(webpackDevMiddleware(compile,{
    publicPath:config.output.publicPath
}))
app.listen(3000,function(){
    console.log("xxxxx")
})
14.文件指纹:它是打包后输出的文件名后缀
分类:
Hash:和整个项目的构建相关，只要项目文件有修改，整个项目构建的hash值都会修改
ChunkHash:和webpack打包的chunk有关系，不同的entry会生成不同的chunkhash
例如:
enrty:{
    app:"./src/app.js",
    index:"./src/index.js"
},
output:{
    filename:"[name][chunkhash:8].js",
    path:__dirname+"/dist"
}
contentHash:根据文件内容来定义Hash，文件内容不变，则ContentHash不变,
例如当JS改变，而CSS不变的时候，使用hash和chunkHash它的CSShash都是改变的，但是这时是没必要去改变的，所以应该应用contentHash
利用MiniCssExtractPlugin的filename:这里值得注意的是style-loader和MiniCssExtractPlugin的功能相冲突的，因为style-loader将CSS插入head中，而MiniCssExtractPlugin却将CSS提取出来
plugins:[
    new MiniCssExtractPlugin({
        filename:"[name][contenthash:8].css"
    })
]
一般来说：图片和字体采用的是hash，其它采用的是contentHash

15.代码压缩:
JS文件压缩:
内置Uglifyjs-webpack-plugin对JS进行压缩

CSS文件压缩:
optimize-css-assets-webpack-plugin(同时使用cssnano)
plugins:[
    new OptimizeCSSAssetsPlugin({
        assetNameRegExp:/\.css$/g,
        cssProcessor:require("cssnano")
    })
]

HTML文件压缩:
html-webpack-plugin
plugins:[
    new HtmlWebpackPlugin({
        template:path.join(__dirname,"src/index.html"),
        filename:"index.html",
        chunks:['index'],
        inject:true,
        minify:{
            html5:true,
            collapseWhiteSpace:true,
            preserveLineBreaks:false,
            minifyCSS:true,
            minifyJS:true,
            removeComments:false
        }
    })
]
