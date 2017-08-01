/*
* @Author: lxj
* @Date:   2017-07-28 16:16:45
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-08-01 17:56:24
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
<<<<<<< HEAD
import inputKeyboard from '../../../common/components/inputKeyboard.vue';
=======
import DateSelect from '../../../accommodation/components/DateSelect';
import { dateFormat } from '../../../common/util';
>>>>>>> 80649117da4a06c475c1cc3f1b6951cf946c7441
export default {
    props: {

    },
    data() {
        return {
<<<<<<< HEAD
            keyboardVisible: false,
            restNum: 0
=======
            defaultStrDate: dateFormat(new Date())
>>>>>>> 80649117da4a06c475c1cc3f1b6951cf946c7441
        };
    },
    computed: {
    },
    methods: {
<<<<<<< HEAD
        numChange(val) {
            this.restNum = val;
        },
        getNum(val) {
            this.keyboardVisible = true;
        },
        closeKeyboard() {
            this.keyboardVisible = false;
=======
        handleDateChange(date) {
            this.defaultStrDate = date;
>>>>>>> 80649117da4a06c475c1cc3f1b6951cf946c7441
        }
    },
    watch: {
    },
    components: {
        taday,
<<<<<<< HEAD
        inputKeyboard
=======
        DateSelect
>>>>>>> 80649117da4a06c475c1cc3f1b6951cf946c7441
    },
    created() {

    }

};
</script>
