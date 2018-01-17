<template>
	<div class="goods">
		<div class="menu-wrapper">
			<ul>
				<li v-for="item in goods" :key="item.id" class="menu-item">
					<span class="text border-1px">
						<span class="icon" v-show="item.type>-1" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper"></div>
	</div>
</template>

<script>
	const ERR_OK = 0;
	
	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				goods: {}
			};
		},
		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
			
			this.$http.get('/api/goods').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.goods = response.data;
				}
			});
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
</style>