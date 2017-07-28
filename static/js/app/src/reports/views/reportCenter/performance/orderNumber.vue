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
					dataIndex: ''
				},
				{
					title: '销售员手机号',
					dataIndex: ''
				},
				{
					title: '住宿订单数量',
					dataIndex: ''
				},
				{
					title: '餐饮订单数量',
					dataIndex: ''
				},
				{
					title: '娱乐订单数量',
					dataIndex: ''
				},
				{
					title: '商超订单数量',
					dataIndex: ''
				},
				{
					title: '总订单数量',
					dataIndex: ''
				}
			],
			dataSource: []
		}
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
