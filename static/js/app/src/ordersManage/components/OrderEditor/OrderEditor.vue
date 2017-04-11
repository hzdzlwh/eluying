<template>
    <div>
        <div class="modal fade roomModals" id="orderEditor" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content" @click="hidePriceList(registerRooms)">
                    <div class="roomModals-header">
                        <div class="header-container">
                            <span class="header-text">{{modalTitleOrBtn.title}}</span>
                            <span v-if="order.orderState && checkState === 'editOrder'"
                                  class="order-state-angle"
                                  :style="{ borderColor: getOrderState(order.orderState)['borderColor']}">
                            </span>
                            <span v-if="order.orderState && checkState === 'editOrder'"
                                  class="order-state"
                                  :style="{ background: getOrderState(order.orderState)['backgroundColor']}"
                                  v-text="getOrderState(order.orderState)['text']">
                            </span>
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
                                            <dd-option :key="origin.originType" v-for="origin in userSelfOrigins" :value="origin.originType" :label="origin.name">
                                                <span :title="origin.name">{{origin.name}}</span>
                                            </dd-option>
                                            <dd-group-option v-for="item in userGroupOrigins" :label="item.label" :key="item" v-if="item.origins.length > 0">
                                                <dd-option v-for="origin in item.origins" :key="origin.originType" :value="origin.originType" :label="`企业(${origin.name})`">
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
                                    <span class="company-origin-tipLike" v-show="!showCompanyOriginTip"></span>
                                    <span class="company-origin-tipImg" v-show="showCompanyOriginTip"></span>
                                    <div class="company-origin-tips">
                                        变更客户来源后，该订单中已发生的企业挂帐、企业扣款、退款至企业均将会被取消。
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>备注信息</span></p>
                            <div class="remark-items">
                                <textarea name="remark" placeholder="请输入备注信息" maxlength="140" v-model="remark"
                                          class="dd-input">
                                </textarea>
                                <span class="valid-remark-tip" :style="{color: remark.length >= 140 ? '#f24949' : '#999999'}">
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
                        <div class="dd-btn dd-btn-primary" @click="submitInfo">{{modalTitleOrBtn.btn}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">

</style>
<script>
    import { mapActions, mapState } from 'vuex';
    import { DdDropdown, DdDropdownItem, DdPagination, DdDatepicker, DdSelect, DdGroupOption, DdOption } from 'dd-vue-component';

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
                registerRooms: [],
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
                isLoading: false
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
            }
        },
        components: {
            DdDropdown,
            DdDropdownItem,
            DdDatepicker,
            DdSelect,
            DdGroupOption,
            DdOption
        },
        computed: {
            ...mapState({ order: 'orderDetail' }),
            modalTitleOrBtn() {
                if (this.checkState === 'ing') {
                    return { title: '直接入住', btn: '入住并收银' };
                } else if (this.checkState === 'finish') {
                    return { title: '补录', btn: '补录' };
                } else if (this.checkState === 'book') {
                    return { title: '预订', btn: '完成预订' };
                } else {
                    return { title: '编辑订单', btn: '完成' };
                }
            },
            showCompanyOriginTip() {
                const originType = Number(this.userOriginType.split('~')[1]);
                return originType === -5;
            },
            totalPrice() {
                let totalPrice = 0;
                if (this.registerRooms.length > 0) {
                    this.registerRooms.forEach(room => {
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
            console.log('hi');
        },
        watch: {
            orderEditorVisible() {
                this.name = this.order.name;
                this.phone = this.order.phone;
                this.remark = this.order.remark;
                $('#orderEditor').modal('show');
            }
        },
        methods: {
            hideModal(e) {
                e.stopPropagation();
                this.refreshData();
                this.$emit('changeRegisterInfoShow', false);
                $('#registerInfoModal').modal('hide');
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

            }
        }
    };
</script>
