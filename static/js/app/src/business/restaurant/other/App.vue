<template>
    <div class="mainContainer clearfloat">
        <div class="restaurant-container">
            <div class="restaurant-head clearfloat">
                <p class="restaurant-head-restName">{{restName}}</p>
            </div>
            <div class="app">
                <outer-container :title="disconuntAndChange">
                    <inner-container :title="shortcutDiscount" :toggleView="shortcutView">
                        <div slot="show">
                            <ul>
                                <li v-for="discount in discountLists"><span style="display:inline-block;width:193px;">{{discount.description}}</span><span>{{discount.discount}} 折</span></li>
                            </ul>
                        </div>
                        <div slot="edit" style="padding-bottom: 20px;">
                            <ul>
                                <li v-for="discount in discountLists" v-if="!discount.deleted"><span style="display:inline-block;width:193px;">{{discount.description}}</span><span>{{discount.discount}} 折</span><span style="margin-left:20px;cursor: pointer;" class="delete-icon" @click="deleteDiscount(discount)"></span></li>
                                <li style="display:flex;align-items:center;" v-for="(discount, index) in newDiscounts"><input class="dd-input" type="text" style="width:118px; margin-right:23px;" placeholder="折扣名称" v-model="discount.description"><input style="width:56px; margin-right:8px;" class="dd-input" type="text" placeholder="优惠" v-model="discount.discount">折<span style="margin-left:20px;cursor: pointer;" class="delete-icon" @click="deleteDiscount(discount, index)"></span></li>
                            </ul>
                            <div class="add-discount">
                                <span style="cursor: pointer;color: #178ce6;" @click="addDiscount"><img style="margin-right: 4px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAIVBMVEUAAAAXjegYjOYXjugYjecZj+YZjukXjegajOkXjeYXjObcqVb2AAAACnRSTlMASuNVYF1FklCadOWS3AAAADZJREFUCNdjEFoFBooMigxgIMSwAMLgQmFwJEAZLAZoDNHI0kAwI9m82AxDDbJ2TJPhlsKdAQDzmRTUpGPOVQAAAABJRU5ErkJggg" alt="">新增折扣</span><span style="margin-left:65px;font-size:12px;color:#999999;">请输入0.1-9.9之间的数字</span>
                            </div>
                            <btn style="padding-left:20px;margin-top:16px;" @save="saveShortcutDiscount" @cancel="shortcutView = !shortcutView"></btn>
                        </div>
                    </inner-container>
                    <inner-container :title="changeProcess" style="margin-top: 18px;" :toggleView="changeView" @getChangeProcess="getChangeProcess">
                        <div slot="show">
                            <ul>
                                <li><span>处理方式:</span><span style="margin-left:16px;">{{processMethods[processMethodsValue]}}</span></li>
                                <li v-if="processMethodsValue !== 0"><span style="display:inline-block;width:60px;text-align:right;">精确到:</span><span style="margin-left:16px;">{{accurateArray[accurateValue]}}</span></li>
                            </ul>
                        </div>
                        <div slot="edit" style="padding-bottom: 20px;">
                            <ul>
                                <li>
                                    <span>处理方式:</span><label><input type="radio" value="0" v-model.number="processMethod"> 不处理</label><label><input type="radio" value="1" v-model.number="processMethod"> 四舍五入</label><label><input type="radio" value="2" v-model.number="processMethod"> 元后抹零</label>
                                </li>
                                <li v-if="processMethod !== 0"><span style="display:inline-block;width:60px;text-align:right;">精确到:</span><label style="margin-left:12px;"><input type="radio" value="1" v-model="accurate"> 角</label><label style="margin-left:12px;"><input type="radio" value="2" v-model="accurate"> 元</label><label style="margin-left:12px;"><input type="radio" value="3" v-model="accurate"> 十元</label></li>
                            </ul>
                            <btn style="padding-left:20px;" @save="saveChangeProcess" @cancel="changeView = !changeView"></btn>
                        </div>
                    </inner-container>
                </outer-container>
                <outer-container :title="sellClearSetting">
                    <inner-container :title="sellClearDish" :toggleView="shortSellView">
                        <div slot="show">
                            <label><input type="checkbox" v-model="checked" disabled>为预定订单保留菜品数量</label>
                            <p class="label-bottom-p">
                                勾选之后，点菜界面显示的菜品剩余数量=实际库存-预订数量
                            </p>
                        </div>
                        <div slot="edit" style="padding-bottom: 20px;">
                            <label><input type="checkbox" v-model="checked">为预定订单保留菜品数量</label>
                            <p class="label-bottom-p">
                                勾选之后，点菜界面显示的菜品剩余数量=实际库存-预订数量
                            </p>
                            <btn style="padding-left:20px;" @save="saveSellClear" @cancel="shortSellView = !shortSellView"></btn>
                        </div>
                    </inner-container>
                </outer-container>
            </div>
        </div>
    </div>
</template>

<script>
    import outerContainer from './components/outerContainer';
    import innerContainer from './components/innerContainer';
    import btn from './components/button';
    import http from '../../../common/http';
    import modal from '../../../common/modal';
    const restId = location.search.split('=')[1];
    export default {
        data() {
            return {
                restName: undefined,
                disconuntAndChange: '折扣及零头处理',
                sellClearSetting: '沽清设置',
                sellClearDish: '菜品沽清',
                shortcutDiscount: '快捷折扣',
                changeProcess: '零头处理',
                shortcutView: true,
                changeView: true,
                shortSellView: true,
                processMethod: 0,
                accurate: 0,
                freeHouse: null,
                discountLists: [],
                processMethods: ['不处理', '四舍五入', '元后抹零'],
                processMethodsValue: null,
                accurateArray: ['角', '元', '十元'],
                accurateValue: null,
                newDiscounts: [],
                checked: false
            };
        },
        components: {
            outerContainer,
            innerContainer,
            btn
        },
        created() {
            this.getRestaurants();
            this.getDiscountLists();
        },
        methods: {
            getRestaurants: function() {
                http.get('/catering/getRestaurantList', {})
                    .then(result => {
                        this.restName = result.data.list.filter(function(el) {
                            return el.restId == restId;
                        })[0].restName;
                    }).then(
                        http.get('/dish/getSellClearMenu', { restId: restId, queryType: 1 }).then(res => {
                           if (res.code === 1) {
                               this.checked = res.data.reservePreOrder === 1 ? true : false;
                           }
                        })
                    );
            },
            addDiscount() {
                this.newDiscounts.push({
                    description: '',
                    discount: ''
                });
            },
            deleteDiscount(item, index) {
                if (!item.id) {
                    this.newDiscounts.splice(index, 1);
                } else {
                    this.$set(item, 'deleted', true);
                }
            },
            saveShortcutDiscount() {
                const list = this.discountLists.filter(i => i.deleted).concat(this.newDiscounts);
                http.post('/quickDiscount/discountAndOddSettingEdit', {
                    nodeId: restId,
                    nodeType: 1,
                    quickDiscountList: JSON.stringify(list)
                }).then(res => {
                    this.shortcutView = !this.shortcutView;
                    this.newDiscounts = [];
                    this.getDiscountLists();
                });
            },
            getChangeProcess() {
                http.post('/quickDiscount/getList', {
                    nodeId: restId,
                    nodeType: 1
                }).then(res => {
                    if (res.code === 1) {
                        if (res.data.oddSetting) {
                            this.processMethod = res.data.oddSetting.oddType;
                            this.accurate = res.data.oddSetting.unit;
                        }
                    }
                });
            },
            saveChangeProcess() {
                http.post('/quickDiscount/discountAndOddSettingEdit', {
                    nodeId: restId,
                    nodeType: 1,
                    oddType: this.processMethod,
                    unit: this.accurate
                }).then(res => {
                    this.changeView = !this.changeView;
                    this.getDiscountLists();
                });
            },
            saveSellClear() {
                http.get('/catering/setReservePreOrderDish', {
                    restId: restId,
                    reserve: this.checked ? 1 : 0
                }).then(res => {
                    this.shortSellView = !this.shortSellView;
                });
            },
            getDiscountLists() {
                http.post('/quickDiscount/getList', { nodeId: restId, nodeType: 1 }).then((res) => {
                    if (res.code === 1) {
                        this.discountLists = res.data.list;
                        this.processMethodsValue = res.data.oddSetting.oddType;
                        this.processMethod = res.data.oddSetting.oddType;
                        this.accurateValue = res.data.oddSetting.unit - 1;
                    }
                });
            }
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
    .app{
        ul{
            padding: 8px 20px;
            li{
                height: 40px;
                line-height: 40px;
                .delete-icon{
                    width: 16px;
                    height: 16px;
                    display: inline-block;
                    background-image: url('../../../../../../image/modal/room_modal_delete.png');
                }
            }
        }
        .add-discount{
            padding: 0 20px;
        }
    }
    label {
        height: 40px;
        line-height:40px;
        padding: 0 24px;
        input {
            vertical-align: text-bottom;
        }
    }
    .label-bottom-p {
        line-height: 60px;
        margin: -35px 0 20px;
        font-size: 12px;
        color: rgb(135,135,135);
        padding: 0 40px;
    }
</style>
