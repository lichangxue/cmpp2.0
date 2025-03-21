//验证用户名
function checkedUserName(element){
	if($(element).val().length > 0){
		var username = $(element).val();
		var reg = /^[A-Za-z0-9_\-\\u4e00-\\u9fa5]+$/; //用户名
		if(username.length <4 || username.length > 20){
			$(element).parent().next(".msg-r").addClass("msg-r-error");
			$(element).parent(".form-input-r").addClass("error-form-input-r");
			$(element).parent().next(".msg-r").text("用户长度只能在4到20个字符之内");
			return false;
		}
		if(!reg.test(username)){
			$(element).parent().next(".msg-r").addClass("msg-r-error");
			$(element).parent(".form-input-r").addClass("error-form-input-r");
			$(element).parent().next(".msg-r").text("用户名中含其它特殊字符");
			return false;
		}
		//todo 异步验证是否已经被注册
		if(!isExistUsername(username, element))return false;

		$(element).parent().next(".msg-r").addClass("msg-r-success");
		$(element).parent().next(".msg-r").text("该用户可以注册");
		return true;
	}else{
		$(element).parent().next(".msg-r").addClass("msg-r-error");
		$(element).parent(".form-input-r").addClass("error-form-input-r");
		$(element).parent().next(".msg-r").text("用户名不能为空");
		return false;
	}
}
//异步验证用户名是否已经存在
function isExistUsername(username, element){
	var flag = true;
	if(username != null){
		var data = {"username": username};
		var url = "loginAuth!checkUserName.jhtml";
		$.ajax({
			type : "post",
			url  : url,
			data : data,
			dataType : "json",
			async:false,
			success: function(data){
				var jsonRetObj = eval("(" + data + ")");
				var ret = jsonRetObj.ret;
				var msg = jsonRetObj.msg;
				if (ret == 1){
					$(element).parent().next(".msg-r").addClass("msg-r-error");
					$(element).parent(".form-input-r").addClass("error-form-input-r");
					$(element).parent().next(".msg-r").text("用户"+username+"已经存在,请重新输入！");
					flag = false;
					return false;
				}else{
					flag = true;
				}
			},
			error: function(){
				//todo error
			}
		});
		return flag;
	}
}

//验证密码
function checkedPasswd(element){
	if($(element).val().length > 0){
		var passwd = $(element).val();
		var reg = /^[A-Za-z0-9\\u4e00-\\u9fa5]+$/; //密码
		if(passwd.length <6 || passwd.length > 20){
			$(element).parent().next(".msg-r").addClass("msg-r-error");
			$(element).parent(".form-input-r").addClass("error-form-input-r");
			$(element).parent().next(".msg-r").text("密码长度只能在6到20个字符之内");
			return false;
		}
		if(!reg.test(passwd)){
			$(element).parent().next(".msg-r").addClass("msg-r-error");
			$(element).parent(".form-input-r").addClass("error-form-input-r");
			$(element).parent().next(".msg-r").text("密码中含其它特殊字符");
			return false;
		}
		$(element).parent().next(".msg-r").addClass("msg-r-success");
		$(element).parent().next(".msg-r").text("");
		return true;
	}else{
		$(element).parent().next(".msg-r").addClass("msg-r-error");
		$(element).parent(".form-input-r").addClass("error-form-input-r");
		$(element).parent().next(".msg-r").text("请输入密码");
		return false;
	}
}
//验证是否一致
function checkedRePasswd(element){
	if($(element).val().length > 0){
		var passwd = $("input[name='passwd']").val();
		var repasswd = $(element).val();
		if(repasswd != passwd){
			$(element).parent().next(".msg-r").addClass("msg-r-error");
			$(element).parent(".form-input-r").addClass("error-form-input-r");
			$(element).parent().next(".msg-r").text("两次密码输入不一致");
			return false;
		}
		$(element).parent().next(".msg-r").addClass("msg-r-success");
		$(element).parent().next(".msg-r").text("");
		return true;
	}else{
		$(element).parent().next(".msg-r").addClass("msg-r-error");
		$(element).parent(".form-input-r").addClass("error-form-input-r");
		$(element).parent().next(".msg-r").text("请确认密码");
		return false;
	}
}
//中文名验证
function checkedCname(element){
	if($(element).val().length > 0){
		var cName = $(element).val();
		var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
		if(!reg.test(cName)){
			$(element).parent().next(".msg-r").addClass("msg-r-error");
			$(element).parent(".form-input-r").addClass("error-form-input-r");
			$(element).parent().next(".msg-r").text("包含非法字符");
			return false;
		}
		$(element).parent().next(".msg-r").addClass("msg-r-success");
		$(element).parent().next(".msg-r").text("");
		return true;
	}else{
		$(element).parent().next(".msg-r").addClass("msg-r-error");
		$(element).parent(".form-input-r").addClass("error-form-input-r");
		$(element).parent().next(".msg-r").text("请输入中文名/部门");
		return false;
	}
}
//简单验证电话号码（为数字即可）
function checkedPhone(element){
	if($(element).val().length > 0){
		var telephone = $(element).val();
		var reg = /^[0-9]+$/;
		if(!reg.test(telephone)){
			$(element).parent().next(".msg-r").addClass("msg-r-error");
			$(element).parent(".form-input-r").addClass("error-form-input-r");
			$(element).parent().next(".msg-r").text("电话号码必须是数字");
			return false;
		}
		if(telephone.length != 11){
			$(element).parent().next(".msg-r").addClass("msg-r-error");
			$(element).parent(".form-input-r").addClass("error-form-input-r");
			$(element).parent().next(".msg-r").text("电话号码必须为11位");
			return false;
		}
		$(element).parent().next(".msg-r").addClass("msg-r-success");
		$(element).parent().next(".msg-r").text("");
		return true;
	}else{
		$(element).parent().next(".msg-r").addClass("msg-r-error");
		$(element).parent(".form-input-r").addClass("error-form-input-r");
		$(element).parent().next(".msg-r").text("请输入电话号码");
		return false;
	}
}
//验证邮箱
function checkedEmail(element){
	if($(element).val().length > 0){
		var email = $(element).val();
		if(!isEmail(email)){
			$(element).parent().next(".msg-r").addClass("msg-r-error");
			$(element).parent(".form-input-r").addClass("error-form-input-r");
			$(element).parent().next(".msg-r").text("邮箱格式不正确");
			return false;
		}
		$(element).parent().next(".msg-r").addClass("msg-r-success");
		$(element).parent().next(".msg-r").text("正确的邮箱格式");
		return true;
	}else{
		$(element).parent().next(".msg-r").addClass("msg-r-error");
		$(element).parent(".form-input-r").addClass("error-form-input-r");
		$(element).parent().next(".msg-r").text("请输入邮箱地址");
		return false;
	}
}
//邮箱是否有效
function isEmail(str) {
	return new RegExp("^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$").test(str);
}
//登录时验证
function submitValidate(){
	var flag1,flag2,flag3,flag4,flag5,flag6,flag7;
	$(".lg-input-r").each(function(index,element){
		//提交时的判断
		if($(element).attr("name") == "username"){
			flag1 = checkedUserName(element)? 1 : 0;
		}else if($(element).attr("name") == "passwd"){
			flag2 = checkedPasswd(element)? 1 : 0;
		}else if($(element).attr("name") == "repasswd"){
			flag3 = checkedRePasswd(element)? 1 : 0;
		}else if($(element).attr("name") == "cnname"){
			flag4 = checkedCname(element)? 1 : 0;
		}else if($(element).attr("name") == "dept"){
			if($(element).val().length > 0){
				flag5 = checkedCname(element)? 1 : 0;
			}else{
				flag5 = 1;
			}
		}else if($(element).attr("name") == "telphone"){
			if($(element).val().length > 0) {
				flag6 = checkedPhone(element) ? 1 : 0;
			}else{
				flag6 = 1;
			}
		}else if($(element).attr("name") == "email"){
			if($(element).val().length > 0) {
				flag7 = checkedEmail(element) ? 1 : 0;
			}else{
				flag7 = 1;
			}
		}
	});
	var res = flag1&flag2&flag3&flag4&flag5&flag6&flag7;
	if(res == 0){
		return false;
	}else if(res == 1){
		return true;
	}
}







