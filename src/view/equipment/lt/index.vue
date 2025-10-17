<template>
    <div class="container">
        <div class="container_top">
            <div class="container_top_l">报警设备数量:{{ total }}</div>
            <div class="container_top_r">
                <el-radio-group v-model="radio" @change="changeRadio" class="radio_group" fill="white">
                    <el-radio-button label="日" value="day" />
                    <el-radio-button label="月" value="month" />
                    <el-radio-button label="年" value="year" />
                </el-radio-group>
            </div>
        </div>
        <div class="container_bottom">
            <el-scrollbar @scroll="scrollEvent"  @mouseleave="mouseLeave"
                @mouseenter="heightTimer.pause" ref="scrollbarRef" height="100%">
                <!-- @vue-expect-error -->
                <div v-for="item in data.list" :key="item.id" :class="{
                    'device_item': true,
                    'not_online': !item.isOnline,
                    'is_online': item.isOnline,
                }">
                    <el-row class="device_item_row">
                        <el-col :span="8" class="device_item_row_col">
                            <!-- @vue-expect-error -->
                            <el-tooltip :content="item?.equipmentCode" placement="top">
                                <span>
                                    <!-- @vue-expect-error -->
                                    {{ item?.equipmentCode }}
                                </span>
                            </el-tooltip>
                        </el-col>
                        <el-col :span="8" class="device_item_row_col">
                            <!-- @vue-expect-error -->
                            <el-tooltip placement="top">
                                <template #content>
                                    <span>
                                        <!-- @vue-expect-error -->
                                        {{ item?.equipmentName }}
                                    </span>
                                    <br />
                                    <span>
                                        <!-- @vue-expect-error -->
                                        {{ item?.dataTime }}
                                    </span>
                                </template>
                                <span>
                                    <!-- @vue-expect-error -->
                                    {{ item?.equipmentName }}</span>
                            </el-tooltip>
                        </el-col>
                        <el-col :span="8" class="device_item_row_col">
                            <el-tooltip placement="top">
                                <template #content>
                                    <!-- @vue-expect-error -->
                                    <template v-for="value in item?.sensorList">
                                        <span>
                                            {{ value?.key }}:
                                            <!-- @vue-expect-error -->
                                            <span :style="{ color: item?.color }">{{ value?.value }}</span>
                                        </span>
                                        <br />
                                    </template>

                                </template>
                                <div class="data_container">
                                    <!-- @vue-expect-error -->
                                    <template v-for="(value, index) in item?.sensorList">
                                        <div v-if="index < 2">{{ value?.key }}:
                                            <!-- @vue-expect-error -->
                                            <span :style="{ color: item?.color }">{{ value?.value }}</span>
                                        </div>
                                    </template>
                                </div>
                            </el-tooltip>
                        </el-col>
                    </el-row>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useIntervalFn } from '@vueuse/core';
import { equipmentDetailList, equipmentAlarmCount } from '../../../api/equipment';
import { ElScrollbar } from 'element-plus';

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const radio = ref("day");
const total = ref(0);
const data = ref({
    list: [],
    total: 0,
});
const query = ref({
    pageNum: 1,
    pageSize: 100,
    orderColumn: "createTime",
    orderDirection: "descending",
});

function changeRadio(value) {
    equipmentAlarmCount(value).then(res => {
        total.value = res.data.data
    })
}
const getList = async () => {
    // @ts-expect-error
    equipmentDetailList(query.value).then(res => {
        data.value.list = res.data.data.rows;
        data.value.total = res.data.data.total;
    })

}

const getListTimer = useIntervalFn(async () => {
    getListTimer.pause()
    getList().finally(() => {
        getListTimer.resume()
    })
    equipmentAlarmCount(radio.value).then(res => {
        total.value = res.data.data
    })
}, 5000)
const height = ref(0)
const targetHeight = ref(0)
const heightTimer = useIntervalFn(() => {
    if (height.value > 0) {
        targetHeight.value++
        if ((scrollbarRef.value?.wrapRef.scrollTop + scrollbarRef.value?.wrapRef.clientHeight) >= scrollbarRef.value?.wrapRef.scrollHeight) {
            targetHeight.value = 0
        }
        scrollbarRef.value?.scrollTo(0, targetHeight.value)
    }

}, 20)
function mouseLeave() {
    heightTimer.resume()
}

function scrollEvent(value) {
    // console.log()
    // if (!heightTimer.isActive) {
    targetHeight.value = value.scrollTop
    // }
}

onMounted(() => {
    getList().finally(() => {
        setTimeout(() => {
            height.value = scrollbarRef.value?.wrapRef?.firstElementChild.scrollHeight
        }, 2000)
    })
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

.container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    color: white;
    padding: 0 10px;
}

.container_top {
    display: flex;
}

.container_bottom {
    flex: 1;
    overflow: hidden;
}

.radio_group {
    --el-fill-color-blank: transparent;
    --el-radio-button-checked-text-color: black;
    --el-color-white: black;
    --el-text-color-regular: white;
}

.radio_group:deep(.el-radio-button__inner) {
    // --el-border-width: 0 !important;
    // --el-border-style: none !important;
    // --el-border-color: transparent !important;
    border-left: none !important;
    border-right: none !important;
    border-top: none !important;
    border-bottom: none !important;
    padding: 4px 4px;
    // 加上圆角
    border-radius: 4px;
}

.container_top_l {
    flex: 1;
}

.container_top_r {
    box-sizing: border-box;
    margin-right: 12px;
}

.device_item {
    width: 100%;
    box-sizing: border-box;
    height: adaptiveHeight(60);
    margin-bottom: adaptiveHeight(10);
    // 内容上下居中,不影响el-row的布局
    display: flex;
    align-items: center;
}

.not_online {
    background: url("/img/红色背景.png") no-repeat;
    background-size: 100% 100%;

}

.is_online {
    background: url("/img/绿色背景.png") no-repeat;
    background-size: 100% 100%;
}

.device_item_row {
    width: 100%;
    height: 100%;
    // 上下居中
    align-items: center;
    box-sizing: border-box;
    padding: 0 adaptiveWidth(20);
    font-size: adaptiveFontSize(12);
    // text-align: center;
}

.device_item_row_col {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.device_item_row_col:deep(.el-tooltip__trigger) {
    // 上下居中
    height: 100%;
    // 文字上下居中
    display: flex;
    align-items: center;
    // justify-content: center;
}

.data_container {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    // margin-top: adaptiveHeight(20);
    font-size: adaptiveFontSize(12);
    justify-content: center;
}
</style>