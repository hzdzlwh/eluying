<template>
    <div>
        <accommodation v-if='componentName === "301"'></accommodation>
    </div>
</template>
<style lang="scss" scoped>
</style>
<script>
    import accommodation from '../accommodation/morrowArrive.vue';
    import collectList from '../../../collectList.js';
    // const hrefArr = location.pathname.split('/');
    export default {
        data() {
            return {
                collectList,
                componentName: this.$route.params.id
            };
        },
        components: {
            accommodation
            // 'accommodation': routeList.accommodation
        },
        // beforeRouteUpdate(to, from, next) {
        //     this.componentName = this.$routes.params.id;
        //     next();
        // }
    };
</script>
