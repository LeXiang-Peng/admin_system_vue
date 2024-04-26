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
      :model="postForm"
      ref="postForm"
      style="margin-left: 105px;padding-top: 120px;"
      :disabled="!isEdit"
    >
      <el-form-item style="margin-top: -50px; margin-left: -10px; padding-bottom: 20px;">
        <el-upload
          ref="upload"
          class="avatar-uploader"
          action="http://47.96.157.155:9090/common/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          accept=".jpeg,.png,.jpg,.bmp,.gif"
          :headers="headers"
        >
          <img
            style="margin:0;padding: 0;object-fit: contain;width: 150px;height: 150px;"
            shape="square"
            :src="avatar_url"
          />
        </el-upload>
      </el-form-item>
      <el-form-item
        label="姓名"
        prop="name"
        style="padding-bottom: 5px;"
      >
        <el-input
          type="text"
          v-model="postForm.name"
          autocomplete="off"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
        style="padding-bottom: 5px;"
      >
        <el-input
          type="text"
          v-model="postForm.email"
          autocomplete="off"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="电话号码"
        prop="phone"
        style="margin-left: -28px;"
      >
        <el-input
          type="text"
          v-model="postForm.phone"
          autocomplete="off"
          style="width: 200px;"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="id===2"
        label="身份证号码"
        prop="phone"
        style="margin-left: -42px;"
      >
        <el-input
          type="password"
          v-model="postForm.IDNumber"
          autocomplete="off"
          style="width: 200px;"
          :show-password="isEdit"
        >

        </el-input>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
      style="margin-left: 150px;margin-top: 80px;"
    >
      <div v-if="!isEdit">
        <el-button
          type="primary"
          @click="openEditMode"
          style="margin-left: 48px;height: 30px;width: 70px;text-align: center;"
        >编辑</el-button>
      </div>
      <div v-if="isEdit">
        <el-button
          @click="quitEditMode"
          style="margin-right: 10px;height: 30px;width: 70px;text-align: center;"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="saveInfo()"
          style="margin-left: 10px;height: 30px;width: 70px;text-align: center;"
        >保存 </el-button>
      </div>
    </div>
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
let set = new Set();
import {
  getStudentInfo,
  saveStudentInfo,
  getAdminInfo,
  saveAdminInfo,
  getTeacherInfo,
  saveTeacherInfo,
} from "@/utils/api";
import store from "@/store";
export default {
  name: "adminForm",
  data() {
    return {
      headers: { token: this.$store.getters.getToken },
      postForm: {
        name: "",
        email: "",
        phone: "",
        IDNumber: "",
      },
      isEdit: false,
      tempForm: {
        name: "",
        email: "",
        phone: "",
        IDNumber: "",
      },
    };
  },
  props: {
    id: {
      require: true,
    },
  },
  computed: {
    avatar_url: {
      get() {
        return store.getters.getAvatarUrl;
      },
    },
  },
  methods: {
    handleAvatarSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.$store.commit("setAvatarUrl", response.data);
        this.$message.success(response.msg);
      } else {
        this.$message.error(response.msg);
      }
      this.$refs.upload.clearFiles();
    },
    openEditMode() {
      this.isEdit = true;
    },
    quitEditMode() {
      set.clear();
      this.postForm = { ...this.tempForm };
      this.isEdit = false;
    },
    async getInfo() {
      let res;
      if (this.id === 1) {
        res = await getAdminInfo();
      }
      if (this.id === 2) {
        res = await getStudentInfo();
      }
      if (this.id === 3) {
        res = await getTeacherInfo();
      }
      if (!res) return;
      if (res.code === 200) {
        set.add(
          this.postForm.name +
            this.postForm.email +
            this.postForm.phone +
            this.postForm.IDNumber +
            this.$store.getters.getAvatarUrl
        );
        this.postForm.name = res.data.name;
        this.postForm.email = res.data.email;
        this.postForm.phone = res.data.phone;
        this.postForm.IDNumber = res.data.IDNumber;
        if (res.data.avatar_url) {
          this.$store.commit("setAvatarUrl", res.data.avatar_url);
        }
        this.tempForm = { ...this.postForm };
      } else {
        this.$message.error(res.msg);
      }
    },
    async saveInfo() {
      set.add(
        this.postForm.name +
          this.postForm.email +
          this.postForm.phone +
          this.postForm.IDNumber +
          this.$store.getters.getAvatarUrl
      );
      if (set.size === 1) {
        this.$message.error("请勿提交重复信息");
        return;
      }
      let res;
      if (this.id === 1) {
        res = await saveAdminInfo(this.postForm);
      }
      if (this.id === 2) {
        res = await saveStudentInfo(this.postForm);
      }
      if (this.id === 3) {
        res = await saveTeacherInfo(this.postForm);
      }
      if (!res) return;
      if (res.code === 200) {
        set.clear();
        if (this.tempForm.name !== this.postForm.name) {
          this.$store.commit("setUserName", this.postForm.name);
        }
        this.getInfo();
        this.tempForm = { ...this.postForm };
        this.$message.success(res.msg);
        this.isEdit = false;
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  created() {
    this.getInfo();
  },
};
</script>
