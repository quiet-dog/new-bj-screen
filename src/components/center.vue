<template>
  <div class="bigscreen_ct">
    <div class="bigscreen_ct_l">
      <span>今日报警数量</span>
      <div class="bigscreen_ct_lb">
        <div v-for="item in count1.toString().split('')">
          <img :src="shuimg(item)" alt="" />
        </div>
      </div>
    </div>
    <div class="bigscreen_ct_r">
      <span @click=" useDeviceStore().isShowDetail = true;" >历史报警数量</span>
      <div class="bigscreen_ct_rb">
        <div v-for="item in count2.toString().split('')">
          <img :src="shuimg(item)" alt="" />
        </div>
      </div>
    </div>
  </div>
  <div class="bigscreen_cb">
    <div class="bigscreen_cb_nei"></div>
    <div class="bigscreen_cb_dialog" v-if="useDeviceStore().isShowDetail">
      <div class="bigscreen_cb_dialog_top"></div>
      <div class="bigscreen_cb_dialog_bottom" style="background-color: white;display: flex; justify-content: right; " >
       <ElButton @click="closeDevice"  text >
        <el-icon style="font-size: 30px;color: gray;"><Close /></el-icon>
       </ElButton>
      </div>
      <ElTabs  id="my-tabs" v-model="useDeviceStore().activeName">
        <ElTabPane label="一层" name="一层" >
          <TuOne v-if="useDeviceStore().activeName == '一层'" />
        </ElTabPane>
        <ElTabPane label="二层" name="二层">
          <TuFour v-if="useDeviceStore().activeName == '二层'" />
        </ElTabPane>
        <ElTabPane label="三层" name="三层">
          <TuThree v-if="useDeviceStore().activeName == '三层'" />
        </ElTabPane>
        <ElTabPane label="四层" name="四层">
          <TuTwo v-if="useDeviceStore().activeName == '四层'" />
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted,onUnmounted } from "vue";
import { geteventTotal } from "../api/home";
import {Close} from "@element-plus/icons-vue";
import img from "../../public/img/0.png";
import img1 from "../../public/img/1.png";
import img2 from "../../public/img/2.png";
import img3 from "../../public/img/3.png";
import img4 from "../../public/img/4.png";
import img5 from "../../public/img/5.png";
import img6 from "../../public/img/6.png";
import img7 from "../../public/img/7.png";
import img8 from "../../public/img/8.png";
import img9 from "../../public/img/9.png";
import TuOne from "./tuone/index.vue";
import TuTwo from "./tutwo/index.vue";
import TuThree from "./tuthree/index.vue";
import TuFour from "./tufour/index.vue";
import { ElButton, ElTabs } from "element-plus";
import { useDeviceStore } from "./device";
import { useIntervalFn } from '@vueuse/core'


const count1 = ref(0);
const count2 = ref(0);
// const activeName = ref("一层");


const geteventTotalFun = async () => {
  const { data } = await geteventTotal();
  count1.value = data.data.todayTotal;
  count2.value = data.data.allTotal;
};

const closeDevice=()=>{
  useDeviceStore().isShowDetail = false;
  useDeviceStore().initPopover();
}

function shuimg(val: string): string {
  const imgMap: Record<string, string> = {
    "0": img,
    "1": img1,
    "2": img2,
    "3": img3,
    "4": img4,
    "5": img5,
    "6": img6,
    "7": img7,
    "8": img8,
    "9": img9,
  };
  return imgMap[val] || ""; // 如果值不存在，则返回空字符串
}

const { pause, resume, isActive } =  useIntervalFn(() => {
  geteventTotalFun();
}, 5000)
onMounted(() => {
  geteventTotalFun();
});
onUnmounted(() => {
  pause()
  useDeviceStore().initPopover();
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

#my-tabs :deep(> div.el-tabs__header.is-top > div > div) {
  background-color: white;
}

#my-tabs {
  background-color: white;
  padding-left: 20px;
}

.bigscreen_ct {
  width: adaptiveWidth(840);
  height: adaptiveHeight(119);
  position: absolute;
  top: adaptiveHeight(132);
  left: 50%;
  margin-left: adaptiveWidth(-420);
  display: flex;
  justify-content: space-between;

  .bigscreen_ct_l {
    width: adaptiveWidth(208);
    height: 100%;

    span {
      color: rgba(242, 242, 242, 1);
      font-size: adaptiveFontSize(24);
    }

    .bigscreen_ct_lb {
      width: 100%;
      height: adaptiveHeight(72);
      margin-top: adaptiveHeight(12);
      display: flex;

      // justify-content: space-between;
      div {
        &:nth-child(1) {
          margin-left: 0;
        }

        width: adaptiveWidth(63);
        height: adaptiveHeight(72);
        margin-left: adaptiveWidth(12);
        background: url("/public/img/数字背景.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .bigscreen_ct_r {
    width: adaptiveWidth(353);
    height: 100%;

    span {
      color: rgba(242, 242, 242, 1);
      font-size: adaptiveFontSize(24);
    }

    .bigscreen_ct_rb {
      width: 100%;
      height: adaptiveHeight(72);
      margin-top: adaptiveHeight(12);
      display: flex;

      // justify-content: space-between;
      div {
        &:nth-child(1) {
          margin-left: 0;
        }

        width: adaptiveWidth(63);
        height: adaptiveHeight(72);
        margin-left: adaptiveWidth(12);
        background: url("/public/img/数字背景.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.bigscreen_cb {
  width: adaptiveWidth(996);
  height: adaptiveHeight(665);
  background: url("/public/img/网格背景.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  bottom: adaptiveHeight(140);
  left: 50%;
  margin-left: adaptiveWidth(-498);
  display: flex;
  align-items: center;
  justify-content: center;

  .bigscreen_cb_nei {
    width: adaptiveWidth(840);
    height: adaptiveHeight(642);
    background: url("/public/img/主体图片.png") no-repeat;
    background-size: 100% 100%;
  }

  .bigscreen_cb_dialog {
    position: absolute;
    width: adaptiveWidth(850);
    height: adaptiveHeight(600);
    // border: 1px solid red;
    overflow: scroll;
    overflow-x: scroll;
  }
}
</style>
