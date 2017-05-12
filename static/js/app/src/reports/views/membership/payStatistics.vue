<template>
	<div>
		<div class="search-wrap">
			<div class="search">
	            <input type="text" class="dd-input" placeholder="搜索姓名/手机号/证件号/会员卡号" @keyup.enter="search" ref="searchInput">
	            <img class="search-icon" @click="search" src="//static.dingdandao.com/vipSearch.png">
	        </div>
        </div>
	</div>
</template>

<script>
    export default {
        methods: {
            search() {
            }
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
	.search{
		position: relative;
		width: 256px;
		.search-icon{
			position: absolute;
			right: 8px;
			top: 6px;
		}
	}
</style>

