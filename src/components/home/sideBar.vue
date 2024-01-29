<template>
  <el-menu
    class="sideBar"
    background-color=rgb(48,65,86)
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse-transition="false"
    :collapse="isCollapse"
  >
    <div>
      <img src="../../assets/logo.png">
      <b v-show="textShow">教务管理系统</b>
    </div>
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-s-custom"></i>
        <span slot="title">个人信息</span>
      </template>
      <el-menu-item-group>
        <template slot="title">分组一</template>
        <el-menu-item index="1-1">选项1</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
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
};
</script>
