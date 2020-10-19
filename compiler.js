//文件构建和文件输出

const { getAST,getDependencies,transform } = require("./parser")
const fs = require("fs");
module.exports = {

    //实例化，参数为接受webpack中得配置
    constructor(options){
        const { entry,output } = options;
        this.entry = entry;
        this.output = output;
        this.modules=[];
    },

    //开始构建得方法
    run(){
        //构建入口模块
        const entryModule = this.buildModule( this.entry,true );
        
        this.modules.push( entryModule );
        //遍历构建模块
        this.modules.map( (_module)=>{
            _module.dependencies.map( (dependency)=>{
                this.modules.push( this.buildModule(dependency) );
            } )
        } )

        this.emitFiles();
    },
    //构建模块方法(构建单个模块)
    buildModule(filename,isEntry){
        let ast ;
        //如果是入口文件，路径为绝对路径，直接转换，
        if( isEntry ) {
            ast = getAST(filename);
        }else{
            //相对路径转化为绝对路径
            const absolutePath = path.join( process.cwd(),"./src",filename );
            ast = getAST( absolutePath );
        }
        return {
            filename,
            dependencies:getDependencies(ast),
            source:transform(ast),
        }
    },
    //输出文件
    emitFiles(){
        const outputPath = path.join( this.output.path,this.output.filename );
        //模块代码
        let modules = "";
        
        this.modules.map( (_module)=>{
            modules = `'${_module.filename}': function (require,module,exports){ ${_module.source}}`;
        } );

        const bundle = `(function(){
            function require(filename){
                var fn = modules[filename];
                var module = { exports:{} }
                fn(require,module,module.exports);
                return module.exports;
            }
            require('${this.entry}');
        })(${modules})`; 
        fs.writeFileSync(outputPath,bundle,"utf-8")
    }
}

