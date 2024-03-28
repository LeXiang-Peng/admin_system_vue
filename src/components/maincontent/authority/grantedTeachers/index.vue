<template>
  <div>
    <div style="margin: 10px 0;margin-top:-5px;">
      <el-input
        v-model.number="queryParams.id"
        style="width: 200px;"
        suffix-icon="el-icon-search"
        placeholder="请输入学号"
        oninput="value=value.replace(/[^\d]/g,'')"
      ></el-input>
      <el-input
        v-model="queryParams.name"
        style="width: 200px; margin-left: 5px;"
        suffix-icon="el-icon-user"
        placeholder="请输入名字"
      ></el-input>
      <el-select
        v-model="queryParams.department"
        clearable
        style="width: 200px; margin-left: 5px;"
        placeholder="请选择院系"
      >
        <el-option
          v-for="dep in departmentList"
          :value="dep"
          :label="dep"
          :key="dep"
        ></el-option>
      </el-select>
      <el-select
        v-model="queryParams.type"
        clearable
        style="width: 200px; margin-left: 5px;"
        placeholder="请选择权限类别"
      >
        <el-option
          :value="1"
          label="已授权"
          :key="1"
        ></el-option>
        <el-option
          :value="2"
          label="超管权限"
          :key="2"
        ></el-option>
        <el-option
          :value="3"
          label="禁权中"
          :key="3"
        ></el-option>
        <el-option
          :value="4"
          label="永久禁权"
          :key="4"
        ></el-option>
      </el-select>
      <el-button
        style="margin-left: 5px;"
        type="primary"
        @click="searchTeachers"
      >搜索</el-button>
      <el-button
        style="margin-left: 5px;"
        type="warning"
        @click="resetParams"
      >重置</el-button>
    </div>
    <div style="margin: 10px 0;padding-bottom:5px;">
      <el-button
        type="danger"
        @click="openBatchDeleteMode"
      >
        <i class="el-icon-remove-outline"></i>
        <span>批量删除</span>
      </el-button>
      <div
        v-if="batchDeleteVisible"
        style="display: inline;margin-left: 730px;"
      >
        <el-button
          type="primary"
          @click="exitBatchDeleteMode()"
        >取消</el-button>
        <el-button
          type="primary"
          @click="toggleSelection()"
        >重置选择</el-button>
        <el-button
          type="danger"
          @click="openIdentityDialog()"
        >确认</el-button>
      </div>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      size="small"
      :data="tableData"
      ref="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="border-radius: 8px; box-shadow: 5px 5px 50px 50px rgba(179, 184, 182, 0.267);"
    >
      <el-table-column
        type="selection"
        width="55"
        v-if="batchDeleteVisible"
        :selectable="checkSelect"
      >
      </el-table-column>
      <el-table-column
        prop="id"
        label="教师编号"
        width="80px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="120px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="department"
        label="院系"
        width="150px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        width="60px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="type"
        label="授权详情"
        width="100px"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            type="success"
            effect="dark"
            v-if="scope.row.type==1"
          >已授权</el-tag>
          <el-tag
            type="danger"
            effect="dark"
            v-if="scope.row.type==2"
          >超管权限</el-tag>
          <el-tag
            type="warning"
            effect="dark"
            v-if="scope.row.type==3"
          >禁权中</el-tag>
          <el-tag
            type="info"
            effect="dark"
            v-if="scope.row.type==4"
          >永久禁权</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="确认重置该教师的密码吗？"
            @confirm="resetPassword(scope.row.id)"
            style="margin-right: 5px;"
          >
            <el-button slot="reference"><i class="el-icon-refresh"></i><span>重置密码</span></el-button>
          </el-popconfirm>
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="确认回收该教师的权限吗？"
            @confirm="revoke(scope.row.id)"
            style="margin-right: 5px;"
            v-if="hasPlusAuthenication()"
          >
            <el-button slot="reference"><i class="el-icon-coffee"></i><span>回收权限</span></el-button>
          </el-popconfirm>
          <el-button
            type="danger"
            style="margin-right: 5px;"
            v-if="hasPlusAuthenication()||hasAuthenication()&&scope.row.type===1||scope.row.type !== 1&&scope.row.type !== 2"
            @click="openIdentityDialog(scope.row.id)"
          ><i class="el-icon-remove-outline"></i><span>删除</span></el-button>
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="确认给该教师恢复权限吗？"
            @confirm="grant(scope.row.id)"
            style="margin-right: 5px;"
            v-if="(scope.row.type === 3||scope.row.type === 4)&&hasPlusAuthenication()"
          >
            <el-button
              type="success"
              slot="reference"
            ><i class="el-icon-remove-outline"></i><span>解除禁权</span></el-button>
          </el-popconfirm>
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="确认禁权该教师一天吗？"
            @confirm="banTemporarily(scope.row.id)"
            v-if="scope.row.type !== 3 && scope.row.type !== 4&&hasPlusAuthenication()"
            style="margin-right: 5px;"
          >
            <el-button
              type="warning"
              slot="reference"
            ><i class="el-icon-lock"></i><span>禁权一天</span></el-button>
          </el-popconfirm>
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="确认给该教师永久禁权吗？"
            @confirm="ban(scope.row.id)"
            style="margin-right: 5px;"
            v-if="scope.row.type !== 4 && hasPlusAuthenication()"
          >
            <el-button
              type="info"
              slot="reference"
            ><i class="el-icon-switch-button"></i><span>永久禁权</span></el-button>
          </el-popconfirm>
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="确认暂时提权该教师吗？"
            @confirm="privilegeEscalation(scope.row.id)"
            v-if="scope.row.type === 1&&hasPlusAuthenication()"
            style="margin-right: 5px;"
          >
            <el-button
              type="danger"
              slot="reference"
            ><i class="el-icon-time"></i><span>暂时提权</span></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 8, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="身份验证"
      :visible.sync="identityVisible"
      width="440px"
      center
      @close="resetIdentityFormValidate();"
    >
      <el-form
        :model="identityForm"
        ref="identityForm"
        :rules="identityrules"
        label-width="80px"
        style="margin-left: 35px;"
        size="small"
      >
        <el-form-item
          label="密码"
          prop="password"
          style="margin-left: -0.5px;"
        >
          <el-input
            type="password"
            v-model="identityForm.password"
            autocomplete="off"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="password2"
        >
          <el-input
            type="password"
            v-model="identityForm.password2"
            autocomplete="off"
            style="width: 200px;"
          ></el-input>

        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        style="margin-left: -10px;"
      >
        <el-button
          @click="identityVisible = false;"
          style="margin-right: 10px;"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitIdentityForm()"
        >提交 </el-button>
      </span>
    </el-dialog>
  </div>
</template>
    
<script>
import {
  getDepartmentList,
  getGrantedTeachers,
  getPermission,
  deleteTeacherList,
  resetTeacherPassword,
  revokeTeacher,
  grantTeacher,
  banTeacherADay,
  banTeacher,
  privilegeEscalation2
} from "@/utils/api";
export default {
  name: "grantedTeachers",
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        let passPattern = new RegExp("[a-zA-Z0-9!_$]{6,18}");
        setTimeout(() => {
          if (!passPattern.test(value)) {
            callback(new Error("格式错误，请重新输入"));
          } else {
            if (this.identityForm.password2 !== "") {
              this.$refs.identityForm.validateField("password2");
            }
            callback();
          }
        }, 500);
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.identityForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      admin_type: "",
      tableData: [],
      total: 0,
      pageSize: 5,
      pageNum: 1,
      departmentList: [],
      queryParams: {
        id: null,
        name: "",
        department: "",
        type: "",
      },
      headers: { token: this.$store.getters.getToken },
      centerDialogVisible: false,
      identityVisible: false,
      batchDeleteVisible: false,
      exportVisible: false,
      identityForm: {
        id: [],
        password: "",
        password2: "",
      },
      identityrules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        password2: [{ validator: validatePass2, trigger: "blur" }],
      },
      selectedTeacherList: [],
    };
  },
  methods: {
    resetParams() {
      this.queryParams = {};
    },
    submitIdentityForm() {},
    resetIdentityFormValidate() {
      this.$refs.identityForm.clearValidate();
      this.identityForm = {};
    },
    openIdentityDialog(id) {
      if (!id && this.selectedTeacherList.length === 0) {
        this.$message.error("请选择删除的数据！");
        return;
      }
      this.identityVisible = true;
      if (id && id !== "") this.identityForm = { id: [id] };
      else {
        this.identityForm.id = this.selectedTeacherList.map((v) => v.id);
      }
    },
    async getDpartments() {
      const res = await getDepartmentList();
      this.departmentList = res.data;
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getTeachers(this.queryParams, this.pageSize, this.pageNum);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getTeachers(this.queryParams, this.pageSize, this.pageNum);
    },
    async getTeachers(queryParams, pageSize, pageNum) {
      const res = await getGrantedTeachers(queryParams, pageSize, pageNum);
      if (res.code === 200) {
        this.total = res.data.total;
        this.tableData = res.data.list;
      } else {
        this.$message.error(res.msg);
      }
      return res;
    },
    async getType() {
      const res = await getPermission();
      this.admin_type = res.data;
    },
    hasPlusAuthenication() {
      if ("adminPlus" === this.admin_type) return true;
      return false;
    },
    hasAuthenication() {
      const plus = this.hasPlusAuthenication();
      if (plus) return plus;
      if ("admin+" === this.admin_type) return true;
      return false;
    },
    checkSelect(row, index) {
      let isChecked = true;
      if (!this.hasPlusAuthenication() && row.type === 2) {
        isChecked = false;
      }
      if (!this.hasAuthenication() && row.type === 1) {
        isChecked = false;
      }
      return isChecked;
    },
    async searchTeachers() {
      this.pageNum = 1;
      const res = await this.getTeachers(
        this.queryParams,
        this.pageSize,
        this.pageNum
      );
      if (res.code === 200) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    handleSelectionChange(val) {
      this.selectedTeacherList = val;
    },
    openBatchDeleteMode() {
      this.batchDeleteVisible = true;
    },
    exitBatchDeleteMode() {
      this.batchDeleteVisible = false;
      this.toggleSelection();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.tableData.toggleRowSelection(row);
        });
      } else {
        this.$refs.tableData.clearSelection();
      }
    },
    submitIdentityForm() {
      this.$refs["identityForm"].validate((valid) => {
        if (valid) {
          this.identityVisible = false;
          this.deleteTeachers();
        } else {
          this.$message.error("请填写信息后提交");
          return false;
        }
      });
    },
    async deleteTeachers() {
      const res = await deleteTeacherList(this.identityForm);
      if (res.code === 200) {
        this.selectedTeacherList = [];
        this.getTeachers(this.queryParams, this.pageSize, this.pageNum);
        this.batchDeleteVisible = false;
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    async resetPassword(id) {
      const res = await resetTeacherPassword(id);
      if (res.code === 200) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    async revoke(id) {
      const res = await revokeTeacher(id);
      if (res.code === 200) {
        this.getTeachers(this.queryParams, this.pageSize, this.pageNum);
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    async grant(id) {
      const res = await grantTeacher(id);
      if (res.code === 200) {
        this.getTeachers(this.queryParams, this.pageSize, this.pageNum);
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    async banTemporarily(id) {
      const res = await banTeacherADay(id);
      if (res.code === 200) {
        this.getTeachers(this.queryParams, this.pageSize, this.pageNum);
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    async ban(id) {
      const res = await banTeacher(id);
      if (res.code === 200) {
        this.getTeachers(this.queryParams, this.pageSize, this.pageNum);
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    async privilegeEscalation(id) {
      const res = await privilegeEscalation2(id);
      if (res.code === 200) {
        this.getTeachers(this.queryParams, this.pageSize, this.pageNum);
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  created() {
    this.getTeachers(this.queryParams, this.pageSize, this.pageNum);
    this.getDpartments();
    this.getType();
  },
};
</script>
    