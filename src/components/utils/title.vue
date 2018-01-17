<template>
	<div class="title">
		<!-- 在某些android下会有异常 -->
		<div class="line"></div>
		<div class="text">{{name}}</div>
		<div class="line"></div>
	</div>
</template>

<script>
	export default {
		props: {
			name: {
				type: String
			}
		}
	};
</script>

<style scoped lang="sass" rel="stylesheet/sass">
	.title
		display: flex;
		width: 80%;
		margin: 28px auto 24px;
		.line
			flex: 1;
			position: relative;
			top: -6px;
			border-bottom: 1px solid rgba(255, 255, 255, .2);
		.text
			padding: 0 12px;
			font-weight: 700;
			font-size: 14px;
</style>