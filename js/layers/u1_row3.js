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
    type: "static", 
    baseResource: "点数",
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
    effectDescription(){return `您有${format(player.t.te)}${hasUpgrade("t",11)?"":("/"+format(this.proc().mul(player.u1.total).pow(2).div(10)))}时间能量(+${format(this.proc())}/s${hasUpgrade("t",11)?"":",上限基于升级点"})<br>
    时间能量使得重置点*${format(this.effect())}`},
    hotkeys: [
        {key: "t", description: "T: T转", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    clickables: {
        11: {
            canClick(){return true},
            display() {return `长按以重置(手机端qol)`},
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
      player.t.te = player.t.te.add(this.proc().mul(diff)).min(this.proc().mul(player.u1.total).pow(2).div(10))
    },
    buyables:{
       11: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = x.pow(1.33).mul(3).add(12).floor()
                return c
            },
            display() { return `+1 额外时间胶囊.(购买时强制进行一次t转)<br />+${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}倍增器<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.b.points.gte(this.cost()) },
            buy() {
                player.b.points = player.b.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                doReset(this.layer,true)
                player.t.te = zero
            },
            effect(){
                var eff = getBuyableAmount(this.layer,this.id)
                return eff
            },
            unlocked(){return player.t.best.gt(0)},
            abtick:0,
            abdelay(){
                return 1e308
            }
        },
        12: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = x.pow(1.33).mul(3).add(20).floor()
                return c
            },
            display() { return `+1 额外时间胶囊.(购买时强制进行一次t转)<br />+${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}倍增器<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.b.points.gte(this.cost()) },
            buy() {
                player.b.points = player.b.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                doReset(this.layer,true)
                player.t.te = zero
            },
            effect(){
                var eff = getBuyableAmount(this.layer,this.id)
                return eff
            },
            unlocked(){return hasUpgrade("t",11)},
            abtick:0,
            abdelay(){
                return 1e308
            }
        },
    },
    milestones: {
        1: {
            requirementDescription: "2时间胶囊",
            effectDescription: "保留第二行节点升级和里程碑.",
            done() { return player.t.points.gte(2) && this.unlocked()},
            unlocked() {return true},
        },
    },
    upgrades: {
        11: {
            description: "解锁下一个T购买项.时间能量上限被移除.",
            cost(){return n(3)},
            unlocked() {return true},
        },
        12: {
            description: "能量倍增时间能量.",
            effect(){
                var eff = player.g.power.div(10).add(1)
                return eff
            },
            effectDisplay(){return `x${format(this.effect())}`},
            cost(){return n(4)},
            unlocked() {return true},
        },
    },
    resetsNothing(){return false},

})

addLayer("s", {
    name: "space", 
    symbol: "S",
    position: -1, 
    startData() { return {
        unlocked: true,
	      points: new ExpantaNum(0),
    }},
    color: "white",
    resource: "空间", 
    type: "static", 
    baseResource: "点数",
    baseAmount() {return player.points},
    requires(){return n(1e30).mul(n(1e9).pow(player.s.total.root(1.25)))},
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
        var eff = player.s.points.add(player.s.total.div(6)).add(1).log10().add(1)
        return eff
    },
    effectDescription(){return `空间建筑强度为${format(this.effect().mul(100))}%(基于空间,总空间和其他加成) 空间价格会逐渐变贵.`},
    hotkeys: [
        {key: "s", description: "S: S转", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    clickables: {
        11: {
            canClick(){return true},
            display() {return `长按以重置(手机端qol)`},
            onHold(){
                doReset(this.layer)
            }
        },
        12: {
            canClick(){return true},
            display() {return `重置S层级并让价格复原`},
            onClick(){
                if(!window.confirm("确认重置S层级?这不会保留任何S层级的东西!")) return
                layerDataReset(this.layer)
                doReset(this.layer,true)
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
                return c
            },
            display() { return `建筑1:基于点数倍增点数<br />x${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}空间<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.s.points.gte(this.cost()) },
            buy() {
                player.s.points = player.s.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){
                var x = getBuyableAmount(this.layer,this.id)
                if(x.gte(1)) x = x.add(0.5)
                var eff = expPow(player.points.add(10).log10(),2.5).pow(x.mul(layerEffect("s")).root(1.33))
                return eff
            },
            abtick:0,
            abdelay(){
                return 1e308
            }
        },
        12: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = x.add(2)
                return c
            },
            display() { return `建筑2:倍增时间速率<br />x${format(buyableEffect(this.layer,this.id),2)}.(下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}空间<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.s.points.gte(this.cost()) },
            buy() {
                player.s.points = player.s.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                var eff = ten.pow(x.mul(layerEffect("s")))
                return eff
            },
            abtick:0,
            abdelay(){
                return 1e308
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
            effectDisplay(){return `x${format(this.effect())}`},
            cost(){return n(5)},
            unlocked() {return true},
        },
    }, */
    resetsNothing(){return false},

})