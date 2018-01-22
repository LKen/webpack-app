<template>
	<div>
		<v-header :seller="seller"></v-header>
		<div class="tab border-1px">
			<div class="tab-item">
				<router-link class="chu" to="/goods">商品</router-link>
			</div>
			<div class="tab-item">
				<router-link to="/ratings">评论</router-link>
			</div>
			<div class="tab-item">
				<router-link to="/seller">商家</router-link>
			</div>
		</div>
		<router-view></router-view>
	</div>
</template>

<script>
	import header from './components/header/header.vue';
	
	const ERR_OK = 0;
	
	export default {
		data() {
			return {
				seller: {}
			};
		},
		created() {
			this.$http.get('/api/seller').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.seller = response.data;
				}
			});
		},
		components: {
			'v-header': header
		}
	};
</script>

<style lang="sass" rel="stylesheet/sass">
	@import "./common/styles/mixin.scss";
	.tab 
		display: flex;
		width: 100%;
		height: 40px;
		line-height: 40px;
		@include border-1px(rgba(7,17,27,.1));
		/*border-bottom: 1px solid rgba(7,17,27,.1);*/
		.tab-item 
			flex: 1;
			text-align: center;
			& > a 
				display: block;
				font-size: 14px;
				color: rgb(77,85,93);
				&.router-link-active
					color: rgb(240,20,20);
				
			/*.router-link-active
				display: block;
				position: relative;
				padding-bottom: 5px;
				&:before
					display: block;
					content: " ";
					position: absolute;
					bottom: 0;
					right: 0;
					left: 0;
					border: 1px solid #453465;*/
</style>