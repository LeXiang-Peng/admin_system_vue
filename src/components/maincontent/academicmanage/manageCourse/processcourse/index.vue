<template>
  <div style="filter:(2px);">
    <div style="margin: 10px 0;margin-top:10px;">
      <el-input
        v-model="queryParams.course"
        style="width: 200px; margin-left: 5px;"
        suffix-icon="el-icon-search"
        placeholder="请输入申报课程"
      ></el-input>
      <el-select
        v-model="queryParams.type"
        clearable
        style="width: 200px; margin-left: 5px;"
        placeholder="请选择课程类型"
      >
        <el-option
          :value="0"
          label="必修"
          :key="0"
        >
        </el-option>
        <el-option
          :value="1"
          label="选修"
          :key="1"
        >
        </el-option>
      </el-select>
      <el-input
        v-model="queryParams.lecturer_id"
        style="width: 200px; margin-left: 5px;"
        suffix-icon="el-icon-c-scale-to-original"
        placeholder="请输入授课教师编号"
        oninput="value=value.replace(/[^\d]/g,'')"
      ></el-input>
      <el-input
        v-model="queryParams.lecturer"
        style="width: 200px; margin-left: 5px;"
        suffix-icon="el-icon-user"
        placeholder="请输入授课教师"
      ></el-input>
      <el-select
        v-model="queryParams.category"
        clearable
        style="width: 200px; margin-left: 5px;"
        placeholder="请选择课程门类"
      >
        <el-option
          v-for="category in categoryList"
          :value="category"
          :key="category"
          :label="category"
        >
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 5px;"
        type="primary"
        @click="searchPendingCourses()"
      >搜索</el-button>
      <el-button
        style="margin-left: 5px;"
        type="warning"
        @click="resetParams()"
      >重置</el-button>
    </div>
    <el-table
      size="small"
      :data="tableData"
      ref="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="border-radius: 8px; box-shadow: 5px 5px 50px 50px rgba(179, 184, 182, 0.267);margin-top: 20px;"
    >
      <el-table-column
        prop="id"
        label="申报编号"
        width="80px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="course"
        label="课程"
        width="120px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="category"
        label="课程门类"
        width="120px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="type"
        label="课程类型"
        width="100px"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            type="danger"
            effect="dark"
            v-if="scope.row.type==0"
          >必修</el-tag>
          <el-tag
            type="success"
            effect="dark"
            v-if="scope.row.type==1"
          >选修</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="lecturer_id"
        label="教师编号"
        width="100px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="lecturer"
        label="授课教师"
        width="120px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="clazz"
        label="授课班级"
        width="150px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="remark"
        label="备注"
        width="220px"
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
            title="确认通过该申报课程吗？"
            @confirm="openPostFormDialog(scope.row)"
            style="margin-left: 5px;"
          >
            <el-button
              type="success"
              slot="reference"
            ><i class="el-icon-remove-outline"></i><span>通过</span></el-button>
          </el-popconfirm>
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="确认否决该申报课程吗？"
            @confirm="reject(scope.row.id)"
            style="margin-left: 5px;"
          >
            <el-button
              type="danger"
              slot="reference"
            ><i class="el-icon-remove-outline"></i><span>否决</span></el-button>
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
      title="分配学时和学分"
      :visible.sync="postFormVisible"
      width="440px"
      center
      @close="resetValidate()"
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
          label="学时"
          prop="hours"
          class="is-required"
        >
          <el-input
            v-model="postForm.hours"
            autocomplete="off"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="学分"
          prop="credits"
          class="is-required"
        >
          <el-input
            v-model="postForm.credits"
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
          @click="postFormVisible = false;"
          style="margin-right: 10px;"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="pass()"
        >提交 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>
.el-tooltip__popper {
  font-size: 14px;
  max-width: 50%;
}
</style>

<script>
import {
  getPendingCourses,
  rejectCourse,
  passCourse,
  getCategory,
} from "@/utils/api";
export default {
  name: "processCourse",
  data() {
    var validateHours = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入需要分配的学时"));
      } else {
        callback();
      }
    };
    var validateCredits = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入需要分配的学分"));
      } else {
        callback();
      }
    };
    return {
      postFormVisible: false,
      postForm: {
        id: "",
        course: "",
        type: "",
        clazz: "",
        lecturer_id: "",
        lecturer: "",
        hours: "",
        credits: "",
        remark: "",
      },
      tableData: [],
      pageSize: 5,
      pageNum: 1,
      total: 0,
      queryParams: {
        course: "",
        type: "",
        lecturer_id: "",
        lecturer: "",
        category: "",
      },
      selectedCourseList: [],
      batchDeleteVisible: false,
      rules: {
        hours: [{ validator: validateHours, trigger: "blur" }],
        credits: [{ validator: validateCredits, trigger: "blur" }],
      },
      categoryList: [],
    };
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getPendingCourseList(this.queryParams, this.pageSize, this.pageNum);
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getPendingCourseList(this.queryParams, this.pageSize, this.pageNum);
    },
    resetParams() {
      this.queryParams = {};
    },
    handleSelectionChange(val) {
      this.selectedCourseList = val;
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
    async getPendingCourseList(queryParams, pageSize, pageNum) {
      const res = await getPendingCourses(queryParams, pageSize, pageNum);
      if (res.code === 200) {
        this.total = res.data.total;
        this.tableData = res.data.list;
      } else {
        this.$message.error(res.msg);
      }
      return res;
    },
    async searchPendingCourses() {
      this.pageNum = 1;
      const res = await this.getPendingCourseList(
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
    async reject(id) {
      const res = await rejectCourse(id);
      if (res.code === 200) {
        this.getPendingCourseList(
          this.queryParams,
          this.pageSize,
          this.pageNum
        );
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    openPostFormDialog(row) {
      this.postForm = row;
      this.postFormVisible = true;
    },
    resetValidate() {
      this.$refs.postForm.clearValidate();
      this.postForm = {};
    },
    async pass() {
      const res = await passCourse(this.postForm);
      this.postFormVisible = false;
      this.getPendingCourseList(this.queryParams, this.pageSize, this.pageNum);
      if (res.code === 200) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    async getCategories() {
      const res = await getCategory();
      if (res.code === 200) {
        this.categoryList = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  created() {
    this.getCategories();
    this.getPendingCourseList(this.queryParams, this.pageSize, this.pageNum);
  },
};
</script>