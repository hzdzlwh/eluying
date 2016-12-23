<template>
    <div>
        <div class="modal fade roomModals" id="orderDetail" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="roomModals-header">
                        <div class="header-container">
                            <span class="header-text">订单详情</span>
                            <span class="order-state-angle" :style="{ borderColor: getOrderState(order.orderState)['borderColor']}"></span>
                            <span class="order-state" :style="{ background: getOrderState(order.orderState)['backgroundColor']}" v-text="getOrderState(order.orderState)['text']"></span>
                        </div>
                        <div class="header-container">
                            <span class="header-tools" @click="openPrint(order)">打印</span>
                            <span class="header-tools">编辑订单</span>
                            <span class="close-icon" @click="hideModal"></span>
                        </div>
                    </div>
                    <div class="roomModals-body" style="height: 392px;">
                        <div class="content-item">
                            <p class="content-item-title"><span>客户信息</span></p>
                            <div class="userInfo-items">
                                <div class="userInfo-item">
                                    <label class="label-text">联系人</label>
                                    <span>{{ order.customerName }}</span>
                                </div>
                                <div class="userInfo-item">
                                    <label class="label-text">手机号</label>
                                    <span>{{ order.customerPhone }}</span>
                                </div>
                                <div class="userInfo-item" style="margin-right: 115px">
                                    <label class="label-text">客源渠道</label>
                                    <span>{{ order.origin }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="content-item" v-if="order.rooms && order.rooms.length > 0">
                            <p class="content-item-title"><span>房间信息</span></p>
                            <div class="items">
                                <div class="item" v-for="item in order.rooms">
                                    <div class="room-info">
                                        <div class="room-name">
                                            <span class="room-icon"></span>
                                            <span class="room-name">{{item.name}}</span>
                                            <span class="room-state-icon" :style="{background: getRoomOrFoodState(3, item.state).backgroundColor}">{{getRoomOrFoodState(3, item.state).text}}</span>
                                        </div>
                                        <div class="room-date">
                                            <label class="label-text">入住</label>
                                            <span class="startDate">{{item.startDate}}</span>
                                            <span>~</span>
                                            <span class="endDate">{{item.endDate}}</span>
                                            <label class="label-text">{{`共${item.duration}晚`}}</label>
                                        </div>
                                        <div class="room-fee" style="margin-right: 81px">
                                            <label class="label-text">房费</label>
                                            <span>{{`¥${item.fee}`}}</span>
                                        </div>
                                    </div>
                                    <div class="room-user" v-for="user in item.idCardList">
                                        <span class="user-icon"></span>
                                        <span class="user-name">{{user.name}}</span>
                                        <div class="card-type">
                                            <label class="label-text">{{user.idCardType}}</label>
                                            <span>{{user.idCardNum}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>餐饮信息</span></p>
                        </div>
                        <div class="content-item" v-if="order.playItems && order.playItems.length > 0">
                            <p class="content-item-title"><span>娱乐信息</span></p>
                            <div class="items">
                                <div class="item" v-for="item in order.playItems">
                                    <div class="play-item">
                                        <span class="enter-icon"></span>
                                        <div class="item-content">
                                            <span class="item-name">{{item.name}}</span>
                                            <div class="item-date">
                                                <label class="label-text">时间</label>
                                                <span>{{item.date}}</span>
                                            </div>
                                            <div class="item-count">
                                                <label class="label-text">数量</label>
                                                <span>{{`${item.amount}(可使用${item.enableAmount}/${item.amount})`}}</span>
                                            </div>
                                            <div style="margin-right: 81px">
                                                <label class="label-text">小计</label>
                                                <span>{{`¥${item.totalPrice}`}}</span>
                                            </div>
                                        </div>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>商超信息</span></p>
                        </div>
                        <div class="content-item">
                            <p class="content-item-title"><span>备注信息</span></p>
                            <div>{{order.remark}}</div>
                        </div>
                    </div>
                    <div class="roomModals-footer" style="height: 149px;"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="sass" type="text/css" rel="stylesheet/scss">
    @import "~dd-common-css/src/variables";
    #orderDetail {
        .label-text {
            color: #999999;
        }
    }
    .header-container {
        display: flex;
        align-items: center;
    }
    .order-state-angle {
        margin-left: 16px;
        border-right: 12px solid;
        border-top: 11px solid;
        border-bottom: 11px solid;
    }
    .order-state {
        color: #ffffff;
        font-size: $font-size-sm;
        display: inline-flex;
        width: 40px;
        height: 22px;
        justify-content: center;
        align-items: center;
        border-radius: 1px;
        padding-right: 3px;
    }
    .header-tools {
        color: $blue;
        font-size: $font-size-sm;
        cursor: pointer;
        margin-right: 16px;
    }
    .item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 13px;
        &:not(:last-child) {
            padding-bottom: 15px;
            margin-bottom: 16px;
            border-bottom: 1px dotted #e6e6e6;
        }
    }
    .item-content {
        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        align-items: center;
    }
    .card-type {
        margin-left: 96px;
    }
    .room-date {
        .startDate, .endDate {
            margin: 0 14px;
        }
    }
    .room-info {
        justify-content: space-between;
    }
    .room-info, .room-name, .room-user, .play-item {
        display: flex;
        align-items: center;
    }
    .room-user {
        margin-top: 12px;
    }
    .room-state-icon {
        width: 16px;
        height: 16px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        font-size: 10px;
        border-radius: 2px;
        margin-left: 4px;
    }
    .room-icon {
        width: 16px;
        height: 15px;
        background: url("../../../../../image/modal/room_modal_home.png");
        background-size: contain;
        margin-right: 25px;
    }
    .user-icon {
        width: 16px;
        height: 15px;
        background: url("../../../../../image/modal/room_modal_user.png");
        background-size: contain;
        margin-right: 25px;
    }
</style>
<script>
    import AJAXService from 'AJAXService';
    export default{
        props: {
          order: {
              type: Object,
              default: {}
          }
        },
        data(){
            return{}
        },
        computed: {},
        methods: {
            hideModal(e){
                e.stopPropagation();
                $("#orderDetail").modal("hide");
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
            /**根据状态获取对应的图标
             * 0-餐, 3-住
             * @param type
             * @param state
             * @returns {*}
             */
            getRoomOrFoodState(type, state){
                switch(state){
                    case 0:
                        return {text: '预', backgroundColor: '#ffba75'};
                    case 1:
                        return {text: type === 0 ? '餐' : '住', backgroundColor: '#82beff'};
                    case 2:
                        return {text: type === 0 ? '完' : '退', backgroundColor: '#bfbfbf'};
                    case 3:
                        return {text: '消', backgroundColor: '#bfbfbf'};
                    default:
                        return {};
                }
            },
            openPrint(orderDetail) {
                let params = { orderId: orderDetail.orderId };
                params = AJAXService.getDataWithToken(params);
                params = AJAXService.paramsToString(params);
                window.open(AJAXService.getUrl2('/printer/getOrderDetailJsp?') + params);
            }
        },
        components:{}
    }
</script>
