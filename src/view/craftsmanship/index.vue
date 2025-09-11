<template>
  <div class="bigscreen_lt">
    <div class="bigscreen_lt_top">
      <div class="bigscreen_lt_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>报警信息</span>
      </div>
    </div>
    <div class="bigscreen_lt_bottom">
      <div class="bigscreen_lt_bottom_t">
        <img src="/public/img/craftsmanship/infoIcon.png" alt="" />
        <div class="bigscreen_lt_bottom_tdiv">
          <span>报警信息</span>
          <br />
          <span>Alarm message</span>
        </div>
        <div class="bigscreen_lt_bottom_tdiv">
          <div class="bigscreen_lt_bottom_tdiv_l">
            <div style="background: #0574cb"></div>
            <div style="
                border-left: 1px solid #0574cb;
                border-bottom: 1px solid #0574cb;
              "></div>
          </div>
          <div class="bigscreen_lt_bottom_tdiv_r">
            <span>一般</span>
            <span>
              {{
                alarmEventslist.filter((item) => item.level == "一般").length
              }}
            </span>
          </div>
        </div>
        <div class="bigscreen_lt_bottom_tdiv">
          <div class="bigscreen_lt_bottom_tdiv_l">
            <div style="background: #f99b61"></div>
            <div style="
                border-left: 1px solid #f99b61;
                border-bottom: 1px solid #f99b61;
              "></div>
          </div>
          <div class="bigscreen_lt_bottom_tdiv_r">
            <span>重要</span>
            <span>
              {{
                alarmEventslist.filter((item) => item.level == "重要").length
              }}
            </span>
          </div>
        </div>
        <div class="bigscreen_lt_bottom_tdiv">
          <div class="bigscreen_lt_bottom_tdiv_l">
            <div style="background: #f96168"></div>
            <div style="
                border-left: 1px solid #f96168;
                border-bottom: 1px solid #f96168;
              "></div>
          </div>
          <div class="bigscreen_lt_bottom_tdiv_r">
            <span>紧急</span>
            <span>
              {{
                alarmEventslist.filter((item) => item.level == "紧急").length
              }}
            </span>
          </div>
        </div>
      </div>
      <div class="bigscreen_lt_bottom_b">
        <div class="bigscreen_lt_bottom_b_neis">
          <Vue3SeamlessScroll :list="alarmEventslist" :step="1" :singleHeight="72" hover class="scrool">
            <div class="bigscreen_lt_bottom_b_nei" v-for="item in alarmEventslist">
              <img :src="item.img" alt="" />
              <div>
                <span style="margin-left: 25px">{{ item.level }}</span>
                <span>{{ item.craftNode?.nodeName }}</span>
                <span>节点故障</span>
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
        <span>工艺节点</span>
      </div>
      <el-input class="inputcss" style="width: 148px; height: 24px; margin-right: 11px" placeholder="请输入节点名称"
        :prefix-icon="Search" clearable v-model="nodeFormData.nodeName" @change="nodelistFun" />
    </div>
    <div class="bigscreen_lb_bottom">
      <div class="bigscreen_lb_bottom_nei">
        <div class="bigscreen_lb_bottom_nei_t">
          <div style="width: 38px; height: 1px"></div>
          <div class="bigscreen_lb_bottom_nei_t_r">
            <span>节点名称</span>
            <span>所属工艺</span>
            <span>是否为高风险</span>
          </div>
        </div>
        <div class="bigscreen_lb_bottom_nei">
          <Vue3SeamlessScroll :list="nodelist" :class-option="{
            step: 5,
          }" hover class="scrool">
            <div class="bigscreen_lb_bottom_neis" v-for="item in nodelist" @click="lbClick(item)">
              <div class="bigscreen_lb_bottom_nei_t_l" :style="{
                background: `url(${item.img}) no-repeat`,
                'background-size': '100% 100%',
              }">
                {{ item.nodeOrder }}
              </div>
              <div class="bigscreen_lb_bottom_neis_r">
                <span :style="{
                  color: item.isHighRisk ? 'red' : '#ffffff',
                }">{{ item.nodeName }}</span>
                <span>{{ item.craftArchive.craftArchiveName }}</span>
                <span>{{ item.isHighRisk ? "是" : "否" }}</span>
              </div>
            </div>
          </Vue3SeamlessScroll>
        </div>
      </div>
    </div>
  </div>
  <center></center>
  <div class="bigscreen_rt">
    <div class="bigscreen_rt_top">
      <div class="bigscreen_rt_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>工艺要素</span>
      </div>
    </div>
    <div class="bigscreen_rt_bottom">
      <div class="bigscreen_rt_bottom_count">
        <img src="/public/img/craftsmanship/yaosuicon.png" style="margin: 0 20px 0 28px" alt="" />
        <div style="
            height: 67px;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          ">
          <div style="display: flex; align-items: center">
            <span style="font-size: 18px">工艺要素</span>
            <span style="font-size: 28px; padding-left: 25px">{{
              processTotal
              }}</span>
          </div>
          <div>
            <span>
              <img src="/public/img/craftsmanship/lanshang.png" alt="" />
              <span style="padding-left: 10px; font-size: 14px">人力要素</span>
            </span>
            <span style="padding-left: 15px">
              <img src="/public/img/craftsmanship/lvshang.png" alt="" />
              <span style="padding-left: 10px; font-size: 14px">原料要素</span>
            </span>
            <span style="padding-left: 15px">
              <img src="/public/img/craftsmanship/huangshang.png" alt="" />
              <span style="padding-left: 10px; font-size: 14px">设备要素</span>
            </span>
          </div>
        </div>
      </div>
      <div class="bigscreen_rt_bottom_neis">
        <Vue3SeamlessScroll :list="processlist" :class-option="{
          step: 5,
        }" hover class="scrool">
          <div class="bigscreen_rt_bottom_nei" v-for="item in processlist" @click="rtClcik(item)">
            <span>{{ item.craftArchiveName }}</span>
            <span>{{ item.personnelFactors }}</span>
            <span>{{ item.materialFactors }}</span>
            <span>{{ item.environmentFactors }}</span>
          </div>
        </Vue3SeamlessScroll>
      </div>
    </div>
  </div>
  <div class="bigscreen_rb">
    <div class="bigscreen_rb_top">
      <div class="bigscreen_rb_top_l">
        <img src="/public/img/光标.png" alt="" />
        <span>工艺档案</span>
      </div>
    </div>
    <div class="bigscreen_rb_bottom">
      <div class="bigscreen_rb_bottom_nei">
        <div class="bigscreen_rb_bottom_nei_t">
          <span>工艺名称</span>
          <span>版本号</span>
          <span>工艺制定人员</span>
        </div>
        <div class="bigscreen_rb_bottom_nei_items">
          <Vue3SeamlessScroll :list="archivelist" :class-option="{
            step: 5,
          }" hover class="scrool">
            <div class="bigscreen_rb_bottom_nei_item" v-for="(item, index) in archivelist" @click="rbClick(item)">
              <div class="bigscreen_rb_bottom_nei_item1">
                <div class="bigscreen_rb_bottom_nei_item1_div" :style="{
                  border: `1px solid ${index % 2 === 0 ? '#01D1E7' : '#DF9819'
                    }`,
                }">
                  <div :style="{
                    background: index % 2 === 0 ? '#01D1E7' : '#DF9819',
                  }"></div>
                </div>
                <ElTooltip :content="item.craftArchiveName">
                  <span>{{ item.craftArchiveName }}</span>
                </ElTooltip>
              </div>
              <div>{{ item.version }}</div>
              <div :style="{
                color: index % 2 === 0 ? '#01D1E7' : '#DF9819',
              }">
                {{ item.creator }}
              </div>
            </div>
          </Vue3SeamlessScroll>
        </div>
      </div>
    </div>
  </div>

  <!-- <template v-for="item in nodelist"> -->
  <div v-show="lbShow" class="lbDialog">
    <div class="lbDialog_top">
      <span>工艺节点详情</span>
      <img :src="img9" alt="" srcset="" @click="lbcanleClick" />
    </div>
    <div class="lbDialog_bottom">
      <div>
        <span>节点编号：</span>
        <span>{{ lbInfo?.craftNodeId }}</span>
      </div>
      <div>
        <span>节点名称：</span>
        <span>{{ lbInfo?.nodeName }}</span>
      </div>
      <div>
        <span>所属工艺：</span>
        <span>病毒加工艺</span>
      </div>
      <div>
        <span>节点顺序：</span>
        <span>{{ lbInfo?.nodeOrder }}</span>
      </div>
      <div>
        <span>操作描述：</span>
        <span>{{ lbInfo?.operationDescription }}</span>
      </div>
      <div>
        <span>操作方式：</span>
        <span>{{ lbInfo?.operationMethod }}</span>
      </div>
      <div>
        <span>所需时间：</span>
        <span>{{ lbInfo?.requiredTime }}</span>
      </div>
      <div>
        <span>是否为高风险：</span>
        <span>{{ lbInfo?.isHighRisk ? "是" : "否" }}</span>
      </div>
    </div>
  </div>
  <!-- </template> -->

  <!-- <template v-for="item in processlist"> -->
  <div v-show="rtShow" class="rtDialog">
    <div class="rtDialog_top">
      <span>工艺要素详情</span>
      <img :src="img9" alt="" srcset="" @click="rtcanleClick" />
    </div>
    <div class="rtDialog_bottom">
      <el-scrollbar height="100%">
        <div class="rtDialog_bottom_con">
          <div>
            <span>工艺节点：</span>
            <span>{{ rtInfo?.craftNode.nodeName }}</span>
          </div>
          <div>
            <span>人员要素：</span>
            <span>{{ rtInfo?.personnelFactors }}</span>
          </div>
          <div>
            <span>设备要素：</span>
            <span>{{ rtInfo?.environmentFactors }}</span>
          </div>
          <div>
            <span>原料要素：</span>
            <span>{{ rtInfo?.materialFactors }}</span>
          </div>
          <div>
            <span>环境要素：</span>
            <span>{{ rtInfo?.environmentFactors }}</span>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
  <!-- </template> -->

  <!-- 工艺档案弹窗 -->
  <!-- <template v-for="item in archivelist"> -->
  <div v-show="rbShow" class="rbDialog">
    <div class="rbDialog_top">
      <span>工艺档案详情</span>
      <img :src="img9" alt="" srcset="" @click="rbcanleClick(item)" />
    </div>
    <div class="rbDialog_bottom">
      <div class="rbDialog_bottom_selet">
        <span v-for="(v, i) in processSelst">
          <span :style="{
            color: v.status ? '#16AAE8' : '#ffffff',
          }" @click="processSelstClick(rbInfo, v, i)">
            {{ v.name }}
          </span>
          <span style="padding: 0 10px; color: #ffffff" v-if="i === 0">/</span>
        </span>
      </div>
      <div class="info" v-if="processSelst[0].status">
        <div>
          <span>工艺编号：</span>
          <span>{{ rbInfo?.craftArchiveCode }}</span>
        </div>
        <div>
          <span>工艺名称：</span>
          <span>{{ rbInfo?.craftArchiveName }}</span>
        </div>
        <div>
          <span>版本：</span>
          <span>{{ rbInfo?.version }}</span>
        </div>
        <div>
          <span>工艺制定人员：</span>
          <span>{{ rbInfo?.creator }}</span>
        </div>
      </div>
      <div class="processflowchart" v-else>
        <el-scrollbar height="100%">
          <div class="processflowchart_con">
            <el-steps direction="vertical" :active="0">
              <el-step id="stepMy" v-for="item in rbInfoList" :title="item.nodeOrder">
                <template #title>
                  <div>
                    <span :style="{
                      color: item.isHighRisk ? 'red' : '#3582c7',
                    }">{{ item.nodeName }}</span>
                  </div>
                </template>
                <template #description>
                  <div>
                    <span>操作描述：</span>
                    <span>{{ item.operationDescription }}</span>
                  </div>
                  <div>
                    <span>操作方式：</span>
                    <span>{{ item.operationMethod }}</span>
                  </div>
                  <div>
                    <span>所需时间：</span>
                    <span>{{ item.requiredTime }}</span>
                  </div>
                  <!-- <div>
                    <span>是否为高风险：</span>
                    <span>{{ item.isHighRisk ? "是" : "否" }}</span>
                  </div> -->
                </template>
              </el-step>
            </el-steps>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
  <!-- </template> -->
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { Search } from "@element-plus/icons-vue";
import { archiveList, nodeList, processList } from "../../api/craftsmanship";
import { alarmEventsList } from "../../api/incident";
import center from "../../components/center.vue";
import img9 from "../../../public/img/叉号.png";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import { useIntervalFn } from '@vueuse/core'


const bigscreenLBRef = ref();
const bigscreenLBoption = {
  grid: {
    left: "60px",
    top: "40px",
    bottom: "40px",
  },

  xAxis: {
    type: "category",
    data: ["07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27"],
  },
  yAxis: {
    type: "value",
    splitLine: {
      show: true, //让网格显示
      lineStyle: {
        //网格样式
        color: ["rgba(255, 255, 255, 0.15)"], //网格的颜色
        width: 2, //网格的宽度
        type: "dashed", //网格是实实线，可以修改成虚线以及其他的类型
      },
    },
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
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

let bigscreenRBChart: any = null;
const bigscreenRBRef = ref();

const bigscreenRBoption = {
  grid: {
    left: "60px",
    top: "40px",
    bottom: "40px",
  },
  legend: {
    data: [
      {
        name: "设备报警",
        itemStyle: { color: "RGBA(255, 169, 19, 1)" },
      },
      {
        name: "环境数据",
        itemStyle: { color: "RGBA(225, 110, 122, 1)" },
      },
      {
        name: "物料数据",
        itemStyle: { color: "RGBA(65, 195, 142, 1)" },
      },
      {
        name: "工艺节点",
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
    data: ["07-21", "07-22", "07-23", "07-24", "07-25", "07-26", "07-27"],
  },
  yAxis: {
    type: "value",
    splitLine: {
      show: true,
      lineStyle: {
        color: ["rgba(255, 255, 255, 0.15)"],
        width: 2,
        type: "dashed",
      },
    },
  },
  series: [
    {
      name: "设备报警",
      data: [50, 60, 90, 200, 120, 140, 80],
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
      name: "环境数据",
      data: [20, 40, 60, 210, 90, 140, 50],
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
      name: "物料数据",
      data: [200, 20, 21, 30, 200, 170, 50],
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
      name: "工艺节点",
      data: [200, 180, 40, 30, 50, 170, 50],
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

//工艺档案
const archiveFormData = ref({
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const archivelist = ref<any[]>([]);
const archivelistFun = async () => {
  const { data } = await archiveList(archiveFormData.value);
  let list = data.data.rows;
  archivelist.value = list.map((item: any) => {
    return { ...item, status: false };
  });
};
const archiveTimer = useIntervalFn(() => {
  archiveTimer.pause();
  archivelistFun().finally(() => {
    archiveTimer.resume();
  })
}, 5000)
const rbInfo = ref();
const rbInfoList = ref([])
const rbClick = (item: any) => {
  rbInfo.value = item;
  rbShow.value = true;
  nodeList({
    pageNum: 1,
    pageSize: 100,
    craftArchiveId: item.craftArchiveId,
    orderColumn: "nodeOrder",
    orderDirection: "ascending"
  }).then(res => {
    rbInfoList.value = res.data.data.rows
  })
};
const rbShow = ref(false);

const rbcanleClick = (item: any) => {
  rbShow.value = false;
  processSelst.value[0].status = true;
  processSelst.value[1].status = false;
  processFormData.value.craftArchiveId = null;

};
const processSelst = ref([
  {
    name: "基本信息",
    status: true,
  },
  {
    name: "工艺流程图",
    status: false,
  },
]);
const processSelstClick = async (item, v, i) => {
  processSelst.value.forEach((j, k) => {
    if (i == k) {
      processSelst.value[k].status = true;
    } else {
      j.status = false;
    }
  });
  // processFormData.value.craftArchiveId = item.craftArchiveId;
  const { data } = await processList({
    ...processFormData.value,
    craftArchiveId:item.craftArchiveId
  });
  processlist2.value = data.data.rows;
};

//工艺节点
const nodeFormData = ref({
  nodeName: "",
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const nodelist = ref<any[]>([]);
const nodelistFun = async () => {
  const { data } = await nodeList(nodeFormData.value);
  let list = data.data.rows;
  let imgList = [
    "/img/craftsmanship/1.png",
    "/img/craftsmanship/2.png",
    "/img/craftsmanship/3.png",
    "/img/craftsmanship/4.png",
  ];
  nodelist.value = list.map((item, index) => {
    return { ...item, img: imgList[index % imgList.length], status: false };
  });
};

const nodelistFunTimer = useIntervalFn(() => {
  nodelistFunTimer.pause();
  nodelistFun().finally(() => {
    nodelistFunTimer.resume();
  })
}, 10000)
const lbShow = ref(false);
const lbInfo = ref()
const lbClick = (item: any) => {
  lbInfo.value = item;
  console.log("lbInfo", lbInfo.value)
  lbShow.value = true;
  // nodelist.value.forEach((v) => {
  //   if (item.craftNodeId == v.craftNodeId) {
  //     v.status = !v.status;
  //   } else {
  //     v.status = false;
  //   }
  // });
};
const lbcanleClick = (item: any) => {
  // rbShow.value = false;
  lbShow.value = false;
};

//报警信息
const alarmEventsFormData = ref({
  type: "工艺节点报警",
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const alarmEventslist = ref<any[]>([]);
const alarmEventsListFun = async () => {
  const { data } = await alarmEventsList(alarmEventsFormData.value);
  // let list = data.data.rows.slice(0, 4);
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
  alarmEventslist.value = data.data.rows.map((item, index) => {
    const matchedLevel = imgList.find((v) => v.level === item.level);
    return {
      ...item,
      img: matchedLevel ? matchedLevel.img : "",
      status: false,
    };
  });
};

const alarmEventsTimer = useIntervalFn(() => {
  alarmEventsTimer.pause();
  alarmEventsListFun().finally(() => {
    alarmEventsTimer.resume();
  })
}, 100000)

//工艺流程图
const processFormData = ref({
  craftArchiveId: null,
  pageNum: 1,
  pageSize: 100,
  orderColumn: "createTime",
  orderDirection: "descending",
});
const processlist = ref<any[]>([]);
const processlist2 = ref<any[]>([]);
const processTotal = ref<number>(0);
const processlistFun = async () => {
  const { data } = await processList(processFormData.value);
  processTotal.value = data.data.total;
  processlist.value = data.data.rows;
};

const processlistTimer = useIntervalFn(() => {
  processlistTimer.pause();
  processlistFun().finally(() => {
    processlistTimer.resume();
  })
}, 5000)
const rtShow = ref(false);
const rtInfo = ref()
const rtClcik = (item) => {
  console.log("item", item)
  rtInfo.value = item
  rtShow.value = true;
  processlist.value.forEach((v) => {
    if (item.craftProcessId == v.craftProcessId) {
      v.status = !v.status;
    } else {
      v.status = false;
    }
  });
};
const rtcanleClick = () => {
  rtShow.value = false;
  // rbShow.value = false;
};

onMounted(() => {
  if (bigscreenLBRef.value) {
    const bigscreenLBChart = echarts.init(bigscreenLBRef.value);
    bigscreenLBChart.setOption(bigscreenLBoption);
  }

  if (bigscreenRBRef.value) {
    bigscreenRBChart = echarts.init(bigscreenRBRef.value);
    bigscreenRBChart.setOption(bigscreenRBoption);
  }
  archivelistFun();
  nodelistFun();
  alarmEventsListFun();
  processlistFun();
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


#stepMy:deep(> div.el-step__main > div.el-step__description.is-process) {
  color: white !important;
}


.processflowchart {
  height: adaptiveHeight(250);
  padding-left: adaptiveWidth(30);
  padding-bottom: adaptiveHeight(5);

  .processflowchart_con {
    height: 100%;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;

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

    .bigscreen_lt_bottom_t {
      width: adaptiveWidth(399);
      height: adaptiveHeight(88);
      background: url("/public/img/craftsmanship/infoback.png") no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      margin: adaptiveHeight(20) auto 0;

      img {
        width: adaptiveWidth(88);
        height: adaptiveHeight(88);
      }

      .bigscreen_lt_bottom_tdiv {
        text-align: center;

        span {
          color: #ffffff;
        }

        &:nth-child(2) {
          padding: 0 adaptiveWidth(15);
          border-right: 1px solid #3e607e;
          margin-right: adaptiveWidth(20);

          span {
            &:nth-child(1) {
              font-size: adaptiveFontSize(18);
            }

            &:nth-child(3) {
              font-size: adaptiveFontSize(8);
            }
          }
        }

        &:nth-child(3),
        &:nth-child(4),
        &:nth-child(5) {
          display: flex;
          align-items: center;

          .bigscreen_lt_bottom_tdiv_l {
            div {
              &:nth-child(1) {
                width: adaptiveWidth(7);
                height: adaptiveHeight(7);
                border-radius: 50%;
              }

              &:nth-child(2) {
                width: adaptiveWidth(10);
                height: adaptiveHeight(20);
                margin-left: adaptiveWidth(3);
              }
            }
          }

          .bigscreen_lt_bottom_tdiv_r {
            display: flex;
            flex-direction: column;
            margin-left: adaptiveHeight(5);

            span {
              &:nth-child(1) {
                margin-top: adaptiveHeight(3);
                font-size: adaptiveFontSize(10);
              }

              &:nth-child(2) {
                font-size: adaptiveFontSize(13);
                margin-top: adaptiveHeight(10);
              }
            }
          }
        }

        &:nth-child(4) {
          margin: 0 adaptiveWidth(20);
        }
      }
    }

    .bigscreen_lt_bottom_b {
      width: adaptiveWidth(399);
      margin: adaptiveHeight(20) auto 0;

      .bigscreen_lt_bottom_b_neis {
        overflow: hidden;
        height: adaptiveHeight(240);

        .bigscreen_lt_bottom_b_nei {
          display: flex;
          align-items: center;
          margin-top: adaptiveHeight(10);

          img {
            width: adaptiveWidth(52);
            height: adaptiveHeight(59);
            margin-left: adaptiveWidth(10);
          }

          div {
            width: adaptiveWidth(305);
            height: adaptiveHeight(28);
            // margin-top: 20px;
            background: url("/public/img/back.png") no-repeat;
            background-size: 100% 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #ffffff;
            margin-left: adaptiveWidth(15);

            span {
              font-size: adaptiveFontSize(14);

              &:nth-child(1) {
                width: 20%;
                white-space: nowrap;
                /* 禁止换行 */
                overflow: hidden;
                /* 超出内容隐藏 */
                text-overflow: ellipsis;
                /* 显示省略号 */
              }

              &:nth-child(2) {
                widows: 40%;
                white-space: nowrap;
                /* 禁止换行 */
                overflow: hidden;
                /* 超出内容隐藏 */
                text-overflow: ellipsis;
                /* 显示省略号 */
              }

              &:nth-child(3) {
                width: 40%;
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
    display: flex;
    justify-content: center;

    .bigscreen_lb_bottom_nei {
      width: adaptiveWidth(377);

      .bigscreen_lb_bottom_nei_t {
        display: flex;
        color: #ffffff;
        margin-top: adaptiveHeight(20);

        .bigscreen_lb_bottom_nei_t_r {
          width: calc(100% - adaptiveWidth(48));
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-left: adaptiveWidth(10);

          span {
            width: 33%;
            font-size: adaptiveFontSize(14);
            text-align: center;
          }
        }
      }

      .bigscreen_lb_bottom_nei {
        width: 100%;
        margin-top: adaptiveHeight(20);
        height: adaptiveHeight(330);
        overflow: hidden;

        .bigscreen_lb_bottom_neis {
          width: 100%;
          height: adaptiveHeight(40);
          background: url("/public/img/craftsmanship/jidianback.png") no-repeat;
          background-size: 100% 100%;
          background-position: 30px 0;
          margin-top: adaptiveHeight(15);
          display: flex;
          cursor: pointer;

          .bigscreen_lb_bottom_nei_t_l {
            width: adaptiveWidth(37);
            height: adaptiveHeight(40);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .bigscreen_lb_bottom_neis_r {
            width: calc(100% - adaptiveWidth(48));
            height: 100%;
            margin-left: adaptiveWidth(10);
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #ffffff;

            span {
              width: 33%;
              font-size: adaptiveFontSize(14);
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
        margin-left: adaptiveHeight(11);
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
    display: flex;
    flex-direction: column;
    align-items: center;

    // justify-content: space-between;
    .bigscreen_rt_bottom_count {
      width: adaptiveWidth(393);
      height: adaptiveHeight(127);
      background: url("/public/img/yaosuback.png") no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      margin-top: adaptiveHeight(15);
    }

    .bigscreen_rt_bottom_neis {
      width: adaptiveWidth(393);
      height: adaptiveHeight(210);
      margin-top: adaptiveHeight(20);
      overflow: hidden;

      .bigscreen_rt_bottom_nei {
        width: 100%;
        height: adaptiveHeight(50);
        background: url("/public/img/craftsmanship/yaosuback.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #ffffff;
        margin-top: adaptiveHeight(20);
        cursor: pointer;

        span {
          &:nth-child(1) {
            width: 30%;
            padding: adaptiveWidth(10) 0;
          }

          width: 23%;
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
  }

  .bigscreen_rb_bottom {
    width: 100%;
    height: adaptiveHeight(406);
    margin-top: adaptiveHeight(5);
    background: url("/public/img/bigback.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .bigscreen_rb_bottom_nei {
      width: adaptiveWidth(393);
      height: adaptiveHeight(346);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin: auto;

      .bigscreen_rb_bottom_nei_t {
        width: 100%;
        height: adaptiveHeight(30);
        background: url("/img/equipment/tabletop.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          font-size: adaptiveWidth(14);
          width: 33%;
          color: #ffffff;
          text-align: center;
        }
      }

      .bigscreen_rb_bottom_nei_items {
        width: 100%;
        margin-top: adaptiveHeight(10);
        height: adaptiveHeight(340);
        overflow: hidden;

        .bigscreen_rb_bottom_nei_item {
          width: 100%;
          height: adaptiveHeight(50);
          background: rgba(4, 30, 62);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          background: url("/public/img/craftsmanship/yaosuback.png") no-repeat;
          background-size: 100% 100%;
          // 上下间隔
          margin-bottom: adaptiveHeight(10);

          div {
            width: 33%;
            text-align: center;
            font-size: adaptiveFontSize(14);

            &:nth-child(2) {
              color: #ffffff;
            }
          }

          .bigscreen_rb_bottom_nei_item1 {
            color: #ffffff;
            display: flex;
            align-items: center;

            white-space: nowrap;
            /* 禁止换行 */
            overflow: hidden;
            /* 超出内容隐藏 */
            text-overflow: ellipsis;
            /* 显示省略号 */

            .bigscreen_rb_bottom_nei_item1_div {
              width: adaptiveWidth(10);
              height: adaptiveHeight(10);
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0 adaptiveWidth(10);

              div {
                width: adaptiveWidth(5);
                height: adaptiveHeight(5);
              }
            }
          }
        }
      }
    }
  }
}

.lbDialog {
  width: adaptiveWidth(480);
  background: url("/public/img/弹窗背景.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  bottom: adaptiveHeight(100);
  left: adaptiveWidth(480);
  z-index: 10;

  .lbDialog_top {
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

  .lbDialog_bottom {
    width: adaptiveWidth(440);
    margin: adaptiveHeight(20) auto;
    display: flex;
    // align-items: center;
    justify-content: space-between;
    flex-direction: column;

    div {
      width: 100%;
      display: flex;

      &:last-child {
        margin-bottom: adaptiveHeight(20);
      }

      span {
        font-size: adaptiveFontSize(14);
        display: block;
        margin-top: adaptiveHeight(5);

        &:nth-child(1) {
          color: #687f92;
          width: adaptiveWidth(100);
        }

        &:nth-child(2) {
          color: #ffffff;
          width: adaptiveWidth(340);
        }
      }
    }
  }
}

.rtDialog {
  width: adaptiveWidth(480);
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
    width: adaptiveWidth(440);
    margin: adaptiveHeight(20) auto;
    display: flex;
    height: adaptiveHeight(170);
    // align-items: center;
    justify-content: space-between;
    flex-direction: column;

    .rtDialog_bottom_con {
      div {
        display: flex;
        width: 100%;

        &:nth-child(1) {
          margin-top: 0;
        }

        &:last-child {
          margin-bottom: adaptiveHeight(10);
        }

        span {
          font-size: adaptiveFontSize(14);
          display: block;
          margin-top: adaptiveHeight(10);

          &:nth-child(1) {
            color: #687f92;
            width: adaptiveWidth(100);
          }

          &:nth-child(2) {
            color: #ffffff;
            width: adaptiveWidth(340);
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
  bottom: adaptiveHeight(100);
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
    height: adaptiveHeight(282);

    .rbDialog_bottom_selet {
      margin-top: adaptiveHeight(20);
      margin-left: adaptiveWidth(30);

      span {
        cursor: pointer;
      }
    }

    .info {
      margin-top: adaptiveHeight(10);
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
