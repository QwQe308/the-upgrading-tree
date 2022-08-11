addLayer("r", {
    symbol: "R",
    position: 0, 
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "pink",
    resource: "等级", 
    resourceEN: "Rank", // Name of prestige currency
    type: "static", 
    baseResource: "米",
    baseResourceEN: "Meters",
    baseAmount() {return player.points},
    //获取相关
    requires(){return n(10)},
    base(){
        return 2
    },
    exponent: 2,
    gainMult() { 
        mult = new ExpantaNum(1)
        if(hasAffix("r","Anti-condensed")){
            var pow = one
            pow = hasMSThenAdd("r",4,pow)
            mult = mult.mul(getNextAt("r").add(10).log10().pow(pow))
        }
        mult = hasMSThenMul("r",7,mult)
        return mult
    },
    gainExp() { 
        var exp = new ExpantaNum(1)
        exp = hasMSThenMul("l",3,exp)
        return exp
    },
    effectDescription(){return `总等级:${format(player.r.total)}`},
    row: 1, 
    layerShown(){return true},
    hotkeys: [
        {key: "r", description: "R: R转",descriptionEN: "R: Reset R Node", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    canReset(){
        return player.points.gte(this.requires()) && getResetGain("r").gte(hasAffix("r","Twin")?2:1)
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
            requirementDescription: "(1) 1等级",
            effectDescription(){return `加速度*(等级+1)^(lg(等级+1)+1). 当前:${format(this.effect())}`},
            effect(){return player.r.total.add(1).pow(player.r.total.add(1).log10().add(1))},
            done() { return player.r.points.gte(1) && this.unlocked()},
            unlocked() {return true},
        },
        2: {
            requirementDescription: "(2) 2等级",
            effectDescription(){return `速度*1.4^等级. 当前:${format(this.effect())}`},
            effect(){return n(1.4).pow(player.r.total)},
            done() { return player.r.points.gte(2) && this.unlocked()},
            unlocked() {return hasMilestone("r",this.id-1)},
        },
        3: {
            requirementDescription: "(3) 3等级",
            effectDescription(){return `解锁一个等级购买项.购买级别购买项时,你也会进行一次R重置.`},
            done() { return player.r.points.gte(3) && this.unlocked()},
            unlocked() {return hasMilestone("r",this.id-1)},
        },
        4: {
            requirementDescription: "(4) 4等级",
            effectDescription(){return `"反浓缩的"词缀对等级的效果额外触发log4(等级+1)次. 当前:${format(this.effect())}`},
            effect(){return player.r.total.add(1).logBase(4)},
            done() { return player.r.points.gte(4) && this.unlocked()},
            unlocked() {return hasMilestone("r",this.id-1)},
        },
        5: {
            requirementDescription: "(5) 5等级",
            effectDescription(){return `速度/4,加速度*4.`},
            done() { return player.r.points.gte(5) && this.unlocked()},
            unlocked() {return hasMilestone("r",this.id-1)},
        },
        6: {
            requirementDescription: "(6) 6等级",
            effectDescription(){return `获得一个额外的升级点.`},
            done() { return player.r.points.gte(6) && this.unlocked()},
            unlocked() {return hasMilestone("r",this.id-1)},
        },
        7: {
            requirementDescription: "(7) 7等级",
            effectDescription(){return `机械能降低级别价格. 当前:/${format(this.effect())}`},
            effect(){return player.e.points.add(1).pow(0.25)},
            done() { return player.r.points.gte(7) && this.unlocked()},
            unlocked() {return hasMilestone("r",this.id-1)},
        },
        8: {
            requirementDescription: "(8) 8等级",
            effectDescription(){return `机械能增幅加速度. 当前:x${format(this.effect())}`},
            effect(){return player.e.points.add(1).pow(0.2)},
            done() { return player.r.points.gte(8) && this.unlocked()},
            unlocked() {return hasMilestone("r",this.id-1)},
        },
        9: {
            requirementDescription: "(9) 9等级",
            effectDescription(){return `解锁下一个等级购买项.`},
            effect(){return player.e.points.add(1).pow(0.2)},
            done() { return player.r.points.gte(9) && this.unlocked()},
            unlocked() {return hasMilestone("r",this.id-1)},
        },
        10: {
            requirementDescription: "(10) 10等级",
            effectDescription(){return `等级增幅时间速率. 当前:x${format(this.effect())}`},
            effect(){return player.r.total.add(10).log10()},
            done() { return player.r.points.gte(10) && this.unlocked()},
            unlocked() {return hasMilestone("r",this.id-1)},
        },
    },
    buyables:{
        11: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = n(2).pow(x.add(1).pow(1.4)).mul(50)
                return c.floor()
            },
            display() { return `等级提升+<br />+${format(buyableEffect(this.layer,this.id),2)}额外等级(仅计入里程碑效果)<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}米(拥有:${format(player.points)})<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            displayEN() { return `Rank UP+<br />+${format(buyableEffect(this.layer,this.id),2)} Extra Rank (Only boosts milestones' effects)<br />Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} M(Currently:${format(player.points)})<br>Level:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                doReset(this.layer,true)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                return x
            },
            unlocked(){return hasMilestone("r",3)}
        },
        12: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = n(1e4).pow(x.add(1).pow(1.4)).mul(1e14)
                return c.floor()
            },
            display() { return `等级提升++<br />+${format(buyableEffect(this.layer,this.id),2)}额外等级(仅计入里程碑效果)<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}米(拥有:${format(player.points)})<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            displayEN() { return `Rank UP++<br />+${format(buyableEffect(this.layer,this.id),2)} Extra Rank (Only boosts milestones' effects)<br />Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} M(Currently:${format(player.points)})<br>Level:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                doReset(this.layer,true)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                return x.mul(2)
            },
            unlocked(){return hasMilestone("r",9)}
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
    update(diff){
        if(!affixENtoCH.condensed) updateAffix();
        if(options.ch) tmp[this.layer].resource = getAllAffix(this.layer)+layers[this.layer].resource
        else tmp[this.layer].resourceEN = getAllAffix(this.layer)+layers[this.layer].resourceEN
        player.r.total = player.r.points.add(buyableEffect("r",11))
        if(hasAffix("l","Low-Dimensional")) player.r.total = player.r.total.add(player.l.points.mul(2))
        player.r.total = player.r.total.mul(buyableEffect("c",21))
    },
    doReset(resettingLayer){
        var row = layers[resettingLayer].row
        if(row <= 1) return
        if(resettingLayer == "l") if(hasAffix("l","Low-Dimensional")){layerDataReset(this.layer,["buyables"]);return}
        layerDataReset(this.layer)
    },
    canBuyMax(){
        if(hasAffix("r","Twin")) return 2
        return 0
    },
})