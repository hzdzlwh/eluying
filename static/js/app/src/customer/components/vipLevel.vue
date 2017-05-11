<template>
    <div class="vipLevel">
        <div class="vipLevelTitle"><span class="vipLevelRed"> <span v-show='namewarn && edit'>*</span></span>
            <input type="text" v-model='vipLevel.name' placeholder="请输入会员卡等级名称" v-if='edit' maxlength='16'>
            <span v-else>{{vipLevel.name}}</span>
            <span>
                <div class="vipLevelWarn" v-if='namewarn && edit' >↑必填字段</div>
            </span>
            <span v-if='!edit' style="cursor:pointer"><span @click='editChange'>编辑</span>／<span @click='delet'>删除</span></span>
        </div>
        <div class="vipLevelCantain" :class='toggle ? "vipLevelMore" : ""'>
            <div class="vipLevelBox">
                <div class="vipLevelBoxtitle">优惠折扣 <span v-if='edit'><span class="vipLevelBoxtitleTip" >请输入0.1-9.9之间的数字</span><span class="vipLevelBoxSwitch"><switchbtn v-model='vipLevel.discountAble'></switchbtn></span></span>
                </div>
                <div class="vipLevelBoxCantain">
                    <div class="df" v-for='(item, index) in vipLevel["discountItems"]'>
                        <label for="" class="vipLevelRoomLabel">{{item.nodeName}}</label><span v-if='edit'><input type="number" v-model='item.discount' class="vipLevelSInput"/>折<img @click='deleteNode(vipLevel["discountItems"], index)'  src="/static/image/modal/room_modal_delete.png" alt="" style="cursor: pointer;margin-left:30px;"> </span> <span v-else>{{item.discount}}折</span>
                    </div>
                    <div class="vipLevelChose" @click='openSelectNode("discountItems")' v-if='edit'>选择项目</div>
                </div>
            </div>
            <div class="vipLevelBox">
                <div class="vipLevelBoxtitle">累计消费金额<span v-if='edit' class="vipLevelBoxSwitch"><switchbtn v-model='vipLevel.payAble'></switchbtn></span></div>
                <div class="vipLevelBoxCantain">
                    <div class="df" v-for='(item, index) in vipLevel["payableItems"]'>
                        <label for="" class="vipLevelRoomLabel">{{item.nodeName}}</label><span v-if='edit'><img  @click='deleteNode(vipLevel[payableItems], index)' src="/static/image/modal/room_modal_delete.png" alt="" style="cursor: pointer;margin-left:95px;"> </span></div>
                    <div class="vipLevelChose" v-if='edit' @click='openSelectNode("payableItems", vipLevel)'>选择项目</div>
                </div>
            </div>
            <div v-if='edit' style="text-align:right">
                <div class="dd-btn  dd-btn-ghost" style="margin-right:20px;" @click='canel'>取消</div>
                <div class="dd-btn  dd-btn-primary" @click='subDate'>保存</div>
            </div>
        </div>
        <categorySelect :onConfirm="handleCategorySelect" :type="'consume'" :list="nodes" />
    </div>
</template>
<style lang='sass' scoped>
.vipLevel {
    .vipLevelRed {
        font-size: 12px;
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
    .vipLevelCantain {
        padding: 20px;
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
                .vipLevelChose {
                    font-size: 14px;
                    color: #178ce6;
                    padding-bottom: 10px;
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
import categorySelect from './categorySelect.vue';
import http from '../../common/http';
import switchbtn from '../../common/components/switch.vue';
import modal from '../../common/modal';
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
    data() {
        return {
            applyStrategyWarn: false,
            nodes: [],
            consume: [],
            selectType: 'discount',
            selectItem: undefined,
            vipLevel: this.getdata(),
            namewarn: false,
            edit: this.editor
        };
    },
    components: {
        categorySelect,
        switchbtn
    },
    methods: {
        canel() {
            this.vipLevel = this.getdata();
            this.edit = false;
        },
        getdata() {
            const cardData = JSON.parse(JSON.stringify(this.data));
            for (const key in cardData) {
                if (cardData[key] === null) {
                    switch (key) {
                        case 'discountItems':
                            cardData[key] = [];
                            break;
                        default:
                            cardData[key] = {};
                    }
                    cardData[key] = {};
                }
            }
            return cardData;
        },
        editChange() {
            this.edit = true;
        },
        delet() {
            const callback = () => {
                http.get('/vipLevel/deleteVipCardCategory', {
                    categoryId: this.vipLevel.categoryId
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
            this.viceApplyFeeWarn = false;
            if (!this.vipLevel.name) {
                this.namewarn = true;
                return;
            }
            if (!(Number(this.vipLevel.viceApplyFee) >= 0 && this.vipLevel.viceApplyFee !== '' && Number(this.vipLevel.viceMaxAmount) >= 0 && this.vipLevel.viceMaxAmount !== '' && Number(this.vipLevel.viceMaxAmount) <= 20 && this.vipLevel.viceMaxAmount !== '')) {
                this.viceApplyFeeWarn = true;
                return;
            }
            const data = Object.assign({}, this.vipLevel);
            data.rechargeItems = JSON.stringify(data.rechargeItems);
            data.applyStrategy = JSON.stringify(data.applyStrategy);
            http.get('/vipLevel/addOrEditVipCardSettings', data).then(res => {
                this.edit = false;
                this.$emit('addCard');
            });
        },
        handleCategorySelect(list) {
            if (this.selectType === 'consume') {
                this.consume = list;
            } else {
                if (this.vipLevel[this.selectType]) {
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
            }
        },
        deleteNode(item, index) {
            item.splice(index, 1);
        },
        // type:可支付项目或优惠折扣，item
        openSelectNode(type) {
            this.selectType = type;
            this.nodes = this.vipLevel[type];
            // this.nodes = item[type];
            $('#categorySelectModal').modal('show');
        }
    }
};
</script>
