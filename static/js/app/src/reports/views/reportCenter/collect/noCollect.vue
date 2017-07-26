<template>
    <div style="height:100px;">
        <router-view></router-view>
    </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import http from 'http';
import { mapActions } from 'vuex';
import bus from '../../../bus.js';
import collectList from '../../../collectList.js';
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
                    this.$router.options.routes[2].children[0].children.splice(1, this.$router.options.routes[2].children[0].children.length - 1)
                    if (centerList.length) {
                        this.$router.push('/reportCenter/collect/' + res.data.list[0]);
                        res.data.list.map((id) => {
                            this.$router.options.routes[2].children[0].children.push({ meta: { name: collectList[id].name, id: id }, path: '' });
                        });
                    }
                } else {
                    window.alert('请求失败');
                }
            });
    }
};
</script>
