<template>
    <div style="    display: flex;
    margin-top: 15px;
">
        <div class="room-date" style="display: inline-block; position: relative;" v-if='checkState === "team"'>
            <label class="label-text">入住</label>
            <div class="enterDate">
                <DatePicker v-model='startDate' @input="changevalue(value, 'startDate')" :picker-options='{disabledDate:disabledStartDate(new Date())}' type="datetime" placeholder="选择日期时间" format='yyyy-MM-dd HH:mm'>
                </DatePicker>
            </div>
            <span>~</span>
            <div class="enterDate">
                <DatePicker v-model='endDate'  @change="handleRoomChange()" :picker-options='{disabledDate:disabledStartDate(startDate)}' type="datetime" placeholder="选择日期时间" format='yyyy-MM-dd HH:mm'>
                </DatePicker>
            </div>
            <label class="label-text">
                共{{dateDiff(startDate, endDate)}}晚
            </label>
        </div>
        <div class="room-type">
            入住类型：
            <dd-select v-model='roomCheckType' placeholder="请选择入住类型" @input="changeRoomType
(item ,index)">
                <dd-option v-for="check in checkType" :value="check.id" :key="check.id" :label="check.name">
                </dd-option>
            </dd-select>
        </div>
    </div>
</template>
<style scoped>
.room-type{
    margin-left: 20px;
}
</style>
<script>
import {
    checkType
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
import {mapState,mapMutations} from 'vuex';
export default {
    props: {
        checkState: String,
        startDate: String,
        endDate: String,
        checkType: Number
    },
    data() {
        return {
            checkType,
            startDate: String,
            endDate: String,
            roomCheckType: Number
        };
    },
    components: {
        DdSelect,
        DdOption,
        DatePicker
    },
    create() {
        this.handleRoomChange();
    },
    methods: {
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
        handleRoomChange() {
            bus.$emit('OrderExtInfochange', {
                checkType: this.roomCheckType,
                startDate: this.startDate,
                endDate: this.endDate
            }, -1);
        },
        disabledStartDate(endDate) {
            const str = util.dateFormat(new Date(endDate));
            const arr = str.split('-');
            if (this.checkState === 'finish') {
                return (date) => {
                    return date.valueOf() >= (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                };
            } else if (this.checkState === 'ing') {
                return (date) => {
                    return date.valueOf() !== (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                };
            } else {
                return (date) => {
                    return date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                };
            }
        },
        disabledEndDate(startDate) {
            if (this.checkState === 'finish') {
                if (util.isSameDay(new Date(startDate), new Date())) {
                    const str1 = util.dateFormat(new Date());
                    const arr1 = str1.split('-');
                    return (date) => {
                        return (date.valueOf() > (new Date(arr1[0], arr1[1] - 1, arr1[2])).valueOf());
                    };
                } else {
                    const str = util.dateFormat(new Date(startDate));
                    const arr = str.split('-');
                    const str1 = util.dateFormat(new Date());
                    const arr1 = str1.split('-');
                    return (date) => {
                        return (date.valueOf() <= (new Date(arr[0], arr[1] - 1, arr[2])).valueOf()) || (date.valueOf() > (new Date(arr1[0], arr1[1] - 1, arr1[2])).valueOf());
                    };
                }
            } else {
                const str = util.dateFormat(new Date(startDate));
                const arr = str.split('-');
                return (date) => {
                    return date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                };
            }
        }
    }
}
</script>
