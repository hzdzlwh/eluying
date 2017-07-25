<template>
    <div style="height:100px;">
        没有收藏
        <router-view></router-view>
    </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import http from 'http';
import { mapActions } from 'vuex';
import bus from '../../../bus.js';
export default {
    data() {
        return {
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
                    if (centerList.length) {
                        this.$router.push('/reportCenter/collect/' + res.data.list[0]);
                    }
                } else {
                    window.alert('请求失败');
                }
            });
    }
};
</script>
