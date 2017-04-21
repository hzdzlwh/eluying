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
                                <span>{{item.date}}</span>
                            </div>
                            <div class="item-count">
                                <label class="label-text">数量</label>
                                <span>
                                {{item.amount || item.bookNum}}(可使用{{item.enableAmount}}/{{(item.amount || item.bookNum)}})
                                </span>
                            </div>
                            <div  class="item-price">
                                <label class="label-text">小计</label>
                                <span>¥{{item.totalPrice}}</span>
                                <span  class="single-order-btn" @click='modalShow(item.playOrderId)' v-text="(showMoadl && !order.enterItems) ? '查看': ''"
                                :class="(showMoadl && !order.enterItems) ? 'cursor' : ''"
                                >查看</span>
                            </div>
                            <span class="discount-info" v-if="item.vipShowDiscount" style="top: 14px">
                                                <span>原价<span class="origin-price">¥{{(item.originPrice * (item.amount || item.bookNum) * item.timeAmount).toFixed(2) }}</span></span>
                            <span class="discount-num">
                                                    {{ item.vipShowDiscount }}

                                                </span>
                            </span>
                            
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
</style>
<script>
import bus from '../../common/eventBus';
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
        };
    },
    computed: {
        playItems() {
            if (this.order.playItems) {
                return this.order.playItems;
            }
            return [this.order];
        }
    },
    methods: {
        modalShow(id) {
            bus.$emit('onShowDetail', {
                orderId: parseInt(id),
                type: ORDER_TYPE.ENTERTAINMENT
            });
        }
    }
};
</script>
