<template>
  <el-menu
    class="sideBar"
    background-color=rgb(48,65,86)
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse-transition="false"
    :collapse="isCollapse"
    router
  >
    <div>
      <img src="../../assets/logo.png">
      <b v-show="textShow">教务管理系统</b>
    </div>
    
  </el-menu>
</template>

<style>
.sideBar {
  min-height: 100vh;
  overflow-x: hidden;
}
.sideBar > div {
  height: 60px;
  line-height: 60px;
  text-align: center;
}

.sideBar img {
  width: 20px;
  position: relative;
  top: 5px;
  margin-right: 5px;
  margin-left: 6px;
}
.sideBar b {
  color: white;
  margin-right: 5px;
}
</style>

<script>
export default {
  name: "sideBar",
  props: {
    isCollapse: {
      type: Boolean,
    },
    textShow: {
      type: Boolean,
    },
  },
  created() {},
};
</script>
