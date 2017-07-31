/*
* @Author: lxj
* @Date:   2017-07-31 13:58:30
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-07-31 14:21:17
* @email: 783384903@qq.com
*/

<template>
    <div class="rest-taday-contain">
        <div class="rest-taday-count">
            今日营业额
            <span class="rest-taday-num">￥3200.00</span>
        </div>
        <div class="rest-taday-otherDate">今日订单总数<span class="rest-taday-num">31</span></div>
        <div class="rest-taday-otherDate">今日到店人数<span class="rest-taday-num">48</span></div>
        <hr>
        <div class="rest-taday-title">
            新订单 
        </div>
            <div class="rest-taday-list">
                <div class="rest-taday-item">
                    <div><span>[前台下单]</span>  <span>桌号: 卡座1 </span> <span>人数: 2</span> <span class="rest-taday-tag">已预订</span></div>
                    <div>订单号：170554686654321321</div>
                </div>
            </div>
    </div>
</template>
<style scoped>
    .rest-taday-contain{
        border:black 1px solid;
        padding: 20px 10px;
        .rest-taday-count{
            width: 150px;
            font-size: 20px;
            .rest-taday-num{
                color:yellow;
            }
        }
        .rest-taday-otherDate{
            width: 150px;
            font-size: 18px;
            .rest-taday-num{
                color:blue;
            }
        }
        .rest-taday-title{
            font-size: 18px;
        }
        .rest-taday-list{
            .rest-taday-item{

            }
        }
    }
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
