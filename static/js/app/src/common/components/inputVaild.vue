/*
* @Author: lxj
* @Date:   2017-07-18 19:49:19
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-08-01 15:51:11
* @email: 783384903@qq.com
*/
<template>
     <input class="dd-input inputVaild" :style="{width:width}" v-model='num'  type='Number' @input='changeNum' :disabled='disabled' ref='inputVaild' :placeholder='placeholder'></input>
</template>
<style lang="scss" rel="stylesheet/scss" type="text/css">
.inputVaild{
    background:#ffffff;
border:1px solid #cccccc;
border-radius:2px;
height:23px;
}
</style>
<script>
    export default{
        props: {
            width: String,
            placeholder: String,
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
                num: this.value,
                flag: true
            };
        },
        computed: {
            // num() {
            //     return this.value;
            // }
        },
        methods: {
            changeNum() {
                if (!this.num && this.num !== 0 && this.placeholder) {
                    this.$emit('input', undefined);
                } else {
                    if (!this.num && this.num !== 0) {
                        this.num = 0;
                    }
                    const valStr = this.$refs.inputVaild.value;
                    if (((valStr.length === 2 && this.flag) || (this.$refs.inputVaild.value.length !== String(Number(this.num)).length)) && this.$refs.inputVaild.value.indexOf('.') === -1) {
                        this.flag = false;
                        this.$refs.inputVaild.value = Number(this.num);
                    } else {
                        if (valStr.length >= 2) {
                            this.flag = false;
                        } else {
                            this.flag = true;
                        }
                    }
                    if (this.isInt) {
                        this.num = parseInt(this.num);
                    } else {
                        if (this.$refs.inputVaild.value.split('.').length > 1 && this.$refs.inputVaild.value.split('.')[1].length > 2) {
                            this.num = this.num.substring(0, this.num.indexOf('.') + 3);
                            this.$refs.inputVaild.value = this.num;
                        }
                        // 20.0000的情况
                    }
                    if (this.num >= this.max) {
                        this.$emit('input', this.max);
                        this.num = this.max;
                    } else {
                        if (this.num < this.min) {
                            this.num = Number(this.min);
                            this.$emit('input', this.min);
                        } else {
                            this.num = Number(this.num);
                            this.$emit('input', Number(this.num));
                        }
                    }
                }
            }
        },
        watch: {
            value(newVal) {
                if (Number(newVal) < 20000000) {
                    this.num = newVal;
                } else {
                    this.num = 20000000;
                    this.$emit('input', 20000000);
                }
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
