<template>
  <el-container>
    <el-header style="font-size: 25px; padding: 5px">
      <h5 class="card-title" style="font-size: 30px; padding: 5px">
        垃圾渗滤液
      </h5>
    </el-header>
    <el-main>
      <h5 class="card-title" style="font-size: 25px; padding: 5px">
        相关参数列表
      </h5>
      <el-table
        :data="data_total.slice((currentPage - 1) * 10, currentPage * 10)"
        :size="large"
        width="100%"
        id="#vcfResult"
        :row-class-name="tableRowClassName"
      >
        <el-table-column property="station_name" label="站点" width="80" />
        <el-table-column
          property="Chemical_oxygen_demand"
          label="化学需氧量（mg/L）"
          width="200"
        />
        <el-table-column
          property="Ammonia_nitrogen"
          label="氨氮（mg/L）"
          width="150"
        />
        <el-table-column
          property="Total_phosphorus"
          label="总磷（mg/L）"
          width="120"
        />
        <el-table-column property="PH_value" label="PH" width="80">
        </el-table-column>
        <el-table-column
          property="Suspended_solids"
          label="悬浮物（mg/L）"
          width="150"
        />
        <el-table-column
          property="water_temperature"
          label="水温（℃）"
          width="110"
        />
        <el-table-column
          property="Today_flow"
          label="今日流量（方）"
          width="130"
        />
        <el-table-column
          property="Cumulative_flow"
          label="累计流量（方）"
          width="150"
        />
        <el-table-column
          property="Instantaneous_flow"
          label="瞬时流量（升/秒）"
          width="180"
        />
        <el-table-column
          property="Biochemical_oxygen_demand"
          label="生化需氧量（mg/L）"
          width="170"
        />
      </el-table>
      <!-- <div class="float-end" style="margin-top: 10px">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="totalRecords"
          :current-page="currentPage"
          @current-change="getTransport"
        />
      </div> -->
      <div class="site_name-header">
        <h5
          class="card-title"
          style="font-size: 25px; padding: 5px; padding-top: 30px"
        >
          流量统计
        </h5>

        <div class="site_name-header-search">
          <el-select
            v-model="site_name_select_way"
            class="m-2"
            placeholder="选择查询方式"
            clearable
            size="large"
          >
            <el-option
              v-for="item in site_name_option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <el-date-picker
            v-if="site_name_select_way == 'month'"
            v-model="site_name_select_value"
            type="monthrange"
            start-placeholder="选择开始时间"
            range-separator="到"
            end-placeholder="选择结束时间"
            :disabled-date="disabledDate"
            size="large"
            @change="search_site_name"
          />

          <el-date-picker
            v-if="site_name_select_way == 'day'"
            v-model="site_name_select_value"
            type="daterange"
            placeholder="请选择日期"
            range-separator="到"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            :disabled-date="disabledDate"
            size="large"
            @change="search_site_name"
          />
          <el-button
            type="primary"
            size="large"
            style="margin-left: 10px"
            @click="junk_exportExcel"
            >打印报表</el-button
          >
          <dv-charts
            :option="site_name_total"
            style="width: 95%; height: 40vh; margin: auto"
          />
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
// ==========================================================================================================sunny
import { ref, reactive } from "vue";
//===============================================================================================================
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";

// ==========================================================================================================sunny

let totalRecords = ref(1);
let currentPage = ref(1);
let pageCount = ref(1);
let pageNum = ref(1);

const queryCarNum = ref("");
const querySitename = ref("");

// ==========================================================

const carListRenhe = ref([]);

//=============================================================

const carData = ref([]);
const data_total = reactive([]);

let site_name_select_way = ref("");
let site_name_select_value = ref("");
const site_name_date = ref([]);
const site_name_option = [
  {
    value: "day",
    label: "按天查询",
  },
  // {
  //   value: "week",
  //   label: "按周查询",
  // },
  {
    value: "month",
    label: "按月查询",
  },
];
// 禁选今天以后的日期以及没有数据的
const disabledDate = (time) => {
  return (
    time.getTime() < new Date("2023-11-24").getTime() ||
    time.getTime() > new Date().getTime()
  );
};

// =============================================================================sunny
const site_name_yAxis = ref([]);

// const site_name_date = ref([]);
var today_time = moment().format("YYYY-MM-DD");
site_name_date.value[0] = moment().add(-4, "d").format("YYYY-MM-DD");
site_name_date.value[1] = moment().add(-3, "d").format("YYYY-MM-DD");
site_name_date.value[2] = moment().add(-2, "d").format("YYYY-MM-DD");
site_name_date.value[3] = moment().add(-1, "d").format("YYYY-MM-DD");
site_name_date.value[4] = today_time;

const site_name_sum = ref(0);
// 过去一周各时段垃圾净重平均值统计
const site_name_total = reactive({
  title: {
    text: "流量趋势统计",
  },
  xAxis: {
    name: "日期",
    data: site_name_date,
  },
  yAxis: {
    name: "累计流量",
    data: "value",
    min: 0,
    // maxinterval: 1000,
  },
  series: [
    {
      data: site_name_yAxis,
      type: "bar",
      label: {
        show: true,
        formatter: "{value}方 ",
      },
    },
  ],
});

// =====================================================================================
// =====================================================================================
// 站点天，周，月，季度统计
const search_site_name = () => {
  ElMessage("固定展示五个日/周/月，其余可导出报表查看详细信息！");

  site_name_date.value = [];

  var start;
  var end;
  if (site_name_select_value.value == "") {
    ElMessage({
      message: "请选择相应日期",
      type: "error",
    });
  } else {
    if (site_name_select_way.value == "day") {
      start = moment(site_name_select_value.value[0]).format("YYYY-MM-DD");
      end = moment(site_name_select_value.value[1]).format("YYYY-MM-DD");

      for (var i = 0; i <= 4; i++) {
        site_name_date.value[i] = moment(site_name_select_value.value[0])
          .add(i, "d")
          .format("YYYY-MM-DD");
        console.log(site_name_date.value[i]);

        if (site_name_date.value[i] != moment().format("YYYY-MM-DD")) {
          getSiteNameList(
            1,
            moment(site_name_date.value[i]).add(-1, "d").format("YYYY-MM-DD") +
              "T23:59:59",
            site_name_date.value[i] + "T23:59:59",
            10,
            i
          );
        } else if (site_name_date.value[i] == moment().format("YYYY-MM-DD")) {
          site_name_yAxis.value[i] = today_flow.value;
        }
      }
    }

    if (site_name_select_way.value == "month") {
      //起始月份
      start = moment(site_name_select_value.value[0]).format("YYYY-MM-DD");

      for (var date = 0; date <= 4; date++) {
        start = moment(site_name_select_value.value[0])
          .add(date, "months")
          .format("YYYY-MM-DD");
        if (moment(start).format("YYYY-MM") == moment().format("YYYY-MM")) {
          end = moment().format("YYYY-MM-DD");
        } else {
          end = moment(start).endOf("month").format("YYYY-MM-DD");
        }
        console.log("end:" + end);
        //统计一个月的总量
        getSiteNameList(1, start + "T23:59:59", end + "T23:59:59", 1000, date);
        //图标x轴标签展示月份
        site_name_date.value[date] = moment(start)
          .startOf("month")
          .format("YYYY-MM");
      }
    }

    // site_name_select_way.value = "";
  }
};

const getSiteNameList = (pageNum, start, end, pageSize, date) => {
  axios({
    url:
      "/OsmoticFluid/shenlvye/getPeriodRecordByPage/xihua?pageNum=" +
      pageNum +
      "&start=" +
      start +
      "&end=" +
      end +
      "&pageSize=" +
      pageSize,
    method: "get",
  }).then(function (resp) {
    if (resp.status == 200) {
      var data = resp.data.data.records;

      console.log("data:" + data.length);
      if (data.length == 0) {
        site_name_yAxis.value[date] = 0;
      }
      var total = 0;

      let a = end.indexOf("T");
      let l = end.substring(0, a);
      if (l == moment().format("YYYY-MM-DD")) {
        total = total + today_flow.value;
      }
      console.log("total:" + total);
      for (var key in data) {
        console.log("data[key].flow:" + data[key].flow);
        total = total + Number(data[key].flow);
      }

      site_name_yAxis.value[date] = total;
    }
  });
};
var today_flow = ref(0);
const recent_days_total = (site_name_date) => {
  for (var date = 0; date < 4; date++) {
    if (date == 0) {
      getSiteNameList(
        1,
        moment(site_name_date.value[date]).add("-1", "d").format("YYYY-MM-DD") +
          "T23:59:59",
        site_name_date.value[date] + "T23:59:59",
        10,
        date
      );
    } else {
      getSiteNameList(
        1,
        site_name_date.value[date - 1] + "T23:59:59",
        site_name_date.value[date] + "T23:59:59",
        10,
        date
      );
    }
  }

  axios({
    url: "/OsmoticFluid/shenlvye/getRecordByStation?station=xihua",
    method: "get",
  }).then(function (resp) {
    if (resp.status == 200) {
      var data = resp.data.data;
      site_name_yAxis.value[4] = data.今日流量;
      today_flow.value = data.今日流量;
    }
  });
};
recent_days_total(site_name_date);

const car_exportExcel = () => {
  const titleArr = ["时间", "当天流量", "累计流量"]; //表头中文名

  exportExcel(
    json_data.value,
    start + "至" + end + "垃圾站渗滤液流量统计",
    titleArr,
    "sheetName"
  );
};

function exportExcel(json, name, titleArr, sheetName) {
  /* convert state to workbook */
  var data = new Array();
  var keyArray = new Array();
  const getLength = function (obj) {
    var count = 0;
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        count++;
      }
    }
    return count;
  };
  for (const key1 in json) {
    if (json.hasOwnProperty(key1)) {
      const element = json[key1];
      var rowDataArray = new Array();
      for (const key2 in element) {
        if (element.hasOwnProperty(key2)) {
          const element2 = element[key2];
          rowDataArray.push(element2);
          if (keyArray.length < getLength(element)) {
            keyArray.push(key2);
          }
        }
      }
      data.push(rowDataArray);
    }
  }
  // keyArray为英文字段表头
  data.splice(0, 0, keyArray, titleArr);
  console.log("data", data);
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  let wscols = [
    // 每列不同宽度px
    { wpx: 160 },
    { wpx: 80 },
    { wpx: 80 },
  ];
  ws["!cols"] = wscols;
  // 此处隐藏英文字段表头
  var wsrows = [{ hidden: true }];
  ws["!rows"] = wsrows; // ws - worksheet
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  /* generate file and send to client */
  XLSX.writeFile(wb, name + ".xlsx");
}

//===============================================================================================================

const getCarWarning = () => {
  axios({
    url: "/OsmoticFluid/shenlvye/getRecordByStation?station=xihua",
    method: "get",
  }).then(function (resp) {
    if (resp.status == 200) {
      var data = resp.data.data;
      // console.log("resp.message:" + resp.data.message)
      //  carData.value = data;
      data_total.splice(0, data_total.length);
     



          var xihua_data = {
            station_name: "西华",
            Chemical_oxygen_demand: data.化学需氧量,
            Ammonia_nitrogen: data.氨氮,
            Total_phosphorus: data.总磷,
            PH_value: data.PH,
            Suspended_solids: data.悬浮物,
            water_temperature: data.水温,

            Cumulative_flow: data.累计流量,
            Instantaneous_flow: data.瞬时流量,
            Biochemical_oxygen_demand: data.生化需氧量,
            Today_flow: data.今日流量,
          };
          data_total.push(xihua_data);

          var national_data = {
            station_name: "国家标准",
            Chemical_oxygen_demand: "< 500",
            Ammonia_nitrogen: "< 45",
            Total_phosphorus: "< 8",
            PH_value: "6.5-9.5",
            Suspended_solids: "< 400",
            water_temperature: "< 40",

            Cumulative_flow: "无",
            Instantaneous_flow: "无",
            Biochemical_oxygen_demand: "< 350",
            Today_flow: "无",
          };
          data_total.push(national_data);
        

    }
  });
};

getCarWarning();

const getJunkForm = (start, end,site_name) => {
  axios({
    url:
      "/OsmoticFluid/shenlvye/getShenlvyeBySiteExcel",

    method: "get",
    params: {
      start: start,
      end: end,
      siteName:site_name
    },
    // 下载后台文件：请求头部一定要加上responseType:'blob'
    responseType: "blob",
  }).then(function (res) {
    if (res.status == 200) {
      console.log("成功了！");
      // 生成blob对象 定义下载格式
      let blob = new Blob([res.data], { type: res.type });
      // 获取文件名
      let filename = res.headers["content-disposition"];
      filename = decodeURIComponent(filename.split("filename=")[1]);
      // 创建 a标签 执行下载
      let downloadElement = document.createElement("a");
      let href = window.URL.createObjectURL(blob); //创建下载的链接
      downloadElement.href = href;
      downloadElement.download = filename; //下载后文件名
      document.body.appendChild(downloadElement); // 项目插入a元素
      downloadElement.click(); //点击下载
      document.body.removeChild(downloadElement); //下载完成移除元素
      window.URL.revokeObjectURL(href); //释放blob对象
    }
  });
};

var junk_export_start = moment().add(-4, "d").format("YYYY-MM-DD");
var junk_export_end = today_time;

// 导出垃圾报表
const junk_exportExcel = () => {
  if (
    site_name_select_value.value[0] != null &&
    site_name_select_value.value[1] != null
  ) {
    if (site_name_select_way.value == "day") {
      junk_export_start = moment(site_name_select_value.value[0]).format(
        "YYYY-MM-DD"
      );
      junk_export_end = moment(site_name_select_value.value[1]).format(
        "YYYY-MM-DD"
      );
    }
    if (site_name_select_way.value == "month") {
      junk_export_start = moment(site_name_select_value.value[0])
        .startOf("month")
        .format("YYYY-MM-DD");
      junk_export_end = moment(site_name_select_value.value[1])
        .endOf("month")
        .format("YYYY-MM-DD");
    }
  }

  getJunkForm(junk_export_start, junk_export_end,"西华");
};
</script>
<style></style>
