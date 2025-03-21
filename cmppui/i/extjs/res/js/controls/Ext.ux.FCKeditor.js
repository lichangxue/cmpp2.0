Ext.ux.FCKeditor = function(config) {
    Ext.ux.FCKeditor.superclass.constructor.call(this, config);
    this.FCKid = 0;
    this.MyisLoaded = false;
    this.MyValue = config.value || "";
	
};

Ext.extend(Ext.ux.FCKeditor, Ext.form.TextArea, {
	resRoot:'../res/',
	enableMoreFontColors:true,
	fontColors:'',
	fontSizes:'14px;18px;20px',
	toolbarType:'icms',
	basePath:'../res/js/lib/FCKeditor/',
	baseHref:'http://ent.cmpp.ifeng.com/Cmpp/',
	skinPath:'../editor/skins/default/',
	imageToLocalUrl:'http://g.cmpp.ifeng.com/Cmpp/runtime/interface_318.jhtml?from=fck',
	attachmentTpl:new Ext.XTemplate('<tpl><blockquote class="fck_attachment fck_attachment_{attachmentType}" data-json="{[encodeURIComponent(JSON.stringify(values))]}"><textarea class="fck_attachment_viewer">{[this.typeText(values)]}{title}</textarea></blockquote></tpl>',{
		  typeText:function(values){
				var type_text={
					"video":"视频：",
					"slide":"幻灯：",
					"survey":"调查：",
					"vote":"投票：",
					"comments":"精选评论："
				};
				return type_text[values.attachmentType]||""
		  }
    }),//插入正文的附件的模板
    onRender: function(ct, position) {
        if (!this.el) {
            this.defaultAutoCreate = {
                tag: "textarea",
                style: "width:50px;height:160px;",
                autocomplete: "off"
            };
        }
        
        Ext.form.TextArea.superclass.onRender.call(this, ct, position);
        if (this.grow) {
            this.textSizeEl = Ext.DomHelper.append(document.body, {
                tag: "pre",cls: "x-form-grow-sizer"
            });
            if (this.preventScrollbars) {
                this.el.setStyle("overflow", "hidden");
            }
            this.el.setHeight(this.growMin);
        }
        if (this.FCKid == 0)
            this.FCKid = get_FCKeditor_id_value()
        setTimeout("loadFCKeditor('" + this.id + "');", 100);
		
		//创建增高和减高按钮
		var ct = this.el;
		var w = ct.getWidth();
		var addHeightEl = ct.insertSibling({
			tag:'div',
			cls:'cmpp-fckEditor-addHeight'
		},'after');
		var addHeight = addHeightEl.createChild({
			tag:'img',
			title:'增加高度',
			style:'cursor: pointer; position: relative; left: 0px; top: 0px;',
			src:this.resRoot + 'img/runTime/editor_add.jpg',
		});
		var diffHeight = addHeightEl.createChild({
			tag:'img',
			title:'减少高度',
			style:'cursor: pointer; position: relative; left: 0px; top: 0px;',
			src:this.resRoot + 'img/runTime/editor_diff.jpg',
		});
		addHeight.on('click',function(){
			this.resizeFCK("add");
		},this);
		diffHeight.on('click',function(){
			this.resizeFCK("diff");
		},this);
    },
	resizeFCK:function(type){
		var fck = Ext.get(this.id+"___Frame");
		var delta = 300;
		var minHeight = 200;
		var maxHeight = 1500;
		var originalHeight = fck.getHeight();
		
		if (type == 'add') {
			fck.setHeight(Math.min(originalHeight + delta, maxHeight));
		} else {
			fck.setHeight(Math.max(originalHeight - delta, minHeight));
		}
	},
	getFCKEditor:function(){
		return FCKeditorAPI.GetInstance(this.id);
	},
	insertAtCursor:function(html){
		this.getFCKEditor().InsertHtml(html);
	},
	//插入附件：type[video\slide\survey\vote]
	insertAttachment:function(type,json){
		json.attachmentType=type;
		var xtpl = this.attachmentTpl;
		var html = xtpl.apply(json);
		//this.insertAtCursor(html); 
		var tplEl = document.createElement("div");
		tplEl.innerHTML = html;
		this.getFCKEditor().InsertElement(tplEl.children[0]);
	},
	//外网图片本地化：转换成本网图片
	imageToLocal:function(){
		//查找图片
		var value=this.getValue();
		var div = document.createElement("div");
		div.innerHTML = value;
		var els = Ext.select("img",true,div);
		var imgArr=[];
		for(var i=0;i<els.elements.length;i++){
			var el = els.elements[i];
			var url = el.dom.src;
			if(url && url.indexOf("ifengimg.com")==-1 && url!=location.href){
				imgArr.push(el.dom.src);
			}
		}
		if(imgArr.length>0){
			this.container.mask("正在进行图片本地化...");
			
			//this._getScript(this.imageToLocalUrl+"&callback=" + encodeURIComponent("Ext.getCmp('" + this.id + "')._imageToLocalCallback") + "&url=" + encodeURIComponent(imgArr.join('|')));
			
			Ext.Ajax.request({
			   url: '../runtime/proxy!sendPost.jhtml',
			   params: { 
					url: this.imageToLocalUrl,
					from: "fck",
					//callback:"Ext.getCmp('" + this.id + "')._imageToLocalCallback",
					urls: imgArr.join('|')
				},
				scope: this,
				success: function(response){
					this.container.unmask();
				    var data= JSON.parse(response.responseText);
				    this._imageToLocalCallback(data);
				},
				failure:  function(response){
				   Ext.CMPP.warn("提示","图片本地化失败" );
				}
			});


			
		}
	},
	_imageToLocalCallback:function(data){
		//this.container.unmask();
		if(!data.success){
			Ext.CMPP.warn("提示","图片本地化失败:" + data.msg );
			return;
		}
		Ext.CMPP.alert("提示","编辑器已自动帮您完成外网图片本地化！");
		var ret = data.result;
		var imgs={};
		if(typeof ret=="string"){
			imgs[data.originalUrl]=ret;
		}else if(typeof ret=="object"){
			imgs = ret;
		}
		var content=this.getValue();
		for(var originalUrl in imgs){
			//var reg = new RegExp(originalUrl,'ig');
			//content = content.replace(reg,imgs[originalUrl]);
			content = content.replace(originalUrl,imgs[originalUrl]);
			content = content.replace(originalUrl,imgs[originalUrl]);
		}
		this.setValue(content);
	},
	_getScript:function(src,callback){
        var head=document.getElementsByTagName("head")[0];
        var js=document.createElement("script");
        js.setAttribute("src",src);
        js.onload=js.onreadystatechange=function(){
          if(!this.readyState||this.readyState=="loaded"||this.readyState=="complete"){
            head.removeChild(js);
            if(callback) callback();
          }
        }
        head.appendChild(js);
    },
    setValue: function(value) {
		//特别处理附件
		value = this._revertAttachment(value);
        this.MyValue = value;
        if (this.FCKid == 0)
            this.FCKid = get_FCKeditor_id_value();
        FCKeditorSetValue(this.FCKid, this.id, value)
        Ext.form.TextArea.superclass.setValue.apply(this, [value]);
    },
    
    getValue: function() {
        if (this.MyisLoaded) {
            var value = FCKeditorGetValue(this.id);
			//特别处理附件
			value = this._convertAttachment(value);
			this.value = value;
            Ext.form.TextArea.superclass.setValue.apply(this, [value]);
            //return this.el.getValue();
			return this.value;
        } else {
            return this.MyValue;
        }
    },
	//还原内容：处理附件
    _revertAttachment:function(content){
		var arr = content.match(/<blockquote class=\"fck_attachment(.*?)<\/blockquote>/gi);
		if(!arr) return content;
		for(var i=0;i<arr.length;i++){
			var item = arr[i];	
			var div = document.createElement("div");
			div.innerHTML = item;
			
			var jsonStr = decodeURIComponent(Ext.apply(div.children[0]).getAttributeNS("","data-json"));
			var data = JSON.parse(jsonStr);
			if(!data.attachmentType) data.attachmentType = data.dataType;
			var html=this.attachmentTpl.apply(data);
			content = content.replace(item,html);
		}
		return content;
	},
	//预处理内容：处理附件
    _convertAttachment:function(content){
		var ret = content.replace(/<textarea class=\"fck_attachment_viewer\">(.*?)<\/textarea>/gi,"<!--attachment-->")
		return ret;
	},
    getRawValue: function() {
        if (this.MyisLoaded) {
            var value = FCKeditorGetValue(this.id);
            Ext.form.TextArea.superclass.setRawValue.apply(this, [value]);
            return Ext.form.TextArea.superclass.getRawValue(this);
        } else {
            return this.MyValue;
        }
    }
});
Ext.reg('fckeditor', Ext.ux.FCKeditor);

function loadFCKeditor(element) {
	var fckEditor = Ext.getCmp(element);
    oFCKeditor = new FCKeditor(element);
    oFCKeditor.ToolbarSet = fckEditor.toolbarType;
	var skinPath = fckEditor.skinPath;
    oFCKeditor.Config['SkinPath'] = skinPath;
    oFCKeditor.Config['PreloadImages'] = skinPath + 'images/toolbar.start.gif' + ';' + 
    skinPath + 'images/toolbar.end.gif' + ';' + 
    skinPath + 'images/toolbar.bg.gif' + ';' + 
    skinPath + 'images/toolbar.buttonarrow.gif';
    oFCKeditor.BasePath = fckEditor.basePath;
	
    if(typeof fckEditor.enableMoreFontColors!=="undefined") oFCKeditor.Config['EnableMoreFontColors'] = fckEditor.enableMoreFontColors;
	if(fckEditor.fontColors) oFCKeditor.Config['FontColors'] = fckEditor.fontColors;
	if(fckEditor.fontSizes) oFCKeditor.Config['FontSizes'] = fckEditor.fontSizes;

	var oTextarea = document.getElementById( oFCKeditor.InstanceName ) ;
	var colElementsByName = document.getElementsByName( oFCKeditor.InstanceName ) ;
	var i = 0;
	while ( oTextarea || i == 0 )
	{
		if ( oTextarea && oTextarea.tagName.toLowerCase() == 'textarea' )
		break ;
		oTextarea = colElementsByName[i++] ;
	} 
	var texteareEl = Ext.fly(oTextarea);
    oFCKeditor.Height = texteareEl.getHeight();
	var width = texteareEl.getWidth();
	if(width>=200){
		oFCKeditor.Width = width;
	}
    oFCKeditor.ReplaceTextarea();

}
function FCKeditor_OnComplete(editorInstance) {
    
    Ext.getCmp(editorInstance.Name).MyisLoaded = true;
    
    editorInstance.Events.AttachEvent('OnStatusChange', function() {
		var cmp = Ext.getCmp(editorInstance.Name);
        cmp.setValue(cmp.MyValue);
    });
	//绑定粘贴事件
	
	editorInstance.Events.AttachEvent('OnPasteComplete', function() {
		setTimeout(function(){
			var cmp = Ext.getCmp(editorInstance.Name);
			cmp.imageToLocal();//图片本地化
		},200);
		return true;
    });
	
}
var FCKeditor_value = new Array();
function FCKeditorSetValue(id, name, value) {
    if ((id != undefined) && (name != undefined)) {
        if (value != undefined)
            FCKeditor_value[id] = value;
        else if (FCKeditor_value[id] == undefined)
            FCKeditor_value[id] = "";
		if(typeof 	FCKeditorAPI!=="undefined"){
			var oEditor = FCKeditorAPI.GetInstance(name);
			
			if (oEditor != undefined)
				oEditor.SetData(FCKeditor_value[id])
		}
    }
}
function FCKeditorGetValue(name) {
    if ((id != undefined) && (name != undefined)) {
        if(typeof 	FCKeditorAPI!=="undefined"){
			var oEditor = FCKeditorAPI.GetInstance(name);
			data = "";
			if (oEditor != undefined)
				data = oEditor.GetData()
			return data;
		}
		return "";
    }
}
var FCKeditor_id_value;
function get_FCKeditor_id_value() {
    if (!FCKeditor_id_value) {
        FCKeditor_id_value = 0;
    }
    FCKeditor_id_value = FCKeditor_id_value + 1;
    return FCKeditor_id_value;
}

