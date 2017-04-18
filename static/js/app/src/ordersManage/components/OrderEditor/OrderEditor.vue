<template>
    <div>
        <div class="modal fade roomModals" id="orderEditor" role="dialog" data-backdrop="static">
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
                                    <div class="userVip-list" v-show="vipListShow" @click.stop="()=>{}">
                                        <p class="userVip-item" v-for="vip in vipList" @click="setVipInfo(vip)">
                                            <span class="vip-level" v-if="vip.level">
                                                [
                                                <span class="vip-level-text">{{ vip.level }}</span>
                                                ]
                                            </span>
                                            <span class="vip-level" v-if="!vip.level"></span>
                                            <span class="vip-name">{{ vip.name }}</span>
                                            <span class="vip-phone">{{ vip.phone }}</span>
                                        </p>
                                    </div>
                                    <label for="name">联系人</label>
                                    <input class="dd-input" type="text" maxlength="16" placeholder="联系人姓名" id="name"
                                           :disabled="!(order.type === ORDER_TYPE.COMBINATION || (order.type === ORDER_TYPE.ACCOMMODATION && !order.isCombinationOrder))"
                                           v-model="name"
                                           @input="changeVipList(1)">
                                </div>
                                <div class="userInfo-item userInfo-phone vip-level-container">
                                    <label for="phone">手机号</label>
                                    <input class="dd-input" type="text" id="phone" maxlength="11" placeholder="11位手机号"
                                           :disabled="!(order.type === ORDER_TYPE.COMBINATION || (order.type === ORDER_TYPE.ACCOMMODATION && !order.isCombinationOrder))"
                                           v-model="phone"
                                           @input="changeVipList(2)">
                                    <span v-if="vipDiscountDetail.isVip">
                                        <span class="vip-level-img"></span>
                                        <span class="vip-level-tip">{{ vipDiscountDetail.vipDetail.level }}</span>
                                    </span>
                                    <span class="error-phone-tip" v-show="!phoneValid">
                                        <span style="vertical-align: text-bottom">&uarr;</span>
                                        请输入正确的手机号
                                    </span>
                                </div>
                                <div class="userInfo-item">
                                    <label>客户来源</label>
                                    <div class="select-component-container">
                                        <dd-select v-model="userOriginType" :disabled="!(order.type === ORDER_TYPE.COMBINATION || (order.type === ORDER_TYPE.ACCOMMODATION && !order.isCombinationOrder) || (order.type === ORDER_TYPE.CATERING && !order.isCombinationOrder))">
                                            <dd-option :key="origin.originType" v-for="origin in userSelfOrigins"
                                                       :value="origin.originType" :label="origin.name">
                                                <span :title="origin.name">{{origin.name}}</span>
                                            </dd-option>
                                            <dd-group-option v-for="item in userGroupOrigins" :label="item.label"
                                                             :key="item" v-if="item.origins.length > 0">
                                                <dd-option v-for="origin in item.origins" :key="origin.originType"
                                                           :value="origin.originType" :label="`企业(${origin.name})`">
                                                    <div class="user-group-origin">
                                                        <span class="user-group-company" :title="origin.name">
                                                            {{ origin.name }}
                                                        </span>
                                                        <span class="user-group-img" v-if="!origin.type"
                                                              :title="origin.info"></span>
                                                    </div>
                                                </dd-option>
                                            </dd-group-option>
                                        </dd-select>
                                    </div>
                                    <span class="company-origin-tipLike" v-show="!showCompanyOriginTip"></span>
                                    <span class="company-origin-tipImg" v-show="showCompanyOriginTip"></span>
                                    <div class="company-origin-tips">
                                        变更客户来源后，该订单中已发生的企业挂帐、企业扣款、退款至企业均将会被取消。
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- header end -->
                        <RoomEditor v-if="this.order.type === ORDER_TYPE.ACCOMMODATION || this.order.type === ORDER_TYPE.COMBINATION"
                                    :order="order"
                                    :categories="categories"
                                    :vipDiscountDetail="vipDiscountDetail"
                                    @change="handleRoomChange"
                                    @priceChange="handleRoomPriceChange"/>
                        <CateEditor
                                v-if="this.order.type === ORDER_TYPE.CATERING"
                                :vipDiscountDetail="vipDiscountDetail"
                                @change="handleFoodChange"
                                @priceChange="handleFoodPriceChange">
                        </CateEditor>
                        <EnterEditor
                             :order="order"
                             v-if="this.order.type === ORDER_TYPE.ENTERTAINMENT ||this.order.type === ORDER_TYPE.COMBINATION || (order.type === ORDER_TYPE.ACCOMMODATION && !order.isCombinationOrder)"
                             :vipDiscountDetail="vipDiscountDetail"
                             @change="handleEnterChange"
                             @priceChange="handlEnterPriceChange"/>
                        <ShopEditor v-if="order.type === ORDER_TYPE.RETAIL || order.type === ORDER_TYPE.COMBINATION || (order.type === ORDER_TYPE.ACCOMMODATION && !order.isCombinationOrder)"
                                    :order="order"
                                    :vipDiscountDetail="vipDiscountDetail"
                                    @change="handleShopChange"
                                    @priceChange="handleShopPriceChange">
                        </ShopEditor>
                        <div class="content-item">
                            <p class="content-item-title"><span>备注信息</span></p>
                            <div class="remark-items">
                                <textarea name="remark" placeholder="请输入备注信息" maxlength="140" v-model="remark"
                                          class="dd-input">
                                </textarea>
                                <span class="valid-remark-tip"
                                      :style="{color: remark.length >= 140 ? '#f24949' : '#999999'}">
                                    {{remark.length}}/140
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div>
                            <span class="footer-label">订单金额</span>
                            <span class="footer-price">¥{{totalPrice}}</span>
                        </div>
                        <div class="dd-btn dd-btn-primary" @click="submitInfo">{{titleAndBtn.btn}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    .userInfo-item:last-child, .select-component-container {
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
        background: url("../../../../../../image/modal/room_modal_info.png");
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
        background: url("../../../../../../image/modal/room_modal_info.png");
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
</style>
<script>
    import { mapActions, mapState } from 'vuex';
    import bus from '../../../common/eventBus';
    import {
        DdDropdown,
        DdDropdownItem,
        DdDatepicker,
        DdSelect,
        DdGroupOption,
        DdOption
    } from 'dd-vue-component';
    import http from '../../../common/AJAXService';
    import { ORDER_TYPE } from '../../constant';
    import modal from '../../../common/modal';
    import types from '../../store/types';
    import RoomEditor from './RoomEditor.vue';
    import util from '../../../common/util';
    import EnterEditor from './EntertainmentEditor.vue';
    import ShopEditor from './ShopEditor.vue';
    import CateEditor from './CateEditor.vue';
    import { getOrderId } from '../../utils/order';
    export default{
        name: 'OrderEditor',
        data() {
            return {
                name: '',
                phone: '',
                userOriginType: '-1~-1',
                userOrigins: [],
                userSelfOrigins: [],
                userGroupOrigins: [],
                phoneValid: true,
                remark: '',
                enterItems: [],
                shopGoodsItems: [],
                newGoodItems: [],
                previousGoods: [],
                rooms: [],
                shopItems: {},
                showOrder: false,
                vipDiscountDetail: {},
                lastModifyRoomTime: 0,
                vipListShow: false,
                vipList: [],
                timeCount: 0,
                roomStatusRequest: 0,
                lastRoomItem: {},
                lastEnterItem: {},
                roomPrice: 0,
                enterPrice: 0,
                goodsPrice: 0,
                foodPrice: 0,
                ORDER_TYPE
            };
        },
        props: {
            orderEditorVisible: {
                type: Boolean,
                default: false
            },
            checkState: {
                type: String,
                default: ''
            },
            categories: Array
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
            CateEditor
        },
        computed: {
            ...mapState({ order: 'orderDetail' }),
            titleAndBtn() {
                switch (this.checkState) {
                    case 'ing':
                        return { title: '直接入住', btn: '入住并收银' };
                    case 'finish':
                        return { title: '补录', btn: '补录' };
                    case 'book':
                        return { title: '预订', btn: '完成预订' };
                    case 'editOrder':
                        if (this.order.type === ORDER_TYPE.ACCOMMODATION) {
                            return { title: '编辑住宿订单', btn: '完成' };
                        }

                        if (this.order.type === ORDER_TYPE.COMBINATION) {
                            return { title: '编辑组合订单', btn: '完成' };
                        }

                        if (this.order.type === ORDER_TYPE.ENTERTAINMENT) {
                            return { title: '编辑娱乐订单', btn: '完成' };
                        }

                        if (this.order.type === ORDER_TYPE.CATERING) {
                            return { title: '编辑餐饮订单', btn: '完成' };
                        }

                        if (this.order.type === ORDER_TYPE.RETAIL) {
                            return { title: '编辑商超订单', btn: '完成' };
                        }

                        break;
                    default:
                        return { title: '编辑订单', btn: '完成' };
                }
            },
            showCompanyOriginTip() {
                const originType = Number(this.userOriginType.split('~')[1]);
                return originType === -5;
            },
            totalPrice() {
                return (this.roomPrice + this.enterPrice + this.goodsPrice + this.foodPrice).toFixed(2);
            }
        },
        created() {
            this.getData();
        },
        watch: {
            userOriginType(newVal) {
                const originType = Number(newVal.split('~')[1]);
                const originId = Number(newVal.split('~')[0]);
                if (originType === -5) {
                    this.getCompanyDiscount({ contractCompanyId: originId });
                }
                if (originType === -4 && this.phone.length === 11) {
                    const params = this.checkState === 'editOrder'
                        ? { phone: this.phone, orderId: getOrderId(this.order), orderType: this.order.type }
                        : { phone: this.phone };
                    this.getVipDiscount(params);
                }
                if (originType !== -5 && originType !== -4) {
                    this.vipDiscountDetail = {};
                }
            },
            phone(newVal) {
                const originType = Number(this.userOriginType.split('~')[1]);
                if (originType === -5 && this.checkState === 'editOrder') {
                    return false;
                }

                const params = this.checkState === 'editOrder'
                    ? { phone: newVal, orderId: getOrderId(this.order), orderType: this.order.type }
                    : { phone: newVal };
                if (newVal.length === 11) {
                    this.checkPhone();
                    this.getVipDiscount(params);
                } else if (newVal.length !== 11) {
                    this.vipDiscountDetail = {};
                }
            },
            orderEditorVisible(visible) {
                if (visible) {
                    this.name = this.order.customerName;
                    this.phone = this.order.customerPhone;
                    this.remark = this.order.remark || '';
                    this.showOrder = true;

                    // -5企业，-4会员
                    if (this.order.originId === -5) {
                        this.userOriginType = `${this.order.discountRelatedId}~${this.order.originId}`;
                    } else {
                        this.userOriginType = `${this.order.originId}~${this.order.originId}`;
                    }

                    $('#orderEditor').modal('show');
                }
            }
        },
        methods: {
            ...mapActions([
                types.LOAD_SHOP_LIST,
                types.LOAD_ENTER_LIST
            ]),
            changeVipList(num) {
                const params = num === 1 ? { name: this.name } : { phone: this.phone };
                if ((num === 1 && this.name.length >= 1) || (num === 2 && this.phone.length >= 4)) {
                    clearTimeout(this.timeCount);
                    this.timeCount = setTimeout(() => { this.getVipList(params, num); }, 500);
                }
            },
            getVipList(params, position) {
                http.ajaxWithToken('GET', '/vipUser/search', params)
                    .then(res => {
                        if (res.code === 1) {
                            this.vipList = res.data.list;
                            this.vipListShow = res.data.list && res.data.list.length > 0;
                            this.setVipListPosition(position);
                        } else {
                            modal.somethingAlert(res.msg);
                        }
                    });
            },
            setVipListPosition(position) {
                const vipList = document.querySelector('.userVip-list');
                if (vipList) {
                    vipList.style.left = position === 1 ? 46 + 'px' : 312 + 'px';
                }
            },
            checkPhone() {
                const phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                this.phoneValid = phoneReg.test(this.phone) || this.phone === '';
            },
            getVipDiscount(params) {
                http.ajaxWithToken('GET', '/vipUser/getVipDiscount', params)
                    .then(res => {
                        if (res.code === 1) {
                            this.vipDiscountDetail = { ...res.data };
                            if (!this.vipDiscountDetail.isVip) {
                                this.userOriginType = '-1~-1';
                            } else {
                                this.userOriginType = '-4~-4';
                            }
                        } else {
                            modal.somethingAlert(res.msg);
                        }
                    });
            },
            getCompanyDiscount(params) {
                http.ajaxWithToken('GET', '/contractCompany/getContractDiscount', params)
                    .then(res => {
                        if (res.code === 1) {
                            const discountList = res.data;
                            this.vipDiscountDetail = {};
                            this.vipDiscountDetail.isVip = false;
                            this.vipDiscountDetail.vipDetail = discountList;
                        } else {
                            modal.somethingAlert(res.msg);
                        }
                    });
            },
            getData() {
                http.get('/user/getChannels', { type: 2, isAll: true })
                    .then((res) => {
                        // 拼接originType 企业渠道：企业id~-5 会员-4～-4 自定义渠道 渠道id～渠道id
                        if (res.code === 1) {
                            const originsList = res.data.list;
                            const otherOrigins = [];
                            this.userOrigins = originsList;
                            originsList.forEach(origin => {
                                if (origin.id === -1 || origin.id === -4) {
                                    origin.originType = `${origin.id}~${origin.id}`;
                                    this.userSelfOrigins.push(origin);
                                } else if (origin.id === -5) {
                                    origin.companyList.forEach(company => {
                                        const companyName = `企业名称:${company.companyName}(${company.companyType ? '可挂帐' : '不可挂帐'})`;
                                        const number = `企业编号:${company.contractNum || ''}`;
                                        const name = `联系人:${company.contactName || ''}`;
                                        const phone = `联系人电话:${company.contactPhone || ''}`;
                                        company.name = company.companyName;
                                        company.originType = `${company.id}~${origin.id}`;
                                        company.info = `${companyName}\n${number}\n${name}\n${phone}`;
                                    });
                                    this.userGroupOrigins.push({ label: '企业', origins: origin.companyList });
                                } else if (origin.id > 0) {
                                    origin.originType = `${origin.id}~${origin.id}`;
                                    origin.info = origin.name;
                                    otherOrigins.push(origin);
                                }
                            });
                            this.userGroupOrigins.push({ label: '其他', origins: otherOrigins });
                            this.userOriginType = this.userSelfOrigins[0].originType;
                        } else {
                            modal.somethingAlert(res.msg);
                        }
                    });
                this[types.LOAD_SHOP_LIST]().catch(e => { modal.somethingAlert(e.msg); });
                this[types.LOAD_ENTER_LIST]().catch(e => { modal.somethingAlert(e.msg); });
            },
            hideModal() {
                bus.$emit('hideOrderEditor');
                $('#orderEditor').modal('hide');
            },
            setVipInfo(vip) {
                this.name = vip.name;
                this.phone = vip.phone;
                this.vipListShow = false;
                this.userOriginType = '-4~-4';
            },
            validate() {
                let valid = true;
                let durationValid = true;
                let roomPersonValid = true;

                if (!(this.phone || this.name) || (!this.name && !this.phoneValid) || !this.phoneValid) {
                    modal.somethingAlert('请输入联系人或手机号!');
                    return false;
                }

                this.rooms.map(item => {
                    if (item.showTip) {
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
                this.enterItems.map(item => {
                    if (item.inventory + item.selfInventory <= 0) {
                        valid = false;
                    }
                });
                const enterItemsValid = this.enterItems.every(enter => { return enter.id && enter.date; });
                const shopGoodsItemsValid = this.shopGoodsItems.every(good => { return good.id; });

                if (!valid) {
                    modal.somethingAlert('订单信息有误，请核对信息后再提交！');
                    return false;
                }

                if (!durationValid) {
                    modal.somethingAlert('所选择房间的入住时间超过了400天，请核对入住信息后再提交！');
                    return false;
                }

                if (!roomPersonValid) {
                    modal.somethingAlert('请完善入住人信息！');
                    return false;
                }

                if (!enterItemsValid) {
                    modal.somethingAlert('请完善娱乐信息！');
                    return false;
                }

                if (!shopGoodsItemsValid) {
                    modal.somethingAlert('请完善商超信息！');
                    return false;
                }

                return true;
            },
            getItemDiscountInfo(nodeId, nodeType) {
                let item = {
                    discount: 1
                };
                if (this.vipDiscountDetail.vipDetail && this.vipDiscountDetail.vipDetail.discountList.length > 0) {
                    this.vipDiscountDetail.vipDetail.discountList.forEach(list => {
                        if ((nodeType === 0 || nodeType === 3) && list.nodeId === 0 && list.nodeType === nodeType) {
                            item = { ...list };
                        } else if ((nodeType !== 0 && nodeType !== 3) && (list.nodeId === nodeId && list.nodeType === nodeType)) {
                            item = { ...list };
                        }
                    });
                }

                return item;
            },
            getSubmitRooms() {
                return this.rooms.map(room => {
                    return {
                        datePriceList: room.datePriceList,
                        endDate: room.room.endDate,
                        startDate: room.room.startDate,
                        id: room.categoryType,
                        roomId: room.roomType,
                        idCardList: JSON.stringify(room.idCardList),
                        fee: room.price,
                        sub: true,
                        roomOrderId: room.roomOrderId,
                        quickDiscountId: room.quickDiscountId
                    };
                });
            },
            getSubmitGoods() {
                this.newGoodItems = this.shopItems.items.map(item => {
                    return {
                        amount: item.amount,
                        id: Number(item.id),
                        name: item.name,
                        price: item.price,
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
                            price: item.price
                        };
                    });
                    this.previousGoods.push(previousItem);
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
                    checkInDate: room.startDate,
                    checkOutDate: room.endDate,
                    idCardsList: JSON.stringify(room.idCardList),
                    fee: room.price,
                    roomId: room.roomType,
                    datePriceList: room.datePriceList,
                    serviceId: room.roomOrderId,
                    quickDiscountId: room.quickDiscountId,
                    ...this.getDiscountRelatedIdAndOrigin()
                };
                http.post('/order/modifyRoomOrder', params)
                    .then(res => {
                        if (res.code === 1) {
                            this.hideModal();
                            bus.$emit('refreshView');
                            bus.$emit('onShowDetail', { orderId: getOrderId(this.order), ...this.order });
                        } else {
                            modal.alert(res.msg);
                        }
                    });
            },
            modifyFoodOrder() {
                const params = {
                    caterOrderId: this.order.caterOrderId,
                    remark: this.remark
                };
                http.get('/order/modifyCaterOrderRemark', params)
                    .then(res => {
                        if (res.code === 1) {
                            this.hideModal();
                            bus.$emit('refreshView');
                            bus.$emit('onShowDetail', { orderId: getOrderId(this.order), ...this.order });
                        } else {
                            modal.alert(res.msg);
                        }
                    });
            },
            modifyEntertainmentOrder() {
                const enterItems = this.enterItems[0];
                const params = {
                    customerName: this.name,
                    customerPhone: this.phone,
                    remark: this.remark,
                    amount: enterItems.count,
                    enterOrderId: enterItems.id,
                    timeAmount: enterItems.unitTime,
                    totalPrice: enterItems.totalPrice,
                    ...this.getDiscountRelatedIdAndOrigin()
                };
                http.post('/order/modifyEnterOrder', params)
                    .then(res => {
                        if (res.code === 1) {
                            this.hideModal();
                            bus.$emit('refreshView');
                            bus.$emit('onShowDetail', { orderId: getOrderId(this.order), ...this.order });
                        } else {
                            modal.alert(res.msg);
                        }
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
                        if (res.code === 1) {
                            this.hideModal();
                            bus.$emit('refreshView');
                            bus.$emit('onShowDetail', { orderId: getOrderId(this.order), ...this.order });
                        } else {
                            modal.alert(res.msg);
                        }
                    });
            },
            // 获取 originId origin discountRelatedId
            getDiscountRelatedIdAndOrigin() {
                const params = {};
                if (Number(this.userOriginType.split('~')[1]) === -5) {
                    params.originId = -5;
                    params.discountRelatedId = Number(this.userOriginType.split('~')[0]);
                } else {
                    params.originId = Number(this.userOriginType.split('~')[0]);
                }

                if (this.vipDiscountDetail.isVip) {
                    params.discountRelatedId = this.vipDiscountDetail.vipDetail.vipId;
                }

                if (Number(this.userOriginType.split('~')[0]) === -3) {
                    params.origin = '微官网';
                } else if (Number(this.userOriginType.split('~')[1]) === -5) {
                    params.origin = '企业';
                } else {
                    this.userOrigins.forEach(origin => {
                        if (origin.id === Number(this.userOriginType.split('~')[0])) {
                            params.origin = origin.name;
                        }
                    });
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
                    ...this.getDiscountRelatedIdAndOrigin()
                };
                http.post('/order/modify', params)
                    .then(res => {
                        if (res.code === 1) {
                            this.hideModal();
                            bus.$emit('refreshView');
                            bus.$emit('onShowDetail', { orderId: getOrderId(this.order), ...this.order });
                        } else {
                            modal.alert(res.msg);
                        }
                    });
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
                if (this.checkState === 'ing') {
                    params.type = 0;
                } else if (this.checkState === 'finish') {
                    params.type = 1;
                } else if (this.checkState === 'book') {
                    params.type = 2;
                }

                http.post('/room/confirmOrder', params)
                    .then(res => {
                        this.isLoading = false;
                        if (res.code === 1) {
                            this.hideModal();
                            if (this.checkState === 'ing' || this.checkState === 'finish') {
                                const business = {};
                                business.businessJson = JSON.parse(JSON.stringify(params));
                                business.businessJson.functionType = 1;
                                business.businessJson.orderId = res.data.orderId;
                                business.orderDetail = { ...res.data };
                                business.cashierType = this.checkState;
                                this.$emit('showCashier', { type: 'register', business: business });
                            } else {
                                bus.$emit('refreshView');
                                bus.$emit('onShowDetail', { orderId: getOrderId(this.order), ...this.order });
                            }
                        } else {
                            modal.alert(res.msg);
                        }
                    });
            },
            submitInfo() {
                // 获取 shopGoodsItems enterItems rooms
                bus.$emit('submitOrder');

                if (!this.validate()) {
                    return false;
                }

                // 编辑订单根据不同的type调用不同的接口
                if (this.checkState === 'editOrder') {
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
            },
            handleRoomChange(rooms) {
                this.rooms = rooms;
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
