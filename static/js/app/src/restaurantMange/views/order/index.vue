/*
* @Author: lxj
* @Date:   2017-07-28 16:16:45
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-08-03 16:44:48
* @email: 783384903@qq.com
*/

<template>
    <div class="restContain">
        <div class="rest-order-left">
            <div v-if="true">
                <rest-seats></rest-seats>
            </div>
            <div v-else>
                <rest-menu></rest-menu>
            </div>
        </div>
        <div class="rest-order-right">
            <taday v-if='leftType === 0'></taday>
            <resetContain v-if='leftType === 1'></resetContain>
            <resetdetail v-if='leftType === 2'></resetdetail>
        </div>
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
export default {
    props: {

    },
    data() {
        return {
            keyboardVisible: false,
            restNum: 0
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
        }
    },
    components: {
        taday,
        inputKeyboard,
        restMenu,
        resetContain,
        resetdetail,
        restSeats
    },
    created() {

    }
};
</script>
