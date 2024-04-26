<template>
  <div class="HomeContent">
    <el-menu
      default-active="manageCourse/scheduleCourse"
      background-color="white"
      class="el-menu-demo"
      mode="horizontal"
      router
    >
      <el-menu-item index="manageCourse/scheduleCourse">排课</el-menu-item>
      <el-menu-item index="manageCourse/processCourse">课程申报</el-menu-item>
    </el-menu>
    <div class="line"></div>
    <el-main>
      <router-view></router-view>
    </el-main>
  </div>
</template>

<script>
export default {
  name: "manageCourse",
  created() {
    this.$router.replace("manageCourse/scheduleCourse");
  },
};
</script>
