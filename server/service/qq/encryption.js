const str = require('./str.js');

var Encryption = function(){
    var hexcase = 1,
        b64pad = "",
        chrsz = 8,
        mode = 32;

    var TEA = (function(){
        function e() {
            return Math.round(4294967295 * Math.random())
        }
        function i(t, e, i) {
            (!i || i > 4) && (i = 4);
            for (var o = 0, n = e; e + i > n; n++)
                o <<= 8,
                    o |= t[n];
            return (4294967295 & o) >>> 0
        }
        function o(t, e, i) {
            t[e + 3] = i >> 0 & 255,
                t[e + 2] = i >> 8 & 255,
                t[e + 1] = i >> 16 & 255,
                t[e + 0] = i >> 24 & 255
        }
        function n(t) {
            if (!t)
                return "";
            for (var e = "", i = 0; i < t.length; i++) {
                var o = Number(t[i]).toString(16);
                1 == o.length && (o = "0" + o),
                    e += o
            }
            return e
        }
        function r(t) {
            for (var e = "", i = 0; i < t.length; i += 2)
                e += String.fromCharCode(parseInt(t.substr(i, 2), 16));
            return e
        }
        function a(t, e) {
            if (!t)
                return "";
            e && (t = s(t));
            for (var i = [], o = 0; o < t.length; o++)
                i[o] = t.charCodeAt(o);
            return n(i)
        }
        function s(t) {
            var e, i, o = [], n = t.length;
            for (e = 0; n > e; e++)
                i = t.charCodeAt(e),
                    i > 0 && 127 >= i ? o.push(t.charAt(e)) : i >= 128 && 2047 >= i ? o.push(String.fromCharCode(192 | i >> 6 & 31), String.fromCharCode(128 | 63 & i)) : i >= 2048 && 65535 >= i && o.push(String.fromCharCode(224 | i >> 12 & 15), String.fromCharCode(128 | i >> 6 & 63), String.fromCharCode(128 | 63 & i));
            return o.join("")
        }
        function p(t) {
            _ = new Array(8),
                v = new Array(8),
                w = $ = 0,
                k = !0,
                f = 0;
            var i = t.length
                , o = 0;
            f = (i + 10) % 8,
            0 != f && (f = 8 - f),
                y = new Array(i + f + 10),
                _[0] = 255 & (248 & e() | f);
            for (var n = 1; f >= n; n++)
                _[n] = 255 & e();
            f++;
            for (var n = 0; 8 > n; n++)
                v[n] = 0;
            for (o = 1; 2 >= o; )
                8 > f && (_[f++] = 255 & e(),
                    o++),
                8 == f && l();
            for (var n = 0; i > 0; )
                8 > f && (_[f++] = t[n++],
                    i--),
                8 == f && l();
            for (o = 1; 7 >= o; )
                8 > f && (_[f++] = 0,
                    o++),
                8 == f && l();
            return y
        }
        function c(t) {
            var e = 0
                , i = new Array(8)
                , o = t.length;
            if (b = t,
                o % 8 != 0 || 16 > o)
                return null ;
            if (v = g(t),
                    f = 7 & v[0],
                    e = o - f - 10,
                0 > e)
                return null ;
            for (var n = 0; n < i.length; n++)
                i[n] = 0;
            y = new Array(e),
                $ = 0,
                w = 8,
                f++;
            for (var r = 1; 2 >= r; )
                if (8 > f && (f++,
                        r++),
                    8 == f && (i = t,
                        !d()))
                    return null ;
            for (var n = 0; 0 != e; )
                if (8 > f && (y[n] = 255 & (i[$ + f] ^ v[f]),
                        n++,
                        e--,
                        f++),
                    8 == f && (i = t,
                        $ = w - 8,
                        !d()))
                    return null ;
            for (r = 1; 8 > r; r++) {
                if (8 > f) {
                    if (0 != (i[$ + f] ^ v[f]))
                        return null ;
                    f++
                }
                if (8 == f && (i = t,
                        $ = w,
                        !d()))
                    return null
            }
            return y
        }
        function l() {
            for (var t = 0; 8 > t; t++)
                _[t] ^= k ? v[t] : y[$ + t];
            for (var e = u(_), t = 0; 8 > t; t++)
                y[w + t] = e[t] ^ v[t],
                    v[t] = _[t];
            $ = w,
                w += 8,
                f = 0,
                k = !1
        }
        function u(t) {
            for (var e = 16, n = i(t, 0, 4), r = i(t, 4, 4), a = i(m, 0, 4), s = i(m, 4, 4), p = i(m, 8, 4), c = i(m, 12, 4), l = 0, u = 2654435769; e-- > 0; )
                l += u,
                    l = (4294967295 & l) >>> 0,
                    n += (r << 4) + a ^ r + l ^ (r >>> 5) + s,
                    n = (4294967295 & n) >>> 0,
                    r += (n << 4) + p ^ n + l ^ (n >>> 5) + c,
                    r = (4294967295 & r) >>> 0;
            var g = new Array(8);
            return o(g, 0, n),
                o(g, 4, r),
                g
        }
        function g(t) {
            for (var e = 16, n = i(t, 0, 4), r = i(t, 4, 4), a = i(m, 0, 4), s = i(m, 4, 4), p = i(m, 8, 4), c = i(m, 12, 4), l = 3816266640, u = 2654435769; e-- > 0; )
                r -= (n << 4) + p ^ n + l ^ (n >>> 5) + c,
                    r = (4294967295 & r) >>> 0,
                    n -= (r << 4) + a ^ r + l ^ (r >>> 5) + s,
                    n = (4294967295 & n) >>> 0,
                    l -= u,
                    l = (4294967295 & l) >>> 0;
            var g = new Array(8);
            return o(g, 0, n),
                o(g, 4, r),
                g
        }
        function d() {
            for (var t = (b.length,
                0); 8 > t; t++)
                v[t] ^= b[w + t];
            return v = g(v),
                w += 8,
                f = 0,
                !0
        }
        function h(t, e) {
            var i = [];
            if (e)
                for (var o = 0; o < t.length; o++)
                    i[o] = 255 & t.charCodeAt(o);
            else
                for (var n = 0, o = 0; o < t.length; o += 2)
                    i[n++] = parseInt(t.substr(o, 2), 16);
            return i
        }
        var m = ""
            , f = 0
            , _ = []
            , v = []
            , w = 0
            , $ = 0
            , y = []
            , b = []
            , k = !0;

        return {
            encrypt: function(t, e) {
                var i = h(t, e)
                    , o = p(i);
                return n(o)
            },
            enAsBase64: function(t, e) {
                for (var i = h(t, e), o = p(i), n = "", r = 0; r < o.length; r++)
                    n += String.fromCharCode(o[r]);
                return btoa(n)
            },
            decrypt: function(t) {
                var e = h(t, !1)
                    , i = c(e);
                return n(i)
            },
            initkey: function(t, e) {
                m = h(t, e)
            },
            bytesToStr: r,
            strToBytes: a,
            bytesInStr: n,
            dataFromStr: h
        }
    })();

    var RSA = (function(){

        function t(t, e) {
            return new a(t,e)
        }
        function e(t, e) {
            if (e < t.length + 11)
                return null ;
            for (var i = new Array, o = t.length - 1; o >= 0 && e > 0; ) {
                var n = t.charCodeAt(o--);
                i[--e] = n
            }
            i[--e] = 0;
            for (var r = new Y, s = new Array; e > 2; ) {
                for (s[0] = 0; 0 == s[0]; )
                    r.nextBytes(s);
                i[--e] = s[0]
            }
            return i[--e] = 2,
                i[--e] = 0,
                new a(i)
        }
        function i() {
            this.n = null ,
                this.e = 0,
                this.d = null ,
                this.p = null ,
                this.q = null ,
                this.dmp1 = null ,
                this.dmq1 = null ,
                this.coeff = null
        }
        function o(e, i) {
            null  != e && null  != i && e.length > 0 && i.length > 0 ? (this.n = t(e, 16),
                this.e = parseInt(i, 16)) : console.log("Invalid RSA public key")
        }
        function n(t) {
            return t.modPowInt(this.e, this.n)
        }
        function r(t) {
            var i = e(t, this.n.bitLength() + 7 >> 3);
            if (null  == i)
                return null ;
            var o = this.doPublic(i);
            if (null  == o)
                return null ;
            var n = o.toString(16);
            return 0 == (1 & n.length) ? n : "0" + n
        }
        function a(t, e, i) {
            null  != t && ("number" == typeof t ? this.fromNumber(t, e, i) : null  == e && "string" != typeof t ? this.fromString(t, 256) : this.fromString(t, e))
        }
        function s() {
            return new a(null )
        }
        function p(t, e, i, o, n, r) {
            for (; --r >= 0; ) {
                var a = e * this[t++] + i[o] + n;
                n = Math.floor(a / 67108864),
                    i[o++] = 67108863 & a
            }
            return n
        }
        function c(t, e, i, o, n, r) {
            for (var a = 32767 & e, s = e >> 15; --r >= 0; ) {
                var p = 32767 & this[t]
                    , c = this[t++] >> 15
                    , l = s * p + c * a;
                p = a * p + ((32767 & l) << 15) + i[o] + (1073741823 & n),
                    n = (p >>> 30) + (l >>> 15) + s * c + (n >>> 30),
                    i[o++] = 1073741823 & p
            }
            return n
        }
        function l(t, e, i, o, n, r) {
            for (var a = 16383 & e, s = e >> 14; --r >= 0; ) {
                var p = 16383 & this[t]
                    , c = this[t++] >> 14
                    , l = s * p + c * a;
                p = a * p + ((16383 & l) << 14) + i[o] + n,
                    n = (p >> 28) + (l >> 14) + s * c,
                    i[o++] = 268435455 & p
            }
            return n
        }
        function u(t) {
            return ut.charAt(t)
        }
        function g(t, e) {
            var i = gt[t.charCodeAt(e)];
            return null  == i ? -1 : i
        }
        function d(t) {
            for (var e = this.t - 1; e >= 0; --e)
                t[e] = this[e];
            t.t = this.t,
                t.s = this.s
        }
        function h(t) {
            this.t = 1,
                this.s = 0 > t ? -1 : 0,
                t > 0 ? this[0] = t : -1 > t ? this[0] = t + DV : this.t = 0
        }
        function m(t) {
            var e = s();
            return e.fromInt(t),
                e
        }
        function f(t, e) {
            var i;
            if (16 == e)
                i = 4;
            else if (8 == e)
                i = 3;
            else if (256 == e)
                i = 8;
            else if (2 == e)
                i = 1;
            else if (32 == e)
                i = 5;
            else {
                if (4 != e)
                    return void this.fromRadix(t, e);
                i = 2
            }
            this.t = 0,
                this.s = 0;
            for (var o = t.length, n = !1, r = 0; --o >= 0; ) {
                var s = 8 == i ? 255 & t[o] : g(t, o);
                0 > s ? "-" == t.charAt(o) && (n = !0) : (n = !1,
                    0 == r ? this[this.t++] = s : r + i > this.DB ? (this[this.t - 1] |= (s & (1 << this.DB - r) - 1) << r,
                        this[this.t++] = s >> this.DB - r) : this[this.t - 1] |= s << r,
                    r += i,
                r >= this.DB && (r -= this.DB))
            }
            8 == i && 0 != (128 & t[0]) && (this.s = -1,
            r > 0 && (this[this.t - 1] |= (1 << this.DB - r) - 1 << r)),
                this.clamp(),
            n && a.ZERO.subTo(this, this)
        }
        function _() {
            for (var t = this.s & this.DM; this.t > 0 && this[this.t - 1] == t; )
                --this.t
        }
        function v(t) {
            if (this.s < 0)
                return "-" + this.negate().toString(t);
            var e;
            if (16 == t)
                e = 4;
            else if (8 == t)
                e = 3;
            else if (2 == t)
                e = 1;
            else if (32 == t)
                e = 5;
            else {
                if (4 != t)
                    return this.toRadix(t);
                e = 2
            }
            var i, o = (1 << e) - 1, n = !1, r = "", a = this.t, s = this.DB - a * this.DB % e;
            if (a-- > 0)
                for (s < this.DB && (i = this[a] >> s) > 0 && (n = !0,
                    r = u(i)); a >= 0; )
                    e > s ? (i = (this[a] & (1 << s) - 1) << e - s,
                        i |= this[--a] >> (s += this.DB - e)) : (i = this[a] >> (s -= e) & o,
                    0 >= s && (s += this.DB,
                        --a)),
                    i > 0 && (n = !0),
                    n && (r += u(i));
            return n ? r : "0"
        }
        function w() {
            var t = s();
            return a.ZERO.subTo(this, t),
                t
        }
        function $() {
            return this.s < 0 ? this.negate() : this
        }
        function y(t) {
            var e = this.s - t.s;
            if (0 != e)
                return e;
            var i = this.t;
            if (e = i - t.t,
                0 != e)
                return e;
            for (; --i >= 0; )
                if (0 != (e = this[i] - t[i]))
                    return e;
            return 0
        }
        function b(t) {
            var e, i = 1;
            return 0 != (e = t >>> 16) && (t = e,
                i += 16),
            0 != (e = t >> 8) && (t = e,
                i += 8),
            0 != (e = t >> 4) && (t = e,
                i += 4),
            0 != (e = t >> 2) && (t = e,
                i += 2),
            0 != (e = t >> 1) && (t = e,
                i += 1),
                i
        }
        function k() {
            return this.t <= 0 ? 0 : this.DB * (this.t - 1) + b(this[this.t - 1] ^ this.s & this.DM)
        }
        function q(t, e) {
            var i;
            for (i = this.t - 1; i >= 0; --i)
                e[i + t] = this[i];
            for (i = t - 1; i >= 0; --i)
                e[i] = 0;
            e.t = this.t + t,
                e.s = this.s
        }
        function T(t, e) {
            for (var i = t; i < this.t; ++i)
                e[i - t] = this[i];
            e.t = Math.max(this.t - t, 0),
                e.s = this.s
        }
        function x(t, e) {
            var i, o = t % this.DB, n = this.DB - o, r = (1 << n) - 1, a = Math.floor(t / this.DB), s = this.s << o & this.DM;
            for (i = this.t - 1; i >= 0; --i)
                e[i + a + 1] = this[i] >> n | s,
                    s = (this[i] & r) << o;
            for (i = a - 1; i >= 0; --i)
                e[i] = 0;
            e[a] = s,
                e.t = this.t + a + 1,
                e.s = this.s,
                e.clamp()
        }
        function C(t, e) {
            e.s = this.s;
            var i = Math.floor(t / this.DB);
            if (i >= this.t)
                return void (e.t = 0);
            var o = t % this.DB
                , n = this.DB - o
                , r = (1 << o) - 1;
            e[0] = this[i] >> o;
            for (var a = i + 1; a < this.t; ++a)
                e[a - i - 1] |= (this[a] & r) << n,
                    e[a - i] = this[a] >> o;
            o > 0 && (e[this.t - i - 1] |= (this.s & r) << n),
                e.t = this.t - i,
                e.clamp()
        }
        function S(t, e) {
            for (var i = 0, o = 0, n = Math.min(t.t, this.t); n > i; )
                o += this[i] - t[i],
                    e[i++] = o & this.DM,
                    o >>= this.DB;
            if (t.t < this.t) {
                for (o -= t.s; i < this.t; )
                    o += this[i],
                        e[i++] = o & this.DM,
                        o >>= this.DB;
                o += this.s
            } else {
                for (o += this.s; i < t.t; )
                    o -= t[i],
                        e[i++] = o & this.DM,
                        o >>= this.DB;
                o -= t.s
            }
            e.s = 0 > o ? -1 : 0,
                -1 > o ? e[i++] = this.DV + o : o > 0 && (e[i++] = o),
                e.t = i,
                e.clamp()
        }
        function A(t, e) {
            var i = this.abs()
                , o = t.abs()
                , n = i.t;
            for (e.t = n + o.t; --n >= 0; )
                e[n] = 0;
            for (n = 0; n < o.t; ++n)
                e[n + i.t] = i.am(0, o[n], e, n, 0, i.t);
            e.s = 0,
                e.clamp(),
            this.s != t.s && a.ZERO.subTo(e, e)
        }
        function E(t) {
            for (var e = this.abs(), i = t.t = 2 * e.t; --i >= 0; )
                t[i] = 0;
            for (i = 0; i < e.t - 1; ++i) {
                var o = e.am(i, e[i], t, 2 * i, 0, 1);
                (t[i + e.t] += e.am(i + 1, 2 * e[i], t, 2 * i + 1, o, e.t - i - 1)) >= e.DV && (t[i + e.t] -= e.DV,
                    t[i + e.t + 1] = 1)
            }
            t.t > 0 && (t[t.t - 1] += e.am(i, e[i], t, 2 * i, 0, 1)),
                t.s = 0,
                t.clamp()
        }
        function L(t, e, i) {
            var o = t.abs();
            if (!(o.t <= 0)) {
                var n = this.abs();
                if (n.t < o.t)
                    return null  != e && e.fromInt(0),
                        void (null  != i && this.copyTo(i));
                null  == i && (i = s());
                var r = s()
                    , p = this.s
                    , c = t.s
                    , l = this.DB - b(o[o.t - 1]);
                l > 0 ? (o.lShiftTo(l, r),
                    n.lShiftTo(l, i)) : (o.copyTo(r),
                    n.copyTo(i));
                var u = r.t
                    , g = r[u - 1];
                if (0 != g) {
                    var d = g * (1 << this.F1) + (u > 1 ? r[u - 2] >> this.F2 : 0)
                        , h = this.FV / d
                        , m = (1 << this.F1) / d
                        , f = 1 << this.F2
                        , _ = i.t
                        , v = _ - u
                        , w = null  == e ? s() : e;
                    for (r.dlShiftTo(v, w),
                         i.compareTo(w) >= 0 && (i[i.t++] = 1,
                             i.subTo(w, i)),
                             a.ONE.dlShiftTo(u, w),
                             w.subTo(r, r); r.t < u; )
                        r[r.t++] = 0;
                    for (; --v >= 0; ) {
                        var $ = i[--_] == g ? this.DM : Math.floor(i[_] * h + (i[_ - 1] + f) * m);
                        if ((i[_] += r.am(0, $, i, v, 0, u)) < $)
                            for (r.dlShiftTo(v, w),
                                     i.subTo(w, i); i[_] < --$; )
                                i.subTo(w, i)
                    }
                    null  != e && (i.drShiftTo(u, e),
                    p != c && a.ZERO.subTo(e, e)),
                        i.t = u,
                        i.clamp(),
                    l > 0 && i.rShiftTo(l, i),
                    0 > p && a.ZERO.subTo(i, i)
                }
            }
        }
        function N(t) {
            var e = s();
            return this.abs().divRemTo(t, null , e),
            this.s < 0 && e.compareTo(a.ZERO) > 0 && t.subTo(e, e),
                e
        }
        function H(t) {
            this.m = t
        }
        function P(t) {
            return t.s < 0 || t.compareTo(this.m) >= 0 ? t.mod(this.m) : t
        }
        function M(t) {
            return t
        }
        function D(t) {
            t.divRemTo(this.m, null , t)
        }
        function R(t, e, i) {
            t.multiplyTo(e, i),
                this.reduce(i)
        }
        function I(t, e) {
            t.squareTo(e),
                this.reduce(e)
        }
        function V() {
            if (this.t < 1)
                return 0;
            var t = this[0];
            if (0 == (1 & t))
                return 0;
            var e = 3 & t;
            return e = e * (2 - (15 & t) * e) & 15,
                e = e * (2 - (255 & t) * e) & 255,
                e = e * (2 - ((65535 & t) * e & 65535)) & 65535,
                e = e * (2 - t * e % this.DV) % this.DV,
                e > 0 ? this.DV - e : -e
        }
        function j(t) {
            this.m = t,
                this.mp = t.invDigit(),
                this.mpl = 32767 & this.mp,
                this.mph = this.mp >> 15,
                this.um = (1 << t.DB - 15) - 1,
                this.mt2 = 2 * t.t
        }
        function B(t) {
            var e = s();
            return t.abs().dlShiftTo(this.m.t, e),
                e.divRemTo(this.m, null , e),
            t.s < 0 && e.compareTo(a.ZERO) > 0 && this.m.subTo(e, e),
                e
        }
        function U(t) {
            var e = s();
            return t.copyTo(e),
                this.reduce(e),
                e
        }
        function Q(t) {
            for (; t.t <= this.mt2; )
                t[t.t++] = 0;
            for (var e = 0; e < this.m.t; ++e) {
                var i = 32767 & t[e]
                    , o = i * this.mpl + ((i * this.mph + (t[e] >> 15) * this.mpl & this.um) << 15) & t.DM;
                for (i = e + this.m.t,
                         t[i] += this.m.am(0, o, t, e, 0, this.m.t); t[i] >= t.DV; )
                    t[i] -= t.DV,
                        t[++i]++
            }
            t.clamp(),
                t.drShiftTo(this.m.t, t),
            t.compareTo(this.m) >= 0 && t.subTo(this.m, t)
        }
        function O(t, e) {
            t.squareTo(e),
                this.reduce(e)
        }
        function F(t, e, i) {
            t.multiplyTo(e, i),
                this.reduce(i)
        }
        function z() {
            return 0 == (this.t > 0 ? 1 & this[0] : this.s)
        }
        function W(t, e) {
            if (t > 4294967295 || 1 > t)
                return a.ONE;
            var i = s()
                , o = s()
                , n = e.convert(this)
                , r = b(t) - 1;
            for (n.copyTo(i); --r >= 0; )
                if (e.sqrTo(i, o),
                    (t & 1 << r) > 0)
                    e.mulTo(o, n, i);
                else {
                    var p = i;
                    i = o,
                        o = p
                }
            return e.revert(i)
        }
        function X(t, e) {
            var i;
            return i = 256 > t || e.isEven() ? new H(e) : new j(e),
                this.exp(t, i)
        }
        function G(t) {
            ht[mt++] ^= 255 & t,
                ht[mt++] ^= t >> 8 & 255,
                ht[mt++] ^= t >> 16 & 255,
                ht[mt++] ^= t >> 24 & 255,
            mt >= vt && (mt -= vt)
        }
        function Z() {
            G((new Date).getTime())
        }
        function K() {
            if (null  == dt) {
                for (Z(),
                         dt = ot(),
                         dt.init(ht),
                         mt = 0; mt < ht.length; ++mt)
                    ht[mt] = 0;
                mt = 0
            }
            return dt.next()
        }
        function J(t) {
            var e;
            for (e = 0; e < t.length; ++e)
                t[e] = K()
        }
        function Y() {}
        function tt() {
            this.i = 0,
                this.j = 0,
                this.S = new Array
        }
        function et(t) {
            var e, i, o;
            for (e = 0; 256 > e; ++e)
                this.S[e] = e;
            for (i = 0,
                     e = 0; 256 > e; ++e)
                i = i + this.S[e] + t[e % t.length] & 255,
                    o = this.S[e],
                    this.S[e] = this.S[i],
                    this.S[i] = o;
            this.i = 0,
                this.j = 0
        }
        function it() {
            var t;
            return this.i = this.i + 1 & 255,
                this.j = this.j + this.S[this.i] & 255,
                t = this.S[this.i],
                this.S[this.i] = this.S[this.j],
                this.S[this.j] = t,
                this.S[t + this.S[this.i] & 255]
        }
        function ot() {
            return new tt
        }
        function nt(t, e, o) {
            e = "e9a815ab9d6e86abbf33a4ac64e9196d5be44a09bd0ed6ae052914e1a865ac8331fed863de8ea697e9a7f63329e5e23cda09c72570f46775b7e39ea9670086f847d3c9c51963b131409b1e04265d9747419c635404ca651bbcbc87f99b8008f7f5824653e3658be4ba73e4480156b390bb73bc1f8b33578e7a4e12440e9396f2552c1aff1c92e797ebacdc37c109ab7bce2367a19c56a033ee04534723cc2558cb27368f5b9d32c04d12dbd86bbd68b1d99b7c349a8453ea75d1b2e94491ab30acf6c46a36a75b721b312bedf4e7aad21e54e9bcbcf8144c79b6e3c05eb4a1547750d224c0085d80e6da3907c3d945051c13c7c1dcefd6520ee8379c4f5231ed",
                o = "10001";
            var n = new i;
            return n.setPublic(e, o),
                n.encrypt(t)
        }
        i.prototype.doPublic = n,
            i.prototype.setPublic = o,
            i.prototype.encrypt = r;
        var rt, at = 0xdeadbeefcafe, st = 15715070 == (16777215 & at);
        st && (a.prototype.am = l, rt = 28),
            a.prototype.DB = rt,
            a.prototype.DM = (1 << rt) - 1,
            a.prototype.DV = 1 << rt;
        var pt = 52;
        a.prototype.FV = Math.pow(2, pt),
            a.prototype.F1 = pt - rt,
            a.prototype.F2 = 2 * rt - pt;
        var ct, lt, ut = "0123456789abcdefghijklmnopqrstuvwxyz", gt = new Array;
        for (ct = "0".charCodeAt(0),
                 lt = 0; 9 >= lt; ++lt)
            gt[ct++] = lt;
        for (ct = "a".charCodeAt(0),
                 lt = 10; 36 > lt; ++lt)
            gt[ct++] = lt;
        for (ct = "A".charCodeAt(0),
                 lt = 10; 36 > lt; ++lt)
            gt[ct++] = lt;
        H.prototype.convert = P,
            H.prototype.revert = M,
            H.prototype.reduce = D,
            H.prototype.mulTo = R,
            H.prototype.sqrTo = I,
            j.prototype.convert = B,
            j.prototype.revert = U,
            j.prototype.reduce = Q,
            j.prototype.mulTo = F,
            j.prototype.sqrTo = O,
            a.prototype.copyTo = d,
            a.prototype.fromInt = h,
            a.prototype.fromString = f,
            a.prototype.clamp = _,
            a.prototype.dlShiftTo = q,
            a.prototype.drShiftTo = T,
            a.prototype.lShiftTo = x,
            a.prototype.rShiftTo = C,
            a.prototype.subTo = S,
            a.prototype.multiplyTo = A,
            a.prototype.squareTo = E,
            a.prototype.divRemTo = L,
            a.prototype.invDigit = V,
            a.prototype.isEven = z,
            a.prototype.exp = W,
            a.prototype.toString = v,
            a.prototype.negate = w,
            a.prototype.abs = $,
            a.prototype.compareTo = y,
            a.prototype.bitLength = k,
            a.prototype.mod = N,
            a.prototype.modPowInt = X,
            a.ZERO = m(0),
            a.ONE = m(1);
        var dt, ht, mt;
        if (null  == ht) {
            ht = new Array,
                mt = 0;
            var ft;
            for (; vt > mt; )
                ft = Math.floor(65536 * Math.random()),
                    ht[mt++] = ft >>> 8,
                    ht[mt++] = 255 & ft;
            mt = 0,
                Z()
        }
        Y.prototype.nextBytes = J,
            tt.prototype.init = et,
            tt.prototype.next = it;
        var vt = 256;

        return {
            rsa_encrypt: nt
        }


    })();

    var btoa = (function(){

        var q = {};
        q.PADCHAR = "=",
            q.ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            q.getbyte = function(t, e) {
                var i = t.charCodeAt(e);
                if (i > 255)
                    throw "INVALID_CHARACTER_ERR: DOM Exception 5";
                return i
            }
            ,
            q.encode = function(t) {
                if (1 != arguments.length)
                    throw "SyntaxError: Not enough arguments";
                var e, i, o = q.PADCHAR, n = q.ALPHA, r = q.getbyte, a = [];
                t = "" + t;
                var s = t.length - t.length % 3;
                if (0 == t.length)
                    return t;
                for (e = 0; s > e; e += 3)
                    i = r(t, e) << 16 | r(t, e + 1) << 8 | r(t, e + 2),
                        a.push(n.charAt(i >> 18)),
                        a.push(n.charAt(i >> 12 & 63)),
                        a.push(n.charAt(i >> 6 & 63)),
                        a.push(n.charAt(63 & i));
                switch (t.length - s) {
                    case 1:
                        i = r(t, e) << 16,
                            a.push(n.charAt(i >> 18) + n.charAt(i >> 12 & 63) + o + o);
                        break;
                    case 2:
                        i = r(t, e) << 16 | r(t, e + 1) << 8,
                            a.push(n.charAt(i >> 18) + n.charAt(i >> 12 & 63) + n.charAt(i >> 6 & 63) + o)
                }
                return a.join("")
            }

        return q.encode;

    })();

    function md5(t) {
        return hex_md5(t)
    }
    function hex_md5(t) {
        return binl2hex(core_md5(str2binl(t), t.length * chrsz))
    }
    function str_md5(t) {
        return binl2str(core_md5(str2binl(t), t.length * chrsz))
    }
    function hex_hmac_md5(t, e) {
        return binl2hex(core_hmac_md5(t, e))
    }
    function b64_hmac_md5(t, e) {
        return binl2b64(core_hmac_md5(t, e))
    }
    function str_hmac_md5(t, e) {
        return binl2str(core_hmac_md5(t, e))
    }
    function core_md5(t, e) {
        t[e >> 5] |= 128 << e % 32,
            t[(e + 64 >>> 9 << 4) + 14] = e;
        for (var i = 1732584193, o = -271733879, n = -1732584194, r = 271733878, a = 0; a < t.length; a += 16) {
            var s = i
                , p = o
                , c = n
                , l = r;
            i = md5_ff(i, o, n, r, t[a + 0], 7, -680876936),
                r = md5_ff(r, i, o, n, t[a + 1], 12, -389564586),
                n = md5_ff(n, r, i, o, t[a + 2], 17, 606105819),
                o = md5_ff(o, n, r, i, t[a + 3], 22, -1044525330),
                i = md5_ff(i, o, n, r, t[a + 4], 7, -176418897),
                r = md5_ff(r, i, o, n, t[a + 5], 12, 1200080426),
                n = md5_ff(n, r, i, o, t[a + 6], 17, -1473231341),
                o = md5_ff(o, n, r, i, t[a + 7], 22, -45705983),
                i = md5_ff(i, o, n, r, t[a + 8], 7, 1770035416),
                r = md5_ff(r, i, o, n, t[a + 9], 12, -1958414417),
                n = md5_ff(n, r, i, o, t[a + 10], 17, -42063),
                o = md5_ff(o, n, r, i, t[a + 11], 22, -1990404162),
                i = md5_ff(i, o, n, r, t[a + 12], 7, 1804603682),
                r = md5_ff(r, i, o, n, t[a + 13], 12, -40341101),
                n = md5_ff(n, r, i, o, t[a + 14], 17, -1502002290),
                o = md5_ff(o, n, r, i, t[a + 15], 22, 1236535329),
                i = md5_gg(i, o, n, r, t[a + 1], 5, -165796510),
                r = md5_gg(r, i, o, n, t[a + 6], 9, -1069501632),
                n = md5_gg(n, r, i, o, t[a + 11], 14, 643717713),
                o = md5_gg(o, n, r, i, t[a + 0], 20, -373897302),
                i = md5_gg(i, o, n, r, t[a + 5], 5, -701558691),
                r = md5_gg(r, i, o, n, t[a + 10], 9, 38016083),
                n = md5_gg(n, r, i, o, t[a + 15], 14, -660478335),
                o = md5_gg(o, n, r, i, t[a + 4], 20, -405537848),
                i = md5_gg(i, o, n, r, t[a + 9], 5, 568446438),
                r = md5_gg(r, i, o, n, t[a + 14], 9, -1019803690),
                n = md5_gg(n, r, i, o, t[a + 3], 14, -187363961),
                o = md5_gg(o, n, r, i, t[a + 8], 20, 1163531501),
                i = md5_gg(i, o, n, r, t[a + 13], 5, -1444681467),
                r = md5_gg(r, i, o, n, t[a + 2], 9, -51403784),
                n = md5_gg(n, r, i, o, t[a + 7], 14, 1735328473),
                o = md5_gg(o, n, r, i, t[a + 12], 20, -1926607734),
                i = md5_hh(i, o, n, r, t[a + 5], 4, -378558),
                r = md5_hh(r, i, o, n, t[a + 8], 11, -2022574463),
                n = md5_hh(n, r, i, o, t[a + 11], 16, 1839030562),
                o = md5_hh(o, n, r, i, t[a + 14], 23, -35309556),
                i = md5_hh(i, o, n, r, t[a + 1], 4, -1530992060),
                r = md5_hh(r, i, o, n, t[a + 4], 11, 1272893353),
                n = md5_hh(n, r, i, o, t[a + 7], 16, -155497632),
                o = md5_hh(o, n, r, i, t[a + 10], 23, -1094730640),
                i = md5_hh(i, o, n, r, t[a + 13], 4, 681279174),
                r = md5_hh(r, i, o, n, t[a + 0], 11, -358537222),
                n = md5_hh(n, r, i, o, t[a + 3], 16, -722521979),
                o = md5_hh(o, n, r, i, t[a + 6], 23, 76029189),
                i = md5_hh(i, o, n, r, t[a + 9], 4, -640364487),
                r = md5_hh(r, i, o, n, t[a + 12], 11, -421815835),
                n = md5_hh(n, r, i, o, t[a + 15], 16, 530742520),
                o = md5_hh(o, n, r, i, t[a + 2], 23, -995338651),
                i = md5_ii(i, o, n, r, t[a + 0], 6, -198630844),
                r = md5_ii(r, i, o, n, t[a + 7], 10, 1126891415),
                n = md5_ii(n, r, i, o, t[a + 14], 15, -1416354905),
                o = md5_ii(o, n, r, i, t[a + 5], 21, -57434055),
                i = md5_ii(i, o, n, r, t[a + 12], 6, 1700485571),
                r = md5_ii(r, i, o, n, t[a + 3], 10, -1894986606),
                n = md5_ii(n, r, i, o, t[a + 10], 15, -1051523),
                o = md5_ii(o, n, r, i, t[a + 1], 21, -2054922799),
                i = md5_ii(i, o, n, r, t[a + 8], 6, 1873313359),
                r = md5_ii(r, i, o, n, t[a + 15], 10, -30611744),
                n = md5_ii(n, r, i, o, t[a + 6], 15, -1560198380),
                o = md5_ii(o, n, r, i, t[a + 13], 21, 1309151649),
                i = md5_ii(i, o, n, r, t[a + 4], 6, -145523070),
                r = md5_ii(r, i, o, n, t[a + 11], 10, -1120210379),
                n = md5_ii(n, r, i, o, t[a + 2], 15, 718787259),
                o = md5_ii(o, n, r, i, t[a + 9], 21, -343485551),
                i = safe_add(i, s),
                o = safe_add(o, p),
                n = safe_add(n, c),
                r = safe_add(r, l)
        }
        return 16 == mode ? Array(o, n) : Array(i, o, n, r)
    }
    function md5_cmn(t, e, i, o, n, r) {
        return safe_add(bit_rol(safe_add(safe_add(e, t), safe_add(o, r)), n), i)
    }
    function md5_ff(t, e, i, o, n, r, a) {
        return md5_cmn(e & i | ~e & o, t, e, n, r, a)
    }
    function md5_gg(t, e, i, o, n, r, a) {
        return md5_cmn(e & o | i & ~o, t, e, n, r, a)
    }
    function md5_hh(t, e, i, o, n, r, a) {
        return md5_cmn(e ^ i ^ o, t, e, n, r, a)
    }
    function md5_ii(t, e, i, o, n, r, a) {
        return md5_cmn(i ^ (e | ~o), t, e, n, r, a)
    }
    function core_hmac_md5(t, e) {
        var i = str2binl(t);
        i.length > 16 && (i = core_md5(i, t.length * chrsz));
        for (var o = Array(16), n = Array(16), r = 0; 16 > r; r++)
            o[r] = 909522486 ^ i[r],
                n[r] = 1549556828 ^ i[r];
        var a = core_md5(o.concat(str2binl(e)), 512 + e.length * chrsz);
        return core_md5(n.concat(a), 640)
    }
    function safe_add(t, e) {
        var i = (65535 & t) + (65535 & e)
            , o = (t >> 16) + (e >> 16) + (i >> 16);
        return o << 16 | 65535 & i
    }
    function bit_rol(t, e) {
        return t << e | t >>> 32 - e
    }
    function str2binl(t) {
        for (var e = Array(), i = (1 << chrsz) - 1, o = 0; o < t.length * chrsz; o += chrsz)
            e[o >> 5] |= (t.charCodeAt(o / chrsz) & i) << o % 32;
        return e
    }
    function binl2str(t) {
        for (var e = "", i = (1 << chrsz) - 1, o = 0; o < 32 * t.length; o += chrsz)
            e += String.fromCharCode(t[o >> 5] >>> o % 32 & i);
        return e
    }
    function binl2hex(t) {
        for (var e = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", i = "", o = 0; o < 4 * t.length; o++)
            i += e.charAt(t[o >> 2] >> o % 4 * 8 + 4 & 15) + e.charAt(t[o >> 2] >> o % 4 * 8 & 15);
        return i
    }
    function binl2b64(t) {
        for (var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = "", o = 0; o < 4 * t.length; o += 3)
            for (var n = (t[o >> 2] >> 8 * (o % 4) & 255) << 16 | (t[o + 1 >> 2] >> 8 * ((o + 1) % 4) & 255) << 8 | t[o + 2 >> 2] >> 8 * ((o + 2) % 4) & 255, r = 0; 4 > r; r++)
                i += 8 * o + 6 * r > 32 * t.length ? b64pad : e.charAt(n >> 6 * (3 - r) & 63);
        return i
    }
    function hexchar2bin(str) {
        for (var arr = [], i = 0; i < str.length; i += 2)
            arr.push("\\x" + str.substr(i, 2));
        return arr = arr.join(""),
            eval("var temp = '" + arr + "'"),
            temp
    }
    function getEncryption(t, e, i, o) {
        i = i || "",
            t = t || "";
        for (var n = o ? t : md5(t), r = hexchar2bin(n), a = md5(r + e), s = TEA.strToBytes(i.toUpperCase(), !0), p = Number(s.length / 2).toString(16); p.length < 4;)
            p = "0" + p;
        TEA.initkey(a);
        var c = TEA.encrypt(n + TEA.strToBytes(e) + p + s);
        TEA.initkey("");
        for (var l = Number(c.length / 2).toString(16); l.length < 4;)
            l = "0" + l;
        var u = RSA.rsa_encrypt(hexchar2bin(l + c));
        return btoa(hexchar2bin(u)).replace(/[\/\+=]/g, function (t) {
            return {
                "/": "-",
                "+": "*",
                "=": "_"
            }[t]
        })
    }
    function getRSAEncryption(t, e, i) {
        var o = i ? t : md5(t)
            , n = o + e.toUpperCase()
            , r = $.RSA.rsa_encrypt(n);
        return r
    }

    return {
        getEncryption: getEncryption,
        getRSAEncryption: getRSAEncryption,
        md5: md5
    }
}();

module.exports = Encryption;

