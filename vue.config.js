const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        //target:'http://192.168.12.101:8081',
        // target: 'http://localhost:9092',
        //政务云
        // target: "https://175.153.176.27:18803/api",
        //市政务云
        target:"https://119.4.191.13:8871/api",
        // target: 'http://101.37.246.72:9092',//服务器
        //target:'http://192.168.0.103:8081',
        //target:'http://192.168.50.7:8081',
        changeOrigin: true,
        pathRewrite: {
          "^/api": "", //将url中起始的'/api'替换成''，比如将/api/getDeptList替换成/getDeptList
        },
      },

      "/OsmoticFluid": {
        //政务云
        // target: "https://175.153.176.27:18801/api",
        //市政务云
        target:"https://119.4.191.13:8891/api",
        // target: 'http://localhost:8084',
        // target: "http://101.37.246.72:8084",
        changeOrigin: true,
        pathRewrite: {
          "^/OsmoticFluid": "",
        },
      },
    },
  },
  transpileDependencies: ["date-week-range", "element-plus"],
});
