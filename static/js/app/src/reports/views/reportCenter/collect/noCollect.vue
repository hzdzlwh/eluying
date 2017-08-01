<template>
    <div>
        <div class="report-noCollect" v-if="noCollect">
            <img src="https://static.dingdandao.com/ordersManage_noOrders.png" alt="">
            <p style="line-height:38px;font-size:20px;font-weight:bold;">您还没有收藏任何报表</p>
            <p style="font-size:12px;">收藏你所需要的报表，提高查看效率</p>
        </div>
        <router-view></router-view>
    </div>
</template>
<style lang="scss" scoped>
    .report-noCollect {
        width:100%;
        min-height: 500px;
        height:65vh;
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
    }
</style>
<script>
import http from 'http';
import { mapActions } from 'vuex';
import collectList from '../../../collectList.js';
export default {
    data() {
        return {
            noCollect: undefined
        };
    },
    methods: {
        ...mapActions([
            'loadCenterList'
        ])
    },
    created() {
        http.get('/stat/getCollection', {})
            .then(res => {
                if (res.code === 1) {
                    const centerList = res.data.list;
                    this.$router.options.routes[2].children[0].children.splice(1, this.$router.options.routes[2].children[0].children.length - 1);
                    if (centerList.length) {
                        this.$router.push('/reportCenter/collect/' + res.data.list[0]);
                        res.data.list.map((id) => {
                            this.$router.options.routes[2].children[0].children.push({ meta: { name: collectList[id].name, id: id }, path: '' });
                        });
                        this.noCollect = false;
                    } else {
                        this.noCollect = true;
                    }
                } else {
                    window.alert('请求失败');
                }
            });
    }
};
</script>
