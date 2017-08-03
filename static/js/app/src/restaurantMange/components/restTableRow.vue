/*
* @Author: lxj
* @Date:   2017-08-03 16:46:18
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-08-03 16:47:03
* @email: 783384903@qq.com
*/

<template>
    <template v-for='item in restDate.data.itemsMap'>
                    <tr> <td><div><span class="rest-restDetail-dishname">{{item.dishName}}</span><span>送</span></div></td><td><div>x{{item.bookNum}}</div></td><td>{{item.price}}</td></tr>
                    <tr v-for='sub in item.subDishList' >
                        <td class="rest-restDetail-trchild">{{sub.dishName}}</td><td><div>x{{sub.bookNum}}</div></td><td></td>
                    </tr>
                </template> 
</template>
<style>
    
</style>
<script>
export default {
    props: {
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