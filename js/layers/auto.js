function autoBought(id){
  return player.a[id].bought
}
function autoActive(id){
  return player.a[id].active
}
function autoStat(id){
  return player.a[id].stat
}
function buyAuto(id,cost){
  if(cost.gt(player.a.points)) return
  player.a.points = player.a.points.sub(cost)
  player.a[id].bought = true
}
function toggleNumberStat(id){
  var input = prompt('请输入设置.不输入意味着取消,别的非数字或小于0的数字均被认为是关闭自动化.')
  if(input == null) return
  input = new OmegaNum(input)
  if(input.isNaN()){
    player.a[id].active = false
    return
  }
  if(input.lt(0)){
    player.a[id].active = false
    return
  }
  player.a[id].active = true
  player.a[id].stat = input
}
var layerA = {
    name: "auto", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return setupList},
    layerShown:true,
    effectDescription(){return `<br>重置u升级等方式也会给予自动化点.<br>粉红:买不起 金:未购买但可购买 蓝:未启用 绿:已启用<br>若要禁用一个自动化,输入一个不符合规则的设置.<br>自动化随自动化点的增加而解锁.当你总自动化点达到价格/10时会解锁.`},
    clickables: {
        11: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动P重置',
          cost:n(10),
          unlocked(){return true},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n间隔:${autoStat(this.id)}s(在能自动获取后被自动关闭)`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleNumberStat(this.id)},
          update(diff){
            if(!autoActive(this.id)) return
            if(layers.p.passiveGeneration()!=0) return
            if(!layers["p"/* fix this */].layerShown()) return
            player.a[this.id].time += diff
            if(autoStat(this.id).lte(player.a[this.id].time)){doReset('p');player.a[this.id].time = 0}
          },
          style(){if(autoBought(this.id)){if(autoActive(this.id)) return {'background-color':'green'};return {'background-color':'blue'}}if(player.a.points.gte(this.cost))  return {'background-color':'gold'};return {"background-color":"#bf8f8f"}},
        },
        12: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动P升级',
          cost:n(25),
          unlocked(){return player.a.total.gte(this.cost.div(10))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          update(diff){},
          style(){if(autoBought(this.id)){if(autoActive(this.id)) return {'background-color':'green'};return {'background-color':'blue'}}if(player.a.points.gte(this.cost)) return {'background-color':'gold'};return {"background-color":"#bf8f8f"}},
        },
        13: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动每秒获取10%P点',
          cost:n(128),
          unlocked(){return player.a.total.gte(this.cost.div(10))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          update(diff){},
          style(){if(autoBought(this.id)){if(autoActive(this.id)) return {'background-color':'green'};return {'background-color':'blue'}}if(player.a.points.gte(this.cost)) return {'background-color':'gold'};return {"background-color":"#bf8f8f"}},
        },
        21: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动B重置',
          cost:n(64),
          unlocked(){return true},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n间隔:${autoStat(this.id)}s(在不重置任何东西后自动每帧一次)`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleNumberStat(this.id)},
          update(diff){
            if(!autoActive(this.id)) return
            if(!layers["b"/* fix this */].layerShown()) return
            player.a[this.id].time += diff
            if(autoStat(this.id).lte(player.a[this.id].time) || layers["b"/* fix this */].resetsNothing()){doReset("b"/* fix this */);player.a[this.id].time = 0}
          },
          style(){if(autoBought(this.id)){if(autoActive(this.id)) return {'background-color':'green'};return {'background-color':'blue'}}if(player.a.points.gte(this.cost))  return {'background-color':'gold'};return {"background-color":"#bf8f8f"}},
        },
        22: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动B升级',
          cost:n(128),
          unlocked(){return player.a.total.gte(this.cost.div(10))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          update(diff){},
          style(){if(autoBought(this.id)){if(autoActive(this.id)) return {'background-color':'green'};return {'background-color':'blue'}}if(player.a.points.gte(this.cost)) return {'background-color':'gold'};return {"background-color":"#bf8f8f"}},
        },
        23: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'允许批量重置B',
          cost:n(256),
          unlocked(){return player.a.total.gte(this.cost.div(10))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          update(diff){},
          style(){if(autoBought(this.id)){if(autoActive(this.id)) return {'background-color':'green'};return {'background-color':'blue'}}if(player.a.points.gte(this.cost)) return {'background-color':'gold'};return {"background-color":"#bf8f8f"}},
        },
        24: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'B不再重置任何东西',
          cost:n(2048),
          unlocked(){return player.a.total.gte(this.cost.div(10))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          update(diff){},
          style(){if(autoBought(this.id)){if(autoActive(this.id)) return {'background-color':'green'};return {'background-color':'blue'}}if(player.a.points.gte(this.cost)) return {'background-color':'gold'};return {"background-color":"#bf8f8f"}},
        },
        31: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动G重置',
          cost:n(64),
          unlocked(){return true},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n间隔:${autoStat(this.id)}s(在不重置任何东西后自动每帧一次)`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleNumberStat(this.id)},
          update(diff){
            if(!autoActive(this.id)) return
            if(!layers["g"/* fix this */].layerShown()) return
            player.a[this.id].time += diff            
            if(autoStat(this.id).lte(player.a[this.id].time) || layers["g"/* fix this */].resetsNothing()){doReset("g"/* fix this */);player.a[this.id].time = 0}
          },
          style(){if(autoBought(this.id)){if(autoActive(this.id)) return {'background-color':'green'};return {'background-color':'blue'}}if(player.a.points.gte(this.cost))  return {'background-color':'gold'};return {"background-color":"#bf8f8f"}},
        },
        32: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动G升级',
          cost:n(128),
          unlocked(){return player.a.total.gte(this.cost.div(10))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          update(diff){},
          style(){if(autoBought(this.id)){if(autoActive(this.id)) return {'background-color':'green'};return {'background-color':'blue'}}if(player.a.points.gte(this.cost)) return {'background-color':'gold'};return {"background-color":"#bf8f8f"}},
        },
        33: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'允许批量重置G',
          cost:n(256),
          unlocked(){return player.a.total.gte(this.cost.div(10))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          update(diff){},
          style(){if(autoBought(this.id)){if(autoActive(this.id)) return {'background-color':'green'};return {'background-color':'blue'}}if(player.a.points.gte(this.cost)) return {'background-color':'gold'};return {"background-color":"#bf8f8f"}},
        },
        34: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'G不再重置任何东西',
          cost:n(2048),
          unlocked(){return player.a.total.gte(this.cost.div(10))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          update(diff){},
          style(){if(autoBought(this.id)){if(autoActive(this.id)) return {'background-color':'green'};return {'background-color':'blue'}}if(player.a.points.gte(this.cost)) return {'background-color':'gold'};return {"background-color":"#bf8f8f"}},
        },
        41: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动T重置',
          cost:n(1024),
          unlocked(){return true},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n间隔:${autoStat(this.id)}s(在不重置任何东西后自动每帧一次)`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleNumberStat(this.id)},
          update(diff){
            if(!autoActive(this.id)) return
            if(!layers["t"/* fix this */].layerShown()) return
            player.a[this.id].time += diff            
            if(autoStat(this.id).lte(player.a[this.id].time) || layers["t"/* fix this */].resetsNothing()){doReset("t"/* fix this */);player.a[this.id].time = 0}
          },
          style(){if(autoBought(this.id)){if(autoActive(this.id)) return {'background-color':'green'};return {'background-color':'blue'}}if(player.a.points.gte(this.cost))  return {'background-color':'gold'};return {"background-color":"#bf8f8f"}},
        },
        51: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动S重置',
          cost:n(1024),
          unlocked(){return true},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n间隔:${autoStat(this.id)}s(在不重置任何东西后自动每帧一次)`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleNumberStat(this.id)},
          update(diff){
            if(!autoActive(this.id)) return
            if(!layers["s"/* fix this */].layerShown()) return
            player.a[this.id].time += diff            
            if(autoStat(this.id).lte(player.a[this.id].time) || layers["s"/* fix this */].resetsNothing()){doReset("s"/* fix this */);player.a[this.id].time = 0}
          },
          style(){if(autoBought(this.id)){if(autoActive(this.id)) return {'background-color':'green'};return {'background-color':'blue'}}if(player.a.points.gte(this.cost))  return {'background-color':'gold'};return {"background-color":"#bf8f8f"}},
        },
    },
    
    color: "red",
    resource: "自动化点", // Name of prestige currency
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    baseResource: "点数",
    baseAmount() {return player.points},
    exponent:0,
    requires(){return n(1e4)},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = player.points.max(10).log10().div(4).pow(2)
        return mult.floor()
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        var exp = n(1)
        return exp
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    //layerShown(){return player.v.total.gte(1)},

    update(diff){
        for(automation in autoList) autoList[automation].update(diff)
    },
    getNextAt(){return ten.pow(getResetGain(this.layer).add(1).root(2).mul(4))},
}
var autoList = Object.assign({},layerA.clickables)
var setupList = {unlocked: true,points: new ExpantaNum(0)}
for(i in autoList) setupList[i] = {bought:false,stat:n(0),active:false,time:0}
addLayer("a", layerA)