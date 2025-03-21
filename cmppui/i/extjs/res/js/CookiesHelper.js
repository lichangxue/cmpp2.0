	Cookies={};
	/*
	 * ��ȡCookies
	 */
	Cookies.get = function(name){
	    var arg = name + "=";
	    var alen = arg.length;
	    var clen = document.cookie.length;
	    var i = 0;
	    var j = 0;
	    while(i < clen){
	        j = i + alen;
	        if (document.cookie.substring(i, j) == arg)
	            return Cookies.getCookieVal(j);
	        i = document.cookie.indexOf(" ", i) + 1;
	        if(i == 0)
	            break;
	    }
	    return null;
	};
	
	Cookies.getCookieVal = function(offset){
	   var endstr = document.cookie.indexOf(";", offset);
	   if(endstr == -1){
	       endstr = document.cookie.length;
	   }
	   return decodeURIComponent(document.cookie.substring(offset, endstr));
	};
	
	Cookies.delete = function(name){
		if (Cookies.get(name)){
			var date = new Date();
			date.setTime(date.getTime() - 10000);
			document.cookie = name + "=a; expires=" + date.toGMTString() + ";path=/";
		}
	};