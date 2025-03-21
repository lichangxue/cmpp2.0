Ext.ns('Ext.ux.form');
Ext.ux.form.SegSelector = Ext.extend(Ext.form.Field,  {
    imagePath:"",
    iconUp:"addAll.gif",
    iconDown:"delAll.gif",
    iconLeft:"del.gif", 
    iconRight:"add.gif",
    delimiter:',',
    defaultAutoCreate:{tag: "div"},
    /**
     * @cfg {Array} multiselects An array of {@link Ext.ux.form.MultiSelect} config objects, with at least all required parameters (e.g., store)
     */
    multiselects:null,

    initComponent: function(){
        Ext.ux.form.SegSelector.superclass.initComponent.call(this);
        this.addEvents({
            'rowdblclick' : true,
            'change' : true
        });
    },

    onRender: function(ct, position){
        if(this.value==undefined){
            this.value = "";
        }
        Ext.ux.form.SegSelector.superclass.onRender.call(this, ct, position);

        // Internal default configuration for both multiselects
        var msConfig = [{
            draggable: false,
            droppable: true,
			bodyStyle: 'overflow: auto;',
            width: 60,
            height: 140
        },{
            draggable: false,
            droppable: true,
            bodyStyle: 'overflow: auto;',
            width: 60,
            height: 140
        }];

        this.fromMultiselect = new Ext.ux.form.MultiSelect(Ext.applyIf(this.multiselects[0], msConfig[0]));
        this.fromMultiselect.on('dblclick', this.onRowDblClick, this);
        this.fromStore = this.fromMultiselect.store;
        this.toMultiselect = new Ext.ux.form.MultiSelect(Ext.applyIf(this.multiselects[1], msConfig[1]));
        this.toMultiselect.on('dblclick', this.onRowDblClick, this);
        this.toStore = this.toMultiselect.store;
        var p = new Ext.Panel({
            layout:"table",
            layoutConfig:{columns:3}
        });
        var testFrom = this.multiselects[0].text;
        var testTo = this.multiselects[1].text;
		p.add(new Ext.form.Label({text:testFrom,style:'font-weight:bold'}));
		var icons = new Ext.Panel({header:false,rowspan:3});
        p.add(icons);
		p.add(new Ext.form.Label({text:testTo,style:'font-weight:bold'}));
        p.add(new Ext.form.TextField({id:'searchInAll',emptyText:'输入'+testFrom+'名称',width:130,height:16}));
        p.add(new Ext.form.TextField({id:'searchInSelect',emptyText:'输入'+testTo+'名称',width:130,height:16}));
        p.add(this.fromMultiselect);
        p.add(this.toMultiselect);
        p.render(this.el);
        icons.el.down('.'+icons.bwrapCls).remove();

        // ICON HELL!!!
        if (this.imagePath!="" && this.imagePath.charAt(this.imagePath.length-1)!="/")
            this.imagePath+="/";
        this.iconUp = this.imagePath + this.iconUp;
        this.iconDown = this.imagePath + this.iconDown ;
        this.iconLeft = this.imagePath + this.iconLeft ;
        this.iconRight = this.imagePath + this.iconRight;
        var el=icons.getEl();
        el.createChild({tag: 'br'});
        this.upIcon = el.createChild({tag:'img', src:this.iconUp, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.addIcon = el.createChild({tag:'img', src:this.iconRight, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.removeIcon = el.createChild({tag:'img', src:this.iconLeft, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.downIcon = el.createChild({tag:'img', src:this.iconDown, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.upIcon.on('click', this.allRight, this);
        this.downIcon.on('click', this.allLeft, this);
        this.addIcon.on('click', this.fromTo, this);
        this.removeIcon.on('click', this.toFrom, this);
        var tb = p.body.first();
        this.el.setWidth(p.body.first().getWidth());
        this.hiddenName = this.name;
        var hiddenTag = {tag: "input", type: "hidden", value: "", name: this.name};
        this.hiddenField = this.el.createChild(hiddenTag);
        this.listenerKeybordFrom();
        this.listenerKeybordTo();
    },
	allRight : function(){
		var len = this.fromMultiselect.view.store.getRange().length;
        var records = [];
        if (len > 0) {
            for (var i=0; i<len; i++) {
                record = this.fromMultiselect.view.store.getAt(i);
                records.push(record);
            }
            if(!this.allowDup)selectionsArray = [];
            for (var i=0; i<records.length; i++) {
                record = records[i];
                if(this.allowDup){
                    var x=new Ext.data.Record();
                    record.id=x.id;
                    delete x;
                    this.toMultiselect.view.store.add(record);
                }else{
                    this.fromMultiselect.view.store.remove(record);
                    this.toMultiselect.view.store.add(record);
                    selectionsArray.push((this.toMultiselect.view.store.getCount() - 1));
                }
            }
        }
        this.toMultiselect.view.refresh();
        this.fromMultiselect.view.refresh();
        var si = this.toMultiselect.store.sortInfo;
        if(si){
            this.toMultiselect.store.sort(si.field, si.direction);
        }
        this.toMultiselect.view.select(selectionsArray);
	},
	
	allLeft: function(){
		var len = this.toMultiselect.view.store.getRange().length;
        var records = [];
        if (len > 0) {
            for (var i=0; i<len; i++) {
                record = this.toMultiselect.view.store.getAt(i);
                records.push(record);
            }
            var selectionsArray = [];
            for (var i=0; i<records.length; i++) {
                record = records[i];
                this.toMultiselect.view.store.remove(record);
                if(!this.allowDup){
                    this.fromMultiselect.view.store.add(record);
                    selectionsArray.push((this.fromMultiselect.view.store.getCount() - 1));
                }
            }
        }
        this.fromMultiselect.view.refresh();
        this.toMultiselect.view.refresh();
        var si = this.fromMultiselect.store.sortInfo;
        if (si){
            this.fromMultiselect.store.sort(si.field, si.direction);
        }
        this.fromMultiselect.view.select(selectionsArray);
	},
    fromTo : function() {
        var selectionsArray = this.fromMultiselect.view.getSelectedIndexes();
        var records = [];
        if (selectionsArray.length > 0) {
            for (var i=0; i<selectionsArray.length; i++) {
                record = this.fromMultiselect.view.store.getAt(selectionsArray[i]);
                records.push(record);
            }
            if(!this.allowDup)selectionsArray = [];
            for (var i=0; i<records.length; i++) {
                record = records[i];
                if(this.allowDup){
                    var x=new Ext.data.Record();
                    record.id=x.id;
                    delete x;
                    this.toMultiselect.view.store.add(record);
                }else{
                    this.fromMultiselect.view.store.remove(record);
                    this.toMultiselect.view.store.add(record);
                    selectionsArray.push((this.toMultiselect.view.store.getCount() - 1));
                }
            }
        }
        this.toMultiselect.view.refresh();
        this.fromMultiselect.view.refresh();
        var si = this.toMultiselect.store.sortInfo;
        if(si){
            this.toMultiselect.store.sort(si.field, si.direction);
        }
        this.toMultiselect.view.select(selectionsArray);
    },

    toFrom : function() {
        var selectionsArray = this.toMultiselect.view.getSelectedIndexes();
        var records = [];
        if (selectionsArray.length > 0) {
            for (var i=0; i<selectionsArray.length; i++) {
                record = this.toMultiselect.view.store.getAt(selectionsArray[i]);
                records.push(record);
            }
            selectionsArray = [];
            for (var i=0; i<records.length; i++) {
                record = records[i];
                this.toMultiselect.view.store.remove(record);
                if(!this.allowDup){
                    this.fromMultiselect.view.store.add(record);
                    selectionsArray.push((this.fromMultiselect.view.store.getCount() - 1));
                }
            }
        }
        this.fromMultiselect.view.refresh();
        this.toMultiselect.view.refresh();
        var si = this.fromMultiselect.store.sortInfo;
        if (si){
            this.fromMultiselect.store.sort(si.field, si.direction);
        }
        this.fromMultiselect.view.select(selectionsArray);
    },

    onRowDblClick : function(vw, index, node, e) {
        if (vw == this.toMultiselect.view){
            this.toFrom();
        } else if (vw == this.fromMultiselect.view) {
            this.fromTo(); 
        }
        return this.fireEvent('rowdblclick', vw, index, node, e);
    },
    //绑定键盘事件 From处
    listenerKeybordFrom: function () {
        new Ext.KeyMap(Ext.get('searchInAll'), {
            key: Ext.EventObject.ENTER,
            fn: function () {
                var value = Ext.getCmp('searchInAll').getValue();
                this.fromStore.baseParams.filterTxt = this.multiselects[0].displayField;
                this.fromStore.baseParams.filterValue = value;
                this.fromStore.load({
                    params: {
                        start: 0,
                        limit: 1000
                    },
                    callback: function (r, options, success) {
                        if (!success) {
                            Ext.Msg.alert('操作', '失败！');
                        }
                    }
                });
            },
            scope: this
        });
    },
    //绑定键盘事件 To处
    listenerKeybordTo: function () {
        new Ext.KeyMap(Ext.get('searchInSelect'), {
            key: Ext.EventObject.ENTER,
            fn: function () {
                var value = Ext.getCmp('searchInSelect').getValue();
                this.toStore.baseParams.filterTxt = this.multiselects[0].displayField;
                this.toStore.baseParams.filterValue = value;
                this.toStore.load({
                    params: {
                        start: 0,
                        limit: 1000
                    },
                    callback: function (r, options, success) {
                        if (!success) {
                            Ext.Msg.alert('操作', '失败！');
                        }
                    }
                });
            },
            scope: this
        });
    }
});

Ext.reg('segnmselector', Ext.ux.form.SegSelector);

