<template>
    <div class="vipLevel">
        <div class="vipLevelTitle"><span class="vipLevelRed"> <span v-show='namewarn && edit'>*</span></span>
            <input type="text" v-model='vipLevel.levelName' placeholder="请输入会员卡等级名称" v-if='edit' maxlength='16'>
            <span v-else>{{vipLevel.levelName}}</span>
            <span>
                <div class="vipLevelWarn" v-if='namewarn && edit' >↑必填字段</div>
            </span>
            <span v-if='!edit' class="vipLevelEdit"><span @click='editChange'>编辑</span>／<span @click='delet'>删除</span></span>
        </div>
        <div class="vipLevelCantain">
            <div class="vipLevelBox">
                <div class="vipLevelBoxtitle">优惠折扣 <span v-if='edit'><span class="vipLevelBoxtitleTip" >请输入0.1-9.9之间的数字</span></span>
                </div>
                <div class="vipLevelBoxCantain">
                    <div class="vipLevelCantainLeft" v-if='vipLevel["discountInfoList"].length'>
                        <div class="df" v-for='(item, index) in vipLevel["discountInfoList"]'>
                            <label for="" class="vipLevelRoomLabel">{{item.nodeName}}</label><span v-if='edit'><input type="number" max="9.9" min='0.1' v-model='item.discount' class="vipLevelSInput"/>折<img @click='deleteNode("discountInfoList", index)'  src="/static/image/modal/room_modal_delete.png" alt="" style="cursor: pointer;margin-left:30px;"> </span> <span v-else>{{item.discount}}折</span>
                        </div>
                    </div>
                    <div class="vipLevelChose" @click='openSelectNode("discountInfoList")' v-if='edit'>选择项目</div>
                </div>
            </div>
            <div class="vipLevelBox" v-if='type'>
                <div class="vipLevelBoxtitle">累计消费金额</div>
                <div class="vipLevelBoxCantain">
                    <div>累计消费金额：达到该等级需要累计消费金额
                        <input type="number" class="vipLevelMInput" v-model='vipLevel.thresholdFee' v-if='edit'><span v-else>{{vipLevel.thresholdFee}}</span>元</div>
                    <div class="level-tip">成为会员后，在【消费业态】中累计消费金额达到【升级条件】后自动升级为该级别会员</div>
                </div>
                <div class="vipLevelTipBoxCantain">
                    <div>累计项目：</div>
                    <div class="vipLevelTipBoxList">
                        <div style="" v-for='list in vipLevelList'>
                            <div v-if='vipLevel["consumeItems"].filter(function(item){ return item.nodeType === list.id }).length'>
                                <span style="display: inline-block;margin: 10px 5px;">{{list.name}}：</span>
                                <div class="df" v-for='(item, index) in vipLevel["consumeItems"]' v-if='item.nodeType === list.id'>
                                    <label for="" class="vipLevelRoomLabel"><span class="VipCardListName" :title='item.nodeName'>{{item.nodeName}}</span>：每消费1元，累计消费金额增长</label>
                                    <span v-if='edit'>
                            <input type="number" max="9.9" min='0.1' v-model='item.growthValue' class="vipLevelSInput"/>元
                            <span class="level-tip">(请输入0.1-9.9之间的数字)</span>
                                    <img @click='deleteNode("consumeItems", index)' src="/static/image/modal/room_modal_delete.png" alt="" style="cursor: pointer;margin-left:30px;">
                                    </span>
                                    <span v-else>{{item.growthValue}}元</span>
                                </div>
                            </div>
                        </div>
                        <div class="vipLevelChose" v-if='edit' @click='openSelectNode("consumeItems")'>选择项目</div>
                    </div>
                </div>
            </div>
            <div v-if='edit' style="text-align:right">
                <div class="dd-btn  dd-btn-ghost" style="margin-right:20px;" @click='canel'>取消</div>
                <div class="dd-btn  dd-btn-primary" @click='subDate'>保存</div>
            </div>
        </div>
        
    </div>
</template>
<style lang='sass' scoped>
.vipLevel {
    .vipLevelEdit{
        font-size: 14px;
        color: #178ce6;
        float: right;
        margin-right: 20px;
        cursor: pointer;
    }
    .vipLevelRed {
        font-size: 14px;
        color: #f24949;
        width: 14px;
        display: inline-block;
        margin-left: 6px;
    }
    .vipLevelBoxWarn {
        font-size: 12px;
        color: #f24949;
        line-height: 12px;
    }
    .vipLevelWarn {
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
    .vipLevelTitle {
        padding: 15px 0;
        background: #f0f0f0;
    }
    .vipLevelTipBoxCantain {
        border-top: 1px solid #e6e6e6;
        padding: 10px 20px;
        .vipLevelTipBoxList {
            background: #f7f7f7;
            padding: 15px 10px;
            .VipCardListName {
                max-width: 90px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
    .vipLevelChose {
        font-size: 14px;
        color: #178ce6;
        padding-top: 0px;
        position: relative;
        top: 2px;
        padding-bottom: 10px;
        cursor: pointer;
        display: inline-block;
    }
    .vipLevelCantain {
        padding: 20px;
        .vipLevelCantainLeft {
            display: inline-block;
            margin-right: 30px;
        }
        .vipLevelBox {
            background: #ffffff;
            box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.15);
            border-radius: 2px 2px 2px 2px;
            margin-bottom: 15px;
            .vipLevelBoxtitle {
                background: #f0f0f0;
                height: 32px;
                line-height: 32px;
                padding: 0 15px;
                color: #666;
                .vipLevelBoxSwitch {
                    float: right;
                }
                .vipLevelBoxtitleTip {
                    color: #999;
                    margin-left: 10px;
                    font-size: 12px;
                }
            }
            .level-tip {
                font-size: 12px;
                color: #999999;
            }
            .vipLevelRule {
                padding-bottom: 15px!important;
            }
            .vipLevelBoxCantain {
                color: #666;
                padding: 10px 20px 0;
                .vipLevelSInput {
                    width: 50px;
                    margin-right: 5px;
                }
                .vipLevelMInput {
                    width: 100px;
                    margin-right: 5px;
                }
                .df {
                    display: flex;
                    line-height: 24px;
                }
                .vipLevelRoomLabel {
                    width: 240px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    height: 24px;
                    line-height: 24px;
                }
                .vipLevelMoreShow {
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
            type: Object
        },
        editor: {
            type: Boolean,
            default: true
        },
        type: {
            type: Number,
            default: 0
        }

    },
    data() {
        return {
            applyStrategyWarn: false,
            nodes: [],
            consume: [],
            selectType: undefined,
            categoryOpen: false,
            vipLevel: this.getdata(),
            namewarn: false,
            edit: this.editor,
            vipLevelList: [{
                id: 0,
                name: '住宿'
            }, {
                id: 1,
                name: '餐饮'
            }, {
                id: 2,
                name: '娱乐'
            }, {
                id: 3,
                name: '商超'
            }],
            vipLevelCount: {
                0: 0,
                1: 0,
                2: 0,
                3: 0
            },
            url: this.type ? '/vipUser/createEditVipLevel' : ' /vipUser/createEditVipLevelNotAuto'
        };
    },
    components: {
        switchbtn
    },
    methods: {
        canel() {
            if (this.vipLevel.vipLevelSettingId) {
                this.vipLevel = this.getdata();
                this.edit = false;
            } else {
                this.$emit('delet');
            }
        },
        getdata() {
            const cardData = JSON.parse(JSON.stringify(this.data));
            for (const key in cardData) {
                if (cardData[key] === null) {
                    if (key === 'applyStrategy') {
                        cardData[key] = {};
                    }
                    if (key === 'discountInfoList' || key === 'consumeItems' || key === 'rechargeItems') {
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
            this.$emit('delet', this.vipLevel.vipLevelSettingId);
            // const callback = () => {
            //     http.get('/vipUser/removeVipLevel', {
            //         vipLevelId: this.vipLevel.vipLevelSettingId
            //     })
            //         .then(res => {
            //             this.$emit('delet');
            //         });
            // };
            // if (this.vipLevel.vipLevelSettingId) {
            //     this.$emit('delet', this.vipLevel.vipLevelSettingId);
            //     modal.confirm({
            //         message: '删除后，所有该类型会员卡将会被删除，请先将它们置于失效状态',
            //         title: '删除会员卡'
            //     }, callback);
            // } else {
            //     this.$emit('delet');
            // }
        },
        subDate() {
            this.namewarn = false;
            if (!this.vipLevel.levelName) {
                this.namewarn = true;
                return;
            }
            if (this.vipLevel.thresholdFee < 0 || !this.vipLevel.thresholdFee) {
                modal.warn('可支付项目累计金额 请输入0及以上的数字');
                return;
            }
            if (this.vipLevel.consumeItems) {
                for (let i = 0; i < this.vipLevel.consumeItems.length; i ++) {
                    this.vipLevel.consumeItems[i].growthValue = parseFloat(this.vipLevel.consumeItems[i].growthValue);
                    if (!/^0\.[1-9]$|^[1-9]\.[0-9]$|^[1-9]$/.test(this.vipLevel.consumeItems[i].growthValue)) {
                        modal.warn('可支付项目 请输入0.1-9.9之间正确的折扣数字');
                        return false;
                    }
                }
            }
            if (this.vipLevel.discountInfoList) {
                for (let i = 0; i < this.vipLevel.discountInfoList.length; i ++) {
                    this.vipLevel.discountInfoList[i].discount = parseFloat(this.vipLevel.discountInfoList[i].discount);
                    if (!/^0\.[1-9]$|^[1-9]\.[0-9]$|^[1-9]$/.test(this.vipLevel.discountInfoList[i].discount)) {
                        modal.warn('优惠折扣 请输入0.1-9.9之间正确的折扣数字');
                        return false;
                    }
                }
            }
            const data = Object.assign({}, this.vipLevel);
            data.discountListReq = JSON.stringify(data.discountInfoList);
            delete data.discountInfoList;
            if (this.type) {
                data.consumeListReq = JSON.stringify(data.consumeItems);
                delete data.consumeItems;
            }
            http.post(this.url, data).then(res => {
                this.edit = false;
                this.$emit('addCard');
            });
        },
        handleCategorySelect(list) {
            if (this.vipLevel[this.selectType].length) {
                const newList = [];
                list.map(item => {
                    const result = this.vipLevel[this.selectType].find(i => i.id === item.id && i.nodeType === item.nodeType);
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
                this.vipLevel[this.selectType] = newList;
            } else {
                this.vipLevel[this.selectType] = list;
            }
            bus.$off('vipLevelCategory');
        },
        deleteNode(item, index) {
            this.vipLevel[item].splice(index, 1);
        },
        // type:可支付项目或优惠折扣，item
        openSelectNode(type) {
            this.$emit('select', this.vipLevel[type]);
            bus.$on('vipLevelCategory', this.handleCategorySelect);
            this.selectType = type;
            // this.nodes = item[type];
        }
    }
};
</script>
