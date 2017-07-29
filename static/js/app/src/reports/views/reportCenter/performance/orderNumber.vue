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
			<h4>销售员（订单数量）业绩汇总表</h4>
			<p class="time">日期: <span>{{date.startDate}}</span>~<span>{{date.endDate}}</span></p>
			<div>
				<dd-table :columns="columns" :data-source="dataSource" :bordered="true"></dd-table>
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
			columns: [
				{
					title: '销售员',
					dataIndex: 'name'
				},
				{
					title: '销售员手机号',
					dataIndex: 'phone'
				},
				{
					title: '住宿订单数量',
					dataIndex: 'roomOrdersCount'
				},
				{
					title: '餐饮订单数量',
					dataIndex: 'caterOrdersCount'
				},
				{
					title: '娱乐订单数量',
					dataIndex: 'enterOrdersCount'
				},
				{
					title: '商超订单数量',
					dataIndex: 'goodsOrdersCount'
				},
				{
					title: '总订单数量',
					dataIndex: 'ordersCount'
				}
			],
			dataSource: []
		}
	},
	created() {
		this.getOrderNumber();
		this.getCollectStatus();
	},
	components: {
		DdTable,
		DdDropdown,
		DdDropdownItem,
		CollectButton
	},
	computed: {
		...mapState(['date'])
	},
	methods: {
		exportUrl(type) {
			const obj = {
                endDate: this.date.endDate,
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
                reportType: 602,
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
				http.get('/stat/removeFromCollection',{ statValue: 602 }).then(res => {
                    let removeIndex = null;
                    this.$router.options.routes[2].children[0].children.map((item, index) => {
                        if (item.meta.id === 602) {
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
				http.get('/stat/addToCollect',{ statValue: 602 }).then(res => {
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
                		if (item === 602) {
                			this.collectState = true;
                		}
                	});
                }
            });
        },
		getOrderNumber() {
			http.get('/stat/getOrderCountStat4Salers', { endDate: this.date.endDate, startDate: this.date.startDate }).then(res => {
				if (res.code === 1) {
					this.dataSource = res.data.list;
				}
			});
		}
	}
}	
</script>

<style lang="scss" scoped>
	.time{
		margin: 27px 0 22px 0;
	}
</style>
