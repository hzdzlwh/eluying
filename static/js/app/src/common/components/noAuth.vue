/*
* @Author: lxj
* @Date:   2017-04-24 13:57:52
* @Last Modified by:   lxj
* @Last Modified time: 2017-07-19 11:04:39
* @email: 783384903@qq.com
*/
<template>
    <div class="main">
        <img class="robot" src="http://static.dingdandao.com/CE9D872B-A001-4662-B7AE-71F2E1D409D4@1x.png" alt="robot"/>
        <div class="text" v-text="tips ? tips : getAuthTips">
        </div>
    </div>
</template>
<style>
    .main{
        width: 100%;
        height: 100%;
        text-align: center;
    }
    .robot{
        margin-top: 289px;;
    }
    .text{
        /*font-family:PingFangSC-Regular;*/
        font-size:18px;
        color:#4a90e2;
        text-align:center;
        width: 360px;
        line-height: 25px;
        margin: auto;
        margin-top: 30px;;
    }
</style>
<script>
    export default{
        props: {
            authName: {
                type: String,
                default: ''
            },

            tips: {
                type: String,
                default: ''
            }
        },

        data(){
            return{
            }
        },

        computed: {
            getAuthTips(){
                return `您还没有${this.authName}的权限,请找创建人或管理员申请权限。`;
            }
        }
    }
</script>
