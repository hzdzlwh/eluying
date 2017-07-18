<template>
     <input class="dd-input" v-model='num' type='Number' @input='changeNum' ></input>
</template>
<style lang="scss" rel="stylesheet/scss" type="text/css">
</style>
<script>
    export default{
        props: {
            min: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: 20000000
            },
            value: {
                type: Number,
                default: 0
            },
            disabled: {
                type: Boolean,
                default: false
            },
            isInt: {
                type: Boolean,
                default: false
            },
            onNumChange: Function
        },
        data() {
            return {
                num: this.value
            };
        },
        computed: {
            // num() {
            //     return this.value;
            // }
        },
        methods: {
            changeNum() {
                if (!this.num && this.num !== 0) {
                    this.num = 0;
                }
                if (this.isInt) {
                    this.num = parseInt(this.num);
                } else {
                    this.num = Number(Number(this.num).toFixed(2));
                }
                if (this.num >= this.max) {
                    this.$emit('input', this.max);
                    this.num = this.max;
                } else {
                    if (this.min && this.num < this.min) {
                        this.$emit('input', this.min);
                    } else {
                        this.$emit('input', this.num);
                    }
                }
            }
        },
        watch: {
            value(newVal) {
                this.num = newVal;
            },
            max(newVal) {
                if (this.num > newVal) {
                    this.num = newVal;
                    this.changeNum();
                }
            }
        }
    };
</script>
