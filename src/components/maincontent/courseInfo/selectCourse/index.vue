<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="table">
        <template slot="title">
          <h3 style="margin-left: 559.7px;"> <i
              class="el-icon-collection-tag"
              style="zoom: 1.6; color: rgb(48, 65, 86);"
            ></i>已选课程</h3>
        </template>
        <el-table
          :data="tableData"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          style="width: 100%;border-radius: 8px; box-shadow: 5px 5px 50px 50px rgba(179, 184, 182, 0.267);margin-top: 12px;"
        >
          >
          <el-table-column
            label="选课编号"
            prop="id"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="课程编号"
            prop="course_id"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="课程"
            prop="course"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="课程门类"
            prop="category"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="教师编号"
            prop="lecturer_id"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="授课教师"
            prop="lecturer"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="课时"
            prop="hours"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="学分"
            prop="credits"
            align="center"
          >
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            label="描述"
            prop="remark"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="状态"
            prop="is_scheduled"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag
                type="warning"
                effect="dark"
                v-if="scope.row.is_scheduled==0"
              >编排中...</el-tag>
              <el-tag
                type="success"
                effect="dark"
                v-if="scope.row.is_scheduled==1"
              >已编排</el-tag>
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
                title="确认取消该课程的申请吗？"
                @confirm="cancel(scope.row.id)"
                style="margin-left: 5px;"
                v-if="scope.row.is_scheduled === 0"
              >
                <el-button
                  type="success"
                  slot="reference"
                ><i class="el-icon-remove-outline"></i><span>取消</span></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <el-divider content-position="center">
      <h3>
        <i
          class="el-icon-collection"
          style="zoom: 1.2; color: rgb(48, 65, 86);"
        ></i>可选课程
      </h3>
    </el-divider>
    <el-table
      :data="tableData2"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="width: 100%;border-radius: 8px; box-shadow: 5px 5px 50px 50px rgba(179, 184, 182, 0.267);margin-top: 12px;"
    >
      >
      <el-table-column
        label="课程编号"
        prop="course_id"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="课程"
        prop="course"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="课程门类"
        prop="category"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="教师编号"
        prop="lecturer_id"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="授课教师"
        prop="lecturer"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="课时"
        prop="hours"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="学分"
        prop="credits"
        align="center"
      >
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="描述"
        prop="remark"
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
            title="确认选择该课程吗？"
            @confirm="select(scope.row)"
            style="margin-left: 5px;"
          >
            <el-button
              type="success"
              slot="reference"
            ><i class="el-icon-thumb"></i><span>选择</span></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pageNum"
        :page-size="5"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
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
  getStudentCourse,
  cancelStudentCourse,
  selectCourse,
} from "@/utils/api";
export default {
  name: "selectCourse",
  data() {
    return {
      activeNames: ["table"],
      tableData: [],
      tableData2: [],
      pageNum: 1,
      total: 0,
    };
  },
  methods: {
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getCourseList(pageNum);
    },
    async getCourseList(pageNum) {
      const res = await getStudentCourse(pageNum);
      if (res.code === 200) {
        this.tableData = res.data.selected_course;
        this.tableData2 = res.data.available_course;
        this.total = res.data.total;
      } else {
        this.$message.error(res.msg);
      }
    },
    async cancel(id) {
      const res = await cancelStudentCourse(id);
      if (res.code === 200) {
        this.pageNum = 1;
        this.getCourseList(this.pageNum);
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    async select(row) {
      const res = await selectCourse(row);
      if (res.code === 200) {
        this.pageNum = 1;
        this.getCourseList(this.pageNum);
        this.activeNames = ["table"];
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
  },
  created() {
    this.getCourseList(this.pageNum);
  },
};
</script>