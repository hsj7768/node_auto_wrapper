var makeCpp = require('../makeCpp.js');


exports.makeArgumentString_int = function(test) {

    var func = "int getNum(int num);";
    var removedType = func.replace(/[aA-zZ]+\s/, "");
    var argList = removedType.replace(/[aA-zZ]+[(]/, "").replace(");", "");
    var args = [];
    if (argList.indexOf(",") > 0) {
        args = argList.split(",");
    } else if (argList != null) {
        args.push(argList);
    }
    var result = makeCpp.makeArguemntString(args);

    test.equal(result, 
        "    int param0 = (int)args[0]->ToInteger()->Value();\n", 
        "Fail to Unit Test");

    test.done();
}

