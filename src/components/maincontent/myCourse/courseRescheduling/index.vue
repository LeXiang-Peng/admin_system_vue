<template>
  <div>
    <div style="margin: 10px 0;margin-top:-5px;">
      <el-input
        v-model.number="queryParams.course_id"
        style="width: 200px;"
        suffix-icon="el-icon-search"
        placeholder="请输入课程编号"
        oninput="value=value.replace(/[^\d]/g,'')"
      ></el-input>
      <el-input
        v-model="queryParams.course"
        style="width: 200px; margin-left: 5px;"
        suffix-icon="el-icon-reading"
        placeholder="请输入课程名称"
      ></el-input>

      <el-button
        style="margin-left: 5px;"
        type="primary"
        @click="search()"
      >搜索</el-button>
      <el-button
        style="margin-left: 5px;"
        type="warning"
        @click="resetParams"
      >重置</el-button>
    </div>
    <el-table
      size="small"
      :data="tableData"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="width: 100%;border-radius: 8px; box-shadow: 5px 5px 50px 50px rgba(179, 184, 182, 0.267);margin-top: 12px;"
    >
      >
      <el-table-column
        label="调课编号"
        prop="id"
        width="90px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="课程编号"
        prop="course_id"
        width="90px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        width="100px"
        label="课程"
        prop="course"
        align="center"
      >
      </el-table-column>
      <el-table-column
        width="110px"
        label="教学楼"
        prop="building"
        align="center"
      >
        <template slot-scope="scope">
          <el-select
            v-if="scope.row.id === editId"
            v-model="editForm.building"
            @change="change"
          >
            <el-option
              v-for="item in buildings"
              :value="item"
              :key="item"
              :label="item"
            >
            </el-option>
          </el-select>
          <span v-else>{{scope.row.building}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="130px"
        label="教室"
        prop="classroom"
        align="center"
      >
        <template slot-scope="scope">
          <el-select
            v-model="editForm.classroom"
            v-if="scope.row.id === editId"
          >
            <el-option
              v-for="item in classrooms"
              :value="item"
              :key="item"
              :label="item"
            >
            </el-option>
          </el-select>
          <span v-else>{{scope.row.classroom}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="110px"
        label="当前周次"
        prop="curr_week"
        align="center"
      >
        <template slot-scope="scope">
          <el-select
            v-if="scope.row.id === editId"
            v-model="editForm.curr_week"
          >
            <el-option
              v-for="(item,index) in currentWeeks"
              :value="index+1"
              :label="item"
              :key="index"
            >

            </el-option>
          </el-select>
          <span v-else>
            <el-tag
              type="success"
              effect="dark"
            >{{currentWeeks[scope.row.curr_week-1]}}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="90px"
        label="星期"
        prop="weekday"
        align="center"
      >
        <template slot-scope="scope">
          <el-select
            v-if="scope.row.id === editId"
            v-model="editForm.weekday"
          >
            <el-option
              v-for="item in ['周一','周二','周三','周四','周五','周六','周日']"
              :value="item"
              :key="item"
              :label="item"
            ></el-option>
          </el-select>
          <span v-else>{{scope.row.weekday}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="130px"
        label="上课时间"
        prop="course_time"
        align="center"
      >
        <template slot-scope="scope">
          <el-select
            v-if="scope.row.id === editId"
            v-model="editForm.course_time"
          >
            <el-option
              v-for="item in ['第一大节','第二大节','第三大节','第四大节','第五大节']"
              :value="item"
              :key="item"
              :label="item"
            ></el-option>
          </el-select>
          <span v-else>{{scope.row.course_time}}</span>
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
            title="确认删除这条记录吗？"
            @confirm="deleteRecords(scope.row.id)"
            style="margin-left: 5px;"
            v-if="(scope.row.id!==editId&&isEdited)||!isEdited"
          >
            <el-button
              type="danger"
              slot="reference"
            ><i class="el-icon-remove-outline"></i><span>删除</span></el-button>
          </el-popconfirm>
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="确认要对这条记录进行编辑吗？"
            @confirm="edit(scope.row)"
            style="margin-left: 5px;"
            v-if="(scope.row.id!==editId&&isEdited)||!isEdited"
          >
            <el-button
              type="success"
              slot="reference"
            ><i class="el-icon-edit"></i><span>编辑</span></el-button>
          </el-popconfirm>
          <el-button
            type="info"
            slot="reference"
            v-if="isEdited&&scope.row.id === editId"
            @click="cancel"
          ><i class="el-icon-refresh-right"></i><span>取消</span></el-button>
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-tickets"
            icon-color="red"
            title="确定保存此次修改？"
            @confirm="editRecords()"
            style="margin-left: 5px;"
            v-if="isEdited&&scope.row.id === editId"
          >
            <el-button
              type="success"
              slot="reference"
            ><i class="el-icon-edit"></i><span>保存</span></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pageNum"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getAlterCourseRecords,
  getClassroomInfo,
  deleteRecords,
  editRecords,
} from "@/utils/api";
export default {
  name: "courseRescheduling",
  data() {
    return {
      currentWeeks: [
        "第一周",
        "第二周",
        "第三周",
        "第四周",
        "第五周",
        "第六周",
        "第七周",
        "第八周",
        "第九周",
        "第十周",
        "第十一周",
        "第十二周",
        "第十三周",
        "第十四周",
        "第十五周",
        "第十六周",
        "第十七周",
        "第十八",
        "第十九周",
        "第二十周",
        "第二十一周",
        "第二十二周",
        "第二十三周",
        "第二十四周",
        "第二十五周",
      ],
      pageNum: 1,
      pageSize: 5,
      tableData: [],
      queryParams: {
        course_id: null,
        course: "",
      },
      editForm: {
        id: "",
        building: "",
        classroom: "",
        weekday: "",
        course_time: "",
        curr_week: "",
      },
      editId: 0,
      isEdited: false,
      buildings: [],
      classroomList: [],
      classrooms: [],
    };
  },
  methods: {
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getRecords();
    },
    async getRecords() {
      const res = await getAlterCourseRecords(
        this.queryParams,
        this.pageSize,
        this.pageNum
      );
      if (res.code === 200) {
        this.tableData = res.data;
      } else {
        this.$message.success(res.msg);
      }
      return res;
    },
    async search() {
      const res = await this.getRecords();
      if (res.code === 200) {
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    edit(row) {
      this.editId = row.id;
      this.editForm = { ...row };
      this.isEdited = true;
    },
    cancel() {
      this.isEdited = false;
      this.editId = "";
      this.editForm = {};
    },
    unique(arr, val) {
      const res = new Map();
      return arr.filter((item) => !res.has(item[val]) && res.set(item[val], 1));
    },
    async getClassroomList() {
      const res = await getClassroomInfo();
      if (res.code === 200) {
        this.classroomList = res.data;
        this.buildings = this.unique(res.data, "building").map(
          (v) => v.building
        );
        this.classrooms = this.classroomList
          .filter((v) => v.building === this.buildings[0])
          .map((v) => v.classroom);
      } else {
        this.$message.error(res.msg);
      }
    },
    change() {
      if (this.editForm.building) {
        this.classrooms = this.classroomList
          .filter((v) => v.building === this.editForm.building)
          .map((v) => v.classroom);
      }
    },
    async deleteRecords(id) {
      const res = await deleteRecords(id);
      if (res.code === 200) {
        this.$message.success(res.msg);
        this.pageNum = 1;
        this.queryParams = {};
        this.getRecords();
      } else {
        this.$message.error(res.msg);
      }
    },
    resetParams() {
      this.queryParams = {};
    },
    async editRecords() {
      const res = await editRecords(this.editForm);
      if (res.code === 200) {
        this.getRecords();
        this.$message.success(res.msg);
        this.cancel();
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  created() {
    this.getRecords();
    this.getClassroomList();
  },
};
</script>
