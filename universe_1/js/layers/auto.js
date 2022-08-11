function autoBought(id){
  if(inChallenge("ng",11)) return player.a[id].ngbought
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
  if(inChallenge("ng",11)){
    if(cost.gt(player.a.points)) return
    player.a.points = player.a.points.sub(cost)
    player.a[id].ngbought = true
    return
  }
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
  var input = options.ch?prompt('请输入设置.不输入意味着取消,输入错误的值则关闭.\n格式:11,12,13,21,25这种,购买项id为行+列,中间用英文逗号分割.按想要的购买先后顺序输入.'):prompt('Set your automation settings here.Input nothing does nothing,and input something wrong disables this automation.\nExample:11,12,13,21,25 etc.Buyables ID is row+column,use a comma between two ids.The game will buy these one by one.')
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
          name:'自动P重置',
          nameEN:'Automate P Reset',
          cost:n(4),
          unlocked(){return true},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n间隔:${autoStat(this.id)}s(在能自动获取后被自动关闭)`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>\n\nDelay:${autoStat(this.id)}s(Disabled after \'+x% resource/s\' unlocked)`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleNumberStat(this.id)},
          autoUpdate(diff){
            if(!autoActive(this.id)) return
            if(layers.p.passiveGeneration()!=0) return
            if(!layers["p"/* fix this */].layerShown()) return
            player.a[this.id].time += diff
            if(autoStat(this.id).lte(player.a[this.id].time)){doReset('p');player.a[this.id].time = 0}
          },
          style(){return getStyle(this.id)}
        },
        12: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动P升级',
          nameEN:'Automate P Upgrades',
          cost:n(10),
          unlocked(){return player.a.total.gte(this.cost.div(4))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          autoUpdate(diff){},
          style(){return getStyle(this.id)}
        },
        13: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动每秒获取10%P点',
          nameEN:'Generate 10% P Points on Reset Every Second',
          cost:n(64),
          unlocked(){return player.a.total.gte(this.cost.div(4))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          autoUpdate(diff){},
          style(){return getStyle(this.id)}
        },
        21: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动B重置',
          nameEN:'Automate B Reset',
          cost:n(32),
          unlocked(){return true},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n间隔:${autoStat(this.id)}s(在不重置任何东西后自动每帧一次)`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>\n\nDelay:${autoStat(this.id)}s(Fires every tick if resets nothing)`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleNumberStat(this.id)},
          autoUpdate(diff){
            if(!autoActive(this.id)) return
            if(!layers["b"/* fix this */].layerShown()) return
            player.a[this.id].time += diff
            if(autoStat(this.id).lte(player.a[this.id].time) || layers["b"/* fix this */].resetsNothing()){doReset("b"/* fix this */);player.a[this.id].time = 0}
          },
          style(){return getStyle(this.id)}
        },
        22: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动B升级',
          nameEN:'Automate B Upgrades',
          cost:n(64),
          unlocked(){return player.a.total.gte(this.cost.div(4))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          autoUpdate(diff){},
          style(){return getStyle(this.id)}
        },
        23: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'允许批量重置B',
          nameEN:'Bulk Resets B',
          cost:n(128),
          unlocked(){return player.a.total.gte(this.cost.div(4))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          autoUpdate(diff){},
          style(){return getStyle(this.id)}
        },
        24: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'B不再重置任何东西',
          nameEN:'B Resets Nothing',
          cost:n(1024),
          unlocked(){return player.a.total.gte(this.cost.div(4))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          autoUpdate(diff){},
          style(){return getStyle(this.id)}
        },
        31: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动G重置',
          nameEN:'Automate G Reset',
          cost:n(32),
          unlocked(){return true},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n间隔:${autoStat(this.id)}s(在不重置任何东西后自动每帧一次)`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>\n\nDelay:${autoStat(this.id)}s(Fires every tick if resets nothing)`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleNumberStat(this.id)},
          autoUpdate(diff){
            if(!autoActive(this.id)) return
            if(!layers["g"/* fix this */].layerShown()) return
            player.a[this.id].time += diff            
            if(autoStat(this.id).lte(player.a[this.id].time) || layers["g"/* fix this */].resetsNothing()){doReset("g"/* fix this */);player.a[this.id].time = 0}
          },
          style(){return getStyle(this.id)}
        },
        32: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动G升级',
          nameEN:'Automate G Upgrades',
          cost:n(64),
          unlocked(){return player.a.total.gte(this.cost.div(4))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          autoUpdate(diff){},
          style(){return getStyle(this.id)}
        },
        33: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'允许批量重置G',
          nameEN:'Bulk Resets G',
          cost:n(128),
          unlocked(){return player.a.total.gte(this.cost.div(4))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          autoUpdate(diff){},
          style(){return getStyle(this.id)}
        },
        34: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'G不再重置任何东西',
          nameEN:'G Resets Nothing',
          cost:n(1024),
          unlocked(){return player.a.total.gte(this.cost.div(4))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          autoUpdate(diff){},
          style(){return getStyle(this.id)}
        },
        41: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动T重置',
          nameEN:'Automate T Reset',
          cost:n(512),
          unlocked(){return true},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n间隔:${autoStat(this.id)}s(在不重置任何东西后自动每帧一次)`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>\n\nDelay:${autoStat(this.id)}s(Fires every tick if resets nothing)`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleNumberStat(this.id)},
          autoUpdate(diff){
            if(!autoActive(this.id)) return
            if(!layers["t"/* fix this */].layerShown()) return
            player.a[this.id].time += diff            
            if(autoStat(this.id).lte(player.a[this.id].time) || layers["t"/* fix this */].resetsNothing()){doReset("t"/* fix this */);player.a[this.id].time = 0}
          },
          style(){return getStyle(this.id)}
        },
        42: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动T购买项',
          nameEN:'Automate T Buyables',
          cost:n(2048),
          unlocked(){return true},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n间隔:${autoStat(this.id)}s(在不重置任何东西后自动每帧一次)`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>\n\nDelay:${autoStat(this.id)}s(Fires every tick if resets nothing)`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleNumberStat(this.id)},
          autoUpdate(diff){
            if(!autoActive(this.id)) return
            if(!layers["t"/* fix this */].layerShown()) return
            player.a[this.id].time += diff            
            if(autoStat(this.id).lte(player.a[this.id].time) || layers.t.resetsNothing()){
              for(i in layers.t.buyables){
                i = Number(i)
                if(!i) break
                buyBuyable("t"/* fix this */, i)
              }
              player.a[this.id].time = 0
            }
          },
          style(){return getStyle(this.id)}
        },
        43: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动T升级',
          nameEN:'Automate T Upgrades',
          cost:n(4096),
          unlocked(){return player.a.total.gte(this.cost.div(4))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          autoUpdate(diff){},
          style(){return getStyle(this.id)}
        },
        44: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'T不再重置任何东西',
          nameEN:'T Resets Nothing',
          cost:n(8192),
          unlocked(){return player.a.total.gte(this.cost.div(4))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          autoUpdate(diff){},
          style(){return getStyle(this.id)}
        },
        51: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动S重置',
          nameEN:'Automate S Reset',
          cost:n(2048),
          unlocked(){return true},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n间隔:${autoStat(this.id)}s(在不重置任何东西后自动每帧一次)`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>\n\nDelay:${autoStat(this.id)}s(Fires every tick if resets nothing)`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleNumberStat(this.id)},
          autoUpdate(diff){
            if(!autoActive(this.id)) return
            if(!layers["s"/* fix this */].layerShown()) return
            player.a[this.id].time += diff            
            if(autoStat(this.id).lte(player.a[this.id].time) || layers["s"/* fix this */].resetsNothing()){doReset("s"/* fix this */);player.a[this.id].time = 0}
          },
          style(){return getStyle(this.id)}
        },
        52: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动S购买项',
          nameEN:'Auto S Buyables',
          cost:n(2048),
          unlocked(){return true},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          autoUpdate(diff){
            if(!autoActive(this.id)) return
            if(!layers["s"/* fix this */].layerShown()) return
            for(i in layers.s.buyables){
              i = Number(i)
              if(!i) break
              buyBuyable("s"/* fix this */, i)
            }
          },
          style(){return getStyle(this.id)}
        },
        53: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'S不再重置任何东西',
          nameEN:'S Resets Nothing',
          cost:n(16384),
          unlocked(){return player.a.total.gte(this.cost.div(4))},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          autoUpdate(diff){},
          style(){return getStyle(this.id)}
        },
        61: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动U购买项',
          nameEN:'Automate U Buyables',
          cost:n(4096),
          unlocked(){return true},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else player.a[this.id].active = !player.a[this.id].active},
          autoUpdate(diff){
            if(!autoActive(this.id)) return
            for(i in layers.u1.buyables){
              i = Number(i)
              if(!i) break
              buyBuyable("u1"/* fix this */, i)
            }
          },
          style(){return getStyle(this.id)},
        },
        62: {
          canClick(){return autoBought(this.id)||player.a.points.gte(this.cost)},
          name:'自动NG-购买项',
          nameEN:'Automate NG- Buyables',
          cost:n(65536),
          unlocked(){return true},
          display() {if(!autoBought(this.id)) return `<h3>${this.name}</h3>\n\n价格: ${format(this.cost)}`;return `<h3>${this.name}</h3>\n\n计时频率升级最多使用${autoStat(this.id)}%的NG-点数`},
          displayEN() {if(!autoBought(this.id)) return `<h3>${this.nameEN}</h3>\n\nCost: ${format(this.cost)}`;return `<h3>${this.nameEN}</h3>\n\nTickspeed Upgrade uses at most ${autoStat(this.id)}% of NG- Points`},
          onClick(){if(!autoBought(this.id)) buyAuto(this.id,this.cost);else toggleNumberStat(this.id)},
          autoUpdate(diff){
            if(!autoActive(this.id)) return
            if(layers.ng.buyables[11].cost().lte(player.ng.points.mul(autoStat(this.id).div(100)))) buyBuyable("ng",11)
            buyBuyable("ng",12)
          },
          style(){return getStyle(this.id)},
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
      if(!ngSub()) return n(1e4)
      return n(100)
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        if(!ngSub()) mult = player.points.max(1).log10().div(4).pow(2)
        else mult = player.points.max(1).log10().div(2).pow(2)
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
    getNextAt(){
      if(!ngSub()) return ten.pow(getResetGain(this.layer).add(1).root(2).mul(4))
      return ten.pow(getResetGain(this.layer).add(1).root(2).mul(2))
    },

    hotkeys: [
      {key: "a", description: "A: A转",descriptionEN: "A: Reset A Node", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
  ],
}
var autoList = Object.assign({},layerA.clickables)
var setupList = {unlocked: true,points: new ExpantaNum(0),cd:new ExpantaNum(10)}
for(i in autoList) setupList[i] = {bought:false,stat:n(0),active:false,time:0,ngbought:false}
setupList[52] = {bought:false,stat:[],active:false}
addLayer("a", layerA)