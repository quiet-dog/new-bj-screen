<template>
    <div class="echarts" ref="echartsRef">
    </div>
</template>
<script lang="ts" setup>
import * as echarts from "echarts";
import { historicalStatisticsList } from "../../../api/equipment";
const echartsRef = ref();
const { thresholdId = 0 } = defineProps<{
    thresholdId: number;
}>()
// @ts-expect-error
let echartT = null;
const bigscreenLBoption = {
    // 标题
    title: {
        text: "设备运行状态",
        left: "center",
        textStyle: {
            color: "#ffffff",
            // 字体大小
            fontSize: 10,
        },
    },
    grid: {
        left: "8%",
        right: "0%",
        top: "10%",
        bottom: "15%",
        containLabel: false, // 不自动留出坐标轴标签空间
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
        // 最小间隔
        minInterval: 1,
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

async function getEcharts() {
    const { data } = await historicalStatisticsList({
        thresholdId: thresholdId,
    });
    bigscreenLBoption.title.text = data.sensorName;
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
    // @ts-expect-error
    bigscreenLBoption.yAxis.min = 1;
    // @ts-expect-error
    bigscreenLBoption.yAxis.max = Math.max(...data.data, 6); // 至少6
    // @ts-expect-error
    if (echartT == null) {
        echartT = echarts.init(echartsRef.value);
    }
    // @ts-expect-error
    echartT?.setOption(bigscreenLBoption, true);
}

watch(() => thresholdId, () => {
    if (thresholdId > 0) {
        console.log("=================thresholdId", thresholdId);
        getEcharts();
    }
}, {
    immediate: true,
})

function resize() {
    echartT?.resize()
}

onMounted(() => {
    // window.addEventListener("resize", resize)
    const ro = new ResizeObserver(() => {
        echartT?.resize()
    })
    ro.observe(echartsRef.value)
})


onUnmounted(() => {
    // window.removeEventListener("resize", resize)
    echartT?.dispose();
})


</script>
<style lang="scss" scoped>
.echarts {
    width: 100%;
    height: 100%;
}
</style>