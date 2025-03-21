Ext.ux.TitleField = function (config) {
	if(!Ext.nore(config.regex))
		config.regex=Ext.decode(config.regex);		
	Ext.ux.TitleField.superclass.constructor.call(this, config);
}
Ext.extend(Ext.ux.TitleField, Ext.form.TextField, {
	/**标题标尺属性**/
	fontSize:12,
	rulerNums:[16,22],
	titleRulerArr:null,
	/****/
	initComponent: function () {
		if(typeof(this.rulerNums)=='string'){
			this.rulerNums= Ext.decode(this.rulerNums);
		}
		this.titleRulerArr = [];
	},
	onRender:function(ct,pos){
		Ext.ux.TitleField.superclass.onRender.call(this,ct,pos);		
		(this.initialConfig.readOnly&&(this.el.addClass(" readOnly")));
		var elParent = this.el.parent();
		this.contentLenthEl = elParent.createChild({//显示字数的容器
			tag:'span',
			style:'color:#000;font-size:12px;'
		})
		this.el.on('keyup',this.showContentLenth,this);
		this.showContentLenth();
		//利用图片的onload延迟触发的办法来等待控件初始化后再取得控件位置设置标题标尺
		var imgEl = ct.createChild({
			tag:'img',
			width:1,
			height:1
		});	
		imgEl.on('load',function(){
			this.setTitleRuler();
		},this);
		imgEl.dom.src='../res/img/blank.gif';
	},
	showContentLenth:function(){
		if(this.contentLenthEl){
			var content = this.getValue();
			var count = this.getCharLength(content);
			var countText = '<font color="green">' + count + '</font>';
			if(count>=this.warnCharCount){
				countText = '<font color="red">' + count + '</font>';
			}
			this.contentLenthEl.update('字数:' + countText);
		}
	},
	getCharLength:function(content){
		var pattern = /[^\x00-\x80]+/;
		var contentLength = 0;
		for (var i = 0; i < content.length; i++) {
			if (pattern.test(content.charAt(i))) {
				contentLength++;
			} else {
				contentLength += 0.5;
			}
		}
		return contentLength;
	},
	//设置标题标尺
	setTitleRuler:function(){
		var el = this.el;
		var elParent = el.parent();
		var height = el.getHeight();
		var left = el.getLeft()-elParent.getLeft() + el.getPadding('l');
		var top = 0;
		var fontSize = this.fontSize;
				
		for(var i=0;i<this.rulerNums.length;i++){
			if(this.titleRulerArr[i]){
				this.titleRulerArr[i].setHeight(height);
			}else{
				var charNum = this.rulerNums[i];
				var rulerWidth = charNum*fontSize;
				var left1 = left + rulerWidth;
				var leftNum1 = left1+3;
				this.titleRulerArr[i] = el.parent().createChild({
					tag:'div',
					cls:'titlefield-ruler-line line' + i,	
					style:"height:"+height+"px;position:absolute;left:"+ left1 +"px;top:"+ top +"px"
				});
				el.parent().createChild({
					tag:'div',
					cls:'titlefield-ruler-number number' + i,	
					style:"position:absolute;left:"+ (leftNum1-9) +"px;top:"+ (top-14) +"px",
					html:charNum
				});
			}
		}
	}
		
});
Ext.reg('titlefield', Ext.ux.TitleField);