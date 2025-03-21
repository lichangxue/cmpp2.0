/**
 * Ext JS Library 2.0 extend
 * 树状选择器 可应用于专题栏目
 * Version : 1.1
 * Author : cici
 * Date : 2014-1-13
 */
 
//列表页左侧展开按钮插件 
Ext.grid.RowExpander = function(config){
    Ext.apply(this, config);

    this.addEvents({
        beforeexpand : true,
        expand: true,
        beforecollapse: true,
        collapse: true
    });

    Ext.grid.RowExpander.superclass.constructor.call(this);

    if(this.tpl){
        if(typeof this.tpl == 'string'){
            this.tpl = new Ext.Template(this.tpl);
        }
        this.tpl.compile();
    }

    this.state = {};
    this.bodyContent = {};
};

Ext.extend(Ext.grid.RowExpander, Ext.util.Observable, {
    header: "",
    width: 20,
    sortable: false,
    fixed:true,
    menuDisabled:true,
    dataIndex: '',
    id: 'expander',
    lazyRender : true,
    enableCaching: true,
	field:null,//上下文
    getRowClass : function(record, rowIndex, p, ds){
        p.cols = p.cols-1;
        var content = this.bodyContent[record.id];
        if(!content && !this.lazyRender){
            this.setBodyContent(p.body,record, rowIndex);
        }
        return this.state[record.id] ? 'x-grid3-row-expanded' : 'x-grid3-row-collapsed';
    },

    init : function(grid){
        this.grid = grid;

        var view = grid.getView();
        view.getRowClass = this.getRowClass.createDelegate(this);

        view.enableRowBody = true;

        grid.on('render', function(){
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },

    setBodyContent : function(body,record, index){
        if(!this.enableCaching){
            body.innerHTML = this.tpl.apply(record.data);
			return;
        }
        var content = this.bodyContent[record.id];
        if(!content){
			Ext.Ajax.request({
			   url: this.field.proxyUrl?this.field.proxyUrl+"?url=" + encodeURIComponent(this.field.getSubCategoryUrl + record.data.id):this.field.getSubCategoryUrl + record.data.id,
				scope:this,
				success:function(response,request){
					var cateList = Ext.decode(response.responseText);
					content = this.tpl.apply(cateList);
					this.bodyContent[record.id] = content;
					body.innerHTML = content;
					Ext.fly(body).on("click",function(records,scope){
						var t = scope;
						return function(e,target){
							if(target.tagName.toLowerCase()=="a"){
								var recordIndex = parseInt(Ext.fly(target).getAttributeNS("","data-options"));
								var value = records[recordIndex-1];
								value["topicUrl"] = record.data.url;//把专题的url带到子目录里
								delete value.leaf;
								delete value.hasCheckbox;
								t.field.onSelect(value);
							}
						}
					}(cateList,this));
				}
			});

            
        }else{
			body.innerHTML = content;
		}
    },

    onMouseDown : function(e, t){
        if(t.className == 'x-grid3-row-expander'){
            e.stopEvent();
            //var row = e.getTarget('.x-grid3-row');
			var row = Ext.fly(t).up('div.x-grid3-row');
            this.toggleRow(row.dom);
        }
    },

    renderer : function(v, p, record){
        p.cellAttr = 'rowspan="2"';
        return '<div class="x-grid3-row-expander">&#160;</div>';
    },

    beforeExpand : function(record, body, rowIndex){
        if(this.fireEvent('beforeexpand', this, record, body, rowIndex) !== false){
            if(this.tpl && this.lazyRender){
                this.setBodyContent(body,record, rowIndex);
            }
            return true;
        }else{
            return false;
        }
    },

    toggleRow : function(row){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        this[Ext.fly(row).hasClass('x-grid3-row-collapsed') ? 'expandRow' : 'collapseRow'](row);
    },

    expandRow : function(row){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        var record = this.grid.store.getAt(row.rowIndex);
        var body = Ext.DomQuery.selectNode('tr:nth(2) div.x-grid3-row-body', row);
        if(this.beforeExpand(record, body, row.rowIndex)){
            this.state[record.id] = true;
            Ext.fly(row).replaceClass('x-grid3-row-collapsed', 'x-grid3-row-expanded');
            this.fireEvent('expand', this, record, body, row.rowIndex);
        }
    },

    collapseRow : function(row){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        var record = this.grid.store.getAt(row.rowIndex);
        var body = Ext.fly(row).child('tr:nth(1) div.x-grid3-row-body', true);
        if(this.fireEvent('beforcollapse', this, record, body, row.rowIndex) !== false){
            this.state[record.id] = false;
            Ext.fly(row).replaceClass('x-grid3-row-expanded', 'x-grid3-row-collapsed');
            this.fireEvent('collapse', this, record, body, row.rowIndex);
        }
    }
});

Ext.override(Ext.ux.grid.GridPanel,{
	setColumn:function(){
		var cfg = this.columnConfig;
        var columnHeaders = new Array();
		if(cfg.rowExpander){
			columnHeaders.push(cfg.rowExpander);
		}
        if(cfg.hasRowNumber) columnHeaders.push(new Ext.grid.RowNumberer());
        if(cfg.hasSelectionModel) {
			if(cfg.sm){
				this.sm = cfg.sm;
			}else{	
				this.sm = new Ext.grid.CheckboxSelectionModel({width :25,singleSelect:false});
			}
			columnHeaders.push(this.sm);
		}

        for (var i = 0; i < cfg.colunms.length; i++) {
            var col = cfg.colunms[i];
            if (col.isView === false) {
                continue;
            }
            columnHeaders.push({
				id:'columns-' + i,
                header: col.header||"列"+(i+1),
                sortable: col.sortable==false?false:true,
                dataIndex: col.dataIndex||"",
                renderer: renderField(col),
                hidden:col.hidden,
				align:col.align,
                width:col.width
            });
        }
        this.cm = new Ext.grid.ColumnModel(columnHeaders);
        this.cm.defaultSortable = true;
        this.columnModel = this.cm;
	}
	
});
 
 
/**
 * Ext JS Library 2.0 extend
 * 专题栏目选择器
 * Version : 1.0
 * Author : cici
 * Date : 2014-1-13
 */
  
Ext.ux.TreeField = Ext.extend(Ext.form.TriggerField,  { 
    defaultAutoCreate : {tag: "input", type: "text", size: "24", autocomplete: "off"},  
    displayField : undefined,  
    valueField : undefined,  
    hiddenName : undefined,  
    listWidth : undefined,  
    minListWidth : 50,  
    listHeight : 350,  
    minListHeight : 60,  
	proxyUrl:"",//"../runtime/proxy!sendPost.jhtml",//使用代理
    dataUrl : undefined,  
	queryUrl: "../runtime/lark!querySpecial.jhtml",//栏目查询接口
	getSubCategoryUrl:"../runtime/lark!getSpecialSubCategory.jhtml?specialId=",//子栏目查询接口
    tree : undefined,  
    value : undefined,  
	editable:true,
	multiSelectable:true,//是否可多选
	onlyLeafSelectable:false,//只有叶子才可以选中
    baseParams : {}, 
	/**
     * @cfg {Object} treeRootConfig
     * 树根节点的配置参数
     */
	treeRootConfig : {
		id : ' ',
		text : 'please select...',
		draggable:false
	},
    initComponent : function(){
		if(!this.hiddenName) this.hiddenName = this.name;
        Ext.ux.TreeField.superclass.initComponent.call(this);
		this.addEvents(
				'select',
				'expand',
				'collapse',
				'beforeselect'	   
		);
        
    },
    initList : function(){
        if(!this.list){
            var cls = 'x-treefield-list';

            this.list = new Ext.Layer({
                shadow: this.shadow, cls: [cls, this.listClass].join(' '), constrain:false
            });

            var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
            this.list.setWidth(lw);
            this.list.swallowEvent('mousewheel');
			
			this.innerList = this.list.createChild({cls:cls+'-inner'});
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
			this.innerList.setHeight(this.listHeight || this.minListHeight);

			if(!this.tree){
				this.tree = this.createTree();	
			}
			if(!this.grid){
				this.grid = this.createGrid(this.innerList);	
			}

			if(!this.panel){     
                this.panel = this.createLayerPanel(this.innerList);         
            }
			
			this.tree.on('click',this.select,this);
			
			
        }
    },
	onRender : function(ct, position){
        Ext.ux.TreeField.superclass.onRender.call(this, ct, position);
        if(this.hiddenName || this.name){
            this.hiddenField = this.el.insertSibling({tag:'input', 
													 type:'hidden', 
													 name: this.hiddenName || this.name, 
													 id: "h_" + this.id},
                    'before', true);
            this.hiddenField.value =
                this.hiddenValue !== undefined ? this.hiddenValue :
                this.value !== undefined ? this.value : '';
            this.el.dom.removeAttribute('name');
        }
        if(Ext.isGecko){
            this.el.dom.setAttribute('autocomplete', 'off');
        }
		this.el.setStyle({"padding-right":"14px"});
		
		if(this.multiSelectable){
			this.el = this.el.replaceWith({
				tag:'div',
				cls:"TreeField-display-area",		
				id: "d_" + this.id
			 }).dom;
			this.el.createChild({
				tag:"ul",
				style:"width:100%"
			}).on("click",function(e,target){
				if(target.tagName=="I"){
					e.stopPropagation();
					e.stopEvent();
					this.removeValue(target);
				}
			},this);
			
		}
		
        this.initList();
		
		if(!this.editable){
            this.editable = true;
            this.setEditable(false);
        }
    },
	afterRender:function(ct){
		Ext.ux.TreeField.superclass.afterRender.call(this, ct);	
		this.initClearButton();		
		if(this.multiSelectable){
			this.el.un('mousedown', this.onTriggerClick,  this);
			this.el.removeClass('x-combo-noedit');
			this.syncValueUI(Ext.decode(this.value));
		}
	},
	setEditable : function(value){
        if(value == this.editable){
            return;
        }
        this.editable = value;
        if(!value){
            this.el.dom.setAttribute('readOnly', true);
            this.el.on('mousedown', this.onTriggerClick,  this);
            this.el.addClass('x-combo-noedit');
        }else{
            this.el.dom.setAttribute('readOnly', false);
            this.el.un('mousedown', this.onTriggerClick,  this);
            this.el.removeClass('x-combo-noedit');
        }
    },
	select : function(node){
		if(this.onlyLeafSelectable && !node.leaf){
			return;
		}
		
		if(!(node.attributes.type=="topic" || node.attributes.type=="folder")){
			return;
		}
		
		if(this.fireEvent('beforeselect', node, this)!= false){
			node.attributes.topicUrl = node.parentNode.attributes.url;//把专题的url带到子目录里
			this.onSelect(node);
			this.fireEvent('select', this, node);
		}
	},
    onSelect:function(node){
		
		this.setValue(node);
	    if(!this.multiSelectable) this.collapse();//允许多选时选中后不自动收起
	},
	createLayerPanel:function(innerList){
		if(!this.card){
			var navHandler = function(index){
				var card = this.card;
				var layout=card.getLayout();
				var bottoms=card.getBottomToolbar();
				var items = this.card.topToolbar.items;
				
				card.layout.setActiveItem(index);
				var bottoms=this.card.getBottomToolbar();
				bottoms.items.items[0].setDisabled(index==0);
				bottoms.items.items[2].setDisabled(index==1);
			};
		
			this.card = new Ext.Panel({
				autoScroll:true,
				//width:innerList.getWidth(),
				height:innerList.getHeight(),
				//layout:'fit',
				buttonAlign:"center",
				renderTo:innerList,
				tbar:['->',{
					xtype:'textfield',
					width:110,
					name:'q'//,
					//emptyText:"输入专题名称或id"
				},{
					text:"搜索",
					scope:this,
					handler:function(){
						this.doSearch();
					}
				}],
				
				layout:'card',
				activeItem: 0, //确保在容器的配置项中设置了当前活动项！
				//bodyStyle: 'padding:15px',
				defaults: {
					border:false
				},
				bbar: [ {
					text: '返回树',
					handler: navHandler.createDelegate(this,[0]),
					disabled: true
				},
				'->', //贪婪分隔符，这样按钮就被对齐到边界处
				{
					text: '转到列表',
					handler: navHandler.createDelegate(this, [1])
				}],
				items:[this.tree,this.grid],
				scope:this,
				listeners:{
					render:function(card){
						var el = card.topToolbar.items.item(1).el;
						el.setAttribute("placeholder","输入专题名称或id");
						Ext.fly(el).addClass("treefield-searchbox-input");
					}
				}
			});
			this.addListeners();	
		}
	},
	addListeners:function(){
		var items = this.card.topToolbar.items;
		var text = items.item(1).el;
		new Ext.KeyMap(Ext.get(text), {
			key: Ext.EventObject.ENTER,
			fn: function(){
				this.doSearch();
			},
			scope: this
		});

	},
	
    createTree:function(){
		var treeloader =new Ext.tree.TreeLoader({
			preloadChildren:false,
			dataUrl:this.proxyUrl?this.proxyUrl+"?url=" + encodeURIComponent(this.dataUrl):this.dataUrl
		});
		this.treeloader = treeloader;
		var root = new Ext.tree.AsyncTreeNode({
			text : '',
			draggable : false,
			expanded : true, 
			singleClickExpand:false,
			checked:true,
			loader: treeloader,
			listeners:{
				scope:this,
			   "beforeappend":this.beforeappendHandler
			}
		});
		var tree = new Ext.tree.TreePanel({    
			autoScroll:true,
			animate:true,
			hidden:false,
			containerScroll: true,    
			titleCollapse :true ,
			rootVisible :false,
			singleExpand :false,
			root:root,  
			lines:true
			
		});
        tree.addListener('checkchange',function(node,checked,eOpts){
            //监听改变选择框时候的事件 
            var checkedNodes = this.tree.getChecked();//获取当前以选择的节点信息
			for(var i=0;i<checkedNodes.length;i++){
				var n = checkedNodes[i];
				if(node.id != n.id){
					n.attributes.checked = false; // 不发内容
					var checkbox = n.getUI().checkbox;
					if(checkbox) checkbox.checked = false;//改变UI
				}
			}   
        },this);
		return tree;
		
	},
	
	createGrid:function(innerList){
		//初始化列表页

		// row expander
		var expander = new Ext.grid.RowExpander({
			tpl : new Ext.XTemplate(
				'<ul class="treefield-rowExpander-ul">',
				'<tpl for=".">',      
					'<li><a data-options=\'{#}\' href="javascript:">{text}({id})</a></li>',  
				'</tpl>' ,
				'</ul>'
			)
		});
		expander.field = this;
		var listPanel = new Ext.ux.ListPanel({
			layout:'fit',
			frame:false,
			header :false,
			hidden:false, 
			//bodyStyle :'overflow:hidden;',
			gridConfig:{
				hasPageBar:true,//是否需要分页
				autoExpandColumn:1,//第二列自由宽度
				plugins:[new Ext.grid.plugins.AutoResize(),expander],
				//pagesize:10,//默认为根据高度自动计算
				rowHeight:21,//行高
				storeConfig:{
					url:this.proxyUrl?this.proxyUrl+"?url=" + encodeURIComponent(this.queryUrl):this.queryUrl,
					remoteSort: false,
					method:"get",
					successProperty : 'success',
					root : "data",
					totalProperty : "totalCount", 
					fields: ['id','nav','url','uuid','name','createDate','createBy','categoryId']
				},
				columnConfig:{
					hasRowNumber:false,//是否显示列序号
					hasSelectionModel:false,//是否需要复选框
					rowExpander:expander,
					colunms:[{//列表项
						header: "ID",//列表栏标头名称
						sortable: true,//是否支持点击排序
						dataIndex: "id",//绑定的字段名
						align:"center",//对齐方式 left center right
						width:50,//列宽
						tpl:'{id}'//模板，参照Ext.XTemplate的语法
					},{
					   header: "专题",
					   dataIndex: 'nav',
					   sortable:true,
					   align:"left",
					   tpl:'{nav}',
					   isShowTip:true,
					   tipTpl:'{nav}'
					}]
				}
			}
		});
		return listPanel;
	},
	
	doSearch:function(){
		this.card.layout.setActiveItem(1);
		var bottoms=this.card.getBottomToolbar();
		bottoms.items.items[0].setDisabled(false);
		bottoms.items.items[2].setDisabled(true);
		
		var items = this.card.topToolbar.items;
		var text = items.item(1).el.value;
		var store = this.grid.grid.store;
		if(text=='输入专题名称或id') text="";
		if(!isNaN(text)){
			store.baseParams={//从接口获取参数时传递的参数
				"specialId":text
			}
		}else{
			store.baseParams={//从接口获取参数时传递的参数
				"q":text
			}
		}
		if(!store.hasBindLoad){
			store.on("load",function(store,records,req){
				for(var i = 0 ;i < records.length;i++){
					var r = records[i];
					var q = this.qel.value;
					if(q){
						r.set("title",r.get("nav"));
						r.set("nav",r.get("nav").replace(new RegExp(q,"g"),'<font color=\'red\'>' + q +'</font>'));//高亮显示关键词
						r.commit();
					}
				}
			},{qel:items.item(1).el});
			store.hasBindLoad = true;
		}
		store.load({
			params:{start:0,limit:this.grid.grid.pagesize},
			scope:{q:text},
			callback__:function(records,options,suc){
				for(var i = 0 ;i < records.length;i++){
					var r = records[i];
					if(this.q){
						r.set("title",r.get("nav"));
						r.set("nav",r.get("nav").replace(new RegExp(this.q,"g"),'<font color=\'red\'>' + this.q +'</font>'));//高亮显示关键词
						r.commit();
					}
				}
			}
		});
	},
	
	initClearButton:function(){
		if(!this.btnClear) {
			this.btnClear = this.el.insertSibling({
				tag:'i',
				cls:"treefield-btn-clear",
				title:"清除全部"
			},'after' );
			this.btnClear.on("click",this.clear,this);
		}

	},
	clear:function(){
		this.syncValue("");
		this.el.child("ul").update("");
		//重新调整弹出层的位置
		this.list.visible && this.list.anchorTo(this.el,"bl");
	},
	beforeappendHandler : function(tree,thisNode,node){
		node.leaf = node.attributes.leaf;
		//if(node.attributes.hasCheckbox) node.attributes.checked = false;
		node.attributes.singleClickExpand=!node.leaf;
		if(thisNode.attributes.source) node.attributes.source = thisNode.attributes.source;
		if(this.onlyLeafSelectable && node.attributes.type=="topic" && node.attributes.leaf){
			node.getUI().hide();//隐藏没有子栏目的专题
		}
		if(node.attributes.dataUrl) node.on("beforeload", function(node){  
			var dataUrl = node.attributes.dataUrl;
			if(dataUrl.indexOf("http://")!=0){
				this.treeloader.dataUrl = "../runtime/" + dataUrl;
			}else{
				this.treeloader.dataUrl = this.proxyUrl? this.proxyUrl+"?url=" + encodeURIComponent(dataUrl):dataUrl;
			}
		},this) ;
		node.on("beforeappend",arguments.callee,this);

	},
	appendValue:function(newValue){
		var currentValue = this.getValue();
		if(currentValue){
			try{
				currentValue = Ext.decode(currentValue)	;
			}catch(ex){currentValue=[]}
		}else{
			currentValue=[];
		}
		if(!Ext.isArray(currentValue)){
			currentValue=[currentValue];
		}
		currentValue.push(newValue);
		
		var liEl = this.el.child("ul").createChild({
			tag:"li",
			html:newValue.title + '<i class="treefield-btn-remove" data-value="'+ newValue.value +'" title="移除"></i>'
		});
		this.syncValue(Ext.encode(currentValue));
		
		//重新调整弹出层的位置
		this.list.visible && this.list.anchorTo(this.el,"bl");
	},
    removeValue:function(target){
		target = Ext.fly(target);
		target.parent().remove();
		var currentValue = this.getValue();
		currentValue = Ext.decode(currentValue)	;
		
		var selectedValue = target.getAttributeNS("","data-value");
		for(var i=0;i<currentValue.length;i++){
			if(currentValue[i].value==selectedValue){
				currentValue.splice(i,1);
				this.syncValue(Ext.encode(currentValue));
				break;
			}
		}
		//重新调整弹出层的位置
		this.list.visible && this.list.anchorTo(this.el,"bl");
	},
	getValue : function(){
        if(this.valueField){
            return typeof this.value != 'undefined' ? this.value : '';
        }else{
            return Ext.ux.TreeField.superclass.getValue.call(this);
        }
    },
    setValue : function(node){
		//if(!node)return;
		var text,value;
		if(node && typeof node == 'object'){
			if(this.displayField){
				text = node.attributes ? node.attributes[this.displayField] : node[this.displayField];//兼容从搜索结果列表中选中的情况
			}else{//若没有制定显示字段，则递归计算出完整text路径
				text='';
				if(node.bubble){
					node.bubble(function(){
						text = this.text !=='' ? (this.text + '>' +  text) : text ;
					});
					text = text.substring(0,text.length-1);	
				}
			}
			var valueObj = {};
			if(this.valueField){
				var valueStr = node.attributes ? node.attributes[this.valueField] : node[this.valueField];
				
				valueObj[this.valueField] = valueStr;
				valueObj["title"] = text;
				valueObj["topicUrl"] = node.attributes ?  node.attributes["topicUrl"] :  node["topicUrl"];
			}else{//完整node的属性json
				var attrs = Ext.apply({},node.attributes || node);
				attrs.title = text;
				delete attrs.loader;
				delete attrs.singleClickExpand;
				delete attrs.checked;
				delete attrs.leaf;
				delete attrs.type;
				delete attrs.hasCheckbox;
				valueObj = attrs;
			}
			if(this.multiSelectable){
				var currentValue = this.getValue();
				if(currentValue){
					try{
						currentValue = Ext.decode(currentValue)	;
						if(Ext.isArray(currentValue)){
							var isExist=false;
							for(var i=0;i<currentValue.length;i++){
								if(currentValue[i].value==valueObj[this.valueField||"value"]){
									isExist = true;
									break;
								}
							}
							if(!isExist){
								this.appendValue(valueObj);
							}
							return;
						}
					}catch(ex){
						this.appendValue(valueObj);
						return;
					}
				}else{
					this.appendValue(valueObj);
					return;
				}
				
			}else{//单选
				this.el.dom.setAttribute("title",text);
				value = Ext.encode(valueObj);
			}
			
		}else{
			if(node!=""){
				try{
					var valueObj = Ext.decode(node);
					if(this.multiSelectable){
						var valueObjNew=[]
						if(!Ext.isArray(valueObj)){
							if(valueObj.value)
								valueObjNew.push(valueObj);
							else
								valueObjNew=[];
						}else{
							valueObjNew = valueObj;
						}
						value = Ext.encode(valueObjNew);
						this.el.child("ul") && this.syncValueUI(valueObjNew);
					}else{
						value = node;
						text = valueObj.title;
						this.el.dom.setAttribute("title",text);
					}
					
				}catch(ex){
					console.log("数据格式不正确");
					return;
				}
			}else{
				value = "";	
			}
		}
		
		
		this.syncValue(value,text);
    },
	syncValue:function(value,text){
		if(this.hiddenField){
            this.hiddenField.value = value;
        }
		Ext.ux.TreeField.superclass.setValue.call(this, this.multiSelectable?value:text);
		this.value = value;
	},
	syncValueUI:function(value){
		this.clear();
		if(value){
			for(var i=0;i<value.length;i++){
				this.appendValue(value[i]);
			}
		}
	},
	onResize: function(w, h){
        Ext.ux.TreeField.superclass.onResize.apply(this, arguments);
        if(this.list && this.listWidth == null){
            var lw = Math.max(w, this.minListWidth);
            this.list.setWidth(lw);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
        }
    },
	validateBlur : function(){
        return !this.list || !this.list.isVisible();   
    },
    onDestroy : function(){
        if(this.list){
            this.list.destroy();
        }
		if(this.wrap){
            this.wrap.remove();
        }
        Ext.ux.TreeField.superclass.onDestroy.call(this);
    },
    collapseIf : function(e){
        if(!e.within(this.wrap) && !e.within(this.list)){
            this.collapse();
        }
    },

    collapse : function(){
        if(!this.isExpanded()){
            return;
        }
        this.list.hide();
        Ext.getDoc().un('mousewheel', this.collapseIf, this);
        Ext.getDoc().un('mousedown', this.collapseIf, this);
        this.fireEvent('collapse', this);
    },
	expand : function(){
        if(this.isExpanded() || !this.hasFocus){
            return;
        }
        this.onExpand();
		this.list.alignTo(this.wrap, this.listAlign);
        this.list.show();
		Ext.getDoc().on('mousewheel', this.collapseIf, this);
        Ext.getDoc().on('mousedown', this.collapseIf, this);
        this.fireEvent('expand', this);
    },
	onExpand : function(){
		var doc = Ext.getDoc();
		this.on('click',function(){},this);
	},
    isExpanded : function(){
        return this.list && this.list.isVisible();
    },
    onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.isExpanded()){
            this.collapse();
        }else {
            this.onFocus({});
            this.expand();
        }
		this.el.focus();
    }
});
Ext.reg('treefield', Ext.ux.TreeField);