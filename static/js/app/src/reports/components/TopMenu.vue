<template>
    <ul class="restaurant-head-nav">
        <li v-for="route in routes">
            <router-link :to="route.path">{{route.meta.name}}</router-link>
        </li>
    </ul>
</template>
<style lang="scss" rel="stylesheet/scss">
    a {
        text-decoration: none;
        &:link {
            text-decoration: none;
        }
        &:visited {
            text-decoration: none;
        }
        &:hover {
            text-decoration: none;
        }
        &:active {
            text-decoration: none;
        }
    }
</style>
<script>
    const reg1 = /^\/dataCenter\/overview\/operation/;
    const reg2 = /^\/dataCenter\/overview\/flow/;
    const reg3 = /^\/dataCenter\/catering\/operation/;
    const reg4 = /^\/dataCenter\/entertainment\/operation/;
    export default{
        data() {
            return {
                routes: []
            };
        },
        created() {
            if (reg1.test(this.$route.fullPath)) {
                this.routes = this.$route.matched[1].meta.children[0].children;
            } else if (reg2.test(this.$route.fullPath)) {
                this.routes = this.$route.matched[1].meta.children[1].children;
            } else if (reg3.test(this.$route.fullPath)) {
                this.routes = this.$route.matched[1].meta.children[0].children;
            } else if (reg4.test(this.$route.fullPath)) {
                this.routes = this.$route.matched[1].meta.children[0].children;
            }
        },
        watch: {
            '$route.path'() {
                if (reg1.test(this.$route.fullPath)) {
                    this.routes = this.$route.matched[1].meta.children[0].children;
                } else if (reg2.test(this.$route.fullPath)) {
                    this.routes = this.$route.matched[1].meta.children[1].children;
                } else if (reg3.test(this.$route.fullPath)) {
                    this.routes = this.$route.matched[1].meta.children[0].children;
                } else if (reg4.test(this.$route.fullPath)) {
                    this.routes = this.$route.matched[1].meta.children[0].children;
                }
            }
        }
    };
</script>
