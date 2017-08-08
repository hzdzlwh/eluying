/*
* @Author: lxj
* @Date:   2017-08-08 18:22:37
* @Last Modified by:   lxj
* @Last Modified time: 2017-08-08 19:06:41
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
                    <div><span>就餐人数：</span><input type="number" max="1000" class="dd-input" style="width:170px;"></div>
                    <div class="item">
                        <span>用餐时间：</span>
                            <DatePicker v-model='date' @change='' :clearable='false' type="datetime" placeholder="选择日期时间" format='yyyy-MM-dd HH:mm'></DatePicker>
                    </div>
                </div>
                <div class="modal-foot">
                    <button class="dd-btn dd-btn-ghost" @click="hideModal">取消</button>
                    <button class="dd-btn dd-btn-primary">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { DdSelect, DdOption } from 'dd-vue-component';
import { DatePicker } from 'element-ui';
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            customerSource: 1,
            vipCard: 1,
            date: new Date((new Date().valueOf() + 1800000)),
            saler: 1,
            customerSources: [
                {
                    id: 1,
                    name: '会员'
                },
                {
                    id: 2,
                    name: '自来客'
                }
            ],
            vipCards: [
                {
                    id: 1,
                    name: 'xxx'
                },
                {
                    id: 2,
                    name: 'yyy'
                }
            ],
            salers: [
                {
                    id: 1,
                    name: '张三'
                },
                {
                    id: 2,
                    name: '李四'
                }
            ]
        };
    },
    methods: {
        hideModal() {
            this.$emit('hideModal');
        },
        showRelevanceOrder() {
            this.hideModal();
            this.$emit('showRelevaneOrder');
        }
    },
    watch: {
        visible(newVale) {
            if (newVale) {
                $('#changeBook').modal('show');
            } else {
                $('#changeBook').modal('hide');
            }
        }
    },
    components: {
        DdSelect,
        DdOption,
        DatePicker
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