<template>
  <div class="login_body_content">
    <loginFormBar :isRemember="this.isRemember"></loginFormBar>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item>
        <span
          class="login_body_button"
          @click="pressIsRememberButton"
        >
          <i
            :class="this.$store.state.isRememberButtonClass"
            :style="{color:this.$store.state.isColor}"
          ></i>
          <span style="font-size:15px">记住密码</span>
        </span>
      </el-form-item>
      <el-form-item
        prop="id"
        :label=this.label
      >
        <el-input
          autocomplete="off"
          v-model.number="ruleForm.id"
          style="width: 210px;"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="password"
        label="密码"
      >
        <el-input
          type="password"
          autocomplete="off"
          v-model="ruleForm.password"
          style="width: 210px;"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item
        class="verificationCode"
        prop="captcha"
      >
        <el-input
          autocomplete="off"
          type="text"
          style="width: 120px;"
          v-model="ruleForm.captcha"
        ></el-input>
        <span @click="resetCaptcha"><img
            :src="this.captchaUrl"
            style="width:100%;height:100%;"
          ></img></span>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >登录</el-button>
        <el-button
          type="warning"
          style="margin-left: 10px;"
          @click="resetForm('ruleForm')"
        >重置</el-button>
        <p style="display: inline; margin-left: 5px;"><span style="margin-left: 0;">忘记密码？</span>
          <a
            href=""
            class="login_body_icon"
          >
            <i
              class="el-icon-thumb"
              style="transform: scale(1.1);margin-right: 1px;"
            ></i>点我
          </a>
        </p>
      </el-form-item>
    </el-form>
  </div>
</template>
<style>
.login_body_content {
  padding-top: 10%;
  padding-left: 3.5%;
}

.login_body_icon {
  zoom: 1;
  text-decoration: none;
  color: blue;
}
.login_body_icon:hover {
  color: crimson;
  zoom: 1.1;
}
.login_body_button {
  width: 90px;
  height: 26px;
  position: absolute;
  left: 60%;
  bottom: 1%;
  cursor: pointer;
}
.login_body_button i {
  transform: scale(1.9);
  margin-right: 10px;
}
.login_body_button:hover {
  zoom: 1.01;
}
.verificationCode span {
  margin-left: 5.5%;
  position: absolute;
  width: 24.5%;
  height: 125%;
}
.verificationCode span:hover {
  cursor: pointer;
}
</style>

<script>
import { login } from "@/utils/api";
import loginFormBar from "./loginFormBar.vue";
import { setIdCard, setLocalIdCard } from "@/utils/role";
export default {
  name: "loginPage",
  components: {
    loginFormBar,
  },
  data() {
    var checkId = (rule, value, callback) => {
      let msg = "";
      switch (this.ruleForm.role) {
        case "admin":
          msg = "管理员ID";
          break;
        case "teacher":
          msg = "教师ID";
          break;
        case "student":
          msg = "学号";
          break;
      }
      if (!value) {
        return callback(new Error("请输入".concat(msg)));
      } else {
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error("请输入正确的".concat(msg)));
          } else {
            callback();
          }
        }, 500);
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        let passPattern = new RegExp("[a-zA-Z0-9!_$]{6,18}");
        setTimeout(() => {
          if (!passPattern.test(value)) {
            callback(new Error("格式错误，请重新输入"));
          } else {
            callback();
          }
        }, 1000);
      }
    };
    var validateCaptcha = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写验证码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        role: "student",
        id: "",
        password: "",
        captcha: "",
      },
      rules: {
        id: [{ validator: checkId, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        captcha: [{ validator: validateCaptcha, trigger: "blur" }],
      },
      captchaUrl:
        "http://localhost:9090/common/captcha?time=" + new Date().getTime(),
      isPost: false,
      isTurned: false,
      label: "学号",
      isRemember: false,
    };
  },
  methods: {
    submitForm(formName) {
      if (!this.isTurned) {
        this.isTurned = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.login();
          } else {
            this.$message.error("请填写信息后提交");
            return false;
          }
        });
        setTimeout(() => {
          this.isTurned = false;
        }, 1000);
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    pressIsRememberButton() {
      this.$store.commit("pressIsRememberButton", this.isRemember);
      this.isRemember = !this.isRemember;
    },
    resetCaptcha() {
      if (!this.isPost) {
        this.isPost = true;
        this.captchaUrl =
          "http://localhost:9090/common/captcha?time=" + new Date().getTime();
        setTimeout(() => {
          this.isPost = false;
        }, 350);
      }
    },
    selectForm(id) {
      switch (id) {
        case "0":
          (this.ruleForm.role = "admin"), (this.label = "管理员ID");
          break;
        case "1":
          (this.ruleForm.role = "teacher"), (this.label = "教师ID");
          break;
        case "2":
          (this.ruleForm.role = "student"), (this.label = "学号");
          break;
        default:
          break;
      }
      this.captchaUrl =
        "http://localhost:9090/common/captcha?time=" + new Date().getTime();
    },
    async login() {
      const res = await login(this.ruleForm);
      if (res.code === 200) {
        this.$message.success(res.msg);
        //本地 vuex 存储
        if (this.isRemember) {
          this.$store.commit("setLocalToken", res.data.token);
          setLocalIdCard(this.ruleForm.role);
        }
        this.$store.commit("setToken", res.data.token);
        setIdCard(this.ruleForm.role);
        this.$router.replace("/");
      } else {
        this.resetCaptcha();
        this.$message.error(res.msg);
        return false;
      }
    },
  },
  provide() {
    return {
      pressIsRememberButton: this.pressIsRememberButton,
      resetForm: this.resetForm,
      selectForm: this.selectForm,
    };
  }
};
</script>
