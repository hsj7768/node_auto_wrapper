var fs = require('fs');
var util = require('./util.js');
var frameCppfile = "./FrameWrapper.cc";



var makeArguemntString = function makeArguemntString(args) {
    var returnStr = "";

    args.forEach(function(arg, i) {
        var type = arg.split(" ")[0];
        var id = arg.split(" ")[1];

        if (type == "QString") {
            returnStr += "    String::Utf8Value str" + i;
            returnStr += "(args[" + i + "]->ToString());\n";
            returnStr += "    QString param" + i + " = QString(*str" + i + ");\n";

        } else if (type == "int") {
            returnStr += "    int param" + i + " = (int)args[" + i + "]->ToInteger()->Value();\n";

        } else {
            console.log("undefined type : " + type);
        }
    });

    return returnStr;
}



var makeFunctionBody = function makeFunctionBody(func) {
    var functionBody = "";
    func = func.trim();
    var returnType = func.split(" ")[0];
    // get Function Name
    var removedType = func.replace(/[aA-zZ]+\s/, "");
    var functionName = removedType.replace(/\([aA-zZ\s]*\);/, "");
    var argList = removedType.replace(/[aA-zZ]+[(]/, "").replace(");", "");
    var args = [];
    if (argList.indexOf(",") > 0) {
        args = argList.split(",");
    } else if (argList.length > 0) {
        args.push(argList);
    }

    // declare function
    functionBody += "\n\n\n";
    functionBody += "Handle<Value> ";
    functionBody += wrapClass;
    functionBody += "::";
    functionBody += functionName;
    functionBody += "(const Arguments& args)\n";
    functionBody += "{\n";

    // declare handle scope
    functionBody += "    HandleScope scope;\n";

    // make arguemnt string
    functionBody += makeArguemntString(args);

    // make original object
    functionBody += "    ";
    functionBody += wrapClass + "* obj = ObjectWrap::Unwrap<" + wrapClass + ">(args.This());\n";

    // declare return
    if (returnType == "int") {
        functionBody += "    return scope.Close(";
        functionBody += "Number::New(";
        functionBody += "obj->";
        functionBody += className.toLowerCase();
        functionBody += "->";
        functionBody += functionName;
        functionBody += "(";

        if (args.length > 0) {
            args.forEach(function(arg, i) {
                functionBody += "param" + i + ",";
            });

            functionBody = functionBody.substring(0, functionBody.length - 1);
        }

        functionBody += ")";
        functionBody += ")";
        functionBody += ");";
        functionBody += "\n";

    } else if (returnType == "void") {
        functionBody += "    obj->";
        functionBody += className.toLowerCase();
        functionBody += "->";
        functionBody += functionName;
        functionBody += "(";
        args.forEach(function(arg, i) {
            functionBody += "param" + i + ",";
        });
        functionBody = functionBody.substring(0, functionBody.length - 1);
        functionBody += ");\n";
        functionBody += "    return scope.Close(";
        functionBody += "Undefined()";
        functionBody += ");";
        functionBody += "\n";

    } else if (returnType == "double") {
    } else if (returnType == "QString") {
    } else {
        console.log("Undefined returnType : " + returnType);
    }

    functionBody += "}\n";

    return functionBody;
}



var makePublicDeclare = function makePublicDeclare(func) {
    // get Function Name
    func = func.trim();
    func = func.replace(/[aA-zZ]+\s/, "");
    func = func.replace(/\([aA-zZ\s]*\);/, "");
    var functionName = func.trim();

    declareFunction += "    tpl->PrototypeTemplate()->Set(v8::String::NewSymbol(\"";
    declareFunction += functionName;
    declareFunction += "\"),\n"; 
    declareFunction += "        v8::FunctionTemplate::New(";
    declareFunction += functionName;
    declareFunction += ")->GetFunction());\n";

    return declareFunction;
}



exports.make = function(target, output) {
    fs.readFile(frameCppfile, function (err, data) {
        if (err) throw err;

        fs.readFile("./" + target, function(err, wdata) {
            var origin = wdata.toString();
            var className = origin.match(/class [aA-zZ]+/gm).toString().replace("class ", "");
            var wrapClass = className + "Wrapper";
            var wrapFile = wrapClass + ".cc";


            // extract string data
            var wrap = data.toString();

            // replace class name
            wrap = util.replaceClassName(wrap, className);


            // extract public functions
            var declareFunction = "tpl->InstanceTemplate()->SetInternalFieldCount(1);\n";
            var publicFunc = util.makePublicFunctionList(origin);

            // declare public functions
            publicFunc.forEach(function(func, i) {
                if (func && func.trim() && func.indexOf(className + "(") <= 0) {
                    declareFunction += makePublicDeclare(func);
                }
            });

            wrap = wrap.replace(new RegExp("tpl->InstanceTemplate[(][)]->SetInternalFieldCount[(]\\d[)];", "g"), declareFunction);


            
            var functionBody = "";
            // write function
            publicFunc.forEach(function(func, i) {
                if (func && func.trim() && func.indexOf(className + "(") <= 0) {
                    functionBody = makeFunctionBody(func);
                }
            });

            wrap += functionBody;

//            console.log(functionBody);


//*
            // write cc file
            fs.writeFile("./" + output + "/" + wrapFile, wrap, function (err) {
                if (err) throw err;
                console.log("create " + wrapFile);
            });
//*/
        });
    });
}


exports.makeArguemntString = makeArguemntString;
