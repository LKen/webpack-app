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
						:ratings="food.ratings" 
						@ratingtype_select="_ratingtypeSelect($event)" 
						@content_toggle="_contentToggle($event)" 
						ref="ratingselect" 
						></ratingselect>
					<div class="rating-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li class="rating-item" v-for="(rating, index) in food.ratings" 
								:key="index" 
								v-show="needShow(rating.rateType, rating.text)"
								>
								<div class="user">
									<span class="name">{{rating.username}}</span>
									<img src="" alt="" class="avatar" width="12px" height="12px" :src="rating.avatar" />
								</div>
								<div class="time">{{rating.rateTime}}</div>
								<p class="text">
									<span class="iconfont icon-custom-praise" :class="{'reverse': rating.rateType === 1}"></span>{{rating.text}}
								</p>
							</li>
						</ul>
						<div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
					</div>
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
	import {formatDate} from '@/common/js/date';
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
			/**
			 * 由父组件调用
			 */
			show() {
				this.showFlag = true;
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.food, {
							click: true
						});
					} else {
						this.scroll.refresh();
					}
				});
				
				var ratingselect = this.$refs.ratingselect;
				ratingselect.setSelectType(ALL);
				ratingselect.setContent(false);
				
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
			},
			_ratingtypeSelect(type) {
				this.selectType = type;
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.food, {
							click: true
						});
					} else {
						this.scroll.refresh();
					}
				});
			},
			_contentToggle(bool) {
				this.onlyContent = bool;
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.food, {
							click: true
						});
					} else {
						this.scroll.refresh();
					}
				});
			},
			needShow(type, text) {
				if (this.onlyContent && !text) {
					return false;
				} else if (this.selectType === ALL) {
					return true;
				} else {
					return type === this.selectType;
				}
			}
		},
		filters: {
			formatDate(time) {
				let date = new Date(time);
				console.log(formatDate);
				return formatDate(date, 'yyy-MM-dd hh:mm'); //yyyy-MM-dd hh:mm:ss
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
	@import '../../common/styles/mixin.scss';
	
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
			.rating-wrapper
				padding: 0 18px
				.rating-item
					position: relative
					padding: 16px 0
					@include border-1px(rgba(7, 17, 27, 0.1))
					.user
						position: absolute
						right: 0
						top: 16px
						line-height: 12px
						font-size: 0
						.name
							display: inline-block
							margin-right: 6px
							vertical-align: top
							font-size: 10px
							color: rgb(147, 153, 159)
						.avatar
							border-radius: 50%
					.time
						margin-bottom: 6px
						line-height: 12px
						font-size: 10px
						color: rgb(147, 153, 159)
					.text
						line-height: 16px
						font-size: 12px
						color: rgb(7, 17, 27)
						.icon-custom-praise
							display: inline-block
							margin-right: 4px
							line-height: 16px
							font-size: 12px
							color: rgb(0, 160, 220)
							&.reverse
								transform: scaleY(-1)
								color: rgb(147, 153, 159)
				.no-rating		
					padding: 16px
					font-size: 12px
					color: rgb(147, 153, 159)
</style>