import { getThreshold } from "../../api/manage/threshold"
import http from "../../utils/http"
import { computed, onMounted, reactive, ref } from "vue"

export function useThreeDeviceHook() {

  const tuRef = ref()

  // 宽高比
  const xAspectRatio = ref(0)

  const yAspectRatio = ref(0)

  const deviceStyles = ref([
    {
      style: {
        'width': '70px',
        'height': '70px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '570px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 2480,
      left: 2350,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '70px',
        'height': '150px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 2480,
      left: 2530,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 2680,
      left: 2350,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 2680,
      left: 2530,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 3150,
      left: 2350,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 3150,
      left: 2530,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 3350,
      left: 2350,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 3350,
      left: 2530,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 3750,
      left: 2350,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 3750,
      left: 2530,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 4130,
      left: 2360,
      width: 90,
      height: 100,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 4130,
      left: 2470,
      width: 100,
      height: 100,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 4130,
      left: 2570,
      width: 100,
      height: 100,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 2280,
      left: 2670,
      width: 300,
      height: 200,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 4130,
      left: 1550,
      width: 200,
      height: 600,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 4230,
      left: 1320,
      width: 200,
      height: 300,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 2480,
      left: 4080,
      width: 150,
      height: 150,
    },


    // 第二部分
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 2480,
      left: 4260,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 2680,
      left: 4080,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 2680,
      left: 4260,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 3130,
      left: 4080,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 3130,
      left: 4260,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 3330,
      left: 4080,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 3330,
      left: 4260,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 3730,
      left: 4080,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 3730,
      left: 4260,
      width: 150,
      height: 150,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 4130,
      left: 5000,
      width: 150,
      height: 550,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 4200,
      left: 5200,
      width: 200,
      height: 280,
    },
    {
      style: {
        'width': '50px',
        'height': '50px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 2300,
      left: 3800,
      width: 200,
      height: 280,
    },
  ])

  const list = ref([
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      equipmentId: 16,
      value: 0,
      thresholds: [],
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      equipmentId: 17,
      value: 0,
      thresholds: [],
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      equipmentId: 18,
      value: 0,
      thresholds: [],
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      equipmentId: 19,
      value: 0,
      thresholds: [],
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 20,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 21,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 22,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 23,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 24,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 25,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 26,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 27,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 28,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 29,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 30,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 31,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 7,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 32,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 33,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 34,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 35,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 36,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 37,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 38,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 39,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 40,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 41,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 42,
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 43,
      type: "设备档案"
    },
  ])

  const urlInfo = (el) => {
    // 获取图片的原始宽高
    const imgWidth = el.target.width
    const imgHeight = el.target.height
    // 获取图片的渲染宽高
    const imgClientWidth = el.target.naturalWidth
    const imgClientHeight = el.target.naturalHeight
    // 获取图片的缩放比例
    xAspectRatio.value = imgWidth / imgClientWidth
    yAspectRatio.value = imgHeight / imgClientHeight
    deviceStyles.value.forEach((item) => {
      item.style.left = Math.floor(xAspectRatio.value * item.left) + "px"
      item.style.top = Math.floor(yAspectRatio.value * item.top) + "px"
      item.style.width = Math.floor(xAspectRatio.value * item.width) + "px"
      item.style.height = Math.floor(yAspectRatio.value * item.height) + "px"
    })
  }

  // onMounted(() => {
  //   http.get("/manage/threshold", {
  //     params: {
  //       pageNum: 1,
  //       pageSize: 1000
  //     }
  //   }).then((res) => {
  //     res.data.data.rows.forEach((item: any) => {
  //       list.value.forEach((item2: any) => {
  //         if (item.equipment != null && item.equipment.equipmentId === item2.equipmentId) {
  //           item2.thresholds.push(item)
  //         }
  //       })
  //     })
  //   }).catch((err) => { })

  //   http.get("/manage/environment", {
  //     params: {
  //       pageNum: 1,
  //       pageSize: 1000
  //     }
  //   }).then((res) => {


  //     res.data.data.rows.forEach((item: any) => {
  //       list.value.forEach((item2: any) => {
  //         if (item.environmentId === item2.environmentId) {
  //           item2.environment = item
  //         }
  //       })
  //     })
  //   })
  //   http.get("/manage/equipment", {
  //     params: {
  //       pageNum: 1,
  //       pageSize: 1000
  //     }
  //   }).then((res) => {


  //     res.data.data.rows.forEach((item: any) => {
  //       list.value.forEach((item2: any) => {
  //         if (item.equipmentId === item2.equipmentId) {
  //           item2.equipment = item
  //         }
  //       })
  //     })
  //   })
  //   console.log("list.value", list.value)
  // })
  // setInterval(() => {
  //   list.value.forEach((item: any) => {
  //     item.thresholds.forEach((item2: any) => {
  //       item2.sensorValue = Math.floor(Math.random() * 100)
  //       console.log(item2.sensorValue)
  //     })
  //   })
  // }, 2000)
  return {
    list,
    tuRef,
    xAspectRatio,
    yAspectRatio,
    urlInfo,
    deviceStyles
  }
}