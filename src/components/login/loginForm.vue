<template>
  <div class="login_body_content">
    <loginFormBar :isRemenber="ruleForm.isRemenber"></loginFormBar> 
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
          @click="pressIsRemenberButton"
        >
          <i
            :class="this.$store.state.isRemenberButtonClass"
            :style="{color:this.$store.state.isColor}"
          ></i>
          <span style="font-size:15px">记住密码</span>
        </span>
      </el-form-item>
      <el-form-item
        prop="id"
        :label="this.$store.state.label"
      >
        <el-input
          type="text"
          autocomplete="off"
          v-model="ruleForm.id"
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
        <span @click="resetCaptcha"><el-image
            :src="this.$store.state.captchaUrl"
            style="width:100%;height:100%;"
          ></el-image></span>
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
import loginFormBar from './loginFormBar.vue';
export default {
  name: "loginPage",
  components:{
    loginFormBar
  },
  data() {
    var checkId = (rule, value, callback) => {
      switch(this.$store.state.role){
        case "student": this.verifyStudentId(rule,value,callback);break;
        case "admin": this.verifyAdminId(rule,value,callback);break;
        case "teacher":this.verifyTeacherId(rule,value,callback);break;
        default:break;
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        let passPattern = new RegExp("[a-zA-Z0-9!_$]{6,18}");
        setTimeout(() => {
          if (!passPattern.test(value)) {
            callback(new Error("格式：数字或英文或!或_或$ , 长度：6-18"));
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
        role: this.$store.state.role,
        id: "",
        password: "",
        captcha: "",
        isRemenber: false,
      },
      rules: {
        id: [{ validator: checkId, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        captcha: [{ validator: validateCaptcha, trigger: "blur" }],
      },
      isPost: false,
      isTurned: false,
    };
  },
  methods: {
    submitForm(formName) {
      if (!this.isTurned) {
        this.isTurned = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            localStorage.setItem("role", "student");
            this.$router.push("/home", () => {});
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
    pressIsRemenberButton() {
      this.$store.commit("pressIsRemenberButton",this.ruleForm.isRemenber);
      this.ruleForm.isRemenber = !this.ruleForm.isRemenber;
    },
    resetCaptcha() {
      if (!this.isPost) {
        this.isPost = true;
        this.$store.commit("changeCaptcha");
        setTimeout(() => {
          this.isPost = false;
        }, 500);
      }
    },
    verifyStudentId(rule,value,callback){
      if (!value) {
        return callback(new Error("请输入学号"));
      } else {
        setTimeout(() => {
          let idPattern = new RegExp("^\\d{8}$");
          if (!idPattern.test(value)) {
            callback(new Error("请输入正确学号"));
          } else {
            callback();
          }
        }, 500);
      }
    },
    verifyAdminId(rule,value,callback){
      if (!value) {
        return callback(new Error("请输入管理员ID"));
      } else {
        setTimeout(() => {
          let idPattern = new RegExp("[a-zA-Z0-9]{5,18}");
          if (!idPattern.test(value)) {
            callback(new Error("请输入正确管理员ID"));
          } else {
            callback();
          }
        }, 500);
      }
    },
    verifyTeacherId(rule,value,callback){
      if (!value) {
        return callback(new Error("请输入教师ID"));
      } else {
        setTimeout(() => {
          let idPattern = new RegExp("^\\d{8}$");
          if (!idPattern.test(value)) {
            callback(new Error("请输入正确教师ID"));
          } else {
            callback();
          }
        }, 500);
      }
    }
  },
  provide() {
    return{
      pressIsRemenberButton: this.pressIsRemenberButton,
      resetForm: this.resetForm,
    }
  },
  watch:{
    "$store.state.role"(){
      this.ruleForm.role = this.$store.getters.getRole;
    }
  }
};
</script>
