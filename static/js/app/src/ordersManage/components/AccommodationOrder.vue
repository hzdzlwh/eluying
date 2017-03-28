<template>
    <div class="content-item" v-if="order.rooms.lenght">
        <p class="content-item-title"><span>房间信息</span></p>
        <div class="items">
            <div class="item" v-for="item in order.rooms">
                <div class="room-info">
                    <div class="room-name">
                        <span class="room-icon"></span>
                        <span>{{item.serialNum}}({{item.name}})</span>
                        <span class="room-state-icon" :style="{background: getRoomOrFoodState(3, item.state).backgroundColor}">
                                                {{getRoomOrFoodState(3, item.state).text}}
                                            </span>
                    </div>
                    <div class="room-date">
                        <label class="label-text">入住</label>
                        <span class="startDate">{{item.startDate}}</span>
                        <span>~</span>
                        <span class="endDate">{{item.endDate}}</span>
                        <label class="label-text">共{{item.duration}}晚</label>
                    </div>
                    <div class="room-fee" style="margin-right: 81px">
                        <label class="label-text">房费</label>
                        <span>¥{{item.fee}}</span>
                        <div class="orderDetailModal-roomPriceList">
                            <dl class="price-item" v-for="priceItem in item.datePriceList">
                                <dt>{{priceItem.date.slice(5)}}</dt>
                                <dd>¥{{priceItem.dateFee}}</dd>
                            </dl>
                        </div>
                    </div>
                    <span class="discount-info" v-if="item.vipShowDiscount" style="top: 14px">
                                            <span>原价<span class="origin-price">¥{{ item.originPrice }}</span></span>
                    <span class="discount-num">
                                                {{ item.vipShowDiscount }}
                                            </span>
                    </span>
                    <div v-if='showMoadl' class="showModal" @click='modalShow(item.orderId)'>查看</div>
                </div>
                <div class="room-user" v-for="user in item.idCardList">
                    <span class="user-icon"></span>
                    <span class="user-name">{{user.name}}</span>
                    <div class="card-type">
                        <label class="label-text">{{ID_CARD_TYPE[user.idCardType]}}</label>
                        <span>{{user.idCardNum}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.room-info > div {
    margin-right: 50px;
}

.showModal {
    color: #178ce6;
    cursor: pointer;
}
</style>
<script>
import {
    ID_CARD_TYPE
} from '../constant';
import event from '../event'
export default {
    props: {
        order: {
            type: Object,
            default: undefined
        },
        showMoadl: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            ID_CARD_TYPE
        }
    },
    methods: {
        getRoomOrFoodState(type, state) {
            switch (state) {
                case 0:
                    return {
                        text: '预',
                        backgroundColor: '#ffba75'
                    };
                case 1:
                    return {
                        text: '住',
                        backgroundColor: '#82beff'
                    };
                case 2:
                    return {
                        text: '退',
                        backgroundColor: '#bfbfbf'
                    };
                case 3:
                    return {
                        text: '消',
                        backgroundColor: '#bfbfbf'
                    };
                default:
                    return {};
            }
        },
        modalShow(id) {
            event.$emit('onShowDetail', { orderId: id, orderType: 'ACCOMMODATION'})
        }
    }
}
</script>
