<template>
    <div>
        <div class="modal fade roomModals" id="orderEditor" role="dialog" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content" @click="hidePriceList(registerRooms)">
                    <!-- header start -->
                    <div class="roomModals-header">
                        <div class="header-container">
                            <span class="header-text">{{titleAndBtn.title}}</span>
                        </div>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="roomModals-body">
                        <div class="content-item">
                            <p class="content-item-title"><span>客户信息</span></p>
                            <div class="userInfo-items">
                                <div class="userInfo-item">
                                    <div class="userVip-list" v-show="vipListShow" @click.stop="stopPropagation">
                                        <p class="userVip-item" v-for="vip in vipList" @click="setUserInfo(vip)">
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
                                           v-model="name"
                                           @input="changeVipList(1)">
                                </div>
                                <div class="userInfo-item userInfo-phone vip-level-container">
                                    <label for="phone">手机号</label>
                                    <input class="dd-input" type="text" id="phone" maxlength="11" placeholder="11位手机号"
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
                                        <dd-select v-model="userOriginType">
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
                        <RoomEditor :rooms="rooms" :categories="categories" :vipDiscountDetail="vipDiscountDetail" @change="handleRoomChange"/>
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
    import event from '../../event';
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
    import RoomEditor from './RoomEditor.vue';

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
                rooms: [],
                showOrder: false,
                vipDiscountDetail: {},
                lastModifyRoomTime: 0,
                vipListShow: false,
                vipList: [],
                timeCount: 0,
                goodsSelectModalShow: false,
                enterSelectModalShow: false,
                modifyEnterOrShopIndex: -1,
                roomStatusRequest: 0,
                lastRoomItem: {},
                lastEnterItem: {},
                isLoading: false,
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
            RoomEditor
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
                let totalPrice = 0;
                if (this.rooms.length > 0) {
                    this.rooms.forEach(room => {
                        totalPrice += Number(room.price);
                    });
                }

                if (this.enterItems.length > 0) {
                    this.enterItems.forEach(enter => {
                        if (enter.id) {
                            const enterPrice = enter.totalPrice;
                            totalPrice += Number(enterPrice);
                        }
                    });
                }
                if (this.shopGoodsItems.length > 0) {
                    this.shopGoodsItems.forEach(good => {
                        if (good.id) {
                            const goodPrice = ((good['price'] * this.getItemDiscountInfo(0, good.type, this.vipDiscountDetail).discount).toFixed(2) * good.count).toFixed(2);
                            totalPrice += Number(goodPrice);
                        }
                    });
                }

                return Number(totalPrice).toFixed(2);
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
                        ? { phone: this.phone, orderId: this.order.orderId, orderType: -1 }
                        : { phone: this.phone };
                    this.getVipDiscount(params);
                }
                if (originType !== -5 && originType !== -4) {
                    this.vipDiscountDetail = {};
                }
            },
            phone(newVal) {
                const params = this.checkState === 'editOrder'
                    ? { phone: newVal, orderId: this.order.orderId, orderType: -1 }
                    : { phone: newVal };
                let search = true;//this.checkState !== 'editOrder' || (this.checkState === 'editOrder' && this.order.discountChannel === 1);
                if (newVal.length === 11 && search) {
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

                    if (this.order.originId === -5) {
                        this.userOriginType = `${this.order.discountRelatedId}~${this.order.originId}`;
                    } else {
                        this.userOriginType = `${this.order.originId}~${this.order.originId}`;
                    }

                    const enterItems = [];
                    const filterEnters = this.order.playItems.filter(enter => {
                        return enter.state !== 3;
                    });
                    filterEnters.forEach(item => {
                        const enter = { ...item };
                        enter.price = item.originPrice;
                        enter.changeTimes = 0;
                        enter.id = item.categoryId;
                        enter.count = item.amount;
                        enter.selfInventory = item.amount;
                        enter.type = 2;
                        enter.inventory = undefined;
                        enter.originPrice = (item.originPrice * item.amount * item.timeAmount).toFixed(2);
                        enter.totalPrice = item.totalPrice;
                        enterItems.push(enter);
                    });
                    this.enterItems = JSON.parse(JSON.stringify(enterItems));

                    const registerRooms = [];
                    const filterRooms = this.order.rooms.filter(room => {
                        return room.state === 0 || room.state === 1;
                    });
                    filterRooms.forEach(item => {
                        const room = {};
                        room.categoryType = item.typeId;
                        room.roomType = item.roomId;
                        room.originPrice = item.originPrice;
                        room.price = Number(item.fee.toFixed(2));
                        room.room = { roomId: item.roomId, startDate: item.startDate, endDate: item.endDate };
                        room.idCardList = item.idCardList;
                        room.datePriceList = item.datePriceList.map(dat => {
                            const newDate = { showInput: false };
                            newDate.date = dat.date;
                            newDate.dateFee = dat.dateFee;
                            return newDate;
                        });
                        room.originDatePriceList = JSON.parse(JSON.stringify(room.datePriceList));
                        room.showPriceList = false;
                        room.showTip = false;
                        room.state = item.state;
                        room.roomOrderId = item.serviceId;
                        room.changeTimes = 0;
                        registerRooms.push(room);
                    });
                    this.rooms = registerRooms;

                    $('#orderEditor').modal('show');
                }
            }
        },
        methods: {
            getVipDiscount(params) {
                http.get('/vipUser/getVipDiscount', params)
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
            },
            hideModal(e) {
                e.stopPropagation();
                event.$emit('hideOrderEditor');
                $('#orderEditor').modal('hide');
            },
            hidePriceList(arr) {
                arr.forEach(item => {
                    item.showPriceList = false;
                    item.datePriceList.forEach(date => {
                        date.showInput = false;
                    });
                });
                this.vipListShow = false;
                this.vipList = [];
            },
            stopPropagation() {
                return false;
            },
            setUserInfo(obj) {
                this.name = obj.name;
                this.phone = obj.phone;
                this.vipListShow = false;
                this.userOriginType = '-4~-4';
            },
            submitInfo() {

            },
            handleRoomChange(rooms) {
                this.rooms = rooms;
            }
        }
    };
</script>
