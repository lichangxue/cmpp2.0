document.write("<script src=\"../res/js/jquery/jquery-1.7.2.js\"></script>");
document.write("<script src=\"../res/js/jquery/jquery.md5.js\"></script>");
var _clipDataForCopy;
var CLIPBOARDSWFID = "CLIPBOARDSWFID-XUAS";
/*
 *clipBorad.swf内部调用的方法
 */
function getClipData() {
	return window._clipDataForCopy;
}
(function () {
	Ext.ux.PauseResumeUploadField = function (config) {
		if (!Ext.nore(config.regex))
			config.regex = Ext.decode(config.regex);
		Ext.ux.PauseResumeUploadField.superclass.constructor.call(this, config);
	}
	Ext.extend(Ext.ux.PauseResumeUploadField, Ext.form.TextField, {
		/*
		 * UI
		 */
		width : 300,
		name : 'pauseResumeUploadField',
		copyButtonVisible : true,
		viewButtonVisible : true,
		helpButtonVisible : true,
		infoEl : null,
		helpContent : "",
		style : "display:none",
		pbar : null,
		/*
		 * 基础配置
		 */
		// 查询接口
		queryUploadUrl : '../pauseResumeUpload!queryUpload.jhtml',
		// 上传接口
		uploadUrl : '../pauseResumeUpload!uploadFile.jhtml',
		rename : true,
		btnCopyImg : '../res/img/copy.png',
		btnViewImg : '../res/img/image.png',
		// 单位M
		fileMaxSize : 500,
		button_text : '断点续传',
		// Flash Settings
		res_url : "../res/",
		clipBoardSwf_url : "../res/swf/clipBorad-Xuas.swf", //Author:许爱思
		/*
		 * 上传配置
		 */
		// 对应file控件的accept属性；eg.accept="image/*" accept="image/gif, image/jpeg" accept="text/html"
		file_types : "*/*",
		swfUploader : null,
		getHandler : null,
		clipSwfDiv : null,
		fileData : null,
		// 上传状态 需要与文件一一对应否则在一个文件未上传完成时上传另一个文件会导致两个文件同时上传的情况;取"fileName_true/false"的形式，例：1.jpg_true表示正在上传
		isUploding : "",
		initComponent : function () {
			Ext.applyDeep(this, this.initialConfig);
			this.fileMaxSize = this.fileMaxSize * 1024 * 1024;
			Ext.ux.PauseResumeUploadField.superclass.initComponent.call(this);
		},
		onRender : function (ct, position) {
			Ext.ux.PauseResumeUploadField.superclass.onRender.call(this, ct, position);
			var elParent = this.el.parent();
			var btnCtId = this.id + '_btnCt_swf';
			this.el.setStyle({
				"cssFloat" : "left"
			});
			elParent = elParent.createChild({
					tag : 'div',
					style : 'float:inherit;'
				});

			// 进度条
			var pbarId = this.id + '_pbar';
			elParent.createChild({
				tag : 'div',
				html : '<div id="' + pbarId + '"style="width:50%;"></div>'
			});
			this.pbar = new Ext.ProgressBar({
					text : '已上传 0.00%',
					id : 'pbar',
					hidden : false,
					cls : 'custom',
					style : 'float:left;',
					width : this.width,
					height : 10,
					renderTo : pbarId
				});

			// 上传按钮
			this.uploadButtonEl = elParent.createChild({
					tag : 'input',
					type : 'button',
					style : 'min-width:40px',
					cls : 'UploadTool-ct-button',
					value : this.button_text
				});
			this.fileInputEl = elParent.insertHtml('beforeBegin', '<input type="file" style="position: absolute;opacity: 0;cursor: pointer;top: -1000px;left:-1000px;z-index: 100;" size="30" name="fileselect[]" accept="' + this.file_types + '">', true);

			this.fileInputEl.on("change", this.fileUploadHandler, this);
			this.uploadButtonEl.on("click", function () {
				if (!this.checkValid())
					return false;
				this.fileInputEl.dom.click();
			}, this);

			// 暂停/开始按钮
			this.pauseButton = elParent.createChild({
					tag : 'input',
					type : 'button',
					style : 'min-width:40px;display:none;',
					cls : 'UploadTool-ct-button',
					value : '暂停'
				});
			this.pauseButton.on("click", function () {
				if (this.isUploding.indexOf("true") > 0) {
					// 上传中
					this.infoEl.setStyle('color', 'red');
					this.infoEl.update('暂停中...');
					this.pauseButton.dom.setAttribute("value", "开始");
					this.isUploding = this.isUploding.replace("true", "false");
					this.uploadButtonEl.show();
				} else {
					// 暂停中
					this.infoEl.setStyle('color', 'green');
					this.infoEl.update('正在上传...');
					this.isUploding = this.isUploding.replace("false", "true");
					this.queryUpload(this.fileData);
					this.pauseButton.dom.setAttribute("value", "暂停");
				}
			}, this);

			// 预览按钮
			if (this.viewButtonVisible != false) {
				var previewEl = elParent.createChild({
						tag : 'a',
						style : 'margin-left:5px;',
						title : '查看文件',
						href : 'javascript:void(0);',
						html : '<img src="' + this.btnViewImg + '" width="16" height="16"/>'
					});
				previewEl.on('click', function () {
					var url = this.el.dom.value;
					if (url)
						window.open(url);
				}, this);
			}

			//复制链接
			if (this.copyButtonVisible != false) {
				//加载clipBoard.swf
				this.loadClipBoardSwf(16, 16);

				var btnCopy = elParent.createChild({
						tag : 'a',
						title : '复制链接',
						style : 'margin-left:5px;',
						href : 'javascript:void(0);',
						html : '<img src="' + this.btnCopyImg + '" width="16" height="16"/>'
					});
				btnCopy.on('mousedown', function (event, dd) {
					var obj = Ext.fly(event.target);
					window._clipDataForCopy = this.getValue();
					this.clipSwfDiv.position("absolute", 999999999, obj.getLeft(), obj.getTop());
					this.clipSwfDiv.setSize(obj.getWidth(), obj.getHeight());
					this.clipSwfDiv.first().setSize(obj.getWidth(), obj.getHeight());

					this.clipSwfDiv.on('mouseup', function () {
						this.clipSwfDiv.position("absolute", 1, -100, -100);
						this.setCopyInfo();
					}, this, {
						single : true
					});

				}, this);
			}

			//帮助按钮
			if (this.helpContent && this.helpButtonVisible != false) {
				// 显示字数的容器
				btnHelp = elParent.createChild({ 
						tag : 'a',
						style : 'margin-left:5px;',
						href : 'javascript:void(0);',
						html : '<img src="' + this.res_url + 'img/help2.gif" width="16" height="16"/>'
					});
				// 初始化帮助
				new Ext.ToolTip({
					target : btnHelp,
					miniWidth : 150,
					dismissDelay : 60 * 1000,
					title : '使用说明',
					html : this.helpContent
				});
			}

			//提示信息
			this.infoEl = elParent.createChild({
					tag : 'span',
					id : this.id + '_info',
					style : 'visibility:visible;color:green;margin:0 5px;'
				});

			var getHandler = function (handler, _this) {
				var t = _this;
				var h = handler;
				return function () {
					t[h].apply(t, arguments);
				}
			};

			this.getHandler = getHandler;
		},
		/*
		 * 加载复制到剪切板flash
		 */
		loadClipBoardSwf : function (width, height) {
			this.clipSwfDiv = Ext.get(CLIPBOARDSWFID);
			if (!this.clipSwfDiv) {
				this.clipSwfDiv = Ext.getBody().createChild({
						tag : 'div',
						id : CLIPBOARDSWFID,
						style : "position:absolute;left:-100px;top:-100px;z-index:0",
						html : '<embed src="' + this.clipBoardSwf_url + '" name="clipSwf"  pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"  width="' + width + '" height="' + height + '" wmode="transparent" allowScriptAccess="always"></embed>'
					});
			}
			return this.clipSwfDiv;
		},
		setCopyInfo : function () {
			var infoEl = this.infoEl;
			this.infoEl.setStyle('color', 'green');
			this.infoEl.setVisible(true);
			this.infoEl.update('已复制');
			infoEl.fadeOut({
				duration : 1,
				callback : function () {
					infoEl.update('');
				}
			});
		},
		checkValid : function () {
			if (!this.isValid()) {
				alert('输入不合法');
				return false;
			}
			return true;
		},
		/*
		 * 触发上传
		 */
		fileUploadHandler : function (e, obj, opts) {
			// 阻止默认事件
			e.stopPropagation();
			e.preventDefault();

			// 搜集文件
			var files = e.target.files || [];
			if (files.length == 0)
				return;
			var msg = "";
			var flag = true;
			var file = files[0];
			if (files.length > 1) {
				msg = '只能选择一个文件';
			} else if (file.size >= this.fileMaxSize) {
				msg = '文件"' + file.name + '"大小过大(' + (file.size / 1024) + 'k)，应小于' + this.fileMaxSize / 1024 + 'k';
			} else if (file.name.indexOf(' ') != -1) {
				msg = '文件"' + file.name + '"文件名不能包含空格';
			} else {
				flag = false;
			}
			if (flag) {
				Ext.CMPP.warn('提示', msg);
				return flag;
			}
			// 设置上传状态为"正在上传"
			this.isUploding = file.name + "_true";
			this.queryUpload(file);
		},
		// 检查文件上传情况（是否上传过、已上传部分的数据信息）
		queryUpload : function (fileData) {
			var params = this.setParams(fileData, 0);
			this.uploadStart(fileData);
			(function (fileJson) {
				var context = fileJson.context;
				// 把file设置到全局变量，供开始按钮在调用queryUpload方法时使用
				context.fileData = fileJson.file;
				var params = fileJson.params;
				var xhr = new XMLHttpRequest();
				xhr.timeout = 2 * 60 * 1000;
				if (xhr.upload) {
					xhr.ontimeout = context.uploadTimeout.createDelegate(context, [xhr, fileJson], true);
					xhr.upload.onprogress = context.updateProgress.createDelegate(context, [xhr, fileJson], true);
					xhr.onreadystatechange = context.uploadComplete.createDelegate(context, [xhr, fileJson], true);

					var postUrl = context.queryUploadUrl;
					xhr.open("POST", postUrl, true);

					//使用FormData处理需要上传的数据
					var formData = new FormData();
					for (var j in params) {
						formData.append(j, params[j]);
					}
					xhr.send(formData);
				}
			})({
				context : this,
				file : fileData,
				params : params
			});
		},
		uploadFile : function (fileData, start) {
			var params = this.setParams(fileData, start);
			this.uploadStart(fileData);
			(function (fileJson) {
				// 控件属性 this
				var context = fileJson.context;
				// 文件数据
				var file = fileJson.file;
				// 请求参数
				var params = fileJson.params;
				var xhr = new XMLHttpRequest();
				xhr.timeout = 2 * 60 * 1000;
				if (xhr.upload) {
					xhr.ontimeout = context.uploadTimeout.createDelegate(context, [xhr, fileJson], true);
					xhr.upload.onprogress = context.updateProgress.createDelegate(context, [xhr, fileJson], true);
					xhr.onreadystatechange = context.uploadComplete.createDelegate(context, [xhr, fileJson], true);
					var postUrl = context.uploadUrl;
					xhr.open("POST", postUrl, true);
					// lb表示当前上传的数据是否文件的最后一块：true是；false否
					params.lb = file.size > params.start + context.partSize ? false : true;
					// 使用FormData处理需要上传的数据
					var formData = new FormData();
					for (var j in params) {
						formData.append(j, params[j]);
					}
					// file.slice对文件进行分块上传
					formData.append("filedata", file.slice(params.start, params.start + context.partSize));
					xhr.send(formData);
				}
			})({
				context : this,
				file : fileData,
				params : params
			});
		},
		setParams : function (file, start) {
			var fileid;
			var type = "";
			if (this.rename) {
				type = file.name.substring(file.name.lastIndexOf("."));
				var fileMd5 = $.md5(file.name + file.size + file.type + file.lastModified).substring(0, 15); //根据文件的属性计算一个uuid
				fileid = fileMd5;
			} else {
				fileid = file.name;
			}
			return {
				'fileSize' : file.size,
				'filename' : file.name,
				'type' : type,
				'fileid' : fileid,
				'start' : start || 0
			}
		},
		// 准备上传时初始化控件提示信息
		uploadStart : function (fileData) {
			this.pauseButton.dom.setAttribute("value", "暂停");
			this.pauseButton.show();

			this.infoEl.setStyle('color', 'green');
			this.infoEl.setVisible(true);
			this.infoEl.update('正在上传...');

			this.getEl().dom.style.setProperty("display", "none");

			this.uploadButtonEl.setStyle("display", "none")

			if (!this.pbar.isVisible()) {
				this.pbar.show();
				this.pbar.getEl().show();
			}
			// &#160;是空格
			if (this.pbar.text == "&#160;" || this.pbar.text == "")
				this.pbar.updateText("准备上传...");
		},
		updateProgress : function (e, xhr, fileJson) {
			if (e.lengthComputable) {
				var complete = (event.loaded / event.total * 100 | 0);
				console.info(complete);
			}
		},
		uploadTimeout : function (e, xhr, fileJson) {
			this.infoEl.setStyle('color', 'red');
			this.infoEl.update('超时');
		},
		// 上传完成回调
		uploadComplete : function (e, xhr, fileJson) {
			if (xhr.readyState == 4) {
				var result = 0;
				if (xhr.status == 200) {
					var ret = Ext.decode(xhr.responseText);
					if (ret.completed) {
						this.setValue(ret.url.replace(/\\/g, "/").replace(/\/\/\//g, "/"));

						this.pbar.updateProgress(1);
						this.pbar.updateText("已上传 100%");
						this.pbar.getEl().fadeOut();
						this.pbar.updateText("");

						this.getEl().dom.style.setProperty("display", "");

						this.infoEl.setStyle('color', 'green');
						this.infoEl.update('完成上传');
						this.infoEl.fadeOut();

						this.pauseButton.setStyle("display", "none");

						this.uploadButtonEl.show();
					} else {
						// 这里检查上传状态，上传状态由"开始/暂停"按钮控制。
						if (this.isUploding == fileJson.file.name + "_true") {
							if (ret.error != 1 && (ret.length > 0 || ret.isUpload == 0)) {
								var length = ret.length;
								length = (length == 0 && ret.start > 0) ? ret.start : length;
								var progress = length / ret.fileSize;

								this.pbar.updateProgress(progress);
								this.pbar.updateText("已上传 " + (progress * 100).toFixed(2) + "%");

								this.uploadFile(fileJson.file, length);
							} else {
								// 有时会出现文件被占用的情况，需要重新查询已上传文件的位置
								this.queryUpload(fileJson.file);
							}
						}
					}
				} else {
					this.infoEl.setStyle('color', 'red');
					this.infoEl.update('上传过程出错!');
				}
			}
		}
	});
	Ext.reg('pauseresumeuploadfield', Ext.ux.PauseResumeUploadField);
})();
