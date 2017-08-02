/*
* @Author: lxj
* @Date:   2017-07-28 16:16:45
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-08-01 18:02:44
* @email: 783384903@qq.com
*/

<template>
    <div class="restContain">
        <div class="rest-order-left">
            <div v-if="true">
                <rest-seats></rest-seats>
            </div>
            <div v-else>
                    <div style="position:absolute;width: 200px;height: 400px;border: 1px solid #ccc;overflow:scroll;display:flex" @scroll="handleScroll" ref="menu">
                        <div>
                            <ul>
                                <li @click="setMenu(1, $event)">a</li>
                                <li>b</li>
                                <li>c</li>
                            </ul>
                        </div>
                        <div>
                            <ul>
                                <li v-for="i in 40">{{i}}</li>
                            </ul>
                        </div>
                    </div>
            </div>
        </div>
        <div class="rest-order-right">
            <taday></taday>
        </div>
        <inputKeyboard :visible='keyboardVisible' :num='restNum' @numChange='numChange' @close='closeKeyboard'></inputKeyboard>
    </div>
</template>
<style lang="scss" scoped>
    .restContain{
        width: 1200px;
        margin:auto;
        display: flex;
    }
    .rest-order-left{
        width: 792px;
        
    }
    .rest-order-right{
        width: 400px;
    }
</style>
<script>
import taday from '../../components/tadayRestDate.vue';
import inputKeyboard from '../../../common/components/inputKeyboard.vue';
import restSeats from '../../components/restSeats.vue';
import { dateFormat } from '../../../common/util';
export default {
    props: {

    },
    data() {
        return {
            keyboardVisible: false,
            restNum: 0,
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
        setMenu(index, event) {
            // this.$refs.menu.scrollTop = 200;
            $(this.$refs.menu).animate({ scrollTop: 200 }, 400);
        },
        handleScroll(ev) {
            console.log(ev.target.scrollTop);
        }
    },
    components: {
        taday,
        inputKeyboard,
        restSeats
    },
    created() {

    }

};
</script>
