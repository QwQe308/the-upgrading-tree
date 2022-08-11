addLayer("ach", {
    symbol: "ACH", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
        stat:{
            14:0,
            15:false,
            25:0,
        },
    }},
    color: "gold",
    resource: "成就点", // Name of prestige currency
    resourceEN: "Achievement Points", // Name of prestige currency
    effectDescription(){return `第x行的成就给予2^(x-1)成就点.`},
    effectDescriptionEN(){return `Row x Achievement gives 2^(x-1) Achievement Points.`},
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already 
    row: "side", // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    achievements: {
        11: {
            name: "第一个总是简单的",
            tooltip(){return `获得一个等级.奖励:这么简单还想要奖励?`},
            done(){return player.r.points.gte(1)},
            onComplete(){player[this.layer].points = player[this.layer].points.add(2**Math.floor(Number(this.id)/10-1))},
        },
        12: {
            name: "第二个就不那么简单了",
            tooltip(){return `获得一个阶级.奖励:每个成就点使得速度*1.1.(${format(tmp.ach.achievements[this.id].effect)})`},
            effect(){return n(1.1).pow(player.ach.points)},
            done(){return player.l.points.gte(1)},
            onComplete(){player[this.layer].points = player[this.layer].points.add(2**Math.floor(Number(this.id)/10-1))},
        },
        13: {
            name: "浓缩!",
            tooltip(){return `获得一个距离浓缩器.奖励:每个距离浓缩器使得距离*1.1.(${format(tmp.ach.achievements[this.id].effect)})`},
            effect(){return n(1.1).pow(player.c.buyables[11])},
            done(){return player.c.buyables[11].gte(1)},
            onComplete(){player[this.layer].points = player[this.layer].points.add(2**Math.floor(Number(this.id)/10-1))},
        },
        14: {
            name: "长跑",
            tooltip(){return `一轮能量重置中,能量降低至1前,至少坚持了3分钟(当前:${formatTime(player.ach.stat[14])}).奖励:时间速率*1.1.`},
            effect(){return n(1.1)},
            done(){return player.ach.stat[14] >= 180},
            onComplete(){player[this.layer].points = player[this.layer].points.add(2**Math.floor(Number(this.id)/10-1))},
        },
        15: {
            name: "脉动回来",
            tooltip(){return `一轮能量重置中,在能量耗尽后重新让你的能量大于0.奖励:能量不会低于1.`},
            effect(){
                var eff = n(1)
                if(hasAchievement("ach",25)) eff = eff.mul(achievementEffect("ach",25))
                return eff
            },
            done(){return player.ach.stat[15] && player.e.energy.gt(0)},
            onComplete(){player[this.layer].points = player[this.layer].points.add(2**Math.floor(Number(this.id)/10-1))},
        },
        21: {
            name: "重力加速度",
            tooltip(){return `加速度至少达到9.80665m/s^2.奖励:动能转换为势能的转化率*1.2.`},
            effect(){return n(1.2)},
            done(){return getAcc().gte(9.80665)},
            onComplete(){player[this.layer].points = player[this.layer].points.add(2**Math.floor(Number(this.id)/10)-1)},
        },
        22: {
            name: "超音速",
            tooltip(){return `速度至少达到340m/s.奖励:每个速度浓缩器使得速度*1.1.(x${format(tmp.ach.achievements[this.id].effect)})`},
            effect(){return n(1.1).pow(player.c.buyables[12])},
            done(){return player.u.trueSpd.gte(340)},
            onComplete(){player[this.layer].points = player[this.layer].points.add(2**Math.floor(Number(this.id)/10-1))},
        },
        23: {
            name: "等级提升!",
            tooltip(){return `解锁第二排升级.奖励:每个成就点使得等级价格/1.1.(/${format(tmp.ach.achievements[this.id].effect)})`},
            effect(){return n(1.1).pow(player.ach.points)},
            done(){return player.u.trueSpd.gte(340)},
            onComplete(){player[this.layer].points = player[this.layer].points.add(2**Math.floor(Number(this.id)/10-1))},
        },
        24: {
            name: "攀登高山",
            tooltip(){return `由于疲惫造成的现实速度减缓达到/1024.奖励:每个成就点使得自动化点获取要求/1.1.(/${format(tmp.ach.achievements[this.id].effect)},最大为1000)`},
            effect(){return n(1.1).pow(player.ach.points).min(1000)},
            done(){return player.u.spd.mul(getDistMult()).div(trueDistGain).mul(this.effect()).gte(1024)},
            onComplete(){player[this.layer].points = player[this.layer].points.add(2**Math.floor(Number(this.id)/10-1))},
        },
        25: {
            name: "匍匐前行",
            tooltip(){return `在能量为1的状态下,进行五次等级重置(包括额外等级).奖励:成就15的效果被升级点增幅.(x${format(tmp.ach.achievements[this.id].effect)})`},
            effect(){return player.u.total.add(1).log10().add(1)},
            done(){return player.ach.stat[25]>=5},
            onComplete(){player[this.layer].points = player[this.layer].points.add(2**Math.floor(Number(this.id)/10-1))},
        },
        31: {
            name: "光的信使",
            tooltip(){return `前行一光年(9.46e15米).奖励:每个成就点使得加速度*1.1.(x${format(tmp.ach.achievements[this.id].effect)})`},
            effect(){return player.ach.points.add(1).log10().add(1)},
            done(){return player.points.gte(9.46e15)},
            onComplete(){player[this.layer].points = player[this.layer].points.add(2**Math.floor(Number(this.id)/10-1))},
        },
        32: {
            name: "能量过载",
            tooltip(){return `能量大于上限.奖励:每个升级点使得能量+x0.01.(x${format(tmp.ach.achievements[this.id].effect)})`},
            effect(){return player.u.total.div(100).add(1)},
            done(){return player.e.energy.gte(getMaxEnergy())},
            onComplete(){player[this.layer].points = player[this.layer].points.add(2**Math.floor(Number(this.id)/10-1))},
        },
        33: {
            name: "弹跳式起步",
            tooltip(){return `机械能大于1e6.奖励:在能量公式中,等级使用“总等级”而不是原等级.`},
            done(){return player.e.points.gte(1e6)},
            onComplete(){player[this.layer].points = player[this.layer].points.add(2**Math.floor(Number(this.id)/10-1))},
        },
        34: {
            name: "留有退路",
            tooltip(){return `留有2词缀点的情况下,达到光速.奖励:解锁增益词缀-谨慎的.`},
            done(){return player.aff.points.gte(2) && player.u.spd.gte(299792458)},
            onComplete(){player[this.layer].points = player[this.layer].points.add(2**Math.floor(Number(this.id)/10-1))},
        },
        35: {
            name: "真反浓缩",
            tooltip(){return `总浓缩器数低于或等于-18.奖励:解锁时间低效浓缩器.`},
            done(){return player.c.points.lte(-18)},
            onComplete(){player[this.layer].points = player[this.layer].points.add(2**Math.floor(Number(this.id)/10-1))},
        },
    },
    update(diff){
        if(player.e.energy.gt(1)) player.ach.stat[14] += diff
        if(player.e.energy.eq(0)) player.ach.stat[15] = true
    },
    doReset(l){
        var row = layers[l].row
        if(row == "side") row = 10

        if(l == "r"){
            if(player.e.energy.eq(1)) player.ach.stat[25] ++
        }
        if(row >= 3){
            player.ach.stat[14] = 0
            player.ach.stat[15] = false
        }
    }
})
