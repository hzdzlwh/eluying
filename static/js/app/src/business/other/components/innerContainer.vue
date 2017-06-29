<template>
    <div class="inner-container">
        <div class="inner-title">
            <h4>{{title}}</h4>
            <a>编辑</a>
        </div>
        <div class="inner-content">
            
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
        .inner-title{
            display: flex;
            justify-content: space-between;
            height: 37px;
            padding: 0 20px;
            background: #f0f0f0;
            h4{
                height: 37px;
                line-height: 37px;
            }
            a{
                height: 37px;
                line-height: 37px;
            }
        }
    }
</style>
