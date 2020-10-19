//将代码转换为AST语法抽象树,通过babylon进行转换

const babylon = require("babylon");//解析
const traverse= require("babel-traverse").default;//转换，用来遍历更新@babel/parse生成得AST,//babel-generator生成AST
const { transformFromAst  } = require("babel-core")
const fs = require("fs");
module.exports = {

    getAST:(path)=>{
        //同步读取内容
        const source = fs.readFileSync(path,"utf-8");

        return babylon.parse(source,{

            sourceType:"module"
        })
    },

    //获取依赖
    getDependencies:(ast)=>{
        const dependencies = [];
        traverse(ast,{
            ImportDeclaration:({node})=>{
                dependencies.push( node.source.value );
            }
        })
        return dependencies;
    },
    //给定一个ast，然后转换为日常的代码
    transform:(ast)=>{
        const { code } = transformFromAst(ast,null,{
            presets:["env"]
        })
    }

}

