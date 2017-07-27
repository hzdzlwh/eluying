<template>
    <div>
        <p style="font-weight: bold;font-size:24px;color:#178ce6;text-align:center;margin: 20px 0 26px">
            充值明细表
        </p>
        <div class="top">
            <div class="date">日期 : <i>{{date.startDate}} ~ {{date.endDate}}</i></div>
            <div class="select-box">
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="type" >
                        <dd-option :key="item.id" v-for="item in typeAll" :value="item.type" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="categoryType" >
                        <dd-option :key="item.id" v-for="item in categoryTypeAll" :value="item.categoryType" :label="item.name"></dd-option>
                    </dd-select>
                </div>
                <div style="margin-right:20px;width: 120px;" class="fr region" >
                    <dd-select v-model="channelId" >
                        <dd-option :key="item.id" v-for="item in channels" :value="item.id" :label="item.name"></dd-option>
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
            <p style="font-size:16px;"><small style='width:16px;'>总充值笔数 : </small> {{receiptNum}}</p>
            <p style="font-size:16px;"><small style='width:16px;'>总充值金额 : </small> {{receiptFree}}</p>
            <p style="font-size:16px;"><small style='width:16px;'>总赠送金额 : </small> {{priceFree}}</p>
            <dd-pagination @currentchange="handlePageChange" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
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
  .report-collect {
      float: left;
      margin-left:20px;
      height: 24px;
      width: 100px;
      border-radius:2px;
      text-align: center;
      line-height:24px;
      cursor:pointer;
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
</style>
<script>
    import { DdTable, DdPagination, DdDropdown, DdDropdownItem, DdSelect, DdOption, DdGroupOption } from 'dd-vue-component';
    import http from 'http';
    import { mapState } from 'vuex';
    import DateSelect from '../../../components/DateSelect.vue';
    export default {
        props: {
            startDate: String,
            endDate: String
        },
        data() {
            return {
                typeAll: [{
                    id: -1,
                    name: '全部类型',
                    type: -1
                }, {
                    id: 0,
                    name: '会员',
                    type: 0
                }, {
                    id: 1,
                    name: '会员卡',
                    type: 1
                }],
                type: -1,
                collectNum: 0,
                collectName: '加入收藏',
                channels: [
                    {
                        id: 'ALL',
                        name: '全部收款方式'
                    }
                ],
                channelId: 'ALL',
                categoryTypeAll: [{
                    id: -1,
                    name: '会员卡/等级',
                    categoryType: '-1~'
                }],
                categoryType: '-1~',
                vips: [],
                vip: {},
                pages: 0,
                receiptNum: 0,
                priceFree: 0,
                receiptFree: 0,
                pageNo: 1,
                col: [
                    {
                        title: '类型',
                        dataIndex: 'type',
                        width: 180
                    },
                    {
                        title: '会员卡/等级',
                        dataIndex: 'name',
                        width: 80
                    },
                    {
                        title: '联系人',
                        dataIndex: 'userName',
                        width: 80
                    },
                    {
                        title: '手机号',
                        dataIndex: 'phone',
                        width: 100
                    },
                    {
                        title: '充值金额',
                        dataIndex: 'price',
                        width: 80
                    },
                    {
                        title: '赠送金额',
                        dataIndex: 'freePrice',
                        width: 100
                    },
    
                    {
                        title: '充值时间',
                        dataIndex: 'creationTime',
                        width: 80
                    },
                    {
                        title: '付款方式',
                        dataIndex: 'channel',
                        width: 120
                    },
                    {
                        title: '操作人',
                        dataIndex: 'operator',
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
            DdGroupOption,
            DateSelect
        },
        watch: {
            date() {
                this.pageNo = 1;
                if (this.flag) {
                    this.getData();
                }
            },
            channelId() {
                this.page = 1;
                this.getData();
            },
            categoryType() {
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
            type() {
                this.pageNo = 1;
                this.getData();
                this.categoryTypeAll = [{
                    id: -1,
                    name: '会员卡/等级',
                    categoryType: '-1~'
                }];
                this.categoryType = '-1~';
                this.getCategoryTypeAll();
            }
        },
        created() {
            this.getChannels();
            this.getData();
            this.getCollectStatus();
        },
        computed: {
            ...mapState(['date']),
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
                    http.get('/stat/addToCollect',{statValue: 305}).then(res => {
                        this.collectNum = 1;
                        this.collectName = '已收藏';
                    });
                } else if (num === 1) {
                    http.get('/stat/removeFromCollection',{statValue: 305}).then(res => {
                        this.collectNum = 0;
                        this.collectName = '加入收藏';
                        let removeIndex = null;
                        this.$router.options.routes[2].children[0].children.map((item, index) => {
                            if (item.meta.id === 305) {
                                removeIndex = index;
                            }
                        });
                        this.$router.options.routes[2].children[0].children.splice(removeIndex , 1);
                        if (this.$router.options.routes[2].children[0].children.length > 1) {
                            this.$router.push('/reportCenter/collect/' + this.$router.options.routes[2].children[0].children[1].meta.id);
                        } else {
                            this.$router.push('/reportCenter/collect/');
                        }
                    });
                }
            },
            getCollectStatus() {
                http.get('/stat/getCollection')
                    .then(res => {
                        if(res.code === 1) {
                            const collectList = res.data.list;
                            for(let i=0;i<collectList.length;i++){
                                if (collectList[i] === 305) {
                                    this.collectNum = 1;
                                    this.collectName = '已收藏';
                                }
                            }
                        }
                    })
            },
            exportUrl(type) {
                const obj = {
                    pageNum: this.pageNo,
                    categoryId: this.categoryType.split('~')[1],
                    startDate: this.date.startDate,
                    toDate: this.date.endDate
                };
                if (this.type !== -1) {
                    obj.type = this.type;
                };
                if (this.channelId !== 'ALL') {
                    obj.payChannel = this.channelId;
                };
                 // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                const paramsObj = {
                    exportType: type,
                    reportType: 305,
                    params: JSON.stringify(obj)
                };
                const host = http.getUrl('/stat/exportReport');
                const pa = http.getDataWithToken(paramsObj);
                pa.params = JSON.parse(pa.params);
                const params = http.paramsToString(pa);
                return `${host}?${params}`;
            },
            getChannels() {
                http.get('/user/getChannels', { type: 1, isAll: true })
                    .then(res => {
                        if (res.code === 1) {
                            const channelList = res.data.list;
                            channelList.forEach(channel => {
                                if (channel.name !== '企业挂账' && channel.name !== '企业余额' && channel.name !== '一码通' && channel.name !== '会员余额' && channel.name !== '会员卡余额' && channel.name !== '虚拟币抵扣') {
                                    this.channels.push(channel);
                                }
                            });
                        }
                    });
            },
            getCategoryTypeAll() {
                if (this.type === 0) {
                    http.get('/vipUser/getVipLevels')
                    .then(res => {
                        if (res.code === 1) {
                            const categoryList = res.data.list;
                            categoryList.forEach(category => {
                                category.id = category.vipLevelId;
                                category.name = category.vipLevelName;
                                category.categoryType = `-1~${category.vipLevelId}`;
                                this.categoryTypeAll.push(category);
                            });
                        }
                    });
                } else if (this.type === 1) {
                    http.get('/vipCard/getVipCardSettings')
                    .then(res => {
                        if (res.code === 1) {
                            const categoryList = res.data.list;
                            categoryList.forEach(category => {
                                category.id = category.categoryId;
                                category.name = category.name;
                                category.categoryType = `-1~${category.categoryId}`;
                                this.categoryTypeAll.push(category);
                            });
                        }
                    });
                }
            },
            getData() {
                const obj = {
                    pageNum: this.pageNo,
                    categoryId: this.categoryType.split('~')[1],
                    startDate: this.date.startDate,
                    toDate: this.date.endDate
                };
                if (this.type !== -1) {
                    obj.type = this.type;
                };
                if (this.channelId !== 'ALL') {
                    obj.payChannel = this.channelId;
                };
                 // 后台要求如果为空就不传
                for (const ob in obj) {
                    if (obj[ob] === undefined || obj[ob] === '') {
                        delete obj[ob];
                    }
                }
                http.get('/stat/getChargeLog', obj).then(res => {
                    if (res.code === 1) {
                        this.vips = res.data.entityList || [];
                        this.receiptNum = res.data.totalChargeCount;
                        this.priceFree = res.data.totalFreeFee;
                        this.receiptFree = res.data.totalChargeFee;
                        this.pages = Math.ceil(res.data.total / 30);
                    }
                    this.flag = true;
                });
            },
            handlePageChange(internalCurrentPage) {
                this.pageNo = internalCurrentPage;
                this.getData();
            }
        }
    };
</script>
