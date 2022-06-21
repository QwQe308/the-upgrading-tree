function getU1TimeSpeed(){
    var timespeed = n(1)
    timespeed = hasUpgThenMul("u1",13,timespeed)
    timespeed = hasUpgThenMul("u1",14,timespeed)
    timespeed = timespeed.mul(layerEffect("g"))
    timespeed = hasUpgThenMul("g",12,timespeed)
    return timespeed
}

function resetU1Upgs(extraKeptUpgs = [],force = false,aReset= false){
  player.u1.t = n(0)
  if(!aReset){
    player.a.points = player.a.points.add(getResetGain('a'))
    player.a.total = player.a.total.add(getResetGain('a'))
    player.a.best = player.a.best.max(player.a.points)
  }
  var kept = extraKeptUpgs
  //for(i=41;i<=41;i+=10){
  //  if(layers.u1.upgrades[i].unlocked()){
  //    for(a=i-30;a<=i-26;a++) kept.push(a)
  //  }
  //}
  player.u1.upgrades=kept
  if(!force && !aReset){
    player.u1.points = player.u1.total
    player.u1.exchangedUnstableU1P = zero
    player.u1.baseUPLastReset = player.u1.total
  }
  doReset(this.layer)
  for(i=10;i>=1;i--) rowHardReset(i,"u1")
}

function getU1PointMult(){
    return layers.u1.gainMult()
}
function getU1TimeExp(){
    return layers.u1.gainExp()
}
function calcU1Point(){
    var mult = getU1PointMult()
    var t = player.u1.t
    var timeExp = getU1TimeExp()
    t = t.pow(timeExp)    
    var point = t.mul(mult)
    return point
}
function costU1Time(cost,getAReturnInsteadOfCost){
    var mult = getU1PointMult()
    var t = player.u1.t
    var timeExp = getU1TimeExp()
    t = t.pow(timeExp)    
    var point = t.mul(mult)
    point = point.sub(cost)
    t = point.div(mult).root(timeExp)
    if(getAReturnInsteadOfCost) return t
    player.u1.t = t
}
function getUnstableU1P(){
  var unstableU1P = zero
  unstableU1P = hasUpgThenAdd("g",11,unstableU1P)
  return unstableU1P
}

addLayer("u1", {
    name: "universe1", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		    points: new ExpantaNum(0),
        t:n(0),
        exchangedUnstableU1P:n(0),
        confirmWindow:true,
        baseUPLastReset:n(0)
    }},
    color: "lightblue",
    resource: "升级点", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        mult = mult.mul(layerEffect("p"))
        mult = mult.mul(layerEffect("b"))
        mult = hasUpgThenMul("u1",15,mult)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        var exp = n(0.5)
        exp = hasUpgThenAdd("u1",12,exp)
        exp = hasUpgThenAdd("u1",24,exp)
        exp = hasUpgThenAdd("u1",33,exp)
        exp = hasUpgThenMul("u1",42,exp)
        return exp
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    /*
    milestones:{
        1: {
            requirementDescription: "81升级点",
            effectDescription: "升级点->(升级点-81)^(1/1.5)+81.",
            done() { return player.b.points.gte(2) && this.unlocked()},
            unlocked() {return hasUpgrade("u1",31)},
        },
    },
    */
    buyables: {
        11: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = four.pow(x.add(1).pow(1.25))
                if(x.gte(24)) c = four.pow(expRoot(x,0.5))
                return c
            },
            display() { return `+1 升级点.(重置升级以获得)<br />+${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}点数<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return calcU1Point().gte(this.cost()) },
            buy() {
                costU1Time(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            //buyMax(){
                //var p = hasUpgrade("p",35)? player.p.points.pow(1.25) : player.p.points
                //if(hasUpgrade("p",61)) p = p.root(0.85)
                //var c = p.logBase(1.797e308).add(1).pow(125).sub(getBuyableAmount(this.layer, this.id)).min(upgradeEffect("p",34)).floor().max(0)
                //setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(c))
            //},
            effect(){
                var eff = getBuyableAmount(this.layer,this.id)
                return eff
            },
            //unlocked(){return hasUpgrade("p",25)&&upgradeEffect("p",25).gte(1)},
            abtick:0,
            abdelay(){
                return 1e308
            }
        },
        12: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = three.pow(x.add(2).pow(1.33))
                if(x.gte(6)) c = three.pow(x.add(2).pow(1.5))
                if(x.gte(18)) c = four.pow(expRoot(x,0.33))
                return c
            },
            display() { return `+1 升级点.(重置升级以获得)<br />+${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}重置点<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.p.points.gte(this.cost()) },
            buy() {
                player.p.points = player.p.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            //buyMax(){
                //var p = hasUpgrade("p",35)? player.p.points.pow(1.25) : player.p.points
                //if(hasUpgrade("p",61)) p = p.root(0.85)
                //var c = p.logBase(1.797e308).add(1).pow(125).sub(getBuyableAmount(this.layer, this.id)).min(upgradeEffect("p",34)).floor().max(0)
                //setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(c))
            //},
            effect(){
                var eff = getBuyableAmount(this.layer,this.id)
                return eff
            },
            unlocked(){return hasUpgrade("p",11)},
            abtick:0,
            abdelay(){
                return 1e308
            }
        },
        13: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = x.add(1).pow(1.25).floor()
                return c
            },
            display() { return `+1 升级点.(重置升级以获得)<br />+${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}倍增器<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.b.points.gte(this.cost()) },
            buy() {
                player.b.points = player.b.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            //buyMax(){
                //var p = hasUpgrade("p",35)? player.p.points.pow(1.25) : player.p.points
                //if(hasUpgrade("p",61)) p = p.root(0.85)
                //var c = p.logBase(1.797e308).add(1).pow(125).sub(getBuyableAmount(this.layer, this.id)).min(upgradeEffect("p",34)).floor().max(0)
                //setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(c))
            //},
            effect(){
                var eff = getBuyableAmount(this.layer,this.id)
                return eff
            },
            unlocked(){return hasUpgrade("u1",21)},
            abtick:0,
            abdelay(){
                return 1e308
            }
        },
        14: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = x.add(1).pow(1.25).mul(2).sub(1).floor()
                return c
            },
            display() { return `+1 升级点.(重置升级以获得)<br />+${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}发生器<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.g.points.gte(this.cost()) },
            buy() {
                player.g.points = player.g.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            //buyMax(){
                //var p = hasUpgrade("p",35)? player.p.points.pow(1.25) : player.p.points
                //if(hasUpgrade("p",61)) p = p.root(0.85)
                //var c = p.logBase(1.797e308).add(1).pow(125).sub(getBuyableAmount(this.layer, this.id)).min(upgradeEffect("p",34)).floor().max(0)
                //setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(c))
            //},
            effect(){
                var eff = getBuyableAmount(this.layer,this.id)
                return eff
            },
            unlocked(){return hasUpgrade("u1",22)},
            abtick:0,
            abdelay(){
                return 1e308
            }
        },
        21: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = x.add(1).pow(1.33).floor()
                if(x.gte(3)) c = x.pow(2)
                return c
            },
            display() { return `+2 升级点.(重置升级以获得)<br />+${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}时间胶囊<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.t.points.gte(this.cost()) },
            buy() {
                player.t.points = player.t.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            //buyMax(){
                //var p = hasUpgrade("p",35)? player.p.points.pow(1.25) : player.p.points
                //if(hasUpgrade("p",61)) p = p.root(0.85)
                //var c = p.logBase(1.797e308).add(1).pow(125).sub(getBuyableAmount(this.layer, this.id)).min(upgradeEffect("p",34)).floor().max(0)
                //setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(c))
            //},
            effect(){
                var eff = getBuyableAmount(this.layer,this.id).mul(2)
                return eff
            },
            unlocked(){return hasUpgrade("u1",41)},
            abtick:0,
            abdelay(){
                return 1e308
            }
        },
    },
    //layerShown(){return player.v.total.gte(1)},
    clickables: {
        11: {
            canClick(){return true},
            display() {return `重置升级<br />升级点恢复为 ${format(player.u1.total)}.(本轮获得${format(player.u1.total.sub(player.u1.baseUPLastReset))})<br />您在这一轮中获得了${format(player.u1.exchangedUnstableU1P)}临时升级点(当前值:${format(getUnstableU1P())})`},
            onClick(){
                if(player.u1.confirmWindow) if(!confirm("确定重置升级?")) return
                resetU1Upgs()
            }
        },
        12: {
            canClick(){return true},
            display() {return `禁用确认重置弹窗(${player.u1.confirmWindow?'未禁用':'已禁用'})`},
            onClick(){
                player.u1.confirmWindow = !player.u1.confirmWindow
            }
        },
    },
    upgrades: {
        11: {
            description(){return `u${this.id}:解锁节点P.`},
            cost(){return n(1)},
        },
        12: {
            description(){return `u${this.id}:t的指数+0.15.`},
            effect(){
                var eff = n(0.15)
                return eff
            },
            effectDisplay(){return `+${format(this.effect())}`},
            cost(){return n(1)},
        },
        13: {
            description(){return `u${this.id}:点数加成时间速率.(xlg(x+1)+1)`},
            effect(){
                var eff = player.points.add(1).log10().add(1)
                eff = hasUpgThenMul("u1",25,eff)
                return eff
            },
            effectDisplay(){return `x${format(this.effect())}`},
            cost(){return n(1)},
        },
        14: {
            description(){return `u${this.id}:时间加成时间速率.(xlg(x+10))`},
            effect(){
                var eff = player.u1.t.add(10).log10()
                eff = hasUpgThenMul("u1",25,eff)
                return eff
            },
            effectDisplay(){return `x${format(this.effect())}`},
            cost(){return n(1)},
        },
        15: {
            description(){return `u${this.id}:升级点总数倍增点数.(未获取的也计入)`},
            effect(){
                var eff = player.u1.total.pow(1.2).mul(0.15).add(1)
                return eff
            },
            effectDisplay(){return `x${format(this.effect())}`},
            cost(){return n(1)},
        },
        21: {
            description(){return `u${this.id}:解锁倍增器.Tips:你需要一个附近的升级才能购买!`},
            cost(){return n(3)},
            unlocked(){return player[this.layer].total.gte(3)},
            canAfford(){return checkAroundUpg(this.layer,this.id) && player[this.layer].points.gte(this.cost())}
        },
        22: {
            description(){return `u${this.id}:解锁发生器.`},
            cost(){return n(3)},
            unlocked(){return player[this.layer].total.gte(3)},
            canAfford(){return checkAroundUpg(this.layer,this.id) && player[this.layer].points.gte(this.cost())}
        },
        23: {
            description(){return `u${this.id}:解锁几个P升级.`},
            cost(){return n(3)},
            unlocked(){return player[this.layer].total.gte(3)},
            canAfford(){return checkAroundUpg(this.layer,this.id) && player[this.layer].points.gte(this.cost())}
        },
        24: {
            description(){return `u${this.id}:时间指数+0.15.`},
            cost(){return n(3)},
            unlocked(){return player[this.layer].total.gte(3)},
            canAfford(){return checkAroundUpg(this.layer,this.id) && player[this.layer].points.gte(this.cost())},
            effect(){
                var eff = n(0.15)
                return eff
            },
            effectDisplay(){return `+${format(this.effect())}`},
        },
        25: {
            description(){return `u${this.id}:u13和u14效果^1.5.`},
            cost(){return n(3)},
            unlocked(){return player[this.layer].total.gte(3)},
            canAfford(){return checkAroundUpg(this.layer,this.id) && player[this.layer].points.gte(this.cost())},
            effect(){
                var eff = n(1.5)
                return eff
            },
            effectDisplay(){return `^${format(this.effect())}`},
        },
        31: {
            description(){return `u${this.id}:解锁倍增器里程碑和升级.`},
            cost(){return n(9)},
            unlocked(){return player[this.layer].total.gte(15)},
            canAfford(){return checkAroundUpg(this.layer,this.id) && player[this.layer].points.gte(this.cost())},
        },
        32: {
            description(){return `u${this.id}:解锁发生器里程碑和升级.`},
            cost(){return n(9)},
            unlocked(){return player[this.layer].total.gte(15)},
            canAfford(){return checkAroundUpg(this.layer,this.id) && player[this.layer].points.gte(this.cost())},
        },
        33: {
            description(){return `u${this.id}:时间指数+0.2.`},
            cost(){return n(9)},
            unlocked(){return player[this.layer].total.gte(15)},
            canAfford(){return checkAroundUpg(this.layer,this.id) && player[this.layer].points.gte(this.cost())},
            effect(){
                var eff = n(0.2)
                return eff
            },
            effectDisplay(){return `+${format(this.effect())}`},
        },
        34: {
            description(){return `u${this.id}:重置点效果^1.2.`},
            cost(){return n(9)},
            unlocked(){return player[this.layer].total.gte(15)},
            canAfford(){return checkAroundUpg(this.layer,this.id) && player[this.layer].points.gte(this.cost())},
            effect(){
                var eff = n(1.2)
                return eff
            },
            effectDisplay(){return `^${format(this.effect())}`},
        },
        35: {
            description(){return `u${this.id}:解锁U挑战-1.`},
            cost(){return n(9)},
            unlocked(){return player[this.layer].total.gte(15)},
            canAfford(){return checkAroundUpg(this.layer,this.id) && player[this.layer].points.gte(this.cost())},
        },
        /*41: {
            description(){return `u${this.id}:解锁节点T.*注意:最高解锁升级层数-3及以下的升级会被保留.`},
            cost(){return n(24)},
            unlocked(){return player[this.layer].total.gte(50)},
            canAfford(){return checkAroundUpg(this.layer,this.id) && player[this.layer].points.gte(this.cost())},
        },
        42: {
            description(){return `u${this.id}:时间指数基于升级点倍增.`},
            cost(){return n(24)},
            unlocked(){return player[this.layer].total.gte(50)},
            canAfford(){return checkAroundUpg(this.layer,this.id) && player[this.layer].points.gte(this.cost())},
            effect(){
                var eff = player.u1.total.add(10).log10().sub(1).pow(0.75).div(5).add(1)
                return eff
            },
            effectDisplay(){return `x${format(this.effect(),3)}`},
        },
        43: {
            description(){return `u${this.id}:解锁节点S.`},
            cost(){return n(24)},
            unlocked(){return player[this.layer].total.gte(50)},
            canAfford(){return checkAroundUpg(this.layer,this.id) && player[this.layer].points.gte(this.cost())},
        },
        44: {
            description(){return `u${this.id}:解锁U挑战-2以及U挑战sp-1.`},
            cost(){return n(24)},
            unlocked(){return player[this.layer].total.gte(50)},
            canAfford(){return checkAroundUpg(this.layer,this.id) && player[this.layer].points.gte(this.cost())},
        },
        45: {
            description(){return `u${this.id}:解锁更多重置点升级.`},
            cost(){return n(24)},
            unlocked(){return player[this.layer].total.gte(50)},
            canAfford(){return checkAroundUpg(this.layer,this.id) && player[this.layer].points.gte(this.cost())},
        }, */
    },
    challenges: {
        11: {
            name(){return "C-1" + (hasUpgrade("u1",35)?"":"<text style='color:red'>(未解锁)</text>")},
            challengeDescription: "挑战就是没有挑战.进入条件:拥有10,000,000t.Tips:进入任何U挑战后您的升级会被重置,但花费的升级点不会返还!",
            onEnter(){
                resetU1Upgs([35],true)
            },
            enterReq(){return player.u1.t.gte(10000000)&&hasUpgrade("u1",35)},
            canComplete(){return player.points.gte(100000000)},
            goalDescription(){return format(ExpantaNum(100000000))+"点数"},
            rewardEffect(){return player.g.power.add(1).pow(this.unlocked()?1.875:1.25)},
            rewardDisplay(){return `倍增器和发生器价格除以(发生器能量+1)^1.25. (如果您解锁了C1,该效果再次^1.5) 当前效果:/${format(this.rewardEffect())}`},
            unlocked(){return layers[this.layer].upgrades[35].unlocked()}
        },
    },

    update(diff){
        player.u1.total = buyableEffect("u1",11).add(buyableEffect("u1",12)).add(buyableEffect("u1",13)).add(buyableEffect("u1",14)).add(buyableEffect("u1",21)).floor()
        if(player.u1.total.gte(81)) player.u1.total = player.u1.total.sub(81).root(1.5).add(81).floor()
        player.u1.t = player.u1.t.add(getU1TimeSpeed().mul(diff))
        player.points = calcU1Point()
        player.u1.points = player.u1.points.add(getUnstableU1P().sub(player.u1.exchangedUnstableU1P).max(0))
        player.u1.exchangedUnstableU1P = player.u1.exchangedUnstableU1P.max(getUnstableU1P())
    },
    doReset(resettingLayer){
        player.u1.t = n(0)
    },
})
