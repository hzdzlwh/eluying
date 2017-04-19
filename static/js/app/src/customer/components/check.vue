<template>
    <div>
        <div id="checkForm" class="modal fade" role="dialog" data-backdrop="static">
            <div class="modal-content checkForm-modal-content">
                <span class="checkForm-closeBtn" @click="close()">&times;</span>
                <div class="checkForm-modal-header">
                    <span>{{content[type].name}}</span>
                    <div class="comName"><span>企业名称：</span><span>{{data.name}}</span></div>
                </div>
                <div class="checkForm-modal-body">
                    <div class="checkitem">
                        <label for="">{{content[type].name1}}</label>
                        <input v-model='num' type="Number" class="dd-input" /><span class="CheckHave" v-if='type == 1'>可退余额￥{{data.rechargeFee}}</span>
                    </div>
                    <div class="checkitem">
                        <label for="">{{content[type].name2}}</label>
                        <dd-select v-model="select" class='checkSelect' placeholder='请选择支付方式'>
                            <dd-option v-for="type in checkType" :key='type' :value="type.id" :label="type.name"></dd-option>
                        </dd-select>
                    </div>
                    <div class="checkitem checkBtn">
                        <button class="dd-btn dd-btn-sm dd-btn-primary" @click='subCheck'>确定</button>
                        <button class="dd-btn dd-btn-sm dd-btn-ghost" @click="close()">取消</button>
                    </div>
                </div>
            </div>
        </div>
        <getAlipay :data='alipay' :show='alipayshow' @close='changeAlipay' @changestatus='changeAlipayStatus' :paytype='type'></getAlipay>
    </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
#checkForm {
    z-index: 2052;
}

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
import http from '../../common/http';
import modal from '../../common/modal';
import getAlipay from './getMoneyWithCode.vue';
import {
    DdSelect,
    DdOption
} from 'dd-vue-component';
import event from '../event.js';
export default {
    props: {
        visible: Boolean,
        type: {
            default: 2, // 0充值，1退款，2挂帐
            type: Number
        },
        data: {
            default: {},
            type: Object
        },
        checkType: undefined
    },
    data() {
        return {
            paytype: 0,
            num: undefined,
            content: [{
                name: '企业充值',
                name1: '充值金额：',
                name2: '支付方式：',
                url: '/contractCompany/recharge',
                msg: '充值'
            }, {
                name: '企业退款',
                name1: '退款金额：',
                name2: '退款方式：',
                url: ' /contractCompany/refund',
                msg: '退款'
            }, {
                name: '挂帐结算',
                name1: '结算金额：',
                name2: '支付方式：',
                url: '/contractCompany/settle',
                msg: '结算'
            }, {
                name: '挂帐结算',
                name1: '结算金额(退款)：',
                name2: '支付方式：',
                url: '/contractCompany/settle',
                msg: '结算'
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
            this.select = undefined;
            this.num = undefined;
            if (this.type === 2) {
                this.num = this.data.ledgerFee;
            }
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
            if (this.num === '' || this.num === undefined || parseFloat(this.num) === 0) {
                modal.somethingAlert('请输入' + this.content[this.type].msg + '金额！');
                return false;
            }
            if (!this.select) {
                modal.somethingAlert('请选择' + this.content[this.type].msg + '方式！');
                return false;
            }
            if (this.type === 2 && Number(this.num).toFixed(2) > Number(this.data.ledgerFee)) {
                modal.somethingAlert('结算金额不能大于挂账金额！');
                return false;
            }
            if (this.type === 1 && Number(this.num).toFixed(2) > Number(this.data.rechargeFee)) {
                modal.somethingAlert('退款金额不能大于充值余额！');
                return false;
            }
            // 判断是否进行扫码收款
            const id = this.select;
            const getCodeData = {
                amount: parseFloat(this.num),
                cid: this.data.cid,
                payChannel: this.checkType.filter(function(val) {
                    return val.id === id;
                })[0].name,
                payChannelId: this.select
            };
            if ((id === -6 || id === -7 || id === -11 || id === -12) && this.type !== 1) {
                this.alipay.data = getCodeData;
                this.alipayshow = true;
            } else {
                const that = this;
                let msg = '';
                this.type === 1 ? msg = '确认进行退款吗' : this.type === 3 ? msg = '请确保金额已退！' : msg = '请确保金额已收到！';
                modal.confirmDialog({
                    message: msg
                }, () => {
                    http.get(that.content[that.type].url, getCodeData)
                        .then((result) => {
                            if (that.type === 1) {
                                modal.somethingAlert('退款成功');
                            } else {
                                modal.somethingAlert('收款成功');
                            }
                            that.close();
                            that.num = 0;
                            that.select = undefined;
                            event.$emit('checkSuc');
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
