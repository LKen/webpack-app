<template>
	<div class="ratingselect">
		<div class="rating-type">
			<span class="block positive" 
				:class="{'active': d_selectType === 2}" 
				@click.stop="select(2, $event)"
				>{{desc.all}}<span class="count">{{ratings.length}}</span></span>
			<span class="block positive" 
				:class="{'active': d_selectType === 0}" 
				@click.stop="select(0, $event)"
				>{{desc.positive}}<span class="count">{{positives.length}}</span></span>
			<span class="block negative" 
				:class="{'active': d_selectType === 1}" 
				@click.stop="select(1, $event)"
				>{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
		</div>
		<div class="switch" :class="{on: d_onlyContent}" @click="toggleContent($event)">
			<span class="iconfont icon-duigou"></span>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
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
		},
		data() {
			/**********************************/
			/* 发现了一个问题， key的命名：  _ + xxx 是会导致一些问题*/
			/**********************************/
			return {
				d_selectType: this.selectType,
				d_onlyContent: this.onlyContent
			};
		},
		methods: {
			select(type, event) {
				if (!event._constructed) {
					return false;
				}
				this.d_selectType = type;
				this.$emit('ratingtype_select', type);
			},
			toggleContent(event) {
				if (!event._constructed) {
					return false;
				}
				this.d_onlyContent = !this.d_onlyContent;
				this.$emit('content_toggle', this.d_onlyContent);
			},
			setSelectType(value) {
				this.d_selectType = value;
			},
			setFlag(type) {
				this.d_selectType = type;
				this.$emit('ratingtype_select', type);
			},
			setContent(value) {
				this.d_onlyContent = value;
				this.$emit('content_toggle', value);
			}
		},
		computed: {
			positives: {
				get() {
					return this.ratings.filter((rating) => {
						return rating.rateType === POSITIVE;
					});
				},
				set(newValue) {}
			},
			negatives: {
				get() {
					return this.ratings.filter((rating) => {
						return rating.rateType === NEGATIVE;
					});
				},
				set(newValue) {}
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
		.switch
			padding: 12px 18px
			line-height: 24px
			border-bottom: 1px solid rgba(7, 17, 27, .1)
			color: rgb(147, 153, 159)
			font-size: 0
			&.on
				.icon-duigou
					color: #00c850
			.icon-duigou
				display: inline-block
				vertical-align: top
				margin-right: 4px
				font-size: 16px
			.text
				font-size: 12px
				vertical-align: top
				display: inline-block
</style>