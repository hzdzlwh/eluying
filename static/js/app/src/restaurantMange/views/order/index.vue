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
            <div v-if="false">
                <div>
                    <date-select @change="handleDateChange" :defaultDate="defaultStrDate" :disabledDate="true"></date-select>
                </div>
                <div class="select-container">
                    
                </div>
            </div>
            <div v-else>
                <transition name="move">
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
                </transition>
            </div>
        </div>
        <div class="rest-order-right">
            <taday></taday>
        </div>
        <inputKeyboard :visible='keyboardVisible' :num='restNum' @numChange='numChange' @close='closeKeyboard'></inputKeyboard>
    </div>
</template>
<style scoped>
    .restContain{
        width: 1200px;
        margin:auto;
        display: flex;
    }
    .rest-order-left{
        width: 800px;
    }
    .rest-order-right{
        width: 400px;
    }
    .move-enter-active {
        transition: all 2s;
    }
</style>
<script>
import taday from '../../components/tadayRestDate.vue';
import inputKeyboard from '../../../common/components/inputKeyboard.vue';
import DateSelect from '../../../accommodation/components/DateSelect';
import { dateFormat } from '../../../common/util';
export default {
    props: {

    },
    data() {
        return {
            keyboardVisible: false,
            restNum: 0,
            defaultStrDate: dateFormat(new Date())
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
        handleDateChange(date) {
            this.defaultStrDate = date;
        },
        setMenu(index, event) {
            // this.$refs.menu.scrollTop = 200;
            $(this.$refs.menu).animate({ scrollTop: 200 }, 200);
        },
        handleScroll(ev) {
            console.log(ev.target.scrollTop);
        }
    },
    watch: {
    },
    components: {
        taday,
        inputKeyboard,
        DateSelect
    },
    created() {

    }

};
</script>
