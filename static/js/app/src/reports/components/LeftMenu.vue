<template>
    <ul class='leftMenu' style="top:127px;">
        <li v-if="!route.meta.invisible" v-for="route in routes" class="leftMenu-item">
            <router-link :to="route.path">{{route.meta.name}}</router-link>
            <ul v-if="route.children && $route.path.indexOf(route.path) > -1" id="leftMenu-children" style="top:127px;">
                <li v-for="child in route.children" v-if='$route.meta.name !== "collect"'>
                    <router-link :to="child.path">{{child.meta.name}}</router-link>
                </li>
                <li v-for="child in collectList" v-if='$route.meta.name === "collect"'>
                    <router-link :to='"/reportCenter/collects/" + child'>{{getcollect(child).name}}</router-link>
                </li>
            </ul>
        </li>
    </ul>
</template>
<style lang="scss" scoped>
    #leftMenu-children{
        min-width:86px;
        width:140px;
    }
</style>
<script>
    import bus from '../bus.js';
    const reg1 = /^\/dataCenter/;
    const reg2 = /^\/reportCenter/;
    import http from 'http';
    import collectLinkList from '../collectList.js';
    // const AsyncComp = () => ({
    //     component: import('./MyComp.vue')
    // })
    export default{
        data() {
            return {
                routes: [],
                collectList: [],
                collectLinkList
            };
        },
        created() {
            http.get('/stat/getCollection', {})
            .then(res => {
                this.collectList = res.data.list;
            });
            bus.$on('changeList', this.changeRouter);
            window.console.log(this.collectLinkList[this.$route.params.id].name);
            if (reg1.test(this.$route.fullPath)) {
                this.routes = this.$router.options.routes[1].children;
            } else if (reg2.test(this.$route.fullPath)) {
                this.routes = this.$router.options.routes[2].children;
            }
        },
        beforeDestroy() {
            bus.$off('changeList', this.changeRouter);
        },
        methods: {
            changeRouter(list) {
                this.collectList = list;
            },
            getcollect(id) {
                return this.collectLinkList[id];
            }
        },
        watch: {
            '$route.path'() {
                if (reg1.test(this.$route.fullPath)) {
                    this.routes = this.$router.options.routes[1].children;
                } else if (reg2.test(this.$route.fullPath)) {
                    this.routes = this.$router.options.routes[2].children;
                }
            }
        }
    };
</script>
