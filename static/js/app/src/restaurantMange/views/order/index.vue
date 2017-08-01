/*
* @Author: lxj
* @Date:   2017-07-28 16:16:45
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-07-31 15:16:54
* @email: 783384903@qq.com
*/

<template>
    <div class="restContain">
        <div class="rest-order-left">
            
        </div>
        <div class="rest-order-right">
            <taday></taday>
        </div>
    </div>
</template>
<style scoped>
    .restContain{
        width: 1200px;
        margin:auto;
        display: flex;
    }
    .rest-order-left{
        width: 800px;
    }
    .rest-order-right{
        width: 400px;
    }
</style>
<script>
import taday from '../../components/tadayRestDate.vue';
export default {
    props: {
    },
    data() {
        return {
        };
    },
    conputed: {
    },
    methods: {
    },
    watch: {
    },
    components: {
        taday
    },
    create() {

    }

};
</script>
