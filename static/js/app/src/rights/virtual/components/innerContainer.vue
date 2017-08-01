<template>
    <div class="inner-container">
        <div class="inner-title">
            <h5>{{title}}</h5>
        </div>
        <div class="inner-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['title']
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .inner-container{
        box-shadow: 0 0 5px 0 rgba(0,0,0,0.15);
        border-radius: 2px;
        .inner-title{
            display: flex;
            justify-content: space-between;
            height: 37px;
            padding: 0 20px;
            background: #f0f0f0;
            h5{
                height: 37px;
                line-height: 37px;
                font-size: 12px;
                font-weight: bold;
            }
        }
        .inner-content{
            padding-left: 20px;
        }
    }
</style>
