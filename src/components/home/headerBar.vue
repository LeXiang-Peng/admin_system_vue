<template>
  <div class="headerBar">
    <div style="flex: 1; font-size:  18px;">
      <span
        style="cursor: pointer;"
        :class="collapseBtnClass"
        @click="collapse"
      ></span>
      <el-breadcrumb
        separator="/"
        style="display: inline-block; margin-left: 10px;"
      >
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-dropdown style="width: 70px;cursor: pointer;">
      <span>王小虎</span>
      <i
        class="el-icon-s-tools"
        style="margin-left:5px"
      ></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>个人信息</el-dropdown-item>
        <el-dropdown-item>退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<style>
.headerBar {
  height: 100%;
  width: 100%;
  display: flex;
}
</style>

<script>
export default {
  name: "headerBar",
  inject: ["collapse"],
  props: {
    collapseBtnClass: {
      type: String,
    },
  },
};
</script>