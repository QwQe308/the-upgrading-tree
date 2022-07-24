addLayer("ng", {
    name: "New Game", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "NG", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "white",
    resource: "NG点", // Name of prestige currency
    resourceEN: "NG Points", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: "side", // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    buyables:{
        11: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = n(1.15).pow(x).mul(5)
                return c.floor()
            },
            display() { return `计时频率升级<br />时间速率x${format(buyableEffect(this.layer,this.id),2)}.(下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />底数为${format(this.base())}(${format(this.base().sub(1))}+1,+1永远最后运算)<br />NG点x${format(n(1.02).pow(getBuyableAmount(this.layer, this.id)),2)}.(下一级: ${format(n(1.02).pow(getBuyableAmount(this.layer, this.id).add(1)))})<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))} NG点<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            displayEN() { return `Tickspeed Upgrade<br />Timespeed x${format(buyableEffect(this.layer,this.id),2)}.(Next: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />Effect base is ${format(this.base())}(${format(this.base().sub(1))}+1,+1 applys the last)<br />NG Pointx${format(n(1.02).pow(getBuyableAmount(this.layer, this.id)),2)}.(Next: ${format(n(1.02).pow(getBuyableAmount(this.layer, this.id).add(1)))})<br />Cost:${format(this.cost(getBuyableAmount(this.layer, this.id)))} NG Points<br>Level:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.ng.points.gte(this.cost()) },
            buy() {
                player.ng.points = player.ng.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            base(){
                var base = n(0.1)
                base = hasUpgThenMul("g",13,base)
                base = base.mul(buyableEffect("ng",12).add(1).pow(2))
                return base.add(1)
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                var eff = this.base().pow(x)
                return eff
            },
            unlocked(){return ngSub()},
            style(){
            return `{height: 100px;width:300px}`
            }
        },
        12: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = two.pow(x.add(1).pow(1.6)).mul(4000)
                if(x.gte(5)) c = expPow(c.div(1e5),1.2).mul(1e5)
                return c.floor()
            },
            display() {
                if(getBuyableAmount(this.layer,this.id).gte(5)) return `遥远星系<br />时间指数+${format(buyableEffect(this.layer,this.id),2)}(下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />计时频率升级底数*${format(buyableEffect(this.layer,this.id).add(1).pow(2),2)}(下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)).add(1).pow(2))})<br />购买时进行一次A转并重置你的计时频率升级和NG点<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))} NG点<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` 
                return `星系<br />时间指数+${format(buyableEffect(this.layer,this.id),2)}(下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />计时频率升级底数*${format(buyableEffect(this.layer,this.id).add(1).pow(2),2)}(下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)).add(1).pow(2))})<br />购买时进行一次A转并重置你的计时频率升级和NG点<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))} NG点<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` 
            },
            displayEN() {
                if(getBuyableAmount(this.layer,this.id).gte(5)) return `Remote Galaxy<br />Time Exponent+${format(buyableEffect(this.layer,this.id),2)}(Next: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />Tickspeed Upgrade base*${format(buyableEffect(this.layer,this.id).add(1).pow(2),2)}(Next: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)).add(1).pow(2))})<br />Buying it does a A reset,resets your Tickspeed Upgrade and NG points<br />Cost:${format(this.cost(getBuyableAmount(this.layer, this.id)))} NG Points<br>Level:${formatWhole(getBuyableAmount(this.layer, this.id))}` 
                return `Galaxy<br />Time Exponent+${format(buyableEffect(this.layer,this.id),2)}(Next: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />Tickspeed Upgrade base*${format(buyableEffect(this.layer,this.id).add(1).pow(2),2)}(Next: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)).add(1).pow(2))})<br />Buying it does a A reset,resets your Tickspeed Upgrade and NG points<br />Cost:${format(this.cost(getBuyableAmount(this.layer, this.id)))} NG Points<br>Level:${formatWhole(getBuyableAmount(this.layer, this.id))}` 
            },
            canAfford() { return player.ng.points.gte(this.cost()) },
            buy() {
                player.ng.points = player.ng.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                resetU1Upgs(player.u1.upgrades,true)
                player.ng.buyables[11] = n(0)
                player.ng.points = n(0)
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                var eff = x.mul(0.08)
                return eff
            },
            unlocked(){return ngSub()},
            style(){
                return `{height: 100px;width:300px}`
            }
        },
    },
    challenges: {
        11: {
            name(){return "NG-" + (hasUpgrade("u1",52)?"":"<text style='color:red'>(未解锁)</text>")},
            /**/nameEN(){return "NG-" + (hasUpgrade("u1",52)?"":"<text style='color:red'>(Locked)</text>")},
            challengeDescription: `
            进入NG-不会重置你的升级,但会重置你当前的自动化点.在NG-中,你将获得如下效果.<br>
            1.点数倍率于时间对点数的加成倍率处达到软上限,超出部分^0.5.<br>
            2.点数减缓自身获取速度.(详见公式)<br>
            3.时间指数-1,在最后生效.<br>
            4.时间速率/4.<br>
            5.解锁新内容,你可以使用NG点购买升级点.(NG点产量和t,点数,重置点有关)<br>
            6.独立的自动化部分.<br>
            7.一些小改动,如更多软上限.
            `,
            /**/challengeDescriptionEN: `
            Entering NG- won't reset your U upgrades,but your current Automation Points will be reseted.These effects will active.<br>
            1.Points muliplier is softcapped at time multplier,^0.5.<br>
            2.Points make itself slower.(See it in the formula)<br>
            3.Time exponent -1,applies the last.<br>
            4.Timespeed/10.<br>
            5.Unlocks new features,and you can buy Upgrade Points by NG Points.(NG Points is based on t,Points and Prestige Points)<br>
            6.Independly automation.<br>
            7.Some small changes,such as more softcaps.
            `,
            onEnter(){
                resetU1Upgs(player.u1.upgrades,true)
                player.ng.activeChallenge = this.id
                player.a.points = n(0)
                layerDataReset("ng")
            },
            onExit(){
                player.a.points = n(0)
                layerDataReset("ng")
            },
            canComplete(){return false},
            enterReq(){return hasUpgrade("u1",52)},
            goalDescription(){return "无尽"},
            /**/goalDescriptionEN(){return "Endless"},
            rewardDescription:`在挑战中获得尽可能多的升级点!</text>`,
            /**/rewardDescriptionEN:`Get as much upgrade points as you can!</text>`,
            unlocked(){return layers.u1.upgrades[52].unlocked()},
            style(){
                return `{
                    height: 200px;
                    width: 600px;
                    border-radius: 25%;
                    border: 2px solid;
                    border-color: rgba(255, 0, 0, 0.125);
                    font-size: 14px;
                    overflow: visible;
                    background-color: lightblue;
                }`
            }
        },
    },
    getResetGain(){
        if(!ngSub()) return zero
        var gain = expPow(player.points.add(10).log10().mul(player.p.points.add(10).log10()).mul(player.u1.t.add(10).log10()).cbrt(),1.8).sub(1).pow(2).div(10)
        if(gain.lte(1)) gain = gain.sqrt()
        gain = gain.mul(n(1.02).pow(getBuyableAmount("ng",11)))
        return gain
    },
    effectDescription(){return `+ ${format(this.getResetGain())} /s`},
    effectDescriptionEN(){return `+ ${format(this.getResetGain())} /s`},
    update(diff){
        if(!hasUpgrade('u1',52) && player.ng.activeChallenge == 11){
            player.ng.activeChallenge = null
            player.a.points = n(0)
            layerDataReset("ng")
        }
        player.ng.points = player.ng.points.add(this.getResetGain().mul(diff))
    },
})