module.exports = {
	//认证流程
	// idVerify: function() {
	// 	location.href = 'loan.html#/identify/result';
	// },
	//开启activity
	startActivity: function(url,title) {
		location.href = url;
	},
	//关闭所有activity
	finishCurrentActivity: function() {
	},
	//选绑卡
	chooseBankCard: function() {
		location.href = 'loan.html#/loan/capcha';
	},
	//支付收银台
	repay: function() {
		location.href = 'loan.html#/repay/result';
	},
	//设置activity
	setResult: function() {},
	//返回首页
	gotoStartPage: function(url) {
		location.href='/insurance/';
	},
	//大字体放大比例
	getFontScale: function() {},
	//签名
	sign: function() {
		return '{"sign":""}'
	},
	//统计
	recordCountEvent: function() {},
	//获取accesstoken
	getAccessToken: function() {
		return '123'
	},
	//开启app
	launchApp:function(){},
	//开启理财
	visitFund:function(){},
	//获取同盾
	getFraudmetrixBlackbox:function(){},
	//获取版本
	getVersionName:function(){
		return 'web'
	},
	//登录
	login:function(){
		location.href='/loan/login/?from=local&cb='+encodeURIComponent(location.href)
	},
	//人脸识别
	faceVerify:function(){
		location.href = 'loan.html#/identify/result';
	},
	//获取MD5 IMEI
	getDeviceId:function(){
		return ''
	},
	//获取云服务状态
	getMiCloudSyncsStatus:function(){
		return '{"com.android.calendar":{"sync":false,"label":"日历"},"wifi":{"sync":true,"label":"WLAN"},"com.miui.player":{"sync":false,"label":"音乐"},"com.miui.gallery.cloud.provider":{"sync":true,"label":"云相册"},"call_log":{"sync":true,"label":"通话记录"},"antispam":{"sync":false,"label":"骚扰拦截"},"com.miui.browser":{"sync":false,"label":"浏览器"},"__MASTER__":false,"com.android.contacts":{"sync":true,"label":"联系人"},"notes":{"sync":true,"label":"便签"},"records":{"sync":true,"label":"录音机"},"sms":{"sync":true,"label":"短信"}}'
	},
	//打开所有云服务
	setAllMiCloudSyncsOn:function(){},
	//打开云服务分项
	setMiCloudSyncOn:function(){},
	// return
	onReceiveValue:function(){},
	// 处理back键
	requestInterceptBackKeyEvent:function(){},
	//选择联系人
	pickContact:function(){},
	//获取versioncode
	getVersionCode:function(){
		return '100'
	},
	//开关下拉刷新
	disablePullToRefresh:function(){},
	//获取miui大版本
	getMiuiVersionName:function(){
		return 'V6'
	},
	//禁用back页面跳转
	disableGoBack:function(){},
	//字符串转Md5
	getMd5:function(){
		return 'd0005751f72734725ec604222cfcad71'
	},
	//添加日历提醒
	addAllReminders:function(){},
	//删除日历提醒
	removeAllReminders:function(){},
	//拍摄身份证照片
	captureIdcard:function(){},
	//上传身份证照片
	uploadIdcard:function(){},
	//设置页面标签
	setPageTag:function(){},
	//刷新
	setReload:function(){},
	mock:true
}