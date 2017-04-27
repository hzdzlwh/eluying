<template>
    <div>
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
                <div class="enteritem" v-for='(item, index) in order.enterItems'>
                    <span class="enterTableid">
                    #{{item.itemSequence}}
                    </span>
                    <span class="enterTableState">
                    {{stateType[item.state]}}
                    <span v-if='item.timer'>({{item.timer | gettime(item.state)}})</span>
                    </span>
                    <span class="enterTableGet">
                    {{ item.serialNum ? (item.serialNum + '(' + queueStateType[item.queueState + 1] + ')') : queueStateType[item.queueState + 1]}}
                    </span>
                    <span class="enterTableHis">
                    <div class="info-icon">
                        <div class="info-content">
                            <p class="info-title">操作记录</p>
                            <div class="money-item" v-for='it in item.dateList'>
                                <span>{{type[it.dateStatus]}}:{{it.date}}</span>
                    <span class="enterDidName" :title='it.name'>{{it.name}}</span>
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
    .enterDidName {
        max-width: 60px;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .enterTableHead {
        padding-bottom: 10px;
    }

    .enteritem,
    .enterTableHead {
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

    .enterTableHis .info-icon {
        display: inline-block;
    }
</style>
<script>
    import bus from '../../../common/eventBus';
    export default {
        props: {
            order: {
                type: Object,
                default: undefined
            }
        },
        data() {
            return {
                type: ['预定时间', '使用时间', '结束时间', '使用时间'],
                stateType: ['已预订', '进行中', '已结束', '已取消'],
                queueStateType: ['未排队', '排队中', '已轮到', '已取消', '过号顺延', '已过号', '已轮到']
            };
        },
        methods: {
            add(i) {
                this.order.enterItems[i].timer += 1000;
            },
            clear() {
                for (let i = window.inter.length - 1; i >= 0; i --) {
                    window.clearInterval(window.inter[i]);
                }
            }
        },
        filters: {
            gettime: function(value, type) {
                if (type === 1 || type === 2) {
                    const getNumSte = function(str, fill) {
                        const full = '00000' + str;
                        return full.slice(full.length - fill, full.length);
                    };
                    const ht = parseInt(value / (1000 * 60 * 60));
                    const mt = parseInt((value / (1000 * 60)) % 60);
                    const st = parseInt((value / 1000) % 60);
                    return getNumSte(ht, 2) + ':' + getNumSte(mt, 2) + ':' + getNumSte(st, 2);
                }
                return '';
            }
        },
        created() {
            bus.$on('onClose', this.clear);
        },
        mounted() {
            window.inter = [];
            for (let i = this.order.enterItems.length - 1; i >= 0; i --) {
                if (this.order.enterItems[i].state === 1) {
                    window.inter.push(window.setInterval(this.add, 1000, i));
                }
            }
        },
        beforeDestroy() {
            bus.$off('onClose', this.clear);
        }
    };
</script>
