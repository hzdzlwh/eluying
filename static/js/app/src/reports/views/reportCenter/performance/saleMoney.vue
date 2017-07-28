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
			<h4>销售员（销售金额）业绩汇总表</h4>
			<p>日期: <span>{{date.startDate}}</span>~<span>{{date.endDate}}</span></p>
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
						title: '住宿订单金额',
						dataIndex: 'roomOrdersTotalPrice'
					},
					{
						title: '餐饮订单金额',
						dataIndex: 'caterOrdersTotalPrice'
					},
					{
						title: '娱乐订单金额',
						dataIndex: 'enterOrdersTotalPrice'
					},
					{
						title: '商超订单金额',
						dataIndex: 'goodsOrdersTotalPrice'
					},
					{
						title: '总订单金额',
						dataIndex: 'allOrdersTotalPrice'
					}
				],
				dataSource: []
			};
		},
		components: {
			DdDropdown,
			DdDropdownItem,
			CollectButton,
			DdTable
		},
		computed: {
			...mapState(['date'])
		},
		methods: {
			exportUrl(type) {
				return '';
			},
			toggleCollect() {
				this.collectState = !this.collectState;
			}
		}
	}	
</script>

<style lang="scss" scoped>
	
</style>
