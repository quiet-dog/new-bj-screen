<template>
	<div class="bigscreen_l">
		<scada-data v-for="item in currentFloorData[0]" :data="item" direction="left"></scada-data>
	</div>
	<scada-center></scada-center>
	<div class="bigscreen_r">
		<scada-data v-for="item in currentFloorData[1]" :data="item" direction="right"></scada-data>
	</div>
</template>

<script lang="ts" setup>
	import { ref, onMounted, nextTick } from "vue";
	import scadaCenter from "../../components/scada_center.vue";
	import { Client } from "@stomp/stompjs";
	import ScadaData from "../../components/ScadaData/index.vue";
	import { useFloorStore, useEquipmentStore, useScadaAlarmStore, useScadaSvgViewStore, useScadaWindowStore } from "../../store/scada_data";
	const floorStore = useFloorStore();
	const equipmentStore = useEquipmentStore();
	const scadaAlarmStore = useScadaAlarmStore();
	const scadaSvgViewStore = useScadaSvgViewStore();
	const scadaWindowStore = useScadaWindowStore();
	import axios from "axios";
	const equipmentData = ref([]);
	const equipmentTotal = ref(0);
	const getEquipmentTotal = async () => {
		return new Promise((resolve, reject) => {
			axios({
				url: "/api/manage/equipment",
				method: "get",
				params: {
					pageNum: 1,
					pageSize: 1,
				},
				headers: {
					authorization: "Bearer MASTER_TOKEN_123456",
				},
			}).then(res => {
				if (res.status === 200 && res.data.code === 0) {
					resolve(res.data.data.total);
				} else {
					reject(new Error("Failed to fetch equipment total"));
				}
			}).catch(err => {
				console.error(err);
				reject(err);
			});
		});
	}
	const getEquipmentData = async () => {
		return new Promise((resolve, reject) => {
			axios({
				url: "/api/manage/equipment",
				method: "get",
				params: {
					// equipmentType: "设备档案",
					pageNum: 1,
					pageSize: equipmentTotal.value,
				},
				headers: {
					authorization: "Bearer MASTER_TOKEN_123456",
				},
			}).then(res => {
				if (res.status === 200 && res.data.code === 0) {
					resolve(res.data.data.rows);
				} else {
					reject(new Error("Failed to fetch equipment total"));
				}
			}).catch(err => {
				console.error(err);
				reject(err);
			});
		});
	};
	const stompClient = new Client({
		brokerURL: "/ws-api/ws"
	});
	stompClient.onConnect = frame => {
		stompClient.subscribe("/topic/info", greeting => {
			console.log("greeting", JSON.parse(greeting.body));
			const data = JSON.parse(greeting.body);
			console.log(data);
			scadaAlarmStore.alarmTime = new Date().getTime();
			scadaAlarmStore.equipment = data.content.equipment;
			scadaAlarmStore.threshold = data.content.threshold;
			scadaSvgViewStore.svgHighlight = data.content.equipment.installationLocation;
			scadaWindowStore.scadaWindowData = { code: data.content.equipment.installationLocation, name: data.content.equipment.name };
			scadaWindowStore.scadaWindowVisible = true;
		});
		stompClient.subscribe("/topic/data", greeting => {
			// console.log("greeting", JSON.parse(greeting.body));
			const data = JSON.parse(greeting.body);
			let thresholdId = data.content.equipmentInfo.thresholdId;
			let currentFloor = floorStore.currentFloor.toString()[0];

			for (let i in equipmentData.value[currentFloor]) {
				for (let j in equipmentData.value[currentFloor][i].thresholdList) {
					if (equipmentData.value[currentFloor][i].thresholdList[j].thresholdId === data.content.equipmentInfo.thresholdId) {
						equipmentData.value[currentFloor][i].thresholdList[j].value = data.content.equipmentInfo.value;
					}
				}
			}
			// {
			//     "content":{
			//         "deviceType":"设备档案",
			//         "deviceId":null,
			//         "environmentAlarmInfo":null,
			//         "equipmentInfo":{
			//             "equipmentId":null,
			//             "thresholdId":294,
			//             "sensorName":null,
			//             "value":12.0
			//         },
			//         "dateSource":null
			// }
			// 根据消息类型设置通知类型和颜色
			let iconColor = "";
			switch (data.content.type) {
				case "环境报警":
					// iconColor = "#FAAD14"; // 橙色
					iconColor = "#FF4D4F"; // 红色
					break;
				case "设备报警":
					iconColor = "#FF4D4F"; // 红色
					break;
				case "物料报警":
					iconColor = "#FADC19"; // 黄色
					break;
				case "工艺报警":
					iconColor = "#FAAD14"; // 橙色
					break;
				default:
					iconColor = "#1890FF"; // 蓝色
			}

			// 音频是否在播放

			if (audu.value.paused) {
				audu.value.play().catch(err => {
					console.log(err);
				});
			}

			ElNotification({
				title: data.content.type,
				// data.content.description
				message: getDiv(data.content),
				customClass: getClass(data.content.type),
				// position: "bottom-right",
				icon: h(Icon, {
					icon: "ri:alarm-warning-fill",
					style: {
						color: iconColor,
					}
				}),
				appendTo: getAppentTo(data.content.type),
				// duration: 0,
			});
			// if (data.content.type === "环境报警") {

			// }

		});
	};

	stompClient.onWebSocketError = error => {
		console.error("Broker reported error: " + error);
	};

	stompClient.onStompError = frame => {
		console.error("Broker reported error: " + frame.headers["message"]);
		console.error("Additional details: " + frame.body);
	};
	const parseMapFloor = (data) => {
		let result = {
			"1": [],
			"21": [],
			"22": [],
			"31": [],
			"32": [],
			"33": [],
		}
		for (let i in data) {
			let floor = data[i].installationLocation
			let map = equipmentStore.svgCodeNameList.find(item => {
				return floor.includes(item.code)
			})?.map
			result[map].push(data[i])
		}
		return result
	}
	const currentFloorData = computed(() => {
		let currentFloor = floorStore.currentFloor.toString();
		let currentFloorData = equipmentData.value[currentFloor];
		if (!currentFloorData) return [[], []];
		if (currentFloorData.length < 2) {
			return [currentFloorData]
		} else {
			const half = Math.ceil(currentFloorData.length / 2);
			return [
				currentFloorData.slice(0, half),
				currentFloorData.slice(half)
			];
		}
	})

	// 读取指定 SVG 文件并提取带 data-code 和 data-name 的元素，输出扁平数组 [{code,name,map}]（纯 JS）
	function buildSvgCodeNameList() {
		const ids = ['1', '21', '22', '31', '32', '33']
		const modules = import.meta.glob('/src/assets/svg/*.svg', { as: 'raw', eager: true })
		const list = []
		ids.forEach(id => {
			const path = `/src/assets/svg/${id}.svg`
			const raw = modules[path]
			if (!raw) { console.warn('[SVG missing]', path); return }
			try {
				const doc = new DOMParser().parseFromString(raw, 'image/svg+xml')
				const nodes = doc.querySelectorAll('[data-code][data-name]')
				Array.from(nodes).forEach(el => {
					list.push({
						code: el.getAttribute('data-code') || '',
						name: el.getAttribute('data-name') || '',
						map: id
					})
				})
			} catch (e) {
				console.error('[buildSvgCodeNameList] parse error:', path, e)
			}
		})
		return list
	}

	onMounted(() => {
		equipmentStore.svgCodeNameList = buildSvgCodeNameList()
	})
	onMounted(async () => {
		equipmentTotal.value = await getEquipmentTotal()
		let equipmentDataRaw = await getEquipmentData()
		equipmentStore.equipmentData = equipmentDataRaw
		equipmentData.value = parseMapFloor(equipmentDataRaw)
		stompClient.activate();
	});
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

	.yzInput {
		position: relative;
		left: adaptiveWidth(20);
		top: adaptiveHeight(5);
	}

	.bigscreen_lt,
	.bigscreen_lc,
	.bigscreen_lb,
	.bigscreen_rt,
	.bigscreen_rc,
	.bigscreen_rb {
		width: adaptiveWidth(200);
		height: adaptiveHeight(292);
	}

	.bigscreen_l,
	.bigscreen_r {
		position: absolute;
		z-index: 999;
		top: adaptiveHeight(91);
		width: adaptiveWidth(435);
		height: adaptiveHeight(898);
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: flex-start;
		row-gap: adaptiveHeight(15);
		column-gap: adaptiveWidth(10);
		overflow-y: auto;
		/* 关键：防止少量行时 flex 额外分配纵向空间导致行距被放大 */
		align-content: flex-start;

		/* 自定义滚动条样式（WebKit） */
		&::-webkit-scrollbar {
			width: adaptiveWidth(8);
			height: adaptiveHeight(8);
		}

		&::-webkit-scrollbar-track {
			background: rgba(255, 255, 255, 0.03);
			border-radius: adaptiveWidth(6);
		}

		&::-webkit-scrollbar-thumb {
			background: linear-gradient(180deg, rgba(88, 164, 203, 0.9), rgba(41, 128, 185, 0.9));
			border-radius: adaptiveWidth(6);
			border: adaptiveWidth(2) solid rgba(0, 0, 0, 0);
			background-clip: padding-box;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: linear-gradient(180deg, rgba(88, 164, 203, 1), rgba(30, 100, 150, 1));
		}

		/* Firefox 支持 */
		scrollbar-width: thin;
		scrollbar-color: rgba(88, 164, 203, 0.9) rgba(255, 255, 255, 0.03);
	}

	.bigscreen_r {
		right: adaptiveWidth(26);
		flex-wrap: wrap;
	}

	.bigscreen_l {
		left: adaptiveWidth(26);
		flex-wrap: wrap;
	}

	.bigscreen_lt {
		position: absolute;
		top: adaptiveHeight(91);
		left: adaptiveWidth(26);

		.bigscreen_lt_top {
			width: 100%;
			height: adaptiveHeight(40);
			background: url("/public/img/背景-上层(1).gif") no-repeat;
			background-size: 110% 110%;
			display: flex;
			align-items: center;

			.bigscreen_lt_top_l {
				display: flex;
				align-items: center;

				img {
					margin-left: adaptiveWidth(11);
				}

				span {
					font-weight: 600;
					font-size: adaptiveFontSize(16);
					text-align: center;
					font-style: normal;
					text-transform: none;
					background: linear-gradient(to bottom,
							#c7e5fd 42%,
							#3582c7 100%);
					/* 渐变背景 */
					background-clip: text;
					/* 让背景应用到文本 */
					-webkit-text-fill-color: transparent;
					/* 使文本颜色透明 */
					padding-left: adaptiveWidth(10);
				}
			}
		}

		.bigscreen_lt_bottom {
			width: 100%;
			height: adaptiveHeight(251);
			margin-top: adaptiveHeight(5);
			background: url("/public/img/背景下层.png") no-repeat;
			background-size: 100% 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.bigscreen_lt_bottomnei {
				overflow: hidden;
				height: adaptiveHeight(251);

				.bigscreen_lt_bottom_nei {
					display: flex;
					justify-content: center;
					align-items: center;

					img {
						width: adaptiveWidth(66);
						height: adaptiveHeight(60);
					}

					div {
						width: adaptiveWidth(324);
						height: adaptiveHeight(39);
						display: flex;
						align-items: center;

						&:nth-child(2) {
							margin: adaptiveHeight(18) 0;
						}

						span {
							&:nth-child(1) {
								font-size: adaptiveFontSize(12);
								color: #ffffff;
								padding: 0 adaptiveWidth(32);
							}

							&:nth-child(2) {
								font-family: youshe;
								font-size: adaptiveFontSize(20);
							}

							&:nth-child(3) {
								// font-family: youshe;
								font-size: adaptiveFontSize(12);
								margin-left: adaptiveFontSize(30);
							}
						}
					}
				}
			}
		}
	}

	.bigscreen_lc {
		position: absolute;
		top: adaptiveHeight(395);
		left: adaptiveWidth(26);
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.bigscreen_lc_top {
			width: 100%;
			height: adaptiveHeight(40);
			background: url("/public/img/背景-上层(1).gif") no-repeat;
			background-size: 110% 110%;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.bigscreen_lc_top_l {
				display: flex;
				align-items: center;

				img {
					margin-left: adaptiveWidth(11);
				}

				span {
					font-weight: 600;
					font-size: adaptiveFontSize(16);
					text-align: center;
					font-style: normal;
					text-transform: none;
					background: linear-gradient(to bottom,
							#c7e5fd 42%,
							#3582c7 100%);
					/* 渐变背景 */
					background-clip: text;
					/* 让背景应用到文本 */
					-webkit-text-fill-color: transparent;
					/* 使文本颜色透明 */
					padding-left: adaptiveWidth(10);
				}
			}
		}

		.bigscreen_lc_bottom {
			width: 100%;
			height: adaptiveHeight(251);
			margin-top: adaptiveHeight(5);
			background: url("/public/img/背景下层.png") no-repeat;
			background-size: 100% 100%;

			.bigscreen_lc_bottom_nei {
				width: adaptiveWidth(407);
				margin: 0 auto;

				.bigscreen_lc_bottom_nei_t {
					width: 100%;
					height: adaptiveHeight(30);
					margin-top: adaptiveHeight(15);
					background: url("/public/img/equipment/tabletop.png") no-repeat;
					background-size: 100% 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;

					span {
						width: 25%;
						color: #9eabb7;
						font-size: adaptiveFontSize(14);
						text-align: center;
					}
				}

				.bigscreen_lc_bottom_neib {
					width: 100%;
					height: adaptiveHeight(200);
					overflow: hidden;

					.bigscreen_lc_bottom_nei_b {
						width: 100%;
						height: adaptiveHeight(33);
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: adaptiveHeight(5);

						span {
							width: 25%;
							color: #ffffff;
							font-size: adaptiveFontSize(12);
							// 超出部分隐藏
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;

							&:nth-child(1),
							&:nth-child(2),
							&:nth-child(3),
							&:nth-child(4) {
								text-align: center;
							}
						}
					}
				}
			}
		}
	}

	.bigscreen_lb {
		position: absolute;
		bottom: adaptiveHeight(85);
		left: adaptiveWidth(26);

		.bigscreen_lb_top {
			width: 100%;
			height: adaptiveHeight(40);
			background: url("/public/img/背景-上层(1).gif") no-repeat;
			background-size: 110% 110%;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.bigscreen_lb_top_l {
				display: flex;
				align-items: center;

				img {
					margin-left: adaptiveWidth(11);
				}

				span {
					font-weight: 600;
					font-size: adaptiveFontSize(16);
					text-align: center;
					font-style: normal;
					text-transform: none;
					background: linear-gradient(to bottom,
							#c7e5fd 42%,
							#3582c7 100%);
					/* 渐变背景 */
					background-clip: text;
					/* 让背景应用到文本 */
					-webkit-text-fill-color: transparent;
					/* 使文本颜色透明 */
					padding-left: adaptiveWidth(10);
				}
			}
		}

		.bigscreen_lb_bottom {
			width: 100%;
			height: adaptiveHeight(251);
			margin-top: adaptiveHeight(5);
			background: url("/public/img/背景下层.png") no-repeat;
			background-size: 100% 100%;

			h1 {
				width: 100%;
				font-size: adaptiveFontSize(12);
				height: adaptiveHeight(12);
				color: white;
				position: relative;
				top: adaptiveHeight(12);
				margin-left: adaptiveWidth(10);
			}

			.bigscreen_lb_bottom_nei {
				width: 100%;
				height: calc(100% - adaptiveHeight(12));
			}
		}
	}

	.bigscreen_rt {
		position: absolute;
		top: adaptiveHeight(91);
		right: adaptiveWidth(26);

		.bigscreen_rt_top {
			width: 100%;
			height: adaptiveHeight(40);
			background: url("/public/img/背景-上层(1).gif") no-repeat;
			background-size: 110% 110%;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.bigscreen_rt_top_l {
				display: flex;
				align-items: center;

				img {
					margin-left: adaptiveWidth(11);
				}

				span {
					font-weight: 600;
					font-size: adaptiveFontSize(16);
					text-align: center;
					font-style: normal;
					text-transform: none;
					background: linear-gradient(to bottom,
							#c7e5fd 42%,
							#3582c7 100%);
					/* 渐变背景 */
					background-clip: text;
					/* 让背景应用到文本 */
					-webkit-text-fill-color: transparent;
					/* 使文本颜色透明 */
					padding-left: adaptiveWidth(10);
				}
			}
		}

		.bigscreen_rt_bottom {
			width: 100%;
			height: adaptiveHeight(251);
			margin-top: adaptiveHeight(5);
			background: url("/public/img/背景下层.png") no-repeat;
			background-size: 100% 100%;

			.bigscreen_rt_bottom_nei {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 100%;

				img {
					width: adaptiveWidth(126);
					height: adaptiveHeight(176);
					margin-right: adaptiveWidth(28);
				}

				.bigscreen_rt_bottom_r {
					width: adaptiveWidth(218);
					height: adaptiveHeight(167);
					// display: flex;
					// flex-direction: column;
					justify-content: space-between;
					overflow: hidden;

					// div {
					//   width: 100%;
					//   height: adaptiveHeight(41);
					//   background: url("/public/img/半透明背景1.png") no-repeat;
					//   background-size: 100% 100%;
					//   display: flex;
					//   align-items: center;
					//   justify-content: center;

					//   span {
					//     font-size: adaptiveFontSize(14);
					//     color: rgba(255, 255, 255, 1);
					//     margin-left: adaptiveFontSize(10);
					//   }
					// }
				}
			}
		}
	}

	.bigscreen_rc {
		position: absolute;
		top: adaptiveHeight(395);
		right: adaptiveWidth(26);
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.bigscreen_rc_top {
			width: 100%;
			height: adaptiveHeight(40);
			background: url("/public/img/背景-上层(1).gif") no-repeat;
			background-size: 110% 110%;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.bigscreen_rc_top_l {
				display: flex;
				align-items: center;

				img {
					margin-left: adaptiveWidth(11);
				}

				span {
					font-weight: 600;
					font-size: adaptiveFontSize(16);
					text-align: center;
					font-style: normal;
					text-transform: none;
					background: linear-gradient(to bottom,
							#c7e5fd 42%,
							#3582c7 100%);
					/* 渐变背景 */
					background-clip: text;
					/* 让背景应用到文本 */
					-webkit-text-fill-color: transparent;
					/* 使文本颜色透明 */
					padding-left: adaptiveWidth(10);
				}
			}

			.bigscreen_rc_top_r {
				margin-right: adaptiveWidth(11);
			}
		}

		.bigscreen_rc_bottom {
			width: 100%;
			height: adaptiveHeight(251);
			margin-top: adaptiveHeight(5);
			background: url("/public/img/背景下层.png") no-repeat;
			background-size: 100% 100%;

			.bigscreen_rc_bottom_nei {
				width: adaptiveWidth(407);
				margin: 0 auto;

				.bigscreen_rc_bottom_nei_t {
					width: 100%;
					height: adaptiveHeight(30);
					margin-top: adaptiveHeight(15);
					background: url("/public/img/equipment/tabletop.png") no-repeat;
					background-size: 100% 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;

					span {
						width: 33%;
						color: #9eabb7;
						font-size: adaptiveFontSize(14);
						text-align: center;
					}
				}

				.bigscreen_rc_bottom_b {
					width: 100%;
					height: adaptiveHeight(200);
					overflow: hidden;

					.bigscreen_rc_bottom_nei_b {
						width: 100%;
						height: adaptiveHeight(33);
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: adaptiveHeight(5);
						cursor: pointer;

						span {
							width: 33%;
							color: #ffffff;
							font-size: adaptiveFontSize(12);
							text-align: center;
						}
					}

					.bigscreen_rc_bottom_nei_active {
						width: 100%;
						height: adaptiveHeight(33);
						background: url("/public/img/equipment/tableactive.png") no-repeat;
						background-size: 100% 100%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: adaptiveHeight(5);
						cursor: pointer;

						span {
							width: 33%;
							color: #58a4cb;
							font-size: adaptiveFontSize(12);
							text-align: center;
							position: relative;

							&:nth-child(1) {
								img {
									position: absolute;
									width: adaptiveWidth(18);
									height: adaptiveHeight(17);
									left: adaptiveWidth(25);
								}
							}
						}
					}
				}
			}
		}
	}

	.bigscreen_rb {
		position: absolute;
		bottom: adaptiveHeight(85);
		right: adaptiveWidth(26);

		.bigscreen_rb_top {
			width: 100%;
			height: adaptiveHeight(40);
			background: url("/public/img/背景-上层(1).gif") no-repeat;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-size: 110% 110%;

			.bigscreen_rb_top_l {
				display: flex;
				align-items: center;
				width: 100%;

				img {
					margin-left: adaptiveWidth(11);
				}

				span {
					font-weight: 600;
					font-size: adaptiveFontSize(16);
					// text-align: center;
					font-style: normal;
					text-transform: none;
					background: linear-gradient(to bottom,
							#c7e5fd 42%,
							#3582c7 100%);
					/* 渐变背景 */
					background-clip: text;
					/* 让背景应用到文本 */
					-webkit-text-fill-color: transparent;
					/* 使文本颜色透明 */
					padding-left: adaptiveWidth(10);
					width: adaptiveWidth(100);
					box-sizing: border-box;
				}
			}

			.bigscreen_rb_top_r {
				display: flex;
				align-items: center;
				margin-right: adaptiveWidth(11);
			}
		}

		.bigscreen_rb_bottom {
			width: 100%;
			height: adaptiveHeight(251);
			margin-top: adaptiveHeight(5);
			background: url("/public/img/背景下层.png") no-repeat;
			background-size: 100% 100%;
			display: flex;
			align-items: center;
			justify-content: center;

			img {
				width: adaptiveWidth(99);
				height: adaptiveHeight(211);
			}

			.bigscreen_rb_bottom_r {
				width: adaptiveWidth(290);
				height: adaptiveHeight(211);
				margin-left: adaptiveWidth(15);
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;

				.bigscreen_rb_bottom_r_t {
					width: 100%;
					height: adaptiveHeight(30);
					background: url("/public/img/equipment/tabletop.png") no-repeat;
					background-size: 100% 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;

					span {
						width: 33%;
						color: #9eabb7;
						font-size: adaptiveFontSize(14);
						text-align: center;
					}
				}

				.bigscreen_rb_bottom_r_b {
					width: 100%;
					height: adaptiveHeight(171);
					overflow: hidden;
				}

				.bigscreen_rb_bottom_r_nei {
					width: 100%;
					height: adaptiveHeight(35);
					background: rgba(4, 30, 62);
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: adaptiveHeight(10);
					cursor: pointer;

					.bigscreen_rb_bottom_r_neis {
						width: 33%;

						&:nth-child(1) {
							color: #ffffff;
							font-size: adaptiveFontSize(12);
							display: flex;
							align-items: center;
						}

						&:nth-child(2),
						&:nth-child(3) {
							text-align: center;
						}
					}
				}
			}
		}
	}

	.rcDialog {
		width: adaptiveWidth(440);
		height: adaptiveHeight(280);
		background: url("/public/img/弹窗背景.png") no-repeat;
		background-size: 100% 100%;
		position: absolute;
		top: adaptiveHeight(400);
		right: adaptiveWidth(480);
		z-index: 10;

		.rcDialog_top {
			width: 100%;
			height: adaptiveHeight(45);
			display: flex;
			align-items: center;
			justify-content: space-between;

			span {
				font-family: youshe;
				font-size: adaptiveFontSize(20);
				color: #ffffff;
				padding-left: adaptiveWidth(15);
			}

			img {
				width: adaptiveWidth(8);
				height: adaptiveHeight(8);
				padding-right: adaptiveWidth(10);
				cursor: pointer;
			}
		}

		.rcDialog_bottom {
			width: adaptiveWidth(420);
			height: adaptiveHeight(200);
			margin: adaptiveHeight(10) auto;

			img {
				width: adaptiveWidth(99);
				height: adaptiveHeight(99);
			}

			.rcDialog_bottoml {
				height: adaptiveHeight(200);
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				div {
					margin-left: adaptiveWidth(20);

					&:nth-child(1) {
						margin-top: 0;
					}

					span {
						font-size: adaptiveFontSize(14);

						&:nth-child(1) {
							color: #687f92;
						}

						&:nth-child(2) {
							color: #ffffff;
						}
					}
				}
			}
		}
	}

	.rtDialog {
		width: adaptiveWidth(440);
		height: adaptiveHeight(280);
		background: url("/public/img/弹窗背景.png") no-repeat;
		background-size: 100% 100%;
		position: absolute;
		top: adaptiveHeight(100);
		right: adaptiveWidth(480);
		z-index: 10;

		.rtDialog_top {
			width: 100%;
			height: adaptiveHeight(45);
			display: flex;
			align-items: center;
			justify-content: space-between;

			span {
				font-size: adaptiveFontSize(20);
				color: #ffffff;
				padding-left: adaptiveWidth(15);
				font-family: youshe;
			}

			img {
				width: adaptiveWidth(8);
				height: adaptiveHeight(8);
				padding-right: adaptiveWidth(10);
				cursor: pointer;
			}
		}

		.rtDialog_bottom {
			width: adaptiveWidth(420);
			height: adaptiveHeight(215);
			margin-left: adaptiveWidth(10);
			display: flex;
			flex-direction: column;
			// align-items: center;
			justify-content: center;

			.rtDialog_bottom_video {
				:deep(#container) {
					width: adaptiveWidth(420);
					height: adaptiveHeight(215);
					object-fit: cover;
				}

				object-fit: cover;
			}

			// :deep(.rtDialog_bottom_video) {
			//   #container[data-v-39551662] {
			//     width: adaptiveWidth(420);
			//     height: adaptiveHeight(215);
			//     object-fit: cover;
			//   }
			//   object-fit: cover;
			// }
			img {
				width: 100%;
				height: adaptiveHeight(195);
			}

			div {
				font-size: adaptiveFontSize(14);
				color: #ffffff;
			}
		}
	}

	.rbDialog {
		width: adaptiveWidth(440);
		height: adaptiveHeight(280);
		background: url("/public/img/弹窗背景.png") no-repeat;
		background-size: 100% 100%;
		position: absolute;
		bottom: adaptiveHeight(90);
		right: adaptiveWidth(480);
		z-index: 10;

		.rbDialog_top {
			width: 100%;
			height: adaptiveHeight(45);
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;

			span {
				font-family: youshe;
				font-size: adaptiveFontSize(20);
				color: #ffffff;
				padding-left: adaptiveWidth(15);
			}

			img {
				width: adaptiveWidth(8);
				height: adaptiveHeight(8);
				padding-right: adaptiveWidth(10);
				cursor: pointer;
			}
		}

		.rbDialog_bottom {
			width: adaptiveWidth(420);
			height: adaptiveHeight(200);
			margin: adaptiveHeight(10) auto;

			img {
				width: adaptiveWidth(99);
				height: adaptiveHeight(99);
			}

			.rbDialog_bottoml {
				height: adaptiveHeight(200);
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				div {
					margin-left: adaptiveWidth(20);

					&:nth-child(1) {
						margin-top: 0;
					}

					span {
						font-size: adaptiveFontSize(14);

						&:nth-child(1) {
							color: #687f92;
						}

						&:nth-child(2) {
							color: #ffffff;
						}
					}
				}
			}
		}
	}

	.rctDialog {
		width: adaptiveWidth(440);
		height: adaptiveHeight(280);
		background: url("/public/img/弹窗背景.png") no-repeat;
		background-size: 100% 100%;
		position: absolute;
		top: adaptiveHeight(400);
		right: adaptiveWidth(480);
		z-index: 10;

		.rctDialog_top {
			width: 100%;
			height: adaptiveHeight(45);
			display: flex;
			align-items: center;
			justify-content: space-between;

			span {
				font-family: youshe;
				font-size: adaptiveFontSize(20);
				color: #ffffff;
				padding-left: adaptiveWidth(15);
			}

			img {
				width: adaptiveWidth(8);
				height: adaptiveHeight(8);
				padding-right: adaptiveWidth(10);
				cursor: pointer;
			}
		}

		.rctDialog_bottom {
			width: adaptiveWidth(420);
			height: adaptiveHeight(200);
			margin: adaptiveHeight(10) auto;
		}
	}

	:deep(.cascaderCss) {
		width: adaptiveWidth(200);
		height: adaptiveHeight(24);
		margin-right: adaptiveWidth(11);

		.el-input__wrapper {
			background: none;
			height: adaptiveHeight(24);
			box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
		}
	}

	:deep(.selectcss) {
		.el-select__wrapper {
			--el-border-color: white;
			background-color: transparent !important;
			// box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
		}

		.el-select__placeholder {
			color: rgba(255, 255, 255, 0.6) !important;
		}

		.el-select__selected-item {
			// color: rgba(255, 255, 255, 0.6) !important;
			color: white !important;
		}
	}

	.inputcss {
		width: adaptiveWidth(148);
		height: adaptiveHeight(24);
		margin-right: adaptiveWidth(11);
		--el-input-bg-color: rgba(255, 255, 255, 0);

		--el-text-color-placeholder: white;
		--el-input-text-color: white;

		:deep(.is-focus) {
			// --el-input-focus-border-color: blue;
		}

		:deep(input) {
			caret-color: white;
		}
	}

	.inputcss :deep(.el-input__wrapper) {
		// background-color: rgba(255, 255, 255, 0);
		// border: 1px solid rgba(255, 255, 255, 0.2);
		// box-shadow: none;
		font-size: adaptiveFontSize(12);
	}

	.scroll {
		height: adaptiveHeight(195);
		width: 100%;
		overflow: hidden;
	}

	.yzRadio {
		position: relative;
		top: adaptiveHeight(5);
	}

	.group :deep(.el-radio-button.is-active .el-radio-button__original-radio:not(:disabled) + .el-radio-button__inner) {
		background: rgba(255, 255, 255, 0.8);
		color: rgba(7, 36, 57, 1);
		border-color: rgba(255, 255, 255, 0);
		font-size: adaptiveFontSize(12);
	}

	.group :deep(.el-radio-button .el-radio-button__inner) {
		padding: 2px 8px;
		background: rgba(255, 255, 255, 0);
		border-color: rgba(255, 255, 255, 0);
		font-size: adaptiveFontSize(12);
		border-radius: 2px;
	}

	.single-line-ellipsis {
		max-width: adaptiveWidth(100);
		white-space: nowrap;
		/* 不换行 */
		overflow: hidden;
		/* 溢出隐藏 */
		text-overflow: ellipsis;
		/* 超出部分显示省略号 */
	}


	.rb_dialog {
		width: adaptiveWidth(440);
		height: adaptiveHeight(270);
		position: absolute;
		top: 0;
		left: - adaptiveWidth(450);
		background: url("/public/img/弹窗背景.png") no-repeat;
		background-size: 100% 100%;
	}

	.rb_dialog_top {
		width: 100%;
		height: adaptiveHeight(45);
		display: flex;
		align-items: center;
		justify-content: space-between;

		.rb_dialog_top_x {
			position: absolute;
			right: adaptiveWidth(7);
		}

		span {
			font-family: youshe;
			font-size: adaptiveFontSize(20);
			color: #ffffff;
			padding-left: adaptiveWidth(15);
		}
	}

	.rb_dialog_bottom {
		height: adaptiveHeight(225);
	}

	.rb_dialog_bottom_echart {
		width: adaptiveWidth(450);
		height: adaptiveHeight(215);
	}

	.pickerCss {

		width: adaptiveWidth(155);
		height: adaptiveHeight(18);
		border: 1px solid rgba(227, 233, 243, 0.2);
		border-radius: 5px;
		margin-right: adaptiveWidth(11);
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		top: adaptiveWidth(6);
		left: - adaptiveWidth(20);
		box-sizing: border-box;

		span {
			color: #ffffff;
			font-size: adaptiveFontSize(10);
			font-family: unset !important;
			font-weight: 100 !important;
		}
	}

	.bigscreen_rb_top_l_rg {
		margin-left: auto;
		margin-right: adaptiveWidth(12);
	}

	.selectcss {
		--el-border-color: white;
		width: adaptiveWidth(155);
		margin-right: adaptiveWidth(11);
	}


	.video_item {
		width: adaptiveWidth(200);
		height: adaptiveHeight(41);
		background: url("/public/img/半透明背景1.png") no-repeat;
		background-size: 100% 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		margin-bottom: adaptiveHeight(10);

		span {
			font-size: adaptiveFontSize(14);
			color: rgba(255, 255, 255, 1);
			margin-left: adaptiveFontSize(10);
			/* 不换行 */
			overflow: hidden;
			/* 超出隐藏 */
			text-overflow: ellipsis;
			/* 超出显示省略号 */
			width: adaptiveWidth(100);
			white-space: nowrap;
		}
	}
</style>
