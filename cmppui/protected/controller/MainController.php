<?php
class MainController extends BaseController {
	// 业务节点管理
	function actionIndex(){}
	// 系统运行时页面
	function actionRuntime(){
		$cmpp_user = isset($_COOKIE["cmpp_user"])?$_COOKIE["cmpp_user"]:"";
		if(empty($cmpp_user)){
			$this->tips("用户登录过期，请重新登录！",url("login","index"));
		}
		$_token = isset($_COOKIE["cmpp_token"])?$_COOKIE["cmpp_token"]:"";
		if(empty($_token)){
			$this->tips("用户登录过期，请重新登录！",url("login","index"));
		}
		$this->userInfo = json_decode($cmpp_user,true);
        $this->nodeid = arg("nodeid",0);

        // 获取站内消息
		$_url = $this->spDomain."/api/messages/noReadList?id=".$this->nodeid;		
		$res = sendGetWithHead($_url,array(
			"token:".$_token,
			"content-type:application/x-www-form-urlencoded"
		));

		$json = json_decode($res,true); 
		if($json["status"]/1 == 0){
			if(isset($json["data"]) && count($json["data"])>0){
				$this->dot = true;
			}else{
				$this->dot = false;
			}
		}else{
			$this->dot = false;
		}

        // 获取菜单
		$_url1 = $this->spDomain."/api/menus/getMenusByUser?nodeid=".$this->nodeid;		
		$res1 = sendGetWithHead($_url1,array(
			"token:".$_token,
			"content-type:application/x-www-form-urlencoded"
		));
		$json1 = json_decode($res1,true);
		
        $this->res_menus = $json1["data"]["menuInfo"];
	}
	/**
	 * 数据接口
	 */
	function actionDataApi(){
		$cmpp_user = isset($_COOKIE["cmpp_user"])?$_COOKIE["cmpp_user"]:"";
		if(empty($cmpp_user)){
			$this->tips("用户登录过期，请重新登录！",url("login","index"));
		}
		$_token = isset($_COOKIE["cmpp_token"])?$_COOKIE["cmpp_token"]:"";
		if(empty($_token)){
			$this->tips("用户登录过期，请重新登录！",url("login","index"));
		}
		$this->userInfo = json_decode($cmpp_user,true);
        $this->nodeid = arg("nodeid",0);
	}
	/**
	 * 欢迎页面
	 */
	function actionWelcome(){}
	/**
	 * 页面错误
	 */
	function actionError404(){}
	/**
	 * 加载Amis页面
	 */
	function actionPageContent(){
		// 菜单ID
		$id = arg("id",0);
		// 业务节点ID
		$nodeid = arg("nodeid",0);
        if($id/1 == 0){
            $id = arg("menuid",0);// 兼容部分页面参数名称不一致问题
        }        
        if($id == 0){
			// 如果菜单ID不存在，则显示404页面
            $this->display("main_error404.html");
            exit();
        }
		$this->token = isset($_COOKIE["cmpp_token"])?$_COOKIE["cmpp_token"]:"";
		// 根据菜单ID特殊适配特定页面
		if($id/1 == 10001){			
            $result = file_get_contents("i/pages/system_menus.json");
            $this->pageJson = $result;
        }else if($id/1 == 10002){
            $result = file_get_contents("i/pages/system_users.json");
            $this->pageJson = $result;
        }else if($id/1 == 10003){
            $result = file_get_contents("i/pages/system_permission.json");
            $this->pageJson = $result;
        }else if($id/1 == 10004){
            $result = file_get_contents("i/pages/system_role.json");
            $this->pageJson = $result;
        }else if($id/1 == 10005){
            $result = file_get_contents("i/pages/system_redis.json");
            $this->pageJson = $result;
        }else if($id/1 == 10006){            
            $result = file_get_contents("i/pages/system_workflow.json");
            $this->pageJson = $result;
        }else{
			$_token = isset($_COOKIE["cmpp_token"])?$_COOKIE["cmpp_token"]:"";
			if(empty($_token)){
				$this->tips("用户登录过期，请重新登录！",url("login","index"));
			}
            $res = sendGetWithHead($this->spDomain."/api/menus/getMenusById?nodeid=".$nodeid."&id=".$id,array(
                "token:".$_token,
                "content-type:application/x-www-form-urlencoded"
            )); 
            if(!empty($res)){
                $json = json_decode($res,true);
                if($json["status"]/1 == 0){
                    $schema = $json["data"]["schema"];
                    $this->pageJson = base64_decode($schema);
                }else{
                    $this->display("main_error404.html");
                    exit();
                }
            }else{
                $this->display("main_error404.html");
                exit();
            }  
		}
		$this->layout = "";
		$this->display("main_pagecontent.html");
	}

	/**
     * 脚本流程页面
     * @return void
     */
    function actionWorkflow(){
		$cmpp_user = isset($_COOKIE["cmpp_user"])?$_COOKIE["cmpp_user"]:"";
		if(empty($cmpp_user)){
			$this->tips("用户登录过期，请重新登录！",url("login","index"));
		}
		$_token = isset($_COOKIE["cmpp_token"])?$_COOKIE["cmpp_token"]:"";
		if(empty($_token)){
			$this->tips("用户登录过期，请重新登录！",url("login","index"));
		}
        $this->userInfo = json_decode($cmpp_user,true);
		$_url1 = $this->spDomain."/api/workflow/get?id=".arg("id",0);
		$res1 = sendGetWithHead($_url1,array(
			"token:".$_token,
			"content-type:application/x-www-form-urlencoded"
		));	
		$json1 = json_decode($res1,true);
        if($json1["status"]/1 == 0){
            $this->flowDefInfoJSON = $json1["data"]["workflowdata"];
        }
        $this->processId = arg("id",0);
        $this->nodeid = arg("nodeid",0);
        $this->dateTimeStr = date("Y-m-d H:i:s");
    }

}