import { getThresholdInfo, submitThresholdInfo } from '../../api/equipment/index';
import { ElMessage } from "element-plus";
export function useEditThHook(){
    const  centerDialogVisible= ref(false);
    const alarmLevelOptions = [
      { label: "轻微", value: "轻微" },
      { label: "一般", value: "一般" },
      { label: "中度", value: "中度" },
      { label: "重要", value: "重要" },
      { label: "紧急", value: "紧急" }
    ];
    const formData =ref({
      environmentId: 0,
      description: "",
      tag: "",
      type: "",
      scope: "",
      signal: "",
      supplier: "",
      model: "",
      unit: "",
      plcAddress: "",
      unitName: "",
      emergencyIds: [],
      sopIds: [],
      values: [
        {
          level: "",
          min: null,
          max: null
        }
      ]
    });
    const num =ref(1)
    const clickFormItem= (id)=>{
      getThresholdInfo(id).then(res=>{
        formData.value = res.data.data
        num.value= res.data.data?.values?.length
        centerDialogVisible.value=true
      })
    }

    const handleChange = (value: number) => {
      const currentLength = formData.value.values.length;
      if (value > currentLength) {
        // 如果输入值大于当前 list 长度，则增加新条目
        for (let i = currentLength; i < value; i++) {
          formData.value.values.push({
            level: "", // 默认报警级别
            min: null, // 默认开始区间
            max: null // 默认结束区间
          });
        }
      } else if (value < currentLength) {
        // 如果输入值小于当前 list 长度，则减少条目
        formData.value.values.splice(value, currentLength - value);
      }
    };

    const submitFormThreshold = () => {
      submitThresholdInfo(formData.value).then(res=>{
        centerDialogVisible.value=false
        ElMessage.success("提交成功");
      }).catch(()=>{
        ElMessage.error("提交失败");
      })
    }
    
return {
  centerDialogVisible,
  formData,
  clickFormItem,
  alarmLevelOptions,
  num,
  handleChange,
  submitFormThreshold
}
}