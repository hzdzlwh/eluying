<template>
<<<<<<< HEAD
    <div class="vip-contain">
        <ul class="leftMenu">
            <!---->
            <li class="leftMenu-item">
                <a href="/view/customer/vip" :class="{ active: step ===1 }" @click='changestep(1)'>会员客户</a>
            </li>
            <li class="leftMenu-item">
                <a href="/view/customer/company" :class="{ active: step ===2 }" @click='changestep(2)'>企业客户</a>
            </li>
            <li class="leftMenu-item">
                <a href="/view/customer/non-vip" :class="{ active: step ===3 }" @click='changestep(3)'>非会员客户</a>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>
<style>
.vip-contain {
    padding-top: 89px;
    padding-left: 144px;
    padding-bottom: 50px;
    position: relative;
}
=======
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
>>>>>>> 42823151d611066ee46636734b3a4595b7a4afc4
</style>
<script>
export default {
    data() {
            return {
<<<<<<< HEAD
                step: 1
            }
        },
        methods: {
            changestep: function(step) {
                this.step = this.$route.meta.step
            }
        },
        watch: {
            '$route': 'changestep'
        },
        created() {
            this.changestep()
=======
            }
>>>>>>> 42823151d611066ee46636734b3a4595b7a4afc4
        }
}
</script>
