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
        var gain = this.baseAmount().mul(this.gainMult()).div(this.requires()).pow(this.gainExp()).logBase(this.base).root(this.exponent).add(1).sub(player[this.layer].points).floor().max(0)
        if(!this.canBuyMax && gain.gte(1)) return new ExpantaNum(1)
        if(gain.gte(1)) if(!this.canBuyMax()) return new ExpantaNum(1)
        return gain
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
        return eff
    },
    effectDescription(){
        return `产生${format(this.proc())}能量/lg(t+1)^1.5<br>你有${format(player.g.power)}能量,能量使得时间速率*${format(this.effect())}`
    },
    //resetsNothing(){return hasMilestone("t",4)},
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
    //milestones: {
    //    0: {
    //        requirementDescription: "2发生器",
    //        effectDescription: "让B层级的软上限更软一点.(? (^0.1 -> ^0.2)",
    //        done() { return player.g.points.gte(2) }
    //    },
    //},
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