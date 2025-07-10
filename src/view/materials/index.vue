<template>
  <div class="bigscreen_lt">
    <div class="bigscreen_lt_top">
      <div class="bigscreen_lt_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>报警信息</span>
      </div>
    </div>
    <div class="bigscreen_lt_bottom">
      <div @mouseenter="alarmInfomationTimer.pause()" @mouseleave="alarmInfomationTimer.resume()"
        class="bigscreen_lt_bottom_neis">
        <Vue3SeamlessScroll :list="alarmInformationlist" :step="1" :singleHeight="70" hover class="scrool">
          <div class="bigscreen_lt_bottom_nei" v-for="item in alarmInformationlist">
            <img :src="item.img" alt="" />
            <div class="bigscreen_lt_bottom_nei_r">
              <span style="padding-left: 25px">{{ item.materials?.name }}</span>
              <span>{{
                dayjs(item.materials?.createTime).format("YYYY-MM-DD")
              }}</span>
              <span>{{ item.level }}</span>
            </div>
          </div>
        </Vue3SeamlessScroll>
      </div>
    </div>
  </div>
  <div class="bigscreen_lc">
    <div class="bigscreen_lc_top">
      <div class="bigscreen_lc_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>库存信息</span>
      </div>
      <el-radio-group v-model="materialsStatisticsData.dayType" class="group" @change="materiaChange">
        <el-radio-button label="周" value="week" />
        <el-radio-button label="年" value="year" />
      </el-radio-group>
    </div>
    <div class="bigscreen_lc_bottom">
      <el-select size="small" class="selectcss" v-model="materialsStatisticsData.materialsId" @change="materialsChange"
        style="
          width: 80px;
          position: absolute;
          right: 20px;
          top: 15px;
          z-index: 100;
        ">
        <el-option v-for="item in materialFileslist" :key="item.materialsId" :label="item.name"
          :value="item.materialsId" />
      </el-select>
      <div class="bigscreen_lc_bottom_nei" ref="bigscreenLCRef"></div>
    </div>
  </div>
  <div class="bigscreen_lb">
    <div class="bigscreen_lb_top">
      <div class="bigscreen_lb_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>物料类型</span>
      </div>
      <el-select size="small" class="selectcss" v-model="materialsName" @change="dosagetypeStatisticsFun"
        style="width: 80px; position: absolute; right: 20px; z-index: 100">
        <el-option label="营养物质类" value="营养物质类" />
        <el-option label="反应调节类" value="反应调节类" />
        <el-option label="监测分析类" value="监测分析类" />
        <el-option label="生产核心原料类" value="生产核心原料类" />
        <el-option label="耗材类" value="耗材类" />
      </el-select>
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
        <span>用量类型分析</span>
      </div>
    </div>
    <div class="bigscreen_rt_bottom">
      <div class="bigscreen_rt_bottom_nei" ref="bigscreenRTRef"></div>
    </div>
  </div>
  <div class="bigscreen_rc">
    <div class="bigscreen_rc_top">
      <div class="bigscreen_rc_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>用量趋势分析</span>
      </div>
      <div class="pickerCss">
        <img src="/public/img/zuo.svg" alt="" @click="timeLeftClick" style="margin-left: 5px" />
        <span>
          {{ dayjs(receivestatisticsData.startTime).format("MM月DD日") }}
        </span>
        <span>-</span>
        <span>
          {{ dayjs(receivestatisticsData.endTime).format("MM月DD日") }}
        </span>
        <img src="/public/img/you.svg" alt="" @click="timeRightClick" style="margin-right: 5px" />
      </div>
    </div>
    <div class="bigscreen_rc_bottom">
      <el-select size="small" class="selectcss" v-model="receivestatisticsData.materialsId"
        @change="receivestatisticsFun" style="
          width: 80px;
          position: absolute;
          right: 20px;
          top: 15px;
          z-index: 100;
        ">
        <el-option v-for="item in materialFileslist" :key="item.materialsId" :label="item.name"
          :value="item.materialsId" />
      </el-select>
      <div class="bigscreen_rc_bottom_nei" ref="bigscreenRCRef"></div>
    </div>
  </div>
  <div class="bigscreen_rb">
    <div class="bigscreen_rb_top">
      <div class="bigscreen_rb_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>领用记录</span>
      </div>
      <div class="bigscreen_rb_top_r" @click="rbClick">
        <span>领用统计分析</span>
      </div>
    </div>
    <div class="bigscreen_rb_bottom">
      <div class="bigscreen_rb_bottom_nei">
        <div class="bigscreen_rb_bottom_nei_t">
          <span>物料名称</span>
          <span>领用时间</span>
          <span>领用人员</span>
          <span>领用数量</span>
        </div>
        <div class="bigscreen_rb_bottom_neib">
          <Vue3SeamlessScroll :list="receivelist" :class-option="{
            step: 5,
          }" hover class="scrool">
            <!-- @click="changeMaterials" -->
            <div @click="changeMaterials(item)" class="bigscreen_rb_bottom_nei_b" v-for="(item, index) in receivelist">
              <span>
                <img src="/public/img/equipment/tableicon.png" alt="" v-if="item.status" />
                {{ item.materialsInfo.name }}
              </span>
              <span>{{ dayjs(item.createTime).format("YYYY-MM-DD") }} </span>
              <span>{{ item.receiverInfo.name }}</span>
              <span>{{ item.receiveNum }}</span>
            </div>
          </Vue3SeamlessScroll>
        </div>
      </div>
    </div>
  </div>

  <div v-if="rbstatus" class="rbDialog">
    <div class="rbDialog_top">
      <span>领用统计分析</span>
      <img :src="img9" alt="" srcset="" @click="rbcanleClick" />
    </div>
    <div class="rbDialog_bottom">
      <el-input class="inputcss" v-model="receiveFormData2.materialName" @change="receivelistFun2"
        style="width: 148px; height: 24px" placeholder="请输入物料名称" :prefix-icon="Search" />
      <el-scrollbar  class="bigscreen_rc_bottom_nei">
        <div class="bigscreen_rc_bottom_l">
          <img src="/public/img/圆形标记.png" alt="" />
        </div>
        <div class="bigscreen_rc_bottom_r">
            <div v-for="(item, index) in receivelist2" :key="index" class="bigscreen_rc_bottom_rnei">
            <span style="color: rgba(172, 223, 255, 1); font-size: 11px">{{
              dayjs(item.createTime).format("YYYY-MM-DD")
            }}</span>
            <div :style="{
              background: `url(${item.background}) no-repeat`,
              'background-size': '100% 100%',
            }">
              <span>领用人员：{{ item.receiverInfo.name }}</span>
              <span>领用数量：{{ item.receiveNum }}</span>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import {
  receiveList,
  getstatistics,
  materialFilesList,
  receivestatistics,
  typeStatistics,
  dosagetypeStatistics,
  materialFilesInfo,
  allByReceiveExplain,
} from "../../api/materials/index";
import { alarmEventsList, alarmMateEventsList } from "../../api/incident/index";
import dayjs from "dayjs";
import center from "../../components/center.vue";
import img9 from "../../../public/img/叉号.png";
import { Search } from "@element-plus/icons-vue";
import { useIntervalFn } from "@vueuse/core";

//报警信息
const alarmInformationData = ref({
  type: "物料报警",
  pageNum: 1,
  pageSize: 10,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const alarmInformationlist = ref<any[]>([]);
const alarmInformationlistFun = async () => {
  const { data } = await alarmMateEventsList(alarmInformationData.value);
  let list = data.data.rows;
  let imgList = [
    {
      level: "轻微",
      img: "/img/lvse_icon.png",
    },
    {
      level: "一般",
      img: "/img/siji_icon.png",
    },
    {
      level: "中度",
      img: "/img/sanji_icon.png",
    },
    {
      level: "重要",
      img: "/img/erji_icon.png",
    },
    {
      level: "紧急",
      img: "/img/yiji_icon.png",
    },
  ];
  list.forEach((item) => {
    let level = "未知";
    item.materials?.values?.forEach(v =>{
      const isExit =  (v.scondition === "小于等于" && item.stock <= v.value) ||
      (v.scondition === "大于等于" && item.stock >= v.value) ||
      (v.scondition === "大于等于" && item.stock >= v.value) ||
      (v.scondition === "小于" && item.stock < v.value) ||
      (v.scondition === "大于" && item.stock > v.value);
      if (isExit) {
        level = v.level;
        item.level = level;
      }
    })
    if (level === "未知") {
      item.level = "轻微";
    }
  });
  alarmInformationlist.value = list.map((item) => {
    const matchedLevel = imgList.find((v) => v.level === item.level);
    return {
      ...item,
      img: matchedLevel ? matchedLevel.img : "",
      status: "库存异常",
    };
  });
};

const alarmInfomationTimer = useIntervalFn(() => {
  alarmInfomationTimer.pause();
  alarmInformationlistFun().finally(() => {
    alarmInfomationTimer.resume();
  })
}, 100000)

//领用记录
const receiveFormData = ref({
  materialName: "",
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const receivelist = ref<any[]>([]);
const rbstatus = ref(false);
const receivelistFun = async () => {
  const { data } = await receiveList(receiveFormData.value);
  receivelist.value = data.data.rows;
  console.log("receivelist", receivelist.value);
};
const rbClick = async () => {
  rbstatus.value = !rbstatus.value;
  await receivelistFun2();
};
const rbcanleClick = () => {
  rbstatus.value = false;
};

const receiveFormData2 = ref({
  materialName: "",
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const receivelist2 = ref<any[]>([]);
const receivelistFun2 = async () => {
  const { data } = await receiveList(receiveFormData2.value);
  receivelist2.value = data.data.rows;
};

//库存分析
let bigscreenLCChart: any = null;
const bigscreenLCRef = ref();
const bigscreenLCoption = {
  grid: {
    left: "6%",
    right: "6%",
    bottom: "6%",
    top: "24%",
    containLabel: true,
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: [],
    axisLabel: {
      color: "rgba(255, 255, 255, 0.65)",
    },
  },
  yAxis: {
    type: "value",
    splitLine: {
      lineStyle: {
        //网格样式
        color: ["rgba(255, 255, 255, 0.15)"], //网格的颜色
        type: "dashed", //网格是实实线，可以修改成虚线以及其他的类型
      },
    },
    axisLabel: {
      color: "rgba(255, 255, 255, 0.65)",
    },
  },
  series: [
    {
      data: [],
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: {
        color: "rgba(61, 230, 255, 1)", // 线条颜色
      },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgba(61, 230, 255, 0.5)", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "rgba(61, 230, 255, 0)", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
    },
  ],
};
const materiaStatus = ref("week");
const materialsId = ref<number | null>(null);
const materialFiles = ref({
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const materialFileslist = ref<any[]>([]);
const materialFilesListFun = async () => {
  const { data } = await materialFilesList(materialFiles.value);
  materialFileslist.value = data.data.rows;
  materialsStatisticsData.value.materialsId = data.data.rows[0].materialsId;
  receivestatisticsData.value.materialsId = data.data.rows[0].materialsId;
  await materialsStatistics();
  await receivestatisticsFun();
  await dosagetypeStatisticsFun();
};
const materialsStatisticsData = ref({
  materialsId: null,
  dayType: "week",
});
const materialsStatistics = async () => {
  const { data } = await getstatistics(materialsStatisticsData.value);
  bigscreenLCoption.xAxis.data = data.data.xaxisData;
  bigscreenLCoption.series[0].data = data.data.seriesData;
  if (bigscreenLCRef.value) {
    bigscreenLCChart = echarts.init(bigscreenLCRef.value);
  }
  bigscreenLCChart.setOption(bigscreenLCoption);
};
const materiaChange = async (val) => {
  materiaStatus.value = val;
  await materialsStatistics();
};
const materialsChange = async (val) => {
  materialsId.value = val;
  await alarmInformationlistFun();
  await materialsStatistics();
  if (bigscreenLCRef.value) {
    bigscreenLCChart.setOption(bigscreenLCoption);
  }
};

const changeMaterials = (item)=>{
  rbstatus.value = true
  receiveFormData2.value.materialName = item.materialsInfo.name;
  receivelistFun2();
  // receiveFormData2.value.materialName = item;
}

//物料类型统计
let bigscreenLBChart: any = null;
const bigscreenLBRef = ref();
const materialsName = ref<string>("营养物质类");
const bigscreenLBoption = {
  grid: {
    left: "6%",
    right: "6%",
    bottom: "6%",
    top: "24%",
    containLabel: true,
  },

  tooltip: {
    trigger: "item",
  },
  series: [
    {
      // name: "Access From",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
      ],
    },
  ],
};
const dosagetypeStatisticsFun = async () => {
  const { data } = await dosagetypeStatistics({ name: materialsName.value });
  bigscreenLBoption.series[0].data = data.data.map((item) => {
    return {
      value: item.count,
      name: item.materialsType,
    };
  });
  if (bigscreenLBRef.value) {
    bigscreenLBChart = echarts.init(bigscreenLBRef.value);
    bigscreenLBChart.setOption(bigscreenLBoption);
  }
};

const typeStatisticsFun = async () => {
  const { data } = await typeStatistics();
};

//用量类型分析
let bigscreenRTChart: any = null;
const bigscreenRTRef = ref();
const bigscreenRToption = {
  grid: {
    left: "6%",
    right: "6%",
    bottom: "6%",
    top: "24%",
    containLabel: true,
  },

  legend: {
    data: [
      {
        name: "生产领用",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#3EE6FF" }, // 浅色（顶部）
            { offset: 1, color: "#258A99" }, // 深色（底部）
          ]),
        },
      },
      {
        name: "研发领用",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#FF72A6" }, // 浅色（顶部）
            { offset: 1, color: "#FF3657" }, // 深色（底部）
          ]),
        },
      },
      {
        name: "其他领用",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#549CF0" }, // 浅色（顶部）
            { offset: 1, color: "#2070CE" }, // 深色（底部）
          ]),
        },
      },
    ],
    top: "20px",
    textStyle: {
      color: "#ffffff",
    },
  },

  tooltip: {},
  dataset: {
    source: [],
  },
  xAxis: {
    type: "category",
    axisLabel: {
      color: "rgba(255, 255, 255, 0.65)",
    },
  },
  yAxis: {
    axisLabel: {
      color: "rgba(255, 255, 255, 0.65)",
    },
    splitLine: {
      lineStyle: {
        //网格样式
        color: ["rgba(255, 255, 255, 0.15)"], //网格的颜色
        type: "dashed", //网格是虚线
      },
    },
  },
  series: [
    {
      type: "bar",
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#3EE6FF" }, // 浅色（顶部）
          { offset: 1, color: "#258A99" }, // 深色（底部）
        ]),
      },
    },
    {
      type: "bar",
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#FF72A6 " }, // 浅色（顶部）
          { offset: 1, color: "#FF3657" }, // 深色（底部）
        ]),
      },
    },
    {
      type: "bar",
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#549CF0" }, // 浅色（顶部）
          { offset: 1, color: "#2070CE" }, // 深色（底部）
        ]),
      },
    },
  ],
};
const allByReceiveExplainFun = async () => {
  const { data } = await allByReceiveExplain();
  updateBigscreenRToption(
    data.xdata,
    data.productionData,
    data.researchData,
    data.otherData
  );
  if (bigscreenRTRef.value) {
    bigscreenRTChart = echarts.init(bigscreenRTRef.value);
    bigscreenRTChart.setOption(bigscreenRToption);
  }
};
const updateBigscreenRToption = (
  xdata: string[],
  productionData: number[],
  researchData: number[],
  otherData: number[]
) => {
  bigscreenRToption.dataset.source = [
    ["product", "生产领用", "研发领用", "其他领用"], // 表头
    ...xdata.map((item, index) => [
      item,
      productionData[index] || 0,
      researchData[index] || 0,
      otherData[index] || 0,
    ]),
  ];
};

//用量趋势分析
let bigscreenRCChart: any = null;
const bigscreenRCRef = ref();
const bigscreenRCoption = {
  grid: {
    left: "6%",
    right: "6%",
    bottom: "6%",
    top: "24%",
    containLabel: true,
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: [],
    axisLabel: {
      color: "rgba(255, 255, 255, 0.65)",
    },
  },
  yAxis: {
    type: "value",
    splitLine: {
      lineStyle: {
        //网格样式
        color: ["rgba(255, 255, 255, 0.15)"], //网格的颜色
        type: "dashed", //网格是实实线，可以修改成虚线以及其他的类型
      },
    },
    axisLabel: {
      color: "rgba(255, 255, 255, 0.65)",
    },
  },
  series: [
    {
      data: [],
      type: "line",
      smooth: true,
      symbol: "none",
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "rgba(54, 161, 255, 0.60)", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "rgba(25, 104, 255, 0)", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
    },
  ],
};
const receivestatisticsData = ref({
  materialsId: null,
  materialsName: "",
  startTime: dayjs().subtract(6, 'day').startOf("day").format("YYYY-MM-DD HH:mm:ss"),
  endTime: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
});
const receivestatisticsFun = async () => {
  const { data } = await receivestatistics(receivestatisticsData.value);

  bigscreenRCoption.xAxis.data = data.time;
  bigscreenRCoption.series[0].data = data.data;
  if (bigscreenRCRef.value) {
    bigscreenRCChart = echarts.init(bigscreenRCRef.value);
    bigscreenRCChart.setOption(bigscreenRCoption);
  }
  console.log("====================asd")
};
const timeLeftClick = () => {
 
  receivestatisticsData.value.startTime = dayjs(receivestatisticsData.value.startTime)
    .subtract(7, "day")
    .startOf("day")
    .format("YYYY-MM-DD HH:mm:ss");
  receivestatisticsData.value.endTime = dayjs(receivestatisticsData.value.endTime)
    .subtract(7, "day")
    .endOf("day")
    .format("YYYY-MM-DD HH:mm:ss");
  receivestatisticsFun(); // 更新数据
};
const timeRightClick = () => {

  receivestatisticsData.value.startTime = dayjs(receivestatisticsData.value.startTime )
    .add(7, "day")
    .startOf("day")
    .format("YYYY-MM-DD HH:mm:ss");
  receivestatisticsData.value.endTime = dayjs(receivestatisticsData.value.endTime )
    .add(7, "day")
    .endOf("day")
    .format("YYYY-MM-DD HH:mm:ss");
  receivestatisticsFun(); // 更新数据
};

window.onresize = function () {
  bigscreenLCChart.resize();
  bigscreenLBChart.resize();
  bigscreenRTChart.resize();
  bigscreenRCChart.resize();
};

onMounted(() => {
  receivelistFun();
  alarmInformationlistFun();
  materialFilesListFun();
  receivestatisticsFun();
  typeStatisticsFun();
  allByReceiveExplainFun();
});
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

.bigscreen_lt,
.bigscreen_lc,
.bigscreen_lb,
.bigscreen_rt,
.bigscreen_rc,
.bigscreen_rb {
  width: adaptiveWidth(443);
  height: adaptiveHeight(292);
}

.bigscreen_lt {
  position: absolute;
  top: adaptiveHeight(91);
  left: adaptiveWidth(26);

  .bigscreen_lt_top {
    width: 100%;
    height: adaptiveHeight(40);
    background: url("/public/img/背景-上层(1).gif") no-repeat;
    background-size: 110% 110%;
    display: flex;
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
  }

  .bigscreen_lt_bottom {
    width: 100%;
    height: adaptiveHeight(251);
    margin-top: adaptiveHeight(5);
    background: url("/public/img/背景下层.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .bigscreen_lt_bottom_neis {
      overflow: hidden;
      height: adaptiveHeight(251);

      .bigscreen_lt_bottom_nei {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        img {
          width: adaptiveWidth(52);
          height: adaptiveHeight(59);
          margin-left: adaptiveWidth(40);
        }

        &:nth-child(2) {
          margin: adaptiveHeight(15) 0;
        }

        .bigscreen_lt_bottom_nei_r {
          width: calc(100% - adaptiveWidth(132));
          margin-left: adaptiveWidth(20);
          background: url("/public/img/back.png") no-repeat;
          background-size: 100% 100%;
          height: adaptiveHeight(33);
          margin-right: adaptiveWidth(40);
          display: flex;
          justify-content: space-between;
          align-items: center;

          span {
            width: 33%;
            color: #ffffff;
            font-size: adaptiveFontSize(14);
            text-align: center;

            &:nth-child(3) {
              font-size: adaptiveFontSize(20);
              font-family: youshe;
              text-align: end;
              font-style: normal;
              text-transform: none;
              background: linear-gradient(to bottom,
                  #ffffff 30%,
                  #3582c7 100%);
              /* 渐变背景 */
              background-clip: text;
              /* 让背景应用到文本 */
              -webkit-text-fill-color: transparent;
              /* 使文本颜色透明 */
            }
          }
        }
      }
    }
  }
}

.bigscreen_lc {
  position: absolute;
  top: adaptiveHeight(395);
  left: adaptiveWidth(26);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .bigscreen_lc_top {
    width: 100%;
    height: adaptiveHeight(40);
    background: url("/public/img/背景-上层(1).gif") no-repeat;
    background-size: 110% 110%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .bigscreen_lc_top_l {
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

  .bigscreen_lc_bottom {
    width: 100%;
    height: adaptiveHeight(251);
    margin-top: adaptiveHeight(5);
    background: url("/public/img/背景下层.png") no-repeat;
    background-size: 100% 100%;
    position: relative;

    .bigscreen_lc_bottom_nei {
      width: 100%;
      height: 100%;
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
        line-height: 19px;
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
    height: adaptiveHeight(251);
    margin-top: adaptiveHeight(5);
    background: url("/public/img/背景下层.png") no-repeat;
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
    height: adaptiveHeight(251);
    margin-top: adaptiveHeight(5);
    background: url("/public/img/背景下层.png") no-repeat;
    background-size: 100% 100%;

    .bigscreen_rt_bottom_nei {
      width: 100%;
      height: 100%;
    }
  }
}

.bigscreen_rc {
  position: absolute;
  top: adaptiveHeight(395);
  right: adaptiveWidth(26);

  .bigscreen_rc_top {
    width: 100%;
    height: adaptiveHeight(40);
    background: url("/public/img/背景-上层(1).gif") no-repeat;
    background-size: 110% 110%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .bigscreen_rc_top_l {
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

  .bigscreen_rc_bottom {
    width: 100%;
    height: adaptiveHeight(251);
    margin-top: adaptiveHeight(5);
    background: url("/public/img/背景下层.png") no-repeat;
    background-size: 100% 100%;
    position: relative;

    .bigscreen_rc_bottom_nei {
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

    .bigscreen_rb_top_r {
      display: flex;
      align-items: center;
      color: #ffffff;
      cursor: pointer;
      font-size: adaptiveFontSize(12);
      margin-right: adaptiveWidth(11);
    }
  }

  .bigscreen_rb_bottom {
    width: 100%;
    height: adaptiveHeight(251);
    margin-top: adaptiveHeight(5);
    background: url("/public/img/背景下层.png") no-repeat;
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
          font-size: adaptiveFontSize(14);
          color: #9eabb7;
          text-align: center;
        }
      }

      .bigscreen_rb_bottom_neib {
        width: 100%;
        height: adaptiveHeight(200);
        overflow: hidden;

        .bigscreen_rb_bottom_nei_b {
          width: 100%;
          height: adaptiveHeight(33);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: adaptiveHeight(5);

          span {
            width: 25%;
            color: #ffffff;
            font-size: adaptiveFontSize(12);
            text-align: center;
          }
        }
      }
    }
  }
}

.rbDialog {
  width: adaptiveWidth(440);
  height: adaptiveHeight(280);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  bottom: adaptiveHeight(90);
  right: adaptiveWidth(480);
  z-index: 10;

  .rbDialog_top {
    width: 100%;
    height: adaptiveHeight(45);
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-family: youshe;
      font-size: adaptiveFontSize(20);
      color: #ffffff;
      padding-left: adaptiveWidth(15);
    }

    img {
      width: adaptiveWidth(8);
      height: adaptiveHeight(8);
      padding-right: adaptiveWidth(10);
      cursor: pointer;
    }
  }

  .rbDialog_bottom {
    width: adaptiveWidth(420);
    height: adaptiveHeight(200);
    margin: adaptiveHeight(10) auto;
    position: relative;

    :deep(.bigscreen_rc_bottom_nei) {
      .el-scrollbar__view {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .bigscreen_rc_bottom_l {
          width: adaptiveWidth(20);
          height: adaptiveHeight(187);
          background: url("/img/线.png") no-repeat;
          background-size: 2px 100%;
          background-position: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bigscreen_rc_bottom_r {
          width: adaptiveWidth(381);
          height: adaptiveHeight(187);
          margin-left: adaptiveFontSize(15);
          overflow-y: scroll !important;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;

          .bigscreen_rc_bottom_rnei {
            width: 100%;
            height: adaptiveHeight(57);
            margin-top: adaptiveHeight(5);
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            div {
              width: 100%;
              height: adaptiveHeight(38);
              display: flex;
              align-items: center;

              span {
                color: rgba(255, 255, 255, 1);
                font-size: adaptiveFontSize(12);

                &:nth-child(1) {
                  margin-left: adaptiveWidth(10);
                }

                &:nth-child(2) {
                  margin-left: adaptiveWidth(20);
                }
              }
            }
          }
        }
      }
    }
  }
}

.pickerCss {
  width: 135px;
  height: 24px;
  border: 1px solid rgba(227, 233, 243, 0.2);
  border-radius: 5px;
  margin-right: 11px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    color: #ffffff;
    font-size: 12px;
  }
}

:deep(.selectcss) {
  .el-select__wrapper {
    background-color: transparent !important;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
  }

  .el-select__placeholder {
    color: rgba(255, 255, 255, 0.6) !important;
  }

  .el-select__selected-item {
    color: rgba(255, 255, 255, 0.6) !important;
  }
}

.inputcss {
  position: absolute;
  height: adaptiveHeight(24);
  right: 0;
  z-index: 2;
}

.inputcss :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: none;
  font-size: adaptiveFontSize(12);
}

.scroll {
  height: adaptiveHeight(155);
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
  font-size: 12px;
}

.group :deep(.el-radio-button .el-radio-button__inner) {
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0);
  border-color: rgba(255, 255, 255, 0);
  font-size: 12px;
  border-radius: 2px;
}
</style>
