import { ref } from "vue";
import { defineStore } from "pinia";
import { use } from "echarts";

const useFloorStore = defineStore("floor", () => {
	const currentFloor = ref(1);
	return { currentFloor };
});

const useEquipmentStore = defineStore("equipment", () => {
	const equipmentData = ref({});
	const svgCodeNameList = ref([]);
	return { equipmentData, svgCodeNameList };
});

const useScadaWindowStore = defineStore("scadaWindow", () => {
	const scadaWindowVisible = ref(false);
	const scadaWindowData = ref({});
	return { scadaWindowVisible, scadaWindowData };
});

const useScadaSvgViewStore = defineStore("scadaSvgView", () => {
	const svgHighlight = ref('');
	return { svgHighlight };
});

const useScadaAlarmStore = defineStore("scadaAlarm", () => {
	const alarmTime = ref('');
	const equipment = ref({});
	const threshold = ref({});
	const clearAlarm = () => {
		alarmTime.value = '';
		equipment.value = {};
		threshold.value = {};
		useScadaSvgViewStore().svgHighlight = '';
		useScadaWindowStore().scadaWindowVisible = false;
	};
	return { alarmTime, equipment, threshold, clearAlarm };
});

export { useFloorStore, useEquipmentStore, useScadaWindowStore, useScadaSvgViewStore, useScadaAlarmStore };