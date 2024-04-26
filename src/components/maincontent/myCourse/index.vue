<template>
  <div class="HomeContent">
    <el-menu
      default-active="myCourse/courseTable"
      background-color="white"
      class="el-menu-demo"
      mode="horizontal"
      router
    >
      <el-menu-item index="myCourse/courseTable">我的课表</el-menu-item>
      <el-menu-item index="myCourse/approvingCourse">申报课程</el-menu-item>
      <el-menu-item index="myCourse/record">调课记录</el-menu-item>
    </el-menu>
    <div class="line"></div>
    <el-main>
      <router-view></router-view>
    </el-main>
  </div>
</template>

<script>
export default {
  name: "myCourse",
  created(){
    this.$router.replace('myCourse/courseTable');
  }
};
</script>
  