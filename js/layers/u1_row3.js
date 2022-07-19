addLayer("t", {
    name: "time", 
    symbol: "T",
    position: -1, 
    startData() { return {
        unlocked: true,
	      points: new ExpantaNum(0),
	      te: n(0)
    }},
    color: "lime",
    resource: "时间胶囊", 
    resourceEN: "Time Capsules", 
    type: "static", 
    baseResource: "点数",
    baseResourceEN: "Points",
    baseAmount() {return player.points},
    requires(){return n(1e20)},
    base:1e6,
    exponent: 2,
    gainMult() { 
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { 
        var exp = n(1)
        return exp
    },
    onPrestige(gain){player.t.te = zero},
    row: 3, 
    branches:["b"],
    layerShown(){return hasUpgrade("u1",41)},
    extraT(){
        var extra = buyableEffect("t",11)
        extra = extra.add(buyableEffect("t",12))
        return extra
    },
    proc(){
      var proc = three.pow(player.t.points.add(this.extraT())).mul(player.t.points.add(this.extraT())).div(3)
      proc = hasUpgThenMul(this.layer,12,proc)
      return proc
    },
    effect(){
        var eff = expRoot(player.t.te.mul(10).add(10),0.8).div(10)
        //eff = expRootSoftcap(eff,n(1e50),1.625)
        return eff
    },
    effectDescription(){return `您有${format(player.t.te)}${hasUpgrade("t",11)?"":("/"+format(this.proc().mul(player.u1.total.pow(2).div(10))))}时间能量(+${format(this.proc())}/s${hasUpgrade("t",11)?"":",上限基于升级点"})<br>时间能量使得重置点*${format(this.effect())}`},
    effectDescriptionEN(){return `You have ${format(player.t.te)}${hasUpgrade("t",11)?"":("/"+format(this.proc().mul(player.u1.total.pow(2).div(10))))} Time Energy(+${format(this.proc())}/s${hasUpgrade("t",11)?"":",Cap is based on Upgrade Points"})<br>Time Energy boosts Prestige Points by*${format(this.effect())}`},
    hotkeys: [
        {key: "t", description: "T: T转",descriptionEN: "T: Reset T Node", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    clickables: {
        11: {
            canClick(){return true},
            display() {return `长按以重置(手机端qol)`},
            displayEN() {return `Hold to reset (A QoL for mobile players)`},
            onHold(){
                doReset(this.layer)
            }
        },
    },
    //static gain
    getResetGain(){
        //cost = (base^(x^exp)*req/gainMult)^(1/gainExp) 注：原公式是*gainMult 但因为OmegaNum精确度问题改为除以.
        var base = this.base
        if(!this.base) base = new ExpantaNum(2)
        if(this.baseAmount().lt(this.requires())) return new ExpantaNum(0)
        var gain = this.baseAmount().mul(this.gainMult()).div(this.requires()).pow(this.gainExp()).logBase(base).root(this.exponent).add(1).sub(player[this.layer].points).floor().max(0)
        if(!this.canBuyMax && gain.gte(1)) return new ExpantaNum(1)
        if(gain.gte(1)) if(!this.canBuyMax()) return new ExpantaNum(1)
        return gain
    },
    update(diff){
      player.t.te = player.t.te.add(this.proc().mul(diff))
      if(!hasUpgrade("t",11)) player.t.te = player.t.te.min(this.proc().mul(player.u1.total.pow(2).div(10)))
    },
    buyables:{
       11: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = x.pow(1.33).mul(3).add(12).floor()
                return c
            },
            display() { return `+1 额外时间胶囊.(购买时强制进行一次t转)<br />+${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}倍增器<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            displayEN() { return `+1 Extra Time Capsule.(Calls T reset on bought)<br />+${format(buyableEffect(this.layer,this.id),2)}.<br />Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} Boosters<br>Level:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.b.points.gte(this.cost()) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                doReset(this.layer,autoActive(44))
                player.t.te = zero
                player.g.points = n(0)
                player.g.total = n(0)
                player.g.best = n(0)
            },
            effect(){
                var eff = getBuyableAmount(this.layer,this.id)
                return eff
            },
            unlocked(){return player.t.best.gt(0)},
        },
        12: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = x.pow(1.33).mul(3).add(20).floor()
                return c
            },
            display() { return `+1 额外时间胶囊.(购买时强制进行一次t转)<br />+${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}倍增器<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            displayEN() { return `+1 Extra Time Capsule.(Calls T reset on bought)<br />+${format(buyableEffect(this.layer,this.id),2)}.<br />Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} Boosters<br>Level:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.b.points.gte(this.cost()) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                doReset(this.layer,autoActive(44))
                player.t.te = zero
                player.g.points = n(0)
                player.g.total = n(0)
                player.g.best = n(0)
            },
            effect(){
                var eff = getBuyableAmount(this.layer,this.id)
                return eff
            },
            unlocked(){return hasUpgrade("t",11)},
        },
    },
    milestones: {
        1: {
            requirementDescription: "2时间胶囊",
            requirementDescriptionEN: "2 Time Capsules",
            effectDescription: "保留第二行节点升级和里程碑.",
            effectDescriptionEN: "Keep row 2 nodes\' Upgrades and Milestones.",
            done() { return player.t.points.gte(2) && this.unlocked()},
            unlocked() {return true},
        },
    },
    upgrades: {
        11: {
            description: "解锁下一个T购买项.时间能量上限被移除.",
            descriptionEN: "Unlock the next T buyable.Remove Time Energy cap.",
            cost(){return n(3)},
            unlocked() {return true},
        },
        12: {
            description: "能量倍增时间能量.",
            descriptionEN: "Energy boosts Time Energy.",
            effect(){
                var eff = player.g.power.div(10).add(1)
                return eff
            },
            effectDisplay(){return `x${format(tmp[this.layer].upgrades[this.id].effect)}`},
            cost(){return n(4)},
            unlocked() {return true},
        },
    },
    resetsNothing(){return autoActive(44)&&this.layerShown()},
    autoUpgrade(){return autoActive(43)},

})

addLayer("s", {
    name: "space", 
    symbol: "S",
    position: 1, 
    startData() { return {
        unlocked: true,
	      points: new ExpantaNum(0),
    }},
    color: "white",
    resource: "空间", 
    resourceEN: "Space", 
    type: "static", 
    baseResource: "点数",
    baseResourceEN: "Points",
    baseAmount() {return player.points},
    requires(){
        var inc = n(1e9).pow(player.s.total.root(1.25))
        if(hasUpgrade("g",25)) inc = inc.root(1.05)
        return n(1e30).mul(inc)
    },
    base(){return 1e9},
    exponent: 2,
    gainMult() { 
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { 
        var exp = n(1)
        return exp
    },
    onPrestige(gain){player.t.te = zero},
    row: 3, 
    branches:["g"],
    layerShown(){return hasUpgrade("u1",43)},
    effect(){
        var sp = player.s.points.add(player.s.total.div(6))
        if(hasUpgrade("u1",53)) sp = sp.pow(1.5).mul(2)
        var eff = sp.add(1).log10().add(1)
        return eff
    },
    effect2(){
        var eff = player.s.total.mul(2).root(2)
        eff = hasUpgThenMul("u1",53,eff)
        return eff.floor()
    },
    effectDescription(){return `空间建筑强度为${format(this.effect().mul(100))}%(基于空间,总空间和其他加成),获得${format(this.effect2())}额外升级点.<br>空间价格会逐渐变贵.`},
    effectDescriptionEN(){return `Building strength is ${format(this.effect().mul(100))}%(Based on Space,total Space and other boosts),get ${format(this.effect2())} Extra Upgrade Points based on Space.<br>Space becomes more expensive based on total Space.`},
    hotkeys: [
        {key: "s", description: "S: S转",descriptionEN: "S: Reset S Node", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    showBest:true,
    clickables: {
        11: {
            canClick(){return true},
            display() {return `长按以重置(手机端qol)`},
            displayEN() {return `Hold to reset (A QoL for mobile players)`},
            onHold(){
                doReset(this.layer)
            }
        },
        12: {
            canClick(){return true},
            display() {return `重置S层级(完全重置)并让价格复原`},
            displayEN() {return `Reset EVERYTHING in S layer to reset the cost`},
            onClick(){
                if(options.ch) if(!window.confirm("确认重置S层级?这不会保留任何S层级的东西!")) return
                if(!options.ch) if(!window.confirm("Are you sure to reset S layer?This won\'t keep ANYTHING in S layer!")) return
                layerDataReset("s")
                doReset("s",true)
                rowHardReset(1,this.layer)
                rowHardReset(2,this.layer)
                player.u1.t = n(0)
                player.points = calcU1Point()
            }
        },
    },
    //static gain
    getResetGain(){
        //cost = (base^(x^exp)*req/gainMult)^(1/gainExp) 注：原公式是*gainMult 但因为OmegaNum精确度问题改为除以.
        var base = this.base()
        if(!this.base) base = new ExpantaNum(2)
        if(this.baseAmount().lt(this.requires())) return new ExpantaNum(0)
        var gain = this.baseAmount().mul(this.gainMult()).div(this.requires()).pow(this.gainExp()).logBase(base).root(this.exponent).add(1).sub(player[this.layer].points).floor().max(0)
        if(!this.canBuyMax && gain.gte(1)) return new ExpantaNum(1)
        if(gain.gte(1)) if(!this.canBuyMax()) return new ExpantaNum(1)
        return gain
    },
    //update(diff){},
    buyables:{
        11: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = x.add(1)
                if(x.gte(4)) c = n(1.25).pow(x.sub(3)).mul(5)
                return c.floor()
            },
            display() { return `建筑1:基于点数倍增点数<br />x${format(buyableEffect(this.layer,this.id),2)}.(下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}空间<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            displayEN() { return `Buliding 1:Boost Points based on Points<br />x${format(buyableEffect(this.layer,this.id),2)}.(Next Level: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} Space<br>Level:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.s.points.gte(this.cost()) },
            buy() {
                if(!hasUpgrade("u1",53)) player.s.points = player.s.points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                if(x.gte(1)) x = x.add(0.5)
                var eff = expPow(player.points.add(10).log10(),2.5).pow(x.mul(layerEffect("s")).root(1.33))
                return eff
            },
        },
        12: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = x.add(2)
                if(x.gte(3)) c = n(1.2).pow(x.sub(2)).mul(5)
                return c.floor()
            },
            display() { return `建筑2:倍增时间速率<br />x${format(buyableEffect(this.layer,this.id),2)}.(下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}空间<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            displayEN() { return `Buliding 2:Boost Time Speed<br />x${format(buyableEffect(this.layer,this.id),2)}.(Next Level: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} Space<br>Level:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.s.points.gte(this.cost()) },
            buy() {
                if(!hasUpgrade("u1",53)) player.s.points = player.s.points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                var eff = six.pow(x.mul(layerEffect("s")))
                return eff
            },
            style(){
                return `{height: 200px;width: 200px}`
            }
        },
    },
    /* milestones: {
        1: {
            requirementDescription: "3时间胶囊",
            effectDescription: "保留第二行节点升级和里程碑.",
            done() { return player.t.points.gte(3) && this.unlocked()},
            unlocked() {return true},
        },
    }, */
    /* upgrades: {
        11: {
            description: "能量倍增时间能量.",
            effect(){
                var eff = player.g.power.add(1)
                return eff
            },
            effectDisplay(){return `x${format(tmp[this.layer].upgrades[this.id].effect)}`},
            cost(){return n(5)},
            unlocked() {return true},
        },
    }, */
    resetsNothing(){return autoActive(53)&&this.layerShown()},
})