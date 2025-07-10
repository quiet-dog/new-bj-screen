import Jessibuca from "../../../@types/jessibuca";
import { getStreamUrlApi } from "../../../api/video";
import { Pausable, useIntervalFn } from "@vueuse/core";
import { onMounted, onUnmounted, reactive, ref } from "vue"


export function useVideoHook() {
  let jessibuca = null;
  const videoRef = ref(null);
  const videoBuffer = 0.2;
  const playing = ref(false);
  const loaded = ref(false);
  const quieting = ref(true);
  const playUrl = ref("");
  const channelId = ref("");
  const lock = ref(false);




  async function create() {
    if (videoRef.value != null) {
      jessibuca = new (window as any).Jessibuca({
        container: videoRef.value,
        videoBuffer: videoBuffer,
        isReize: false,
        loadingText: "加载中",
        debug: true,
        showBandwidth: false,
        heartTimeoutReplay: true,
        heartTimeoutReplayTimes: -1,
        operateBtns: {
          fullscreen: false,
          screenshot: false,
          play: false,
          audio: false,
        },
        forceNoOffscreen: false,
        isNotMute: false,
        loadingTimeoutReplay: true,
        timeout: 10
      }) as Jessibuca;

      jessibuca.on("load", function () {
        console.log("on load");
      });

      jessibuca.on("log", function (msg: any) {
        console.log("on log", msg);
      });
      jessibuca.on("record", function (msg: any) {
        console.log("on record:", msg);
      });
      jessibuca.on("pause", function () {
        console.log("on pause");
        playing.value = false;
        if (jessibuca != null) {
          jessibuca.play().then(() => {

          }).catch((e) => {

          })
        }
      });

      jessibuca.on("stats", function (s) {
        // if (timer.isActive.value) {
        //   timer.pause()
        // }
      })

      jessibuca.on("play", function () {
        console.log("on play");
        playing.value = true;
        loaded.value = true;
        quieting.value = jessibuca.isMute();

      });
      jessibuca.on("fullscreen", function (msg: any) {
        console.log("on fullscreen", msg);
      });

      jessibuca.on("mute", function (msg: any) {
        console.log("on mute", msg);
        quieting.value = msg;
      });

      jessibuca.on("mute", function (msg: any) {
        console.log("on mute2", msg);
      });

      jessibuca.on("audioInfo", function (msg: any) {
        console.log("audioInfo", msg);
      });
      jessibuca.on("videoInfo", function (info: any) {
        console.log("videoInfo", info);
      });

      jessibuca.on("error", async function (error: any) {
        console.log("发送重连接")
        if (lock.value) {
          return
        }
        lock.value = true
        setTimeout(async () => {
          await getStreamUrlApi(channelId.value).then(async (res) => {
            // await jessibuca.destroy()
            console.log("播放新的", res.data.wsflv)
            await jessibuca.play(res.data.wsflv)
          }).catch(err => {

          }).finally(() => {
            lock.value = false
          })

        }, 1000)


        // reconnet()
        // if (!timer.isActive.value) {
        //   console.log("开始定时器")
        //   timer.resume()
        // }
      });

      jessibuca.on("timeout", async function () {
        // console.log("timeout");
        // await jessibuca.destroy();
        // create()
      });

      jessibuca.on('start', function () {
      })

      jessibuca.on("delayTimeout", function () {
        console.log('timeout')
      })

      jessibuca.on("performance", function (performance: any) {
        var show = "卡顿";
        if (performance === 2) {
          show = "非常流畅";
        } else if (performance === 1) {
          show = "流畅";
        }
      });
      jessibuca.on('buffer', function (buffer: any) {
        console.log('buffer', buffer);
      })

      jessibuca.on('kBps', function (kBps: any) {
        console.log('kBps', kBps);
      });

      // 显示时间戳 PTS
      jessibuca.on('videoFrame', function () {

      })

      //
      jessibuca.on('metadata', function () {

      });

    }
  }

  const play = (url: string) => {
    if (jessibuca == null) {
      return;
    }
    if (url !== null && url !== "") {
      jessibuca.play(url);
    }
  }
  const paused = () => {
    jessibuca.pause();
    playing.value = false;
  }

  const destroy = async () => {
    if (jessibuca) {
      await jessibuca.destroy();
      jessibuca = null;
    }
    create();
    playing.value = false;
    loaded.value = false;
  }
  onMounted(() => {
    create();
  })

  onUnmounted(async () => {
    if (jessibuca) {
      await jessibuca && jessibuca.destroy();
      jessibuca = null;
    }
  })

  return {
    jessibuca,
    play,
    paused,
    destroy,
    create,
    videoRef,
    playUrl,
    channelId
    // pause, isActive, resume
  }
}
