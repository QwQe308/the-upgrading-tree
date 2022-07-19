//快捷调用+提高运算速度
var zero = new OmegaNum(0)
var one = new OmegaNum(1)
var two = new OmegaNum(2)
var three = new OmegaNum(3)
var four = new OmegaNum(4)
var five = new OmegaNum(5)
var six = new OmegaNum(6)
var seven = new OmegaNum(7)
var eight = new OmegaNum(8)
var nine = new OmegaNum(9)
var ten = new OmegaNum(10)
//快捷定义
function n(num){
    return new OmegaNum(num)
}
//检测旁边的升级是否被购买
function checkAroundUpg(UPGlayer,place){
    return hasUpgrade(UPGlayer,place-1)||hasUpgrade(UPGlayer,place+1)||hasUpgrade(UPGlayer,place-10)||hasUpgrade(UPGlayer,place+10)
}
//对数软上限
function logsoftcap(num,start,power){
    if(num.gt(start)){
        num = ten.tetr(num.slog(10).sub(power)).pow(start.logBase(ten.tetr(start.slog(10).sub(power))))
    }
    return num
}
//指数软上限
function powsoftcap(num,start,power){
	if(num.gt(start)){
		num = num.root(power).mul(start.pow(one.sub(one.div(power))))
	}
    return num
}
//倍增型购买项批量购买(极其精准)
function bulkBuy(item,cost,level,costmult){
    var bulk = OmegaNum.affordGeometricSeries(item,cost,costmult,level);
    return {bulk:bulk,cost:OmegaNum.sumGeometricSeries(bulk,cost,costmult,level)}
}
//同样是批量,显示用
function showBulkBuy(item,cost,level,costmult){
    var bulk = OmegaNum.affordGeometricSeries(item,cost,costmult,level).max(1);
    return {bulk:bulk,cost:OmegaNum.sumGeometricSeries(bulk,cost,costmult,level)}
}
//e后数字开根
function expRoot(num,root){
    return ten.pow(num.log10().root(root))
}
function expPow(num,pow){
    return ten.pow(num.log10().pow(pow))
}
//e后数字指数软上限
function expRootSoftcap(num,start,power){
    if(num.lte(start)) return num;
    return ten.pow(num.log10().root(power).mul(start.log10().pow(one.sub(one.div(power)))))
}
//修改class属性
function setClass(id,toClass = []){
    var classes = ""
    for(i in toClass) classes += " "+toClass[i]
    if(classes != "") classes = classes.substr(1)
    document.getElementById(id).className = classes
}
//便捷
function hasUpgThenMul(UPGlayer,id,num){
    if(hasUpgrade(UPGlayer,id)) return num.mul(tmp[UPGlayer].upgrades[id].effect)
    return num
}
function hasUpgThenPow(UPGlayer,id,num){
    if(hasUpgrade(UPGlayer,id)) return num.pow(tmp[UPGlayer].upgrades[id].effect)
    return num
}
function hasUpgThenAdd(UPGlayer,id,num){
    if(hasUpgrade(UPGlayer,id)) return num.add(tmp[UPGlayer].upgrades[id].effect)
    return num
}