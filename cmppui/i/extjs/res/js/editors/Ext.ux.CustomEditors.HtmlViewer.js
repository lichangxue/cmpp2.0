
//(Ext.ux.CustomEditors || (Ext.ux.CustomEditors = {}));
Ext.namespace('Ext.ux.CustomEditors');	

Ext.ux.CustomEditors.HtmlViewerField = function (editor) {
	this.editor = editor;
	this.constructor.superclass.constructor.call(this);
}
Ext.extend(Ext.ux.CustomEditors.HtmlViewerField,Ext.form.Field, {
	win:null,
	canceled: false,
	clickOK:false,
	orignalValue:'',
	initComponent: function () {
		Ext.ux.CustomEditors.HtmlViewerField.superclass.initComponent.call(this);
		var _this = this;
		var win = new Ext.Window({
			title:'弹出窗口',
			height:500,
			width:600, 
			modal: false,
			buttonAlign: "center",
			closable:true ,
			closeAction:'hide',
			maximizable:true,
			layout:'fit',
			html:'正在加载中...',
			listeners:{
				'hide':function(){
					var _t = _this;
					return function(){
						_t.complete();
					}
				}()
			}
				
		});
		win.addButton("关闭", this.cancel, this);
		this.win = win;
		
	},	
	openWin: function (cfg) {
		this.win.setAnimateTarget(this.editor.animateTarget);
		this.win.setTitle(cfg.title);
		this.win.show("",function(){
			var div = document.createElement("div");
			div.innerHTML = this.orignalValue;
			var tmpEl = Ext.get(div).first();
			var contentHtml = tmpEl.getAttributeNS("","data-content");
			var iframe=null;
			if(contentHtml){
				this.win.body.update('<div class="html-viewer">' + decodeURIComponent(contentHtml) + '</div>');
			}
			if(this.iframe){
				this.win.body.mask("正在加载中...");
				this.iframe.el.dom.onload=(function(that){
					return function(){
						that.win.body.unmask();
					}
				})(this);
			}
		},this);
	},
	setValue: function (val) {
		this.orignalValue = val;
		if(this.win.items){
			this.win.items.each(function(item){
				this.win.remove(item);
			},this);
		}
		var div = document.createElement("div");
		div.innerHTML = this.orignalValue;
		var tmpEl = Ext.get(div).first();
		var contentHtml = tmpEl.getAttributeNS("","data-content");
		var iframe=null;
		if(!contentHtml){
			var url;
			var id = tmpEl.getAttributeNS("","data-id");
			if(id){
				url = "http://g.cmpp.ifeng.com/Cmpp/runtime/interface_343.jhtml?dataId=" + id;
			}else{
				url = tmpEl.getAttributeNS("","data-url");
			}
			iframe=new Ext.BoxComponent({
				autoEl:{tag:"iframe",name:"帮助文档",src:url},
				anchor:"100%"
			 });
			this.win.add(iframe);
		}
		this.iframe = iframe;
	},
	getValue: function () {
		if(this.canceled){
			return this.orignalValue;
		}else{
			//return this.win.body.dom.innerHTML;
		}
	},
	cancel: function () {
		this.canceled = true;
		this.win.hide();
		//this.canceled = true;
		//this.complete();
	},
	complete: function () {
		this.editor.allowBlur = false;
		this.editor.onBlur();
	}
});
Ext.ux.CustomEditors.HtmlViewer = function(config){
	var field = new Ext.ux.CustomEditors.HtmlViewerField(this);
	Ext.ux.CustomEditors.HtmlViewer.superclass.constructor.call(this, field, config);

}
Ext.extend(Ext.ux.CustomEditors.HtmlViewer, Ext.grid.GridEditor, {	
	animateTarget:null,
	startEdit: function (el, value) {
		if (this.editing) {
			this.completeEdit();
		}
		this.boundEl = Ext.get(el);
		this.animateTarget = el;
		var v = value !== undefined ? value : this.boundEl.dom.innerHTML;
		if (this.fireEvent("beforestartedit", this, this.boundEl, v) === false) {
			return;
		}
		this.startValue = v;
		this.setValue(v);
		this.editing = true;
		this.allowBlur = true;
		this.field.openWin({title:this.record.id});
            
	}, 
	setValue: function (val) {
		this.field.setValue(val);
	},
	getValue: function () {
		var val = this.field.getValue();
		if (val == null)
			val = this.startValue;
		if(typeof(this.callback)=='string'){//执行回调函数
			eval(this.callback+'(val)');
		}		
		return val;	
	}
	

});
