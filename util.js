

var replaceClassName = function replaceClassName(data, className) {
    data = data.replace(new RegExp("\\Frame","g"), className);
    data = data.replace(new RegExp("\\FRAME", "g"), className.toUpperCase());
    data = data.replace(new RegExp("frame", "g"), className.toLowerCase());

    return data;
}
exports.replaceClassName = replaceClassName;


var makePublicFunctionList = function makePublicFunctionList(data) {
    var publicFunc;
    // private 없는 header file
    if (data.indexOf("private:") < 0) {
        publicFunc = data.match(/public:\n([aA-zZ\s()=\d;<>,~]+)[}]/)[1].split("\n");
} else {
    publicFunc = data.match(/public:\n([aA-zZ\s()=\d;<>,~]+)private:/)[1].split("\n");
}

    return publicFunc;
}
exports.makePublicFunctionList= makePublicFunctionList;

