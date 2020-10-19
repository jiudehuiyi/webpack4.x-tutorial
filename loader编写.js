/*
    loader的插件编写
*/
1.loader定义:loader是一个导出为函数的js模块，
例如:
module.exports = function(source){ return source } 
多loader执行顺序:
是串行执行的，顺序从后往前传递
原因：采用的是Compose方式
compose = (f,g) => (...args) => f(g(...args))

2.创建loader：可以使用webpack-cli工具进行
使用webpack-cli generate-loader创建初始loader

3.高效开发loader神器:loader-runner

4.获取loader参数：
loader-utils:
例如：
                test:/\.txt$/,
                use:[
                    {
                        loader:path.join(__dirname,"loaders/a-loader.js"),
                        options:{
                            name:"name",
                            age:20
                        }
                    }
                ]

                const loaderUtils = require("loader-utils");
                const { name,age } = loaderUtils.getOptions(this);

5.loader异常处理:
第一种是通过 : throw new Error();抛出错误
第二种是通过:this.callback(null,json);//向外抛出错误

6.创建一个异步的loader:
module.exports =function(source){
    const callback = this.async();

    //处理资源

    fs.readFile(path,(err,data)=>{
        callback(null,data)
    })
}

7.在loader中使用缓存:
webpack中是默认开启loader缓存的，可以使用this.cacheable(false)关闭缓存，
缓存条件:loader的结果在相同输入下有确定的输出结果
但是有依赖的缓存loader是无法使用缓存的

8.loader进行文件输出:
this.emitFile(url,content)对文件进行写入


9.自动合成雪碧图的loader
现成的雪碧图合成工具:spritesmith
例如:
var Spritesmith = require('spritesmith');
 
// Generate our spritesheet
var sprites = ['fork.png', 'github.png', 'twitter.png'];
Spritesmith.run({src: sprites}, function handleResult (err, result) {
  result.image; // Buffer representation of image
  result.coordinates; // Object mapping filename to {x, y, width, height} of image
  result.properties; // Object with metadata about spritesheet {width, height}
});