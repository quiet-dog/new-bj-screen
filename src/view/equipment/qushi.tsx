import dayjs from "dayjs"
import { dailyCishuInspectionList } from "../../api/equipment"
import * as echarts from "echarts"

export function useXunJianQushiHook() {

    let ciEchart = null
    const qushiRef = ref()
    const ciShuDig = ref(false)

    const options = {
        grid: {
            left: "6%",
            right: "6%",
            bottom: "6%",
            // top: "24%",
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis', //坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
            // axisPointer: {// 坐标轴指示器，坐标轴触发有效
            //     type: 'line' // 默认为直线，可选为：'line' | 'shadow'
            // }
        },
        legend: {
            data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
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
                // symbol: "none",
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
                                color: "rgba(61, 230, 255, 0.5)", // 0% 处的颜色
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
    const ciShuTimer = ref({
        startTime: dayjs().subtract(6, "day").startOf("day").format("YYYY-MM-DD"),
        endTime: dayjs().endOf("day").format("YYYY-MM-DD"),
    })
    const ciShuLeftClick = () => {
        ciShuTimer.value.startTime = dayjs(ciShuTimer.value.startTime).subtract(7, "day").startOf("day").format("YYYY-MM-DD")
        ciShuTimer.value.endTime = dayjs(ciShuTimer.value.endTime).subtract(7, "day").endOf("day").format("YYYY-MM-DD")
        dailyCishuInspectionListFunc()
    }
    const ciShuRightClick = () => {
        ciShuTimer.value.startTime = dayjs(ciShuTimer.value.startTime).add(7, "day").startOf("day").format("YYYY-MM-DD")
        ciShuTimer.value.endTime = dayjs(ciShuTimer.value.endTime).add(7, "day").endOf("day").format("YYYY-MM-DD")
        dailyCishuInspectionListFunc()
    }

    function dailyCishuInspectionListFunc() {


        dailyCishuInspectionList(ciShuTimer.value).then(res => {
            if (ciEchart == null) {
                ciEchart = echarts.init(qushiRef.value)
            }
            options.xAxis.data = res.data.data.time
            options.series[0].data = res.data.data.data
            ciEchart.setOption(options, true)
        })
    }

    function handleOpenXunJianQushi() {
        ciShuDig.value = true
        dailyCishuInspectionListFunc()
    }

    window.addEventListener("resize", () => {
        if (ciEchart != null && ciShuDig.value) {
            ciEchart.resize()
        }
    })

    return {
        ciShuTimer,
        ciShuLeftClick,
        ciShuRightClick,
        dailyCishuInspectionListFunc,
        qushiRef,
        ciShuDig,
        handleOpenXunJianQushi
    }
}