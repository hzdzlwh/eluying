<template>
    <div class="modal fade selectComponentModal" id="goodsModal" tabindex="-1" role="dialog" aria-labelledby="goodsModal">
        <div class="modal-dialog goodsdialog" v-if='bill'>
            <div class="modal-content">
                <div class="goodsModals-header">
                    <div class="header-container">
                        <span class="header-text">选择商品</span>
                    </div>
                    <span class="close-icon" @click="hideModal()"></span>
                </div>
                <div class="goodsModal-body">
                    <div class="goodsLeft">
                        <div class="goodsLeft-item" v-for='item in goodsDate' :class='{goodsActive: item.cName === gIdActive.cName}' @click='changelist(item)'><span>{{item.cName}}</span>
                        </div>
                    </div>
                    <div class="goodsright">
                        <div class="goodsright-item" v-for='item in gListActive'>
                            <div><span class="goodsName" :title='item.n'>{{item.n}}</span><span class="goodsPrice">￥{{item.p}}</span>
                                <span>
                            <span class="goodsBtn" @click='changebill(item,false)'>-</span>
                                <input type="number" v-model="bill[item.i].num" class="goodsValue" />
                                <span class="goodsBtn" @click='changebill(item,true)'>+</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="goodsModal-foot">
                    <span class="goodsTotal">￥{{totalbill.total}} <span class="goodsCount">（共{{totalbill.count}}件商品）</span></span>
                    <span @click='goodsprogram' class='goodsSub'>确定</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import "~dd-common-css/src/variables";
#goodsModal {
    z-index: 1062;
}

.goodsdialog {
    width: 430px;
    height: 430px;
    margin-top: 0!important;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%)!important;
    transform: translate(-50%, -50%)!important;
}

.modal-content {
    width: 430px;
    border-radius: 2px;
    box-shadow: 0 0 5px 0;
    padding: 0;
    margin-top: 0 !important;
    background: #fafafa;
    box-sizing: content-box;
    border-top: 4px solid #178ce6;
}

.goodsModals-header {
    width: 100%;
    height: 53px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    .close-icon {
        display: inline-block;
        width: 14px;
        height: 14px;
        background: url("../../../../../../../image/modal/room_modal_close.png");
        background-size: contain;
        cursor: pointer;
    }
    .header-text {
        font-size: $font-size-lg;
        color: $gary-daker;
        font-weight: bold;
    }
}

.goodsModal-body {
    width: 100%;
    max-height: 320px;
    clear: both;
    overflow: auto;
    .goodsLeft {
        width: 125px;
        display: inline-block;
        height: 320px;
        float: left;
        overflow-y: auto;
        .goodsLeft-item {
            padding: 10px 20px;
            color: #999;
            text-align: center;
            border-bottom: 1px solid #e6e6e6;
            cursor: pointer;
        }
        .goodsActive {
            background: #fff;
        }
    }
    .goodsright {
        float: left;
        width: 305px;
        display: inline-block;
        overflow-y: auto;
        max-height: 320px;
        .goodsright-item {
            padding: 0 15px;
            background: #fff;
            &:hover {
                background: #e1effa;
            }
            .goodsName {
                width: 120px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
                margin-right: 5px;
            }
            .goodsPrice {
                width: 60px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
                margin-right: 5px;
                color: #4a90e2;
            }
            .goodsValue {
                width: 25px;
                border: none;
                text-align: center;
                background: none;
                color: #999;
            }
            .goodsBtn {
                color: #4a90e2;
                font-size: 12px;
                display: inline-block;
                height: 14px;
                line-height: 14px;
                border: 1px solid #4a90e2;
                padding: 0 4px;
                cursor: pointer;
            }
            > div {
                display: flex;
                border-bottom: 1px solid #e6e6e6;
                padding: 10px 0;
                cursor: pointer;
            }
        }
    }
}

.goodsModal-foot {
    clear: both;
    overflow: auto;
    border-top: 1px solid #e6e6e6;
    background: #fafafa;
    .goodsTotal {
        width: 330px;
        padding-left: 20px;
        line-height: 40px;
        font-size: 16px;
        color: #4a90e2;
        display: inline-block;
        box-sizing: border-box;
        float: left;
        .goodsCount {
            font-size: 14px;
            color: #999;
        }
    }
    .goodsSub {
        float: left;
        display: inline-block;
        width: 100px;
        box-sizing: border-box;
        background: #4a90e2;
        line-height: 40px;
        text-align: center;
        color: #fff;
        cursor: pointer;
    }
}
</style>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        goodsDate: {
            type: Array,
            default: function() {
                return [];
            }
        }
    },
    data() {
        return {
            bill: undefined,
            gIdActive: this.goodsDate[0],
            gListActive: this.goodsDate[0].gList
        };
    },
    computed: {
        totalbill() {
            const total = {
                count: 0,
                total: 0
            };
            for (const item in this.bill) {
                if (this.bill[item].num) {
                    total.count += this.bill[item].num;
                    total.total += parseInt(this.bill[item].num) * this.bill[item].p;
                }
            }
            total.total = window.Math.floor(total.total * 100) / 100;
            return total;
        }
    },
    methods: {
        changelist(list) {
            this.gListActive = list.gList;
            this.gIdActive = list;
        },
        hideModal() {
            this.$emit('Modalclose');
            this.bill = this.getDefoult();
            $('#goodsModal').modal('hide');
        },
        goodsprogram() {
            const data = [];
            for (const item in this.bill) {
                if (this.bill[item].num > 0) {
                    data.push(Object.assign({
                        id: item
                    }, this.bill[item]));
                }
            }
            this.bill = this.getDefoult();
            this.$emit('selectGoodsDate', data);
            this.hideModal();
        },
        getDefoult() {
            const billobjecct = Object.assign(this.goodsDate.map(function(el) {
                const bill = {};
                el.gList.map(function(ob) {
                    const object = {};
                    object[ob.i] = {
                        n: ob.n,
                        p: ob.p,
                        num: 0
                    };
                    Object.assign(bill, object);
                });
                return bill;
            }));
            const bill = {};
            let item;
            for (item in billobjecct) {
                Object.assign(bill, billobjecct[item]);
            }
            return bill;
        },
        changebill(item, type) {
            if (type) {
                this
                .bill[item.i]
                .num++;
            } else {
                if (this.bill[item.i].num) {
                    this
                    .bill[item.i]
                    .num--;
                }
            }
        }
    },
    created() {
        this.bill = this.getDefoult();
    },
    watch: {
        show(val) {
            if (val) {
                $('#goodsModal').modal({
                    backdrop: 'static'
                });
                $('#goodsModal').modal('show');
            } else {
                $('#goodsModal').modal('hide');
            }
        }
    }
};
</script>
