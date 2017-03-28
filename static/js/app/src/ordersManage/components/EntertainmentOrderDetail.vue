<template>
    <div>
        <entainment :order='order' :showMoadl=false></entainment>
        <div class="content-item" v-if="order.playItems.lenght">
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
                <div class="enteritem" v-for='item in order.playItems.enterItems'>
                    <span class="enterTableid">
                    {{item.itemSequence}}
                </span>
                    <span class="enterTableState">
                    {{item.state}}
                </span>
                    <span class="enterTableGet">
                    {{item.queueState}}
                </span>
                    <span class="enterTableHis">
                    <div class="info-icon">
                        <div class="enterTableHover">
                            <div class="enterTableHoverTitle">操作记录</div>
                            <div class="enterTableHoverItem" v-for='it in item.dateList'>{{type[it.dateStatus]}}:{{it.date}}<span class="enterTableHoverName">{{it.name}}</span></div>
            </div>
        </div>
        </span>
    </div>
    </div>
    </div>
    </div>
</template>
<style scoped>
.enterTableHoverTitle {
    text-align: center;
}

.enterTableHoverItem {
    margin-bottom: 10px
}

.enterTableHoverName {
    margin-left: 15px;
}

.enterTableHover {
    position: absolute;
    padding: 8px;
    color: #999;
    margin-bottom: 10px;
    bottom: 0;
    left: 16px;
    display: none;
}

.info-icon:hover .enterTableHover {
    display: block;
}

.enterTableHead {
    color: #999;
    border-bottom: 1px dotted #999;
}

.enterTableid {
    width: 50px;
}

.enterTableState,
.enterTableGet {
    width: 190px;
    text-align: center;
}

.enterTableHis {
    width: 110px;
}
</style>
<script>
import entainment from './entainmentOrder.vue'
export default {
    props: {
        order: {
            type: Array,
            default: []
        },
        showMoadl: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            type:['预定时间', '开始时间', '结束时间', '使用时间']
            list: this.order.
        }
    },
    components: {
        entainment
    }
}
}
</script>
