<template>
	<div :class="direction === 'left' ? 'bigscreen_l_box' : 'bigscreen_r_box'">
		<div class="equipment-name">{{ data.equipmentName }}</div>
			<div class="equipment-code">{{ data.equipmentCode }}</div>
		    <div class="equipment-area">{{ data.installationLocation }}</div>

		<div v-for="threshold in data.thresholdList" class="equipment-threshold">
			<div class="sensorName">{{ threshold.sensorName }}</div>
			<div class="value">{{ threshold?.value || 0 }} {{ threshold.unit }}</div>

		</div>

	</div>

</template>
<script lang='ts' setup>
	// 接收英文名的方向参数：direction（字符串，必填）
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
		width: adaptiveWidth(160);
		background: url("/public/img/背景下层.png") no-repeat;
		background-size: 100% 100%;
		// flex: 0 0 adaptiveHeight(135);

		display: flex;
		flex-direction: column;
		padding: 10px;
		color: #FFF;

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

			.sensorName {}
		}
	}

</style>