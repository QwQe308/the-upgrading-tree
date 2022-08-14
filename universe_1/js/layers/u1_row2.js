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
    base(){
        return 20
    },
    exponent: 1.25,
    gainMult() { 
        mult = new ExpantaNum(1)
        mult = mult.mul(challengeEffect("u1",11))
        return mult
    },
    gainExp() { 
        var exp = n(1)
        exp = hasUpgThenMul("g",31,exp)
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
        var base = this.base()
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
            description: "重置点效果基于倍增器增加.",
            descriptionEN: "Prestige Points\' effect is boosted by Boosters.",
            effect(){
                var eff = player.b.points.pow(0.6).div(10).add(1)
                return eff
            },
            effectDisplay(){return `^${format(tmp[this.layer].upgrades[this.id].effect)}`},
            cost(){return n(2)},
            unlocked() {return hasUpgrade("u1",31)},
        },
        12: {
            description: "倍增器效果基于重置点增加.",
            descriptionEN: "Boosters\' effect is boosted by Prestige Points.Reversed effect sounds fun.",
            effect(){
                var eff = player.p.points.add(1).log10().pow(0.5).div(10).add(1)
                return eff
            },
            effectDisplay(){return `^${format(tmp[this.layer].upgrades[this.id].effect)}`},
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
        if(layers[layer].row == "side") layerDataReset(this.layer)
        if(layers[layer].row <= this.row) return
        if(hasMilestone("t",1)){
            layerDataReset(this.layer,["upgrades",'milestones'])
            return
        }
        else layerDataReset(this.layer)
    },
    resetsNothing(){return autoActive(24)&&this.layerShown()},
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
        power: new ExpantaNum(0),
        unl:[],
        upgStat:{
            15:true,
            21:true,
            24:true,
            25:true,
            33:true,
        },
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
        exp = hasUpgThenMul("g",31,exp)
        return exp
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    branches:["p"],
    layerShown(){return hasUpgrade("u1",22)},
    proc(){
        var g = player[this.layer].points
        var eff = g.add(1).pow(0.5).sub(1)
        eff = hasUpgThenMul("u1",51,eff)
        eff = hasUpgThenMul("g",35,eff)
        return eff
    },
    effect(){
        var eff = player[this.layer].power.div(4).add(1).pow(1.5).mul(n(1.1).pow(player[this.layer].power))
        eff = powsoftcap(eff,n(100),1.5)
        eff = expRootSoftcap(eff,n(100),1.5)
        eff = expRootSoftcap(eff,n(1e32),1.25)
        eff = expRootSoftcap(eff,n(1.79e308),1.33)
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
            effectDisplay(){return `+${format(tmp[this.layer].upgrades[this.id].effect)}`},
            cost(){return n(3)},
            unlocked() {return hasUpgrade("u1",32)},
        },
        12: {
            description: "总升级点加成时间速率.",
            descriptionEN: "Upgrade Points boost Time Speed.",
            effect(){
                var eff = player.u1.total.div(9).pow(2.5).add(1)
                if(ngSub()) eff = eff.div(1600).add(1).pow(2)
                return eff
            },
            effectDisplay(){return `x${format(tmp[this.layer].upgrades[this.id].effect)}`},
            cost(){return n(5)},
            unlocked() {return hasUpgrade("u1",32)},
        },
        13: {
            description: "<text style='color:blue'>不劳无获:处于NG-挑战中.</text>计时频率升级效果底数基于发生器数量增加.",
            descriptionEN: "<text style='color:blue'>REQUIREMENT:in NG-.</text>Tickspeed Upgrade's base is boosted based on Generators.",
            effect(){
                var eff = player.g.points.div(10).add(10).log10().sqrt()
                return eff
            },
            effectDisplay(){return `x${format(tmp[this.layer].upgrades[this.id].effect)}${player.g.unl.includes(this.id)?"":`<text style='color:red'>(${options.ch?"未解锁":"Locked"})</text>`}`},
            cost:n(64),
            onPurchase(){
                if(!player.g.unl.includes(this.id)) player.g.unl.push(this.id)
            },
            canAfford(){return (ngSub() || player.g.unl.includes(this.id)) && player.g.points.gte(this.cost) },
            unlocked() {return hasUpgrade("u1",54)},
        },
        14: {
            description: "<text style='color:blue'>勤俭节约:使用不超过169升级点.</text>升级点加成时间速率.",
            descriptionEN: "<text style='color:blue'>Use less than or equal 169 Upgrade Points.</text>Upgrade Points boost Timespeed.",
            effect(){
                var eff = n(1.1).pow(player.u1.total.root(1.69))
                return eff
            },
            effectDisplay(){
                return `x${format(tmp[this.layer].upgrades[this.id].effect)}${player.g.unl.includes(this.id)?"":`<text style='color:red'>(${options.ch?"未解锁":"Locked"})</text>`}`
            },
            cost:n(81),
            onPurchase(){
                if(!player.g.unl.includes(this.id)) player.g.unl.push(this.id)
            },
            canAfford(){return (getUsedUP().lte(169) || player.g.unl.includes(this.id)) && player.g.points.gte(this.cost) },
            unlocked() {return hasUpgrade("u1",54)},
        },
        15: {
            description: "<text style='color:blue'>不骄不躁:在BGT三个层级中,不获得任何里程碑.</text>每个里程碑给予1临时升级点.",
            descriptionEN: "<text style='color:blue'>Do not get milestones in B&G&T.</text>Every milestone give 1 temporary upgrade points.",
            cost:n(81),
            onPurchase(){
                if(!player.g.unl.includes(this.id)) player.g.unl.push(this.id)
            },
            effect(){
                var eff = zero
                for(i in ["b","g","t"]) for(i2 in player[["b","g","t"][i]].milestones) eff = eff.add(1)
                return eff
            },
            effectDisplay(){
                return `+${format(tmp[this.layer].upgrades[this.id].effect)}${player.g.unl.includes(this.id)?"":`<text style='color:red'>(${options.ch?"未解锁":"Locked"})</text>`}`
            },
            canAfford(){return (player.g.upgStat[15] || player.g.unl.includes(this.id)) && player.g.points.gte(this.cost) },
            unlocked() {return hasUpgrade("u1",54)},
        },
        21: {
            description: "<text style='color:blue'>跨越P层级?</text>NG点加成重置点.",
            descriptionEN: "<text style='color:blue'>Do not gain Prestige Points.</text>NG Points boost Prestige Points.",
            effect(){
                var eff = player.ng.points.add(1).sqrt()
                return eff
            },
            effectDisplay(){return `x${format(tmp[this.layer].upgrades[this.id].effect)}${player.g.unl.includes(this.id)?"":`<text style='color:red'>(${options.ch?"未解锁":"Locked"})</text>`}`},
            cost:n(49),
            onPurchase(){
                if(!player.g.unl.includes(this.id)) player.g.unl.push(this.id)
            },
            canAfford(){return (player.g.upgStat[21] || player.g.unl.includes(this.id)) && player.g.points.gte(this.cost) },
            unlocked() {return hasUpgrade("u1",54)},
        },
        22: {
            description: "<text style='color:blue'>时不我待:在C-2中进入NG-.</text>时间指数+0.08.",
            descriptionEN: "<text style='color:blue'>Get into NG- while doing C-2.</text>Time Exponent +0.08.",
            effect(){
                var eff = n(0.08)
                return eff
            },
            effectDisplay(){return `+${format(tmp[this.layer].upgrades[this.id].effect)}${player.g.unl.includes(this.id)?"":`<text style='color:red'>(${options.ch?"未解锁":"Locked"})</text>`}`},
            cost:n(12),
            onPurchase(){
                if(!player.g.unl.includes(this.id)) player.g.unl.push(this.id)
            },
            canAfford(){return (inChallenge("u1",12) && ngSub() || player.g.unl.includes(this.id)) && player.g.points.gte(this.cost) },
            unlocked() {return hasUpgrade("u1",54)},
        },
        23: {
            description: "<text style='color:blue'>挑战自我:在C3中.</text>点数倍率^1.02.",
            descriptionEN: "<text style='color:blue'>Do C-3.</text>Points multplier ^1.02.",
            effect(){
                var eff = n(1.02)
                return eff
            },
            effectDisplay(){return `^${format(tmp[this.layer].upgrades[this.id].effect)}${player.g.unl.includes(this.id)?"":`<text style='color:red'>(${options.ch?"未解锁":"Locked"})</text>`}`},
            cost:n(24),
            onPurchase(){
                if(!player.g.unl.includes(this.id)) player.g.unl.push(this.id)
            },
            canAfford(){return (inChallenge("u1",21) || player.g.unl.includes(this.id)) && player.g.points.gte(this.cost) },
            unlocked() {return hasUpgrade("u1",54)},
        },
        24: {
            description: "<text style='color:blue'>静态时间:不获得发生器,得到1e16t.</text>基于升级点,本次U&A重置所用的现实时间和t,增幅时间速率.",
            descriptionEN: "<text style='color:blue'>Do not gain Generator,and get 1e16 t.</text>Boost Timespeed based on real time this U&A reset,Upgrade points and t.",
            effect(){
                var eff = player.u1.total.div(25).add(1).pow(Math.log10(player.u1.resetTime)/1.8).pow(player.u1.t.add(1e10).log10().log10().pow(2))
                return eff
            },
            effectDisplay(){return `x${format(tmp[this.layer].upgrades[this.id].effect)}${player.g.unl.includes(this.id)?"":`<text style='color:red'>(${options.ch?"未解锁":"Locked"})</text>`}`},
            cost:n(0),
            onPurchase(){
                if(!player.g.unl.includes(this.id)) player.g.unl.push(this.id)
            },
            canAfford(){return (player.g.upgStat[24] && player.u1.t.gte(1e16) || player.g.unl.includes(this.id)) && player.g.points.gte(this.cost) },
            unlocked() {return hasUpgrade("u1",54)},
        },
        25: {
            description: "<text style='color:blue'>万物归一:每行同一时间只能拥有一种重置资源,得到1e169点数.</text>空间要求额外提高速度减缓.",
            descriptionEN: "<text style='color:blue'>Get 1e169 points with one kind of resource per tree row.</text>Space extra cost-scaling is nerfed.",
            cost:n(0),
            onPurchase(){
                if(!player.g.unl.includes(this.id)) player.g.unl.push(this.id)
            },
            canAfford(){return (player.g.upgStat[25] && player.points.gte(1e169) || player.g.unl.includes(this.id)) && player.g.points.gte(this.cost) },
            unlocked() {return hasUpgrade("u1",54)},
            effectDisplay(){
                return `^(1/1.05)${player.g.unl.includes(this.id)?"":`<text style='color:red'>(${options.ch?"未解锁":"Locked"})</text>`}`
            },
        },
        31: {
            description: "<text style='color:blue'>极限规划:使用不超过216个升级点.</text>升级点使得B&G层级价格开根.",
            descriptionEN: "<text style='color:blue'>Use less than or equal 216 Upgrade Points.</text>Upgrade Points nerf B&G cost.",
            effect(){
                var eff = player.u1.total.add(1).log10().div(12).pow(2).add(1)
                return eff
            },
            effectDisplay(){return `^(1/${format(tmp[this.layer].upgrades[this.id].effect)})${player.g.unl.includes(this.id)?"":`<text style='color:red'>(${options.ch?"未解锁":"Locked"})</text>`}`},
            cost:n(196),
            onPurchase(){
                if(!player.g.unl.includes(this.id)) player.g.unl.push(this.id)
            },
            canAfford(){return (getUsedUP().lte(216) && player.u1.t.gte(1e9) || player.g.unl.includes(this.id)) && player.g.points.gte(this.cost) },
            unlocked() {return hasUpgrade("u1",54)},
        },
        32: {
            description: "<text style='color:blue'>时光回溯:在NG-中进行C2的情况下,获得1e24t.</text>时间指数+0.08.",
            descriptionEN: "<text style='color:blue'>Get 1e24t while doing NG- in C-2.</text>Time expontnt +0.08.",
            effect(){
                var eff = n(0.08)
                return eff
            },
            effectDisplay(){return `+${format(tmp[this.layer].upgrades[this.id].effect)}${player.g.unl.includes(this.id)?"":`<text style='color:red'>(${options.ch?"未解锁":"Locked"})</text>`}`},
            cost:n(16),
            onPurchase(){
                if(!player.g.unl.includes(this.id)) player.g.unl.push(this.id)
            },
            canAfford(){return (inChallenge("u1",12) && ngSub() && player.u1.t.gte(1e24) || player.g.unl.includes(this.id)) && player.g.points.gte(this.cost) },
            unlocked() {return hasUpgrade("u1",54)},
        },
        33: {
            description: "<text style='color:blue'>超脱凡物:在NG-中,不购买计时频率升级.</text>计时频率升级的效果一定程度上增幅点数倍率.",
            descriptionEN: "<text style='color:blue'>Do not get Tickspeed Upgrade in NG-.</text>Tickspeed Upgrade slightly boosts Points.",
            effect(){
                var eff = buyableEffect("ng",11).pow(0.4)
                return eff
            },
            effectDisplay(){return `x${format(tmp[this.layer].upgrades[this.id].effect)}${player.g.unl.includes(this.id)?"":`<text style='color:red'>(${options.ch?"未解锁":"Locked"})</text>`}`},
            cost:n(128),
            onPurchase(){
                if(!player.g.unl.includes(this.id)) player.g.unl.push(this.id)
            },
            canAfford(){return (player.g.upgStat[33] && ngSub() || player.g.unl.includes(this.id)) && player.g.points.gte(this.cost) },
            unlocked() {return hasUpgrade("u1",54)},
        },
        34: {
            description: "<text style='color:blue'>挑战极限:在C3中,进入NG-.</text>C1的奖励一定程度上倍增点数.",
            descriptionEN: "<text style='color:blue'>Do NG- in C-3.</text>C1's reward slightly boosts points.",
            effect(){
                var eff = challengeEffect("u1",11).root(2.5)
                return eff
            },
            effectDisplay(){return `x${format(tmp[this.layer].upgrades[this.id].effect)}${player.g.unl.includes(this.id)?"":`<text style='color:red'>(${options.ch?"未解锁":"Locked"})</text>`}`},
            cost:n(12),
            onPurchase(){
                if(!player.g.unl.includes(this.id)) player.g.unl.push(this.id)
            },
            canAfford(){return (inChallenge("u1",21) && ngSub() || player.g.unl.includes(this.id)) && player.g.points.gte(this.cost) },
            unlocked() {return hasUpgrade("u1",54)},
        },
        35: {
            description: "<text style='color:blue'>细致入微:购买该升级时,UPBGTS六个节点中非U购买项等级和升级的总和是100以内的素数(质数),各个节点内部也满足这一条件.</text>U节点升级总数增幅能量获取.",
            descriptionEN: "<text style='color:blue'>Each nodes' combined bought buyables and upgrades have to be prime numbers below 100, and the total number of bought buyables and upgrades should follow this rule too. (all layers must be unlocked, U is included with U buyables & automation excluded, each layer's total's are considered seperately. *If you're confused, see your U layer and there's a small tip.*)</text>U upgrades boosts energy.",
            effect(){
                var eff = n(player.u1.upgrades.length).div(196).add(1)
                return eff
            },
            effectDisplay(){return `x${format(tmp[this.layer].upgrades[this.id].effect)}${player.g.unl.includes(this.id)?"":`<text style='color:red'>(${options.ch?"未解锁":"Locked"})</text>`}`},
            cost:n(999),
            onPurchase(){
                if(!player.g.unl.includes(this.id)) player.g.unl.push(this.id)
            },
            canAfford(){
                var u = player.u1.upgrades.length;var p = player.p.upgrades.length;var b = player.b.upgrades.length;var g = player.g.upgrades.length;var t = player.t.upgrades.length+(player.t.buyables[11].add(player.t.buyables[12]).toNumber())
                var s = player.s.buyables[11].add(player.s.buyables[12]).toNumber()
                return ((
                prime.includes(u) && prime.includes(p) && prime.includes(b) && prime.includes(g) && prime.includes(t) && prime.includes(s)
                && prime.includes(u+p+b+g+t+s)
            ) || player.g.unl.includes(this.id)) && player.g.points.gte(this.cost) },
            unlocked() {return hasUpgrade("u1",54)},
        },
    },
    doReset(layer){
        if(layers[layer].row == "side") layerDataReset(this.layer,["unl"])
        if(layers[layer].row <= this.row) return
        if(hasMilestone("t",1)){
            layerDataReset(this.layer,["upgrades",'milestones',"unl","upgStat"])
            return
        }
        else layerDataReset(this.layer,["unl","upgStat"])
    },
    //important!!!
    update(diff){
        player[this.layer].power = player.u1.t.add(1).log10().pow(1.5).mul(this.proc())
        if(hasMilestone("b",1) || hasMilestone("g",1) || hasMilestone("t",1)) player.g.upgStat[15] = false
        if(player.p.points.neq(0)) player.g.upgStat[21] = false
        if(player.g.points.neq(0)) player.g.upgStat[24] = false
        if((player.g.points.neq(0) && player.b.points.neq(0)) || (player.t.points.neq(0) && player.s.points.neq(0))) player.g.upgStat[25] = false
        if(player.ng.buyables[11].neq(0)) player.g.upgStat[33] = false
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
    resetsNothing(){return autoActive(34)&&this.layerShown()},
})
