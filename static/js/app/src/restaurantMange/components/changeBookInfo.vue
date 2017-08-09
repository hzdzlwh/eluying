/*
* @Author: lxj
* @Date:   2017-08-08 18:22:37
* @Last Modified by:   lxj
* @Last Modified time: 2017-08-09 11:00:20
* @email: 783384903@qq.com
*/


<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="changeBook">
        <div class="modal-dialog ">
            <div class="modal-content roomModals-body">
                <div class="modal-header">
                    <span>修改预订信息</span>
                    <button type="button" class="close" @click="hideModal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <p></p>
                    <div><span>就餐人数：</span><input v-model='peopleNum' type="number" max="1000" class="dd-input" style="width:170px;"></div>
                    <div class="item" v-if='type'>
                        <span>用餐时间：</span>
                            <DatePicker v-model='resetData' @change='' :clearable='false' type="datetime" placeholder="选择日期时间" format='yyyy-MM-dd HH:mm'></DatePicker>
                    </div>
                </div>
                <div class="modal-foot">
                    <button class="dd-btn dd-btn-ghost" @click="hideModal">取消</button>
                    <button class="dd-btn dd-btn-primary" @click='changeBook'>确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { DdSelect, DdOption } from 'dd-vue-component';
import { DatePicker } from 'element-ui';
import inputVaild from '../../common/components/inputVaild.vue';
import util from 'util';
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        num: {
            type: Number,
            default: 0
        },
        data: {
            type: String,
            default: ''
        },
        type: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            peopleNum: 0,
            resetData: undefined
        };
    },
    methods: {
        hideModal() {
            this.resetData = undefined;
            this.peopleNum = 0;
            this.$emit('hideModal');
        },
        changeBook() {
            const parms = { peopleNum: this.peopleNum };
            if (this.resetData) {
                parms.orderTime = util.dateFormatLong(this.resetData);
            }
            this.hideModal();
            this.$emit('changeBook', parms);
        }
    },
    watch: {
        visible(newVale) {
            if (newVale) {
                $('#changeBook').modal('show');
            } else {
                $('#changeBook').modal('hide');
            }
        },
        num(val) {
            this.peopleNum = val;
        },
        resetData(val) {
            this.resetData = new Date(val);
        }
    },
    components: {
        DdSelect,
        DdOption,
        DatePicker,
        inputVaild
    }
};
</script>

<style lang="scss" scoped>
    .modal-content{
        padding: 0;
        width: 300px;
        .modal-body{
            border-bottom: 1px solid #e5e5e5;
            > div{
                margin-bottom: 16px;
            }
        }
        .modal-foot{
            padding:15px 15px 5px;
            text-align: right;
        }
    }
</style>
