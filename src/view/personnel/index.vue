<template>
  <div class="bigscreen_lt">
    <div class="bigscreen_lt_top">
      <div class="bigscreen_lt_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>门禁记录</span>
      </div>
    </div>
    <div class="bigscreen_lt_bottom">
      <div class="bigscreen_lt_bottom_neis">
        <Vue3SeamlessScroll :list="accesscontrollist" :class-option="{
          step: 5,
        }" hover class="scrool">
          <div class="bigscreen_lt_bottom_nei" v-for="item in accesscontrollist" @click="ltClick(item)">
            <img src="/public/img/personnel/人物图标.png" alt="" />
            <div class="bigscreen_lt_bottom_nei_r" :style="{
              background: `url(${item.img}) no-repeat`,
              'background-size': '100% 100%',
            }">
              <div>
                <span>{{ item.personnel?.name }}</span>
                <span>进入</span>
              </div>
              <div>
                <span>员工编号：{{ item.personnel?.code }}</span>
                <span>门禁地点：{{ item.doorPlace }}</span>
              </div>
              <div>
                <span>刷卡时间：{{ item.createTime }}</span>
              </div>
            </div>
          </div>
        </Vue3SeamlessScroll>
      </div>
    </div>
  </div>
  <div class="bigscreen_lb">
    <div class="bigscreen_lb_top">
      <div class="bigscreen_lb_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>特征指标</span>
      </div>
      <el-input class="inputcss" v-model="healthyFormData.name" placeholder="请输入员工姓名" :prefix-icon="Search"
        @change="healthyChange" />
    </div>
    <div class="bigscreen_lb_bottom">
      <div class="bigscreen_lb_bottom_neis">
        <Vue3SeamlessScroll :list="healthylist" :class-option="{
          step: 5,
        }" hover class="scrool">
          <div class="bigscreen_lb_bottom_nei" v-for="(item, index) in healthylist" @click="lbClick(item, index)">
            <div class="bigscreen_lb_bottom_nei_count">
              <div class="left">
                <div :style="{
                  width: '79px',
                  height: '27px',
                  background: `url(${item.img}) no-repeat`,
                  backgroundSize: '100% 100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '13px',
                  color: '#ffffff',
                }">
                  {{ item.personnel.name }}
                </div>
                <div style="color: #ffffff; margin-top: 10px">
                  {{ item.personnel.code }}
                </div>
              </div>
              <div class="right">
                <span class="right_text">
                  <span>体温：{{ item.temperature }}℃</span>
                  <span style="padding-left: 15px">心率：{{ item.heartRate }}/分钟</span>
                </span>
                <span class="right_text">
                  <span>血压：{{ item.lowBloodPressure }}mmHg</span>
                  <span style="padding-left: 15px">{{ item.highBloodPressure }}mmHg</span>
                </span>
                <span class="right_text">
                  <span>监测时间：{{ item.createTime }}</span>
                </span>
              </div>
            </div>
            <div class="bigscreen_lb_bottom_nei_dizuo"></div>
          </div>
        </Vue3SeamlessScroll>
      </div>
    </div>
  </div>
  <center></center>
  <div class="bigscreen_rt">
    <div class="bigscreen_rt_top">
      <div class="bigscreen_rt_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>视频监控</span>
      </div>
    </div>
    <div class="bigscreen_rt_bottom">
      <!-- <swiper
        :slides-per-view="1"
        :space-between="10"
        pagination
        style="width: 100%; height: 100%"
      > -->
      <div class="rtDialog_bottom">
        <!-- <img src="/public/img/监控视频尺寸.png" alt="" /> -->
        <Video style="width:100%" class="rtDialog_bottom_video" ref="videoRef" />
        <!-- <div>倍速播放×1</div> -->
      </div>
      <!-- <swiper-slide v-for="(item, index) in slides" :key="index">
          <img :src="item.image" alt="" />
        </swiper-slide> -->
      <!-- </swiper> -->
    </div>
  </div>
  <div class="bigscreen_rb">
    <div class="bigscreen_rb_top">
      <div class="bigscreen_rb_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>异常健康指标统计</span>
      </div>
      <el-radio-group v-model="radio1" @change="changeRadio1" class="group">
        <el-radio-button label="周" value="week" />
        <el-radio-button label="年" value="year" />
      </el-radio-group>
    </div>
    <div class="bigscreen_rb_bottom">
      <div class="bigscreen_rb_bottom_nei" ref="bigscreenRBRef"></div>
    </div>
  </div>

  <!-- <template v-for="item in accesscontrollist"> -->
  <div v-if="personnelShow" class="ltDialog">
    <div class="ltDialog_top">
      <span>查看人员信息</span>
      <img :src="img9" alt="" srcset="" @click="ltcanleClick(item)" />
    </div>
    <div class="ltDialog_bottom">
      <div class="ltDialog_bottom_nei">
        <img src="/public/img/弹窗头像图标.png" alt="" />
        <div class="ltDialog_bottomr">
          <div>
            <span>员工编号：</span>
            <span>{{ personnelInfo?.personnel?.code }}</span>
          </div>
          <div>
            <span>姓名：</span>
            <span>{{ personnelInfo?.personnel?.name }}</span>
          </div>
          <div>
            <span>性别：</span>
            <span>{{ personnelInfo?.personnel?.sex }}</span>
          </div>
          <div>
            <span>部门：</span>
            <span>{{ personnelInfo?.personnel?.department }}</span>
          </div>
          <div>
            <span>岗位：</span>
            <span>{{ personnelInfo?.personnel?.post }}</span>
          </div>
          <div>
            <span>联系方式：</span>
            <span>{{ personnelInfo?.personnel?.contact }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- </template> -->

  <div v-show="showPersonnelDialog" class="lbDialog">
    <div class="lbDialog_top">
      <span>趋势分析</span>
      <div class="lbDialog_select">
        <ElSelect v-model="healthyValue" @change="changeHealthValue" class="selectcss" size="small">
          <ElOption v-for="item in healthySelect" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </div>
      <img :src="img9" alt="" srcset="" @click="lbcanleClick(item, index)" />
    </div>
    <div ref="showPersonnelDialogRef" class="lbDialog_bottom"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, reactive, onUnmounted } from "vue";
import * as echarts from "echarts";
import { Search } from "@element-plus/icons-vue";
import center from "../../components/center.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import img1 from "../../../public/img/视频监控尺寸.png";
import img9 from "../../../public/img/叉号.png";
import Video from "../home/components/Video.vue";

import {
  indicatorStatistics,
  healthyList,
  healthyStatistics,
  accesscontrolRes,
  accesscontrolList,
} from "../../api/personnel/index";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import { getChannelListApi, getStreamUrlApi } from "../../api/video/index.ts";
import { useIntervalFn } from '@vueuse/core'



const radio1 = ref("week");
const slides = [{ image: img1 }, { image: img1 }, { image: img1 }];
const changeRadio1 = () => {
  indicatorStatisticsList();
};

let bigscreenRBChart: any = null;
const bigscreenRBRef = ref();
// 数据及配置
const legendData = [
  {
    name: "温度异常",
    itemStyle: { color: "rgba(0, 234, 255, 1)" },
    textStyle: { color: "rgba(255,255,255,0.9)" },
  },
  {
    name: "血压异常",
    itemStyle: { color: "rgba(0, 145, 255, 1)" },
    textStyle: { color: "rgba(255,255,255,0.9)" },
  },
];
const color = [
  {
    type: "linear",
    x: 0,
    x2: 1,
    y: 0,
    y2: 0,
    colorStops: [
      {
        offset: 0,
        color: "rgba(0, 234, 255, 0.8)",
      },
      {
        offset: 0.5,
        color: "rgba(0, 234, 255, 0.8)",
      },
      {
        offset: 0.5,
        color: "rgba(0, 188, 188, 0.8)",
      },
      {
        offset: 1,
        color: "rgba(0, 188, 188, 0.8)",
      },
    ],
  },
  {
    type: "linear",
    x: 0,
    x2: 1,
    y: 0,
    y2: 0,
    colorStops: [
      {
        offset: 0,
        color: "rgba(0, 145, 255, 0.8)",
      },
      {
        offset: 0.5,
        color: "rgba(0, 145, 255, 0.8)",
      },
      {
        offset: 0.5,
        color: "rgba(0, 107, 188, 0.8)",
      },
      {
        offset: 1,
        color: "rgba(0, 107, 188, 0.8)",
      },
    ],
  },
  {
    type: "linear",
    x: 0,
    x2: 1,
    y: 0,
    y2: 0,
    colorStops: [
      {
        offset: 0,
        color: "rgba(0,188,255,0)",
      },
      {
        offset: 0.5,
        color: "rgba(0,188,255,0)",
      },
      {
        offset: 0.5,
        color: "rgba(0,138,186,0)",
      },
      {
        offset: 1,
        color: "rgba(0,138,186,0)",
      },
    ],
  },
];
const val = {
  data1: [],
  data2: [],
};
const barWidth = 20;

let xBar1: number[] = [];
let xBar2: number[] = [];
let xBar3: number[] = [];

// 图表选项
const bigscreenRBoption = {
  grid: {
    left: "6%",
    right: "6%",
    bottom: "6%",
    top: "20%",
    containLabel: true,
  },
  legend: { data: legendData },
  xAxis: {
    type: "category",
    data: [],
    axisLine: { lineStyle: { color: "#ffffff" } },
    axisLabel: { color: "#ffffff" },
  },
  yAxis: {
    type: "value",
    axisLine: { lineStyle: { color: "#ffffff" } },
  },
  tooltip: {
    trigger: 'axis', //坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
    axisPointer: {// 坐标轴指示器，坐标轴触发有效
      type: 'line' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  series: [
    {
      z: 1,
      name: legendData[1].name,
      type: "bar",
      barWidth: barWidth,
      stack: "总量",
      color: color[1],
      data: val.data2,
    },
    {
      z: 2,
      name: legendData[0].name,
      type: "bar",
      barWidth: barWidth,
      stack: "总量",
      color: color[0],
      data: val.data1,
    },
    {
      z: 3,
      name: "底部立体",
      type: "pictorialBar",
      data: xBar1,
      symbol: "diamond",
      symbolOffset: ["0%", "50%"],
      symbolSize: [barWidth, 10],
      itemStyle: {
        normal: {
          color: color[1],
        },
      },
      tooltip: { show: false },
    },
    // data2头部
    {
      z: 5,
      name: legendData[1].name,
      type: "pictorialBar",
      symbolPosition: "end",
      itemStyle: {
        normal: {
          color: color[1],
        },
      },
      data: xBar1,
      symbol: "diamond",
      symbolOffset: ["0%", "-50%"],
      symbolSize: [barWidth - 4, (10 * (barWidth - 4)) / barWidth],
      tooltip: {
        show: false,
      },
    },
    // data1头部
    {
      z: 4,
      name: legendData[0].name,
      type: "pictorialBar",
      data: xBar2,
      symbol: "diamond",
      symbolPosition: "end",
      symbolOffset: ["0%", "-50%"],
      symbolSize: [barWidth, 10],
      itemStyle: {
        normal: {
          color: color[0],
        },
      },
      tooltip: {
        show: false,
      },
    },
  ],
};
const indicatorStatisticsList = async () => {
  indicatorStatistics({
    dayType: radio1.value,
  }).then((res) => {
    val.data1 = res.data.data[0].data;
    val.data2 = res.data.data[1].data;
    xBar1 = val.data2.map((item) => Number(item));
    xBar2 = val.data1.map((item, index) => Number(item) + xBar1[index]);
    xBar3 = val.data1.map((item) => Number(item));
    bigscreenRBoption.series[0].data = val.data2;
    bigscreenRBoption.series[1].data = val.data1;
    bigscreenRBoption.xAxis.data = res.data.data[0].time;
    bigscreenRBChart?.setOption(bigscreenRBoption);
  });
};

const indicatorStatisticsListTimer = useIntervalFn(() => {
  indicatorStatisticsListTimer.pause();
  indicatorStatisticsList().finally(() => {
    indicatorStatisticsListTimer.resume();
  });
}, 5000);



const initChart = () => {
  if (!bigscreenRBRef.value) return;
  bigscreenRBChart = echarts.init(bigscreenRBRef.value);
  bigscreenRBChart.setOption(bigscreenRBoption);
  window.addEventListener("resize", () => bigscreenRBChart?.resize());
};

//门禁列表
const accesscontrolData = ref<accesscontrolRes>({
  doorCode: "",
  doorPlace: "",
  name: "",
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const accesscontrollist = ref<any[]>([]);
const accesscontrolFun = async () => {
  const { data } = await accesscontrolList(accesscontrolData.value);
  let img = [
    "/img/personnel/红色背景.png",
    "/img/personnel/绿色背景.png",
    "/img/personnel/黄色背景.png",
  ];
  let list = data.data.rows;
  accesscontrollist.value = list.map((item, index) => {
    return { ...item, img: img[index % img.length], status: false };
  });
};
const accessontrolTimer = useIntervalFn(() => {
  accessontrolTimer.pause();
  accesscontrolFun().finally(() => {
    accessontrolTimer.resume();
  });
}, 5000);
const personnelInfo = ref()
const personnelShow = ref(false)
const ltClick = (item: any) => {
  personnelInfo.value = item;
  personnelShow.value = true;
  // accesscontrollist.value.forEach((v) => {
  //   if (item.personnelId == v.personnelId) {
  //     v.status = !v.status;
  //   } else {
  //     v.status = false;
  //   }
  // });
};
const ltcanleClick = (item: any) => {
  // item.status = false;
  personnelShow.value = false;
};

//人员健康数据
const healthyFormData = ref({
  name: "",
  pageNum: 1,
  pageSize: 3,
  orderColumn: "createTime",
  orderDirection: "descending",
  isGroup: true,
});
const healthylist = ref<any[]>([]);
const healthylistFun = async () => {
  const { data } = await healthyList(healthyFormData.value);
  let imgList = [
    "/img/personnel/名字绿色背景.png",
    "/img/personnel/名字蓝色背景.png",
    "/img/personnel/名字棕色背景.png",
  ];
  let list = data.data.rows;
  healthylist.value = list.map((item, index) => {
    return { ...item, img: imgList[index % imgList.length], status: false };
  });
};
const healthylistTimer = useIntervalFn(() => {
  healthylistTimer.pause();
  healthylistFun().finally(() => {
    healthylistTimer.resume();
  });
}, 5000);
const changeHealthValue = async (val) => {
  healthyStatisticsData.value.type = healthyValue.value;
  await healthyStatisticsFun();
  lbDialogBottomChart.setOption(lbDialogBottomoption);
};
const healthyChange = () => {
  healthylistFun();
};

//特征指标
let lbDialogBottomChart: any = null;
const healthyStatisticsData = ref({ personnelId: null, type: "" });
const lbDialogBottomoption = {
  grid: {
    left: "6%",
    right: "6%",
    bottom: "6%",
    top: "20%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: [],
    axisLabel: {
      color: "rgba(255,255,255,0.65)",
    },
  },
  yAxis: {
    type: "value",
    splitLine: {
      show: true, //让网格显示
      lineStyle: {
        //网格样式
        color: ["rgba(255, 255, 255, 0.15)"], //网格的颜色
        type: "dashed", //网格是实实线，可以修改成虚线以及其他的类型
      },
    },
    axisLabel: {
      color: "rgba(255,255,255,0.65)",
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
const healthyValue = ref("温度");
// 特征指标下的趋势分析选择器
const healthySelect = reactive([
  {
    value: "温度",
    label: "温度",
  },
  {
    value: "收缩压",
    label: "收缩压",
  },
  {
    value: "舒张压",
    label: "舒张压",
  },
  {
    value: "心率",
    label: "心率",
  },
]);

const videoRef = ref(null);
const videoInfo = ref({});
const channelQuery = ref({
  name: "",
  pageNum: 1,
  pageSize: 1,
});
const getVideoList = () => {
  nextTick(() => {
    getChannelListApi(channelQuery.value).then((res) => {

      videoInfo.value = res.data.data.List[0];
      getStreamUrlApi(videoInfo.value.channelid).then((ress) => {
        const url = new URL(ress.data.data.wsflv);
        url.host = location.host;
        videoRef.value.play(url.toString());
        videoRef.value.setChannelId(ress.data.data.channelId);
        channelQuery.value.pageNum += 1;
        if (channelQuery.value.pageNum > ress.data.data.Total) {
          channelQuery.value.pageNum = 1;
        }
      }).catch((err) => {
        channelQuery.value.pageNum = 1
      });
    });
  });

};


const videoTimer = useIntervalFn(() => {
  /* your function */
  getVideoList();
}, 20000)

const healthyStatisticsFun = async () => {
  const { data } = await healthyStatistics(healthyStatisticsData.value);
  lbDialogBottomoption.xAxis.data = data.data.time;
  lbDialogBottomoption.series[0].data = data.data.data;
};

const lbClick = async (item, index) => {
  healthyStatisticsData.value.personnelId = item.personnelId;
  healthyStatisticsData.value.type = healthyValue.value;
  await healthyStatisticsFun();
  if (!showPersonnelDialog.value) {
    showPersonnelDialog.value = true;
  }
  lbDialogBottomChart.setOption(lbDialogBottomoption);
};
const lbcanleClick = (item, index) => {
  showPersonnelDialog.value = false;
};

window.onresize = function () {
  bigscreenRBChart.resize();
};

// ============================我自己写的=======================
const showPersonnelDialog = ref(false);
const showPersonnelDialogRef = ref(null);

onMounted(() => {
  lbDialogBottomChart = echarts.init(showPersonnelDialogRef.value);
  getVideoList();
  initChart();
  indicatorStatisticsList();
  healthylistFun();
  accesscontrolFun();
});

onUnmounted(() => {
  videoTimer.pause();
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

.rtDialog_bottom {
  width: adaptiveWidth(420);
  height: adaptiveHeight(415);
  margin-left: adaptiveWidth(10);
  display: flex;
  flex-direction: column;
  // align-items: center;
  justify-content: center;
  overflow: hidden;

  .rtDialog_bottom_video {
    :deep(#container) {
      width: adaptiveWidth(420);
      height: adaptiveHeight(215);
      object-fit: cover;
    }

    object-fit: cover;
  }
}

.bigscreen_lt,
.bigscreen_lb,
.bigscreen_rt,
.bigscreen_rb {
  width: adaptiveWidth(443);
  height: adaptiveHeight(445);
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
    height: adaptiveHeight(406);
    margin-top: adaptiveHeight(5);
    background: url("/public/img/bigback.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .bigscreen_lt_bottom_neis {
      margin-top: adaptiveHeight(20);
      height: adaptiveHeight(366);
      overflow: hidden;

      .bigscreen_lt_bottom_nei {
        margin-top: adaptiveHeight(30);
        height: adaptiveHeight(92);
        display: flex;
        align-items: center;
        cursor: pointer;

        .bigscreen_lt_bottom_nei_r {
          width: adaptiveWidth(276);
          height: adaptiveHeight(82);
          margin-left: adaptiveWidth(15);
          position: relative;

          div {
            display: flex;

            &:nth-child(1) {
              position: absolute;
              top: adaptiveHeight(-5);
              left: adaptiveWidth(15);

              span {
                &:nth-child(1) {
                  color: #ffffff;
                  font-size: adaptiveFontSize(13);
                }

                &:nth-child(2) {
                  font-size: adaptiveFontSize(10);
                  color: #00fff9;
                  border: 1px solid #00fff9;
                  padding: 0 adaptiveHeight(3);
                  margin-left: adaptiveWidth(10);
                }
              }
            }

            &:nth-child(2),
            &:nth-child(3) {
              color: #ffffff;
              font-size: adaptiveFontSize(13);
              display: flex;
              justify-content: space-between;
            }

            &:nth-child(2) {
              margin-top: adaptiveHeight(25);

              span {
                &:nth-child(1) {
                  margin-left: adaptiveWidth(15);
                }
              }
            }

            &:nth-child(3) {
              margin-top: adaptiveHeight(5);

              span {
                margin-left: adaptiveWidth(15);
              }
            }
          }
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
        padding-left: adaptiveHeight(10);
      }
    }
  }

  .bigscreen_lb_bottom {
    width: 100%;
    height: adaptiveHeight(406);
    margin-top: adaptiveHeight(5);
    background: url("/public/img/bigback.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .bigscreen_lb_bottom_neis {
      margin-top: adaptiveHeight(40);
      height: adaptiveHeight(326);
      overflow: hidden;

      .bigscreen_lb_bottom_nei {
        width: adaptiveWidth(394);
        height: adaptiveHeight(85);
        margin-top: adaptiveHeight(30);
        position: relative;
        cursor: pointer;

        .bigscreen_lb_bottom_nei_count {
          height: 100%;
          display: flex;
          position: absolute;
          z-index: 100;

          .left {
            width: adaptiveWidth(79);
            height: 100%;
            margin-left: adaptiveWidth(30);
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .right {
            margin-left: adaptiveWidth(30);
            height: adaptiveHeight(50);
            display: flex;
            flex-direction: column;

            .right_text {
              span {
                color: #ffffff;
                font-size: adaptiveFontSize(13);
              }
            }
          }
        }

        .bigscreen_lb_bottom_nei_dizuo {
          position: absolute;
          bottom: 0;
          background: url("/public/img/personnel/特质指标底座.png") no-repeat;
          background-size: 100% 100%;
          width: 100%;
          height: adaptiveHeight(49);
        }
      }
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
        padding-left: adaptiveHeight(10);
      }
    }
  }

  .bigscreen_rt_bottom {
    width: 100%;
    height: adaptiveHeight(406);
    margin-top: adaptiveHeight(5);
    background: url("/public/img/bigback.png") no-repeat;
    background-size: 100% 100%;

    .bigscreen_rt_bottom_nei {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;

      img {
        width: adaptiveWidth(126);
        height: adaptiveHeight(176);
        margin-right: adaptiveWidth(28);
      }

      .bigscreen_rt_bottom_r {
        width: adaptiveWidth(218);
        height: adaptiveHeight(167);
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        div {
          width: 100%;
          height: adaptiveHeight(41);
          background: url("/public/img/半透明背景1.png") no-repeat;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          span {
            font-size: adaptiveFontSize(14);
            color: rgba(255, 255, 255, 1);
            margin-left: adaptiveWidth(10);
          }
        }
      }
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
      margin-right: 11px;
    }
  }

  .bigscreen_rb_bottom {
    width: 100%;
    height: adaptiveHeight(406);
    margin-top: adaptiveHeight(5);
    background: url("/public/img/bigback.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .bigscreen_rb_bottom_nei {
      width: adaptiveWidth(403);
      height: adaptiveHeight(366);
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
    width: 100%;
    height: adaptiveHeight(230);

    .ltDialog_bottom_nei {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      img {
        width: adaptiveWidth(98);
        height: adaptiveHeight(98);
        margin-left: adaptiveWidth(50);
      }

      .ltDialog_bottomr {
        width: adaptiveWidth(202);
        margin-right: adaptiveWidth(50);

        div {
          margin-top: adaptiveHeight(10);

          &:nth-child(1) {
            margin-top: 0;
          }

          span {
            font-size: adaptiveFontSize(14);

            &:nth-child(1) {
              color: #687f92;
            }

            &:nth-child(2) {
              color: #ffffff;
            }
          }
        }
      }
    }
  }
}

.lbDialog {
  width: adaptiveWidth(440);
  height: adaptiveHeight(297);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  bottom: adaptiveHeight(150);
  left: adaptiveWidth(480);
  z-index: 10;

  .lbDialog_top {
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

  .lbDialog_bottom {
    width: adaptiveWidth(440);
    height: adaptiveHeight(230);
  }
}

:deep(.selectcss) {
  position: absolute;
  z-index: 10;
  width: 100px;
  top: adaptiveHeight(55);
  right: adaptiveWidth(25);

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
  width: adaptiveWidth(148);
  height: adaptiveHeight(24);
  margin-right: adaptiveWidth(11);
}

.inputcss :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: none;
  font-size: adaptiveFontSize(12);
}

.scroll {
  height: 195px;
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
  padding: adaptiveWidth(2) adaptiveHeight(6);
  background: rgba(255, 255, 255, 0);
  border-color: rgba(255, 255, 255, 0);
  font-size: 12px;
  border-radius: 2px;
}
</style>
