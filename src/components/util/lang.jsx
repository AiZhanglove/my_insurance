/**
 * 检测数据类型
 * @param type
 * @returns {Function}
 */
function isType(type) {
    return function(obj) {
        return {}.toString.call(obj) == '[object ' + type + ']';
    };
}

const isObject = isType('Object');
const isString = isType('String');
const isArray = Array.isArray || isType('Array');
const isFunction = isType('Function');
const isUndefined = isType('Undefined');
const isNum=function (val) {
    return /^[0-9]+(\.[0-9]+)?$/.test(val);
};
export const DataType={
    isObject,
    isString,
    isArray,
    isFunction,
    isUndefined,
    isNum
};
/**
 * 是否不是false
 * @param val
 * @returns {number}
 */
export function isNotFalse(val) {
    if (isArray(val)) {
        if (val.length) {
            return true;
        } else {
            return false;
        }
    }else if(isObject(val)){
        if(JSON.stringify(val)==='{}'){
            return false;
        }else{
            return true;
        }
    } else if (
        val === null ||
        val === 'null' ||
        val === '' ||
        val === undefined ||
        val === 'undefined' ||
        val === 0 ||
        val === '0' ||
        val === '0.0' ||
        val === '0.00' ||
        val == false
    ) {
        return false;
    }
    return true;
}
export function trim(val) {
    val = val || '';
    return val.replace(/^\s+|\s+$/g, '');
}
export function indexOf(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) return i;
    }
    return -1;
}
export function arrRemove(arr, val) {
    var index = indexOf(arr, val);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
export function extend() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[ 0 ] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    if ( typeof target === "boolean" ) {
        deep = target;

        target = arguments[ i ] || {};
        i++;
    }
    if ( typeof target !== "object" && !isFunction( target ) ) {
        target = {};
    }
    if ( i === length ) {
        return target;
    }
    for ( ; i < length; i++ ) {
        if ( ( options = arguments[ i ] ) != null ) {
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];
                if ( target === copy ) {
                    continue;
                }
                if ( deep && copy && ( isObject( copy ) ||
                    ( copyIsArray = isArray( copy ) ) ) ) {
                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && isArray( src ) ? src : [];
                    } else {
                        clone = src && isObject( src ) ? src : {};
                    }
                    target[ name ] = extend( deep, clone, copy );
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }
    return target;
}
export function getCookie(c_name) {
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
}
export function getParam(name, source, flag) {
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
}
export function getPlatform() {
    var platform = "web";
    if(window.MiFiJsInternal && MiFiJsInternal.getSystemPlatform){
        platform = MiFiJsInternal.getSystemPlatform().toLowerCase();
    }
    return platform.toUpperCase();
}
export function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

/********************
 * 取窗口可视范围的高度
 *******************/
export function getClientHeight() {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
        var clientHeight =
            document.body.clientHeight < document.documentElement.clientHeight
                ? document.body.clientHeight
                : document.documentElement.clientHeight;
    } else {
        var clientHeight =
            document.body.clientHeight > document.documentElement.clientHeight
                ? document.body.clientHeight
                : document.documentElement.clientHeight;
    }
    return clientHeight;
}

/********************
 * 取文档内容实际高度
 *******************/
export function getScrollHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
    );
}
