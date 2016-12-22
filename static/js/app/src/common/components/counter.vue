<template>
    <div class="counter-container">
        <span class="decrease-btn" @click="decreaseNum">-</span>
        <span class="value" v-text="value"></span>
        <span class="increase-btn" @click="increaseNum">+</span>
        <slot></slot>
    </div>
</template>
<style lang="sass" rel="stylesheet/scss" type="text/css">
    .counter-container {
        font-size: 0;
        display: inline-block;
        .value {
            font-size: 14px;
            display: inline-block;
            text-align: center;
            width: 34px;
            height: 24px;
            line-height: 22px;
            border: none;
            outline: none;
            border-top: 1px solid #cccccc;
            border-bottom: 1px solid #cccccc;
        }
    }
    .decrease-btn, .increase-btn {
        font-size: 14px;
        display: inline-block;
        height: 24px;
        line-height: 22px;
        border: 1px solid #cccccc;
        padding: 0 4px;
        cursor: pointer;
    }
</style>
<script>
    export default{
        props: {
            step: {
                type: Number,
                default: 1
            },
            min: {
                type: Number,
                default: 1
            },
            max: {
                type: Number,
                default: 999
            },
            num: {
                type: Number,
                default: 1
            },
            id: {
                type: Number,
                default: 0
            },
            type: {
                type: Number,
                default: 0
            }
        },
        data(){
            return{
                value: this.num
            }
        },
        computed: {},
        methods: {
            decreaseNum(){
                if (this.value <= this.min || this.value <= this.step) {
                    return;
                }
                this.value -= this.step;
                this.$emit('numChange', this.type, this.id, this.value / this.step);
            },
            increaseNum(){
                if (this.value >= this.max) {
                    return;
                }
                this.value += this.step;
                this.$emit('numChange', this.type, this.id, this.value / this.step);
            }
        },
        watch:{
            num(newVal) {
                this.value = newVal;
            }
        }
    }
</script>
