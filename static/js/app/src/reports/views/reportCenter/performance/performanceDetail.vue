<template>
	<div>
		<div class="btn-container">
			<div class="export">
				<dd-dropdown text="导出明细" trigger="click" style="width:100px;">
					<dd-dropdown-item><span><a :href="exportUrl(0)">导出Excel</a></span></dd-dropdown-item>
				</dd-dropdown>
			</div>
			<div>
				<collect-button :state='collectState' @toggleCollect="toggleCollect"></collect-button>
			</div>
		</div>
		<div class="content">
			<h4>销售员销售业绩明细表</h4>
			<div class="filter-container">
				<div class="filter-time">
					日期: <span>{{date.startDate}}</span>~<span>{{date.endDate}}</span>
				</div>
				<div class="filter-condition">
					<dd-select v-model="salerId">
						<dd-option :key="item.id" v-for="item in salers" :value="item.id" :label="item.name"></dd-option>
					</dd-select>
				</div>
				<div class="filter-condition">
					<dd-select v-model="orderType">
						<dd-option :key="item.id" v-for="item in orderTypeAll" :value="item.id" :label="item.name"></dd-option>
					</dd-select>
				</div>
				<div class="filter-condition">
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
			<div>
				<dd-table :columns="columns" :data-source="dataSource" :bordered="true"></dd-table>
				<div class="foot">
					<span>共{{count}}条记录, 合计订单金额￥{{totalPrice}}</span>
					<dd-pagination @currentchange="getSalePerformance" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { DdTable, DdPagination, DdDropdown, DdDropdownItem, DdSelect, DdOption, DdGroupOption } from 'dd-vue-component';
import CollectButton from '../../../components/CollectButton';
import { mapState } from 'vuex';
import http from 'http';
export default {
	data() {
		return {
			collectState: undefined,
			pages: 0,
			pageNo: 1,
			count: 0,
			orderType: -2,
			salerId: -1,
			salers: [],
			totalPrice: undefined,
			orderTypeAll: [{
                id: -2,
                name: '全部订单类型',
                orderType: -2
            }, {
                id: -1,
                name: '组合订单',
                orderType: -1
            }, {
                id: 0,
                name: '餐饮',
                orderType: 0
            }, {
                id: 1,
                name: '娱乐',
                orderType: 1
            }, {
                id: 2,
                name: '商超',
                orderType: 2
            }, {
                id: 3,
                name: '住宿',
                orderType: 3
            }],
            userOriginType: '-2~',
            userSelfOrigins: [{
                id: '',
                name: '全部客源渠道',
                originType: '-2~',
                type: 2
            }],
            userGroupOrigins: [],
			columns: [
				{
					title: '订单号',
					dataIndex: ''
				},
				{
					title: '创建时间',
					dataIndex: ''
				},
				{
					title: '销售员',
					dataIndex: ''
				},
				{
					title: '销售员手机号',
					dataIndex: ''
				},
				{
					title: '订单类型',
					dataIndex: ''
				},
				{
					title: '订单金额',
					dataIndex: ''
				},
				{
					title: '客户姓名',
					dataIndex: ''
				},
				{
					title: '手机号',
					dataIndex: ''
				},
				{
					title: '客源渠道',
					dataIndex: ''
				},
				{
					title: '创建人',
					dataIndex: ''
				}
			],
			dataSource: []
		};
	},
	created() {
		this.getSalePerformance();
		this.getEmployeeList();
		this.getOrigin();
		this.getCollectStatus();
	},
	components: {
		DdDropdown,
		DdDropdownItem,
		CollectButton,
		DdTable,
		DdSelect,
		DdOption,
		DdGroupOption,
		DdPagination
	},
	computed: {
		...mapState(['date'])
	},
	methods: {
		exportUrl(type) {
			const obj = {
                endDate: this.date.endDate,
				orderType: this.orderType,
				originId: this.userOriginType.split('~')[1],
				pageNo: this.pageNo,
				salerId: this.salerId,
				startDate: this.date.startDate
            };
             // 后台要求如果为空就不传
            for (const ob in obj) {
                if (obj[ob] === undefined || obj[ob] === '') {
                    delete obj[ob];
                }
            }
            const paramsObj = {
                exportType: type,
                reportType: 603,
                params: JSON.stringify(obj)
            };
            const host = http.getUrl('/stat/exportReport');
            const pa = http.getDataWithToken(paramsObj);
            pa.params = JSON.parse(pa.params);
            const params = http.paramsToString(pa);
            return `${host}?${params}`;
		},
		toggleCollect() {
			if (this.collectState) {
				http.get('/stat/removeFromCollection',{ statValue: 603 }).then(res => {
                    let removeIndex = null;
                    this.$router.options.routes[2].children[0].children.map((item, index) => {
                        if (item.meta.id === 603) {
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
                    this.collectState = !this.collectState;
                });
			} else {
				http.get('/stat/addToCollect',{ statValue: 603 }).then(res => {
					if (res.code === 1) {
						this.collectState = !this.collectState;
					}
                });
			}
		},
		getCollectStatus() {
            http.get('/stat/getCollection')
            .then(res => {
                if(res.code === 1) {
                	res.data.list.map(item => {
                		if (item === 603) {
                			this.collectState = true;
                		}
                	});
                }
            });
        },
		getSalePerformance(page) {
			this.pageNo = page || this.pageNo;
			http.get('/stat/getSalesPerformanceStat4Salers', { 
				endDate: this.date.endDate,
				orderType: this.orderType,
				originId: this.userOriginType.split('~')[1],
				pageNo: this.pageNo,
				salerId: this.salerId,
				startDate: this.date.startDate
			 }).then(res => {
			 	if (res.code === 1) {
			 		this.dataSource = res.data.list;
			 		this.totalPrice = res.data.totalPrice;
			 		this.count = res.data.count;
			 		this.pages = Math.ceil(res.data.count / 30);
			 	}
			 });
		},
		getEmployeeList() {
			http.get('/user/getEmployeeList', { salerType: 2 }).then(res => {
				if (res.code === 1) {
					this.salers = res.data.list.map(item => {
						return { id: item.employeeId, name: item.realName };
					});
					this.salers.unshift({ id: -1, name: '全部销售员' });
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
	},
	watch: {
		salerId(newValue) {
			this.pageNo = 1;
			this.getSalePerformance();
		},
		orderType(newValue) {
			this.pageNo = 1;
			this.getSalePerformance();
		},
		userOriginType(newValue) {
			this.pageNo = 1;
			this.getSalePerformance();
		},
		date(newValue) {
			this.pageNo = 1;
			this.getSalePerformance();
		}
	}
}	
</script>

<style lang="scss" scoped>
	.filter-container{
		width: 50%;
		display: flex;
		justify-content: space-between;
		margin: 27px 0 22px 0;
		.filter-time{
			line-height: 24px;
		}
		.filter-condition{
			width: 120px;
		}
	}
	.foot{
		margin-top: 10px;
	    background: #fafafa;
	    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.15);
	    height: 45px;
	    padding: 0 30px;
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	}
</style>
