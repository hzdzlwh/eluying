<template>
    <div>
        <div class="modal fade roomModals" id="registerInfoModal" role="dialog">
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
                                           @input="changeVipList(1)"
                                           @click.stop="stopPropagation"
                                           :disabled="checkState === 'editOrder' && order.isVip">
                                </div>
                                <div class="userInfo-item userInfo-phone vip-level-container">
                                    <label for="phone">手机号</label>
                                    <input class="dd-input" type="text" id="phone" maxlength="11" placeholder="11位手机号"
                                           v-model="phone"
                                           @input="changeVipList(2)"
                                           @click.stop="stopPropagation"
                                           :disabled="checkState === 'editOrder' && order.isVip">
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
                                    <label>客源渠道</label>
                                    <dd-select v-model="userOriginType" placeholder="">
                                        <dd-option v-for="origin in userOrigins" :value="origin.id" :label="origin.name">
                                        </dd-option>
                                    </dd-select>
                                </div>
                            </div>
                        </div>
                        <div class="content-item" v-if="registerRooms && registerRooms.length > 0">
                            <p class="content-item-title">
                                <span>房间信息</span>
                                <span class="increase-container" @click="addItem(0)">
                                    <span class="increase-icon"></span>
                                    添加房间
                                </span>
                            </p>
                            <div class="registerRoom-items">
                                <div class="registerRoom-container" v-for="(item,index) in registerRooms">
                                    <div class="registerRoom-item">
                                        <span class="room-icon"></span>
                                        <div class="shop-item-content">
                                            <span class="useless-tip error" v-if="item.showTip">该房间已被占用</span>
                                            <dd-select v-model="item.categoryType" placeholder="请选择房型"
                                                       @input="changeRoomType(item)">
                                                <dd-option v-for="category in categoryList" :value="category.id"
                                                           :label="category.name">
                                                </dd-option>
                                            </dd-select>
                                            <div class="room-category">
                                                <dd-select v-model="item.roomType" placeholder="请选择房型"
                                                           @input="modifyRoom(item, false)">
                                                    <dd-option v-for="room in getRoomsList(item.categoryType)" :value="room.id"
                                                               :label="room.name">
                                                    </dd-option>
                                                </dd-select>
                                            </div>
                                            <div class="room-date" style="display: inline-block; position: relative;">
                                                <span class="useless-tip error" style="left: 28px;"
                                                      v-if="checkIsToday(item.room.startDate)">
                                                    该房间的入住时间必需为今日！
                                                </span>
                                                <label class="label-text">入住</label>
                                                <div class="enterDate">
                                                    <dd-datepicker placeholder="选择时间" v-model="item.room.startDate"
                                                                   @input="modifyRoom(item, true)"
                                                                   :disabled-date="disabledStartDate(new Date())"
                                                                   :disabled="item.state === 1"/>
                                                </div>
                                                <span>~</span>
                                                <div class="enterDate">
                                                    <dd-datepicker placeholder="选择时间" v-model="item.room.endDate"
                                                                   @input="modifyRoom(item, true)"
                                                                   :disabled-date="disabledEndDate(item.room.startDate)"/>
                                                </div>
                                                <label class="label-text">
                                                    共{{getDateDiff(item.room.startDate, item.room.endDate)}}晚
                                                </label>
                                            </div>
                                            <div class="registerInfoModal-roomPrice" @click.stop="stopPropagation">
                                                <label class="label-text">房费</label>
                                                <p class="fee-container">
                                                    <span class="fee-symbol">¥</span>
                                                    <input class="dd-input fee-input" v-model="item.price"
                                                           @input="setDateFee(item.price, item)"
                                                           @blur="setFirstDateFee(item.price, item)"
                                                           style="width: 80px" type="number"
                                                           @click.stop="showPriceList(index)"/>
                                                </p>
                                                <div class="registerInfoModal-roomPriceList" v-if="item.showPriceList">
                                                        <dl class="price-item" v-for="priceItem in item.datePriceList">
                                                            <dt>{{priceItem.date.slice(5)}}</dt>
                                                            <dd v-show="!priceItem.showInput"
                                                                @click="changShowInput(item, priceItem)">
                                                                ¥{{priceItem.dateFee}}
                                                            </dd>
                                                            <dd v-show="priceItem.showInput">
                                                                <input class="dd-input" style="width: 60px;" type="number"
                                                                       v-model="priceItem.dateFee"
                                                                       @input="setTotalPrice(item)">
                                                            </dd>
                                                        </dl>
                                                </div>
                                            </div>
                                        </div>
                                        <span class="delete-icon" @click="deleteItem(0, index)"
                                              v-if="!item.state || item.state !== 1">
                                        </span>
                                        <span v-if="item.state === 1" class="delete-icon-like"></span>
                                        <span class="discount-info"
                                              v-if="vipDiscountDetail.isVip
                                              && getItemDiscountInfo(0, 0, vipDiscountDetail).discount < 1">
                                            <span>原价<span class="origin-price">¥{{ item.originPrice }}</span></span>
                                            <span class="discount-num"
                                                  v-if="Number(item.price) === Number((item.originPrice * getItemDiscountInfo(0, 0, vipDiscountDetail).discount).toFixed(2))">
                                                会员{{ getItemDiscountInfo(0, 0, vipDiscountDetail).discount * 10 }}折
                                            </span>
                                        </span>
                                    </div>
                                    <CheckInPerson
                                            :personsObj="{id: index, persons: item.idCardList}"
                                            @addPerson="addPerson"
                                            @deletePerson="deletePerson"/>
                                </div>
                            </div>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title">
                                <span>娱乐信息</span>
                                <span class="increase-container" @click="addItem(2)">
                                    <span class="increase-icon"></span>
                                    添加项目
                                </span>
                            </p>
                            <div class="shop-items">
                                <div class="shop-item" v-for="(item, index) in enterItems">
                                    <span class="enter-icon"></span>
                                    <div class="shop-item-content">
                                        <div v-if = "item.usedAmount <= 0">
                                            <dd-select v-model="item.id" placeholder="选择娱乐项目" @input="modifyEnter(item)">
                                                <dd-option v-for="enter in enterList" :value="enter.id" :label="enter.name">
                                                </dd-option>
                                            </dd-select>
                                        </div>
                                        <span v-if = "item.usedAmount > 0">{{item.name}}</span>
                                        <div class="time-container" style="width: 145px"
                                             v-if="!getItemInfo(item.type, item.id)['unitTime'] && item.usedAmount <= 0">
                                        </div>
                                        <div class="time-container" v-if="!!getItemInfo(item.type, item.id)['unitTime'] && item.usedAmount <= 0">
                                            <label>时长({{getItemInfo(item.type, item.id)['timeUnit']}}）</label>
                                            <counter @numChange="handleNumChange"
                                                     :num="item.timeAmount * getItemInfo(item.type, item.id)['unitTime']"
                                                     :id="index" :type="-2" :step="getItemInfo(item.type, item.id)['unitTime']">
                                            </counter>
                                        </div>
                                        <span v-if = "item.usedAmount > 0 && item.chargeUnit"
                                              style="position: absolute; right: 466px;">
                                            {{`时长(${item.chargeUnit})`}}
                                            <span style="margin-left: 15px;">{{item.timeAmount * item.chargeUnitTime}}</span>
                                        </span>
                                        <div class="enterDate-container">
                                            <label>时间</label>
                                            <div class="enterDate">
                                                <dd-datepicker placeholder="选择时间" v-model="item.date"
                                                               @input="modifyEnter(item)"
                                                               :disabled-date="disabledEndDate(new Date())"
                                                               :disabled="item.usedAmount > 0"/>
                                            </div>
                                        </div>
                                        <div class="shop-item-count">
                                            <label>数量</label>
                                            <counter @numChange="handleNumChange"
                                                     :num="item.count"
                                                     :id="index" :type="2"
                                                     :min="item.usedAmount >=1 ? item.usedAmount : 1"
                                                     :max="(item.inventory + item.selfInventory) >= 0 ? (item.inventory + item.selfInventory) : 999">
                                                <p class="valid"
                                                   v-if="(item.inventory + item.selfInventory) >= 0 && checkState !== 'finish'"
                                                   :class="(item.inventory + item.selfInventory) <= 0 ? 'error' : ''">
                                                    <span style="vertical-align: text-bottom">&uarr;</span>
                                                    服务上限剩余{{item.inventory + item.selfInventory}}
                                                </p>
                                            </counter>
                                            <p class="shop-item-price">
                                                <label>小计</label>
                                                <p class="fee-container">
                                                    <span class="fee-symbol">¥</span>
                                                    <input type="number" class="dd-input fee-input" style="width: 80px"
                                                           v-model="item.totalPrice" />
                                                </p>
                                            </p>
                                        </div>
                                    </div>
                                    <span class="delete-icon" @click="deleteItem(item.type, index)"
                                          v-if="item.usedAmount <= 0">
                                    </span>
                                    <span v-if="item.usedAmount > 0" class="delete-icon-like"></span>
                                    <span class="discount-info"
                                          style="top: 28px"
                                          v-if="vipDiscountDetail.isVip
                                          && getItemDiscountInfo(item.nodeId, item.type, vipDiscountDetail).discount < 1">
                                            <span>原价<span class="origin-price">¥{{ item.originPrice }}</span></span>
                                            <span class="discount-num"
                                                  v-if="Number(item.totalPrice) === Number(((getItemInfo(item.type, item.id)['price']
                                                                         * getItemDiscountInfo(item.nodeId, item.type, vipDiscountDetail).discount).toFixed(2)
                                                                         * item.count * item.timeAmount).toFixed(2))">
                                                会员{{ Math.floor(getItemDiscountInfo(item.nodeId, item.type, vipDiscountDetail).discount * 10) }}折
                                            </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title">
                                <span>商超信息</span>
                                <span class="increase-container" @click="addItem(3)">
                                    <span class="increase-icon"></span>
                                    添加项目
                                </span>
                            </p>
                            <div v-if="order.orderState && showOrder" class="items">
                                <div class="shop-item"
                                     :class="shopGoodsItems.length > 0 ? 'shopItem-border-style' : ''"
                                     style="align-items: stretch;
                                     flex-direction: column"
                                     v-for="item in filterShopList">
                                    <div class="orderDetailModal-shop-item">
                                        <span class="shop-icon"></span>
                                        <div class="item-content">
                                            <span class="shop-time small-font">{{item.time.slice(5, 16)}}</span>
                                            <div style="margin-right: 81px">
                                                <label class="label-text">小计</label>
                                                <span>¥{{getTotalPrice(item['items'], true)}}</span>
                                                <span class="discount-info" v-if="item.items[0].vipShowDiscount" style="top: 14px">
                                                    <span>
                                                        原价
                                                        <span class="origin-price">¥{{ getTotalPrice(item['items'], false) }}</span>
                                                    </span>
                                                    <span class="discount-num">
                                                        {{ item.items[0].vipShowDiscount }}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="item-content" v-for="option in item['items']">
                                        <span style="padding-left: 32px; width: 120px;">{{option.name}}</span>
                                        <span>x{{option.amount}}</span>
                                        <span style="margin-right: 304px;width: 120px; text-align: right">{{`¥${(option.price * option.amount).toFixed(2)}`}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="shop-items">
                                <div class="shop-item" v-for="(item, index) in shopGoodsItems">
                                    <span class="shop-icon"></span>
                                    <div class="shop-item-content">
                                        <dd-select v-model="item.id" placeholder="选择商超项目">
                                            <dd-option v-for="shop in shopList" :value="shop.id" :label="shop.name"
                                                       :key="shop.id+shop.name">
                                            </dd-option>
                                        </dd-select>
                                        <div class="shop-item-count">
                                            <label>数量</label>
                                            <counter @numChange="handleNumChange" :num="item.count" :id="index" :type="3">
                                                <p class="valid" v-if="false">
                                                    <span style="vertical-align: text-bottom">&uarr;</span>
                                                    服务上限剩余10
                                                </p>
                                            </counter>
                                            <p class="shop-item-price">
                                                <label>小计</label>
                                                <span>
                                                    ¥{{((getItemInfo(item.type, item.id)['price'] * getItemDiscountInfo(0, item.type, vipDiscountDetail).discount).toFixed(2) * item.count).toFixed(2)}}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <span class="delete-icon" @click="deleteItem(item.type, index)"></span>
                                    <span class="discount-info"
                                          style="top:24px"
                                          v-if="vipDiscountDetail.isVip
                                          && getItemDiscountInfo(0, item.type, vipDiscountDetail).discount < 1">
                                            <span>
                                                原价
                                                <span class="origin-price">
                                                    ¥{{ (getItemInfo(item.type, item.id)['price'] * item.count).toFixed(2) }}
                                                </span>
                                            </span>
                                            <span class="discount-num">
                                                会员{{ Math.floor(getItemDiscountInfo(0, item.type, vipDiscountDetail).discount * 10) }}折
                                            </span>
                                    </span>
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
<style lang="sass" rel="stylesheet/scss" type="text/css">
    @import "~dd-common-css/src/variables";
    .valid {
        position: absolute;
        font-size: $font-size-sm;
        color: #999999;
    }
    .error {
        position: absolute;
        font-size: $font-size-sm;
        color: #f24949;
    }
    .shopItem-border-style {
        padding-bottom: 15px;
        margin-bottom: 16px;
        border-bottom: 1px dotted #e6e6e6;
    }
    .roomModals {
        box-sizing: border-box;
        font-size: $font-size-base;
        color: $gary-daker;
        .modal-dialog {
            width: 794px;
            margin-top: 0 !important;
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%) !important;
            -ms-transform: translate(-50%, -50%) !important;
            transform: translate(-50%, -50%) !important;
        }
        .modal-content {
            width: 794px;
            border-top: 4px solid #178ce6;
            border-radius: 2px;
            box-shadow: 0 0 5px 0;
            padding: 0 0 56px 0;
            margin-top: 0 !important;
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
        overflow-y: auto;
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
        .vip-level-img {
            display: inline-block;
            height: 15px;
            width: 17px;
            position: absolute;
            right: 0;
            top: 4px;
            transform: translateX(100%);
            background: url("../../../../../image/modal/vip_level_img.png");
            background-size: contain;
            &:hover + .vip-level-tip {
                display: inline-flex;
            }
        }
        .vip-level-container {
            position: relative;
        }
        .vip-level-tip {
            display: none;
            position: absolute;
            top: 4px;
            right: -17px;
            padding: 0 2px;
            transform: translateX(100%);
            background:#fafafa;
            box-shadow:0px 0px 5px 0px rgba(0,0,0,0.15);
            height:19px;
            justify-content: center;
            align-items: center;
        }
        .userInfo-items {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            div:last-child {
                margin-right: 16px;
            }
        }
        .userVip-list {
            position: absolute;
            background:#fafafa;
            box-shadow:0 0 5px 0 rgba(0,0,0,0.15);
            border-radius:2px;
            width:261px;
            max-height:120px;
            overflow: scroll;
            top: 26px;
            z-index: 100;
        }
        .userVip-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #666666;
            font-size: 12px;
            padding: 2px 8px;
            cursor: pointer;
            &:hover {
                background: #e1effa;
            }
            .vip-level {
                display: inline-flex;
                align-items: center;
                width: 80px;
            }
            .vip-level-text {
                display: inline-block;
                max-width: 70px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
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
            display: flex;
            align-items: center;
        }
        .fee-container {
            position: relative;
            display: inline-block;
        }
        .fee-symbol {
            position: absolute;
            left: 8px;
            top: 3px;
            z-index: 10;
        }
        .fee-input {
            padding-left: 16px;
        }
        .discount-info {
            display: inline-flex;
            position: absolute;
            font-size: 12px;
            color: #999999;
            top: 30px;
            right: 0;
            min-width: 104px;
            justify-content: flex-start;
            align-items: center;
        }
        .origin-price {
            text-decoration: line-through;
        }
        .discount-num {
            display: inline-flex;
            padding: 0 5px;
            color: #ffffff;
            background: #f5a623;
            border-radius: 2px;
        }
        .registerInfoModal-roomPriceList {
            display: flex;
            flex-wrap: wrap;
            position: absolute;
            max-width: 491px;
            right: 0;
            top: 30px;
            padding: 8px 8px 8px 0;
            background: #fafafa;
            box-shadow: 0 0 5px 0;
            border-radius: 2px;
            max-height: 100px;
            overflow-y: auto;
            z-index:11;
            &:before {
                display: table;
                content: " ";
                line-height: 0;
            }
            .price-item {
                width: 60px;
                margin-left: 8px;
                dt {
                    color: #999999;
                    font-size: 12px;
                }
                dd {
                    height: 24px;
                }
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
            position: relative;
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
            position: relative;
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
            .checkInPerson-person {
                padding-left: 0;
                .checkInPerson-person-icon {
                    margin-right: 25px;
                }
            }
            .checkInPerson-btns {
                padding-left: 41px;
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
            padding-top: 3px;
            flex-grow: 1;
            position: relative;
            display: flex;
            justify-content: space-between;
            .useless-tip {
                bottom: -16px;
            }
        }
        .shop-item-count {
            width: 240px;
        }
        .shop-item-price {
            display: inline-block;
            margin-left: 24px;
        }
        .delete-icon {
            margin-left: 16px;
            width: 16px;
            height: 16px;
            background: url("../../../../../image/modal/room_modal_delete.png");
            background-size: contain;
            cursor: pointer;
        }
        .delete-icon-like {
            margin-left: 16px;
            width: 16px;
            height: 16px;
            display: inline-block;
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
            overflow-y: auto;
            max-height: 120px;
            .dd-select-option {
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
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
            },
            order: {
                type: Object,
                default: function() { return {} }
            }
        },
        data() {
            return {
                name: '',
                phone: '',
                userOriginType: -1,
                userOrigins: [],
                phoneValid: true,
                remark: '',
                enterList: [],
                enterItems: [],
                shopList: [],
                shopGoodsItems: [],
                registerRooms: [],
                showOrder: false,
                vipDiscountDetail: {},
                lastModifyRoomTime: 0,
                vipListShow: false,
                vipList: [],
                timeCount: 0,
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
                } else if (this.checkState === 'book') {
                    return { title: '预订', btn: '完成预订' }
                } else {
                    return { title: '编辑订单', btn: '完成' }
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
                            let enterPrice = enter.totalPrice;
                            totalPrice += Number(enterPrice);
                        }
                    });
                }
                if (this.shopGoodsItems.length > 0) {
                    this.shopGoodsItems.forEach(good => {
                        if (good.id) {
                            let goodPrice = (this.getItemInfo(good.type, good.id)['price'] * good.count * this.getItemDiscountInfo(0, good.type, this.vipDiscountDetail).discount).toFixed(2);
                            totalPrice += Number(goodPrice);
                        }
                    });
                }

                return Number(totalPrice).toFixed(2)
            },
            filterShopList() {
                let shopList = {};
                if (this.order.pcGoodsItems) {
                    this.order.pcGoodsItems.forEach(item => {
                        if (shopList[item.goodsOrderId]) {
                            shopList[item.goodsOrderId]['items'].push(item);
                        } else {
                            shopList[item.goodsOrderId] = {};
                            shopList[item.goodsOrderId]['time'] = item.date;
                            shopList[item.goodsOrderId]['items'] = [];
                            shopList[item.goodsOrderId]['items'].push(item);
                        }
                    });
                }
                return shopList;
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
                        modal.somethingAlert(res.msg);
                    }
                });
                AJAXService.ajaxWithToken('GET', 'shopListUrl', {}, (res) =>{
                    if (res.code ===1) {
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
                    } else {
                        modal.somethingAlert(res.msg);
                    }
                });
                AJAXService.ajaxWithToken('GET', '/entertainment/getCategoryList', {})
                        .then(res => {
                            if (res.code === 1) {
                                res.data.list.map(el => {
                                    el.id = el.categoryId;
                                    el.nodeId = el.enterId;
                                    el.type = 2;
                                    this.enterList.push(el)
                                });
                            } else {
                                modal.somethingAlert(res.msg);
                            }
                        });
            },
            getOrderState(state){
                switch(state){
                    case 2:
                        return {text: '已预订', borderColor: '#ffffff #ffba75', backgroundColor: '#ffba75'};
                    case 3:
                        return {text: '进行中', borderColor: '#ffffff #82beff', backgroundColor: '#82beff'};
                    case 4:
                        return {text: '已取消', borderColor: '#ffffff #bfbfbf', backgroundColor: '#bfbfbf'};
                    case 5:
                        return {text: '已完成', borderColor: '#ffffff #bfbfbf', backgroundColor: '#bfbfbf'};
                    default:
                        return {};
                }
            },
            getVipList(params, position) {
                AJAXService.ajaxWithToken('GET', '/vipUser/search', params)
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
            changeVipList(num) {
                let params = num === 1 ? { name: this.name } : { phone: this.phone };
                let search = this.checkState !== 'editOrder' || (this.checkState === 'editOrder' && this.order.isVip);
                if (search && ((num === 1 && this.name.length >= 1) || (num === 2 && this.phone.length >= 4))) {
                    clearTimeout(this.timeCount);
                    this.timeCount = setTimeout(() => { this.getVipList(params, num); }, 500);
                }
            },
            setVipListPosition(position) {
                const vipList = document.querySelector('.userVip-list');
                if (vipList) {
                    vipList.style.left = position === 1 ? 46 + 'px' : 312 + 'px';
                }
            },
            setUserInfo(obj) {
                this.name = obj.name;
                this.phone = obj.phone;
                this.vipListShow = false;
            },
            getVipDiscount(params) {
                AJAXService.ajaxWithToken('GET', '/vipUser/getVipDiscount', params)
                    .then(res => {
                        if (res.code === 1) {
                            this.vipDiscountDetail = {...res.data};
                        } else {
                            modal.somethingAlert(res.msg);
                        }
                    });
            },
            /**
             * 获取单个项目的优惠信息
             **/
            getItemDiscountInfo(nodeId, nodeType, obj) {
                let item = { discount: 1 };
                if (obj.isVip && obj.vipDetail.discountList.length > 0) {
                    obj.vipDetail.discountList.forEach(list => {
                        if ((nodeType === 0 || nodeType === 3) && list.nodeId === 0 && list.nodeType === nodeType) {
                            item = {...list};
                        } else if ((nodeType !== 0 && nodeType !== 3) && (list.nodeId === nodeId && list.nodeType === nodeType)) {
                            item = {...list};
                        }
                    });
                }

                return item;
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
                    if (util.isSameDay(new Date(startDate), new Date())) {
                        const str1 = util.dateFormat(new Date());
                        const arr1 = str1.split('-');
                        return (date) => {
                            let disable = (date.valueOf() > (new Date(arr1[0], arr1[1] - 1, arr1[2])).valueOf());
                            return disable;
                        }
                    } else {
                        const str = util.dateFormat(new Date(startDate));
                        const arr = str.split('-');
                        const str1 = util.dateFormat(new Date());
                        const arr1 = str1.split('-');
                        return (date) => {
                            let disable = (date.valueOf() <= (new Date(arr[0], arr[1] - 1, arr[2])).valueOf()) || (date.valueOf() > (new Date(arr1[0], arr1[1] - 1, arr1[2])).valueOf());
                            return disable;
                        }
                    }
                } else {
                    const str = util.dateFormat(new Date(startDate));
                    const arr = str.split('-');
                    return (date) => {
                        return date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                    }
                }
            },
            refreshData(){
                this.name = '';
                this.phone = '';
                this.userOriginType =  -1;
                this.remark = '';
                this.enterItems = [];
                this.shopGoodsItems = [];
                this.registerRooms = [];
                this.vipDiscountDetail = {};
                this.phoneValid = true;
            },
            hideModal(e){
                e.stopPropagation();
                this.refreshData();
                this.$emit('changeRegisterInfoShow', false);
                $('#registerInfoModal').modal('hide');
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
                    this.enterItems.push({ id: undefined, nodeId: undefined, count: 1, type: 2, date: undefined, timeAmount: 1 , inventory: undefined, usedAmount: 0, selfInventory: 0, totalPrice: 0, originPrice: 0 });
                } else {
                    let len = this.registerRooms.length;
                    if (len >= 99) {
                        modal.somethingAlert('一个订单最多添加99间房!');
                        return false;
                    }
                    let obj = JSON.parse(JSON.stringify(this.registerRooms[len - 1]));
                    obj.idCardList = [];
                    if (obj.roomOrderId) {
                        delete obj.roomOrderId;
                        delete obj.state;
                    }
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
                let durationValid = true;
                let roomPersonValid = true;
                if(!(this.phone || this.name) || (!this.name && !this.phoneValid) || !this.phoneValid){
                    modal.somethingAlert("请输入联系人或手机号!");
                    return false;
                }
                this.registerRooms.forEach(item => {
                    if (item.showTip || this.checkIsToday(item.room.startDate)) {
                        valid = false;
                    }
                    if (this.getDateDiff(item.room.startDate, item.room.endDate) > 400) {
                        durationValid = false;
                    }
                });
                this.enterItems.forEach(item => {
                    if (item.inventory + item.selfInventory <= 0) {
                        valid = false;
                    }
                });
                if (!valid) {
                    modal.somethingAlert("订单信息有误，请核对信息后再提交！");
                    return false;
                }
                if (!durationValid) {
                    modal.somethingAlert("所选择房间的入住时间超过了400天，请核对入住信息后再提交！");
                    return false;
                }
                this.registerRooms.forEach(item => {
                    if (item.idCardList.length > 0) {
                        item.idCardList.forEach(person => {
                            if (person.idCardNum === '' || person.name === '') {
                                roomPersonValid = false;
                            }
                        });
                    }
                });
                if (!roomPersonValid) {
                    modal.somethingAlert("请完善入住人信息！");
                    return false;
                }
                let enterItemsValid = this.enterItems.every(enter => { return enter.id && enter.date });
                if (!enterItemsValid) {
                    modal.somethingAlert("请完善娱乐信息！");
                    return false;
                }
                let shopGoodsItemsValid = this.shopGoodsItems.every(good => { return good.id });
                if (!shopGoodsItemsValid) {
                    modal.somethingAlert("请完善商超信息！");
                    return false;
                }
                const params = { name: this.name, phone: this.phone, remark: this.remark, originId: this.userOriginType };
                if (this.vipDiscountDetail.isVip) {
                    params.vipId = this.vipDiscountDetail.vipDetail.vipId;
                }
                if (this.checkState === 'ing') {
                    params.type = 0;
                } else if (this.checkState === 'finish') {
                    params.type = 1;
                } else if (this.checkState === 'book') {
                    params.type = 2;
                } else {
                    params.orderId = this.order.orderId;
                }
                if (this.userOriginType === -3) {
                    params.origin = '微官网';
                } else {
                    this.userOrigins.forEach(origin => {
                        if (origin.id === this.userOriginType) {
                            params.origin = origin.name;
                        }
                    });
                }
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
                    if (this.checkState === 'editOrder' && item.roomOrderId) {
                        room.roomOrderId = item.roomOrderId;
                    }

                    rooms.push(room);
                });

                let entertainmentItems = [];
                let playItems = [];
                this.enterItems.forEach(item => {
                    const enter = {};
                    enter.amount = item.count;
                    enter.timeAmount = item.timeAmount;
                    enter.date = item.date;
                    enter.categoryId = item.id;
                    this.enterList.forEach(option => {
                        if (option.id === item.id) {
                            enter.categoryName = option.name;
                            enter.price = Number((option.price * this.getItemDiscountInfo(item.nodeId, item.type, this.vipDiscountDetail).discount).toFixed(2));
                        }
                    });
                    enter.totalPrice = Number(item.totalPrice);
                    if (this.checkState === 'editOrder' && item.playOrderId) {
                        enter.playOrderId = item.playOrderId;
                    }
                    if (this.checkState === 'editOrder' && item.entertainmentId) {
                        enter.entertainmentId = item.entertainmentId;
                    }

                    entertainmentItems.push(enter);
                    playItems.push(enter);
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
                           good.price = Number((shop.price * this.getItemDiscountInfo(0, item.type, this.vipDiscountDetail).discount).toFixed(2));;
                       }
                    });

                    items.push(good);
                });
                params.rooms = JSON.stringify(rooms);
                params.items = JSON.stringify(items);
                if (this.checkState === 'editOrder') {
                    params.playItems = JSON.stringify(playItems);
                    params.payments = JSON.stringify([]);
                } else {
                    params.entertainmentItems = JSON.stringify(entertainmentItems);
                }

                if (this.checkState === "editOrder") {
                    AJAXService.ajaxWithToken('get', '/order/modify', params)
                        .then(res => {
                            if (res.code === 1) {
                                this.hideModal(e);
                                this.$emit('refreshView');
                                this.$emit('showOrder', this.order.orderId);
                            } else {
                                modal.somethingAlert(res.msg);
                            }
                        });
                } else {
                    AJAXService.ajaxWithToken('post', '/room/confirmOrder', params)
                        .then(res => {
                            if (res.code === 1) {
                                this.hideModal(e);
                                if(this.checkState === 'ing' || this.checkState === 'finish') {
                                    let business = {};
                                    business.businessJson = JSON.parse(JSON.stringify(params));
                                    business.businessJson.functionType = 1;
                                    business.businessJson.orderId = res.data.orderId;
                                    business.orderDetail = { ...res.data };
                                    business.cashierType = this.checkState;
                                    this.$emit('showCashier', { type: 'register', business: business });
                                } else {
                                    let orderId = res.data.orderType === 3 ? res.data.relatedOrderId : res.data.orderId;
                                    this.$emit('refreshView');
                                    this.$emit('showOrder', orderId);
                                }
                            } else {
                                modal.somethingAlert(res.msg);
                            }
                        });
                }
            },

            handleNumChange(type, tag, num){
                if (type === 3) {
                    this.shopGoodsItems.forEach((item, index) => {item.count = (index === tag) ? num : item.count;});
                } else if (type === 2) {
                    this.enterItems.forEach((item, index) => {
                        const price = this.getItemInfo(item.type, item.id)['price'];
                        const discount = this.getItemDiscountInfo(item.nodeId, item.type, this.vipDiscountDetail).discount;
                        item.count = (index === tag) ? num : item.count;
                        item.totalPrice = ((price * discount).toFixed(2) * item.count * item.timeAmount).toFixed(2);
                        item.originPrice = (price * item.count * item.timeAmount).toFixed(2);
                    });
                } else if (type === -2) {
                    this.enterItems.forEach((item, index) => {
                        const price = this.getItemInfo(item.type, item.id)['price'];
                        const discount = this.getItemDiscountInfo(item.nodeId, item.type, this.vipDiscountDetail).discount;
                        item.timeAmount = (index === tag) ? num : item.timeAmount;
                        item.totalPrice = ((price * discount).toFixed(2) * item.count * item.timeAmount).toFixed(2);
                        item.originPrice = (price * item.count * item.timeAmount).toFixed(2);
                    });
                }
            },

            getTotalPrice(arr, dis) {
                let price = 0;
                if (arr) {
                    arr.forEach(item => {
                        price += (dis ? item.price : item.originPrice) * item.amount;
                    });
                }
                return price.toFixed(2);
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
                    item.datePriceList.forEach(date => {
                        date.showInput = false;
                    });
                });
                this.vipListShow = false;
                this.vipList = [];
            },
            changShowInput(item, option) {
                item.datePriceList.forEach(datePrice => {
                    datePrice.showInput = false;
                });
                option.showInput = true;
            },
            stopPropagation() {
                return false;
            },
            setTotalPrice(obj) {
                obj.price = +(obj.datePriceList.reduce((a,b) => { return a + Number(b.dateFee) }, 0).toFixed(2));
            },
            setDateFee(num, obj) {
                const totalPrice = obj.datePriceList.reduce((a, b) => { return a + b.dateFee }, 0);
                let countArr = obj.datePriceList.map(item => {
                    if (totalPrice === 0) {
                        return 1 / obj.datePriceList.length;
                    }
                    return item.dateFee / totalPrice;
                });
                obj.datePriceList.forEach((item,index) => {
                    item.dateFee = +((num * countArr[index]).toFixed(2));
                });
                /*let total = obj.datePriceList.reduce((a, b) => { return a + (+b.dateFee) }, 0);
                obj.datePriceList[0].dateFee = +((obj.datePriceList[0].dateFee + (num - total)).toFixed(2));*/
            },
            setFirstDateFee(num, obj) {
                const totalPrice = obj.datePriceList.reduce((a, b) => { return a + b.dateFee }, 0);
                obj.datePriceList[0].dateFee = +((obj.datePriceList[0].dateFee + (num - totalPrice)).toFixed(2));
            },

            modifyRoom(item, boolean) {
                let duration = this.getDateDiff(item.room.startDate, item.room.endDate);
                if (duration < 1) {
                    item.room.endDate = util.diffDate(new Date(item.room.endDate), 1);
                    return false;
                }
                if (duration > 400) {
                    let currentTime = + new Date();
                    if (currentTime - this.lastModifyRoomTime > 2000) {
                        modal.somethingAlert("入住上限最大为400天，请重新选择入住时间！");
                        this.lastModifyRoomTime = currentTime;
                    }
                    return false;
                 }
                let startDate = util.dateFormat(new Date(item.room.startDate));
                let endDate = util.dateFormat(new Date(item.room.endDate));
                const discount = this.getItemDiscountInfo(0, 0, this.vipDiscountDetail).discount;
                AJAXService.ajaxWithToken('get', '/room/getRoomStaus',
                    { id: item.roomType,
                        date: startDate,
                        days: duration < 1 ? 1 : duration
                    })
                    .then(res => {
                        if (res.code === 1) {
                            let datePriceList = [];
                            let price = 0;
                            let originPrice = 0;
                            res.data.rs.status.forEach((option,index) => {
                                const fee = Number((option.p * discount).toFixed(2));
                                datePriceList.push({date: util.dateFormat(util.diffDate(new Date(item.room.startDate), index)), dateFee: fee, originDateFee: option.p, showInput: false});
                            });
                            /*if (item.datePriceList.length > 0 && boolean) {
                                datePriceList.forEach(newDate => {
                                    item.datePriceList.forEach(oldDate => {
                                        if (util.isSameDay(new Date(newDate.date), new Date(oldDate.date))) {
                                            newDate.dateFee = oldDate.dateFee;
                                        }
                                    })
                                });
                            }*/
                            datePriceList.forEach(date => {
                                price += date.dateFee;
                                originPrice += date.originDateFee;
                            });
                            item.price = Number(price.toFixed(2));
                            item.originPrice = Number(originPrice.toFixed(2));
                            item.datePriceList = datePriceList;
                        }
                    });
                const params = { roomId: item.roomType, startDate: startDate, endDate: endDate };
                if (item.roomOrderId) {
                    params.roomOrderId = item.roomOrderId;
                }

                AJAXService.ajaxWithToken('get', '/room/getStatusAndTotalPrice', params)
                    .then(res => {
                        if (res.code === 1) {
                            item.showTip = !res.data.available;
                        } else {
                            modal.somethingAlert(res.msg);
                        }
                    });
            },

            modifyEnter(item) {
                this.enterList.forEach(enter => {
                    if (enter.id === item.id) {
                        item.nodeId = enter.nodeId;
                    }
                });

                if (item.id && item.date) {
                    let date = util.dateFormat(new Date(item.date));
                    AJAXService.ajaxWithToken('get', '/item/getInventory', { id: item.id, date: date })
                        .then(res => {
                            if (res.code === 1) {
                                const price = this.getItemInfo(item.type, item.id)['price'];
                                const discount = this.getItemDiscountInfo(item.nodeId, item.type, this.vipDiscountDetail).discount;
                                item.inventory = res.data.inventory;
                                item.count = (item.inventory + item.selfInventory) === 0 ? 0 : item.count;
                                item.totalPrice = ((price * discount).toFixed(2) * item.count * item.timeAmount).toFixed(2);
                                item.originPrice = (price * item.count * item.timeAmount).toFixed(2);
                            } else {
                                modal.somethingAlert(res.msg);
                            }
                        });
                }
            },

            changeRoomType(item) {
                this.$nextTick(function() {
                    item.roomType = this.getRoomsList(item.categoryType)[0].id;
                    this.modifyRoom(item, false);
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
            /*name(newVal) {
                let search = newVal.length >= 1
                    && (this.checkState !== 'editOrder' || (this.checkState === 'editOrder' && this.order.isVip));
                if (search) {
                    const params = { name: newVal };
                    clearTimeout(this.timeCount);
                    this.timeCount = setTimeout(() => { this.getVipList(params, 1); }, 500);
                }
            },*/
            phone(newVal) {
                const params = { phone: newVal };
                let search = this.checkState !== 'editOrder' || (this.checkState === 'editOrder' && this.order.isVip);
                if (newVal.length >= 4 && newVal.length < 11 && search) {
                    //clearTimeout(this.timeCount);
                    //this.timeCount = setTimeout(() => { this.getVipList(params, 2); }, 500)
                } else if (newVal.length === 11 && search) {
                    this.checkPhone();
                    this.getVipDiscount(params);
                } else if (newVal !== 11) {
                    this.vipDiscountDetail = {};
                }
            },
            vipDiscountDetail(newVal) {
                this.registerRooms.forEach(room => {
                    if (this.checkState === 'editOrder') {
                        this.modifyRoom(room, true);
                    }
                    room.price = (Number(room.originPrice) * this.getItemDiscountInfo(0, 0, newVal).discount).toFixed(2);
                    this.setDateFee(room.price, room);
                    this.setFirstDateFee(room.price, room);
                });

                this.enterItems.forEach(enter => {
                    enter.totalPrice = (Number(enter.originPrice) * this.getItemDiscountInfo(enter.nodeId, enter.type, newVal).discount).toFixed(2);
                });
            },
            registerInfoShow(newVal) {
                if (newVal && this.checkState !== 'editOrder') {
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
                        AJAXService.ajaxWithToken('get', '/room/getRoomStaus', { id: item.roomId,
                            date: util.dateFormat(item.startDate),
                            days: duration })
                            .then(res => {
                                if (res.code === 1) {
                                    let datePriceList = [];
                                    let price = 0;
                                    res.data.rs.status.forEach((option,index) => {
                                        const fee = Number((option.p * this.getItemDiscountInfo(0, 0, this.vipDiscountDetail).discount).toFixed(2));
                                        datePriceList.push({date: util.dateFormat(util.diffDate(item.startDate, index)), dateFee: fee, showInput: false});
                                        price += option.p;
                                    });
                                    this.registerRooms.push({ categoryType: id,
                                                              roomType: item.roomId,
                                                              price: Number((price * this.getItemDiscountInfo(0, 0, this.vipDiscountDetail).discount).toFixed(2)),
                                                              originPrice: Number(price.toFixed(2)),
                                                              room: item, idCardList: [],
                                                              showPriceList: false,
                                                              datePriceList: datePriceList,
                                                              showTip: false });
                                }
                            });
                    });
                    $('#registerInfoModal').modal({backdrop: 'static'});
                } else if (newVal && this.checkState === 'editOrder') {
                    this.name = this.order.customerName;
                    this.phone = this.order.customerPhone;
                    this.userOriginType = this.order.originId;
                    this.remark = this.order.remark || '';
                    this.showOrder = true;

                    let enterItems = [];
                    let filterEnters = this.order.playItems.filter(enter => {
                        return enter.state !== 3;
                    });
                    filterEnters.forEach(item => {
                        const enter = {...item};
                        enter.id = item.categoryId;
                        enter.count = item.amount;
                        enter.selfInventory = item.amount;
                        enter.type = 2;
                        enter.inventory = undefined;
                        enter.totalPrice = (item.price * item.count * (item.timeAmount ? item.timeAmount : 1)).toFixed(2);
                        enterItems.push(enter);
                    });
                    this.enterItems = JSON.parse(JSON.stringify(enterItems));

                    let registerRooms = [];
                    let filterRooms = this.order.rooms.filter(room => {
                        return room.state === 0 || room.state === 1;
                    });
                    filterRooms.forEach(item => {
                        const room = {};
                        let id = undefined;
                        this.categories.forEach(category => {
                            category.rooms.forEach(room => {
                                if (room.i === item.roomId) {
                                    id = category.cId;
                                }
                            });
                        });
                        room.categoryType = id;
                        room.roomType = item.roomId;
                        room.originPrice = item.originPrice;
                        room.price = Number(item.fee.toFixed(2));
                        room.room = { roomId: item.roomId, startDate: item.startDate, endDate: item.endDate };
                        room.idCardList = item.idCardList;
                        room.datePriceList = item.datePriceList.map(dat => {
                            let newDate = { showInput: false };
                            newDate.date = dat.date;
                            newDate.dateFee = dat.dateFee;
                            return newDate;

                        });
                        room.showPriceList = false;
                        room.showTip = false;
                        room.state = item.state;
                        room.roomOrderId = item.serviceId;
                        registerRooms.push(room);
                    });
                    this.registerRooms = registerRooms;

                    $('#registerInfoModal').modal({backdrop: 'static'});
                } else if (!newVal) {
                    this.showOrder = false;
                }
            }
        }
    }
</script>