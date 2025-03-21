Ext.ListView = Ext.extend(Ext.DataView, {
    itemSelector: 'dl',
    selectedClass:'x-list-selected',
    overClass:'x-list-over',
    scrollOffset : 19,
    columnResize: true,
    columnSort: true,
    initComponent : function(){
        if(this.columnResize){
            this.colResizer = new Ext.ListView.ColumnResizer(this.colResizer);
            this.colResizer.init(this);
        }
        if(this.columnSort){
            this.colSorter = new Ext.ListView.Sorter(this.columnSort);
            this.colSorter.init(this);
        }
        if(!this.internalTpl){
            this.internalTpl = new Ext.XTemplate(
                '<div class="x-list-header"><div class="x-list-header-inner">',
                '<tpl for="columns">',
                '<div style="width:{width}%;text-align:{align};"><em unselectable="on" id="',this.id, '-xlhd-{#}">',
                '{header}',
                '</em></div>',
                '</tpl>',
                '<div class="x-clear"></div>',
                '</div></div>',
                '<div class="x-list-body"><div class="x-list-body-inner">',
                '</div></div>'
            );
        }
        if(!this.tpl){
            this.tpl = new Ext.XTemplate(
                '<tpl for="rows">',
                '<dl>',
                '<tpl for="parent.columns">',
                '<dt style="width:{width}%;text-align:{align};"><em unselectable="on">',
                '{[values.tpl.apply(parent)]}',
                '</em></dt>',
                '</tpl>',
                '<div class="x-clear"></div>',
                '</dl>',
                '</tpl>'
            );
        };
        var cs = this.columns, allocatedWidth = 0, colsWithWidth = 0, len = cs.length;
        for(var i = 0; i < len; i++){
            var c = cs[i];
            if(!c.tpl){
                c.tpl = new Ext.XTemplate('{' + c.dataIndex + '}');
            }else if(Ext.isString(c.tpl)){
                c.tpl = new Ext.XTemplate(c.tpl);
            }
            c.align = c.align || 'left';
            if(Ext.isNumber(c.width)){
                c.width *= 100;
                allocatedWidth += c.width;
                colsWithWidth++;
            }
        }
        // auto calculate missing column widths
        if(colsWithWidth < len){
            var remaining = len - colsWithWidth;
            if(allocatedWidth < 100){
                var perCol = ((100-allocatedWidth) / remaining);
                for(var j = 0; j < len; j++){
                    var c = cs[j];
                    if(!Ext.isNumber(c.width)){
                        c.width = perCol;
                    }
                }
            }
        }
        Ext.ListView.superclass.initComponent.call(this);
    },

    onRender : function(){
        Ext.ListView.superclass.onRender.apply(this, arguments);

        this.internalTpl.overwrite(this.el, {columns: this.columns});

        this.innerBody = Ext.get(this.el.dom.childNodes[1].firstChild);
        this.innerHd = Ext.get(this.el.dom.firstChild.firstChild);

        if(this.hideHeaders){
            this.el.dom.firstChild.style.display = 'none';
        }
    },

    getTemplateTarget : function(){
        return this.innerBody;
    },

    collectData : function(){
        var rs = Ext.ListView.superclass.collectData.apply(this, arguments);
        return {
            columns: this.columns,
            rows: rs
        }
    },

    verifyInternalSize : function(){
        if(this.lastSize){
            this.onResize(this.lastSize.width, this.lastSize.height);
        }
    },

    // private
    onResize : function(w, h){
        var bd = this.innerBody.dom;
        var hd = this.innerHd.dom
        if(!bd){
            return;
        }
        var bdp = bd.parentNode;
        if(Ext.isNumber(w)){
            var sw = w - this.scrollOffset;
            if(this.reserveScrollOffset || ((bdp.offsetWidth - bdp.clientWidth) > 10)){
                bd.style.width = sw + 'px';
                hd.style.width = sw + 'px';
            }else{
                bd.style.width = w + 'px';
                hd.style.width = w + 'px';
                setTimeout(function(){
                    if((bdp.offsetWidth - bdp.clientWidth) > 10){
                        bd.style.width = sw + 'px';
                        hd.style.width = sw + 'px';
                    }
                }, 10);
            }
        }
        if(Ext.isNumber(h == 'number')){
            bdp.style.height = (h - hd.parentNode.offsetHeight) + 'px';
        }
    },

    updateIndexes : function(){
        if(arguments[0]==-1){
            arguments[0]=0;
        }
        Ext.ListView.superclass.updateIndexes.apply(this, arguments);
        this.verifyInternalSize();
    },

    findHeaderIndex : function(hd){
        hd = hd.dom || hd;
        var pn = hd.parentNode, cs = pn.parentNode.childNodes;
        for(var i = 0, c; c = cs[i]; i++){
            if(c == pn){
                return i;
            }
        }
        return -1;
    },

    setHdWidths : function(){
        var els = this.innerHd.dom.getElementsByTagName('div');
        for(var i = 0, cs = this.columns, len = cs.length; i < len; i++){
            els[i].style.width = cs[i].width + '%';
        }
    }
});

Ext.reg('listview', Ext.ListView);
Ext.ListView.ColumnResizer = Ext.extend(Ext.util.Observable, {
    minPct: .05,

    constructor: function(config){
        Ext.apply(this, config);
        Ext.ListView.ColumnResizer.superclass.constructor.call(this);
    },
    init : function(listView){
        this.view = listView;
        listView.on('render', this.initEvents, this);
    },

    initEvents : function(view){
        //view.mon(view.innerHd, 'mousemove', this.handleHdMove, this);
        this.tracker = new Ext.dd.DragTracker({
            onBeforeStart: this.onBeforeStart.createDelegate(this),
            onStart: this.onStart.createDelegate(this),
            onDrag: this.onDrag.createDelegate(this),
            onEnd: this.onEnd.createDelegate(this),
            tolerance: 3,
            autoStart: 300
        });
        this.tracker.initEl(view.innerHd);
        view.on('beforedestroy', this.tracker.destroy, this.tracker);
    },

    handleHdMove : function(e, t){
        var hw = 5;
        var x = e.getPageX();
        var hd = e.getTarget('em', 3, true);
        if(hd){
            var r = hd.getRegion();
            var ss = hd.dom.style;
            var pn = hd.dom.parentNode;

            if(x - r.left <= hw && pn != pn.parentNode.firstChild){
                this.activeHd = Ext.get(pn.previousSibling.firstChild);
                ss.cursor = Ext.isWebKit ? 'e-resize' : 'col-resize';
            } else if(r.right - x <= hw && pn != pn.parentNode.lastChild.previousSibling){
                this.activeHd = hd;
                ss.cursor = Ext.isWebKit ? 'w-resize' : 'col-resize';
            } else{
                delete this.activeHd;
                ss.cursor = '';
            }
        }
    },

    onBeforeStart : function(e){
        this.dragHd = this.activeHd;
        return !!this.dragHd;
    },

    onStart: function(e){
        this.view.disableHeaders = true;
        this.proxy = this.view.el.createChild({cls:'x-list-resizer'});
        this.proxy.setHeight(this.view.el.getHeight());

        var x = this.tracker.getXY()[0];
        var w = this.view.innerHd.getWidth();

        this.hdX = this.dragHd.getX();
        this.hdIndex = this.view.findHeaderIndex(this.dragHd);

        this.proxy.setX(this.hdX);
        this.proxy.setWidth(x-this.hdX);

        this.minWidth = w*this.minPct;
        this.maxWidth = w - (this.minWidth*(this.view.columns.length-1-this.hdIndex));
    },

    onDrag: function(e){
        var cursorX = this.tracker.getXY()[0];
        this.proxy.setWidth((cursorX-this.hdX).constrain(this.minWidth, this.maxWidth));
    },

    onEnd: function(e){
        var nw = this.proxy.getWidth();
        this.proxy.remove();

        var index = this.hdIndex;
        var vw = this.view, cs = vw.columns, len = cs.length;
        var w = this.view.innerHd.getWidth(), minPct = this.minPct * 100;

        var pct = Math.ceil((nw*100) / w);
        var diff = cs[index].width - pct;
        var each = Math.floor(diff / (len-1-index));
        var mod = diff - (each * (len-1-index));

        for(var i = index+1; i < len; i++){
            var cw = cs[i].width + each;
            var ncw = Math.max(minPct, cw);
            if(cw != ncw){
                mod += cw - ncw;
            }
            cs[i].width = ncw;
        }
        cs[index].width = pct;
        cs[index+1].width += mod;
        delete this.dragHd;
        this.view.setHdWidths();
        this.view.refresh();
        setTimeout(function(){
            vw.disableHeaders = false;
        }, 100);
    }
});
Ext.ListView.Sorter = Ext.extend(Ext.util.Observable, {
    sortClasses : ["sort-asc", "sort-desc"],

    constructor: function(config){
        Ext.apply(this, config);
        Ext.ListView.Sorter.superclass.constructor.call(this);
    },

    init : function(listView){
        this.view = listView;
        listView.on('render', this.initEvents, this);
    },

    initEvents : function(view){
        //view.mon(view.innerHd, 'click', this.onHdClick, this);
        view.innerHd.setStyle('cursor', 'pointer');
        //view.mon(view.store, 'datachanged', this.updateSortState, this);
        this.updateSortState.defer(10, this, [view.store]);
    },

    updateSortState : function(store){
        var state = store.getSortState();
        if(!state){
            return;
        }
        this.sortState = state;
        var cs = this.view.columns, sortColumn = -1;
        for(var i = 0, len = cs.length; i < len; i++){
            if(cs[i].dataIndex == state.field){
                sortColumn = i;
                break;
            }
        }
        if(sortColumn != -1){
            var sortDir = state.direction;
            this.updateSortIcon(sortColumn, sortDir);
        }
    },

    updateSortIcon : function(col, dir){
        var sc = this.sortClasses;
        var hds = this.view.innerHd.select('em').removeClass(sc);
        hds.item(col).addClass(sc[dir == "DESC" ? 1 : 0]);
    },

    onHdClick : function(e){
        var hd = e.getTarget('em', 3);
        if(hd && !this.view.disableHeaders){
            var index = this.view.findHeaderIndex(hd);
            this.view.store.sort(this.view.columns[index].dataIndex);
        }
    }
});

/**
 * 检查参数是否是数字
 * @param mix object
 * @return boolean
 */
Ext.isNumber = function(object) {
    return typeof object == "number";
};
