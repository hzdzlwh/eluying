/*
* @Author: lxj
* @Date:   2017-07-28 16:16:58
* @Last Modified by:   linxinjian
* @Last Modified time: 2017-07-28 16:16:58
* @email: 783384903@qq.com
*/

<template>
    <div class="roomsManage-mainContainer">
        <div class="ordersFilter">
            <ul class="restaurant-head-nav">
                <li v-for='item in tagList' :class='item.id === tag ? "active":""' @click='changeTag(item.id)'>{{item.name}}</li>
            </ul>
            <div class="search">
                <input type="text" class="dd-input" id='search' placeholder="房号/客户姓名/入住人/手机号/订单号" @keyup.enter="search" ref="searchInput">
                <img class="search-icon" @click="search" src="//static.dingdandao.com/vipSearch.png">
            </div>
        </div>
        <div class="detail-content-filter">
            <div>用餐时间</div>
            <div style="margin-left:5px;">
                <dd-datepicker placeholder="开始时间" v-model="startTime" :disabled-date="disableStartDate"/>
                <span style="color:#999;font-size:14px;">～</span>
                <dd-datepicker placeholder="结束时间" v-model="endTime" :disabled-date="disableEndDate" />
            </div>
            <div class="add-button fr">
                <div class="dd-dropdown">
                    <DdDropdown text="导出明细" trigger="click">
                        <dd-dropdown-item>
                            <span><a :href="outPutText(2)" download>导出PDF</a></span>
                        </dd-dropdown-item>
                        <dd-dropdown-item>
                            <span><a :href="outPutText(1)" download>导出Excel</a></span>
                        </dd-dropdown-item>
                    </DdDropdown>
                </div>
            </div>
            <div class="select-component-container fr">
                <dd-select v-model="userOriginType" >
                    <dd-option :key="origin.originType" v-for="origin in userSelfOrigins"
                               :value="origin.originType" :label="origin.name">
                        <span :title="origin.name">{{origin.name}}</span>
                    </dd-option>
                    <dd-group-option v-for="item in userGroupOrigins" :label="item.label"
                                     :key="item" v-if="item.origins.length > 0">
                        <dd-option v-for="origin in item.origins" :key="origin.originType"
                                   :value="origin.originType" :label="origin.type && origin.type === 2 ? origin.name : `企业(${origin.name})`">
                            <div class="user-group-origin">
                                <span class="user-group-company" :title="origin.name">
                                    {{ origin.name }}
                                </span>
                                <span class="user-group-img" v-if="!origin.type"
                                      :title="origin.info"></span>
                            </div>
                        </dd-option>
                    </dd-group-option>
                </dd-select>
            </div>
            <div style="margin-right:20px;width: 120px;" class="fr" >
                <dd-select v-model="channelPerson" >
                    <dd-option :key="item.id" v-for="item in channelPersonAll" :value="item.id" :label="item.name"></dd-option>
                </dd-select>
            </div>
            <div style="margin-right:20px;width: 120px;" class="fr" >
            <dd-select v-model="channelType" >
                <dd-option :key="item.id" v-for="item in channelTypeAll" :value="item.id" :label="item.name"></dd-option>
            </dd-select>
        </div>
            <div style="margin-right:20px;width: 120px;" class="fr">
                <dd-select v-model="state" >
                    <dd-option :key="item.id" v-for="item in stateList" :value="item.id" :label="item.name"></dd-option>
                </dd-select>
            </div>
        </div>
        <dd-table :columns="col" :data-source="vips" style='padding-bottom:45px;' id='roomsOrderTable'></dd-table>
        <div class="foot footfix">
            <span><small>共计</small> {{total}}个订单<span style="padding: 0 30px;color:#e6e6e6;font-size:15px;">|</span>
            <span> <small>应收金额</small> ¥{{totalPrice}} </span><span style="padding: 0 30px;color:#e6e6e6;font-size:15px;">|</span>
            <span> <small>实收金额</small> ¥{{payment}} </span></span>
            <dd-pagination @currentchange="handlePageChange" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
        </div>
    </div>
</template>
<style>
    .detail-content-filter .dd-select-menu {
        overflow-y: auto;
        max-height: 120px;
    }
    #roomsOrderTable .dd-table tbody tr {
        cursor: pointer;
    }
    .fontRed{
        color:red;
    }
</style>
<style lang="scss" scoped>

    .foot small{
        color:#999;

    }
    .footfix{
        position: fixed;
        bottom: 0;
        width: 1129px;
    }
    .roomsManage-mainContainer{
        width: 1129px;
        margin: 0 auto;
        position: relative;
        top: 64px;
    }
    .select-component-container{
        width:120px;
        margin-right:20px;
    }
    .detail-content-filter {
        margin-top: 20px;
        margin-bottom: 20px;
        position: relative;
        z-index: 1;
    }
    .detail-content-filter .fr {
        float:right
    }
    .restaurant-head-nav .active {
        background-color: #178ce6;
        color: #ffffff;
    }
    .detail-content-filter > div {
        display: inline-block;
    }
    .detail-content-filter .dd-datepicker {
        width:150px;
    }
    .restaurant-head-nav {
        border-right: none;
    }

    .restaurant-head-nav li {
        border-right: 1px solid #178ce6;
        cursor: pointer;
    }

    .foot {
        margin-top: 10px;
        background: #fafafa;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.15);
        height: 45px;
        padding: 0 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .search {
        width: 280px;
        position: absolute;
        top: 0;
        right: 0;
    }

    .search-icon {
        position: absolute;
        right: 8px;
        top: 6px;
    }

    .vip-detail-container {
        display: flex;
        .vip-detail-row {
            margin-bottom: 24px;
            display: flex;
        }
        .vip-detail-filed {
            text-align: right;
            width: 56px;
            margin-right: 9px;
            display: inline-block;
        }
        .vip-leavelUpgrade-tip {
            position: absolute;
            display: none;
            width: 200px;
            background: #fafafa;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
            border-radius: 2px;
            z-index: 10;
            div:first-child {
                padding: 8px 16px;
                color: #666666;
                font-size: 16px;
                border-bottom: 1px solid #e6e6e6;
            }
            div:last-child {
                padding: 8px 16px;
                font-size: 14px;
                color: #999999;
            }
            .discount-item {
                padding: 8px 16px;
                font-size: 14px;
                color: #999999;
                display: flex;
                justify-content: space-between;
            }
        }
        .tip-img-container {
            position: relative;
            margin-left: 9px;
            &:hover {
                .vip-leavelUpgrade-tip {
                    display: block;
                }
            }
        }
    }
</style>
<script type="text/babel">
    import {
        DdTable,
        DdPagination,
        DdSelect,
        DdOption,
        DdDropdown,
        DdDropdownItem,
        DdDatepicker,
        DdGroupOption
    }
        from 'dd-vue-component';
    import http from '../../../common/http';
    import eventbus from '../../../common/eventBus';
    export
    default {
        data() {
            return {
                tagList: [
                    {
                        id: 0,
                        name: '全部'
                    },
                    {
                        id: 1,
                        name: '即将入住'
                    },
                    {
                        id: 2,
                        name: '即将退房'
                    },
                    {
                        id: 3,
                        name: '今日新办'
                    }
                ],
                tag: 0,
                stateList: [
                    {
                        id: -1,
                        name: '全部订单状态'
                    },
                    {
                        id: 0,
                        name: '待处理'
                    },
                    {
                        id: 1,
                        name: '已拒绝'
                    },
                    {
                        id: 4,
                        name: '已取消 '
                    }
                ],
                state: -1,
                userOriginType: '-2~',
                userOrigins: [],
                userSelfOrigins: [{
                    id: '',
                    name: '全部客户来源',
                    originType: '-2~',
                    type: 2
                }],
                userGroupOrigins: [],
                channelTypeAll: [
                    {
                        id: -1,
                        name: '全部收银方式'
                    }
                ],
                channelType: -1,
                channelPersonAll: [
                    {
                        id: -1,
                        name: '全部收银员'
                    }
                ],
                channelPerson: -1,
                vips: [],
                pages: 0,
                total: 0,
                totalPrice: 0,
                payment: 0,
                pageNo: 1,
                startTime: '',
                endTime: '',
                searchPattern: undefined,
                col: [
                    {
                        title: '订单号',
                        dataIndex: 'serialNum',
                        width: 180
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'creationTime',
                        width: 120
                    },
                    {
                        title: '桌号',
                        dataIndex: 'tableNo'
                    },
                    {
                        title: '人数',
                        dataIndex: 'peopleNum'
                    },
                    {
                        title: '用餐时间',
                        dataIndex: 'caterTime'
                    },
                    {
                        title: '应收金额',
                        dataIndex: 'totalPrice',
                        width: 120
                    },
                    {
                        title: '实收金额',
                        dataIndex: 'payment',
                        width: 120
                    },
                    {
                        title: '收银方式',
                        dataIndex: 'payChannel'
                    },
                    {
                        title: '收银员',
                        dataIndex: 'cashier'
                    },
                    {
                        title: '订单状态',
                        dataIndex: 'statusString'
                    },
                    {
                        title: '客户姓名',
                        dataIndex: 'customerName'
                    },
                    {
                        title: '手机号',
                        dataIndex: 'customerPhone',
                        width: 120
                    },
                    {
                        title: '客户来源',
                        dataIndex: 'origin'
                    },
                    {
                        title: '操作人',
                        dataIndex: 'operator'
                    }
                ]
            };
        },
        created() {
            this.getData();
            this.fetchData();
            this.getChannelType();
            eventbus.$on('refreshView', this.fetchData);
        },
        mounted() {
            $('#roomsOrderTable tbody').on('click', 'tr', function(e) {
                const el = $(this).find('.trData');
                eventbus.$emit('onShowDetail', { type: Number(el.attr('data-type')), orderId: Number(el.attr('data-id')) });
            });
        },
        beforeDestroy: function() {
            eventbus.$off('refreshView', this.fetchData);
            $('#roomsOrderTable tbody').off('click');
        },
        watch: {
            userOriginType() {
                this.pageNo = 1;
                this.fetchData();
            },
            state() {
                this.pageNo = 1;
                this.fetchData();
            },
            endTime() {
                this.pageNo = 1;
                this.fetchData();
            },
            startTime() {
                this.pageNo = 1;
                this.fetchData();
            },
            tag() {
                this.pageNo = 1;
                this.fetchData();
            },
            timeType() {
                this.pageNo = 1;
                this.fetchData();
            },
            channelType() {
                this.pageNo = 1;
                this.fetchData();
            },
            channelPerson() {
                this.pageNo = 1;
                this.fetchData();
            }
        },
        methods: {
            changeTag(id) {
                this.tag = id;
            },
            handlePageChange: function(internalCurrentPage) {
                this.pageNo = internalCurrentPage;
                this.fetchData();
            },
            getData() {
                http.get('/user/getChannels', { type: 2, isAll: true })
                    .then((res) => {
                        // 拼接originType 企业渠道：企业id~-5 会员-4～-4 自定义渠道 渠道id～渠道id
                        if (res.code === 1) {
                            const originsList = res.data.list;
                            const otherOrigins = [];
                            this.userOrigins = originsList;
                            originsList.forEach(origin => {
                                if (origin.id < 0 && origin.id !== -5) {
                                    origin.originType = `${origin.id}~${origin.id}`;
                                    this.userSelfOrigins.push(origin);
                                } else if (origin.id === -5) {
                                    origin.companyList.forEach(company => {
                                        const companyName = `企业名称:${company.companyName}(${company.companyType ? '可挂帐' : '不可挂帐'})`;
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
            fetchData(keyword) {
                const obj = {
                    discountRelatedId: this.userOriginType.split('~')[1] !== '-5' ? undefined : this.userOriginType.split('~')[0],
                    toDate: this.endTime,
                    pageNum: this.pageNo,
                    originId: this.userOriginType.split('~')[1],
                    startDate: this.startTime,
                    status: this.state === -1 ? undefined : this.state,
                    cashierId: this.channelPerson === -1 ? undefined : this.channelPerson,
                    payChannel: this.channelType === -1 ? undefined : this.channelType,
                    tag: this.tag
                };
                if (keyword) {
                    obj.keyword = this.searchPattern;
                }
                // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                http.get('/stat/getCaterOrderStat', obj).then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.list;
                        this.totalMany = res.data.orderTotalPrice;
                        this.count = res.data.orderAmount;
                        this.pages = Math.ceil(res.data.total / 30);
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
            disableEndDate(date) {
                if (this.startTime !== '') {
                    const arr = this.startTime.split('-');
                    return date && date.valueOf() < (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                } else {
                    return false;
                }
            },
            disableStartDate(date) {
                if (this.endDate !== '') {
                    const arr = this.endTime.split('-');
                    return date && date.valueOf() > (new Date(arr[0], arr[1] - 1, arr[2])).valueOf();
                } else {
                    return false;
                }
            },
            outPutText(num) {
                const paramsObj = {
                    discountRelatedId: this.userOriginType.split('~')[1] !== '-5' ? undefined : this.userOriginType.split('~')[0],
                    endDate: this.endTime,
                    pageNo: this.pageNo,
                    keyword: this.searchPattern,
                    originId: this.userOriginType.split('~')[1],
                    startDate: this.startTime,
                    state: this.state === -1 ? undefined : this.state,
                    tag: this.tag,
                    timeType: this.timeType
                };
                if (this.searchPattern) {
                    paramsObj.keyword = this.searchPattern;
                }
                if (this.checkType !== -1) {
                    paramsObj.checkType = this.checkType;
                }
                // 后台要求如果为空就不传
                for (const ob in paramsObj) {
                    if (paramsObj[ob] === undefined || paramsObj[ob] === '') {
                        delete paramsObj[ob];
                    }
                }
                paramsObj.type = num;
                const host = http.getUrl('/order/exportAccOrderPc');
                const pa = http.getDataWithToken(paramsObj);
                // pa.map = JSON.parse(pa.map);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            },
            search() {
                this.searchPattern = this.$refs.searchInput.value;
                this.flag = false;
                this.tag = 0;
                this.discountRelatedId = undefined;
                this.endTime = '';
                this.pageNo = 1;
                this.originId = undefined;
                this.startTime = '';
                this.state = -1;
                this.timeType = 1;
                this.userOriginType = '-2~';
                this.fetchData(this.searchPattern);
            },
            getChannelType() {
                http.get('/user/getChannels', { type: 1, isAll: true }).then(res => {
                    if (res.code === 1) {
                        this.channelTypeAll = [...this.channelTypeAll, ...res.data.list];
                    }
                });
            }
        },
        components: {
            DdTable,
            DdPagination,
            DdSelect,
            DdDropdown,
            DdDropdownItem,
            DdOption,
            DdDatepicker,
            DdGroupOption
        }
    };
</script>
