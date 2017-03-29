<template>
    <div>
        <EntertainmentOrder :order='order' :showMoadl=false></EntertainmentOrder>
        <div class="content-item" v-if="order.enterItems">
            <p class="content-item-title"><span>项目详情</span></p>
            <div class="enterTableHead">
                <span class="enterTableid">
                    序号
                </span>
                <span class="enterTableState">
                    预定状态
                </span>
                <span class="enterTableGet">
                    取号情况
                </span>
                <span class="enterTableHis">
                    操作记录
                </span>
            </div>
            <div class="enterTableBody">
                <div class="enteritem" v-for='item in order.enterItems'>
                    <span class="enterTableid">
                    {{item.itemSequence}}
                </span>
                    <span class="enterTableState">
                    {{stateType[item.state]}}
                </span>
                    <span class="enterTableGet">
                    {{queueStateType[item.queueState + 1]}}
                </span>
                    <span class="enterTableHis">
                    <div class="info-icon">
                        <div class="info-content">
                            <p class="info-title">操作记录</p>
                            <div class="money-item" v-for='it in item.dateList'>
                                <span>{{type[it.dateStatus]}}:{{it.date}}</span>
                                <span class="enterDidName">{{it.name}}</span>
                            </div>
            </div>
        </div>
        </span>
    </div>
    </div>
    </div>
    </div>
</template>
<style scoped>
.enterDidName{
    max-width: 60px;
    display:block;
    white-space:nowrap; 
    overflow:hidden; 
    text-overflow:ellipsis;
}
.enterTableHead{
    padding-bottom: 10px;
}
.enteritem, .enterTableHead{
margin-bottom: 10px;
}
.enterTableHead {
    color: #999;
    border-bottom: 1px dotted #999;
}

.enterTableid {
    width: 50px;
    display: inline-block;
}

.enterTableState,
.enterTableGet {
    width: 190px;
    text-align: center;
    display: inline-block;
}

.enterTableHis {
    width: 110px;
    display: inline-block;
    text-align: center;
}
.enterTableHis .info-icon{
    display: inline-block;
}
</style>
<script>
import EntertainmentOrder from './EntertainmentOrder.vue'
export default {
    props: {
        order: {
            type: Object,
            default: undefined
        }
    },
    data() {
        return {
            type:['预定时间', '开始时间', '结束时间', '使用时间'],
            stateType:['已预订', '进行中', '已结束', '已取消'],
            queueStateType:['未排队', '排队中', '轮到', '离开排队', '过号顺延', '过号', '结束排队']
        }
    },
    components: {
        EntertainmentOrder
    }
}
</script>
