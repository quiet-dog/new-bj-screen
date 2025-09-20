<template>
  <router-view></router-view>
  <audio style="display: none;" controls ref="audu">
    <source :src="Vide" type="audio/mpeg" />
  </audio>
  <div id="environment"></div>
  <div id="threshold"></div>
</template>

<script setup lang="ts">
import { onMounted, h } from "vue";
import Vide from "./assets/a.mp3";
// import { login } from "./api/login";
import { useLoginStore } from "./store/login";
import { Client } from "@stomp/stompjs";
import { ElMessageBox, ElNotification, ElScrollbar, ElDescriptions, ElDescriptionsItem } from "element-plus";
// import { IconifyIconOffline } from "./components/ReIcon";
import { useSettingStoreHook } from "./store/modules/settings";
import AlarmIcon from "@iconify-icons/ri/alarm-warning-fill";
import { useRenderIcon } from "./components/ReIcon/src/hooks";
import { Icon } from "@iconify/vue";
import { addCollection } from '@iconify/vue';
import riIcons from '@iconify-json/ri/icons.json';
import AlarmFile from "./components/AlarmFile/index.vue";
addCollection(riIcons);

const pureSetting = useSettingStoreHook();
// WebSocket客户端配置
const stompClient = new Client({
  brokerURL: "/ws-api/ws"
  // process.env.NODE_ENV === "development"
  //   ? "ws://home.icepie.net:9020/ws"
  //   : "/ws-api/ws"
});
const audu = ref();
// const navbarRef = ref();
// const thNotification = ref();
// const envNotification = ref();
// const otherNotification = ref();
stompClient.onConnect = frame => {
  stompClient.subscribe("/topic/info", greeting => {
    console.log("greeting", JSON.parse(greeting.body));
    const data = JSON.parse(greeting.body);

    // 根据消息类型设置通知类型和颜色
    let iconColor = "";
    switch (data.content.type) {
      case "环境报警":
        // iconColor = "#FAAD14"; // 橙色
        iconColor = "#FF4D4F"; // 红色
        break;
      case "设备报警":
        iconColor = "#FF4D4F"; // 红色
        break;
      case "物料报警":
        iconColor = "#FADC19"; // 黄色
        break;
      case "工艺报警":
        iconColor = "#FAAD14"; // 橙色
        break;
      default:
        iconColor = "#1890FF"; // 蓝色
    }

    // 音频是否在播放

    if (audu.value.paused) {
      audu.value.play().catch(err => {
        console.log(err);
      });
    }

    ElNotification({
      title: data.content.type,
      // data.content.description
      message: getDiv(data.content),
      customClass: getClass(data.content.type),
      // position: "bottom-right",
      icon: h(Icon, {
        icon: "ri:alarm-warning-fill",
        style: {
          color: iconColor,
        }
      }),
      appendTo: getAppentTo(data.content.type),
      // duration: 0,
    });
    // if (data.content.type === "环境报警") {

    // }

  });
};

stompClient.onWebSocketError = error => {
  console.error("Broker reported error: " + error);
};

stompClient.onStompError = frame => {
  console.error("Broker reported error: " + frame.headers["message"]);
  console.error("Additional details: " + frame.body);
};


function getClass(t) {
  if (t === "环境报警") {
    return "env-custom-notification";
  } else if (t === "设备报警") {
    return "env-custom-notification";
  }
  return "";
}

function getAppentTo(t) {
  if (t === "环境报警") {
    return "#environment";
  } else if (t === "设备报警") {
    return "#threshold";
  }
  return "";
}

function getDiv(content) {
  return h(ElScrollbar, {
    height: "80%",
  }, [h(ElDescriptions, { column: 1, size: "small", direction: "horizontal" }, [
    h(ElDescriptionsItem, { label: "报警编号：", span: 2, align: "left" }, () => content.eventId),
    h(ElDescriptionsItem, { label: "报警内容：", span: 2, align: "left" }, () => content.description),
    h(ElDescriptionsItem, { label: "报警级别：", span: 2, align: "left", className: getValueColor(content.level) }, () => content.level),
    h(ElDescriptionsItem, { label: "报警时间：", span: 2, align: "left" }, () => content.createTime),
    renderFile(content),
    renderSopFile(content),
  ])])
}


function getValueColor(level) {
  switch (level) {
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

function renderFile(content) {
  if (content.type === "设备报警" && content.threshold != null && content.threshold != undefined && Array.isArray(content.threshold.emergencyPaths) && content.threshold.emergencyPaths.length > 0) {
    console.log("-=======================")
    return h(ElDescriptionsItem, { label: "应急预案：", span: 2, align: "left" }, () => h(AlarmFile, {
      files: content.threshold.emergencyPaths
    }))
  }
  if (content.type == "环境报警" && content.environment != null && content.environment != undefined && Array.isArray(content.environment.emergencyPaths) && content.environment.emergencyPaths.length > 0) {
    return h(ElDescriptionsItem, { label: "应急预案：", span: 2, align: "left" }, () => h(AlarmFile, {
      files: content.environment.emergencyPaths
    }))
  }
  return null;
}

function renderSopFile(content) {
  if (content.type === "设备报警" && content.threshold != null && content.threshold != undefined && Array.isArray(content.threshold.sopPaths) && content.threshold.sopPaths.length > 0) {
    return h(ElDescriptionsItem, { label: "SOP手册：", span: 2, align: "left" }, () => h(AlarmFile, {
      files: content.threshold.sopPaths
    }))
  }
  if (content.type === "环境报警" && content.environment != null && content.environment != undefined && Array.isArray(content.environment.sopPaths) && content.environment.sopPaths.length > 0) {
    return h(ElDescriptionsItem, { label: "SOP手册：", span: 2, align: "left" }, () => h(AlarmFile, {
      files: content.threshold.sopPaths
    }))
  }
}


onMounted(() => {
  stompClient.activate();
  // login().then((res) => {
  //   console.log(res);
  // });
});
useLoginStore();
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

#environment {
  position: absolute;
  left: adaptiveWidth(500);
  top: adaptiveHeight(270);
  width: adaptiveWidth(300);
  height: adaptiveHeight(200);
  // background: red;
  overflow: hidden;
}

#threshold {
  //  background: red;
  position: absolute;
  left: adaptiveWidth(1100);
  top: adaptiveHeight(750);
  width: adaptiveWidth(300);
  height: adaptiveHeight(200);
  overflow: hidden;
}
</style>
<style>
.env-custom-notification {
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  padding: 0 0 !important;
  padding-top: 5px !important;
}

.env-custom-notification>div>div {
  height: 90% !important;
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
</style>
