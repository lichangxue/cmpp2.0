/*
*幻灯片编辑器控件
*支持排序、多缩略图、图注功能
*author:cici
*date:2013/7/18
*依赖js： controls/Ext.ux.SlideEditor.js;controls/Ext.ux.Portal.js;controls/Ext.ux.ImageCutter.js ;
*依赖css：css/portal.css css/Ext.ux.SlideEditor.css
*/

Ext.ux.SlideEditor = function (config) {	
	if(typeof config.domains==="string"){
		config.domains = Ext.decode(config.domains);
	}
	if(config.waterMarkImageButtons && typeof config.waterMarkImageButtons==="string"){
		try{
			config.waterMarkImageButtons = Ext.decode(config.waterMarkImageButtons);
		}catch(ex){
			
		}
	}
	if(config.imageCutterConfig && typeof config.imageCutterConfig==="string"){
		try{config.imageCutterConfig = Ext.decode(config.imageCutterConfig);}catch(ex){}
	}
	
	Ext.ux.SlideEditor.superclass.constructor.call(this, config);
}
Ext.extend(Ext.ux.SlideEditor, Ext.form.Field, {
	/****/
	domains:['p0.ifengimg.com','p1.ifengimg.com','p2.ifengimg.com','p3.ifengimg.com'],
	fileMaxSize:1024000,
	uploadUrl:'../runtime/upload!file.jhtml',
	uploadAndWaterMarkUrl:'../runtime/upload!img.jhtml',//上传并添加水印 参数说明：filedataFileName、filedata、extradata:{isSync,distributeURL,watermarkUrl,watermarkPos:"southeast",bigDimen:{width,height}},
	waterMarkUrl:'upload!waterMark.jhtml',//加水印接口url
	currentWarterMarkImageUrl:"",//水印url地址
	mustAddWarterMark:false,//上传时添加水印吗
	waterMarkEnable:true,//水印功能是否开启
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
	thumbEnable:true,//缩略图功能是否开启
	
	insertToDocumentHandler:"(function(){})",//插入到正文的函数代码
	titleVisible:true,//标题输入框是否可见
	descriptionVisible:true,//描述输入框是否可见
	linkVisible:true,//链接输入框是否可见
	msgTarget :"under",
	fileInputHtml:'<input name="addImage"  type="file" accept="image/*" style="position: absolute;opacity: 0;cursor: pointer;top: 0;left:-2500px;z-index: 100;" size="30"  name="fileselect[]" multiple/><input name="addThumbImage"  type="file" accept="image/*" style="position: absolute;opacity: 0;cursor: pointer;top: 0;left:-2500px;z-index: 100;" size="30"  name="fileselect[]" multiple/>',
	initComponent: function () {
		Ext.applyDeep(this,this.initialConfig);
		this.autoCreate = { tag: 'input', type: 'hidden', name: this.initialConfig.name || "" };
		Ext.ux.SlideEditor.superclass.initComponent.call(this);
	},
	onRender:function(ct,pos){
		Ext.ux.SlideEditor.superclass.onRender.call(this,ct,pos);	
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
			
			var mainPanel = new Ext.Panel({
				title:this.title|| "幻灯编辑器",
				width:field.width||800,
				anchor:field.anchor,
				//height:field.height||600,
				autoHeight:true,
				collapsible:true,
				titleCollapse :true,
				autoScroll:true,
				//layout:"fit",
				cls:'slideEditor',
				tools:[{
					id:'help',
					qtip :'帮助',	
					handler: function(e, target, panel){
						Ext.Msg.alert('帮助','您可以通过拖拽来排序,排序时可以点击”全部收起/展开“按钮，展示更多图片。');						
					}
				}],
				items:[{
					xtype:'portal',
					region:'center',
					margins:'35 5 5 0',
					//autoHeight:true,
					border:false,
					//style:'border:none;overflow-y:scroll;max-height:'+((this.height||600)-50)+'px;',
					style:'border:none;',
					items:[{
						columnWidth:1,
						style:'padding:10px;'
					}],
					listeners:{
						scope:this,
						"drop":function(){
							//更新序号
							this._updateSlideTitle();
						}
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
					xtype:'tbspacer'
				},this.thumbEnable==false?{
					xtype:'tbspacer'
				}:{
					boxLabel:"显示全部缩略图",
					xtype:'checkbox',
					listeners:{
						scope:this,
						"check":function(obj,checked){
							var items = this.portal.items.items[0].items;
							for(var i=items.length-1;i>=0;i--){
								var panel = items.itemAt(i);
								panel.setThumbVisible(checked);
							}
							
						}
					}
				},{
					text:"收起/展开",
					enableToggle:true, 	
					scope:field,
					handler:function(btn,e){
						var items = this.portal.items.items[0].items;
						for(var i=items.length-1;i>=0;i--){
							var panel = items.itemAt(i);
							panel.setCollapse(btn.pressed);
						}
					}
				},/*{
					text:"根据排序号重排序",
					scope:field,
					handler:function(btn,e){
						this._sort();
					}
				},*/{
					xtype:'tbfill'
				},this.waterMarkEnable?{
					xtype:'checkbox',
					boxLabel:"上传时添加",
					name:"chkAddWM",
					checked:this.mustAddWarterMark,
					listeners:{
						scope:this,
						"check":function(obj,checked){
							this.mustAddWarterMark = checked;
						}
					}
				}:' ',this.waterMarkEnable?{
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
				}:' ',this.waterMarkEnable?{
					xtype:'label',
					text:'水印'
				}:' ',{
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
		this.portal = mainPanel.items.items[0];	
		this._initPortal(this);
		this._bindEvents();
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
		});
	},
	_getWaterMarkButtonConfig:function(){
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
		!fileInputEl.hasChangeEvent && fileInputEl.on("change",this._fileInputOnchange,win);
		fileInputEl.hasChangeEvent = true;
					
	},
	_fileInputOnchange:function(evt){
		//阻止默认事件
		evt.stopPropagation();
		evt.preventDefault();
		var win = this;
		var field = win.field;
		//搜集文件
		var files = evt.target.files||[];
		var arrFiles=[];
		for(var i = 0, iLen = files.length; i< iLen; i++)
		{
			var file = files[i];
			if (file.type.indexOf("image") == 0) {
				if (file.size >= win.field.fileMaxSize) {
					Ext.Msg.alert('该"'+ file.name +'"图片大小过大('+ (file.size/1000) +'k)，应小于'+ win.field.fileMaxSize/1000 +'k');	
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
						(function(fileJson) {
							var file = fileJson.file;
							var reader = new FileReader();
							reader.onload = (function(fileJson) {
								var portlet = fileJson.portlet;
								return function(e){
									//portlet.setImage(e.target.result,true);
									var imgDom = portlet.body.child('img[name=picUrl]').dom;
									imgDom.style.visibility="hidden";
									imgDom.src=e.target.result;
									var image=new Image();
									image.onload=(function(that){
										var t = that.portlet;
										return function(){
											t.setImageInfo({
												size:{width:this.width,height:this.height}
											});	
											t.imageSize = {width:this.width,height:this.height};
											t.field._doUpload(that);//开始上传			
										}
									})(fileJson);
									image.src =e.target.result;
									portlet.setImageInfo({
										byte:e.total
									});			
								}
							})(fileJson);
							reader.readAsDataURL(file);
								
						})(fileJson);	
					}
					
					return;
				}
				var p = field._addSlideItem({picUrl:""});
				var portal = field.portal;
				win.files[currentIndex].portlet = p;
				portal.doLayout();
				portal.el.dom.scrollTop = portal.el.dom.scrollHeight;
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
		var that = fileJson.portlet.field;
		var file = fileJson.file;
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {
			// 上传中
			xhr.upload.addEventListener("progress", (function(portlet){
				return function(e) {
					if(e.lengthComputable){
						var percent=Math.round(e.loaded*100/e.total);  //上传字节数的百分比
						portlet.setProgress(percent);
					}
				}	
			})(fileJson.portlet), false);

			// 文件上传成功或是失败
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
					var p = fileJson.portlet;
					if (xhr.status == 200) {
						//成功 xhr.responseText
						var that = p.field;
						var ret = Ext.decode(xhr.responseText);
						if(ret.success){
							var url;
							if(that.mustAddWarterMark && that.currentWarterMarkImageUrl){
								p.btnAddWaterMark.disable();
								p.btnAddWaterMark.setText("已添加水印");
								url = Ext.decode(ret.message).bigDimen;
							}else{
								url = ret.message;
							}
							p.originalPicUrl = url;
							p.setImage(url);
							p.setProgress(100);
							
						}else{
							p.setTitle('<font color="red">上传失败，请重试</font>');
						}
					} else {
						p.setTitle('<font color="red">上传失败</font>');
					}
				}
			};
			// 开始上传
			
			if(that.mustAddWarterMark && that.currentWarterMarkImageUrl){//上传时加水印
				xhr.open("POST", that.uploadAndWaterMarkUrl, true);
				//使用FormData处理需要上传的数据
		//参数说明：filedataFileName、filedata、extradata:{isSync,distributeURL,watermarkUrl,watermarkPos:"southeast",bigDimen:{width,height},thumbList},
				var extradata={
					isSync:!that.syncflag,//同步
					distributeURL:that.domains[parseInt(Math.random()*that.domains.length)],
					watermarkUrl:that.currentWarterMarkImageUrl,
					watermarkPos:that.waterMarkPositon,
					bigDimen:JSON.stringify(fileJson.portlet.imageSize),
					thumbList:"[]"
				};
				var oParam={
					extradata:JSON.stringify(extradata),
					filedataFileName:file.name
				}
			}else{
				xhr.open("POST", that.uploadUrl, true);
				//使用FormData处理需要上传的数据
				var imgInfo=fileJson.portlet.imageSize;
				var imgByte=fileJson.portlet.imageByte;
				var oParam={
					domain:that.domains[parseInt(Math.random()*that.domains.length)],
					syncflag:that.syncflag,//同步
					filedataFileName:file.name,
					suffix:'_size'+ Math.round(imgByte/1024) +'_w'+ imgInfo.width +'_h'+ imgInfo.height
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
	
	_initPortal:function(field){	
		this.clearSlide();
		var value = field.value;
		if(value){	
			if(typeof value=="string"){
				try{var value = Ext.decode(value);}catch(e){
					Ext.CMPP.warn('错误','幻灯数据格式错误');	
					return;
				}		
			}
			var portal = this.mainPanel.items.items[0];
			var slide=[];
			if(value.image){
				for(var i=0;i<value.image.length;i++){
					var item = value.image[i];
					slide.push(item);
				}
				for(var i=0;i<slide.length;i++){
					var it = slide[i];
					var slidePanel = {
						xtype:'slidepanel',
						waterMarkUrl:it?it.waterMarkUrl:null,
						originalPicUrl:it?it.picUrl:null,		
						value:it,
						slideNumber:i+1
					};
					slidePanel.field = field;
					
					var p = portal.items.itemAt(0).add(slidePanel);
					p.field = field;
					portal.doLayout();
					if(value.mainImage==i){
						p.setMain();
						this.mainSlide = p;
					}
				}
			}
		}
			
	},
	_addSlideItem:function(values){
		var portal = this.portal;
		var length = portal.items.items[0].items.length;
		var slidePanel = {
			xtype:'slidepanel',
			originalPicUrl:values?values.picUrl:null,
			waterMarkUrl:values?values.waterMarkUrl:null,
			value:values,
			slideNumber:length+1
		};
		slidePanel.field = this;
		
		var p = portal.items.itemAt(0).add(slidePanel);
		p.field = this;
		
		portal.doLayout();
		return p;
	},
	_sort:function(){
		var items = this.portal.items.items[0].items;
		var plist=[];
		for(var i=items.length-1;i>=0;i--){
			var panel = items.itemAt(i);
			plist.push(panel);
		}
		plist.sort(function(a,b){
			var value1 = a.order4Sort || a.getOrderValue4Sort(),value2 = b.order4Sort || b.getOrderValue4Sort();
			return value1-value2
		});
		//this.clearSlide();
		for(var i=plist.length-1;i>=0;i--){
			panel = plist[i];
			panel.el.dom.parentNode.removeChild(panel.el.dom);
			var c = panel.field.portal.items.itemAt(0);
			c.insert(0,panel);
			c.doLayout();
			panel.updateTitle({order:i+1});
		}
	},
	//改变位置
	_changeOrder:function(newPosition,oldPosition){
		if(newPosition==oldPosition) return;
		oldPosition = parseInt(oldPosition);
		newPosition = parseInt(newPosition);
		if(isNaN(newPosition) || isNaN(oldPosition)) return;
		var items = this.portal.items.items[0].items;
		var panel = items.itemAt(oldPosition-1);
		if(newPosition>items.length) newPosition=items.length;
		if(newPosition>oldPosition) newPosition += 0.1;
		else newPosition -= 0.1;
		panel.order4Sort = newPosition;
				
		this._sort();
	},
	clearSlide:function(){
		var portal = this.portal;
		var items = portal.items.items[0].items;
		for(var i=items.length-1;i>=0;i--){
			var panel = items.itemAt(i);
			panel.ownerCt.remove(panel, true);
		}
		this.mainSlide = null;
	},
	_updateSlideTitle:function(){
		var items = this.portal.items.items[0].items;
		for(var i=0;i<items.length;i++){
			var p = items.itemAt(i);
			if(p){
				p.updateTitle({
					order:i+1
				});
				if(this.mainSlide==p){
					p.setMain();
				}

			}
		}
	},
	setTitle:function(order,ext){
		var html = '顺序号:<input type="text" value="'+ order +'"/>';
		Ext.ux.SlideEditor.superclass.setTitle.call(this,title);
	},
	setValue:function(v){
		this.value = v;
		if(this.rendered){
			this.el.dom.value = (v === null || v === undefined ? '' : v);
		} 
		if(this.rendered && this.portal){
			this._initPortal(this);
		}
	},
	getValue:function(){
		var v={image:[]};
		v.mainImage = this.mainSlide?this.mainSlide.slideNumber-1:0;
		var items = this.portal.items.items[0].items;
		for(var i=0;i<items.length;i++){
			var p = items.itemAt(i);
			var itemValue = p.getValue();
			//if(itemValue==null){
			//	Ext.CMPP.warn("提示","有些图片正在上传");
			//}
			p && itemValue && v.image.push(itemValue);
		}
		if(v.image.length==0){
			delete v.mainImage;
			delete v.image;
		}
		var value = Ext.encode(v);
		//Ext.ux.SlideEditor.superclass.setValue.call(this,value);
		this.value = value;
		if(this.rendered){
			this.el.dom.value = (value === null || value === undefined ? '' : value);
		}
		return value;
	},
	validateValue : function(value){
		var value = this.getValue();
        if(value.length < 1 || value === this.emptyText){              
			if(this.allowBlank){
                 this.clearInvalid();
                 return true;
             }else{
                 this.markInvalid(this.blankText);
                 return false;
             }
        }
		if(typeof this.validator == "function"){
            var msg = this.validator(value);
            if(msg !== true){
                this.markInvalid(msg);
                return false;
            }
        }
		return true;
	},
	validator:function(value){
		try{
			var value = Ext.decode(value);
			if(value.image.length !=this.portal.items.items[0].items.length){  
				var msg = '还有些图片尚未上传完成或上传失败，<br>您可以移除上传失败的图片重新上传。';	
				Ext.CMPP.warn("提示",msg);
				return msg;  
			}  
		}catch(ex){
			
		}
		return true;
	}
		
});

Ext.ux.slidePanel = function (config) {	
	var tools = [{
		id:'minus',
		qtip :'收起',	
		scope:this,
		cls:'collapse',
		handler: function(e, target, panel){
			this.setCollapse(!this.collapsed);		

		}	
	},{
		id:'close',
		qtip :'移除',	
		scope:this,
		handler: function(e, target, panel){
			if(panel==panel.field.mainSlide){
				panel.field.mainSlide = null;
			}
			panel.el.fadeOut({
				endOpacity: 0,
				easing: 'easeOut',
				duration: .3,
				useDisplay: false,
				callback:function(){
					panel.ownerCt.remove(panel, true);
					//更新排序号
					panel.field._sort();
				}
			});	
			
		}
	},{
		id:'up',
		qtip :'置顶',
		scope:this,
		handler: function(e, target, panel){
			//动画
			var size = panel.el.getSize();
			var dis = panel.el.getTop()-panel.ownerCt.el.getTop();
			panel.proxy = panel.el.createProxy({tag:'div',style:'width:'+size.width+'px;height:'+size.height+'px;border:1px dashed'});
			panel.el.setDisplayed(false);
			panel.proxy.move('up',dis,{
				scope:panel,
				callback :function(el){
					var panel = this;
					panel.proxy.remove();
					panel.el.setDisplayed(true);
					panel.el.dom.parentNode.removeChild(panel.el.dom);
					var c = this.field.portal.items.itemAt(0);
					c.insert(0,panel);
					c.doLayout();
					this.field._updateSlideTitle();
				}
			});	
		}
	}];
	config.tools = tools;
	config.tbar = [{
		xtype:'label',
		text:"排序号:"
	},{
		xtype:'numberfield',
		name:'slide-order',
		width:30,
		value:config.slideNumber,
		listeners:{
			scope:this,
			change:function(obj,newValue,oldValue){
				this.field._changeOrder(newValue,oldValue);
			},
			specialkey:function(obj,e){
				if(e.getKey()==Ext.EventObject.ENTER){
					var oldValue = obj.value,newValue=e.target.value;
					this.field._changeOrder(newValue,oldValue);
				}
			}
		}
	},{
		text:"设为主图",
		scope:this,
		handler:function(){
			this.setMain();
		}
	},{
		xtype:'tbfill'
	}];
	
	if(config.field.insertToDocumentEnable){
		try{
			var insertToDocumentHandler = eval('(' + config.field.insertToDocumentHandler + ")");
		}catch(e){
			Ext.CMPP.warn('幻灯片编辑器insertToDocumentHandler参数配置不正确');
		}
		if(typeof insertToDocumentHandler=='function'){
			config.tbar.push({
				text:config.field.insertToDocumentText,
				scope:this,
				handler:insertToDocumentHandler
			});
		}
	}
	var btnAddWaterMark;
	var btnWaterConfig = config.field.waterMarkImageButtons;
	if(btnWaterConfig){
		if(btnWaterConfig.length==1){
			var btn = btnWaterConfig[0].item;
			btnAddWaterMark = new Ext.Button({
				text:config.waterMarkUrl?"已添加水印":btn.text,
				scope:{scope:this,url:btn.url},
				disabled:config.waterMarkUrl?true:false,
				handler:function(){
					this.scope.addWaterMark(this.url);
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
						this.scope.addWaterMark(this.url);
					}
				});
			}
			var menu = new Ext.menu.Menu({
				items:mIems
			});
			btnAddWaterMark = new Ext.Button({
				text:config.waterMarkUrl?"已添加水印":"添加水印",
				disabled:config.waterMarkUrl?true:false,
				menu: menu
			});
		}
		if(btnAddWaterMark){
			this.btnAddWaterMark=btnAddWaterMark;
			config.tbar.push(btnAddWaterMark);
		}
	}
	
	config.tbar.push(/*{
		boxLabel:"是否添加水印",
		xtype:'checkbox',
		name:'waterMark'
	},*/{
		xtype:'tbspacer'
	},{
		text:"统一图注",
		scope:this,
		handler:function(){
			var values = this.getValue();	
			var items = this.field.portal.items.items[0].items;
			for(var i=0;i<items.length;i++){
				var p = items.itemAt(i);
				p && p.setDescription(values.description);
			}
		}
	});
	var itemTpl = new Ext.XTemplate('<div class="slide-item"><div name="picUrl" class="image-ct"><div class="image-content"><a name="picUrlLink" target="_blank" href=""><img width="100" name="picUrl" src="" /></a></div><div class="image-info"><label class="image-size"></label><label class="image-kbs"></label></div><div style="display:none;" class="progress"><span class="green" style="width:90%;">90%</span></div></div><div class="form-horizontal"  style="margin: 3px 3px 3px 103px;"><div class="control-group {titleHideCls}"><label class="control-label" for="content">标题:</label><div class="controls"><input name="title"  type="text" style="width: 98%;"/></div></div><div class="control-group {descriptionHideCls}"><label class="control-label" for="content">图注:</label><div class="controls"><textarea name="description" class="input-small" type="text" style="width: 98%;height:70px;"></textarea><span class="control-span"></span></div><div class="control-group {descriptionHideCls}"><label class="control-label" for="content">短图注:</label><div class="controls"><textarea name="description_mini" class="input-small" type="text" style="width: 98%;height:40px;"></textarea><span class="control-span"></span></div></div><div class="control-group {linkHideCls}"><label class="control-label" for="content">链接:</label><div class="controls"><input name="link" type="text" style="width: 98%;"/></div></div><div class="control-group thumb-tool"><label><input type="checkbox" name="thumbVisible">显示缩略图</label><input type="button" value="上传缩略图"></div><divclass="control-group thumb"><ul style="display:none;"  class="thumb-ul"></ul></div> </div></div><img style="display:none;" height="60" src="" name="picUrl-collapse">');
	config.itemTpl = itemTpl;
	config.thumbTpl = new Ext.XTemplate('<li>',
		'<div class="thumb-remove"><span style="background:url('+ config.field.resRoot +'img/runTime/delete.png)" title="移除"></span></div>',
		'<div class="shortcutImage">',
			'<a href="" target="_blank"><img height="50" src=""></a>',
		'</div>',
		'<div class="shortcutText"></div>',
		'<div style="display:none;" class="progress"><span class="green" style=""></span></div>',
	'</li>');
	config.titleTpl = new Ext.XTemplate('图片-<label class="order-label">{order}</label><label class="setmain-label">{main}</label>');
	config.title=config.titleTpl.applyTemplate({order:config.slideNumber,main:''});
	Ext.ux.slidePanel.superclass.constructor.call(this, config);
}
Ext.extend(Ext.ux.slidePanel, Ext.ux.Portlet, {
	slideNumber:null,//序号 从1开始
	collapsible :false,	
	imageByte:null,
	waterMarkUrl:null,//加水印后的图片地址
	originalPicUrl:null,//原图图片地址
    initComponent : function(){
		Ext.applyDeep(this,this.initialConfig);
		//this.html = this.itemTpl.applyTemplate(this.value);
        Ext.ux.slidePanel.superclass.initComponent.call(this);
		
    },
	onRender:function(ct,pos){
		Ext.ux.slidePanel.superclass.onRender.call(this,ct,pos);	
		
		//设置值
		if(this.value){
			var field = this.field;
			this.body.update(this.itemTpl.applyTemplate({
				"titleHideCls":field.titleVisible?"":"control-hide",
				"descriptionHideCls":field.descriptionVisible?"":"control-hide",
				"linkHideCls":field.linkVisible?"":"control-hide"
			}));
			this.setValue(this.value);
			this._bindEvents();
			
		}
	},	
	_bindEvents:function(){
		var btnThumbEl = this.body.child('.thumb-tool input[type=button]');
		btnThumbEl.on('click',function(){
			this._bindUploadEvent();
			this.field.mainPanel.body.child("input[name=addThumbImage]").dom.click();
		},this);
		
		var chkView = this.body.child('.thumb-tool input[type=checkbox]');
		chkView.on('change',function(e,checkbox){
			this.setThumbVisible(checkbox.checked);
		},this);
		
		var textareas=this.body.select('textarea');
		textareas.each(function(el){
			el.on('keyup',this.showContentLenth,this);
			this.showContentLenth(null,el.dom);
		},this);		

	},
	showContentLenth:function(e,textareaEl){
		var contentLenthEl=textareaEl.nextSibling;
		if(contentLenthEl){
			var content = textareaEl.value;
			var count = this.getCharLength(content);
			var countText = '<font color="green">' + count + '</font>'; 
			contentLenthEl.innerHTML='字数:' + countText;
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
	//设为主图
	setMain:function(){
		var slide = this.field.mainSlide;
		slide && slide.updateTitle({
			main:false
		});
		this.field.mainSlide = this;
		this.updateTitle({
			main:true
		});
	},
	//设置图注
	setDescription:function(content){
		var txt = this.body.child('textarea[name=description]').dom;
		if(txt.value==""){
			txt.value=content||"";
			if(this.value) this.value={};
			this.value.description = content;
		}
	},
	//设置是否添加水印
	setWaterMark:function(enable){
		this.getTopToolbar().el.child('input[name=waterMark]').dom.checked=enable;
	},
	//设置图片
	setImage:function(imgUrl,setImageInfo){
		var img = this.body.child('img[name=picUrl]');
		img.dom.style.visibility="visible";
		var a = this.body.child('a[name=picUrlLink]').dom;
		var imgCollapse = this.body.child('img[name=picUrl-collapse]').dom; 
		a.href = imgUrl;
		img.dom.src = imgUrl;
		imgCollapse.src = imgUrl;
		if(setImageInfo){
			var image=new Image();
			image.onload=(function(that){
				var t = that;
				return function(){
					t.setImageInfo({
						size:{width:this.width,height:this.height}
					});		
				}
			})(this);
			image.src =imgUrl;
		}
	},
	setImageInfo:function(info){
		var s = info.size,b=info.byte;
		if(s){
			var label = this.body.child('label.image-size');
			label.update(s.width+ "×" + s.height);
		}
		if(b){
			this.imageByte = b;
			var label = this.body.child('label.image-kbs');
			var filesizeStr = Ext.util.Format.fileSize(b);
			label.update(parseInt(filesizeStr)+ filesizeStr.split(' ')[1].substring(0,1));
		}
	},
	setProgress:function(per){
		var progressCt = this.body.child('.progress');
		if(per>=100) {
			progressCt.dom.style.display="none";
		}else{
			progressCt.dom.style.display="block";
			progressCt.child('span').update(per + "%");		
		}
		
	},
	addWaterMark:function(waterMarkImageUrl){
		if(this.originalPicUrl && !this.waterMarkUrl ){
			var waterMarkUrl = this.field.waterMarkUrl,positon=this.field.waterMarkPostion || "southeast";
			this.el.mask("正在添加水印...");
			Ext.Ajax.request({
				"url":waterMarkUrl,
				"params":{"url":this.originalPicUrl,"waterMarkUrl":waterMarkImageUrl,"position":positon},
				"options":this,
				"success":function(xhr,options){
					var that = options.options;
					that.el.unmask();
					var ret = Ext.decode(xhr.responseText);
					if(ret.success){
						var url = ret.message;
						that.setImage(url,true);
						that.waterMarkUrl = url;
						that.btnAddWaterMark.disable();
						that.btnAddWaterMark.setText("已添加水印");
					}else{
						Ext.CMPP.warn("失败",ret.message);
					}					
							
				},
				'failure':function(xhr,options){
					var that = options.options;
					that.el.unmask();
					Ext.CMPP.warn("错误","加水印失败");
				}
			});
		}
	},
	//添加缩略图
	addThumb:function(values){
		var thumbCt = this.body.child('.thumb-ul');
		var el = thumbCt.insertHtml('beforeEnd',this.thumbTpl.applyTemplate());
		Ext.fly(el).child('.thumb-remove span').on('click',function(){
			Ext.fly(this).parent('li').remove();
		});
		if(values){
			var liEl = Ext.fly(el);	
			liEl.child('.shortcutImage img').dom.src = values.spicUrl;
			liEl.child('.shortcutImage a').dom.href = values.spicUrl;
			liEl.child('.shortcutText').update(values.swidth + "×" + values.sheight);	
		}
		return {el:el};
	},
	setThumbVisible:function(visible){
		this.body.child('.thumb-ul').setDisplayed(visible);
		this.body.child('.thumb-tool input[type=checkbox]').dom.checked = visible;
	},
	updateTitle:function(values){
		if(typeof values.order!='undefined'){
			this.getTopToolbar().el.child('input[name=slide-order]').dom.value = values.order;
			this.header.child('label.order-label').update(values.order);
			this.slideNumber = values.order;
		}
		if(typeof values.main!='undefined')
			this.header.child('label.setmain-label').update(values.main==true?'【已设为主图】':'');
	},
	/*对外接口*/
	getImage:function(){
		var picUrl = this.waterMarkUrl||this.originalPicUrl;
		var sizeStr = this.body.child('label.image-size').dom.innerHTML;	
		var size = sizeStr.split("×");
		return {url:picUrl,width:parseInt(size[0]),height:parseInt(size[1])};
	},
	_bindUploadEvent:function(){
		var fileInputEl = this.field.mainPanel.body.child("input[name=addThumbImage]");
		fileInputEl.on('change',function(e){
			this.setThumbVisible(true);
			//阻止默认事件
			var win = this;
			e.stopPropagation();
			e.preventDefault();
			//搜集文件
			var files = e.target.files||[];
			var arrFiles=[];
			for(var i = 0, iLen = files.length; i< iLen; i++){
				var file = files[i];
				if (file.type.indexOf("image") == 0) {
					if (file.size >= win.field.fileMaxSize) {
						Ext.Msg.alert('该"'+ file.name +'"图片大小过大('+ (file.size/1000) +'k)，应小于'+ win.field.fileMaxSize/1000 +'k');	
					} else {
						arrFiles.push({file:file});	
					}			
				} else {
					Ext.Msg.alert('文件"' + file.name + '"不是图片文件。请选择图片文件');	
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
							(function(fileJson) {
								var file = fileJson.file;
								var reader = new FileReader();
								reader.onload = (function(portlet) {
									return function(e){
										var p = portlet;
										var imgDom = Ext.fly(p.el).child('.shortcutImage img').dom;
										imgDom.style.visibility="hidden";
										imgDom.src = e.target.result;
										var image=new Image();
										image.onload=(function(p){
											return function(){
												Ext.fly(p.el).child('.shortcutText').update(this.width + "×" + this.height);
											}
										})(p);
										image.src = e.target.result;
									}
								})(fileJson.portlet);
								reader.readAsDataURL(file);
								var xhr = new XMLHttpRequest();
								if (xhr.upload) {
									// 上传中
									xhr.upload.addEventListener("progress", (function(portlet){
										return function(e) {
											if(e.lengthComputable){
												var percent=Math.round(e.loaded*100/e.total);  //上传字节数的百分比
												var progEl = Ext.fly(portlet.el).child('.progress span');	
												progEl.dom.style.display = percent>=100?"none":'block';
												progEl.update(percent + "%");
											}
										}	
									})(fileJson.portlet), false);
						
									// 文件上传成功或是失败
									xhr.onreadystatechange = function(e) {
										if (xhr.readyState == 4) {
											if (xhr.status == 200) {
												//成功 xhr.responseText
												var ret = Ext.decode(xhr.responseText);
												if(ret.success){
													var url = ret.message;
													var p = fileJson.portlet;
													var el = Ext.fly(p.el);
													el.child('.progress span').dom.style.display="none";
													var imgDom = el.child('.shortcutImage img').dom;
													imgDom.style.visibility="visible";
													imgDom.src = url;
													el.child('.shortcutImage a').dom.href = url;
												}
											} else {
												console.log("失败");
											}
										}
									};
									// 开始上传
									xhr.open("POST", win.field.uploadUrl, true);
									//使用FormData处理需要上传的数据
									var oParam={
										domain:win.field.domains[parseInt(Math.random()*win.field.domains.length)],
										syncflag:win.field.syncflag,//同步
										filedataFileName:file.name
									}
									var fd = new FormData();
									for( var j in oParam) {
										fd.append(j,oParam[j]);
									}
									fd.append("filedata", file);
									xhr.send(fd);
								}	
							})(fileJson);	
						}
						
						return;
					}
					var p = win.addThumb();
					win.files[currentIndex].portlet = p;
					appendImage.call(win,currentIndex+1)();
					
				}
			}
			appendImage.call(win,0)();
			
		},this,{single:true});
	},
	//收缩／展开展示
	setCollapse:function(is){
		this.body.child('.slide-item').dom.style.display=is==false?'block':'none';
		this.body.child('img[name=picUrl-collapse]').dom.style.display=is==false?'none':'block';
		var tb = this.getTopToolbar();
		if(is){
			tb.hide();
			this.header.child('.x-tool-minus').addClass('x-tool-plus');
		}else{
			tb.show();
			this.header.child('.x-tool-minus').removeClass('x-tool-plus');
		}
		this.collapsed = is;
		
	},
	setValue:function(v){
		if(typeof v =="string"){
			v = Ext.decode(v);
		}
		this.value = v;
		
		this.setImage(v.waterMarkUrl||v.picUrl);
		if(!this.originalPicUrl) this.originalPicUrl = v.picUrl;
		this.waterMarkUrl = v.waterMarkUrl;
		
		this.body.child('input[name=title]').dom.value=v.title||"";
		this.body.child('input[name=link]').dom.value=v.link||"";
		this.body.child('textarea[name=description]').dom.value=v.description||"";
		this.body.child('textarea[name=description_mini]').dom.value=v.description_mini||"";
		this.setImageInfo({
			size:v.width?{width:v.width,height:v.height}:null,
			byte:v.byte?v.byte:null
		});
		//this.setWaterMark(v.waterMark);
		if(v.shortcutsPics){
			for(var i=0;i<v.shortcutsPics.length;i++){
				this.addThumb(v.shortcutsPics[i]);
			}
		}
		
	},
	//获取填写的排序号
	getOrderValue:function(){
		return parseInt(this.getTopToolbar().el.child('input[name=slide-order]').dom.value||"50000");
	},
	//获取填写的排序号,用于数组的排序
	getOrderValue4Sort:function(){
		return parseFloat(this.getTopToolbar().el.child('input[name=slide-order]').dom.value||"50000");
	},
	setOrderValue:function(value){
		this.getTopToolbar().el.child('input[name=slide-order]').dom.value=value; 
	},
	getValue:function(){
		var b = this.body;
		var picUrl = this.originalPicUrl;
		var waterMarkUrl = this.waterMarkUrl;
		if(!Ext.form.VTypes.url(picUrl)){
			return null;
		}
		var tilte = b.child('input[name=title]').dom.value;
		var link = b.child('input[name=link]').dom.value;
		var description = b.child('textarea[name=description]').dom.value;
		var description_mini = b.child('textarea[name=description_mini]').dom.value;
		var sizeStr = b.child('label.image-size').dom.innerHTML;	
		var size = sizeStr.split("×");
		var byte = b.child('label.image-kbs').dom.innerHTML;	
		//var waterMark = this.getTopToolbar().el.child('input[name=waterMark]').dom.checked;	
		
		//缩略图
		var shortcutsPics=[];
		var thumbs = this.body.select('.thumb-ul li');
		thumbs.each(function(el){
			var item={};
			item.spicUrl = el.child('.shortcutImage img').dom.src;
			if(Ext.form.VTypes.url(item.spicUrl)){
				var wh = el.child('.shortcutText').dom.innerHTML.split("×");
				item.swidth = parseInt(wh[0]);
				item.sheight = parseInt(wh[1]);
				shortcutsPics.push(item);
			}
		},this);
		
		return {
			"picUrl":picUrl,
			"waterMarkUrl":waterMarkUrl,	
			"title":tilte,
			"link":link,
			"description":description,
			"description_mini":description_mini||"",
			"width":parseInt(size[0]),
			"height":parseInt(size[1]),
			"byte":this.imageByte,
			//"waterMark":waterMark,
			"shortcutsPics":shortcutsPics
		};
	}
    
});
Ext.reg('slidepanel', Ext.ux.slidePanel);

Ext.reg('slideeditor', Ext.ux.SlideEditor);
