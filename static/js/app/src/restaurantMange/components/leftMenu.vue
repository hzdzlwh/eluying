<template>
    <ul class='leftMenu' style="top:117px;">
        <li v-if="!route.meta.invisible" v-for="route in routes" class="leftMenu-item">
            <router-link :to="route.path">{{route.meta.name}}</router-link>
        </li>
    </ul>
</template>
<style lang="scss" scoped>
    #leftMenu-children{
        min-width:86px;
        width:140px;
        overflow: scroll;
    }
    #leftMenu-children::-webkit-scrollBar{
        width: 0;
    }
</style>
<script>
    export default{
        data() {
            return {
                routes: [],
                collectList: []
            };
        },
        created() {
            this.routes = this.$router.options.routes[1].children;
        },
        methods: {
            changeRouter(list) {
                this.collectList = list;
            }
        },
        watch: {
            '$route.path'() {
                this.routes = this.$router.options.routes[1].children;
            }
        }
    };
</script>
