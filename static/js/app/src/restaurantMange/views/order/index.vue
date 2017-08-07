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
        <reserve-info-modal :visible="reserveInfoVisible" @hideModal="hideModal" @showRelevaneOrder="showRelevanceOrder"></reserve-info-modal>
        <relevance-order-modal :visible="relevanceOrderVisible" @hideModal="hideModal"></relevance-order-modal>
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
export default {
    props: {

    },
    data() {
        return {
            keyboardVisible: false,
            restNum: 0,
            reserveInfoVisible: false,
            relevanceOrderVisible: false
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
        },
        showRelevanceOrder() {
            this.relevanceOrderVisible = true;
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
        relevanceOrderModal
    },
    created() {

    }
};
</script>
