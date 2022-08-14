addLayer("l", {
    symbol: "T",
    position: 0, 
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
    color: "lightblue",
    resource: "阶层", 
    resourceEN: "Tier", // Name of prestige currency
    type: "static", 
    baseResource: "级别",
    baseResourceEN: "Rank",
    baseAmount() {return player.r.points},
    //获取相关
    requires(){return n(4)},
    base(){
        return 1.5
    },
    exponent: 1,
    gainMult() { 
        mult = new ExpantaNum(1)
        if(hasAffix("l","Anti-condensed")) mult = mult.mul(getNextAt("l").add(10).log10())
        return mult
    },
    gainExp() { 
        var exp = new ExpantaNum(1)
        return exp
    },

    row: 2, 
    branches:["r"],
    layerShown(){return true},
    hotkeys: [
        {key: "t", description: "T: T转",descriptionEN: "T: Reset T Node", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    canReset(){
        return player.r.points.gte(this.requires()) && getResetGain("l").gte(hasAffix("l","Twin")?2:1)
    },
    //static gain
    getResetGain(){
        //cost = (base^(x^exp)*req/gainMult)^(1/gainExp) 注：原公式是*gainMult 但因为OmegaNum精确度问题改为除以.
        var base = this.base()
        if(this.baseAmount().lt(this.requires())) return new ExpantaNum(0)
        var gain = this.baseAmount().mul(this.gainMult()).div(this.requires()).pow(this.gainExp()).logBase(base).root(this.exponent).add(1).sub(player[this.layer].points).floor().max(0)
        if(!this.canBuyMax && gain.gte(1)) return new ExpantaNum(1)
        if(gain.gte(1)) if(!this.canBuyMax()) return new ExpantaNum(1)
        return gain.min(this.canBuyMax())
    },
    milestones: {
        1: {
            requirementDescription: "(1) 1阶层",
            requirementDescriptionEN: "(1) 1 Tier",
            effectDescription(){return `加速度*(升级点/2+1).每个阶层使能量+x0.15. 当前:${format(this.effect())}`},
            effectDescriptionEN(){return `Acceleration*(Upgrade Points/2+1).Each Tier makes Energy +x0.15. Currently:${format(this.effect())}`},
            effect(){return player.l.points.div(6.66666666666666).add(1)},
            done() {return player.l.points.gte(1) && this.unlocked()},
            unlocked() {return true},
        },
        2: {
            requirementDescription: "(2) 2阶层",
            requirementDescriptionEN: "(2) 2 Tier",
            effectDescription(){return `每个阶层使时间速率+x0.25. 当前:${format(this.effect())}`},
            effectDescriptionEN(){return `Each tier makes Timespeed +x0.25. Currently:${format(this.effect())}`},
            effect(){return player.l.points.div(4).add(1)},
            done() {return player.l.points.gte(2) && this.unlocked()},
            unlocked() {return hasMilestone("l",this.id-1)},
        },
        3: {
            requirementDescription: "(3) 3阶层",
            requirementDescriptionEN: "(3) 3 Tier",
            effectDescription(){return `阶层使级别的要求开根. 当前:${format(this.effect())}`},
            effectDescriptionEN(){return `Tier roots Rank's requirement. Currently:${format(this.effect())}`},
            effect(){return player.l.points.add(1).log10().div(3).add(1)},
            done() {return player.l.points.gte(3) && this.unlocked()},
            unlocked() {return hasMilestone("l",this.id-1)},
        },
        4: {
            requirementDescription: "(4) 4阶层",
            requirementDescriptionEN: "(4) 4 Tier",
            effectDescription(){return `每个阶层使得加速度*1.5. 当前:${format(this.effect())}`},
            effectDescriptionEN(){return `Each tier makes Acceleration *1.5. Currently:${format(this.effect())}`},
            effect(){return n(1.5).pow(player.l.points)},
            done() {return player.l.points.gte(4) && this.unlocked()},
            unlocked() {return hasMilestone("l",this.id-1)},
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
    canBuyMax(){
        if(hasAffix("l","Twin")) return 2
        return 0
    },
    update(diff){
        if(options.ch) tmp[this.layer].resource = getAllAffix(this.layer)+layers[this.layer].resource
        else tmp[this.layer].resourceEN = getAllAffix(this.layer)+layers[this.layer].resourceEN
    },
    resetsNothing(){return false},
})