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
                            <p class="payWithCodeModal-info">应收金额：¥{{totalPrice}}</p>
                            <p class="payWithCodeModal-info">收银员：{{operator}}</p>
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
<style type="text/css" rel="stylesheet/scss" lang="sass">
    @import "~dd-common-css/src/variables";
    #payWithCode {
        box-sizing: border-box;
        font-size: $font-size-base;
        color: $gary-daker;
        .modal-dialog {
            width: 400px;
        }
        .modal-content {
            width: 400px;
            border-top: 4px solid #178ce6;
            border-radius: 2px;
            box-shadow: 0 0 5px 0;
            padding: 0;
            margin-top: 42.5px;
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
    import { mapState } from 'vuex';
    import AJAXService from 'AJAXService';
    import modal from 'modal';
    export default{
        props: {
            type: {
                type: String
            },
            business: {
                type: Object
            },
            params: {
                type: Object
            },
            totalPrice: {
                type: Number
            },
            show: {
                type: Boolean
            }
        },
        data(){
            return{
                authCode: ''
            }
        },
        computed:{
            ...mapState(['orderDetail']),
            operator() {
                if (this.type === 'register') {
                    return this.business.orderDetail.user;
                } else {
                    return this.orderDetail.operatorName;
                }
            }
        },
        methods:{
            hideModal() {
                this.authCode = '';
                this.$emit('hide');
                $('#payWithCode').modal('hide');
                this.$emit('showCashier', { type: this.type, business: this.business });
            },
            payMoney() {
                let params = JSON.parse(JSON.stringify(this.params));
                params.authCode = this.authCode;
                AJAXService.ajaxWithToken('GET', '/order/addOrderPayment', params)
                    .then(result => {
                        if(result.code === 1) {
                            let status = result.data.status;
                            let tradeNum = result.data.tradeNum;
                            if (status === 0) {
                                modal.somethingAlert('收银成功');
                                this.$emit('hide');
                                $('#payWithCode').modal('hide');
                                let orderId = this.type === 'register' ? this.business.orderDetail.relatedOrderId : this.orderDetail.orderId;
                                this.emit('refreshView');
                                this.$emit('showOrder', orderId);
                            } else if (status === 1) {
                                modal.somethingAlert("收款失败");
                                this.hideModal();
                            } else if (status === 2) {
                                let inter = setInterval(() => {
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
                                                this.$emit('hide');
                                                $('#payWithCode').modal('hide');
                                                let orderId = this.type === 'register' ? this.business.orderDetail.relatedOrderId : this.orderDetail.orderId;
                                                this.emit('refreshView');
                                                this.$emit('showOrder', orderId);
                                            } else if (status1 === 1) {
                                                modal.somethingAlert("收款失败");
                                                this.hideModal();
                                            }
                                        }
                                    });
                                }, 5000);
                            }
                        } else {
                            modal.somethingAlert(result.msg);
                        }
                    });
            }
        },
        watch:{
            show(val){
                if (val) {
                    $('#payWithCode').modal({backdrop: 'static'});
                } else {
                    this.$emit('hide');
                    $('#payWithCode').modal('hide');
                }
            }
        }
    }
</script>
