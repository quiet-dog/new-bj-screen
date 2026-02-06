<template>
    <div class="content">
        <p class="title">{{ title }}</p>
        <div class="video_container">
            <div style="margin: 0 auto;" id="container" ref="videoRef"></div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import Jessibuca from "../../../@types/jessibuca";
import { getStreamUrlApi } from "../../../api/video";
import { useVideoHook } from "./videoItemHook";

const { channelId = "", activeIndex = 0, currentIndex = 0, title = "" } = defineProps<{
    channelId: string;
    activeIndex: number;
    currentIndex: number;
    title: string;
}>()

const { jessibuca,
    play,
    paused,
    destroy,
    create,
    videoRef,
    playUrl,
    currentId, } = useVideoHook();


function isValidUrl(string: string) {
    try {
        new URL(string);  // 尝试解析 URL
        return true;
    } catch (err) {
        return false;     // 如果解析失败，则不是合法 URL
    }
}
const currentUrl = ref("")
watch(() => activeIndex, (newVal) => {
    if (newVal === currentIndex && channelId !== null && channelId !== "") {
        if (jessibuca == null) {
            create();
        }
        getStreamUrlApi(currentId.value).then((ress) => {
            // 判断ress.data.data.wsflv是不是正确的地址
            // const url = new URL(ress.data.data.wsflv);
            // url.host = location.host;
            // currentUrl.value = url.toString();
            // play(currentUrl.value);
            if (isValidUrl(ress.data.data.wsflv)) {
                const url = new URL(ress.data.data.wsflv);
                url.protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
                url.host = location.host;
                currentUrl.value = url.toString();
                play(currentUrl.value);
            }
               

        })
    } else {
        if (jessibuca != null) {
            jessibuca.destroy();
        }
    }
})

watch(() => channelId, (newVal) => {
    if (newVal !== null && newVal !== "") {
        currentId.value = newVal;
        getStreamUrlApi(newVal).then((ress) => {
            // 判断ress.data.data.wsflv是不是正确的地址
            if(isValidUrl(ress.data.data.wsflv)){
                const url = new URL(ress.data.data.wsflv);
                url.protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
                url.host = location.host;
                currentUrl.value = url.toString();
                play(currentUrl.value);
            }
        })
    }
}, {
    immediate: true
})

onMounted(() => {

})

</script>
<style lang="scss" scoped>
.content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.video_container {
    flex: 1;

    #container {
        width: adaptiveWidth(420);
        height: adaptiveHeight(215);
        object-fit: cover;
    }

    object-fit: cover;
}

.title {
    color: white;
    font-size: 16px;
}
</style>