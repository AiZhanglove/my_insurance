import {extend} from './lang'
function Cache(config) {
    this.store = window.localStorage;
    this.config = extend(this._config, config || {});
}

Cache.prototype = {
    _config: {
        prefix: 'mifi_ins' //金融保险
    },
    serialize: function (item) {
        return item === Object(item) ? JSON.stringify(item) : item;
    },
    unserialize: function (data) {
        return data ? JSON.parse(data) : null;
    },
    _key: function (key) {
        return this.config.prefix + '_' + key;
    },
    get: function (key) {
        var data = this.unserialize(this.store.getItem(this._key(key)));
        if (data === null) return null;
        return data;
    },
    set: function (key, val) {
        this.store.setItem(this._key(key), this.serialize(val))
    },
    remove: function (key) {
        this.store.removeItem(this._key(key))
    },
    clear: function () {
        var keys=[], i, j;
        for (i = 0, j = this.store.length; i < j; i++) {
            keys.push( this.store.key(i) )
        }
        for(i=0,j=keys.length;i<j;i++){
            keys[i] && keys[i].indexOf(this.config.prefix) === 0 && this.store.removeItem(keys[i]);
        }
    }
};
export default Cache;