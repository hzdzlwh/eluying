/*
* @Author: lxj
* @Date:   2017-07-28 16:16:45
* @Last Modified by:   lxj
* @Last Modified time: 2017-08-07 19:11:45
* @email: 783384903@qq.com
*/

<template>
    <div class="restContain">
        <div class="rest-order-left">
            <div v-if="leftType === 0 || leftType === 1 || leftType === 2 || leftType === 3">
                <rest-seats @reserve="changeReserveInfoVisible"></rest-seats>
            </div>
            <div v-if="leftType === 4">
                <rest-menu></rest-menu>
            </div>
        </div>
        <div class="rest-order-right">
            <taday v-if='leftType === 0'></taday>
            <resetContain v-if='leftType === 1'></resetContain>
            <resetdetail v-if='leftType === 2 || leftType === 3 || leftType === 4'></resetdetail>
        </div>
        <reserve-info-modal :visible="reserveInfoVisible" :relevanceOrder="relevanceOrderDetail" @hideModal="hideModal" @showRelevaneOrder="showRelevanceOrder" @cancelConnect="cancelConnect"></reserve-info-modal>
        <relevance-order-modal :visible="relevanceOrderVisible" @hideModal="hideModal" @sendRelevanceOrder="getRelevanceOrderDetail"></relevance-order-modal>
        <change-seat-modal :visible="changeSeatVisible" @hideModal="hideModal"></change-seat-modal>
        <order-menu-modal :visible="orderMenuVisible" @hideModal="hideModal"></order-menu-modal>
    </div>
</template>
<style lang="scss" scoped>
    .restContain{
        width: 1210px;
        margin: auto;
        justify-content: space-between;
        display: flex;
        padding-top:50px;
    }
    .rest-order-left{
        width: 792px;
        
    }
    .rest-order-right{
        width: 400px;
    }
</style>
<script>
import taday from '../../components/tadayRestDate.vue';
import inputKeyboard from '../../../common/components/inputKeyboard.vue';
import restSeats from '../../components/restSeats.vue';
import restMenu from '../../components/restMenu';
import { dateFormat } from '../../../common/util';
import { mapState, mapMutations } from 'vuex';
import resetContain from '../../components/resetConstain.vue';
import resetdetail from '../../components/resetDetail.vue';
import reserveInfoModal from '../../components/reserveInfo';
import relevanceOrderModal from '../../components/relevanceOrder';
import changeSeatModal from '../../components/changeSeat';
import orderMenuModal from '../../components/orderMenu';
import restBus from '../../event.js';
export default {
    props: {

    },
    data() {
        return {
            keyboardVisible: false,
            restNum: 0,
            reserveInfoVisible: false,
            relevanceOrderVisible: false,
            changeSeatVisible: false,
            orderMenuVisible: false,
            relevanceOrderDetail: undefined
        };
    },
    computed: mapState([
        'leftType'
    ]),
    methods: {
        numChange(val) {
            this.restNum = val;
        },
        getNum(val) {
            this.keyboardVisible = true;
        },
        closeKeyboard() {
            this.keyboardVisible = false;
        },
        changeReserveInfoVisible() {
            this.reserveInfoVisible = true;
        },
        hideModal() {
            this.reserveInfoVisible = false;
            this.relevanceOrderVisible = false;
            this.changeSeatVisible = false;
            this.orderMenuVisible = false;
        },
        showRelevanceOrder() {
            this.relevanceOrderVisible = true;
        },
        showChangeSeatModal() {
            this.changeSeatVisible = true;
        },
        showOrderMenuModal() {
            this.orderMenuVisible = true;
        },
        getRelevanceOrderDetail(orderDetail) {
            this.relevanceOrderDetail = orderDetail;
        },
        cancelConnect() {
            this.relevanceOrderDetail = undefined;
        },
        changeBoard() {
            this.showChangeSeatModal();
        }
    },
    watch: {
        relevanceOrderDetail(newValue) {
            if (newValue) {
                this.changeReserveInfoVisible();
            }
        },
        reserveInfoVisible(newValue) {
            if (!newValue) {
                this.relevanceOrderDetail = undefined;
            }
        }
    },
    components: {
        taday,
        inputKeyboard,
        restMenu,
        resetContain,
        resetdetail,
        restSeats,
        reserveInfoModal,
        relevanceOrderModal,
        changeSeatModal,
        orderMenuModal
    },
    created() {
        restBus.$on('changeBoard', this.changeBoard)
    }
};
</script>
