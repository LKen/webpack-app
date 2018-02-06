<template>
	<div class="ratingselect">
		<div class="rating-type">
			<span>{{desc.all}}</span>
			<span>{{desc.positive}}</span>
			<span>{{desc.negative}}</span>
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
	
</style>