<template>
	<div :class="{ 'bigscreen_l_box': direction === 'left', 'bigscreen_r_box': direction === 'right', 'alarm-box': isAlarmed }"
		@click="clickHandler">
		<div class="equipment-name">{{ data.equipmentName }}</div>
		<div class="equipment-code">{{ data.equipmentCode }}</div>
		<div class="equipment-area">{{ data.installationLocation }}</div>

		<div v-for="threshold in data.thresholdList" class="equipment-threshold">
			<div class="sensorName">{{ threshold.sensorName }}</div>
			<div class="value">{{ threshold?.value || 0 }} <span
					v-if="!threshold.sensorName.toLowerCase().includes('ph')">{{ threshold.unit }}</span></div>

		</div>

	</div>

</template>
<script lang='ts' setup>
	// 接收英文名的方向参数：direction（字符串，必填）
	import { useFloorStore, useEquipmentStore, useScadaWindowStore, useScadaSvgViewStore, useScadaAlarmStore } from "../../store/scada_data";
	const floorStore = useFloorStore();
	const equipmentStore = useEquipmentStore();
	const scadaWindowStore = useScadaWindowStore();
	const scadaSvgViewStore = useScadaSvgViewStore();
	const scadaAlarmStore = useScadaAlarmStore();
	const isAlarmed = ref(false);
	watch(
		() => scadaAlarmStore.alarmTime,
		(newVal) => {
			if (newVal === '') {
				isAlarmed.value = false;
				return;
			}
			if (scadaAlarmStore.equipment.equipmentCode && scadaAlarmStore.equipment.equipmentCode != '') {
				if (scadaAlarmStore.equipment.equipmentCode === props.data.equipmentCode) {
					isAlarmed.value = true;
				}
			}
		}
	);
	const props = defineProps({
		direction: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
	});
	const unitIsShow = () => {
		return props.data.thresholdList.some((threshold) => threshold.unit && threshold.unit.trim() !== '');
	};
	const clickHandler = () => {
		equipmentStore.svgCodeNameList.forEach((item) => {
			console.log(item)
			if (item.code === props.data.installationLocation) {
				floorStore.currentFloor = parseInt(item.map)
				scadaWindowStore.scadaWindowData = { code: item.code, name: item.name };
				scadaWindowStore.scadaWindowVisible = true;
				scadaSvgViewStore.svgHighlight = '';
				scadaSvgViewStore.svgHighlight = item.code;
				return
			}
		})

	}
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

	.bigscreen_l_box,
	.bigscreen_r_box {
		width: adaptiveWidth(182);
		background: url("/public/img/背景下层.png") no-repeat;
		background-size: 100% 100%;
		// flex: 0 0 adaptiveHeight(135);
		position: relative;
		z-index: 999;
		display: flex;
		flex-direction: column;
		padding: 10px;
		color: #FFF;
		cursor: pointer;

		/* 整卡片红色闪烁覆盖层 */
		&.alarm-box::after {
			content: "";
			position: absolute;
			inset: 0;
			background: #ff0000;
			opacity: 0;
			pointer-events: none;
			z-index: 1000;
			animation: alarmFlash 1s infinite;
		}

		@keyframes alarmFlash {

			0%,
			100% {
				opacity: 0;
			}

			50% {
				opacity: 0.5;
			}
		}

		.equipment-name {
			font-size: adaptiveFontSize(16);
		}

		.equipment-code {
			font-size: adaptiveFontSize(14);

			color: rgba(255, 255, 255, 0.6);

		}

		.equipment-area {
			font-size: adaptiveFontSize(14);

			color: rgba(255, 255, 255, 0.6);
		}


		.equipment-threshold {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			color: #ffffffcc;
			font-size: adaptiveFontSize(14);
		}
	}

</style>