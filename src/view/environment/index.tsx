export const initQuYuOption = {
    title: {
        // text: '暂无数据',
        textStyle: {
            color: '#fff' // 标题文字颜色
        }
    },
    tooltip: {
        trigger: 'axis',
        textStyle: {
            color: '#fff'
        }
    },
    legend: {
        textStyle: {
            color: '#fff' // 图例文字颜色
        }
    },
    xAxis: {
        type: 'category',
        data: ['00:00', '01:00', '02:00', '03:00', '04:00'],
        axisLine: { lineStyle: { color: '#fff' } },
        axisLabel: { color: '#fff' },
        axisTick: { show: true }
    },
    yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#fff' } },
        axisLabel: { color: '#fff' },
        axisTick: { show: true },
        splitLine: { lineStyle: { color: '#444' } }, // 分隔线可选
        minInterval: 1,
        min: 0,
        max: 100,  // 👈 强制 y 轴显示
    },
    series: [{
        name: '暂无数据',
        type: 'line',
        data: [null, null, null, null, null],
        showSymbol: false,
        lineStyle: {
            width: 0
        },
        itemStyle: {
            opacity: 0
        }
    }]
}