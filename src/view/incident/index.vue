<template>
  <div class="bigscreen_lt">
    <div class="bigscreen_lt_top">
      <div class="bigscreen_lt_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>报警信息</span>
      </div>
    </div>
    <div class="bigscreen_lt_bottom">
      <div class="bigscreen_lt_bottom_l">
        <img src="/public/img/报警信息图标.png" alt="" />
        <div class="bigscreen_lt_bottom_lt">
          <!-- <div style="text-align: center">
            <span>98</span>
            <span>%</span>
          </div> -->
          <div>政策法规类</div>
        </div>
      </div>
      <div class="bigscreen_lt_bottom_r">
        <Vue3SeamlessScroll style="width: 100%;overflow: hidden;" :list="alarmInformationlistValue" hover
          class="scrool scroolMy">
          <div class="bigscreen_lt_bottom_r_nei" v-for="(item, index) in alarmInformationlistValue">
            <div>
              {{ item?.eventName }}
            </div>
            <div>
              {{ getHandlePerson(item) }}
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

        <span>区域统计</span>
      </div>
      <div class="pickerCss">
        <img src="/public/img/zuo.svg" alt="" @click="timeLeftClick" style="margin-left: 5px" />

        <span>{{
          dayjs(areaStatisticsFormData.startTime).format("MM月DD日")
        }}</span>
        <span>-</span>
        <span>{{
          dayjs(areaStatisticsFormData.endTime).format("MM月DD日")
        }}</span>
        <img src="/public/img/you.svg" alt="" @click="timeRightClick" style="margin-right: 5px" />
      </div>
      <div class="chakanqushi">
        <span @click="openShowQushi">查看趋势</span>
      </div>
    </div>
    <div class="bigscreen_lc_bottom">
      <div class="bigscreen_lc_bottom_nei" ref="bigscreenLCRef"></div>
    </div>
    <div v-show="qushiShow" class="lc_table lcTrendDialog">
      <div class="lcTrendDialog_top">
        <span>趋势详情</span>
        <img @click="closeQushiShow" :src="img9" alt="" srcset="" />
      </div>
      <div class="lcTrendDialog_bottom" ref="lcQushiRef">
      </div>

    </div>
  </div>
  <div class="bigscreen_lb">
    <div class="bigscreen_lb_top">
      <div class="bigscreen_lb_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>报警历史</span>
      </div>
      <ElSelect @change="zxChangeSelect" v-model="zxSelect" size="small" class="selectcss">
        <ElOption label="政策法规类" value="政策法规类" />
        <ElOption label="设备报警类" value="设备报警类" />
        <ElOption label="环境报警类" value="环境报警类" />
      </ElSelect>
    </div>
    <div class="bigscreen_lb_bottom">
      <div class="bigscreen_lb_bottom_nei" ref="bigscreenLBRef"></div>
    </div>

    <!-- </BorderBox1> -->
  </div>
  <center></center>
  <div class="bigscreen_rt">
    <div class="bigscreen_rt_top">
      <div class="bigscreen_rt_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>事件报告</span>
      </div>
      <el-input class="inputcss" placeholder="请输入事件报告" :prefix-icon="Search" clearable
        v-model="alarmEventsFormData.type" @change="alarmEventslistFun" />
    </div>
    <div class="bigscreen_rt_bottom">
      <div class="bigscreen_rt_bottom_nei">
        <img src="/public/img/事件报告图标.png" alt="" />
        <div class="bigscreen_rt_bottom_r">
          <Vue3SeamlessScroll :list="alarmEventslist" :class-option="{
            step: 5,
          }" hover class="scrool">
            <div @click="openEventInfoShow(item)" v-for="(item, index) in alarmEventslist" :key="index"
              class="bigscreen_rt_bottom_rnei">
              <span>{{ item.eventName }}</span>
              <div :style="{
                background: ` url(${getBg(item)}) no-repeat`,
                'background-size': '100% 100%',
              }">
                <span>{{ item.type }}</span>
              </div>
            </div>
          </Vue3SeamlessScroll>
        </div>
      </div>
    </div>
    <div v-show="eventInfoDetailShow" class="bigscreen_rc_info">
      <div class="bigscreen_rc_info_top">
        <span>事件报告详情</span>
        <img @click="closeEventInfoShow" :src="img9" alt="" srcset="" />
      </div>
      <div class="bigscreen_rc_info_bottom">
        <div class="formMy">
          <el-scrollbar height="100%">
            <el-form id="formStyle" :model="eventInfoDetail">
              <el-form-item label="事件编号">
                <span> {{ eventInfoDetail.emergencyEventId }}</span>
              </el-form-item>
              <el-form-item label="事件名称">
                {{ eventInfoDetail.eventName }}
              </el-form-item>
              <el-form-item label="处理人员">
                <span>{{ handlePerson }}</span>
              </el-form-item>
              <el-form-item label="处理内容">
                {{ eventInfoDetail.content }}
              </el-form-item>
              <el-form-item label="处理流程">
                {{ eventInfoDetail.processingFlow }}
              </el-form-item>
              <!-- <el-form-item label="报警信息">
            <el-input v-model="eventInfoDetail.processingFlow" readonly />
          </el-form-item> -->
              <el-form-item label="应对措施">
                <!-- <el-tag @click="downloadFile(item.path)" v-for="item in files">
                  {{ item.fileName }}
                </el-tag> -->
                 <el-link type="primary" @click="downloadFile(item.path)" v-for="item in files">{{ item.fileName }}</el-link>
               
              </el-form-item>
            </el-form>
          </el-scrollbar>

        </div>
      </div>
    </div>
  </div>
  <div class="bigscreen_rc">
    <div class="bigscreen_rc_top">
      <div class="bigscreen_rc_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>SOP管理</span>
      </div>
      <el-input class="inputcss" style="width: 148px; height: 24px; margin-right: 11px" placeholder="请输入SOP名称"
        :prefix-icon="Search" v-model="sopFormData.name" @change="soplistFun" clearable />
    </div>
    <div class="bigscreen_rc_bottom">
      <div class="bigscreen_rc_bottom_nei">
        <div class="bigscreen_rc_bottom_nei_t">
          <span>SOP编号</span>
          <span>SOP名称</span>
          <span>适用范围</span>
        </div>

        <div class="sop_con" style="overflow-y: hidden;">
          <Vue3SeamlessScroll :list="soplist" :class-option="{
            step: 5,
          }" hover class="scrool">
            <div class="bigscreen_rc_bottom_nei_b" v-for="(item, index) in soplist" @click="rcClcik(item)">
              <span>
                {{ item.sopId }}
              </span>
              <ElTooltip :content="item.name">
                <span>{{ item.name }}</span>
              </ElTooltip>
              <span>{{ item.scope }}</span>
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
        <span>政策法规</span>
      </div>
      <el-input class="inputcss" placeholder="请输入政策法规" :prefix-icon="Search" v-model="policiesFormData.policiesName"
        @change="policieslistFun" clearable />
    </div>
    <div class="bigscreen_rb_bottom">
      <div class="bigscreen_rb_bottom_nei">
        <div class="bigscreen_rb_bottom_l">
          <img src="/public/img/圆形标记.png" alt="" />
          <img src="/public/img/圆形标记.png" alt="" />
          <img src="/public/img/圆形标记.png" alt="" />
        </div>
        <div class="bigscreen_rb_bottom_r">
          <Vue3SeamlessScroll :list="policieslist" :class-option="{
            step: 5,
          }" hover class="scrool">
            <div v-for="(item, index) in policieslist" :key="index" class="bigscreen_rb_bottom_rnei">
              <span class="bigscreen_rb_bottom_rnei_span">
                {{ dayjs(item.createTime).format("YYYY-MM-DD") }}</span>
              <div :style="{
                background: `url(${item.img}) no-repeat`,
                'background-size': '100% 100%',
              }">
                <span style="margin-left: 10px">{{ item.policiesName }}</span>
                <img @click="rbClcik(item)" src="/public/img/查看详情.png" alt="" />
              </div>
            </div>
          </Vue3SeamlessScroll>
        </div>
      </div>
    </div>
  </div>

  <template v-for="(item, index) in policieslist">
    <div v-if="item.status" class="preview">
      <div class="preview_top">
        <span>文件预览</span>
        <img :src="img9" alt="" srcset="" @click="previewcanleClick(item)" />
      </div>
      <div class="preview_bottom">
        <div class="preview_bottom_nei">
          <OfficePreview :file-url="previewVisibleUrl" />
        </div>
      </div>
    </div>
  </template>

  <template v-for="(item, index) in soplist">
    <div v-if="item.status" class="preview2">
      <div class="preview_top">
        <span>文件预览</span>
        <img :src="img9" alt="" srcset="" @click="previewcanleClick2(item)" />
      </div>
      <div class="preview_bottom">
        <div class="preview_bottom_nei">
          <OfficePreview :file-url="sopPreviewVisibleUrl" />
        </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { Search } from "@element-plus/icons-vue";
import center from "../../components/center.vue";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import {
  getPoliciesListApi,
  sopList,
  alarmEventsList,
  alarmInformationList,
  areaStatistics,
  getstatistics,
  emergencyEventList,
  getAreaStatisticsByDate,
} from "../../api/incident";
import OfficePreview from "../../components/officereview.vue";
import dayjs from "dayjs";
import img5 from "../../../public/img/红色背景框.png";
import img6 from "../../../public/img/绿色背景框.png";
import img7 from "../../../public/img/黄色背景框.png";
import img9 from "../../../public/img/叉号.png";
import { getEventAtatistics } from "../../api/home";
import { download } from "../../api/login";
import { get3dOption, getHistoryData } from "./echart";
import "echarts-gl"
import { useIntervalFn } from "@vueuse/core";

const getHandlePerson = (item) => {
  // console.log("item",item)
  if (item.handlers && item.handlers.length > 0) {
    let handlePerson = ""
    item.handlers.forEach((v) => {
      handlePerson += v.name + " "
    })
    return handlePerson
  }
};

const qushiShow = ref(false)
const lcQushiRef = ref()
const lcQushiChart = ref()
const qushiOptions = {
  title: {
    text: '趋势统计',
    // 颜色
    textStyle: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold'
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // type: 'cross',
      label: {
        backgroundColor: '#ffffff'
      }
    }
  },
  legend: {
    data: [],
    // 白色文字
    textStyle: {
      color: '#ffffff',
      fontSize: 12
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    // type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [

  ]
}
function openShowQushi() {
  qushiShow.value = true
  getAreaStatisticsByDate({
    beginTime: areaStatisticsFormData.value.startTime,
    endTime: areaStatisticsFormData.value.endTime,
  }).then(res => {
    qushiOptions.xAxis.data = res.data.data.xdata
    qushiOptions.series = res.data.data.series
    qushiOptions.legend.data = res.data.data.series.map(item => item.name)
    if (lcQushiRef.value) {
      lcQushiChart.value = echarts.init(lcQushiRef.value);
      lcQushiChart.value.setOption(qushiOptions);
      console.log("lcQushiRef.value", qushiOptions.xAxis.data, qushiOptions.series)
    }
  })
}
function closeQushiShow() {
  qushiShow.value = false
}



let bigscreenLBChart: any = null;
const bigscreenLBRef = ref();
let bigscreenLBoption = {
  grid: {
    left: "6%",
    right: "6%",
    bottom: "6%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
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
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'line',        // 默认为直线，可选为：'line' | 'shadow' 'cross'
      lable: {
      }
    },

  },

};

let bigscreenLCChart: any = null;
const bigscreenLCRef = ref();
let bigscreenLCoption = {
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
      data: [],
    },
  ],
};

//sop管理
const sopFormData = ref({
  name: "",
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const soplist = ref<any[]>([]);
const sopPreviewVisibleUrl = ref("");
const soplistFun = async () => {
  const { data } = await sopList(sopFormData.value);
  soplist.value = data.data.rows.slice(0, 5);
};
const rcClcik = (item: any) => {
  soplist.value.forEach((v) => {
    if (item.sopId == v.sopId) {
      v.status = !v.status;
    } else {
      v.status = false;
    }
  });
  if (item.paths.length > 0) {
    sopPreviewVisibleUrl.value = item.paths[0].path;
  }
};
const previewcanleClick2 = (item: any) => {
  item.status = false;
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
  policieslist.value = data.data.rows.map((item, index) => {
    return { ...item, img: imgList[index % imgList.length], status: false };
  });
};
const rbClcik = (item: any) => {
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
const previewcanleClick = (item: any) => {
  item.status = false;
};

const downloadFile = (item) => {
  download(item)
}

//事件报告
const alarmEventsFormData = ref({
  type: "",
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const alarmEventslist = ref<any[]>([]);
const getBg = (item) => {
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
  let bg = ""
  if (item.emergencyAlarmDTOs && item.emergencyAlarmDTOs.length > 0) {
    imgList.forEach(result => {
      if (result.level == item.emergencyAlarmDTOs[0].level) {
        bg = result.img
      }
    })
  }
  if (bg == "") {
    bg = imgList[0].img;
  }
  return bg;
}
const alarmEventslistFun = async () => {
  const { data } = await emergencyEventList(alarmEventsFormData.value);
  alarmEventslist.value = data.data.rows;
};

const alarmTimer = useIntervalFn(() => {
  alarmTimer.pause();
  alarmEventslistFun().then(res => {
  }).catch(err => {

  }).finally(() => {
    alarmTimer.resume();
  });
}, 5000);

//报警信息
const alarmInformationFormData = ref({
  eventName: "",
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
  type: "政策法规类"
});
const alarmInformationlistValue = ref<any[]>([]);
const alarmInformationlistFun = async () => {
  const { data } = await emergencyEventList(alarmInformationFormData.value);
  alarmInformationlistValue.value = data.data.rows;
};

const alarmInfoTimer = useIntervalFn(() => {
  alarmInfoTimer.pause();
  alarmInformationlistFun().then(res => {
  }).catch(err => {

  }).finally(() => {
    alarmInfoTimer.resume();
  });
}, 5000);

const zxSelect = ref("环境报警类");
const zxChangeSelect = () => {
  historyStatistics();
};

const areaStatisticsFormData = ref({
  startTime: dayjs().subtract(6, "day").startOf('day').format("YYYY-MM-DD"),
  endTime: dayjs().endOf("day").format("YYYY-MM-DD"),
});
const areaStatisticsFun = async () => {
  const { data } = await areaStatistics(areaStatisticsFormData.value);
  // bigscreenLCoption.series[0].data = data.data.map((itme) => {
  //   return {
  //     value: itme.count,
  //     name: itme.manufacturer,
  //   };
  // });
  bigscreenLCoption = get3dOption(data.data)
  if (bigscreenLCChart) {
    bigscreenLCChart.setOption(bigscreenLCoption, true);
  }
};

const areaStatisticsTimer = useIntervalFn(() => {
  areaStatisticsTimer.pause();
  areaStatisticsFun().then(res => {
  }).catch(err => {

  }).finally(() => {
    areaStatisticsTimer.resume();
  });
}, 10000);


const timeLeftClick = () => {

  areaStatisticsFormData.value.startTime = dayjs(areaStatisticsFormData.value.startTime)
    .subtract(6, "day").startOf("day")
    .format("YYYY-MM-DD");
  areaStatisticsFormData.value.endTime = dayjs(areaStatisticsFormData.value.endTime)
    .subtract(6, "day")
    .endOf("day")
    .format("YYYY-MM-DD");
  areaStatisticsFun(); // 更新数据
};
const timeRightClick = () => {

  areaStatisticsFormData.value.startTime = dayjs(areaStatisticsFormData.value.startTime)
    .add(6, "day")
    .startOf("day")
    .format("YYYY-MM-DD");
  areaStatisticsFormData.value.endTime = dayjs(areaStatisticsFormData.value.endTime)
    .add(6, "day")
    .endOf("day")
    .format("YYYY-MM-DD");
  areaStatisticsFun(); // 更新数据
};

const historyStatistics = async () => {
  const { data } = await getEventAtatistics({
    type: zxSelect.value
  });
  // bigscreenLBoption.series[0].data = data.data.data;
  bigscreenLBoption = getHistoryData(data.data)
  if (bigscreenLBRef.value) {
    bigscreenLBChart = echarts.init(bigscreenLBRef.value);
    bigscreenLBChart.setOption(bigscreenLBoption);
  }
};

const historyTimer = useIntervalFn(() => {
  historyTimer.pause();
  historyStatistics().then(res => {
  }).catch(err => {

  }).finally(() => {
    historyTimer.resume();
  });
}, 10000);

window.onresize = function () {
  bigscreenLCChart.resize();
  bigscreenLBChart.resize();
};
const eventInfoDetail = ref({});
const handlePerson = ref("");
const files = ref([]);
const eventInfoDetailShow = ref(false)
const openEventInfoShow = (item) => {
  eventInfoDetailShow.value = true;
  handlePerson.value = "";
  eventInfoDetail.value = item;
  handlePerson.value = "";
  files.value = []
  item.handlers.forEach((v) => {
    handlePerson.value += v.name + " ";
  })
  item.emergencyAlarmDTOs.forEach((v) => {
    v.paths.forEach((path) => {

      let fileName = ""
      let sub = ""
      const r = path.split("_")
      if (r.length > 0) {
        const s = r[r.length - 1].split(".")
        sub = "." + s[s.length - 1]
      }
      for (let i = 1; i < r.length - 1; i++) {
        fileName += r[i]
      }
      let result = {
        emergencyAlarmId: v.emergencyAlarmId,
        level: v.level,
        path: path,
        fileName: fileName + sub,
      };
      files.value.push(result);
    })
  })
}
const closeEventInfoShow = () => {
  eventInfoDetailShow.value = false;
};

onMounted(() => {
  if (bigscreenLBRef.value) {
    bigscreenLBChart = echarts.init(bigscreenLBRef.value);
    bigscreenLBChart.setOption(bigscreenLBoption, true);
  }

  if (bigscreenLCRef.value) {
    bigscreenLCChart = echarts.init(bigscreenLCRef.value);
    bigscreenLCChart.setOption(bigscreenLCoption, true);
  }
  if (lcQushiRef.value) {
    // lcQushiChart.value = echarts.init(lcQushiRef.value);
    // lcQushiChart.value.setOption(qushiOptions, true);
  }
  policieslistFun();
  soplistFun();
  alarmEventslistFun();
  alarmInformationlistFun();
  areaStatisticsFun();
  historyStatistics();
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

#formStyle {
  :deep(.el-form-item__label) {
    color: #ffffff;
  }

  :deep(.el-form-item__content) {
    color: #ffffff;
  }
}

.bigscreen_rc_info {
  position: absolute;
  width: adaptiveWidth(400);
  height: adaptiveHeight(400);
  background-color: red;
  top: adaptiveHeight(45);
  left: adaptiveWidth(-400);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;

  .bigscreen_rc_info_top {
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
      padding-right: adaptiveWidth(5);
      margin-top: adaptiveHeight(-20);
      cursor: pointer;
    }
  }

  .bigscreen_rc_info_bottom {
    width: 100%;
    height: adaptiveHeight(280);
    background-size: 100% 100%;

  }


}

.formMy {
  width: calc(100% - daptiveHeight(20));
  height: 100%;
  padding: 0 adaptiveHeight(20);
}

.scroolMy {
  width: 100%;
  height: 100%;
  overflow: hidden;
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
    align-items: center;
    justify-content: center;

    .bigscreen_lt_bottom_l {
      width: adaptiveWidth(100);
      height: adaptiveHeight(218);
      background: url("/public/img/报警图标底座.png") no-repeat;
      background-position: 0 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;

      img {
        width: adaptiveWidth(102);
        height: adaptiveHeight(104);
      }

      .bigscreen_lt_bottom_lt {
        color: #ffffff;
        margin-bottom: adaptiveHeight(20);

        div {
          font-size: adaptiveFontSize(16);

          &:nth-child(1) {
            span {
              &:nth-child(1) {
                font-size: adaptiveFontSize(32);
              }

              &:nth-child(2) {
                font-size: adaptiveFontSize(16);
              }
            }
          }

          &:nth-child(2) {
            font-size: adaptiveFontSize(16);
          }
        }
      }
    }

    .bigscreen_lt_bottom_r {
      width: adaptiveWidth(290);
      height: adaptiveHeight(211);
      margin-left: adaptiveWidth(15);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;


    }
  }
}

.bigscreen_lt_bottom_r_nei {
  width: 100%;
  height: adaptiveHeight(35);
  background: rgba(4, 30, 62);
  display: flex;
  justify-content: space-between;
  align-items: center;
  // 添加下划线
  // border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  background: url("/public/img/craftsmanship/yaosuback.png") no-repeat;
  background-size: 100% 100%;
  margin-bottom: adaptiveHeight(5);

  div {
    &:nth-child(1) {
      color: #ffffff;
      font-size: adaptiveFontSize(12);
      display: flex;
      align-items: center;
      margin-left: adaptiveWidth(20);
    }

    &:nth-child(2) {
      color: #ffffff;
      font-size: adaptiveFontSize(12);
    }

    &:nth-child(3) {
      font-size: adaptiveFontSize(12);
      margin-right: adaptiveWidth(15);
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

    .pickerCss {
      width: adaptiveWidth(135);
      height: adaptiveHeight(24);
      border: 1px solid rgba(227, 233, 243, 0.2);
      border-radius: 5px;
      // margin-right: adaptiveWidth(11);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-left: adaptiveWidth(80);

      span {
        color: #ffffff;
        font-size: adaptiveFontSize(12);
      }
    }

    .chakanqushi{
      color: white;
      font-size: adaptiveFontSize(15);
      margin-right: adaptiveWidth(10);
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
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: adaptiveWidth(164);
        height: adaptiveHeight(159);
      }

      .bigscreen_rt_bottom_r {
        width: adaptiveWidth(265);
        height: adaptiveHeight(195);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;

        .bigscreen_rt_bottom_rnei {
          width: 100%;
          margin-top: adaptiveHeight(10);
          height: adaptiveHeight(45);
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
            margin-left: adaptiveWidth(10);
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

.sop_con {
  height: adaptiveHeight(191);
  overflow: hidden;
}

.bigscreen_rc {
  position: absolute;
  top: adaptiveHeight(395);
  right: adaptiveWidth(26);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

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

    .bigscreen_rc_bottom_nei {
      width: adaptiveWidth(407);
      margin: 0 auto;

      .bigscreen_rc_bottom_nei_t {
        width: 100%;
        height: adaptiveHeight(30);
        background: url("/public/img/equipment/tabletop.png") no-repeat;
        background-size: 100% 100%;
        margin-top: adaptiveHeight(15);
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

      .bigscreen_rc_bottom_nei_b {
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
          font-size: 12px;
          text-align: center;
          white-space: nowrap;
          /* 禁止换行 */
          overflow: hidden;
          /* 超出内容隐藏 */
          text-overflow: ellipsis;
          /* 显示省略号 */
        }
      }

      .bigscreen_rc_bottom_nei_active {
        width: 100%;
        height: adaptiveHeight(33);
        background: url("/public/img/equipment/tableactive.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: adaptiveHeight(15);

        span {
          width: 33%;
          color: #58a4cb;
          text-align: center;
          position: relative;

          &:nth-child(1) {
            img {
              position: absolute;
              left: adaptiveWidth(25);
              top: adaptiveHeight(2);
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
    background-size: 110% 110%;
    display: flex;
    justify-content: space-between;
    align-items: center;

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
      display: flex;
      justify-content: center;
      align-items: center;

      .bigscreen_rb_bottom_l {
        width: adaptiveWidth(20);
        height: adaptiveHeight(207);
        background: url("/img/线.png") no-repeat;
        background-size: 2px 100%;
        background-position: center;
        display: flex;
        flex-direction: column;
        align-items: center;

        img {

          &:nth-child(2),
          &:nth-child(3) {
            margin-top: adaptiveHeight(70);
          }
        }
      }

      .bigscreen_rb_bottom_r {
        width: adaptiveWidth(381);
        height: adaptiveHeight(207);
        margin-left: adaptiveWidth(15);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;

        .bigscreen_rb_bottom_rnei {
          width: 100%;
          height: adaptiveHeight(57);
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .bigscreen_rb_bottom_rnei_span {
            color: rgba(172, 223, 255, 1);
            font-size: adaptiveFontSize(11);
          }

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

            img {
              margin-right: adaptiveWidth(18);
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}

.rtDialog {
  width: adaptiveWidth(440);
  height: adaptiveHeight(372);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: adaptiveHeight(100);
  right: adaptiveWidth(480);
  z-index: 10;

  .rtDialog_top {
    width: 100%;
    height: adaptiveHeight(60);
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
    width: 100%;
    height: adaptiveHeight(282);
    display: flex;
    // align-items: center;
    justify-content: space-between;
    flex-direction: column;

    div {
      margin-left: adaptiveWidth(30);

      &:nth-child(1) {
        margin-top: adaptiveHeight(10);
      }

      &:last-child {
        margin-bottom: adaptiveHeight(10);
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

.rcDialog {
  width: adaptiveWidth(440);
  height: adaptiveHeight(372);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: adaptiveHeight(350);
  right: adaptiveWidth(480);
  z-index: 10;

  .rcDialog_top {
    width: 100%;
    height: adaptiveHeight(60);
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
    height: adaptiveHeight(292);

    :deep(.el-scrollbar) {
      .el-scrollbar__wrap {
        width: 100%;
        display: flex;
        justify-content: center;

        .rcDialog_bottom_item {
          width: 100%;
          display: flex;
          margin-top: adaptiveHeight(30);

          span {
            font-size: adaptiveFontSize(14);

            &:nth-child(1) {
              width: adaptiveWidth(100);
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
}

.rbDialog {
  width: adaptiveWidth(440);
  height: adaptiveHeight(372);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  bottom: adaptiveHeight(40);
  right: adaptiveWidth(480);
  z-index: 10;

  .rbDialog_top {
    width: 100%;
    height: adaptiveHeight(60);
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

  .rbDialog_bottom {
    width: 100%;
    height: adaptiveHeight(292);

    :deep(.el-scrollbar) {
      .el-scrollbar__wrap {
        width: 100%;
        display: flex;
        justify-content: center;

        .rbDialog_bottom_nei {
          width: 100%;
          display: flex;
          margin-top: adaptiveHeight(30);

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
}

.preview {
  width: adaptiveWidth(640);
  position: absolute;
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  bottom: adaptiveHeight(40);
  right: adaptiveWidth(480);
  z-index: 12;

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

.preview2 {
  width: adaptiveWidth(640);
  position: absolute;
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  top: adaptiveHeight(395);
  right: adaptiveWidth(480);
  z-index: 12;

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
  margin-bottom: adaptiveHeight(30);

  .file-item {
    // 改用 file-item class
    width: 280px;
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
  height: adaptiveHeight(195);
  width: 100%;
  overflow: hidden;
}

:deep(.selectcss) {
  width: adaptiveWidth(100);
  right: adaptiveWidth(11);

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
  font-size: adaptiveFontSize(12);
  border-radius: 2px;
}

.lb_table {
  width: adaptiveWidth(500);
  height: adaptiveHeight(400);
  left: adaptiveWidth(470);
  top: adaptiveHeight(600);
  background-color: red;
}

.lcTrendDialog {
  width: adaptiveWidth(500);
  height: adaptiveHeight(400);
  left: adaptiveWidth(470);
  top: adaptiveHeight(400);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  z-index: 10;
  position: fixed;

  .lcTrendDialog_top {


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

    .myInput {
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

  .lcTrendDialog_bottom {
    width: adaptiveWidth(450);
    height: calc(90% - adaptiveHeight(60));
    margin-left: adaptiveWidth(25);
    margin-top: adaptiveHeight(35);
  }
}
</style>
