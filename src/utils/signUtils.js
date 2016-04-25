var sha1 = require("crypto-js/sha1");
var base64 = require("crypto-js/enc-base64");
var signUtils = function(params, security) {
    var info = [];
    for (var key in params) {
        if (key != "sign" && params[key] != "" && params[key] != null) {
            info.push(key + "=" + params[key]);
        }
    }
    //按key的字母顺序排序
        var needSignedStr = info.sort(function(a, b) {
        var key1 = a.split("=")[0];
        var key2 = b.split("=")[0];
        return a < b ? -1 : 1;
    }).join("&") + security;
    //console.log(needSignedStr);
    return base64.stringify(sha1(needSignedStr));
};
module.exports = signUtils;