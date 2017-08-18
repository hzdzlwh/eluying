<template>
    <div>
        <p class="report-title">
            当前在住客人报表
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
        <div class="report-center-foot">
            <div style="float:left;">
                <span class="report-center-span">总人数 : <b> {{personCount}}</b></span>
                <span class="report-center-span">总房数 : <b>{{roomCount}}</b></span>
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
    import util from 'util';
    import { getRoomType, getZoneType, getCheckType, getOriginType } from '../mixin/selectType';
    import { collect } from '../mixin/collect';
    import pagination from '../mixin/pagination';
    export default {
        mixins: [getRoomType, getZoneType, getCheckType, getOriginType, collect, pagination],
        data() {
            return {
                today: undefined,
                vips: [],
                personCount: 0,
                roomCount: 0,
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
                        dataIndex: 'checkType',
                        width: 80
                    },
                    {
                        title: '在住人',
                        dataIndex: 'residentName',
                        width: 80
                    },
                    {
                        title: '证件号',
                        dataIndex: 'idCardNum',
                        width: 140
                    },

                    {
                        title: '来源',
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
                        dataIndex: 'expectCheckOutTime',
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
        beforeRouteEnter(to, from, next) {
            http.get('/stat/getCollection').then(res => {
                if (res.code === 1) {
                    next(vm => {
                        const collectList = res.data.list;
                        for (let i = 0; i < collectList.length; i ++) {
                            if (collectList[i] === 302) {
                                vm.collectNum = 1;
                                vm.collectName = '已收藏';
                            }
                        }
                    });
                }
            });
        },
        created() {
            this.today = util.dateFormat(new Date());
            this.getData();
            this.getZoneType();
            this.getRoomType();
            this.getOrigin();
            this.collectStat();
        },
        watch: {
            date() {
                this.pageNo = 1;
                if (this.flag) {
                    this.getData();
                }
            }
        },
        methods: {
            collectUrl(num) {
                if (num === 0) {
                    this.collectNum = 1;
                    this.collectName = '已收藏';
                    http.get('/stat/addToCollect', { statValue: 302 });
                } else if (num === 1) {
                    http.get('/stat/removeFromCollection', { statValue: 302 }).then(res => {
                        this.collectNum = 0;
                        this.collectName = '加入收藏';
                        let removeIndex = null;
                        this.$router.options.routes[2].children[0].children.map((item, index) => {
                            if (item.meta.id === 302) {
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
                };
                const paramsObj = {
                    exportType: type,
                    reportType: 302,
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
                http.get('/stat/getCurrentResident', obj).then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.entityList;
                        this.personCount = res.data.totalResident;
                        this.roomCount = res.data.totalRoom;
                        this.pages = Math.ceil(res.data.total / 30);
                    }
                    this.flag = true;
                });
            }
        }
    };
</script>
