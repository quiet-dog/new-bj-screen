<template>
    <div class="container">
        <Swiper @active-index-change="activeIndexChange" :modules="[Autoplay]" class="swiper_container"
            :slides-per-view="1" :slides-per-group="1" :autoplay="{ delay: 5000, disableOnInteraction: false }">
            <SwiperSlide v-for="(item, index) in videoList" :key="index">
                <VideoItem :active-index="activeIndex" :current-index="index" :title="item?.name" :channel-id="item?.channelid" />
            </SwiperSlide>

        </Swiper>

    </div>
</template>

<script lang="ts" setup>
import { getChannelListApi, getStreamUrlApi } from "../../../api/video";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import VideoItem from "./VideoItem.vue";


const videoRef = ref(null);
const videoInfo = ref({});
const videoList = ref([]);
const channelQuery = ref({
    name: "",
    pageNum: 1,
    pageSize: 100,
});

const activeIndex = ref(0);

function activeIndexChange(index: { activeIndex: number }) {
    activeIndex.value = index.activeIndex;
}
onMounted(() => {
    getChannelListApi(channelQuery.value).then((res) => {

        videoList.value = res.data.data.List;
        // getStreamUrlApi(videoInfo.value.channelid).then((ress) => {
        //     const url = new URL(ress.data.data.wsflv);
        //     url.host = location.host;
        //     videoRef.value.play(url.toString());
        //     videoRef.value.setChannelId(ress.data.data.channelId);
        //     channelQuery.value.pageNum += 1;
        //     if (channelQuery.value.pageNum > ress.data.data.Total) {
        //         channelQuery.value.pageNum = 1;
        //     }
        // }).catch((err) => {
        //     channelQuery.value.pageNum = 1
        // });
    });
})

</script>
<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
}

.swiper_container {
    height: 100%;
    width: 100%;
}
</style>