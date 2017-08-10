import login from './login'
export default function ajax(option) {
    var success = option.success;
    var error = option.error;
    var url = option.url;
    var method = (option.type || 'get').toUpperCase();
    var dataType = option.jsonType || "json";
    var charset = option.charset || "utf-8";
    var data = formatParam(option.data);
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("microsoft.XMLHTTP");
    }
    xhr.onload = function () {
        if (this.status === 200) {
            var json = JSON.parse(xhr.responseText);
            success && success.call(this, json);
        }else if (this.status == 401) {
            if(!window.loginLock){
                window.loginLock = true;
                setTimeout(function () {
                    window.loginLock = false;
                },1000*60);
                login();
            }

        } else {
            error && error.call(this,this.status);
        }
    };

    if (dataType === 'script') {
        loadScript(url, success, charset);
    } else if (dataType === 'jsonp') {
        jsonp(url, success, charset);
    } else {
        sendAjax();
    }

    function sendAjax() {
        if (method === "GET") {
            xhr.open('GET', url + "?" + data, true);
            xhr.send(null);
        } else {
            xhr.open('POST', url, true);
            if(dataType==="json"){
                xhr.setRequestHeader("Content-Type","application/json");
            }else{
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlenoded');
            }
            xhr.send(data);
        }
    }

    function formatParam(param) {
        var json=null;
        if(method==="POST" && dataType==="json"){
            json=param;
        }else{
            json = [];
            for (var key in param) {
                json.push(encodeURIComponent(key) + "=" + encodeURIComponent(param[key]));
            }
            json=json.join('&');
        }
        return json;
    }

    function jsonp(url, callback, charset) {
        var script = document.createElement('script');
        var random = new Date().getTime();
        script.src = url + "?" + data + "&callback=" + random;
        script.charset = charset || "utf-8";
        window[random] = callback;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    function loadScript(url, callback, charset) {
        var script = document.createElement("script");
        script.src = url;
        script.charset = charset || "utf-8";
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    callback && callback();
                }
            }
        } else {
            script.onload = function () {
                callback && callback()
            }
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    }
}

