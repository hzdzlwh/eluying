<template>
    <div class="outer-container">
        <div class="outer-title">
            <slot name="currency"></slot>
        </div>
        <div class="outer-content">
            <slot></slot>
        </div>
        <slot name="saveOrCancel"></slot>
    </div>
</template>

<script>
    import http from '../../../common/http';
    export default {
        methods: {
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .outer-container{
        width: 721px;
        border-top: 4px solid #178ce6;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
        border-radius: 2px;
        .outer-title{
            height: 49px;
            padding: 0 20px;
            background: #f0f0f0;
            h4{
                height: 49;
                line-height: 49px;
            }
        }
        .outer-content{
            padding: 16px 20px;
        }
    }
</style>
