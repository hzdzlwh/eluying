<template>
    <!-- <div v-for 'item in data'> -->
    <div class="view-container">
        <div class="vipCard-list"><span>最多可以创建30个等级</span><span class="dd-btn dd-btn-sm dd-btn-primary" @click='add' style="float:right;">新增等级</span></div>
        <vipLevel v-for='(dd ,index) in data' :data='dd' :key="dd"   @delet='deletCard(index)' @addCard='fetchDate'></vipLevel>
        <div v-if="data.length === 0" style="text-aligin:center;margin-top:200px;">您还没有会员卡</div>
    </div>
    <!-- </div> -->
</template>
<style scoped>
.vipCard-list {
    font-size: 12px;
    color: #999999;
    margin-bottom: 20px;
    width: 730px;
}
</style>
<script>
import vipLevel from '../../components/vipLevel';
import http from '../../../common/http';
export default {
    data() {
        return {
            data: []
        };
    },
    components: {
        vipLevel
    },
    methods: {
        fetchDate() {
            http.get('/vipCard/getVipCardSettings')
                .then(res => {
                    this.data = res.data.list;
                });
        },
        add() {
            this.data.push({
                discountItems: [],
                payableItems: [],
                rechargeItems: [],
                applyStrategy: {},
                addType: 1
            });
        },
        deletCard(index) {
            this.data.splice(index, 1);
        }
    },
    created() {
        this.fetchDate();
    }
};
</script>
