<template>
    <!-- <div v-for 'item in data'> -->
    <div class="view-container">
        <div class="vipCard"><span>最多可以创建10种卡</span><span class="dd-btn dd-btn-sm dd-btn-primary" @click='add' style="float:right;">新增会员卡</span></div>
        <vipCardSet v-for='dd in data' :data='dd' :key="dd" :editor='dd.addType === 1' :toggleShow='!(dd.addType === 1)'></vipCardSet>
    </div>
    <!-- </div> -->
</template>
<style scoped>
.vipCard {
    font-size: 12px;
    color: #999999;
    margin-bottom: 20px;
    width: 730px;
}
</style>
<script>
import vipCardSet from '../../components/vipCardSet';
import http from '../../../common/http';
export default {
    data() {
        return {
            data: []
        };
    },
    components: {
        vipCardSet
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
        }
    },
    created() {
        this.fetchDate();
    }
};
</script>
