<template>
    <div class="inner-container">
        <div class="inner-title">
            <h4>{{title}}</h4>
            <a @click="toggle" v-if="switchView">编辑</a>
        </div>
        <div class="inner-content">
            <slot name="show" v-if="switchView"></slot>
            <slot name="edit" v-else></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['title','toggleView'],
        data() {
            return {
                switchView: true
            }
        },
        methods: {
            toggle() {
                this.switchView = !this.switchView;
            }
        },
        watch: {
            toggleView(newValue) {
                this.toggle();
            }
        }
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
