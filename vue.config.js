const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');
// 假设要请求的接口是：http://40.00.100.100:3002/api/user/add
module.exports = {
  devServer:{
      host:'localhost',  // 本地主机
      port:8080,  // 端口号的配置
      open:true,  // 自动打开浏览器
      proxy:{
                                                // 假如又有一个接口是：http://40.00.100.100:3002/get/list/add
                                                // 那就再配置一个 get的，如下：
        '/api': {                               //  拦截以 /get 开头的接口
          target: 'http://localhost:9090',      //设置你调用的接口域名和端口号 别忘了加http
          changeOrigin: true,                   //这里true表示实现跨域
          secure: false,                        // 如果是https接口，需要配置这个参数
          pathRewrite: {
            '^/api':'/'                         //这里理解成用‘/api’代替target里面的地址，
          }
        }
      }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        Popper: ["popper.js", "default"]
      })
    ]
  }
}

// 注意：修改了配置文件后一定要重启才会生效;

