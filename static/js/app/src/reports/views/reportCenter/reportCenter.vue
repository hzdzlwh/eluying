<template>
    <div class="reports-container">
        <LeftMenu></LeftMenu>
        <div class="view-container">
            <div v-show="dataSelect">
                <DateSelect />
            </div>
            <router-view></router-view>
        </div>
        <OrderSystem></OrderSystem>
    </div>
</template>
<style lang="scss" scoped>
    @import "~dd-common-css/src/variables";
    .reports-container {
        padding-top: 89px;
        padding-left: 260px;
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
        width: 1200px;
    }
    @media screen and (min-width:1470px) {
        .view-container {
            width: 1000px;
            margin-left:0;
        }
    }
    @media screen and (min-width:980px) {
        .view-container {
            width:1200px;
            margin:0 auto;
        }
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
    #leftMenu-children{
        width:140px;
    }
</style>
<script>
    import LeftMenu from '../../components/LeftMenu.vue';
    import { OrderSystem } from '../../../common/orderSystem';
    import { list } from '../../collectList.js';
    import DateSelect from '../../components/DateSelect.vue';
    export default{
        data() {
            return {
                dataSelect: undefined
            }
        },
        components: {
            LeftMenu,
            OrderSystem,
            DateSelect
        },
        created() {
            this.getDataSelect();
        },
        watch: {
            $route() {
                this.getDataSelect();
            }
        },
        methods: {
            getDataSelect() {
                for (let i=0;i<list.length;i++) {
                    console.log(list[i].name,this.$route.meta.name);
                    if (list[i].name === this.$route.meta.name) {
                        this.dataSelect = true;
                        return;
                    } else {
                         this.dataSelect = false;
                    }
                    console.log(this.dataSelect);
                }
//                list.forEach(item => {
//                    this.dataSelect = undefined;
//                    console.log(item.name, this.$route.meta.name);
//                    if (item.name === this.$route.meta.name) {
//                        this.dataSelect = true;
//                    } else {
//                        this.dataSelect = false;
//                    }
//                    console.log(this.dataSelect);
//                })
            }
        }
    };
</script>
