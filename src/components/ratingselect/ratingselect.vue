<template>
	<div class="ratingselect">
		<div class="rating-type">
			<span class="block positive" :class="{'active': selectType===2}">{{desc.all}}<span class="count">47</span></span>
			<span class="block positive" :class="{'active': selectType===0}">{{desc.positive}}<span class="count">40</span></span>
			<span class="block negative" :class="{'active': selectType===1}">{{desc.negative}}<span class="count">7</span></span>
		</div>
		<div class="switch">
			<span class="iconfont icon-duigou"></span>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	/* eslint-disable no-unused-vars */
	const POSITIVE = 0;
	const NEGATIVE = 1;
	
	const ALL = 2;
	
	export default {
		props: {
			ratings: {
				type: Array,
				default() {
					return [];
				}
			},
			selectType: {
				type: Number,
				default: ALL
			},
			desc: {
				type: Object,
				default() {
					return {
						all: '全部',
						positive: '满意',
						negative: '不满意'
					};
				}
			},
			onlyContent: {
				type: Boolean,
				default: false
			}
		}
	};
</script>

<style lang="sass" rel="stylesheet/sass">
	@import '../../common/styles/mixin.scss';
	
	.ratingselect
		.rating-type
			padding: 18px 0
			margin: 0 18px
			@include border-1px(rgba(7, 17, 27, 0.1))
			font-size: 0
			.block
				display: inline-block
				padding: 8px 12px
				line-height: 16px
				margin-right: 8px
				border-radius: 1px
				font-size: 16px
				color: rgb(77, 85, 93)
				&.active
					color: #fff
				.count
					margin-left: 2px
					font-size: 8px
				&.positive
					background: rgba(0, 160, 220, 0.2)
					&.active
						background: rgb(0, 160, 220)
				&.negative
					background: rgba(77, 85, 93, 0.2)
					&.active
						background: rgb(77, 85, 93)
					
</style>