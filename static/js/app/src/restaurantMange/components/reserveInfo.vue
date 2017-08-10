/**
 * @Author: lwh
 * @Date:   2017-08-07 11:16:56
 * @Last Modified by:   lwh
 * @Last Modified time: 2017-08-09 18:05:25
 */

<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="reserveInfo">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <span>填写预订信息</span>
                    <button type="button" class="close" @click="hideModal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <div class="item">
                        <span>客户姓名：</span>
                        <div style="width:200px;">
                            <input type="text" class="dd-input" style="width:200px;">
                        </div>
                        <span class="relevance-order" @click="showRelevanceOrder">关联订单</span>
                    </div>
                    <div><span style="display:inline-block;width:70px;text-align:right;">手机号：</span><input type="number" class="dd-input" style="width:200px;"></div>
                    <div class="item">
                        <span>客户来源：</span>
                        <div style="width:200px;">
                            <dd-select v-model="customerSource" >
                                <dd-option :key="item.id" v-for="item in customerSources" :value="item.id" :label="item.name"></dd-option>
                            </dd-select>
                        </div>
                    </div>
                    <div class="item">
                        <span style="display:inline-block;width:70px;text-align:right;">会员卡：</span>
                        <div style="width:200px;">
                            <dd-select v-model="vipCard" >
                                <dd-option :key="item.id" v-for="item in vipCards" :value="item.id" :label="item.name"></dd-option>
                            </dd-select>
                        </div>
                    </div>
                    <div><span>就餐人数：</span><input type="number" max="1000" class="dd-input" style="width:200px;"></div>
                    <div class="item">
                        <span style="display:inline-block;width:70px;text-align:right;">用餐时间：</span>
                        <div>
                            <DatePicker v-model='date' @change='' :clearable='false' type="datetime" placeholder="选择日期时间" format='yyyy-MM-dd HH:mm'></DatePicker>
                        </div>
                    </div>
                    <div class="item">
                        <span style="display:inline-block;width:70px;text-align:right;">销售员：</span>
                        <div style="width:200px;">
                            <dd-select v-model="saler" >
                                <dd-option :key="item.id" v-for="item in salers" :value="item.id" :label="item.name"></dd-option>
                            </dd-select>
                        </div>
                    </div>
                    <div class="order-remark">
                        <span>订单备注：</span>
                        <textarea style="width:300px;height:80px;"></textarea>
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
                $('#reserveInfo').modal('show');
            } else {
                $('#reserveInfo').modal('hide');
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

<style lang="scss">
    .modal-content{
        padding-top: 0;
        padding-bottom: 10px;
        .modal-body{
            border-bottom: 1px solid #e5e5e5;
            > div{
                margin-bottom: 16px;
            }
            .relevance-order{
                margin-left: 10px;
                color: #178ce6;
                cursor: pointer;
            }
        }
        .modal-foot{
            padding-top: 15px;
            text-align: right;
        }
        .item{
            display: flex;
        }
        .order-remark{
            display: flex;
        }
    }
    .el-input__inner{
        height: 24px !important;
    }
</style>