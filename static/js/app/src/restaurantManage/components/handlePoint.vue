<template>
    <div>
        <div class="restaurant-point-shade">
            <div class="restaurant-point-popup">
                <div class="restaurant-point-header">
                    打印小票
                    <div class="close-point" @click="closeHandlePoint">
                        x
                    </div>
                </div>
                <div class="restaurant-point-container">
                    <p class="restaurant-point-title">
                        <span class="restaurant-point-current">当前订单小票: </span>
                        <span class="restaurant-current-status">{{restaurantOrderStat}}</span>
                        <span class="restaurant-point-btn" @click="oppenAutoPoint">打印</span>
                    </p>
                    <p class="restaurant-point-subtitle">
                        请选择操作历史进行小票打印
                    </p>
                    <div class="point-table-box">
                        <dd-table :columns="col" :data-source="vips" :bordered="true"></dd-table>
                    </div>
                </div>
            </div>
        </div>
        <automaticPoint v-if="automaticPoint" @closeAutomaticPoint="() => {this.automaticPoint = false;}" :caterOrderId="caterOrderId" :restId="restId" :operationId="operationId"/>
    </div>
</template>
<style lang="scss">
    .restaurant-point-btn {
        display: block;
        float: left;
        margin-left: 20px;
        width: 48px;
        line-height: 24px;
        border: 1px solid #178ce6;
        border-radius: 2px;
        text-align:center;
        color: #178ce6;
        cursor:pointer;
    }
</style>
<style lang="scss" scoped>
    .restaurant-point-popup {
        background:#fafafa;
        box-shadow:0 2px 4px 0 rgba(0,0,0,0.15);
        border-radius:2px;
        width:527px;
        padding: 22px 20px;
        border-top: 2px solid #178ce6;
        .restaurant-point-header {
            font-size:16px;
            color:#178ce6;
            line-height:16px;
            .close-point {
                width: 16px;
                line-height:16px;
                text-align:center;
                float: right;
                cursor: pointer;
                &:hover {
                    background: red;
                    color: #fff;
                }
            }
        }
        .restaurant-point-container {
            .restaurant-point-title {
                width: 100%;
                height: 44px;
                padding: 10px 0;
                .restaurant-point-current, .restaurant-current-status {
                    font-size:14px;
                    color:#666666;
                    line-height:24px;
                    float: left;
                }
                .restaurant-current-status {
                    margin-left: 10px;
                }
            }
            .restaurant-point-subtitle {
                font-size:14px;
                color:#666666;
                line-height:14px;
            }
            .point-table-box {
                margin-top: 20px;
                max-height: 400px;
                overflow: scroll;
                &::-webkit-scrollbar {
                    width: 0;
                }
            }
        }
    }
</style>
<script>
    import http from 'http';
    import util from 'util';
    import { DdTable } from 'dd-vue-component';
    import automaticPoint from './automaticPoint.vue';
    export default {
        props: {
            restId: Number,
            caterOrderId: Number
        },
        data() {
            return {
                restaurantOrderStat: '',
                vips: [],
                automaticPoint: false,
                operationId: Number,
                col: [
                    {
                        title: '操作历史',
                        dataIndex: 'operationName',
                        width: 80
                    },
                    {
                        title: '打印内容',
                        dataIndex: 'printContent',
                        width: 80
                    },
                    {
                        title: '操作时间',
                        dataIndex: 'time',
                        width: 80
                    },
                    {
                        title: '',
                        render: (h, row) => {
                            return <div class={'restaurant-point-btn'} onClick={() => this.oppenAutoPoint(row)}>打印</div>;
                        },
                        width: 80
                    }
                ]
            };
        },
        mounted() {
            if (this.restId !== 1) {
                this.getData();
            }
        },
        methods: {
            getData() {
                http.get('/printer/getCaterOrderOperationLogs', { caterOrderId: this.caterOrderId, restId: this.restId }).then(res => {
                    if (res.code === 1) {
                        if (res.data.caterOrderStatus === 0) {
                            this.restaurantOrderStat = '预订单';
                        } else if (res.data.caterOrderStatus === 2) {
                            this.restaurantOrderStat = '结账单';
                        } else if (res.data.caterOrderStatus === 1 || res.data.caterOrderStatus === 8) {
                            this.restaurantOrderStat = '点菜单';
                        }
                        const list = res.data.list;
                        list.forEach(item => {
                            item.time = util.dateFormatLong(new Date(item.operationTime));
                            this.vips.push(item);
                        });
                    }
                });
            },
            oppenAutoPoint(row) {
                this.operationId = row.operationId || -1;
                this.automaticPoint = true;
            },
            closeHandlePoint() {
                this.$emit('closeHandlePoint');
            }
        },
        components: {
            DdTable,
            automaticPoint
        }
    };
</script>
