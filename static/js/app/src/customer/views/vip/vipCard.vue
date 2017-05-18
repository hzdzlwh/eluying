<template>
    <!-- <div v-for 'item in data'> -->
    <div class="view-container">
        <div class="vipCard"><span>最多可以创建10种卡</span><span class="dd-btn dd-btn-sm dd-btn-primary" @click='add' style="float:right;">新增会员卡</span></div>
        <vipCardSet @select='select' v-for='(dd ,index) in data' :data='dd' :key="dd" :editor='dd.addType === 1' :toggleShow='!(dd.addType === 1)' @delet='deletCard(index)' @addCard='fetchDate'></vipCardSet>
        <div v-if="data.length === 0" style="text-aligin:center;margin-top:200px;">您还没有会员卡</div>
        <categorySelect :onConfirm="handleCategorySelect" :type="'discount'" :list="nodes" />
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
import categorySelect from '../../components/categorySelect.vue';
import bus from '../../event.js';
export default {
    data() {
        return {
            data: [],
            nodes: []
        };
    },
    components: {
        vipCardSet,
        categorySelect
    },
    methods: {
        fetchDate() {
            http.get('/vipCard/getVipCardSettings')
                .then(res => {
                    if (res.data) {
                        this.data = res.data.list;
                    } else {
                        this.data = [];
                    }
                });
        },
        select(nodes) {
            this.nodes = nodes;
            $('#categorySelectModal').modal('show');
        },
        handleCategorySelect(list) {
            bus.$emit('vipCardCategory', list);
        },
        add() {
            this.data.unshift({
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
