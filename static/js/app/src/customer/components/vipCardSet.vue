<template>
    <div class="vipCard">
        <div class="vipCardTitle"><span class="vipCardRed"> <span v-show='namewarn && edit'>*</span></span>
            <input type="text" v-model='vipCard.name' placeholder="请输入会员卡等级名称" v-if='edit' maxlength='16'>
            <span v-else>{{vipCard.name}}</span>
            <span>
                <div class="vipCardWarn" v-if='namewarn && edit' >↑必填字段</div>
            </span>
            <span v-if='!edit' class="vipCardEdit"><span @click='editChange'>编辑</span>／<span @click='delet'>删除</span></span>
        </div>
        <div class="vipCardCantain" :class='toggle ? "vipCardMore" : ""'>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">优惠折扣 <span><span class="vipCardBoxtitleTip" >请输入0.1-9.9之间的数字</span><span class="vipCardBoxSwitch"><switchbtn v-model='vipCard.discountAble' :disabled='!edit'></switchbtn></span></span>
                </div>
                <div class="vipCardBoxCantain">
                    <div class="vipCardBoxList"  v-if='vipCard["discountItems"].length'>
                        <div class="df" v-for='(item, index) in vipCard["discountItems"]'>
                            <label for="" class="vipCardRoomLabel">{{item.nodeName}}</label><span v-if='edit'><input type="number" max="9.9" min='0.1' v-model='item.discount' class="vipCardSInput"/>折<img @click='deleteNode("discountItems", index)'  src="/static/image/modal/room_modal_delete.png" alt="" style="cursor: pointer;margin-left:30px;"> </span> <span v-else>{{item.discount}}折</span>
                        </div>
                    </div>
                    <div class="vipCardChose" @click='openSelectNode("discountItems")' v-if='edit'>选择项目</div>
                </div>
            </div>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">可支付项目<span  class="vipCardBoxSwitch"><switchbtn v-model='vipCard.payAble' :disabled='!edit'></switchbtn></span></div>
                <div class="vipCardBoxCantain">
                    <div class="vipCardBoxList" v-if='vipCard["payableItems"].length'>
                        <div class="df" v-for='(item, index) in vipCard["payableItems"]'>
                            <label for="" class="vipCardRoomLabel">{{item.nodeName}}</label><span v-if='edit'><img  @click='deleteNode("payableItems", index)' src="/static/image/modal/room_modal_delete.png" alt="" style="cursor: pointer;margin-left:95px;"> </span></div>
                    </div>
                    <div class="vipCardChose" v-if='edit' @click='openSelectNode("payableItems")'>选择项目</div>
                </div>
            </div>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">办卡方案<span class="vipCardBoxSwitch" ><switchbtn v-model='vipCard.applyAble' :disabled='!edit'></switchbtn></span>
                    <div class="vipCardBoxWarn" v-if='applyStrategyWarn && edit'>↑该项填写有误</div>
                </div>
                <div class="vipCardBoxCantain">
                    <div class="df">
                        <label for="" class="vipCardRoomLabel">卡费</label>
                        <span v-if='edit'><input type="number" v-model='vipCard.applyStrategy.cardFee' class="vipCardMInput">元</span> <span v-else>{{vipCard.applyStrategy.cardFee}}元</span></div>
                    <div class="df">
                        <label for="" class="vipCardRoomLabel">充值金额</label>
                        <span v-if='edit'>
                        <input type="number" v-model='vipCard.applyStrategy.rechargeFee' class="vipCardMInput">元</span><span v-else>{{vipCard.applyStrategy.rechargeFee}}元</span></div>
                    <div class="df">
                        <label for="" class="vipCardRoomLabel">赠送金额</label>
                        <span v-if='edit'>
                        <input type="text" v-model='vipCard.applyStrategy.freeFee' class="vipCardMInput">元</span><span v-else>{{vipCard.applyStrategy.freeFee}}元</span></div>
                </div>
            </div>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">使用规则<span  class="vipCardBoxSwitch"><switchbtn v-model='vipCard.thresholdAble' :disabled='!edit'></switchbtn></span>
                    <div class="vipCardBoxWarn" v-if='thresholdFeeWarn && edit'>↑该项填写有误</div>
                </div>
                <div class="vipCardBoxCantain vipCardRule">
                    账户余额小于等于
                    <input type="number" v-model='vipCard.thresholdFee' v-if='edit'> <span v-else>{{vipCard.thresholdFee}}</span>元时不可用
                </div>
            </div>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">充值<span  class="vipCardBoxSwitch"><switchbtn v-model='vipCard.rechargeAble' :disabled='!edit'></switchbtn></span></div>
                <div class="vipCardBoxCantain">
                    <div style="display:inline-block">
                        <div class="df" v-for='(item,index) in vipCard.rechargeItems'>
                            <span>充<input type="number" v-model='item.rechargeFee' class=" vipCardMInput" v-if='edit'> <span v-else>{{item.rechargeFee}}</span>元，送
                            <input type="number" v-model='item.freeFee' class="vipCardMInput" v-if='edit'> <span v-else>{{item.freeFee}}</span>元 <img src="/static/image/modal/room_modal_delete.png" v-if='edit' alt="" style="cursor: pointer;margin-left:50px;" @click='deletRule(index)'></span>
                        </div>
                    </div>
                    <div class="vipCardChose" v-if='edit' @click='addRule' style="margin-top:10px;">添加规则</div>
                </div>
            </div>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">补办<span class="vipCardBoxSwitch"><switchbtn v-model='vipCard.reapplyAble' :disabled='!edit'></switchbtn></span>
                    <div class="vipCardBoxWarn" v-if='reapplyMasterFeeWarn && edit'>↑该项填写有误</div>
                </div>
                <div class="vipCardBoxCantain">
                    <div class="df">
                        <label for="" class="vipCardRoomLabel">主卡补办费用：</label>
                        <span v-if='edit'>
                        <input type="number" v-model='vipCard.reapplyMasterFee' class="vipCardMInput">元</span><span v-else>{{vipCard.reapplyMasterFee}}元</span></div>
                    <div class="df">
                        <label for="" class="vipCardRoomLabel">副卡补办费用：</label>
                        <span v-if='edit'>
                        <input type="number" v-model='vipCard.reapplyViceFee' class="vipCardMInput">元</span> <span v-else>{{vipCard.reapplyViceFee}}元</span></div>
                </div>
            </div>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">转赠<span class="vipCardBoxSwitch" ><switchbtn v-model='vipCard.givingAble' :disabled='!edit'></switchbtn></span>
                    <div class="vipCardBoxWarn" v-if='givingIntervalWarn && edit'>↑该项填写有误</div>
                </div>
                <div class="vipCardBoxCantain">
                    <div class="df" style="margin-bottom:10px">规则：每
                        <input type="text" v-model='vipCard.givingInterval' v-if='edit' class="vipCardSInput"> <span v-else>{{vipCard.givingInterval}}</span>天，可转赠
                        <input type="number" v-model='vipCard.givingAmount' v-if='edit' class="vipCardSInput"> <span v-else>{{vipCard.givingAmount}}</span>次</div>
                    <div style="padding-bottom:10px">费用：
                        <input type="number" v-model='vipCard.givingFee' v-if='edit' class="vipCardMInput"> <span v-else>{{vipCard.givingFee}}</span>元／次</div>
                </div>
            </div>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">副卡<span class="vipCardBoxSwitch"><switchbtn   v-model='vipCard.viceAble' :disabled='!edit'></switchbtn></span>
                    <div class="vipCardBoxWarn" v-if='viceApplyFeeWarn && edit'>{{viceApplyFeeWarn === 1 ? '费用填写错误' : '数量请输入1-20之间的数字'}}</div>
                </div>
                <div class="vipCardBoxCantain">
                    <div class="df">费用：
                        <input type="number" v-model='vipCard.viceApplyFee' v-if='edit' class="vipCardMInput"> <span v-else>{{vipCard.viceApplyFee}}</span>元</div>
                    <div>数量：一张主卡最多可办理
                        <input type="number" v-model='vipCard.viceMaxAmount' class="vipCardSInput" v-if='edit'><span v-else>{{vipCard.viceMaxAmount}}</span>张副卡<span v-if='edit' style='font-size:12px;color:#999'>(请输入1-20之间的数字)</span></div>
                </div>
            </div>
            <div><span :class='toggle ? "vipCardMoreShow" : "vipCardMoreHide"' @click='toggle = !toggle'>{{toggle ? "显示" : "隐藏"}}高级设置</span></div>
            <div v-if='edit' style="text-align:right">
                <div class="dd-btn  dd-btn-ghost" style="margin-right:20px;" @click='canel'>取消</div>
                <div class="dd-btn  dd-btn-primary" @click='subDate'>保存</div>
            </div>
        </div>
        <!-- <categorySelect :onConfirm="handleCategorySelect" :type="'discount'" :list="nodes" /> -->
    </div>
</template>
<style lang='sass' scoped>
.vipCardMoreShow {
    font-size: 14px;
    color: #178ce6;
    cursor: pointer;
    &:before {
        width: 8px;
        height: 8px;
        background-image: url(/static/image/spriteImages/hidetip.png);
        content: '';
        display: inline-block;
        margin-right: 3px
    }
}

.vipCardEdit {
    font-size: 14px;
    color: #178ce6;
    float: right;
    margin-right: 20px;
    cursor: pointer;
}

.vipCardMoreHide {
    cursor: pointer;
    font-size: 14px;
    color: #178ce6;
    &:before {
        width: 8px;
        height: 8px;
        background-image: url(/static/image/spriteImages/showtip.png);
        content: '';
        display: inline-block;
        margin-right: 3px
    }
}

.vipCardMore {
    .vipCardBox {
        display: none;
        &:first-child {
            display: block;
        }
    }
}

.vipCard {
    .vipCardRed {
        font-size: 14px;
        color: #f24949;
        width: 14px;
        display: inline-block;
        margin-left: 6px;
    }
    .vipCardBoxWarn {
        font-size: 12px;
        color: #f24949;
        line-height: 12px;
    }
    .vipCardWarn {
        font-size: 12px;
        color: #f24949;
        margin-left: 25px;
    }
    input,
    select {
        background: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 2px;
        height: 24px;
        outline: none!important;
        font-size: 14px;
    }
    background:#ffffff;
    box-shadow:0px 0px 5px 0px rgba(0, 0, 0, 0.15);
    border-radius:2px;
    border-top:4px solid #178ce6;
    width: 730px;
    .vipCardTitle {
        padding: 15px 0;
        background: #f0f0f0;
    }
    .vipCardCantain {
        padding: 20px;
        .vipCardBoxList {
            display: inline-block;
            margin-right: 30px;
        }
        .vipCardBox {
            background: #ffffff;
            box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.15);
            border-radius: 2px 2px 2px 2px;
            margin-bottom: 15px;
            .vipCardBoxtitle {
                background: #f0f0f0;
                /*height: 32px;*/
                line-height: 32px;
                padding: 0 15px;
                color: #666;
                .vipCardBoxSwitch {
                    float: right;
                }
                .vipCardBoxtitleTip {
                    color: #999;
                    margin-left: 10px;
                    font-size: 12px;
                }
            }
            .vipCardRule {
                padding-bottom: 15px!important;
            }
            .vipCardBoxCantain {
                color: #666;
                padding: 10px 20px 0;
                .vipCardSInput {
                    width: 50px;
                    margin-right: 5px;
                }
                .vipCardMInput {
                    width: 100px;
                    margin-right: 5px;
                }
                .df {
                    display: flex;
                    line-height: 24px;
                }
                .vipCardChose {
                    font-size: 14px;
                    color: #178ce6;
                    padding-top: 0px;
                    position: relative;
                    top: 2px;
                    padding-bottom: 10px;
                    cursor: pointer;
                    /*margin-left: 30px;*/
                    display: inline-block;
                }
                .vipCardRoomLabel {
                    width: 240px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    height: 24px;
                    line-height: 24px;
                }
                .vipCardMoreShow {
                    font-size: 14px;
                    color: #178ce6;
                }
            }
        }
    }
}
</style>
<script>
import http from '../../common/http';
import switchbtn from '../../common/components/switch.vue';
import modal from '../../common/modal';
import bus from '../event.js';
export default {
    props: {
        data: {
            type: Object,
            default: function() {
                return {
                    discountItems: [],
                    payableItems: [],
                    rechargeItems: [],
                    applyStrategy: {}
                    // payAble:true
                };
            }

        },
        toggleShow: {
            type: Boolean,
            default: true
        },
        editor: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        selectType(o, n) {
            // window.console.log(o + n);
        }
    },
    data() {
        return {
            viceApplyFeeWarn: false,
            givingIntervalWarn: false,
            reapplyMasterFeeWarn: false,
            thresholdFeeWarn: false,
            applyStrategyWarn: false,
            nodes: [],
            consume: [],
            selectType: undefined,
            selectItem: undefined,
            vipCard: this.getdata(),
            namewarn: false,
            edit: this.editor,
            toggle: this.toggleShow
        };
    },
    components: {
        switchbtn
    },
    methods: {
        canel() {
            if (this.vipCard.categoryId) {
                this.vipCard = this.getdata();
                this.edit = false;
            } else {
                this.$emit('delet');
            }
        },
        deletRule(index) {
            this.vipCard.rechargeItems.splice(index, 1);
        },
        getdata() {
            const cardData = JSON.parse(JSON.stringify(this.data));
            for (const key in cardData) {
                if (cardData[key] === null) {
                    if (key === 'applyStrategy') {
                        cardData[key] = {};
                    }
                    if (key === 'discountItems' || key === 'payableItems' || key === 'rechargeItems') {
                        cardData[key] = [];
                    }
                }
            }
            return cardData;
        },
        editChange() {
            this.edit = true;
        },
        delet() {
            const callback = () => {
                http.get('/vipCard/deleteVipCardCategory', {
                    categoryId: this.vipCard.categoryId
                })
                    .then(res => {
                        this.$emit('delet');
                    });
            };
            modal.confirm({
                message: '删除后，所有该类型会员卡将会被删除，请先将它们置于失效状态',
                title: '删除会员卡'
            }, callback);
        },
        subDate() {
            this.namewarn = false;
            this.applyStrategyWarn = false;
            this.thresholdFeeWarn = false;
            this.reapplyMasterFeeWarn = false;
            this.givingIntervalWarn = false;
            this.viceApplyFeeWarn = false;
            if (!this.vipCard.name) {
                this.namewarn = true;
                return;
            }
            const reg = /^[0-9]{1,7}(\.[0-9]{0,2})?$/;
            if (!(reg.test(this.vipCard.applyStrategy.cardFee) && reg.test(this.vipCard.applyStrategy.freeFee) && reg.test(this.vipCard.applyStrategy.rechargeFee))) {
                this.applyStrategyWarn = true;
                return;
            }
            // if (!(Number(this.vipCard.applyStrategy.cardFee) >= 0 && this.vipCard.applyStrategy.cardFee !== '' && this.vipCard.applyStrategy.freeFee !== '' && Number(this.vipCard.applyStrategy.freeFee) >= 0 && this.vipCard.applyStrategy.rechargeFee !== '' && Number(this.vipCard.applyStrategy.rechargeFee) >= 0)) {
            //     this.applyStrategyWarn = true;
            //     return;
            // }
            if (this.vipCard.discountItems) {
                for (let i = 0; i < this.vipCard.discountItems.length; i ++) {
                    this.vipCard.discountItems[i].discount = parseFloat(this.vipCard.discountItems[i].discount);
                    if (!/^0\.[1-9]$|^[1-9]\.[0-9]$|^[1-9]$/.test(this.vipCard.discountItems[i].discount)) {
                        modal.warn('优惠折扣 请输入0.1-9.9之间正确的折扣数字');
                        return false;
                    }
                }
            }
            if (!(reg.test(this.vipCard.thresholdFee))) {
                this.thresholdFeeWarn = true;
                return;
            }
            if (!(reg.test(this.vipCard.reapplyMasterFee) && reg.test(this.vipCard.reapplyViceFee))) {
                this.reapplyMasterFeeWarn = true;
                return;
            }
            if (!(reg.test(this.vipCard.givingInterval) && reg.test(this.vipCard.givingFee) && /^[0-9]*$/.test(this.vipCard.givingAmount))) {
                this.givingIntervalWarn = true;
                return;
            }
            if (!(reg.test(this.vipCard.viceApplyFee))) {
                this.viceApplyFeeWarn = 1;
                return;
            }
            if (!(Number(this.vipCard.viceMaxAmount) > 0 && this.vipCard.viceMaxAmount !== '' && Number(this.vipCard.viceMaxAmount) <= 20 && this.vipCard.viceMaxAmount !== '')) {
                this.viceApplyFeeWarn = 2;
                return;
            }
            const data = Object.assign({}, this.vipCard);
            data.discountItems = JSON.stringify(data.discountItems);
            data.payableItems = JSON.stringify(data.payableItems);
            data.rechargeItems = JSON.stringify(data.rechargeItems);
            data.applyStrategy = JSON.stringify(data.applyStrategy);
            http.post('/vipCard/addOrEditVipCardSettings', data).then(res => {
                this.edit = false;
                this.$emit('addCard');
            });
        },
        addRule() {
            this.vipCard.rechargeItems.push({});
        },
        handleCategorySelect(list) {
            if (this.vipCard[this.selectType].length) {
                const newList = [];
                list.map(item => {
                    const result = this.vipCard[this.selectType].find(i => i.id === item.id && i.nodeType === item.nodeType);
                    if (result) {
                        if (item.selected) {
                            newList.push({ ...result
                            });
                        }
                    } else {
                        newList.push({ ...item
                        });
                    }
                });
                this.vipCard[this.selectType] = newList;
            } else {
                this.vipCard[this.selectType] = list;
            }
            bus.$off('vipCardCategory');
        },
        deleteNode(item, index) {
            this.vipCard[item].splice(index, 1);
        },
        // type:可支付项目或优惠折扣，item
        openSelectNode(type) {
            this.$emit('select', this.vipCard[type], type);
            bus.$on('vipCardCategory', this.handleCategorySelect);
            this.selectType = type;
        }
    }
};
</script>
