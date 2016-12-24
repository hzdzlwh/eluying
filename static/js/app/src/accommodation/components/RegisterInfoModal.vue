<template>
    <div>
        <div class="modal fade roomModals" id="registerInfoModal" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <span class="header-text">预订</span>
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
                                    <input class="dd-input" type="text" id="phone" placeholder="11位手机号" @blur="checkPhone" v-model="phone">
                                    <span class="error-phone-tip" v-show="!phoneValid"><span style="vertical-align: text-bottom">&uarr;</span>请输入正确的手机号</span>
                                </div>
                                <div class="userInfo-item">
                                    <label>客源渠道</label>
                                    <dd-select v-model="userOriginType">
                                        <dd-option v-for="origin in userOrigins" :value="origin.id" :label="origin.name" :key="origin.id+origin.name">
                                        </dd-option>
                                    </dd-select>
                                </div>
                            </div>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title">
                                <span>房间信息</span>
                                <span class="increase-container"><span class="increase-icon"></span>添加项目</span>
                            </p>
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
                                        <dd-select v-model="item.id">
                                            <dd-option v-for="enter in enterList" :value="enter.id" :label="enter.name" :key="enter.id+enter.name">
                                            </dd-option>
                                        </dd-select>
                                        <div class="time-container" v-if="!!getItemInfo(item.type, item.id)['unitTime']">
                                            <label>{{`时长(${getItemInfo(item.type, item.id)['timeUnit']})`}}</label>
                                            <counter @numChange="handleNumChange" :num="item.timeAmount * getItemInfo(item.type, item.id)['unitTime']" :id="index" :type="-2" :step="getItemInfo(item.type, item.id)['unitTime']"></counter>
                                        </div>
                                        <div class="enterDate-container">
                                            <label>时间</label>
                                            <div class="enterDate">
                                                <dd-datepicker placeholder="选择时间" v-model="item.date" :disabled-date="disableStartDate" />
                                            </div>
                                        </div>
                                        <div class="shop-item-count">
                                            <label>数量</label>
                                            <counter @numChange="handleNumChange" :num="item.count" :id="index" :type="2">
                                                <p class="valid" v-if="false"><span style="vertical-align: text-bottom">&uarr;</span>服务上限剩余10</p>
                                            </counter>
                                            <p class="shop-item-price">
                                                <label>小计</label>
                                                <span>{{`¥${(getItemInfo(item.type, item.id)['price'] * item.count * item.timeAmount).toFixed(2)}`}}</span>
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
                                        <dd-select v-model="item.id">
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
                                                <span>{{`¥${(getItemInfo(item.type, item.id)['price'] * item.count).toFixed(2)}`}}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <span class="delete-icon" @click="deleteItem(item.type, index)"></span>
                                </div>
                            </div>
                        </div>
                        <div class="content-item" v-if="true">
                            <p class="content-item-title"><span>押金信息</span></p>
                            <p><label>押金</label><input type="text" placeholder="本次押金金额" class="dd-input" style="margin-left: 4px"/></p>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>备注信息</span></p>
                            <div class="remark-items">
                                <textarea name="remark" placeholder="请输入备注信息" maxlength="140" v-model="remark" class="dd-input"></textarea>
                                <span class="valid-remark-tip" :style="{color: remark.length >= 140 ? '#f24949' : '#999999'}">{{`${remark.length}/140`}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="roomModals-footer">
                        <div>
                            <span class="footer-label">订单金额</span>
                            <span class="footer-price">¥9999</span>
                        </div>
                        <div class="dd-btn dd-btn-primary" @click="submitInfo">完成预订</div>
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
            height: 600px;
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
        height: 485px;
        overflow: scroll;
        label {
            margin: 0;
        }
        input {
            width: 120px;
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
        .time-container {
            margin-left: 14px;
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
    import counter from '../../common/components/counter.vue';
    import AJAXService from 'AJAXService';
    import modal from 'modal';
    export default{
        data() {
            return {
                name: '',
                phone: '',
                userOriginType: undefined,
                userOrigins: [],
                phoneValid: true,
                remark: '',
                enterList: [{id: -1, name: '选择娱乐项目'}],
                enterItems: [],
                shopList: [{id: -1, name: '选择商超项目'}],
                shopGoodsItems: []
            }
        },

        created(){
            this.getData();
        },
        computed:{},
        methods:{
            getData(){
                AJAXService.ajaxWithToken('get', '/user/getChannels', { type: 2 }, (res) => {
                    if (res.code === 1) {
                        this.userOriginType = res.data.list[0].id;
                        this.userOrigins = res.data.list;
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
            refreshData(){
                this.name = '';
                this.phone = '';
                this.remark = '';
                this.enterItems = [];
                this.shopGoodsItems = [];
            },
            hideModal(e){
                e.stopPropagation();
                this.refreshData();
                $("#registerInfoModal").modal("hide");
            },

            checkPhone(){
                const phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                this.phoneValid = phoneReg.test(this.phone) || this.phone === '';
            },
            /**
             * 添加住宿,娱乐-2,商朝-3项目
             * @param type
             */
            addItem(type){
                if (type === 3) {
                    if (this.shopGoodsItems.length >= 2) {
                        modal.somethingAlert('一次最多添加99个商超项目!');
                        return false;
                    }
                    this.shopGoodsItems.push({ id: -1, count: 1, type: 3 });
                } else if (type === 2) {
                    if (this.enterItems.length >= 2) {
                        modal.somethingAlert('一次做多添加99个娱乐项目!');
                        return false;
                    }
                    this.enterItems.push({ id: -1, count: 1, type: 2, date: '', timeAmount: 1 });
                }
            },

            deleteItem(type,index){
                if (type === 3) {
                    this.shopGoodsItems.splice(index, 1);
                } else if (type === 2) {
                    this.enterItems.splice(index, 1);
                }
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
                if(!(this.phone || this.name) || (!this.name && !this.phoneValid) || !this.phoneValid){
                    modal.somethingAlert("请输入联系人或手机号!");
                    return undefined;
                }
                this.hideModal(e);
            },

            handleNumChange(type, tag, num){
                if (type === 3) {
                    this.shopGoodsItems.forEach((item, index) => {item.count = (index === tag) ? num : item.count;});
                } else if (type === 2) {
                    this.enterItems.forEach((item, index) => {item.count = (index === tag) ? num : item.count;});
                } else if (type === -2) {
                    this.enterItems.forEach((item, index) => {item.timeAmount = (index === tag) ? num : item.timeAmount;});
                }
            }
        },

        components:{
            DdDropdown,
            DdDropdownItem,
            DdPagination,
            DdDatepicker,
            DdSelect,
            DdOption,
            counter
        }
    }
</script>