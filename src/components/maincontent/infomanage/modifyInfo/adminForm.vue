<template>
  <div class="adminForm">
    <span>
      <h2 style="font-family: 'YouYuan';
                margin-left: 170px;
                margin-top:25px">
        个人信息表
      </h2>
    </span>
    <el-form
      :model="adminForm"
      ref="adminForm"
      style="margin-left: 120px;padding-top: 100px;"
    >
      <el-form-item style="margin-top: -50px;padding-bottom: 50px;">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="imageUrl"
            :src="imageUrl"
            class="avatar"
          >
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          ></i>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="姓名"
        prop="name"
        style="margin-left: -20px;padding-bottom: 5px;"
      >
        <el-input
          type="text"
          v-model="adminForm.name"
          autocomplete="off"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
        style="margin-left: -20px;padding-bottom: 5px;"
      >
        <el-input
          type="text"
          v-model="adminForm.email"
          autocomplete="off"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="电话号码"
        prop="phone"
        style="margin-left: -48px;"
      >
        <el-input
          type="text"
          v-model="adminForm.phone"
          autocomplete="off"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<style>
.adminForm {
  width: 480px;
  height: 630px;
  background-color: rgb(242, 244, 246);
  margin: 0 auto;
  margin-top: 5px;
  border: 1px solid rgb(242, 244, 246);
  border-radius: 8px;
  box-shadow: 1px 1px 5px 5px rgba(208, 211, 210, 0.267);
}
.avatar-uploader .el-upload {
  margin-left: 65px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 20px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>

<script>
export default {
  name: "adminForm",
  data() {
    return {
      adminForm: {
        name: "",
      },
    };
  },
};
</script>
