<template>
    <div class="vipCard">
        <div class="vipCardTitle">金卡<span><span>编辑</span>／<span>删除</span></span>
        </div>
        <div class="vipCardCantain">
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">优惠折扣<span></span></div>
                <div class="vipCardBoxCantain">
                    <label for="">住宿：</label><span><input type="text"/>折<a >删除</a><div>选择项目</div></span><span>请输入0.1-9.9之间的数字</span>
                </div>
            </div>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">可支付项目<span></span></div>
                <div class="vipCardBoxCantain">
                    <span>住宿<span>删除</span></span><span>住宿<span>删除</span></span><span>住宿<span>删除</span></span><span>选择项目</span>
                </div>
            </div>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">办卡方案<span></span></div>
                <div class="vipCardBoxCantain">
                    <div><span>卡费</span><span>充值金额</span><span>赠送金额</span></div>
                    <div><span><input type="text">元</span><span><input type="text">元</span><span><input type="text">元</span></div>
                </div>
            </div>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">使用规则<span></span></div>
                <div class="vipCardBoxCantain">
                    账户余额小于等于
                    <input type="text">元时不可用
                </div>
            </div>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">充值<span></span></div>
                <div class="vipCardBoxCantain">
                    <div>
                        <span>规则</span><span>冲<input type="text">元，送<input type="text">元 <span>删除</span></span>
                        <div><span>添加规则</span></div>
                    </div>
                </div>
            </div>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">补办<span></span></div>
                <div class="vipCardBoxCantain">
                    主卡补办费用：
                    <input type="text">元副卡补办费用：
                    <input type="text">元
                </div>
            </div>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">转增<span></span></div>
                <div class="vipCardBoxCantain">
                    <div>规则：每
                        <input type="text">
                        <select name="" id=""></select>，可转赠
                        <input type="text">次</div>
                    <div>费用：
                        <input type="text">元／次</div>
                </div>
            </div>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">副卡<span></span></div>
                <div class="vipCardBoxCantain">
                    <div>费用：
                        <input type="text">元</div>
                    <div>数量：一张主卡最多可办理
                        <input type="text">张副卡<span>请输入1-20之间的数字</span></div>
                </div>
            </div>
            <div><span>隐藏高级设置</span></div>
            <div>
                <div class="btn">取消</div>
                <div class="btn">保存</div>
            </div>
        </div>
        <categorySelect :onConfirm="handleCategorySelect" :type="'consume'" :list="nodes" />
    </div>
</template>
<style lang='sass'>
/*.vipCard {}*/
</style>
<script>
import categorySelect from './categorySelect.vue';
export default {
    prop: {
        data: Object,
        nodes: Array
    },
    computed: {
        vipCard() {
            return this.data;
        }
    },
    components: {
        categorySelect
    }
};
</script>
