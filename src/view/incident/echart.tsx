export function get3dOption(sourceData) {
    function getParametricEquation(
        startRatio,
        endRatio,
        isSelected,
        isHovered,
        k,
        height
    ) {
        // 计算
        let midRatio = (startRatio + endRatio) / 2;

        let startRadian = startRatio * Math.PI * 2;
        let endRadian = endRatio * Math.PI * 2;
        let midRadian = midRatio * Math.PI * 2;

        // 如果只有一个扇形，则不实现选中效果。
        if (startRatio === 0 && endRatio === 1) {
            isSelected = false;
        }

        // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
        k = typeof k !== "undefined" ? k : 1 / 3;

        // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
        let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
        let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;

        // 计算高亮效果的放大比例（未高亮，则比例为 1）
        let hoverRate = isHovered ? 1.05 : 1;

        // 返回曲面参数方程
        return {
            u: {
                min: -Math.PI,
                max: Math.PI * 3,
                step: Math.PI / 32,
            },

            v: {
                min: 0,
                max: Math.PI * 2,
                step: Math.PI / 20,
            },

            x: function (u, v) {
                if (u < startRadian) {
                    return (
                        offsetX +
                        Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
                    );
                }
                if (u > endRadian) {
                    return (
                        offsetX +
                        Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
                    );
                }
                return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
            },

            y: function (u, v) {
                if (u < startRadian) {
                    return (
                        offsetY +
                        Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
                    );
                }
                if (u > endRadian) {
                    return (
                        offsetY +
                        Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
                    );
                }
                return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
            },

            z: function (u, v) {
                if (u < -Math.PI * 0.5) {
                    return Math.sin(u);
                }
                if (u > Math.PI * 2.5) {
                    return Math.sin(u);
                }
                return Math.sin(v) > 0 ? 1 * height * 500 : -1;
            },
        };
    }
    // 生成模拟 3D 饼图的配置项
    function getPie3D(pieData, internalDiameterRatio) {
        let series = [];
        let sumValue = 0;
        let startValue = 0;
        let endValue = 0;
        let legendData = [];
        let k =
            typeof internalDiameterRatio !== "undefined"
                ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
                : 1 / 3;

        // 为每一个饼图数据，生成一个 series-surface 配置
        for (let i = 0; i < pieData.length; i++) {
            sumValue += pieData[i].value;

            let seriesItem = {
                name:
                    typeof pieData[i].name === "undefined"
                        ? `series${i}`
                        : pieData[i].name,
                type: "surface",
                parametric: true,
                wireframe: {
                    show: false,
                },
                pieData: pieData[i],
                pieStatus: {
                    selected: false,
                    hovered: false,
                    k: k,
                },
            };

            if (typeof pieData[i].itemStyle != "undefined") {
                let itemStyle = {};

                typeof pieData[i].itemStyle.color != "undefined"
                    ? (itemStyle.color = pieData[i].itemStyle.color)
                    : null;
                typeof pieData[i].itemStyle.opacity != "undefined"
                    ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
                    : null;

                seriesItem.itemStyle = itemStyle;
            }
            series.push(seriesItem);
        }

        // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
        // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
        for (let i = 0; i < series.length; i++) {
            endValue = startValue + series[i].pieData.value;
            console.log(series[i]);
            series[i].pieData.startRatio = startValue / sumValue;
            series[i].pieData.endRatio = endValue / sumValue;
            series[i].parametricEquation = getParametricEquation(
                series[i].pieData.startRatio,
                series[i].pieData.endRatio,
                false,
                false,
                k,
                series[i].pieData.value
            );

            startValue = endValue;

            legendData.push(series[i].name);
        }
        return series;
    }
    const optionsData = sourceData.map(item => {
        return {
            name: item.manufacturer == null ? "未知" : item.manufacturer,
            value: item.count,
            itemStyle: {
            },
        }
    })
    // 240, 28, 26, 0.5
    const series = getPie3D(optionsData, 0.8,);
    series.push({
        name: "pie2d",
        type: "pie",
        label: {
            opacity: 1,
            fontSize: 14,
            lineHeight: 20,
            textStyle: {
                fontSize: 14,
                color: "#fff",
            },
        },
        labelLine: {
            length: 30,
            length2: 30,

        },
        startAngle: -30, //起始角度，支持范围[0, 360]。
        clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
        radius: ["40%", "60%"],
        center: ["50%", "50%"],
        data: optionsData,
        itemStyle: {
            opacity: 0,
        },
    });
    // 准备待返回的配置项，把准备好的 legendData、series 传入。
    let option = {
        legend: {
            show: false,
            tooltip: {
                show: true,
            },
            orient: "vertical",
            data: optionsData.map(item => item.name),
            top: "center",
            itemGap: 14,
            itemHeight: 8,
            itemWidth: 17,
            right: "2%",
            textStyle: {
                color: "#fff",
                fontSize: 12,
            },
        },
        animation: true,
        tooltip: {
            formatter: (params) => {
                if (
                    params.seriesName !== "mouseoutSeries" &&
                    params.seriesName !== "pie2d"
                ) {
                    return `${params.seriesName
                        }<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color
                        };"></span>${option.series[params.seriesIndex].pieData.value
                        }`;
                }
            },
            textStyle: {
                fontSize: 14,
            },
        },
        title: {
            x: "center",
            top: "20",
            textStyle: {
                color: "#fff",
                fontSize: 22,
            },
        },
        // backgroundColor: "#0E3567",
        labelLine: {
            show: true,
            lineStyle: {
                color: "#7BC0CB",
            },
            normal: {
                show: true,
                length: 10,
                length2: 10,
            },
        },
        label: {
            show: true,
            position: "outside",
            formatter: "{b} \n{d}%",
            textStyle: {
                color: "#fff",
                fontSize: "14px",
            },
        },
        xAxis3D: {
            min: -1,
            max: 1,
        },
        yAxis3D: {
            min: -1,
            max: 1,
        },
        zAxis3D: {
            min: -1,
            max: 1,
        },
        grid3D: {
            show: false,
            boxHeight: 0.01,
            //top: '30%',
            bottom: "50%",
            // environment: "rgba(255,255,255,0)",
            viewControl: {
                distance: 180,
                alpha: 25,
                beta: 60,
                autoRotate: false, // 自动旋转
            },
        },
        series: series,
    };
    return option;
}


export function getHistoryData(sourceData) {
    let barData = {
        name: '数量',
        data: sourceData.data,
        // xAxis: ['水表', '电表', '监控', '电梯', '消防', '门禁'],
        xAxis: sourceData.times,
    }
    let option = {
        // backgroundColor: '#011026',
        // title: {
        //    text: '单位/kw/h',
        //    textStyle: {
        //       fontSize: 12,
        //       fontWeight: 'normal',
        //       color: '#8fd5f3', //标题颜色
        //    },
        //    top: '5px',
        //    left: '0%',
        // },
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            left: '10px',
            right: '10px',
            bottom: '10px',
            top: '50px',
            containLabel: true,
        },
        calculable: true,
        xAxis: [
            {
                data: barData.xAxis,
                type: 'category',
                axisLabel: {
                    interval: 0, // 解决x轴名称过长问题
                    textStyle: {
                        color: '#8fd5f3',
                        fontSize: 12,
                    },
                },
                axisLine: {
                    lineStyle: {
                        //y轴网格线设置
                        color: '#032e42',
                        width: 1,
                    },
                },
                z: 2,
            },
        ],
        yAxis: [
            {
                type: 'value',
                // name: "单位/个",
                nameGap: 8,
                nameTextStyle: {
                    color: '#8fd5f3',
                },

                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        //y轴网格线设置
                        color: '#032e42',
                        width: 1,
                    },
                },
                splitLine: {
                    //保留网格线
                    show: true,
                    lineStyle: {
                        //y轴网格线设置
                        color: '#032e42',
                        width: 1,
                    },
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: 12,
                        color: '#8fd5f3', //字体颜色
                    },
                },
                minInterval: 1, //y轴最小间隔
            },
        ],
        series: [
            {
                name: barData.name,
                type: 'pictorialBar',
                z: 1,
                barWidth: 12,
                symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
                label: {
                    show: false,
                    position: 'top',
                    textStyle: {
                        color: '#969a9d',
                    },
                },
                itemStyle: {
                    // color:'red'
                    color: function (params) {
                        // var colorList = ['#1c725e', '#1b8390', '#1d498a', '#4b2b9b', '#b79631', '#b44738']
                        // return colorList[params.dataIndex]
                        return "#1c725e"
                    },
                },
                data: barData.data,
                // 柱形顶部显示数据
                label: {
                    show: true,
                    position: "top",
                    distance: 10,
                    color: "#fff",
                    fontSize: 13
                }
            },
        ],
    }
    return option;
}