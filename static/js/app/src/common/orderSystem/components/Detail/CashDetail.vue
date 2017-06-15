<template>
    <div class="modal fade roomModals" role="dialog" id="cashDetail">
        <div class="modal-dialog" style="width: 943px">
            <div class="modal-content">
                <div class="roomModals-header">
                    收银明细
                    <button type="button" class="close" data-dismiss="modal" @click="close"><span>&times;</span></button>
                </div>
                <div style="padding: 20px 24px;height: 480px;overflow: auto">
                    <dd-table :columns="columns" :dataSource="dataSource"></dd-table>
                </div>
                <div class="roomModals-footer">
                    <span>共计{{num}}条记录 合计金额¥{{totalPrice}}</span>
                    <dd-pagination @currentchange="query" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="page" />
                </div>
            </div>
        </div>
    </div>
</template>
<style>
    #cashDetail .dd-table {
        border-top: 0;
    }
</style>
<script type="text/jsx">
    import { DdTable, DdPagination } from 'dd-vue-component';
    import { getOrderId } from '../../utils/order';
    import http from '../../../http';
    export default{
        components: {
            DdTable,
            DdPagination
        },
        data() {
            return {
                page: 1,
                dataSource: [],
                num: 0,
                pages: 0,
                totalPrice: 0,
                columns: [
                    {
                        title: '订单号',
                        dataIndex: 'orderNum',
                        width: 200
                    },
                    {
                        title: '收银方式',
                        dataIndex: 'payChannel'
                    },
                    {
                        title: '金额',
                        dataIndex: 'amount'
                    },
                    {
                        title: '操作时间',
                        dataIndex: 'operationTime',
                        width: 160
                    },
                    {
                        title: '操作人',
                        dataIndex: 'operator'
                    },
                    {
                        title: '交易号',
                        dataIndex: 'tradeNum',
                        width: 200
                    }
                ]
            };
        },
        props: {
            show: Boolean,
            onClose: Function,
            order: Object
        },
        watch: {
            show(val) {
                if (val) {
                    $('#cashDetail').modal('show');
                    this.query(1);
                } else {
                    $('#cashDetail').modal('hide');
                    this.page = 1;
                    this.dataSource = [];
                    this.num = 0;
                    this.pages = 0;
                    this.totalPrice =  0;
                }
            }
        },
        methods: {
            query(page) {
                this.page = page || this.page;

                http.get('/order/getCashierDetailList', {
                    orderId: getOrderId(this.order),
                    orderType: this.order.type,
                    page
                })
                    .then(res => {
                        if (res.code === 1) {
                            this.dataSource = res.data.items;
                            this.num = res.data.totalCount;
                            this.totalPrice = res.data.totalAmount;
                            this.pages = Math.ceil(this.num / 10);
                        }
                    });
            },
            close() {
                this.onClose();
            }
        }
    };
</script>
