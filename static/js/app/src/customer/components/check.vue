<template>
    <div id="checkForm" class="modal fade" role="dialog">
        <div class="modal-content checkForm-modal-content">
            <span class="checkForm-closeBtn" @click="close()">&times;</span>
            <div class="checkForm-modal-header">
                <span>{{content[type].name}}</span>
                <div class="comName"><span>企业名称：</span><span>成都棕榈世界房车露营</span></div>
            </div>
            <div class="checkForm-modal-body">
                <div class="checkitem">
                    <label for="">{{content[type].name1}}</label>
                    <input v-model='num' type="text" class="dd-input" /><span class="CheckHave">可退余额￥13230000</span>
                </div>
                <div class="checkitem">
                    <label for="">{{content[type].name2}}</label>
                    <dd-select v-model="select" class='checkSelect'>
                        <dd-option v-for="type in checkType" :value="type.id" :label="type.name"></dd-option>
                    </dd-select>
                </div>
                <div class="checkitem checkBtn"><button class="dd-btn dd-btn-sm dd-btn-primary" @click='subCheck'>确定</button>
                <button class="dd-btn dd-btn-sm dd-btn-ghost">取消</button>
            </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
.checkForm-modal-content {
    background: #fafafa;
    border-radius: 2px;
    border-top: 4px solid #178ce6;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
    padding: 0;
    overflow-x: visible;
    position: relative;
    width: 410px;
    height: 245px;
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
        border-bottom: 1px solid #e6e6e6;
        padding: 25px 20px;
        .comName {
            padding: 20px 24px 0;
            font-family: MicrosoftYaHei;
            font-size: 14px;
            color: #666666;
        }
    }
    .checkForm-modal-body {
        padding: 15px 0 15px 45px;
        .checkitem{
            padding-bottom:8px;
            display:flex;
                line-height: 24px;
        }
        label {
            font-size: 14px;
            color: #666;
        }
        .CheckHave{
            color:#999;
            margin-left:5px;
        }
        input {
            background: #ffffff;
            border: 1px solid #cccccc;
            border-radius: 2px;
            width: 120px;
            height: 24px;
        }
        .checkSelect{
            width: 120px;
        }
        .checkBtn{
                padding-left: 70px;
        }
        .dd-btn{
            margin-right:18px;
        }
    }
}
</style>
<script>
import http from '../../common/AJAXService';
import modal from '../../common/modal';
import {
    DdSelect,
    DdOption
} from 'dd-vue-component';
export default {
    props: {
        visible: Boolean,
        type: 0,
        checkType: {
            default: [],
            type: Array
        }
    },
    data() {
        return {
            num:undefined,
            content: [{
                name: '企业充值',
                name1: '充值金额：',
                name2: '支付方式：',
                url: '/contractCompany/recharge'
            }, {
                name: '企业退款',
                name1: '退款金额：',
                name2: '退款方式：',
                url: ' /contractCompany/refund'
            }, {
                name: '挂帐结算',
                name1: '结算金额：',
                name2: '支付方式：',
                url: '/contractCompany/settle'
            }, ],
            select: undefined
        };
    },
    watch: {
        visible(val) {
            if (val) {
                $('#checkForm').modal('show');
            } else {
                $('#checkForm').modal('hide');
            }
        }
    },
    created() {},
    methods: {
        subCheck() {
            http.get(this.content[this.type].url, data).then(res => {
                if (res.code === 1) {
                    modal.somethingAlert('添加成功')
                    $('#add').modal('hide');
                    this.encompanyAddress = ''
                    this.encompanyName = ''
                    this.encompanyType = 0
                    this.encontactName = ''
                    this.encontactPhone = ''
                    this.encontractNum = ''
                    this.discounts = []
                    this.enremark = ''

                } else {
                    modal.somethingAlert(res.msg)
                }
            })
        },
        close() {
            $('#checkForm').modal('hide');
            this.$emit('close');
        },
        subCheck() {
                if(this.select === undefined) {
                    modal.somethingAlert('请选择收款方式！');
                    return false;
                }
                if (Number(num.toFixed(2)) >= Number(shouldPayMoney)) {
                    modal.somethingAlert('订单未结清，无法完成收银！');
                    return false;
                }
                const shouldDeposit = this.orderPayment.deposit - (this.orderPayment.refundDeposit || 0);
                if (this.deposit > shouldDeposit && this.type !== 'checkIn' && this.type !== 'register') {
                    modal.somethingAlert('结算金额不能大于挂账金额！');
                    return false;
                }
                const payments = this.payments.map(payment => {
                    const channel = this.payChannels.find(c => c.channelId === payment.payChannelId);
                    return {
                        ...payment,
                        payChannel: channel.name
                    }
                });

                if (this.deposit) {
                    const channel = this.depositPayChannels.find(c => c.channelId === this.depositPayChannel);

                    payments.push({
                        fee: this.deposit,
                        payChannelId: this.depositPayChannel,
                        payChannel: channel.name,
                        type: (this.orderPayment.deposit > 0 && this.type !== 'checkIn') ? 3 : 1
                    })
                }
                let params = undefined;
                if (this.type === 'register') {
                    params = {
                        orderId: this.business.orderDetail.orderId,
                        orderType: this.business.orderDetail.orderType,
                        payments: JSON.stringify(payments),
                    };
                } else if (this.type === 'cancel') {
                    const businessJson = {
                        functionType: this.business.functionType,
                        orderId: this.business.orderId,
                        orderType: this.business.orderType,
                        //subOrderPenaltys: JSON.parse(this.business.subOrderPenaltys)
                    };
                    if (this.business.subOrderPenaltys) {
                        businessJson.subOrderPenaltys =  JSON.parse(this.business.subOrderPenaltys);
                    }
                    /*if (this.business.penalty) {
                        payments.push({ fee: this.business.penalty, type: 4, payChannel: '违约金', payChannelId: -5 });
                    }*/
                    params = {
                        orderId: this.business.orderId,
                        orderType: this.business.orderType,
                        payments: JSON.stringify(payments),
                        businessJson: JSON.stringify(businessJson)
                    }
                } else {
                    params = {
                        orderId: this.orderDetail.orderId,
                        orderType: -1,
                        payments: JSON.stringify(payments),
                        businessJson: JSON.stringify(this.business)
                    };
                    if (this.business.rooms) {
                        let  subOrderIds = [];
                        this.business.rooms.forEach(room => {
                            if (room) {
                                subOrderIds.push(room.roomOrderId);
                            }
                        });
                        params.subOrderIds = JSON.stringify(subOrderIds);
                    }
                    if (this.business.type === 2) {
                        params.operationType = 1;
                    }
                }
                //判断是否进行扫码收款
              let id = this.select
                if (id === -6 || id === -7 || id === -11 || id === -12) {
                    AJAXService.ajaxWithToken('GET', '/order/addOrderPayment', params)
                        .then(result => {
                            if(result.code === 1) {
                                modal.somethingAlert('收银成功');
                                this.resetData();
                                this.$emit('hide');
                                $('#Cashier').modal('hide');
                                let orderId = this.type === 'register' ? this.business.orderDetail.relatedOrderId : this.orderDetail.orderId;
                                this.$emit('refreshView');
                                this.$emit('showOrder', orderId);
                            } else {
                                modal.somethingAlert(result.msg);
                            }
                            this.disabledBtn = false;
                        });
                } else {
                    this.disabledBtn = false;
                    this.resetData();
                    this.$emit('hide');
                    $('#Cashier').modal('hide');
                    this.$emit('showGetMoney', { type: this.type, business: this.business, params, payWithAlipay: Number(payWithAlipay.toFixed(2))});
                }
            }
    },
    components: {
        DdSelect,
        DdOption
    }
};
</script>
