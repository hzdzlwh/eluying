<template>
	<div class="collect-btn" :class="{ 'collect-add': !state, 'collect-cancel': state }" @click="toggleState">
		<span>{{name}}</span>
	</div>
</template>

<script>
export default {
    data() {
        return {
        };
    },
    props: {
        state: {
            type: Boolean,
            default: undefined
        }
    },
    computed: {
        name() {
            return this.state ? '已收藏' : '加入收藏';
        }
    },
    methods: {
        toggleState() {
            this.$emit('toggleCollect');
        }
    }
};
</script>

<style lang="scss">
	.collect-btn{
		width: 100px;
		height: 25px;
		border-radius: 2px;
		cursor: pointer;
		&.collect-add{
			background: #178ce6;
		}
		&.collect-cancel{
			background: #f39c30;
		}
		span{
			display: inline-block;
		    width: 100%;
		    color: #fff;
		    height: 100%;
		    text-align: center;
		    line-height: 25px;
		}
		&:hover{
			opacity: 0.8;
		}
	}
</style>
