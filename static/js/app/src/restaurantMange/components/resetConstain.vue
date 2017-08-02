/*
* @Author: lxj
* @Date:   2017-08-01 14:28:15
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-08-02 17:32:43
* @email: 783384903@qq.com
*/

<template>
    <div>
        <template >
            <div>区域一</div>
            <div>大圆桌4</div>
            <div><button class="dd-btn shopcart-live" @click='getNum'>开启</button><button class="dd-btn shopcart-live">预订</button></div>
        </template>
        <inputKeyboard :visible='keyboardVisible' :num='restNum' @numChange='numChange' @close='closeKeyboard'></inputKeyboard>
    </div>
</template>
<style>
    
</style>
<script>
import inputKeyboard from '../../common/components/inputKeyboard.vue';
export default {
    props: {
        resetDate: Object,
        resetId: Number,
        
    },
    data() {
        return {
            keyboardVisible: false,
            restNum: 0
        };
    },
    computed: {
    },
    methods: {
        numChange(val) {
            this.restNum = val;
        },
        getNum(val) {
            this.keyboardVisible = true;
        },
        closeKeyboard() {
            this.keyboardVisible = false;
        },
    },
    watch: {
    },
    components: {
        inputKeyboard
    },
    created() {

    }

};
</script>