<template>
    <div class="noVipContent">
        <div class="noVipitem">
            <div class="noVipEntitem"><span class="noVipLabel">企业类型</span>{{ data.companyType ? '可挂账' : '不可挂账' }}
            </div>
            <div class="noVipEntitem"><span class="noVipLabel">企业编号</span>{{data.contractNum || '无'}}</div>
            <div class="noVipEntitem"><span class="noVipLabel">联系人</span>{{data.contactName || '无'}}</div>
            <div class="noVipEntitem"><span class="noVipLabel">联系号码</span>{{data.contactPhone || '无'}}</div>
            <div class="noVipEntitem"><span class="noVipLabel">企业地址</span>{{data.companyAddress || '无'}}</div>
            <div class="noVipEntitem" style="display:inline-flex"><span class="noVipLabel" style="display:inline-flex">优惠折扣</span>
                <div style="width:300px;max-height: 356px;overflow-y: auto;">
                    <div v-for='item in data.discounts' class="detailDiscout">
                        <div><span :title='item  | getdiscount'>{{item  | getdiscount}}</span>{{item.discount}}折</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="noVipitem">
            <div class="noVipEntitem"><span class="noVipLabel">充值余额</span>￥{{data.rechargeFee}}
                <div class="dd-btn dd-btn-primary dd-btn-sm btnl" @click='showbtn1' v-if='contral && contral.COMPANY_EDIT_ID'>充值</div>
                <div class=" btnl dd-btn dd-btn-primary dd-btn-sm" @click='showbtn2' v-if='data.rechargeFee && contral && contral.COMPANY_EDIT_ID'>退款</div><span @click='showlist' class="btnl fontbtn">充值日志</span> </div>
            <div class="noVipEntitem" v-if='data.companyType'><span class="noVipLabel">挂帐金额</span>￥{{data.ledgerFee}}
                <div class="dd-btn dd-btn-primary dd-btn-sm btnl" @click='showbtn3' v-if='data.ledgerFee && contral && contral.COMPANY_CHARGE_ID'>结算</div><span @click='showlistcheck' class="btnl fontbtn">结算日志</span> </div>
            <div class="noVipEntitem"><span class="noVipLabel">消费金额</span>￥{{data.consumeFee }}</div>
            <div class="noVipEntitem"><span class="noVipLabel">订单数</span>{{data.orderCount || 0}}</div>
            <div class="noVipEntitem"><span class="noVipLabel">创建时间</span>{{data.creationTime}}</div>
            <div class="noVipEntitem" style="display:inline-flex"><span class="noVipLabel">备注</span>
                <span class="remarkDetail">{{data.remark || '无'}}</span></div>
        </div>
    </div>
</template>
<style scoped>
.btnl {
    margin-left: 8px;
}

.fontbtn {
    color: #178ce6;
    cursor: pointer;
}

.noVipitem {
    width: 400px;
    display: inline-block;
}

.detailDiscout {
    display: block;
}

.detailDiscout span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 90px;
}

.detailDiscout > div {
    display: inline-flex;
    margin-bottom: 10px;
    width: 150px;
}

.noVipEntitem {
    margin-bottom: 20px;
}

.remarkDetail {
    width: 150px;
}

.noVipLabel {
    display: inline-block;
    width: 60px;
    text-align: right;
    margin-right: 8px;
}
</style>
<script>
import event from '../event.js';
export default {
    props: {
        data: Object,
        contral: Object
    },
    data() {
        return {
            checkVisible: false
        };
    },
    filters: {
        getdiscount: function(val) {
            if (val.nodeType === 0) {
                return '住宿';
            }
            if (val.nodeType === 3) {
                return '商超';
            }
            return val.nodeName;
        }
    },
    methods: {
        close() {
            event.$emit('showListSuc');
        },
        showlist() {
            event.$emit('showlist');
        },
        showbtn1() {
            event.$emit('showbtn1');
            this.close();
        },
        showbtn2() {
            event.$emit('showbtn2');
            this.close();
        },
        showbtn3() {
            event.$emit('showbtn3');
            this.close();
        },
        showlistcheck() {
            event.$emit('showlistcheck');
            // this.close();
        }
    }
};
</script>
