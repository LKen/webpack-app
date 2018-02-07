<template>
	<transition name="slideInRight">
		<div class="food" v-show="showFlag" ref="food">
			<div class="food-content">
				<div class="image-header">
					<img :src="food.image" alt="the big head picture" />
					<div class="back" @click="hide">
						<i class="iconfont icon-fanhui"></i>
					</div>
				</div>
				<div class="content">
					<h1 class="title">{{food.name}}</h1>
					<div class="detail">
						<span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}</span>
					</div>
					<div class="price">
						<span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
					</div>
					<div class="cartcontrol-wrapper">
						<cartcontrol :food="food" @cartAdd="_drop($event)"></cartcontrol>
					</div>
					<transition name="fadeOut">
						<div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst($event)" >购物车</div>
					</transition>
				</div>
				<split v-show="food.info"></split>
			
				<div class="info" v-show="food.info">
					<h1 class="title">商品信息</h1>
					<p class="text">{{food.info}}</p>
				</div>
				<split></split>
				<div class="rating">
					<h1 class="title">商品评价</h1>
					<ratingselect 
						:select-type="selectType" 
						:only-content="onlyContent" 
						:desc="desc" 
						:ratings="food.ratings"></ratingselect>
				</div>
			</div>
			
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import cartcontrol from '@/components/cartcontrol/cartcontrol';
	import split from '@/components/split/split';
	import ratingselect from '@/components/ratingselect/ratingselect';
	import BScroll from 'better-scroll';
	
	/* eslint-disable no-unused-vars */
	const POSITIVE = 0;
	const NEGATIVE = 1;
	
	const ALL = 2;
	
	export default {
		props: {
			food: {
				type: Object
			}
		},
		data() {
			return {
				showFlag: false,
				selectType: ALL,
				onlyContent: true,
				desc: {
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			};
		},
		methods: {
			show() {
				this.showFlag = true;
				this.selectType = ALL;
				this.onlyContent = true;
				
				this.$nextTick(() => {
					if (!this.scroll) {
						console.log(this.$refs.food);
						this.scroll = new BScroll(this.$refs.food, {
							click: true
						});
					} else {
						this.scroll.refresh();
					}
				});
			},
			hide() {
				this.showFlag = false;
			},
			addFirst(event) {
				if(!event._constructed) {
					return false;
				}
				this._drop(event.target);
				this.$set(this.food, 'count', 1);
			},
			_drop(target) {
				this.$emit('cartAdd', target);
			}
		},
		components: {
			cartcontrol,
			split,
			ratingselect
		}
	};
</script>

<style lang="sass" rel="stylesheet/sass">
	.food
		position: fixed
		left: 0 
		top: 0
		right: 0
		bottom: 48px
		z-index: 30
		width: 100%
		background: #fff
		&.slideInRight-enter-active,
		&.slideInRight-leave-active
			transition: all 0.3s;
		&.slideInRight-enter,
		&.slideInRight-leave-to
			transform: translate3d(100% , 0, 0)
		&.slideInRight-enter-to,
		&.slideInRight-leave
			transform: translate3d(0 , 0, 0)
		& > .food-content
			position: relative
		.image-header
			position: relative
			width: 100%
			height: 0
			padding-top: 100% /*定义基于父对象总高度的百分比上外边距  巧用margin/padding的百分比值实现高度自适应*/
			img
				position: absolute
				top: 0
				left: 0
				width: 100%
				height: 100%
			.back
				position: absolute
				top: 0
				left: 0
				.icon-fanhui
					display: block
					padding: 10px
					font-size: 20px
					color: #fff					
		.content
			position: relative
			padding: 18px
			.title
				line-height: 14px	
				margin-bottom: 8px
				font-size: 14px
				font-weight: 700
				color: rgb(7, 17, 27)
			.detail
				margin-bottom: 18px
				line-height: 10px
				font-size: 0
				.sell-count, .rating
					font-size: 10px
					color: rgb(147, 153, 159)
				.sell-count
					margin-right: 12px
			.price
				font-weight: 700
				line-height: 24px
				.now
					margin-right: 8px
					font-size: 14px
					color: rgb(240, 20,20)
				.old
					text-decoration: line-through
					font-size: 10px
					color: rgb(147, 153, 159)
			.cartcontrol-wrapper
				position: absolute
				right: 12px
				bottom: 12px
			.buy
				position: absolute
				right: 18px
				bottom: 18px
				z-index: 10
				height: 24px
				line-height: 24px
				padding: 0 12px
				box-sizing: border-box
				border-radius: 12px
				font-size: 10px
				color: #fff
				background: rgb(0, 160, 220)
				&.fadeOut-enter-active,
				&.fadeOut-leave-active
					transition: all 0.2s;
				&.fadeOut-enter,
				&.fadeOut-leave-to
					opacity: 0
				&.fadeOut-enter-to,
				&.fadeOut-leave
					opacity: 1
		.info
			padding: 14px
			.title
				line-height: 14px			
				margin-bottom: 6px
				font-size: 14px
				color: rgb(7,17, 27)
			.text
				line-height: 24px
				padding: 0 8px
				font-size: 12px
				color: rgb(77, 85, 93)
		.rating
			padding-top: 18px
			.title
				line-height: 14px
				margin-left: 18px
				font-size: 14px
				color: rgb(7, 17, 27)
				
</style>