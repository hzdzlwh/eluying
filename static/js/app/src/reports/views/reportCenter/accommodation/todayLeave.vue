<template>
    <div>
        <p  class="report-title">
            本日预离房间报表
        </p>
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
            <div :class="collectClass" @click="collectUrl(collectNum)">
                {{collectName}}
            </div>
        </div>
        <div style="overflow:auto;">
            <dd-table :columns="col" :data-source="vips" :bordered="true" style="margin:20px 0 10px;"></dd-table>
        </div>
        <div class="foot footfix">
            <div style="float:left">
                <p style="font-size:16px;"><small style='width:16px;'>总房数 : </small> {{count}}</p>
            </div>
            <dd-pagination @currentchange="handlePageChange" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" style="float:right;"/>
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
    import { checkTypeAll } from '../../../../common/orderSystem/roomCheckType.js';
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
                collectNum: 0,
                collectName: '加入收藏',
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
                        dataIndex: 'checkOutTime',
                        width: 120
                    }
                ],
                flag: true
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
                // date = this.today;
                if (this.flag) {
                    this.getData();
                }
            },
            userOriginType() {
                this.pageNo = 1;
                if (this.flag) {
                    this.getData();
                }
            },
            roomType() {
                this.pageNo = 1;
                if (this.flag) {
                    this.getData();
                }
            },
            pageNo() {
                if (this.flag) {
                    this.getData();
                }
            },
            zoneType() {
                this.pageNo = 1;
                if (this.flag) {
                    this.getData();
                }
            },
            checkType() {
                this.pageNo = 1;
                if (this.flag) {
                    this.getData();
                }
            }
        },
        created() {
            this.today = util.dateFormat(new Date());
            this.getData();
            this.getZoneType();
            this.getRoomType();
            this.getOrigin();
            this.getCollectStatus();
        },
        computed: {
            collectClass: function () {
                return {
                    'report-collect': true,
                    'report-collect-add': this.collectNum === 0,
                    'report-collect-dis': this.collectNum === 1
                }
            }
        },
        methods: {
            collectUrl(num) {
                if (num === 0) {
                    http.get('/stat/addToCollect',{statValue: 20}).then(res => {
                        this.collectNum = 1;
                        this.collectName = '已收藏';
                    });
                } else if (num === 1) {
                    http.get('/stat/removeFromCollection',{statValue: 20}).then(res => {
                        this.collectNum = 0;
                        this.collectName = '加入收藏';
                        let removeIndex = null;
                        this.$router.options.routes[2].children[0].children.map((item, index) => {
                            if (item.meta.id === 20) {
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
                const originParam = {
                    pageNo: this.pageNo,
                    zoneId: this.zoneType.split('~')[1],
                    roomType: this.roomType.split('~')[1],
                    // checkType: this.checkType,
                    date: this.today,
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
                    reportType: 20,
                    params: JSON.stringify(originParam)
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
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
                });
            },
            getOrigin() {
            // 获取全部客户来源渠道
                http.get('/user/getChannels', { type: 2, isAll: false })
                .then((res) => {
                    // 拼接originType 企业渠道：企业id~-5 会员-4～-4 自定义渠道 渠道id～渠道id
                    if (res.code === 1) {
                        const originsList = res.data.list;
                        const otherOrigins = [];
                        this.userOrigins = originsList;
                        originsList.forEach(origin => {
                            if (origin.id < 0) {
                                origin.originType = `${origin.id}~${origin.id}`;
                                this.userSelfOrigins.push(origin);
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
            getData() {
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
                http.post('/stat/getDueoutStat', obj).then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.list || [];
                        this.totalMany = res.data.orderTotalPrice;
                        this.count = res.data.count;
                        this.pages = Math.ceil(res.data.count / 30);
                    }
                    this.flag = true;
                });
            },
            getCollectStatus() {
                http.get('/stat/getCollection')
                    .then(res => {
                        if(res.code === 1) {
                            const collectList = res.data.list;
                            for(let i=0;i<collectList.length;i++){
                                if (collectList[i] === 20) {
                                    this.collectNum = 1;
                                    this.collectName = '已收藏';
                                }
                            }
                        }
                    })
            },
            handlePageChange(internalCurrentPage) {
                this.pageNo = internalCurrentPage;
                this.getData();
            }
        }
    };
</script>
