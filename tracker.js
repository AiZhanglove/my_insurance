function MiFiLoantracker(cfg){
    var link='';
    var getDeviceInfo = {};
    var getParam=function (name, source, flag) {
        var sPageURL = window.location.search.substring(1);
        if (!!flag) {
            sPageURL = source;
        }
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == name) {
                return sParameterName[1];
            }
        }
    };
    try{
        getDeviceInfo = JSON.parse(MiFiJsInternal.getDeviceInfo());
    }catch(e){}
    getDeviceInfo.productType =cfg.productType||'loan';
    getDeviceInfo.t = new Date().getTime();
    getDeviceInfo.from=getParam('from')||'local';
    getDeviceInfo.source=getParam('source')||'index';
    for(var k in cfg){
        if(k == "pageTitle"){
            getDeviceInfo[k] = encodeURIComponent(cfg[k]);
        }else{
            getDeviceInfo[k] = cfg[k];
        }
    }

    try{
        if (MiFiJsInternal && MiFiJsInternal.recordCountEvent) {
            link = location.href.replace(location.search,'');
            MiFiJsInternal.recordCountEvent(cfg.pageTitle,link);
        }
        if(MiFiJsInternal && MiFiJsInternal.recordEvent){
            link = location.href.replace(location.search,'');
            MiFiJsInternal.recordEvent(cfg.pageTitle,link,JSON.stringify(getDeviceInfo));
        }
    }catch(ex){}

    var Img = new Image();
    var url = location.protocol+ "//" +window.location.host + "/images/stat2.gif";
    Img.src = url + "?data=" + JSON.stringify(getDeviceInfo);
}
//监控整个前端错误日志
window.onerror = function(msg,url,line,col,error){
    //没有URL不上报！上报也不知道错误
    if (msg != "Script error." && !url){
        return true;
    }
    setTimeout(function(){
        var data = {};
        //不一定所有浏览器都支持col参数
        col = col || (window.event && window.event.errorCharacter) || 0;
        data.url = url;
        data.line = line;
        data.col = col;
        if (!!error && !!error.stack){
            //如果浏览器有堆栈信息
            //直接使用
            data.msg = error.stack.toString();
        }else if (!!arguments.callee){
            //尝试通过callee拿堆栈信息
            var ext = [];
            var f = arguments.callee.caller, c = 3;
            //这里只拿三层堆栈信息
            while (f && (--c>0)) {
                ext.push(f.toString());
                if (f  === f.caller) {
                    break;//如果有环
                }
                f = f.caller;
            }
            ext = ext.join(",");
            data.msg = ext;
        }
        MiFiLoantracker({
            pageTitle: "web端错误统计",
            errorLog: data.msg + "_" + data.url + "_" + data.line,
            productType: "insurance"
        })
    },0);
    //return true;
};