Ext.namespace('Designer.controls');

Designer.controls.ui={
	FormPanel:{
		runtime:{
			ui:{
				title:'我的表单',
				buttonAlign:'center',
				xtype:'form',
				layout : 'xform',
				anchor:'100%',
				labelWidth:100,
				labelAlign:"right",
				items:{},
				padding:"10px",
				margin:"20px",
				autoScroll :true,
				frame:true,
				autoScroll:true
			}
		}
	},
	TextField:{
		runtime:{
			//在设计器中创建控件时需要的配置
			ui:{
				validateOnBlur:true
			}
		}
	},
	FieldSet: {
		runtime:{
			//在设计器中创建控件时需要的配置
			ui:{
				labelAlign: "right",
				xtype:"xfieldset",
				isContainer:true,
				layout: 'xform',
				cls:'fieldsetStyle',
				collapsible:true,
				checkboxToggle:false,
				titleCollapse:true,
				autoHeight:true
			}
		}
    },
	ComboBox:{
		runtime:{
			ui:{
				triggerAction:"all"
			}
		}
	},
	MultiSelect:{
		runtime:{
			ui:{
				triggerAction:"all"
			}
		}
	},
	HtmlEditor2:{
		runtime:{
			ui:{
				//fontFamilies : ["宋体","黑体","楷体"]
			}
		}
	}
	 
}
