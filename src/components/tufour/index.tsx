import { getThreshold } from "../../api/manage/threshold"
import http from "../../utils/http"
import { computed, onMounted, reactive, ref } from "vue"

export function useFourDeviceHook() {

  const tuRef = ref()

  // 宽高比
  const xAspectRatio = ref(0)

  const yAspectRatio = ref(0)

  const deviceStyles = ref([
    {
      style: {
        'width': '100px',
        'height': '180px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '570px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 3250,
      left: 1600,
      width: 200,
      height: 400,
    },
    {
      style: {
        'width': '20px',
        'height': '20px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 3070,
      left: 1400,
      width: 180,
      height: 400,
    },
    {
      style: {
        'width': '20px',
        'height': '20px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 3200,
      left: 5080,
      width: 180,
      height: 400,
    },
    {
      style: {
        'width': '20px',
        'height': '20px',
        'backgroundColor': 'rgba(0, 0, 0, .8)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 3200,
      left: 5280,
      width: 180,
      height: 400,
    },
    {
      style: {
        'width': '20px',
        'height': '20px',
        'backgroundColor': 'rgba(0, 0, 0, .1)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      top: 1850,
      left: 3940,
    }
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
      equipmentId: 4,
      equipment: {},
      value: 0,
      thresholds: [],
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .5)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      equipmentId: 13,
      equipment: {},
      value: 0,
      thresholds: [],
      type: "设备档案"
    },
    {
      style: {
        'width': '100px',
        'height': '200px',
        'backgroundColor': 'rgba(0, 0, 0, .5)',
        'top': '370px',
        'left': Math.floor(xAspectRatio.value * 2000) + "px",
      },
      value: 0,
      thresholds: [],
      equipmentId: 14,
      type: "设备档案",
      environmentId: 0,
      environment: {}
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
      equipmentId: 15,
      type: "设备档案",
      environmentId: 0,
      environment: {}
    },
    // {
    //   style: {
    //     'width': '100px',
    //     'height': '200px',
    //     'backgroundColor': 'rgba(0, 0, 0, .1)',
    //     'top': '370px',
    //     'left': Math.floor(xAspectRatio.value * 2000) + "px",
    //   },
    //   value: 0,
    //   thresholds: [],
    //   type: "环境档案",
    //   environmentId: 4,
    //   environment: {}
    // },
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