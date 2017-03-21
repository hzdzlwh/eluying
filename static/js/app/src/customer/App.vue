<template>
<div class="customer-container">
    <ul class="leftMenu">
        <li class="leftMenu-item">
            <router-link to="/vip">会员客户</router-link>
        </li>
        <li class="leftMenu-item">
            <router-link to="/company">企业客户</router-link>
        </li>
        <li class="leftMenu-item">
            <router-link to="/non-vip">非会员客户</router-link>
        </li>
    </ul>
    <div class="view-container">
        <router-view></router-view>
    </div>
</div>
</template>
<style  lang="sass" rel="stylesheet/scss">
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
        width: 1000px;
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
</style>
<script>
    export default{
        data () {
            return {
            }
        }
    }
</script>
