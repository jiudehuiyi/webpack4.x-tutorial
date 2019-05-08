//开发环境可直接运行 npm run dev

const merge = require("webpack-merge");
const common = require('./webpack.common');
const webpack = require("webpack");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const DashboardPlugin = require("webpack-dashboard/plugin");
// const protocol = process.env.HTTPS === "true"?"https":"http";//获取全局变量中HTTPS变量,确定是否设置HTTPS选项,
module.exports = merge(common,{
    //mode时webpack4.x新特性,有development(开发环境),production(生产环境),none
    mode:"development",
    //开发环境下建议配置为source-map,因为错误信息都有详细解释
    devtool:"source-map",

    // webpack-dev-server是一种具有实时重新加载功能的,能够加快我们开发的进度,
    devServer:{
        //是否启用gzip压缩,默认是false
        compress:true,
        clientLogLevel:"none",

        // contentBase是配置devServer http服务器文件根目录,默认是当前执行目录,所以一般不用进行配置,
        //除非有额外的文件被devserver服务,且路径一般为绝对路径,
        //例如:想把项目根目录下的public目录设置成DevServer服务器的文件根目录:contentBase: path.join(__dirname, 'public')
        // contentBase:"",

        //watchContentBase当为true时候,在文件修改后会触发一次完整的页面重载
        // watchContentBase: true,

        //启用模板热替换,在配置hmr的时候,此项必须开启,hmr才能生效,
        hot:true,
        //当为true时,除了初始化webpack的信息外,来自webpack的错误和警告控制台都将看不见
        quiet:true,
        //此选项时用来确定协议的:http或者https
        // https:"",

        //publicPath是打包后的资源存放的路径且打包后的资源是直接运行在内存的,这样构建速度才会更快,
        //publicPath相当于output.path
        publicPath:"/",
        //运行npm script命令打开webpack-dev-server,配置为true的时候直接在浏览器打开相对应的网页
        open:true,
        //端口,默认为8080
        port:3000,
        //主机地址,默认为："127.0.0.1"
        host:"127.0.0.1",
        //overlay设置为true时候,出现编译器错误或警告时,错误和警告将在浏览器全柄屏显示
        overlay:false,
        //一般用来配置单页面应用,create-react-app源码中就是这样配置的
        historyApiFallback: {
            disableDotRule: true,
        },
        //一般不用对此项进行配置,一般用代理的时候才需进行配置,
        // 例如 dev-server 被代理到 nginx，并且在 myapp.test 上可用 public: 'myapp.test:80'
        // public:""

        //proxy选项非常强大,当后端接口在忙的时候,可以让后端提供一个临时的接口给前端进行数据调用,那么前端请求的原来接口就会与临时提供的接口不一样,
        //在前端来说,一般是请求原来的接口,不会去请求更改为临时接口,那么这时候proxy就非常有用了,
        //例如:当请求/api/users的时候会被代理到:http://localhost:3000/api/users,这样就不需要更改前端的代码了,当后台完成了接口后
        //就可以直接调用相对应的接口,这就是代理的作用
        // proxy:{
        //     "/api":"http://localhost:3000"
        // }

        //headers可以向http(s)响应中注入yixie响应头
        //例：headers:{'X-foo': 'bar'}
        // headers:{}

        watchOptions: {
            // Delay the rebuild after the first change
            aggregateTimeout: 300,
      
            // Poll using interval (in ms, accepts boolean too)
            poll: 1000,
          },

    },

    plugins:[
        new webpack.HotModuleReplacementPlugin(),//在开发环境中启用热替换

        //定义全局变量插件
        new webpack.DefinePlugin({
            // 在webpck<4的时候,开发环境可以process:{env:{NODE_ENV:JSON.stringify("development")}}
            //webpackwebpack<4的时候,生产环境process:{env:{NODE_ENV:JSON.stringify("production")}}
            //在webpack<4的时候就已经内置一个mode属性,可以让你不用去配置process。env.NODE_ENV环境变量
            // process:{env:{NODE_ENV:JSON.stringify("production")}}
        }),
        
        //编译进度条(为了美观)，可要可不要,
        new ProgressBarPlugin(),
        new DashboardPlugin()
    ]

})





