addLayer("b", {
    name: "booster", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "blue",
    resource: "倍增器", // Name of prestige currency
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already 
    baseResource: "点数",
    baseAmount() {return player.points},
    requires(){return n(100)},
    base:20,
    exponent: 1.25,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        var exp = n(1)
        return exp
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    branches:["p"],
    layerShown(){return hasUpgrade("u1",21)},
    effect(){
        var eff = n(1.5).pow(player[this.layer].points)
        if(hasMilestone("b",2)) eff = eff.pow(1.25)
        eff = hasUpgThenPow("b",12,eff)
        return eff
    },
    effectDescription(){return `倍增器使得点数*${format(this.effect())}`},
    hotkeys: [
        {key: "b", description: "B: B转", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
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
    milestones: {
        1: {
            requirementDescription: "2倍增器",
            effectDescription: "保留p升级.",
            done() { return player.b.points.gte(2) && this.unlocked()},
            unlocked() {return hasUpgrade("u1",31)},
        },
        2: {
            requirementDescription: "3倍增器",
            effectDescription: "倍增器效果^1.25.",
            done() { return player.b.points.gte(3) && this.unlocked()},
            unlocked() {return hasUpgrade("u1",31)},
        },
    },
    upgrades: {
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
        12: {
            description: "倍增器效果基于重置点增加.",
            effect(){
                var eff = player.p.points.add(1).log10().pow(0.5).div(10).add(1)
                return eff
            },
            effectDisplay(){return `^${format(this.effect())}`},
            cost(){return n(3)},
            unlocked() {return hasUpgrade("u1",31)},
        },
    },
})






addLayer("g", {
    name: "generator", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
        power: new ExpantaNum(0)
    }},
    color: "green",
    resource: "发生器", // Name of prestige currency
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already 
    baseResource: "点数",
    baseAmount() {return player.points},
    requires(){return n(200)},
    base:4,
    exponent: 1.2,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        var exp = new ExpantaNum(1)
        return exp
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    branches:["p"],
    layerShown(){return hasUpgrade("u1",22)},
    proc(){
        var g = player[this.layer].points
        var eff = g.add(1).pow(0.5)
        return eff.sub(1)
    },
    effect(){
        var eff = player[this.layer].power.div(3).add(1).pow(1.5).mul(n(1.1).pow(player[this.layer].power))
        eff = powsoftcap(eff,n(100),2)
        eff = expRootSoftcap(eff,n(1000),1.5)
        return eff
    },
    effectDescription(){
        return `产生${format(this.proc())}能量/lg(t+1)^1.5<br>你有${format(player.g.power)}能量,能量使得时间速率*${format(this.effect())}`
    },
    //resetsNothing(){return hasMilestone("t",4)},
    milestones: {
        1: {
            requirementDescription: "4发生器",
            effectDescription: "保留p升级.",
            done() { return player.g.points.gte(4) && this.unlocked()},
            unlocked() {return hasUpgrade("u1",32)},
        },
        2: {
            requirementDescription: "6发生器",
            effectDescription: "每秒获得10%的重置点.",
            done() { return player.g.points.gte(6)  && this.unlocked()},
            unlocked() {return hasUpgrade("u1",32)},
        },
    },
    upgrades: {
        11: {
            description: "+3升级点.立即生效.",
            effect(){
                var eff = n(3)
                return eff
            },
            effectDisplay(){return `+${format(this.effect())}`},
            cost(){return n(3)},
            onPurchase(){player.u1.points = player.u1.points.add(3)},
            unlocked() {return hasUpgrade("u1",32)},
        },
        12: {
            description: "总升级点加成时间速率.",
            effect(){
                var eff = player.u1.total.div(8).pow(3).add(1)
                return eff
            },
            effectDisplay(){return `x${format(this.effect())}`},
            cost(){return n(5)},
            unlocked() {return hasUpgrade("u1",32)},
        },
    },
    //important!!!
    update(diff){
        player[this.layer].power = player.u1.t.add(1).log10().pow(1.5).mul(this.proc())
        //auto
        /*
        for(row=1;row<=1;row++){
            for(col=1;col<=3;col++){
                if(layers[this.layer].buyables[row*10+col]){
                    layers[this.layer].buyables[row*10+col].abtick += diff
                    if(layers[this.layer].buyables[row*10+col].abtick >= layers[this.layer].buyables[row*10+col].abdelay() && layers[this.layer].buyables[row*10+col].unlocked()){
                        layers[this.layer].buyables[row*10+col].buy()
                        layers[this.layer].buyables[row*10+col].abtick = 0
                    }
                }
            }
        }
        */
    },
    //canBuyMax(){return hasMilestone("g",3)},

    hotkeys: [
        {key: "g", description: "G: G转", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
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
})
