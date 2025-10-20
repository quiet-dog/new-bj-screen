import { ref } from "vue";
import { defineStore } from "pinia";
import { scada_data } from '../api/scada_data';

export const useFloorStore = defineStore("floor", () => {
	const currentFloor = ref(1);
	return { currentFloor };
});