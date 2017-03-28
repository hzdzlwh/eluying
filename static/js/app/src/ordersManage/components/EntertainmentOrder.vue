<template>
    <div class="content-item" v-if="order.playItems.lenght">
        <p class="content-item-title"><span>娱乐信息</span></p>
        <div class="items">
            <div class="item" v-for="item in order.playItems">
                <div class="play-item">
                    <span class="enter-icon"></span>
                    <div class="item-content">
                        <span class="item-name">
                                                {{item.name}}{{item.chargeUnit ? `(${item.timeAmount * item.chargeUnitTime}${item.chargeUnit})` : ''}}
                                            </span>
                        <div class="item-date">
                            <label class="label-text">时间</label>
                            <span>{{item.date.slice(5)}}</span>
                        </div>
                        <div class="item-count">
                            <label class="label-text">数量</label>
                            <span>{{`${item.amount}(可使用${item.enableAmount}/${item.amount})`}}</span>
                        </div>
                        <div >
                            <label class="label-text">小计</label>
                            <span>¥{{item.totalPrice}}</span>
                        </div>
                        <span class="discount-info" v-if="item.vipShowDiscount" style="top: 14px">
                                            <span>原价<span class="origin-price">¥{{(item.originPrice * item.amount * item.timeAmount).toFixed(2) }}</span></span>
                        <span class="discount-num">
                                                {{ item.vipShowDiscount }}
                                            </span>
                        </span>
                        <div v-if='showMoadl' class="showModal" @click='modalShow(item.playOrderId)'>查看</div>
                    </div>
                    <span></span>
                    
                </div>
            </div>
        </div>
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
import event from '../event'
export default {
    props: {
        order: {
            type: Object,
            default: []
        },
        showMoadl: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            
        }
    },
    methods: {
        modalShow(id) {
            event.$emit('onShowDetail', { orderId: id, orderType: 'ENTERTAINMENT'})
        }
    }
}
</script>
