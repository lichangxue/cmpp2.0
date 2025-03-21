// 添加命名空间
Ext.namespace('Ext.ux.grid');

/*
* Ext.ux.grid.GroupPropertyRecord
*/
Ext.ux.grid.GroupPropertyRecord=Ext.data.Record.create(
	[{name:"name",type:"string"},{name:"required",type:"boolean"},{name:"readOnly",type:"boolean"},"value","group","extra","text","help"]
);

/*
* Ext.ux.grid.GroupPropertyStore
*/
Ext.ux.grid.GroupPropertyStore = function(grid, source){
    this.grid = grid;
    this.store = new Ext.data.GroupingStore({
        recordType : Ext.ux.grid.GroupPropertyRecord,
		groupField : "group",
 		sortData:function(){}   
    });
    this.store.on('update', this.onUpdate,  this);
    if(source){
        this.setSource(source);
    }
    Ext.ux.grid.GroupPropertyStore.superclass.constructor.call(this);
};
Ext.extend(Ext.ux.grid.GroupPropertyStore, Ext.util.Observable, {
	setSource : function(o){
        this.source = o;
        this.store.removeAll();
        var data = [];
		var editor = Designer.customEditors;
        for(var k in o){
        	/*not in a group--seems not useful;
            if(this.isEditableValue(o[k])){
                data.push(new Ext.ux.grid.GroupPropertyRecord({name: k, value: o[k],group:k},k));
            }
            */
			if(typeof(o[k]) == 'object'){
				var lan=o[k].lan||k;
				var val=o[k].value;
				for(var n in val){
					var v=val[n];
					var value = v.value;
					var cfg={name: v.lan, value: value,group:lan,text:value};
					if(v.type && editor[v.type] && editor[v.type].editor && editor[v.type].editor.field.getDisplayText){//获取显示到属性表的值
						var text =  editor[v.type].editor.field.getDisplayText(v,value) || "";
						cfg.text = text;
					}
					if(v.help){
						var content = "";	
						if(typeof v.help=="object"){
							if(v.help.url) content = ' data-url="' +　v.help.url + '" ';
							else if(v.help.dataId) content = ' data-id="' +　v.help.dataId + '" ';
						}else{
							content = ' data-content="'+ encodeURIComponent(v.help) + '" ';
						}
						cfg.help='<a title="寻求帮助" class="x-grid3-td-help-button"'+ content +'>?</a>';
					}
					
					(v.extra&&(cfg.extra=v.extra));
					(v.required&&(cfg.required=v.required));
					(v.readOnly&&(cfg.readOnly=v.readOnly));
					data.push(new Ext.ux.grid.GroupPropertyRecord(cfg,k+"&&"+n));
				}
			}
        }
        this.store.loadRecords({records: data}, {}, true);
    },

    // private
    onUpdate : function(ds, record, type){
        if(type == Ext.data.Record.EDIT){
            var v = record.data['value'];
            var oldValue = record.modified['value'];
            if(this.grid.fireEvent('beforepropertychange', this.source, record.id, v, oldValue) !== false){
                if(record.id.indexOf("&&")!=-1)
            	{
            		var values = record.id.split("&&");
            		this.source[values[0]].value[values[1]].value = v;
            	}
            	else
            	{
                	this.source[record.id].value = v;//not used yet;
                }
                record.commit();
                this.grid.fireEvent('propertychange', this.source, record.id, v, oldValue);
            }else{
                record.reject();
            }
        }
    },

    // private
    getProperty : function(row){
       return this.store.getAt(row);
    },

    // private
    isEditableValue: function(val){
        if(Ext.isDate(val)){
            return true;
        }else if(typeof val == 'function'){
            return false;
        }
        return true;
    },

    // private
    setValue : function(prop, value){
        this.source[prop] = value;
        this.store.getById(prop).set('value', value);
    },

    // protected - should only be called by the grid.  Use grid.getSource instead.
    getSource : function(){
        return this.source;
    }
});

/*
* Ext.ux.grid.GroupPropertyColumnModel 
*/
Ext.ux.grid.GroupPropertyColumnModel = function(grid, store){
	this.grid = grid;
    var g = Ext.grid;
    g.PropertyColumnModel.superclass.constructor.call(this, [
        {header: this.nameText, width:80, sortable: true, dataIndex:'name', id: 'name', menuDisabled:true},
		{header: this.textText, width:50, resizable:false, dataIndex: 'text', id: 'text', menuDisabled:true},//显示的值text,
		{header:"?", width:10, sortable: false,resizable:false, dataIndex:'help', id: 'help', menuDisabled:true},
        {header:"", hidden:true,width:10,resizable:false,locked:true,dataIndex: 'value', id: 'value', menuDisabled:true},//值
		{header:"",hidden:true,width:10,resizable:false,locked:true,dataIndex:"group",menuDisabled:true}
    ]);
    this.store = store;
    this.bselect = Ext.DomHelper.append(document.body, {
        tag: 'select', cls: 'x-grid-editor x-hide-display', children: [
            {tag: 'option', value: 'true', html: 'true'},
            {tag: 'option', value: 'false', html: 'false'}
        ]
    });
    var f = Ext.form;

    var bfield = new f.Field({
        el:this.bselect,
        bselect : this.bselect,
        autoShow: true,
        getValue : function(){
            return this.bselect.value == 'true';
        }
    });
    this.editors = {
        'date' : new g.GridEditor(new f.DateField({selectOnFocus:true})),
        'string' : new g.GridEditor(new f.TextField({selectOnFocus:true})),
        'number' : new g.GridEditor(new f.NumberField({selectOnFocus:true, style:'text-align:left;'})),
        'boolean' : new g.GridEditor(bfield)
    };
    this.renderCellDelegate = this.renderCell.createDelegate(this);
    this.renderPropDelegate = this.renderProp.createDelegate(this);
};
Ext.extend(Ext.ux.grid.GroupPropertyColumnModel , Ext.grid.ColumnModel, {
    // private - strings used for locale support
    nameText : '属性',
    valueText : '值',
	textText:"值",
    dateFormat : 'm/j/Y',

    // private
    renderDate : function(dateVal){
        return dateVal.dateFormat(this.dateFormat);
    },

    // private
    renderBool : function(bVal){
        return bVal ? 'true' : 'false';
    },

    // private
    isCellEditable : function(colIndex, rowIndex){
        return colIndex == 1 || colIndex == 2;
    },

    // private
    getRenderer : function(col){
        return col == 1 ?
            this.renderCellDelegate : this.renderPropDelegate;
    },

    // private
    renderProp : function(v){
        return this.getPropertyName(v);
    },

    // private
    renderCell : function(val){
        var rv = val;
        if(Ext.isDate(val)){
            rv = this.renderDate(val);
        }else if(typeof val == 'boolean'){
            rv = this.renderBool(val);
        }else if(typeof val == 'object'){
            rv = Ext.encode(val);
        }
        return Ext.util.Format.htmlEncode(rv);
    },

    // private
    getPropertyName : function(name){
        var pn = this.grid.propertyNames;
        return pn && pn[name] ? pn[name] : name;
    },

    // private
    getCellEditor : function(colIndex, rowIndex){
		var p = this.store.getProperty(rowIndex);	
		if(colIndex==1){
			
			if(p.data['readOnly'])
				return;
			var n = p.data['name'], val = p.data['value'];
			var ed;
			if(this.grid.customEditors[n]){
				ed = this.grid.customEditors[n].editor;
			}else if(Ext.isDate(val)){
				ed = this.editors['date'];
			}else if(typeof val == 'number'){
				ed = this.editors['number'];
			}else if(typeof val == 'boolean'){
				ed = this.editors['boolean'];
			}else{
				ed = this.editors['string'];
			}
			var editorField=ed.field;
			editorField.allowBlank=!p.data["required"];
			var ext=p.data['extra'];
			if(ext){
				for(var i in ext)
					try{
						editorField[i](ext[i]);//function
					}catch(err){
						editorField[i]=ext[i];//property;
					}
			}
			return ed;
		}else if(colIndex==2){//点击帮助栏
			return Designer.customEditors.HtmlViewer.editor;
		}
    },
    
    // inherit docs
    destroy : function(){
        Ext.grid.PropertyColumnModel.superclass.destroy.call(this);
        for(var ed in this.editors){
            Ext.destroy(ed);
        }
    }
});


/*
* Ext.ux.grid.GroupPropertyGrid
*/
Ext.ux.grid.GroupPropertyGrid=Ext.extend(Ext.grid.EditorGridPanel,{
	enableColumnMove:false,
    stripeRows:false,
    trackMouseOver: false,
    clicksToEdit:1,
    enableHdMenu : false,
    viewConfig : {
        forceFit:true
    },
	initComponent : function(){
        this.customEditors = this.customEditors || {};
        this.lastEditRow = null;
        var store = new Ext.ux.grid.GroupPropertyStore(this);
        this.propStore = store;
        var cm = new Ext.ux.grid.GroupPropertyColumnModel(this, store);
        store.store.sort('name', 'ASC');
        this.addEvents('beforepropertychange','propertychange');
		this.cm = cm;
        this.ds = store.store;
		this.view=new Ext.grid.GroupingView({
				forceFit:true,
				showGroupName:false,
				scrollOffset:18,
				getRowClass:function(c){
					return c.data.value===undefined?"":"has-value"
				}
			}
		);
        Ext.ux.grid.GroupPropertyGrid.superclass.initComponent.call(this);
        this.selModel.on('beforecellselect', function(sm, rowIndex, colIndex){
            if(colIndex === 0){
                this.startEditing.defer(200, this, [rowIndex, 1]);
                return false;
            }
        }, this);
		this.on("beforeedit", function (e) { 
			if(e.column==1){
				return !e.record.data.readOnly;	
			}else if(e.column==2){
				return !!e.record.data.help;
			}
			return false;
		});
	}
	, onEditComplete: function (ed, value, startValue) {
		this.editing = false;
		this.activeEditor = null;
		ed.un("specialkey", this.selModel.onEditorKey, this.selModel);
		var r = ed.record;
		var field = this.colModel.getDataIndex(ed.col);
		var text;
		if(typeof ed.field.getDisplayText=="function"){
			text = ed.field.getDisplayText(ed.record.data,value);
		}else{
			text = value;
		}
		text = this.postEditValue(text, startValue, r, field);
		//            if (String(value) !== String(startValue)) {
		
		if (text !== startValue) {
			var e = {
				grid: this,
				record: r,
				field: field,
				originalValue: startValue,
				value: value,
				text:text,
				row: ed.row,
				column: ed.col,
				cancel: false
			};
			if (this.fireEvent("validateedit", e) !== false && !e.cancel) {
				//r.set(field, e.value);
				r.data[field] = e.text;
				r.data["value"] = e.value;
				if (!r.modified) {
					r.modified = {};
				}
				this.propStore.onUpdate(this.store, r, "edit");
				delete e.cancel;
				this.fireEvent("afteredit", e);
			}
		}
		this.view.focusCell(ed.row, ed.col);
	}
	,onRender : function(){
        Ext.ux.grid.GroupPropertyGrid.superclass.onRender.apply(this, arguments);
        this.getGridEl().addClass('x-props-grid');
    },
	afterRender: function(){
        Ext.ux.grid.GroupPropertyGrid.superclass.afterRender.apply(this, arguments);
        if(this.source){
            this.setSource(this.source);
        }
    },
	setSource : function(source){
        this.propStore.setSource(source);
    },
	getSource : function(){
        return this.propStore.getSource();
    },

	enableGroup: function(){
		this.view.enableGrouping=true;
		this.propStore.store.groupBy("group");
	},
	disableGroup: function(){
		this.view.enableGrouping=false;
		this.propStore.store.clearGrouping();
	}
});

Ext.reg("GroupingPropertyGrid", Ext.ux.grid.GroupPropertyGrid); 
