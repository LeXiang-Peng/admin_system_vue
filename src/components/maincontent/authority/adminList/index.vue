<template>
  <div>
    <div style="margin: 10px 0;margin-top:-5px;">
      <el-input
        v-model.number="queryParams.id"
        style="width: 200px;"
        suffix-icon="el-icon-search"
        placeholder="请输入管理员ID"
        oninput="value=value.replace(/[^\d]/g,'')"
      ></el-input>
      <el-input
        v-model="queryParams.name"
        style="width: 200px; margin-left: 5px;"
        suffix-icon="el-icon-user"
        placeholder="请输入名字"
      ></el-input>
      <el-button
        style="margin-left: 5px;"
        type="primary"
        @click="searchAdmins"
      >搜索</el-button>
      <el-button
        style="margin-left: 5px;"
        type="warning"
        @click="resetParams"
      >重置</el-button>
    </div>
    <div style="margin: 10px 0;padding-bottom:5px;">
      <el-button
        type="primary"
        @click="openNewAdminDilog()"
      >
        <i class="el-icon-circle-plus-outline"></i>
        <span>新增</span>
      </el-button>
      <el-button
        type="danger"
        @click="openBatchDeleteMode()"
      >
        <i class="el-icon-remove-outline"></i>
        <span>批量删除</span>
      </el-button>
      <div
        v-if="batchDeleteVisible"
        style="display: inline;margin-left: 580px;"
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
      >
      </el-table-column>
      <el-table-column
        prop="id"
        label="管理员ID"
        width="150px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="220px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        width="120px"
        align="center"
      >
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
            title="确认重置该学生的密码吗？"
            @confirm="resetPassword(scope.row.id)"
            style="margin-right: 5px;"
          >
            <el-button
              type="warning"
              slot="reference"
            ><i class="el-icon-refresh"></i><span>重置密码</span></el-button>
          </el-popconfirm>
          <el-button
            type="danger"
            @click="openIdentityDialog(scope.row.id)"
          ><i class="el-icon-remove-outline"></i><span>删除</span></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[2, 5, 8]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <el-dialog
        title="管理员信息"
        :visible.sync="centerDialogVisible"
        width="440px"
        center
        @close="resetPostFormValidate()"
      >
        <el-form
          :model="postForm"
          ref="postForm"
          :rules="rules"
          label-width="95px"
          style="margin-left: 35px;"
          size="small"
        >
          <el-form-item
            label="管理员姓名"
            prop="name"
            class="is-required"
          >
            <el-input
              v-model="postForm.name"
              autocomplete="off"
              style="width: 200px;"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="性别"
            style="margin-left: -3.5px;"
            class="is-required"
          >
            <el-select
              v-model="postForm.gender"
              style="width: 200px; margin-left: 5px;"
              placeholder="请选择性别"
            >
              <el-option
                value="男"
                label="男"
                key="男"
              ></el-option>
              <el-option
                value="女"
                label="女"
                key="女"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
          style="margin-left: -10px;"
        >
          <el-button
            @click="centerDialogVisible = false;"
            style="margin-right: 10px;"
          >取 消</el-button>
          <el-button
            type="primary"
            @click="commitPostForm()"
          >提交 </el-button>
        </span>
      </el-dialog>
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
  </div>
</template>
  
<script>
import {
  getAdminList,
  newOneAdmin,
  deleteAdminList,
  resetAdminPassword,
} from "@/utils/api";
export default {
  name: "adminList",
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
    var validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入管理员名字"));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 5,
      total: 0,
      queryParams: {
        id: null,
        name: "",
      },
      departmentList: [],
      selectedAdminList: [],
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
      },
      postForm: {
        name: "",
        gender: "男",
      },
      headers: { token: this.$store.getters.getToken },
      centerDialogVisible: false,
      identityVisible: false,
      batchDeleteVisible: false,
      identityForm: {
        id: [],
        password: "",
        password2: "",
      },
      identityrules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        password2: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getAdmins(this.queryParams, this.pageSize, this.pageNum);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getAdmins(this.queryParams, this.pageSize, this.pageNum);
    },
    async getAdmins(queryParams, pageSize, pageNum) {
      const res = await getAdminList(queryParams, pageSize, pageNum);
      if (res.code === 200) {
        this.total = res.data.total;
        this.tableData = res.data.list;
      }else{
        this.$message.error(res.msg);
      }
      return res;
    },
    resetParams() {
      this.queryParams = {};
    },
    handleSelectionChange(val) {
      this.selectedAdminList = val;
    },
    async searchAdmins() {
      this.pageNum = 1;
      const res = await this.getAdmins(
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
    openNewAdminDilog() {
      this.centerDialogVisible = true;
    },
    resetPostFormValidate() {
      this.$refs.postForm.clearValidate();
      this.postForm = { gender: "男" };
    },
    commitPostForm() {
      this.$refs["postForm"].validate((valid) => {
        if (valid) {
          this.newAdmin();
        } else {
          this.$message.error("请填写信息后提交");
          return false;
        }
      });
    },
    async newAdmin() {
      const res = await newOneAdmin(this.postForm);
      this.centerDialogVisible = false;
      if (res.code === 200) {
        this.pageNum = 1;
        this.getAdmins(this.queryParams, this.pageSize, this.pageNum);
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    resetIdentityFormValidate() {
      this.$refs.identityForm.clearValidate();
      this.identityForm = {};
    },
    openIdentityDialog(id) {
      if (!id && this.selectedAdminList.length === 0) {
        this.$message.error("请选择删除的数据！");
        return;
      }
      this.identityVisible = true;
      if (id && id !== "") this.identityForm = { id: [id] };
      else {
        this.identityForm.id = this.selectedAdminList.map((v) => v.id);
      }
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
    async deleteAdmins() {
      const res = await deleteAdminList(this.identityForm);
      if (res.code === 200) {
        this.selectedAdminList = [];
        this.getAdmins(this.queryParams, this.pageSize, this.pageNum);
        this.identityVisible = false;
        this.batchDeleteVisible = false;
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    submitIdentityForm() {
      this.$refs["identityForm"].validate((valid) => {
        if (valid) {
          this.deleteAdmins();
        } else {
          this.$message.error("请填写信息后提交");
          return false;
        }
      });
    },
    openBatchDeleteMode() {
      this.batchDeleteVisible = true;
    },
    async resetPassword(id) {
      const res = await resetAdminPassword(id);
      if (res.code === 200) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  created() {
    this.getAdmins(this.queryParams, this.pageSize, this.pageNum);
  },
};
</script>
  