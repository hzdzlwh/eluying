<template>
    <div>
        <div id="checkList" class="modal fade" role="dialog" data-backdrop="static">
            <div class="modal-content checkForm-modal-content">
                <span class="checkForm-closeBtn" @click="close()">&times;</span>
                <div class="checkForm-modal-header">
                    <div v-if='checkListType === 1'>
                        <div><span>历史充值总额</span>￥{{historyRecharge}}</div>
                        <div><span>历史退款总额</span>￥{{historyRefunds}}</div>
                    </div>
                    <div v-else>
                        <div><span>历史结算总额</span>￥{{historySettle}}</div>
                    </div>
                </div>
                <div class="checkForm-modal-body">
                    <div class="interList">
                        <DdTable :columns="col[checkListType]" :data-source="datalist"></DdTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>
<style lang="scss" rel="stylesheet/scss">
#checkList {
    z-index:2053;
}
.interList {
    max-height:340px;
    overflow-y: auto;
    .dd-table-container{
        box-shadow:none;
    }
    .dd-table {
        border-top: none;
        thead{
            tr {
                border-bottom: 1px solid #e6e6e6;
            }
            th{
            background: none;
            text-align: center;
            color:#999;
        }
            } 
         tbody td{
            border-top:none;
            padding: 10px 6px;
            color:#666;
            text-align: center;
         }
    }
}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
.checkForm-modal-content {
    border-radius: 2px;
    border-top: 4px solid #178ce6;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
    padding: 0;
    overflow-x: hidden;
    position: relative;
    width: 615px;
    height: 445px;
    margin-top: 0!important;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%)!important;
    transform: translate(-50%, -50%)!important;
    .checkForm-closeBtn {
        float: right;
        margin-right: 15px;
        cursor: pointer;
    }
    .checkForm-modal-header {
        font-size: 16px;
        color: #178ce6;
        text-align: left;
        padding: 25px 20px;
        .comName {
            padding: 20px 24px 0;
            font-family: MicrosoftYaHei;
            font-size: 14px;
            color: #666666;
        }
    }
    .checkForm-modal-body {}
}
</style>
<script>
import {
    DdTable
} from 'dd-vue-component';
import http from '../../common/AJAXService';
import modal from '../../common/modal';
export default {
    props: {
        visible: Boolean,
        id: {
            type: Number,
            default: 0
        },
        checkListType: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            col: [
                [],
                [{
                    title: '结算日期',
                    dataIndex: 'creationTime',
                    width: '200px'
                }, {
                    title: '操作类型',
                    render: (h, row) => <span>{row.type === 1 ? '充值' : row.type === 2 ? '退款' : row.type === 3 ? '结账扣款' : row.type === 4 ? '订单退款' : ''}</span>
                }, {
                    title: '结算金额',
                    render: (h, row) => <span>￥{row.price}</span>
                }, {
                    title: '支付方式',
                    dataIndex: 'channel'
                }, {
                    title: '操作人',
                    dataIndex: 'operator'
                }],
                [{
                    title: '结算日期',
                    dataIndex: 'creationTime',
                    width: '200px'
                }, {
                    title: '结算金额',
                    render: (h, row) => <span>￥{row.settleFee}</span>
                }, {
                    title: '支付方式',
                    dataIndex: 'channel'
                }, {
                    title: '操作人',
                    dataIndex: 'operator'
                }]

            ],
            historySettle: 0,
            datalist: [],
            historyRecharge: 0,
            historyRefunds: 0,
            url: [
                '',
                '/contractCompany/getWalletLog',
                '/contractCompany/getSettleLog'
            ]
        };
    },
    created() {},
    methods: {
        fetchDate() {
            http.get(this.url[this.checkListType], {
                cid: this.id
            }).then(res => {
                if (res.code === 1) {
                    this.datalist = res.data.list;
                    this.historyRecharge = res.data.historyRecharge;
                    this.historyRefunds = res.data.historyRefunds;
                    this.historySettle = res.data.historySettle;
                } else {
                    modal.alert(res.msg);
                }
            });
        },
        close() {
            $('#checkList').modal('hide');
            this.$emit('close');
        }
    },
    watch: {
        visible(val) {
            if (val) {
                this.fetchDate();
                $('#checkList').modal({
                    backdrop: 'static'
                });
                $('#checkList').modal('show');
            } else {
                $('#checkList').modal('hide');
            }
        }
        // id(val) {
        //     this.fetchDate();
        // },
        // checkListType() {
        //     this.fetchDate();
        // }
    },
    components: {
        DdTable
    }
};
</script>
