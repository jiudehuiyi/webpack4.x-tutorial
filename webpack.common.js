//在webpack4.x中建议使用3个文件,一个公共(webpack.common.js)配置,配置生产环境和开发环境特有的配置,
//webpack.dev.js 是开发环境的配置文件
//webpack.pro.js 时生产环境配置文件
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const InlineManifestWebpackPlugin = require("inline-manifest-webpack-plugin")
const devMode = process.env.NODE_ENV !== 'production';
const glob = require("glob-all");
const PurifyCSSPlugin = require('purifycss-webpack');
const IconfontWebpackPlugin = require('iconfont-webpack-plugin');
module.exports = {
    //上下文属性,是entry(或者某些loader和plugin)的基础路径,默认路径是process.cwd(),webpack配置文件的目录,
    // context:""
    // 例如：
    //目录如下
    // webpack-path
    // |-- context
    //     |-- webpack.config.js
    //     |-- src
    //         |-- admin    
    //         |-- web
    //             |-- main.js
    // context 和 entry 的配置关系如下。
    // {
    //     context: path.resolve(__dirname, './src/'),
    //     entry: './web/main.js'
    // }
    // {
    //     context: path.resolve(__dirname, './src/web'),
    //     entry: './main.js'
    // }
    // {
    //     context: path.resolve(__dirname, './src/admin'),
    //     entry: '../web/main.js'
    // }

    //配置入口文件,因为配置是react(单页面),只配置一个入口,entry参数可以是字符串,数组,对象
    //enrty默认是src目录下的index.js,也可以直接指定,当配置相对路径的时候,是以context(上面的属性)作为参考的
    entry:"./src/index.js",

    //配置输出文件,
    output:{


        //打包后文件输出的文件目录,必须使用绝对路径,利用node的path模块进行书写,默认路径为:process.cwd(),和context一样
        path:path.resolve(__dirname,"dist"),

        //文件名,该文件名是相对于,如果是单入口，生成一个JS文文件,应该采用静态名称,例如：bundle.js
       //当如果存在多个入口起点，代码拆分,或者别的插件拆分JS，应采用[name].bundle.js或者[name].[hash].bundle.js去赋予每个JS唯一的名称
        filename:"[name].bundle.js",

        //此属性理解为:未被列入entry中,但又需要被打包出来的文件命名配置,什么场景需要了呢？在按需加载(异步加载)的时候,这样的文件是没有被列入entry中的
        //默认是使用[id].js,但是这个自动分配的id可读性是很差的,所以在按需引用的场景下建议配置此属性
        chunkFilename:"[name].bundle.js",

        //此属性用于异步加载跨域资源时配置
        //此属性只能用于target是web的,target的类型有:async-node(类node.js环境),electron-main( Electron 主进程)，electron-renderer(Electron 渲染进程),node(node环境),web(浏览器),webworker
        //跨域加载属性:默认值为false，可选属性为:false(禁用跨域加载),anonymous(启用跨域加载,但是不带凭据(cookie,http(s)证书等),use-credentials(启用跨域加载,携带凭据(cookie,http(s)证书等))
        // crossOriginLoading:false|"anonymous"|"use-credentials"


        // 导出库的名称，string 类型
        // 不填它时，默认输出格式是匿名的立即执行函数
        // library: 'MyLibrary',
        // // 导出库的类型，枚举类型，默认是 var
        // // 可以是 umd | umd2 | commonjs2 | commonjs | amd | this | var | assign | window | global | jsonp ，
        // libraryTarget: 'umd',

        //pathinfo属性为是是否在bundle中引入相关注释,在mode:development时为true，在mode:production时为false

        //publicPath是webpack中的一个重点和难点,这里是总结的一个公式
        //静态资源最终访问路径=output.publicPath+loader/plugin配置的路径
        // 例如：
        // output.publicPath = '/static/'
        // // 图片 url-loader 配置
        // {
        //     name: 'img/[name].[ext]'
        // }
        // // 那么图片最终的访问路径为
        // output.publicPath + 'img/[name].[ext]' = '/static/img/[name].[ext]'
        // // JS output.filename 配置
        // {
        //     filename: 'js/[name].js'
        // }
        // // 那么JS最终访问路径为 
        // output.publicPath + 'js/[name].js' = '/static/js/[name].js'
        //建议：publicPath 应该以/结尾，同时其它 loader 或插件的配置不能以/开头。
        // 当配置线上publicPath的时候,可以写上相对应的路径,例如 publicPath:'http://wwww.qinshenxue.com/static/'
        //publicPath通常是mode:production线上环境使用
        // publicPath:"/"


    },

    module:{
        //rules属性是配置各个文件所需要的loader,因为webpack只认识js,json等文件,并不认识css,image等类型的文件,所以需要利用相应的loader进行解析
        rules:[
            //babel配置js,jsx文件(react),将ES6+代码转化为ES5代码
            {
                //匹配一类文件,匹配到这一类的文件采用这个loader进行解析
                test:/\.(js|jsx)$/,

                //排除node_modules文件,对node_module中的文件不使用此loader进行解析
                exclude:/node_modules/,

                //将node_modules模块用此loader进行解析(这里用node_module是为了进行对比,实际开发应对实际模块对应),
                //例如:include:path.resolve(__dirname,"app"),一般你编写的文件才用babel-loader进行解析
                // include:/node_modules/

                
                //resource.include resource.exclude,resource.test跟等同于rule.exclude,rule.exclude,rule.test一样,
                // resource:{
                //     test: /\.js?$/,
                //     include: path.resolve(__dirname, "app"),
                //     exclude: path.resolve(__dirname, "app/demo")
                //   },
      
   

                //issuer与resource有异曲同工之妙,区别在于将这个rule应用于那个文件及其这个文件的所有依赖
                // issuer:{
                //     test:/\.js$/,
                //     include:path.resolve(),
                //     exclude:path.resolve(),
                // },

                //rule.loader是use:[{loader:""}]的简称,用来确定test中里面所匹配到的文件，所采用的loader
                // loader:"babel-loader",

                // Rule.options 和 Rule.query 是 Rule.use: [ { options } ] 的简写
                // options/query

                use:{
                    //所要应用的loader
                    loader:"babel-loader",
                    //不同的loader的options不同
                    //这项配置可以在.babelrc文件中进行配置,也可以在webpack中配置,这里采用在webpack中配置
                    options:{
                        babelrc:false,
                        presets:[
                            require.resolve("@babel/preset-react"),
                            [require.resolve("@babel/preset-env"),{modules:false}]
                        ]
                    }
                },

                //enforce有两个值,一个值为post,一个值为pre,post是表示将此loader后置(最后执行),pre表示将此loader前置(放在最前面执行)
                // enforce:post|pre,

            },

            //对于上面的rule的重要的选项进行了解析,下面我们就开始来配置一下常用的loader:

            //配置图片loader,
            //可以用file-loader或者url-loader,他们的区别是url-loader比file-loader多了一个功能,就是当在url-loader配置限定图片的大小,
            //如果小于所配置的值就会被打包进JS文件,如果大于所配置的值就会被另外打包成一个文件,为什么要这样做了呢?因为打包成一个文件也是需要一个请求的,
            //如果图片太小去开启一次http请求这是很浪费时间的,如果图片太大加载在打包完成的JS中,那么js的请求时间也会很慢.
            //例:limit选项就是配置大小的参数,是以字节为单位,当图片大小大于8192(8kb)时就会把图片另外抽取,如果小于8kb就会直接打包进生成的JS文件
            {
                test:/\.(png|jpg|jpeg|gif)$/,
                use:[
                    {
                        loader:"url-loader",
                        options:{
                            name:"[name].[ext]",//图片名
                            limit:8192,//这里的大小由你的项目决定,不一定时8192字节
                        }
                    }
                ]
            },

            //webpack>2.0,json文件时默认已经包含了的,这里可以配置或者不配置都可以
            // {
            //     test:/\.json$/,
            //     use:[{loader:"json-loader"}]
            // }

            //配置css loader
            {
                test:/\.(css|scss|sass)$/,
                //use里面的对象是从后面开始解析的,例如:解析完css-loader才去解析style-loader
                use:[
                    {
                        loader: MiniCssExtractPlugin.loader,//使用 MiniCssExtractPlugin.loader抽离css文件(从css中分离),
                        options: {
                            hmr: process.env.NODE_ENV === 'development',//hmr当时开发环境时开启热模板替换
                          },
                        // loader:"style-loader"//对css内联加载在dom上<style> 所写的样式 </style>,当抽离css就不需要配置style-loader,因为他们会发生冲突
                    },
                    {
                        loader:"css-loader",//解析css
                        options:{
                            importLoaders:2
                        }
                    },
                    {
                        loader: "postcss-loader",//添加插件loader
                        options: {
                          plugins: (loader) => [
                              require("autoprefixer")(),
                              new IconfontWebpackPlugin(loader)//iconfont插件
                            ],//配置一个css新属性自动添加前缀
                        },
                    },
                    {
                        loader:"sass-loader"//配置scss预编译器,配置less,stylus同理
                    }
                ]
            },

            //配置gizp loader
            {
                test:/\.gz$/,
                enforce:"pre",//前置loader
                use:"gzip-loader"
            },

            //配置svg
            {
                test:/\.svg$/,
                use:"file-loader"
            },
            //配置字体
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: {
                  loader: "file-loader",
                  options: {
                    name: "fonts/[name].[ext]",
                  },
                },
              },

            //!!!基础和常用的loader已经配置完成,可以根据项目需求添加所需要的loader



        ],

        //此选项是忽略已知没有采用模板化的库,利用webpack进行解析,因为这是没有意义的,webpack是不会对没有模板化的库进行解析的,例如jquery,lodash,配置此项的好处是提升构建速度
        noParse:/jquery|loadsh/,

    },

    resolve:{
        //alias选项能使import require引入更加方便,可以避免路径过长得问题
        //一般这个比较常用
        // alias:{
            //引入路径为:import Utility from '../../utilities/utility';
            //则配置下面这个选项后，
            // Utilities: path.resolve(__dirname, 'src/utilities/'),
            //就可以直接这样引入文件:import Utility from 'Utilities/utility';
        // }

        //enforceExtension是强制引入文件是否携带拓展名,如果为true则必须携带拓展名,
        //例如:require("./foo")必须写成require("./foo.js"),配置项默认为false
        // enforceExtension:Boolean

        //extensions是自动解析得扩展,默认为['.wasm', '.mjs', '.js', '.json']
        //extensions[]

        //plugins是应该使用的额外的解析插件列表
        // plugins:[]
    },

    //optimization是一个优化选项,
    optimization:{
        //抽离相同的模块
        splitChunks:{
            //当满足下列条件的时候会自动打包
            // 当前模块是公共模块（多处引用）或者模块来自 node_modules
            // 当前模块大小大于 30kb
            // 如果此模块是按需加载，并行请求的最大数量小于等于 5
            // 如果此模块在初始页面加载，并行请求的最大数量小于等于 3
            cacheGroups:{
                //抽离自己写的代码
                commons:{
                    //chunks有3个选项,async(对异步加载做代码分割),initial(对初始代码做分割),all(对所有(包括initial和async)进行分割),可以依据你的项目作出不同的配置
                    chunks:"initial",
                    //打包后的文件名,自定义
                    name:"common",
                    //分割前必须共享模块的最小块数,
                    minChunks:2,
                   //只要超过0字节就会生成一个新包,配置多少根据你自己而定
                    minSize:0,

                    //maxAsyncRequests表示最多有五个异步加载请求该module
                    // maxAsyncRequests:5

                    //maxInitialRequests表示最多有三个初始化的时候请求该module
                    // maxInitialRequests:3

                    //test则决定去从那些文件进行分割
                    // test://

                    //模块可以属于多个缓存组,优先级更高的话,模块就被打包进那个缓存组,当优先级一样的时候,size大的被优先选择
                    // priority:number
                },
                //抽离第三方插件(node_modules)
                vendor:{
                    //抽取第三方模块
                    test:/[\\/]node_modules[\\/]/,
                    //抽取模块包括异步和初始的
                    chunks:"all",
                    //抽取打包后的模块名,任意定义
                    name:"vendor",
                    //优先级,符合test选项的模块被优先抽取到vendor.js中
                    priority:10
                }
            }
        },
        
        //当为true的时候使用 TerserPlugin压缩bundle(当是生产环境mode:production的时候默认是true),当为false不进行压缩
        // minimize:Boolean,

        // minimizer是允许你自定义压缩js代码的工具,允许你通过提供一个或多个定制过的 TerserPlugin 实例，它是覆盖默认压缩工具的
        // minimizer:[],

        //它的作用是将包含chunks映射关系单独从app.js中提取出来,因为每一个chunk的id基本都是基于内容hash出来的,
        //所以你每次改动都会影响它,如果你不将它提取出来,当你每次改变app.js,会导致缓存失效
        //但是如果单独抽离这个文件的话都会生成一个非常小的js文件,一般经过gzip的话就只有几kb,但是这个文件又经常改变,我们每次都需要重新去请求它
        //所以它的http请求时间都远远大于它的执行时间,所以是不建议将它直接打包,而是将其内联哎index.html中,这是为什么呢？因为index.html每次打包都会改变
        //可以使用 inline-manifest-webpack-plugin或者 assets-webpack-plugin等来实现内联的效果。
        runtimeChunk:true,

        //启用可以帮助更好的调试,development默认启用该production默认禁用
        // namedModules:Boolean
        // namedChunks:Boolean


    },

    plugins:[
        //清除dist目录下的文件,此配置必须在HtmlWebpackPlugin插件的前面
        new CleanWebpackPlugin(),

        //自动加载JS文件(打包后的JS文件)在html中的插件
        new HtmlWebpackPlugin({
            //template属性:源码为:this.options.template = this.getFullTemplatePath(this.options.template, compiler.context);
            //他的路径是相对于output.context,因此模板文件需要放在output.context目录下才能被识别
            template:"./src/index.html",

            //filename属性：源码为：this.options.filename = path.relative(compiler.options.output.path, filename);
            //filename的路径是相对于output.path的，当在webpack-server-dev中是相对于publicPath的,
            //!!建议output.publicPath和webpack.dev.server中的publicPath中均可以配置为/,vue-clic则是采用这种规则,template 放在根目录，html-webpack-plugin 不用修改参数的路径，filename 采用默认值。
            filename:"./index.html",
            chunksSortMode:"auto",
        }),
        // 注意一定要在HtmlWebpackPlugin之后引用
        // inline 的name 和你 runtimeChunk 的 name保持一致
        // if you changed the runtimeChunk's name, you need to sync it here
        new InlineManifestWebpackPlugin("manifest"),

        //分离css文件插件,
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? '[name].css' : '[name].[hash].css',//文件名
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',//分块文件名
          }),
        //去除未使用的css代码,相当于js的tree shaking
        new PurifyCSSPlugin({
            paths:glob.sync( [
                // path.join(__dirname,`./src/*.html`),
                //该路径是一个绝对路径,并且该插件必须在分离css文件插件之前,
                path.join(__dirname,"./src/*.js")//react是需要配置js文件的,不像给出的文档是配置html页面,在配置react去除未使用到的样式是需要配置对应的js文件的
            ]),
            // styleExtensions:[".css",".scss",".sass"],
            // moduleExtensions:[".html"]	
           
        })
    ]

}


