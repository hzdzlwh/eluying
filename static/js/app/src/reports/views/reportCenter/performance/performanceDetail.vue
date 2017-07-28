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
					<dd-select>
						<dd-option></dd-option>
					</dd-select>
				</div>
				<div class="filter-condition">
					<dd-select>
						<dd-option></dd-option>
					</dd-select>
				</div>
				<div class="filter-condition">
					<dd-select>
						<dd-option></dd-option>
					</dd-select>
				</div>
			</div>
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
	components: {
		DdDropdown,
		DdDropdownItem,
		CollectButton,
		DdTable,
		DdSelect,
		DdOption
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
	.filter-container{
		width: 50%;
		display: flex;
		justify-content: space-between;
		.filter-time{
			line-height: 24px;
		}
		.filter-condition{
			width: 120px;
		}
	}
</style>
