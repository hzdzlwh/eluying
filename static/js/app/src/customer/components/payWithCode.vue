<template>
    <div>
        <div class="modal fade" id="payWithCodeForm" role="dialog">
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
                        <div class="payWithCodeModal-info-container" v-if="params">
                            <p class="payWithCodeModal-info">应收金额：¥{{ params.totalPrice }}</p>
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
    #payWithCodeForm {
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
    import http from 'http';
    import modal from 'modal';
    export default {
        props: {
            params: {
                type: Object
            },
            visible: {
                type: Boolean
            },
            url: {
                type: String
            }
        },
        data() {
            return {
                authCode: '',
                inputFocus: false
            };
        },
        methods: {
            hideModal(isAll) {
                this.authCode = '';
                $('#payWithCodeForm').modal('hide');
                if (isAll) {
                    this.$emit('closeModal');
                } else {
                    this.$emit('closeModal', 'payCode');
                }
            },
            payMoney() {
                const params = JSON.parse(JSON.stringify(this.params));
                params.authCode = this.authCode;
                delete params.totalPrice;
                http.get(this.url, params)
                    .then(result => {
                        const status = result.data.status;
                        const tradeNum = result.data.tradeNum;
                        if (status === 0) {
                            modal.success('收银成功');
                            this.hideModal(true);
                            this.authCode = '';
                            setTimeout(() => {
                                this.$emit('refreshView');
                            }, 2500);
                        } else if (status === 1) {
                            modal.warn('收款失败');
                            this.hideModal();
                        } else if (status === 2) {
                            const inter = setInterval(() => {
                                http.get('getPayStatus4BarcodeUrl', {
                                    tradeNum: tradeNum
                                })
                                    .then((result1) => {
                                        if (result1.code === 1) {
                                            var status1 = result1.data.status;
                                            if (status1 !== 2) {
                                                clearInterval(inter);
                                            }
                                            if (status1 === 0) {
                                                modal.success('收银成功');
                                                this.hideModal(true);
                                                this.authCode = '';
                                                setTimeout(() => {
                                                    this.$emit('refreshView');
                                                }, 2500);
                                            } else if (status1 === 1) {
                                                modal.warn('收款失败');
                                                this.hideModal();
                                            }
                                        }
                                    });
                            }, 5000);
                        }
                    });
            }
        },
        mounted() {
            $('#payWithCodeForm').on('shown.bs.modal', function(e) {
                $('.payWithCodeModal-codeNum').focus();
            });
        },
        watch: {
            visible(val) {
                if (val) {
                    $('#payWithCodeForm').modal({
                        backdrop: 'static'
                    });
                } else {
                    this.$emit('closeModal', 'payCode');
                    this.authCode = '';
                    $('#payWithCodeForm').modal('hide');
                }
            }
        }
    };
</script>
