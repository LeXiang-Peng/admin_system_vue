<template>
  <div class="HomeContent">
    <el-menu
      default-active="courseInfo/myTable"
      background-color="white"
      class="el-menu-demo"
      mode="horizontal"
      router
    >
      <el-menu-item index="courseInfo/myTable">我的课表</el-menu-item>
      <el-menu-item index="courseInfo/selectCourse">选课</el-menu-item>
    </el-menu>
    <div class="line"></div>
    <el-main>
      <router-view></router-view>
    </el-main>
  </div>
</template>

<script>
export default {
  name: "",
  created(){
    this.$router.replace('courseInfo/myTable');
  }
};
</script>