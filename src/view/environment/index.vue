<template>
  <div class="bigscreen_lt">
    <div class="bigscreen_lt_top">
      <div class="bigscreen_lt_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>环境数据</span>
      </div>
      <div class="bigscreen_lt_top_r" @click="ltClick">
        <span>报警历史分析</span>
      </div>
    </div>
    <div class="bigscreen_lt_bottom">
      <!-- <div class="bigscreen_lt_bottom_nei">
        <div class="bigscreen_lt_bottom_nei_t">
          <span>描述</span>
          <span>位号</span>
          <span>信号</span>
        </div>
        <div class="bigscreen_lt_bottom_nei_b" v-for="(item, index) in environmentFileList"
          @click="ltClick2(item, index)">
          <span>{{ `${item.description}-${item.unitName}` }}</span>
          <span>{{ item.tag }}</span>
          <span>{{ item.esignal }}</span>
        </div>
      </div> -->
      <div class="lt_container">
        <div :style="{
          backgroundImage: `url(${BeiJing})`,
        }" @click="ltClick2(item)" v-for="(item, index) in envList" :key="index">
          <div>
            <img v-if="item.environment?.unitName === '温度'" :src="WenDu" alt="">
            <img v-if="item.environment?.unitName === '湿度'" :src="ShiDu" alt="">
            <img v-if="item.environment?.unitName === '压差'" :src="YaCha" alt="">
          </div>
          <div>{{
            item.environment?.unitName }}
            <br />
            <span :class="getValueColorClass(item)">
              {{ item.value }}
            </span>
            <br />
            {{ item.environment?.unitName == "温度" ? '℃' : item.environment?.unitName == "湿度" ? '%' :
              item.environment?.unitName == "压差" ? "Pa" : "" }}
          </div>
          <div class="lt_b">
            <div>
              {{ item.environment?.description }}
            </div>
            <img :src="DiZuo" alt="" srcset="">
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="bigscreen_lb">
    <div class="bigscreen_lb_top">
      <div class="bigscreen_lb_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>当前总功耗</span>
      </div>
      <el-radio-group v-model="powerByTypeStatisticsData.type" @change="powerByTypeStatisticsFun" class="group">
        <el-radio-button label="电" value="电" />
        <el-radio-button label="水" value="水" />
      </el-radio-group>
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
        <span>历史功耗</span>
      </div>
      <el-radio-group v-model="powerStaticData.dayType" @change="powerStaticFun" class="group">
        <el-radio-button label="周" value="week" />
        <el-radio-button label="年" value="year" />
      </el-radio-group>
    </div>
    <div class="bigscreen_rt_bottom">
      <el-select size="small" class="selectcss" v-model="powerStaticData.type" @change="powerStaticFun" style="
          width: 80px;
          position: absolute;
          right: 20px;
          top: 15px;
          z-index: 99;
        ">
        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <div class="bigscreen_rt_bottom_nei" ref="bigscreenRTRef"></div>
    </div>
  </div>
  <div class="bigscreen_rb">
    <div class="bigscreen_rb_top">
      <div class="bigscreen_rb_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>区域环境指标</span>
      </div>
      <!-- <el-radio-group v-model="powerByAreaTotalStaticData.dayType" @change="powerByAreaTotalStaticFun" class="group">
        <el-radio-button label="周" value="week" />
        <el-radio-button label="年" value="year" />
      </el-radio-group> -->

      <div class="left-se">
        <!-- <el-select
        v-model="powerByAreaTotalStaticData.area"
          filterable
          placeholder="请选择区域"
          style="width: 100%"
           class="cascaderCss"
           @change="powerByAreaTotalStaticFun"
        >
          <el-option v-for="area in allAreas" :key="area" :label="area" :value="area" />
        </el-select> -->

        <!-- <el-form-item label="日期：" class="form-item">
          <el-date-picker v-model="powerByAreaTotalStaticData.timeRange" type="date" placeholder="选择日期" value-format="YYYY-MM-DD"
            @change="handleTimeChange" />
        </el-form-item> -->
      </div>
      <div class="left-se">
        <el-select size="small" v-model="powerByAreaTotalStaticData.unitName" filterable placeholder="请选择指标"
          style="width: 100%" class="cascaderCss" @change="powerByAreaTotalStaticFun">
          <el-option v-for="item in allUnitName" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
    </div>
    <div class="bigscreen_rb_bottom">
      <div class="bigscreen_rb_bottom_nei" ref="bigscreenRBRef"></div>
    </div>
  </div>

  <div v-if="ltstatus" class="ltDialog">
    <div class="ltDialog_top">
      <span>报警历史分析</span>
      <el-radio-group v-model="envrionmentStatisticsData.dayType" class="group yzRadio" @change="zsRadioChange">
        <el-radio-button label="周" value="week" />
        <el-radio-button label="月" value="month" />
        <el-radio-button label="年" value="year" />
      </el-radio-group>
      <img :src="img9" alt="" srcset="" @click="ltcloneClick" />

    </div>
    <div class="ltDialog_bottom" ref="bigscreenLtdialogRef"></div>
  </div>
  <!-- <template v-for="(item, index) in environmentFileList"> -->
  <div v-show="environmentFileDialog" class="ltTrendDialog">
    <div class="ltTrendDialog_top">
      <span>趋势分析 <em class="qushifont">{{ dayjs(historyStatisticsFormData.startTime).format("YYYY-MM-DD") }}</em></span>
      <img :src="img9" alt="" srcset="" @click="ltcanleClick2(item, index)" />
    </div>
    <div class="ltTrendDialog_bottom" ref="environmentFileDialogRef"></div>
  </div>
  <!-- </template> -->
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
import {
  environmentalFilesList,
  historyStatistics,
  envrionmentStatistics,
  powerStatic,
  powerByTypeStatistics,
  powerByAreaTotalStatic,
  environmentalDetectionList,
  getZuiXinShuJuApi,
  getAreas,
  getAllGroup,
  getBuTongApi,
} from "../../api/environment";
import center from "../../components/center.vue";
import img9 from "../../../public/img/叉号.png";
import DiZuo from "../../assets/env/底座.png";
import WenDu from "../../assets/env/温度.png";
import ShiDu from "../../assets/env/湿度.png";
import YaCha from "../../assets/env/压差.png";
import BeiJing from "../../assets/env/背景.jpg";
import { useIntervalFn } from "@vueuse/core";
import dayjs from "dayjs";
import { initQuYuOption } from ".";

const zsRadio = ref("week");
const zsRadioChange = async () => {
  zsEchartData();
};

const handleTimeChange = val => {
  // 转为YYYY-MM-DD格式
  powerByAreaTotalStaticData.value.beginTime = dayjs(val).startOf('day').format("YYYY-MM-DD");
  powerByAreaTotalStaticData.value.endTime = dayjs(val).add(1, 'day').startOf("day").format("YYYY-MM-DD");
  powerByAreaTotalStaticFun();
};

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
const options2 = ref([
  {
    label: "电",
    value: "电",
  },
  {
    label: "水",
    value: "水",
  },
]);

//当前总功耗
let bigscreenLBChart: any = null;
const bigscreenLBRef = ref();
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
    nameTextStyle: {
      color: "#ffffff",
      padding: [0, 40, 5, 0],
    },
    axisLabel: {
      color: "#ffffff",
    },
    splitLine: {
      show: true, //让网格显示
      lineStyle: {
        //网格样式
        color: ["rgba(255, 255, 255, 0.15)"], //网格的颜色
        type: "dashed", //网格是实实线，可以修改成虚线以及其他的类型
      },
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
              color: "rgba(61, 230, 255, 0.60)", // 0% 处的颜色
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
const powerByTypeStatisticsData = ref({
  des: "",
  dayType: "year",
  type: "电",
});
const powerByTypeStatisticsFun = async () => {
  const { data } = await powerByTypeStatistics(powerByTypeStatisticsData.value);
  console.log(data);
  bigscreenLBoption.xAxis.data = data.data.time;
  bigscreenLBoption.series[0].data = data.data.data;
  if (bigscreenLBRef.value) {
    bigscreenLBChart = echarts.init(bigscreenLBRef.value);
    bigscreenLBChart.setOption(bigscreenLBoption);
  }
};

//数据展示
const environmentFileFormData = ref({
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const environmentFileList = ref<any[]>([]);
const environmentFileFun = async () => {
  const { data } = await environmentalFilesList(environmentFileFormData.value);
  let list = data.data.rows.slice(0, 9);
  environmentFileList.value = list.map((item, index) => {
    return {
      ...item,
      status: false,
    };
  });
};
const envList = ref([]);
const getEnvList = () => {
  environmentalDetectionList({
    pageNum: 1,
    pageSize: 4,
    orderColumn: "createTime",
    orderDirection: "descending",
    isIgnore: true,
  }).then(res => {
    envList.value = res.data.data.rows;
  }).catch(err => {

  })
}

const getEnvListTimer = useIntervalFn(() => {
  getEnvListTimer.pause();
  environmentalDetectionList({
    pageNum: 1,
    pageSize: 4,
    orderColumn: "createTime",
    orderDirection: "descending",
    isIgnore: true,
  }).then(res => {
    envList.value = res.data.data.rows;
  }).catch(err => {

  }).finally(() => {
    getEnvListTimer.resume();
  })
}, 5000)
const environmentFileTimer = useIntervalFn(() => {
  environmentFileTimer.pause();
  environmentFileFun().finally(() => {
    environmentFileTimer.resume();
  })
}, 5000)
const environmentFileDialog = ref(false);
const environmentFileDialogRef = ref(null);

//报警历史分析
const ltstatus = ref(false);
let bigscreenLtdialogChart: any = null;
const bigscreenLtdialogRef = ref();
const bigscreenLtdialogoption = {
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
    minInterval: 1
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
  legend: {
    // 白色文字
    textStyle: {
      color: '#ffffff',
      fontSize: 12
    },
  },
  tooltip: {
    trigger: 'axis', // 或 'item'，看你是多个柱还是单个柱
    axisPointer: {
      type: 'shadow' // 鼠标移动时显示阴影效果
    }
  }
};
const envrionmentStatisticsData = ref({
  description: "",
  dayType: "week",
});
const envrionmentStatisticsFun = async () => {
  const { data } = await envrionmentStatistics(envrionmentStatisticsData.value);
  // bigscreenLtdialogoption.xAxis.data = data.data.unitNames;
  // bigscreenLtdialogoption.series[0].data = data.data.datas;
  if (data.data == null || data.data == undefined || data.data.unitNames == null || data.data.unitNames == undefined || data.data.unitNames.length == 0) {
    return;
  }
  bigscreenLtdialogoption.series = data.data.unitNames.map((name, index) => ({
    name: name,
    type: 'bar',
    data: [data.data.datas[index]],
    itemStyle: {
      // color: ['#68B1A6', '#FFAA00', '#6A5ACD'][index]  // 可设置不同颜色
    },
    // barGap: 0,
    label: {
      show: true,
      position: 'top',
      color: '#ffffff',
      fontSize: 12,
    }
  }));
};
const zsEchartData = async () => {
  await envrionmentStatisticsFun();
  if (bigscreenLtdialogRef.value) {
    console.log("bigscreenLtdialogoption", bigscreenLtdialogoption);
    bigscreenLtdialogChart = echarts.init(bigscreenLtdialogRef.value);
    bigscreenLtdialogChart.setOption(bigscreenLtdialogoption,true);
  }
}
const ltClick = async () => {
  ltstatus.value = !ltstatus.value;
  zsEchartData();
};
const ltcloneClick = () => {
  ltstatus.value = false;
};

//趋势分析
let ltDialogChart: any = null;
let ltDialogRefs = ref<(HTMLElement | null)[]>([]);
const ltDialogoption = {
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
    nameTextStyle: {
      color: "#ffffff",
      padding: [0, 40, 5, 0],
    },
    axisLabel: {
      color: "#ffffff",
    },
    splitLine: {
      show: true, //让网格显示
      lineStyle: {
        //网格样式
        color: ["rgba(255, 255, 255, 0.15)"], //网格的颜色
        type: "dashed", //网格是实实线，可以修改成虚线以及其他的类型
      },
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
              color: "rgba(61, 230, 255, 0.60)", // 0% 处的颜色
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
  tooltip: {
    trigger: 'item', //坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
    axisPointer: {// 坐标轴指示器，坐标轴触发有效
      type: 'line' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
};
const historyStatisticsFormData = ref({
  environmentId: 0,
  dayType: "week",
  startTime: dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss"),
  endTime: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
});
const historyStatisticsFun = async () => {
  const { data } = await historyStatistics(historyStatisticsFormData.value);
  ltDialogoption.xAxis.data = data.time;
  ltDialogoption.series[0].data = data.data;
};
const ltClick2 = async (item: any) => {
  // environmentFileList.value.forEach(
  //   (v) => (v.status = v.environmentId === item.environmentId)
  // );
  // if (!item.status) return;
  console.log("itemitemitem", item)
  historyStatisticsFormData.value.startTime = dayjs(item.createTime).startOf("day").format("YYYY-MM-DD HH:mm:ss")
  historyStatisticsFormData.value.endTime = dayjs(item.createTime).endOf("day").format("YYYY-MM-DD HH:mm:ss")
  historyStatisticsFormData.value.environmentId = item.environmentId;
  await historyStatisticsFun();
  environmentFileDialog.value = true;
  ltDialogChart.setOption(ltDialogoption, true);

  // nextTick(() => {
  //   const dom = ltDialogRefs.value[index];
  //   if (dom) {
  //     if (ltDialogChart) {
  //       ltDialogChart.dispose();
  //     }

  //   }
  // });
};
const ltcanleClick2 = (item: any, index: number) => {
  environmentFileDialog.value = false;
  // item.status = false;
  // if (ltDialogRefs.value[index]) {
  //   if (ltDialogChart) {
  //     ltDialogChart.dispose();
  //   }
  // }
};

//历史功耗
let bigscreenRTChart: any = null;
const bigscreenRTRef = ref();
// 绘制左侧面
const CubeLeft = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath: function (ctx, shape) {
    const xAxisPoint = shape.xAxisPoint;
    const c0 = [shape.x, shape.y];
    const c1 = [shape.x - 8, shape.y - 8];
    const c2 = [xAxisPoint[0] - 8, xAxisPoint[1] - 8];
    const c3 = [xAxisPoint[0], xAxisPoint[1]];
    ctx
      .moveTo(c0[0], c0[1])
      .lineTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .closePath();
  },
});
// 绘制右侧面
const CubeRight = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath: function (ctx, shape) {
    const xAxisPoint = shape.xAxisPoint;
    const c1 = [shape.x, shape.y];
    const c2 = [xAxisPoint[0], xAxisPoint[1]];
    const c3 = [xAxisPoint[0] + 13, xAxisPoint[1] - 4];
    const c4 = [shape.x + 13, shape.y - 4];
    ctx
      .moveTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .lineTo(c4[0], c4[1])
      .closePath();
  },
});
// 绘制顶面
const CubeTop = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
  },
  buildPath: function (ctx, shape) {
    const c1 = [shape.x, shape.y];
    const c2 = [shape.x + 13, shape.y - 4];
    const c3 = [shape.x + 5, shape.y - 12];
    const c4 = [shape.x - 8, shape.y - 8];
    ctx
      .moveTo(c1[0], c1[1])
      .lineTo(c2[0], c2[1])
      .lineTo(c3[0], c3[1])
      .lineTo(c4[0], c4[1])
      .closePath();
  },
});
echarts.graphic.registerShape("CubeLeft", CubeLeft);
echarts.graphic.registerShape("CubeRight", CubeRight);
echarts.graphic.registerShape("CubeTop", CubeTop);

const bigscreenRToption = {
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
    nameTextStyle: {
      // 黑色
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
      label: {
        normal: {
          show: true,
          position: "top",
          fontSize: 14,
          color: "white",
          offset: [0, -10],
        },
      },
      tooltip: {
        show: false,
      },
      itemStyle: {
        color: "transparent", // 线条颜色
      },
    },
    {
      type: "custom",
      renderItem: (params, api) => {
        const location = api.coord([api.value(0), api.value(1)]);
        return {
          type: "group",
          children: [
            {
              type: "CubeLeft",
              shape: {
                api,
                xValue: api.value(0),
                yValue: api.value(1),
                x: location[0],
                y: location[1],
                xAxisPoint: api.coord([api.value(0), 0]),
              },
              style: {
                fill: "#549CF0",
              },
            },
            {
              type: "CubeRight",
              shape: {
                api,
                xValue: api.value(0),
                yValue: api.value(1),
                x: location[0],
                y: location[1],
                xAxisPoint: api.coord([api.value(0), 0]),
              },
              style: {
                fill: "#2070CE",
              },
            },
            {
              type: "CubeTop",
              shape: {
                api,
                xValue: api.value(0),
                yValue: api.value(1),
                x: location[0],
                y: location[1],
                xAxisPoint: api.coord([api.value(0), 0]),
              },
              style: {
                fill: "#8DC1FF",
              },
            },
          ],
        };
      },
      data: [2, 0.5, 1, 0.7, 3, 3.5, 1],
    },
  ],
  tooltip: {
    trigger: 'item', //坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
    axisPointer: {// 坐标轴指示器，坐标轴触发有效
      type: 'line' // 默认为直线，可选为：'line' | 'shadow'
    }
  },

};
const powerStaticData = ref({
  des: "",
  dayType: "week",
  type: "电",
});
const powerStaticFun = async () => {
  const { data } = await powerStatic(powerStaticData.value);
  bigscreenRToption.xAxis.data = data.data.time;
  bigscreenRToption.series[0].data = data.data.data;
  bigscreenRToption.series[1].data = data.data.data;
  if (bigscreenRTRef.value) {
    bigscreenRTChart = echarts.init(bigscreenRTRef.value);
    bigscreenRTChart.setOption(bigscreenRToption);
  }
};

let bigscreenRBChart: any = null;
const bigscreenRBRef = ref();

const bigscreenRBoption = {
  grid: {
    left: "6%",
    right: "6%",
    bottom: "6%",
    containLabel: true,
  },
  legend: {
    data: [],
    // 白色
    textStyle: {
      color: "#ffffff",
    },
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
  tooltip: {
    trigger: 'axis', //坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
    axisPointer: {// 坐标轴指示器，坐标轴触发有效
      type: 'line' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
};
const powerByAreaTotalStaticData = ref({
  // area:"控制区",
  unitName: "温度",
  beginTime: dayjs().startOf('day').format('YYYY-MM-DD'),
  endTime: dayjs().add(1, "day").startOf('day').format('YYYY-MM-DD'),
  timeRange: [],
});

const powerByAreaTotalStaticFun = async () => {
  // const { data } = await getZuiXinShuJuApi(
  //   powerByAreaTotalStaticData.value
  // );
  // bigscreenRBoption.xAxis.data = data.data.time;
  // bigscreenRBoption.series[0].data = data.data.data;
  // if (bigscreenRBRef.value) {
  //   bigscreenRBChart = echarts.init(bigscreenRBRef.value);
  //   bigscreenRBChart.setOption(bigscreenRBoption);
  // }
  const { data } = await getBuTongApi({
    unitName: powerByAreaTotalStaticData.value.unitName,
    beginTime: dayjs().startOf('day').format('YYYY-MM-DD'),
    endTime: dayjs().add(1, 'day').startOf('day').format('YYYY-MM-DD'),
  });
  bigscreenRBoption.legend.data = data.data.series.map(item => item.name);
  bigscreenRBoption.xAxis.data = data.data.xdata;
  bigscreenRBoption.series = data.data.series

  if (bigscreenRBRef.value) {
    bigscreenRBChart = echarts.init(bigscreenRBRef.value);
    if (bigscreenRBoption.series.length == 0) {
      bigscreenRBChart.setOption(initQuYuOption, true)
    } else {
      bigscreenRBChart.setOption(bigscreenRBoption, true);
    }
  }
};

const allAreas = ref([]);

async function getAllAreasFunc() {
  getAreas().then(res => {
    allAreas.value = res.data.data;
    if (allAreas.value.length > 0) {
      powerByAreaTotalStaticData.value.area = allAreas.value[0];
      // powerByAreaTotalStaticFun();
    }
  }).catch(err => {
    console.error("获取区域列表失败", err);
  });
}

const getAreasTimer = useIntervalFn(() => {
  getAreasTimer.pause();
  getAreas().then(res => {
    allAreas.value = res.data.data;
  }).catch(err => {
    console.error("获取区域列表失败", err);
  }).finally(() => {
    getAreasTimer.resume();
  });
}, 5000);

window.onresize = function () {
  bigscreenLBChart.resize();
  bigscreenRBChart.resize();
  bigscreenRTChart.resize();
  ltDialogChart.resize();
};


const allUnitName = ref([])
const getAllGroupFunc = () => {
  getAllGroup().then(res => {
    allUnitName.value = res.data.data.unitName.filter(item => item !== "电" && item !== "水" && !item.includes("报警"));
    if (allUnitName.value.length > 0) {
      powerByAreaTotalStaticData.value.unitName = allUnitName.value[0];
      powerByAreaTotalStaticData.value.beginTime = dayjs().startOf('day').format('YYYY-MM-DD');
      powerByAreaTotalStaticData.value.endTime = dayjs().add(1, 'day').startOf('day').format('YYYY-MM-DD');
      powerByAreaTotalStaticFun();
    }
  }).catch(err => {
  })
}

const allUnitNameTimer = useIntervalFn(() => {
  allUnitNameTimer.pause();
  getAllGroup().then(res => {
    allUnitName.value = res.data.data.unitName.filter(item => item !== "电" && item !== "水" && !item.includes("报警"));
  }).catch(err => {
  }).finally(() => {
    allUnitNameTimer.resume();
  });
}, 5000);

const powerByAreaTotalStaticFunTimer = useIntervalFn(() => {
  powerByAreaTotalStaticFunTimer.pause();
  powerByAreaTotalStaticFun().then(res => {
    // allUnitName.value = res.data.data.unitName.filter(item => item !== "电" && item !== "水" && !item.includes("报警"));
  }).catch(err => {
  }).finally(() => {
    powerByAreaTotalStaticFunTimer.resume();
  });
}, 5000);

onMounted(() => {
  ltDialogChart = echarts.init(environmentFileDialogRef.value);

  getAllAreasFunc();
  environmentFileFun();
  historyStatisticsFun();
  powerStaticFun();
  powerByTypeStatisticsFun();
  // powerByAreaTotalStaticFun();
  getAllAreasFunc();
  getEnvList()
  getAllGroupFunc();
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

.lt_container {
  width: calc(100% - adaptiveWidth(20));
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  text-align: center;
  word-break: break-word;
  color: white;
  font-size: adaptiveFontSize(16);
  gap: adaptiveWidth(10);
  padding: 0 adaptiveWidth(10);
  // margin: 0 adaptiveWidth(10);

  >div {
    width: adaptiveWidth(90);
    height: adaptiveHeight(350);
    border-radius: adaptiveWidth(10);
    // background-color: gray;
    display: grid;
    grid-template-rows: 1fr 2fr 1fr;
  }
}

:deep(.cascaderCss) {
  width: adaptiveWidth(200);
  height: adaptiveHeight(24);
  margin-right: adaptiveWidth(11);

  .el-select__wrapper {
    background: none;
    height: adaptiveHeight(24);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
    padding: 0 4px !important;
    font-size: adaptiveFontSize(12);
  }
}

.left-se {
  width: adaptiveWidth(100);
  position: relative;
  left: - adaptiveWidth(20);
}

.bigscreen_lt,
.bigscreen_lb,
.bigscreen_rt,
.bigscreen_rb {
  width: adaptiveWidth(443);
  height: adaptiveHeight(445);
}

.lt_b {
  position: relative;

  div {
    position: relative;
    z-index: 1;
    font-size: adaptiveFontSize(12);
  }

  img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }
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
      width: 100%;
      height: 100%;
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

.ltTrendDialog {
  width: adaptiveWidth(440);
  height: adaptiveHeight(280);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: adaptiveHeight(100);
  left: adaptiveWidth(480);
  z-index: 10;

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
      cursor: pointer;
    }
  }

  .ltTrendDialog_bottom {
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

.yzRadio {
  position: relative;
  left: adaptiveWidth(100);
  top: adaptiveHeight(10);
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

.text-urgent {
  color: #f53f3f;
}

.text-important {
  color: #ff7d00;
}

.text-warning {
  color: #fadc19;
}

.text-info {
  color: #168cff;
}

.text-success {
  color: #00b42a;
}

.qushifont{
  color: white;
  font-size: adaptiveFontSize(20) !important;
  font-family: unset !important;
  font-style: unset !important;
}
</style>
