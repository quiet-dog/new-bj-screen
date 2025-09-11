<template>
  <div class="bigscreen_lt" @click="closeShow">
    <div class="bigscreen_lt_top">
      <div class="bigscreen_lt_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>环境信息</span>
      </div>
    </div>
    <div class="bigscreen_lt_bottom">
      <div class="bigscreen_lt_bottom_nei">
        <div class="bigscreen_lt_bottom_nei_t">
          <span>描述</span>
          <span>位号</span>
          <span>数值</span>
          <span>时间</span>
        </div>
        <div class="bigscreen_lt_bottom_neib">
          <Vue3SeamlessScroll :list="equipmentlist" :class-option="{
            step: 5,
          }" hover class="scrool">
            <div class="bigscreen_lt_bottom_nei_b" v-for="(item, index) in environmentFileList">
              <span>
                <!-- {{ `${item?.environment?.description}-${item?.environment?.unitName}` }} -->
                <!-- <too -->
                <el-tooltip class="box-item" effect="dark"
                  :content="`${item?.environment?.description}-${item?.environment?.unitName}`" placement="top-start">
                  {{ `${item?.environment?.description}-${item?.environment?.unitName}` }}
                </el-tooltip>
              </span>
              <span>
                <el-tooltip :content="item?.environment?.tag" placement="top-start" class="box-item" effect="dark">
                  {{ item?.environment?.tag }}
                </el-tooltip>
              </span>
              <span :class="getValueColorClass(item)">{{ item.value }}</span>
              <span>{{ item.createTime }}</span>
            </div>
          </Vue3SeamlessScroll>
        </div>

        <!-- <div
          class="bigscreen_lt_bottom_nei_b"
          v-for="(item, index) in environmentFileList"
        >
          <span>{{ `${item?.environment?.description}-${item?.environment?.unitName}` }}</span>
          <span>{{ item?.environment?.tag }}</span>
          <span :class="getValueColorClass(item)" >{{ item.value }}</span>
          <span>{{ item.createTime }}</span>
        </div> -->
      </div>
    </div>
  </div>
  <div class="bigscreen_lb">
    <div class="bigscreen_lb_top">
      <div class="bigscreen_lb_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>历史告警统计</span>
      </div>
      <el-radio-group v-model="historyStatisticsData.dayType" @change="historyStatistics" class="group">
        <el-radio-button label="周" value="week" />
        <el-radio-button label="年" value="year" />
      </el-radio-group>
    </div>
    <div v-show="hisShow" class="lb_table ltTrendDialog">
      <div class="ltTrendDialog_top">
        <span>报警列表</span>
        <div class="myInput">
          <ElInput class="inputcss" placeholder="请输入设备名称" v-model="hisDeviceName" @change="changeHisList" />
          <ElButton @click="downloadFile" type="primary" text="primary">
            <el-icon class="downloadMy">
              <Download />
            </el-icon>
          </ElButton>
        </div>
        <img @click="closeShow" :src="img9" alt="" srcset="" />
      </div>
      <div class="ltTrendDialog_bottom">
        <ElTable :header-cell-style="tableHeaderColor" :cell-style="handleChangeCellStyle"
          style="width: 100%;background: #002547;" height="100%" :data="hisList">
          <el-table-column width="150" fixed="left" prop="createTime" label="报警时间">
            <template #default="{ row }">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column width="100" prop="equipment.equipmentName" label="设备名称">
          </el-table-column>
          <el-table-column width="100" prop="equipmentValue" label="数据">
            <template #default="{ row }">
              <span :style="{ color: getEquipmentDataColorType(row) }">{{ row.equipmentValue }}</span>
            </template>
          </el-table-column>
          <el-table-column width="80" prop="level" label="报警级别">
            <template #default="{ row }">
              <el-tag :style="getLevelStyle(row.level)" effect="plain" size="small">
                {{ row.level ? row.level : "-" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column width="200" prop="description" label="描述">
            <template #default="{ row }">
              <span>{{ row.description }}</span>
            </template>
          </el-table-column>
          <template #append>
            <el-pagination id="popperHis" v-model:current-page="hisPage" v-model:page-size="hisPageSize"
              :background="false" :small="true" @change="changeHisPag" layout="prev, pager, next" :total="hisTotal" />
          </template>
        </ElTable>
      </div>
    </div>
    <div class="bigscreen_lb_bottom">
      <div class="bigscreen_lb_bottom_nei" ref="bigscreenLBRef"></div>
    </div>
  </div>

  <center></center>
  <div class="bigscreen_rt">
    <div class="bigscreen_rt_top">
      <div class="bigscreen_rt_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>区域报警统计</span>
      </div>
      <el-radio-group v-model="powerByAreaTotalStaticData.dayType" @change="powerByAreaTotalStaticFun" class="group">
        <el-radio-button label="周" value="week" />
        <el-radio-button label="年" value="year" />
      </el-radio-group>
    </div>
    <div class="bigscreen_rt_bottom">
      <div class="bigscreen_rt_bottom_nei" ref="bigscreenRTRef"></div>
    </div>
    <div v-show="rtShow" class="rt_table rtTrendDialog">
      <div class="ltTrendDialog_top">
        <span>报警列表</span>
        <img @click="closeRtShow" :src="img9" alt="" srcset="" />
      </div>
      <div class="ltTrendDialog_bottom">
        <ElTable :header-cell-style="tableHeaderColor" :cell-style="handleChangeCellStyle"
          style="width: 100%;background: #002547;" height="100%" :data="powerInfoList">
          <el-table-column width="150" fixed prop="createTime" label="报警时间">
            <template #default="{ row }">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>

          <el-table-column fixed width="80" prop="level" label="报警级别">
            <template #default="{ row }">
              <el-tag :style="getLevelStyle(row.level)" effect="plain" size="small">
                {{ row.level ? row.level : "-" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述">
            <template #default="{ row }">
              <span>{{ row.description }}</span>
            </template>
          </el-table-column>
          <template #append>
            <el-pagination id="popperHiss" v-model:current-page="alarmTable.pageNum"
              v-model:page-size="alarmTable.pageSize" :background="false" :small="true" @change="changeTableEvent"
              layout="prev, pager, next" :total="alarmTableTotal" />
          </template>
        </ElTable>
      </div>
    </div>
  </div>
  <div class="bigscreen_rb">
    <div class="bigscreen_rb_top">
      <div class="bigscreen_rb_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>传感器数据</span>
      </div>
    </div>
    <div class="bigscreen_rb_bottom">
      <div class="bigscreen_rb_bottom_nei">
        <div class="bigscreen_rb_bottom_nei_t">
          <span>传感器编号</span>
          <span>传感器名称</span>
          <span>数值</span>
          <span>时间</span>
        </div>
        <div class="bigscreen_rb_bottom_neib">
          <Vue3SeamlessScroll :list="equipmentlist" :class-option="{
            step: 5,
          }" hover class="scrool">
            <div @click="clickFormItem(item.thresholdId)" class="bigscreen_rb_bottom_nei_b"
              v-for="item in equipmentlist">
              <span>
                {{ item.thresholdId }}
              </span>
              <span>{{ item?.threshold.sensorName }}</span>
              <span :style="{ color: getEquipmentDataColor(item) }">{{ item?.equipmentData }}</span>
              <span>{{ dayjs(item?.createTime).format("YYYY-MM-DD hh:mm:ss") }}</span>
            </div>
          </Vue3SeamlessScroll>
        </div>
      </div>
    </div>
  </div>
  <el-dialog title="阈值设置" width="900" align-center v-model="centerDialogVisible">
    <el-form :model="formData" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item label="级别层级：">
        <el-input-number v-model="num" :min="1" :max="5" @change="handleChange" />
      </el-form-item>
      <el-row v-for="(item, index) in formData.values" :key="index">
        <el-col :span="12">
          <el-form-item label="报警级别：">
            <el-select v-model="item.level" placeholder="请选择报警级别" style="width: 300px">
              <el-option v-for="option in alarmLevelOptions" :key="option.value" :label="option.label"
                :value="option.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="指标区间：">
            <div style="
                width: 300px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              ">
              <el-input v-model="item.min" placeholder="开始区间" autocomplete="off" style="width: 130px" />
              <span>至</span>
              <el-input v-model="item.max" placeholder="结束区间" autocomplete="off" style="width: 130px" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitFormThreshold">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import * as echarts from "echarts";
import { Download } from "@element-plus/icons-vue";
import {
  environmentalDetectionList,
  environmentalFilesList,
  eventByAreaTotalStatic,
  powerByAreaTotalStatic,
} from "../../api/environment";
import { thresholdDataList, thresholdList, exportAlarmEvents } from "../../api/riskassessment";
import { alarmEventsList, getstatistics } from "../../api/incident";
import center from "../../components/center.vue";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import dayjs from "dayjs";
import { useIntervalFn } from '@vueuse/core'
import img9 from "../../../public/img/叉号.png";
import { type } from '../../../auto-imports';
import { useEditThHook } from "./editTh.tsx";
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

const { formData, centerDialogVisible, clickFormItem, alarmLevelOptions, num, handleChange, submitFormThreshold } = useEditThHook()
const getValue = (item) => {
  if (item.type == "设备报警") {
    let unit = "";
    if (item.threshold) {
      return item.equipmentValue + item.threshold?.unit
    }
  }
  if (item.type = "环境报警") {
    return item.environmentValue + item.environment?.unitName
  }
  if (item.type == "物料报警") {
    return item.materialsValue + item.materials?.unit
  }
  if (item.type == "工艺节点报警") {
    return item.equipmentValue + item.threshold?.unit
  }
  return "未知"
}
const hisDeviceName = ref("")

function changeHisPag() {
  getHisTable()
}

// 修改获取设备数据颜色的方法
const getEquipmentDataColor = row => {
  if (row.threshold?.values?.length == 0) {
    return "white"
  }

  const value = Number(row.equipmentData);
  const thresholds = row.threshold.values;

  // 按照level等级排序
  const sortedThresholds = [...thresholds].sort((a, b) => {
    const levelA = Number(a.level.replace(/[^0-9]/g, ""));
    const levelB = Number(b.level.replace(/[^0-9]/g, ""));
    return levelB - levelA;
  });

  for (const threshold of sortedThresholds) {
    if (value >= threshold.min && value <= threshold.max) {
      // 根据不同等级返回不同颜色
      switch (threshold.level) {
        case "一级":
          return "#F53F3F"; // 紧急 - 红色
        case "紧急":
          return "#F53F3F"; // 紧急 - 红色
        case "二级":
          return "#FF7D00"; // 重要 - 橙色
        case "重要":
          return "#FF7D00"; // 重要 - 橙色
        case "三级":
          return "#FADC19"; // 一般 - 黄色
        case "中度":
          return "#FADC19"; // 一般 - 黄色
        case "四级":
          return "#168CFF"; // 一般 - 蓝色
        case "一般":
          return "#168CFF"; // 一般 - 绿色
        case "五级":
          return "#00B42A"; // 一般 - 绿色
        case "轻微":
          return "#00B42A"; // 一般 - 绿色

        default:
          return "white";
      }
    }
  }
  return "white";
};


const getEquipmentDataColorType = row => {
  if (row.threshold?.values?.length == 0) {
    return "white"
  }

  const value = Number(row.equipmentValue);
  const thresholds = row.threshold.values;

  // 按照level等级排序
  const sortedThresholds = [...thresholds].sort((a, b) => {
    const levelA = Number(a.level.replace(/[^0-9]/g, ""));
    const levelB = Number(b.level.replace(/[^0-9]/g, ""));
    return levelB - levelA;
  });
  console.log("row", row.equipmentValue)
  for (const threshold of sortedThresholds) {
    if (value >= threshold.min && value <= threshold.max) {
      // 根据不同等级返回不同颜色
      switch (threshold.level) {
        case "一级":
          return "#F53F3F"; // 紧急 - 红色
        case "紧急":
          return "#F53F3F"; // 紧急 - 红色
        case "二级":
          return "#FF7D00"; // 重要 - 橙色
        case "重要":
          return "#FF7D00"; // 重要 - 橙色
        case "三级":
          return "#FADC19"; // 一般 - 黄色
        case "中度":
          return "#FADC19"; // 一般 - 黄色
        case "四级":
          return "#168CFF"; // 一般 - 蓝色
        case "一般":
          return "#168CFF"; // 一般 - 绿色
        case "五级":
          return "#00B42A"; // 一般 - 绿色
        case "轻微":
          return "#00B42A"; // 一般 - 绿色

        default:
          return "white";
      }
    }
  }
  return "white";
};





//环境信息
const environmentFileFormData = ref({
  pageNum: 1,
  pageSize: 10,
  orderColumn: "createTime",
  orderDirection: "descending",
  // startTime:dayjs().format("YYYY-MM-DD"),
  // endTime:dayjs().add(1,"day").format("YYYY-MM-DD")
});
const environmentFileList = ref<any[]>([]);
const environmentFileFun = async () => {
  // environmentFileFormData.value.startTime = dayjs().format("YYYY-MM-DD");
  // environmentFileFormData.value.endTime = dayjs().add(1,"day").format("YYYY-MM-DD")
  const { data } = await environmentalDetectionList(environmentFileFormData.value);
  let list = data.data.rows.slice(0, 9);
  environmentFileList.value = list.map((item, index) => {
    return {
      ...item,
      status: false,
    };
  });
};

// 修改 getValueColorClass 方法
const getValueColorClass = row => {
  const value = row.value;
  const alarmLevels = row.environment?.alarmlevels || [];
  for (const level of alarmLevels) {
    if (value >= level.min && value <= level.max) {
      switch (level.level) {
        case "一级":
        case "紧急":
          return "text-urgent";
        case "二级":
        case "重要":
          return "text-important";
        case "三级":
        case "中度":
          return "text-warning";
        case "四级":
        case "一般":
          return "text-info";
        case "五级":
        case "轻微":
          return "text-success";
        default:
          return "";
      }
    }
  }
  return "text-info"; // 默认颜色
};

const environmentFileTimer = useIntervalFn(() => {
  environmentFileTimer.pause();
  environmentFileFun().finally(() => {
    environmentFileTimer.resume();
  })
}, 5000)

//历史告警统计
let bigscreenLBChart: any = null;
const bigscreenLBRef = ref();
let histData = ([])
let hisStart = "";
let hisEnd = "";
let hisIndex = 0;
let hisPage = ref(1);
let hisTotal = ref(0);
let hisPageSize = ref(10);
let hisList = ref([])
let hisDayType = ref("week");
const hisShow = ref(false);
// 修改报警级别样式映射函数
const getLevelStyle = (level: string) => {
  const colorMap = {
    一级: {
      color: "#F53F3F",
      backgroundColor: "#FFECE8",
      borderColor: "#F53F3F"
    },
    紧急: {
      color: "#F53F3F",
      backgroundColor: "#FFECE8",
      borderColor: "#F53F3F"
    },
    二级: {
      color: "#FF7D00",
      backgroundColor: "#FFF3E8",
      borderColor: "#FF7D00"
    },
    重要: {
      color: "#FF7D00",
      backgroundColor: "#FFF3E8",
      borderColor: "#FF7D00"
    },
    三级: {
      color: "#B99E00",
      backgroundColor: "#FFF7CC",
      borderColor: "#FADC19"
    },
    中度: {
      color: "#B99E00",
      backgroundColor: "#FFF7CC",
      borderColor: "#FADC19"
    },
    四级: {
      color: "#168CFF",
      backgroundColor: "#E8F3FF",
      borderColor: "#168CFF"
    },
    一般: {
      color: "#168CFF",
      backgroundColor: "#E8F3FF",
      borderColor: "#168CFF"
    },
    五级: {
      color: "#00B42A",
      backgroundColor: "#E8FFEA",
      borderColor: "#00B42A"
    },

    轻微: {
      color: "#00B42A",
      backgroundColor: "#E8FFEA",
      borderColor: "#00B42A"
    }
  };
  return (
    colorMap[level] || {
      color: "#000000",
      backgroundColor: "transparent",
      borderColor: "transparent"
    }
  );
};

const table = ref([]);
const bigscreenLBoption = {
  grid: {
    left: "6%",
    right: "6%",
    bottom: "6%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: [],
    axisLabel: {
      color: "#ffffff",
    },
  },
  yAxis: {
    type: "value",
    splitLine: {
      lineStyle: {
        type: "dashed",
        color: "rgba(255,255,255,0.14)",
      },
    },
    axisLabel: {
      color: "#ffffff",
    },
  },
  tooltip: {
    trigger: 'axis', //坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
    axisPointer: {// 坐标轴指示器，坐标轴触发有效
      type: 'line' // 默认为直线，可选为：'line' | 'shadow'
    },
    // formatter: function (params, index) {
    //   // console.log("params", params, index)
    //   // return `${params[0].name}<br/>${params[0].marker} ${params[0].seriesName} :${params[0].dataIndex}-- ${params[0].value}`;
    //   // 获取原来的数据
    //   // 获取数据的月份的开始和月的结束



    //   let html = "";
    //   if (histData.length === 0) {
    //     return html;
    //   }
    //   histData.forEach((item) => {
    //     const value = item.data[params[0].dataIndex];
    //     const type = item.type;
    //     html += `<div>${type}:${value}</div>`
    //   });
    //   return html;
    // }
  },
  series: [
    {
      data: [],
      type: "bar",
      itemStyle: {
        color: "#68B1A6", // 线条颜色
      },
    },
  ],

};
const historyStatisticsData = ref({
  dayType: "week",
});
const isInit = ref(false)
const changeHisList = () => {
  alarmEventsList({
    beginTime: hisStart,
    endTime: hisEnd,
    pageNum: 1,
    pageSize: 100,
    type: "设备报警",
    deviceName: hisDeviceName.value
  }).then((res) => {
    hisList.value = res.data.data.rows;
  })
}
const historyStatistics = async () => {
  const { data } = await getstatistics({
    dayType: historyStatisticsData.value.dayType,
  });

  let sum = new Array(data.data[0].times.length).fill(0);
  for (let i = 0; i < data.data.length; i++) {
    if (data.data[i].type == "设备报警") {
      for (let j = 0; j < data.data[i].data.length; j++) {
        sum[j] += data.data[i].data[j];
      }
    }
  }
  histData = data.data;
  // sum.forEach((item, index) => {
  //   data.data.forEach((element) => {
  //     item += element.data[index]
  //   });
  // });
  bigscreenLBoption.xAxis.data = data.data[0].times;
  bigscreenLBoption.series[0].data = sum;
  if (bigscreenLBRef.value) {
    if (!isInit.value) {
      bigscreenLBChart = echarts.init(bigscreenLBRef.value);
      bigscreenLBChart.off().on("click", params => {
        console.log("params", params)
        let cuData = "";
        let enData = "";
        hisShow.value = true;

        if (hisIndex != params.dataIndex || hisDayType.value != historyStatisticsData.value.dayType) {
          hisIndex = params.dataIndex;
          hisDayType.value = historyStatisticsData.value.dayType;
          if (historyStatisticsData.value.dayType === "week") {
            // 将年份换成今年的年份
            cuData = dayjs().subtract(6 - hisIndex, "day").startOf("day").format("YYYY-MM-DD");
            enData = dayjs(cuData).endOf("day").format("YYYY-MM-DD")
          } else {
            cuData = dayjs(params.name).startOf("month").format("YYYY-MM-DD")
            enData = dayjs(cuData).endOf("month").format("YYYY-MM-DD")
          }

          hisStart = cuData;
          hisEnd = enData;
          hisPage.value = 1
          hisPageSize.value = 10
          getHisTable();
          // alarmEventsList({
          //   beginTime: hisStart,
          //   endTime: hisEnd,
          //   pageNum: hisPage.value,
          //   pageSize: hisPageSize.value,
          //   type: "设备报警",
          //   deviceName: hisDeviceName.value
          // }).then((res) => {
          //   hisList.value = res.data.data.rows;
          // })
        }
      });
    }
    isInit.value = true;
    bigscreenLBChart.setOption(bigscreenLBoption, true);
  }

};

function getHisTable() {
  alarmEventsList({
    beginTime: hisStart,
    endTime: hisEnd,
    pageNum: hisPage.value,
    pageSize: hisPageSize.value,
    type: "设备报警",
    deviceName: hisDeviceName.value,
    orderColumn: "createTime",
    orderDirection: "descending",
  }).then((res) => {
    hisList.value = res.data.data.rows;
    hisTotal.value = res.data.data.total;
  })
}

const downloadFile = () => {
  exportAlarmEvents({
    pageNum: 1,
    pageSize: 100,
    beginTime: hisStart,
    endTime: hisEnd,
    type: "设备报警",
    deviceName: hisDeviceName.value
  }).then(res => {
    const blob = res.data instanceof Blob ? res.data : new Blob([res.data]);
    // 创建临时下载链接
    const downloadLink = URL.createObjectURL(res.data);
    // 创建一个链接元素（<a>标签）
    const linkElement = document.createElement("a");
    linkElement.href = downloadLink;
    // 设置下载时的文件名为Excel文件
    linkElement.download = "报警事件列表" + ".xlsx";

    // 触发链接元素的点击事件，以模拟用户点击下载链接
    linkElement.click();

    // 在下载完成后，释放临时下载链接
    URL.revokeObjectURL(downloadLink);
  })
}

const historyStatisticsTimer = useIntervalFn(() => {
  historyStatisticsTimer.pause();
  historyStatistics().finally(() => {
    historyStatisticsTimer.resume();
  })
}, 10000)

//设备数据
const equipmentFormData = ref({
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const equipmentlist = ref<any[]>([]);
const equipmentListFun = async () => {
  // const { data } = await thresholdList(equipmentFormData.value);
  // let list = data.data.rows;
  // equipmentlist.value = list;
  const { data } = await thresholdDataList(equipmentFormData.value);
  let list = data.data.rows;
  equipmentlist.value = list;
};

const equipmentListTimer = useIntervalFn(() => {
  equipmentListTimer.pause();
  equipmentListFun().finally(() => {
    equipmentListTimer.resume();
  })
}, 10000)

let bigscreenRTChart: any = null;
const bigscreenRTRef = ref();

const bigscreenRToption = {
  grid: {
    left: "6%",
    right: "6%",
    bottom: "6%",
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis', //坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
    axisPointer: {// 坐标轴指示器，坐标轴触发有效
      type: 'line' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  xAxis: {
    type: "category",
    data: [],
    axisLabel: {
      color: "#ffffff",
    },
  },
  yAxis: {
    type: "value",
    nameTextStyle: {
      color: "#ffffff",
      padding: [0, 30, 5, 0],
    },
    splitLine: {
      lineStyle: {
        type: "dashed",
        color: "rgba(255,255,255,0.14)",
      },
    },
    axisLabel: {
      color: "#ffffff",
    },
  },
  series: [
    {
      data: [],
      type: "bar",
      itemStyle: {
        color: "#68B1A6", // 线条颜色
      },
    },
  ],
};
const powerByAreaTotalStaticData = ref({
  des: "",
  dayType: "week",
  type: "电",
});
let powerInit = false;
const powerInfoList = ref([]);
let powerIndex = 0;
let powerArea = "";
let powetDayType = "week";
const rtShow = ref(false);
const powerByAreaTotalStaticFun = async () => {
  const { data } = await eventByAreaTotalStatic(
    powerByAreaTotalStaticData.value
  );
  bigscreenRToption.xAxis.data = data.data.times;
  bigscreenRToption.series[0].data = data.data.data;
  if (bigscreenRTRef.value) {
    if (!powerInit) {
      bigscreenRTChart = echarts.init(bigscreenRTRef.value);
      bigscreenRTChart.off().on("click", (params) => {
        rtShow.value = true
        if (params.dataIndex != powerIndex || params.name != powerArea || powetDayType != powerByAreaTotalStaticData.value.dayType) {
          powerIndex = params.dataIndex;
          powerArea = params.name;
          powetDayType = powerByAreaTotalStaticData.value.dayType;
          alarmTable.value.pageNum = 1;
          alarmTable.value.pageSize = 10;
          // alarmTable.value.beginTime = powetDayType == "week" ? dayjs().startOf("isoweek").format("YYYY-MM-DD") : dayjs().startOf("year").format("YYYY-MM-DD")
          // alarmTable.value.endTime = powetDayType == "week" ? dayjs().endOf("isoweek").format("YYYY-MM-DD") : dayjs().endOf("year").format("YYYY-MM-DD")
          alarmTable.value.beginTime = powetDayType == "week" ? dayjs().subtract(6, "day").format("YYYY-MM-DD") : dayjs().startOf("year").format("YYYY-MM-DD")
          alarmTable.value.endTime = powetDayType == "week" ? dayjs().format("YYYY-MM-DD") : dayjs().endOf("year").format("YYYY-MM-DD")
          alarmTable.value.area = params.name
          changeTableEvent()
        }

      })
    }
    powerInit = true;
    bigscreenRTChart.setOption(bigscreenRToption);
  }
};
const alarmTable = ref({
  pageNum: 1,
  pageSize: 10,
  beginTime: "",
  endTime: "",
  orderColumn: "createTime",
  orderDirection: "descending",
  area: "",
})
const alarmTableTotal = ref(0)
function changeTableEvent() {
  alarmEventsList({ ...alarmTable.value }).then(res => {
    powerInfoList.value = res.data.data.rows;
    console.log("powerInfoList", powerInfoList.value)
    alarmTableTotal.value = res.data.data.total;
  })
}
const closeRtShow = () => {
  rtShow.value = false;
}
const powerTimer = useIntervalFn(() => {
  powerTimer.pause();
  powerByAreaTotalStaticFun().finally(() => {
    powerTimer.resume();
  })
}, 5000)
const closeShow = () => {
  hisShow.value = false;
}

window.onresize = function () {
  bigscreenLBChart.resize();
  bigscreenRTChart.resize();
};


function tableHeaderColor(data) {
  return {
    backgroundColor: "#002547",
    color: "white",
  };
}

function handleChangeCellStyle({ row, column, rowIndex, columnIndex }) {
  return {
    backgroundColor: "#002547",
    color: "white",
  }
}


onMounted(() => {
  equipmentListFun();
  environmentFileFun();
  historyStatistics();
  powerByAreaTotalStaticFun();
});

onUnmounted(() => {
  environmentFileTimer.pause();
})
</script>

<style lang="scss" scoped>
$design-width: 1920;
$design-height: 1080;

@function adaptiveWidth($px) {
  @return #{$px / $design-width * 100}vw;
}

@function adaptiveHeight($px) {
  @return #{$px / $design-height * 100}vh;
}

@function adaptiveFontSize($px) {
  @return #{$px / $design-width * 100}vw;
}

.rt_table {
  width: adaptiveWidth(500);
  height: adaptiveHeight(400);
  position: absolute;
  top: adaptiveHeight(150);
  right: adaptiveWidth(470);
  z-index: 999;
  background-color: red;

}

.lb_table {
  width: adaptiveWidth(500);
  height: adaptiveHeight(400);
  position: fixed;
  left: adaptiveWidth(470);
  top: adaptiveHeight(600);
  z-index: 999;
  background-color: red;
}

.myInput {
  width: adaptiveWidth(200);
  position: relative;
  right: adaptiveWidth(70);
  display: flex;
}

.downloadMy {
  font-size: adaptiveWidth(20);
}

.ltTrendDialog {
  width: adaptiveWidth(500);
  height: adaptiveHeight(400);
  left: adaptiveWidth(470);
  top: adaptiveHeight(600);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  z-index: 10;
  position: fixed;

  .ltTrendDialog_top {
    width: 100%;
    height: adaptiveHeight(45);
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-size: adaptiveFontSize(20);
      color: #ffffff;
      padding-left: adaptiveWidth(15);
      font-family: youshe;
    }

    img {
      width: adaptiveWidth(8);
      height: adaptiveHeight(8);
      padding-right: adaptiveWidth(10);
      padding-top: adaptiveHeight(20);
      cursor: pointer;
    }
  }

  .ltTrendDialog_bottom {
    width: adaptiveWidth(450);
    height: calc(90% - adaptiveHeight(60));
    margin-left: adaptiveWidth(25);
    margin-top: adaptiveHeight(35);
  }

}


.rtTrendDialog {
  width: adaptiveWidth(500);
  height: adaptiveHeight(400);
  // left: adaptiveWidth(470);
  // top: adaptiveHeight(600);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  z-index: 10;
  position: fixed;

  .ltTrendDialog_top {
    width: 100%;
    height: adaptiveHeight(45);
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-size: adaptiveFontSize(20);
      color: #ffffff;
      padding-left: adaptiveWidth(15);
      font-family: youshe;
    }

    img {
      width: adaptiveWidth(8);
      height: adaptiveHeight(8);
      padding-right: adaptiveWidth(10);
      padding-top: adaptiveHeight(20);
      cursor: pointer;
    }
  }

  .ltTrendDialog_bottom {
    width: adaptiveWidth(450);
    height: calc(90% - adaptiveHeight(60));
    margin-left: adaptiveWidth(25);
    margin-top: adaptiveHeight(35);
  }

}



.text-urgent {
  color: #f53f3f !important;
}

.text-important {
  color: #ff7d00 !important;
}

.text-warning {
  color: #fadc19 !important;
}

.text-info {
  color: #168cff !important;
}

.text-success {
  color: #00b42a !important;
}

.bigscreen_lt,
.bigscreen_lb,
.bigscreen_rt,
.bigscreen_rb {
  width: adaptiveWidth(443);
  height: adaptiveHeight(445);
  position: relative;
  ;
}

.bigscreen_lt {
  position: absolute;
  top: adaptiveHeight(91);
  left: adaptiveWidth(26);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .bigscreen_lt_top {
    width: 100%;
    height: adaptiveHeight(40);
    background: url("/public/img/背景-上层(1).gif") no-repeat;
    background-size: 110% 110%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .bigscreen_lt_top_l {
      display: flex;
      align-items: center;

      img {
        margin-left: adaptiveWidth(11);
      }

      span {
        font-weight: 600;
        font-size: adaptiveFontSize(16);
        text-align: center;
        font-style: normal;
        text-transform: none;
        background: linear-gradient(to bottom,
            #c7e5fd 42%,
            #3582c7 100%);
        /* 渐变背景 */
        background-clip: text;
        /* 让背景应用到文本 */
        -webkit-text-fill-color: transparent;
        /* 使文本颜色透明 */
        padding-left: adaptiveWidth(10);
      }
    }

    .bigscreen_lt_top_r {
      color: #ffffff;
      font-size: adaptiveFontSize(14);
      margin-right: adaptiveWidth(11);
      cursor: pointer;
    }
  }

  .bigscreen_lt_bottom {
    width: 100%;
    height: adaptiveHeight(406);
    margin-top: adaptiveHeight(5);
    background: url("/public/img/bigback.png") no-repeat;
    background-size: 100% 100%;

    .bigscreen_lt_bottom_nei {
      width: adaptiveWidth(407);
      margin: 0 auto;

      .bigscreen_lt_bottom_neib {
        width: 100%;
        height: adaptiveHeight(350);
        overflow: hidden;
      }

      .bigscreen_lt_bottom_nei_t {
        width: 100%;
        height: adaptiveHeight(30);
        margin-top: adaptiveHeight(15);
        background: url("/public/img/equipment/tabletop.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          width: 33%;
          color: #9eabb7;
          font-size: adaptiveFontSize(14);
          text-align: center;
        }
      }

      .bigscreen_lt_bottom_nei_b {
        width: 100%;
        height: adaptiveHeight(33);
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: adaptiveHeight(5);
        cursor: pointer;
        background: url("/public/img/craftsmanship/yaosuback.png") no-repeat;
        background-size: 100% 100%;
        margin-bottom: adaptiveHeight(5);

        span {
          width: 33%;
          color: #ffffff;
          font-size: adaptiveFontSize(12);
          text-align: center;
          white-space: nowrap;
          /* 禁止换行 */
          overflow: hidden;
          /* 超出内容隐藏 */
          text-overflow: ellipsis;
          /* 显示省略号 */
        }
      }
    }
  }
}

.bigscreen_lb {
  position: absolute;
  bottom: adaptiveHeight(85);
  left: adaptiveWidth(26);

  .bigscreen_lb_top {
    width: 100%;
    height: adaptiveHeight(40);
    background: url("/public/img/背景-上层(1).gif") no-repeat;
    background-size: 110% 110%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .bigscreen_lb_top_l {
      display: flex;
      align-items: center;

      img {
        margin-left: adaptiveWidth(11);
      }

      span {
        font-weight: 600;
        font-size: adaptiveFontSize(16);
        text-align: center;
        font-style: normal;
        text-transform: none;
        background: linear-gradient(to bottom,
            #c7e5fd 42%,
            #3582c7 100%);
        /* 渐变背景 */
        background-clip: text;
        /* 让背景应用到文本 */
        -webkit-text-fill-color: transparent;
        /* 使文本颜色透明 */
        padding-left: adaptiveWidth(10);
      }
    }
  }

  .bigscreen_lb_bottom {
    width: 100%;
    height: adaptiveHeight(406);
    margin-top: adaptiveHeight(5);
    background: url("/public/img/bigback.png") no-repeat;
    background-size: 100% 100%;

    .bigscreen_lb_bottom_nei {
      width: 100%;
      height: 100%;
    }
  }
}

.bigscreen_rt {
  position: absolute;
  top: adaptiveHeight(91);
  right: adaptiveWidth(26);

  .bigscreen_rt_top {
    width: 100%;
    height: adaptiveHeight(40);
    background: url("/public/img/背景-上层(1).gif") no-repeat;
    background-size: 110% 110%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .bigscreen_rt_top_l {
      display: flex;
      align-items: center;

      img {
        margin-left: adaptiveWidth(11);
      }

      span {
        font-weight: 600;
        font-size: adaptiveFontSize(16);
        text-align: center;
        font-style: normal;
        text-transform: none;
        background: linear-gradient(to bottom,
            #c7e5fd 42%,
            #3582c7 100%);
        /* 渐变背景 */
        background-clip: text;
        /* 让背景应用到文本 */
        -webkit-text-fill-color: transparent;
        /* 使文本颜色透明 */
        padding-left: adaptiveWidth(10);
      }
    }
  }

  .bigscreen_rt_bottom {
    width: 100%;
    height: adaptiveHeight(406);
    margin-top: adaptiveHeight(5);
    background: url("/public/img/bigback.png") no-repeat;
    background-size: 100% 100%;
    position: relative;

    .bigscreen_rt_bottom_nei {
      width: 100%;
      height: 100%;
    }
  }
}

.bigscreen_rb {
  position: absolute;
  bottom: adaptiveHeight(85);
  right: adaptiveWidth(26);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .bigscreen_rb_top {
    width: 100%;
    height: adaptiveHeight(40);
    background: url("/public/img/背景-上层(1).gif") no-repeat;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-size: 110% 110%;

    .bigscreen_rb_top_l {
      display: flex;
      align-items: center;

      img {
        margin-left: 11px;
      }

      span {
        font-weight: 600;
        font-size: adaptiveFontSize(16);
        text-align: center;
        font-style: normal;
        text-transform: none;
        background: linear-gradient(to bottom,
            #c7e5fd 42%,
            #3582c7 100%);
        /* 渐变背景 */
        background-clip: text;
        /* 让背景应用到文本 */
        -webkit-text-fill-color: transparent;
        /* 使文本颜色透明 */
        padding-left: adaptiveWidth(10);
      }
    }

    .bigscreen_rb_top_r {
      display: flex;
      align-items: center;
      margin-right: 11px;
    }
  }

  .bigscreen_rb_bottom {
    width: 100%;
    height: adaptiveHeight(406);
    margin-top: adaptiveHeight(5);
    background: url("/public/img/bigback.png") no-repeat;
    background-size: 100% 100%;

    .bigscreen_rb_bottom_nei {
      width: adaptiveWidth(407);
      margin: 0 auto;

      .bigscreen_rb_bottom_nei_t {
        width: 100%;
        height: adaptiveHeight(30);
        margin-top: adaptiveHeight(15);
        background: url("/public/img/equipment/tabletop.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          width: 25%;
          color: #9eabb7;
          font-size: adaptiveFontSize(14);
          text-align: center;
        }
      }

      .bigscreen_rb_bottom_neib {
        width: 100%;
        height: adaptiveHeight(350);
        overflow: hidden;

        .bigscreen_rb_bottom_nei_b {
          width: 100%;
          height: adaptiveHeight(33);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: adaptiveHeight(5);
          background: url("/public/img/craftsmanship/yaosuback.png") no-repeat;
          background-size: 100% 100%;
          margin-bottom: adaptiveHeight(5);

          span {
            width: 25%;
            color: #ffffff;
            font-size: adaptiveFontSize(12);
            white-space: nowrap;
            /* 禁止换行 */
            overflow: hidden;
            /* 超出内容隐藏 */
            text-overflow: ellipsis;
            /* 显示省略号 */
            text-align: center;
          }
        }
      }
    }
  }
}

.ltDialog {
  width: adaptiveWidth(440);
  height: adaptiveHeight(280);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: adaptiveHeight(100);
  left: adaptiveWidth(480);
  z-index: 10;

  .ltDialog_top {
    width: 100%;
    height: adaptiveHeight(45);
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-size: adaptiveFontSize(20);
      color: #ffffff;
      padding-left: adaptiveWidth(15);
      font-family: youshe;
    }

    img {
      width: adaptiveWidth(8);
      height: adaptiveHeight(8);
      padding-right: adaptiveWidth(10);
      cursor: pointer;
    }
  }

  .ltDialog_bottom {
    width: adaptiveWidth(420);
    height: adaptiveHeight(215);
  }
}

:deep(.selectcss) {
  .el-select__wrapper {
    background-color: transparent !important;
  }

  .el-select__placeholder {
    color: #ffffff !important;
  }

  .el-select__selected-item {
    color: #ffffff !important;
  }
}

.inputcss :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: none;
}

.scroll {
  height: adaptiveHeight(195);
  width: 100%;
  overflow: hidden;
}

.group {
  margin-right: adaptiveWidth(11);
}

.group :deep(.el-radio-button.is-active .el-radio-button__original-radio:not(:disabled) + .el-radio-button__inner) {
  background: rgba(255, 255, 255, 0.8);
  color: rgba(7, 36, 57, 1);
  border-color: rgba(255, 255, 255, 0);
  font-size: adaptiveFontSize(12);
}

.group :deep(.el-radio-button .el-radio-button__inner) {
  padding: adaptiveWidth(2) adaptiveHeight(6);
  background: rgba(255, 255, 255, 0);
  border-color: rgba(255, 255, 255, 0);
  font-size: adaptiveFontSize(12);
  border-radius: 2px;
}

#popperHis :deep(> ul > li) {
  --el-pagination-button-color: white;
  background: transparent !important;
}

#popperHis :deep(button) {
  background: transparent !important;
}

#popperHiss :deep(> ul > li) {
  --el-pagination-button-color: white;
  background: transparent !important;
}

#popperHiss :deep(button) {
  background: transparent !important;
}
</style>
