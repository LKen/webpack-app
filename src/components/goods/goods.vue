<template>
	<div class="goods">
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item, index) in goods" :key="item.id" class="menu-item" :class="{'current': currentIndex === index}" 
					@click="selectMenu(index, $event)">
					<span class="text border-1px">
						<span class="icon" v-show="item.type>-1" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foodsWrapper">
			<ul>
				<li v-for="item in goods" :key="item.id" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="food in item.foods" :key="food.id" class="food-item">
							<div class="icon">
								<img :src="food.icon" />
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<cartcontrol :food="food" @cartAdd="_drop($event)"></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcart ref="shopcart" :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	import shopcart from '@/components/shopcart/shopcart';
	import cartcontrol from '@/components/cartcontrol/cartcontrol';
	// import globalArgs from '@/common/js/globalArgs';
	
	const ERR_OK = 0;
	// let eventHub = globalArgs.eventHub;
	
	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				goods: [],
				listHeight: [],
				scrollY: 0
			};
		},
		created() {
			// eventHub.$on('cartAdd', this._drop);
			
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
			
			this.$http.get('/api/goods').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.goods = response.data;
					// Vue 执行 DOM 更新是异步的，只要观察到数据变化，Vue 就开始一个队列，将同一事件循环内所有的数据变化缓存起来
					// 在数据变化之后等待 Vue 完成更新 DOM ，可以在数据变化之后立即使用 Vue.nextTick(callback)
					this.$nextTick(() => {
						this._initScroll();
						this._calculateHeight();
					});
				}
			});
		},
		beforeDestroy() {
			// eventHub.$off('cartAdd', this._drop);
		},
		computed: {
			currentIndex() {
				for (let i=0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i + 1];
					if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
						return i;
					}
				}
				return 0;
			},
			selectFoods() {
				let _foods = [];
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if (food.count) {
							_foods.push(food);
						}
					});
				});
				return _foods;
			}
		},
		methods: {
			selectMenu(index, event) {
				if(!event._constructed) {
					return false;
				}
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				let el = foodList[index];
				this.foodsScroll.scrollToElement(el, 300);
			},
			_initScroll() {
				this.menuScroll = new BScroll(this.$refs.menuWrapper, {
					click: true
				});
				
				this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
					click: true,
					probeType: 3
				});
				
				this.foodsScroll.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y));
				});
			},
			_calculateHeight() {
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				let height = 0;
				this.listHeight.push(height);
				for(let i = 0; i < foodList.length && (height += foodList[i].clientHeight, this.listHeight.push(height)); ++i){};
			},
			_drop(target) {
				// 优化动画
				this.$nextTick(() => {
					this.$refs.shopcart.drop(target);
				});
			}
		},
		components: {
			shopcart,
			cartcontrol
		}
	};
</script>

<style lang="sass" rel="stylesheet/sass">
	@import '../../common/styles/mixin.scss';
	
	.goods
		display: flex;
		position: absolute;
		top: 174px;
		bottom: 46px;
		width: 100%;
		overflow: hidden;
		.menu-wrapper
			flex: 0 0 80px;
			width: 80px;
			background: #f3f5f7;
			.menu-item
				display: table;/* 做垂直居中*/
				height: 54px;
				width: 56px;
				line-height: 14px;
				padding: 0 12px;
				&.current /* dynamic*/
					position: relative;
					z-index: 10;
					margin-top: -1px;
					background: #fff;
					font-weight: 700;
					.text
						@include border-none();
				.text
					display: table-cell;
					width: 56px;
					vertical-align: middle;
					@include border-1px(rgba(7,17,27,.8));
					font-size: 12px
				.icon
					position: relative;
					display: inline-block;
					width: 12px;
					height: 12px;
					margin-right: 4px;
					top: 1px; /* 居中而已 */
					background-size: 12px 12px;
					background-repeat: no-repeat;
					&.decrease
						@include bg-image('decrease_3');
					&.discount
						@include bg-image('discount_3');
					&.guarantee
						@include bg-image('guarantee_3');
					&.invoice
						@include bg-image('invoice_3');
					&.special
						@include bg-image('special_3');
		.foods-wrapper
			flex: 1;
			.title
				padding-left: 14px;
				height: 26px;
				line-height: 26px;
				border-left: 2px solid #d9dde1;
				font-size: 12px;
				color: rgb(147, 153, 159);
				background: #f3f5f7;
			.food-item
				display: flex;
				margin: 18px;
				padding-bottom: 18px;
				@include border-1px(rgba(7,17,27,.1));
				&:last-child
					@include border-none();
					margin-bottom: 0;
				.icon
					flex: 0 0 57px;
					margin-right: 10px;
				.content
					flex: 1;
					.name
						margin: 2px 0 8px 0;
						line-height: 14px;
						font-size: 14px;
						color: rgb(7, 17, 27);
					.desc, .extra
						line-height: 10px;
						font-size: 10px;
						color: rgb(147, 153, 159);
					.desc
						line-height: 14px;
						margin-bottom: 8px
					.extra
						.count
							margin-right: 12px;
					.price
						font-weight: 700;
						line-height: 24px;
						.now
							margin-right: 8px;
							font-size: 14px;
							color: rgb(240, 20,20);
						.old
							text-decoration: line-through;
							font-size: 10px;
							color: rgb(147, 153, 159);
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 12px
						
</style>