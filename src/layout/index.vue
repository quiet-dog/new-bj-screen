<template>
  <div class="bigscreen">
    <div class="bigscreen_header">
      <!-- <img
        class="bigscreen_header_l"
        src="/public/img/高生物安全动态监管平台.png"
        alt=""
      /> -->
      <div class="text-my">高风险安全风险车间智能化风险管理和实时动态监管平台</div>
      <div class="bigscreen_header_r">
        <span>{{ time }}</span>
        <span>{{ dayOfWeek }}</span>
        <img src="/public/img/天气图标.png" alt="" />
        <img src="/public/img/温度计.png" alt="" />
        <span>26℃</span>
      </div>
    </div>
    <div class="bigscreen_center">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
    <div class="bigscreen_bottom">
      <div class="bigscreen_bottom_nei">
        <div
          class="bigscreen_bottom_neis"
          v-for="item in btnfun"
          @click="bigscreenBtn(item.path)"
        >
          <div
            :style="{
              color: $route.path === item.path ? '#ffffff' : '#00ABFF',
            }"
          >
            {{ item.title }}
          </div>
          <img
            v-if="$route.path === item.path"
            style="position: absolute; bottom: 0"
            src="/public/img/切换图标.png"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

let times: any;
let timer: any;
const time = ref<string>(dayjs().format("YYYY-MM-DD HH:mm:ss"));
const daysInChinese = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];
const dayOfWeek = ref(daysInChinese[dayjs().day()]);
const updateDayOfWeek = () => {
  // 更新星期几
  dayOfWeek.value = daysInChinese[dayjs().day()];
};
const setMidnightTimer = () => {
  // 获取当前时间
  const now = dayjs();
  // 计算距离明天 0 点的时间（毫秒）
  const nextMidnight = dayjs().endOf("day").add(1, "millisecond");
  const timeUntilMidnight = nextMidnight.diff(now);

  // 设置定时器在 0 点更新
  times = setTimeout(() => {
    updateDayOfWeek();
    // 在 0 点之后，设置一个每天执行的定时器
    setInterval(updateDayOfWeek, 24 * 60 * 60 * 1000); // 每 24 小时更新一次
  }, timeUntilMidnight);
};

const btnfun = [
  // {
  //     title: "总体态势",
  //     name: "home",
  //     path: "/home",
  //   },
  {
    title: "总体态势",
    name: "home",
    path: "/home",
  },
  {
    title: "风险评估",
    name: "riskassessment",
    path: "/riskassessment",
  },
  {
    title: "人员数据",
    name: "personnel",
    path: "/personnel",
  },
  {
    title: "设备数据",
    name: "equipment",
    path: "/equipment",
  },
  {
    title: "物料数据",
    name: "materials",
    path: "/materials",
  },
  {
    title: "工艺数据",
    name: "craftsmanship",
    path: "/craftsmanship",
  },
  {
    title: "环境数据",
    name: "environment",
    path: "/environment",
  },
  {
    title: "事件管理",
    name: "incident",
    path: "/incident",
  },
];

const bigscreenBtn = (val: string) => {
  router.push({
    path: val,
  });
};

onMounted(() => {
  timer = setInterval(() => {
    time.value = dayjs().format("YYYY-MM-DD HH:mm:ss");
  }, 1000);
  setMidnightTimer();
});

onUnmounted(() => {
  // 清除定时器
  clearInterval(timer);
  clearInterval(times);
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

.text-my{
  font-size: adaptiveFontSize(30);
  color: white;
  // 水平居中
  text-align: center;
  width: adaptiveWidth(560);
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
  font-family: "youshe";
}

.bigscreen {
  width: 100vw;
  height: 100vh;
  // background-color: #002857;
  background-color: #021322;
  position: relative;
  .bigscreen_header {
    width: 100%;
    height: adaptiveHeight(251);
    background: url("/public/img/标题背景.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    .bigscreen_header_l {
      position: absolute;
      top: adaptiveHeight(18);
      left: 50%;
      margin-left: adaptiveWidth(-241);
      width: adaptiveWidth(482);
      height: adaptiveHeight(63);
    }
    .bigscreen_header_r {
      height: adaptiveHeight(100);
      display: flex;
      align-items: center;
      position: absolute;
      right: 0;
      span {
        font-size: adaptiveFontSize(20);
        color: rgba(255, 255, 255, 1);
        &:nth-child(2) {
          padding-left: adaptiveWidth(30);
        }
        &:nth-child(5) {
          padding-right: adaptiveWidth(40);
        }
      }
      img {
        &:nth-child(3) {
          width: adaptiveWidth(44);
          height: adaptiveHeight(44);
          padding-left: adaptiveWidth(25);
        }
        &:nth-child(4) {
          padding-left: adaptiveWidth(6);
        }
      }
    }
  }
  .bigscreen_center {
    width: 100%;
    height: 100%;
  }
  .bigscreen_bottom {
    width: 100%;
    height: adaptiveHeight(112);
    background: url("/public/img/底座背景.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    bottom: 0;
    .bigscreen_bottom_nei {
      width: adaptiveWidth(960);
      height: adaptiveHeight(75);
      position: absolute;
      top: adaptiveHeight(15);
      left: 50%;
      margin-left: adaptiveWidth(-480);
      display: flex;
      align-items: center;
      justify-content: space-between;
      .bigscreen_bottom_neis {
        div {
          width: adaptiveWidth(112);
          height: adaptiveHeight(56);
          background: url("/img/dbwenan.png") no-repeat;
          background-size: 100% 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        img {
          width: adaptiveWidth(34);
          height: adaptiveHeight(21);
        }
        width: adaptiveWidth(112);
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: rgba(255, 255, 255, 1);
        font-size: adaptiveFontSize(20);
      }
    }
  }
}
</style>
