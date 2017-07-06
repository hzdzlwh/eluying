<template>
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
            <inner-container :title="changeProcess" style="margin-top: 18px;" :toggleView="changeView">
                <div slot="show">
                    <ul>
                        <li><span>处理方式:</span><span style="margin-left:16px;">{{processMethods[processMethodsValue]}}</span></li>
                        <li><span style="display:inline-block;width:60px;text-align:right;">精确到:</span><span style="margin-left:16px;">{{accurateArray[accurateValue]}}</span></li>
                    </ul>
                </div>
                <div slot="edit" style="padding-bottom: 20px;">
                    <ul>
                        <li>
                            <span>处理方式:</span><label style="margin-left:12px;"><input type="radio" value="0" v-model="processMethod"> 不处理</label><label style="margin-left:12px;"><input type="radio" value="1" v-model="processMethod"> 四舍五入</label><label style="margin-left:12px;"><input type="radio" value="2" v-model="processMethod"> 元后抹零</label>
                        </li>
                        <li><span style="display:inline-block;width:60px;text-align:right;">精确到:</span><label style="margin-left:12px;"><input type="radio" value="0" v-model="accurate"> 角</label><label style="margin-left:12px;"><input type="radio" value="1" v-model="accurate"> 元</label><label style="margin-left:12px;"><input type="radio" value="2" v-model="accurate"> 十元</label></li>
                    </ul>
                    <btn style="padding-left:20px;" @save="saveChangeProcess" @cancel="changeView = !changeView"></btn>
                </div>
            </inner-container>
        </outer-container>
        <outer-container :title="statisticParameter" style="margin: 20px 0;">
            <inner-container :title="specialHouse" :toggleView="specialView">
                <div slot="show">
                    <ul>
                        <li v-if="freeHouse">免费房</li>
                        <li v-if="selfHouse">自用房</li>
                        <li v-if="!freeHouse && !selfHouse">无</li>
                    </ul>
                </div>
                <div slot="edit" style="padding-bottom: 20px;">
                    <ul>
                        <li>
                            <input type="checkbox" v-model="selfHouse"><span>自用房</span>
                        </li>
                        <li>
                            <input type="checkbox" v-model="freeHouse"><span>免费房</span>
                        </li>
                    </ul>
                    <btn style="padding-left:20px;" @save="saveSpecialHouse" @cancel="specialView = !specialView"></btn>
                </div>
            </inner-container>
            <inner-container :title="intervalNight" style="margin-top: 18px;" :toggleView="intervalNightView">
                <div slot="show">
                    <ul>
                        <li><span>钟点房间夜量基数:</span><span style="margin-left:16px;">{{intervalBase}}</span></li>
                        <!--<li style="display:flex;align-items:center;"><span style="display:inline-block;width:116px;text-align:right">间夜量计算时刻:</span><span style="margin:0 16px;">{{intervalTime}}</span><span style="font-size:12px;color:#999999;line-height:18px;width:168px;text-align:center;">每跨过一个计算时刻算一个房晚(正常入住、自用房、免费房)</span></li>-->
                    </ul>
                </div>
                <div slot="edit" style="padding-bottom: 20px;">
                    <ul>
                        <li>
                            <span>钟点房间夜量基数:</span><input type="text" class="dd-input" style="width:56px;margin:0 10px 0 23px;" v-model="intervalBase" @input="intervalNightProcess"><span>请输入0-10之间的数字</span>
                        </li>
                        <!--<li style="display:flex;align-items:center;">
                            <span style="display:inline-block;width:116px;text-align:right">间夜量计算时刻:</span><input type="text" class="dd-input" style="width:56px;margin: 0 10px 0 23px;" v-model="intervalTime"><span style="font-size:12px;color:#999999;line-height:18px;width:168px;text-align:center;">每跨过一个计算时刻算一个房晚(正常入住、自用房、免费房)</span>
                        </li>-->
                    </ul>
                    <btn style="padding-left:20px;" @save="saveIntervalNight" @cancel="intervalNightView = !intervalNightView"></btn>
                </div>
            </inner-container>
        </outer-container>
    </div>
</template>

<script>
    import outerContainer from './components/outerContainer';
    import innerContainer from './components/innerContainer';
    import btn from './components/button';
    import http from '../../common/http';
    import modal from '../../common/modal';

    export default {
        data() {
            return {
                disconuntAndChange: '折扣及零头处理',
                statisticParameter: '统计参数',
                shortcutDiscount: '快捷折扣',
                changeProcess: '零头处理',
                specialHouse: '特殊房统计',
                intervalNight: '间夜量计算',
                shortcutView: true,
                changeView: true,
                specialView: true,
                intervalNightView: true,
                processMethod: 0,
                accurate: 0,
                selfHouse:  null,
                freeHouse: null,
                discountLists: [],
                processMethods: ['不处理', '四舍五入', '元后抹零'],
                processMethodsValue: null,
                accurateArray: ['角', '元', '十元'],
                accurateValue: null,
                newDiscounts: [],
                intervalTime: null,
                intervalBase: 0.5
            }
        },
        components: {
            outerContainer,
            innerContainer,
            btn
        },
        created() {
            this.getDiscountLists();
            this.getAccountState();
        },
        methods: {
            addDiscount() {
                this.newDiscounts.push({
                    description: '',
                    discount: ''
                })
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
                    nodeId: 0,
                    nodeType: 0,
                    quickDiscountList: JSON.stringify(list)
                }).then(res => {
                    this.shortcutView = !this.shortcutView;
                    this.newDiscounts = [];
                    this.getDiscountLists();
                })
            },
            saveChangeProcess() {
                http.post('/quickDiscount/discountAndOddSettingEdit', {
                    nodeId: 0,
                    nodeType: 0,
                    oddType: this.processMethod,
                    unit: this.accurate
                }).then(res => {
                    this.changeView = !this.changeView;
                    this.getDiscountLists();
                })
            },
            saveSpecialHouse() {
                http.get('/room/setAccomStatSetting', {
                    freeStatEnable: this.freeHouse,
                    selfUseStatEnable: this.selfHouse
                }).then((res) => {
                    this.specialView = !this.specialView;
                });
            },
            saveIntervalNight() {
                http.get('/room/setAccomStatSetting', {
                    hrNightBase: this.intervalBase
                }).then((res) => {
                    this.intervalNightView = !this.intervalNightView;
                });
            },
            getDiscountLists() {
                http.get('/quickDiscount/getList', { nodeId: 0, nodeType: 0 }).then((res) => {
                    if (res.code === 1) {
                        this.discountLists = res.data.list;
                        this.processMethodsValue = res.data.oddSetting.oddType;
                        this.accurateValue = res.data.oddSetting.unit;
                    }
                });
            },
            getAccountState() {
                http.get('/room/getAccomStatSetting',{}).then((res) => {
                    if (res.code === 1) {
                        this.freeHouse = res.data.freeStatEnable;
                        this.selfHouse = res.data.selfUseStatEnable;
                    }
                });
            },
            intervalNightProcess() {
                if (this.intervalBase >= 0 && this.intervalBase <= 10) {
                    if (this.intervalBase.toString().split('.')[1].length > 2) {
                        modal.warn('精确到0.01');
                    }
                } else {
                    modal.warn('请输入0-10之间的数字');
                }
            }
        }
    }
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
                    background-image: url('../../../../../image/modal/room_modal_delete.png');
                }
            }
        }
        .add-discount{
            padding: 0 20px;
        }
    }
</style>
