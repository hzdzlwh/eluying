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
            <div style="width: 88px;margin-right:20px;">
                <DdSelect v-model="timeType">
                    <dd-option :key="item.id" v-for="item in timeTypeList" :value="item.id" :label="item.name"></dd-option>
                </DdSelect>
            </div>
                    <div class="add-button fr">
                <div class="dd-dropdown">
                    <DdDropdown text="导出明细" trigger="click">
                        <dd-dropdown-item>
                            <span><a :href="outPutText(1)" download>导出PDF</a></span>
                        </dd-dropdown-item>
                        <dd-dropdown-item>
                            <span><a :href="outPutText(0)" download>导出Excel</a></span>
                        </dd-dropdown-item>
                    </DdDropdown>
                </div>
            </div>
               <div class="select-component-container fr">
                <dd-select v-model="userOriginType">
                    <dd-option :key="origin.originType" v-for="origin in userSelfOrigins"
                               :value="origin.originType" :label="origin.name">
                        <span :title="origin.name">{{origin.name}}</span>
                    </dd-option>
                    <dd-group-option v-for="item in userGroupOrigins" :label="item.label"
                                     :key="item" v-if="item.origins.length > 0">
                        <dd-option v-for="origin in item.origins" :key="origin.originType"
                                   :value="origin.originType" :label="`企业(${origin.name})`">
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
            <div style="margin-right:183px;">
                <span>使用时间：</span>
                <dd-datepicker placeholder="开始时间" v-model="startTime" :disabled-date="disableStartDate" />
                <span>～</span>
                <dd-datepicker placeholder="结束时间" v-model="endTime" :disabled-date="disableEndDate" />
            </div>
            <div style="margin-right:20px;width: 120px;" class="fr">
                <dd-select v-model="state">
                    <dd-option :key="item.id" v-for="item in stateList" :value="item.id" :label="item.name"></dd-option>
                </dd-select>
            </div>
        </div>
        <dd-table :columns="col" :data-source="vips" style='padding-bottom:45px;' id='roomsOrderTable'></dd-table>
        <div class="foot footfix">
            <span><small>共计</small> {{count}}位会员</span>
            <dd-pagination @currentchange="fetchDate" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
        </div>
    </div>
</template>
<style>
.detail-content-filter .dd-select-menu {
    overflow-y: auto;
    max-height: 120px;
}
</style>
<style lang="scss" scoped>

.footfix{
      position: fixed;
    bottom: 0;
    width: 1129px;
}
.roomsManage-mainContainer{
  width: 1129px;
    margin: 0 auto;
    position: relative;
    top: 20px;
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
import http from '../../common/http';
import util from '../../common/util';
import eventbus from '../../common/eventBus';
import { ORDER_STATE_LIST, ORDER_TYPE } from '../const';
export
default {
       data() {
           return {
               timeTypeList: [
                   {
                       id: 1,
                       name: '入住时间'
                   },
                   {
                       id: 2,
                       name: '离店时间'
                   }
               ],
               timeType: 1,
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
                       name: '已拒绝 '
                   },
                   {
                       id: 2,
                       name: '已预订'
                   },
                   {
                       id: 3,
                       name: '进行中 '
                   },
                   {
                       id: 4,
                       name: '已取消 '
                   },
                   {
                       id: 5,
                       name: '已结束'
                   },
                   {
                       id: 6,
                       name: '过期未入住'
                   },
                   {
                       id: 7,
                       name: '过期未退房 '
                   },
                   {
                       id: 8,
                       name: '反结帐'
                   }
               ],
               ORDER_STATE_LIST,
               ORDER_TYPE,
               state: -1,
               userOriginType: '-1~-1',
               userOrigins: [],
               userSelfOrigins: [{
                   id: -2,
                   name: '全部客源渠道',
                   originType: '-2~-2',
                   type: 2
               }],
               userGroupOrigins: [],
               vips: [],
               vip: {},
               pages: 0,
               count: 0,
               pageNo: 1,
               startTime: '',
               endTime: '',
               searchPattern: undefined,
               detailVisible: false,
               col: [
                   {
                       title: '订单号',
                       dataIndex: 'orderNum'
                   },
                   {
                       title: '房号',
                        // render: (h, row) => row.rooms.map(function(room){
                        //     return <div>{room}</div>
                        // })
                       render: (h, row) => row.rooms
                   },
                   {
                       title: '入住时间',
                       dataIndex: 'startDate'
                   },
                   {
                       title: '退房时间',
                       dataIndex: 'endDate'
                   },
                   {
                       title: '联系人',
                       dataIndex: 'customerName'
                   },
                   {
                       title: '手机号',
                       dataIndex: 'customerPhone'
                   },
                   {
                       title: '客源渠道',
                       dataIndex: 'originName'
                   },
                   {
                       title: '订单金额',
                       render: (h, row) => <span>{row.totalPrice}</span>
                   },
                   {
                       title: '订单状态',
                       render: (h, row) =>
                            <span>
                            {ORDER_STATE_LIST[ORDER_TYPE.ACCOMMODATION].find(function(el) {
                                return el.id === row.orderState;
                            }).name}
                            </span>
                   },
                   {
                       title: '创建人',
                       render: (h, row) => <span>{row.operator}</span>
                   },
                   {
                       title: '',
                       render: (h, row) => <span data-id = {row.subOrderType === 3 ? row.subOrderId : row.orderId} data-type = {row.subOrderType} class = "trData"></span>,
                       width: 0
                   }
               ],
               detailTab: undefined,
               detailId: undefined,
               detailTitle: undefined
           };
       },
       created() {
           this.getData();
           this.fetchDate();
           eventbus.$on('refreshView', this.fetchDate());
       },
       mounted() {
           $('#roomsOrderTable tbody').on('click', 'tr', function(e) {
               const el = $(this).find('.trData');
               eventbus.$emit('onShowDetail', { type: Number(el.attr('data-id')), orderId: Number(el.attr('data-type')) });
           });
       },
       beforeDestroy: function() {
           eventbus.$off('refreshView', this.fetchDate());
           $('#roomsOrderTable tbody').off('click');
       },
       watch: {
           userOriginType() {
               this.fetchDate();
           },
           state() {
               this.fetchDate();
           },
           endTime() {
               this.fetchDate();
           },
           pageNo() {
               this.fetchDate();
           },
           startTime() {
               this.fetchDate();
           },
           tag() {
               this.fetchDate();
           },
           timeType() {
               this.fetchDate();
           }
       },
       methods: {
           changeTag(id) {
               this.tag = id;
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
                                if (origin.id === -1 || origin.id === -4) {
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
                            this.userOriginType = this.userSelfOrigins[0].originType;
                        }
                    });
           },
           fetchDate(keyword) {
               const obj = {
                   discountRelatedId: this.userOriginType.split('~')[0],
                   endDate: this.endTime,
                   pageNo: this.pageNo,
                   keyword: this.searchPattern,
                   originId: this.userOriginType.split('~')[1] === '-2' ? undefined : this.userOriginType.split('~')[1],
                   startDate: this.startTime,
                   state: this.state,
                   tag: this.tag,
                   timeType: this.timeType
               };
               if (keyword) {
                   obj.keyword = this.searchPattern;
               }
               http.get('/order/getAccoOrderPc', obj).then(res => {
                   if (res.code === 1) {
                       this.vips = res.data.list;
                       this.count = res.data.orderAmount;
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
           openVipForm() {
               this.vip = {
                   name: '',
                   phone: '',
                   idCardType: 0,
                   vipLevelId: '',
                   gender: undefined,
                   birthday: undefined
               };
               $('#vipForm').modal('show');
           },
           outPutText(num) {
               return num;
           },
           outPutExcel() {
               const campId = localStorage.getItem('campId');
               const uid = localStorage.getItem('uid');
               const host = http.getUrl('/vipUser/vipUserListToExcel');
               const url = host + '?' + 'campId=' + campId + '&uid=' + uid + '&terminal=1&version=10&timestamp=' + (new Date()).valueOf() + '&sign=' + util.getSign();
               return url;
           },
           search() {
               this.searchPattern = this.$refs.searchInput.value;
               this.fetchDate(this.searchPattern);
           },
           handlePageChange: function(internalCurrentPage) {
               this.currentPage = internalCurrentPage;
               this.fetchDate();
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
