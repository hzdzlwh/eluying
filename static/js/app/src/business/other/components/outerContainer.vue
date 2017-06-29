<template>
    <div class="outer-container">
        <div class="outer-title">
            <h4>{{title}}</h4>
        </div>
        <div class="outer-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    
    export default {
        props: ['title'],
        components: {
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .outer-container{
        width: 506px;
        border-top: 4px solid #178ce6;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
        border-radius: 2px;
        .outer-title{
            height: 49px;
            padding-left: 20px;
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
