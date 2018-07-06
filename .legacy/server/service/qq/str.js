module.exports  = function() {
    var htmlDecodeDict = {
        quot: '"',
        lt: "<",
        gt: ">",
        amp: "&",
        nbsp: " ",
        "#34": '"',
        "#60": "<",
        "#62": ">",
        "#38": "&",
        "#160": " "
    }, htmlEncodeDict = {
        '"': "#34",
        "<": "#60",
        ">": "#62",
        "&": "#38",
        " ": "#160"
    };
    return {
        decodeHtml: function(t) {
            return t += "",
                t.replace(/&(quot|lt|gt|amp|nbsp);/gi, function(t, e) {
                    return htmlDecodeDict[e]
                }).replace(/&#u([a-f\d]{4});/gi, function(t, e) {
                    return String.fromCharCode(parseInt("0x" + e))
                }).replace(/&#(\d+);/gi, function(t, e) {
                    return String.fromCharCode(+e)
                })
        },
        encodeHtml: function(t) {
            return t += "",
                t.replace(/["<>& ]/g, function(t) {
                    return "&" + htmlEncodeDict[t] + ";"
                })
        },
        trim: function(t) {
            t += "";
            for (var t = t.replace(/^\s+/, ""), e = /\s/, i = t.length; e.test(t.charAt(--i)); )
                ;
            return t.slice(0, i + 1)
        },
        uin2hex: function(str) {
            var maxLength = 16;
            str = parseInt(str);
            for (var hex = str.toString(16), len = hex.length, i = len; maxLength > i; i++)
                hex = "0" + hex;
            for (var arr = [], j = 0; maxLength > j; j += 2)
                arr.push("\\x" + hex.substr(j, 2));
            var result = arr.join("");
            return eval('result="' + result + '"'),
                result
        },
        bin2String: function(t) {
            for (var e = [], i = 0, o = t.length; o > i; i++) {
                var n = t.charCodeAt(i).toString(16);
                1 == n.length && (n = "0" + n),
                    e.push(n)
            }
            return e = "0x" + e.join(""),
                e = parseInt(e, 16)
        },
        str2bin: function(str) {
            for (var arr = [], i = 0; i < str.length; i += 2)
                arr.push(eval("'\\x" + str.charAt(i) + str.charAt(i + 1) + "'"));
            return arr.join("")
        },
        utf8ToUincode: function(t) {
            var e = "";
            try {
                var o = t.length
                    , n = [];
                for (i = 0; i < o; i += 2)
                    n.push("%" + t.substr(i, 2));
                e = decodeURIComponent(n.join("")),
                    e = $.str.decodeHtml(e)
            } catch (r) {
                e = ""
            }
            return e
        },
        json2str: function(t) {
            var e = "";
            if ("undefined" != typeof JSON)
                e = JSON.stringify(t);
            else {
                var i = [];
                for (var o in t)
                    i.push('"' + o + '":"' + t[o] + '"');
                e = "{" + i.join(",") + "}"
            }
            return e
        },
        time33: function(t) {
            for (var e = 0, i = 0, o = t.length; o > i; i++)
                e = (33 * e + t.charCodeAt(i)) % 4294967296;
            return e
        }
    }
}();
