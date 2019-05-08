//生产环境则运行 npm run build对文件进行打包
const merge = require("webpack-merge");
const common = require("./webpack.common");
const ImageminPlugin = require('imagemin-webpack-plugin').default;
//压缩css插件
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = merge(common,{
    //mode时webpack4.x新特性,有development(开发环境),production(生产环境),none,
    //对于mode在这里说明一些,当mode时production时,默认启用了一系列插件,其中就包含了压缩JS代码插件,所以可以不用配置UglifyJsPlugin插件
    mode:"production",
    //生产环境环境下建议配置为cheap-module-source-map,因为对性能要求比较高,所以显示粗略信息就足够了 
    devtool:"cheap-module-source-map",

    optimization: {

        minimizer: [new OptimizeCssAssetsPlugin({
          cssProcessor: require('cssnano'),   // css 压缩优化器
          cssProcessorOptions: { discardComments: { removeAll: true } } // 去除所有注释
        })]
      },

      plugins: [
        //压缩图片
        new ImageminPlugin({
          pngquant: {//图片质量
            quality: '95-100'
          }
        })
    ]

})

