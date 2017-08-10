/*
* @Author: lxj
* @Date:   2017-08-01 14:28:15
* @Last Modified by:   lxj
* @Last Modified time: 2017-08-10 11:14:18
* @email: 783384903@qq.com
*/

<template>
    <div class="rest-taday-contain">
     <div class="rest-taday-count">
           <div class="restDetail-title-tip">桌号</div>
            <div class="restDetail-title-display">
                <div><span class="restDetail-title-dish">{{selectDish[0].boardName}}{{selectDish[0].boardName}}</span> <span v-if='selectDish.length > 1' class="restDetail-type-tag" :title='selectDishText'>并</span></div>
                <!-- <div><span class="rest-taday-tag " :class="getState(item.foodState, 'color')">{{getState(item.foodState, 'text')}}</span></div> -->
            </div>
            <div class="rest-btn-head"><button class="reset-btn-base reset-btn-start" @click='getNum'>开台</button><button class="reset-btn-base reset-btn-book">预订</button></div>
        </div>
        <inputKeyboard :visible='keyboardVisible' :max='1000' :num='restNum' @numChange='numChange' @close='closeKeyboard'></inputKeyboard>
    </div>
</template>
<style >
    .rest-btn-head{
        margin-top: 20px;
        margin-bottom:10px;
    }
    .reset-btn-base{
        border-radius:4px;
        width:69px;
        height:34px;
        text-align: center;
        display: inline-block;
    }
    .reset-btn-start{
        background-color: #178ce6;
        color: #fff;
        border: 1px solid #178ce6;
        margin-right: 15px;
    }
    .reset-btn-book{
        background-color: #fff;
        color: #99a9bf;
        border:1px solid #99a9bf;
    }
</style>
<script>
import inputKeyboard from '../../common/components/inputKeyboard.vue';
import http from '../../common/http.js';
import { mapState, mapMutations } from 'vuex';
export default {
    props: {
        resetDate: Object,
        resetId: Number

    },
    data() {
        return {
            keyboardVisible: false,
            restNum: 0
        };
    },
    computed: {
        ...mapState([
            'restId',
            'board',
            'selectDish'
        ]),
        selectDishText() {
            let str = '';
            this.selectDish.forEach((el, index) => {
                if (index !== 0) {
                    str += '\r\n';
                }
                str += el.boardName + el.boardId;
            });
            return str;
        }
    },
    methods: {
        ...mapMutations([
            'setLeftType',
            'setOpenData'
        ]),
        numChange(val) {
            const boardIds = [];
            this.selectDish.forEach(el => {
                boardIds.push(el.id);
            });
            http.get('/board/openBoard', { boardIds: JSON.stringify(boardIds), peopleNum: val, restId: this.restId }).then(res => {
                this.setOpenData(res.data);
                this.setLeftType({ leftType: 2 });
            });
            this.$nextTick(() => {
                http.get('/board/openBoard', { boardIds: JSON.stringify(boardIds), peopleNum: val, restId: this.restId }).then(res => {
                    this.setOpenData(res.data);
                    this.setLeftType({ leftType: 2 });
                });
            });
        },
        getNum(val) {
            this.keyboardVisible = true;
            this.restNum = 0;
        },
        closeKeyboard() {
            this.keyboardVisible = false;
        }
    },
    watch: {
    },
    components: {
        inputKeyboard
    },
    created() {

    }

};
</script>
