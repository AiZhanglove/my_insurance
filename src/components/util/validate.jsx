import {trim} from './lang'
export default {
    tip: {
        require:"内容不能为空",
        licensePlateNum:"车牌号格式不正确，请重新输入",
        number: "必须为数字",
        chinese: "必须为中文",
        tel: "手机号码格式不对",
        email: "邮箱格式不对",
        IDcard: "身份证号格式不对",
        date:"日期不对,例：2000-06-21"
    },
    reg: {
        require:/^\s+$/g,
        licensePlateNum:/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/g,
        number: /^[0-9]+.?[0-9]*$/,
        chinese: /^[\u4E00-\u9FA5]+$/,
        tel: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
        email: /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-zd]{2,5}$/,
        IDcard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        date:/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/,
        Wi: [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ],
        ValideCode: [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]
    },
    submit_check: function (el) {
        var self = this;
        self.success = true;
        document.querySelectorAll(el).map((item)=>{
            var rules=item.getAttribute('data-validate_rule');
            if(rules!="" && rules!=undefined){
                self.check(item, rules);
            }
        });
        return this.success;
    },
    reg_check: function (val, rule) {
        val = trim(val);
        if (!this.reg[rule].test(val)) {
            return false;
        }
        return true;
    },
    /**
     * 正则验证
     * @param el
     * @param rules 验证规则
     * @returns {boolean}
     */
    check: function (val, rules) {
        var reg={check:true};
        rules=rules.split(/\s/);
        for (var i = 0, len = rules.length; i < len; i++) {
            var rule = rules[i];
            if(!this.reg_check(val, rule)){
                var tip=this.tip[rule];
                reg={
                    check:false,
                    tip:tip
                };
                return reg;
            }
        }
        return reg;
    },
    /**
     * 验证是否为空
     * @param el
     * @returns {boolean}
     */
    require: function (val) {
        val = trim(val);
        if (val === "" || val===undefined) {
            return false;
        }
        else {
            return true;
        }
    },
    /**
     * 身份证验证
     * @param el
     * @returns {*}
     * @constructor
     */
    IDCard: function (val) {
        var self = this;
        var idCard = trim(val);
        if (idCard.length == 15) {
            return self.isValidityBrithBy15IdCard(idCard);
        } else if (idCard.length == 18) {
            var a_idCard = idCard.split("");
            if (self.isValidityBrithBy18IdCard(idCard) && self.isTrueValidateCodeBy18IdCard(a_idCard)) {
                return true;
            } else {
                this.success = false;
                return false;
            }
        } else {
            this.success = false;
            return false;
        }
    },
    /**
     * 判断身份证号码为18位时最后的验证位是否正确
     * @param a_idCard 身份证号码数组
     * @return
     */
    isTrueValidateCodeBy18IdCard: function (a_idCard) {
        var self = this;
        var sum = 0;
        if (a_idCard[17].toLowerCase() == 'x') {
            a_idCard[17] = 10;
        }
        for (var i = 0; i < 17; i++) {
            sum += self.reg.Wi[i] * a_idCard[i];
        }
        var valCodePosition = sum % 11;
        if (a_idCard[17] == self.reg.ValideCode[valCodePosition]) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 验证18位数身份证号码中的生日是否是有效生日
     * @param idCard 18位书身份证字符串
     * @return
     */
    isValidityBrithBy18IdCard: function (idCard18) {
        var year = idCard18.substring(6, 10);
        var month = idCard18.substring(10, 12);
        var day = idCard18.substring(12, 14);
        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        // 这里用getFullYear()获取年份，避免千年虫问题
        if (temp_date.getFullYear() != parseFloat(year)
            || temp_date.getMonth() != parseFloat(month) - 1
            || temp_date.getDate() != parseFloat(day)) {
            return false;
        } else {
            return true;
        }
    }, /**
     * 验证15位数身份证号码中的生日是否是有效生日
     * @param idCard15 15位书身份证字符串
     * @return
     */
    isValidityBrithBy15IdCard: function (idCard15) {
        var year = idCard15.substring(6, 8);
        var month = idCard15.substring(8, 10);
        var day = idCard15.substring(10, 12);
        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
        if (temp_date.getYear() != parseFloat(year)
            || temp_date.getMonth() != parseFloat(month) - 1
            || temp_date.getDate() != parseFloat(day)) {
            return false;
        } else {
            return true;
        }
    }
}