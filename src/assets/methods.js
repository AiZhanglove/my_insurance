module.exports = {
    RUN_MODE:(function () {
        var RUN_MODE="publish";
        if (/^(dev|localhost|[1-9][0-9]+)/.test(location.hostname)) {	//本地
            RUN_MODE = 'local'
        } else if (/^(staging)/.test(location.hostname)) { //测试
            RUN_MODE = 'test'
        }
        return RUN_MODE;
    })(),
    Ajax: function (json) {
        var self=this;
        var xhr = new XMLHttpRequest();
        var url = json.url;
        if (json.params) {
            var params = '';
            var hook = true;
            for (var m in json.params) {
                params += '&' + m + "=" + json.params[m];
            }
            if (json.url.indexOf('?') == -1) {
                params = "?" + params.substring(1);
            }
            url = url + params;
        }
        xhr.open(json.type || "GET", url);
        var datas = '';
        if (json.type === 'POST' && json.data) {
            if (json.jsonType && json.jsonType === 'json') {
                xhr.setRequestHeader("Content-Type","application/json");
                datas = json.data;
            } else {
                xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                for (var key in json.data) {
                    datas += '&' + key + "=" + json.data[key];
                }
                datas = datas.substring(1);
            }
        }
        xhr.onload = function () {
            if (this.status == 200) {
                json.success(JSON.parse(xhr.response));
            } else if (this.status == 401) {
                if(!window.loginLock){
                    window.loginLock = true;
                    setTimeout(function () {
                        window.loginLock = false;
                    },1000*60);
                    self.login()
                }

            } else {
                json.error && json.error(this.status);
            }
        }
        xhr.send(json.data ? datas : null);
    },
    periodUnit: function (key) {
        var json = {
            "1": "元/小时起",
            "2": "元/日起",
            "3": "元/月起",
            "4": "元/年起"
        }
        if(json[key]){
            return json[key]
        }else{
            return "元/起";
        }
    },
    payPeriodUnit: function (key) {
        var json = {
            "HOURS": "元/小时",
            "DAYS": "元/日",
            "MONTHS": "元/月",
            "YEARS": "元/年",
            "NONE": "元"
        }
        if(json[key]){
            return json[key]
        }else{
            return "元/年";
        }
    },

    showPeriodUnit: function (key) {
        var json = {
            "HOURS": "小时",
            "DAYS": "天",
            "MONTHS": "月",
            "YEARS": "年",
            "NONE": ""
        }
        if(json[key]){
            return json[key]
        }else{
            return "";
        }
    },

    fen2Yuan: function (n, decimal) {
        return (n / 100).toFixed(decimal)
    },
    fen2Wan: function (n, decimal) {
        if (n < 1000000) {
            return (n / 1000000)
        } else {
            return (n / 1000000).toFixed(decimal)
        }
    },
    productStatus: function (status) {
        var json = {
            "1": "购买",
            "2": "已下架",
            "3": "已售罄"
        }
        return json[status]
    },
    payStatusFilter : function (status) {
        var json = {
            //"COMMIT": "支付中",
            "COMMIT": "待支付",
            "PROCESS": "支付中",
            "FAIL": "支付失败",
            "SUCCESS": "支付成功",
            "NO_EXIST":"支付失败"
        }
        return json[status]
    },
    refundStatusFilter : function (status) {
        var json = {
            "COMMIT": "退款中",
            "PROCESS": "退款中",
            "FAIL": "退款失败",
            "SUCCESS": "退款成功",
            "NO_EXIST":"退款失败"
        }
        return json[status]
    },
    statusFilter : function (status) {
        var json = {
            "PROPOSAL": "投保中",
            "PROTECTION": "保障中",
            "FAIL": "失败",
            "EXPIRED": "已失效",
            "COMMIT":"已提交",
            "CHECKED":"已核保",
            "PROPOSALED":"待生效",
            "ISSUED":"待生效",
            "CANCEL":"已退保",
            "WAIT_RENEW":"欠费中"
        }
        return json[status]
    },
    date: function (ymd, his, reg) { //ymd 年月日,his,时分秒,reg 分隔符
        reg = reg || "-";
        if (typeof(ymd) == "boolean") { //
            var date = new Date();
        } else if (typeof(ymd) == "number" || isFinite(ymd)) {
            var date = new Date(parseInt(ymd));
        }
        function addZero(num){
            if(num >= 0 && num < 10){
                num = '0' + parseInt(num);
            }
            return num;
        }
        if (his) { // 有时分秒
            return (date.getFullYear() + reg + addZero(date.getMonth() + 1) + reg + addZero(date.getDate()) + " " + addZero(date.getHours()) + ":" + addZero(date.getMinutes()) + ":" + addZero(date.getSeconds()));
        } else {
            return date.getFullYear() + reg + addZero(date.getMonth() + 1) + reg + addZero(date.getDate());
        }
    },
    startActivity: function (url, title) {
        if(!/http/.test(url)){
            url=this.RUN_MODE==="local" ? this.baseUrl+"/"+url : this.baseUrl+"/insurance/"+url;
        }else{
            if(this.RUN_MODE==="local" && !/staging/.test(url)){
                url=url.replace(/insurance\//g,'');
            }
        }
        //客户端
        if (window.MiFiJsInternal && MiFiJsInternal.startActivity) {
            MiFiJsInternal.startActivity(url, title)
        } else {
            window.location.href = url;
        }
    },
    joinParams: function(params){
        if(!params) return "";
        var arr = [];
        for(var k in params){
            arr.push(k + "=" + params[k])
        }
        return arr.join("&");
    },
    /*如果url是包含路由的,那么你就把router:""或者不写router
     * params = {
     url:"", //url https://api.jr.mi.com/insurance/frame.html
     router:"", // #/detail/123456789
     title:"", //小米大病保
     urlParams:{
     from:"local",
     couponFrom:"local",
     source:""
     }
     }
     * */
    newStartActivity: function (params) {
        var self = this;
        //处理不同环境
        if(!/http/.test(params.url)){
            params.url = self.RUN_MODE==="local" ? self.baseUrl+"/" + params.url : self.baseUrl+"/insurance/" + params.url;
        }else{
            if(this.RUN_MODE==="local"){
                if(/staging/.test(params.url)){
                    params.url = params.url.replace(/http:\/\/staging\.mifi\.pt\.xiaomi\.com\/insurance/,self.baseUrl);
                }
                params.url = params.url.replace(/insurance\//g,'');
            }
        }
        //拼接url
        var fullUrl = params.url + "?" + self.joinParams(params.urlParams) + (params.router || "");
        //判断客户端非客户端
        if (window.MiFiJsInternal && MiFiJsInternal.startActivity) {
            MiFiJsInternal.startActivity(fullUrl, params.title || "" )
        } else {
            window.location.href = fullUrl;
        }
    },
    regex: {
        //mobile: /^0?(13[0-9]|15[012356789]|17[012356789]|18[0123456789]|14[57])[0-9]{8}$/,
        mobile: /^0?(1)[0-9]{10}$/,
        idCard: /(^\d{15}$)|(^\d{17}([0-9]|X))$/i,
        name: /([a-zA-Z]|[\u4e00-\u9fa5]|[0-9])+/,
        trim:/^\s+|\s+$/,
        email:/.+@.+\..+/,
        detailaddress:/(\S|\s){5,32}/,
        zipcode:/^[1-9]\d{5}$/,
        imei:/^86\d{13}$/,
        tel:/\d+[0-9-]+\d+/g
    },
    /*用法
     * methods.datePicker({
     minDate:new Date().getTime() - (3600 * 1000 * 24 * 365 * 60),
     maxDate:new Date().getTime() - (3600 * 1000 * 24 * 365 * 2),
     initDate:new Date("2011/01/01").getTime(),
     callback:function(timestamp){}
     })
     * */
    datePicker: function (json) {
        try{
            MiFiJsInternal.pickDate('datepicker',json.minDate,json.maxDate,json.initDate);
            window.handleMipayCallback=function(callbackId,errorCode,errorDesc,responseData){
                if(callbackId == 'datepicker'){
                    if(errorCode == 0 && responseData &&  JSON.parse(responseData).timestamp){
                        json.callback && json.callback(JSON.parse(responseData).timestamp);
                    }else{
                        console.log(responseData)
                    }
                }
            }
        }catch(ex){
            this.h5DatePicker(json);
        }
    },
    h5DatePicker:function(json){
        var tool = {}
        var reg = /[\u4e00-\u9fa5]+/g;
        var blankLi = '<li></li><li></li>';
        var step = 50;
        tool.renderHTML = function () {
            var tag = '<div id="datepicker"><div id="dateinner"><h3 class="text-center">选择日期</h3><div class="picker-row" id="wrap"><div id="top"></div><div id="btm"></div><div class="picker-grid"><div class="wrapper" id="yearWraper"><div class="scroller"><ol class="list" id="year"><li></li></ol></div></div></div><div class="picker-grid"><div class="wrapper" id="monthWraper"><div class="scroller"><ol class="list" id="month"><li></li></ol></div></div></div><div class="picker-grid"><div class="wrapper" id="dayWraper"><div class="scroller"><ol class="list" id="day"><li></li></ol></div></div></div><br clear="all"></div><div class="picker-group"><button type="button" class="picker-btn" id="cancelBtn">取消</button><button type="button" class="picker-btn" id="okBtn">保存</button></div></div></div>';
            document.body.insertAdjacentHTML('beforeEnd',tag);
        };
        tool.renderYear = function (json) {
            var jsonY = json;
            jsonY.role = "Y";
            jsonY.el = document.getElementById("year");
            tool.initRender(jsonY);
        };
        tool.renderMonth = function (json) {
            var jsonM = json;
            jsonM.role = "M";
            jsonM.el = document.getElementById("month");
            tool.initRender(jsonM);
        }
        tool.renderDate = function (json) {
            var jsonD = json;
            jsonD.role = "D";
            jsonD.el = document.getElementById("day");
            tool.initRender(jsonD);
        }
        tool.initRender = function (json) {
            switch (json.role) {
                case "Y":
                    viewY(json)
                    break;
                case "M":
                    viewM(json)
                    break;
                case "D":
                    viewD(json)
                    break;
            }
            function viewY(json) {
                var str = '';
                var minY = new Date(json.minDate).getFullYear();
                var maxY = new Date(json.maxDate).getFullYear();
                var initY = new Date(json.initDate).getFullYear();
                for (var i = minY; i <= maxY; i++) {
                    if (i == initY) {
                        str += '<li class="red">' + i + '年</li>'
                    } else {
                        str += '<li>' + i + '年</li>'
                    }
                }
                json.el.innerHTML = blankLi + str + blankLi;
            }

            function viewM(json) {
                var defaultSatrt = json.startM || 1;
                var initM = new Date(json.initDate).getMonth() + 1;
                //判断是否是同一年内
                if(new Date(json.maxDate).getFullYear() - new Date(json.initDate).getFullYear() > 0){
                    var cM = 12;
                }else{
                    var cM = new Date(json.maxDate).getMonth() + 1;
                }
                if (json.limitM) {
                    cM = json.limitM;
                }
                var str = '';
                for (var i = defaultSatrt; i <= cM; i++) {
                    if (i < 10) {
                        if (i == initM) {
                            str += '<li class="red">0' + i + '月</li>'
                        } else {
                            str += '<li>0' + i + '月</li>'
                        }
                    } else {
                        if (i == initM) {
                            str += '<li class="red">' + i + '月</li>'
                        } else {
                            str += '<li>' + i + '月</li>'
                        }
                    }
                }
                json.el.innerHTML = blankLi + str + blankLi;
            }

            function viewD(json) {
                var defautDate = json.startD || 1;
                if (json.limitD) {
                    var maxD = json.limitD;
                } else {
                    var maxD = new Date(json.currentYear, json.currentMonth, 0).getDate();
                }
                var initD = new Date(json.initDate).getDate();
                var str = '';
                for (var i = defautDate; i <= maxD; i++) {
                    if (i == initD) {
                        str += '<li class="red">' + i + '日</li>'
                    } else {
                        str += '<li>' + i + '日</li>'
                    }
                }
                json.el.innerHTML = blankLi + str + blankLi;
            }
        }
        tool.getIndex = function (el) {
            var oLi = el.children;
            var len = oLi.length;
            var index = 0;
            for (var i = 0; i < len; i++) {
                if(oLi[i].className == 'red'){
                    index = i;
                }
            }
            return index;
        };
        tool.initScroll = function (json) {
            //取得需要的值
            var maxYear = new Date(json.maxDate).getFullYear();
            var minYear = new Date(json.minDate).getFullYear();
            var maxMonth = new Date(json.minDate).getMonth() + 1;
            var lastMonth =  new Date(json.maxDate).getMonth() + 1;
            var maxDay = new Date(json.maxDate).getDate();
            var minDay = new Date(json.minDate).getDate();
            //渲染年份
            var myScrollY = new iScroll(document.querySelector("#yearWraper"), {
                snap: 'li',
                vScrollbar: false,
                onScrollEnd: function () {
                    var YLi = myScrollY.scroller.children[0].children;
                    var index = (this.y / step) * -1 + 2;
                    for (var i = 0; i < YLi.length; i++) {
                        YLi[i].className = '';
                    }
                    YLi[index].className = "red";
                    var currY = YLi[index].innerHTML.replace(reg, '');
                    var hookJson = json;
                    if (currY == maxYear || currY == minYear) {
                        if(currY == maxYear && currY != minYear){
                            hookJson.limitM = lastMonth;
                            hookJson.startM = 0;
                        }else{
                            hookJson.limitM = 0;
                            hookJson.startM = maxMonth;
                        }
                        hookJson.currentYear = currY;
                        tool.renderMonth(hookJson);
                        myScrollM.refresh();
                        window.indexM = tool.getIndex(document.querySelector("#month")) -2;
                        myScrollM.scrollTo(0, indexM * step * -1);
                    }else{
                        hookJson.startM = 0;
                        hookJson.currentYear = currY;
                        if(hookJson.limitM){
                            hookJson.limitM = 0;
                        }
                        tool.renderMonth(hookJson);
                        myScrollM.refresh();
                        window.indexM = tool.getIndex(document.querySelector("#month")) -2;
                        myScrollM.scrollTo(0, indexM * step * -1);
                    }
                }
            });

            //渲染月份
            var myScrollM = new iScroll(document.querySelector("#monthWraper"), {
                snap: 'li',
                vScrollbar: false,
                onScrollEnd: function () {
                    var MLi = myScrollM.scroller.children[0].children;
                    var index = (this.y / step) * -1 + 2;
                    for (var i = 0; i < MLi.length; i++) {
                        MLi[i].className = '';
                    }
                    MLi[index].className = "red";
                    var currM = MLi[index].innerHTML.replace(reg, '');
                    var maxYe = document.querySelector("#year").querySelector(".red").innerHTML.replace(reg, '');
                    var hookJson = json;
                    if(maxYe == maxYear && maxYe == minYear){ //同一年内
                        if(parseInt(currM) == maxMonth){
                            if(parseInt(currM) == lastMonth){
                                hookJson.limitD = maxDay;
                                hookJson.startD = minDay;
                            }else{
                                hookJson.limitD = 0;
                                hookJson.startD = minDay;
                            }

                        }else if(parseInt(currM) == lastMonth){
                            hookJson.startD = 1;
                            hookJson.limitD = maxDay;
                        }else{
                            hookJson.startD = 1;
                            hookJson.limitD = 0;
                        }
                        hookJson.currentMonth = currM;
                        tool.renderDate(hookJson);
                        myScrollD.refresh();
                        window.indexD = tool.getIndex(document.querySelector("#day")) -2;
                        myScrollD.scrollTo(0, indexD * step * -1);
                    }else if(maxYe == maxYear || maxYe == minYear){
                        if (currM == lastMonth && maxYe == maxYear) {
                            hookJson.limitD = maxDay;
                            hookJson.startD = 0;
                        }else if(currM == maxMonth && maxYe == minYear){
                            hookJson.limitD = 0;
                            hookJson.startD = minDay;
                        }else{
                            hookJson.startD = 0;
                            if(hookJson.limitD){
                                hookJson.limitD = 0;
                            }
                        }
                        hookJson.currentMonth = currM;
                        tool.renderDate(hookJson);
                        myScrollD.refresh();
                        window.indexD = tool.getIndex(document.querySelector("#day")) -2;
                        myScrollD.scrollTo(0, indexD * step * -1);
                    }else{
                        hookJson.limitD = 0;
                        hookJson.startD = 0;
                        hookJson.currentMonth = currM;
                        tool.renderDate(hookJson);
                        myScrollD.refresh();
                        window.indexD = tool.getIndex(document.querySelector("#day")) -2;
                        myScrollD.scrollTo(0, indexD * step * -1);
                    }
                }
            });

            //渲染日期
            var myScrollD = new iScroll(document.querySelector("#dayWraper"), {
                snap: 'li',
                vScrollbar: false,
                onScrollEnd: function () {
                    var DLi = myScrollD.scroller.children[0].children;
                    var index = (this.y / step) * -1 + 2;
                    for (var i = 0; i < DLi.length; i++) {
                        DLi[i].className = '';
                    }
                    DLi[index].className = "red";
                }
            });
            setTimeout(function () {
                myScrollY.scrollTo(0, indexY * step * -1);
                myScrollM.scrollTo(0, indexM * step * -1);
                myScrollD.scrollTo(0, indexD * step * -1);
            },0)
            //点击保存
            document.getElementById("okBtn").onclick = function () {
                var oc = document.getElementById("wrap").querySelectorAll(".red");
                var str = '';
                for (var i = 0; i < oc.length; i++) {
                    str += '/' + oc[i].innerHTML
                }
                json.callback && json.callback(new Date(str.substring(1).replace(reg, '')).getTime() + 3600*1000*2);
                setTimeout(function () {
                    document.getElementById("cancelBtn").click();
                },0)
            };
            //点击取消
            document.getElementById("cancelBtn").onclick = function () {
                document.body.removeChild(document.querySelector("#datepicker"))
            }
        }

        tool.init = function (json) {
            var self = this;
            self.renderHTML();
            setTimeout(function () {
                self.renderYear(json);
                self.renderMonth(json);
                self.renderDate(json);
                window.indexY = tool.getIndex(document.querySelector("#year")) -2;
                window.indexM = tool.getIndex(document.querySelector("#month")) -2;
                window.indexD = tool.getIndex(document.querySelector("#day")) -2;
                setTimeout(function () {
                    self.initScroll(json)
                }, 0);
            },0)
        }
        tool.init(json);
    },

    baseUrl:window.location.protocol + "//" + window.location.host,
    //统一拦截a链接和input
    linkInterceptor:function(){
        var self = this;
        //添加ios的判断
        var isIos = self.getPlatform();
        //监控页面点击
        document.body.addEventListener('click',function(e){
            var target = e.target;
            var startActivity = function(e){
                //如果包含判断的条件将不跳转
                if(target.href && target.href != 'javascript:;' && target.href.indexOf('tel:') == -1 && target.href.indexOf("mifi_download") == -1 && target.className.indexOf("inner-nav") == -1){
                    e.preventDefault();
                    self.startActivity(target.href,target.title || '');
                }else if(isIos == "ios" && target.href.indexOf("mifi_download") != -1){ // ios能直接打开pdf文件Android不能
                    e.preventDefault();
                    self.startActivity(target.href,target.title || '');
                }
            }
            //判断元素
            if(target.tagName == 'A'){
                startActivity(e);
            }else if(target.tagName.toLowerCase() == 'input'){ //这里是处理当input focus的时候表单填写页面的按钮不在fixed
                if(document.activeElement == target){
                    var obj = document.querySelector(".ins-new-fixed");
                    var carObj = document.querySelector(".ins-new-car-default-button .content");
                    if(obj){
                        obj.style.position = "relative";
                    }
                    if(carObj){
                        carObj.style.position = "absolute";
                    }
                    if(document.querySelector("#layout")){
                        document.querySelector("#layout").style.paddingBottom = "0";
                    }
                }
            }else{
                var obj = document.querySelector(".ins-new-fixed");
                var carObj = document.querySelector(".ins-new-car-default-button .content");
                if(obj){
                    setTimeout(function () {
                        if(document.querySelector("#layout")){
                            document.querySelector("#layout").style.paddingBottom = "62px";
                        }
                        obj.style.position = "fixed";
                    },300);
                }
                if(carObj){
                    setTimeout(function () {
                        if(document.querySelector("#layout")){
                            document.querySelector("#layout").style.paddingBottom = "69px";
                        }
                        carObj.style.position = "fixed";
                    },300);
                }
                do {
                    if (target.tagName != 'A') {
                        continue
                    }
                    startActivity(e)
                } while (target = target.parentNode);
            }
        })
    },

    listenKeyboard(){
        document.body.addEventListener('click',function(e){
            var target=e.target;
        })
    },

    getParam: function (name, source, flag) {
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
    },
    getCookie:function(c_name) {
        var c_start,c_end;
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    },
    login:function(){
        var self = this;
        //
        if(window.MiFiJsInternal && !MiFiJsInternal.mock){ //客户端
            if(window.MiFiAccount){ //具有新的api的版本
                if(MiFiAccount.hasLogin()){ //已经登录
                    MiFiAccount.loginService("mifiapi");
                    window.onLoginServiceResult = function(success, sid) {
                        if(success){
                            if(sid == "mifiapi"){
                                window.onLoginServiceResultCallback();
                            }else{
                                window.location.reload();
                            }
                        }else{
                            location.href='/loan/login/?from=local&cb='+encodeURIComponent(location.href)
                        }
                    }
                }else{ //未登录
                    MiFiJsInternal.login();
                    window.onLoginResult = function(success, userId) {
                        if(success){
                            window.onLoginResultCallback();
                        }else{
                            window.onLoginResultFailCallback();
                        }
                    }
                }
            }else{ //以前的api
                window.onLoginResult = function (success, userId) {
                    if(success){
                        window.onLoginResultCallback();
                    }else{
                        window.onLoginResultFailCallback();
                    }
                }
                try{
                    MiFiJsInternal.login();
                }catch (ex){
                    location.href='/loan/login/?from=local&cb='+encodeURIComponent(location.href)
                }
            }
        }else{ //web
            var userId = this.getCookie('userId');
            var cUserId = this.getCookie('cUserId');
            //
            if(userId || cUserId){
                if(cUserId){
                    location.href='/loan/login/?from=local&cUserId='+cUserId+'&cb='+encodeURIComponent(location.href);
                    return false;
                }
                location.href='/loan/login/?from=local&userId='+userId+'&cb='+encodeURIComponent(location.href);
            }else{
                location.href='/loan/login/?from=local&cb='+encodeURIComponent(location.href);
            }
        }
    },
    getPointStamp:function(range){
        var date = new Date();
        var year = date.getFullYear() - range;
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if(month <10){
            month = '0' + month;
        }
        if(day < 10){
            day = '0' + day;
        }
        var str = year + "/" + month + "/" + day;
        return (new Date(str).getTime() + 3600 * 1000 * 24);
    },
    getPlatform:function () {
        var platform = "web";
        if(window.MiFiJsInternal && MiFiJsInternal.getSystemPlatform){
            platform = MiFiJsInternal.getSystemPlatform().toLowerCase();
        }
        return platform;
    },
    getGeoLocation:function(cb){ //返回经纬度用逗号分隔
        if(window.MiFiJsInternal && MiFiJsInternal.getLocationAsString){ //客户端
            cb && cb(MiFiJsInternal.getLocationAsString());
        }else{
            var pos = [];
            if (navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function (position) {
                    pos.push(position.coords.longitude);
                    pos.push(position.coords.latitude);
                    cb && cb(pos.join(","));
                });
            }else{//不支持返回false
                cb && cb(false);
            }
        }
    },
    commonLogin:function(json){
        var self = this;
        if(self.RUN_MODE == "local"){
            json.callback && json.callback();
            return;
        }
        //判断
        if(window.MiFiJsInternal && !MiFiJsInternal.mock){ //客户端
            if(window.MiFiAccount){ //具有新的api的版本
                if(MiFiAccount.hasLogin()){ //已经登录
                    json.callback && json.callback();
                }else{ //未登录
                    MiFiJsInternal.login();
                    window.onLoginResult = function(success, userId) {
                        if(success){
                            json.callback && json.callback();
                        }else{
                            json.callback && json.failCallback();
                        }
                    }
                }
            }else{ //以前的api
                if (!(self.getCookie('userId') || self.getCookie('cUserId'))||!self.getCookie('serviceToken')) {
                    window.onLoginResult = function (success, userId) {
                        if(success){
                            json.callback && json.callback();
                        }else{
                            json.failCallback && json.failCallback();
                        }
                    }
                    try{
                        MiFiJsInternal.login();
                    }catch (ex){
                        location.href='/loan/login/?from=local&cb='+encodeURIComponent(location.href)
                    }
                }else{
                    json.callback && json.callback();
                }
            }
        }else{ // 非客户端web
            if (!(self.getCookie('userId') || self.getCookie('cUserId'))||!self.getCookie('serviceToken')) {
                location.href='/loan/login/?from=local&cb='+encodeURIComponent(location.href)
            }else{
                json.callback && json.callback();
            }
        }
    },
    getGeoLocation:function(cb){ //返回经纬度用逗号分隔
        if(window.MiFiJsInternal && MiFiJsInternal.getLocationAsString){ //客户端
            cb && cb(MiFiJsInternal.getLocationAsString());
        }else{
            var pos = [];
            if (navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function (position) {
                    pos.push(position.coords.longitude);
                    pos.push(position.coords.latitude);
                    cb && cb(pos.join(","));
                });
            }else{//不支持返回false
                cb && cb(false);
            }
        }
    },
    //左上角设置分享
    setMenu:function(cfg){
        var self = this;
        if(window.MiFiJsInternal && MiFiJsInternal.setMenu){
            var config = JSON.stringify({
                "menu": [
                    {
                        "event": "shareEvent",
                        "icon": "mifi.resource://image/ic_menu_share"
                    }
                ]
            });
            MiFiJsInternal.setMenu(config);
            //
            window.onEvent = function(e){
                if(e == "shareEvent"){
                    self.share(cfg);
                }
            }
        }
    },
    share:function(cfg){
        /*
         * cfg={
         *   "text": "狂欢11月，福利来袭，孝心防癌保全额补贴，首月立减100%。孝心不能等，给父母领一份安心的保障~",
         "subject": "【11月大促】首月保费全免",
         "url": "https://api.jr.mi.com",
         "imageUrl": "https://ts.market.mi-img.com/thumbnail/png/q80/Finance/0c78ec4dc647e449910cb4ce0db8fe4bfe294d56e",
         "id":"ins_in_" + productId
         * }
         * */
        if(window.MiFiJsInternal && MiFiJsInternal.share){
            MiFiJsInternal.share(JSON.stringify({
                "text": cfg.text,
                "subject": cfg.subject,
                "url": cfg.url,
                "iconUrl": "android.resource://com.xiaomi.jr/drawable/ic_launcher_mifinance",
                "imageUrl": cfg.imageUrl,
                "weibo": {
                    "text": cfg.text + cfg.url
                },
                "wechat": {
                    "url": cfg.url
                },
                "wechat_timeline": {
                    "imageUrl": cfg.imageUrl
                }
            }));
            /*分享回调
             * sharer参数：可取值是weibo(微博), wechat(微信), wechat_timeline(微信朋友圈)
             code参数：0~成功，1~取消，-1~失败，-2~未知失败
             * */
            window.onShareResult = function (sharer,code) {
                if(code === 0){ //分享成功
                    window.MiFiLoantracker && MiFiLoantracker({
                        pageTitle:  cfg.id + "_" + sharer,
                        productType: "insurance"
                    });
                }else{
                    window.MiFiLoantracker && MiFiLoantracker({
                        pageTitle:  cfg.id + "_" + sharer + "_fail",
                        productType: "insurance"
                    });
                }
            }
            //整体的分享统计
            window.MiFiLoantracker && MiFiLoantracker({
                pageTitle:  cfg.id || "ins_share_all",
                productType: "insurance"
            });
        }
    },
    replaceFrom :function(url){ //新版from透传方法
        var reg = /from=local/i;
        var myfrom = this.getParam("from") || "local";
        url = url.replace(reg,"from="+myfrom);
        return url;
    },
    getCarCompanyName: function (cmyId, productSource) {
        var id = parseInt(cmyId);
        if (this.RUN_MODE==='local' || this.RUN_MODE==='test') { //测试环境
            switch (id){
                case 2:
                    if (productSource == '2') {
                        return '平安';
                    } else {
                        return '众安';
                    }
                case 3:
                    return '安心';
                case 26:
                    return '中华';
                case 1045:
                    return '天安';
                case 1046:
                    return '天平';
                default:
                    return '';
            }
        } else {
            switch (id){
                case 2:
                    if (productSource == '2') {
                        return '平安';
                    } else {
                        return '众安';
                    }
                case 3:
                    return '安心';
                case 26:
                    return '中华';
                case 30:
                    return '天安';
                case 31:
                    return '天平';
                default:
                    return '';
            }
        }
    },
    //设置刷新
    setReload: function (bol,tag) {
        if(window.MiFiJsInternal && MiFiJsInternal.setReload){
            MiFiJsInternal.setReload(bol, tag)
        }
    },
    //设置页面tag
    setPageTag: function (tag) {
        if(window.MiFiJsInternal && MiFiJsInternal.setPageTag){
            MiFiJsInternal.setPageTag(tag)
        }
    },
    //关闭当前页面
    finishCurrentActivity:function(url, param){
        var self = this;
        if(window.MiFiJsInternal && MiFiJsInternal.finishCurrentActivity){
            MiFiJsInternal.finishCurrentActivity();
        }else if(url || param){
            param ? self.newStartActivity(param) : self.startActivity(url);
        }
    },
    //跳转到频道首页
    gotoStartPage: function () {
        var self = this;
        if(window.MiFiJsInternal && MiFiJsInternal.gotoStartPage){
            MiFiJsInternal.gotoStartPage();
        }else{
            if(self.RUN_MODE == "local"){
                location.href='/';
            }else{
                location.href='/insurance/';
            }
        }
    },
    disableGoBack: function (bol) {
        if(window.MiFiJsInternal && MiFiJsInternal.disableGoBack){
            MiFiJsInternal.disableGoBack(bol);
        }
    },
    getDeviceId: function(){
        if(window.MiFiJsInternal && MiFiJsInternal.getDeviceId){
            return MiFiJsInternal.getDeviceId();
        }else{
            return "";
        }
    },
    disableBounce: function(bol){
        if(window.MiFiJsInternal && MiFiJsInternal.disableBounce){
            MiFiJsInternal.disableBounce(bol);
        }
    }
}