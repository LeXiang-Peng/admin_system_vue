const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');
// 假设要请求的接口是：http://40.00.100.100:3002/api/user/add
module.exports = {
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

