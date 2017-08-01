<template>
    <ul class='leftMenu' style="top:117px;">
        <li v-if="!route.meta.invisible" v-for="route in routes" class="leftMenu-item">
            <router-link :to="route.path">{{route.meta.name}}</router-link>
            <ul v-if="route.children && $route.path.indexOf(route.path) > -1" id="leftMenu-children" style="top:117px;">
                <li v-for="child in route.children" v-if='$route.meta.name !== "collect"'>
                    <router-link :to="child.path">{{child.meta.name}}</router-link>
                </li>
                <!-- <li v-for="child in collectList" v-if='$route.meta.name === "collect"'>
                    <router-link :to='"/reportCenter/collect/" + child'>{{getcollect(child).name}}</router-link>
                </li> -->
                <li v-for="(item, index) in $router.options.routes[2].children[0].children" v-if="index !== 0 && $route.meta.name === 'collect'">
                    <router-link :to='"/reportCenter/collect/" + item.meta.id'>{{item.meta.name}}</router-link>
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
    import collectLinkList from '../collectList.js';
    export default{
        data() {
            return {
                routes: [],
                collectList: [],
                collectLinkList
            };
        },
        created() {
            /* http.get('/stat/getCollection', {})
            .then(res => {
                this.collectList = res.data.list;
            }); */
            bus.$on('changeList', this.changeRouter);
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
                console.log(this.collectLinkList[id]);
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
