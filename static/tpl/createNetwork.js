//貌似没有模板引擎 丑陋地用字符串写一个先把
var html = {

};
html.formatTemplate = function(dta, tmpl){
	var format = {
		name: function(x) {
			return x
		}
	};
	return tmpl.replace(/{(\w+)}/g, function(m1, m2) {
		if (!m2)
			return "";
		return (format && format[m2]) ? format[m2](dta[m2]) : dta[m2];
	});
}
html.getHtml = function(name,arg){
	return "<div class='dialogCommon modal fade' id='"+name+"'>" + this.formatTemplate(arg,this.staticTpl[name]) + "</div>";
}
html.staticTpl = {};
html.staticTpl['create'] = ''+
	'<div class="modal-dialog">\
		<div class="modal-content">\
			<div class="my_close" data-dismiss="modal" aria-hidden="true">\
				<img src="/static/image/ic_close.png" alt="关闭"/>\
			</div>\
			<div class="title">创建网络</div>\
			<div class="hr"></div>\
			<div class="form_row row" style="margin-top: 20px;">\
				<div class="col col-md-2 label required">网络名称</div>\
				<div class="col col-md-10 input"><input type="text" placeholder="20个汉字以内" class="networkName"/></div>\
			</div>\
			<div class="form_row row" style="margin-top: 20px;">\
				<div class="col col-md-2 label required">我的部门</div>\
				<div class="col col-md-10 input"><input type="text" placeholder="10个汉字以内" class="department"/></div>\
			</div>\
			<div class="form_row row" style="margin-top: 20px;">\
				<div class="col col-md-2 label required">我的职位</div>\
				<div class="col col-md-10 input"><input type="text" placeholder="10个汉字以内" class="position"/></div>\
			</div>\
			<button class="createNetworkButton btn btn-primary btn-lg btn-block">创建网络</button>\
		</div>\
	</div>';
html.staticTpl['joinStep1'] = ''+
	'<div class="modal-dialog">\
		<div class="modal-content">\
			<div class="my_close" data-dismiss="modal" aria-hidden="true">\
				<img src="/static/image/ic_close.png" alt="关闭"/>\
			</div>\
			<div class="title">加入网络</div>\
			<div class="hr"></div>\
			<div class="form_row row" style="margin-top: 20px;">\
				<div class="col col-md-2 label required">网络号</div>\
				<div class="col col-md-10 input"><input type="text" placeholder="请输入网络号" class="networkId"/></div>\
			</div>\
			<button class="createNetworkButton btn btn-primary btn-lg btn-block">加入网络</button>\
		</div>\
	</div>';
html.staticTpl['joinStep2'] = ''+
	'<div class="modal-dialog">\
		<div class="modal-content">\
			<div class="my_close" data-dismiss="modal" aria-hidden="true">\
				<img src="/static/image/ic_close.png" alt="关闭"/>\
			</div>\
			<div class="title">加入网络</div>\
			<div class="hr"></div>\
			<input type="hidden" value="{networkNum}" class="networkNum"/>\
			<div class="form_row row" style="margin-top: 20px;">\
				<div class="col col-md-2 label required">网络名称</div>\
				<div class="col col-md-10 content">{campName}</div>\
			</div>\
			<div class="form_row row" style="margin-top: 20px;">\
				<div class="col col-md-2 label required">我的部门</div>\
				<div class="col col-md-10 input"><input type="text" placeholder="10个汉字以内" class="department"/></div>\
			</div>\
			<div class="form_row row" style="margin-top: 20px;">\
				<div class="col col-md-2 label required">我的职位</div>\
				<div class="col col-md-10 input"><input type="text" placeholder="10个汉字以内" class="position"/></div>\
			</div>\
			<button class="createNetworkButton btn btn-primary btn-lg btn-block">加入网络</button>\
		</div>\
	</div>';
html.staticTpl['createSuccess'] = ''+
	'<div class="modal-dialog">\
		<div class="modal-content">\
			<div class="title">创建成功</div>\
			<section>\
				您已经成功创建网络{campName}（网络号：{networkNum}）。\
			</section>\
			<section>\
				在手机端邀请同事，可以更好地体验和使用产品\
			</section>\
			<button class="createNetworkButton btn btn-primary btn-lg btn-block">立刻体验</button>\
		</div>\
	</div>';
module.exports = html;