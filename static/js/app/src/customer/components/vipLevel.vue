<template>
    <div class="vipCard">
        <div class="vipCardTitle"><span class="vipCardRed"> <span v-show='namewarn && edit'>*</span></span>
            <input type="text" v-model='vipCard.name' placeholder="请输入会员卡等级名称" v-if='edit' maxlength='16'>
            <span v-else>{{vipCard.name}}</span>
            <span>
                <div class="vipCardWarn" v-if='namewarn && edit' >↑必填字段</div>
            </span>
            <span v-if='!edit' style="cursor:pointer"><span @click='editChange'>编辑</span>／<span @click='delet'>删除</span></span>
        </div>
        <div class="vipCardCantain" :class='toggle ? "vipCardMore" : ""'>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">优惠折扣 <span v-if='edit'><span class="vipCardBoxtitleTip" >请输入0.1-9.9之间的数字</span><span class="vipCardBoxSwitch"><switchbtn v-model='vipCard.discountAble'></switchbtn></span></span>
                </div>
                <div class="vipCardBoxCantain">
                    <div style="inline-block">
                        <div class="df" v-for='(item, index) in vipCard["discountItems"]'>
                            <label for="" class="vipCardRoomLabel">{{item.nodeName}}</label><span v-if='edit'><input type="number" max="9.9" min='0.1' v-model='item.discount' class="vipCardSInput"/>折<img @click='deleteNode("discountItems", index)'  src="/static/image/modal/room_modal_delete.png" alt="" style="cursor: pointer;margin-left:30px;"> </span> <span v-else>{{item.discount}}折</span>
                        </div>
                    </div>
                    <div class="vipCardChose" @click='openSelectNode("discountItems")' v-if='edit'>选择项目</div>
                </div>
            </div>
            <div class="vipCardBox">
                <div class="vipCardBoxtitle">可支付项目<span v-if='edit' class="vipCardBoxSwitch"><switchbtn v-model='vipCard.payAble'></switchbtn></span></div>
                <div class="vipCardBoxCantain">
                <div style="display:inline-block">
                    <div class="df" v-for='(item, index) in vipCard["payableItems"]'>
                        <label for="" class="vipCardRoomLabel">{{item.nodeName}}</label><span v-if='edit'><img  @click='deleteNode("payableItems", index)' src="/static/image/modal/room_modal_delete.png" alt="" style="cursor: pointer;margin-left:95px;"> </span></div>
                        </div>
                    <div class="vipCardChose" v-if='edit' @click='openSelectNode("payableItems")'>选择项目</div>
                </div>
            </div>
            <div v-if='edit' style="text-align:right">
                <div class="dd-btn  dd-btn-ghost" style="margin-right:20px;" @click='canel'>取消</div>
                <div class="dd-btn  dd-btn-primary" @click='subDate'>保存</div>
            </div>
        </div>
        <categorySelect :onConfirm="handleCategorySelect" :type="'discount'" :list="nodes" />
    </div>
</template>
<style lang='sass' scoped>
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
        .vipCardBox {
            background: #ffffff;
            box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.15);
            border-radius: 2px 2px 2px 2px;
            margin-bottom: 15px;
            .vipCardBoxtitle {
                background: #f0f0f0;
                height: 32px;
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
                    margin-left: 30px;
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
import categorySelect from './categorySelect.vue';
import http from '../../common/http';
import switchbtn from '../../common/components/switch.vue';
import modal from '../../common/modal';
export default {
    props: {
        data: {
            type: Object
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
            selectType: undefined,
            selectItem: undefined,
            vipCard: this.getdata(),
            namewarn: false,
            edit: this.editor,
        };
    },
    components: {
        categorySelect,
        switchbtn
    },
    methods: {
        canel() {
            this.vipCard = this.getdata();
            this.edit = false;
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
            if (this.vipCard.discountItems) {
                for (let i = 0; i < this.vipCard.discountItems.length; i ++) {
                    this.vipCard.discountItems[i].discount = parseFloat(this.vipCard.discountItems[i].discount);
                    if (!/^0\.[1-9]$|^[1-9]\.[0-9]$|^[1-9]$/.test(this.vipCard.discountItems[i].discount)) {
                        modal.warn('优惠折扣 请输入0.1-9.9之间正确的折扣数字');
                        return false;
                    }
                }
            }
            const data = Object.assign({}, this.vipCard);
            data.discountItems = JSON.stringify(data.discountItems);
            http.get('/vipCard/addOrEditVipCardSettings', data).then(res => {
                this.edit = false;
                this.$emit('addCard');
            });
        },
        handleCategorySelect(list) {
            if (this.vipCard[this.selectType].lenght) {
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
        },
        deleteNode(item, index) {
            this.vipCard[item].splice(index, 1);
        },
        // type:可支付项目或优惠折扣，item
        openSelectNode(type) {
            this.selectType = type;
            this.nodes = this.vipCard[type];
            this.selectItem = type;
            // this.nodes = item[type];
            $('#categorySelectModal').modal('show');
        }
    }
};
</script>
