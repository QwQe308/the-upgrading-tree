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
    requires(){return n(1e15)},
    base:1e5,
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
    proc(){
      var proc = three.pow(player.t.points.add(buyableEffect("t",11))).mul(player.t.points).div(2)
      return proc
    },
    effect(){
        var eff = expRoot(player.t.te.add(10),0.8).div(10)
        //eff = expRootSoftcap(eff,n(1e50),1.625)
        return eff
    },
    effectDescription(){return `您有${format(player.t.te)}/${format(this.proc().mul(500))}时间能量(+${format(this.proc())}/s)<br>
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
      player.t.te = player.t.te.add(this.proc().mul(diff)).min(this.proc().mul(500))
    },
    buyables:{
       11: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = x.pow(1.5).mul(2).add(8).floor()
                return c
            },
            display() { return `+1 额外时间胶囊.(购买时强制进行一次t转)<br />+${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}倍增器<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.b.points.gte(this.cost()) },
            buy() {
                player.b.points = player.b.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                doReset(this.layer,true)
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
    },
    milestones: {
        1: {
            requirementDescription: "3时间胶囊",
            effectDescription: "保留第二行节点升级和里程碑.",
            done() { return player.t.points.gte(3) && this.unlocked()},
            unlocked() {return true},
        },
        2: {
            requirementDescription: "4时间胶囊",
            effectDescription: "自动倍增器.",
            done() { return player.t.points.gte(4) && this.unlocked()},
            unlocked() {return true},
        },
    }
    /*upgrades: {
        11: {
            description: "重置点效果基于倍增器增加.",
            effect(){
                var eff = player.b.points.pow(0.6).div(10).add(1)
                return eff
            },
            effectDisplay(){return `^${format(this.effect())}`},
            cost(){return n(2)},
            unlocked() {return hasUpgrade("u1",31)},
        },
    },
    */
})