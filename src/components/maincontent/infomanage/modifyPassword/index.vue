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
        :rules="passwordRules"
        style="margin-left: 125px;padding-top: 50px;"
      >
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
          label="确认新密码"
          prop="newPassword2"
          style="margin-left:-28px"
        >
          <el-input
            type="password"
            v-model="passwordForm.newPassword2"
            autocomplete="off"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        style="margin-left: 230px;"
      >
        <el-button
          type="primary"
          @click="submit()"
        >提交 </el-button>
      </span>
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
let set = new Set();
import {
  modifyStudentPass,
  modifyAdminPass,
  modifyTeacherPass,
  logout,
} from "@/utils/api";
import { getId } from "@/utils/role";
export default {
  name: "modifyPassword",
  data() {
    var validateNewPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        // 检查是否包含字母和数字
        const hasLetter = /[a-zA-Z]/.test(value);
        const hasDigit = /\d/.test(value);
        // 检查长度
        const isLengthValid = value.length >= 6 && value.length <= 18;
        setTimeout(() => {
          if (!hasLetter || !hasDigit || !isLengthValid) {
            callback(new Error("格式错误，请重新输入"));
          } else {
            if (this.passwordForm.newPassword2 !== "") {
              this.$refs.passwordForm.validateField("newPassword2");
            }
            callback();
          }
        }, 500);
      }
    };
    var validateNewPass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateOldPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        newPassword2: "",
      },
      id: 0,
      passwordRules: {
        newPassword: [{ validator: validateNewPass, trigger: "blur" }],
        newPassword2: [{ validator: validateNewPass2, trigger: "blur" }],
        oldPassword: [{ validator: validateOldPass, trigger: "blur" }],
      },
    };
  },
  created() {
    this.id = getId();
    console.log(this.id);
  },
  methods: {
    submit() {
      this.$refs["passwordForm"].validate((valid) => {
        if (valid) {
          // 检查是否包含字母和数字
          const hasLetter = /[a-zA-Z]/.test(this.passwordForm.oldPassword);
          const hasDigit = /\d/.test(this.passwordForm.oldPassword);
          // 检查长度
          const isLengthValid =
            this.passwordForm.oldPassword.length >= 6 &&
            this.passwordForm.oldPassword.length <= 18;
          if (!hasLetter || !hasDigit || !isLengthValid) {
            //this.$message.error("密码错误,请重新输入");
          } else {
            set.clear();
            set.add(this.passwordForm.oldPassword);
            set.add(this.passwordForm.newPassword);
            if (set.size === 1) {
              this.$message.error("密码重复，请重新提交新密码");
              this.passwordForm.newPassword = "";
              this.passwordForm.newPassword2 = "";
              return false;
            }
            this.modify(this.id);
          }
        } else {
          this.$message.error("请重新填写信息");
          return false;
        }
      });
    },
    async modify(id) {
      let res;
      switch (id) {
        case 1:
          res = await modifyAdminPass(this.passwordForm);
          break;
        case 2:
          res = await modifyStudentPass(this.passwordForm);
          break;
        case 3:
          res = await modifyTeacherPass(this.passwordForm);
          break;
      }
      this.passwordForm = {};
      if (res && res.code === 200) {
        logout();
        this.$message.success(res.msg);
        this.$store.commit("logout");
        this.$router.replace("/login");
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
</script>
  