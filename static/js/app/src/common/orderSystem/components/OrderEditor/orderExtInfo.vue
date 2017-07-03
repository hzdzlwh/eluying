<template>
    <div style="    display: flex;
    margin-top: 15px;
">
        <div class="room-date" style="display: inline-block; position: relative;" v-if='checkState === "team"'>
            <label class="label-text">到达</label>
            <div class="enterDate">
                <DatePicker v-model='value.startDate' @change='handleRoomChange' :clearable='false' :picker-options='{disabledDate:disabledStartDate(new Date())}' type="datetime" placeholder="选择日期时间" format='yyyy-MM-dd HH:mm'>
                </DatePicker>
            </div>
            <span v-if='value.roomCheckType !== 1'>~</span>
            <label class="label-text" v-if='value.roomCheckType !== 1'>离开</label>
            <div class="enterDate" v-if='value.roomCheckType !== 1'>
                <DatePicker v-model='value.endDate' @change='handleRoomChange' :clearable='false' :picker-options='{disabledDate:disabledEndDate(value.startDate)}' type="datetime" placeholder="选择日期时间" format='yyyy-MM-dd HH:mm'>
                </DatePicker>
            </div>
            <label class="label-text" v-if='value.roomCheckType !== 1'>
                共{{dateDiff(value.startDate, value.endDate)}}晚
            </label>
        </div>
        <div class="room-type">
            入住类型：
            <dd-select v-model='value.roomCheckType' placeholder="请选择入住类型">
                <dd-option v-for="check in checkType" :value="check.id" :key="check.id" :label="check.name">
                </dd-option>
            </dd-select>
        </div>
    </div>
</template>
<style scoped>
.room-type {
    margin-left: 20px;
}
</style>
<script>
import {
    roomCheckType
} from '../../roomCheckType';
import {
    DdSelect,
    DdOption,
} from 'dd-vue-component';
import {
    DatePicker
} from 'element-ui';
import bus from '../../../eventBus';
import util from '../../../util';
import {
    mapState,
    mapMutations
} from 'vuex';
export default {
    props: {
        checkState: String,
        value: Object
    },
    data() {
        return {
            checkType: roomCheckType,
            // startDate: String,
            // endDate: String,
            // roomCheckType: Number
        };
    },
    watch: {
        value(newval) {
            this.$emit('change', newval)
        }
    },
    // computed: { // // interStartDate: { // // get: function () { // // return this.startDate // // }, // // set: function(newval) { // // bus.$emit('OrderExtInfochange', { // // name: 'StartDate', // // val: newval // // }) // // } // // } // },

    components: {
        DdSelect,
        DdOption,
        DatePicker
    },
    methods: {
        handleRoomChange() {
            const duration = this.dateDiff(this.value.startDate, this.value.endDate);
            if (duration < 1 && value.roomCheckType !== 1) {
                this.value.endDate = util.diffDate(new Date(this.value.endDate), 1);
                return false;
            }
            // 最多400天
            // if (duration > 400) {
            //     const currentTime = +new Date();
            //     modal.warn('入住上限最大为400天，请重新选择入住时间！');
            //     this.lastModifyRoomTime = currentTime;
            //     return false;
            // }
        },
        dateDiff(date1, date2) {
            const d1 = new Date(date1);
            const d2 = new Date(date2);
            return util.DateDiff(d1, d2);
        },
        changeRoomType(item, index) {
            this.$nextTick(function() {
                // item.roomType = this.getRoomsList(item.categoryType)[0].id;
                this.handleRoomChange();
            });
        },
        // handleRoomChange() {
        //     bus.$emit('OrderExtInfochange', {
        //         checkType: this.roomCheckType,
        //         startDate: this.startDate,
        //         endDate: this.endDate
        //     }, -1);
        // },
        disabledStartDate(endDate) {
            const str = util.dateFormat(new Date(endDate));
            const arr = str.split('-');
            return (date) => {
                return date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
            };
        },
        disabledEndDate(startDate) {
            const str = util.dateFormat(new Date(startDate));
            const arr = str.split('-');
            if (this.value.roomCheckType === 1) {
                return (date) => {
                    return (date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf() || date.valueOf() > (new Date(arr[0], arr[1] - 1, arr[2])).valueOf() + 99 * 24 * 60 * 60 * 1000);
                };
            }
            return (date) => {
                return (date.valueOf() < (new Date(arr[0], arr[1] - 1, Number(arr[2]) + 1)).valueOf() || date.valueOf() > (new Date(arr[0], arr[1] - 1, arr[2])).valueOf() + 99 * 24 * 60 * 60 * 1000);
            };

        },
    }
}
</script>
