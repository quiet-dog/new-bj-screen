<script setup lang="ts">
import { ref, watch } from "vue";
import BgFour from "../../assets/screen/4_108.png";
import { useDeviceStore } from "../device";
import { useFourDeviceHook } from ".";
import Per from "../../assets/per/per.jpg";
import { getPersonnelListApi } from "../../api/video";
import { healthyList } from "../../api/personnel";

/** 组件name最好和菜单表中的router_name一致 */
defineOptions({
  name: "Post"
});
const { list, tuRef, xAspectRatio,yAspectRatio, urlInfo, deviceStyles } = useFourDeviceHook();
const deviceStore = useDeviceStore();
const personnelInfo = ref<any>(null);
const personelShow =ref(false)
onMounted(()=>{
  // getPersonnelListApi().then(res=>{
  //   if(res.data?.data?.rows.length > 0){
  //     personnelInfo.value = res.data.data.rows[0]
  //     console.log("personnelInfo.value",personnelInfo.value)
  //   }
  // })
  healthyList({
    pageSize:1,
    pageNum:1,
  }).then(res=>{
    if(res.data?.data?.rows.length > 0){
      personnelInfo.value = res.data.data.rows[0]
      console.log("personnelInfo.value",personnelInfo.value)
    }
  })
})
// watch(() => deviceStore.currentData, (newVal) => {
//   deviceStore.tuFour.forEach(item => {
//     if (newVal.content.deviceType === item.type) {
//       if (newVal.content.equipmentInfo != null) {
//         item.thresholds.forEach(threshold => {
//           if (threshold.thresholdId === newVal?.content.equipmentInfo.thresholdId) {
//             threshold.sensorValue = newVal?.content.equipmentInfo.value;
//             useDeviceStore().isShowDetail = true;
//           }
//         });
//       }
//       if (newVal.content.environmentAlarmInfo != null ) {
//         item.environment.sensorValue = newVal?.content.environmentAlarmInfo.value;
//       }
//     }

//   })
// }, { deep: true });

</script>

<template>
  <div class="main">
    <div class="my-container">

      <ElPopover  v-model:visible="personelShow" >
        <template #reference>
      <img class="myPer" :src="Per" alt="" srcset="">
        </template>
        <span>姓名:{{ personnelInfo?.personnel?.name }}</span>
        <br/>
        <span>体温:{{  personnelInfo?.temperature}}</span>
        <br/>

        <span>收缩压:{{  personnelInfo?.lowBloodPressure }}</span>
        <br/>
        <span>舒张压:{{  personnelInfo?.highBloodPressure }}</span>
      </ElPopover>
      <img class="my-img" style="max-width: 100%;" ref="tuRef" @load="urlInfo" :src="BgFour" alt="" srcset="">
      <template v-for="(item, index) in deviceStore.tuTwo">
        <ElPopover  v-model:visible="item.showPopover" :width="500">
          <template #reference>
            <div class="device-1" :style="deviceStyles[index]?.style"></div>
          </template>
               {{ item?.equipment?.equipmentName }}
          <ElTable v-if="item.type =='设备档案'" :data="item.thresholds">
            <ElTableColumn width="150" prop="sensorName" label="传感器名字" />
            <ElTableColumn width="150" prop="sensorModel" label="传感器型号" />
            <ElTableColumn width="150" prop="sensorValue" label="传感器当前数值" />
          </ElTable>
          <ElForm v-if="item.type =='环境档案'">
            <ElFormItem label="名称">
              {{ item.environment?.description }}
            </ElFormItem>
            <ElFormItem label="当前环境值">
              {{ item.environment?.sensorValue }}
            </ElFormItem>
          </ElForm>

         
        </ElPopover>
      </template>

    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.my-container {
  position: relative;
}

.device-1 {
  // width: 100px;
  // height: 200px;
  background-color: rgba($color: #000000, $alpha: .1);
  position: absolute;
  // top: 370px;
  // left: 540px;
  cursor: pointer;
}
.my-img{
  // 旋转-90度
  transform: rotate(-90deg);
}

.myPer{
  position: absolute;
  width: 50px;
  left: 150px;
  top: 150px;
  z-index: 2;
}
</style>
