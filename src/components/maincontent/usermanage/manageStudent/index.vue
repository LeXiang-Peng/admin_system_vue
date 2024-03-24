<template>
  <div class="HomeContent">
    <div style="margin: 10px 0;margin-top:-5px;">
      <el-input
        v-model.number="queryParams.id"
        style="width: 200px;"
        suffix-icon="el-icon-search"
        placeholder="请输入学号"
        oninput ="value=value.replace(/[^\d]/g,'')"
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
        @change="departmentChange(queryParams.department, queryParams.profession, queryParams.clazz)"
      >
        <el-option
          v-for="(dep) in departmentList"
          :value="dep.department"
          :label="dep.department"
          :key="dep.department"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="queryParams.profession"
        clearable
        style="width: 200px; margin-left: 5px;"
        placeholder="请选择专业"
        @change="professionChange(queryParams.profession, queryParams.department, queryParams.clazz)"
      >
        <el-option
          v-for="pro in professionList"
          :value="pro.profession"
          :label="pro.profession"
          :key="pro.profession"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="queryParams.clazz"
        clearable
        style="width: 200px; margin-left: 5px;"
        placeholder="请选择班级"
        @change="clazzChange(queryParams.clazz, queryParams.department, queryParams.profession)"
      >
        <el-option
          v-for="cla in clazzList"
          :value="cla.clazz"
          :label="cla.clazz"
          :key="cla.clazz"
        >
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 5px;"
        type="primary"
        @click="searchStudents();"
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
        @click="openNewStudentDialog"
      >
        <i class="el-icon-circle-plus-outline"></i>
        <span>新增</span>
      </el-button>
      <el-button
        type="danger"
        @click="openBatchDeleteMode"
      >
        <i class="el-icon-remove-outline"></i>
        <span>批量删除</span>
      </el-button>
      <el-upload
        ref="upload"
        :on-success="importStudents"
        style="display: inline-block; margin-left: 5px;margin-right: 5px;"
        action="http://localhost:9090/admin/student/import"
        :headers="headers"
        :show-file-list="false"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
      >
        <el-button type="primary">
          <i class="el-icon-bottom"></i>
          <span>导入</span>
        </el-button>
      </el-upload>
      <el-button
        type="primary"
        @click="openExportDialog"
      >
        <i class="el-icon-top"></i>
        <span>导出</span>
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
        label="学号"
        width="110px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="100px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="clazz"
        label="班级"
        width="180px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="profession"
        label="专业"
        width="160px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="department"
        label="院系"
        width="160px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        width="80px"
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
        :page-sizes="[5, 8, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="学生信息"
      :visible.sync="centerDialogVisible"
      width="440px"
      center
      @close="resetList();resetPostFormValidate();"
    >
      <el-form
        :model="postForm"
        ref="postForm"
        :rules="rules"
        label-width="80px"
        style="margin-left: 35px;"
        size="small"
      >
        <el-form-item
          label="学生姓名"
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
          label="院系"
          style="margin-left: -3.5px;"
        >
          <el-select
            v-model="postForm.department"
            clearable
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择院系"
            @change="departmentChange(postForm.department, postForm.profession, postForm.clazz)"
          >
            <el-option
              v-for="(dep) in departmentList"
              :value="dep.department"
              :label="dep.department"
              :key="dep.department"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="专业"
          style="margin-left: -3.5px;"
        >
          <el-select
            v-model="postForm.profession"
            clearable
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择专业"
            @change="professionChange(postForm.profession, postForm.department, postForm.clazz)"
          >
            <el-option
              v-for="pro in professionList"
              :value="pro.profession"
              :label="pro.profession"
              :key="pro.profession"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="班级"
          style="margin-left: -3.5px;"
          prop="clazz"
          class="is-required"
        >
          <el-select
            clearable
            v-model="postForm.clazz"
            style="width: 200px; margin-left: 5px;"
            placeholder="请选择班级"
            @change="clazzChange(postForm.clazz, postForm.department, postForm.profession)"
          >
            <el-option
              v-for="cla in clazzList"
              :value="cla.clazz"
              :label="cla.clazz"
              :key="cla.clazz"
            >
            </el-option>
          </el-select>
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
          @click="submitPostForm"
        >提交 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="身份验证"
      :visible.sync="identityVisible"
      width="440px"
      center
      @close="resetIdentityFormValidate();resetIdentityForm();"
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
          @click="submitIdentityForm"
        >提交 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="exportVisible"
      title="选择导出内容"
      width="250px"
      center
    >
      <el-button
        type="primary"
        style="margin-left: 12px;"
        @click="exportStudents"
      >导出数据</el-button>
      <el-button
        type="primary"
        @click="exportEmptyStudents"
      >导出格式</el-button>
    </el-dialog>
  </div>
</template>


<script>
import {
  getStudentList,
  getOptionList,
  newOneStudent,
  resetStudentPassword,
  deleteStudents,
  exportStudentList,
  exportStudentEmptyList,
} from "@/utils/api";
export default {
  name: "manage",
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
        callback(new Error("请输入学生名字"));
      } else {
        callback();
      }
    };
    var validateClazz = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择班级"));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
      queryParams: {
        id: null,
        name: "",
        clazz: "",
        profession: "",
        department: "",
      },
      options: [],
      departmentList: [],
      professionList: [],
      clazzList: [],
      initialData: {
        clazzs: [],
        professions: [],
      },
      centerDialogVisible: false,
      identityVisible: false,
      batchDeleteVisible: false,
      identityForm: {
        id: [],
        password: "",
        password2: "",
      },
      postForm: {
        name: "",
        department: "",
        profession: "",
        clazz: "",
        gender: "男",
      },
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        clazz: [{ validator: validateClazz, trigger: "change" }],
      },
      identityrules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        password2: [{ validator: validatePass2, trigger: "blur" }],
      },
      selectedStudentList: [],
      headers: { token: this.$store.getters.getToken },
      exportVisible: false,
    };
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getStudents(this.queryParams, this.pageSize, this.pageNum);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getStudents(this.queryParams, this.pageSize, this.pageNum);
    },
    async getStudents(queryParams, pageSize, pageNum) {
      const res = await getStudentList(queryParams, pageSize, pageNum);
      if (res.code === 200) {
        this.total = res.data.total;
        this.tableData = res.data.list;
      }else{
        this.$message.error(res.msg);
      }
      return res;
    },
    async searchStudents() {
      this.pageNum = 1;
      const res = await this.getStudents(
        this.queryParams,
        this.pageSize,
        this.pageNum
      );
      if (res.code === 200) {
        this.$message.success(res.msg);
      }else{
        this.$message.error(res.msg);
      }
    },
    async getOptions() {
      const res = await getOptionList();
      this.options = res.data;
      this.initParams();
    },
    departmentChange(value, profession, clazz) {
      if (!value && !profession && !clazz) {
        this.resetList();
        return;
      }
      this.clazzList = [];
      this.professionList = [];
      if (!profession && !clazz) this.departmentList = this.options;
      else this.departmentList = [];
      for (let i = 0; i < this.options.length; i++) {
        let d_list = this.options[i];
        for (let j = 0; j < d_list.professionList.length; j++) {
          let p_list = d_list.professionList[j];
          if (value && !clazz) {
            if (value === d_list.department) this.professionList.push(p_list);
          } else if (!value && !clazz) {
            this.professionList = this.initialData.professions;
          }
          if (profession && !clazz && p_list.profession === profession) {
            this.departmentList.push(d_list);
          }
          for (let k = 0; k < p_list.clazzList.length; k++) {
            let c_list = p_list.clazzList[k];
            if (profession) {
              if (p_list.profession === profession) this.clazzList.push(c_list);
            } else if (value) {
              if (value === d_list.department) this.clazzList.push(c_list);
            } else {
              this.clazzList = this.initialData.clazzs;
            }
            if (clazz && c_list.clazz === clazz) {
              this.departmentList.push(d_list);
              this.professionList.push(p_list);
            }
          }
        }
      }
    },
    professionChange(value, department, clazz) {
      if (!value && !department && !clazz) {
        this.resetList();
        return;
      }
      this.departmentList = [];
      this.clazzList = [];
      if (!department && !clazz)
        this.professionList = this.initialData.professions;
      else this.professionList = [];
      for (let i = 0; i < this.options.length; i++) {
        let d_list = this.options[i];
        for (let j = 0; j < d_list.professionList.length; j++) {
          let p_list = d_list.professionList[j];
          if (!clazz && value) {
            if (value === p_list.profession) this.departmentList.push(d_list);
          } else if (!clazz && !value) {
            this.departmentList = this.options;
          }
          if (!clazz && department && department === d_list.department) {
            this.professionList.push(p_list);
          }
          for (let k = 0; k < p_list.clazzList.length; k++) {
            let c_list = p_list.clazzList[k];
            if (value) {
              if (value === p_list.profession) this.clazzList.push(c_list);
            } else if (department) {
              if (department === d_list.department) this.clazzList.push(c_list);
            } else {
              this.clazzList = this.initialData.clazzs;
            }
            if (clazz && clazz === c_list.clazz) {
              this.departmentList.push(d_list);
              this.professionList.push(p_list);
            }
          }
        }
      }
    },
    clazzChange(value, department, profession) {
      if (!value && !department && !profession) {
        this.resetList();
        return;
      }
      this.professionList = [];
      this.departmentList = [];
      if (!department && !profession) this.clazzList = this.initialData.clazzs;
      else this.clazzList = [];
      for (let i = 0; i < this.options.length; i++) {
        let d_list = this.options[i];
        for (let j = 0; j < d_list.professionList.length; j++) {
          let p_list = d_list.professionList[j];
          if (!value && profession) {
            if (profession === p_list.profession)
              this.departmentList.push(d_list);
          } else if (!value && !profession) this.departmentList = this.options;
          if (!value && department) {
            if (department === d_list.department)
              this.professionList.push(p_list);
          } else if (!value && !department)
            this.professionList = this.initialData.professions;
          for (let k = 0; k < p_list.clazzList.length; k++) {
            let c_list = p_list.clazzList[k];
            if (profession) {
              if (profession === p_list.profession) this.clazzList.push(c_list);
            } else if (department) {
              if (department === d_list.department) this.clazzList.push(c_list);
            } else {
              this.clazzList = this.initialData.clazzs;
            }
            if (value && value === c_list.clazz) {
              this.professionList.push(p_list);
              this.departmentList.push(d_list);
            }
          }
        }
      }
    },
    initParams() {
      this.departmentList = this.options;
      for (let i = 0; i < this.options.length; i++) {
        const p_list = this.options[i].professionList;
        for (let j = 0; j < p_list.length; j++) {
          this.initialData.professions.push(p_list[j]);
          const c_list = p_list[j].clazzList;
          for (let k = 0; k < c_list.length; k++) {
            this.initialData.clazzs.push(c_list[k]);
          }
        }
      }
    },
    async resetPassword(id) {
      const res = await resetStudentPassword(id);
      if (res.code === 200) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    resetParams() {
      this.queryParams = {};
      this.resetList();
    },
    openNewStudentDialog() {
      this.resetParams();
      this.centerDialogVisible = true;
      this.postForm = { gender: "男" };
    },
    resetList() {
      this.departmentList = this.options;
      this.professionList = this.initialData.professions;
      this.clazzList = this.initialData.clazzs;
    },
    async newOneStudent() {
      const res = await newOneStudent(this.postForm);
      this.centerDialogVisible = false;
      if (res.code === 200) {
        this.pageNum = 1;
        this.resetParams();
        this.getStudents(null, this.pageSize, this.pageNum);
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    submitPostForm() {
      this.$refs["postForm"].validate((valid) => {
        if (valid) {
          this.newOneStudent();
        } else {
          this.$message.error("请填写信息后提交");
          return false;
        }
      });
    },
    resetIdentityForm() {
      this.identityForm = {};
    },
    openIdentityDialog(id) {
      if (!id && this.selectedStudentList.length === 0) {
        this.$message.error("请选择删除的数据！");
        return;
      }
      this.identityVisible = true;
      if (id && id !== "") this.identityForm = { id: [id] };
      else {
        this.identityForm.id = this.selectedStudentList.map((v) => v.id);
      }
    },
    submitIdentityForm() {
      this.$refs["identityForm"].validate((valid) => {
        if (valid) {
          this.deleteStudents(this.identityForm);
        } else {
          this.$message.error("请填写信息后提交");
          return false;
        }
      });
    },
    async deleteStudents(identityForm) {
      const res = await deleteStudents(identityForm);
      if (res.code === 200) {
        this.selectedStudentList = [];
        this.getStudents(this.queryParams, this.pageSize, this.pageNum);
        this.identityVisible = false;
        this.batchDeleteVisible = false;
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
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
    handleSelectionChange(val) {
      this.selectedStudentList = val;
    },
    exportStudents() {
      exportStudentList();
      this.exportVisible = false;
    },
    exportEmptyStudents() {
      exportStudentEmptyList();
      this.exportVisible = false;
    },
    openExportDialog() {
      this.exportVisible = true;
    },
    importStudents(response, file, fileList) {
      if (response.code === 200) {
        this.pageNum = 1;
        this.resetParams();
        this.getStudents(null, this.pageSize, this.pageNum);
        this.$message.success(response.msg);
      } else {
        this.$message.error(response.msg);
      }
      this.$refs.upload.clearFiles();
    },
    resetPostFormValidate() {
      this.$refs.postForm.clearValidate();
    },
    resetIdentityFormValidate() {
      this.$refs.identityForm.clearValidate();
    },
  },
  created() {
    this.getOptions();
    this.getStudents(this.queryParams, this.pageSize, this.pageNum);
    this.professionList = this.initialData.professions;
    this.clazzList = this.initialData.clazzs;
  },
};
</script>