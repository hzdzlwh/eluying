<template>
<div class="customer-container">
    <ul class='leftMenu'>
        <li v-if="!route.meta.invisible" v-for="route in $router.options.routes" class="leftMenu-item">
            <router-link :to="route.path">{{route.meta.name}}</router-link>
            <ul v-if="route.children && $route.path.indexOf(route.path) > -1" id="leftMenu-children">
                <li v-for="child in route.children">
                    <router-link :to="child.path">{{child.meta.name}}</router-link>
                </li>
            </ul>
        </li>
    </ul>
    <div class="view-container">
        <router-view></router-view>
    </div>
</div>
</template>
<style lang="scss">
    @import "~dd-common-css/src/variables";
    .customer-container {
        padding-top: 89px;
        padding-left: 244px;
        padding-bottom: 50px;
        position: relative;
        .text-right {
            text-align: right;
        }
    }
    .view-container {
        position: relative;
        width: 1073px;
        margin: 0 auto;
    }
    h5 {
        font-size: $font-size-h5;
    }
    h4 {
        font-size: $font-size-h4;
    }
    i {
        color: #999;
        font-style: inherit;
    }
    .dd-dropdown-menu {
        z-index: 1;
    }
    .idcard-icon {
        width: 16px;
        height: 16px;
        display: inline-block;
        background: #bfbfbf;
        border-radius: 2px;
        margin-left: 2px;
        text-align: center;
        line-height: 16px;
        color: #fff;
        font-size: 12px;
    }
    .list-action-button {
        color: $blue;
        cursor: pointer;
    }
</style>
<script>
    export default {
        data() {
            return {};
        },
        created() {
            console.log(this.$router);
        }
    };
</script>
