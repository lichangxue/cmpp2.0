<?php
class SystemController extends BaseController {
	// 业务节点管理
	function actionIndex(){
		// 连个hello world都木有？

		// 回答：页面自动输出，请看main_index.html
	}
    /**
     * 初始化页面部分用户数据
     */
    function actionInitPage(){
        $cmpp_user = isset($_COOKIE["cmpp_user"])?$_COOKIE["cmpp_user"]:"";
        if(empty($cmpp_user)){
            $this->jump(url("login","index"));
        }else{
            $userInfo = json_decode($cmpp_user,true);
            success(array("currentUser"=>$userInfo));
        }
    }
    /**
     * 公共发送接口请求
     * 支持GET、POST
     * 发送DATA支持JSON、FORM
     */
    function actionSendReq(){
        $_token = isset($_COOKIE["cmpp_token"])?$_COOKIE["cmpp_token"]:"";
        $_sessionId = isset($_COOKIE["cmpp_sessionid"])?$_COOKIE["cmpp_sessionid"]:"";
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);
        $data["sessionId"] = $_sessionId;
        $_url = $this->spDomain.$data["api"];

        // if($data["api"] == "/api/menus/loadSchema" || $data["api"] == "/api/menus/saveSchema"){
        //     // 载入编辑视图或者保存视图的操作，token直接从传参中获取
        //     $_token = $data["token"];
        // }

        if($data['method'] == 'post'){
            $res = sendPost($_url,$data,array(
                "token:".$_token,
                "content-type:application/x-www-form-urlencoded"
            ));
        }else if($data['method'] == 'postjson'){
            $res = http_post_data($_url,$json_data,array(
                "Content-Type: application/json; charset=utf-8",
                "Content-Length: " . strlen($json_data),
                "token:".$_token
                )
            );
        }else{
            $res = sendGetWithHead($_url,array(
                "token:".$_token,
                "content-type:application/x-www-form-urlencoded"
            ));
        }
        if(!empty($res)){
			$json = json_decode($res,true);         
			if($json["status"]/1 == 0){
                if(isset($json["data"])){
                    success($json["data"]);
                }else{
                    success();
                }
			}else{
				error($json["msg"]);
			}
		}else{
			error("接口请求出错");
		}
    }
    /**
     * 发送接口请求【流程处理使用】
     * 支持GET、POST
     * 发送DATA支持JSON、FORM
     */
    function actionSendReqWorkflow(){
        $_token = isset($_COOKIE["cmpp_token"])?$_COOKIE["cmpp_token"]:"";
        $_sessionId = isset($_COOKIE["cmpp_sessionid"])?$_COOKIE["cmpp_sessionid"]:"";
        $data = $_REQUEST;
        $data["sessionId"] = $_sessionId;
        $_url = $this->spDomain.$data["api"];

        if($data["api"] == "/api/menus/loadSchema" || $data["api"] == "/api/menus/saveSchema"){
            $_token = $data["token"];
        }
        if($data['method'] == 'post'){
            $res = sendPost($_url,$data,array(
                "token:".$_token,
                "content-type:application/x-www-form-urlencoded"
            ));
        }else if($data['method'] == 'postjson'){
            $res = http_post_data($_url,json_encode($data,JSON_UNESCAPED_UNICODE),array(
                "Content-Type: application/json; charset=utf-8",
                "Content-Length: " . strlen(json_encode($data,JSON_UNESCAPED_UNICODE)),
                "token:".$_token
                )
            );
        }else{
            $res = sendGetWithHead($_url,array(
                "token:".$_token,
                "content-type:application/x-www-form-urlencoded"
            ));
        }
        if(!empty($res)){
			$json = json_decode($res,true);         
			if($json["status"]/1 == 0){
                $this->comm->success($json["data"]);
			}else{
				$this->comm->err($json["msg"]);
			}
		}else{
			$this->comm->err("接口请求出错");
		}
    }
}