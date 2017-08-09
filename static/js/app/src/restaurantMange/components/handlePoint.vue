<template>
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
                    <span>当前订单小票</span>
                    <span>{{restaurantOrderStat}}</span>
                    <span class="restaurant-point-btn" @click="saverHandlePoint">打印</span>
                </p>
                <p class="restaurant-point-subtitle">
                    请选择操作历史进行小票打印
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>操作历史</th>
                            <th>打印内容</th>
                            <th>操作时间</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in caterOrderOperation">
                            <td>{{item.operationName}}</td>
                            <td>{{item.printContent}}</td>
                            <td>{{item.operationTime}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .restaurant-point-popup {
        width: 500px;
        background: #fff;
        padding: 10px 0;
        .restaurant-point-header {
            line-height: 34px;
            padding: 0 10px;
            font-size: 14px;
            color: #ccc;
            .close-point {
                width: 34px;
                line-height:34px;
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

        }
    }
</style>
<script>
    import http from 'http';
    import util from 'util';
    import { mapState } from 'vuex';
    export default {
        props: {
            caterOrderId: Number
        },
        data() {
            return {
                restaurantOrderStat: 0,
                caterOrderOperation: [],
                operationId: 0
            };
        },
        computed: {
            ...mapState(['restId'])
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
                        console.log(2);
                        this.restaurantOrderStat = res.data.caterOrderStatus;
                        this.caterOrderOperation = res.data.list;
                    }
                });
            },
            saverHandlePoint() {
                this.$emit('openAutomaticPoint', this.operationId);
            },
            closeHandlePoint() {
                this.$emit('closeHandlePoint');
            }
        }
    };
</script>
