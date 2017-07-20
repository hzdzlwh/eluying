<template>
	<div>
		<div>
			<outer-container @taggleView="taggleView">
				<div slot="currency" style="display:flex;justify-content: space-between;align-items: center;" v-if="showOrEdit">
					<h4 class="virtual-currency-name">
						{{currencyName}}
						<div class="info-icon">
                            <div class="info-detail">
                                <p>1、虚拟币兑换比例可自由设置，抵扣时“0.01元”以下部分采用四舍五入的方案</p>
								<p style="height: 40px;">2、更改比例时，如果选择保持账户中虚拟币价值不变，则账户中虚拟币新数量=账户中虚拟币原数量/原兑换比例*新兑换比例</p>
								<p>3、目前虚拟币只能用于正常入住</p>    
                            </div>
                        </div>
					</h4>
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
					<p v-if="showOrEdit" style="height:40px;line-height:40px;"><input type="checkbox" disabled="false" :checked="vipAccountStatus === 1">会员</p>
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
			currencyName: '虚拟币',
			showOrEdit: true,
			exchangeScale: '兑换比例',
			openAccount: '开启账户',
			rate: 100,
			vipAccountStatus: 0,
			keepValue: 0,
			id: null,
			editKeepValue: false,
			editMember: false,
		};
	},
	created() {
		this.getVirtualCurrency();
	},
	methods: {
		getVirtualCurrency() {
			http.get('/virCurrency/getVirtualCurrencySetting', {}).then(res => {
				if (res.code === 1) {
					if (res.data.id !== null) {
						this.currencyName = res.data.name;
						this.rate = res.data.rate;
						this.vipAccountStatus = res.data.vipAccountStatus;
						this.editMember = res.data.vipAccountStatus === 1? 1 : 0;
						this.editKeepValue = res.data.keepValue === 1? 1 : 0;
						this.id = res.data.id;
					}
				}
			});
		},
		taggleView() {
			this.showOrEdit = !this.showOrEdit;
			this.getVirtualCurrency();
		},
		save() {
            var param = {};
            param.id = this.id;
            param.keepValue = this.editKeepValue? 1 : 0;
            param.name = this.currencyName;
            param.rate = this.rate;
            param.vipAccountStatus = this.editMember? 1 : 0;
            http.get('/virCurrency/editVirtualCurrencySetting', param).then(res => {
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
	.virtual-currency-name{
		display: flex;
		.info-icon{
	        position: relative;
	        top: 16px;
	        cursor: pointer;
	        width: 16px;
	        height: 16px;
	        background: url("/static/image/modal/room_modal_info.png");
	        background-size: contain;
	        .info-detail{
	            display: none;
	            position: absolute;
	            width: 500px;
	            background: #fafafa;
	            top: -10px;
	            left: 20px;
	            padding: 8px;
	            z-index: 999;
	            p{
	            	height: 20px;
	            	line-height: 20px;
	            	font-size: 12px;
	            }
	        }
	        &:hover{
	            .info-detail{
	                display: block;
	            }
	        }
	    }
	}
	
</style>