addLayer("c", {
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "yellow",
    resource: "浓缩器", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    //effectDescription(){return `+ ${format(this.getResetGain())} /s`},
    //effectDescriptionEN(){return `+ ${format(this.getResetGain())} /s`},
    layerShown(){return hasUpgrade("u",13)},
    effectDescription(){
        return `
        <br>进行第x行的重置时,所有小于x行的浓缩器会被重置.(例如r重置不清空浓缩器,l重置清空第一排浓缩器)<br>
        同样的,购买第x行的浓缩器时,会进行第x行的重置.<br>
        浓缩:指以*lg(资源+10)倍增自身获取速度
    `},
    buyables:{
        11: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = ten.pow(x.add(1).pow(1.33))
                return c.floor().max(0)
            },
            display() { return `距离浓缩器<br />x${format(buyableEffect(this.layer,this.id),2)} (下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}米(拥有:${format(player.points)})<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            displayEN() { return `Distance Condenser<br />x${format(buyableEffect(this.layer,this.id),2)} (Next Level: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} M(Currently:${format(player.points)})<br>Level:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                var row = Math.floor(Number(this.id)/10)-1
                for(r=row;r>=1;r--) rowHardReset(r,"c")
                layers.u.doReset("c")
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                return player.points.add(10).log10().pow(x)
            },            
            unlocked(){return true},
        },
        12: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = ten.pow(x.add(1).pow(1.33))
                return c.floor().max(0)
            },
            display() { return `速度浓缩器<br />x${format(buyableEffect(this.layer,this.id),2)} (下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}米/s(拥有:${format(player.u.trueSpd)})<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.u.trueSpd.gte(this.cost()) },
            buy() {
                var row = Math.floor(Number(this.id)/10)-1
                for(r=row;r>=1;r--) rowHardReset(r,"c")
                layers.u.doReset("c")
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                return player.u.trueSpd.add(10).log10().pow(x)
            },            
            unlocked(){return true},
        },
        13: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = ten.pow(x.add(1).pow(1.33))
                return c.floor().max(0)
            },
            display() { return `加速度浓缩器<br />x${format(buyableEffect(this.layer,this.id),2)} (下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}米/s<sup>2</sup>(拥有:${format(getAcc())})<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return getAcc().gte(this.cost()) },
            buy() {
                var row = Math.floor(Number(this.id)/10)-1
                for(r=row;r>=1;r--) rowHardReset(r,"c")
                layers.u.doReset("c")
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                return getAcc().add(10).log10().pow(x)
            },
            unlocked(){return true},
        },
        21: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = six.mul(n(1.5).pow(x))
                return c.floor().max(0)
            },
            display() { return `等级低效浓缩器<br />x${format(buyableEffect(this.layer,this.id),2)} (下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}等级(拥有:${format(player.r.points)})<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            displayEN() { return `Rank Slow Condenser<br />x${format(buyableEffect(this.layer,this.id),2)} (Next Level: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} Ranks(Currently:${format(player.r.points)})<br>Level:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.r.points.gte(this.cost()) },
            buy() {
                var row = Math.floor(Number(this.id)/10)-1
                for(r=row;r>=1;r--) rowHardReset(r,"l")
                layers.u.doReset("c")
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                return player.r.total.add(10).log10().pow(x.pow(0.5))
            },
            unlocked(){return hasUpgrade("u",23)},
        },
        22: {
            cost(x = getBuyableAmount(this.layer, this.id)) {
                var c = eight.mul(n(1.25).pow(x))
                return c.floor().max(0)
            },
            display() { return `时间低效浓缩器<br />x${format(buyableEffect(this.layer,this.id),2)} (下一级: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}等级(拥有:${format(player.r.points)})<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            displayEN() { return `Time Slow Condenser<br />x${format(buyableEffect(this.layer,this.id),2)} (Next Level: ${format(this.effect(getBuyableAmount(this.layer, this.id).add(1)))})<br />Cost: ${format(this.cost(getBuyableAmount(this.layer, this.id)))} Ranks(Currently:${format(player.r.points)})<br>Level:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player.r.points.gte(this.cost()) },
            buy() {
                var row = Math.floor(Number(this.id)/10)-1
                for(r=row;r>=1;r--) rowHardReset(r,"l")
                layers.u.doReset("c")
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x = getBuyableAmount(this.layer, this.id)){
                return player.u.t.add(10).log10().pow(x.add(1).pow(0.5).sub(1).mul(2))
            },            
            unlocked(){return true},
        },
    },
    doReset(resettingLayer){
        var rowID = layers[resettingLayer].row
        if(resettingLayer == "r") if(hasAffix("r","High-Dimensional")){
            player.c.buyables[11] = player.c.buyables[11].sub(1)
            player.c.buyables[12] = player.c.buyables[12].sub(1)
            player.c.buyables[13] = player.c.buyables[13].sub(1)
        }
        if(rowID == "side") return layerDataReset(this.layer)
        for(i in player.c.buyables){
            if(Number(i)/10 >= rowID) break
            player.c.buyables[i] = zero
        }
    },
    update(diff){
        player.c.points = zero
        for(i in player.c.buyables) player.c.points = player.c.points.add(player.c.buyables[i])
    }
})