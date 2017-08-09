/*
* @Author: lxj
* @Date:   2017-08-08 18:22:37
* @Last Modified by:   lxj
* @Last Modified time: 2017-08-09 11:00:20
* @email: 783384903@qq.com
*/


<template>
    <div class="modal fade" role="dialog" data-backdrop="static" id="dishModal">
        <div class="modal-dialog ">
            <div class="modal-content roomModals-body" v-if='data'>
                <div class="modal-header">
                    <span>{{type ? '赠送' :'退菜' }}</span>
                    <button type="button" class="close" @click="hideModal"><span>&times;</span></button>
                </div>
                <div class="modal-body" >
                    <div>{{data.dishName}}可退菜数量：{{data.bookNum}}</div>
                    <div><span>退菜数量：</span>
                    <count :min = 0 :num='Num' :max='data.bookNum' :onNumChange='onNumChange' :id='1'></count>
                    </div>
                </div>
                <div class="modal-foot">
                <div>{{type ? '赠送菜' :'退菜' }}金额：￥{{(data.price * Num ).toFixed(2)}}</div>
                <div>
                    <button class="dd-btn dd-btn-ghost" @click="hideModal">取消</button>
                    <button class="dd-btn dd-btn-primary" @click='changeBook'>确定</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import count from '../../common/components/counter.vue';
import util from 'util';
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object,
            default: () => {}
        },
        type: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            Num: 1
        };
    },
    methods: {
        onNumChange(type, index, num ){
            this.Num = num;
        },
        hideModal() {
            this.Num = 1;
            this.$emit('hideModal');
        },
        changeBook() {
            this.$emit('dishChange', this.num);
            this.hideModal();
        }
    },
    watch: {
        visible(newVale) {
            if (newVale) {
                $('#dishModal').modal('show');
            } else {
                $('#dishModal').modal('hide');
            }
        },
        num(val) {
            this.peopleNum = val;
        },
        resetData(val) {
            this.resetData = new Date(val);
        }
    },
    components: {
        count
    }
};
</script>

<style lang="scss" scoped>
    .modal-content{
        padding: 0;
        width: 500px;
        .modal-body{
            border-bottom: 1px solid #e5e5e5;
            > div{
                margin-bottom: 16px;
            }
        }
        .modal-foot{
            padding:15px 15px 5px;
            display: flex;
            justify-content: space-between;
        }
    }
</style>
