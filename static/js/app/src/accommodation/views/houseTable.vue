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
                            <th>可售房<div class="info-icon"></div></th>
                            <th>可用房<div class="info-icon"></div></th>
                            <th>在住</th>
                            <th>预离</th>
                            <th>预抵</th>
                            <th>保留房</th>
                            <th>维修房</th>
                            <th>停用房</th>
                            <th>总房数</th>
                            <th>净房</th>
                            <th>脏房</th>
                            <th>出租率<div class="info-icon"></div></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>标准间</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>100%</td>
                        </tr>
                        <tr>
                            <td>大床房</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>3</td>
                            <td>100%</td>
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
    export default {
        data() {
            return {
                defaultStartDate: undefined
            };
        },
        components: {
            dayOrderLeft,
            DateSelect
        },
        methods: {
            changeDate() {
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
