<template>
    <div class="modal fade roomModals" role="dialog" id="insuranceDialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="roomModals-header">
                    保单详情
                    <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                </div>
                <div style="padding: 20px 24px; max-height: 485px">
                    <dd-table :bordered="true" :columns="columns" :dataSource="order.insuranceInfoList || []"></dd-table>
                </div>
                <div class="roomModals-footer">
                    <span>共{{order.insuranceInfoList && order.insuranceInfoList.length}}条保单记录，保费¥{{order.insuranceTotalPremium}}，已付款¥{{order.insuranceTotalPremium}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
</style>
<script>
    import { DdTable } from 'dd-vue-component';
    export default{
        components: {
            DdTable,
        },
        data() {
            return {
                columns: [
                    {
                        title: '被保人姓名',
                        dataIndex: 'insurantsName',
                        width: 80
                    },
                    {
                        title: '手机号',
                        render: (h, row) => (<span>{row.holderMobile || row.insurantsMobile}</span>),
                        width: 105
                    },
                    {
                        title: '性别',
                        render: (h, row) => (<span>{['','男','女'][row.insurantsSex]}</span>),
                        width: 38
                    },
            {
                title: '年龄',
                    dataIndex: 'insurantsAge',
                width: 38
            },
            {
                title: '投保日期',
                    dataIndex: 'startDate',
                width: 90
            },
            {
                title: '终保日期',
                    dataIndex: 'endDate',
                width: 90
            },
            {
                title: '保单号',
                    dataIndex: 'proposalNo'
            },
            {
                title: '创建时间',
                    dataIndex: 'date',
                width: 155
            }
        ]
            };
        },
        props: {
            order: Object
        },
        methods: {}
    };
</script>
