const WY = require('./core.js');

function enc(obj){
    var bua = asrsea(JSON.stringify(obj), iterate(["流泪", "强"]), iterate(WY.Ka.md), iterate(["爱心", "女孩", "惊恐", "大笑"])),
        ret = {
            params: bua.encText,
            encSecKey: bua.encSecKey
        };
    return ret;
}

function asrsea(userInfo, argument1, argument2, argument3){
    var h = {},
        i = a(16);
    return h.encText = b(userInfo, argument3), h.encText = b(h.encText, i), h.encSecKey = c(i, argument1, argument2), h
}

function iterate(bOP) {
    var bp = [];
    bOP.forEach(function(bOO){
        bp.push(WY.Ka.emj[bOO])
    });
    return bp.join("")
}

function a(a) {
    var d, e, b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", c = "";
    for (d = 0; a > d; d += 1)
        e = Math.random() * b.length,
        e = Math.floor(e),
        c += b.charAt(e);
    return c
}

function b(a, b) {
    var c = WY.CryptoJS.enc.Utf8.parse(b)
      , d = WY.CryptoJS.enc.Utf8.parse("0102030405060708")
      , e = WY.CryptoJS.enc.Utf8.parse(a)
      , f = WY.CryptoJS.AES.encrypt(e, c, {
        iv: d,
        mode: WY.CryptoJS.mode.CBC
    });
    return f.toString()
}

function c(a, b, c) {
    var d, e;
    return WY.setMaxDigits(131),
    d = new WY.RSAKeyPair(b,"",c),
    e = WY.encryptedString(d, a)
}

module.exports = enc;
