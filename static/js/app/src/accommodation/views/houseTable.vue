<template>
    <div style="display: flex;">
        <dayOrderLeft>
            <DateSelect slot="timePicker" :defaultDate="defaultStartDate" @change='changeDate' :width='185' :disabledDate='true' />
        </dayOrderLeft>
        <div class="content">
            <div class="table-container">
                <table border="1">
                    <thead>
                        <tr>
                            <th></th>
                            <th>
                                <div style="display: flex;justify-content: center;">
                                    <span>可售房</span>
                                    <div class="info-icon">
                                        <div class="info-detail">
                                            可售房=总房数-预抵-在住-保留房-维修房-停用房
                                        </div>
                                    </div>
                                </div>
                            </th>
                            <th>
                                <div style="display: flex;justify-content: center;">
                                    <span>可用房</span>
                                    <div class="info-icon">
                                        <div class="info-detail">
                                            可用房=总房数-在住-预离-保留房-维修房-停用房
                                        </div>
                                    </div>
                                </div>
                            </th>
                            <th>在住</th>
                            <th>预离</th>
                            <th>预抵</th>
                            <th>保留房</th>
                            <th>维修房</th>
                            <th>停用房</th>
                            <th>总房数</th>
                            <th>净房</th>
                            <th>脏房</th>
                            <th>
                                <div style="display: flex;justify-content: center;">
                                    <span>出租率</span>
                                    <div class="info-icon">
                                        <div class="info-detail">
                                            出租率=（在住+预离）/（总房间数-维修-停用）* 100
                                        </div>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in houseLists">
                            <td>{{item.typeName}}</td>
                            <td>{{item.salableCount}}</td>
                            <td>{{item.usableCount}}</td>
                            <td>{{item.liveCount}}</td>
                            <td>{{item.leavingCount}}</td>
                            <td>{{item.arrivingCount}}</td>
                            <td>{{item.reservedCount}}</td>
                            <td>{{item.repairingCount}}</td>
                            <td>{{item.disableCount}}</td>
                            <td>{{item.totalCount}}</td>
                            <td>{{item.clearCount}}</td>
                            <td>{{item.dirtyCount}}</td>
                            <td>{{item.lettingRate}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import dayOrderLeft from '../components/dayOrderLeft.vue';
    import DateSelect from '../components/DateSelect.vue';
    import http from '../../common/http';
    
    export default {
        data() {
            return {
                defaultStartDate: undefined,
                date: new Date(),
                houseLists: []
            };
        },
        created() {
        },
        components: {
            dayOrderLeft,
            DateSelect
        },
        methods: {
            changeDate(date) {
                this.date = date;
            },
            getLists() {
                http.get('/room/getDailyStat', { date: this.date }).then(res => {
                    if (res.code === 1) {
                        this.houseLists = res.data.list;
                    }
                });
            }
        },
        watch: {
            date(newval) {
                this.getLists();
            }
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .content{
        flex: 1;
        padding-top: 50px;
        .table-container{
            width: 1073px;
            padding: 30px 0 0 33px;
            table{
                width: 100%;
                border: 1px solid #e6e6e6;
                border-top: 8px solid #178ce6;
                thead{
                    background: #f1f8ff;
                    tr{
                        .info-icon{
                            position: relative;
                            cursor: pointer;
                            width: 16px;
                            height: 16px;
                            background: url("/static/image/modal/room_modal_info.png");
                            background-size: contain;
                            .info-detail{
                                display: none;
                                position: absolute;
                                width: 286px;
                                background: #fafafa;
                                top: -10px;
                                left: 20px;
                                height: 28px;
                                padding: 8px;
                                z-index: 999;
                            }
                            &:hover{
                                .info-detail{
                                    display: block;
                                }
                            }
                        }
                    }
                }
                tbody{
                    tr:nth-of-type(even){
                        background: #f7f7f7;
                    }
                }
                tr{
                    height: 46px;
                    th{
                        font-size: 12px;
                        color: #666666;
                        font-weight: bold;
                        text-align: center;
                    }
                    td{
                        font-size: 14px;
                        color: #666666;
                        text-align: center;
                    }

                }
            }
        }
    }
</style>
