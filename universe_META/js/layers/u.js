var colorList = ['grey','red','lightblue','green','pink','blue','purple','yellow','lime',"white"]
function color(num){
    num = num.toNumber()%colorList.length
    return colorList[num]
}
function getTimeSpeed(){
    var timespeed = one
    timespeed = hasUpgThenMul("u",11,timespeed)
    if(hasChallenge('u',11)) timespeed = timespeed.mul(challengeEffect('u',11)[1])
    return timespeed
}
function getUsedUP(){
    var cost = zero
    for(i in player.u.upgrades) cost = cost.add(layers.u.upgrades[player.u.upgrades[i]].cost)
    return cost
}
function resetUpgs(extraKeptUpgs = [],force = false){
    var kept = extraKeptUpgs
    /*for(i=41;i<=51;i+=10){
        if(layers.u.upgrades[i].unlocked()){
            for(a=i-30;a<=i-26;a++) kept.push(a)
        }
    }*/
    player.u.upgrades=kept
    if(!force){
        player.u.points = player.u.total
        player.u.exchangedUnstableUP = zero 
    }
    player.u.baseUPLastReset = player.u.total
    player.u.resetTime = 0
    player.points = zero
    player.u.MetaReset = Math.random()
    localStorage.setItem("MetaReset",player.u.MetaReset) //Well 1e-15% chance for no reseting...
    player.u.bestTotal = player.u.bestTotal.max(player.u.total)
    var upg = []
    for(i=1;i<=56;i++){
        if(player.u.upgrades.includes(i)) upg.push(i)
    }
    for(i=2;i<=uniCount;i++){
        uni[i].u.real = 0
        player["u"+i].points = zero
    }
    uni[1].u1.real = 0
    player["u1"].points = zero
    player.u.upgrades = upg
    updateTemp()
}
function getUnstableUP(){
    var up = player.u.bestTotal.mul(player.points.add(100).log10().div(2).sub(1))
    return up
}
//devTool
function instantUP(){
    var kept = []
    /*for(i=41;i<=51;i+=10){
        if(layers.u.upgrades[i].unlocked()){
            for(a=i-30;a<=i-26;a++) kept.push(a)
        }
    }*/
    player.u.upgrades=kept
    player.u.points = player.u.total
    player.u.exchangedUnstableUP = zero 
    player.u.baseUPLastReset = player.u.total
    player.u.bestTotal = player.u.bestTotal.max(player.u.total)
    var upg = []
    for(i=1;i<=56;i++){
        if(player.u.upgrades.includes(i)) upg.push(i)
    }
    player.u.upgrades = upg
    updateTemp()
}

var uni = [null]
var uniCount = 2

/* for(i=1;i<=uniCount;i++){
    let get = (i==1? localStorage.getItem("The_upgrading_tree") : localStorage.getItem("The_upgrading_tree_u"+i));
	if (get === null || get === undefined) {
		uni.push(undefined)
        break
	}
    var a = LZString.decompressFromBase64(get.substr(214));
    a = JSON.parse(a);
    a = Object.assign(getStartPlayer(), a);
    uni.push(a)
} */

function update(){
    for(i=1;i<=uniCount;i++){
        //读取信息
        let get = (i==1? localStorage.getItem("The_upgrading_tree") : localStorage.getItem("The_upgrading_tree_u"+i));
        if (get === null || get === undefined) {
            uni[i] = undefined
        }else{
            var a = LZString.decompressFromBase64(get.substr(214));
            a = JSON.parse(a);
            a = Object.assign(getStartPlayer(), a);
            uni[i] = a
        }
        if(i!=1){
            if(uni[i]) if(player.u.MetaReset != uni[i].u.MetaReset) uni[i].u.real = 0
        }else{
            if(uni[1]) if(player.u.MetaReset != uni[1].u1.MetaReset) uni[1].u1.real = 0
        }
        //存储时间速率加成
        localStorage.setItem("metaBoost"+i,layers["u"+i].timespeed())
    }
    //存储元宇宙升级
    localStorage.setItem("metaupg",player.u.upgrades.toString())
}

addLayer("u", {
    name: "META universe", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: true,
		points: zero,
        t:zero,
        exchangedUnstableUP:zero,
        confirmWindow:true,
        baseUPLastReset:zero,
        bestTotal:zero,
        MetaReset:null,
    }},
    color: "lightblue",
    resource: "元升级点", // Name of prestige currency
    resourceEN: "Meta Upgrade Points", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    effectDescription(){return `您已使用${format(getUsedUP())}元升级点.元升级点 = 最高总分数.临时的元升级点倍率 = lg(t+100)/2-1.<br>已获得的升级点:${format(player.u.bestTotal)} - 额外倍率:x${format(player.points.add(100).log10().div(2))}`},
    effectDescriptionEN(){return `You've used ${format(getUsedUP())} Meta Upgrade Points.<br>Meta Upgrade Point = Best Total Score. Temporary Meta Upgrade Point Multplier = lg(t+100)/2+1.<br>Gained Upgrade Points: ${format(player.u.bestTotal)} - Temporary Mult: x${format(player.points.add(100).log10().div(2))}`},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = one
        return mult
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    clickables: {
        11: {
            canClick(){return true},
            display() {return `重置升级<br />元升级点恢复为 ${format(player[this.layer].total)}.(本轮获得${format(player[this.layer].total.sub(player[this.layer].baseUPLastReset).max(0))})`},
            displayEN() {return `Reset Upgrades<br />Meta Upgrade Points will be ${format(player[this.layer].total)}.(Gained ${format(player[this.layer].total.sub(player[this.layer].baseUPLastReset))} this turn)`},
            onClick(){
                if(options.ch) if(player[this.layer].confirmWindow) if(!confirm("确定重置升级?所有宇宙的U购买项以及分数会被重置.(升级点不重置)")) return
                if(!options.ch) if(player[this.layer].confirmWindow) if(!confirm("Are you sure to RESET YOUR UPGRADES? U buyables and score in all universe will be reseted.(Upgrade Points won't be reseted.)")) return
                resetUpgs()
            }
        },
        12: {
            canClick(){return true},
            display() {return `禁用确认重置弹窗(${player[this.layer].confirmWindow?'未禁用':'已禁用'})`},
            displayEN() {return `Disable \'Reset Upgrades\' confirm window in this layer(${player[this.layer].confirmWindow?(options.ch?"未禁用":"Enabled"):(options.ch?"已禁用":"Disabled")})`},
            onClick(){
                player[this.layer].confirmWindow = !player[this.layer].confirmWindow
            }
        },
    },
    upgrades: {
        11: {
            description:`u11:基于总分数增幅元时间速率.`,
            descriptionEN:`u11:Meta-Timespeed is boosted by total score.`,
            effect(){
                var eff = player.u.total.div(2).add(1).pow(0.75)
                return eff
            },
            effectDisplay(){return `x${format(tmp[this.layer].upgrades[this.id].effect)}`},
            cost:n(10),
            unlocked(){return true},
        },
        12: {
            description:`u12:解锁C0-1.`,
            descriptionEN:`u11:Unlock C0-1.`,
            cost:n(10),
            unlocked(){return true},
        },
        13: {
            description:`u13:宇宙1的升级点以较低的效率“浓缩”(指以对数加成自身).`,
            descriptionEN:`u13:Upgrade Points in Universe 1 is condensed with a low rate.(Condense:Boost itself with *lg(x+10)^n)`,
            effect(){
                if(!uni[1]) return one
                var eff = n(uni[1].u1.real).div(10).add(1).log10().add(10).log10()
                return eff
            },
            effectDisplay(){return `x${format(tmp[this.layer].upgrades[this.id].effect)}`},
            cost:n(10),
            unlocked(){return true},
        },
        14: {
            description:`u14:宇宙2的升级点以较低的效率“浓缩”.`,
            descriptionEN:`u14:Upgrade Points in Universe 2 is condensed with a low rate.`,
            effect(){
                if(!uni[2]) return one
                var eff = n(uni[2].u.real).mul(2).add(1).log10().add(10).log10()
                return eff
            },
            effectDisplay(){return `x${format(tmp[this.layer].upgrades[this.id].effect)}`},
            cost:n(10),
            unlocked(){return true},
        },
        15: {
            description:`u15:u1的计时频率升级在NG-外也能购买,但效果减弱.在ng-外ng点变为其立方根.`,
            descriptionEN:`u15:Tickspeed Boost & NG Points in U1 can be bought/gained outside NG-, with a low rate.`,
            cost:n(10),
            unlocked(){return true},
        },
    },
    challenges: {
        11: {
            name(){return "C0-1" + (hasUpgrade("u",this.baseUPG)?"":"<text style='color:red'>(未解锁)</text>")},
            /**/nameEN(){return "C0-1" + (hasUpgrade("u",this.baseUPG)?"":"<text style='color:red'>(Locked)</text>")},
            challengeDescription: "速通:在5分钟内达到10U1分数!<br><text style='color:red'>进入条件:U1分数达到10.</text><br>Tip:进入任何U挑战后您的升级会被重置,但花费的升级点不会返还!",
            /**/challengeDescriptionEN: "Speedrunner: Get 10 U1 Scores in 5 Minutes!<text style='color:red'>Enter Req:Get 10 U1 Scores.</text><br>Tip:Entering any U challenges resets your U upgrades,but you WILL NOT get upgrade points back until you Resets your upgrades!",
            baseUPG:12,
            onEnter(){
                resetUpgs([this.baseUPG],true)
            },
            onExit(){
                player.u1.activeChallenge = this.id
            },
            enterReq(){return player.u1.points.gte(10)&&hasUpgrade("u",this.baseUPG)},
            canComplete(){return player.u1.points.gte(10)},
            goalDescription(){return format(10)+"U1分数"},
            /**/goalDescriptionEN(){return format(10)+" U1 Score"},
            rewardEffect(){return hasUpgrade("u",this.baseUPG)?[n(1.21),player.points.add(10).log10()]:[n(1.1),player.points.add(10).log10().sqrt()]},
            rewardDescription:"U1分数*1.1,元时间速率*lg(时间+10)^0.5.(如果你解锁了该挑战,这两个效果^2)",
            /**/rewardDescriptionEN:"U1 Score *1.1, Mete-Timespeed*lg(Time+10)^0.5 (If you unlocked this challenge,these effects ^2)",
            rewardDisplay(){return `分数*${format(this.rewardEffect()[0])},元时间速率*${format(this.rewardEffect()[1])}.`},
            /**/rewardDisplayEN(){return `Score *${format(this.rewardEffect()[0])}, Meta-Timespeed *${format(this.rewardEffect()[1])}.`},
            unlocked(){return layers[this.layer].upgrades[this.baseUPG].unlocked()}
        },
    },
    update(diff){
        var total = zero
        for(i=1;i<=uniCount;i++) total = total.add(player["u"+i].points)
        player.u.total = player.u.total.max(total)
        player.u.points = player.u.points.add(getUnstableUP().sub(player.u.exchangedUnstableUP).max(0))
        player.u.exchangedUnstableUP = player.u.exchangedUnstableUP.max(getUnstableUP())
        if(player.u.activeChallenge) if(!hasUpgrade("u",layers.u.challenges[player.u.activeChallenge].baseUPG)) player.u.activeChallenge = null
        if(inChallenge("u",11)) if(player.u.resetTime > 300){
            if(options.ch) window.alert("挑战失败!")
            else window.alert("Challenge Failed!")
            player.u.activeChallenge = null
        }
    },
})

addLayer("u1", {
    symbol: "U1", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: true,
		points: zero,
    }},
    color: "lightblue",
    resource: "分数", // Name of prestige currency
    resourceEN: "Score", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    effectDescription(){return `分数=(U1升级点/5)^0.5. 时间速率*${format(this.timespeed())}(该加成永远最后生效)<br>U1 = 声望树 + 公式树`},
    effectDescriptionEN(){return `Score = (Upgrade Points/5)^0.5. Timespeed *${format(this.timespeed())}(ALWAYS applys after all multplier)<br>U1 = The Prestige Tree + The Formula NG-`},
    row: "side", // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    gainMult(){
        var mult = n(1)
        if(hasChallenge("u",11)) mult = mult.mul(challengeEffect("u",11)[0])
        return mult
    },
    update(diff){
        if(!uni[1]) return
        if(!uni[1].u1.real) return player[this.layer].points = zero
        var points = n(uni[1].u1.real).div(5).sqrt().mul(tmp.u1.gainMult)
        player[this.layer].points = points.floor()
    },
    clickables:{
        11:{
            title:"进入该宇宙",
            titleEN:"Enter This Universe",
            onClick(){window.location.href = "universe_1/u1.html"},
            canClick:true
        }
    },
    dil:one,
    timespeed(){
        var timespeed = getTimeSpeed().sub(1).div(this.dil).add(1).root(this.dil.add(1).log10())
        return timespeed
    },
    bars:{
        progress:{
            display(){
                if(options.ch){if(!uni[1]) return "请先进入宇宙1!";if(!uni[1].u1.real) return "请先进入宇宙1!";return `当前升级点/需求升级点: ${format(uni[1].u1.real)} / ${format(this.layerReq(this.colorLayer().add(1)))}`}
                if(!uni[1]) return "Enter Universe 1 First!";if(!uni[1].u1.real) return "Enter Universe 1 First!";return `Current UP/Required UP: ${format(uni[1].u1.real)} / ${format(this.layerReq(this.colorLayer().add(1)))}`
            },
            colorLayer(){
                var layer = player[this.layer].points
                return layer.floor()
            },
            layerReq(x = this.colorLayer()){
                var max = x.div(tmp.u1.gainMult).pow(2).mul(5)
                return max
            },
            progress(){
                if(!uni[1]) return 0
                var req = this.layerReq()
                return n(uni[1].u1.real).sub(req).div(this.layerReq(this.colorLayer().add(1)).sub(req))
            },
            textStyle(){
                return {"color": color(layers[this.layer].bars.progress.colorLayer().add(2))}
            },
            fillStyle(){
                return {"background-color": color(layers[this.layer].bars.progress.colorLayer().add(1))}
            },
            baseStyle(){
                return {"background-color": color(layers[this.layer].bars.progress.colorLayer())}
            },
            unlocked:true,
            width:600,
            height:80,
            direction:RIGHT,
        },
    },
    tabFormat: [
        "main-display",
        "blank",
        "clickables",
        ["bar","progress"],
    ],
})

addLayer("u2", {
    symbol: "U2", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: false,
		points: zero,
    }},
    requires:ten,
    baseAmount(){return player.u.total},
    baseResource:"最高总分数",
    color: "lightblue",
    resource: "分数", // Name of prestige currency
    resourceEN: "Score", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    effectDescription(){return `分数=U2升级点^0.5. 时间速率*${format(this.timespeed())}<br>U2 = 距离增量:现实MOD + 浓缩MOD`},
    effectDescriptionEN(){return `Score = Upgrade Points^0.5. Timespeed *${format(this.timespeed())}(ALWAYS applys after all multplier)<br>U1 = The Prestige Tree + The Formula NG-`},
    row: "side", // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    update(diff){
        if(player.u.total.gte(10)) player.u2.unlocked = true
        if(!uni[2]) return
        var points = n(uni[2].u.real).pow(0.5)
        player[this.layer].points = points.floor()
    },
    clickables:{
        11:{
            title:"进入该宇宙",
            titleEN:"Enter This Universe",
            onClick(){window.location.href = "universe_2/u2.html"},
            canClick:true
        }
    },
    dil:ten,
    timespeed(){
        var timespeed = getTimeSpeed().sub(1).div(this.dil).add(1).root(this.dil.add(1).log10())
        return timespeed
    },
    bars:{
        progress:{
            display(){
                if(options.ch){if(!uni[2]) return "请先进入宇宙2!";return `当前升级点/需求升级点: ${format(uni[2].u.real)} / ${format(this.layerReq(this.colorLayer().add(1)))}`}
                if(!uni[2]) return "Enter Universe 2 First!";return `Current UP / Required UP: ${format(uni[2].u.real)} / ${format(this.layerReq(this.colorLayer().add(1)))}`
            },
            colorLayer(){
                var layer = player[this.layer].points
                return layer.floor()
            },
            layerReq(x = this.colorLayer()){
                var max = x.pow(2)
                return max
            },
            progress(){
                if(!uni[2]) return 0
                var req = this.layerReq()
                return n(uni[2].u.real).sub(req).div(this.layerReq(this.colorLayer().add(1)).sub(req))
            },
            textStyle(){
                return {"color": color(layers[this.layer].bars.progress.colorLayer().add(2))}
            },
            fillStyle(){
                return {"background-color": color(layers[this.layer].bars.progress.colorLayer().add(1))}
            },
            baseStyle(){
                return {"background-color": color(layers[this.layer].bars.progress.colorLayer())}
            },
            unlocked:true,
            width:600,
            height:80,
            direction:RIGHT,
        },
    },
    tabFormat: [
        "main-display",
        "blank",
        "clickables",
        ["bar","progress"],
    ],
})

setInterval(update,1000)