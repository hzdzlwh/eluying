<template>
    <div>
        <div class="modal fade roomModals selectComponentModal" id="orderEditor" role="dialog" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <!-- header start -->
                    <div class="roomModals-header">
                        <div class="header-container">
                            <span class="header-text">{{titleAndBtn.title}}</span>
                        </div>
                        <span class="close-icon" @click.stop="hideModal"></span>
                    </div>
                    <div class="roomModals-body">
                        <div class="content-item">
                            <p class="content-item-title"><span>客户信息</span></p>
                            <div class="userInfo-items">
                                <div class="userInfo-item">
                                    <div class="userVip-list" v-clickoutside="hideVipList" v-show="vipListShow" @click.stop="()=>{}">
                                        <p class="userVip-item" v-for="vip in vipList" @click="setVipInfo(vip)">
                                            <span class="vip-level">
                                                [<span class="vip-level-text">{{ vip.level }}</span>]
                                            </span>
                                            <span class="vip-name">{{ vip.name }}</span>
                                            <span class="vip-phone">{{ vip.phone }}</span>
                                        </p>
                                    </div>
                                    <label for="name">联系人</label>
                                    <input class="dd-input" type="text" maxlength="16" placeholder="联系人姓名" id="name" autocomplete="off" :disabled="(this.checkState === 'editOrder' || this.checkState === 'checkIn') && !(order.type === ORDER_TYPE.COMBINATION || (order.type === ORDER_TYPE.ACCOMMODATION && !order.isCombinationOrder))" v-model="name" @input="changeVipList(1)">
                                </div>
                                <div class="userInfo-item userInfo-phone vip-level-container">
                                    <label for="phone">手机号</label>
                                    <input class="dd-input" type="text" id="phone" maxlength="20" placeholder="手机号" autocomplete="off" :disabled="(this.checkState === 'editOrder' || this.checkState === 'checkIn') && !(order.type === ORDER_TYPE.COMBINATION || (order.type === ORDER_TYPE.ACCOMMODATION && !order.isCombinationOrder))" v-model="phone" @input="changeVipList(2)">
                                    <span v-if="vipDiscountDetail.isVip">
                                        <span class="vip-level-img"></span>
                                    <span class="vip-level-tip">{{ vipDiscountDetail.vipDetail.level }}</span>
                                    </span>
                                    <span class="error-phone-tip" v-show="!phoneValid">
                                        <span style="vertical-align: text-bottom">&uarr;</span> 请输入正确的手机号
                                    </span>
                                </div>
                                <div class="userInfo-item" style="position: relative">
                                    <label>客户来源</label>
                                    <div class="select-component-container">
                                        <dd-select v-model="userOriginType" :disabled="(this.checkState === 'editOrder' || this.checkState === 'checkIn') && !(order.type === ORDER_TYPE.COMBINATION || (order.type === ORDER_TYPE.ACCOMMODATION && !order.isCombinationOrder))">
                                            <dd-option :key="origin" v-for="origin in userSelfOrigins" :value="origin" :label="origin.name">
                                                <span :title="origin.name">{{origin.name}}</span>
                                            </dd-option>
                                            <dd-group-option v-for="item in userGroupOrigins" :label="item.label" :key="item" v-if="item.origins.length > 0">
                                                <dd-option v-for="origin in item.origins" :key="origin" :value="origin" :label="origin.id > 0 ? origin.name : `企业(${origin.name})`">
                                                    <div class="user-group-origin">
                                                        <span class="user-group-company" :title="origin.name">
                                                            {{ origin.name }}
                                                        </span>
                                                        <span class="user-group-img" v-if="!origin.type" :title="origin.info"></span>
                                                    </div>
                                                </dd-option>
                                            </dd-group-option>
                                        </dd-select>
                                    </div>
                                    <div style="position: absolute; top: 3px;right: -25px">
                                        <span class="company-origin-tipImg" v-show="showCompanyOriginTip"></span>
                                        <div class="company-origin-tips">
                                            变更客户来源后，该订单中已发生的企业挂帐、企业扣款、退款至企业均将会被取消。
                                        </div>
                                    </div>
                                </div>
                                <div class="userInfo-item" v-show="showVipCardSelect">
                                    <label>会员卡</label>
                                    <span class="vipcard-select" style="width: 210px">
                                        <dd-select v-model="vipCardId" :disabled="(this.checkState === 'editOrder' || this.checkState === 'checkIn') && !(order.type === ORDER_TYPE.COMBINATION || (order.type === ORDER_TYPE.ACCOMMODATION && !order.isCombinationOrder))">
                                            <dd-option :value="0" label="不使用">
                                                不使用
                                            </dd-option>
                                            <dd-group-option v-for="item in vipCardsAndLevel" :label="item.label"
                                                             :key="item" v-if="item.levels && item.levels.length > 0">
                                                <dd-option v-for="level in item.levels" :key="level"
                                                           :value="level.id" :label="level.name+(level.serialNum || '')">
                                                    <span :title="level.serialNum">{{level.name}} {{level.serialNum}}</span>
                                    </dd-option>
                                    </dd-group-option>
                                    </dd-select>
                                    </span>
                                </div>
                            </div>
                            <orderExtInfo :checkState='"team"' v-model='ExtInDate' v-if='checkState === "team"'></orderExtInfo>
                            <!-- checkstate先放着，以后应该能复用到 -->
                        </div>
                        <!-- header end -->
                        <RoomEditor v-show="(this.checkState !== 'editOrder' || (this.order.type === ORDER_TYPE.ACCOMMODATION || this.order.type === ORDER_TYPE.COMBINATION)) && this.checkState !== 'quick' && this.checkState !== 'team'" :order="order" :registerRooms="registerRooms" :categories="categories" :vipDiscountDetail="vipDiscountDetail" :checkState="checkState" :userOriginType="userOriginType" :vipId="vipId" :vipCardId="vipCardId" :vipCardInfo="vipCardInfo" @change="handleRoomChange" @whenCheckInDeleteRooms="handleWhenCheckInDeleteRooms" :orderEditorVisible="orderEditorVisible" @priceChange="handleRoomPriceChange" />
                        <RoomEditorQuick v-if="this.checkState === 'quick' || this.checkState === 'team'" :order="order" :registerRooms="registerRooms" :categories="categories" :vipDiscountDetail="vipDiscountDetail" :checkState="checkState" :userOriginType="userOriginType" :vipId="vipId" :vipCardId="vipCardId" :vipCardInfo="vipCardInfo" @change="handleRoomChange" @priceChange="handleRoomPriceChange" :ExtInDate='ExtInDate' />
                        <CateEditor v-if="this.order.type === ORDER_TYPE.CATERING" :vipDiscountDetail="vipDiscountDetail" @change="handleFoodChange" @priceChange="handleFoodPriceChange">
                        </CateEditor>
                        <EnterEditor :order="order" v-if="(this.checkState !== 'editOrder' && this.checkState !== 'checkIn') || (order.type === ORDER_TYPE.ENTERTAINMENT || order.type === ORDER_TYPE.COMBINATION || (order.type === ORDER_TYPE.ACCOMMODATION && !order.isCombinationOrder))" :vipDiscountDetail="vipDiscountDetail" @change="handleEnterChange" @priceChange="handlEnterPriceChange" />
                        <ShopEditor v-show="(this.checkState !== 'editOrder' && this.checkState !== 'checkIn') || (order.type === ORDER_TYPE.RETAIL || order.type === ORDER_TYPE.COMBINATION || (order.type === ORDER_TYPE.ACCOMMODATION && !order.isCombinationOrder))" :order="order" :vipDiscountDetail="vipDiscountDetail" @change="handleShopChange" @priceChange="handleShopPriceChange">
                        </ShopEditor>
                        <div class="content-item" v-if="order.type !== ORDER_TYPE.RETAIL">
                            <p class="content-item-title"><span>备注信息</span></p>
                            <div class="remark-items">
                                <textarea name="remark" placeholder="请输入备注信息" maxlength="500" v-model="remark" class="dd-input">
                                </textarea>
                                <span class="valid-remark-tip" :style="{color: remark.length >= 500 ? '#f24949' : '#999999'}">
                                    {{remark.length}}/500
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div>
                            <div @click="returnPreStep" v-if="hidePreStep && (hasBack || checkState === 'checkIn')" class="btn-back" style='    display: inline-block;'><img src="/static/image/modal/back.png" alt=""></div>
                            <span class="footer-label">订单金额</span>
                            <span class="footer-price">¥{{totalPrice}}</span>
                        </div>
                        <div class="dd-btn dd-btn-primary" @click="submitInfo" v-if='this.checkState !== "team" && this.checkState !== "quick"'>{{titleAndBtn.btn}}</div>
                        <div v-else>
                            <div class="dd-btn dd-btn-primary" @click="handleQuickTeamBusiness('auto')" v-if='ExtInDate.roomCheckType !== 1'>预订并自动排房</div>
                            <div class="dd-btn dd-btn-primary" @click="handleQuickTeamBusiness">完成预订</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.selectComponentModal {
    overflow: visible !important;
}

.userInfo-item:last-child,
.select-component-container {
    display: inline-block;
}

.user-group-origin {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 4px;
    position: relative;
}

.company-origin-tipImg {
    display: inline-block;
    vertical-align: sub;
    cursor: pointer;
    width: 16px;
    height: 16px;
    margin-left: 12px;
    background: url("../../../../../../../image/modal/room_modal_info.png");
    background-size: contain;
}

.company-origin-tipLike {
    display: inline-block;
    margin-left: 12px;
    width: 16px;
    height: 16px;
}

.company-origin-tipImg:hover + .company-origin-tips {
    display: block;
}

.company-origin-tips {
    display: none;
    background: #fafafa;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    width: 188px;
    font-size: 12px;
    padding: 8px 16px;
    position: absolute;
    right: 0;
    z-index:1;
}

.user-group-company {
    display: inline-block;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.user-group-img {
    display: inline-block;
    cursor: pointer;
    width: 16px;
    height: 16px;
    background: url("../../../../../../../image/modal/room_modal_info.png");
    background-size: contain;
}

.dd-select-option-group > .dd-select-option {
    overflow: visible !important;
}

.user-group-img:hover + .user-group-tips {
    display: block;
}

.user-group-tips {
    display: none;
    position: absolute;
    top: 0;
    right: 4px;
    transform: translateY(-100%);
    background: #fafafa;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    width: 256px;
    padding-bottom: 10px;
    z-index: 1090;
}

.user-company-title {
    font-size: 14px;
    color: #666666;
    padding: 8px 16px;
    border-bottom: 1px solid #e6e6e6;
}

.user-company-item {
    display: flex;
    padding: 0 16px;
    margin-top: 8px;
    font-size: 12px;
    color: #999999;
    justify-content: space-between;
    align-items: center;
}

.vipcard-select {
    width: 210px;
    .dd-select {
        input {
            width: 100%;
        }
    }
    .dd-select-menu {
        width: 216px;
    }
}
</style>
<script>
import {
    mapActions,
    mapState
} from 'vuex';
import bus from '../../../eventBus';
import {
    DdDropdown,
    DdDropdownItem,
    DdDatepicker,
    DdSelect,
    DdGroupOption,
    DdOption
} from 'dd-vue-component';
import Clickoutside from 'dd-vue-component/src/utils/clickoutside';
import http from '../../../http';
import {
    ORDER_TYPE
} from '../../../../ordersManage/constant';
import modal from '../../../modal';
import types from '../../store/types';
import RoomEditorQuick from './RoomEditorQuick.vue';
import RoomEditor from './RoomEditor.vue';
import util from '../../../util';
import EnterEditor from './EntertainmentEditor.vue';
import ShopEditor from './ShopEditor.vue';
import CateEditor from './CateEditor.vue';
import {
    getOrderId
} from '../../utils/order';
import validate from '../../../validate';
import orderExtInfo from './orderExtInfo.vue';
const date = new Date();
const now = {
    year: date.getFullYear(),
    mouth: date.getMonth(),
    day: date.getDate()
};
export default {
    name: 'OrderEditor',
    directives: {
        Clickoutside
    },
    data() {
        return {
            ExtInDate: {
                startDate: new Date(now.year, now.mouth, now.day, 12, 0, 0, 0),
                endDate: new Date(now.year, now.mouth, now.day + 1, 12, 0, 0, 0),
                roomCheckType: 0
            },
            name: '',
            phone: '',
            userOriginType: undefined,
            userSelfOrigins: [],
            userGroupOrigins: [],
            phoneValid: true,
            remark: '',
            enterItems: [],
            shopGoodsItems: [],
            newGoodItems: [], // 新的商超项目
            previousGoods: [], // 之前的商超项目
            rooms: [],
            shopItems: {}, // 商超组件传出的数据：包含新旧商超项目
            vipDiscountDetail: {},
            vipListShow: false,
            vipList: [],
            vipId: undefined,
            timeCount: 0,
            roomPrice: 0,
            enterPrice: 0,
            goodsPrice: 0,
            foodPrice: 0,
            ORDER_TYPE,
            vipCardsAndLevel: [],
            vipCardId: undefined,
            vipCardInfo: {},
            hasBack: false,
            whenCheckInDeleteRooms: []
        };
    },
    props: {
        registerRooms: {
            type: Array,
            default: function() {
                return [];
            }
        },
        orderEditorVisible: {
            type: Boolean,
            default: false
        },
        checkState: {
            type: String,
            default: ''
        },
        categories: Array,
        hidePreStep: {
            type: Boolean,
            default: true
        }
    },
    components: {
        DdDropdown,
        DdDropdownItem,
        DdDatepicker,
        DdSelect,
        DdGroupOption,
        DdOption,
        RoomEditor,
        EnterEditor,
        ShopEditor,
        CateEditor,
        RoomEditorQuick,
        orderExtInfo
    },
    computed: {
        ...mapState({
            order: state => state.orderSystem.orderDetail
        }),
        titleAndBtn() {
            switch (this.checkState) {
                case 'checkIn':
                    return {
                        title: '办理入住',
                        btn: '确认入住'
                    };
                case 'ing':
                    return {
                        title: '直接入住',
                        btn: '确认入住'
                    };
                case 'finish':
                    return {
                        title: '补录',
                        btn: '补录'
                    };
                case 'book':
                    return {
                        title: '预订',
                        btn: '完成预订'
                    };
                case 'quick':
                    return {
                        title: '快速预订',
                        btn: '完成预订'
                    };
                case 'team':
                    return {
                        title: '团队预订',
                        btn: '完成预订'
                    };
                case 'editOrder':
                    if (this.order.type === ORDER_TYPE.ACCOMMODATION) {
                        return {
                            title: '编辑住宿订单',
                            btn: '完成'
                        };
                    }

                    if (this.order.type === ORDER_TYPE.COMBINATION) {
                        return {
                            title: '编辑组合订单',
                            btn: '完成'
                        };
                    }

                    if (this.order.type === ORDER_TYPE.ENTERTAINMENT) {
                        return {
                            title: '编辑娱乐订单',
                            btn: '完成'
                        };
                    }

                    if (this.order.type === ORDER_TYPE.CATERING) {
                        return {
                            title: '编辑餐饮订单',
                            btn: '完成'
                        };
                    }

                    if (this.order.type === ORDER_TYPE.RETAIL) {
                        return {
                            title: '编辑商超订单',
                            btn: '完成'
                        };
                    }

                    break;
                default:
                    return {
                        title: '编辑订单',
                        btn: '完成'
                    };
            }
            return {};
        },
        showCompanyOriginTip() {
            return this.userOriginType && this.userOriginType.id === -5;
        },
        totalPrice() {
            switch (this.order.type) {
                case ORDER_TYPE.COMBINATION:
                    return (this.roomPrice + this.enterPrice + this.goodsPrice + this.foodPrice).toFixed(2);
                case ORDER_TYPE.ACCOMMODATION:
                    if (this.order.isCombinationOrder) {
                        return this.roomPrice.toFixed(2);
                    } else {
                        return (this.roomPrice + this.enterPrice + this.goodsPrice + this.foodPrice).toFixed(2);
                    }
                case ORDER_TYPE.RETAIL:
                    return this.goodsPrice.toFixed(2);
                case ORDER_TYPE.ENTERTAINMENT:
                    return this.enterPrice.toFixed(2);
                case ORDER_TYPE.CATERING:
                    return this.foodPrice.toFixed(2);
            }
            return (this.roomPrice + this.enterPrice + this.goodsPrice + this.foodPrice).toFixed(2);
        },
        showVipCardSelect() {
            return this.vipDiscountDetail && this.vipDiscountDetail.isVip;
        }
    },
    created() {
        this.getData();
        bus.$on('OrderExtInfochange', this.OrderExtInfochange);
        bus.$on('setBack', this.setBack);
    },
    beforeDestroy() {
        bus.$off('setBack', this.setBack);
        bus.$off('OrderExtInfochange', this.OrderExtInfochange);
    },
    watch: {
        userOriginType(origin) {
            if (!origin) {
                return false;
            }
            const originType = origin.id;
            const companyId = origin.companyId;
            if (originType === -5) {
                this.getCompanyDiscount({
                    contractCompanyId: companyId
                });
                this.vipCardId = -5;
                return;
            }

            if (originType === -4 && this.phone) {
                this.getVipDiscount(this.phone, true);
            }

            if (originType !== -5 && originType !== -4) {
                this.vipCardId = 0;
                this.vipDiscountDetail = {};
            }

            if (!origin || (origin.id !== -4 && origin.id !== -5)) {
                this.vipCardInfo = {};
            }
        },
        vipCardId(vipCardId) {
            if (vipCardId === -1) {
                const vip = this.vipCardsAndLevel[0].levels[0];
                this.vipCardInfo = {
                    name: vip.name,
                    discount: (this.getRoomDiscount(vip.discountList) * 10).toFixed(1),
                    id: -4,
                    tag: '会员折扣'
                };
                /* this.$set(this.vipDiscountDetail, 'vipDetail', {
                    discountList: vip.discountList,
                    level: vip.name,
                    id: vip.vipId
                });
                this.$set(this.vipDiscountDetail, 'tag', '会员');*/
                this.vipDiscountDetail = {
                    ...this.vipDiscountDetail,
                    vipDetail: {
                        discountList: vip.discountList,
                        level: vip.name,
                        id: vip.vipId
                    },
                    tag: vip.name
                };
            }

            if (vipCardId > 0) {
                const card = this.vipCardsAndLevel[1].levels.find(i => i.id === this.vipCardId);
                this.vipCardInfo = {
                    name: card.name,
                    serialNum: card.serialNum,
                    discount: (this.getRoomDiscount(card.discountList) * 10).toFixed(1),
                    id: -4,
                    tag: '会员卡折扣'
                };

                /* this.$set(this.vipDiscountDetail, 'vipDetail', {
                    discountList: card.discountList
                });
                this.$set(this.vipDiscountDetail, 'tag', card.name);*/
                this.vipDiscountDetail = {
                    ...this.vipDiscountDetail,
                    vipDetail: {
                        discountList: card.discountList
                    },
                    tag: card.name
                };
            }

            if (vipCardId === 0) {
                this.vipCardInfo = {};
                /* this.$set(this.vipDiscountDetail, 'vipDetail', {
                    discountList: []
                });
                this.$set(this.vipDiscountDetail, 'tag', '');*/
                this.vipDiscountDetail = {
                    ...this.vipDiscountDetail,
                    vipDetail: {
                        discountList: []
                    },
                    tag: ''
                };
            }
        },
        phone(newVal) {
            if (!newVal) {
                return false;
            }

            if (this.userOriginType && this.userOriginType.id === -5 && this.checkState === 'editOrder') {
                return false;
            }

            if (newVal) {
                this.checkPhone();
            } else {
                this.vipDiscountDetail = {};
            }
        },
        orderEditorVisible(visible) {
            if (visible) {
                if (this.checkState === 'editOrder' || this.checkState === 'checkIn') {
                    this.name = this.order.customerName;
                    this.phone = this.order.customerPhone;
                    this.remark = this.order.remark || '';

                    this.userOriginType = this.getOrigin(this.order.originId, this.order.discountRelatedId);
                    if (this.order.originId === -4) {
                        this.vipId = this.order.discountRelatedId;
                    }

                    if (this.userOriginType === undefined) {
                        this.userSelfOrigins.push({
                            id: this.order.originId,
                            name: this.order.origin,
                            unknown: true
                        });
                        this.userOriginType = this.getOrigin(this.order.originId, this.order.discountRelatedId);
                        if (this.order.discountChannel === 4 || this.order.discountChannel === 1) {
                            this.getVipDiscount(this.order.customerPhone, false);
                        }
                    }
                } else {
                    if (this.userSelfOrigins[0]) {
                        this.userOriginType = this.userSelfOrigins[0];
                    }
                }

                $('#orderEditor').modal('show');
            } else {
                const unknown = this.userSelfOrigins.find(i => i.unknown);
                const index = this.userSelfOrigins.indexOf(unknown);
                if (index > -1) {
                    this.userSelfOrigins.splice(index, 1);
                }
                $('#orderEditor').modal('hide');
            }
        }
    },
    methods: {
        ...mapActions([
            types.LOAD_SHOP_LIST,
            types.LOAD_ENTER_LIST,
            types.LOAD_OTHER_GOODS_LIST
        ]),
        OrderExtInfochange(date) {
            this.$set(this, date.name, date.val)
                // this[date.name] = date.val;
        },
        returnPreStep() {
            this.hideModal();
            bus.$emit('back');
            // bus.$emit('onShowDetail');
        },
        setBack() {
            this.hasBack = true;
        },
        getRoomDiscount(discounts) {
            if (!discounts) {
                return 1;
            }
            const discount = discounts.find(i => i.nodeType === 0);
            return discount ? discount.discount : 1;
        },
        changeVipList(num) {
            if (num === 2 && this.phone) {
                this.getVipDiscount(this.phone, true);
            }
            const params = num === 1 ? {
                name: this.name
            } : {
                phone: this.phone
            };
            if ((num === 1 && this.name.length >= 1) || (num === 2 && this.phone.length >= 4)) {
                clearTimeout(this.timeCount);
                this.timeCount = setTimeout(() => {
                    this.getVipList(params, num);
                }, 500);
            }
        },
        getVipList(params, position) {
            http.get('/vipUser/search', params)
                .then(res => {
                    this.vipList = res.data.list;
                    this.vipListShow = res.data.list && res.data.list.length > 0;
                    this.setVipListPosition(position);
                });
        },
        setVipListPosition(position) {
            const vipList = document.querySelector('.userVip-list');
            if (vipList) {
                vipList.style.left = position === 1 ? 46 + 'px' : 245 + 'px';
            }
        },
        checkPhone() {
            this.phoneValid = validate.phone.test(this.phone) || this.phone === '';
        },
        getVipDiscount(phone, setOrigin) {
            if (phone === this.vipDiscountDetail.phone) {
                return;
            }
            this.vipDiscountDetail.phone = phone;
            const params = this.checkState === 'editOrder' ? {
                phone: phone,
                orderId: getOrderId(this.order),
                orderType: this.order.type
            } : {
                phone: phone
            };
            http.get('/vipUser/getVipDiscount', params)
                .then(res => {
                    this.vipDiscountDetail = {...res.data,
                        phone: phone,
                        tag: res.data.vipDetail && res.data.vipDetail.level
                    };
                    if (this.vipDiscountDetail.isVip) {
                        if (setOrigin) {
                            this.userOriginType = this.getOrigin(-4);
                        }
                        this.vipId = res.data.vipDetail.vipId;
                        // 生成会员卡下拉框,规定不使用-0，会员等级，-1
                        this.vipCardsAndLevel = [];
                        this.vipCardsAndLevel.push({
                            label: '会员',
                            levels: [{
                                name: res.data.vipDetail.level,
                                id: -1,
                                discountList: res.data.vipDetail.discountList,
                                vipId: res.data.vipDetail.id
                            }]
                        });
                        const cards = res.data.cards.map(card => {
                            return {
                                id: card.id,
                                name: card.name,
                                serialNum: card.serialNum,
                                discountList: card.discountList
                            };
                        });
                        this.vipCardsAndLevel.push({
                            label: '会员卡',
                            levels: cards
                        });
                        // 默认选择一个选项，优先级：会员卡（最新办理的优先级高）>等级会员。
                        this.$nextTick(() => {
                            // discountChannel 1-会员 2-协议单位，v2.8」4-会员卡
                            if (this.order.discountChannel === 1) {
                                this.vipCardId = -1;
                                return;
                            }

                            if (this.order.discountChannel === 4 && cards.some(c => c.id === this.order.discountRelatedId)) {
                                this.vipCardId = this.order.discountRelatedId;
                                return;
                            }

                            if (!this.order.discountChannel && this.checkState === 'editOrder') {
                                this.vipCardId = 0;
                                return;
                            }

                            if (cards && cards.length > 0) {
                                this.vipCardId = cards[0].id;
                            } else {
                                this.vipCardId = -1;
                            }
                        });
                    } else {
                        this.userOriginType = this.getOrigin(-1);
                    }
                });
        },
        getCompanyDiscount(params) {
            http.get('/contractCompany/getContractDiscount', params)
                .then(res => {
                    const discountList = res.data;
                    this.vipDiscountDetail = {
                        isVip: false,
                        vipDetail: discountList,
                        tag: '企业'
                    };

                    this.vipCardInfo = {
                        name: this.userOriginType.name,
                        discount: (this.getItemDiscountInfo(0, 0).discount * 10).toFixed(1),
                        id: -5,
                        tag: '企业折扣'
                    };
                });
        },
        getData() {
            http.get('/user/getChannels', {
                    type: 2,
                    isAll: true
                })
                .then((res) => {
                    const originsList = res.data.list;
                    const otherOrigins = [];
                    this.userGroupOrigins.push({
                        label: '企业',
                        origins: []
                    });
                    this.userGroupOrigins.push({
                        label: '其他',
                        origins: []
                    });
                    originsList.forEach(origin => {
                        if (origin.id === -1 || origin.id === -4) {
                            this.userSelfOrigins.push(origin);
                        }

                        if (origin.id === -5) {
                            origin.companyList.forEach(company => {
                                const companyName = `企业名称:${company.companyName}(${company.companyType ? '可挂帐' : '不可挂帐'})`;
                                const number = `企业编号:${company.contractNum || ''}`;
                                const name = `联系人:${company.contactName || ''}`;
                                const phone = `联系人电话:${company.contactPhone || ''}`;
                                company.name = company.companyName;
                                company.companyId = company.id;
                                company.id = origin.id;
                                company.info = `${companyName}\n${number}\n${name}\n${phone}`;
                            });
                            this.userGroupOrigins[0].origins = origin.companyList;
                        }

                        if (origin.id > 0) {
                            origin.info = origin.name;
                            otherOrigins.push(origin);
                        }
                    });
                    this.userGroupOrigins[1].origins = otherOrigins;
                });
            this[types.LOAD_SHOP_LIST]();
            this[types.LOAD_ENTER_LIST]();
            this[types.LOAD_OTHER_GOODS_LIST]();
        },
        getOrigin(id, companyId) {
            // -5企业，-4会员
            if (id === -5) {
                return this.userGroupOrigins[0].origins.find(i => companyId === i.companyId);
            } else {
                return this.userSelfOrigins.find(i => id === i.id) || this.userGroupOrigins[1].origins.find(i => id === i.id);
            }
        },
        hideVipList() {
            this.vipListShow = false;
            this.vipList = [];
        },
        refreshData() {
            this.name = '';
            this.phone = '';
            this.userOriginType = undefined;
            this.remark = '';
            this.vipDiscountDetail = {};
            this.phoneValid = true;
            this.vipId = undefined;
            this.newGoodItems = [];
            this.previousGoods = [];
            this.roomPrice = 0;
            this.enterPrice = 0;
            this.goodsPrice = 0;
            this.foodPrice = 0;
            this.vipCardId = undefined;
            this.vipCardInfo = {};
            this.hasBack = false;
            this.ExtInDate = {
                startDate: new Date(now.year, now.mouth, now.day, 12, 0, 0, 0),
                endDate: new Date(now.year, now.mouth, now.day + 1, 12, 0, 0, 0),
                roomCheckType: 0
            };
        },
        hideModal() {
            bus.$emit('hideOrderEditor');
            this.refreshData();
        },
        setVipInfo(vip) {
            this.name = vip.name;
            this.phone = vip.phone;
            this.vipId = vip.vipId;
            this.vipListShow = false;
            this.getVipDiscount(vip.phone, true);
            this.userOriginType = this.getOrigin(-4);
        },
        checkoutTimeOut(room) {
            const outRoom = room.filter(function(el) {
                return (new Date(el.endDate) < new Date());
            });
            return outRoom;
        },
        validate() {
            let valid = true;
            let durationValid = true;
            let roomPersonValid = true;

            this.checkPhone();
            if (this.checkState !== 'editOrder' || this.order.type === ORDER_TYPE.COMBINATION || this.order.type === ORDER_TYPE.ACCOMMODATION) {
                if (!(this.phone || this.name) || (!this.name && !this.phoneValid) || !this.phoneValid) {
                    modal.warn('请输入联系人或手机号!');
                    return false;
                }
            }

            this.rooms.map(item => {
                if ((item.showTip === 2 && item.checkRoomType === 1) || item.showTip === 1) {
                    valid = false;
                }
                if ((this.checkState === 'quick' || this.checkState === 'team') && !item.categoryType) {
                    valid = false;
                }
                if (util.DateDiff(new Date(item.room.endDate), new Date(item.room.startDate)) > 400) {
                    durationValid = false;
                }

                if (item.idCardList.length > 0) {
                    item.idCardList.forEach(person => {
                        if (person.idCardNum === '' || person.name === '') {
                            roomPersonValid = false;
                        }
                    });
                }
            });
            if (this.checkState === 'checkIn') {
                if (this.rooms.every(r => !r.isCheckIn)) {
                    modal.warn('请选择入住的房间！');
                    return false;
                }
            }
            this.enterItems.map(item => {
                if (item.inventory + item.selfInventory <= 0) {
                    valid = false;
                }
            });
            const enterItemsValid = this.enterItems.every(enter => {
                return enter.id && enter.date;
            });
            const shopGoodsItemsValid = this.shopGoodsItems.every(good => {
                return good.id;
            });

            if (!valid) {
                modal.warn('订单信息有误，请核对信息后再提交！');
                return false;
            }

            if (!durationValid) {
                modal.warn('所选择房间的入住时间超过了400天，请核对入住信息后再提交！');
                return false;
            }

            if (!roomPersonValid) {
                modal.warn('请完善入住人信息！');
                return false;
            }

            if (!enterItemsValid) {
                modal.warn('请完善娱乐信息！');
                return false;
            }

            if (!shopGoodsItemsValid) {
                modal.warn('请完善商超信息！');
                return false;
            }

            return true;
        },
        getItemDiscountInfo(nodeId, nodeType) {
            let item = {
                discount: 1
            };
            const vipDetail = this.vipDiscountDetail.vipDetail;
            if (vipDetail && vipDetail.discountList && vipDetail.discountList.length > 0) {
                vipDetail.discountList.forEach(list => {
                    if ((nodeType === 0 || nodeType === 3) && list.nodeId === 0 && list.nodeType === nodeType) {
                        item = {...list
                        };
                    } else if ((nodeType !== 0 && nodeType !== 3) && (list.nodeId === nodeId && list.nodeType === nodeType)) {
                        item = {...list
                        };
                    }
                });
            }

            return item;
        },
        getSubmitRooms() {
            return this.rooms.map(room => {
                const roomTypeName = room.roomList.filter(function(el) {
                    return el.id === room.roomType;
                });
                return {
                    datePriceList: room.datePriceList,
                    endDate: util.dateFormatLong(room.room.endDate),
                    startDate: util.dateFormatLong(room.room.startDate),
                    id: room.categoryType,
                    roomId: room.roomType || null,
                    idCardList: JSON.stringify(room.idCardList),
                    fee: room.price,
                    sub: true,
                    roomOrderId: room.roomOrderId,
                    quickDiscountId: room.quickDiscountId,
                    roomeName: room.categories.filter(function(el) {
                        return el.typeId === room.categoryType;
                    })[0].name,
                    checktypeName: room.checkTypes.filter(function(el) {
                        return el.id === room.checkType;
                    })[0].name,
                    roomTypeName: (roomTypeName.length && roomTypeName[0].name) ? roomTypeName[0].name : '',
                    useDiscount: room.moreDiscount === 0 || !room.priceModified,
                    extraItems: room.extraItems,
                    isCheckIn: room.isCheckIn,
                    checkType: room.checkType
                };
            });
        },
        getQuickOrTeamRooms() {
            return this.rooms.map(room => {
                const checkTypeName = room.checkType.filter(function(el) {
                    return el.id === room.checkRoomType;
                });
                return {
                    amount: room.amount,
                    checkType: room.checkRoomType,
                    endDate: util.dateFormatLong(room.room.endDate),
                    startDate: util.dateFormatLong(room.room.startDate),
                    id: room.categoryType,
                    fee: room.price,
                    sub: true,
                    roomeName: room.categories.filter(function(el) {
                        return el.typeId === room.categoryType;
                    })[0].name,
                    checktypeName: checkTypeName.length ? checkTypeName[0].name : '',
                    quickDiscountId: room.quickDiscountId,
                    useDiscount: room.moreDiscount === 0 || !room.priceModified
                };
            });
        },
        getOverTimeRooms() {
            return this.rooms.map(room => {
                return {
                    amount: room.amount,
                    checkType: room.checkType,
                    endDate: util.dateFormatLong(room.room.endDate),
                    startDate: util.dateFormatLong(room.room.startDate),
                    id: room.categoryType,
                    fee: room.price,
                    sub: true,
                    roomeName: room.categories.filter(el => {
                        return el.typeId === room.categoryType;
                    })[0].name,
                    checktypeName: room.checkTypes.filter(el => {
                        return el.id === room.checkType;
                    })[0].name,
                    quickDiscountId: room.quickDiscountId,
                    useDiscount: room.moreDiscount === 0 || !room.priceModified
                };
            });
        },
        getSubmitGoods() {
            this.newGoodItems = this.shopItems.items.map(item => {
                return {
                    amount: item.amount,
                    id: Number(item.id),
                    name: item.name,
                    price: Math.round((item['originPrice'] * this.getItemDiscountInfo(0, item.type).discount) * 100) / 100,
                    type: 3
                };
            });
            for (const key in this.shopItems.goods) {
                const previousItem = {};
                previousItem.goodsOrderId = key;
                previousItem.goodsItems = this.shopItems.goods[key]['items'].map(item => {
                    return {
                        amount: item.amount,
                        id: item.id,
                        price: Math.round((item['originPrice'] * this.getItemDiscountInfo(0, item.type).discount) * 100) / 100
                    };
                });
                this.previousGoods.unshift(previousItem);
            }
        },

        getSubmitEnterItems() {
            return this.enterItems.map(item => {
                return {
                    amount: item.count,
                    timeAmount: item.timeAmount,
                    date: item.date,
                    categoryId: item.id,
                    categoryName: item.name,
                    price: Number((item.price * this.getItemDiscountInfo(item.nodeId, item.type).discount).toFixed(2)),
                    totalPrice: Number(item.totalPrice),
                    playOrderId: item.playOrderId,
                    entertainmentId: item.entertainmentId
                };
            });
        },
        modifyRoomOrder() {
            const room = this.rooms[0];
            const params = {
                customerName: this.name,
                customerPhone: this.phone,
                remark: this.remark,
                checkInDate: util.dateFormatLong(room.room.startDate),
                checkOutDate: util.dateFormatLong(room.room.endDate),
                idCardsList: JSON.stringify(room.idCardList),
                fee: room.price,
                isCheckIn: room.isCheckIn,
                roomId: room.roomType,
                typeId: room.categoryType,
                datePriceList: JSON.stringify(room.datePriceList),
                serviceId: room.roomOrderId,
                quickDiscountId: room.quickDiscountId,
                useDiscount: !room.priceModified,
                extraItems: JSON.stringify(room.extraItems),
                whenCheckIn: this.checkState === 'checkIn',
                ...this.getDiscountRelatedIdAndOrigin(),
                checkType: room.checkType
            };
            const callback = function() {
                http.post('/order/modifyRoomOrder', params)
                .then(res => {
                    this.hideModal();
                    bus.$emit('refreshView');
                    bus.$emit('onShowDetail', {...this.order,
                        orderId: getOrderId(this.order)
                    });
                });
            }.bind(this);
            const outRome = this.checkoutTimeOut([room]);
            if (outRome.length) {
                const name = outRome[0].roomeName;
                const roomeType = outRome[0].checktypeName;
                const roomTypeName = outRome[0].roomTypeName;
                modal.confirm({ title: '提示', message: roomeType + '[' + name + roomTypeName + ']已超时，确定保存订单吗？' }, callback);
            } else {
                callback();
            }
            
        },
        modifyFoodOrder() {
            const params = {
                caterOrderId: this.order.caterOrderId,
                remark: this.remark
            };
            http.get('/order/modifyCaterOrderRemark', params)
                .then(res => {
                    this.hideModal();
                    bus.$emit('refreshView');
                    bus.$emit('onShowDetail', {...this.order,
                        orderId: getOrderId(this.order)
                    });
                });
        },
        modifyEntertainmentOrder() {
            const enterItems = this.enterItems[0];
            const params = {
                customerName: this.name,
                customerPhone: this.phone,
                remark: this.remark,
                amount: enterItems.count,
                enterOrderId: enterItems.enterOrderId || enterItems.id,
                timeAmount: enterItems.timeAmount,
                totalPrice: enterItems.totalPrice,
                date: enterItems.date,
                ...this.getDiscountRelatedIdAndOrigin()
            };
            http.post('/order/modifyEnterOrder', params)
                .then(res => {
                    this.hideModal();
                    bus.$emit('refreshView');
                    bus.$emit('onShowDetail', {...this.order,
                        orderId: getOrderId(this.order)
                    });
                });
        },
        modifyShopOrder() {
            this.getSubmitGoods();
            const good = this.previousGoods[0];
            const params = {
                goodsItems: JSON.stringify(good.goodsItems),
                goodsOrderId: good.goodsOrderId
            };
            http.post('/order/modifyGoodsOrder', params)
                .then(res => {
                    this.hideModal();
                    bus.$emit('refreshView');
                    bus.$emit('onShowDetail', {...this.order,
                        orderId: getOrderId(this.order)
                    });
                });
        },
        // 获取 originId origin discountRelatedId discountChannel
        getDiscountRelatedIdAndOrigin() {
            const params = {
                originId: this.userOriginType.id
            };
            if (this.userOriginType.id === -5) {
                params.discountRelatedId = this.userOriginType.companyId;
                params.discountChannel = 2;
                params.origin = '企业';
            } else if (this.userOriginType.id === -4) {
                params.origin = '会员';
                if (this.vipCardId !== 0) {
                    params.discountChannel = this.vipCardId > 0 ? 4 : 1;
                    params.discountRelatedId = this.vipCardId > 0 ? this.vipCardId : this.vipId;
                }
            } else if (this.userOriginType.id === -3) {
                params.origin = '微官网';
                if (this.vipCardId !== 0) {
                    params.discountChannel = this.vipCardId > 0 ? 4 : 1;
                    params.discountRelatedId = this.vipCardId > 0 ? this.vipCardId : this.vipId;
                }
            } else {
                params.origin = this.userOriginType.name;
            }

            return params;
        },
        modifyCombinationOrder() {
            this.getSubmitGoods();
            const rooms = this.getSubmitRooms();
            const playItems = this.getSubmitEnterItems();

            const params = {
                name: this.name,
                phone: this.phone,
                remark: this.remark,
                rooms: JSON.stringify(rooms),
                playItems: JSON.stringify(playItems),
                items: JSON.stringify(this.newGoodItems),
                goods: JSON.stringify(this.previousGoods),
                payments: JSON.stringify([]),
                orderId: this.order.orderId,
                whenCheckIn: this.checkState === 'checkIn',
                whenCheckInDeleteRooms: JSON.stringify(this.whenCheckInDeleteRooms),
                ...this.getDiscountRelatedIdAndOrigin()
            };
            
            const callback = function() {
                http.post('/order/modify', params)
                .then(res => {
                    this.hideModal();
                    bus.$emit('refreshView');
                    bus.$emit('onShowDetail', {...this.order,
                        orderId: getOrderId(this.order)
                    });
                });
            }.bind(this);
            const outRome = this.checkoutTimeOut(rooms);
            if (outRome.length) {
                const name = outRome[0].roomeName;
                const roomeType = outRome[0].checktypeName;
                const roomTypeName = outRome[0].roomTypeName;
                modal.confirm({ title: '提示', message: roomeType + '[' + name + roomTypeName + ']已超时，确定保存订单吗？' }, callback);
            } else {
                callback();
            }
        },
        handleQuickTeamBusiness(type) {
            bus.$emit('submitOrder');
            if (!this.validate()) {
                return false;
            }
            const rooms = this.getQuickOrTeamRooms();
            this.getSubmitGoods();
            const entertainmentItems = this.getSubmitEnterItems();

            const params = {
                name: this.name,
                phone: this.phone,
                remark: this.remark,
                rooms: JSON.stringify(rooms),
                entertainmentItems: JSON.stringify(entertainmentItems),
                items: JSON.stringify(this.newGoodItems),
                goods: JSON.stringify(this.previousGoods),
                ...this.getDiscountRelatedIdAndOrigin()
            };
            if (type && type === 'auto') {
                params.type = 1;
            } else {
                params.type = 0;
            }
            const callback = function() {
                http.post('/room/quickOrTeamReserveOrder', params)
                .then(res => {
                    this.hideModal();
                    const business = {};
                    business.businessJson = JSON.parse(JSON.stringify(params));
                    business.businessJson.functionType = 1;
                    business.businessJson.orderId = res.data.orderId;
                    business.orderDetail = { ...res.data
                    };
                    business.cashierType = this.checkState;
                    bus.$emit('refreshView');
                    bus.$emit('onShowDetail', {
                        type: res.data.orderType,
                        orderId: res.data.orderId
                    });
                });
            }.bind(this);
            const outHandel = function() {
                const outRome = this.checkoutTimeOut(rooms);
                if (outRome.length) {
                    const name = outRome[0].roomeName;
                    const roomeType = outRome[0].checktypeName;
                    modal.confirm({ title: '提示', message: roomeType + '[' + name + ']已超时，确定保存订单吗？' }, callback);
                } else {
                    callback();
                }
            }.bind(this);

            if (type === 'auto' && rooms.filter((room) => (room.checkRoomType === 1 || room.checkType === 1)).length) {
                modal.confirm({ title: '提示', message: '预订钟点房不会自动排房，确认提交预订吗？' }, outHandel);
            } else {
                outHandel();
            }
        },
        handleRoomBusiness() {
            this.getSubmitGoods();
            const rooms = this.getSubmitRooms();
            const entertainmentItems = this.getSubmitEnterItems();

            const params = {
                name: this.name,
                phone: this.phone,
                remark: this.remark,
                rooms: JSON.stringify(rooms),
                entertainmentItems: JSON.stringify(entertainmentItems),
                items: JSON.stringify(this.newGoodItems),
                goods: JSON.stringify(this.previousGoods),
                ...this.getDiscountRelatedIdAndOrigin()
            };
            // const str = util.dateFormat(new Date());
            // const arr = str.split('-');
            // let stateChange = false;
            // rooms.forEach(el => {
            // if(new Date(el.endDate) > new Date(arr[0], arr[1] - 1, arr[2] - 1)) {
            //         this.checkState = 'ing';
            //         stateChange = true;
            //     }
            // })
            if (this.checkState === 'ing') {
                params.type = 0;
            } else if (this.checkState === 'finish') {
                params.type = 1;
            } else if (this.checkState === 'book') {
                params.type = 2;
            }
            const callback = function() {
                http.post('/room/confirmOrder', params)
                .then(res => {
                    this.hideModal();
                    const business = {};
                    business.businessJson = JSON.parse(JSON.stringify(params));
                    business.businessJson.functionType = 1;
                    business.businessJson.orderId = res.data.orderId;
                    business.orderDetail = {...res.data
                    };
                    business.cashierType = this.checkState;
                    if (this.checkState === 'ing') {
                        bus.$emit('refreshView');
                    }
                    if (this.checkState === 'finish') {
                        bus.$emit('showCashier', {
                            type: 'register',
                            business: business
                        });
                    } else {
                        bus.$emit('refreshView');
                        bus.$emit('onShowDetail', {
                            type: res.data.orderType,
                            orderId: res.data.orderId
                        });
                    }
                });
            }.bind(this);
            const outRome = this.checkoutTimeOut(rooms);
            if (outRome.length && this.checkState === 'ing') {
                const name = outRome[0].roomeName;
                const roomeType = outRome[0].checktypeName;
                const roomTypeName = outRome[0].roomTypeName;
                modal.confirm({ title: '提示', message: roomeType + '[' + name + roomTypeName + ']已超时，确定保存订单吗？' }, callback);
            } else {
                callback();
            }
            
        },
        submitInfo() {
            // 获取 shopGoodsItems enterItems rooms
            bus.$emit('submitOrder');

            if (!this.validate()) {
                return false;
            }

            const rooms = this.getOverTimeRooms();
            // 编辑订单根据不同的type调用不同的接口
            
                if (this.checkState === 'editOrder' || this.checkState === 'checkIn') {
                    // 住宿订单
                    if (this.order.type === ORDER_TYPE.ACCOMMODATION && this.order.isCombinationOrder) {
                        this.modifyRoomOrder();
                    }

                    // 餐饮订单
                    if (this.order.type === ORDER_TYPE.CATERING) {
                        this.modifyFoodOrder();
                    }

                    // 娱乐订单
                    if (this.order.type === ORDER_TYPE.ENTERTAINMENT) {
                        this.modifyEntertainmentOrder();
                    }

                    // 商超订单
                    if (this.order.type === ORDER_TYPE.RETAIL) {
                        this.modifyShopOrder();
                    }

                    // 住宿独立订单使用组合订单编辑接口
                    if (this.order.type === ORDER_TYPE.COMBINATION || (this.order.type === ORDER_TYPE.ACCOMMODATION && !this.order.isCombinationOrder)) {
                        this.modifyCombinationOrder();
                    }
                } else {
                    // 住宿业务
                    this.handleRoomBusiness();
                }

            // 判断钟点房时是否超时
            // const outRome = this.checkoutTimeOut(rooms);
            /*if (outRome.length) {
                const name = outRome[0].roomeName;
                const roomeType = outRome[0].checktypeName;
                modal.confirm({ title: '提示', message: roomeType + '[' + name + ']已超时，确定保存订单吗？' }, callback);
            } else {
                callback();
            }*/
        },
        handleRoomChange(rooms) {
            this.rooms = rooms;
        },
        handleWhenCheckInDeleteRooms(whenCheckInDeleteRooms) {
            this.whenCheckInDeleteRooms = whenCheckInDeleteRooms;
        },
        handleFoodChange() {
            return false;
        },
        handleEnterChange(enter) {
            this.enterItems = enter;
        },
        handleShopChange(goods) {
            this.shopItems = goods;
        },
        handleRoomPriceChange(price) {
            this.roomPrice = price;
        },
        handleFoodPriceChange(price) {
            this.foodPrice = price;
        },
        handlEnterPriceChange(price) {
            this.enterPrice = price;
        },
        handleShopPriceChange(price) {
            this.goodsPrice = price;
        }
    }
};
</script>
