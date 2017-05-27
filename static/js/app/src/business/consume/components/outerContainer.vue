<template>
    <div class="outer-container">
        <header class="outer-title">
            <h4>{{title}}</h4>
            <a><span>+</span>{{add}}</a>
        </header>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            title: '',
            add: '',
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .outer-container{
        border-radius: 2px;
        border-top: 4px solid #178ce6;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15);
        .outer-title{
            display: flex;
            justify-content: space-between;
            padding: 10px;
            background: #ddd;
            border-bottom: 1px solid #ccc;
        }
    }
</style>
