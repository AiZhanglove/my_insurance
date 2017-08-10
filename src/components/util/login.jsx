import {getCookie} from './lang'
export default function login() {
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
        var userId = getCookie('userId');
        var cUserId = getCookie('cUserId');
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
}