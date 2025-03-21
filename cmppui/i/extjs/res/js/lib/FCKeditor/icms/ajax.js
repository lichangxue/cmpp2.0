/**
 * @author ZhaoQing
 * ifeng.ajax
 */

ifeng.ajax ={};
ifeng.ajax.sync ={
	_tempData:null,
	get:function(url,dataType){
		if(!dataType){
			dataType ='text';	
		}
		jQuery.ajax(
			{
			url: url,
			async: false,
			dataType: dataType,
			success: ifeng.delegate(this,this._receive),
			error:  ifeng.delegate(this,this._cannotReceive)
			}
		);
		
		return this._tempData;
	},
	post:function(url,dataType,data){
		if(!dataType){
			dataType ='text';	
		}
		jQuery.ajax(
			{
			url: url,
			async: false,
			type: 'POST',
			data: data,
			dataType: dataType,
			success: ifeng.delegate(this,this._receive),
			error:  ifeng.delegate(this,this._cannotReceive)
			}
		);
		
		return this._tempData;
	},
	_receive:function(data){
		this._tempData = data;
	},
	_cannotReceive:function(){
		this._tempData =null;
	}
	
}