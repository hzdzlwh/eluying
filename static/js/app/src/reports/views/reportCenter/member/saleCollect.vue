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
			<h4>会员卡销售汇总表</h4>
			<div class="tab-container">
				<span class="show-dimension">显示维度</span>
				<ul class="nav nav-tabs">
					<li class="active">
						<a href="#salesman" data-toggle="tab">销售员</a>
					</li>
					<li>/</li>
					<li>
						<a href="#vipcard" data-toggle="tab">会员卡类型</a>
					</li>
				</ul>
			</div>
			<div class="tab-content">
				<p>日期: <span>{{date.startDate}}</span>~<span>{{date.endDate}}</span></p>
				<div class="tab-pane fade in active" id="salesman">
					<dd-table :columns="columnsSalesman" :data-source="dataSourceSalesman" :bordered="true"></dd-table>
				</div>
				<div class="tab-pane fade in" id="vipcard">
					<dd-table :columns="columnsVipcard" :data-source="dataSourceVipcard" :bordered="true"></dd-table>
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
			columnsSalesman: [
				{
					title: '销售员',
					dataIndex: 'salerName'
				},
				{
					title: '销售员手机号',
					dataIndex: 'salerPhone'
				},
				{
					title: '销售数量',
					dataIndex: 'saleCount'
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
				}
			],
			columnsVipcard: [
				{
					title: '会员卡类型',
					dataIndex: 'cardType'
				},
				{
					title: '销售数量',
					dataIndex: 'saleCount'
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
				}
			],
			dataSourceSalesman: [],
			dataSourceVipcard: []
		}
	},
	components: {
		CollectButton,
		DdDropdown,
		DdDropdownItem,
		DdTable
	},
	created() {
		this.getVipCardSalesman();
		this.getVipCardType();
		this.getCollectStatus();
	},
	computed: {
		...mapState(['date'])
	},
	methods: {
		exportUrl(type) {
			return '';
		},
		toggleCollect() {
			if (this.collectState) {
				http.get('/stat/removeFromCollection',{ statValue: 306 }).then(res => {
                    let removeIndex = null;
                    this.$router.options.routes[2].children[0].children.map((item, index) => {
                        if (item.meta.id === 306) {
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
				http.get('/stat/addToCollect',{ statValue: 306 }).then(res => {
					if (res.code === 1) {
						this.collectState = !this.collectState;
					}
                });
			}
		},
		getVipCardSalesman() {
			http.get('/stat/getVipCardSoldSumStat', { startDate: this.date.startDate, toDate: this.date.endDate }).then((res) => {
				if (res.code === 1) {
					this.dataSourceSalesman = res.data.entityList;
				}
			});
		},
		getVipCardType() {
			http.get('/stat/getVipCardSoldStat', { startDate: this.date.startDate, toDate: this.date.endDate }).then((res) => {
				if (res.code === 1) {
					this.dataSourceVipcard = res.data.entityList;
				}
			});
		},
		getCollectStatus() {
            http.get('/stat/getCollection')
            .then(res => {
                if(res.code === 1) {
                	res.data.list.map(item => {
                		if (item === 306) {
                			this.collectState = true;
                		}
                	});
                    const collectList = res.data.list;
                    for(let i=0;i<collectList.length;i++){
                        if (collectList[i] === 303) {
                            this.collectNum = 1;
                            this.collectName = '已收藏';
                        }
                    }
                }
            });
        }
	}
}	
</script>

<style lang="scss" scoped>
	.tab-container{
		display: flex;
		justify-content: center;
		.show-dimension{
			display: inline-block;
	    	line-height: 24px;
	    	margin-right: 10px;
		}
		.nav-tabs{
			margin-bottom: 0;
			li{
				a{
					color: #666;
				}
				&.active{
					a{
						background-color: #fff;
						color: #178ce6;
					}
				}
				&:nth-child(2){
					line-height: 25px;
				}
			}
		}
	}
	
</style>
