/*
* @Author: lxj
* @Date:   2017-07-18 19:49:19
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-07-19 16:00:01
* @email: 783384903@qq.com
*/
<template>
     <input class="dd-input inputVaild" v-model='num'  type='Number' @input='changeNum' :disabled='disabled'></input>
</template>
<style lang="scss" rel="stylesheet/scss" type="text/css">
.inputVaild{
    background:#ffffff;
border:1px solid #cccccc;
border-radius:2px;
width:80px!important;
height:23px;
}
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
                    if (this.num < this.min) {
                        this.num =  Number(this.min);
                        this.$emit('input', this.min);
                    } else {
                        this.num =  Number(this.num);
                        this.$emit('input', Number(this.num));
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
