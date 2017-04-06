<template>
    <div class="noVipContent">
        <div class="noVipitem">
            <div class="noVipEntitem"><span class="noVipLabel">企业类型</span>{{ data.companyType ? '可挂账' : '不可挂账' }}
            </div>
            <div class="noVipEntitem"><span class="noVipLabel">充值金额</span>￥{{data.rechargeFee}}</div>
        </div>
        <div class="noVipitem">
            <div class="noVipEntitem"><span class="noVipLabel">协议编号</span>{{data.contractNum || '无'}}</div>
            <div class="noVipEntitem" v-if='data.companyType'><span class="noVipLabel">挂帐金额</span>￥{{data.ledgerFee}}</div>
        </div>
        <div class="noVipitem">
            <div class="noVipEntitem"><span class="noVipLabel">联系人</span>{{data.contactName || '无'}}</div>
            <div class="noVipEntitem"><span class="noVipLabel">消费金额</span>￥{{data.consumeFee }}</div>
        </div>
        <div class="noVipitem">
            <div class="noVipEntitem"><span class="noVipLabel">联系号码</span>{{data.contactPhone || '无'}}</div>
            <div class="noVipEntitem"><span class="noVipLabel">订单数</span>{{data.orderCount || 0}}</div>
        </div>
        <div class="noVipitem">
            <div class="noVipEntitem"><span class="noVipLabel">企业地址</span>{{data.companyName}}</div>
            <div class="noVipEntitem"><span class="noVipLabel">创建时间</span>{{data.creationTime}}</div>
        </div>
        <div class="noVipitem">
            <div class="noVipEntitem" style="display:inline-flex"><span class="noVipLabel" style="display:inline-flex">优惠折扣</span>
                <div v-for='item in data.discounts' class="detailDiscout">
                    <div><span>{{item  | getdiscount}}</span>{{item.discount}}折</div>
                    <div><span>{{item  | getdiscount}}</span>{{item.discount}}折</div>
                </div>
            </div>
            <div class="noVipEntitem" style="display:inline-flex"><span class="noVipLabel">备注</span>
            <span class="remarkDetail">{{data.remark || '无'}}</span></div>
        </div>
    </div>
</template>
<style scoped>
.noVipitem{
    margin-bottom: 20px;
}
.detailDiscout {
    display: inline-block;
}
.detailDiscout span {
    margin-right: 40px;
}
.detailDiscout > div {
    display: inline-flex;margin-bottom: 10px;
    width: 150px;
}
.noVipEntitem {
    width: 360px;
    display: inline-block;
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
