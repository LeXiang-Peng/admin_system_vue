<template>
  <div class="login_body_content">
    <div class="bar">
      <span
        id="3"
        :class="{hold:isActive[2]}"
        @click="changeForm($event)"
      >学生</span>
      <span
        id="1"
        :class="{hold:isActive[0]}"
        @click="changeForm($event)"
      >管理员</span>
      <span
        id="2"
        :class="{hold:isActive[1]}"
        @click="changeForm($event)"
      >教师</span>
    </div>
    <keep-alive>
      <component
        :is="componentName"
        ref="children"
        :captchaUrl="captchaUrl"
      ></component>
    </keep-alive>
  </div>
</template>
<style>
.login_body_content {
  padding-top: 10%;
  padding-left: 3.5%;
}
.bar {
  margin-left: 22%;
  margin-top: -5%;
  margin-bottom: 5.5%;
}
.bar span {
  flex: 1;
  min-width: 62px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  display: inline-block;
  line-height: 30px;
  text-align: center;
  background: #f2f3f9;
  color: #666;
  cursor: pointer;
  margin-right: 15px;
}
.bar .hold {
  background: #cce3f6;
  border: 1px solid rgb(#7288fa);
  color: rgb(#7288fa);
}
</style>

<script>
import studentForm from "./form/studentForm.vue";
import adminForm from "./form/adminForm.vue";
import teacherForm from "./form/teacherForm.vue";
export default {
  name: "loginPage",
  components: {
    studentForm,
    adminForm,
    teacherForm,
  },
  data() {
    return {
      componentName: "studentForm",
      isActive: [false, false, true],
    };
  },
  methods: {
    changeForm(event) {
      let id = event.currentTarget.id;
      if (!this.isActive[id - 1]) {
        if (this.$refs.children.ruleForm.isRemenber) {
          this.$refs.children.pressButton();
        }
        this.$refs.children.resetForm("ruleForm");
        this.captchaUrl =
          "http://localhost:9090/common/captcha?time=" + new Date().getTime();
        let names = ["adminForm", "teacherForm", "studentForm"];
        this.isActive = [false, false, false];
        this.isActive[id - 1] = true;
        this.componentName = names[id - 1];
      }
    },
  },
  created() {
    this.captchaUrl =
      "http://localhost:9090/common/captcha?time=" + new Date().getTime();
  },
};
</script>
