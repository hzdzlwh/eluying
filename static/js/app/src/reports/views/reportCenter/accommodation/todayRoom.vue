<template>
    <div>
        <p class="report-title">
            当前在住房间报表
        </p>
        <div class="report-select-top">
            <div class="date">日期 : <i>{{today}}</i></div>
            <div class="select-box">
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="zoneType" >
                        <dd-option :key="item.id" v-for="item in zoneTypeAll" :value="item.zoneType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 120px;" class="fr room" >
                    <dd-select v-model="roomType" >
                        <dd-option :key="item.id" v-for="item in roomTypeAll" :value="item.roomType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 140px;" class="fr check" >
                    <dd-select v-model="checkType" >
                        <dd-option :key="item.id" v-for="item in checkTypeAll" :value="item.checkType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width:140px;" class="select-component-container fr">
                    <dd-select v-model="userOriginType" >
                        <dd-option  :key="origin.originType" v-for="origin in userSelfOrigins"
                            :value="origin.originType" :label="origin.name">
                            <span :title="origin.name">{{origin.name}}</span>
                        </dd-option>
                        <dd-group-option  v-for="item in userGroupOrigins" :label="item.label"
                            :key="item" v-if="item.origins.length > 0">
                            <dd-option  v-for="origin in item.origins" :key="origin.originType"
                                :value="origin.originType" :label="origin.type && origin.type === 2 ? origin.name : `企业(${origin.name})`">
                                <div class="user-group-origin">
                                    <span class="user-group-company" :title="origin.name">
                                        {{ origin.name }}
                                    </span>
                                    <span class="user-group-img" v-if="!origin.type" :title="origin.info"></span>
                                </div>
                            </dd-option>
                        </dd-group-option>
                    </dd-select>
                </div>
            </div>
            <div class="export">
                <dd-dropdown text="导出明细" trigger="click" style="width:100px;">
                    <!-- <dd-dropdown-item><span><a :href="exportUrl(1)">导出PDF</a></span></dd-dropdown-item> -->
                    <dd-dropdown-item><span><a :href="exportUrl(0)">导出Excel</a></span></dd-dropdown-item>
                </dd-dropdown>
            </div>
            <div :class="collectClass" @click="collectUrl(collectNum)">
                {{collectName}}
            </div>
        </div>
        <dd-table :columns="col" :data-source="vips" :bordered="true" style="margin:20px 0 10px;"></dd-table>
        <div class="foot footfix">
            <div style="float:left;">
                <p style="font-size:16px;"><small style='width:16px;'>总房数 : </small> {{roomCount}}</p>
                <p style="font-size:16px;"><small style="width:16px;">当日房费合计 : </small>{{freeCount}}</p>
            </div>
            <dd-pagination @currentchange="handlePageChange" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" style="float:right;margin-top:20px;"/>
        </div>
    </div>
</template>
<style lang="scss">
    .report-title {
        font-family: border;
        font-weight: bold;
        font-size:24px;
        color:#178ce6;
        text-align:center;
        margin: 20px 0 26px;
    }
    @media screen and (min-width:980px) {
        .report-title {
            width:calc(100vw - 250px);
        }
    }
    @media screen and (min-width:1470px) {
        .report-title {
            width: 1200px;
        }
    }
    .report-collect {
        float: left;
        margin-left:20px;
        height: 24px;
        width: 100px;
        border-radius:2px;
        text-align: center;
        line-height:24px;
        cursor: pointer;
        font-family:MicrosoftYaHei;
        font-size:14px;
        color:#ffffff;
        text-align:center;
    }
    .report-collect-add {
        background:#178ce6;
    }
    .report-collect-dis {
        background:#f39c30;
    }
    .report-select-top {
        width: 100%;
        height: 32px;
        padding: 5px 0;
        .date {
            float: left;
            line-height: 25.44px;
        }
        .select-box {
            float: left;
            .fr {
                float: left;
                margin-left: 20px;
            }
        }
        .export {
            float: left;
            margin-left:20px;
        }
    }
</style>
<style lang='scss' scoped>
</style>
<script>
    import { DdTable, DdPagination, DdDropdown, DdDropdownItem, DdSelect, DdOption, DdGroupOption } from 'dd-vue-component';
    import http from 'http';
    import util from 'util';
    import { getRoomType, getZoneType, getCheckType, getOriginType } from '../mixin/selectType';
    import { collect } from '../mixin/collect';
    import pagination from '../mixin/pagination';
    export default {
        mixins: [getRoomType, getZoneType, getCheckType, getOriginType, collect, pagination ],
        data() {
            return {
                today: undefined,
                vips: [],
                roomCount: 0,
                freeCount: 0,
                col: [
                    {
                        title: '订单号',
                        dataIndex: 'serialNum',
                        width: 160
                    },
                    {
                        title: '区域',
                        dataIndex: 'zoneName',
                        width: 100
                    },
                    {
                        title: '房型',
                        dataIndex: 'roomName',
                        width: 80
                    },
                    {
                        title: '房号',
                        dataIndex: 'roomNo',
                        width: 60
                    },
                    {
                        title: '入住类型',
                        dataIndex: 'checkInType',
                        width: 80
                    },
                    {
                        title: '当日房费',
                        dataIndex: 'price',
                        width: 80
                    },
                    {
                        title: '总房费',
                        dataIndex: 'totalPrice',
                        width: 80
                    },
                    {
                        title: '联系人',
                        dataIndex: 'customerName',
                        width: 80
                    },
                    {
                        title: '手机号',
                        dataIndex: 'customerPhone',
                        width: 120
                    },
                    {
                        title: '客源渠道',
                        dataIndex: 'origin',
                        width: 60
                    },
                    {
                        title: '到达时间',
                        dataIndex: 'checkInTime',
                        width: 120
                    },
                    {
                        title: '离开时间',
                        dataIndex: 'expectCheckOutTime',
                        width: 120
                    }
                ]
            };
        },
        beforeRouteEnter(to, from, next) {
            http.get('/stat/getCollection').then(res => {
                if (res.code === 1) {
                    next(vm => {
                        const collectList = res.data.list;
                        for(let i=0;i<collectList.length;i++){
                            if (collectList[i] === 301) {
                                vm.collectNum = 1;
                                vm.collectName = '已收藏';
                            }
                        }
                    })
                }
            });
        },
        components: {
            DdTable,
            DdPagination,
            DdDropdown,
            DdDropdownItem,
            DdSelect,
            DdOption,
            DdGroupOption
        },
        watch: {
            date() {
                this.getData();
            },
            '$toute': 'beforeRouteEnter'
        },
        created() {
            this.today = util.dateFormat(new Date());
            this.getData();
            this.getZoneType();
            this.getRoomType();
            this.getOrigin();
            this.collectStat();
        },
        methods: {
            collectUrl(num) {
                if (num === 0) {
                    http.get('/stat/addToCollect',{statValue: 301}).then(res => {
                        this.collectNum = 1;
                        this.collectName = '已收藏';
                    });
                } else if (num === 1) {
                    http.get('/stat/removeFromCollection',{statValue: 301}).then(res => {
                        this.collectNum = 0;
                        this.collectName = '加入收藏';
                        let removeIndex = null;
                        this.$router.options.routes[2].children[0].children.map((item, index) => {
                            if (item.meta.id === 301) {
                                removeIndex = index;
                            }
                        });
                        this.$router.options.routes[2].children[0].children.splice(removeIndex , 1);
                        if (this.$router.options.routes[2].children[0].children.length > 1) {
                            if (this.$route.params.id) {
                                this.$router.push('/reportCenter/collect/' + this.$router.options.routes[2].children[0].children[1].meta.id);
                            }
                        } else {
                            if (this.$route.params.id) {
                                this.$router.push('/reportCenter/collect/');
                            }
                        }
                    });
                }
            },
            exportUrl(type) {
                const obj = {
                    pageNum: this.pageNo,
                    zoneId: this.zoneType.split('~')[1],
                    roomType: this.roomType.split('~')[1],
                    // checkType: this.checkType,
                    date: this.today,
                    discountRelatedId: this.userOriginType.split('~')[1] !== '-5' ? undefined : this.userOriginType.split('~')[0],
                    originId: this.userOriginType.split('~')[1]
                };
                if (this.checkType !== -1) {
                    obj.checkType = this.checkType;
                }
                 // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                const paramsObj = {
                    exportType: type,
                    reportType: 301,
                    params: JSON.stringify(obj)
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            },
            getData() {
                const obj = {
                    pageNum: this.pageNo,
                    zoneId: this.zoneType.split('~')[1],
                    roomType: this.roomType.split('~')[1],
                    // checkType: this.checkType,
                    date: this.today,
                    discountRelatedId: this.userOriginType.split('~')[1] !== '-5' ? undefined : this.userOriginType.split('~')[0],
                    originId: this.userOriginType.split('~')[1]
                };
                if (this.checkType !== -1) {
                    obj.checkType = this.checkType;
                }
                 // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                http.get('/stat/getCurrentCheckedInRoom', obj).then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.entityList || [];
                        this.totalMany = res.data.orderTotalPrice;
                        this.roomCount = res.data.totalRoom;
                        this.freeCount = res.data.totalFee;
                        this.pages = Math.ceil(res.data.total / 30);
                    }
                });
            },
        }
    };
</script>
