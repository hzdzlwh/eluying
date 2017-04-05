<template>
    <div class="reports-container">
        <LeftMenu></LeftMenu>
        <div class="view-container">
            <div class="date-select-container">
                <DateSelect />
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>
<style lang="scss" rel="stylesheet/scss">
    @import "~dd-common-css/src/variables";
    .reports-container {
        padding-top: 89px;
        padding-left: 244px;
        padding-bottom: 50px;
        position: relative;
        .text-right {
            text-align: right;
        }
    }
    .date-select-container {
        position: absolute;
        right: 0;
    }
    .view-container {
        position: relative;
        width: 1000px;
        margin: 0 auto;
    }
    .card {
        box-shadow:0 0 5px 0 rgba(0,0,0,0.15);
        border-radius: 2px;
        padding: 16px 40px;
    }
    .card-title {
        border-bottom: 1px solid #e6e6e6;
        margin: 0 -40px;
        padding: 0 40px 16px;
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
    import LeftMenu from './components/LeftMenu.vue';
    import DateSelect from './components/DateSelect.vue';
    export default{
        data() {
            return{
                msg:'hello vue'
            }
        },
        components:{
            LeftMenu,
            DateSelect
        }
    }
</script>
