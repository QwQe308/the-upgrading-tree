var affixENtoCH = {}
var ableAffix = {
    r:["Anti-condensed","Twin","High-Dimensional"],
    c:[],
    l:["Anti-condensed","Twin","Low-Dimensional","Cautious"],
    e:[],
}

function updateAffix(){
    for(i in layers.aff.clickables)  if(layers.aff.clickables[i].title) affixENtoCH[layers.aff.clickables[i].titleEN] = layers.aff.clickables[i].title
}
function hasAffix(layer,affix){
    return player.aff[layer].includes(affix)
}
function getAllAffix(layer){
    let str = ""
    if(options.ch) for(i in player.aff[layer]) str +=" " + affixENtoCH[player.aff[layer][i]] 
    else for(i in player.aff[layer]) str +=" " + player.aff[layer][i]
    return str
}


addLayer("aff", {
    symbol: "Aff", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
        currentSelecting: null,
        r:[],
        c:[],
        l:[],
        e:[],
    }},
    color: "brown",
    resource: "词缀点", // Name of prestige currency
    resourceEN: "Affix Points", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    effectDescription(){return `分配词缀,获得加成.<br>词缀会给予或消耗词缀点.词缀点不能低于0.重置升级时,词缀也会被重置.<br>${(player.aff.currentSelecting?("你当前选中了:"+layers.aff.clickables[player.aff.currentSelecting].title):"请先选择一个要添加的词缀.")}`},
    row: "side", // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    clickables: {
        11:{
            display() {return `重置词缀<br>(同时也会进行A重置)`},
            onClick(){
                layers.aff.doReset()
            },
            canClick:true,
        },
        12:{
            display() {return `取消选择词缀`},
            onClick(){
                player.aff.currentSelecting = null
            },
            canClick(){return player.aff.currentSelecting},
        },
        21: {
            canClick(){return true},
            display() {if(!affixENtoCH.condensed) updateAffix();return `添加到R层级<br>${getAllAffix(this.layerID)}`},
            layerID:"r",
            onClick(){
                if(!player.aff.currentSelecting) return
                if(!layers.aff.clickables[player.aff.currentSelecting].canClick()) return
                player.aff.points = player.aff.points.sub(layers.aff.clickables[player.aff.currentSelecting].cost)
                player.aff.total = player.aff.total.sub(layers.aff.clickables[player.aff.currentSelecting].cost.min(0))
                player.aff[this.layerID].push(layers.aff.clickables[player.aff.currentSelecting].titleEN)
            },
            canClick(){
                if(!layers.aff.clickables[player.aff.currentSelecting]) player.aff.currentSelecting = null
                if(!player.aff.currentSelecting) return
                if(!layers.aff.clickables[player.aff.currentSelecting].unlocked()) player.aff.currentSelecting = null
                if(hasAffix(this.layerID,layers.aff.clickables[player.aff.currentSelecting].titleEN)) return
                if(player.aff.points.lt(layers.aff.clickables[player.aff.currentSelecting].cost)) return
                return ableAffix[this.layerID].includes(layers.aff.clickables[player.aff.currentSelecting].titleEN)
            },
        },
        22: {
            canClick(){return true},
            display() {return `添加到C层级<br>${getAllAffix(this.layerID)}`},
            layerID:"c",
            onClick(){
                if(!player.aff.currentSelecting) return
                if(!layers.aff.clickables[player.aff.currentSelecting].canClick()) return
                player.aff.points = player.aff.points.sub(layers.aff.clickables[player.aff.currentSelecting].cost)
                player.aff.total = player.aff.total.sub(layers.aff.clickables[player.aff.currentSelecting].cost.min(0))
                player.aff[this.layerID].push(layers.aff.clickables[player.aff.currentSelecting].titleEN)
            },
            canClick(){
                if(!player.aff.currentSelecting) return
                if(hasAffix(this.layerID,layers.aff.clickables[player.aff.currentSelecting].titleEN)) return
                if(player.aff.points.lt(layers.aff.clickables[player.aff.currentSelecting].cost)) return
                return ableAffix[this.layerID].includes(layers.aff.clickables[player.aff.currentSelecting].titleEN)
            },
            unlocked(){return layers[this.layerID].layerShown()}
        },
        23: {
            canClick(){return true},
            display() {return `添加到L层级<br>${getAllAffix(this.layerID)}`},
            layerID:"l",
            onClick(){
                if(!player.aff.currentSelecting) return
                if(!layers.aff.clickables[player.aff.currentSelecting].canClick()) return
                player.aff.points = player.aff.points.sub(layers.aff.clickables[player.aff.currentSelecting].cost)
                player.aff.total = player.aff.total.sub(layers.aff.clickables[player.aff.currentSelecting].cost.min(0))
                player.aff[this.layerID].push(layers.aff.clickables[player.aff.currentSelecting].titleEN)
            },
            canClick(){
                if(!player.aff.currentSelecting) return
                if(hasAffix(this.layerID,layers.aff.clickables[player.aff.currentSelecting].titleEN)) return
                if(player.aff.points.lt(layers.aff.clickables[player.aff.currentSelecting].cost)) return
                return ableAffix[this.layerID].includes(layers.aff.clickables[player.aff.currentSelecting].titleEN)
            },
        },
        24: {
            canClick(){return true},
            display() {return `添加到E层级<br>${getAllAffix(this.layerID)}`},
            layerID:"e",
            onClick(){
                if(!player.aff.currentSelecting) return
                if(!layers.aff.clickables[player.aff.currentSelecting].canClick()) return
                player.aff.points = player.aff.points.sub(layers.aff.clickables[player.aff.currentSelecting].cost)
                player.aff.total = player.aff.total.sub(layers.aff.clickables[player.aff.currentSelecting].cost.min(0))
                player.aff[this.layerID].push(layers.aff.clickables[player.aff.currentSelecting].titleEN)
            },
            canClick(){
                if(!player.aff.currentSelecting) return
                if(hasAffix(this.layerID,layers.aff.clickables[player.aff.currentSelecting].titleEN)) return
                if(player.aff.points.lt(layers.aff.clickables[player.aff.currentSelecting].cost)) return
                return ableAffix[this.layerID].includes(layers.aff.clickables[player.aff.currentSelecting].titleEN)
            },
        },

        41:{
            display() {return `----------`},
            style:{"background-color":"grey"},
        },
        42:{
            display() {return `---以下是增`},
            style:{"background-color":"grey"},
        },
        43:{
            display() {return `益词缀呦---`},
            style:{"background-color":"grey"},
        },
        44:{
            display() {return `----------`},
            style:{"background-color":"grey"},
        },

        61: {
            titleEN:"Anti-condensed",
            title:"反浓缩的",
            canClick(){return true},
            display() {return `仅能给予静态层级,价格/lg(x+10)(对基础价格不生效)<br>消耗词缀点:${format(this.cost)}`},
            onClick(){
                player.aff.currentSelecting = this.id
            },
            canClick(){
                return player.aff.points.gte(this.cost)
            },
            cost:n(1),
            unlocked(){return true},
            style(){return {"background-color":player.aff.currentSelecting==this.id?"orange":player.aff.points.gte(this.cost)?"brown":"#bf8f8f"}},
        },
        62: {
            titleEN:"Low-Dimensional",
            title:"低维的",
            canClick(){return true},
            display() {return `仅能给予L层级,第二排层级不会重置额外等级,额外等级数量加上阶级*2.<br>消耗词缀点:${format(this.cost)}`},
            onClick(){
                player.aff.currentSelecting = this.id
            },
            canClick(){
                return player.aff.points.gte(this.cost)
            },
            cost:n(1),
            unlocked(){return hasUpgrade("u",21)},
            style(){return {"background-color":player.aff.currentSelecting==this.id?"orange":player.aff.points.gte(this.cost)?"brown":"#bf8f8f"}},
        },
        63: {
            titleEN:"Cautious",
            title:"谨慎的",
            canClick(){return true},
            display() {return `仅可给予L层级,在阶级数不大于未使用的词缀点时,每个阶级给予1升级点.<br>消耗词缀点:${format(this.cost)}`},
            onClick(){
                player.aff.currentSelecting = this.id
            },
            canClick(){
                return player.aff.points.gte(this.cost)
            },
            cost:n(1),
            unlocked(){return hasAchievement("ach",34)},
            style(){return {"background-color":player.aff.currentSelecting==this.id?"orange":player.aff.points.gte(this.cost)?"brown":"#bf8f8f"}},
        },

        81:{
            display() {return `----------`},
            style:{"background-color":"grey"},
        },
        82:{
            display() {return `---以下是减`},
            style:{"background-color":"grey"},
        },
        83:{
            display() {return `益词缀呦---`},
            style:{"background-color":"grey"},
        },
        84:{
            display() {return `----------`},
            style:{"background-color":"grey"},
        },

        101: {
            titleEN:"Twin",
            title:"双生的",
            display() {return `仅能给予静态层级,一次重置能获得两点资源,且只能获得两点资源以上.<br>获得词缀点:${format(this.cost.neg())}`},
            onClick(){
                player.aff.currentSelecting = this.id
            },
            canClick(){return true},
            cost:n(-1),
            unlocked(){return true},
            style(){return {"background-color":player.aff.currentSelecting==this.id?"orange":"brown"}},
        },
        102: {
            titleEN:"High-Dimensional",
            title:"高维的",
            display() {return `仅能给予R层级,重置时也会将第一排的浓缩器数量-1.<br>获得词缀点:${format(this.cost.neg())}`},
            onClick(){
                player.aff.currentSelecting = this.id
            },
            canClick(){return true},
            cost:n(-1),
            unlocked(){return hasUpgrade("u",21)},
            style(){return {"background-color":player.aff.currentSelecting==this.id?"orange":"brown"}},
        },
    },
    doReset(resettingLayer="aff"){
        var startData = layers.aff.startData()
        for(i in startData) player.aff[i] = startData[i]
        if(resettingLayer=="aff") resetUpgs(player.u.upgrades,true)
        player.aff.total = zero
    },
    layerShown(){return player.u.unlockedRows >= 2}
})