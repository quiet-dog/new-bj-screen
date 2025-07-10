import { Client } from "@stomp/stompjs";
import { defineStore } from "pinia";
import { onMounted, ref, watch } from "vue";
import { useOneHook } from "./one";
import { useTwoHook } from "./two";
import { useThreeHook } from "./three";
import { useFourHook } from "./four";
import http from "../utils/http";

export const useDeviceStore = defineStore("pure-app", () => {
    const stompClient = ref(new Client({
        brokerURL: "/ws-api/ws",
    }))

    const tuOne = ref(useOneHook().list);

    const tuTwo = ref(useTwoHook().list);

    const tuThree = ref(useThreeHook().list);

    const tuFour = ref(useFourHook().list);

    const tableData = ref([])

    // 当前的数据
    const currentData = ref({})

    const isShowDetail = ref(false);
    const activeName = ref("一层")

    stompClient.value.onConnect = (frame) => {
        stompClient.value.subscribe('/topic/info', (greeting) => {
            console.log(JSON.parse(greeting.body))
            // 推到第一个
            tableData.value.unshift(JSON.parse(greeting.body));
        });
        stompClient.value.subscribe("/topic/data", (greeting) => {
            currentData.value = JSON.parse(greeting.body);
            tuFour.value.forEach(item => {
                if (currentData.value.content.deviceType === item.type) {
                    if (currentData.value.content.equipmentInfo != null) {
                        item.thresholds.forEach(threshold => {
                            if (threshold.thresholdId === currentData.value?.content.equipmentInfo.thresholdId) {
                                threshold.sensorValue = currentData.value?.content.equipmentInfo.value;
                                isShowDetail.value = true;
                                activeName.value = "四层";
                                item.showPopover = true;
                            }
                        });
                    }
                    if (currentData.value.content.environmentAlarmInfo != null) {
                        item.environment.sensorValue = currentData.value?.content.environmentAlarmInfo.value;
                    }
                }

            })
            tuOne.value.forEach(item => {
                if (currentData.value.content.deviceType === item.type) {
                    if (currentData.value.content.equipmentInfo != null) {
                        item.thresholds.forEach(threshold => {
                            if (threshold.thresholdId === currentData.value?.content.equipmentInfo.thresholdId) {
                                threshold.sensorValue = currentData.value?.content.equipmentInfo.value;
                                isShowDetail.value = true;
                                activeName.value = "一层"
                                item.showPopover = true;
                            }
                        });
                    }
                    if (currentData.value.content.environmentAlarmInfo != null) {
                        item.environment.sensorValue = currentData.value?.content?.environmentAlarmInfo.value;
                    }
                }
            })
            tuTwo.value.forEach(item => {
                if (currentData.value.content.deviceType === item.type) {
                    if (currentData.value.content.equipmentInfo != null) {
                        item.thresholds.forEach(threshold => {
                            if (threshold.thresholdId === currentData.value?.content.equipmentInfo.thresholdId) {
                                threshold.sensorValue = currentData.value?.content.equipmentInfo.value;
                                isShowDetail.value = true;
                                activeName.value = "二层";
                                item.showPopover = true;
                            }
                        });
                    }
                    if (currentData.value.content.environmentAlarmInfo != null) {
                        item.environment.sensorValue = currentData.value?.content?.environmentAlarmInfo.value;
                    }
                }
            })
            tuThree.value.forEach(item => {
                if (currentData.value.content.deviceType === item.type) {
                    if (currentData.value.content.equipmentInfo != null) {
                        item.thresholds.forEach(threshold => {
                            if (threshold.thresholdId === currentData.value?.content?.equipmentInfo.thresholdId) {
                                threshold.sensorValue = currentData.value?.content?.equipmentInfo.value;
                                isShowDetail.value = true;
                                activeName.value = "三层";
                                item.showPopover = true;
                            }
                        });
                    }
                    if (currentData.value.content.environmentAlarmInfo != null) {
                        item.environment.sensorValue = currentData.value?.content?.environmentAlarmInfo.value;
                    }
                }
            })
        });
    };

    stompClient.value.onWebSocketError = (error) => {
        // 打印具体的错误信息
        console.error('Broker reported error: ' + error);
    };

    stompClient.value.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };
    stompClient.value.activate();

    http.get("/manage/threshold", {
        params: {
            pageNum: 1,
            pageSize: 1000
        }
    }).then((res) => {
        res.data.data.rows.forEach((item: any) => {
            tuOne.value.forEach((item2: any) => {
                if (item.equipment != null && item.equipment.equipmentId === item2.equipmentId) {
                    item2.thresholds.push(item)
                    item2.equipment = item.equipment
                }
            })
            tuTwo.value.forEach((item2: any) => {
                if (item.equipment != null && item.equipment.equipmentId === item2.equipmentId) {
                    item2.thresholds.push(item)
                    item2.equipment = item.equipment

                }
            })
            tuThree.value.forEach((item2: any) => {
                if (item.equipment != null && item.equipment.equipmentId === item2.equipmentId) {
                    item2.thresholds.push(item)
                    item2.equipment = item.equipment

                }
            })
            tuFour.value.forEach((item2: any) => {
                if (item.equipment != null && item.equipment.equipmentId === item2.equipmentId) {
                    item2.thresholds.push(item)
                    item2.equipment = item.equipment
                }
            })
        })
    }).catch((err) => { })

    http.get("/manage/environment", {
        params: {
            pageNum: 1,
            pageSize: 1000
        }
    }).then((res) => {


        res.data.data.rows.forEach((item: any) => {
            tuOne.value.forEach((item2: any) => {
                if (item.environmentId === item2.environmentId) {
                    item2.environment = item
                }
            })
            tuTwo.value.forEach((item2: any) => {
                if (item.environmentId === item2.environmentId) {
                    item2.environment = item
                }
            })
            tuThree.value.forEach((item2: any) => {
                if (item.environmentId === item2.environmentId) {
                    item2.environment = item
                }
            })
            tuFour.value.forEach((item2: any) => {
                if (item.environmentId === item2.environmentId) {
                    item2.environment = item
                }
            })
        })
    })

    const initPopover = () => {
        tuOne.value.forEach((item: any) => {
            item.showPopover = false;
        })
        tuTwo.value.forEach((item: any) => {
            item.showPopover = false;
        })
        tuThree.value.forEach((item: any) => {
            item.showPopover = false;
        })
        tuFour.value.forEach((item: any) => {
            item.showPopover = false;
        })
    }


    // watch(() => currentData, (newVal) => {
    //     console.log("currentData", newVal)
    //     tuFour.value.forEach(item => {
    //         if (newVal.content.deviceType === item.type) {
    //             if (newVal.content.equipmentInfo != null) {
    //                 item.thresholds.forEach(threshold => {
    //                     if (threshold.thresholdId === newVal?.content.equipmentInfo.thresholdId) {
    //                         threshold.sensorValue = newVal?.content.equipmentInfo.value;
    //                         isShowDetail.value = true;
    //                     }
    //                 });
    //             }
    //             if (newVal.content.environmentAlarmInfo != null) {
    //                 item.environment.sensorValue = newVal?.content.environmentAlarmInfo.value;
    //             }
    //         }

    //     })
    //     tuOne.value.forEach(item => {
    //         if (newVal.content.deviceType === item.type) {
    //             if (newVal.content.equipmentInfo != null) {
    //                 item.thresholds.forEach(threshold => {
    //                     if (threshold.thresholdId === newVal?.content.equipmentInfo.thresholdId) {
    //                         threshold.sensorValue = newVal?.content.equipmentInfo.value;
    //                         isShowDetail.value = true;
    //                     }
    //                 });
    //             }
    //             if (newVal.content.environmentAlarmInfo != null) {
    //                 item.environment.sensorValue = newVal?.content.environmentAlarmInfo.value;
    //             }
    //         }
    //     })
    //     tuTwo.value.forEach(item => {
    //         if (newVal.content.deviceType === item.type) {
    //             if (newVal.content.equipmentInfo != null) {
    //                 item.thresholds.forEach(threshold => {
    //                     if (threshold.thresholdId === newVal?.content.equipmentInfo.thresholdId) {
    //                         threshold.sensorValue = newVal?.content.equipmentInfo.value;
    //                         isShowDetail.value = true;
    //                     }
    //                 });
    //             }
    //             if (newVal.content.environmentAlarmInfo != null) {
    //                 item.environment.sensorValue = newVal?.content.environmentAlarmInfo.value;
    //             }
    //         }
    //     })
    //     tuThree.value.forEach(item => {
    //         if (newVal.content.deviceType === item.type) {
    //             if (newVal.content.equipmentInfo != null) {
    //                 item.thresholds.forEach(threshold => {
    //                     if (threshold.thresholdId === newVal?.content.equipmentInfo.thresholdId) {
    //                         threshold.sensorValue = newVal?.content.equipmentInfo.value;
    //                         isShowDetail.value = true;
    //                     }
    //                 });
    //             }
    //             if (newVal.content.environmentAlarmInfo != null) {
    //                 item.environment.sensorValue = newVal?.content.environmentAlarmInfo.value;
    //             }
    //         }
    //     })
    // }, { deep: true });

    onMounted(() => {
        // http.get("/manage/threshold", {
        //     params: {
        //         pageNum: 1,
        //         pageSize: 1000
        //     }
        // }).then((res) => {
        //     res.data.data.rows.forEach((item: any) => {
        //         tuOne.value.forEach((item2: any) => {
        //             if (item.equipment != null && item.equipment.equipmentId === item2.equipmentId) {
        //                 item2.thresholds.push(item)
        //             }
        //         })
        //         tuTwo.value.forEach((item2: any) => {
        //             if (item.equipment != null && item.equipment.equipmentId === item2.equipmentId) {
        //                 item2.thresholds.push(item)
        //             }
        //         })
        //         tuThree.value.forEach((item2: any) => {
        //             if (item.equipment != null && item.equipment.equipmentId === item2.equipmentId) {
        //                 item2.thresholds.push(item)
        //             }
        //         })
        //         tuFour.value.forEach((item2: any) => {
        //             if (item.equipment != null && item.equipment.equipmentId === item2.equipmentId) {
        //                 item2.thresholds.push(item)
        //             }
        //         })
        //     })
        // }).catch((err) => { })

        // http.get("/manage/environment", {
        //     params: {
        //         pageNum: 1,
        //         pageSize: 1000
        //     }
        // }).then((res) => {


        //     res.data.data.rows.forEach((item: any) => {
        //         tuOne.value.forEach((item2: any) => {
        //             if (item.environmentId === item2.environmentId) {
        //                 item2.environment = item
        //             }
        //         })
        //         tuTwo.value.forEach((item2: any) => {
        //             if (item.environmentId === item2.environmentId) {
        //                 item2.environment = item
        //             }
        //         })
        //         tuThree.value.forEach((item2: any) => {
        //             if (item.environmentId === item2.environmentId) {
        //                 item2.environment = item
        //             }
        //         })
        //         tuFour.value.forEach((item2: any) => {
        //             if (item.environmentId === item2.environmentId) {
        //                 item2.environment = item
        //             }
        //         })
        //     })
        // })

        // http.get("/manage/equipment", {
        //     params: {
        //         pageNum: 1,
        //         pageSize: 1000
        //     }
        // }).then((res) => {
        //     console.log("ressss", res)
        //     // res.data.rows.forEach((item: any) => {
        //     //   list.value.forEach((item2: any) => {
        //     //     if (item.equipmentId === item2.equipmentId) {
        //     //       item2.equipment = item
        //     //     }
        //     //   })
        //     // })
        // })
        // console.log("list.value", list.value)
    })

    return {
        stompClient,
        tableData,
        currentData,
        isShowDetail,
        tuOne,
        tuTwo,
        tuThree,
        tuFour,
        activeName,
        initPopover
    }
})