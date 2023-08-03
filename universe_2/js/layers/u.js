var trueDistGain = n(0)
var lastTrueDistGain = n(0)
var trueSpdGain = n(0)
var metaupg = []
var metaBoost = n(localStorage.getItem("metaBoost2"))
var inf = n(1.79e308)

var rowCost = [1, 3, inf]

function getUsedUP() { var cost = zero; for (i in player.u.upgrades) cost = cost.add(layers.u.upgrades[player.u.upgrades[i]].cost); for (i = 2; i <= player.u.unlockedRows; i++) cost = cost.add(rowCost[i - 1]); return cost }
function hasMetaUpgrade(id) { return metaupg.includes(id.toString()) }

function resetUpgs(extraKeptUpgs = [], force = false, aReset = false) {
    layers.u.doReset("u")
    if (!aReset) layers.aff.doReset("u")
    player.points = zero
    if (player.a.cd.lte(0) && !aReset) {
        player.a.points = player.a.points.add(getResetGain('a'))
        player.a.total = player.a.total.add(getResetGain('a'))
        player.a.best = player.a.best.max(player.a.points)
    }
    player.a.cd = n(10)
    var kept = extraKeptUpgs
    player.u.upgrades = kept
    if (!force && !aReset) {
        player.u.points = player.u.total
        player.u.exchangedUnstableUP = zero
    }
    if (aReset) {
        player.u.points = player.u.points.add(player.u.total.sub(player.u.baseUPLastReset).max(0))
        player.u.baseUPLastReset = player.u.total
    }
    player.u.baseUPLastReset = player.u.total
    for (i = 10; i >= 1; i--) rowHardReset(i, "u")
    player.u.resetTime = 0
    var upg = []
    for (i = 1; i <= 56; i++) {
        if (player.u.upgrades.includes(i)) upg.push(i)
    }
    if ((!force) && (!aReset)) player.u.unlockedRows = 1
    player.u.upgrades = upg
    updateTemp()
    updateTemp()
}

//

function getUnstableUP() {
    var unstableUP = zero
    if (hasMilestone("r", 6)) unstableUP = unstableUP.add(1)
    if (hasAffix("l", "Cautious")) unstableUP = unstableUP.add(player.l.points.min(player.aff.points))
    return unstableUP.floor()
}
function getTimeSpeed() {
    var timespeed = n(1)
    //对于时间速率的加成
    timespeed = timespeed.mul(metaBoost)
    timespeed = hasMSThenMul("l", 2, timespeed)
    timespeed = hasMSThenMul("r", 10, timespeed)
    if (hasAchievement("ach", 14)) mult = mult.mul(achievementEffect("ach", 14))

    //对于时间的加成
    timespeed = hasUpgThenMul("u", 14, timespeed)
    timespeed = hasUpgThenMul("u", 24, timespeed)
    timespeed = timespeed.mul(buyableEffect("c", 22))
    return timespeed
}
function getDistMult() {
    var mult = one
    mult = mult.mul(buyableEffect("c", 11))
    mult = hasUpgThenMul("u", 15, mult)
    if (hasAchievement("ach", 13)) mult = mult.mul(achievementEffect("ach", 13))
    return mult
}
function getSpdMult() {
    var mult = one
    mult = mult.mul(buyableEffect("c", 12))
    mult = hasUpgThenMul("u", 12, mult)
    if (hasMilestone("r", 5)) mult = mult.div(4)
    if (hasAchievement("ach", 12)) mult = mult.mul(achievementEffect("ach", 12))
    if (hasAchievement("ach", 21)) mult = mult.mul(achievementEffect("ach", 21))
    return mult
}
function getAcc() {
    var acc = n(0.01)
    acc = hasMSThenMul("r", 1, acc)
    if (hasMilestone("r", 5)) acc = acc.mul(4)
    acc = hasMSThenMul("r", 8, acc)
    if (hasMilestone("l", 1)) acc = acc.mul(player.u.total.div(2).add(1))
    acc = hasMSThenMul("l", 4, acc)
    acc = hasUpgThenMul("u", 25, acc)
    if (hasAchievement("ach", 31)) acc = acc.mul(achievementEffect("ach", 31))
    acc = acc.mul(acc.add(10).log10().pow(getBuyableAmount("c", 13)))
    return acc
}

//

var baseLightSpeed = n(299792458)
function getLightSpeed() {
    var lightSpeed = baseLightSpeed
    return lightSpeed
}
function applyDistSC(d) {
    return expRoot(d.add(1).mul(10), 1.25).div(10).sub(1)
}
function removeDistSC(d) {
    return expPow(d.add(1).mul(10), 1.25).div(10).sub(1)
}
function applySpdSC(spd) {
    return expRootSoftcap(spd, getLightSpeed(), 1.25)
}
function removeSpdSC(spd) {
    return antiExpRootSoftcap(spd, getLightSpeed(), 1.25)
}
function addDist(gain) {
    player.points = applyDistSC(removeDistSC(player.points).add(gain))
}
function addSpd(gain) {
    player.u.spd = applySpdSC(removeSpdSC(player.u.spd).add(gain))
}



addLayer("u", {
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            //extra
            spd: zero,
            trueSpd: zero,
            t: zero,
            unlockedRows: 1,
            //base
            unlocked: true,
            points: new ExpantaNum(0),
            exchangedUnstableUP: n(0),
            confirmWindow: true,
            baseUPLastReset: n(0),
            MetaReset: null,
            real: zero,
            bestPoint: zero,
        }
    },
    color: "lightblue",
    resource: "升级点", // Name of prestige currency
    resourceEN: "Upgrade Points", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    effectDescription() {
        let str = `<br>您已使用${format(getUsedUP())}升级点`
        if (player.u.total.neq(player.u.real)) str += `<br>(真实升级点:${format(player.u.real)})`
        return str
    },
    effectDescriptionEN() {
        let str = `<br>You've Used ${format(getUsedUP())} Upgrade Points`
        if (player.u.total.neq(player.u.real)) str += `<br>(Real Upgrade Point: ${format(player.u.real)})`
        return str
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    buyables: {
        11: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = x.add(1).pow(1.33)
                return c.floor()
            },
            display() { return `+1 升级点.(重置U或A以获得)<br />+${format(buyableEffect(this.layer, this.id), 2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}级别<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            displayEN() { return `+1 Upgrade Points.(Do U or A reset to gain)(Tip:U reset means reset U upgs)<br />+${format(buyableEffect(this.layer, this.id), 2)}.<br />Cost:${format(this.cost(getBuyableAmount(this.layer, this.id)))} Ranks<br>Level:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.r.points.gte(this.cost()) },
            buy() {
                player.r.points = player.r.points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                var eff = getBuyableAmount(this.layer, this.id)
                return eff
            },
        },
        12: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = x.add(1)
                return c.floor()
            },
            display() { return `+1 升级点.(重置U或A以获得)<br />+${format(buyableEffect(this.layer, this.id), 2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}阶层<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            displayEN() { return `+1 Upgrade Points.(Do U or A reset to gain)(Tip:U reset means reset U upgs)<br />+${format(buyableEffect(this.layer, this.id), 2)}.<br />Cost:${format(this.cost(getBuyableAmount(this.layer, this.id)))} Tier<br>Level:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.l.points.gte(this.cost()) },
            buy() {
                player.l.points = player.l.points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                var eff = getBuyableAmount(this.layer, this.id)
                return eff
            },
        },
        13: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = n(2).pow(x.add(3).pow(1.25).add(1))
                if (x.gte(9)) c = n(2).pow(x.mul(1.33).pow(1.33).add(1))
                return c.floor()
            },
            display() { return `+1 升级点.(重置U或A以获得)<br />+${format(buyableEffect(this.layer, this.id), 2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}机械能(不消耗)<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            displayEN() { return `+1 Upgrade Points.(Do U or A reset to gain)(Tip:U reset means reset U upgs)<br />+${format(buyableEffect(this.layer, this.id), 2)}.<br />Cost:${format(this.cost(getBuyableAmount(this.layer, this.id)))} Mechanical Energy (Won't be used)<br>Level:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.e.points.gte(this.cost()) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                var eff = getBuyableAmount(this.layer, this.id)
                return eff
            },
        },
    },
    clickables: {
        11: {
            canClick() { return true },
            display() {
                let str = `重置升级<br />升级点恢复为 ${format(player.u.total)}.`
                if (player.u.total.sub(player.u.baseUPLastReset).gt(0)) str += `(本轮获得${format(player.u.total.sub(player.u.baseUPLastReset).max(0))})`
                if (player.u.exchangedUnstableUP.gt(0)) str += `<br />您在这一轮中获得了${format(player.u.exchangedUnstableUP)}临时升级点(当前值:${format(getUnstableUP())})`
                return str
            },
            displayEN() {
                let str = `Reset Upgrades<br />Upgrade Points will be ${format(player.u.total)}.`
                if (player.u.total.sub(player.u.baseUPLastReset).gt(0)) str += `(Gained ${format(player.u.total.sub(player.u.baseUPLastReset))} this reset)`
                if (player.u.exchangedUnstableUP.gt(0)) str += `<br />You have ${format(player.u.exchangedUnstableUP)} temporary Upgrade Points now(Current gained:${format(getUnstableUP())})`
                return str
            },
            onClick() {
                if (options.ch) if (player.u.confirmWindow) if (!confirm("确定重置升级?")) return
                if (!options.ch) if (player.u.confirmWindow) if (!confirm("Are you sure to RESET YOUR U UPGRADES?")) return
                resetUpgs()
            }
        },
        12: {
            canClick() { return true },
            display() { return `禁用确认重置弹窗(${player.u.confirmWindow ? '未禁用' : '已禁用'})` },
            displayEN() { return `Disable \'Reset Upgrades\' confirm window in U layer(${player.u.confirmWindow ? (options.ch ? "未禁用" : "Enabled") : (options.ch ? "已禁用" : "Disabled")})` },
            onClick() {
                player.u.confirmWindow = !player.u.confirmWindow
            }
        },
        13: {
            canClick() { return true },
            display() { return `强制进行A重置(CD未到无自动化点奖励)<br />获得${format(player.u.total.sub(player.u.baseUPLastReset))}升级点` },
            displayEN() { return `Do \'A\' force reset(no AP reward while CD isn\'t over)<br />Gain ${format(player.u.total.sub(player.u.baseUPLastReset))} Upgrade Points` },
            onClick() {
                resetUpgs(player.u.upgrades, true)
            }
        },
        14: {
            title: "返回元宇宙",
            titleEN: "Return to the Meta Universe",
            onClick() { window.location.href = "../index.html" },
            canClick: true
        },
        31: {
            canClick() { return player.u.points.gte(this.cost()) && getUsedUP().gte(this.cost()) },
            display() { return `这个宇宙有点不一样...?宇宙似乎对外来者充满敌意,除去速度什么的,升级也被限制住了,我们得用一些升级点打破这道阻碍.<br>用${format(this.cost())}升级点解锁下一排升级.(你必须先使用等量的升级点!)(同时也可能有新内容解锁!)` },
            displayEN() { return `Something seems different in this universe...? Everything in this universe was limited, such as speed, energy...and upgrades. Break The Limit with your Upgrade Points!<br>Use ${format(this.cost())} Upgrade Points to break the limit.(You have to spend UPs equal or greater than this amount first!) (Something new may be unlocked at the same time.)` },
            cost(x = player.u.unlockedRows) {
                return rowCost[x]
            },
            onClick() {
                player.u.points = player.u.points.sub(this.cost())
                player.u.unlockedRows++
            },
            style() { return { height: "80px", width: "500px" } },
            unlocked() {return player.u.total.gte(3)},
        },
    },
    upgrades: {
        11: {
            description: `u11:能量降低速度基于升级点减缓.`,
            descriptionEN: `u11:Slow down energy drop rate based on Upgrade Points.`,
            effect() {
                var eff = player.u.total.add(1).log10().div(1.2).add(1)
                return eff
            },
            effectDisplay() { return `/${format(tmp[this.layer].upgrades[this.id].effect)}` },
            cost: n(1),
            unlocked() {return player.u.total.gte(1)},
        },
        12: {
            description: `u12:速度被升级点加成.`,
            descriptionEN: `u12:Speed is boosted based on Upgrade Points.`,
            effect() {
                var eff = player.u.total.add(1).log10().div(1.5).add(1).pow(2)
                return eff
            },
            effectDisplay() { return `x${format(tmp[this.layer].upgrades[this.id].effect)}` },
            cost: n(1),
            unlocked() {return player.u.total.gte(1)},
        },
        13: {
            description: `u13:解锁层级“浓缩”.`,
            descriptionEN: `u13:Unlock "Condenser" layer.`,
            cost: n(1),
            unlocked() {return player.u.total.gte(1)},
        },
        14: {
            description: `u14:浓缩0.5次时间.`,
            descriptionEN: `u14:Condense time 0.5 times.`,
            effect() {
                var eff = player.u.t.add(10).log10().pow(0.5)
                return eff
            },
            effectDisplay() { return `x${format(tmp[this.layer].upgrades[this.id].effect)}` },
            cost: n(1),
            unlocked() {return player.u.total.gte(1)},
        },
        15: {
            description: `u15:升级点倍增距离.`,
            descriptionEN: `u15:Distance is boosted based on Upgrade Points.`,
            effect() {
                var eff = player.u.total.add(1).log10().add(1).pow(2)
                return eff
            },
            effectDisplay() { return `x${format(tmp[this.layer].upgrades[this.id].effect)}` },
            cost: n(1),
            unlocked() {return player.u.total.gte(1)},
        },
        21: {
            description: `u21:解锁减益词缀:高维的<br>解锁增益词缀:低维的.`,
            descriptionEN: `u21:Unlock "High-Dimensional" and "Low-Dimensional" affixs.`,
            cost: n(3),
            unlocked() { return player.u.unlockedRows >= 2 },
            canAfford() { return checkAroundUpg(this.layer, Number(this.id)) && player[this.layer].points.gte(this.cost) },
        },
        22: {
            description: `u22:总计词缀点加成能量上限.`,
            descriptionEN: `u22:Energy Cap is boosted based on total Affix Points.`,
            effect() {
                var eff = player.aff.total.add(1).log10().add(1).pow(1.25)
                return eff
            },
            effectDisplay() { return `x${format(tmp[this.layer].upgrades[this.id].effect)}` },
            cost: n(3),
            unlocked() { return player.u.unlockedRows >= 2 },
            canAfford() { return checkAroundUpg(this.layer, Number(this.id)) && player[this.layer].points.gte(this.cost) },
        },
        23: {
            description: `u23:解锁级别低效浓缩器.`,
            descriptionEN: `u23:Unlock "Rank Slow Condenser".`,
            cost: n(3),
            unlocked() { return player.u.unlockedRows >= 2 },
            canAfford() { return checkAroundUpg(this.layer, Number(this.id)) && player[this.layer].points.gte(this.cost) },
        },
        24: {
            description: `u24:浓缩0.75次时间.`,
            descriptionEN: `u24:Condense time 0.75 times.`,
            effect() {
                var eff = player.u.t.add(10).log10().pow(0.75)
                return eff
            },
            effectDisplay() { return `x${format(tmp[this.layer].upgrades[this.id].effect)}` },
            cost: n(3),
            unlocked() { return player.u.unlockedRows >= 2 },
            canAfford() { return checkAroundUpg(this.layer, Number(this.id)) && player[this.layer].points.gte(this.cost) },
        },
        25: {
            description: `u25:距离倍增加速度.`,
            descriptionEN: `u25:Acceleration is boosted based on Distance.`,
            effect() {
                var eff = player.points.add(10).log10()
                return eff
            },
            effectDisplay() { return `x${format(tmp[this.layer].upgrades[this.id].effect)}` },
            cost: n(3),
            unlocked() { return player.u.unlockedRows >= 2 },
            canAfford() { return checkAroundUpg(this.layer, Number(this.id)) && player[this.layer].points.gte(this.cost) },
        },
    },

    update(diff) {
        //calc
        var lastDist = player.points
        lastTrueDistGain = trueDistGain
        addSpd(getAcc().mul(diff).mul(getTimeSpeed()).mul(getSpdMult()))
        player.u.trueSpd = player.u.spd.mul(layerEffect("e"))
        addDist(player.u.trueSpd.mul(diff).mul(getTimeSpeed()).mul(getDistMult()))
        trueDistGain = player.points.sub(lastDist).div(diff)
        trueSpdGain = trueDistGain.sub(lastTrueDistGain).div(diff)
        player.u.t = player.u.t.add(getTimeSpeed())
        //base
        player.u.real = zero
        for (i in player.u.buyables) player.u.real = player.u.real.add(buyableEffect("u", i))
        if (hasMetaUpgrade(14)) player.u.real = player.u.real.mul(player.u.real.mul(2).add(1).log10().add(10).log10())
        player.u.real = player.u.real.floor()
        player.u.total = player.u.real.max(player.u.total)
        player.u.points = player.u.points.add(getUnstableUP().sub(player.u.exchangedUnstableUP).max(0))
        player.u.exchangedUnstableUP = player.u.exchangedUnstableUP.max(getUnstableUP())
        player.u.bestPoint = player.u.bestPoint.max(player.points)
        if (player.u.activeChallenge) if (!hasUpgrade("u", layers.u.challenges[player.u.activeChallenge].baseUPG)) player.u.activeChallenge = null
    },
    doReset(resettingLayer) {
        player.u.t = zero
        player.u.spd = zero
        player.u.trueSpd = zero
        trueDistGain = zero
        trueSpdGain = zero
        lastTrueDistGain = zero
        player.points = zero

        layers.ach.doReset(resettingLayer)
    },
})

setInterval(
    function () {
        if (localStorage.getItem("MetaReset") != player.u.MetaReset) {
            for (i in player.u.buyables) player.u.buyables[i] = zero
            resetUpgs()
            player.u.MetaReset = localStorage.getItem("MetaReset")
        }
        metaupg = localStorage.getItem("metaupg").split(",")
        metaBoost = n(localStorage.getItem("metaBoost2"))
    }, 1000
)