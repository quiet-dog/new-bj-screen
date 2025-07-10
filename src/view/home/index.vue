<template>
  <div class="bigscreen_lt">
    <div class="bigscreen_lt_top">
      <div class="bigscreen_lt_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>报警信息</span>
      </div>
    </div>
    <div class="bigscreen_lt_bottom" @mouseenter="mouseEnterBaoJingXinxi" @mouseleave="mouseLeaveBaoJingXinxi">
      <div class="bigscreen_lt_bottom_nei">
        <div v-for="item in alarmEvnetListLt" class="bigscreen_lt_nei" :style="{
          background: `url(${item.back}) no-repeat`,
          'background-size': '100% 100%',
        }" @click="neiClick(item)">
          <span class="bigscreen_lt_nei_span">{{ item.type }}</span>
          <span class="bigscreen_lt_nei_span">{{ item.level }}</span>
          <span class="bigscreen_lt_nei_span">{{ item.createTime }}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="bigscreen_lc">
    <div class="bigscreen_lc_top">
      <div class="bigscreen_lc_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>事件报告</span>
      </div>
      <el-input class="inputcss" placeholder="请输入事件类型" v-model="alarmEventsFormData.type" @change="alarmEventslistFun"
        clearable :prefix-icon="Search" />
    </div>
    <div class="bigscreen_lc_bottom">
      <div class="bigscreen_lc_bottom_nei">
        <img src="/public/img/事件报告图标.png" alt="" />
        <div class="bigscreen_lc_bottom_r">
          <Vue3SeamlessScroll :list="alarmEventslist" :class-option="{
            step: 5,
          }" hover class="scrool">
            <div v-for="(item, index) in alarmEventslist" :key="index" class="bigscreen_lc_bottom_rnei">
              <ElTooltip :content="item.description">
                <span>{{ item.description }}</span>
              </ElTooltip>
              <div :style="{
                background: ` url(${item.img}) no-repeat`,
                'background-size': '100% 100%',
              }">
                <span v-if="item.type == '工艺节点报警'">工艺节点</span>
                <span v-else>{{ item.type }}</span>
              </div>
            </div>
          </Vue3SeamlessScroll>
        </div>
      </div>
    </div>
  </div>
  <div class="bigscreen_lb">
    <div class="bigscreen_lb_top">
      <div class="bigscreen_lb_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>报警历史</span>
      </div>
      <el-radio-group v-model="lbRadio" @change="lbRadioChange" class="group">
        <el-radio-button label="周" value="week" />
        <el-radio-button label="年" value="year" />
      </el-radio-group>
    </div>
    <div class="bigscreen_lb_bottom">
      <div class="bigscreen_lb_bottom_nei" ref="bigscreenLBRef"></div>
    </div>
    <div v-show="hisShow"  class="lb_table ltTrendDialog">
      <div class="ltTrendDialog_top">
      <span>报警列表</span>
      <img @click="closeShow" :src="img9" alt="" srcset="" />
    </div>
      <div class="ltTrendDialog_bottom">
        <ElTable :header-cell-style="tableHeaderColor" :cell-style="handleChangeCellStyle" id="tableMy" header-row-class-name="headerTr" style="width: 100%;background: #002547;" height="100%" :data="hisList">
        <el-table-column width="150" fixed prop="createTime" label="报警时间">
          <template #default="{ row }">
            <span>{{ 
              dayjs(row.createTime).format("YYYY-MM-DD hh:mm:ss")  }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed width="80" prop="level" label="报警级别">
          <template #default="{ row }">
            <el-tag :style="getLevelStyle(row.level)" effect="plain" size="small">
              {{ row.level ? row.level : "-" }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="type" label="类型">
          <template #default="{ row }">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed width="80" prop="level" label="数值">
          <template #default="{ row }">
            {{ getValue(row) }}
          </template>
        </el-table-column>
        <el-table-column width="100" prop="description" label="报警编号">
          <template #default="{ row }">
            <span>{{ row.eventId }}</span>
          </template>
        </el-table-column> -->
        <el-table-column  prop="description" label="报警描述">
          <template #default="{ row }">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>


      </ElTable>
      </div>
   
    </div>
  </div>
  <center></center>
  <div  class="bigscreen_rt">
    <div class="bigscreen_rt_top">
      <div class="bigscreen_rt_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>监控报告</span>
      </div>
      <!-- @keyup.enter="getVideoList" -->
      <el-input class="inputcss" v-model="channelQuery.name" @keyup.enter="getVideoList"
        style="width: 148px; height: 24px; margin-right: 11px" placeholder="请输入监控点位" :prefix-icon="Search" />
    </div>
    <div class="bigscreen_rt_bottom">
      <div class="bigscreen_rt_bottom_nei">
        <img src="/public/img/监控报告图标.png" alt="" />
        <div class="bigscreen_rt_bottom_r">
          <div @click="rtClick(item)" v-for="item in videoList">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="bigscreen_rc">
    <div class="bigscreen_rc_top">
      <div class="bigscreen_rc_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>政策法规</span>
      </div>
      <el-input class="inputcss" placeholder="请输入政策法规名称" :prefix-icon="Search" clearable
        v-model="policiesFormData.policiesName" @change="policieslistFun" />
    </div>
    <div class="bigscreen_rc_bottom">
      <div class="bigscreen_rc_bottom_nei">
        <div class="bigscreen_rc_bottom_l">
          <img src="/public/img/圆形标记.png" alt="" />
          <img style="margin-top: 70px" src="/public/img/圆形标记.png" alt="" />
          <img style="margin-top: 70px" src="/public/img/圆形标记.png" alt="" />
        </div>
        <div class="bigscreen_rc_bottom_r">
          <Vue3SeamlessScroll :list="policieslist" :class-option="{
            step: 5,
          }" hover class="scrool">
            <div v-for="(item, index) in policieslist" @click="rcClick(item)" :key="index"
              class="bigscreen_rc_bottom_rnei">
              <span style="color: rgba(172, 223, 255, 1); font-size: 11px">{{
                dayjs(item.createTime).format("YYYY-MM-DD")
                }}</span>
              <div :style="{
                background: `url(${item.img}) no-repeat`,
                'background-size': '100% 100%',
              }">
                <span style="margin-left: 10px">{{ item.policiesName }}</span>
                <img style="margin-right: 18px; cursor: pointer" src="/public/img/查看详情.png" alt="" />
              </div>
            </div>
          </Vue3SeamlessScroll>
        </div>
      </div>
    </div>
  </div>
  <div class="bigscreen_rb">
    <div class="bigscreen_rb_top">
      <div class="bigscreen_rb_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>安全生产曲线</span>
      </div>
      <el-radio-group v-model="rbRadio" class="group" @change="rbRadioChange">
        <el-radio-button label="周" value="week" />
        <el-radio-button label="年" value="year" />
      </el-radio-group>
    </div>
    <div class="bigscreen_rb_bottom">
      <div class="bigscreen_rb_bottom_nei" ref="bigscreenRBRef"></div>
    </div>
  </div>

  <template v-for="item in alarmEvnetListLt">
    <div v-if="item.status" class="ltDialog" @mouseenter="mouseEnterBaoJingXinxi" @mouseleave="mouseLeaveBaoJingXinxi">
      <div class="ltDialog_top">
        <span>报警信息详情</span>
        <img :src="img9" alt="" srcset="" @click="canleClick(item)" />
      </div>
      <div class="ltDialog_bottom">
        <img :src="item.img" alt="" />
        <div class="ltDialog_bottomr">
          <div class="ltDialog_bottomr_nei">
            <span>报警编号：</span>
            <span>{{ item.eventId }}</span>
          </div>
          <div class="ltDialog_bottomr_nei">
            <span>报警类型：</span>
            <span>{{ item.type }}</span>
          </div>
          <div class="ltDialog_bottomr_nei">
            <span>报警信息：</span>
            <span>{{ item.description }}</span>
          </div>
          <div class="ltDialog_bottomr_nei">
            <span>报警级别：</span>
            <span>{{ item.level }}</span>
          </div>
          <div class="ltDialog_bottomr_nei">
            <span>报警时间：</span>
            <span>{{ item.createTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>

  <div v-if="rtStatus" class="rtDialog">
    <div class="rtDialog_top">
      <span>查看监控视频</span>
      <img :src="img9" alt="" srcset="" @click="rtcanleClick" />
    </div>
    <div class="rtDialog_bottom">
      <!-- <img src="/public/img/监控视频尺寸.png" alt="" /> -->
      <Video class="rtDialog_bottom_video" ref="videoRef" />
      <!-- <div>倍速播放×1</div> -->
    </div>
  </div>
  <!-- 政策法规 -->
  <template v-for="(item, _index) in policieslist">
    <div v-if="item.status" class="preview">
      <div class="preview_top">
        <span>文件预览
          <ElButton size="large" @click="() => download(item.paths[0].path)" link type="success" text="success">
            <el-icon style="vertical-align: middle; font-size: 25px">
              <Download />
            </el-icon>
          </ElButton>
        </span>

        <img :src="img9" alt="" srcset="" @click="previewcanleClick(item)" />
      </div>
      <div class="preview_bottom">
        <div class="preview_bottom_nei">
          <OfficePreview :file-url="previewVisibleUrl" />
        </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
import { Search } from "@element-plus/icons-vue";
import center from "../../components/center.vue";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import OfficePreview from "../../components/officereview.vue";
import {
  getPoliciesListApi,
  alarmEventsList,
  getstatistics,
  geteventTotal,
} from "../../api/incident";
import dayjs from "dayjs";
import "../../assets/scss/index.scss";
import { download } from "../../api/login.ts";
import { Download } from "@element-plus/icons-vue";

import img5 from "../../../public/img/红色背景框.png";
import img6 from "../../../public/img/绿色背景框.png";
import img7 from "../../../public/img/黄色背景框.png";
import img9 from "../../../public/img/叉号.png";
import { useIntervalFn } from "@vueuse/core";
import { getChannelListApi, getStreamUrlApi } from "../../api/video/index.ts";
import Video from "./components/Video.vue";

const getValue = (item)=>{
  if(item.type == "设备报警"){
    let unit = "";
    if(item.threshold){
      return item.equipmentValue + item.threshold?.unit
    }
  }
  if (item.type= "环境报警"){
    return item.environmentValue + item.environment?.unitName
  }
  if(item.type == "物料报警"){
    return item.materialsValue + item.materials?.unit
  }
  if(item.type == "工艺节点报警"){
    return item.equipmentValue + item.threshold?.unit
  }
  return "未知"
}

const rtStatus = ref(false);
const videoRef = ref(null);
const rtClick = (item: { channelid: string }) => {
  rtStatus.value = !rtStatus.value;
  if (rtStatus.value) {
    nextTick(() => {
      getStreamUrlApi(item.channelid).then((res) => {
        console.log("res.data.data.wsflv", res.data.data.wsflv);
        const url = new URL(res.data.data.wsflv);
        url.host = location.host;
        videoRef.value.play(url.toString());
        videoRef.value.setChannelId(res.data.data.channelId);
      });
    });
  }
};
const rtcanleClick = () => {
  rtStatus.value = false;
};

//政策法规
const policiesFormData = ref({
  policiesName: "",
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const policieslist = ref<any[]>([]);
const previewVisibleUrl = ref("");
const policieslistFun = async () => {
  const { data } = await getPoliciesListApi(policiesFormData.value);
  let imgList = [img5, img6, img7];
  policieslist.value = data.data.rows.map((item: any, index: number) => {
    return { ...item, img: imgList[index % imgList.length], status: false };
  });
};
const policiesTimer = useIntervalFn(() => {
  policiesTimer.pause();
  policieslistFun().finally(() => {
    policiesTimer.resume();
  });
}, 50000);
const rcClick = (item: any) => {
  policieslist.value.forEach((v) => {
    if (item.policiesId == v.policiesId) {
      v.status = !v.status;
    } else {
      v.status = false;
    }
  });
  if (item.paths.length > 0) {
    previewVisibleUrl.value = item.paths[0].path;
  }
};
const previewcanleClick = (item: { status: boolean }) => {
  item.status = false;
};

//报警信息
const ltalarmEventsFormData = ref({
  type: "",
  pageNum: 1,
  pageSize: 4,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const alarmEvnetListLt = ref<any[]>([]);
// 获取报警信息
const alarmEventslistFunLt = async () => {
  const { data } = await alarmEventsList(ltalarmEventsFormData.value);
  let list = data.data.rows.slice(0, 4);
  let evnetimglist = [
    {
      type: "设备报警",
      img: "/img/设备报警.png",
    },
    {
      type: "环境报警",
      img: "/img/环境数据.png",
    },
    {
      type: "物料报警",
      img: "/img/物料报警.png",
    },
    {
      type: "工艺节点报警",
      img: "/img/工艺节点.png",
    },
  ];
  let levelList = [
    {
      level: "轻微",
      img: "/img/wuji_ticon.png",
    },
    {
      level: "一般",
      img: "/img/siji_ticon.png",
    },
    {
      level: "中度",
      img: "/img/sanji_ticon.png",
    },
    {
      level: "重要",
      img: "/img/erji_ticon.png",
    },
    {
      level: "紧急",
      img: "/img/yiji_ticon.png",
    },
  ];
  alarmEvnetListLt.value = list.map((item: { type: string; level: string }) => {
    const matchedEvent = evnetimglist.find((v) => v.type === item.type);
    const matchedLevel = levelList.find((v) => v.level === item.level);

    return {
      ...item,
      back: matchedEvent ? matchedEvent.img : "",
      status: false,
      img: matchedLevel ? matchedLevel.img : "",
    };
  });
};
const mouseEnterBaoJingXinxi = () => {
  if (isActive.value) {
    pause();
  }
};
const mouseLeaveBaoJingXinxi = () => {
  if (!isActive.value) {
    resume();
  }
};
const { pause, resume, isActive } = useIntervalFn(() => {
  pause();
  alarmEventslistFunLt().finally(() => {
    resume();
  });
}, 50000);
const neiClick = (item: { eventId: any }) => {
  alarmEvnetListLt.value.forEach((v) => {
    if (item.eventId == v.eventId) {
      v.status = !v.status;
    } else {
      v.status = false;
    }
  });
};
const canleClick = (item: { status: boolean }) => {
  item.status = false;
};

//事件报告
const alarmEventsFormData = ref({
  type: "",
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const alarmEventslist = ref<any[]>([]);
const alarmEventslistFun = async () => {
  const { data } = await alarmEventsList(alarmEventsFormData.value);
  let imgList = [
    {
      level: "轻微",
      img: "/img/wuji_back.png",
    },
    {
      level: "一般",
      img: "/img/siji_back.png",
    },
    {
      level: "中度",
      img: "/img/sanji_back.png",
    },
    {
      level: "重要",
      img: "/img/erji_back.png",
    },
    {
      level: "紧急",
      img: "/img/yiji_back.png",
    },
  ];
  alarmEventslist.value = data.data.rows.map(
    (item: { level: string }, _index: any) => {
      const matchedLevel = imgList.find((v) => v.level === item.level);
      return {
        ...item,
        img: matchedLevel ? matchedLevel.img : "",
        status: false,
      };
    }
  );
};

//安全生产曲线
let bigscreenRBChart: any = null;
const bigscreenRBRef = ref();
const rbRadio = ref("week");
const bigscreenRBoption = {
  grid: {
    left: "60px",
    top: "40px",
    bottom: "40px",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: [
      {
        name: "设备报警",
        itemStyle: { color: "RGBA(255, 169, 19, 1)" },
      },
      {
        name: "环境报警",
        itemStyle: { color: "RGBA(225, 110, 122, 1)" },
      },
      {
        name: "物料报警",
        itemStyle: { color: "RGBA(65, 195, 142, 1)" },
      },
      {
        name: "工艺节点报警",
        itemStyle: { color: "RGBA(210, 114, 255, 1)" },
      },
    ],
    top: "10px",
    textStyle: {
      color: "#ffffff",
    },
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
      show: true,
      lineStyle: {
        color: ["rgba(255, 255, 255, 0.15)"],
        type: "dashed",
      },
    },
    axisLabel: {
      color: "rgba(255, 255, 255, 0.65)",
    },
  },
  series: [
    {
      name: "设备报警",
      data: [],
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: {
        color: "RGBA(255, 169, 19, 1)", // 线条颜色
      },
      areaStyle: createAreaStyle(
        "RGBA(255, 169, 19, 0.5)",
        "rgba(255, 169, 19, 0)"
      ),
    },
    {
      name: "环境报警",
      data: [],
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: {
        color: "RGBA(225, 110, 122, 1)", // 线条颜色
      },
      areaStyle: createAreaStyle(
        "RGBA(225, 110, 122, 0.5)",
        "rgba(225, 110, 122, 0)"
      ),
    },
    {
      name: "物料报警",
      data: [],
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: {
        color: "RGBA(65, 195, 142, 1)", // 线条颜色
      },
      areaStyle: createAreaStyle(
        "RGBA(65, 195, 142, 0.5)",
        "rgba(65, 195, 142, 0)"
      ),
    },
    {
      name: "工艺节点报警",
      data: [],
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: {
        color: "RGBA(210, 114, 255, 1)", // 线条颜色
      },
      areaStyle: createAreaStyle(
        "RGBA(210, 114, 255, 0.5)",
        "rgba(210, 114, 255, 0)"
      ),
    },
  ],
};
const getstatisticsList = async () => {
  const { data } = await getstatistics({ dayType: rbRadio.value });
  bigscreenRBoption.xAxis.data = data.data[0].times;
  bigscreenRBoption.series[0].data = data.data[2].data;
  bigscreenRBoption.series[1].data = data.data[0].data;
  bigscreenRBoption.series[2].data = data.data[1].data;
  bigscreenRBoption.series[3].data = data.data[3].data;
  if (bigscreenRBRef.value) {
    bigscreenRBChart = echarts.init(bigscreenRBRef.value);
    bigscreenRBChart.setOption(bigscreenRBoption);
  }
};
const rbRadioTimer = useIntervalFn(() => {
  rbRadioTimer.pause();
  getstatisticsList().finally(() => {
    rbRadioTimer.resume();
  });
}, 50000);
const rbRadioChange = (val: string) => {
  rbRadio.value = val;
  getstatisticsList();
};
// 创建 areaStyle 的函数
function createAreaStyle(startColor: string, endColor: string) {
  return {
    color: {
      type: "linear",
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: startColor,
        },
        {
          offset: 1,
          color: endColor,
        },
      ],
      global: false,
    },
  };
}

//报警历史
let bigscreenLBChart: any = null;
const bigscreenLBRef = ref();
const bigscreenLBoption = {
  grid: {
    left: "60px",
    top: "40px",
    bottom: "40px",
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
      show: true, //让网格显示
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
      symbol: "circle",
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

let histData = ([])
let hisStart = "";
let hisEnd = "";
let hisIndex = 0;
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

const lbRadio = ref("week");
const bigScreenInit = ref(false)
const geteventTotalFun = async () => {
  const { data } = await geteventTotal({ dayType: lbRadio.value });

  bigscreenLBoption.xAxis.data = data.data.time;
  bigscreenLBoption.series[0].data = data.data.data;

  if (bigscreenLBRef.value) {
    if (!bigScreenInit.value) {
      bigScreenInit.value = true;
      bigscreenLBChart = echarts.init(bigscreenLBRef.value);
    bigscreenLBChart.setOption(bigscreenLBoption);
      bigscreenLBChart.off().on("click", params => {
        let cuData = "";
        let enData = "";
        hisShow.value = true;

        if (hisIndex != params.dataIndex || hisDayType.value != lbRadio.value) {
          hisIndex = params.dataIndex;
          hisDayType.value = lbRadio.value;
          if (lbRadio.value === "week") {
            // 将年份换成今年的年份
            cuData = dayjs().subtract(6-hisIndex,"day").startOf("day").format("YYYY-MM-DD");
            enData = dayjs(cuData).endOf("day").format("YYYY-MM-DD")
          } else {
            cuData = dayjs(params.name).startOf("month").format("YYYY-MM-DD")
            enData = dayjs(cuData).endOf("month").format("YYYY-MM-DD")
          }

          hisStart = cuData;
          hisEnd = enData;
          alarmEventsList({
            beginTime: cuData,
            endTime: enData,
            pageNum: 1,
            pageSize: 100
          }).then((res) => {
            hisList.value = res.data.data.rows;
          })
        }
      });
    }
    bigscreenLBChart.setOption(bigscreenLBoption);

  }
};
const lbRadioTimer = useIntervalFn(() => {
  lbRadioTimer.pause();
  geteventTotalFun().finally(() => {
    lbRadioTimer.resume();
  });
}, 50000);
const lbRadioChange = (val: string) => {
  lbRadio.value = val;
  geteventTotalFun();
};

const videoList = ref([]);
const channelQuery = ref({
  name: "",
  pageNum: 1,
  pageSize: 3,
});
const getVideoList = () => {
  getChannelListApi(channelQuery.value).then((res) => {
    videoList.value = res.data.data.List;
  });
};

const closeShow =()=>{
  hisShow.value =false
}

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
  getVideoList();
  policieslistFun();
  alarmEventslistFun();
  alarmEventslistFunLt();
  getstatisticsList();
  geteventTotalFun();
});
window.onresize = function () {
  bigscreenLBChart.resize();
  bigscreenRBChart.resize();
};
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

.lb_table {
  width: adaptiveWidth(500);
  height: adaptiveHeight(400);
  left: adaptiveWidth(470);
  top: adaptiveHeight(600);
  background-color: red;
}



:deep(.headerTr){
  --el-table-header-bg-color: rgba(255,255,255,0.2) !important;
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

    .myInput{
      width: adaptiveWidth(120);
      position: relative;
      right: adaptiveWidth(120);
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
        background: linear-gradient(to bottom, #c7e5fd 42%, #3582c7 100%);
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

    .bigscreen_lt_bottom_nei {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .bigscreen_lt_nei {
        width: adaptiveWidth(93);
        height: adaptiveHeight(210);
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;

        &:nth-child(1) {
          margin-left: adaptiveWidth(18);
        }

        &:nth-child(4) {
          margin-right: adaptiveWidth(18);
        }

        .bigscreen_lt_nei_span {
          &:nth-child(1) {
            color: rgba(255, 255, 255, 0.8);
            font-size: adaptiveFontSize(14);
            font-weight: 400;
            padding-top: adaptiveHeight(97);
          }

          &:nth-child(2) {
            color: #ffffff;
            font-size: adaptiveFontSize(20);
            font-weight: 500;
          }

          &:nth-child(3) {
            color: rgba(255, 255, 255, 0.8);
            font-size: adaptiveFontSize(8);
            font-weight: 400;
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
        background: linear-gradient(to bottom, #c7e5fd 42%, #3582c7 100%);
        /* 渐变背景 */
        background-clip: text;
        /* 让背景应用到文本 */
        -webkit-text-fill-color: transparent;
        /* 使文本颜色透明 */
        padding-left: adaptiveHeight(10);
      }
    }
  }

  .bigscreen_lc_bottom {
    width: 100%;
    height: adaptiveHeight(251);
    margin-top: adaptiveHeight(5);
    background: url("/public/img/背景下层.png") no-repeat;
    background-size: 100% 100%;

    .bigscreen_lc_bottom_nei {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: adaptiveWidth(164);
        height: adaptiveHeight(159);
      }

      .bigscreen_lc_bottom_r {
        width: adaptiveWidth(256);
        height: adaptiveHeight(195);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;

        .bigscreen_lc_bottom_rnei {
          width: 100%;
          height: adaptiveHeight(45);
          margin-top: adaptiveHeight(10);
          background: url("/public/img/背景1.png") no-repeat;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;

          span {
            width: adaptiveWidth(140);
            color: rgba(244, 249, 255, 1);
            font-size: adaptiveFontSize(11);
            margin-left: adaptiveWidth(20);
            white-space: nowrap;
            /* 禁止换行 */
            overflow: hidden;
            /* 超出内容隐藏 */
            text-overflow: ellipsis;
            /* 显示省略号 */
          }

          div {
            width: adaptiveWidth(80);
            height: adaptiveHeight(35);
            color: rgba(244, 249, 255, 1);
            font-size: adaptiveFontSize(12);
            display: flex;
            justify-content: center;
            align-items: center;

            span {
              padding-bottom: adaptiveHeight(5);
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
        background: linear-gradient(to bottom, #c7e5fd 42%, #3582c7 100%);
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
        background: linear-gradient(to bottom, #c7e5fd 42%, #3582c7 100%);
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
            margin-left: adaptiveFontSize(10);
          }
        }
      }
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
        background: linear-gradient(to bottom, #c7e5fd 42%, #3582c7 100%);
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

    .bigscreen_rc_bottom_nei {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .bigscreen_rc_bottom_l {
        width: adaptiveWidth(20);
        height: adaptiveHeight(207);
        background: url("/img/线.png") no-repeat;
        background-size: 2px 100%;
        background-position: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .bigscreen_rc_bottom_r {
        width: adaptiveWidth(381);
        height: adaptiveHeight(207);
        margin-left: adaptiveFontSize(15);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;

        .bigscreen_rc_bottom_rnei {
          width: 100%;
          height: adaptiveHeight(57);
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          div {
            width: 100%;
            height: adaptiveHeight(38);
            display: flex;
            align-items: center;
            justify-content: space-between;

            span {
              color: rgba(255, 255, 255, 1);
              font-size: adaptiveFontSize(14);
            }
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
        background: linear-gradient(to bottom, #c7e5fd 42%, #3582c7 100%);
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
      width: 100%;
      height: 100%;
    }
  }
}

.ltDialog {
  width: adaptiveWidth(440);
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
    width: adaptiveWidth(380);
    // height: adaptiveHeight(230);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    img {
      width: adaptiveWidth(99);
      height: adaptiveHeight(99);
    }

    .ltDialog_bottomr {
      width: adaptiveWidth(266);
      margin: adaptiveHeight(40) 0;

      .ltDialog_bottomr_nei {
        margin-top: adaptiveHeight(10);
        display: flex;

        &:nth-child(1) {
          margin-top: 0;
        }

        span {
          font-size: adaptiveFontSize(14);

          &:nth-child(1) {
            width: adaptiveWidth(75);
            color: #687f92;
          }

          &:nth-child(2) {
            width: adaptiveWidth(191);
            color: #ffffff;
          }
        }
      }
    }
  }
}

.rtDialog {
  width: adaptiveWidth(440);
  height: adaptiveHeight(280);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: adaptiveHeight(100);
  right: adaptiveWidth(480);
  z-index: 10;

  .rtDialog_top {
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

  .rtDialog_bottom {
    width: adaptiveWidth(420);
    height: adaptiveHeight(215);
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

    img {
      width: 100%;
      height: adaptiveHeight(195);
    }

    // div {
    //   font-size: adaptiveFontSize(14);
    //   color: #ffffff;
    // }
  }
}

.rcDialog {
  width: adaptiveWidth(440);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  bottom: adaptiveHeight(400);
  right: adaptiveWidth(480);
  z-index: 10;

  .rcDialog_top {
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

  .rcDialog_bottom {
    width: 100%;
    display: flex;
    justify-content: center;

    .rcDialog_bottom_neis {
      margin: adaptiveHeight(50) 0;

      .rcDialog_bottom_nei {
        display: flex;
        margin-top: adaptiveHeight(30);

        &:nth-child(1) {
          margin-top: 0;
        }

        span {
          font-size: adaptiveFontSize(14);

          &:nth-child(1) {
            width: adaptiveWidth(105);
            color: #687f92;
          }

          &:nth-child(2) {
            width: adaptiveWidth(191);
            color: #ffffff;
          }
        }
      }
    }
  }
}

.preview {
  width: adaptiveWidth(640);
  position: absolute;
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  bottom: adaptiveHeight(400);
  right: adaptiveWidth(480);
  z-index: 10;

  .preview_top {
    width: 100%;
    height: adaptiveHeight(90);
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
      width: adaptiveWidth(12);
      height: adaptiveHeight(12);
      padding-right: adaptiveWidth(15);
      cursor: pointer;
    }
  }

  .preview_bottom {
    width: adaptiveWidth(625);
    height: adaptiveHeight(450);
    margin: 0 auto;

    .preview_bottom_nei {
      height: adaptiveHeight(420);
      overflow: hidden;
    }
  }
}

.file_list {
  width: 100%;

  .file-item {
    // 改用 file-item class
    width: 300px;
    height: 35px;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 5px;
    padding: 0 10px; // 移动padding到父元素
    transition: all 0.3s;
    cursor: pointer;

    &:last-child {
      margin-bottom: 0;
    }

    span {
      white-space: nowrap;
      /* 禁止换行 */
      overflow: hidden;
      /* 超出内容隐藏 */
      text-overflow: ellipsis;
      /* 显示省略号 */
    }
  }

  .file-actions {
    display: flex;
    gap: 8px; // 按钮之间添加间距
  }
}

.inputcss {
  // width: adaptiveWidth(148);
  height: adaptiveHeight(24);
  margin-right: adaptiveWidth(10);
}

.inputcss :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: none;

  .el-input__inner {
    font-size: adaptiveFontSize(12);
  }
}

.scroll {
  height: adaptiveHeight(195);
  width: 100%;
  overflow: hidden;
}

.groupCss {
  border: adaptiveWidth(1) solid rgba(255, 255, 255, 0.2);
  margin-right: adaptiveWidth(10);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: adaptiveWidth(3) adaptiveHeight(2);
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


</style>
