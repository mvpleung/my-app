<template>
	<div class="page-swipe">
		<mt-swipe @change="handleChange" :class="{'swipe-title': swipeTitle}"
			:speed="speed"
			:auto="auto"
			:defaultIndex="defaultIndex"
			:continuous="continuous"
			:showIndicators="showIndicators">
			<mt-swipe-item v-for="(item, index) in bannarData" :key="index">
				<div class="slide" @click="$emit('item-click', item, index)">
					<img :src="item[imgKey]"/>
					<div class="title" v-if="!$utils.isEmpty(item[titleKey])">{{ item[titleKey] }}</div>
				</div>
			</mt-swipe-item>
		</mt-swipe>
	</div>
</template>
<script type="text/javascript">
	export default {
		name: 'swipe',
		props: {
			bannarData: Array,
			imgKey: {
				type: String,
				default: 'imgUrl'
			},
			titleKey: {
				type: String,
				default: 'title'
			},
			speed: { //动画持时（毫秒）
				type: Number,
				default: 300
			},
			auto: { //自动播放的时间间隔（毫秒），为 0 时，禁止自动播放
				type: Number,
				default: 3000
			},
			defaultIndex: { //初始显示的轮播图的索引
				type: Number,
				default: 0
			},
			continuous: { //是否可以循环播放
				type: Boolean,
				default: true
			},
			showIndicators: { //是否显示 indicators
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				index: 0
			}
		},
		computed: {
			swipeTitle() {
				return !this.$utils.isEmpty((this.bannarData[this.index] || {}).title);
			}
		},
		methods: {
			/**
			 * 切换监听
			 */
			handleChange(index) {
				this.index = index;
				this.$emit('change', index, this.bannarData[index]);
			}
		}
	}
</script>
<style lang="scss">
.page-swipe {
	.mint-swipe {
		width: 100%;
		height: 141px;
		color: #fff;
		font-size: 30px;
		text-align: center;
	}
	.swipe-title {
		.mint-swipe-indicators {
			text-align: right;
			right: 0;
			left: auto;
			bottom: 0;
			line-height: 1.2;
		}
	}
	
	.slide {
		// background-color: red;
		position: relative;
	}
	.slide img {
		width: 100%;
		height: 141px;
	}
	.slide .title {
		width: 100%;
		position: absolute;
		bottom: 0;
		background-color: gray;
		opacity: 0.6;
		font-size: 13px;
		text-align: left;
		line-height: 1.5;
		padding-left: 10px;
		height: 25px;
	}
}
</style>