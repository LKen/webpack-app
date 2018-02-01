<template>
	<div class="shopcart">
		<div class="content" @click="toggleList($event)">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class="{highLight: totalCount > 0}">
						<i class="iconfont icon-gouwuche"></i>
					</div>
					<div class="num" v-show="totalCount>0">{{totalCount}}</div>
				</div>
				<div class="price" :class="{highLight: totalPrice > 0}">￥{{totalPrice}}</div>
				<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
			</div>
			<div class="content-right" @click.stop="pay">
				<div class="pay" :class="payClass">
					{{payDesc}}
				</div>
			</div>
		</div>
		<!-- 这里不能用transition-group 虽然效果用v-for渲染出来，但是小球的动画效果是单独一个一个触发的,并不是整体列表动画 -->
		<div class="ball-container">
			<div class="ball-wrapper transition-hook" v-for="(ball, index) in balls" :key="index" v-bind:css="false" :data-id="index">
				<transition name="drop"
						@before-enter="beforeDrop" 
						@enter="dropping" 
						@after-enter="dropped" 
						>
					<div class="ball" v-show="ball.show">
						<div class="inner inner-hook"></div>
					</div>
				</transition>
			</div>
		</div>
		<transition 
			name="fold" 
			>
			<div class="shopcart-list" v-show="listShow">
				<div class="list-header">
					<h1 class="title">购物车</h1>
					<span class="empty" @click="empty">清空</span>
				</div>
				<div class="list-content" ref="listContent">
					<ul>
						<li class="food" v-for="food in selectFoods" :key="food.id">
							<span class="name">{{food.name}}</span>
							<div class="price">
								<span>￥{{food.price * food.count}}</span>
							</div>
							<div class="cartcontrol-wrapper">
								<cartcontrol :food="food"></cartcontrol>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
		<transition name="fade">
			<div class="list-mask" v-show="listShow" @click="hideList"></div>
		</transition>
	</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll';
	import cartcontrol from '@/components/cartcontrol/cartcontrol';
	
	export default {
		props: {
			deliveryPrice: { // 配送费
				type: Number
				// default: 0
			},
			minPrice: { // 起送费
				type: Number
				// default: 0
			},
			// 购物车清单
			selectFoods: {
				type: Array,
				default() {
					return [];
				}
			}
		},
		data() {
			return {
				balls: [
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					}
				],
				dropBalls: [], // 关联被触发下落的小球
				fold: true
			};
		},
		computed: {
			totalPrice() {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.price * food.count;
				});
				return total;
			},
			totalCount() {
				let count = 0;
				this.selectFoods.forEach((food) => {
					count += food.count;
				});
				return count;
			},
			payDesc() {
				if (this.totalPrice === 0) {
					return `￥${this.minPrice}元起送`;
				} else if (this.totalPrice < this.minPrice) {
					let diff = this.minPrice - this.totalPrice;
					return `还差￥${diff}元起送`;
				} else {
					return '去结算';
				}
			},
			payClass() {
				if (this.totalPrice < this.minPrice) {
					return 'not-enough';
				} else {
					return 'enough';
				}
			},
			listShow() {
				if (!this.totalCount) {
					this.fold = true;
					return false;
				}
				let show = !this.fold;
				if (show) {
					if (!this.scroll) {
						this.$nextTick(() => {
							this.scroll = new BScroll(this.$refs.listContent, {
								click: true
							});
						});
					} else {
						/**
						 * 这个插件有毒， 在页面上升的时候处于动态， 这时候获取元素更新滚动是没效果的，一定要停下来再获取
						 * 优化再次点击木有滚动效果
						 */
						this.$nextTick(() => {
							this.scroll.refresh();
						});
					}
				}
				
				return show;
			}
		},
		methods: {
			drop(el) {
				for (let i=0; i<this.balls.length; i++) {
					let ball = this.balls[i];
					if (!ball.show) {
						ball.show = true;
						ball.el = el;
						this.dropBalls.push(ball);
						return;
					}
				}
			},
			beforeDrop (el) {
				let count = this.balls.length;
				while (count--) {
					let ball = this.balls[count];
					if (ball.show) {
						let rect = ball.el.getBoundingClientRect();
						let left = rect.left - 32,
							top = -(window.innerHeight - rect.top - 22);
						el.style.display = '';
                        el.style.webkitTransform = `translate3d(0,${top}px,0)`;
                        el.style.transform = `translate3d(0,${top}px,0)`;
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = `translate3d(${left}px,0,0)`;
                        inner.style.transform = `translate3d(${left}px,0,0)`;
					}
				}
			},
			/**
			 * @param {DOMElement} 执行动画的节点
			 * @param {fn} done 当仅使用 JavaScript 式过渡的时候， 在 enter 和 leave 钩子函数中，必须有 done 回调函数。否则，这两个钩子函数会被同步调用，过渡会立即完成。
			 */
			dropping (el, done) {
				/* eslint-disable no-unused-vars */
				let rf = el.offsetHeight; // 强制重绘
				this.$nextTick(() => {
					el.style.webkitTransform = 'translate3d(0, 0, 0)';
					el.style.transform = 'translate3d(0, 0, 0)';
					let inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webkitTransform = 'translate3d(0, 0, 0)';
					inner.style.transform = 'translate3d(0, 0, 0)';
					el.addEventListener('transitionend', done);
				});
			},
			dropped (el) {
				let ball = this.dropBalls.shift();
				if (ball) {
					ball.show = false;
					el.style.display = 'none';
				}
			},
			toggleList(event) {
				if(!this.totalCount) return;
				this.fold = !this.fold;
			},
			empty() {
				this.selectFoods.forEach((food) => {
					food.count = 0;
				});
			},
			hideList() {
				this.fold = true;
			},
			pay() {
				if (this.totalPrice < this.minPrice) {
					return;
				}
				window.alert('商城开发暂且到这里');
			}
		},
		components: {
			cartcontrol
		}
	};
</script>

<style lang="sass" rel="stylesheet/sass">
	@import '../../common/styles/mixin.scss';

	.shopcart
		position: fixed
		left: 0
		bottom: 0
		z-index: 50 /* 注意层级 */
		width: 100%
		height: 48px
		.content
			display: flex
			background: #141d27
			font-size: 0
			color: rgba(255, 255, 255, .4)
			.content-left
				flex: 1
				.logo-wrapper
					display: inline-block
					position: relative
					top: -10px
					margin: 0 12px
					padding: 6px
					width: 56px
					height: 56px
					box-sizing: border-box
					vertical-align: top
					border-radius: 50%
					background: #141d27
					.logo
						width: 100%
						height: 100%
						border-radius: 50%
						text-align: center
						background: #2b343c
						&.highLight
							background: rgb(0 , 160, 220)
							.icon-gouwuche
								color: #fff
						.icon-gouwuche
							line-height: 44px
							font-size: 24px
							color: #80858a
				.num
					position: absolute
					top: 0
					right: 0
					width: 24px
					height: 16px
					line-height: 16px
					text-align: center
					border-radius: 16px
					font-size: 9px
					font-weight: 700
					color: #fff
					background: rgb(240, 20, 20)
					box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4)
				.price
					display: inline-block	
					vertical-align: top				
					margin-top: 12px
					line-height: 24px
					padding-right: 12px
					box-sizing: border-box
					border-right: 1px solid rgba(255, 255, 255, .1)
					font-size: 16px
					font-weight: 700
					&.highLight
						color: #fff
				.desc
					display: inline-block
					vertical-align: top
					margin: 12px 0 0 12px
					line-height: 24px
					font-size: 10px
			.content-right
				flex: 0 0 105px
				width: 105px
				.pay
					height: 48px
					line-height: 48px
					text-align: center
					font-size: 12px
					font-weight: 700
					&.not-enough
						background: #2b333b
					&.enough
						background: #00b34c
						color: #fff
		.ball
			position: fixed /*相对于视野窗口*/
			left: 32px
			bottom: 22px
			z-index: 200
			transition: all .4s cubic-bezier(.63,.01,.81,.54) /*贝塞尔曲线*/
			.inner
				/* display: inline-block */
				width: 16px
				height: 16px
				border-radius: 50%
				background: rgb(0, 160, 200)
				transition: all .4s linear
		.shopcart-list
			position: absolute
			left: 0
			top: 0
			z-index: -1
			width: 100%
			transform: translate3d(0, -100%, 0)
			/*animate.css 里面的动画也未必适用， 那些只是固定某些动画，详细还需要进去源码看看到底怎么运行*/
			&.fold-enter-active, 
			&.fold-leave-active 
				transition: all .5s
			&.fold-enter,
			&.fold-leave-to
				transform: translate3d(0, 0, 0)
			.list-header
				height: 40px
				line-height: 40px
				padding: 0 18px
				background: #f3f3f7
				border-bottom: 1px solid rgba(7 ,17, 27, 0.1)
				.title
					float: left
					font-size: 14px
					color: rgb(7, 17, 27)
				.empty
					float: right
					font-size: 12px
					color: rgb(0, 160, 220)
			.list-content
				padding: 0 18px
				max-height: 217px /* 定义了最大高度 */
				overflow: hidden
				background: #fff
				.food
					position: relative
					padding: 12px 0
					box-sizing: border-box
					@include border-1px(rgba(7, 17, 27, .1))
					.name
						line-height: 24px
						font-size: 14px
						color: rgb(7, 17, 27)
					.price
						position: absolute
						right: 90px
						bottom: 12px
						line-height: 24px
						font-size: 14px
						font-weight: 700
						color: rgb(240, 20 , 20)
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 6px
		.list-mask
			position: fixed
			top: 0
			left: 0
			right: 0
			bottom: 0
			z-index: -2 /* 最底层 */
			opacity: 1 /* 默认为1 */ 
			backdrop-filter: blur(10px)
			background: rgba(7 ,17, 27, .6)		
			&.fade-enter-active,
			&.fade-leave-active
				transition: all .4s
			&.fade-enter,
			&.fade-leave-active
				opacity: 0
			
</style>