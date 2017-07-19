<template>
    <div>
        <h2 class="title">{{$route.meta.name}}</h2>
        <div class="top">
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
        </div>
        <dd-table :columns="col" :data-source="vips" :bordered="true" id="table"></dd-table>
        <div class="foot footfix">
            <p style="font-size:16px;"><small style='width:16px;'>总房数 : </small> {{count}}</p>
            <p style="font-size:16px;"><small style="width:16px;">当日房费合计 : </small></p>
            <dd-pagination @currentchange="handlePageChange" :visible-pager-count="6" :show-one-page="false" :age-count="pages" :current-page="pageNo" />
        </div>
    </div>
</template>
<style lang='scss' scoped>
    .title {
        width: 100%;
        line-height: 56px;
        font-size: 1.5em;
        color: #746D66;
        text-align: center;
        font-family: border;
    }
    .top {
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
    #table {
        margin-top: 20px;
        max-height: 400px;
        padding-bottom: 12px;
    }
</style>
<script>
    import { DdTable, DdPagination, DdDropdown, DdDropdownItem, DdSelect, DdOption, DdGroupOption } from 'dd-vue-component';
    import http from 'http';
    import util from 'util';
    import ZoneType from '../common/zoneType.vue';
    export default {
        data() {
            return {
                today: undefined,
                zoneType: '-1~',
                zoneTypeOther: [],
                zoneTypeAll: [{
                    id: -1,
                    name: '全部区域',
                    zoneType: '-1~'
                }],
                roomType: '-1~',
                roomTypeOther: [],
                roomTypeAll: [{
                    id: -1,
                    name: '全部房型',
                    roomType: '-1~'
                }],
                checkTypeAll: [{
                    id: -1,
                    name: '全部入住类型',
                    checkType: -1
                }, {
                    id: 0,
                    name: '正常入住',
                    checkType: 0
                }, {
                    id: 2,
                    name: '自用房',
                    checkType: 2
                }, {
                    id: 3,
                    name: '免费房',
                    checkType: 3
                }, {
                    id: 1,
                    name: '钟点房',
                    checkType: 1
                }],
                checkType: -1,
                userOriginType: '-2~',
                userOrigins: [],
                userSelfOrigins: [{
                    id: '',
                    name: '全部客源渠道',
                    originType: '-2~',
                    type: 2
                }],
                userGroupOrigins: [],
                vips: [],
                vip: {},
                pages: 0,
                count: 0,
                pageNo: 1,
                col: [
                    {
                        title: '订单号',
                        dataIndex: 'serialNum',
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
                        dataIndex: 'roomNo',
                        width: 80
                    },
                    {
                        title: '入住类型',
                        dataIndex: 'checkInType',
                        width: 100
                    },
                    {
                        title: '当日房费',
                        dataIndex: 'price',
                        width: 80
                    },
                    {
                        title: '总房费',
                        dataIndex: 'tatalPrice',
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
                        title: '客源渠道',
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
                ],
                flag: true
            };
        },
        components: {
            ZoneType,
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
              // const date = this.today;
                if (this.flag) {
                    this.fetchDate();
                }
            },
            userOriginType() {
                this.pageNo = 1;
                if (this.flag) {
                    this.fetchDate();
                }
            },
            roomType() {
                this.pageNo = 1;
                if (this.flag) {
                    this.fetchDate();
                }
            },
            pageNo() {
                if (this.flag) {
                    this.fetchDate();
                }
            },
            zoneType() {
                this.pageNo = 1;
                if (this.flag) {
                    this.fetchDate();
                }
            },
            checkType() {
                this.pageNo = 1;
                if (this.flag) {
                    this.fetchDate();
                }
            }
        },
        created() {
            this.today = util.dateFormat(new Date());
            this.getData();
            this.getZoneType();
            this.getRoomType();
            this.getOrigin();
        },
        methods: {
            exportUrl(type) {
                const originParam = {
                    date: this.today
                };
                const paramsObj = {
                    exportType: type,
                    reportType: 18,
                    params: JSON.stringify(originParam)
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            },
            getData() {
                http.get('/stat/getCurrentCheckedInRoom', { date: this.today })
                .then(res => {
                    if (res.code === 1) {
                        window.console.log(res);
                        this.vips = res.data.entityList;
                        this.count = res.data.total;
                        this.pages = Math.ceil(res.data.orderAmount / 30);
                    }
                    this.flag = true;
                });
            },
            getZoneType() {
                http.get('/room/getZoneList')
                .then(res => {
                    if (res.code === 1) {
                        const zoneList = res.data.list;
                        this.zoneTypeOther = zoneList;
                        zoneList.forEach(zone => {
                            zone.id = zone.zoneId;
                            zone.name = zone.zoneName;
                            zone.zoneType = `-1~${zone.zoneId}`;
                            this.zoneTypeAll.push(zone);
                        });
                    }
                });
            },
            getRoomType() {
                http.get('/room/getRoomCategories')
                .then(res => {
                    if (res.code === 1) {
                        const roomList = res.data.list;
                        this.roomTypeOther = roomList;
                        roomList.forEach(room => {
                            room.id = room.cId;
                            room.name = room.cName;
                            room.roomType = `-1~${room.cId}`;
                            this.roomTypeAll.push(room);
                        });
                    }
                    console.log(this.roomTypeAll);
                });
            },
            getOrigin() {
            // 获取全部客户来源渠道
                http.get('/user/getChannels', { type: 2, isAll: true })
                      .then((res) => {
                          // 拼接originType 企业渠道：企业id~-5 会员-4～-4 自定义渠道 渠道id～渠道id
                          if (res.code === 1) {
                              const originsList = res.data.list;
                              const otherOrigins = [];
                              this.userOrigins = originsList;
                              originsList.forEach(origin => {
                                  if (origin.id === -1 || origin.id === -4) {
                                      origin.originType = `${origin.id}~${origin.id}`;
                                      this.userSelfOrigins.push(origin);
                                  } else if (origin.id === -5) {
                                      origin.companyList.forEach(company => {
                                          const companyName = `企业名称:${company.companyName}(${company.companyType ? '  可挂帐' : '不可挂帐'})`;
                                          const number = `企业编号:${company.contractNum || ''}`;
                                          const name = `联系人:${company.contactName || ''}`;
                                          const phone = `联系人电话:${company.contactPhone || ''}`;
                                          company.name = company.companyName;
                                          company.originType = `${company.id}~${origin.id}`;
                                          company.info = `${companyName}\n${number}\n${name}\n${phone}`;
                                      });
                                      this.userGroupOrigins.push({ label: '企业', origins: origin.companyList });
                                  } else if (origin.id > 0) {
                                      origin.originType = `${origin.id}~${origin.id}`;
                                      origin.info = origin.name;
                                      otherOrigins.push(origin);
                                  }
                              });
                              this.userGroupOrigins.push({ label: '其他', origins: otherOrigins });
                              // this.userOriginType = this.userSelfOrigins[0].originType;
                          }
                      });
            },
            fetchDate() {
                const obj = {
                    pageNo: this.pageNo,
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
                        window.console.log(res);
                        this.vips = res.data.entityList || [];
                        this.totalMany = res.data.orderTotalPrice;
                        this.count = res.data.total;
                        this.pages = Math.ceil(res.data.orderAmount / 30);
                        // if (keyword) {
                        //     this.originId = -2;
                        //     this.endTime = undefined;
                        //     this.pageNo = 1;
                        //     this.searchPattern = undefined;
                        //     this.startTime = undefined;
                        //     this.state = -1;
                        //     this.timeType = 1;
                        //     $("#search").val('');
                        // }
                    }
                    this.flag = true;
                });
            },
            handlePageChange(internalCurrentPage) {
                this.pageNo = internalCurrentPage;
                this.fetchDate();
            }
        }
    };
</script>
