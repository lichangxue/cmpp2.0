Ext.ns('Ext.ux.form');
Ext.ux.form.MultiSelect = Ext.extend(Ext.form.Field,  {
    ddReorder:false,
    appendOnly:true,
    //width:120,
    //height:130,
    displayField:0,
    valueField:1,
    allowBlank:true,
    minSelections:0,
    maxSelections:Number.MAX_VALUE,
    blankText:Ext.form.TextField.prototype.blankText,
    minSelectionsText:'Minimum {0} item(s) required',
    maxSelectionsText:'Maximum {0} item(s) allowed',
    delimiter:',',
    defaultAutoCreate : {tag: "div"},
    // private
    initComponent: function(){
        Ext.ux.form.MultiSelect.superclass.initComponent.call(this);

        if(Ext.isArray(this.store)){
            if (Ext.isArray(this.store[0])){
                this.store = new Ext.data.ArrayStore({
                    fields: ['value','text'],
                    data: this.store
                });
                this.valueField = 'value';
            }else{
                this.store = new Ext.data.ArrayStore({
                    fields: ['text'],
                    data: this.store,
                    expandData: true
                });
                this.valueField = 'text';
            }
            this.displayField = 'text';
        } else {
            this.store = Ext.StoreMgr.lookup(this.store);
        }

        this.addEvents({
            'dblclick' : true,
            'click' : true,
            'change' : true,
            'drop' : true
        });
    },
    // private
    onRender: function(ct, position){
        if(this.value==undefined){
            this.value = "";
        }
        Ext.ux.form.MultiSelect.superclass.onRender.call(this, ct, position);

        var fs = this.fs = new Ext.form.FieldSet({
            renderTo: this.el,
            title: this.legend,
            height: this.height,
            width: this.width,
            style: "margin:2px;padding:0;",//style: "padding:0;",
            tbar: this.tbar,
            bodyStyle: 'overflow: auto;'
        });


        this.view = new Ext.ListView({
            multiSelect: true,
            store: this.store,
            columns: [{ header: 'Value', width: 1, dataIndex: this.displayField }],
            hideHeaders: true
        });

        fs.add(this.view);

        this.view.on('click', this.onViewClick, this);
        this.view.on('beforeclick', this.onViewBeforeClick, this);
        this.view.on('dblclick', this.onViewDblClick, this);

        this.hiddenName = this.name || Ext.id();
        var hiddenTag = { tag: "input", type: "hidden", value: "", name: this.hiddenName };
        this.hiddenField = this.el.createChild(hiddenTag);
        this.hiddenField.dom.disabled = this.hiddenName != this.name;
        fs.doLayout();
    },

    // private
    afterRender: function(){
        Ext.ux.form.MultiSelect.superclass.afterRender.call(this);

        if (this.ddReorder && !this.dragGroup && !this.dropGroup){
            this.dragGroup = this.dropGroup = 'MultiselectDD-' + Ext.id();
        }

        if (this.draggable || this.dragGroup){
            this.dragZone = new Ext.ux.form.MultiSelect.DragZone(this, {
                ddGroup: this.dragGroup
            });
        }
        if (this.droppable || this.dropGroup){
            this.dropZone = new Ext.ux.form.MultiSelect.DropZone(this, {
                ddGroup: this.dropGroup
            });
        }
    },

    // private
    onViewClick: function(vw, index, node, e) {
        this.fireEvent('change', this, this.getValue(), this.hiddenField.dom.value);
        this.hiddenField.dom.value = this.getValue();
        this.fireEvent('click', this, e);
        this.validate();
    },

    // private
    onViewBeforeClick: function(vw, index, node, e) {
        if (this.disabled) {return false;}
    },

    // private
    onViewDblClick : function(vw, index, node, e) {
        return this.fireEvent('dblclick', vw, index, node, e);
    },
    getValue: function(valueField){
        var returnArray = [];
        var selectionsArray = [];
        if(this.view.getSelectedIndexes()[0]!=null&&this.view.getSelectedIndexes()[0]!=undefined)
        selectionsArray = this.view.getSelectedIndexes();
        if (selectionsArray.length == 0) {return '';}
        for (var i=0; i<selectionsArray.length; i++) {
            returnArray.push(this.store.getAt(selectionsArray[i]).get((valueField != null) ? valueField : this.valueField));
        }
        return returnArray.join(this.delimiter);
    },
    setValue: function(values) {
        var index;
        var selections = [];
        if(this.view!=undefined){
            this.view.clearSelections();

            this.hiddenField.dom.value = '';

            if (!values || (values == '')) { return; }

            if (!Ext.isArray(values)) { values = values.split(this.delimiter); }
            for (var i=0; i<values.length; i++) {
                index = this.view.store.indexOf(this.view.store.query(this.valueField,
                    new RegExp('^' + values[i] + '$', "i")).itemAt(0));
                selections.push(index);
            }
            this.view.select(selections);
            this.hiddenField.dom.value = this.getValue();
            this.validate();
        }
    }

});

Ext.ux.form.MultiSelect.DragZone = function(ms, config){
    this.ms = ms;
    this.view = ms.view;
    var ddGroup = config.ddGroup || 'MultiselectDD';
    var dd;
    if (Ext.isArray(ddGroup)){
        dd = ddGroup.shift();
    } else {
        dd = ddGroup;
        ddGroup = null;
    }
    Ext.ux.form.MultiSelect.DragZone.superclass.constructor.call(this, this.ms.fs.body, { containerScroll: true, ddGroup: dd });
    this.setDraggable(ddGroup);
};

Ext.extend(Ext.ux.form.MultiSelect.DragZone, Ext.dd.DragZone, {
    onInitDrag : function(x, y){
        var el = Ext.get(this.dragData.ddel.cloneNode(true));
        this.proxy.update(el.dom);
        el.setWidth(el.child('em').getWidth());
        this.onStartDrag(x, y);
        return true;
    },
    
    // private
    collectSelection: function(data) {
        data.repairXY = Ext.fly(this.view.getSelectedNodes()[0]).getXY();
        var i = 0;
        this.view.store.each(function(rec){
            if (this.view.isSelected(i)) {
                var n = this.view.getNode(i);
                var dragNode = n.cloneNode(true);
                dragNode.id = Ext.id();
                data.ddel.appendChild(dragNode);
                data.records.push(this.view.store.getAt(i));
                data.viewNodes.push(n);
            }
            i++;
        }, this);
    },

    // override
    onEndDrag: function(data, e) {
        var d = Ext.get(this.dragData.ddel);
        if (d && d.hasClass("multi-proxy")) {
            d.remove();
        }
    },

    // override
    getDragData: function(e){
        var target = this.view.findItemFromChild(e.getTarget());
        if(target) {
            if (!this.view.isSelected(target) && !e.ctrlKey && !e.shiftKey) {
                this.view.select(target);
                this.ms.setValue(this.ms.getValue());
            }
            if (this.view.getSelectionCount() == 0 || e.ctrlKey || e.shiftKey) return false;
            var dragData = {
                sourceView: this.view,
                viewNodes: [],
                records: []
            };
            if (this.view.getSelectionCount() == 1) {
                var i = this.view.getSelectedIndexes()[0];
                var n = this.view.getNode(i);
                dragData.viewNodes.push(dragData.ddel = n);
                dragData.records.push(this.view.store.getAt(i));
                if(Ext.fly(n)!=null){
                    dragData.repairXY = Ext.fly(n).getXY();
                }
            } else {
                dragData.ddel = document.createElement('div');
                dragData.ddel.className = 'multi-proxy';
                this.collectSelection(dragData);
            }
            return dragData;
        }
        return false;
    },

    // override the default repairXY.
    getRepairXY : function(e){
        return this.dragData.repairXY;
    },

    // private
    setDraggable: function(ddGroup){
        if (!ddGroup) return;
        if (Ext.isArray(ddGroup)) {
            Ext.each(ddGroup, this.setDraggable, this);
            return;
        }
        this.addToGroup(ddGroup);
    }
});

Ext.ux.form.MultiSelect.DropZone = function(ms, config){
    this.ms = ms;
    this.view = ms.view;
    var ddGroup = config.ddGroup || 'MultiselectDD';
    var dd;
    if (Ext.isArray(ddGroup)){
        dd = ddGroup.shift();
    } else {
        dd = ddGroup;
        ddGroup = null;
    }
    Ext.ux.form.MultiSelect.DropZone.superclass.constructor.call(this, this.ms.fs.body, { containerScroll: true, ddGroup: dd });
    this.setDroppable(ddGroup);
};

Ext.extend(Ext.ux.form.MultiSelect.DropZone, Ext.dd.DropZone, {
    getTargetFromEvent : function(e) {
        var target = e.getTarget();
        return target;
    },

    // private
    getDropPoint : function(e, n, dd){
        if (n == this.ms.fs.body.dom) { return "below"; }
        var t = Ext.lib.Dom.getY(n), b = t + n.offsetHeight;
        var c = t + (b - t) / 2;
        var y = Ext.lib.Event.getPageY(e);
        if(y <= c) {
            return "above";
        }else{
            return "below";
        }
    },

    // private
    isValidDropPoint: function(pt, n, data) {
        if (!data.viewNodes || (data.viewNodes.length != 1)) {
            return true;
        }
        var d = data.viewNodes[0];
        if (d == n) {
            return false;
        }
        if ((pt == "below") && (n.nextSibling == d)) {
            return false;
        }
        if ((pt == "above") && (n.previousSibling == d)) {
            return false;
        }
        return true;
    },

    // override
    onNodeEnter : function(n, dd, e, data){
        return false;
    },

    // override
    onNodeOver : function(n, dd, e, data){
        var dragElClass = this.dropNotAllowed;
        var pt = this.getDropPoint(e, n, dd);
        if (this.isValidDropPoint(pt, n, data)) {
            if (this.ms.appendOnly) {
                return "x-tree-drop-ok-below";
            }

            // set the insert point style on the target node
            if (pt) {
                var targetElClass;
                if (pt == "above"){
                    dragElClass = n.previousSibling ? "x-tree-drop-ok-between" : "x-tree-drop-ok-above";
                    targetElClass = "x-view-drag-insert-above";
                } else {
                    dragElClass = n.nextSibling ? "x-tree-drop-ok-between" : "x-tree-drop-ok-below";
                    targetElClass = "x-view-drag-insert-below";
                }
                if (this.lastInsertClass != targetElClass){
                    Ext.fly(n).replaceClass(this.lastInsertClass, targetElClass);
                    this.lastInsertClass = targetElClass;
                }
            }
        }
        return dragElClass;
    },

    // private
    onNodeOut : function(n, dd, e, data){
        this.removeDropIndicators(n);
    },

    // private
    onNodeDrop : function(n, dd, e, data){
        if (this.ms.fireEvent("drop", this, n, dd, e, data) === false) {
            return false;
        }
        var pt = this.getDropPoint(e, n, dd);
        if (n != this.ms.fs.body.dom)
            n = this.view.findItemFromChild(n);
        var insertAt = (this.ms.appendOnly || (n == this.ms.fs.body.dom)) ? this.view.store.getCount() : this.view.indexOf(n);
        if (pt == "below") {
            insertAt++;
        }

        var dir = false;

        // Validate if dragging within the same MultiSelect
        if (data.sourceView == this.view) {
            // If the first element to be inserted below is the target node, remove it
            if (pt == "below") {
                if (data.viewNodes[0] == n) {
                    data.viewNodes.shift();
                }
            } else {  // If the last element to be inserted above is the target node, remove it
                if (data.viewNodes[data.viewNodes.length - 1] == n) {
                    data.viewNodes.pop();
                }
            }

            // Nothing to drop...
            if (!data.viewNodes.length) {
                return false;
            }

            // If we are moving DOWN, then because a store.remove() takes place first,
            // the insertAt must be decremented.
            if (insertAt > this.view.store.indexOf(data.records[0])) {
                dir = 'down';
                insertAt--;
            }
        }

        for (var i = 0; i < data.records.length; i++) {
            var r = data.records[i];
            if (data.sourceView) {
                data.sourceView.store.remove(r);
            }
            this.view.store.insert(dir == 'down' ? insertAt : insertAt++, r);
            var si = this.view.store.sortInfo;
            if(si){
                this.view.store.sort(si.field, si.direction);
            }
        }
        return true;
    },

    // private
    removeDropIndicators : function(n){
        if(n){
            Ext.fly(n).removeClass([
                "x-view-drag-insert-above",
                "x-view-drag-insert-left",
                "x-view-drag-insert-right",
                "x-view-drag-insert-below"]);
            this.lastInsertClass = "_noclass";
        }
    },

    // private
   setDroppable: function(ddGroup){
        if (!ddGroup) return;
        if (Ext.isArray(ddGroup)) {
            Ext.each(ddGroup, this.setDroppable, this);
            return;
        }
        this.addToGroup(ddGroup);
    }
});

Ext.reg('multiselect', Ext.ux.form.MultiSelect);