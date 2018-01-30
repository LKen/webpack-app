<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease" v-show="food.count>0" @click="decreaseCart">
				<i class="iconfont  icon-minus inner"></i>
			</div>
		</transition>
		<i class="cart-count" v-show="food.count>0">{{food.count}}</i>
		<i class="cart-add iconfont  icon-plus" @click="addCart"></i>
	</div>
</template>

<script type="text/ecmascript-6">
	// import globalArgs from '@/common/js/globalArgs';
	
	// let eventHub = globalArgs.eventHub;
	
	export default {
		props: {
			food: {
				type: Object, // 数组/对象的默认值应当由一个工厂函数返回
				default() {
					return {};
				}
			}
		},
		created() {},
		methods: {
			addCart(event) {
				if(!event._constructed) return;
				if(!this.food.count) {
					this.$set(this.food, 'count', 1); // 利用实例对关联数据添加属性跟踪
				} else {
					this.food.count++;
				}
				this.$emit('cartAdd', event);
				// eventHub.$emit('cartAdd', event.target);
			},
			decreaseCart(event) {
				if(!event._constructed) return;
				if(this.food.count) this.food.count--;
			}
		}
	};
</script>

<style lang="sass" rel="stylesheet/sass">
	.cartcontrol
		font-size: 0
		.cart-decrease
			display: inline-block
			padding: 6px
			transition: all 0.4s linear
			&.move-enter-active,
			&.move-leave
				opacity: 1
				transform: translate3D(0, 0, 0)
			&.move-enter,
			&.move-leave-active
				opacity: 0
				transform: translate3D(24px, 0, 0)
				.inner
					transform: rotate(180deg)
			.inner
				display: inline-block /* give height to animate */
				line-height: 24px
				font-size: 24px
				color: rgb(0, 160, 220)
				transition: all 0.4s linear
				transform: rotate(0deg) /* common status */
		.cart-count
			display: inline-block
			vertical-align: top
			width: 12px
			padding-top: 6px 
			line-height: 24px
			text-align:　center
			font-size: 10px
			color: rgb(147, 153, 155)
		.cart-add
			display: inline-block
			padding: 6px
			line-height: 24px
			font-size: 24px
			color: rgb(0, 160, 220)
</style>