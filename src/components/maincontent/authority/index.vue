<template>
  <div  class="HomeContent">
    <el-menu
      default-active="authority/adminList"
      background-color="white"
      class="el-menu-demo"
      mode="horizontal"
      router
    >
      <el-menu-item index="authority/adminList">管理员列表</el-menu-item>
      <el-menu-item index="authority/grantedTeachers">授权教师</el-menu-item>
      <el-menu-item index="authority/revoke">禁权列表</el-menu-item>
    </el-menu>
    <div class="line"></div>
    <el-main>
      <router-view></router-view>
    </el-main>
  </div>
</template>


<script>
export default {
  name: "authority",
  created(){
    this.$router.replace('authority/adminList');
  }
};
</script>
  