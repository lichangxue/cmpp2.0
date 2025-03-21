<?php if(!class_exists("View", false)) exit("no direct access allowed");?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>CMPP 2.0-业务节点列表</title>
<link rel="stylesheet" href="//p1.renbenzhihui.com/amis/sdk6.0.0/sdk/sdk.css" />
<link rel="stylesheet" href="//p1.renbenzhihui.com/amis/sdk6.0.0/sdk/helper.css" />
<link rel="stylesheet" href="//p1.renbenzhihui.com/amis/sdk6.0.0/sdk/iconfont.css" />
<link rel="stylesheet" href="//p1.renbenzhihui.com/amis/sdk6.0.0/sdk/antd.css" />
<style>
    html,
    body,
    .app-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }
	.card-title {
		white-space: pre-line !important;
	}
  </style>
</head>
<body>
    <div id="root" class="app-wrapper"></div>
    <script src="//p1.renbenzhihui.com/amis/sdk6.0.0/sdk/sdk.js"></script>
    <script src="/i/public/js/jquery-3.7.1.min.js" charset="utf-8"></script>
    <script src="/i/public/js/jquery.cookie.js" charset="utf-8"></script>

    <script type="text/javascript">
      (function () {
        let amis = amisRequire('amis/embed');
        // 通过替换下面这个配置来生成不同页面
        let amisJSON = {
  "type": "page",
  "title": "平台列表",
  "body": [
    {
      "type": "crud",
      "id": "u:bbc4c6bbec00",
      "syncLocation": false,
      "api": {
        "method": "post",
        "url": "/system/sendReq.html",
        "requestAdaptor": "",
        "adaptor": "",
        "messages": {},
        "dataType": "json",
        "data": {
          "&": "$$",
          "api": "/api/node/list",
          "method": "postjson",
          "model": {
            "name": "${name}"
          },
          "pager": {
            "page": "${page}",
            "perPage": "${perPage}"
          }
        }
      },
      "bulkActions": [
        {
          "label": "每个业务平台独立运行，互不干涉。",
          "type": "button",
          "id": "u:dcae93491d30",
          "level": "link",
          "block": false
        }
      ],
      "itemActions": [],
      "headerToolbar": [
        {
          "label": "新增",
          "type": "button",
          "actionType": "dialog",
          "level": "primary",
          "editorSetting": {
            "behavior": "create"
          },
          "dialog": {
            "type": "dialog",
            "title": "新增业务节点",
            "body": [
              {
                "type": "form",
                "api": {
                  "method": "post",
                  "url": "/system/sendReq.html",
                  "requestAdaptor": "",
                  "adaptor": "",
                  "messages": {},
                  "dataType": "json",
                  "data": {
                    "&": "$$",
                    "api": "/api/node/add",
                    "method": "postjson",
                    "masterdb": {
                      "dbname": "${masterdb_dbname}",
                      "ip": "${masterdb_ip}",
                      "port": "${masterdb_port}",
                      "pwd": "${masterdb_pwd}",
                      "readable": "true",
                      "uname": "${masterdb_uname}",
                      "writable": "true"
                    },
                    "nosql": {
                      "ip": "${nosql_ip}",
                      "port": "${nosql_port}",
                      "uname": "${nosql_uname}",
                      "pwd": "${nosql_pwd}",
                      "dbname": "${nosql_dbname}"
                    },
                    "privatesearch": {
                      "ip": "",
                      "port": 0,
                      "searchType": "",
                      "searchUrl": ""
                    },
                    "publicsearch": {
                      "ip": "",
                      "port": 0,
                      "searchType": "",
                      "searchUrl": ""
                    },
                    "queueconfig": {
                      "ip": "${queueconfig_ip}",
                      "port": "${queueconfig_port}",
                      "queueType": "${queueconfig_queueType}"
                    },
                    "redisconfig": {
                      "clusterRedis": "${redisconfig_clusterRedis}",
                      "ip": "${redisconfig_ip}",
                      "masterSlaveRedis": "${redisconfig_masterSlaveRedis}",
                      "port": "${redisconfig_port}",
                      "pwd": "${redisconfig_pwd}",
                      "readable": true,
                      "writable": true
                    },
                    "remote": {
                      "ip": "${remote_ip}",
                      "port": "${remote_port}",
                      "pwd": "${remote_pwd}",
                      "remoteDataPath": "${remote_remoteDataPath}",
                      "remoteDeployPath": "${remote_remoteDeployPath}",
                      "uname": "${remote_uname}"
                    },
                    "searchconfig": {
                      "ip": "${searchconfig_ip}",
                      "port": "${searchconfig_port}",
                      "searchType": "${searchconfig_searchType}",
                      "searchUrl": "${searchconfig_searchUrl}"
                    },
                    "slavedb": {
                      "dbname": "${slavedb_dbname}",
                      "ip": "${slavedb_ip}",
                      "port": "${slavedb_port}",
                      "pwd": "${slavedb_pwd}",
                      "readable": "true",
                      "uname": "${slavedb_uname}"
                    }
                  }
                },
                "body": [
                  {
                    "type": "input-text",
                    "name": "id",
                    "label": "ID",
                    "id": "u:0c4eb47c2185",
                    "value": "0",
                    "hidden": true
                  },
                  {
                    "type": "input-text",
                    "name": "name",
                    "label": "标题",
                    "id": "u:b1c0c3ad4486",
                    "required": true,
                    "placeholder": "输入业务名称",
                    "description": "<font color=\"red\">创建新的业务节点除非您有单独部署需要独立相关的服务器、数据库、Redis等相关服务，可以通过如下扩展配置进行分布式部署。如果没有特殊配置可以使用系统默认配置，无需改动下面任何配置，输入名称后点击“确定”按钮创建即可</font>"
                  },
                  {
                    "type": "tabs",
                    "tabs": [
                      {
                        "title": "主数据库配置",
                        "body": [
                          {
                            "type": "input-text",
                            "label": "IP地址",
                            "name": "masterdb_ip",
                            "id": "u:15be726054f0"
                          },
                          {
                            "type": "input-text",
                            "label": "数据库端口",
                            "name": "masterdb_port",
                            "id": "u:b2893f8dafcd"
                          },
                          {
                            "type": "input-text",
                            "label": "用户名",
                            "name": "masterdb_uname",
                            "id": "u:310a9b0809c2"
                          },
                          {
                            "type": "input-text",
                            "label": "密码",
                            "name": "masterdb_pwd",
                            "id": "u:2d544d108a6f"
                          },
                          {
                            "type": "input-text",
                            "label": "数据库名称",
                            "name": "masterdb_dbname",
                            "id": "u:d1c1084f8c3f"
                          }
                        ],
                        "id": "u:2b8ebe9bf8aa"
                      },
                      {
                        "title": "从数据库配置",
                        "body": [
                          {
                            "type": "input-text",
                            "id": "u:15be726s054f0",
                            "label": "IP地址",
                            "name": "slavedb_ip"
                          },
                          {
                            "type": "input-text",
                            "label": "数据库端口",
                            "name": "slavedb_port",
                            "id": "u:b2893fs8dafcd"
                          },
                          {
                            "type": "input-text",
                            "label": "用户名",
                            "name": "slavedb_uname",
                            "id": "u:310a9b0s809c2"
                          },
                          {
                            "type": "input-text",
                            "label": "密码",
                            "name": "slavedb_pwd",
                            "id": "u:2d544sd108a6f"
                          },
                          {
                            "type": "input-text",
                            "label": "数据库名称",
                            "name": "slavedb_dbname",
                            "id": "u:d1c108s4f8c3f"
                          }
                        ],
                        "id": "u:aae8e68807c5"
                      },
                      {
                        "title": "搜索服务配置",
                        "body": [
                          {
                            "type": "input-text",
                            "id": "u:15be72se6054f0",
                            "label": "IP地址",
                            "name": "searchconfig_ip"
                          },
                          {
                            "type": "input-text",
                            "label": "端口",
                            "name": "searchconfig_port",
                            "id": "u:b2893sef8dafcd"
                          },
                          {
                            "type": "input-text",
                            "label": "搜索服务链接",
                            "name": "searchconfig_searchUrl",
                            "id": "u:b16e7cc1b22e",
                            "placeholder": "请输入搜索服务链接,例如：CMPPSearch-2.0.1",
                            "description": "请输入ip和port后面的路径。"
                          },
                          {
                            "type": "radios",
                            "label": "搜索服务类型",
                            "name": "searchconfig_searchType",
                            "options": [
                              {
                                "label": "Solr主从",
                                "value": "ms"
                              },
                              {
                                "label": "Solr集群",
                                "value": "cluster"
                              }
                            ],
                            "id": "u:48b7c0ser46b8f4",
                            "value": "ms"
                          }
                        ],
                        "id": "u:6384a97f9567"
                      },
                      {
                        "title": "Redis配置",
                        "body": [
                          {
                            "type": "input-text",
                            "id": "u:15be72r6054f0",
                            "label": "IP地址",
                            "name": "redisconfig_ip",
                            "description": "多个地址用英文逗号分隔，如果是主从模式，默认第一个IP为主服务IP"
                          },
                          {
                            "type": "input-text",
                            "label": "端口",
                            "name": "redisconfig_port",
                            "id": "u:b2893rf8dafcd",
                            "description": "如果有多个端口，使用英文逗号分隔，多个端口，输入端口数量请与IP数量一一对应"
                          },
                          {
                            "type": "input-text",
                            "label": "密码",
                            "name": "redisconfig_pwd",
                            "id": "u:1dac8211ca2b"
                          },
                          {
                            "type": "radios",
                            "label": "是否是集群",
                            "name": "redisconfig_clusterRedis",
                            "options": [
                              {
                                "label": "是",
                                "value": "true"
                              },
                              {
                                "label": "否",
                                "value": "false"
                              }
                            ],
                            "id": "u:908ad998fa7f",
                            "value": "false"
                          },
                          {
                            "type": "radios",
                            "label": "主从服务",
                            "name": "redisconfig_masterSlaveRedis",
                            "options": [
                              {
                                "label": "是",
                                "value": "true"
                              },
                              {
                                "label": "否",
                                "value": "false"
                              }
                            ],
                            "id": "u:db89be7c030d",
                            "value": "true"
                          }
                        ],
                        "id": "u:ac25e1a91044"
                      },
                      {
                        "title": "消息队列配置",
                        "body": [
                          {
                            "type": "input-text",
                            "id": "u:15be72q6054f0",
                            "label": "IP地址",
                            "name": "queueconfig_ip",
                            "description": ""
                          },
                          {
                            "type": "input-text",
                            "label": "端口",
                            "name": "queueconfig-port",
                            "id": "u:b2893qf8dafcd",
                            "description": ""
                          },
                          {
                            "type": "radios",
                            "label": "消息队列服务",
                            "name": "queueconfig_queueType",
                            "options": [
                              {
                                "label": "Redis",
                                "value": "Redis"
                              },
                              {
                                "label": "RabbitMQ",
                                "value": "RabbitMQ"
                              }
                            ],
                            "id": "u:48b7c046b8f4",
                            "value": "Redis"
                          }
                        ],
                        "id": "u:66733c101448"
                      },
                      {
                        "title": "Nosql数据库配置",
                        "body": [
                          {
                            "type": "input-text",
                            "id": "u:15be72n6054f0",
                            "label": "IP地址",
                            "name": "nosql_ip",
                            "description": "多个地址用英文逗号分隔，如果是主从模式，默认第一个IP为主服务IP"
                          },
                          {
                            "type": "input-text",
                            "label": "端口",
                            "name": "nosql_port",
                            "id": "u:b2893nf8dafcd",
                            "description": "如果有多个端口，使用英文逗号分隔，多个端口，输入端口数量请与IP数量一一对应"
                          },
                          {
                            "type": "input-text",
                            "label": "用户名",
                            "name": "nosql_uname",
                            "id": "u:7642a5fa33ed"
                          },
                          {
                            "type": "input-text",
                            "label": "密码",
                            "name": "nosql_pwd",
                            "id": "u:351d09bc1a95"
                          },
                          {
                            "type": "input-text",
                            "label": "数据库名称",
                            "name": "nosql_dbname",
                            "id": "u:8d18773ff1ec"
                          }
                        ],
                        "id": "u:533787291f76"
                      },
                      {
                        "title": "远程部署配置",
                        "body": [
                          {
                            "type": "input-text",
                            "id": "u:15be72rt6054f0",
                            "label": "IP地址",
                            "name": "remote_ip"
                          },
                          {
                            "type": "input-text",
                            "label": "端口",
                            "name": "remote_port",
                            "id": "u:b2893rtf8dafcd"
                          },
                          {
                            "type": "input-text",
                            "label": "用户名",
                            "name": "remote_uname",
                            "id": "u:7642a5rtfa33ed"
                          },
                          {
                            "type": "input-text",
                            "label": "密码",
                            "name": "remote_pwd",
                            "id": "u:351d09rtbc1a95"
                          },
                          {
                            "type": "input-text",
                            "label": "数据存储路径",
                            "name": "remote_remoteDataPath",
                            "id": "u:fca8b939d042",
                            "placeholder": "示例:/data/fm/",
                            "description": "远程部署文件推送使用的数rsync工具，需要服务器处于同一个网络内，并且安装rsync工具"
                          },
                          {
                            "type": "input-text",
                            "label": "部署路径",
                            "name": "remote_remoteDeployPath",
                            "id": "u:7a4462c78311",
                            "placeholder": "示例：/www/wwwroot/"
                          }
                        ],
                        "id": "u:44f84375457d"
                      },
                      {
                        "title": "环境变量",
                        "body": [
                          {
                            "type": "combo",
                            "label": "环境变量",
                            "name": "env",
                            "multiple": true,
                            "addable": true,
                            "removable": true,
                            "removableMode": "icon",
                            "addBtn": {
                              "label": "新增",
                              "icon": "fa fa-plus",
                              "level": "primary",
                              "size": "sm",
                              "id": "u:60b918af9730"
                            },
                            "items": [
                              {
                                "type": "input-text",
                                "name": "key",
                                "placeholder": "变量名称",
                                "id": "u:306cf9c80c8c",
                                "description": "英文"
                              },
                              {
                                "type": "input-text",
                                "label": "",
                                "name": "value",
                                "id": "u:d71ebc12216d",
                                "placeholder": "变量值"
                              },
                              {
                                "type": "input-text",
                                "label": "",
                                "name": "desc",
                                "id": "u:61b5e2a62747",
                                "multiple": false,
                                "placeholder": "描述"
                              }
                            ],
                            "id": "u:e93b734ea1ad",
                            "strictMode": true,
                            "syncFields": []
                          }
                        ],
                        "id": "u:70fff58e26a7"
                      }
                    ],
                    "id": "u:06e87dc9b5c4"
                  }
                ],
                "id": "u:77c588bae565",
                "actions": [
                  {
                    "type": "submit",
                    "label": "提交",
                    "primary": true
                  }
                ],
                "feat": "Insert"
              }
            ],
            "id": "u:bc10abfe2ad3",
            "actions": [
              {
                "type": "button",
                "actionType": "cancel",
                "label": "取消",
                "id": "u:4609f6ce1698"
              },
              {
                "type": "button",
                "actionType": "confirm",
                "label": "确定",
                "primary": true,
                "id": "u:247fc3b283e6"
              }
            ],
            "showCloseButton": true,
            "closeOnOutside": false,
            "closeOnEsc": false,
            "showErrorMsg": true,
            "showLoading": true,
            "draggable": false,
            "size": "lg",
            "withDefaultData": false,
            "dataMapSwitch": false
          },
          "id": "u:97b1d8264524",
          "tooltip": "创建一个新的业务系统",
          "rightIcon": "fa fa-slideshare"
        },
        "bulkActions"
      ],
      "perPageAvailable": [
        1000
      ],
      "messages": {},
      "filter": {
        "title": "查询条件",
        "body": [
          {
            "type": "input-text",
            "name": "name",
            "label": "搜索平台",
            "id": "u:6bbb1fb3970a"
          }
        ],
        "id": "u:e667b0f99648",
        "actions": [
          {
            "type": "submit",
            "label": "搜索",
            "primary": true,
            "id": "u:6e9b61030555"
          }
        ],
        "feat": "Insert"
      },
      "stopAutoRefreshWhenModalIsOpen": true,
      "card": {
        "type": "card",
        "header": {
          "title": "【${id}】${name}",
          "titleClassName": "card-title",
          "subTitle": "",
          "avatar": "https://www.renbenai.com/favicon.ico"
        },
        "body": [
          {
            "id": "u:88787311779c",
            "type": "mapping",
            "label": "部署：",
            "name": "deployStatus",
            "map": {
              "1": "<span class='label label-info'>公共服务</span>",
              "2": "<span class='label label-success'>已部署</span>",
              "3": "<span class='label label-danger'>部署失败</span>",
              "*": "<span class='label label-default'>其他</span>"
            }
          }
        ],
        "actions": [
          {
            "label": "编辑",
            "type": "button",
            "actionType": "dialog",
            "level": "link",
            "editorSetting": {
              "behavior": "update"
            },
            "dialog": {
              "title": "编辑节点信息",
              "body": {
                "type": "form",
                "api": {
                  "method": "post",
                  "url": "/system/sendReq.html",
                  "requestAdaptor": "",
                  "adaptor": "",
                  "messages": {},
                  "dataType": "json",
                  "data": {
                    "&": "$$",
                    "api": "/api/node/update",
                    "method": "postjson",
                    "masterdb": {
                      "dbname": "${masterdb_dbname}",
                      "ip": "${masterdb_ip}",
                      "port": "${masterdb_port}",
                      "pwd": "${masterdb_pwd}",
                      "readable": "true",
                      "uname": "${masterdb_uname}",
                      "writable": "true"
                    },
                    "nosql": {
                      "ip": "${nosql_ip}",
                      "port": "${nosql_port}",
                      "uname": "${nosql_uname}",
                      "pwd": "${nosql_pwd}",
                      "dbname": "${nosql_dbname}"
                    },
                    "privatesearch": {
                      "ip": "",
                      "port": 0,
                      "searchType": "",
                      "searchUrl": ""
                    },
                    "publicsearch": {
                      "ip": "",
                      "port": 0,
                      "searchType": "",
                      "searchUrl": ""
                    },
                    "queueconfig": {
                      "ip": "${queueconfig_ip}",
                      "port": "${queueconfig_port}",
                      "queueType": "${queueconfig_queueType}"
                    },
                    "redisconfig": {
                      "clusterRedis": "${redisconfig_clusterRedis}",
                      "ip": "${redisconfig_ip}",
                      "masterSlaveRedis": "${redisconfig_masterSlaveRedis}",
                      "port": "${redisconfig_port}",
                      "pwd": "${redisconfig_pwd}",
                      "readable": true,
                      "writable": true
                    },
                    "remote": {
                      "ip": "${remote_ip}",
                      "port": "${remote_port}",
                      "pwd": "${remote_pwd}",
                      "remoteDataPath": "${remote_remoteDataPath}",
                      "remoteDeployPath": "${remote_remoteDeployPath}",
                      "uname": "${remote_uname}"
                    },
                    "searchconfig": {
                      "ip": "${searchconfig_ip}",
                      "port": "${searchconfig_port}",
                      "searchType": "${searchconfig_searchType}",
                      "searchUrl": "${searchconfig_searchUrl}"
                    },
                    "slavedb": {
                      "dbname": "${slavedb_dbname}",
                      "ip": "${slavedb_ip}",
                      "port": "${slavedb_port}",
                      "pwd": "${slavedb_pwd}",
                      "readable": "true",
                      "uname": "${slavedb_uname}"
                    }
                  }
                },
                "body": [
                  {
                    "name": "id",
                    "label": "ID",
                    "type": "input-text",
                    "id": "u:0c447c2185"
                  },
                  {
                    "name": "name",
                    "label": "标题",
                    "type": "input-text",
                    "id": "u:b1c0c3ad86",
                    "required": true,
                    "placeholder": "输入业务名称",
                    "description": "<font color=\"red\">业务节点除非您有单独部署需要独立相关的服务器、数据库、Redis等相关服务，可以通过如下扩展配置进行分布式部署。如果没有特殊配置可以使用系统默认配置，无需改动下面任何配置，输入名称后点击“确定”按钮创建即可</font>"
                  },
                  {
                    "type": "tabs",
                    "tabs": [
                      {
                        "title": "主数据库配置",
                        "body": [
                          {
                            "type": "input-text",
                            "label": "IP地址",
                            "name": "masterdb_ip",
                            "id": "u:15be6054f0",
                            "value": "${masterdb.ip}"
                          },
                          {
                            "type": "input-text",
                            "label": "数据库端口",
                            "name": "masterdb_port",
                            "id": "u:b28f8dafcd",
                            "value": "${masterdb.port}"
                          },
                          {
                            "type": "input-text",
                            "label": "用户名",
                            "name": "masterdb_uname",
                            "id": "u:31b0809c2",
                            "value": "${masterdb.uname}"
                          },
                          {
                            "type": "input-text",
                            "label": "密码",
                            "name": "masterdb_pwd",
                            "id": "u:2d5108a6f",
                            "value": "${masterdb.pwd}"
                          },
                          {
                            "type": "input-text",
                            "label": "数据库名称",
                            "name": "masterdb_dbname",
                            "id": "u:d1c108c3f",
                            "value": "${masterdb.dbname}"
                          }
                        ],
                        "id": "u:2b8e9bf8aa"
                      },
                      {
                        "title": "从数据库配置",
                        "body": [
                          {
                            "type": "input-text",
                            "id": "u:15be7s054f0",
                            "label": "IP地址",
                            "name": "slavedb_ip",
                            "value": "${slavedb.ip}"
                          },
                          {
                            "type": "input-text",
                            "label": "数据库端口",
                            "name": "slavedb_port",
                            "id": "u:b2893dafcd",
                            "value": "${slavedb.port}"
                          },
                          {
                            "type": "input-text",
                            "label": "用户名",
                            "name": "slavedb_uname",
                            "id": "u:310as809c2",
                            "value": "${slavedb.uname}"
                          },
                          {
                            "type": "input-text",
                            "label": "密码",
                            "name": "slavedb_pwd",
                            "id": "u:2d54108a6f",
                            "value": "${slavedb.pwd}"
                          },
                          {
                            "type": "input-text",
                            "label": "数据库名称",
                            "name": "slavedb_dbname",
                            "id": "u:d1c14f8c3f",
                            "value": "${slavedb.dbname}"
                          }
                        ],
                        "id": "u:aae8e68807c5"
                      },
                      {
                        "title": "搜索服务配置",
                        "body": [
                          {
                            "type": "input-text",
                            "id": "u:15be7054f0",
                            "label": "IP地址",
                            "name": "searchconfig_ip",
                            "value": "${searchconfig.ip}"
                          },
                          {
                            "type": "input-text",
                            "label": "端口",
                            "name": "searchconfig_port",
                            "id": "u:b2893seafcd",
                            "value": "${searchconfig.port}"
                          },
                          {
                            "type": "input-text",
                            "label": "搜索服务链接",
                            "name": "searchconfig_searchUrl",
                            "id": "u:b16e7csdsdc1b22e",
                            "placeholder": "请输入搜索服务链接,例如：CMPPSearch-2.0.1",
                            "description": "请输入ip和port后面的路径。",
                            "value": "${searchconfig.searchUrl}"
                          },
                          {
                            "type": "radios",
                            "label": "搜索服务类型",
                            "name": "searchconfig_searchType",
                            "options": [
                              {
                                "label": "Solr主从",
                                "value": "ms"
                              },
                              {
                                "label": "Solr集群",
                                "value": "cluster"
                              }
                            ],
                            "id": "u:48b7c0ser4634b8f4",
                            "value": "${searchconfig.searchType}"
                          }
                        ],
                        "id": "u:6384a97f9567"
                      },
                      {
                        "title": "Redis配置",
                        "body": [
                          {
                            "type": "input-text",
                            "id": "u:15be72r64234054f0",
                            "label": "IP地址",
                            "name": "redisconfig_ip",
                            "description": "多个地址用英文逗号分隔，如果是主从模式，默认第一个IP为主服务IP",
                            "value": "${redisconfig.ip}"
                          },
                          {
                            "type": "input-text",
                            "label": "端口",
                            "name": "redisconfig_port",
                            "id": "u:b2893r234f8dafcd",
                            "description": "如果有多个端口，使用英文逗号分隔，多个端口，输入端口数量请与IP数量一一对应",
                            "value": "${redisconfig.port}"
                          },
                          {
                            "type": "input-text",
                            "label": "密码",
                            "name": "redisconfig_pwd",
                            "id": "u:1dac821234231ca2b",
                            "value": "${redisconfig.pwd}"
                          },
                          {
                            "type": "radios",
                            "label": "是否是集群",
                            "name": "redisconfig_clusterRedis",
                            "options": [
                              {
                                "label": "是",
                                "value": "true"
                              },
                              {
                                "label": "否",
                                "value": "false"
                              }
                            ],
                            "id": "u:908ad923498fa7f",
                            "value": "${redisconfig.clusterRedis}"
                          },
                          {
                            "type": "radios",
                            "label": "主从服务",
                            "name": "redisconfig_masterSlaveRedis",
                            "options": [
                              {
                                "label": "是",
                                "value": "true"
                              },
                              {
                                "label": "否",
                                "value": "false"
                              }
                            ],
                            "id": "u:db89be7c23423030d",
                            "value": "${redisconfig.masterSlaveRedis}"
                          }
                        ],
                        "id": "u:ac25e1a9234231044"
                      },
                      {
                        "title": "消息队列配置",
                        "body": [
                          {
                            "type": "input-text",
                            "id": "u:15be72q60234234f0",
                            "label": "IP地址",
                            "name": "queueconfig_ip",
                            "description": "",
                            "value": "${queueconfig.pwd}"
                          },
                          {
                            "type": "input-text",
                            "label": "端口",
                            "name": "queueconfig-port",
                            "id": "u:b2893qf8d23423afcd",
                            "description": "",
                            "value": "${queueconfig.port}"
                          },
                          {
                            "type": "radios",
                            "label": "消息队列服务",
                            "name": "queueconfig_queueType",
                            "options": [
                              {
                                "label": "Redis",
                                "value": "Redis"
                              },
                              {
                                "label": "RabbitMQ",
                                "value": "RabbitMQ"
                              }
                            ],
                            "id": "u:48b7c0423426b8f4",
                            "value": "${queueconfig.queueType}"
                          }
                        ],
                        "id": "u:66733c10234231448"
                      },
                      {
                        "title": "Nosql数据库配置",
                        "body": [
                          {
                            "type": "input-text",
                            "id": "u:15be72n6023454f0",
                            "label": "IP地址",
                            "name": "nosql_ip",
                            "description": "多个地址用英文逗号分隔，如果是主从模式，默认第一个IP为主服务IP",
                            "value": "${nosql.ip}"
                          },
                          {
                            "type": "input-text",
                            "label": "端口",
                            "name": "nosql_port",
                            "id": "u:b2893nf234238dafcd",
                            "description": "如果有多个端口，使用英文逗号分隔，多个端口，输入端口数量请与IP数量一一对应",
                            "value": "${nosql.port}"
                          },
                          {
                            "type": "input-text",
                            "label": "用户名",
                            "name": "nosql_uname",
                            "id": "u:7642a5fa2342333ed",
                            "value": "${nosql.uname}"
                          },
                          {
                            "type": "input-text",
                            "label": "密码",
                            "name": "nosql_pwd",
                            "id": "u:351d09b23423c1a95",
                            "value": "${nosql.pwd}"
                          },
                          {
                            "type": "input-text",
                            "label": "数据库名称",
                            "name": "nosql_dbname",
                            "id": "u:8d1877323423ff1ec",
                            "value": "${nosql.dbname}"
                          }
                        ],
                        "id": "u:533787292342341f76"
                      },
                      {
                        "title": "远程部署配置",
                        "body": [
                          {
                            "type": "input-text",
                            "id": "u:15be72rt234236054f0",
                            "label": "IP地址",
                            "name": "remote_ip",
                            "value": "${remote.ip}"
                          },
                          {
                            "type": "input-text",
                            "label": "端口",
                            "name": "remote_port",
                            "id": "u:b2893rtf823423dafcd",
                            "value": "${remote.port}"
                          },
                          {
                            "type": "input-text",
                            "label": "用户名",
                            "name": "remote_uname",
                            "id": "u:7642a5rtfa32343ed",
                            "value": "${remote.uname}"
                          },
                          {
                            "type": "input-text",
                            "label": "密码",
                            "name": "remote_pwd",
                            "id": "u:351d09rt2342bc1a95",
                            "value": "${remote.pwd}"
                          },
                          {
                            "type": "input-text",
                            "label": "数据存储路径",
                            "name": "remote_remoteDataPath",
                            "id": "u:fca8b939234d042",
                            "placeholder": "示例:/data/fm/",
                            "description": "远程部署文件推送使用的数rsync工具，需要服务器处于同一个网络内，并且安装rsync工具",
                            "value": "${remote.remoteDataPath}"
                          },
                          {
                            "type": "input-text",
                            "label": "部署路径",
                            "name": "remote_remoteDeployPath",
                            "id": "u:7a4462234c78311",
                            "placeholder": "示例：/www/wwwroot/",
                            "value": "${remote.remoteDeployPath}"
                          }
                        ],
                        "id": "u:44f84375423457d"
                      },
                      {
                        "title": "环境变量",
                        "body": {
                          "type": "combo",
                          "label": "环境变量",
                          "name": "env",
                          "multiple": true,
                          "addable": true,
                          "removable": true,
                          "removableMode": "icon",
                          "addBtn": {
                            "label": "新增",
                            "icon": "fa fa-plus",
                            "level": "primary",
                            "size": "sm",
                            "id": "u:60b918234af9730"
                          },
                          "items": [
                            {
                              "type": "input-text",
                              "name": "key",
                              "placeholder": "变量名称",
                              "id": "u:306cf923423c80c8c",
                              "description": "英文"
                            },
                            {
                              "type": "input-text",
                              "label": "",
                              "name": "value",
                              "id": "u:d71ebc2342312216d",
                              "placeholder": "变量值"
                            },
                            {
                              "type": "input-text",
                              "label": "",
                              "name": "desc",
                              "id": "u:61b523423e2a62747",
                              "multiple": false,
                              "placeholder": "描述"
                            }
                          ],
                          "id": "u:e93b7234234ea1ad",
                          "strictMode": true,
                          "syncFields": []
                        },
                        "id": "u:70fff2342358e26a7"
                      }
                    ],
                    "id": "u:06e872342dc9b5c4"
                  }
                ],
                "feat": "Edit",
                "dsType": "api",
                "initApi": {
                  "method": "post",
                  "url": "/system/sendReq.html",
                  "requestAdaptor": "",
                  "adaptor": "",
                  "messages": {},
                  "dataType": "json",
                  "data": {
                    "&": "$$",
                    "api": "/api/node/get?nodeId=${id}",
                    "method": "get"
                  }
                }
              },
              "size": "lg",
              "showCloseButton": true,
              "closeOnOutside": false,
              "closeOnEsc": false,
              "showErrorMsg": true,
              "showLoading": true,
              "draggable": true
            },
            "id": "u:bb916f92322e"
          },
          {
            "type": "button",
            "label": "群发消息",
            "onEvent": {
              "click": {
                "actions": [
                  {
                    "ignoreError": false,
                    "actionType": "dialog",
                    "dialog": {
                      "type": "dialog",
                      "title": "群发消息",
                      "body": [
                        {
                          "id": "u:80f68bbb40f9",
                          "type": "form",
                          "title": "表单",
                          "mode": "horizontal",
                          "dsType": "api",
                          "feat": "Insert",
                          "body": [
                            {
                              "name": "title",
                              "label": "标题",
                              "type": "input-text",
                              "id": "u:9097050ac245"
                            },
                            {
                              "name": "content",
                              "label": "消息内容",
                              "type": "textarea",
                              "id": "u:6bfd3ac69924",
                              "description": "<font color=\"red\">此处发送消息为全员消息</font>"
                            }
                          ],
                          "api": {
                            "url": "/system/sendReq.html",
                            "method": "post",
                            "requestAdaptor": "",
                            "adaptor": "",
                            "messages": {},
                            "dataType": "json",
                            "data": {
                              "&": "$$",
                              "api": "/api/messages/add",
                              "method": "post"
                            }
                          },
                          "actions": [
                            {
                              "type": "button",
                              "label": "提交",
                              "onEvent": {
                                "click": {
                                  "actions": [
                                    {
                                      "actionType": "submit",
                                      "componentId": "u:80f68bbb40f9"
                                    }
                                  ]
                                }
                              },
                              "level": "primary"
                            }
                          ],
                          "resetAfterSubmit": true
                        }
                      ],
                      "showCloseButton": true,
                      "showErrorMsg": true,
                      "showLoading": true,
                      "className": "app-popover :AMISCSSWrapper",
                      "actions": [
                        {
                          "type": "button",
                          "actionType": "cancel",
                          "label": "取消",
                          "id": "u:b03835ebeeb8"
                        },
                        {
                          "type": "button",
                          "actionType": "confirm",
                          "label": "确认",
                          "primary": true,
                          "id": "u:0ce09cd5a0aa"
                        }
                      ],
                      "id": "u:84181e2930a6"
                    }
                  }
                ]
              }
            },
            "id": "u:08f2f0aa47b5"
          },
          {
            "type": "button",
            "label": "数据接口",
            "onEvent": {
              "click": {
                "actions": [
                  {
                    "ignoreError": false,
                    "actionType": "url",
                    "args": {
                      "url": "/main/dataapi.html?nodeid=${id}"
                    }
                  }
                ]
              }
            },
            "id": "u:417d70e14289"
          },
          {
            "type": "button",
            "label": "进入",
            "onEvent": {
              "click": {
                "actions": [
                  {
                    "ignoreError": false,
                    "actionType": "url",
                    "args": {
                      "url": "/main/runtime.html?nodeid=${id}"
                    }
                  }
                ]
              }
            },
            "id": "u:db5a7699bcf4"
          }
        ],
        "id": "u:a2e8ec69ceae"
      },
      "mode": "cards",
      "filterTogglable": true,
      "perPage": 1000,
      "placeholder": "尚未创建任何业务项目哦",
      "columnsCount": 5
    }
  ],
  "id": "u:75d2ff04508e",
  "asideResizor": false,
  "pullRefresh": {
    "disabled": true
  },
  "subTitle": "业务平台聚合，包含所有您有权限的业务平台",
  "initApi": {
    "url": "/system/initPage.html",
    "method": "get",
    "requestAdaptor": "",
    "adaptor": "",
    "messages": {}
  },
  "toolbar": [
    {
      "type": "avatar",
      "showtype": "image",
      "src": "${currentUser.avatar}",
      "fit": "cover",
      "style": {
        "width": 40,
        "height": 40,
        "borderRadius": 20
      },
      "id": "u:a32bb1baab94",
      "gap": 4
    },
    {
      "type": "tpl",
      "tpl": "${currentUser.username}",
      "inline": true,
      "wrapperComponent": "",
      "id": "u:b10236a33925"
    }
  ],
  "regions": [
    "body",
    "toolbar",
    "header"
  ]
};
        let amisScoped = amis.embed('#root', amisJSON,{
            // 这里是初始 props
          },
          // 注意是第四个参数
          {
            theme: 'antd'
          });
      })();
    </script>
</body>
</html>