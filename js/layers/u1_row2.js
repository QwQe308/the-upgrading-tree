addLayer("b", {
    name: "booster", 
    symbol: "B",
    position: -1, 
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "blue",
    resource: "倍增器", 
    resourceEN: "Boosters", // Name of prestige currency
    type: "static", 
    baseResource: "点数",
    baseResourceEN: "Points",
    baseAmount() {return player.points},
    requires(){return n(100)},
    base:20,
    exponent: 1.25,
    gainMult() { 
        mult = new ExpantaNum(1)
        mult = mult.mul(challengeEffect("u1",11))
        return mult
    },
    gainExp() { 
        var exp = n(1)
        return exp
    },
    row: 2, 
    branches:["p"],
    layerShown(){return hasUpgrade("u1",21)},
    effect(){
        var eff = n(1.5).pow(player[this.layer].points)
        if(hasMilestone("b",2)) eff = eff.pow(1.25)
        eff = hasUpgThenPow("b",12,eff)
        return eff
    },
    effectDescription(){return `倍增器使得点数*${format(this.effect())}`},
    effectDescriptionEN(){return `Boosts points by*${format(this.effect())}<br>I have to say that cost increase 20x every booster instead of 2x,because of a mistake.But it still would be useful and balanced later!`},
    hotkeys: [
        {key: "b", description: "B: B转",descriptionEN: "B: Reset B Node", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
            requirementDescriptionEN: "2 Boosters",
            effectDescription: "在b重置时保留p升级.",
            effectDescriptionEN: "Keep P upgrades on B reset.",
            done() { return player.b.points.gte(2) && this.unlocked()},
            unlocked() {return hasUpgrade("u1",31)},
        },
        2: {
            requirementDescription: "3倍增器",
            requirementDescriptionEN: "3 Boosters",
            effectDescription: "倍增器效果^1.25.",
            effectDescriptionEN: "Booster effect ^1.25.",
            done() { return player.b.points.gte(3) && this.unlocked()},
            unlocked() {return hasUpgrade("u1",31)},
        },
    },
    upgrades: {
        11: {
            description(){return "重置点效果基于倍增器增加."},
            descriptionEN: "Prestige Points\' effect is boosted by Boosters.",
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
            descriptionEN: "Boosters\' effect is boosted by Prestige Points.Reserved effect sounds fun.",
            effect(){
                var eff = player.p.points.add(1).log10().pow(0.5).div(10).add(1)
                return eff
            },
            effectDisplay(){return `^${format(this.effect())}`},
            cost(){return n(3)},
            unlocked() {return hasUpgrade("u1",31)},
        },
    },
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
    doReset(layer){
        if(layers[layer].row <= this.row) return
        if(hasMilestone("t",1)){
            layerDataReset(this.layer,["upgrades",'milestones'])
            return
        }
        else layerDataReset(this.layer)
    },
    resetsNothing(){return autoActive(24)},
    autoUpgrade(){return autoActive(22)},
    canBuyMax(){return autoActive(23)},
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
    resourceEN: "Generators", // Name of prestige currency
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already 
    baseResource: "点数",
    baseResourceEN: "Points",
    baseAmount() {return player.points},
    requires(){return n(200)},
    base:4,
    exponent: 1.2,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        mult = mult.mul(challengeEffect("u1",11))
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
        var eff = player[this.layer].power.div(4).add(1).pow(1.5).mul(n(1.1).pow(player[this.layer].power))
        eff = powsoftcap(eff,n(100),1.5)
        eff = expRootSoftcap(eff,n(100),1.5)
        return eff
    },
    effectDescription(){
        return `产生${format(this.proc())}能量/lg(t+1)^1.5<br>你有${format(player.g.power)}能量,能量使得时间速率*${format(this.effect())}`
    },
    effectDescriptionEN(){
        return `which produces ${format(this.proc())} Energy/lg(t+1)^1.5<br>You have ${format(player.g.power)} Energy,which boosts Time Speed by*${format(this.effect())}`
    },
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
    milestones: {
        1: {
            requirementDescription: "4发生器",
            requirementDescriptionEN: "4 Generators",
            effectDescription: "在G重置时保留P升级.",
            effectDescriptionEN: "Keep P upgrades.",
            done() { return player.g.points.gte(4) && this.unlocked()},
            unlocked() {return hasUpgrade("u1",32)},
        },
        2: {
            requirementDescription: "6发生器",
            requirementDescriptionEN: "6 Generators",
            effectDescription: "每秒获得10%的重置点.",
            effectDescriptionEN: "Gain 10% of Prestige Points on reset every second.",
            done() { return player.g.points.gte(6)  && this.unlocked()},
            unlocked() {return hasUpgrade("u1",32)},
        },
    },
    upgrades: {
        11: {
            description: "+3临时升级点.",
            descriptionEN: "+3 temporary Upgrade Points.",
            effect(){
                var eff = n(3)
                return eff
            },
            effectDisplay(){return `+${format(this.effect())}`},
            cost(){return n(3)},
            unlocked() {return hasUpgrade("u1",32)},
        },
        12: {
            description: "总升级点加成时间速率.",
            descriptionEN: "Upgrade Points boost Time Speed.",
            effect(){
                var eff = player.u1.total.div(9).pow(2.5).add(1)
                return eff
            },
            effectDisplay(){return `x${format(this.effect())}`},
            cost(){return n(5)},
            unlocked() {return hasUpgrade("u1",32)},
        },
    },
    doReset(layer){
        if(layers[layer].row <= this.row) return
        if(hasMilestone("t",1)){
            layerDataReset(this.layer,["upgrades",'milestones'])
            return
        }
        else layerDataReset(this.layer)
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

    hotkeys: [
        {key: "g", description: "G: G转",descriptionEN: "G: Reset G Node", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    canBuyMax(){return autoActive(33)},
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
    autoUpgrade(){return autoActive(32)},
    resetsNothing(){return autoActive(34)},
})
