/*
* @Author: lxj
* @Date:   2017-07-28 16:16:45
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-07-31 15:16:54
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
import DateSelect from '../../../accommodation/components/DateSelect';
import { dateFormat } from '../../../common/util';
export default {
    props: {
    },
    data() {
        return {
            defaultStrDate: dateFormat(new Date())
        };
    },
    conputed: {
    },
    methods: {
        handleDateChange(date) {
            this.defaultStrDate = date;
        }
    },
    watch: {
    },
    components: {
        taday,
        DateSelect
    },
    create() {

    }

};
</script>
