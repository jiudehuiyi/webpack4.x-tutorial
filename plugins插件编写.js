/*
        plugins
*/

1.插件没有loader那样独立运行的环境，只能在webpack中运行

2.基本结构:
class MyPlugin {
    apply(compiler){
        compiler.hooks.done.tap("My Plugin",(stats)=>{
            console.log("Hello World")
        })
    }
}
module.exports = MyPlugin;

3.开发一个最简单的插件
module.exports = class DemoPlugin{
    constructor(options){
        this.options = options;
    }
    apply(){
        console.log("apply"+this.options)
    }
}
