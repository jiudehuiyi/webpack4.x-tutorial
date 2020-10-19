const { pathExists } = require("fs-extra")
/*
        loaders的用法
*/

const { extension } = require("mime-types")

一.文件loaders:
1.raw-loader:可以获取文件的原始内容，
(1).
{
    test:/\.txt$/,
    use:"raw-loader"
}
(2).对HTML和JS文件进行内联加载

2.val-loader:它可以将字符串的形式定义的代码，作为模块执行,并将export转化为js代码

3.url-loader和file-loader:它们都是用来处理文件的,但是url会多一个特别的功能，也就是可以设置图片小于设置的大小，就会转化为base64格式
{
    test:/\.(png|jpg|gif|jpeg)$/i,
    use:[
        {
            loader:"url-loader",
            options:{
                limit:8192
            }
        }
    ]
}
4.ref-loader:手动创建所有文件的依赖关系

二.json类型:
1.json-loader:默认包含
{
    test:/\.json$/,
    loader:"json-loader"
}
2.json5-loader:
{
    test:/\.json5$/,
    use:"json5-loader"
}

三.转译Loaders:
1.script-loader:全局执行js脚本
{
    test:/\.exec\.js$/,//以.exec.js结尾的文件
    use:"script-loader",
}
执行.exec.js的脚本函数,然后使用import进行引入
2.babel-loader:ES6+语法转化为ES5语法
{
    test:/\.m?js$/,
    exclude:/node_modules|bower_components/,
    use:{
        loader:"babel-loader?cacheDirectory=true",
        options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
    }
}
3.ts-loader配置:
devtool: "inline-source-map",
resolve:{
    extension:[".ts",".tsx",".js",".jsx"],
}
module:{
    rules:[
        {test:/\.tsx?$/,loader:"ts-loader"}
    ]
}
在tsconfig.json文件中配置:
{
    "compilerOptions": {
      "sourceMap": true
    }
  }
4.react-markdown-loader:
使用 markdown-parse parser(解析器) 将 Markdown 编译为 React 组件

三.样式:
1.style-loader和css-loader:分别将css内嵌html中和解析css
{
    test:/\.css$/,
    use:[
        {loader:"style-loader"},
        {loader:"css-loader"},
    ]
}
2.less-loader:
{
    test:/\.less/,
    use:[
        {
            loader:"less-loader"
        }
    ]
}
3.sass-loader:
{
    test:/\.scss/,
    use:[
        "style-loader",
        "css-loader",
        "sass-loader"
    ]
}
4.postcss-loader:
{
    loader:"postcss-loader",
    options:{
        postcssOptions:{
            plugins:[
                "autoprefixer"
            ]
        }
    }
}

四.其它loader:
1.cache-loader:为一些性能开销大的loader添加此loader，以将结果缓存到磁盘里面
{
    test:/\.js$/,
    use:["cache-loader","babel-loader"],
    include:path.resolve("src")
}
2.gzip-loader:
{
    test:/\.gz$/,
    enforce:"pre",
    use:"gzip-loader"
}
