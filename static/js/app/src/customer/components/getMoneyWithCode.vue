<template>
    <div>
        <div class="modal fade" id="payWithCode" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="payWithCodeModal-header">
                        <span></span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="payWithCodeModal-body">
                        <div class="payWithCodeModal-code-container">
                            <div class="payWithCodeModal-picture-container"></div>
                            <input type="text" class="payWithCodeModal-codeNum" placeholder="付款码使用条码枪录入，也可手动输入。" v-model="authCode">
                        </div>
                        <div class="payWithCodeModal-info-container">
                            <p class="payWithCodeModal-info">应收金额：¥{{ data.data && data.data.amount}}</p>
                        </div>
                    </div>
                    <div class="payWithCodeModal-footer">
                        <span></span>
                        <div class="dd-btn dd-btn-ghost" @click="hideModal">取消</div>
                        <div class="dd-btn dd-btn-primary" @click="payMoney">确认收款</div>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style type="text/css" rel="stylesheet/scss" lang="scss">
@import "~dd-common-css/src/variables";
#payWithCode {
    box-sizing: border-box;
    font-size: $font-size-base;
    color: $gary-daker;
    z-index: 2053;
    .modal-dialog {
        width: 400px;
        margin-top: 0 !important;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%) !important;
        -ms-transform: translate(-50%, -50%) !important;
        transform: translate(-50%, -50%) !important;
    }
    .modal-content {
        width: 400px;
        border-top: 4px solid #178ce6;
        border-radius: 2px;
        box-shadow: 0 0 5px 0;
        padding: 0;
        margin-top: 0 !important;
    }
    .payWithCodeModal-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 10px 0 10px;
        margin-bottom: 16px;
        .close-icon {
            display: inline-block;
            width: 14px;
            height: 14px;
            background: url("../../../../../image/modal/room_modal_close.png");
            background-size: contain;
            cursor: pointer;
        }
    }
    .payWithCodeModal-body {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 0 35px;
        margin-bottom: 20px;
        .payWithCodeModal-code-container {
            border: 1px solid #cccccc;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 16px;
        }
        .payWithCodeModal-picture-container {
            width: 50px;
            height: 52px;
            background: url("../../../../../image/modal/room_modal_code.png");
            background-size: contain;
        }
        .payWithCodeModal-codeNum {
            width: 216px;
            height: 17px;
            font-size: 12px;
            opacity: 0.5;
            color: #999999;
            border: none;
            line-height: 17px;
            outline: none;
        }
        .payWithCodeModal-info {
            color: #999999;
            font-size: 14px;
        }
    }
    .payWithCodeModal-footer {
        width: 100%;
        display: flex;
        padding: 0 35px;
        margin-bottom: 20px;
        justify-content: space-between;
        align-items: center;
    }
}
</style>
<script>
import AJAXService from 'AJAXService';
import modal from 'modal';
import event from '../event.js';
export default {
    props: {
        data: {
            type: Object
        },
        show: {
            type: Boolean
        },
        paytype: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            authCode: '',
            inputFocus: false,
            url: ['/contractCompany/recharge', '', '/contractCompany/settle'

            ]
        };
    },
    methods: {
        hideModal(bool) {
            this.authCode = '';
            $('#payWithCode').modal('hide');
            this.$emit('close');
            if (bool === 1) {
                this.$emit('changestatus', 1);
            } else if (bool === 2) {
                this.$emit('changestatus', 0);
            }
        },
        payMoney() {
            const params = JSON.parse(JSON.stringify(this.data.data));
            params.authCode = this.authCode;
            AJAXService.ajaxWithToken('GET', this.url[this.paytype], params)
                .then(result => {
                    if (result.code === 1) {
                        const status = result.data.status;
                        const tradeNum = result.data.tradeNum;
                        if (status === 0) {
                            modal.somethingAlert('收银成功');
                            this.authCode = '';
                            setTimeout(() => {
                                this.hideModal(1);
                                event.$emit('checkSuc');
                            }, 1500);
                        } else if (status === 1) {
                            modal.somethingAlert('收款失败');
                            this.hideModal(2);
                        } else if (status === 2) {
                            const inter = setInterval(() => {
                                AJAXService.ajaxWithToken('GET', 'getPayStatus4BarcodeUrl', {
                                    tradeNum: tradeNum
                                }, (result1) => {
                                    if (result1.code === 1) {
                                        var status1 = result1.data.status;
                                        if (status1 !== 2) {
                                            clearInterval(inter);
                                        }
                                        if (status1 === 0) {
                                            modal.somethingAlert('收银成功');
                                            this.authCode = '';
                                            setTimeout(() => {
                                                this.hideModal(1);
                                                event.$emit('checkSuc');
                                            }, 2500);
                                        } else if (status1 === 1) {
                                            modal.somethingAlert('收款失败');
                                            this.hideModal(2);
                                        }
                                    }
                                });
                            }, 5000);
                        }
                    } else {
                        modal.somethingAlert(result.msg);
                        // modal.somethingAlert('收银失败');
                        //     this.authCode = '';
                        //     setTimeout(() => {
                        //         this.hideModal(2);
                        //     }, 2500);
                    }
                });
        }
    },
    mounted() {
        $('#payWithCode').on('shown.bs.modal', function(e) {
            $('.payWithCodeModal-codeNum').focus();
        });
    },
    watch: {
        show(val) {
            if (val) {
                $('#payWithCode').modal({
                    backdrop: 'static'
                });
            } else {
                this.$emit('hide');
                this.authCode = '';
                $('#payWithCode').modal('hide');
            }
        }
    }
};
</script>
