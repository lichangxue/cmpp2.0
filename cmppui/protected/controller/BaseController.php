<?php
class BaseController extends Controller{
	public $layout = "layout.html";
	public $_a;
	public $nodeId;
	public $spDomain = "http://localhost:9000"; 

	function __construct(){
		parent::__construct();
		GLOBAL $__controller, $__action;
		$oplink = strtolower($__controller)."_".strtolower($__action); 
		$this->nodeId = arg("nodeid",0);  
		// nodeid 参数是业务相关页面必须的参数，除了下面的页面，其他页面必须传入此参数
		$no_nodeid = ['login_index','main_index','system_initpage','system_sendreq'];
		if($this->nodeId === 0 && !in_array($oplink,$no_nodeid)){
			$this->tips("业务节点不能为空！".$oplink,url("Main","Index"));
		}

        // 不需要登录授权的接口
        // $noAuth = ['/api/auth/sendMobileCode','/api/menus/loadSchema','/api/menus/saveSchema','/api/auth/captcha','/api/auth/signByMobile'];
		$noAuth = ['system_sendreq','login_index'];		
        if(!isset($_COOKIE) || empty($_COOKIE['cmpp_token'])){  
			// 未登录状态下，部分页面不需要进行验证			
            if(!in_array($oplink,$noAuth)){
                $this->jump(url("Login","Index"));
            }
        }    
	}
	function init(){
		header("Content-type: text/html; charset=utf-8");
		require(APP_DIR.'/protected/include/functions.php');
		  
	}

    function tips($msg, $url){
    	$url = "location.href=\"{$url}\";";
		echo "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"><script>function sptips(){alert(\"{$msg}\");{$url}}</script></head><body onload=\"sptips()\"></body></html>";
		exit;
    }
    function jump($url, $delay = 0){
        echo "<html><head><meta http-equiv='refresh' content='{$delay};url={$url}'></head><body></body></html>";
        exit;
    }

} 