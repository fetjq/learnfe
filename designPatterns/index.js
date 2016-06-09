//js检测对象构造函数
var Interface = function(name, methods) {
    if(arguments.length != 2) {
        throw new Error("检查类的构造函数参数数量必须在两个以上,一个是需要检测的类的名字,一个是以数组形式传入的需要检测的类的方法!");
    }
    this.name = name;
    this.methods = [];
    for(var i = 0, len = methods.length; i < len; i++) {
        if(typeof methods[i] !== 'string') {
            throw new Error("所传入的方法中有一个类型不是字符串!");
        }
        this.methods.push(methods[i]);        
    }    
};    

//js检测对象静态方法

Interface.ensureImplements = function(object) {
    if(arguments.length < 2) {
        throw new Error("检测类的所传入的参数数量不对,至少应有一个被检测对象和一个检测对象");
    }
    for(var i = 1, len = arguments.length; i < len; i++) {
        var interface = arguments[i];
        if(interface.constructor !== Interface) {
            throw new Error("检测对象不是检测函数构造出来的");
        }
        for(var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
            var method = interface.methods[j];
            if(!object[method] || typeof object[method] !== 'function') {
                throw new Error("你所检测的"+interface.name+"对象的"+method+"方法并不存在!");
            }
        }
    } 
};






