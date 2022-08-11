function autoBought(id){
  return player.a[id].bought
}
function autoActive(id){
  if(!autoBought(id)) return false
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
  var input = options.ch?prompt('请输入设置.不输入意味着取消,别的非数字或小于0的数字均被认为是关闭自动化.'):prompt('Set your automation settings here.Input nothing does nothing,and other non-number and neg-number disables this automation.')
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
function toggleIdStat(id,layer){
  var input = options.ch?prompt('请输入设置.不输入意味着取消,输入错误的值则关闭.\n格式:11,12,13,21,25这种,购买项id为行+列,中间用英文逗号分割.按想要的购买先后顺序输入.',player.a[id].stat):prompt('Set your automation settings here.Input nothing does nothing,and input something wrong disables this automation.\nExample:11,12,13,21,25 etc.Buyables ID is row+column,use a comma between two ids.The game will buy these one by one.',player.a[id].stat)
  if(input == null) return
  input = input.split(",")
  for(i in input){
    i = input[i]
    if(!layers[layer].buyables[i]) return player.a[id].active = false
  }
  player.a[id].active = true
  player.a[id].stat = input
}
function getStyle(id){
  if(autoBought(id)){if(autoActive(id)) return {'background-color':'green'};return {'background-color':'blue'}}if(player.a.points.gte(layers.a.clickables[id].cost))  return {'background-color':'gold'};return {"background-color":"#bf8f8f"}
}
var layerA = {
    name: "auto", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return setupList},
    layerShown:true,
    canReset(){return player.points.gte(this.requires()) && player.a.cd.eq(0)},
    effectDescription(){return `<br>重置u升级等方式也会给予自动化点.<br>粉红:买不起 金:未购买但可购买 蓝:未启用 绿:已启用<br>若要禁用一个自动化,输入一个不符合规则的设置.<br>自动化随自动化点的增加而解锁.当你总自动化点达到价格/4时会解锁.<br><br>重置CD:${formatTime(player.a.cd.toNumber())}`},
    effectDescriptionEN(){return `<br>Reset U upgrades gives automation points.<br>Pink:can\'t afford  Golden:can afford  Blue:disabled  Green:enabled<br>To disable an automation,you should set a wrong setting.<br>Automations will unlock once you get cost/10 total automation points.<br><br>Reset CD:${formatTime(player.a.cd.toNumber())}`},
    clickables: {
      11: {
        canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
        name:'自动R重置',
        nameEN:'Automate R Reset',
        cost:n(4),
        unlocked(){return true},
        display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n间隔:${autoStat(this.id)}s(在不重置任何东西后自动每帧一次)`},
        displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>\n\nDelay:${autoStat(this.id)}s(Fires every tick if resets nothing)`},
        onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleNumberStat(this.id)},
        autoUpdate(diff){
          if(!autoActive(this.id)) return
          if(!layers["r"/* fix this */].layerShown()) return
          player.a[this.id].time += diff            
          if(autoStat(this.id).lte(player.a[this.id].time) || layers["r"/* fix this */].resetsNothing()){doReset("r"/* fix this */);player.a[this.id].time = 0}
        },
        style(){return getStyle(this.id)}
      },
      12: {
        canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
        name:'自动R购买项',
        nameEN:'Automate R Buyables',
        cost:n(8),
        unlocked(){return true},
        display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n间隔:${autoStat(this.id)}s(在不重置任何东西后自动每帧一次)`},
        displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>\n\nDelay:${autoStat(this.id)}s(Fires every tick if resets nothing)`},
        onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleNumberStat(this.id)},
        autoUpdate(diff){
          if(!autoActive(this.id)) return
          if(!layers["r"/* fix this */].layerShown()) return
          player.a[this.id].time += diff            
          if(autoStat(this.id).lte(player.a[this.id].time) || layers.t.resetsNothing()){
            for(i in layers.r.buyables){
              i = Number(i)
              if(!i) break
              buyBuyable("r"/* fix this */, i)
            }
            player.a[this.id].time = 0
          }
        },
        style(){return getStyle(this.id)}
      },
      21: {
        canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
        name:'自动L重置',
        nameEN:'Automate L Reset',
        cost:n(64),
        unlocked(){return true},
        display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n间隔:${autoStat(this.id)}s(在不重置任何东西后自动每帧一次)`},
        displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>\n\nDelay:${autoStat(this.id)}s(Fires every tick if resets nothing)`},
        onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleNumberStat(this.id)},
        autoUpdate(diff){
          if(!autoActive(this.id)) return
          if(!layers["l"/* fix this */].layerShown()) return
          player.a[this.id].time += diff            
          if(autoStat(this.id).lte(player.a[this.id].time) || layers["l"/* fix this */].resetsNothing()){doReset("l"/* fix this */);player.a[this.id].time = 0}
        },
        style(){return getStyle(this.id)}
      },
      31: {
        canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
        name:'自动E重置',
        nameEN:'Automate E Reset',
        cost:n(32),
        unlocked(){return true},
        display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n能量低于或等于${autoStat(this.id)}时重置`},
        displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>\n\nReset when energy less than or equal:${autoStat(this.id)}`},
        onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleNumberStat(this.id)},
        autoUpdate(diff){
          if(!autoActive(this.id)) return
          if(!layers["e"/* fix this */].layerShown()) return           
          if(player.e.energy.lte(autoStat(31))){layers.e.clickables[11].onClick()}
        },
        style(){return getStyle(this.id)}
      },
      41: {
        canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
        name:'自动C购买项',
        nameEN:'Auto C Buyables',
        cost:n(16),
        unlocked(){return true},
        display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n购买顺序:${autoStat(this.id)}(未列入的不购买)`},
        displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>\n\nBuying Order:${autoStat(this.id)}(Only buy these)`},
        onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleIdStat(this.id,"c"/* fix this */)},
        autoUpdate(diff){
          if(!autoActive(this.id)) return
          if(!layers["c"/* fix this */].layerShown()) return
          if(!autoStat(this.id).length) return
          for(i in autoStat(this.id)){
            i = autoStat(this.id)[i]
            if(layers["c"/* fix this */].buyables[i].unlocked()) buyBuyable("c"/* fix this */, i)
          }
        },
        style(){return getStyle(this.id)}
      },
    },
    
    color: "red",
    resource: "自动化点", // Name of prestige currency
    resourceEN: "Automation Points", // Name of prestige currency
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    baseResource: "点数",
    baseResourceEN: "Points",
    baseAmount() {return player.points},
    exponent:0,
    requires(){
      var req = n(1e3)
      if(hasAchievement("ach",24)) req = req.div(achievementEffect("ach",24))
      return req
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = player.points.max(10).log10().div(this.requires().log10()).pow(2).mul(2)
        return mult.floor()
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        var exp = n(1)
        return exp
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    //layerShown(){return player.v.total.gte(1)},

    update(diff){
        for(automation in autoList){autoList[automation].autoUpdate(diff)}
        player.a.cd = player.a.cd.sub(diff).max(0)
    },
    getNextAt(){return ten.pow(getResetGain(this.layer).add(1).div(2).root(2).mul(this.requires().log10()))},

    hotkeys: [
      {key: "a", description: "A: A转",descriptionEN: "A: Reset A Node", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
  ],
}
var autoList = Object.assign({},layerA.clickables)
var setupList = {unlocked: true,points: new ExpantaNum(0),cd:new ExpantaNum(10)}
for(i in autoList) setupList[i] = {bought:false,stat:n(0),active:false,time:0}
setupList[41] = {bought:false,stat:[],active:false}
addLayer("a", layerA)