<template>
  <div>
    <div style="margin-bottom: 15px;padding-top:0;margin-top:-10px">
      <el-select
        v-model="current_week"
        @change="selectTrigger"
      >
        <el-option
          v-for="(item,index) in currentWeeks"
          :value="index+1"
          :label="item"
          :key="index"
        >
        </el-option>
      </el-select>
    </div>
    <el-table
      border
      stripe
      :data="tableData"
      :header-cell-style="{color: '#1E90FF', fontSize: '14px', backgroundColor: '#qua'}"
      :row-style="{height:'80px'}"
      :cell-style="{padding:'5px'}"
      style="font-size: 12px"
    >
      <el-table-column
        label="时间/课程"
        align="center"
      >
        <template v-slot="scope">
          <div v-if="scope.row">
            <div style="text-align: center; color: #E6A23C; font-weight: bold;">{{ scope.row.head }}</div>
            <div style="text-align: center; color: #E6A23C; font-weight: bold;">{{ scope.row.head_time }}</div>
            <div style="text-align: center; color: #E6A23C; font-weight: bold;">{{ scope.row.tail }}</div>
            <div style="text-align: center; color: #E6A23C; font-weight: bold;">{{ scope.row.tail_time }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="周一"
        align="center"
      >
        <template v-slot="scope">
          <div v-if="scope.row.monday">
            <div style="text-align: center;">
              <h4>{{ scope.row.monday.course }}</h4>
            </div>
            <div style="text-align: center;">{{ scope.row.monday.classroom }}</div>
            <div style="text-align: center;">{{ scope.row.monday.lecturer }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="周二"
        align="center"
      >
        <template v-slot="scope">
          <div v-if="scope.row.tuesday">
            <div style="text-align: center;">
              <h4>{{ scope.row.tuesday.course }}</h4>
            </div>
            <div style="text-align: center;">{{ scope.row.tuesday.classroom }}</div>
            <div style="text-align: center;">{{ scope.row.tuesday.lecturer }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="周三"
        align="center"
      >
        <template v-slot="scope">
          <div v-if="scope.row.wednesday">
            <div style="text-align: center;">
              <h4>{{ scope.row.wednesday.course }}</h4>
            </div>
            <div style="text-align: center;">{{ scope.row.wednesday.classroom }}</div>
            <div style="text-align: center;">{{ scope.row.wednesday.lecturer }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="周四"
        align="center"
      >
        <template v-slot="scope">
          <div v-if="scope.row.thursday">
            <div style="text-align: center;">
              <h4>{{ scope.row.thursday.course }}</h4>
            </div>
            <div style="text-align: center;">{{ scope.row.thursday.classroom }}</div>
            <div style="text-align: center;">{{ scope.row.thursday.lecturer }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="周五"
        align="center"
      >
        <template v-slot="scope">
          <div v-if="scope.row.friday">
            <div style="text-align: center;">
              <h4>{{ scope.row.friday.course }}</h4>
            </div>
            <div style="text-align: center;">{{ scope.row.friday.classroom }}</div>
            <div style="text-align: center;">{{ scope.row.friday.lecturer }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="周六"
        align="center"
      >
        <template v-slot="scope">
          <div v-if="scope.row.saturday">
            <div style="text-align: center;">
              <h4>{{ scope.row.saturday.course }}</h4>
            </div>
            <div style="text-align: center;">{{ scope.row.saturday.classroom }}</div>
            <div style="text-align: center;">{{ scope.row.saturday.lecturer }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="周日"
        align="center"
      >
        <template v-slot="scope">
          <div v-if="scope.row.sunday">
            <div style="text-align: center;">
              <h4>{{ scope.row.sunday.course }}</h4>
            </div>
            <div style="text-align: center;">{{ scope.row.sunday.classroom }}</div>
            <div style="text-align: center;">{{ scope.row.sunday.lecturer }}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getStudentCourseTable } from "@/utils/api";
export default {
  name: "myTable",
  data() {
    return {
      current_week: 1,
      tableData: [],
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
    };
  },
  methods: {
    async getCourseTable() {
      const res = await getStudentCourseTable(this.current_week);
      if (res.code === 200) {
        this.tableData = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },
    selectTrigger() {
      this.getCourseTable();
    },
  },
  created() {
    this.getCourseTable();
  },
};
</script>