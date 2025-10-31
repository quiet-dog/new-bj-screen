<template>
    <div class="container">
        <div class="equipment_info">
            <div class="title_container">
                &nbsp;&nbsp;&nbsp;&nbsp;<el-tooltip :content="`设备名称： ${equipmentInfo?.equipmentName} &nbsp;&nbsp;(
                    ${equipmentInfo?.equipmentCode} &nbsp;&nbsp;
                    ${equipmentInfo.installationLocation} )`">
                    设备名称：{{ equipmentInfo.equipmentName }}&nbsp;&nbsp;({{
                        equipmentInfo.equipmentCode }}&nbsp;&nbsp;{{
                        equipmentInfo.installationLocation }})
                </el-tooltip>
            </div>
        </div>
        <div class="echarts_container" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
            <!-- 纵向 -->
            <Swiper ref="swiperRef" @slide-change="slideChange" :modules="[Autoplay]" :loop="true"
                class="swiper_container" :slides-per-view="1" :slides-per-group="1" direction="horizontal"
                :autoplay="{ delay: 2000, disableOnInteraction: false }">
                <SwiperSlide v-for="(item, index) in thresholdDataList" class="swiper_container_item" :key="index">
                    <div class="swiper_container_item_div">
                        <!-- @vue-expect-error -->
                        <EchartsData :thresholdId="item.thresholdId" />
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import EchartsData from './echarts.vue';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { equipmentDetail } from '../../../api/equipment';
import { thresholdList } from '../../../api/riskassessment';

const swiperRef = ref<InstanceType<typeof Swiper>>();

const equipmentInfo = ref({
    equipmentName: "测试设备",
    equipmentCode: "测试设备编码",
    //    安装位置
    installationLocation: "测试安装位置",
})

const thresholdDataList = ref([{}, {}]);
const thresholdDataListTotal = ref(0)
function getThresholdInfo() {
    thresholdList({
        pageNum: 1,
        pageSize: 20,
        // @ts-expect-error
        equipmentId: equipmentInfo.value.equipmentId,
    }).then((res) => {
        if (thresholdDataListTotal.value != res.data.data.total) {
            thresholdDataList.value  = res.data.data.total;
            thresholdDataList.value = res.data.data.rows;
        }
    })
}

function getEquipmentInfo(id: number) {
    equipmentDetail(id).then(res => {
        equipmentInfo.value = res.data.data;
        getThresholdInfo();
    })
}

function slideChange(val) {
    console.log("=================slideChange", val);
}

function mouseEnter() {
    console.log("swiperRef.value", swiperRef.value?.$el.swiper);
    swiperRef.value?.$el?.swiper?.autoplay?.pause();
}

function mouseLeave() {
    swiperRef.value?.$el?.swiper?.autoplay?.resume();
}

defineExpose({
    getEquipmentInfo,
})

onMounted(() => {

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
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    font-size: adaptiveFontSize(14);
    color: white;
    padding-top: 5px;
}

.equipment_info {
    width: 100%;
}


.echarts_container {
    flex: 1;
    overflow: hidden;
    height: 100%;
}

.swiper_container:deep(.swiper-wrapper) {
    height: 100%;
    display: flex;
}

.swiper_container {
    height: 100%;
}

.swiper_container_item {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.swiper_container_item_div {
    height: 100%;
    width: 100%;
    /* 这里可以占满 Slide 内部 */
}

.title_container {
    white-space: nowrap;
    /* 不换行 */
    overflow: hidden;
    /* 超出隐藏 */
    text-overflow: ellipsis;
    /* 超出显示省略号 */
    width: 100%;
}
</style>