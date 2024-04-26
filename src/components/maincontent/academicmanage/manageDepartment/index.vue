<template>
  <div class="HomeContent">
    <el-tabs
      style="filter:(2px);"
      v-model="activeName"
    >
      <el-tab-pane
        label="院系列表"
        name="first"
        style="margin-top: 5px;"
      >
        <departmentPage></departmentPage>
      </el-tab-pane>
      <el-tab-pane
        label="专业列表"
        name="second"
        style="margin-top: 5px;"
      >
        <professionPage></professionPage>
      </el-tab-pane>
      <el-tab-pane
        label="班级列表"
        name="third"
        style="margin-top: 5px;"
      >
        <clazzPage></clazzPage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import departmentPage from "./deparmentPage";
import professionPage from "./professionPage";
import clazzPage from "./clazzPage";
export default {
  name: "manageDepartment",
  data() {
    return {
      activeName: "first",
    };
  },
  components: {
    departmentPage,
    professionPage,
    clazzPage
  },
};
</script>
