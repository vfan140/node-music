function decode(loca) {
    var result = [], url = "";
    var line, rows, extra;
    loca = loca.trim();
    if(loca === "") {
        return "";
    }
    line = Number(loca[0]);
    rows = Math.floor((loca.length - 1) / line);
    extra = (loca.length - 1) % line;
    loca = loca.slice(1);
    //console.log(line,rows,extra,loca);
    for(i=0;i<extra;i++) {
        result.push(loca.slice((rows + 1) * i, (rows + 1) * (i + 1)));
    }
    for(i=0;i<line-extra;i++) {
        result.push(loca.slice((rows + 1) * extra + (rows * i), (rows + 1) * extra + (rows * i) + rows));
    }
    for(i=0;i<rows+1;i++) {
        for(j=0;j<rows;j++) {
            if(result[j] && result[j][i]) {
                url = url + result[j][i];
            }
        }
    }
    url = unescape(url);
    url = url.replace(/\^/g,"0");
    return url;
}


module.exports = decode;