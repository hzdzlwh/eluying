<template>
    <div>
        <div class="content-item">
            <p class="content-item-title"><span>娱乐信息</span></p>
            <div class="items">
                <div class="item" v-for="item in playItems">
                    <div class="play-item">
                        <span class="enter-icon"></span>
                        <div class="item-content">
                            <span class="item-name">
                                                    {{item.name || item.itemName}}{{item.chargeUnit ? `(${item.timeAmount * item.chargeUnitTime}${item.chargeUnit})` : ''}}
                                                </span>
                            <div class="item-date">
                                <label class="label-text">时间</label>
                                <span>{{item.date.slice(5)}}</span>
                            </div>
                            <div class="item-count">
                                <label class="label-text">数量</label>
                                <span>
                                {{item.amount || item.bookNum}}(可使用{{item.enableAmount}}/{{(item.amount || item.bookNum)}})
                                </span>
                            </div>
                            <div>
                                <label class="label-text">小计</label>
                                <span>¥{{item.totalPrice}}</span>
                            </div>
                            <span class="discount-info" v-if="item.vipShowDiscount" style="top: 14px">
                                                <span>原价<span class="origin-price">¥{{(item.originPrice * (item.amount || item.bookNum) * item.timeAmount).toFixed(2) }}</span></span>
                            <span class="discount-num">
                                                    {{ item.vipShowDiscount }}
                                                </span>
                            </span>
                            <div v-if='showMoadl && !order.enterItems' class="showModal" @click='modalShow(item.playOrderId)'>查看</div>
                        </div>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
        <EntertainmentOrderDetail :order="order" v-if="order.enterItems && order.enterItems.length > 0" />
    </div>
</template>
<style scoped>
.item-content > div {
    margin-right: 50px;
}

.showModal {
    color: #178ce6;
    cursor: pointer;
}
</style>
<script>
import event from '../event';
import EntertainmentOrderDetail from './EntertainmentOrderDetail.vue';
import {
    ORDER_TYPE
} from '../constant';
export default {
    props: {
        order: {
            type: Object,
            default: {}
        },
        showMoadl: {
            type: Boolean,
            default: true
        }
    },
    components: {
        EntertainmentOrderDetail
    },
    data() {
        return {
            ORDER_TYPE
        }
    },
    computed: {
        playItems() {
            if (this.order.playItems) {
                return this.order.playItems;
            }
            return [this.order];
        },
    },
    methods: {
        modalShow(id) {
            event.$emit('onShowDetail', {
                orderId: parseInt(id),
                orderType: ORDER_TYPE.ENTERTAINMENT
            })
        }
    }
}
</script>
