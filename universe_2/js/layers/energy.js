function getUnstableE(){
    var energy = zero
    if(hasAchievement("ach",33)) energy = player.r.total.add(1).mul(player.l.points.add(1)).mul(4).pow(player.points.add(10).slog(10).sub(1).pow(2).mul(1.5).add(1)).sub(4)
    else energy = player.r.points.add(1).mul(player.l.points.add(1)).mul(4).pow(player.points.add(10).slog(10).sub(1).pow(2).mul(1.5).add(1)).sub(4)
    energy = hasUpgThenMul("e",13,energy)
    return energy.floor()
}
function getStableE(){
    var energy = getUnstableE().div(4)
    if(hasAchievement("ach",21)) energy = energy.mul(achievementEffect("ach",21))
    return energy.floor()
}
function getMaxEnergy(){
    var cap = n(100)
    cap = hasUpgThenMul("e",12,cap)
    cap = hasMSThenMul("l",1,cap)
    cap = hasUpgThenMul("u",22,cap)
    if(hasAchievement("ach",32)) cap = cap.mul(achievementEffect("ach",32))
    return cap
}

addLayer("e", {
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points:new ExpantaNum(0),
		costed: new ExpantaNum(0),
        energy: n(0),
        exchangedStableE:n(0),
        exchangedEnergy:n(0),
    }},
    color: "yellow",
    resource: "机械能", // Name of prestige currency
    resourceEN: "Mechanical Energy", 
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 3, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    //effectDescription(){return `+ ${format(this.getResetGain())} /s`},
    //effectDescriptionEN(){return `+ ${format(this.getResetGain())} /s`},
    layerShown(){return true},
    effect(){
        var eff = player.e.energy.div(100)
        eff = hasUpgThenMul("e",11,eff)
        return eff.max(0)
    },
    effectDescription(){
        return `
        你的机械能基于级别,阶层和距离,其中有${format(player.e.best)}是动能,${format(player.e.total)}是势能.(已使用:${format(player.e.costed)})<br>
        能量:${format(player.e.energy)}/${format(getMaxEnergy())}(-${format(this.decay(),3)}/s,基于距离,不受时间速率影响),使得速度*${format(this.effect(),3)}<br>
        ${(player.points.lt(1000000)?`由于疲惫,你的实际速度除以${format(player.u.spd.mul(getDistMult()).div(trueDistGain).mul(this.effect()).max(1))}(注:实际速度计入了距离倍率)<br>`:
        `由于疲惫,你的实际速度变为其${format(player.u.spd.mul(getDistMult()).mul(getTimeSpeed()).mul(this.effect()).logBase(trueDistGain).max(1))}次根(注:实际速度计入了距离倍率和时间速率)<br>`)}
        ${(player.u.spd.gte(getLightSpeed())?(`由于你的速度超过了光速,你的实际加速度变为其`+format(getAcc().mul(getTimeSpeed()).mul(getSpdMult()).logBase(trueSpdGain).max(0))+"次根"):"")}
    `},
    effectDescriptionEN(){
        return `
        Your ME is based on Rank, Tier and Distance, Which includes ${format(player.e.best)} Kinetic Energy, ${format(player.e.total)} Potential Energy.(Used: ${format(player.e.costed)})<br>
        Energy: ${format(player.e.energy)}/${format(getMaxEnergy())}(-${format(this.decay(),3)}/s,Based on Distance,Won't be influenced by timespeed),Which makes speed *${format(this.effect(),3)}<br>
        ${(player.points.lt(1000000)?`As you're tired,your real speed /${format(player.u.spd.mul(getDistMult()).div(trueDistGain).mul(this.effect()).max(1))}(Tip:Real Speed includes Distance Multpliers and Timespeed)<br>`:
        `As you're tired, your real speed to the ${format(player.u.spd.mul(getDistMult()).mul(getTimeSpeed()).mul(this.effect()).logBase(trueDistGain).max(1))}th root(Tip:Real Speed includes Distance Mult and Timespeed)<br>`)}
        ${(player.u.spd.gte(getLightSpeed())?(`As your speed is faster than light, your real Acceleration to the `+format(getAcc().mul(getTimeSpeed()).mul(getSpdMult()).logBase(trueSpdGain).max(0))+"th root"):"")}
    `},
    clickables:{
        11:{
            canClick(){return true},
            display() {return `恢复能量<br>进行一次能量重置,动能也会被重置.`},
            displayEN() {return `Recover your Energy<br>It does an Energy reset, and resets your E<sub>k</sub>.`},
            onClick(){
                player.e.best = zero
                player.e.energy = getMaxEnergy()
                player.e.points = player.e.best.add(player.e.total).sub(player.e.costed).max(0)
                doReset(this.layer)
                player.e.exchangedStableE = zero
            }
        }
    },
    upgrades:{
        11: {
            description:`能量效果被能量加成.`,
            descriptionEN:`Energy's effect is boosted by energy.`,
            effect(){
                var eff = player.e.energy.div(175).add(1)
                return eff
            },
            effectDisplay(){return `x${format(tmp[this.layer].upgrades[this.id].effect)}`},
            cost:n(10),
            pay(){
                player.e.points = player.e.points.sub(this.cost)
                player.e.costed = player.e.costed.add(this.cost)
            },
            canAfford(){return player.e.points.gte(this.cost)},
        },
        12: {
            description:`能量上限被机械能倍增.(同时增幅当前能量)`,
            descriptionEN:`Energy's cap is boosted by Mechanical Energy.(applied to current energy too)`,
            effect(){
                var eff = player.e.points.div(10).add(1).log10().add(1)
                return eff
            },
            effectDisplay(){return `x${format(tmp[this.layer].upgrades[this.id].effect)}`},
            cost:n(25),
            pay(){
                player.e.points = player.e.points.sub(this.cost)
                player.e.costed = player.e.costed.add(this.cost)
            },
            canAfford(){return player.e.points.gte(this.cost)},
        },
        13: {
            description:`动能被升级点增幅.`,
            descriptionEN:`Kinetic Energy is boosted by Upgrade Points.`,
            effect(){
                var eff = player.u.total.add(1).log10().div(2).add(1)
                return eff
            },
            effectDisplay(){return `x${format(tmp[this.layer].upgrades[this.id].effect)}`},
            cost:n(50),
            pay(){
                player.e.points = player.e.points.sub(this.cost)
                player.e.costed = player.e.costed.add(this.cost)
            },
            canAfford(){return player.e.points.gte(this.cost)},
        },
    },
    decay(){
        var decay = removeDistSC(player.points).mul(10).add(10).logBase(player.points.mul(10).add(10)).pow(3).sub(1).mul(2)
        decay = hasUpgThenDiv("u",11,decay)
        if(decay.isNaN() || decay.isneg() || decay.isInfinite()) return zero
        return decay
    },
    update(diff){
        player.e.energy = player.e.energy.sub(this.decay().mul(diff)).max(0).add(getMaxEnergy().sub(player.e.exchangedEnergy))//.min(getMaxEnergy())
        if(hasAchievement("ach",15)) player.e.energy = player.e.energy.max(achievementEffect("ach",15))
        player.e.exchangedEnergy = getMaxEnergy()
        player.e.best = player.e.best.max(getUnstableE())
        player.e.total = player.e.total.add(getStableE().sub(player.e.exchangedStableE).max(0))
        player.e.exchangedStableE = player.e.exchangedStableE.max(getStableE())
        player.e.points = player.e.best.add(player.e.total).sub(player.e.costed).max(0)
    },
    hotkeys: [
        {key: "e", description: "E: 恢复能量",descriptionEN: "E: Recover Energy", onPress(){layers.e.clickables[11].onClick()}},
    ],
})