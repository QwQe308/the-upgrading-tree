addLayer("h", {
    symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "brown",
    resource: "障碍灵魂", // Name of prestige currency
    resourceEN: "Hindrance Spirit", // Name of prestige currency
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires(){return n(1e6)},
    getResetGain(){
        var gain = ten.pow(player.g.power.div(this.requires())).div(10)
        return gain.floor()
    },
    getNextAt(){
        var realGain = this.getResetGain()
        var next = realGain.add(1).mul(10).log10().mul(this.requires())
        return next
    },
    branches:["t"],
    baseResource:"能量",
    baseResourceEN: "Energy",
    baseAmount(){return player.g.power},
    exponent:0.5,
    row: 4, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    effect(){
        var eff = player.h.points.add(1).log10()
        return eff
    },
    effectDescription(){return `使得能量获取x${format(this.effect())},随时间增长...为什么障碍灵魂的基础资源会是能量?`},
    layerShown(){return hasUpgrade("u1",61)},
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
    hotkeys: [
        {key: "h", description: "H: h转",descriptionEN: "H: Reset H Node", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
})