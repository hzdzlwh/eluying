<template>
    <div>
        <p class="report-title">
            次日预离房间报表
        </p>
        <div class="report-select-top">
            <div class="date">日期 : <i>{{morrow}}</i></div>
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
        <div class="report-center-foot">
            <div style="float:left;">
                <span class="report-center-span">总房数 : <b> {{count}}</b></span>
            </div>
            <dd-pagination @currentchange="handlePageChange" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo"  class="report-center-pagination"/>
        </div>
    </div>
</template>
<style lang='scss' scoped>
</style>
<script>
    import { DdTable, DdPagination, DdDropdown, DdDropdownItem, DdSelect, DdOption, DdGroupOption } from 'dd-vue-component';
    import http from 'http';
    import { checkTypeAll } from '../../../../common/orderSystem/roomCheckType.js';
    import util from 'util';
    import { getRoomType, getZoneType, getCheckType, getOriginType } from '../mixin/selectType';
    import { collect } from '../mixin/collect';
    import pagination from '../mixin/pagination';
    export default {
        mixins: [getRoomType, getZoneType, getCheckType, getOriginType, collect, pagination],
        data() {
            return {
                morrow: undefined,
                vips: [],
                count: 0,
                col: [
                    {
                        title: '订单号',
                        dataIndex: 'orderNum',
                        width: 180
                    },
                    {
                        title: '区域',
                        dataIndex: 'zoneName',
                        width: 80
                    },
                    {
                        title: '房型',
                        dataIndex: 'roomName',
                        width: 80
                    },
                    {
                        title: '房号',
                        dataIndex: 'roomNum',
                        width: 80
                    },
                    {
                        title: '入住类型',
                        render: (h, row) => {
                            return <div> { checkTypeAll.find(function(el) {
                                return Number(el.id) === row.checkType;
                            }).name }
                            </div>;
                        },
                        width: 100
                    },
                    {
                        title: '总房费',
                        dataIndex: 'totalPrice',
                        width: 100
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
                        title: '客户来源',
                        dataIndex: 'origin',
                        width: 80
                    },
                    {
                        title: '到达时间',
                        dataIndex: 'checkInTime',
                        width: 120
                    },
                    {
                        title: '离开时间',
                        dataIndex: 'checkOutTime',
                        width: 120
                    }
                ]
            };
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
            }
        },
        beforeRouteEnter(to, from, next) {
            http.get('/stat/getCollection')
                .then(res => {
                    if (res.code === 1) {
                        next(vm => {
                            const collectList = res.data.list;
                            for (let i = 0; i < collectList.length; i ++) {
                                if (collectList[i] === 21) {
                                    vm.collectNum = 1;
                                    vm.collectName = '已收藏';
                                }
                            }
                        });
                    }
                });
        },
        created() {
            const today = new Date();
            const tomorrow = util.tomorrow(today);
            this.morrow = util.dateFormat(tomorrow);
            this.getData();
            this.getZoneType();
            this.getRoomType();
            this.getOrigin();
            this.collectStat();
        },
        methods: {
            collectUrl(num) {
                if (num === 0) {
                    http.get('/stat/addToCollect', { statValue: 21 }).then(res => {
                        this.collectNum = 1;
                        this.collectName = '已收藏';
                    });
                } else if (num === 1) {
                    http.get('/stat/removeFromCollection', { statValue: 21 }).then(res => {
                        this.collectNum = 0;
                        this.collectName = '加入收藏';
                        let removeIndex = null;
                        this.$router.options.routes[2].children[0].children.map((item, index) => {
                            if (item.meta.id === 21) {
                                removeIndex = index;
                            }
                        });
                        this.$router.options.routes[2].children[0].children.splice(removeIndex, 1);
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
                const originParam = {
                    pageNo: this.pageNo,
                    zoneId: this.zoneType.split('~')[1],
                    roomType: this.roomType.split('~')[1],
                    // checkType: this.checkType,
                    date: this.morrow,
                    discountRelatedId: this.userOriginType.split('~')[1] !== '-5' ? undefined : this.userOriginType.split('~')[0],
                    originId: this.userOriginType.split('~')[1]
                };
                if (this.checkType !== -1) {
                    originParam.checkType = this.checkType;
                };
                // 后台要求如果为空就不传
                for (const ob in originParam) {
                    if (originParam[ob] === undefined || originParam[ob] === '') {
                        delete originParam[ob];
                    }
                };
                const paramsObj = {
                    exportType: type,
                    reportType: 21,
                    params: JSON.stringify(originParam)
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            },
            getData() {
                const obj = {
                    pageNo: this.pageNo,
                    zoneId: this.zoneType.split('~')[1],
                    roomType: this.roomType.split('~')[1],
                    // checkType: this.checkType,
                    date: this.morrow,
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
                http.post('/stat/getDueoutStat', obj).then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.list || [];
                        this.count = res.data.count;
                        this.pages = Math.ceil(res.data.count / 30);
                    }
                });
            }
        }
    };
</script>
