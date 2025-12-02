<template>
	<div v-show="visible" class="bigscreen_box">
		<button class="close-btn" @click="handleClose" aria-label="关闭">
			<span>×</span>
		</button>
		<div class="title">
			<div class="name">{{ data?.name }}</div>
			<div class="code">{{ data?.code }}</div>
		</div>
		<div class="content">
			<div v-for="item in currentRoomEquipment" :key="item.equipmentId" class="bigscreen_box_mini"
				:class="{ 'alarm-box': item.equipmentCode === scadaAlarmStore.equipment?.equipmentCode }">
				<div>{{ item.equipmentName }}</div>
				<div>{{ item.equipmentCode }}</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, watch, nextTick } from 'vue'
	import { useEquipmentStore, useScadaAlarmStore, useScadaSvgViewStore } from "../store/scada_data";
	const equipmentStore = useEquipmentStore();
	const scadaAlarmStore = useScadaAlarmStore();
	const scadaSvgViewStore = useScadaSvgViewStore();
	const visible = defineModel()
	const { data } = defineProps({
		data: Object
	})
	const currentRoomEquipment = ref([])
	watch(visible, (newVal) => {
		if (!newVal) {
			return
		}
		queryCurrentRoomEquipment()
		console.log(data.code)
		// console.log(equipmentStore.equipmentData)
	})

	function queryCurrentRoomEquipment() {
		let currentRoomEquipmentRaw = []
		equipmentStore.equipmentData.forEach((item) => {
			if (item.installationLocation.includes(data.code)) {
				currentRoomEquipmentRaw.push(item)
			}
		})
		currentRoomEquipment.value = currentRoomEquipmentRaw
		// Implementation for querying current room equipment
	}

	function handleClose() {
		// 子组件不能直接修改 prop，需通过事件通知父组件更新
		visible.value = false
		scadaSvgViewStore.svgHighlight = ''
	}
	onMounted(() => {
		console.log('[ScadaWindow] mounted')
	})
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

	.bigscreen_box {
		width: adaptiveWidth(800);
		min-height: adaptiveHeight(400);
		/* 方式一：直接使用不透明纯色 + 背景图叠加（纯色写在前面保证 PNG 透明区域也被填充） */
		background: #081a2e url("/public/img/背景下层.png") no-repeat;
		background-size: 100% 100%;
		position: fixed;
		top: 10%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 999;
		display: flex;
		flex-direction: column;
		padding: 10px;
		color: #FFF;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
		border-radius: 8px;

		.content {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			gap: adaptiveWidth(15);

			.bigscreen_box_mini {
				// width: adaptiveWidth(400);
				/* 方式一：直接使用不透明纯色 + 背景图叠加（纯色写在前面保证 PNG 透明区域也被填充） */
				background: url("/public/img/背景下层.png") no-repeat;
				background-size: 100% 100%;
				display: flex;
				flex-direction: column;
				padding: 10px;
				color: #FFF;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
				border-radius: 8px;
				/* 关键：限定遮罩定位在卡片自身，并裁剪圆角 */
				position: relative;
				overflow: hidden;

				&.alarm-box::after {
					content: "";
					position: absolute;
					inset: 0;
					background: #ff0000;
					opacity: 0;
					pointer-events: none;
					z-index: 1;
					border-radius: inherit;
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
			}
		}


		.title {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;

			.name {
				font-size: adaptiveFontSize(25);
				margin-right: adaptiveWidth(20);
			}

			.code {
				font-size: adaptiveFontSize(20);
				color: rgba(255, 255, 255, 0.6);
			}
		}


		.close-btn {
			position: absolute;
			top: 6px;
			right: 8px;
			width: 28px;
			height: 28px;
			border: none;
			background: none;
			color: #fff;
			font-size: 20px;
			line-height: 1;
			border-radius: 4px;
			cursor: pointer;
			padding: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}


</style>