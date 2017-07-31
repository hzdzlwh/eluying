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
			<h4>会员卡销售明细表</h4>
			<div class="filter-container">
				<div class="filter-time">
					日期: <span>{{date.startDate}}</span>~<span>{{date.endDate}}</span>
				</div>
				<div class="filter-condition">
					<dd-select v-model="cardType">
						<dd-option :key="item.id" v-for="item in cardTypes" :value="item.id" :label="item.name"></dd-option>
					</dd-select>
				</div>
				<div class="filter-condition">
					<dd-select v-model="salerId">
						<dd-option :key="item.id" v-for="item in salers" :value="item.id" :label="item.name"></dd-option>
					</dd-select>
				</div>
			</div>
			<div>
				<dd-table :columns="columns" :data-source="dataSource" :bordered="true"></dd-table>
				<div class="foot">
					<span>共{{recordNum}}条记录, 合计卡费金额￥{{cardPriceTotal}}, 首冲金额￥{{firstChargeFeeTotal}}, 首冲赠送金额￥{{firstChargeFreeFeeTotal}}, 销售价格￥{{saleFeeTotal}}</span>
					<dd-pagination @currentchange="getVipCardSaleDetail" :visible-pager-count="6" :show-one-page="false" :page-count="pages" :current-page="pageNo" />
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
            collectState: false,
            pages: 0,
            pageNo: 1,
            cardType: -1,
            cardTypes: [],
            salerId: -1,
            salers: [],
            recordNum: undefined,
            cardPriceTotal: undefined,
            firstChargeFeeTotal: undefined,
            firstChargeFreeFeeTotal: undefined,
            saleFeeTotal: undefined,
            columns: [
                {
                    title: '办卡时间',
                    dataIndex: 'creationTime'
                },
                {
                    title: '卡号',
                    dataIndex: 'cardNo'
                },
                {
                    title: '会员卡类型',
                    dataIndex: 'cardType'
                },
                {
                    title: '姓名',
                    dataIndex: 'userName'
                },
                {
                    title: '手机号',
                    dataIndex: 'userPhone'
                },
                {
                    title: '卡费金额',
                    dataIndex: 'cardFee'
                },
                {
                    title: '首冲金额',
                    dataIndex: 'firstChargeFee'
                },
                {
                    title: '首冲赠送金额',
                    dataIndex: 'firstChargeFreeFee'
                },
                {
                    title: '销售员',
                    dataIndex: 'salerName'
                },
                {
                    title: '销售员手机号',
                    dataIndex: 'salerPhone'
                },
                {
                    title: '销售价格',
                    dataIndex: 'salePrice'
                },
                {
                    title: '收款方式',
                    dataIndex: 'chargeChannel'
                },
                {
                    title: '收银员',
                    dataIndex: 'operator'
                }
            ],
            dataSource: []
        };
    },
    components: {
        CollectButton,
        DdDropdown,
        DdDropdownItem,
        DdTable,
        DdSelect,
        DdOption,
        DdPagination
    },
    computed: {
        ...mapState(['date'])
    },
    created() {
        this.getCollectStatus();
        this.getVipCardSaleDetail();
        this.getVipCardSetting();
        this.getEmployeeList();
    },
    methods: {
        exportUrl(type) {
            const obj = {
                cardType: this.cardType,
                pageNo: this.pageNo,
                pageSize: 30,
                salerId: this.salerId,
                startDate: this.date.startDate,
                toDate: this.date.endDate
            };
            // 后台要求如果为空就不传
            for (const ob in obj) {
                if (obj[ob] === undefined || obj[ob] === '') {
                    delete obj[ob];
                }
            }
            const paramsObj = {
                exportType: type,
                reportType: 308,
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
                http.get('/stat/removeFromCollection', { statValue: 308 }).then(res => {
                    let removeIndex = null;
                    this.$router.options.routes[2].children[0].children.map((item, index) => {
                        if (item.meta.id === 308) {
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
                    this.collectState = !this.collectState;
                });
            } else {
                http.get('/stat/addToCollect', { statValue: 308 }).then(res => {
                    if (res.code === 1) {
                        this.collectState = !this.collectState;
                    }
                });
            }
        },
        getCollectStatus() {
            /* http.get('/stat/getCollection')
            .then(res => {
                if(res.code === 1) {
                	res.data.list.map(item => {
                		if (item === 308) {
                			this.collectState = true;
                		}
                	});
                }
            }); */
            if (/^\/reportCenter\/collect/.test(this.$route.path)) {
            	this.collectState = true;
            }
        },
        getVipCardSaleDetail(page) {
            this.pageNo = page || this.pageNo;
            http.get('/stat/getVipCardSaleDetailStat', {
                cardType: this.cardType,
                pageNo: this.pageNo,
                pageSize: 30,
                salerId: this.salerId,
                startDate: this.date.startDate,
                toDate: this.date.endDate
            }).then((res) => {
                if (res.code === 1) {
                    this.dataSource = res.data.entityList;
                    this.recordNum = res.data.total;
                    this.cardPriceTotal = res.data.cardPriceTotal;
                    this.firstChargeFeeTotal = res.data.firstChargeFeeTotal;
                    this.firstChargeFreeFeeTotal = res.data.firstChargeFreeFeeTotal;
                    this.saleFeeTotal = res.data.saleFeeTotal;
                    this.pages = Math.ceil(res.data.total / 30);
                }
            });
        },
        getVipCardSetting() {
            http.get('/vipCard/getVipCardSettings', {}).then(res => {
                if (res.code === 1) {
                    this.cardTypes = res.data.list.map(item => {
                        return { id: item.categoryId, name: item.name };
                    });
                    this.cardTypes.unshift({ id: -1, name: '全部会员卡类型' });
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
        }
    },
    watch: {
        cardType(newValue) {
            this.pageNo = 1;
            this.getVipCardSaleDetail();
        },
        salerId(newValue) {
            this.pageNo = 1;
            this.getVipCardSaleDetail();
        },
        date(newValue) {
            this.pageNo = 1;
            this.getVipCardSaleDetail();
        }
    },
    beforeRouteEnter(to, from, next) {
        http.get('/stat/getCollection').then(res => {
            if (res.code === 1) {
                next(vm => {
                    res.data.list.map(item => {
                		if (item === 308) {
                			vm.collectState = true;
                		}
                	});
                });
            }
        });
    }
};
</script>

<style lang="scss" scoped>
	.filter-container{
		width: 40%;
		margin: 27px 0 22px 0;
		display: flex;
		justify-content: space-between;
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
