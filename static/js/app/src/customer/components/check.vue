<template>
    <div>
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
                        <input v-model='num' type="Number" class="dd-input" /><span class="CheckHave" v-if='type !== 0'>可退余额￥{{data.rechargeFee || data.ledgerFee}}</span>
                    </div>
                    <div class="checkitem">
                        <label for="">{{content[type].name2}}</label>
                        <dd-select v-model="select" class='checkSelect'>
                            <dd-option v-for="type in checkType" :value="type.id" :label="type.name"></dd-option>
                        </dd-select>
                    </div>
                    <div class="checkitem checkBtn">
                        <button class="dd-btn dd-btn-sm dd-btn-primary" @click='subCheck'>确定</button>
                        <button class="dd-btn dd-btn-sm dd-btn-ghost" @click="close()">取消</button>
                    </div>
                </div>
            </div>
        </div>
        <getAlipay :data='alipay' :show='alipayshow' @close='changeAlipay' @changestatus='changeAlipayStatus'></getAlipay>
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
        .checkitem {
            padding-bottom: 8px;
            display: flex;
            line-height: 24px;
        }
        label {
            font-size: 14px;
            color: #666;
        }
        .CheckHave {
            color: #999;
            margin-left: 5px;
        }
        input {
            background: #ffffff;
            border: 1px solid #cccccc;
            border-radius: 2px;
            width: 120px;
            height: 24px;
        }
        .checkSelect {
            width: 120px;
        }
        .checkBtn {
            padding-left: 70px;
        }
        .dd-btn {
            margin-right: 18px;
        }
    }
}
</style>
<script>
import http from '../../common/AJAXService';
import modal from '../../common/modal';
import getAlipay from './getMoneyWithCode.vue';
import {
    DdSelect,
    DdOption
} from 'dd-vue-component';
export default {
    props: {
        visible: Boolean,
        type: {
            default: 2,
            type: Number
        },
        checkType: {
            default: [],
            type: Array
        },
        data: {
            default: {},
            type: Object
        }
    },
    data() {
        return {
            num: undefined,
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
            }],
            select: 0,
            alipay: {
                data: undefined,
                url: ''
            },
            alipayshow: false
        };
    },
    watch: {
        visible(val) {
            if (val) {
                $('#checkForm').modal('show');
                $('#checkForm').modal({
                    backdrop: 'static'
                });
            } else {
                $('#checkForm').modal('hide');
            }
        }
    },
    created() {},
    methods: {
        changeAlipay() {
            this.alipayshow = false;
        },
        changeAlipayStatus(val) {
            if (val) {
                this.close();
            }
        },
        close() {
            $('#checkForm').modal('hide');
            this.$emit('close');
        },
        subCheck() {
            if (this.select === undefined) {
                modal.somethingAlert('请选择收款方式！');
                return false;
            }
            if (this.num === undefined) {
                modal.somethingAlert('请输入金额');
                return false;
            }
            if (this.data.rechargeFee && Number(this.num).toFixed(2) > Number(this.data.rechargeFee)) {
                modal.somethingAlert('退款金额不能大于最大金额！！');
                return false;
            }
            if (this.data.ledgerFee && Number(this.num).toFixed(2) > Number(this.data.ledgerFee)) {
                modal.somethingAlert('结算金额不能大于挂账金额！！');
                return false;
            }
            // 判断是否进行扫码收款
            const id = this.select;
            const getCodeData = {
                amount: this.num,
                cid: this.data.cid,
                payChannel: this.checkType.filter(function(val) {
                    return val.id === id;
                })[0].name,
                payChannelId: this.select
            };
            if (id === - 6 || id === - 7 || id === - 11 || id === - 12) {
                this.alipay.data = getCodeData;
                this.alipayshow = true;
            } else {
                modal.confirmDialog({
                    message: '请确保金额已收到！'

                }, () => {
                    const that = this;
                    http.ajaxWithToken('GET', ' /contractCompany/settle', getCodeData)
                        .then((result) => {
                            if (result.code === 0) {
                                modal.somethingAlert('收款成功');
                                that.close();
                                this.num = 0;
                                this.select = 0;
                            } else {
                                modal.somethingAlert(result.msg);
                            }
                        });
                });
            }
        }
    },
    components: {
        DdSelect,
        DdOption,
        getAlipay
    }
};
</script>
