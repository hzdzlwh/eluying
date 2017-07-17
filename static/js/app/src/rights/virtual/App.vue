<template>
	<div>
		<div>
			<outer-container @taggleView="taggleView">
				<div slot="currency" style="display:flex;justify-content: space-between;align-items: center;" v-if="showOrEdit">
					<h4>{{currencyName}}</h4>
					<span style="cursor:pointer;color:#178ce6;" @click="taggleView">编辑</span>
				</div>
				<div slot="currency" style="height:49px;line-height:49px;position:relative;" v-else>
					<input class="dd-input" style="width:156px;" placeholder="请输入虚拟币名称" v-model="currencyName"><span style="font-size:12px;color:#f24949;position:absolute;top:19px;left:0;" v-if="currencyName ===''">必填字段</span>
				</div>
				<inner-container :title="exchangeScale">
					<p v-if="showOrEdit" style="height:40px;line-height:40px;">{{rate}}虚拟币等值1人民币</p>
					<div v-else>
						<div style="height:32px;line-height:32px;">
							<input type="text" class="dd-input" style="width:51px;" v-model="rate"><span>虚拟币等值1人民币</span><span>(请输入0.01-100之间的数字)</span>
						</div>
						<div style="height:32px;line-height:32px;">
							<label><input type="checkbox" v-model="editKeepValue">保持账户中虚拟币价值不变</label>
						</div>
					</div>
				</inner-container>
				<inner-container :title="openAccount" style="margin-top:17px;">
					<p v-if="showOrEdit"><span v-if="vipAccountStatus === 1">会员</span></p>
					<label v-else><input type="checkbox" v-model="editMember">会员</label>
				</inner-container>
				<div slot="saveOrCancel" v-if="!showOrEdit" style="text-align:right;padding:0 20px 16px 0;">
					<button class="dd-btn dd-btn-ghost" @click="taggleView">取消</button>
            		<button class="dd-btn dd-btn-primary" @click="save">保存</button>
				</div>
			</outer-container>
		</div>
		<div>
			
		</div>
	</div>
</template>

<script>
import outerContainer from './components/outerContainer';
import innerContainer from './components/innerContainer';
import http from '../../common/http';
export default {
	data() {
		return {
			currencyName: '',
			showOrEdit: true,
			exchangeScale: '兑换比例',
			openAccount: '开启账户',
			rate: 0,
			vipAccountStatus: 0,
			keepValue: 0,
			id: null,
			editKeepValue: false,
			editMember: false
		};
	},
	created() {
		this.getVirtualCurrency();
	},
	methods: {
		getVirtualCurrency() {
			http.get('/vipUser/getVirtualCurrencySetting', {}).then(res => {
				if (res.code === 1) {
					this.currencyName = res.data.name;
					this.rate = res.data.rate;
					this.vipAccountStatus = res.data.vipAccountStatus;
					this.editMember = res.data.vipAccountStatus === 1? 1 : 0;
					this.editKeepValue = res.data.keepValue === 1? 1 : 0;
					this.id = res.data.id;
				}
			});
		},
		taggleView() {
			this.showOrEdit = !this.showOrEdit;
		},
		save() {
            var param = {};
            param.id = this.id;
            param.keepValue = this.editKeepValue? 1 : 0;
            param.name = this.currencyName;
            param.rate = this.rate;
            param.vipAccountStatus = this.editMember? 1 : 0;
            http.get('/vipUser/editVirtualCurrencySetting', param).then(res => {
            	if (res.code === 1) {
            		this.taggleView();
            		this.getVirtualCurrency();
            	}
            });
        }
	},
	components: {
		outerContainer,
		innerContainer
	}
}
</script>

<style lang="scss" type="text/css" rel="stylesheet/scss">
	
</style>