<template>
  <div
    class="HomeContent"
    style="filter:(2px);width: 100%;height: 85vh;"
    id="container"
  >

  </div>
</template>

<style  scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
}
</style>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";

export default {
  name: "home",
  mounted() {
    this.initAMap();
  },
  unmounted() {
    this.map?.destroy();
  },
  methods: {
    initAMap() {
      AMapLoader.load({
        key: "f4e3461fcaa47e3b5422b71ac10e0ff7", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
      })
        .then((AMap) => {
          this.map = new AMap.Map("container", {
            pitch: 50, //地图俯仰角度，有效范围 0 度- 83 度
            viewMode: "3D", //地图模式
            rotateEnable: true, //是否开启地图旋转交互 鼠标右键 + 鼠标画圈移动 或 键盘Ctrl + 鼠标左键画圈移动
            pitchEnable: true, //是否开启地图倾斜交互 鼠标右键 + 鼠标上下移动或键盘Ctrl + 鼠标左键上下移动
            zoom: 17, //初始化地图层级
            rotation: -15, //初始地图顺时针旋转的角度
            zooms: [2, 20], //地图显示的缩放级别范围
            center: [112.910709, 28.358367],
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>
