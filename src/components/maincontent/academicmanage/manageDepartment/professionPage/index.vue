<template>
  <div class="HomeContent">
    <div style="margin: 10px 5px;">
      <el-input
        v-model.number="queryParams.id"
        style="width: 200px;"
        suffix-icon="el-icon-search"
        placeholder="请输入专业编号"
        oninput="value=value.replace(/[^\d]/g,'')"
      ></el-input>
      <el-input
        v-model="queryParams.profession"
        style="width: 200px; margin-left: 5px;"
        suffix-icon="el-icon-mouse"
        placeholder="请输入专业名字"
      ></el-input>
      <el-button
        style="margin-left: 5px;"
        type="primary"
        @click="search"
      >搜索</el-button>
      <el-button
        style="margin-left: 5px;"
        type="warning"
        @click="resetParams"
      >重置</el-button>
    </div>
    <div style="margin: 10px 5px;">
      <el-button
        type="primary"
        @click="newProfessionDilogVisible = true"
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
        :on-success="importProfessions"
        style="display: inline-block; margin-left: 5px;margin-right: 5px;"
        action="http://47.96.157.155:9090/admin/profession/import"
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
        @click="exportVisible =true"
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
      @selection-change="handleSelectionProfessionChange"
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
        label="专业编号"
        width="100px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="profession"
        label="专业"
        width="250px"
        align="center"
      >
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.id === editId"
            v-model="editForm.profession"
          ></el-input>
          <span v-else>{{scope.row.profession}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="clazz"
        label="班级"
        width="250px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            slot="reference"
            style="cursor: pointer;"
            @click="getClazzList(scope.row.profession)"
          >查看详情</el-button>
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
            title="确认编辑该学生信息吗？"
            @confirm="edit(scope.row)"
            style="margin-right: 5px;"
            v-if="!is_editable||is_editable&&scope.row.id!==editId"
          >
            <el-button
              type="success"
              slot="reference"
            ><i class="el-icon-refresh"></i><span>编辑</span></el-button>
          </el-popconfirm>
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="确认保存此次编辑吗？"
            @confirm="saveInfo"
            style="margin-right: 5px;"
            v-if="is_editable&&scope.row.id===editId"
          >
            <el-button
              type="success"
              slot="reference"
            ><i class="el-icon-refresh"></i><span>保存</span></el-button>
          </el-popconfirm>
          <el-button
            type="info"
            slot="reference"
            @click="cancel()"
            v-if="is_editable&&scope.row.id===editId"
          ><i class="el-icon-refresh"></i><span>取消</span></el-button>
          <el-button
            type="danger"
            @click="openIdentityDialog(scope.row.id)"
            v-if="!is_editable||is_editable&&scope.row.id!==editId"
          ><i class="el-icon-remove-outline"></i><span>删除</span></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 8, 10]"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <el-dialog
      :append-to-body="true"
      title="身份验证"
      :visible.sync="identityDialogVisable"
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
          @click="identityDialogVisable = false;"
          style="margin-right: 10px;"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitIdentityForm"
        >提交 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      title="新增专业"
      :visible.sync="newProfessionDilogVisible"
      width="440px"
      center
      @close="resetnewProfessionFormValidate"
    >
      <el-form
        :model="newProfessionForm"
        ref="newProfessionForm"
        :rules="newProfessionRules"
        label-width="80px"
        style="margin-left: 35px;"
        size="small"
      >
        <el-form-item
          label="院系"
          prop="department"
          style="margin-left: -0.5px;"
        >
          <el-select
            v-model="newProfessionForm.department"
            style="width: 200px;"
            placeholder="请选择院系"
          >
            <el-option
              v-for="item in departmentList"
              :value="item"
              :key="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="专业"
          prop="profession"
          style="margin-left: -0.5px;"
        >
          <el-input
            v-model="newProfessionForm.profession"
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
          @click="newProfessionDilogVisible = false;"
          style="margin-right: 10px;"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitProfessionForm"
        >提交 </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      :visible.sync="exportVisible"
      title="选择导出内容"
      width="250px"
      center
    >
      <el-button
        type="primary"
        style="margin-left: 12px;"
        @click="exportProfession"
      >导出数据</el-button>
      <el-button
        type="primary"
        @click="exportSampleProfession"
      >导出格式</el-button>
    </el-dialog>
    <el-drawer
      :append-to-body="true"
      title="班级信息"
      :visible.sync="drawer"
      size="86%"
    >
      <clazzDrawer
        :department="''"
        :profession="profession"
        :pNum="1"
        :pSize="5"
      ></clazzDrawer>
    </el-drawer>
  </div>
</template>
  
  <script>
let set = new Set();
import {
  getProfession,
  newProfession,
  deleteProfession,
  editProfession,
  getAllDepartments,
  exportSampleProfession,
  exportProfession,
} from "@/utils/api";
import clazzDrawer from "../clazzDrawer";
export default {
  name: "professionPage",
  components: {
    clazzDrawer,
  },
  data() {
    var validateProfession = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入专业名称"));
      } else {
        callback();
      }
    };
    var validateDepartment = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择院系名称"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        callback();
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
      headers: { token: this.$store.getters.getToken },
      exportVisible: false,
      queryParams: {
        id: "",
        profession: "",
        department: "",
      },
      tableData: [],
      pageNum: 1,
      pageSize: 5,
      batchDeleteVisible: false,
      selectedProfeesion: [],
      drawer: false,
      profession: "",
      newProfessionDilogVisible: false,
      newProfessionForm: {
        profession: "",
        department: "",
      },
      newProfessionRules: {
        profession: [{ validator: validateProfession, trigger: "blur" }],
        department: [{ validator: validateDepartment, trigger: "change" }],
      },
      editId: "",
      is_editable: false,
      editForm: {
        id: "",
        profession: "",
      },
      identityForm: {
        id: [],
        password: "",
        password2: "",
      },
      identityDialogVisable: false,
      identityrules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        password2: [{ validator: validatePass2, trigger: "blur" }],
      },
      departmentList: [],
    };
  },
  methods: {
    async exportProfession() {
      exportProfession();
      this.exportVisible = false;
    },
    async exportSampleProfession() {
      exportSampleProfession();
      this.exportVisible = false;
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getProfession();
    },
    edit(row) {
      this.editForm = { ...row };
      this.editId = row.id;
      this.is_editable = true;
      set.add(row.profession);
    },
    cancel() {
      this.is_editable = false;
      this.editForm = {};
      set.clear();
      this.editId = "";
    },
    saveInfo() {
      set.add(this.editForm.profession);
      if (set.size === 1) {
        this.$message.error("专业信息重复，请重新输入");
        return;
      }
      this.editProfession(this.editForm);
    },
    async editProfession() {
      const res = await editProfession(this.editForm);
      if (res.code === 200) {
        this.getProfession();
        this.cancel();
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    resetIdentityFormValidate() {
      this.identityForm = {};
      this.$refs.identityForm.clearValidate();
    },
    openIdentityDialog(id) {
      if (id) {
        this.identityForm.id = [id];
      } else {
        if (this.selectedProfeesion.length <= 0) {
          this.$message.error("请选择删除信息");
          return;
        }
        this.identityForm.id = this.selectedProfeesion.map((v) => v.id);
      }
      this.identityDialogVisable = true;
    },
    submitIdentityForm() {
      this.$refs["identityForm"].validate((valid) => {
        if (valid) {
          this.deleteProfession();
        } else {
          this.$message.error("请填写信息后提交");
          return false;
        }
      });
    },
    async deleteProfession() {
      const res = await deleteProfession(this.identityForm);
      if (res.code === 200) {
        this.getProfession();
        this.identityDialogVisable = false;
        this.batchDeleteVisible = false;
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    handleSelectionProfessionChange(val) {
      this.selectedProfeesion = val;
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
    exitBatchDeleteMode() {
      this.batchDeleteVisible = false;
      this.toggleSelection();
      this.selectedProfeesion = [];
    },
    submitProfessionForm() {
      this.$refs["newProfessionForm"].validate((valid) => {
        if (valid) {
          this.newProfession();
          this.newProfessionDilogVisible = false;
        } else {
          this.$message.error("请填写信息后提交");
          return false;
        }
      });
    },
    resetnewProfessionFormValidate() {
      this.newProfessionForm = {};
      this.$refs.newProfessionForm.clearValidate();
    },
    openBatchDeleteMode() {
      this.batchDeleteVisible = true;
    },
    getClazzList(profession) {
      this.profession = profession;
      this.drawer = true;
    },
    resetParams() {
      this.queryParams.id = "";
      this.queryParams.profession = "";
    },
    handleSelectionChange(val) {
      this.selectedProfeesions = val;
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getProfession();
    },
    async getProfession() {
      const res = await getProfession(
        this.queryParams,
        this.pageSize,
        this.pageNum
      );
      if (res.code === 200) {
        this.tableData = res.data;
      } else {
        this.$message.error(res.msg);
      }
      return res;
    },
    async search() {
      this.pageNum = 1;
      const res = await this.getProfession();
      if (res.code === 200) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    async newProfession() {
      const res = await newProfession(this.newProfessionForm);
      if (res.code === 200) {
        this.pageNum = 1;
        this.getProfession();
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    async getAllDepartments() {
      const res = await getAllDepartments();
      if (res.code === 200) {
        this.departmentList = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },
    importProfessions(response, file, fileList) {
      if (response.code === 200) {
        this.pageNum = 1;
        this.resetParams();
        this.getProfession();
        this.$message.success(response.msg);
      } else {
        this.$message.error(response.msg);
      }
      this.$refs.upload.clearFiles();
    },
  },
  created() {
    this.getProfession();
    this.getAllDepartments();
  },
};
</script>
  