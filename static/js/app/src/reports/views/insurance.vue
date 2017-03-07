<template>
    <div style="top: 33px;position: relative;">
        <div style="margin: 20px 0 10px;display: flex;justify-content: space-between;">
            <div style="display: flex">
                <span>保单记录<i>（{{date.startDate}}~{{date.endDate}}）</i></span>
            </div>
            <a :href="exportUrl()" download><button class="dd-btn dd-btn-primary">导出Excel</button></a>
        </div>
        <dd-Table :columns="columns" :data-source="dataSource" :bordered="true"></dd-Table>
        <div style="display: flex;justify-content: space-between;margin-top: 20px">
            <span>共计{{num}}条保单记录 保费¥ {{totalPrice}}</span>
            <dd-pagination @currentchange="query" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="page" />
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex';
    import { DdTable, DdPagination } from 'dd-vue-component';
    import AJAXService from '../../common/AJAXService';
    import util from '../../common/util';
    const sexMap = {
        '1': '男',
        '2': '女'
    };
    const fieldAVMap = {
        '0': '中国',
        '1': '外籍'
    };
    const cidTypeMap = {
        '1': '居民身份证',
        '2': '护照',
        '3': '军人证',
        '4': '驾驶证',
        '5': '港澳台同胞证'
    };
    const relatedMap = {
        '20': '儿子',
        '30': '女儿',
        '99': '成人'
    };
    export default{
        computed: {
            ...mapState(['date'])
        },
        watch: {
            date() {
                this.page = 1;
                this.query();
            }
        },
        created() {
            this.query();
        },
        components: {
            DdTable,
            DdPagination,
        },
        data() {
            return {
                page: 1,
                columns: [
                    {
                        title: '订单号／创建时间',
                        render: (h, row) => (<span><span>{row.serialNum}</span><br /><small><i>{row.date}</i></small></span>),
                        width: 188
                    },
                    {
                        title: '保单号',
                        dataIndex: 'proposalNo',
                        width: 103
                    },
                    {
                        title: '被保险人姓名',
                        dataIndex: 'insurantsName',
                        width: 115
                    },
                    {
                        title: '性别',
                        render: (h, row) => (<span>{sexMap[row.insurantsSex]}</span>),
                        width: 139
                    },
                    {
                        title: '年龄',
                        dataIndex: 'insurantsAge',
                        width: 103
                    },
                    {
                        title: '出生日期',
                        dataIndex: 'insurantsBirthday',
                        width: 91
                    },
                    {
                        title: '国籍',
                        render: (h, row) => (<span>{fieldAVMap[row.fieldAV]}</span>),
                        width: 122
                    },
                    {
                        title: '证件类型',
                        dataIndex: 'insurantsCidType',
                        render: (h, row) => (<span>{cidTypeMap[row.insurantsCidType]}</span>),
                        width: 122
                    },
                    {
                        title: '证件号',
                        dataIndex: 'insurantsCidNumber',
                        width: 191
                    },
                    {
                        title: '手机号码',
                        dataIndex: 'insurantsMobile',
                        width: 191
                    },
                    {
                        title: '电子邮箱',
                        dataIndex: 'insurantsEmail',
                        width: 191
                    },
                    {
                        title: '起保日期',
                        dataIndex: 'startDate',
                        width: 191
                    },
                    {
                        title: '终保日期',
                        dataIndex: 'endDate',
                        width: 191
                    },
                    {
                        title: '与投保人关系',
                        dataIndex: 'related',
                        render: (h, row) => (<span>{relatedMap[row.related]}</span>),
                        width: 191
                    },
                    {
                        title: '投保人姓名',
                        dataIndex: 'holderName',
                        width: 191
                    },
                    {
                        title: '性别',
                        render: (h, row) => (<span>{sexMap[row.insurantsHolderSex]}</span>),
                        width: 191
                    },
                    {
                        title: '出生日期',
                        dataIndex: 'holderBirthday',
                        width: 191
                    },
                    {
                        title: '证件类型',
                        render: (h, row) => (<span>{cidTypeMap[row.holderCidType]}</span>),
                        width: 191
                    },
                    {
                        title: '证件号',
                        dataIndex: 'holderCidNumber',
                        width: 191
                    },
                    {
                        title: '手机号码',
                        dataIndex: 'holderMobile',
                        width: 191
                    }
                ],
                dataSource: [],
                num: undefined,
                totalPrice: undefined,
                pages: undefined
            }
        },
        methods: {
            query(page) {
                if (!this.date.startDate) {
                    return false;
                }

                this.page = page ? page : this.page;

                AJAXService.ajaxWithToken('get', '/order/listInsurancePC', {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate,
                    page: this.page,
                    size: 30
                })
                    .then(res => {
                        if (res.code === 1) {
                            this.dataSource = res.data.list;
                            this.num = res.data.count;
                            this.totalPrice = res.data.totalPremium;
                            this.pages = Math.ceil(res.data.num / 30);
                        }
                    });
            },
            exportUrl() {
                if (!this.date.startDate) {
                    return false;
                }
                const paramsObj = {
                    startDate: this.date.startDate,
                    endDate: this.date.endDate
                };
                const host = AJAXService.getUrl2('/order/xlsInsurance');
                const pa = AJAXService.getDataWithToken(paramsObj);
                const params = AJAXService.paramsToString(pa);
                return `${host}?${params}`;
            }
        }
    }
</script>
