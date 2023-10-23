<template>
  <el-container>
    <el-header style="font-size: 25px; padding: 5px">
      <h5 class="card-title" style="font-size: 30px; padding: 5px">
        告警事件历史查询
      </h5>
    </el-header>
    <el-main>
 
      <el-table
        :data="data_total.slice((currentPage - 1) * 10, currentPage * 10)"
        :size="large"
        width="100%"
        id="#vcfResult"
        :row-class-name="tableRowClassName"
      >
        <el-table-column property="status" label="状态" width="200px" />
        <el-table-column property="day" label="时间" width="200px" />
        <el-table-column property="siteName" label="站点" width="150" />
        <el-table-column property="carNumber" label="承运车辆" width="150">
          <!-- <template #default="scope">
            <el-button
              size="medium"
              type="primary"
              link
              @click="handleEdit(scope.$index, scope.row)"
              >{{ scope.row.carNumber }}
            </el-button>
          </template> -->
        </el-table-column>
        <el-table-column
          property="todayAmount"
          label="过去4小时内运输垃圾总量（kg）"
          width="300"
        />
        <el-table-column
          property="predictAmount"
          label="运输垃圾预测量（kg）"
          width="250"
        />

        <el-table-column property="driver" label="司机" width="200" />
        <el-table-column property="tel" label="司机电话" width="200" />
        <el-table-column property="wechat" label="司机微信" width="200" />
      </el-table>
      <div class="float-end" style="margin-top: 10px">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="totalRecords"
          :current-page="currentPage"
          @current-change="getTransport"
        />
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

// ==========================================================================================================sunny

let totalRecords = ref(1000);
let currentPage = ref(1);


const queryCarNum = ref("");
const querySitename = ref("");




//=============================================================

const transport_today =
  new Date().getFullYear() +
  "-" +
  (new Date().getMonth() + 1) +
  "-" +
  new Date().getDate();
var transport_start = transport_today;
console.log("transport_start" + transport_start);

const data_total = reactive([]);

const getCarWarning = (start, end, pageNum, pageSize) => {
  axios({
    url:
      "/api/dump-record/car_data/all_site/" +
      start +
      "/" +
      end +
      "/" +
      pageNum +
      "/" +
      pageSize,

    method: "get",
  }).then(function (resp) {
    if (resp.status == 200) {
      queryCarNum.value = "";
      data_total.splice(0, data_total.length);
      var data = resp.data.data.records;
      for (var car in data) {
        if (data[car].todayAmount == null) {
          data[car].todayAmount = 0;
        }
        if (data[car].todayAmount > data[car].predictAmount * 1.2) {
          console.log("高于预测值20%");
          var currentCar = {
            status: "高于预测值20%",
            day: start + " 至 " + end,
            siteName: data[car].siteName,
            carNumber: data[car].carNumber,
            todayAmount: data[car].todayAmount,
            predictAmount: data[car].predictAmount,
          };
          data_total.push(currentCar);
        }
      }
      for (var car in data) {
        if (data[car].todayAmount == null) {
          data[car].todayAmount = 0;
        }
        if (data[car].todayAmount < data[car].predictAmount * 0.8) {
          console.log("低于预测值20%");
          var currentCar = {
            status: "低于预测值20%",
            day: start + " 至 " + end,
            siteName: data[car].siteName,
            carNumber: data[car].carNumber,
            todayAmount: data[car].todayAmount,
            predictAmount: data[car].predictAmount,
          };
          data_total.push(currentCar);
        }
      }
      for (var car in data) {
        if (data[car].todayAmount == null) {
          data[car].todayAmount = 0;
        }
        if (
          data[car].todayAmount >= data[car].predictAmount * 0.8 &&
          data[car].todayAmount <= data[car].predictAmount * 1.2
        ) {
          var currentCar = {
            status: "正常",
            day: start + " 至 " + end,
            siteName: data[car].siteName,
            carNumber: data[car].carNumber,
            todayAmount: data[car].todayAmount,
            predictAmount: data[car].predictAmount,
          };
          data_total.push(currentCar);
        }
      }

      console.log("数据长度：" + data.length);
      totalRecords.value = data_total.length;
      pageCount = parseInt(data_total.length) % 10;
      currentPage.value = pageNum;
    }
  });
};

const getTransport = (pageNum) => {
  // 当前页
  currentPage.value = pageNum;
};



const searchCarWarning = (carNumber, start, end) => {
  axios({
    url: "/api/dump-record/car_data/" + carNumber + "/" + start + "/" + end,

    method: "get",
  }).then(function (resp) {
    if (resp.status == 200) {
      var data = resp.data.data;
      data_total.splice(0, data_total.length);

      for (var car in data) {
        if(querySitename.value==data[car].siteName){
          if (carNumber == data[car].carNumber) {
            if (data[car].todayAmount == null) {
              data[car].todayAmount = 0;
            }
            if (data[car].todayAmount > data[car].predictAmount * 1.2) {
              console.log("高于预测值20%");
              var currentCar = {
                status: "高于预测值20%",
                day: start + " 至 " + end,
                siteName: data[car].siteName,
                carNumber: data[car].carNumber,
                todayAmount: data[car].todayAmount,
                predictAmount: data[car].predictAmount,
              };
            }
            if (data[car].todayAmount < data[car].predictAmount * 0.8) {
              console.log("低于预测值20%");
              var currentCar = {
                status: "低于预测值20%",
                day: start + " 至 " + end,
                siteName: data[car].siteName,
                carNumber: data[car].carNumber,
                todayAmount: data[car].todayAmount,
                predictAmount: data[car].predictAmount,
              };
            }
            if (
              data[car].todayAmount >= data[car].predictAmount * 0.8 &&
              data[car].todayAmount <= data[car].predictAmount * 1.2
            ) {
              var currentCar = {
                status: "正常",
                day: start + " 至 " + end,
                siteName: data[car].siteName,
                carNumber: data[car].carNumber,
                todayAmount: data[car].todayAmount,
                predictAmount: data[car].predictAmount,
              };
            }
          }
          data_total.push(currentCar);
        }
      }

      console.log("数据长度：" + data.length);
      totalRecords.value = data_total.length;
      pageCount = parseInt(data_total.length) % 10;
      currentPage.value = pageNum;
    }
  });
};

function upDateList() {
  var time = new Date().getTime();
  // 获取当前时间，转化时间戳为正常格式
  var end =
    new Date().getHours().toString().padStart(2, 0) +
    ":" +
    new Date().getMinutes().toString().padStart(2, 0) +
    ":" +
    new Date().getSeconds().toString().padStart(2, 0);

  var start =
    new Date(time - 4 * 60 * 60 * 1000).getHours().toString().padStart(2, 0) +
    ":" +
    new Date(time - 4 * 60 * 60 * 1000).getMinutes().toString().padStart(2, 0) +
    ":" +
    new Date(time - 4 * 60 * 60 * 1000).getSeconds().toString().padStart(2, 0);

  if (queryCarNum.value == "" || queryCarNum.value == "全部") {
    getCarWarning(start, end, 1, 10000);
  } else {
    searchCarWarning(queryCarNum.value, start, end);
  }
  // getLessCarWarning(start, end, 1, 10000);
}

upDateList();
// 每隔一分钟更新一次
setInterval(upDateList, 60000);


</script>
<style>

</style>
