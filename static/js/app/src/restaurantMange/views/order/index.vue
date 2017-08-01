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
                <div>
                    <date-select @change="handleDateChange" :defaultDate="defaultStrDate" :disabledDate="true"></date-select>
                </div>
                <div class="select-container">
                    
                </div>
            </div>
            <div v-else>
                
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
