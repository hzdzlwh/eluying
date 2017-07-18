<template>
    <ul class='leftMenu' style="top:127px;">
        <li v-if="!route.meta.invisible" v-for="route in routes" class="leftMenu-item">
            <router-link :to="route.path">{{route.meta.name}}</router-link>
            <ul v-if="route.children && $route.path.indexOf(route.path) > -1" id="leftMenu-children" style="top:127px;">
                <li v-for="child in route.children">
                    <router-link :to="child.path">{{child.meta.name}}</router-link>
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
    const reg1=/^\/dataCenter/;
    const reg2=/^\/reportCenter/;
    export default{
        data() {
            return {
                routes: []
            }
        },
        created() {
            if(reg1.test(this.$route.fullPath)){
                this.routes = this.$router.options.routes[1].children;
            }else if(reg2.test(this.$route.fullPath)){
                this.routes = this.$router.options.routes[2].children;
            }
        },
        watch: {
            '$route.path'() {
                if(reg1.test(this.$route.fullPath)){
                    this.routes = this.$router.options.routes[1].children;
                }else if(reg2.test(this.$route.fullPath)){
                    this.routes = this.$router.options.routes[2].children;
                }
            }
        }
    };
</script>
