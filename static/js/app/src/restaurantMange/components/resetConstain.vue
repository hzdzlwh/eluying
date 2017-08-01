/*
* @Author: lxj
* @Date:   2017-08-01 14:28:15
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-08-01 14:45:42
* @email: 783384903@qq.com
*/

<template>
    <div>
        <template v-if='type === "default"'>
            <div>区域一</div>
            <div>大圆桌4</div>
            <div><button class="dd-btn shopcart-live">开启</button><button class="dd-btn shopcart-live">预订</button></div>
        </template>
    </div>
</template>
<style>
    
</style>
<script>
export default {
    props: {
        type: {
            type: String,
            default: 'default'
        },
        resetDate: Object,
        resetId: Number,
        
    },
    data() {
        return {
        };
    },
    computed: {
    },
    methods: {
    },
    watch: {
    },
    components: {
    },
    created() {

    }

};
</script>