/*
        plugins
*/

1.BannerPlugin:为每个chunk文件头部添加banner
new webpack.BannerPlugin({
    banner:"string",
    banner:function(place){return "function"+place}
})
2.optimization.splitChunks:代码分割





