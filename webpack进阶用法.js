/*
    webpack进阶用法
*/
1.自动清理构建目录:
使用clean-webpack-plugin
plugins:[
    new CleanWebpackPlugin()
]
注意：
在3.0以上是以{}方式引入: const { CleanWebpackPlugin } = require("clean-webpack-plugin")
3.0以下以这样方式引入: const CleanWebpackPlugin = require("clean-webpack-plugin");

2.css3浏览器前缀:
使用postcss进行增加css前缀
(1).安装:npm install postcss-loader autoprefixer@8.0.0 -D
(2).配置: 
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
3.移动端CSS Px自动转化为rem:
(1).cnpm i px2rem-loader -D
(2).cnpm i lib-flexible -S
(3).在cssloader中配置:
{
    loader:"px2rem-loader",
    options:{
        remUnit:75,//这里代表一个rem等于75px
        remPrecision:8
    }
}
(4).script引入(可以使用资源内联，请看6):
在html页面中引入script标签，内容为flexible中的内容:
例如：
<script>
    
    ;(function(win, lib) {
        var doc = win.document;
        var docEl = doc.documentElement;
        var metaEl = doc.querySelector('meta[name="viewport"]');
        var flexibleEl = doc.querySelector('meta[name="flexible"]');
        var dpr = 0;
        var scale = 0;
        var tid;
        var flexible = lib.flexible || (lib.flexible = {});
    
        if (metaEl) {
            console.warn('将根据已有的meta标签来设置缩放比例');
            var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
            if (match) {
                scale = parseFloat(match[1]);
                dpr = parseInt(1 / scale);
            }
        } else if (flexibleEl) {
            var content = flexibleEl.getAttribute('content');
            if (content) {
                var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
                var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
                if (initialDpr) {
                    dpr = parseFloat(initialDpr[1]);
                    scale = parseFloat((1 / dpr).toFixed(2));
                }
                if (maximumDpr) {
                    dpr = parseFloat(maximumDpr[1]);
                    scale = parseFloat((1 / dpr).toFixed(2));
                }
            }
        }
    
        if (!dpr && !scale) {
            var isAndroid = win.navigator.appVersion.match(/android/gi);
            var isIPhone = win.navigator.appVersion.match(/iphone/gi);
            var devicePixelRatio = win.devicePixelRatio;
            if (isIPhone) {
                // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
                if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                    dpr = 3;
                } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                    dpr = 2;
                } else {
                    dpr = 1;
                }
            } else {
                // 其他设备下，仍旧使用1倍的方案
                dpr = 1;
            }
            scale = 1 / dpr;
        }
    
        docEl.setAttribute('data-dpr', dpr);
        if (!metaEl) {
            metaEl = doc.createElement('meta');
            metaEl.setAttribute('name', 'viewport');
            metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
            if (docEl.firstElementChild) {
                docEl.firstElementChild.appendChild(metaEl);
            } else {
                var wrap = doc.createElement('div');
                wrap.appendChild(metaEl);
                doc.write(wrap.innerHTML);
            }
        }
    
        function refreshRem(){
            var width = docEl.getBoundingClientRect().width;
            if (width / dpr > 540) {
                width = 540 * dpr;
            }
            var rem = width / 10;
            docEl.style.fontSize = rem + 'px';
            flexible.rem = win.rem = rem;
        }
    
        win.addEventListener('resize', function() {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }, false);
        win.addEventListener('pageshow', function(e) {
            if (e.persisted) {
                clearTimeout(tid);
                tid = setTimeout(refreshRem, 300);
            }
        }, false);
    
        if (doc.readyState === 'complete') {
            doc.body.style.fontSize = 12 * dpr + 'px';
        } else {
            doc.addEventListener('DOMContentLoaded', function(e) {
                doc.body.style.fontSize = 12 * dpr + 'px';
            }, false);
        }
    
    
        refreshRem();
    
        flexible.dpr = win.dpr = dpr;
        flexible.refreshRem = refreshRem;
        flexible.rem2px = function(d) {
            var val = parseFloat(d) * this.rem;
            if (typeof d === 'string' && d.match(/rem$/)) {
                val += 'px';
            }
            return val;
        }
        flexible.px2rem = function(d) {
            var val = parseFloat(d) / this.rem;
            if (typeof d === 'string' && d.match(/px$/)) {
                val += 'rem';
            }
            return val;
        }
    
    })(window, window['lib'] || (window['lib'] = {}));
    
    </script>

4.配置自适应宽度(rem):
1.使用transform scale，但是它不会改变文字所占据的面积
2.让根元素html的font-size设置为:16px * 62.5% 目的是 1rem=10px
3.直接设置 font-size:10px;或者font-size：100px


5.手机淘宝的lib-flexible原理:
function refreshRem(){
    var width = docEl.getBoundingClientRect().width;
    if (width / dpr > 540) {
        width = 540 * dpr;
    }
    var rem = width / 10;
    docEl.style.fontSize = rem + 'px';
    flexible.rem = win.rem = rem;
 }
它是获取视窗宽度，然后分成10份，10rem，例如当手机端宽度为640px，则1rem=64px

6.资源内联(raw-loader@0.5.1):
使用raw-loader对HTML,JS文件进行内联
使用style-loader对css进行内联

7.source-map:主要用来具体定位错误代码位置，因为打包上线的代码会经过压缩等相关操作
devtool:"eval";//他不会生成source-map,它会将每个模块执行eval( eval(module)  ),同时会增加一个sourceUrl来关联模块处理前后对应得关系
devtool:"source-map";//它会为每个打包后的文件生成独立的sourcemap文件，可在打包后的文件最后一行找到向映射的sourcemap文件
devtool:"inline-source-map";//不会独立生成source-map文件，是将文件以dataUrl的形式进行插入
devtool:"cheap-source-map";//它跟source-map一样打包后会独立生成source-map文件，但是于source-map区别在于cheap生成的map文件会忽略原始代码的列信息(也就是当发生错误的时候只能定义到行，而不能定义到列中)

8.提取公共资源:
webpack4内置的公共资源:
optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        }
      }
    }
  }

9.tree shaking:
一个模块中可能有多个方法，只要其中的某个方法用到了，则整个文件都会被打到bundle里面，tree skaing就是只把用到的方法打到bundle里面，没用到的会在uglify阶段擦掉

webpack是默认支持的，在babelrc文件中里设置module:false即可，在production mode的情况是默认开启的

但是要求必须是ES6语法(import) common.js的方式不支持

10.Scope Hoisting:

没配置之前带来的问题:
会存在大量闭包的问题，例如 a,b两个模块在打包后就会bundle.js文件出现两个闭包
大量函数闭包包裹代码，导致体积增大(模块越多越明显)
运行代码时创建的函数作用域变多，内存开销变大

原因:
被webpack转换后的模块会带上一层包裹
import会被转化为_webpack_require(加载模块，返回module.exports)

原理:
将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突

Scope Hoisting带来的优点:可以减少函数声明代码和内存开销

webpack4在mode:production默认开启
但是代码是ES6，不能是common.js代码

11.代码分割:
将代码分割成chunks，当代码运行到需要它们的时候再进行加载
使用场景：
抽离相同的代码到一个共享块
脚本懒加载，使得初始下载的代码更小(按需加载)

(1).使用动态import:(目前原生还没支持，需要babel转换),
  cnpm install @babel/plugin-syntax-dynamic-import --save-dev
  添加到babelrc文件里面:"plugins":["@babel/plugin-syntax-dynamic-import"]
  使用方式:
  import("文件").then( (res)=>{
      //这里是加载完文件后返回的结果
  } )
原理是通过当触发懒加载的时候会发起一个jsonp的形式来加载js
(2).common.js:
  require.ensure

12.Eslint规范配置:
使用eslint-loader，构建的时候检查JS规范:
{
    test:/\.js$/,
    use:[
        "babel-loader",
        "eslint-loader"
    ]
}
例如使用React项目来配置:
(1).cnpm install eslint eslint-plugin-import eslint-plugin-react eslint-plugin-jsx-a11y -D
tip:(eslint-plugin-jsx-a11y 这个是数字11不是ll)
(2).cnpm install eslint-loader -D
(3).
{
    test:/\.js$/,
    use:[
        "babel-loader",
        "eslint-loader"
    ]
}
(4).创建.eslintrc.js文件(或者.eslintrc.json),
文件内写入eslint配置,例如:
module.exports = {
    "parse":"babel-eslint",
    "extends":"airbnb",
    "env":{
        "browser":true,
        "node":true
    },
    //配置规则
    // "rules":{
    //     "semi":"error"
    // }
}
(5).安装babel-eslint:
cnpm install babel-eslint -D
(6).安装eslint-config-airbnb
cnpm install eslint-config-airbnb -D


13.打包组件和库:
打包某个组件或者库:
module.exports = {
    entry:{
        "large-number":"./src/index.js",
        "large-number.min":"./src/index.js"
    },
    output :{
        filename:"[name].js",
        library:"largeNumber",
        libraryTarget:"umd",//设置可以通过什么方式引入 cjs,amd,cdm,ES Module
        libraryExport:"default"
    }
}
14.优化构建的时候命令行的显示日志:
在开发环境下面需要把stats设置在devServer里面:
devServer:{
    ...,
    stats:"error-only"
}
生成环境下：
stats:"error-only"

但是可以使用friendly-errors-webpack-plugin插件:
使用:
安装:
cnpm install friendly-errors-webpack-plugin
配置:
plugins:[
    new FriendlyErrorsWebpackPlugin()
],
stats:"errors-only",
结果：
success:构建成功日志提示
warning:构建警告日志提示
error:构建错误日志提示


