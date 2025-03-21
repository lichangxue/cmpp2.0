
/**
 *控件公共属性配置
*/
Designer.controls.commonProperty = {
    ui: {
		lan: "UI",
		value: {
			fieldLabel: { value: '标签', lan: '标签', type: 'CustomEditors_TextArea'},
			hideLabel: { value: false, lan: '隐藏标签' },
			labelStyle: { value: '', lan: '标签样式', type: 'CustomEditors_TextArea' },
			fieldNote: { value: '', lan: '说明', type: 'CustomEditors_TextArea' },
			hideNote: { value: true, lan: '隐藏说明' },
			noteStyle: { value: '', lan: '说明样式', type: 'CustomEditors_TextArea' },
			style: { value: '', lan: '样式', type: 'CustomEditors_TextArea' }
		}
    },
	mod: { 
		lan: "模式", 
		value: {
			inputType_new: { value: 1, lan: '新建时模式', type: 'ComboBox', extra:{loadStore: Static.inputType },help:"新建记录时的模式"},
			inputType_edit: { value: 1, lan: '编辑时模式', type: 'ComboBox', extra:{loadStore: Static.inputType }}
		}
    },
	db: { 
		lan: "字段配置", 
		value: {
			f_saveType: { value: '2', lan: 'db_字段存储类型', type: 'ComboBox',extra:{loadStore: Static.saveType }},
			f_name: { value: "", lan: 'db_字段名',type: 'CustomEditors_TextField_alphanum' },
			f_type: { value: "VARCHAR", lan: 'db_类型', type: 'DbType' },
			f_length: { value: 255, lan: 'db_长度' },
			f_allowNull: { value: true, lan: 'db_允许为空' },
			l_allowSearch: { value: true, lan: '可搜索' },
			l_allowSort: { value: true, lan: '可排序' },
			indexType: { value: 1, lan: '索引类型', type: 'ComboBox', extra:{loadStore: Static.indexType} }
		}
    },
	mem: { 
		lan: "记忆功能", 
		value: {
			memory_enable: { value: false, lan: '是否启用'},
			memory_max_count: { value: 3, lan: '记忆数量'},
			memory_must_fill:{value:false,lan:'是否自动填值'}
		}
    }
};
Designer.controls.events={
	change: { value: "", lan: 'onChange', type: 'Event',help:{dataId:5} },
	blur: { value: "", lan: 'onBlur', type: 'Event' ,help:{dataId:5} },
	focus: { value: "", lan: 'onFocus', type: 'Event',help:{dataId:5} }
}
Designer.controls.events2={
	change: { value: "", lan: 'onChange', type: 'Event',help:{dataId:5} }
}

/**
 *控件UI配置、属性配置
*/
Designer.controls.ui = {
    FormPanel: {
        isTool: false, //是否出现在工具箱里
        design: {//设计时
            name: 'Ext.form.FormPanel',
            rtName: 'Ext.form.FormPanel',
            ui: {
                //title: '我的表单',
                buttonAlign: 'center',
                xtype: 'form',
                layout: 'xform',
                anchor: '100%',
                labelWidth: 100,
                noteWidth: 200, //extended for the right tip column;
                items: {},
                padding: "10px",
                margin: "20px",
				height:2000,
                frame: true,
				autoScroll:true
				//bodyStyle:"min-height:1500px;"
            }
        },
        property: {
            ui: { 
				lan: "UI",
				value: {
					title: { value: '我的表单', lan: '名称',required:true},
					bodyStyle:{ value: '', lan: 'bodyStyle', type: 'CustomEditors_TextArea' },
					labelWidth: { value: 100, lan: '标签宽度' },
					hideLabels: { value: false, lan: '隐藏标签' },
					noteWidth: { value: 0, lan: '说明宽度' },
					hideNotes: { value: false, lan: '隐藏说明' }
                }
            },
            script: { 
				lan: "脚本注入", 
				value: {
					s_beforeJs: { value: '', lan: '保存前JS脚本', type: 'CustomEditors_TextArea',help:{url:"http://g.cmpp.ifeng.com/Cmpp/runtime/interface_343.jhtml?dataId=1"} },
					s_savedJs: { value: '', lan: '保存后JS脚本', type: 'CustomEditors_TextArea' ,help:{dataId:2} },
					s_afterJs: { value: '', lan: '加载后JS脚本', type: 'CustomEditors_TextArea' ,help:{dataId:3} },
					s_onloadJs: { value: '', lan: '事件JS脚本', type: 'CustomEditors_TextArea_cb',help:{dataId:4}  }/*,
					s_powerRegex: { value: '', lan: '权限表达式' },
					s_powerScript: { value: '', lan: '权限脚本', type: 'CustomEditors_TextArea' }
					*/
				}
            },
            buttons: { lan: "按钮配置", value: {
                b_save: { value: true, lan: '保存' },
                b_saveAndAdd: { value: true, lan: '保存并继续添加' },
                b_saveAndClose: { value: true, lan: '保存并关闭' },
                b_preview: { value: true, lan: '预览' },
                b_close: { value: true, lan: '关闭' }
            }
            },
            template: { lan: "模板配置", value: {
                defaultTpl: { value: 'template_1', lan: '默认模板', type: 'ComboBox', extra:{loadStore: ( typeof Designer_controls_formTemplate !== 'undefined' ? Designer_controls_formTemplate : [['template_1', '标准视图'], ['template_for_idxEditor', '碎片编辑视图'],['template_for_templateDesign','碎片设计视图'],['template_for_tuijianwei','推荐位数据项编辑视图']] )}},
                customedTpl: { value: '', lan: '自定义模板', type: 'CustomEditors_TextArea' },
				headInject: { value: '', lan: '&lt;/head&gt;之前注入', type: 'CustomEditors_TextArea' },
				bodyInject: { value: '', lan: '&lt;/body&gt;之前注入', type: 'CustomEditors_TextArea' }
            }
            }/*,
			tableBak:{lan: "分表配置",value: {
				enableBak: { value: true, lan: '是否分表' },
				recordCount: { value: 2000000, lan: '按数据量' },
				dateFieldName: { value: "", lan: '按日期字段' }
			}
			}*/
        }
    }
	, FieldSet: {
	    text: 'FieldSet',
	    tip: "可折叠容器",
	    icon: '',
	    design: {//设计时
	        name: 'Ext.de.FieldSet',
	        rtName: 'Ext.form.FieldSet',
	        ui: {
	            title: '可折叠容器'
	            ,isFormField: true
                , xtype: "xfieldset"
                , isContainer: true//marked as container to enable dropin;
                , layout: 'xform'
                , onRemove: function (el, c) {
                    Ext.destroy(c.container.up('.x-form-item'));
                }
                , initEvents: function () {
                    if (this.keys) {
                        this.getKeyMap();
                    }
                    if (this.draggable) {
                        this.initDraggable();
                    }
                    this.on("remove", this.onRemove, this);
                }
	        }
	    },
	    property: {
	        ui: {lan:"UI", value: {
					title: { value: '可折叠容器', lan: '容器名称' },
					collapsed: { value: false, lan: '默认折叠' },
					labelWidth: { value: 100, lan: '标签宽度' },
					hideLabels: { value: false, lan: '隐藏子项标签' },
					noteWidth: { value: 100, lan: '说明宽度' },
					hideNote: { value: true, lan: '隐藏说明' }	,
					hideNotes: { value: false, lan: '隐藏子项说明' }	        
                }
	        }
	    }
	}
    ,TextField: {
        text: 'TextField',
        tip: "单行文本域",
        icon: null,
		relyJS:['controls/Ext.ux.TextField.js'],//依赖脚本文件
        design: {//设计时
            name: 'Ext.form.TextField',
            rtName: 'Ext.ux.TextField',
            ui: {
                width: 300,
                style: 'cursor:default',
                emptyText: ""
            }
        },
        //在属性表显示的属性
        property: {
            ui: { value: {
                width: { value: 300, lan: '宽度' },
				anchor: { value: "", lan: 'anchor(%)' },
                readOnly: { value: false, lan: '只读' },
                value: { value: "", lan: '默认值' },
                emptyText: { value: "", lan: '输入提示' },
                allowBlank: { value: true, lan: '允许为空' },
                blankText: { value: "不能为空", lan: '输入为空提示' },
                regex: { value: "", lan: '正则表达式', type: 'CustomEditors_TextArea' },
                regexText: { value: "输入不合法", lan: '验证提示' },
                vtype: { value: '', lan: '输入类型', type: 'ComboBox',extra:{loadStore: [['', '不限'], ['alpha', '字母'],['num', '数字'], ['alphanum', '字母和数字'], ['email', 'email'], ['url', 'url']] }},
                vtypeText: { value: "", lan: '输入类型验证提示' },
				speechEnable:{ value: false, lan: '语音输入' }
            }
            },
            events: { lan: "事件", value: Designer.controls.events
            }
        }
    },
	NumberField: {
        text: 'NumberField',
        tip: "数字文本域",
        icon: null,
        design: {//设计时
            name: 'Ext.form.NumberField',
            rtName: 'Ext.form.NumberField',
            ui: {
                width: 50,
                style: 'cursor:default',
                emptyText: ""
            }
        },
        //在属性表显示的属性
        property: {
            ui: { 
				value: {
					width: { value: 50, lan: '宽度' },
					anchor: { value: "", lan: 'anchor(%)' },
					readOnly: { value: false, lan: '只读' },
					value: { value: "", lan: '默认值' },
					emptyText: { value: "", lan: '输入提示' },
					allowBlank: { value: true, lan: '允许为空' },
					blankText: { value: "不能为空", lan: '输入为空提示' },
					decimalPrecision: { value: 2, lan: '小数点位数' },
					maxValue: { value: "", lan: '最大值' },
					minValue: { value: "", lan: '最小值' },
					speechEnable:{ value: false, lan: '语音输入' }
				}
            },
            events: { 
				lan: "事件",
				value: Designer.controls.events
            }
        }
    },
	UrlTextField: {
	    text: 'UrlTextField',
	    tip: "url控件",
	    icon: null,
		relyJS:['controls/Ext.ux.UrlTextField.js?v=20160317'],//依赖脚本文件
	    design: {//设计时
	        name: 'Ext.form.TextField',
	        rtName: 'Ext.ux.UrlTextField',
	        ui: {
                style: 'cursor:default',
                emptyText: "url控件"
	        }
	    },
	    //在属性表显示的属性
	    property: {
	        ui: {
				value: {
					fieldLabel: { value: 'url地址', lan: '标签' },
					width:{ value: 300, lan: '宽度' },
					hideLabel: {value:false,lan:"隐藏标签"},
					viewButtonVisible: {value:true,lan:"查看按钮可见"},
					copyButtonVisible: {value:true,lan:"复制按钮可见"},
					previewText: { value: "浏览", lan: '浏览按钮文本' },
					copyText: { value: "复制", lan: '复制按钮文本' },
					readOnly: { value: false, lan: '只读' },
					value: { value: "", lan: '默认值' },
					emptyText: { value: "", lan: '输入提示' },
					allowBlank: { value: true, lan: '允许为空' },
					blankText: { value: "不能为空", lan: '输入为空提示' },
					vtype: { value: 'url', lan: '输入类型', type: 'ComboBox',extra:{loadStore: [['', '不限'], ['alpha', '字母'],['num', '数字'], ['alphanum', '字母和数字'], ['email', 'email'], ['url', 'url']] }}
				}
			},
			events: { 
				lan: "事件", 
				value:Designer.controls.events
			}
	    }
	},
	Hidden: {
        text: 'Hidden',
        tip: "隐藏控件",
        icon: null,
        design: {//设计时
            name: 'Ext.de.Hidden',
            rtName: 'Ext.form.Hidden',
            ui: {
                hideLabel: false
				, hideNote: true
            }
        },
        //在属性表显示的属性
        property: {
            ui: { value: {
                value: { value: "", lan: '默认值' }
            }
            }
        }
    },
    TextArea: {
        text: 'TextArea',
        tip: "多行文本域",
        icon: null,
        design: {//设计时
            name: 'Ext.form.TextArea',
            rtName: 'Ext.form.TextArea',
            ui: {
                width: 300,
                style: 'cursor:default',
                emptyText: ""
            }
        },
        //在属性表显示的属性
        property: {
            ui: { value: {
                width: { value: 300, lan: '宽度' },
				anchor: { value: "", lan: 'anchor(%)' },
                height: { value: 300, lan: '高度' },
                readOnly: { value: false, lan: '只读' },
                value: { value: "", lan: '默认值', type: 'CustomEditors_TextArea' },
                emptyText: { value: "", lan: '输入提示' },
                allowBlank: { value: true, lan: '允许为空' },
                minLength: { value: 0, lan: '最小字数' },
                maxLength: { value: 9999999999, lan: '最大字数' },
                maxLengthText: { value: "不能多于n字", lan: '最大字数提示' },
                blankText: { value: "不能为空", lan: '输入为空提示' },
                blankText: { value: "不能为空", lan: '输入为空提示' }
            }
            },
            events: { 
				lan: "事件", value: Designer.controls.events
            }
        }
    },
    TextArea2: {
        text: 'TextArea2',
        tip: "多行文本域(带字数提示)",
        icon: null,
		relyJS:['controls/Ext.ux.TextArea2.js'],//依赖脚本文件
        design: {//设计时
            name: 'Ext.ux.TextArea2',
            rtName: 'Ext.ux.TextArea2',
            ui: {
                width: 300,
                style: 'cursor:default',
                emptyText: ""
            }
        },
        //在属性表显示的属性
        property: {
            ui: { value: {
                width: { value: 300, lan: '宽度' },
				anchor: { value: "", lan: 'anchor(%)' },
                height: { value: 300, lan: '高度' },
                readOnly: { value: false, lan: '只读' },
                value: { value: "", lan: '默认值', type: 'CustomEditors_TextArea' },
                emptyText: { value: "", lan: '输入提示' },
                allowBlank: { value: true, lan: '允许为空' },
                minLength: { value: 0, lan: '最小字数' },
                maxLength: { value: 9999999999, lan: '最大字数' },
                maxLengthText: { value: "不能多于n字", lan: '最大字数提示' },
                blankText: { value: "不能为空", lan: '输入为空提示' },
                warnCharCount: { value: "500", lan: '红色警报字数' }
            }
            },
            events: { 
				lan: "事件", value: Designer.controls.events
            }
        }
    },
/*	
    TextAreaPretty: {
        text: 'TextAreaPretty',
        tip: "代码编辑框",
        icon: null,
		about:{
			version:"1.0",
			author:"程邓时chengds@ifeng.com",
			update:"<p>代码编辑器控件 V1.0</p>",
			help:'<p>控件用途说明</p><p>该控件适用于代码量不大的HTML和JS代码片段的显示和编辑。HTML和JS代码将会被渲染为彩色，增强代码的可读性</p><p>配置注意事项：<p>若出现控件内代码重影现象,需要重新配置一下宽度，合适的宽度可避免代码重影<p>。。。待续</p>'
		},	
		relyJS:['controls/Ext.ux.TextAreaPretty.js','lib/prettify.js'],
		relyCSS:['Ext.ux.TextAreaPretty.css','prettify.css'],
        design: {//设计时
            name: 'Ext.form.TextArea',
            rtName: 'Ext.ux.TextAreaPretty',
            ui: {
                width: 500,
				height:150,
                style: 'cursor:default',
				value:'代码编辑框',
                emptyText: ""
            }
        },
        //在属性表显示的属性
        property: {
            ui: { 
				value: {
					width: { value: 600, lan: '宽度' },
					height: { value: 300, lan: '高度' },
					readOnly: { value: false, lan: '只读' },
					value: { value: "", lan: '默认值', type: 'CustomEditors_TextArea' },
					emptyText: { value: "", lan: '输入提示' },
					allowBlank: { value: true, lan: '允许为空' },
					helpHtml:{value:'该控件适用于代码量不大的HTML和JS代码片段的显示和编辑。HTML和JS代码将会被渲染为彩色，增强代码的可读性',lan: '帮助',type: 'CustomEditors_TextArea'  }
				}
            }
        }
    },		
*/    CheckboxGroup: {
        text: 'CheckboxGroup',
        tip: "复选框",
        icon: null,
		relyJS:['controls/Ext.ux.CheckboxGroup.js'],//依赖脚本文件
        design: {//设计时
            name: 'Ext.de.CheckboxGroup',
            rtName: 'Ext.ux.CheckboxGroup',
            ui: {
                width: 300,
                data: "[[1,'美国'],[2,'中国'],[3,'日本']]",
                value: "[1,3]"
            }
        },
        //在属性表显示的属性
        property: {
            ui: { value: {
                readOnly: { value: false, lan: '只读' },
                value: { value: "", lan: '默认值', type: 'CustomEditors_TextArea' }
            }
            },
            data: { lan: "数据源配置", value: {
                ext_dataSource_type: { value: "json", lan: 'ext_数据源类型', type: 'ComboBox', extra:{loadStore: [['json', 'json'], ['sql', 'sql'], ['url', 'url']]} },
                ext_dataSource_value: { value: "[[1,'美国'],[2,'中国'],[3,'日本']]", lan: 'ext_数据源内容', type: "CustomEditors_TextArea" },
				ext_dataSource_asyc: { value: true, lan: 'ext_是否同步获取数据' }
            }
            },
            events: { 
				lan: "事件", value: Designer.controls.events2
            }
        }
    },
    RadioGroup: {
        text: 'RadioGroup',
        tip: "单选框",
        icon: null,
		relyJS:['controls/Ext.ux.RadioGroup.js'],//依赖脚本文件
        design: {//设计时
            name: 'Ext.de.RadioGroup',
            rtName: 'Ext.ux.RadioGroup',
            ui: {
                width: 300,
                data: "[[1,'男'],[2,'女']]",
                value: "2"
            }
        },
        //在属性表显示的属性
        property: {
            ui: { value: {
                labelFirst: { value: false, lan: '标签在前' },
                readOnly: { value: false, lan: '只读' },
                dataSource: { value: "[[1,'男'],[2,'女']]", lan: '数据源', type: 'CustomEditors_TextArea' },
                value: { value: "", lan: '默认值' }
            }
            },
            data: { lan: "数据源配置", value: {
                ext_dataSource_type: { value: "json", lan: 'ext_数据源类型', type: 'ComboBox', extra:{loadStore: [['json', 'json'], ['sql', 'sql'], ['url', 'url']] }},
                ext_dataSource_value: { value: "[[1,'男'],[2,'女']]", lan: 'ext_数据源内容', type: "CustomEditors_TextArea" },
				ext_dataSource_asyc: { value: true, lan: 'ext_是否同步获取数据' }
            }
            },
            events: { 
				lan: "事件", value: Designer.controls.events2
            }
        }
    },
    TitleField: {
        text: 'TitleField',
        tip: "标题文本域",
        icon: null,
		relyJS:['controls/Ext.ux.TitleField.js?20120930'],//依赖脚本文件
        design: {//设计时
            name: 'Ext.ux.TitleField',
            rtName: 'Ext.ux.TitleField',
            ui: {
                width: 300,
                style: 'cursor:default',
                emptyText: ""
            }
        },
        //在属性表显示的属性
        property: {
            ui: { 
				value: {
					width: { value: 300, lan: '宽度' },
					anchor: { value: "", lan: 'anchor(%)' },
					readOnly: { value: false, lan: '只读' },
					value: { value: "", lan: '默认值' },
					maxLength: { value: 999999999, lan: '最大字数' },
					emptyText: { value: "", lan: '输入提示' },
					allowBlank: { value: true, lan: '允许为空' },
					blankText: { value: "不能为空", lan: '输入为空提示' },
					regex: { value: "", lan: '正则表达式', type: 'CustomEditors_TextArea' },
					regexText: { value: "输入不合法", lan: '验证提示' },
					vtype: { value: '', lan: '输入类型', type: 'ComboBox',extra:{loadStore: [['', '不限'], ['alpha', '字母'],['num', '数字'], ['alphanum', '字母和数字'], ['email ', 'email'], ['url ', 'url']] }},
					vtypeText: { value: "", lan: '输入类型验证提示' },
					
					fontSize:{ value: 12, lan: '页面字体大小' },
					rulerNums:{ value: "[12,18]", lan: '字数提示' },
					speechEnable:{ value: false, lan: '语音输入' }
				}
            },
			events: { 
				lan: "事件", value: Designer.controls.events
            }
        }
    },
	ComboBox: {
	    text: 'ComboBox',
	    tip: "下拉框",
	    icon: '',
	    design: {//设计时
	        name: 'Ext.form.ComboBox',
	        rtName: 'Ext.form.ComboBox',
	        ui: {
	            width: 300,
	            value: '', //默认值
	            emptyText: "",
	            inputType: 'text',
				triggerAction:"all"
	        }
	    },
	    property: {
	        ui: { value: {
	            width: { value: 300, lan: '宽度' },
	            value: { value: "", lan: '默认值' },
	            emptyText: { value: "", lan: '输入提示' },
	            allowBlank: { value: true, lan: '允许为空' },
	            blankText: { value: "不能为空", lan: '输入为空提示' },

	            maxListHeight: { value: 300, lan: '最大列表高度' },
	            minChars: { value: 2, lan: '触发搜索字数' },
	            typeAhead: { value: true, lan: '允许自动匹配' },
	            editable: { value: false, lan: '允许用户插入' },
	            forceSelection: { value: true, lan: '强制选中' }//,
				
	            //triggerAction: { value: "all", lan: '显示列表方式', type: 'ComboBox_1', store: [['all', 'All'], ['query', 'Query']] }	        
	            }
	        },
	        data: { lan: "数据源配置", value: {
	            ext_dataSource_type: { value: "json", lan: 'ext_数据源类型', type: 'ComboBox', extra:{loadStore: [['json', 'json'], ['sql', 'sql'], ['url', 'url']] }},
	            ext_dataSource_value: { value: "[[1,'美国'],[2,'中国']]", lan: 'ext_数据源内容', type: "CustomEditors_TextArea" },
				ext_dataSource_asyc: { value: false, lan: 'ext_是否同步获取数据' }
	        }	        
	        },
            events: { 
				lan: "事件", value: Designer.controls.events2
            }
	    }
	},
	ComboBoxQuery: {
	    text: 'ComboBoxQuery',
	    tip: "可查询的下拉框",
	    icon: '',
		relyJS:['controls/Ext.ux.ComboBoxQuery.js'],//依赖脚本文件
		about:{
			version:"1.0",
			author:"程邓时chengds@ifeng.com",
			update:"<p>可查询的下拉框 V1.0</p>",
			help:"<p>数据源(接口)数据格式范例：[{value:'1',text:'中国',jp:['zg'],qp:['zhongguo']},{value:'2',text:'美国',jp:['mg'],qp:['meiguo']}]</p>"
		},
	    design: {//设计时
	        name: 'Ext.form.ComboBox',
	        rtName: 'Ext.ux.ComboBoxQuery',
	        ui: {
	            width: 300,
	            value: '', //默认值
	            emptyText: "可搜索的下拉框"
	        }
	    },
	    property: {
	        ui: { 
				value: {
					width: { value: 300, lan: '宽度' },
					value: { value: "", lan: '默认值' },
					emptyText: { value: "支持搜索过滤", lan: '输入提示' },
					allowBlank: { value: true, lan: '允许为空' },
					blankText: { value: "不能为空", lan: '输入为空提示' },
					matchMode: { value: 1, lan: '匹配模式' , type: 'ComboBox', extra:{loadStore: [[1, '从首位匹配'], [2, '任意位置匹配']] }},
					fields:{ value: "['value','text','jp','qp']", lan: '所有字段' },
					valueField: { value: "value", lan: '值字段' },
					displayField: { value: "text", lan: '文本字段' },
					queryFields: { value: "['text','jp','qp']", lan: '可查询的字段' },
					minChars: { value: 0, lan: '触发查询最小字符数',help:'输入几个字符时触发查询' }					
	            }
	        },
	        data: { 
				lan: "数据源配置", 
				value: {
					ext_dataSource_type: { value: "json", lan: 'ext_数据源类型', type: 'ComboBox', extra:{loadStore: [['json', 'json'], ['url', 'url']] }},
					ext_dataSource_value: { value: "[{value:'1',text:'中国',jp:['zg'],qp:['zhongguo']},{value:'2',text:'美国',jp:['mg'],qp:['meiguo','moguo']}]", lan: 'ext_数据源内容', type: "CustomEditors_TextArea" }
					
				
				}	        
	        }
	    }
	},
	MultiSelect: {
	    text: 'MultiSelect',
	    tip: "多选下拉框",
	    icon: '',
		relyJS:['controls/Ext.ux.MultiSelect.js'],//依赖脚本文件
		about:{
			version:"1.0",
			author:"程邓时chengds@ifeng.com",
			update:"<p>多选下拉框 V1.0</p>",
			help:'<p>数据源数据格式范例：[[1,"中国"],[2,"美国"]]</p>'
		},
	    design: {//设计时
	        name: 'Ext.form.ComboBox',
	        rtName: 'Ext.ux.MultiSelect',
	        ui: {
	            width: 300,
	            value: '', //默认值
	            emptyText: "多选下拉框",
	            inputType: 'text',
				triggerAction:"all"
	        }
	    },
	    property: {
	        ui: { 
				value: {
					width: { value: 300, lan: '宽度' },
					value: { value: "", lan: '默认值' },
					emptyText: { value: "", lan: '输入提示' },
					allowBlank: { value: true, lan: '允许为空' },
					blankText: { value: "不能为空", lan: '输入为空提示' },
					editable:{ value: true, lan: '允许显示光标' },
					separator: { value: "#", lan: '分割符' },
					valueField: { value: "value", lan: '值字段' },
					displayField: { value: "text", lan: '文本字段' }
	            }
	        },
	        data: { 
				lan: "数据源配置", 
				value: {
					ext_dataSource_type: { value: "json", lan: 'ext_数据源类型', type: 'ComboBox', extra:{loadStore: [['json', 'json'], ['sql', 'sql'], ['url', 'url']] }},
					ext_dataSource_value: { value: "[[1,'美国'],[2,'中国']]", lan: 'ext_数据源内容', type: "CustomEditors_TextArea" }
				}	        
	        }
	    }
	},
	MultiSelectQuery: {
	    text: 'MultiSelectQuery',
	    tip: "可搜索的多选下拉框",
	    icon: '',
		relyJS:['controls/Ext.ux.MultiSelectQuery.js'],//依赖脚本文件
		about:{
			version:"1.0",
			author:"程邓时chengds@ifeng.com",
			update:"<p>可搜索的多选下拉框 V1.0</p>",
			help:"<p>数据源(接口)数据格式范例：[{value:'1',text:'中国',jp:['zg'],qp:['zhongguo']},{value:'2',text:'美国',jp:['mg'],qp:['meiguo']}]</p><p>控件值数据格式：[1,3,4]</p>"
		},
	    design: {//设计时
	        name: 'Ext.form.ComboBox',
	        rtName: 'Ext.ux.MultiSelectQuery',
	        ui: {
	            width: 300,
	            value: '', //默认值
	            emptyText: "可搜索的多选下拉框"
	        }
	    },
	    property: {
	        ui: { 
				value: {
					width: { value: 300, lan: '宽度' },
					value: { value: "[2,3,5]", lan: '默认值' },
					emptyText: { value: "", lan: '输入提示' },
					matchMode: { value: 1, lan: '匹配模式' , type: 'ComboBox', extra:{loadStore: [[1, '从首位匹配'], [2, '任意位置匹配']] }},
					fields:{ value: "['value','text','jp','qp']", lan: '所有字段' },
					valueField: { value: "value", lan: '值字段' },
					displayField: { value: "text", lan: '文本字段' },
					queryFields: { value: "['text','jp','qp']", lan: '可查询的字段' },
					minChars: { value: 0, lan: '触发查询最小字符数',help:'输入几个字符时触发查询' }					
	            }
	        },
	        data: { 
				lan: "数据源配置", 
				value: {
					ext_dataSource_type: { value: "json", lan: 'ext_数据源类型', type: 'ComboBox', extra:{loadStore: [['json', 'json'], ['url', 'url']] }},
					ext_dataSource_value: { value: "[{value:'1',text:'中国',jp:['zg'],qp:['zhongguo']},{value:'2',text:'美国',jp:['mg'],qp:['meiguo','moguo']}]", lan: 'ext_数据源内容', type: "CustomEditors_TextArea" }
				}	        
	        }
	    }
	},
	TreeComboBox: {
	    text: 'TreeComboBox',
	    tip: "树形单选下拉框",
	    icon: '',
		relyJS:['controls/Ext.ux.TreeComboBox.js?20130418'],//依赖脚本文件
		about:{
			version:"1.0",
			author:"程邓时chengds@ifeng.com",
			update:"<p>可搜索的树形单选下拉框 V1.0</p>",
			help:'<p>数据源(接口)数据格式范例：[ { "text" : "专题", "asyn" : true, "value" : "frm2018-28-", "leaf" : true}, { "text" : "策划", "asyn" : true, "value" : "frm2018-30-", "leaf" : false, children: [{ text: "营销", value:"yingxiao", leaf: true },{ text: "广告", value:"guanggao", leaf: true }] } ]</p>'
		},
	    design: {//设计时
	        name: 'Ext.form.ComboBox',
	        rtName: 'Ext.ux.TreeComboBox',
	        ui: {
	            width: 300,
	            value: '', //默认值
	            emptyText: "树形单选下拉框"
	        }
	    },
	    property: {
	        ui: { 
				value: {
					width: { value: 300, lan: '宽度' },
					value: { value: "", lan: '默认值' },
					emptyText: { value: "", lan: '输入提示' },
					matchMode: { value: 1, lan: '匹配模式' , type: 'ComboBox', extra:{loadStore: [[1, '从首位匹配'], [2, '任意位置匹配']] }},
					searchable:{ value: true, lan: '允许搜索' },
					maxHeight:{ value: 350, lan: '下拉框最大高度' },
					valueField: { value: "value", lan: '值字段' },
					displayField: { value: "text", lan: '文本字段' },
					queryFields: { value: "['text','jp','qp']", lan: '可查询的字段' },
					minChars: { value: 0, lan: '触发查询最小字符数',help:'输入几个字符时触发查询' }					
	            }
	        },
	        data: { 
				lan: "数据源配置", 
				value: {
					ext_dataSource_type: { value: "json", lan: 'ext_数据源类型', type: 'ComboBox', extra:{loadStore: [['json', 'json'], ['url', 'url']] }},
				ext_dataSource_value: { value: '[ { "text" : "专题", "asyn" : true, "value" : "frm2018-28-", "leaf" : true}, { "text" : "策划", "asyn" : true, "value" : "frm2018-30-", "leaf" : false, children: [{ text: "营销", value:"yingxiao", leaf: true },{ text: "广告", value:"guanggao", leaf: true }] } ]', lan: 'ext_数据源内容', type: "CustomEditors_TextArea" }
				}	        
	        }
	    }
	},
	TreeField: {
	    text: 'TreeField',
	    tip: "栏目选择器",
	    icon: '',
		relyJS:['controls/Ext.ux.ListPanel.js','controls/Ext.ux.TreeField.js?v=20160421'],//依赖脚本文件
		about:{
			version:"1.0",
			author:"程邓时chengds@ifeng.com",
			update:"<p>专题栏目选择器 V1.0</p>",
			help:'<p>该控件提供了lark专题系统的栏目树状下拉框以及搜索专题功能。value格式:{"text":"相关评论","title":"明星>刘德华结婚>相关评论","value":2}</p>'
		},
	    design: {//设计时
	        name: 'Ext.form.ComboBox',
	        rtName: 'Ext.ux.TreeField',
	        ui: {
	            width: 300,
	            value: '', //默认值
	            emptyText: "专题栏目选择器",
				fieldNote:"lark系统的栏目"
	        }
	    },
	    property: {
	        ui: { 
				value: {
					width: { value: 300, lan: '宽度' },
					value: { value: "", lan: '默认值' },
					emptyText: { value: "", lan: '输入提示' },
					proxyUrl: { value: "", lan: '代理url',help:'当需要跨域请求数据时，必须使用代理，代理地址有../runtime/proxy!sendPost.jhtml和../runtime/proxy!sendGet.jhtml' },
					dataUrl: { value: "../runtime/lark!getCategoryByPid.jhtml?nodeId={nodeId}&pid=0", lan: '栏目树数据源接口' },
					queryUrl: { value: "../runtime/lark!querySpecial.jhtml", lan: '栏目查询接口' },
					getSubCategoryUrl: { value: "../runtime/lark!getSpecialSubCategory.jhtml?specialId=",lan: '子栏目查询接口' },
					editable:{ value: false, lan: '可编辑' },
					listWidth:{ value: 350, lan: '下拉框宽度' },
					listHeight:{ value: 350, lan: '下拉框高度' },
					onlyLeafSelectable:{ value: false, lan: '只有叶子可选' },
					multiSelectable:{ value: false, lan: '可多选' },
					valueField: { value: "value", lan: '值字段' },
					displayField: { value: "title", lan: '显示字段' }
	            }
	        }
	    }
	},
	
	
	MultiSelectTree: {
	    text: 'MultiSelectTree',
	    tip: "树形多选下拉框",
	    icon: '',
		relyJS:['controls/Ext.ux.TreeComboBox.js?20130509','controls/Ext.ux.MultiSelectTree.js?20130905'],//依赖脚本文件
		about:{
			version:"1.0",
			author:"程邓时chengds@ifeng.com",
			update:"<p>可搜索的多选下拉框 V1.0</p>",
			help:'<p>数据源(接口)数据格式范例：[ { "text" : "专题", "asyn" : true, "value" : "frm2018-28-", "leaf" : true}, { "text" : "策划", "asyn" : true, "value" : "frm2018-30-", "leaf" : false, children: [{ text: "营销", value:"yingxiao", leaf: true },{ text: "广告", value:"guanggao", leaf: true }] } ]</p><p>控件值数据格式：["yingxiao","guanggao"]</p>'
		},
	    design: {//设计时
	        name: 'Ext.form.ComboBox',
	        rtName: 'Ext.ux.MultiSelectTree',
	        ui: {
	            width: 300,
	            value: '', //默认值
	            emptyText: "树形多选下拉框"
	        }
	    },
	    property: {
	        ui: { 
				value: {
					width: { value: 300, lan: '宽度' },
					value: { value: '["yingxiao","guanggao"]', lan: '默认值' },
					emptyText: { value: "", lan: '输入提示' },
					matchMode: { value: 1, lan: '匹配模式' , type: 'ComboBox', extra:{loadStore: [[1, '从首位匹配'], [2, '任意位置匹配']] }},
					searchable:{ value: true, lan: '允许搜索' },
					maxHeight:{ value: 350, lan: '下拉框最大高度' },
					valueField: { value: "value", lan: '值字段' },
					displayField: { value: "text", lan: '文本字段' },
					queryFields: { value: "['text','jp','qp']", lan: '可查询的字段' },
					minChars: { value: 0, lan: '触发查询最小字符数',help:'输入几个字符时触发查询' }					
	            }
	        },
	        data: { 
				lan: "数据源配置", 
				value: {
					ext_dataSource_type: { value: "json", lan: 'ext_数据源类型', type: 'ComboBox', extra:{loadStore: [['json', 'json'], ['url', 'url']] }},
				ext_dataSource_value: { value: '[ { "text" : "专题", "asyn" : true, "value" : "frm2018-28-", "leaf" : true}, { "text" : "策划", "asyn" : true, "value" : "frm2018-30-", "leaf" : false, children: [{ text: "营销", value:"yingxiao", leaf: true },{ text: "广告", value:"guanggao", leaf: true }] } ]', lan: 'ext_数据源内容', type: "CustomEditors_TextArea" }
				}	        
	        }
	    }
	},
	FCKeditor: {
	    text: 'FCKeditor',
	    tip: "FCK编辑器",
	    icon: null,
	    html: '',
		relyJS:['lib/FCKeditor/fckeditor.js','controls/Ext.ux.FCKeditor.js?v=20160317'],//依赖脚本文件
	    design: {
	        name: 'Ext.de.HtmlEditor',
	        rtName: 'Ext.ux.FCKeditor',
	        ui: {
	            width: 500,
	            height: 200,
	            value: '', //默认值
	            emptyText: ""
	        }
	    },
	    property: {
	        ui: { value: {
	            width: { value: 0, lan: '宽度',help:'0表示宽度自适应' },
				height: { value: 570, lan: '高度' },
				anchor: { value: "", lan: '宽度百分比%',help:'百分比和宽度都设置值，百分比优先'  },
	            value: { value: "", lan: '默认值', type: 'CustomEditors_TextArea' },
	            basePath: { value: "../res/js/lib/FCKeditor/", lan: '根路径' },
				baseHref: { value: "http://ent.cmpp.ifeng.com/Cmpp/", lan: '根站点' },
				skinPath: { value: "../editor/skins/default/", lan: '皮肤路径' },
				toolbarType:{value:"icms",lan:"工具集",type: 'ComboBox', extra:{loadStore: [['icms', 'icms'], ['Default', 'Default'], ['Basic', 'Basic'], ['icms_relatedDocs', 'icms_relatedDocs']] }},
				fontColors: { value: '000000,993300,333300,003300,003366,000080,333399,333333,800000,FF6600,808000,808080,008080,0000FF,666699,808080,FF0000,FF9900,99CC00,339966,33CCCC,3366FF,800080,999999,FF00FF,FFCC00,FFFF00,00FF00,00FFFF,00CCFF,993366,C0C0C0,FF99CC,FFCC99,FFFF99,CCFFCC,CCFFFF,99CCFF,CC99FF,FFFFFF', lan: '字体颜色列表', type: 'CustomEditors_TextArea' },
				fontSizes: { value: '14px;18px;20px', lan: '字体列表', type: 'CustomEditors_TextArea' },
				enableMoreFontColors:{value:true,lan:"更多字体颜色"}
    
	        }}
	    }
	},
	DatePicker: {
        text: 'DatePicker',
        tip: "日期时间选择器",
        icon: null,
		relyJS:['controls/Ext.ux.DateTime.js?20160926'],//依赖脚本文件
        design: {
            name: 'Ext.de.DateTime',
            rtName: 'Ext.ux.DateTime',
            ui: {
                fieldLabel: "选择时间"
            }
        },
        property: {
            ui: { value: {
                fieldLabel: { value: '选择时间', lan: '标签' },
				value: { value: "", lan: '默认值'}
        		,selectOnFocus:{value:false,lan:"聚焦选中"}
        		,timePosition:{value:"right",lan:"时间位置",type: 'ComboBox', extra:{loadStore: [['right', '居右'], ['below', '居下'], ['none', '隐藏']] }}
        		,emptyToNow:{value:true,lan:"默认当前"}
        		,dateFormat:{value:'Y-m-d',lan:"日期格式"}
        		,dateWidth:{value:100,lan:"日期宽度"}
        		,timeFormat:{value:'H:i:s',lan:"时间格式"}
        		,timeWidth:{value:100,lan:"时间宽度"}
            }
            }
        }
    },
	DateField:{
		text: 'DateField',
        tip: "日期控件",
        icon: null,
		relyJS:[],//依赖脚本文件
        design: {
            name: 'Ext.form.DateField',
            rtName: 'Ext.form.DateField',
            ui: {
                fieldLabel: "选择日期",
				format:'Y-m-d'
            }
        },
        property: {
            ui: { 
				value: {
					fieldLabel: { value: '选择日期', lan: '标签' },
					value: { value: "", lan: '默认值'},
					emptyText: { value: "2010-01-01", lan: '输入提示' },
					format:{ value: 'Y-m-d', lan: '日期格式' },
					style: { value: "", lan: '样式' },
					width: { value: 95, lan: '宽度' }
				}
            }
        }
	},
	TimeField:{
		text: 'TimeField',
        tip: "时间控件",
        icon: null,
		relyJS:[],//依赖脚本文件
        design: {
            name: 'Ext.form.TimeField',
            rtName: 'Ext.form.TimeField',
            ui: {
                fieldLabel: "选择时间",
				format:'H:i:s',
				width:80
            }
        },
        property: {
            ui: { 
				value: {
					fieldLabel: { value: '选择时间', lan: '标签' },
					value: { value: "", lan: '默认值'},
					emptyText: { value: "21:06:00", lan: '输入提示' },
					format:{ value: 'H:i:s', lan: '时间格式' },
					style: { value: "", lan: '样式' },
					width: { value: 80, lan: '宽度' }
				}
            }
        }
	},
	Tuijianwei: {
	    text: 'Tuijianwei',
	    tip: "推荐位控件(不再维护)",
	    icon: null,
	    about:{
			version:"3.0",
			author:"程邓时chengds@ifeng.com",
			update:"<p>推荐位控件 V3.0</p><p>新版本支持：推荐位只保留最新推送的N条数据，其他数据当作历史数据存储在搜索引擎中,且用户可搜到到历史数据。</p><p>特别说明：要实现历史数据的存取是需要提前做一些配置的，具体配置方法请查看帮助。</p>",
			help:'<p>配置流程：待续...</p>'
		},
		relyJS:['CookiesHelper.js','swfupload.js','controls/Ext.ux.TitleField.js?20120830','controls/Ext.ux.TextArea2.js','controls/Ext.ux.UploadField.js?20120618','controls/Ext.ux.ListPanel.js?20120830','controls/Ext.ux.TuiJianWei.js?20120831'],//依赖脚本文件
	    design: {
	        name: 'Ext.de.TuiJianWei',
	        rtName: 'Ext.ux.TuiJianWei',
	        ui: {
	        }
	    },
	    property: {
	        ui: { 
				value: {
					width: { value: '', lan: '宽度' },
					anchor: { value: "", lan: 'anchor(%)' },
					dataSourceListPage:{ value: "", lan: '数据源列表url' },
					fields2fields:{value: '{"title":"title","url":"pageUrl","img":"smallPoster","abstract":"abstract"}', lan: '字段对应关系' },
					searchTip: { value: "输入搜索关键字", lan: '查询框提示' },
					mainTitle: { value: "文章列表", lan: '主窗口标题' },
					searchTitle: { value: "文章搜索结果列表", lan: '搜索结果窗口标题' },
					searchBtnTxt: { value: "搜索文章", lan: '搜索按钮文字' },
					searchHistoryEnable:{ value: true, lan: '启用历史数据搜索' },
					fontSize:{ value: 12, lan: '页面字体大小' },
					rulerNum1:{ value: 10, lan: '标题字数提示1' },
					rulerNum2:{ value: 14, lan: '标题字数提示2' },
					rulerNum3:{ value: 18, lan: '标题字数提示3' },
					rulerNum4:{ value: 22, lan: '标题字数提示4' }
				}
	        }
	    }
	},
	Tuijianwei3: {
	    text: 'Tuijianwei3',
	    tip: "推荐位控件3",
	    icon: null,
	    about:{
			version:"3.1",
			author:"程邓时chengds@ifeng.com",
			update:"<p>推荐位控件 V3.1</p><p>新版本主要特点：</p><ul><li>数据列表项可通过绑定某个表单的列表页实现列表项的自主配置</li><li>数据项的编辑视图可绑定某个表单的视图</li><li>推荐位的数据项不再固定，可通过绑定列表页实现自主配置，</li>",
			help:'<p>配置流程：待续...</p>'
		},
		relyJS:['CookiesHelper.js','controls/Ext.ux.ListPanel.js?20120830','controls/Ext.ux.TuiJianWei.V3.js?201601129'],//依赖脚本文件
	    design: {
	        name: 'Ext.de.TuiJianWei',
	        rtName: 'Ext.ux.TuiJianWei.V3',
	        ui: {
	        }
	    },
	    property: {
	        ui: { 
				value: {
					width: { value: '', lan: '宽度' },
					anchor: { value: "", lan: 'anchor(%)' },
					dataSourceListId:{ value: 338, lan: '绑定列表(ID)' },
					editView:{ value: "{value:{url:'../runtime/xform!render.jhtml?nodeId=2001&formId=224&viewId=387',width:500,height:400}}", lan: '绑定视图', 
						type: "KeyValueEditor",
						extra:{
							loadModel:{
								"value":{
									lan:'编辑视图窗口配置',
									value:{
										url:{value:'../runtime/xform!render.jhtml?nodeId=2001&formId=224&viewId=387',lan:'视图url地址'},
										width:{value:500,lan:'窗口宽度'},
										height:{value:400,lan:'窗口高度'}
									}
								}
							}
						}
					},
					searchItems:{ value: '', lan: '导入按钮设置', 
						type: 'ArrayEditorField',
						extra:{
							loadModel:{
								"item":{
									lan:'导入按钮的配置',
									value:{
										searchTitle:{value:'搜索结果列表',lan:'搜索窗口标题'},
										searchBtnTxt:{value:'导入XX',lan:'导入按钮名称'},
										dataSourceListPage:{value:'http://m.cmpp.ifeng.com/Cmpp/runtime/xlist!render.jhtml?nodeId=11003&formId=2024&listId=309',lan:'数据源列表页',type: "CustomEditors_TextArea"},
										width:{value:500,lan:'窗口宽度'},
										height:{value:400,lan:'窗口高度'}
									}
								}
							}
						}
					},
					mainTitle: { value: "推荐位数据列表", lan: '主窗口标题' , type: 'CustomEditors_TextArea'},
					maxReserveRecordCount:{ value: 200, lan: '最大保留记录数' },
					viewSize:{ value: 10, lan: '每一页条数' },
					keyField:{ value: "id", lan: '主键字段' },
					enableDragDrop:{ value: true, lan: '允许拖拽排序' },
					hideEditColumn:{ value: false, lan: '隐藏编辑栏' },
					hideAddButton:{ value: false, lan: '隐藏手工添加按钮' },
					hideCheckBox:{ value: false, lan: '隐藏选择框栏' },
					hideRowNumberer:{ value: false, lan: '隐藏行号栏' },
					hideRemoveButton:{ value: false, lan: '隐藏移除按钮' },
					hideStickButton:{ value: false, lan: '隐藏置顶按钮' },
					hidePublishDateTime:{ value: false, lan: '隐藏推送时间栏' },
					hidePublisher:{ value: false, lan: '隐藏推送人栏' },
					enableEditFields:{ value: "title,name", lan: '可编辑的字段' },
					afterEditHandler:{ value: "(function(data){console.log(data)})", lan: '编辑后函数', type: 'CustomEditors_TextArea' },
					hideOrderBy:{ value: true, lan: '隐藏随机固定按钮',help:'固定、随机、置顶 radiogroup按钮' },//
					fontSize:{ value: 12, lan: '页面字体大小' },
					rulerNum1:{ value: 10, lan: '标题字数提示1' },
					rulerNum2:{ value: 14, lan: '标题字数提示2' },
					rulerNum3:{ value: -1, lan: '标题字数提示3' },
					rulerNum4:{ value: -1, lan: '标题字数提示4' }
				}
	        }
	    }
	},
	TuijianweiLb: {
	    text: 'TuijianweiLb',
	    tip: "推荐位控件(精确)",
	    icon: null,
	    about:{
			version:"3.1",
			author:"程邓时chengds@ifeng.com",
			update:"<p>精确推荐位控件</p><p>精确推荐位是基于位置的推荐，配置方法与推荐位3完全一致</p>",
			help:'<p>配置流程：待续...</p>'
		},
		relyJS:['CookiesHelper.js','controls/Ext.ux.ListPanel.js?20120830','controls/Ext.ux.TuiJianWei.lb.js'],//依赖脚本文件
	    design: {
	        name: 'Ext.de.TuiJianWei',
	        rtName: 'Ext.ux.TuiJianWei.lb',
	        ui: {
	        }
	    },
	    property: {
	        ui: { 
				value: {
					width: { value: '', lan: '宽度' },
					anchor: { value: "", lan: 'anchor(%)' },
					dataSourceListId:{ value: 338, lan: '绑定列表(ID)' },
					editView:{ value: "{value:{url:'../runtime/xform!render.jhtml?nodeId=2001&formId=224&viewId=387',width:500,height:400}}", lan: '绑定视图', 
						type: "KeyValueEditor",
						extra:{
							loadModel:{
								"value":{
									lan:'编辑视图窗口配置',
									value:{
										url:{value:'../runtime/xform!render.jhtml?nodeId=2001&formId=224&viewId=387',lan:'视图url地址'},
										width:{value:500,lan:'窗口宽度'},
										height:{value:400,lan:'窗口高度'}
									}
								}
							}
						}
					},
					searchItems:{ value: '', lan: '导入按钮设置', 
						type: 'ArrayEditorField',
						extra:{
							loadModel:{
								"item":{
									lan:'导入按钮的配置',
									value:{
										searchTitle:{value:'搜索结果列表',lan:'搜索窗口标题'},
										searchBtnTxt:{value:'导入XX',lan:'导入按钮名称'},
										dataSourceListPage:{value:'http://m.cmpp.ifeng.com/Cmpp/runtime/xlist!render.jhtml?nodeId=11003&formId=2024&listId=309',lan:'数据源列表页',type: "CustomEditors_TextArea"}
									}
								}
							}
						}
					},
					mainTitle: { value: "推荐位数据列表", lan: '主窗口标题' },
					maxReserveRecordCount:{ value: 200, lan: '最大保留记录数' },
					hideEditColumn:{ value: false, lan: '隐藏编辑栏' },
					hideAddButton:{ value: false, lan: '隐藏手工添加按钮' },
					hideCheckBox:{ value: false, lan: '隐藏选择框栏' },					
					hidePublishDateTime:{ value: false, lan: '隐藏推送时间栏' },
					hidePublisher:{ value: false, lan: '隐藏推送人栏' },
					getLimitCountFunction:{ value: "return 6;", lan: '主键字段',type: "CustomEditors_TextArea" },
					fontSize:{ value: 12, lan: '页面字体大小' },
					rulerNum1:{ value: 10, lan: '标题字数提示1' },
					rulerNum2:{ value: 14, lan: '标题字数提示2' },
					rulerNum3:{ value: -1, lan: '标题字数提示3' },
					rulerNum4:{ value: -1, lan: '标题字数提示4' }
				}
	        }
	    }
	},
	UploadField: {
	    text: 'UploadField',
	    tip: "通用单文件上传",
	    icon: null,
		relyJS:['controls/Ext.ux.UploadField.js?20151208'],//依赖脚本文件
	    design: {//设计时
	        name: 'Ext.de.UploadField',
	        rtName: 'Ext.ux.UploadField',
	        ui: {
	            
	        }
	    },
	    //在属性表显示的属性
	    property: {
	        ui: {
				value: {
					fieldLabel: { value: '图片地址', lan: '标签' },
					width:{ value: 300, lan: '宽度' },
					button_text:{ value: '上传', lan: '按钮文本' },
					vtype: { value: 'url', lan: '输入类型', type: 'ComboBox',extra:{loadStore: [['', '不限'], ['alpha', '字母'],['num', '数字'], ['alphanum', '字母和数字'], ['email', 'email'], ['url', 'url']] }},
					hideLabel: {value:false,lan:"隐藏标签"},
					viewButtonVisible: {value:true,lan:"查看按钮可见"},
					copyButtonVisible: {value:true,lan:"复制按钮可见"},
					helpButtonVisible: {value:false,lan:"帮助按钮可见"},
					uploadUrl:{ value: '../upload!file.jhtml', lan: '是否需要分发' ,type: 'ComboBox',extra:{loadStore: [['../upload.jhtml', '不分发到源站'], ['../upload!file.jhtml', '分发到源站']] },help:'不分发到源站意味着文件只上传到CMPP服务器,可通过'},
					rename: {value:true,lan:"自动生成文件名"},
					res_url:{ value: "../res/", lan: '资源根地址' },
					clipBoardSwf_url:{ value: "../res/swf/clipBorad-Xuas.swf", lan: '复制功能flash' },
					syncflag: {value:1,lan:"同(异)步分发",type: 'ComboBox', extra:{loadStore: [[1, '同步'], [0, '异步']]}},
					fileMaxSize: { value: 5, lan: '文件大小限制(M)' },
					file_types:{ value: '*.*', lan: '类型限制' },//对应file控件的accept属性 image/* "text/html,image/jpeg,video/x-mpeg2" ...
					destinationDomains:{ value: "['p0.ifengimg.com','p1.ifengimg.com','p2.ifengimg.com','p3.ifengimg.com']", lan: '上传到站点列表' },//分发的目标域名，支持多个域名随机
					
					helpHtml:{value:'<p>本控件支持自定义url和自定义路径上传.</p><p>左侧文本框内容如果为空上传的文件路径将由系统自动生成.</p><p>自定义url:eg.http://y1.ifengimg.com/2012/08/img/1.jpg</p><p>自定义路径:eg.http://y1.ifengimg.com/2012/08/img/</p>',lan: '帮助',type: 'CustomEditors_TextArea'  }
				}
			}
	    }
	},
    PauseResumeUploadField: {
        text: 'PauseResumeUploadField',
        tip: "断点续传",
        icon: null,
        relyJS:['controls/Ext.ux.PauseResumeUploadField.js?20160112'],//依赖脚本文件
        design: {//设计时
            name: 'Ext.de.PauseResumeUploadField',
            rtName: 'Ext.ux.PauseResumeUploadField',
            ui: {
                
            }
        },
        //在属性表显示的属性
        property: {
            ui: {
                value: {
                    fieldLabel: { value: '文件路径', lan: '标签' },
                    width:{ value: 300, lan: '宽度' },
                    button_text:{ value: '断点续传', lan: '按钮文本' },
                    hideLabel: {value:false,lan:"隐藏标签"},
                    viewButtonVisible: {value:true,lan:"查看按钮可见"},
                    copyButtonVisible: {value:false,lan:"复制按钮可见"},
                    helpButtonVisible: {value:false,lan:"帮助按钮可见"},
                    rename: {value:true,lan:"自动生成文件名"},
                    clipBoardSwf_url:{value:"../res/swf/clipBorad-Xuas.swf", lan:'复制功能flash'},
                    fileMaxSize: {value: 500, lan: '文件大小限制(M)'},
                    partSize: {value: 1048576, lan: '每次上传大小', type: 'ComboBox',extra:{loadStore: [[1048576, '1M'], [2097152, '2M'],[3145728, '3M'], [4194304, '4M'], [5242880, '5M']]}},
                    file_types:{value: '*.*', lan: '类型限制',help:'对应file控件的accept属性;例：只能上传图片：image/*、 限制图片格式为gif：image/gif;默认可以上传任意格式：*/*'},
                    helpContent:{value:'<p>本控件支持大文件的断点续传,不支持分发</p>',lan: '帮助',type: 'CustomEditors_TextArea'  }
                }
            }
        }
    },
	HtmlEditor2: {
	    text: 'HtmlEditor2',
	    tip: "HTML编辑器",
	    icon: null,
	    about:{
			version:"1.1",
			author:"程邓时chengds@ifeng.com",
			update:"<p>推荐位控件 V1.1</p><p>轻量级富文本编辑器。支持插入图片。</p>",
			help:"<p>配置流程<p><p>字号列表:</p><p>可根据需要添加字号名称</p><p>支持图片上传</p><p>扩展按钮配置示例:</p><p>[{text: '评论',tooltip:'插入评论链接',handler : function(){this.insertAtCursor('插入评论链接');this.insertValueAtCursor('插入HTML')}}]</p><p>对外开放的方法有：上传图片并裁图uploadAndCutImage(按钮,目标宽度，目标高度)、addPageBreak(按钮)、插入图片addImage(按钮)、插入HTML insertAtCursor(html)、插入源码insertValueAtCursor(html)</p><p>高度问题：若要改变默认高度，需要同时设计width和height两个参数时高度才有效，如果不设置width，只设置anchor，高度设置后不起作用</p>"
		},		
		relyJS:['controls/Ext.form.HtmlEditor2.js?v=20140303','controls/Ext.ux.ImageCutter.js?v=20160405','controls/Ext.ux.UploadField.js?20130618'],//依赖脚本文件
	    design: {//设计时
	        name: 'Ext.de.HtmlEditor2',
	        rtName: 'Ext.form.HtmlEditor2',
	        ui: {
	            
	        }
	    },
	    //在属性表显示的属性
	    property: {
	        ui: {
				value: {
					fieldLabel: { value: '标签', lan: '标签' },
					width:{ value: 600, lan: '宽度' },
					height:{ value: 300, lan: '高度' },
					anchor: { value: "", lan: 'anchor(%)' },
					hideLabel: {value:false,lan:"隐藏标签"},
					value: { value: "", lan: '默认值' },
					enableAlignments:{value:true,lan:"启用对齐"},
					enableColors :{value:true,lan:"启用调色板"},
					enableFont :{value:true,lan:"启用字体"},
					enableFontSize :{value:true,lan:"启用字号"},
					enableFormat :{value:false,lan:"启用格式"},
					enableMyLinks :{value:true,lan:"启用超链接"},
					enableLists :{value:false,lan:"启用编号"},
					enablePageBreak :{value:true,lan:"启用分页符"},
					enablePasteAsText :{value:true,lan:"启用粘贴为"},
					enableAddImage :{value:true,lan:"启用插入图片"},
					enableCutImage :{value:true,lan:"启用裁剪图片"},
					enableSourceEdit2 :{value:true,lan:"启用源码按钮"},
					enableFindAndReplace :{value:true,lan:"启用查找替换"},
					enableInsertTable :{value:true,lan:"启用插入表格"},
					pageBreakHtml:{ value: '<div style="page-break-after: always;"><span style="display: none;">&nbsp;</span></div>', lan: '分页符HTML',type:'CustomEditors_TextArea' },
					editorStyleInject:{ value: '', lan: '注入到编辑器的样式',type:'CustomEditors_TextArea' },
					uploadUrl:{ value: '../upload!file.jhtml', lan: '上传接口' },
					resRoot:{ value: "../res/", lan: '资源根路径' },
					fontFamilies : { value: '["宋体","黑体","楷体,楷体_GB2312"]', lan: '字体列表' } ,
					destinationDomains:{ value: "['p0.ifengimg.com','p1.ifengimg.com','p2.ifengimg.com','p3.ifengimg.com']", lan: '上传文件站点列表' },//分发的目标域名，支持多个域名随机
					editMode:{value:1,lan:"默认编辑模式",type: 'ComboBox', extra:{loadStore: [[1, '非源码'], [2, '源码']]}},
					customButtons:{value:'',lan:'扩展按钮配置',type:'CustomEditors_TextArea'}
					//helpHtml:{value:"<p>本控件为轻量级HTML编辑器，支持图片上传</p><p>扩展按钮配置样例:</p><p>[{text: '评论',tooltip:'插入评论链接',handler : function(){this.insertAtCursor('插入评论链接');}}]</p>",lan: '帮助',type: 'CustomEditors_TextArea'  }
				}
			}
	    }
	},

	LinkageComboLocal:{
		text: "LinkageComboLocal",
		tip:"级联下拉框",
		icon:null,
		relyJS:['controls/Ext.ux.LinkageComboBox.js','controls/Ext.ux.LinkageFieldSet.js'],//依赖脚本文件
		design:{
	        name: 'Ext.form.ComboBox',
	        rtName: 'Ext.ux.LocalLinkageComboBox',
	        ui:{
	        	
	        }
		},
	    property: {
	        ui: {
				value: {
					fieldLabel: { value: '标签', lan: '标签' },
					width: { value: 300, lan: '宽度' },
					hideLabel: {value:false,lan:'隐藏标签'},
//					name: {value:'',lan: '字段名'},
					value: {value:'',lan: '值'},
					allowBlank: {value: true, lan: '是否允许为空'},
					x_previous: {value: '', lan: '上一级'},
					x_next: {value: '', lan: '下一级'}
				}
			},
	        data: { lan: "数据源配置", value: {
		            ext_dataSource_type: { value: "json", lan: 'ext_数据源类型', type: 'ComboBox', extra:{loadStore: [['json', 'json'], ['sql', 'sql'], ['url', 'url']] }},
		            ext_dataSource_value: { value: "", lan: 'ext_数据源内容', type: "CustomEditors_TextArea" }
	        	}
	        }			
	    }
	},
	LinkageComboAsyn:{
		text: "LinkageComboAsyn",
		tip:"级联下拉框(异步)",
		icon:null,
		relyJS:['controls/Ext.ux.LinkageComboBox.js','controls/Ext.ux.LinkageFieldSet.js'],//依赖脚本文件
		design:{
	        name: 'Ext.form.ComboBox',
	        rtName: 'Ext.ux.AsynLinkageComboBox',
	        ui:{
	        	
	        }
		},
	    property: {
	        ui: {
				value: {
					fieldLabel: { value: '标签', lan: '标签' },
					width: { value: 300, lan: '宽度' },
					hideLabel: {value:false,lan:'隐藏标签'},
//					name: {value:'',lan: '字段名'},
					value: {value:'',lan: '值'},
					allowBlank: {value: true, lan: '是否允许为空'},
					x_asynUrl: {value: '', lan: '请求地址'},
					x_param:{value:'',lan: '请求参数'},
					x_useCache: {value: 'useCache',lan:'使用缓存',type: 'ComboBox', extra:{loadStore: [['useCache', '使用'], ['Asyn', '不使用']]}},
					x_previous: {value: '', lan: '上一级'},
					x_next: {value: '', lan: '下一级'}
				}
			}
	    }
	},
	LinkageFieldSetLocal:{
		text: "LinkageFieldSetLocal",
		tip:"级联选择组合",
		icon:null,
		relyJS:['controls/Ext.ux.LinkageComboBox.js','controls/Ext.ux.LinkageFieldSet.js','controls/Ext.ux.LinkageFieldText.js'],//依赖脚本文件
		design:{
	        name: 'Ext.de.LinkageTextField',
	        rtName: 'Ext.ux.LinkageTextField',
	        ui:{
				xtype:"dLinkageTextField",
				x_fieldset_title:"级联选择组合",
				x_direction:"Horizontal",
				"x_data_type": "Local",
				"x_comboBox_Local_config": '[{"fieldLabel":"选项一","columnWidth":0.33},{"fieldLabel":"选项二","columnWidth":0.33},{"fieldLabel":"选项三","columnWidth":0.34}]',
				x_container_type:"fieldset"
	        }
		},
	    property: {
	        ui: {
				value: {
//					name: {value:'',lan: '字段名'},
					value: {value:'',lan: '值'},
					allowBlank: {value: true, lan: '是否允许为空'},
					x_SelectAll: {value: false, lan: '是否全选'},
					x_fieldset_title: {value: '',lan: '容器标题'},
					x_container_type: {value: 'fieldset',lan:'容器类别',type: 'ComboBox', extra:{loadStore: [['fieldset', '有边框'], ['panel', '无边框']]}},
					x_direction: {value: 'Vertical',lan:'排列方向',type: 'ComboBox', extra:{loadStore: [['Vertical', '纵向'], ['Horizontal', '横向']]}},
					x_comboBox_Local_config: { value: '',lan: '级联配置',type: 'CustomEditors_TextArea' },
					x_data_type: {value: 'Local',lan:'数据来源',readOnly : true}
				}
			},
	        data: { lan: "数据源配置", value: {
	            ext_dataSource_type: { value: "json", lan: 'ext_数据源类型', type: 'ComboBox', extra:{loadStore: [['json', 'json'], ['sql', 'sql'], ['url', 'url']] }},
	            ext_dataSource_value: { value: "", lan: 'ext_数据源内容', type: "CustomEditors_TextArea" }
        	}
        }
	    }
	},
	LinkageFieldSetAsyn:{
		text: "LinkageFieldSetAsyn",
		tip:"级联选择组合(异步)",
		icon:null,
		relyJS:['controls/Ext.ux.LinkageComboBox.js','controls/Ext.ux.LinkageFieldSet.js','controls/Ext.ux.LinkageFieldText.js'],//依赖脚本文件
		design:{
	        name: 'Ext.de.LinkageTextField',
	        rtName: 'Ext.ux.LinkageTextField',
	        ui:{
				xtype:"dLinkageTextField",
				x_fieldset_title:"级联选择组合(异步)",
				x_direction:"Horizontal",
				"x_data_type": "Asyn",
				"x_comboBox_Asyn_config": '[{"fieldLabel":"选项一","columnWidth":0.33},{"fieldLabel":"选项二","columnWidth":0.33},{"fieldLabel":"选项三","columnWidth":0.34}]',
				x_container_type:"fieldset"
	        }
		},
	    property: {
	        ui: {
				value: {
//					name: {value:'',lan: '字段名'},
					value: {value:'',lan: '值'},
					allowBlank: {value: true, lan: '是否允许为空'},
					x_SelectAll: {value: false, lan: '是否全选'},
					x_fieldset_title: {value: '',lan: '容器标题'},
					x_container_type: {value: 'fieldset',lan:'容器类别',type: 'ComboBox', extra:{loadStore: [['fieldset', '有边框'], ['panel', '无边框']]}},
					x_direction: {value: 'Vertical',lan:'排列方向',type: 'ComboBox', extra:{loadStore: [['Vertical', '纵向'], ['Horizontal', '横向']]}},
					x_useCache: {value: 'useCache',lan:'使用缓存',type: 'ComboBox', extra:{loadStore: [['useCache', '使用'], ['Asyn', '不使用']]}},
					x_asynUrl:{value:'',lan:'默认请求地址'},
					x_comboBox_Asyn_config: { value: '',lan: '级联配置',type: 'CustomEditors_TextArea' }	,
					x_data_type: {value: 'Asyn',lan:'数据来源',readOnly : true}
				}
			}
	    }
	},
	/*
	UploadDevPanel:{
		text: "UploadDevPanel",
		tip:"文件上传-开发者版",
		icon:null,
		relyJS:['controls/html5_upload_base.js','controls/Ext.ux.UploadDev.js'],//依赖脚本文件
		design:{
	        name: 'Ext.de.UploadDevPanel',
	        rtName: 'Ext.ux.UploadDevPanel',
	        ui:{
	        	title : "标题"
	        }
		},
	    property: {
	        ui: {
				value: {
					title:{value:'标题',lan:'标题'},
					xhrAutoUrl: {value: '../upload!file.jhtml', lan: '自动路径上传接口地址' },
					xhrCustomUrl: {value: '../upload!send.jhtml', lan: '自定义路径上传接口地址' },
					rename: {value: false, lan: '自定义文件名'},
					repath: {value: false, lan: '自定义路径'},
					destinationDomains:{ value: ['y0.ifengimg.com','y1.ifengimg.com','y2.ifengimg.com','y3.ifengimg.com'], type:"Array",lan: '上传到站点列表' },
					threadCount:{value:1, lan: '上传并发数',type: 'ComboBox', extra:{loadStore: [[1, '1'],[2, '2'],[3, '3'],[4, '4'],[5, '5']]}}
				}
			}
	    }
	},
	
	TopNewEditField:{
		text: "TopNewEditField",
		tip:"头条新闻编辑器",
		icon:null,
		relyJS:['controls/Ext.ux.TopNewEditField.js'],//依赖脚本文件
		design:{
	        name: 'Ext.ux.TopNewEdit',
	        rtName: 'Ext.ux.TopNewEditField',
	        ui:{
	        	data:[]
	        }
		},
	    property: {
	        ui: {
				value: {
					value:{value:'',lan:'数据'}
				}
			}
	    }
	},	
	*/
	JSONEditor: {
	    text: 'JSONEditor',
	    tip: "JSON数组编辑器",
	    icon: null,
		relyJS:['controls/Ext.ux.JSONEditor.js?v=20150212'],//依赖脚本文件
		about:{
			version:"1.0",
			author:"程邓时chengds@ifeng.com",
			update:"<p>JSON数组编辑器 V1.0</p>",
			help:'<p>配置说明<p><p>列表定义:</p><p>[{ 	header: "参数名", 	field:"param1_name", 	width:120, 	editor:{name: "Ext.form.TextField",ui:{allowBlank:false,vtype:"alphanum"}} },{ 	header: "类型", 	field:"param1_type", 	width:100, 	editor:{name: "Ext.form.ComboBox",ui:{dataSource:[["string","string"],["number","number"],["boolean","boolean"]]}} },{ 	header: "说明", 	width:300, 	field:"param1_desc", 	editor:{name: "Ext.form.TextField",ui:{allowBlank:true}} }]</p><p>输出值的格式:</p><p>[{"param1_name":"content","param1_type":"string","param1_desc":"消息的内容"},{"param1_name":"userId","param1_type":"string","param1_desc":"用户的rtx用户ID"}]</p>'
		},	
	    design: {//设计时
	        name: 'Ext.de.JSONEditor',
	        rtName: 'Ext.ux.JSONEditor',
	        ui: {
	            
	        }
	    },
	    //在属性表显示的属性
	    property: {
	        ui: {
				value: {
					width:{ value: 600, lan: '宽度' },
					rowAddAndDeleteEnable:{value:true,lan:'可追加删除行'},
					value:{value:'',lan: '默认值',type: 'CustomEditors_TextArea'},
					columns:{value:'[{ 	header: "参数名", 	field:"param1_name", 	width:120, 	editor:{name: "Ext.form.TextField",ui:{allowBlank:false,vtype:"alphanum"}} },{ 	header: "类型", 	field:"param1_type", 	width:100, 	editor:{name: "Ext.form.ComboBox",ui:{dataSource:[["string","string"],["number","number"],["boolean","boolean"]]}} },{ 	header: "说明", 	width:300, 	field:"param1_desc", 	editor:{name: "Ext.form.TextField",ui:{allowBlank:true}} }]',lan: '列定义',type: 'CustomEditors_TextArea'},
					helpHtml:{value:'<p>列定义数据格式：[{ 	header: "参数名", 	field:"param1_name", 	width:120, 	editor:{name: "Ext.form.TextField",ui:{allowBlank:false,vtype:"alphanum"}} },{ 	header: "类型", 	field:"param1_type", 	width:100, 	editor:{name: "Ext.form.ComboBox",ui:{dataSource:[["string","string"],["number","number"],["boolean","boolean"]]}} },{ 	header: "说明", 	width:300, 	field:"param1_desc", 	editor:{name: "Ext.form.TextField",ui:{allowBlank:true}} }]</p>',lan: '帮助',type: 'CustomEditors_TextArea'  }
				}
			}
	    }
	},

	ImageCollection: {
	    text: 'ImageCollection',
	    tip: "图集编辑器",
	    icon: null,
		relyJS:['controls/Ext.ux.Portal.js','controls/Ext.ux.ImageCollection.js'],//依赖脚本文件
		relyCSS:['portal.css'],//依赖CSS文件
	    design: {//设计时
	        name: 'Ext.de.ImageCollection',
	        rtName: 'Ext.ux.ImageCollection',
	        ui: {

	        }
	    },
	    //在属性表显示的属性
	    property: {
	        ui: {
				value: {
					fieldLabel: { value: '图集', lan: '标签' },
					width:{ value: 600, lan: '宽度' },
					height:{ value: 600, lan: '高度' },
					buttonText:{ value: '图集管理', lan: '按钮文本' },
					hideLabel: {value:false,lan:"隐藏标签"},
					uploadUrl:{ value: '../upload!file.jhtml', lan: '上传接口' },
					resRoot:{ value: "../res/", lan: '资源根路径' },
					domains:{ value: "['p0.ifengimg.com','p1.ifengimg.com','p2.ifengimg.com','p3.ifengimg.com']", lan: '上传到站点列表' },
					syncflag:{ value: 1, lan: '同步异步',type: 'ComboBox', extra:{loadStore: [[1, '同步'], [0, '异步']]}},
					helpHtml:{value:'<p>todo...</p>',lan: '帮助',type: 'CustomEditors_TextArea'  }
				}
			}
	    }
	},
	
	SlideEditor: {
	    text: 'SlideEditor',
	    tip: "幻灯编辑器",
	    icon: null,
		relyJS:['controls/Ext.ux.Portal.js','controls/Ext.ux.ImageCutter.js?20160405','controls/Ext.ux.SlideEditor.js?v=20160405'],//依赖脚本文件
		relyCSS:['portal.css','Ext.ux.SlideEditor.css?20130929'],//依赖CSS文件
		about:{
			version:"1.0",
			author:"程邓时chengds@ifeng.com",
			update:"<p>幻灯片编辑器控件 V1.0</p>",
			help:'<p>该控件是为娱乐、资讯、时尚等频道CMPP定制。支持上传图片、排序、缩略图、图注等功能。</p><p>控件返回的数据格式：{"image":[{"picUrl":"http://y2.ifengimg.com/a/2013_30/2777f31adeda8b6.jpg","tilte":"","link":"","description":"图注","width":400,"height":600,"byte":40028,"waterMark":false,"shortcutsPics":[]},{"picUrl":"http://y0.ifengimg.com/a/2013_30/ab2f8d595617b4a.jpg","tilte":"","link":"","description":"","width":358,"height":600,"byte":101052,"waterMark":false,"shortcutsPics":[]}],"mainimage":0}</p>'
		},	
	    design: {//设计时
	        name: 'Ext.de.SlideEditor',
	        rtName: 'Ext.ux.SlideEditor',
	        ui: {
				width:600,
				height:340
	        }
	    },
	    //在属性表显示的属性
	    property: {
	        ui: {
				value: {
					fieldLabel: { value: '幻灯', lan: '标签' },
					width:{ value: 700, lan: '宽度' },
					height:{ value: 600, lan: '高度' },
					hideLabel: {value:false,lan:"隐藏标签"},
					title:{ value: "幻灯编辑器", lan: '标题' },
					uploadUrl:{ value: '../upload!file.jhtml', lan: '上传接口' },
					resRoot:{ value: "../res/", lan: '资源根路径' },
					domains:{ value: "['p0.ifengimg.com','p1.ifengimg.com','p2.ifengimg.com','p3.ifengimg.com']", lan: '上传到站点列表' },
					syncflag:{ value: 1, lan: '同步异步',type: 'ComboBox', extra:{loadStore: [[1, '同步'], [0, '异步']]}},
					titleVisible:{value:true,lan:"标题框可见"},
					descriptionVisible:{value:true,lan:"描述框可见"},
					linkVisible:{value:true,lan:"链接框可见"},
					thumbEnable:{value:true,lan:"缩略图可见"},
					waterMarkEnable:{value:true,lan:"水印功能启用"},
					imageCutterConfig:{
						value:JSON.stringify({
							xtype:'imagecutter',
							button_text:"裁图",
							viewButtonVisible:false,
							copyButtonVisible:false,
							onlyUploadEnable:false,
							AIDefaultChecked:false,
							sampleSize:[["168×120","客户端缩略图 168×120"],["206×142","客户端三小图 206×142"]],
							targetWidth:{ value: 300, lan: '目标宽度' },
							targetHeight:{ value: 200, lan: '目标高度' },
							sampleSizeEnable:true
						}),lan: '裁图控件配置',type: 'CustomEditors_TextArea' },
					fileMaxSize: { value: 1024000, lan: '文件大小限制(bytes)' },
					waterMarkUrl:{ value: '../upload!waterMark.jhtml', lan: '加水印接口' },//加水印接口url
					waterMarkImageButtons:{value:'',lan:"水印按钮配置",
						type: 'ArrayEditorField',
						extra:{
							loadModel:{
								"item":{
									lan:'按钮配置项',
									value:{
										text:{value:'xxxx',lan:'按钮名称'},
										url:{value:'',lan:'水印图片Url'}
									}
								}
							}
						}
					},
					waterMarkPositon:{ value: "southeast", lan: '水印位置',type: 'ComboBox', extra:{loadStore: [['southeast', '右下角'],['northeast', '右上角'],['southwest', '左下角'],['northwest', '左上角'],['center', '中央'],['tile', '平铺']]} },//水印位置(默认：southeast,northeast,southwest,northwest,center,tile(平铺))
					insertToDocumentText:{ value: '插入到正文', lan: '插入到正文按钮' },
					insertToDocumentEnable:{ value: true, lan: '是否启用插入到正文' },//插入到正文按钮是否启用
					insertToDocumentHandler:{value:"(function(){var image = this.getImage();console.log(image.url +'|'+ image.width +'|'+ image.height)})",lan: '插入到正文函数',type: 'CustomEditors_TextArea' },
					helpHtml:{value:'<p>该控件是为娱乐、资讯、时尚等频道CMPP定制。支持上传图片、排序、缩略图、图注等功能。</p>',lan: '帮助',type: 'CustomEditors_TextArea'  }
				}
			}
	    }
	},
	
	BlankField: {
	    text: 'BlankField',
	    tip: "空壳控件",
	    icon: null,
		relyJS:['controls/Ext.ux.BlankField.js'],//依赖脚本文件
		relyCSS:[],//依赖CSS文件
	    design: {//设计时
	        name: 'Ext.de.BlankField',
	        rtName: 'Ext.ux.BlankField',
			ui: {
				html:"空壳控件,内容自由配置,仅支持Ext控件配置.eg.[{xtype:'textfield',width:150},{xtype:'panel',width:500,title:'标题'}}]"
	        }
	    },
	    //在属性表显示的属性
	    property: {
	        ui: {
				value: {
					fieldLabel: { value: '标签', lan: '标签' },
					border: { value: false, lan: '边框' },
					//frame: { value: false, lan: 'frame' },
					title:{ value: '标题', lan: '标题面板' },
					width:{ value: 600, lan: '宽度' },
					height:{ value: 300, lan: '高度' },
					autoHeight: { value: true, lan: '自动高度' },
					autoScroll : { value: true, lan: '自动滚动' },
					layout:{ value: 'xform', lan: '子控件布局' ,type: 'ComboBox', extra:{loadStore: [['fit', 'fit'], ['xform', 'xform'], ['xform2', 'xform2'], ['column', 'colunm'], ['table', 'table'], ['border', 'border']]}},
					collapsible:{ value: false, lan: '可收起' },
					items:{value:"[{xtype:'textfield',fieldLabel:'名称',width:150},{xtype:'textarea',fieldLabel:'描述',width:150,height:50}]",lan: '子控件配置',type: 'CustomEditors_TextArea'  },
					helpHtml:{value:'<p>todo...</p>',lan: '帮助',type: 'CustomEditors_TextArea'  }
				}
			}
		}
	},
	ImageCutter: {
	    text: 'ImageCutter',
	    tip: "裁图&上传",
	    icon: null,
		relyJS:['controls/Ext.ux.ImageCutter.js?20160405'],//依赖脚本文件
	    design: {//设计时
	        name: 'Ext.de.ImageCutter',
	        rtName: 'Ext.ux.ImageCutter',
	        ui: {
	            
	        }
	    },
	    //在属性表显示的属性
	    property: {
	        ui: {
				value: {
					fieldLabel: { value: '图片地址', lan: '标签' },
					width:{ value: 300, lan: '宽度' },
					targetWidth:{ value: 300, lan: '目标宽度' },
					targetHeight:{ value: 200, lan: '目标高度' },
					cutRectMultiple:{ value: 0.75, lan: '默认区域比例(0--1)' },
					button_text:{ value: '裁图&上传', lan: '按钮文本' },
					hideLabel: {value:false,lan:"隐藏标签"},
					vtype:{ value: 'url', lan: '值类型' ,type: 'ComboBox', extra:{loadStore: [['null', '不限'], ['url', 'url']]}},
					viewButtonVisible: {value:true,lan:"查看按钮可见"},
					copyButtonVisible: {value:true,lan:"复制按钮可见"},
					helpButtonVisible: {value:false,lan:"帮助按钮可见"},
					uploadUrl:{ value: '../intelliImage!sendfile.jhtml', lan: '上传接口' },
					AIUrl:{ value: '../intelliImage!coordinate.jhtml', lan: '智能裁图接口' },
					AIDefaultChecked:{ value: true, lan: '默认开启智能裁图' },
					clipBoardSwf_url:{ value: "../res/swf/clipBorad-Xuas.swf", lan: '复制功能flash' },
					file_types:{ value: 'image/.*', lan: '文件类型限制' },//对应file控件的accept属性 image/* "text/html,image/jpeg,video/x-mpeg2" ...
					destinationDomains:{ value: "['p0.ifengimg.com','p1.ifengimg.com','p2.ifengimg.com','p3.ifengimg.com']", lan: '上传到站点列表' },//分发的目标域名，支持多个域名随机
					sampleSize:{value:'[["168×120","客户端缩略图 168×120"],["206×142","客户端三小图 206×142"]]',lan: '常用尺寸',type: 'CustomEditors_TextArea'  },//常用尺寸
					sampleSizeEnable:{value:true,lan:"启用常用尺寸"},
					onlyUploadEnable:{value:true,lan:"启用单文件上传"},					
					helpHtml:{value:'<p>本控件支持手工、智能、半自动裁图.</p><p>智能裁图支持两种算法：面部优先和热点优先.</p>',lan: '帮助',type: 'CustomEditors_TextArea'  }
				}
			}
	    }
	},
	
	ImageUploader: {
	    text: 'ImageUploader',
	    tip: "图片附件管理器",
	    icon: null,
		relyJS:['controls/Ext.ux.ImageUploader.js?v=20160405','controls/Ext.ux.ImageCutter.js?20160405'],//依赖脚本文件
	    design: {//设计时
	        name: 'Ext.de.ImageUploader',
	        rtName: 'Ext.ux.ImageUploader',
	        ui: {
	            
	        }
	    },
	    //在属性表显示的属性
	    property: {
	        ui: {
				value: {
					fieldLabel: { value: '图片附件', lan: '标签' },
					width:{ value: 800, lan: '宽度' },
					title: { value: '', lan: '标题' },
					hideLabel: {value:false,lan:"隐藏标签"},
					uploadUrl:{ value: '../upload!file.jhtml', lan: '上传接口' },
					resRoot:{ value: "../res/", lan: '资源根路径' },
					domains:{ value: "['p0.ifengimg.com','p1.ifengimg.com','p2.ifengimg.com','p3.ifengimg.com']", lan: '上传到站点列表' },
					syncflag:{ value: 1, lan: '同步异步',type: 'ComboBox', extra:{loadStore: [[1, '同步'], [0, '异步']]}},
					fileMaxSize: { value: 1024000, lan: '文件大小限制(bytes)' },
					warterMarkEnable:{value:false,lan:"启用水印功能"},
					waterMarkUrl:{ value: '../upload!waterMark.jhtml', lan: '加水印接口' },//加水印接口url
					waterMarkImageButtons:{value:'[{item:{"text":"资讯logo","url":"http://y3.ifengimg.com/2f86f1d4ae63c9a4/2014/0117/rdn_52d88772ad4cd.png"}},{item:{"text":"军事logo","url":"http://y3.ifengimg.com/a/2014/0326/6d7f98ab8ed081c15d7a2177c50ac270.png"}}]',lan:"水印按钮配置",
						type: 'ArrayEditorField',
						extra:{
							loadModel:{
								"item":{
									lan:'按钮配置项',
									value:{
										text:{value:'xxxx',lan:'按钮名称'},
										url:{value:'',lan:'水印图片Url'}
									}
								}
							}
						}
					},
					waterMarkPositon:{ value: "southeast", lan: '水印位置',type: 'ComboBox', extra:{loadStore: [['southeast', '右下角'],['northeast', '右上角'],['southwest', '左下角'],['northwest', '左上角'],['center', '中央'],['tile', '平铺']]} },//水印位置(默认：southeast,northeast,southwest,northwest,center,tile(平铺))
					insertToDocumentText:{ value: '插入到正文', lan: '插入到正文按钮' },
					insertToDocumentEnable:{ value: true, lan: '是否启用插入到正文' },//插入到正文按钮是否启用
					insertToDocumentHandler:{value:"(function(image){console.log(image.url +'|'+ image.width +'|'+ image.height)})",lan: '插入到正文函数',type: 'CustomEditors_TextArea' },
					imageCutterConfig:{
						value:JSON.stringify({
							xtype:'imagecutter',
							button_text:"裁图",
							viewButtonVisible:false,
							copyButtonVisible:false,
							onlyUploadEnable:false,
							AIDefaultChecked:false,
							sampleSize:[["168×120","客户端缩略图 168×120"],["206×142","客户端三小图 206×142"]],
							targetWidth:{ value: 300, lan: '目标宽度' },
							targetHeight:{ value: 200, lan: '目标高度' },
							sampleSizeEnable:true
						}),lan: '裁图控件配置',type: 'CustomEditors_TextArea' },
						
					helpHtml:{value:'<p>本控件可批量上传图片并实现图片的插入到正文功能，支持裁图、加水印</p>',lan: '帮助',type: 'CustomEditors_TextArea'  }
				}
			}
	    }
	},
	
	ScriptEditor: {
	    text: 'ScriptEditor',
	    tip: "脚本编辑器",
	    icon: null,
	    about:{
			version:"1.0",
			author:"程邓时chengds@ifeng.com",
			update:"<p>脚本编辑器控件 V1.0</p>",
			help:"<p>支持语言高亮渲染，包含的语言有：basic,brainfuck,c,coldfusion,cpp,css,html,java,js,pas,perl,php,python,ruby,robotstxt,sql,tsql,vb,xml</p>"
		},		
		relyJS:['controls/Ext.ux.ScriptEditor.js?v=20131024','lib/editArea/edit_area_loader.js?v=20130515'],//依赖脚本文件
	    design: {//设计时
	        name: 'Ext.de.ScriptEditor',
	        rtName: 'Ext.ux.ScriptEditor',
	        ui: {
	            
	        }
	    },
	    //在属性表显示的属性
	    property: {
	        ui: {
				value: {
					fieldLabel: { value: '标签', lan: '标签' },
					width:{ value: 300, lan: '宽度' },
					height:{ value: 300, lan: '高度' },
					anchor: { value: "", lan: 'anchor(%)' },
					debugButtonEnable: { value: true, lan: '启用调试按钮' },
					syntax:{ value: 'js', lan: '语言' ,type: 'ComboBox', extra:{loadStore: [["basic","basic"],["c","c"],["coldfusion","coldfusion"],["cpp","cpp"],["css","css"],["html","html"],["java","java"],["js","js"],["perl","perl"],["php","php"],["python","python"],["ruby","ruby"],["sql","sql"],["tsql","tsql"],["vb","vb"],["xml","xml"]]}},
					word_wrap: { value: true, lan: '默认换行' },
					allow_toggle: { value: false, lan: '启用切换编辑器' },
					scriptTplContent:{value:'',lan:'代码模板',type:'CustomEditors_TextArea'},
					loadedCallback:{value:'function(){\n\t//todo\r\n}',lan:'加载后回调脚本',type:'CustomEditors_TextArea'},
					toolbar:{value:"undo, redo, |, search, go_to_line, |,select_font,|, change_smooth_selection, highlight, reset_highlight, word_wrap,format_code, |, fullscreen",lan:'工具栏',type:'CustomEditors_TextArea'}
				}
			}
	    }
	}
	
};
