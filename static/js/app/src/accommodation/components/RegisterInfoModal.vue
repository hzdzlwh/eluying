<template>
    <div>
        <div class="modal fade roomModals" id="registerInfoModal" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content" @click="hidePriceList(registerRooms)">
                    <div class="roomModals-header">
                        <span class="header-text">{{modalTitleOrBtn.title}}</span>
                        <span class="close-icon" @click="hideModal"></span>
                    </div>
                    <div class="roomModals-body">
                        <div class="content-item">
                            <p class="content-item-title"><span>客户信息</span></p>
                            <div class="userInfo-items">
                                <div class="userInfo-item">
                                    <label for="name">联系人</label>
                                    <input class="dd-input" type="text" maxlength="16" placeholder="联系人姓名" id="name" v-model="name">
                                </div>
                                <div class="userInfo-item userInfo-phone">
                                    <label for="phone">手机号</label>
                                    <input class="dd-input" type="text" id="phone" maxlength="11" placeholder="11位手机号" @blur="checkPhone" v-model="phone">
                                    <span class="error-phone-tip" v-show="!phoneValid"><span style="vertical-align: text-bottom">&uarr;</span>请输入正确的手机号</span>
                                </div>
                                <div class="userInfo-item">
                                    <label>客源渠道</label>
                                    <dd-select v-model="userOriginType">
                                        <dd-option v-for="origin in userOrigins" :value="origin.id" :label="origin.name">
                                        </dd-option>
                                    </dd-select>
                                </div>
                            </div>
                        </div>
                        <div class="content-item" v-if="registerRooms && registerRooms.length > 0">
                            <p class="content-item-title">
                                <span>房间信息</span>
                                <span class="increase-container" @click="addItem(0)"><span class="increase-icon"></span>添加房间</span>
                            </p>
                            <div class="registerRoom-items">
                                <div class="registerRoom-container" v-for="(item,index) in registerRooms">
                                    <div class="registerRoom-item">
                                        <span class="room-icon"></span>
                                        <div class="shop-item-content">
                                            <span class="useless-tip error" v-if="item.showTip">该房型在该时间段无可用房间</span>
                                            <dd-select v-model="item.categoryType" placeholder="请选择房型" @input="changeRoomType(item)">
                                                <dd-option v-for="category in categoryList" :value="category.id" :label="category.name">
                                                </dd-option>
                                            </dd-select>
                                            <div class="room-category">
                                                <dd-select v-model="item.roomType" placeholder="请选择房型" @input="modifyRoom(item)">
                                                    <dd-option v-for="room in getRoomsList(item.categoryType)" :value="room.id" :label="room.name">
                                                    </dd-option>
                                                </dd-select>
                                            </div>
                                            <div class="room-date" style="display: inline-block; position: relative;">
                                                <span class="useless-tip error" style="left: 28px;" v-if="checkIsToday(item.room.startDate)">该房间的入住时间必需为今日！</span>
                                                <label class="label-text">入住</label>
                                                <div class="enterDate">
                                                    <dd-datepicker placeholder="选择时间" v-model="item.room.startDate" @input="modifyRoom(item)" :disabled-date="disabledStartDate(new Date())"/>
                                                </div>
                                                <span>~</span>
                                                <div class="enterDate">
                                                    <dd-datepicker placeholder="选择时间" v-model="item.room.endDate" @input="modifyRoom(item)" :disabled-date="disabledEndDate(item.room.startDate)"/>
                                                </div>
                                                <label class="label-text">共{{getDateDiff(item.room.startDate, item.room.endDate)}}晚</label>
                                            </div>
                                            <label class="label-text">房费</label>
                                            <div class="registerInfoModal-roomPrice" @click.stop="stopPropagation">
                                                <input class="dd-input" v-model="item.price" style="width: 80px" @click.stop="showPriceList(index)"/>
                                                <div class="registerInfoModal-roomPriceList" v-if="item.showPriceList">
                                                        <dl class="price-item" v-for="priceItem in item.datePriceList">
                                                            <dt>{{priceItem.date.slice(5)}}</dt>
                                                            <dd>¥{{getDatePrice(priceItem, item.datePriceList, item.price)}}</dd>
                                                            <dd style="display: none">
                                                                <input class="dd-input" style="width: 60px;">
                                                            </dd>
                                                        </dl>
                                                    </div>
                                            </div>
                                        </div>
                                        <span class="delete-icon" @click="deleteItem(0, index)"></span>
                                    </div>
                                    <CheckInPerson
                                            :personsObj="{id: index, persons: item.idCardList}"
                                            @addPerson="addPerson"
                                            @deletePerson="deletePerson"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title">
                                <span>娱乐信息</span>
                                <span class="increase-container" @click="addItem(2)"><span class="increase-icon"></span>添加项目</span>
                            </p>
                            <div class="shop-items">
                                <div class="shop-item" v-for="(item, index) in enterItems">
                                    <span class="enter-icon"></span>
                                    <div class="shop-item-content">
                                        <dd-select v-model="item.id" placeholder="选择娱乐项目" @input="modifyEnter(item)">
                                            <dd-option v-for="enter in enterList" :value="enter.id" :label="enter.name">
                                            </dd-option>
                                        </dd-select>
                                        <div class="time-container" v-if="!!getItemInfo(item.type, item.id)['unitTime']">
                                            <label>时长({{getItemInfo(item.type, item.id)['timeUnit']}}）</label>
                                            <counter @numChange="handleNumChange" :num="item.timeAmount * getItemInfo(item.type, item.id)['unitTime']" :id="index" :type="-2" :step="getItemInfo(item.type, item.id)['unitTime']"></counter>
                                        </div>
                                        <div class="enterDate-container">
                                            <label>时间</label>
                                            <div class="enterDate">
                                                <dd-datepicker placeholder="选择时间" v-model="item.date" @input="modifyEnter(item)" />
                                            </div>
                                        </div>
                                        <div class="shop-item-count">
                                            <label>数量</label>
                                            <counter @numChange="handleNumChange" :num="item.count" :id="index" :type="2" :max=" item.inventory ? item.inventory : 999">
                                                <p class="valid" v-if="item.inventory"><span style="vertical-align: text-bottom">&uarr;</span>服务上限剩余{{item.inventory}}</p>
                                            </counter>
                                            <p class="shop-item-price">
                                                <label>小计</label>
                                                <span>¥{{(getItemInfo(item.type, item.id)['price'] * item.count * item.timeAmount).toFixed(2)}}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <span class="delete-icon" @click="deleteItem(item.type, index)"></span>
                                </div>
                            </div>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title">
                                <span>商超信息</span>
                                <span class="increase-container" @click="addItem(3)"><span class="increase-icon"></span>添加项目</span>
                            </p>
                            <div class="shop-items">
                                <div class="shop-item" v-for="(item, index) in shopGoodsItems">
                                    <span class="shop-icon"></span>
                                    <div class="shop-item-content">
                                        <dd-select v-model="item.id" placeholder="选择商超项目">
                                            <dd-option v-for="shop in shopList" :value="shop.id" :label="shop.name" :key="shop.id+shop.name">
                                            </dd-option>
                                        </dd-select>
                                        <div class="shop-item-count">
                                            <label>数量</label>
                                            <counter @numChange="handleNumChange" :num="item.count" :id="index" :type="3">
                                                <p class="valid" v-if="false"><span style="vertical-align: text-bottom">&uarr;</span>服务上限剩余10</p>
                                            </counter>
                                            <p class="shop-item-price">
                                                <label>小计</label>
                                                <span>¥{{(getItemInfo(item.type, item.id)['price'] * item.count).toFixed(2)}}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <span class="delete-icon" @click="deleteItem(item.type, index)"></span>
                                </div>
                            </div>
                        </div>
                        <!--<div class="content-item" v-if="checkState === 'ing'">
                            <p class="content-item-title"><span>押金信息</span></p>
                            <p><label>押金</label><input type="text" placeholder="本次押金金额" class="dd-input" style="margin-left: 4px"/></p>
                        </div>-->
                        <div class="content-item">
                            <p class="content-item-title"><span>备注信息</span></p>
                            <div class="remark-items">
                                <textarea name="remark" placeholder="请输入备注信息" maxlength="140" v-model="remark" class="dd-input"></textarea>
                                <span class="valid-remark-tip" :style="{color: remark.length >= 140 ? '#f24949' : '#999999'}">{{remark.length}}/140</span>
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
<style lang="sass" rel="stylesheet/scss" type="text/css">
    @import "~dd-common-css/src/variables";
    .error {
        position: absolute;
        font-size: $font-size-sm;
        color: #f24949;
    }
    .valid {
        position: absolute;
        font-size: $font-size-sm;
        color: #999999;
    }
    .roomModals {
        box-sizing: border-box;
        font-size: $font-size-base;
        color: $gary-daker;
        .modal-dialog {
            width: 794px;
        }
        .modal-content {
            width: 794px;
            border-top: 4px solid #178ce6;
            border-radius: 2px;
            box-shadow: 0 0 5px 0;
            padding: 0 0 56px 0;
            margin-top: 42.5px;
        }
    }
    .roomModals-header {
        width: 100%;
        height: 53px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px;
        .close-icon {
            display: inline-block;
            width: 14px;
            height: 14px;
            background: url("../../../../../image/modal/room_modal_close.png");
            background-size: contain;
            cursor: pointer;
        }
        .header-text {
            font-size: $font-size-lg;
            color: $gary-daker;
            font-weight: bold;
        }
    }
    .roomModals-body {
        width: 100%;
        max-height: 485px;
        overflow-y: scroll;
        overflow-x: hidden;
        label {
            margin: 0;
        }
        input {
            width: 120px;
        }
        .room-category{
            width: 60px;
            display: inline-block;
            input {
                width: 100%;
            }
        }
        .content-item {
            padding: 16px 24px;
            border-top: 1px solid $gary-light;
        }
        .increase-container {
            font-size: $font-size-base;
            font-weight: normal;
            color: $blue;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
        }
        .increase-icon {
            height: 16px;
            width: 16px;
            background: url("../../../../../image/modal/room_modal_incre.png");
            background-size: contain;
            margin-right: 4px;
            cursor: pointer;
        }
        .userInfo-items {
            display: flex;
            justify-content: space-between;
            align-items: center;
            div:last-child {
                margin-right: 16px;
            }
        }
        .userInfo-phone {
            position: relative;
        }
        .enter-icon {
            width: 18px;
            height: 15px;
            background: url("../../../../../image/modal/room_modal_enter.png");
            background-size: contain;
            margin-right: 14px;
        }
        .enterDate-container {
            position: absolute;
            top: 0;
            right: 264px;
            input {
                width: 110px;
            }
        }
        .room-select-icon {
            width: 16px;
            height: 16px;
            background-size: contain;
            margin-right: 16px;
            cursor: pointer;
        }
        .room-icon {
            width: 16px;
            height: 15px;
            background: url("../../../../../image/modal/room_modal_home.png");
            background-size: contain;
            margin-right: 25px;
        }
        .registerInfoModal-roomPrice {
            display: inline-block;
            position: relative;
        }
        .registerInfoModal-roomPriceList {
            position: absolute;
            width: 491px;
            right: 0;
            top: 30px;
            padding: 8px 8px 8px 0;
            background: #fafafa;
            box-shadow: 0 0 5px 0;
            border-radius: 2px;
            max-height: 100px;
            overflow-y: scroll;
            z-index: 9;
            &:before {
                display: table;
                content: " ";
                line-height: 0;
            }
            .price-item {
                width: 60px;
                float: left;
                margin-left: 8px;
            }
        }
        .selected-icon {
            background: url("../../../../../image/modal/room_modal_selected.png");
        }
        .notSelect-icon {
            background: url("../../../../../image/modal/room_modal_notSelect.png");
        }
        .time-container {
            margin-left: 2px;
        }
        .time-container, .enterDate-container, .enterDate {
            display: inline-block;
        }
        .shop-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 13px;
            &:not(:last-child) {
                padding-bottom: 15px;
                margin-bottom: 16px;
                border-bottom: 1px dotted #e6e6e6;
            }
        }
        .registerRoom-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .registerRoom-container {
            display: flex;
            flex-direction: column;
            padding-left: 13px;
            &:not(:last-child) {
                padding-bottom: 15px;
                margin-bottom: 16px;
                border-bottom: 1px dotted #e6e6e6;
            }
        }
        .shop-icon {
            width: 16px;
            height: 15px;
            background: url("../../../../../image/modal/room_modal_cart.png");
            background-size: contain;
            margin-right: 16px;
        }
        .shop-item-content {
            flex-grow: 1;
            position: relative;
            .useless-tip {
                bottom: -16px;
            }
        }
        .shop-item-count {
            position: absolute;
            top: 0;
            right: 0;
            width: 240px;
        }
        .shop-item-price {
            display: inline-block;
            margin-left: 24px;
        }
        .delete-icon {
            width: 16px;
            height: 16px;
            background: url("../../../../../image/modal/room_modal_delete.png");
            background-size: contain;
            cursor: pointer;
        }
        .remark-items {
            position: relative;
            textarea {
                width: 100%;
                height: 65px;
                resize: none;
            }
        }
        .valid-remark-tip {
            @extend .valid;
            right: 0;
        }
        .error-phone-tip {
            @extend .error;
            left: 45px;
        }
        .dd-select {
            display: inline-block;
        }
        .dd-select-menu {
            max-height: 120px;
            overflow: scroll;
        }
    }
    .content-item-title {
        display: flex;
        justify-content: space-between;
        font-size: $font-size-sm;
        color: $gary-daker;
        font-weight: bold;
        margin-bottom: 16px;
    }
    .roomModals-footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 56px;
        background: #ebebeb;
        padding: 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .footer-label {
            font-size: $font-size-sm;
            color: $gary-daker;
            font-weight: bold;
            margin-right: 8px;
        }
        .footer-price {
            font-size: $font-size-lg;
            color: $blue;
            font-weight: bold;
        }
    }
</style>
<script>
    import { DdDropdown, DdDropdownItem, DdPagination, DdDatepicker, DdSelect, DdOption } from 'dd-vue-component';
    import CheckInPerson from './CheckInPerson.vue';
    import counter from '../../common/components/counter.vue';
    import AJAXService from 'AJAXService';
    import modal from 'modal';
    import util from 'util';
    export default{
        props: {
            roomsItems: {
                type: Array,
                default: function() { return [] }
            },
            categories: {
                type: Array,
                default: function() { return [] }
            },
            checkState: {
                type: String,
                default: ''
            },
            registerInfoShow: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                name: '',
                phone: '',
                userOriginType: undefined,
                userOrigins: [],
                phoneValid: true,
                remark: '',
                enterList: [],
                enterItems: [],
                shopList: [],
                shopGoodsItems: [],
                registerRooms: [],
            }
        },

        created(){
            this.getData();
        },
        computed:{
            modalTitleOrBtn() {
                if (this.checkState === 'ing') {
                    return { title: '直接入住', btn: '入住并收银' }
                } else if (this.checkState === 'finish') {
                    return { title: '补录', btn: '补录' }
                } else {
                    return { title: '预订', btn: '完成预订' }
                }
            },
            categoryList() {
                let categoryList = [];
                if (this.categories.length > 0) {
                    this.categories.forEach(item => {
                        categoryList.push({id: item.cId, name: item.cName});
                    });
                }
                return categoryList;
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
                            let enterPrice = (this.getItemInfo(enter.type, enter.id)['price'] * enter.count * enter.timeAmount).toFixed(2);
                            totalPrice += Number(enterPrice);
                        }
                    });
                }
                if (this.shopGoodsItems.length > 0) {
                    this.shopGoodsItems.forEach(good => {
                        if (good.id) {
                            let goodPrice = (this.getItemInfo(good.type, good.id)['price'] * good.count).toFixed(2);
                            totalPrice += Number(goodPrice);
                        }
                    });
                }

                return Number(totalPrice).toFixed(2)
            }
        },
        methods:{
            getData(){
                AJAXService.ajaxWithToken('get', '/user/getChannels', { type: 2 }, (res) => {
                    if (res.code === 1) {
                        this.userOrigins = res.data.list;
                        this.userOrigins.unshift({ id: -1, name: '散客' });
                        this.userOriginType = this.userOrigins[0].id;
                    } else {
                        modal.somethingAlert(result.msg);
                    }
                });
                AJAXService.ajaxWithToken('GET', 'shopListUrl', {}, (res) =>{
                    res.data.list.forEach((d) => {
                        d.gList.forEach((dd) => {
                            this.shopList.push({
                                id: dd.i,
                                price: dd.p,
                                name: dd.n,
                                type: 3
                            });
                        });
                    });
                });
                AJAXService.ajaxWithToken('GET', '/entertainment/getCategoryList', {})
                        .then(res => {
                            if (res.code === 1) {
                                res.data.list.map(el => {
                                    el.id = el.categoryId;
                                    el.itemId = el.categoryId;
                                    el.type = 2;
                                    this.enterList.push(el)
                                });
                            }
                        });
            },
            checkIsToday(date) {
                 return !util.isSameDay(new Date(date), new Date()) && this.checkState === 'ing';
            },
            disabledStartDate(endDate) {
                const str = util.dateFormat(new Date(endDate));
                const arr = str.split('-');
                if (this.checkState === 'finish') {
                    return (date) => {
                        return date.valueOf() >= (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                    }
                } else if (this.checkState === 'ing') {
                    return (date) => {
                        return date.valueOf() !== (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                    }
                }else {
                    return (date) => {
                        return date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                    }
                }
            },
            disabledEndDate(startDate) {
                if (this.checkState === 'finish') {
                    const str = util.dateFormat(new Date(startDate));
                    const arr = str.split('-');
                    const str1 = util.dateFormat(new Date());
                    const arr1 = str1.split('-');
                    return (date) => {
                        let disable = (date.valueOf() <= (new Date(arr[0], arr[1] - 1, arr[2])).valueOf()) || (date.valueOf() > (new Date(arr1[0], arr1[1] - 1, arr1[2])).valueOf());
                        return disable;
                    }
                } else {
                    const str = util.dateFormat(new Date(startDate));
                    const arr = str.split('-');
                    return (date) => {
                        return date.valueOf() <= (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                    }
                }
            },
            refreshData(){
                this.name = '';
                this.phone = '';
                this.remark = '';
                this.enterItems = [];
                this.shopGoodsItems = [];
                this.registerRooms = [];
            },
            hideModal(e){
                e.stopPropagation();
                this.refreshData();
                this.$emit('changeRegisterInfoShow', false);
                $("#registerInfoModal").modal("hide");
            },

            checkPhone(){
                const phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                this.phoneValid = phoneReg.test(this.phone) || this.phone === '';
            },
            /**
             * 添加住宿-0,娱乐-2,商朝-3项目
             * @param type
             */
            addItem(type){
                if (type === 3) {
                    if (this.shopGoodsItems.length >= 99) {
                        modal.somethingAlert('一次最多添加99个商超项目!');
                        return false;
                    }
                    this.shopGoodsItems.push({ id: undefined, count: 1, type: 3 });
                } else if (type === 2) {
                    if (this.enterItems.length >= 99) {
                        modal.somethingAlert('一次做多添加99个娱乐项目!');
                        return false;
                    }
                    this.enterItems.push({ id: undefined, count: 1, type: 2, date: '', timeAmount: 1 , inventory: undefined });
                } else {
                    let len = this.registerRooms.length;
                    if (len >= 99) {
                        modal.somethingAlert('一个订单最多添加99间房!');
                        return false;
                    }
                    let obj = JSON.parse(JSON.stringify(this.registerRooms[len - 1]));
                    obj.idCardList = [];
                    this.registerRooms.push(obj);
                }
            },

            deleteItem(type,index){
                if (type === 3) {
                    this.shopGoodsItems.splice(index, 1);
                } else if (type === 2) {
                    this.enterItems.splice(index, 1);
                } else {
                    let len = this.registerRooms.length;
                    if (len <= 1) {
                        modal.somethingAlert('已经是最后一间房间了!');
                        return false;
                    }
                    this.registerRooms.splice(index, 1);
                }
            },
            addPerson(id, obj) {
                this.registerRooms.forEach((item, index) => {
                    if (index === id) {
                        if (item.idCardList && item.idCardList.length >= 20) {
                            modal.somethingAlert('一间房最多添加20个入住人');
                            return false;
                        }
                        if(item.idCardList){
                            item.idCardList.push(obj);
                        } else {
                            item.idCardList = [];
                            item.idCardList.push(obj);
                        }
                    }
                });
            },
            deletePerson(id, num) {
                this.registerRooms.forEach((item, index) => {
                    if (index === id) {
                    item.idCardList.splice(num, 1);
                }
            });
            },
            /**
             * 根据id type(商超-3, 娱乐-2)获取详细信息
             * @param type
             * @param index
             * @returns {{}}
             */
            getItemInfo(type, index){
                let enterInfo = { price: 0 };
                if (index !== -1) {
                    if (type === 3) {
                        this.shopList.forEach((item) => {
                            if (item.id === index) {
                                enterInfo = item;
                            }
                        });
                    } else if (type === 2) {
                        this.enterList.forEach((item) => {
                            if (item.id === index) {
                                enterInfo = item;
                            }
                        });
                    }
                }
                return enterInfo;
            },

            submitInfo(e){
                let valid = true;
                if(!(this.phone || this.name) || (!this.name && !this.phoneValid) || !this.phoneValid){
                    modal.somethingAlert("请输入联系人或手机号!");
                    return false;
                }
                this.registerRooms.forEach(item => {
                    if (item.showTip || this.checkIsToday(item.room.startDate)) {
                        valid = false;
                    }
                });
                if (!valid) {
                    modal.somethingAlert("订单信息有误，请核对信息后再提交！");
                    return false;
                }
                const params = { name: this.name, phone: this.phone, remark: this.remark, originId: this.userOriginType };
                if (this.checkState === 'ing') {
                    params.type = 0;
                } else if (this.checkState === 'finish') {
                    params.type = 1;
                } else {
                    params.type = 2;
                }
                this.userOrigins.forEach(origin => {
                    if (origin.id === this.userOriginType) {
                        params.origin = origin.name;
                    }
                });
                let rooms = [];
                this.registerRooms.forEach(item => {
                    const room = {};
                    room.datePriceList = item.datePriceList;
                    room.endDate = item.room.endDate;
                    room.id = item.categoryType;
                    room.roomId = item.roomType;
                    room.idCardList = item.idCardList;
                    room.fee = item.price;
                    room.startDate = item.room.startDate;
                    room.sub = true;

                    rooms.push(room);
                });

                let entertainmentItems = [];
                this.enterItems.forEach(item => {
                    const enter = {};
                    enter.amount = item.count;
                    enter.timeAmount = item.timeAmount;
                    enter.date = item.date;
                    enter.categoryId = item.id;
                    this.enterList.forEach(option => {
                        if (option.id === item.id) {
                            enter.categoryName = option.name;
                            enter.price = option.price;
                        }
                    });

                    entertainmentItems.push(enter);
                });

                let items = [];
                this.shopGoodsItems.forEach(item => {
                    const good = {};
                    good.amount = item.count;
                    good.id = item.id;
                    good.type = 3;
                    good.priceId = 0;
                    good.date = util.dateFormat(new Date());
                    this.shopList.forEach(shop => {
                       if (shop.id === item.id) {
                           good.name = shop.name;
                           good.price = shop.price;
                       }
                    });

                    items.push(good);
                });
                params.rooms = JSON.stringify(rooms);
                params.entertainmentItems = JSON.stringify(entertainmentItems);
                params.items = JSON.stringify(items);

                AJAXService.ajaxWithToken('get', '/room/confirmOrder', params)
                    .then(res => {
                        if (res.code === 1) {
                            this.hideModal(e);
                            if(this.checkState === 'ing' || this.checkState === 'finish') {
                                let business = {};
                                business.businessJson = JSON.parse(JSON.stringify(params));
                                business.businessJson.functionType = 1;
                                business.businessJson.orderId = res.data.orderId;
                                business.orderDetail = { ...res.data };
                                this.$emit('showCashier', { type: 'register', business: business });
                            } else {
                                this.$emit('showOrder', res.data.orderId);
                            }
                        } else {
                            modal.somethingAlert(res.msg);
                        }
                    });
            },

            handleNumChange(type, tag, num){
                if (type === 3) {
                    this.shopGoodsItems.forEach((item, index) => {item.count = (index === tag) ? num : item.count;});
                } else if (type === 2) {
                    this.enterItems.forEach((item, index) => {item.count = (index === tag) ? num : item.count;});
                } else if (type === -2) {
                    this.enterItems.forEach((item, index) => {item.timeAmount = (index === tag) ? num : item.timeAmount;});
                }
            },

            getDateDiff(date1, date2) {
                let dateStart = new Date(date1);
                let dateEnd = new Date(date2);
                let duration = util.DateDiff(dateStart, dateEnd);
                return duration;
            },

            getRoomsList(id) {
                let roomsList = [];
                this.categories.forEach(category => {
                    if (category.cId === id) {
                        category.rooms.forEach(room => {
                            roomsList.push({id: room.i, name: room.sn,});
                        });
                    }
                });
                return roomsList;
            },
            showPriceList(id) {
                this.registerRooms.forEach((item, index) => {
                    if (index === id) {
                        let duration = this.getDateDiff(item.room.startDate, item.room.endDate);
                        if (duration > 1) {
                            item.showPriceList = true;
                        }
                    } else {
                        item.showPriceList = false;
                    }
                });
            },
            hidePriceList(arr) {
                arr.forEach(item => {
                    item.showPriceList = false;
                });
            },
            stopPropagation() {
                return false;
            },
            getDatePrice(obj, arr, totalPrice) {
                let totalFee = 0;
                arr.forEach(item => {
                    totalFee += item.dateFee;
                });
                obj.modifyFee = Number(((obj.dateFee / totalFee) * totalPrice).toFixed(2));
                return obj.modifyFee;
            },
            setDateFee(obj, item) {
                let totalPrice = 0;
                obj.dateFee = parseFloat(obj.modifyFee, 2);
                item.datePriceList.forEach(date => {
                    totalPrice += parseFloat(date.modifyFee, 2);
                });
                item.price = totalPrice;
            },

            modifyRoom(item) {
                let duration = this.getDateDiff(item.room.startDate, item.room.endDate);
                if (duration < 1) {
                    item.room.endDate = util.diffDate(new Date(item.room.endDate), 1);
                }
                let startDate = util.dateFormat(new Date(item.room.startDate));
                let endDate = util.dateFormat(new Date(item.room.endDate));
                AJAXService.ajaxWithToken('get', '/room/getRoomStaus', { id: item.roomType, date: startDate, days: duration < 1 ? 1 : duration })
                    .then(res => {
                        if (res.code === 1) {
                            let datePriceList = [];
                            let price = 0;
                            res.data.rs.status.forEach((option,index) => {
                                datePriceList.push({date: util.dateFormat(util.diffDate(new Date(item.room.startDate), index)), dateFee: option.p});
                                price += option.p;
                            });
                            item.price = price;
                            item.datePriceList = datePriceList;
                        }
                    });
                AJAXService.ajaxWithToken('get', '/room/getStatusAndTotalPrice', { roomId: item.roomType, startDate: startDate, endDate: endDate})
                    .then(res => {
                        if (res.code === 1) {
                            item.showTip = !res.data.available;
                        } else {
                            modal.somethingAlert(res.msg);
                        }
                    });
            },

            modifyEnter(item) {
                if (item.id && item.date) {
                    let date = util.dateFormat(new Date(item.date));
                    AJAXService.ajaxWithToken('get', '/item/getInventory', { id: item.id, date: date })
                        .then(res => {
                            if (res.code === 1) {
                                item.inventory = res.data.inventory;
                            } else {
                                modal.somethingAlert(res.msg);
                            }
                        });
                }
            },

            changeRoomType(item) {
                this.$nextTick(function() {
                    item.roomType = this.getRoomsList(item.categoryType)[0].id;
                    this.modifyRoom(item);
                });
            }
        },
        components:{
            DdDropdown,
            DdDropdownItem,
            DdPagination,
            DdDatepicker,
            DdSelect,
            DdOption,
            counter,
            CheckInPerson
        },
        watch: {
            registerInfoShow(newVal, oldVal) {
                if (newVal && !oldVal) {
                    this.roomsItems.forEach(item => {
                        let id = undefined;
                        this.categories.forEach(category => {
                            category.rooms.forEach(room => {
                                if (room.i === item.roomId) {
                                    id = category.cId;
                                }
                            });
                        });
                        item.endDate = util.diffDate(item.endDate, 1);
                        let duration = this.getDateDiff(item.startDate, item.endDate);
                        AJAXService.ajaxWithToken('get', '/room/getRoomStaus', { id: item.roomId, date: util.dateFormat(item.startDate), days: duration })
                            .then(res => {
                                if (res.code === 1) {
                                    let datePriceList = [];
                                    let price = 0;
                                    res.data.rs.status.forEach((option,index) => {
                                        datePriceList.push({date: util.dateFormat(util.diffDate(item.startDate, index)), dateFee: option.p});
                                        price += option.p;
                                    });
                                    this.registerRooms.push({ categoryType: id, roomType: item.roomId, price: price, room: item, idCardList: [], showPriceList: false, datePriceList: datePriceList, showTip: false });
                                }
                            });
                    });
                    $('#registerInfoModal').modal({backdrop: 'static'});
                }
            }
        }
    }
</script>