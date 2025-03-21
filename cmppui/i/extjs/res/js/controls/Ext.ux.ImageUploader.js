/*
*图片批量上传控件，并提供图片预览、裁图、加水印、插入正文等功能。
*author:cici
*date:2016/3/9
*依赖js： controls/Ext.ux.ImageUploader.js;controls/Ext.ux.ImageCutter.js ;
*依赖css：css/portal.css css/Ext.ux.ImageUploader.css
*/

Ext.ux.ImageUploader = function (config) {	
	if(typeof config.domains==="string"){
		config.domains = Ext.decode(config.domains);
	}
	if(config.waterMarkImageButtons && typeof config.waterMarkImageButtons==="string"){
		try{config.waterMarkImageButtons = Ext.decode(config.waterMarkImageButtons);}catch(ex){}
	}
	if(config.imageCutterConfig && typeof config.imageCutterConfig==="string"){
		try{config.imageCutterConfig = Ext.decode(config.imageCutterConfig);}catch(ex){}
	}
	
	if(config.insertToDocumentEnable && typeof config.insertToDocumentHandler=="string"){
		try{
			config.insertToDocumentHandler = eval('(' + config.insertToDocumentHandler + ")");
		}catch(e){
			Ext.CMPP.warn('insertToDocumentHandler参数配置不正确');
		}
	}
	
	Ext.ux.ImageUploader.superclass.constructor.call(this, config);
}
Ext.extend(Ext.ux.ImageUploader, Ext.form.Field, {
	/****/
	domains:['p0.ifengimg.com','p1.ifengimg.com','p2.ifengimg.com','p3.ifengimg.com'],
	fileMaxSize:1024000,
	uploadUrl:'../runtime/upload!file.jhtml',
	uploadAndWaterMarkUrl:'../runtime/upload!img.jhtml',//上传并添加水印 参数说明：filedataFileName、filedata、extradata:{isSync,distributeURL,watermarkUrl,watermarkPos:"southeast",bigDimen:{width,height}},
	waterMarkUrl:'upload!waterMark.jhtml',//加水印接口url
	warterMarkEnable:true,//添加水印功能是否启用
	currentWarterMarkImageUrl:"",//水印url地址
	mustAddWarterMark:false,//上传时添加水印吗
	waterMarkImageButtons:'',//'[{item:{"text":"添加娱乐水印","url":"http://"},{"text":"添加星座水印","url":"http://"}}]'
	waterMarkPositon:"southeast",//水印位置(默认：southeast,northeast,southwest,northwest,center,tile)
	imageCutterConfig:{
		xtype:'imagecutter',
		button_text:"裁图&上传",
		viewButtonVisible:false,
		copyButtonVisible:false,
		onlyUploadEnable:false,
		AIDefaultChecked:false,
		sampleSize:null,
		sampleSizeEnable:true
	},//裁图控件配置
	syncflag:1,//同步上传
	resRoot:'../res/',
	mainSlide:null,//主图panel
	insertToDocumentText:'插入到正文',
	insertToDocumentEnable:true,//插入到正文按钮是否启用
	insertToDocumentHandler:"(function(){})",//插入到正文的函数代码
	msgTarget :"under",
	fileInputHtml:'<input name="addImage"  type="file" accept="image/*" style="position: absolute;opacity: 0;cursor: pointer;top: 0;left:-2500px;z-index: 100;" size="30"  name="fileselect[]" multiple/><input name="addThumbImage"  type="file" accept="image/*" style="position: absolute;opacity: 0;cursor: pointer;top: 0;left:-2500px;z-index: 100;" size="30"  name="fileselect[]" multiple/>',
	initComponent: function () {
		Ext.applyDeep(this,this.initialConfig);
		this.autoCreate = { tag: 'input', type: 'hidden', name: this.initialConfig.name || "" };
		Ext.ux.ImageUploader.superclass.initComponent.call(this);
	},
	onRender:function(ct,pos){
		Ext.ux.ImageUploader.superclass.onRender.call(this,ct,pos);	
		var field = this;					
		if(!field.mainPanel){
			this.imageCutterConfig = Ext.applyDeep(this.imageCutterConfig,{
				resRoot:this.resRoot,
				scope:field,
				uploadSuccess:function(img){
					var values = {
						picUrl:img.url,
						width:img.width,
						height:img.height,
						status:1,
						"byte":img.byte
					}
					this._addSlideItem(values);
				},
				listeners:{
					render :function(obj){
						this.el.setDisplayed(false);
						this.buttonEl.setDisplayed(false);
					}
				}
			});
			this.imageCutter = new Ext.ux.ImageCutter(this.imageCutterConfig);
			this.store = new Ext.data.JsonStore({ 
				root:"",
				fields:['picUrl','error',
				{name:'byte',type:'int'},
				{name:'width',type:'int'},
				{name:'height',type:'int'},
				{name:'status',type:'int'}]
			});

			this.itemTpl = new Ext.XTemplate(
				'<tpl for=".">',
					'<div class="thumb-wrap" id="{name}">',
						'<div class="thumb"><a href="{picUrl}" target="_blank"><img src="{picUrl}" title="{title}"></a></div>',
						'<span class="x-info"><label class="image-size">{width}×{height}</label><label class="image-kbs">{kbs}</label></span>',
						this.insertToDocumentEnable?'<tpl if="values.status!==0"><span class="x-btn"><a href="javascript:"  class="x-insert">'+ this.insertToDocumentText +'</a></span></tpl>':'',
						'<tpl if="values.status===0 && !values.error"><span class="x-loading"><img src="'+ this.resRoot + 'img/loading.gif"></span></tpl>',
						'<tpl if="values.error"><span class="x-error">{error}</span></tpl>',
						'<a class="x-close" title="删除">X</a>',
					'</div>',
				'</tpl>',
				'<div class="x-clear"></div>'
			);
			
			var mainPanel = new Ext.Panel({
				title:this.title,
				width:field.width||800,
				anchor:field.anchor,
				frame:true,
				autoHeight:true,
				collapsible:true,
				layout:'fit',
				cls:"ux-ImageUploader",
				items: new Ext.DataView({
					store: this.store,
					tpl: this.itemTpl,
					autoHeight:true,
					multiSelect: true,
					overClass:'x-view-over',//鼠标悬停item时的类样式,defaults to undefined
					itemSelector:'div.thumb-wrap',//必须项,值为item选择器,此值也可为.thumb-wrap  e.g. div.some-class
					emptyText: '没有图片',

					plugins: [
						//new Ext.DataView.DragSelector(),//拖拽选择
					],
					prepareData: function(data){//数据预处理,即数据处理前.data为原始数据,类型为对象.
						data.kbs =Ext.util.Format.fileSize(data.byte);
						return data;
					}
				}),
				
				tools:[{
					id:'help',
					qtip :'帮助',	
					handler: function(e, target, panel){
						Ext.Msg.alert('帮助','图片批量上传控件，并提供图片预览、裁图、加水印、插入正文等功能');						
					}
				}],
				
				tbar:[{
					text:"一键清空",
					scope:field,
					iconCls :'delField',
					handler:this.clearSlide
				},
				this._getWaterMarkButtonConfig()||{
					xtype:'tbspacer'
				},{
					xtype:'tbfill'
				},{
					xtype:'checkbox',
					boxLabel:"上传时添加水印",
					name:"chkAddWM",
					checked:this.mustAddWarterMark,
					listeners:{
						scope:this,
						"check":function(obj,checked){
							this.mustAddWarterMark = checked;
						}
					}
				},{
					xtype:'combo',
					triggerAction:"all",
					valueField : 'value',
					displayField : 'text',
					typeAhead: false,
					editable:  false,
					forceSelection:true,
					mode:'local',
					width:55,
					dataSource:(function(config){
						var dataSource = [];	
						for(var i=0;i<config.length;i++){
							var item = config[i].item;
							dataSource.push([item.url,item.text]);
						}
						return dataSource;
					})(this.waterMarkImageButtons),
					listeners:{
						scope:this,
						"change":function(obj,newValue,oldValue){
							this.currentWarterMarkImageUrl = newValue;
						}
					}
				},{
					text:"批量上传图片",
					scope:field,
					iconCls :'addField',
					handler:function(){
						this.mainPanel.body.child("input[type=file]").dom.click();
					}
				},{
					text:this.imageCutterConfig.button_text || "裁图&上传",
					scope:field,
					iconCls :'cutField',
					handler:function(){
						this.imageCutter.buttonEl.dom.click();
					}
				},this.imageCutter],
				
				html:this.fileInputHtml
			});
		}
		//this.el = mainPanel.el;
		this.mainPanel = mainPanel;
		this.mainPanel.render(ct);
		this.mainPanel.field = this;
		this._bindEvents();
		this.setValue(this.value);
	},	
	_andWaterMarkAll:function(url){
		var that = this;
		var _url = url;
		Ext.MessageBox.confirm("确认框","确定要给全部图片添加水印吗?",
			function(button,text){
				if(button=='yes'){ 
					var items = that.portal.items.items[0].items;
					for(var i=items.length-1;i>=0;i--){
						var panel = items.itemAt(i);
						panel.addWaterMark(_url);
					}
				}
			}
		);
	},
	_getWaterMarkButtonConfig:function(){
		if(this.warterMarkEnable==false) return null;
		var btnAddWaterMark=null;
		var btnWaterConfig = this.waterMarkImageButtons;
		if(btnWaterConfig){
			if(btnWaterConfig.length==1){
				var btn = btnWaterConfig[0].item;
				btnAddWaterMark = new Ext.Button({
					text:"全部添加水印",
					scope:{scope:this,url:btn.url},
					handler:function(){
						this.scope._andWaterMarkAll(this.url);
					}
				});
			}else if(btnWaterConfig.length>1){
				var mIems=[];
				for(var i=0;i<btnWaterConfig.length;i++){
					var btn = btnWaterConfig[i].item;
					mIems.push({
						"text":btn.text,
						scope:{scope:this,url:btn.url},
						handler:function(){
							this.scope._andWaterMarkAll(this.url);
						}
					});
				}
				var menu = new Ext.menu.Menu({
					items:mIems
				});
				btnAddWaterMark = new Ext.Button({
					text:"全部添加水印",
					menu: menu
				});
			}
		}
		return btnAddWaterMark;
	},
	_bindEvents:function(){
		var win = this.mainPanel;
		var fileInputEl = win.body.child("input[name=addImage]");
		!fileInputEl.hasChangeEvent && fileInputEl.on("change",this._fileInputOnchange,this);
		fileInputEl.hasChangeEvent = true;
		
		//绑定图片删除和插入事件
		win.body.on("click",function(e,obj){
			if(obj.className.indexOf("x-close")!=-1){
				var index = this._indexOfSlideItem(obj);
				this._removeSlideItem(index);
			}else if(obj.className.indexOf("x-insert")!=-1){
				var index = this._indexOfSlideItem(obj);
				if(typeof this.insertToDocumentHandler=="function"){
					this.insertToDocumentHandler.call(this,this.store.getAt(index).data);
				}
			}
		},this);
					
	},
	_fileInputOnchange:function(evt){
		//阻止默认事件
		evt.stopPropagation();
		evt.preventDefault();
		var win = this.mainPanel;
		var field = this;
		//搜集文件
		var files = evt.target.files||[];
		var arrFiles=[];
		for(var i = 0, iLen = files.length; i< iLen; i++)
		{
			var file = files[i];
			if (file.type.indexOf("image") == 0) {
				if (file.size >= field.fileMaxSize) {
					Ext.Msg.alert('该"'+ file.name +'"图片大小过大('+ (file.size/1000) +'k)，应小于'+ field.fileMaxSize/1000 +'k');	
				} else {
					arrFiles.push({file:file});	
				}			
			} else {
				Ext.Msg.alert('文件"' + file.name + '"不是图片。');	
			}
		}
		
		//在图片portal上预览
		win.files = arrFiles;
		var appendImage = function(index){
			var win = this;
			var currentIndex = index;
			return function(){
				if(win.files.length<=currentIndex) {
					//开始上传
					for (var i = 0, fileJson; fileJson = win.files[i]; i++) {
						console.log("正在上传" + i);
						var file = fileJson.file;
						var reader = new FileReader();
						reader.onload = (function(fileJson) {
							var record = fileJson.record;	
							return function(e){
								//portlet.setImage(e.target.result,true);
								record.set("picUrl",e.target.result);
								record.set("byte",e.total);

								var image=new Image();
								image.onload=(function(that){
									var record = that.record;
									return function(){
										record.set("width",this.width);
										record.set("height",this.height);
										field._doUpload(that);//开始上传			
									}
								})(fileJson);
								image.src =e.target.result;
							}
						})(fileJson);
						reader.readAsDataURL(file);	
					}
					
					return;
				}
				var lastRecord = field._addSlideItem({picUrl:"",status:0});
				win.files[currentIndex].record = lastRecord;
				appendImage.call(win,currentIndex+1)();
				
			}
		}
		appendImage.call(win,0)();
		field._resetFileInput();
	},
	_resetFileInput:function(){
		var filtInput = this.mainPanel.body.child("input[name=addImage]");
		//if(filtInput) Ext.DomHelper.overwrite(filtInput,this.fileInputHtml);
		//this._bindEvents();
		filtInput.dom.value="";
	},
	_doUpload:function(fileJson){
		var field = this;
		var file = fileJson.file;
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {
			// 上传中
			xhr.upload.addEventListener("progress", (function(record){
				return function(e) {
					if(e.lengthComputable){
						//var percent=Math.round(e.loaded*100/e.total);  //上传字节数的百分比
						//record.setProgress(percent);
					}
				}	
			})(fileJson.record), false);

			// 文件上传成功或是失败
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
					var record = fileJson.record;
					if (xhr.status == 200) {
						//成功 xhr.responseText
						var ret = Ext.decode(xhr.responseText);
						if(ret.success){
							var url;
							if(field.mustAddWarterMark && field.currentWarterMarkImageUrl){
								url = Ext.decode(ret.message).bigDimen;
							}else{
								url = ret.message;
							}
							record.set("picUrl",url);
							record.set("status",1);
							record.set("error","");
						}else{
							record.set("error",'<font color="red">上传失败，请重试</font>');
						}
					} else {
						record.set("error",'<font color="red">上传失败</font>');
					}
				}
			};
			// 开始上传
			
			if(field.mustAddWarterMark && field.currentWarterMarkImageUrl){//上传时加水印
				xhr.open("POST", field.uploadAndWaterMarkUrl, true);
				//使用FormData处理需要上传的数据
		//参数说明：filedataFileName、filedata、extradata:{isSync,distributeURL,watermarkUrl,watermarkPos:"southeast",bigDimen:{width,height},thumbList},
				var extradata={
					isSync:!field.syncflag,//同步
					distributeURL:field.domains[parseInt(Math.random()*field.domains.length)],
					watermarkUrl:field.currentWarterMarkImageUrl,
					watermarkPos:field.waterMarkPositon,
					bigDimen:JSON.stringify({width:fileJson.record.data.width,height:fileJson.record.data.height}),
					thumbList:"[]"
				};
				var oParam={
					extradata:JSON.stringify(extradata),
					filedataFileName:file.name
				}
			}else{
				xhr.open("POST", field.uploadUrl, true);
				//使用FormData处理需要上传的数据
				var imgInfo = fileJson.record.data;
				var oParam={
					domain:field.domains[parseInt(Math.random()*field.domains.length)],
					suffix:'_size'+ Math.round(imgInfo.byte/1024) +'_w'+ imgInfo.width +'_h'+ imgInfo.height,
					syncflag:field.syncflag,//同步
					filedataFileName:file.name
				}
			}
			var fd = new FormData();
			for( var j in oParam) {
				fd.append(j,oParam[j]);
			}
			fd.append("filedata", file);
			xhr.send(fd);
		}
	},
	clearSlide:function(){
		this.store.loadData({});
	},
	_addSlideItem:function(item){	
		this.store.loadData([item],true);
		return this.store.getAt(this.store.getCount()-1);
	},
	_removeSlideItem:function(index){	
		this.store.remove(this.store.getAt(index));
	},
	_indexOfSlideItem:function(obj){
		var i=0;
		var el = Ext.fly(obj).parent(".thumb-wrap");
		while(el.prev()){
			i++;
			el=el.prev()
		}
		return i;
	},
	initView:function(){	
		var value = this.value;
		if(value){	
			if(typeof value=="string"){
				try{var value = JSON.parse(value);}catch(e){
					Ext.CMPP.warn('错误','数据格式错误');	
					return;
				}		
			}
			if(value) this.store.loadData(value.image||[]);
		}	
	},
	setValue:function(v){
		this.value = v;
		if(this.rendered){
			this.el.dom.value = (v === null || v === undefined ? '' : v);
		} 
		if(this.rendered && this.store){
			try{var data = JSON.parse(v);}catch(ex){}
			if(data) this.store.loadData(data.image||[]);
		}
	},
	getValue:function(){
		var v=[];
		this.store.each(function(r){
			var data = Ext.apply({},r.data);
			delete data.status;
			delete data.error;
			v.push(data);
		});
		var value = JSON.stringify({
			image:v	
		});
		this.value = value;
		if(this.rendered){
			this.el.dom.value = (value === null || value === undefined ? '' : value);
		}
		return value;
	}
});

Ext.reg('slideeditor', Ext.ux.ImageUploader);
