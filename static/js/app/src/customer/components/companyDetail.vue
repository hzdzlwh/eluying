<template>
    <div class="noVipContent">
        <div class="noVipitem">
            <div class="noVipEntitem"><span class="noVipLabel">企业类型</span>{{
                        data.companyType ? '可挂账' : '不可挂账'
                    }}</div>
            <div class="noVipEntitem"><span class="noVipLabel">充值金额</span>￥{{data.rechargeFee}}</div>
        </div>
        <div class="noVipitem">
            <div class="noVipEntitem"><span class="noVipLabel">协议编号</span>{{data.contractNum}}</div>
            <div class="noVipEntitem" v-if='data.companyType'><span class="noVipLabel">挂帐金额</span>￥{{data.ledgerFee}}</div>
        </div>
        <div class="noVipitem">
            <div class="noVipEntitem"><span class="noVipLabel">联系人</span>{{data.contactName}}</div>
            <div class="noVipEntitem"><span class="noVipLabel">消费金额</span>￥{{data.consumeFee}}</div>
        </div>
        <div class="noVipitem">
            <div class="noVipEntitem"><span class="noVipLabel">联系号码</span>{{data.contactPhone}}</div>
            <div class="noVipEntitem"><span class="noVipLabel">订单数</span>{{data.orderCount}}</div>
        </div>

        <div class="noVipitem">
            <div class="noVipEntitem"><span class="noVipLabel">企业地址</span>{{data.companyName}}</div>
            <div class="noVipEntitem"><span class="noVipLabel">创建时间</span>{{data.creationTime}}</div>
        </div>
                <div class="noVipitem">
            <div class="noVipEntitem"><span class="noVipLabel">优惠折扣</span><div v-for='item in data.discounts'><span>{{item.nodeType  | getdiscount}}</span></div></div>
            <div class="noVipEntitem"><span class="noVipLabel">备注</span>{{data.remark}}</div>
        </div>
    </div>
</template>
<style scoped>
.noVipContent {
    padding: 0 24px;
}

.noVipEntitem {
    width: 360px;
    display: inline-block;
}

.noVipLabel {
    width: 60px;
    text-align: right;
    margin-right: 8px;
}
</style>
<script>
export default {
    props: {
        data: Object
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
    }
};
</script>
