<template>
	<div class="bigscreen_cb" :style="{ 'top': top }">
		<div class="bigscreen_cb_ignore" v-if="isIgnoreAlarm" @click="ignoreAlarm()">
			<div>
				忽略报警
			</div>
		</div>
		<div class="bigscreen_cb_switcher">
			<div class="bigscreen_cb_switcher_item" v-for="floor in floors"
				:class="{ 'alarm-box': alarmedFloor.includes(floor.code) }" @click="switchZone(floor.code)">
				<div :style="{
					color: floorStore.currentFloor === floor.code ? '#ffffff' : '#00ABFF',
				}">
					{{ floor.name }}
				</div>
				<img v-if="floorStore.currentFloor === floor.code" src="/img/切换图标.png" alt="" />
			</div>
		</div>
		<div class="bigscreen_cb_nei">
			<svg-view :name="floorStore.currentFloor" :initialScale="0.8" :svgViewTop="svgViewTop"
				@element-click="onSvgElementClick" />
			<!-- 如需回退到图片：<img style="width: 100%;" :src="imgZoneMap" alt="" /> -->
		</div>
		<scada-window v-model="scadaWindowStore.scadaWindowVisible"
			:data="scadaWindowStore.scadaWindowData"></scada-window>
		<div></div>
	</div>
</template>

<script lang="ts" setup>
	import { ref, onMounted, onUnmounted } from "vue";
	import { geteventTotal } from "../api/home";
	import { Close } from "@element-plus/icons-vue";
	const img = "/img/0.png";
	const img1 = "/img/1.png";
	const img2 = "/img/2.png";
	const img3 = "/img/3.png";
	const img4 = "/img/4.png";
	const img5 = "/img/5.png";
	const img6 = "/img/6.png";
	const img7 = "/img/7.png";
	const img8 = "/img/8.png";
	const img9 = "/img/9.png";
	import TuOne from "./tuone/index.vue";
	import TuTwo from "./tutwo/index.vue";
	import TuThree from "./tuthree/index.vue";
	import TuFour from "./tufour/index.vue";
	import { ElButton, ElTabs } from "element-plus";
	import { useDeviceStore } from "./device";
	import { useIntervalFn } from '@vueuse/core'
	import { useFloorStore, useScadaWindowStore, useScadaAlarmStore, useEquipmentStore, useScadaSvgViewStore } from "../store/scada_data";
	import SvgView from "./svg_view.vue";
	import ScadaWindow from "./scada_window.vue";
	const { top } = defineProps({
		top: {
			type: String,
		},
		svgViewTop: {
			type: String,
		},
		isIgnoreAlarm: {
			type: Boolean,
			default: true,
		},
	})

	const count1 = ref(0);
	const count2 = ref(0);

	const floorStore = useFloorStore();
	const scadaWindowStore = useScadaWindowStore();
	const scadaAlarmStore = useScadaAlarmStore();
	const equipmentStore = useEquipmentStore();
	const scadaSvgViewStore = useScadaSvgViewStore();
	// 传给 SvgView 的“键”，与 src/assets/svg 下的文件对应（不含 .svg）。
	// 比如有 1.svg、21.svg... 则这里用 "1"、"21"。
	// 如仍需保留原先 PNG 的路径，可单独维护：
	// const imgZoneMap = ref("/public/img/scada/1.png")
	// const scadaWindowData = ref({ "code": { "code": "8M117", "name": "制水间", "el": "[object SVGPolygonElement]", "event": "[object PointerEvent]" } });
	const ignoreAlarm = () => {
		scadaAlarmStore.clearAlarm();
	}
	const floors = ref([{
		code: 1,
		name: "一层"
	}, {
		code: 21,
		name: "二层-1"
	}, {
		code: 22,
		name: "二层-2"
	}, {
		code: 31,
		name: "三层-1"
	}, {
		code: 32,
		name: "三层-2"
	}, {
		code: 33,
		name: "三层-3"
	}])
	const alarmedFloor = ref([]);
	watch(() => scadaAlarmStore.alarmTime, (newVal) => {
		if (newVal === '') {
			alarmedFloor.value = [];
			return;
		}
		if (scadaAlarmStore.equipment.equipmentCode && scadaAlarmStore.equipment.equipmentCode != '') {
			let map = equipmentStore.svgCodeNameList.find(item => {
				return item.code === scadaAlarmStore.equipment.installationLocation
			}).map
			alarmedFloor.value.push(parseInt(map));
			floorStore.currentFloor = parseInt(map);
		}
	}, { immediate: true });
	const onSvgElementClick = (data) => {
		console.log("SVG 元素被点击：", data);
		scadaWindowStore.scadaWindowData = data;
		scadaWindowStore.scadaWindowVisible = true;
		// 在这里处理点击事件，例如显示详情弹窗等
	}

	const switchZone = (zone: number) => {
		scadaSvgViewStore.svgHighlight = '';
		floorStore.currentFloor = zone;
		// 切换 Svg 键（例如 1 -> 加载 src/assets/svg/1f.svg）
		// imgZoneMap.value = `/public/img/scada/${zone}.png`
	}

	const geteventTotalFun = async () => {
		const { data } = await geteventTotal();
		count1.value = data.data.todayTotal;
		count2.value = data.data.allTotal;
	};

	const closeDevice = () => {
		useDeviceStore().isShowDetail = false;
		useDeviceStore().initPopover();
	}

	function shuimg(val: string): string {
		const imgMap: Record<string, string> = {
			"0": img,
			"1": img1,
			"2": img2,
			"3": img3,
			"4": img4,
			"5": img5,
			"6": img6,
			"7": img7,
			"8": img8,
			"9": img9,
		};
		return imgMap[val] || ""; // 如果值不存在，则返回空字符串
	}

	const { pause, resume, isActive } = useIntervalFn(() => {
		geteventTotalFun();
	}, 5000)
	onMounted(() => {
		geteventTotalFun();
	});
	onUnmounted(() => {
		pause()
		useDeviceStore().initPopover();
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

	#my-tabs :deep(> div.el-tabs__header.is-top > div > div) {
		background-color: white;
	}

	#my-tabs {
		background-color: white;
		padding-left: 20px;
	}

	.bigscreen_ct {
		width: adaptiveWidth(840);
		height: adaptiveHeight(119);
		position: absolute;
		top: adaptiveHeight(132);
		left: 50%;
		margin-left: adaptiveWidth(-420);
		display: flex;
		justify-content: space-between;

		.bigscreen_ct_l {
			width: adaptiveWidth(208);
			height: 100%;

			span {
				color: rgba(242, 242, 242, 1);
				font-size: adaptiveFontSize(24);
			}

			.bigscreen_ct_lb {
				width: 100%;
				height: adaptiveHeight(72);
				margin-top: adaptiveHeight(12);
				display: flex;

				// justify-content: space-between;
				div {
					&:nth-child(1) {
						margin-left: 0;
					}

					width: adaptiveWidth(63);
					height: adaptiveHeight(72);
					margin-left: adaptiveWidth(12);
					background: url("/public/img/数字背景.png") no-repeat;
					background-size: 100% 100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}

		.bigscreen_ct_r {
			width: adaptiveWidth(353);
			height: 100%;

			span {
				color: rgba(242, 242, 242, 1);
				font-size: adaptiveFontSize(24);
			}

			.bigscreen_ct_rb {
				width: 100%;
				height: adaptiveHeight(72);
				margin-top: adaptiveHeight(12);
				display: flex;

				// justify-content: space-between;
				div {
					&:nth-child(1) {
						margin-left: 0;
					}

					width: adaptiveWidth(63);
					height: adaptiveHeight(72);
					margin-left: adaptiveWidth(12);
					background: url("/public/img/数字背景.png") no-repeat;
					background-size: 100% 100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
	}

	.bigscreen_cb {
		width: adaptiveWidth(996);
		height: adaptiveHeight(665);
		background: url("/public/img/网格背景.png") no-repeat;
		background-size: 100% 100%;
		position: absolute;
		top: adaptiveHeight(160);
		left: 50%;
		margin-left: adaptiveWidth(-498);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.bigscreen_cb_ignore {
			position: fixed;
			left: 50%;
			transform: translateX(-50%);
			bottom: adaptiveHeight(140);

			div {
				color: white;
				width: adaptiveWidth(112);
				height: adaptiveHeight(56);
				background: url("/img/dbwenan.png") no-repeat;
				background-size: 100% 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				cursor: pointer;
				position: relative;
				/* 圆角与裁剪，保证遮罩与按钮一致 */
				border-radius: adaptiveHeight(28);
				overflow: hidden;
			}
		}

		.bigscreen_cb_switcher {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			z-index: 10;
			row-gap: adaptiveHeight(20);

			.bigscreen_cb_switcher_item {
				/* 作为遮罩定位的参考容器 */
				position: relative;

				div {
					width: adaptiveWidth(112);
					height: adaptiveHeight(56);
					background: url("/img/dbwenan.png") no-repeat;
					background-size: 100% 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					cursor: pointer;
					position: relative;
					/* 圆角与裁剪，保证遮罩与按钮一致 */
					border-radius: adaptiveHeight(28);
					overflow: hidden;
				}

				img {
					width: adaptiveWidth(34);
					height: adaptiveHeight(21);
				}

				width: adaptiveWidth(112);
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				color: rgba(255, 255, 255, 1);
				font-size: adaptiveFontSize(20);

				/* 将遮罩应用到内层按钮，使其继承圆角 */
				&.alarm-box {
					div::after {
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

					/* 红色发光（与闪烁同步） */
					div {
						animation: alarmGlow 1s infinite;
					}
				}
			}
		}

		.bigscreen_cb_nei {
			margin-top: adaptiveHeight(100);
			width: adaptiveWidth(840);
			height: adaptiveHeight(642);
		}

		.bigscreen_cb_dialog {
			position: absolute;
			width: adaptiveWidth(850);
			height: adaptiveHeight(600);
			// border: 1px solid red;
			overflow: scroll;
			overflow-x: scroll;
		}
	}

	/* 统一的警报闪烁动画 */
	@keyframes alarmFlash {

		0%,
		100% {
			opacity: 0;
		}

		50% {
			opacity: 0.5;
		}
	}

	/* 红色发光动画：脉冲式 box-shadow */
	@keyframes alarmGlow {

		0%,
		100% {
			box-shadow: 0 0 0 rgba(255, 0, 0, 0);
		}

		50% {
			box-shadow: 0 0 10px rgba(255, 0, 0, 0.7), 0 0 20px rgba(255, 0, 0, 0.5);
		}
	}
</style>
