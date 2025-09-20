<template>
  <div class="bigscreen_lt">
    <div class="bigscreen_lt_top">
      <div class="bigscreen_lt_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>监测数据</span>
      </div>
    </div>
    <div class="bigscreen_lt_bottom">
      <div @mouseenter="ltequipmentlistTimer.pause()" @mouseleave="ltequipmentlistTimer.resume()"
        class="bigscreen_lt_bottomnei">
        <Vue3SeamlessScroll :list="ltequipmentlist" :step="1" :singleHeight="70" hover class="scrool">
          <div class="bigscreen_lt_bottom_nei" v-for="(item, index) in ltequipmentlist">
            <img :src="item.img" alt="" />
            <div :style="{
              background: `url('${item.back}') no-repeat`,
              backgroundSize: '100% 100%',
            }">
              <span>{{ item?.equipment?.equipmentCode }}</span>

              <ElTooltip :content="item?.equipment?.equipmentName">
                <span class="single-line-ellipsis" :style="{
                  color: item.back !== '/img/红色背景.png' ? '#00FFF9' : '#FFBCC0',
                }">
                  {{ item?.equipment?.equipmentName }}
                </span>
              </ElTooltip>
              <span :style="{
                color: getEquipmentDataColor(item)
              }">
                {{ Math.round(item.equipmentData * 100) / 100 + "" + item?.threshold?.unit }}
              </span>
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
        <span>设备台账</span>
      </div>
      <el-input class="inputcss" placeholder="请输入设备名称" clearable :prefix-icon="Search"
        v-model="equipmentFormData.equipmentName" @change="searchEquipment" />
    </div>
    <div class="bigscreen_lc_bottom">
      <div class="bigscreen_lc_bottom_nei">
        <div class="bigscreen_lc_bottom_nei_t">
          <span>设备编号</span>
          <span>设备名称</span>
          <span>设备型号</span>
          <span>安装时间</span>
        </div>
        <div @mouseenter="jianceTimer.pause()" @mouseleave="jianceTimer.resume()" class="bigscreen_lc_bottom_neib">
          <Vue3SeamlessScroll :list="equipmentlist" :class-option="{
            step: 5,
          }" hover class="scrool">
            <div class="bigscreen_lc_bottom_nei_b" v-for="item in equipmentlist">
              <el-popover effect="dark" class="box-item" :content="item.equipmentCode" placement="top-start">
                <template #reference>
                  <span>
                    {{ item.equipmentCode }}
                  </span>
                </template>
              </el-popover>
              <!-- <span>
                {{ item.equipmentCode }}
              </span> -->
              <el-popover effect="dark" class="box-item" :content="item.equipmentName" placement="top-start">
                <template #reference>
                  <span>
                    {{ item.equipmentName }}
                  </span>
                </template>
              </el-popover>
              <!-- <span>{{ item.equipmentName }}</span> -->
              <span>{{ item.equipmentType }}</span>
              <span>{{ dayjs(item.purchaseDate).format("YYYY-MM-DD") }}</span>
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
        <span>设备运行状态</span>
      </div>
      <el-cascader :options="equipmentlist2" v-model="equipmentIds" @change="cascaderChange" class="cascaderCss" :props="{
        value: 'id',
        label: 'name',
        children: 'thresholdList',
      }" />
    </div>
    <div class="bigscreen_lb_bottom">
      <h1>运行时间:{{ runningTime }}</h1>
      <div @mouseenter="historicalStatisticsListTimer.pause()" @mouseleave="historicalStatisticsListTimer.resume()"
        class="bigscreen_lb_bottom_nei" ref="bigscreenLBRef"></div>
    </div>
  </div>
  <center></center>
  <div class="bigscreen_rt">
    <div class="bigscreen_rt_top">
      <div class="bigscreen_rt_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>监控视频</span>
      </div>
      <el-input class="inputcss" placeholder="请输入监控点位" v-model="channelQuery.name" :prefix-icon="Search" />
    </div>
    <div class="bigscreen_rt_bottom">
      <div class="bigscreen_rt_bottom_nei">
        <img src="/public/img/监控报告图标.png" alt="" />
        <div class="bigscreen_rt_bottom_r">
          <div @click="rtClick(item)" v-for="item in videoList">
            <span>{{ item.name }}</span>
          </div>
          <!-- <div @click="rtClick"><span>JK218 科学大道点位1</span></div>
          <div><span>JK218 科学大道点位1</span></div>
          <div><span>JK218 科学大道点位1</span></div> -->
        </div>
      </div>
    </div>
  </div>
  <div class="bigscreen_rc">
    <div class="bigscreen_rc_top">
      <div class="bigscreen_rc_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>维修记录</span>
      </div>
      <div class="bigscreen_rc_top_r">
        <el-input class="inputcss" placeholder="请输入设备编号" :prefix-icon="Search" clearable
          v-model="repairformData.equipmentCode" @change="equipmentRepairListFun" />
        <el-button link @click="rctClick" style="color: #ffffff">维修统计分析</el-button>
      </div>
    </div>
    <div class="bigscreen_rc_bottom">
      <div class="bigscreen_rc_bottom_nei">
        <div class="bigscreen_rc_bottom_nei_t">
          <span>设备编号</span>
          <span>维修日期</span>
          <span>维修人员</span>
        </div>
        <div class="bigscreen_rc_bottom_b" @mouseleave="repairListTimer.resume()" @mouseenter="repairListTimer.pause()">
          <Vue3SeamlessScroll :list="repairList" :class-option="{
            step: 5,
          }" hover class="scrool">
            <div :class="item.status
              ? 'bigscreen_rc_bottom_nei_active'
              : 'bigscreen_rc_bottom_nei_b'
              " v-for="(item, index) in repairList" @click="rcClick(item)">
              <span>{{ item.equipment.equipmentCode }}</span>
              <span>{{ dayjs(item.createTime).format("YYYY-MM-DD") }}</span>
              <span>{{ item.repairPersonnel }}</span>
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
        <span>巡检记录</span>
        <ElButton link style="color: white;" @click="handleOpenXunJianQushi" class="bigscreen_rb_top_l_rg">巡检趋势分析
        </ElButton>
      </div>
    </div>
    <div class="bigscreen_rb_bottom">
      <img src="/public/img/xujian.png" alt="" />
      <div class="bigscreen_rb_bottom_r">
        <div class="bigscreen_rb_bottom_r_t">
          <span>巡检编号</span>
          <span>巡检日期</span>
          <span>巡检人员</span>
        </div>
        <div @mouseenter="inspectionListTimer.pause()" @mouseleave="inspectionListTimer.pause()"
          class="bigscreen_rb_bottom_r_b">
          <Vue3SeamlessScroll :list="inspectionlist" :class-option="{
            step: 5,
          }" hover class="scrool">
            <div class="bigscreen_rb_bottom_r_nei" v-for="(item, index) in inspectionlist" @click="rbClick(item)">
              <div class="bigscreen_rb_bottom_r_neis">
                <div :style="{
                  width: '13px',
                  height: '13px',
                  border: `1px solid ${index % 2 === 0 ? '#01D1E7' : '#DF9819'
                    }`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '0 15px',
                }">
                  <div :style="{
                    width: '5px',
                    height: '5px',
                    background: index % 2 === 0 ? '#01D1E7' : '#DF9819',
                  }"></div>
                </div>
                {{ item.recordId }}
              </div>
              <div class="bigscreen_rb_bottom_r_neis" style="color: #ffffff; font-size: 12px">
                {{ dayjs(item.inspectionDate).format("YYYY-MM-DD") }}
              </div>
              <div class="bigscreen_rb_bottom_r_neis" :style="{
                color: index % 2 === 0 ? '#01D1E7' : '#DF9819',
                fontSize: '12px',
                marginRight: '15px',
              }">
                {{ item.inspector }}
              </div>
            </div>
          </Vue3SeamlessScroll>
        </div>
      </div>
    </div>

    <div class="rb_dialog" v-show="ciShuDig">
      <div class="rb_dialog_top">
        <span>巡检趋势</span>
        <img @click="ciShuDig = false" class="rb_dialog_top_x" :src="img9" alt="" srcset="" />

        <div class="pickerCss">
          <img src="/public/img/zuo.svg" alt="" @click="ciShuLeftClick" style="margin-left: 5px" />
          <span>{{
            dayjs(ciShuTimer.startTime).format("MM月DD日")
          }}</span>
          <span>-</span>
          <span>{{
            dayjs(ciShuTimer.endTime).format("MM月DD日")
          }}</span>
          <img src="/public/img/you.svg" alt="" @click="ciShuRightClick" style="margin-right: 5px" />
        </div>
      </div>
      <div class="rb_dialog_bottom">
        <div class="rb_dialog_bottom_echart" ref="qushiRef"></div>
      </div>
    </div>
  </div>

  <template v-for="item in repairList">
    <div v-if="item.status" class="rcDialog">
      <div class="rcDialog_top">
        <span>维修记录详情</span>
        <img :src="img9" alt="" srcset="" @click="rccanleClick(item)" />
      </div>
      <div class="rcDialog_bottom">
        <div class="rcDialog_bottoml">
          <div>
            <span>维修编号：</span>
            <span>{{ item.recordId }}</span>
          </div>
          <div>
            <span>设备编号：</span>
            <span>{{ item.equipment.equipmentCode }}</span>
          </div>
          <div>
            <span>维修时间：</span>
            <span>{{ dayjs(item.repairDate).format("YYYY-MM-DD") }}</span>
          </div>
          <div>
            <span>维修人员：</span>
            <span>{{ item.repairPersonnel }}</span>
          </div>
          <div>
            <span>维修费用：</span>
            <span>{{ item.repairCost }}</span>
          </div>
          <div>
            <span>维修内容：</span>
            <span>{{ item.repairContent }}</span>
          </div>
          <div>
            <span>维修原因：</span>
            <span>{{ item.faultReason }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>

  <template v-for="item in inspectionlist">
    <div v-if="item.status" class="rbDialog">
      <div class="rbDialog_top">
        <span>巡检记录详情</span>
        <img :src="img9" alt="" srcset="" @click="rbcanleClick(item)" />
      </div>
      <div class="rbDialog_bottom">
        <div class="rbDialog_bottoml">
          <div>
            <span>巡检编号：</span>
            <span> {{ item.recordId }}</span>
          </div>
          <div>
            <span>巡检时期：</span>
            <span> {{ dayjs(item.inspectionDate).format("YYYY-MM-DD") }}</span>
          </div>
          <div>
            <span>巡检人员：</span>
            <span>{{ item.inspector }}</span>
          </div>
          <div>
            <span>异常数：</span>
            <span>{{ item.anomalyCount }}</span>
          </div>
          <div>
            <span>巡检内容：</span>
            <span>{{ item.taskDescription }}</span>
          </div>
          <div>
            <span>异常说明：</span>
            <span>{{ item.anomalyDescription }}</span>
          </div>
        </div>
        <!-- <img :src="item.img" alt="" /> -->
      </div>
    </div>
  </template>

  <div v-if="rcStatus" class="rctDialog">
    <div class="rctDialog_top">
      <span>维修统计分析</span>
      <ElInput placeholder="请输入设备编号" v-model="yzInput" @keydown.enter="yzRadioChange" class="inputcss yzInput" />
      <el-radio-group v-model="yzRadio" class="group yzRadio" @change="yzRadioChange">
        <el-radio-button label="周" value="week" />
        <el-radio-button label="年" value="year" />
      </el-radio-group>
      <img :src="img9" alt="" srcset="" @click="rctcanleClick" />
    </div>
    <div class="rctDialog_bottom" ref="bigscreenRCRef"></div>
  </div>
  <div v-if="rtStatus" class="rtDialog">
    <div class="rtDialog_top">
      <span>查看监控视频</span>
      <img :src="img9" alt="" srcset="" @click="rtcanleClick" />
    </div>
    <div class="rtDialog_bottom">
      <Video class="rtDialog_bottom_video" ref="videoRef" />
      <!-- <div>倍速播放×1</div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
import { Search } from "@element-plus/icons-vue";
import center from "../../components/center.vue";
import {
  equipmentRepairList,
  equipmentRepairListRes,
  dailyInspectionList,
  dailyInspectionRes,
  equipmentList,
  historicalStatisticsList,
  repairStatistics,
  getRunningTime,
} from "../../api/equipment/index";
import dayjs from "dayjs";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import img9 from "../../../public/img/叉号.png";
import { getChannelListApi, getStreamUrlApi } from "../../api/video";
import Video from "../home/components/Video.vue";
import { thresholdDataList } from "../../api/riskassessment";
import { useIntervalFn } from '@vueuse/core'
import { useXunJianQushiHook } from "./qushi";


const rtStatus = ref(false);
const videoRef = ref();
const rtClick = (item) => {
  rtStatus.value = !rtStatus.value;
  getStreamUrlApi(item.channelid).then((res) => {
    console.log("res.data.data.wsflv", res.data.data.wsflv);
    const url = new URL(res.data.data.wsflv);
    url.host = location.host;
    videoRef.value.play(url.toString());
    videoRef.value.setChannelId(res.data.data.channelId);
  });
  // nextTick(() => {
  //   getStreamUrlApi(item.channelid).then((res) => {
  //     console.log("res.data.data.wsflv", res.data.data.wsflv);
  //     videoRef.value.play(res.data.data.wsflv);
  //     videoRef.value.setChannelId(res.data.data.channelId);
  //   });
  // });
};
const rtcanleClick = () => {
  rtStatus.value = false;
};

//监测数据
const ltequipmentFormData = ref({
  equipmentName: "",
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const ltequipmentlist = ref<any[]>([]);
// 修改获取设备数据颜色的方法
const getEquipmentDataColor = row => {
  if (!row.threshold?.values?.length) return "white";

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
const ltequipmentListFun = async () => {
  // const { data } = await equipmentList(ltequipmentFormData.value);
  // let list = data.data.rows;
  // let img = ["/img/正常状态.png", "/img/异常状态.png"];
  // let back = ["/img/绿色背景.png", "/img/红色背景.png"];
  // ltequipmentlist.value = list.map((item, index) => {
  //   return {
  //     ...item,
  //     img: img[index % img.length],
  //     back: back[index % back.length],
  //   };
  // });
  const { data } = await thresholdDataList(ltequipmentFormData.value);
  let list = data.data.rows;
  ltequipmentlist.value = list.map((item, index) => {
    if (!item.threshold?.values?.length) {
      return {
        ...item,
        img: "/img/正常状态.png",
        back: "/img/绿色背景.png",
      }
    }

    const value = Number(item.equipmentData);
    const thresholds = item.threshold.values;

    // 按照level等级排序
    const sortedThresholds = [...thresholds].sort((a, b) => {
      const levelA = Number(a.level.replace(/[^0-9]/g, ""));
      const levelB = Number(b.level.replace(/[^0-9]/g, ""));
      return levelB - levelA;
    });
    for (const threshold of sortedThresholds) {
      if (value >= threshold.min && value <= threshold.max) {
        // 根据不同等级返回不同颜色
        return {
          ...item,
          img: `/img/异常状态.png`,
          back: `/img/红色背景.png`,
        }
      }
    }
    return {
      ...item,
      img: `/img/正常状态.png`,
      back: `/img/绿色背景.png`,
    }
  })
};
const ltequipmentlistTimer = useIntervalFn(() => {
  ltequipmentlistTimer.pause();
  ltequipmentListFun().finally(() => {
    ltequipmentlistTimer.resume();
  })
}, 100000)

//设备台账
const equipmentFormData = ref({
  equipmentName: "",
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const equipmentId = ref(0);
const equipmentIds = ref<number[]>([]);
const equipmentlist = ref<any[]>([]);
const equipmentlist2 = ref<any[]>([]);
const equipmentListFun = async () => {
  const { data } = await equipmentList(equipmentFormData.value);
  let list = data.data.rows;
  equipmentlist.value = list;
  equipmentlist2.value = data.data.rows.map((item) => {
    const list = item.thresholdList.map((v) => {
      return {
        ...v,
        id: v.thresholdId,
        name: v.sensorName,
        label: v.sensorName,
      };
    });
    return {
      ...item,
      id: item.equipmentId,
      name: item.equipmentName + (item.equipmentCode != null || item.equipmentCode != "" ? "(" + item.equipmentCode + ")" : ""),
      thresholdList: list,
    };
  });
  equipmentId.value = data.data.rows[0].equipmentId;
  equipmentIds.value = [
    equipmentlist2.value[0].equipmentId,
    equipmentlist2.value[0].thresholdList[0].thresholdId,
  ];
  thresholdId.value = equipmentlist2.value[0].thresholdList[0].thresholdId;
  historicalStatisticsListFun();
};
const searchEquipment = (val) => {
  equipmentListFun();
};
// const equipmentListTimer = useIntervalFn(() => {
//   equipmentListTimer.pause();
//   equipmentListFun().finally(() => {
//     equipmentListTimer.resume();
//   })
// }, 10000)

//设备运行状态
let bigscreenLBChart: any = null;
const bigscreenLBRef = ref();
const bigscreenLBoption = {
  grid: {
    left: "6%",
    right: "6%",
    bottom: "6%",
    top: "15%",
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
  tooltip: {
    trigger: 'axis', //坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
    axisPointer: {// 坐标轴指示器，坐标轴触发有效
      type: 'line' // 默认为直线，可选为：'line' | 'shadow'
    },
    formatter: function (params) {
      console.log(params)
      return `
      设备名称: ${params[0].data.equipmentName} <br/>
      设备编号: ${params[0].data.equipmentCode} <br/>
      传感器: ${params[0].data.sensorName} <br/>
      单位: ${params[0].data.unitName} <br/>
      值: ${params[0].value}
    `;
    }
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
const thresholdId = ref(0);
const runningTime = ref("0");
const historicalStatisticsListFun = async () => {
  const { data } = await historicalStatisticsList({
    thresholdId: thresholdId.value,
  });
  bigscreenLBoption.xAxis.data = data.time;
  bigscreenLBoption.series[0].data = data.data;
  if (Array.isArray(data.data) && data.data.length > 0) {
    bigscreenLBoption.series[0].data = data.data.map((item) => {
      return {
        value: item,
        equipmentName: data.equipmentName,
        equipmentCode: data.equipmentCode,
        unitName: data.unitName,
        sensorName: data.sensorName,
      }
    })
  }
  if (bigscreenLBRef.value && bigscreenLBChart == null) {
    bigscreenLBChart = echarts.init(bigscreenLBRef.value);
  }
  bigscreenLBChart.setOption(bigscreenLBoption, true);
  getRunningTime(thresholdId.value).then(res => {
    runningTime.value = res.data.data;
  })

};
const historicalStatisticsListTimer = useIntervalFn(() => {
  historicalStatisticsListTimer.pause();
  historicalStatisticsListFun().finally(() => {
    historicalStatisticsListTimer.resume();
  })
}, 10000)

const cascaderChange = (val) => {
  thresholdId.value = val[1];
  historicalStatisticsListFun();
};

//维修记录
const repairformData = ref<equipmentRepairListRes>({
  equipmentCode: "",
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const repairList = ref<any[]>([]);
const equipmentRepairListFun = async () => {
  const { data } = await equipmentRepairList(repairformData.value);
  let list = data.data.rows;
  repairList.value = list.map((item) => {
    {
      return {
        ...item,
        status: false,
      };
    }
  });
};
const repairListTimer = useIntervalFn(() => {
  repairListTimer.pause();
  equipmentRepairListFun().finally(() => {
    repairListTimer.resume();
  })
}, 10000)
const rcClick = async (item: any) => {
  repairList.value.forEach((v) => {
    if (item.recordId == v.recordId) {
      v.status = !v.status;
    } else {
      v.status = false;
    }
  });
};
const rccanleClick = (item: any) => {
  item.status = false;
};

let bigscreenRCChart: any = null;
const bigscreenRCRef = ref();
const bigscreenRCoption = {
  grid: {
    top: "15%",
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
      formatter: function (value) {
        return Math.round(value);
      }
    },
    // interval: 20,
    min: 'dataMin',
    max: 'dataMax',
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
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
};
const rcStatus = ref(false);
const repairStatisticsData = ref({
  dayType: "week",
});

async function getYzData() {
  const { data } = await repairStatistics({
    dayType: yzRadio.value,
    code: yzInput.value
  });
  bigscreenRCoption.xAxis.data = data.data.times;
  bigscreenRCoption.series[0].data = data.data.data;
  if (bigscreenRCRef.value) {
    bigscreenRCChart = echarts.init(bigscreenRCRef.value);
    bigscreenRCChart.setOption(bigscreenRCoption);
  }
}
const rctClick = async () => {
  rcStatus.value = !rcStatus.value;
  getYzData();
};
const rctcanleClick = () => {
  rcStatus.value = false;
};

//巡检记录
const inspectionformData = ref<dailyInspectionRes>({
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const inspectionlist = ref<any[]>([]);
const inspectionListFun = async () => {
  const { data } = await dailyInspectionList(inspectionformData.value);
  let list = data.data.rows;
  inspectionlist.value = list.map((item) => {
    {
      return {
        ...item,
        status: false,
      };
    }
  });
};
const inspectionListTimer = useIntervalFn(() => {
  inspectionListTimer.pause();
  inspectionListFun().finally(() => {
    inspectionListTimer.resume();
  })
}, 10000)
const rbClick = (item: any) => {
  inspectionlist.value.forEach((v) => {
    if (item.recordId == v.recordId) {
      v.status = !v.status;
    } else {
      v.status = false;
    }
  });
};
const rbcanleClick = (item: any) => {
  item.status = false;
};

const yzRadio = ref("week");
const yzInput = ref("");
function yzRadioChange() {
  getYzData();
}

const channelQuery = ref({
  name: "",
  pageNum: 1,
  pageSize: 3,
});
const videoList = ref([]);

const getVideoList = () => {
  getChannelListApi(channelQuery.value).then((res) => {
    videoList.value = res.data.data.List;
  });
};

const jianceTimer = useIntervalFn(() => {
  jianceTimer.pause();
  ltequipmentListFun().finally(() => {
    jianceTimer.resume();
  })
}, 10000)

window.onresize = function () {
  bigscreenLBChart.resize();
};


const { ciShuTimer,
  ciShuLeftClick,
  ciShuRightClick,
  dailyCishuInspectionListFunc,
  qushiRef,
  ciShuDig, handleOpenXunJianQushi } = useXunJianQushiHook()

onMounted(() => {
  equipmentRepairListFun();
  inspectionListFun();
  equipmentListFun();
  ltequipmentListFun();
  getVideoList()
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

.yzInput {
  position: relative;
  left: adaptiveWidth(20);
  top: adaptiveHeight(5);
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
    align-items: center;
    justify-content: center;

    .bigscreen_lt_bottomnei {
      overflow: hidden;
      height: adaptiveHeight(251);

      .bigscreen_lt_bottom_nei {
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: adaptiveWidth(66);
          height: adaptiveHeight(60);
        }

        div {
          width: adaptiveWidth(324);
          height: adaptiveHeight(39);
          display: flex;
          align-items: center;

          &:nth-child(2) {
            margin: adaptiveHeight(18) 0;
          }

          span {
            &:nth-child(1) {
              font-size: adaptiveFontSize(12);
              color: #ffffff;
              padding: 0 adaptiveWidth(32);
            }

            &:nth-child(2) {
              font-family: youshe;
              font-size: adaptiveFontSize(20);
            }

            &:nth-child(3) {
              // font-family: youshe;
              font-size: adaptiveFontSize(12);
              margin-left: adaptiveFontSize(30);
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

    .bigscreen_lc_bottom_nei {
      width: adaptiveWidth(407);
      margin: 0 auto;

      .bigscreen_lc_bottom_nei_t {
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

      .bigscreen_lc_bottom_neib {
        width: 100%;
        height: adaptiveHeight(200);
        overflow: hidden;

        .bigscreen_lc_bottom_nei_b {
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
            // 超出部分隐藏
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:nth-child(1),
            &:nth-child(2),
            &:nth-child(3),
            &:nth-child(4) {
              text-align: center;
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

    h1 {
      width: 100%;
      font-size: adaptiveFontSize(12);
      height: adaptiveHeight(12);
      color: white;
      position: relative;
      top: adaptiveHeight(12);
      margin-left: adaptiveWidth(10);
    }

    .bigscreen_lb_bottom_nei {
      width: 100%;
      height: calc(100% - adaptiveHeight(12));
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

    .bigscreen_rc_top_r {
      margin-right: adaptiveWidth(11);
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

      .bigscreen_rc_bottom_b {
        width: 100%;
        height: adaptiveHeight(200);
        overflow: hidden;

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
            font-size: adaptiveFontSize(12);
            text-align: center;
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
          margin-top: adaptiveHeight(5);
          cursor: pointer;

          span {
            width: 33%;
            color: #58a4cb;
            font-size: adaptiveFontSize(12);
            text-align: center;
            position: relative;

            &:nth-child(1) {
              img {
                position: absolute;
                width: adaptiveWidth(18);
                height: adaptiveHeight(17);
                left: adaptiveWidth(25);
              }
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
      width: 100%;

      img {
        margin-left: adaptiveWidth(11);
      }

      span {
        font-weight: 600;
        font-size: adaptiveFontSize(16);
        // text-align: center;
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
        width: adaptiveWidth(100);
        box-sizing: border-box;
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
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: adaptiveWidth(99);
      height: adaptiveHeight(211);
    }

    .bigscreen_rb_bottom_r {
      width: adaptiveWidth(290);
      height: adaptiveHeight(211);
      margin-left: adaptiveWidth(15);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      .bigscreen_rb_bottom_r_t {
        width: 100%;
        height: adaptiveHeight(30);
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

      .bigscreen_rb_bottom_r_b {
        width: 100%;
        height: adaptiveHeight(171);
        overflow: hidden;
      }

      .bigscreen_rb_bottom_r_nei {
        width: 100%;
        height: adaptiveHeight(35);
        background: rgba(4, 30, 62);
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: adaptiveHeight(10);
        cursor: pointer;

        .bigscreen_rb_bottom_r_neis {
          width: 33%;

          &:nth-child(1) {
            color: #ffffff;
            font-size: adaptiveFontSize(12);
            display: flex;
            align-items: center;
          }

          &:nth-child(2),
          &:nth-child(3) {
            text-align: center;
          }
        }
      }
    }
  }
}

.rcDialog {
  width: adaptiveWidth(440);
  height: adaptiveHeight(280);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: adaptiveHeight(400);
  right: adaptiveWidth(480);
  z-index: 10;

  .rcDialog_top {
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

  .rcDialog_bottom {
    width: adaptiveWidth(420);
    height: adaptiveHeight(200);
    margin: adaptiveHeight(10) auto;

    img {
      width: adaptiveWidth(99);
      height: adaptiveHeight(99);
    }

    .rcDialog_bottoml {
      height: adaptiveHeight(200);
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      div {
        margin-left: adaptiveWidth(20);

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

    .rtDialog_bottom_video {
      :deep(#container) {
        width: adaptiveWidth(420);
        height: adaptiveHeight(215);
        object-fit: cover;
      }

      object-fit: cover;
    }

    // :deep(.rtDialog_bottom_video) {
    //   #container[data-v-39551662] {
    //     width: adaptiveWidth(420);
    //     height: adaptiveHeight(215);
    //     object-fit: cover;
    //   }
    //   object-fit: cover;
    // }
    img {
      width: 100%;
      height: adaptiveHeight(195);
    }

    div {
      font-size: adaptiveFontSize(14);
      color: #ffffff;
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
    width: 100%;

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

    img {
      width: adaptiveWidth(99);
      height: adaptiveHeight(99);
    }

    .rbDialog_bottoml {
      height: adaptiveHeight(200);
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      div {
        margin-left: adaptiveWidth(20);

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

.rctDialog {
  width: adaptiveWidth(440);
  height: adaptiveHeight(280);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: adaptiveHeight(400);
  right: adaptiveWidth(480);
  z-index: 10;

  .rctDialog_top {
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

  .rctDialog_bottom {
    width: adaptiveWidth(420);
    height: adaptiveHeight(200);
    margin: adaptiveHeight(10) auto;
  }
}

:deep(.cascaderCss) {
  width: adaptiveWidth(200);
  height: adaptiveHeight(24);
  margin-right: adaptiveWidth(11);

  .el-input__wrapper {
    background: none;
    height: adaptiveHeight(24);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
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
  width: adaptiveWidth(148);
  height: adaptiveHeight(24);
  margin-right: adaptiveWidth(11);
  --el-input-bg-color: rgba(255, 255, 255, 0);

  :deep(.is-focus) {
    // --el-input-focus-border-color: blue;
  }

  :deep(input) {
    caret-color: white;
  }
}

.inputcss :deep(.el-input__wrapper) {
  // background-color: rgba(255, 255, 255, 0);
  // border: 1px solid rgba(255, 255, 255, 0.2);
  // box-shadow: none;
  font-size: adaptiveFontSize(12);
}

.scroll {
  height: adaptiveHeight(195);
  width: 100%;
  overflow: hidden;
}

.yzRadio {
  position: relative;
  top: adaptiveHeight(5);
}

.group :deep(.el-radio-button.is-active .el-radio-button__original-radio:not(:disabled) + .el-radio-button__inner) {
  background: rgba(255, 255, 255, 0.8);
  color: rgba(7, 36, 57, 1);
  border-color: rgba(255, 255, 255, 0);
  font-size: adaptiveFontSize(12);
}

.group :deep(.el-radio-button .el-radio-button__inner) {
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0);
  border-color: rgba(255, 255, 255, 0);
  font-size: adaptiveFontSize(12);
  border-radius: 2px;
}

.single-line-ellipsis {
  max-width: adaptiveWidth(100);
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
  /* 溢出隐藏 */
  text-overflow: ellipsis;
  /* 超出部分显示省略号 */
}


.rb_dialog {
  width: adaptiveWidth(440);
  height: adaptiveHeight(270);
  position: absolute;
  top: 0;
  left: - adaptiveWidth(450);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
}

.rb_dialog_top {
  width: 100%;
  height: adaptiveHeight(45);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .rb_dialog_top_x {
    position: absolute;
    right: adaptiveWidth(7);
  }

  span {
    font-family: youshe;
    font-size: adaptiveFontSize(20);
    color: #ffffff;
    padding-left: adaptiveWidth(15);
  }
}

.rb_dialog_bottom {
  height: adaptiveHeight(225);
}

.rb_dialog_bottom_echart {
  width: adaptiveWidth(450);
  height: adaptiveHeight(215);
}

.pickerCss {

  width: adaptiveWidth(155);
  height: adaptiveHeight(18);
  border: 1px solid rgba(227, 233, 243, 0.2);
  border-radius: 5px;
  margin-right: adaptiveWidth(11);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  top: adaptiveWidth(6);
  left: - adaptiveWidth(20);
  box-sizing: border-box;

  span {
    color: #ffffff;
    font-size: adaptiveFontSize(10);
    font-family: unset !important;
    font-weight: 100 !important;
  }
}

.bigscreen_rb_top_l_rg {
  margin-left: auto;
  margin-right: adaptiveWidth(12);
}
</style>
