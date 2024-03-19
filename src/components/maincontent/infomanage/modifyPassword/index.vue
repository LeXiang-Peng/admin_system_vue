<template>
  <div class="HomeContent">
    <div class="passwordForm">
      <span>
        <h2 style="font-family: 'YouYuan';
                  margin-left: 200px;
                  margin-top:50px">
          修改密码
        </h2>
      </span>
      <el-form
        :model="passwordForm"
        ref="passwordForm"
        style="margin-left: 125px;padding-top: 50px;"
      >
        <el-form-item
          label="新密码"
          prop="newPassword"
        >
          <el-input
            type="password"
            v-model="passwordForm.newPassword"
            autocomplete="off"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="旧密码"
          prop="oldPassword"
        >
          <el-input
            type="password"
            v-model="passwordForm.oldPassword"
            autocomplete="off"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="oldPassword2"
          style="margin-left:-14px"
        >
          <el-input
            type="password"
            v-model="passwordForm.oldPassword2"
            autocomplete="off"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
  
  <style>
.passwordForm {
  width: 500px;
  height: 350px;
  background-color: rgb(242, 244, 246);
  margin: 0 auto;
  margin-top: 100px;
  border: 1px solid rgb(242, 244, 246);
  border-radius: 8px;
  box-shadow: 1px 1px 2px 3px rgba(208, 211, 210, 0.267);
}
</style>
  
  <script>
export default {
  name: "modifyPassword",
  data() {
    return {
      passwordForm: {},
    };
  },
};
</script>
  