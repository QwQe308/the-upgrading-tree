var testTree = [["f", "c"],
["g", "spook", "h"]]

addLayer("c", {
        layer: "c", // This is assigned automatically, both to the layer and all upgrades, etc. Shown here so you know about it
        name: "Candies", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: true,
			points: new OmegaNum(0),
            best: new OmegaNum(0),
            total: new OmegaNum(0),
            buyables: {}, // You don't actually have to initialize this one
            beep: false,
            thingy: "pointy",
            otherThingy: 10,
            drop: "drip",
        }},
        color: "#4BDC13",
        requires: new OmegaNum(10), // Can be a function that takes requirement increases into account
        resource: "lollipops", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        base: 5, // Only needed for static layers, base of the formula (b^(x^exp))
        roundUpCost: false, // True if the cost needs to be rounded up (use when baseResource is static?)

        // For normal layers, gain beyond [softcap] points is put to the [softcapPower]th power
        softcap: new OmegaNum(1e100), 
        softcapPower: new OmegaNum(0.5), 
        canBuyMax() {}, // Only needed for static layers with buy max
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new OmegaNum(1)
            if (hasUpgrade(this.layer, 166)) mult = mult.times(2) // These upgrades don't exist
			if (hasUpgrade(this.layer, 120)) mult = mult.times(upgradeEffect(this.layer, 120))
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new OmegaNum(1)
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        effect() {
            return { // Formulas for any boosts inherent to resources in the layer. Can return a single value instead of an object if there is just one effect
            waffleBoost: (true == false ? 0 : OmegaNum.pow(player[this.layer].points, 0.2)),
            icecreamCap: (player[this.layer].points * 10)
        }},
        effectDescription() { // Optional text to describe the effects
            eff = this.effect();
            eff.waffleBoost = eff.waffleBoost.times(buyableEffect(this.layer, 11).first)
            return "which are boosting waffles by "+format(eff.waffleBoost)+" and increasing the Ice Cream cap by "+format(eff.icecreamCap)
        },
        infoboxes:{
            coolInfo: {
                title: "Lore",
                titleStyle: {'color': '#FE0000'},
                body: "DEEP LORE!",
                bodyStyle: {'background-color': "#0000EE"}
            }
        },
        milestones: {
            0: {requirementDescription: "3 Lollipops",
                done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
                effectDescription: "Unlock the next milestone",
            },
            1: {requirementDescription: "4 Lollipops",
                unlocked() {return hasMilestone(this.layer, 0)},
                done() {return player[this.layer].best.gte(4)},
                effectDescription: "You can toggle beep and boop (which do nothing)",
                toggles: [
                    ["c", "beep"], // Each toggle is defined by a layer and the data toggled for that layer
                    ["f", "boop"]],
                style() {                     
                    if(hasMilestone(this.layer, this.id)) return {
                        'background-color': '#1111DD' 
                }},
        
                },
        },
        challenges: {

		    11: {
                name: "Fun",
                completionLimit: 3,
			    challengeDescription() {return "Makes the game 0% harder<br>"+challengeCompletions(this.layer, this.id) + "/" + this.completionLimit + " completions"},
                unlocked() { return player[this.layer].best.gt(0) },
                goalDescription: 'Have 20 points I guess',
                canComplete() {
                    return player.points.gte(20)
                },
                rewardEffect() {
                    let ret = player[this.layer].points.add(1).tetrate(0.02)
                    return ret;
                },
                rewardDisplay() { return format(this.rewardEffect())+"x" },
                countsAs: [12, 21], // Use this for if a challenge includes the effects of other challenges. Being in this challenge "counts as" being in these.
                rewardDescription: "Says hi",
                onComplete() {console.log("hiii")}, // Called when you successfully complete the challenge
                onEnter() {console.log("So challenging")},
                onExit() {console.log("Sweet freedom!")},

            },
        }, 
        upgrades: {

            11: {
                title: "Generator of Genericness",
                description: "Gain 1 Point every second.",
                cost: new OmegaNum(1),
                unlocked() { return player[this.layer].unlocked }, // The upgrade is only visible when this is true
                branches: [12]
            },
            12: {
                description: "Point generation is faster based on your unspent Lollipops.",
                cost: new OmegaNum(1),
                unlocked() { return (hasUpgrade(this.layer, 11))},
                effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = player[this.layer].points.add(1).pow(player[this.layer].upgrades.includes(24)?1.1:(player[this.layer].upgrades.includes(14)?0.75:0.5)) 
                    if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
            13: {
                unlocked() { return (hasUpgrade(this.layer, 12))},
                onPurchase() { // This function triggers when the upgrade is purchased
                    player[this.layer].unlockOrder = 0
                },
                style() {
                    if (hasUpgrade(this.layer, this.id)) return {
                    'background-color': '#1111dd' 
                    }
                    else if (!canAffordUpgrade(this.layer, this.id)) {
                        return {
                            'background-color': '#dd1111' 
                        }
                    } // Otherwise use the default
                },
                canAfford(){return player.points.lte(7)},
                pay(){player.points = player.points.add(7)},
                fullDisplay: "Only buyable with less than 7 points, and gives you 7 more. Unlocks a secret subtab."
            },
            22: {
                title: "This upgrade doesn't exist",
                description: "Or does it?.",
                currencyLocation() {return player[this.layer].buyables}, // The object in player data that the currency is contained in
                currencyDisplayName: "exhancers", // Use if using a nonstandard currency
                currencyInternalName: 11, // Use if using a nonstandard currency

                cost: new OmegaNum(3),
                unlocked() { return player[this.layer].unlocked }, // The upgrade is only visible when this is true
            },
        },
        buyables: {
            showRespec: true,
            respec() { // Optional, reset things and give back your currency. Having this function makes a respec button appear
                player[this.layer].points = player[this.layer].points.add(player[this.layer].spentOnBuyables) // A built-in thing to keep track of this but only keeps a single value
                resetBuyables(this.layer)
                doReset(this.layer, true) // Force a reset
            },
            respecText: "Respec Thingies", // Text on Respec button, optional
            respecMessage: "Are you sure? Respeccing these doesn't accomplish much.",
            11: {
                title: "Exhancers", // Optional, displayed at the top in a larger font
                cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if (x.gte(25)) x = x.pow(2).div(25)
                    let cost = OmegaNum.pow(2, x.pow(1.5))
                    return cost.floor()
                },
                effect(x) { // Effects of owning x of the items, x is a OmegaNum
                    let eff = {}
                    if (x.gte(0)) eff.first = OmegaNum.pow(25, x.pow(1.1))
                    else eff.first = OmegaNum.pow(1/25, x.times(-1).pow(1.1))
                
                    if (x.gte(0)) eff.second = x.pow(0.8)
                    else eff.second = x.times(-1).pow(0.8).times(-1)
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " lollipops\n\
                    Amount: " + player[this.layer].buyables[this.id] + "/4\n\
                    Adds + " + format(data.effect.first) + " things and multiplies stuff by " + format(data.effect.second)
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single OmegaNum value
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
                purchaseLimit: new OmegaNum(4),
                sellOne() {
                    let amount = getBuyableAmount(this.layer, this.id)
                    if (amount.lte(0)) return // Only sell one if there is at least one
                    setBuyableAmount(this.layer, this.id, amount.sub(1))
                    player[this.layer].points = player[this.layer].points.add(this.cost)
                },
            },
        },
        doReset(resettingLayer){ // Triggers when this layer is being reset, along with the layer doing the resetting. Not triggered by lower layers resetting, but is by layers on the same row.
            if(layers[resettingLayer].row > this.row) layerDataReset(this.layer, ["points"]) // This is actually the default behavior
        },
        layerShown() {return true}, // Condition for when layer appears on the tree
        automate() {
        }, // Do any automation inherent to this layer if appropriate
        resetsNothing() {return false},
        onPrestige(gain) {
            return
        }, // Useful for if you gain secondary resources or have other interesting things happen to this layer when you reset it. You gain the currency after this function ends.

        hotkeys: [
            {key: "c", description: "C: reset for lollipops or whatever", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
            {key: "ctrl+c", description: "Ctrl+c: respec things", onPress(){respecBuyables(this.layer)}, unlocked() {return hasUpgrade('c', '22')}}  ,
        ],
        increaseUnlockOrder: [], // Array of layer names to have their order increased when this one is first unlocked

        microtabs: {
            stuff: {
                first: {
                    content: ["upgrades", ["display-text", function() {return "confirmed<br>" + player.c.drop}], ["drop-down", ["drop", ["drip", "drop"]]]]
                },
                second: {
                    embedLayer: "f",

                    content: [["upgrade", 11],
                            ["row", [["upgrade", 11], "blank", "blank", ["upgrade", 11],]],
                        
                        ["display-text", function() {return "double confirmed"}]]
                },
            },
            otherStuff: {
                // There could be another set of microtabs here
            }
        },

        bars: {
            longBoi: {
                fillStyle: {'background-color' : "#FFFFFF"},
                baseStyle: {'background-color' : "#696969"},
                textStyle: {'color': '#04e050'},

                borderStyle() {return {}},
                direction: RIGHT,
                width: 300,
                height: 30,
                progress() {
                    return (player.points.add(1).log(10).div(10)).toNumber()
                },
                display() {
                    return format(player.points) + " / 1e10 points"
                },
                unlocked: true,

            },
            tallBoi: {
                fillStyle: {'background-color' : "#4BEC13"},
                baseStyle: {'background-color' : "#000000"},
                textStyle: {'text-shadow': '0px 0px 2px #000000'},

                borderStyle() {return {'border-width': "7px"}},
                direction: UP,
                width: 50,
                height: 200,
                progress() {
                    return player.points.div(100)
                },
                display() {
                    return formatWhole((player.points.div(1)).min(100)) + "%"
                },
                unlocked: true,

            },
            flatBoi: {
                fillStyle: {'background-color' : "#FE0102"},
                baseStyle: {'background-color' : "#222222"},
                textStyle: {'text-shadow': '0px 0px 2px #000000'},

                borderStyle() {return {}},
                direction: UP,
                width: 100,
                height: 30,
                progress() {
                    return player.c.points.div(50)
                },
                unlocked: true,

            },
        },
        
        // Optional, lets you format the tab yourself by listing components. You can create your own components in v.js.
        tabFormat: {
            "main tab": {
                buttonStyle() {return  {'color': 'orange'}},
                shouldNotify: true,
                content:
                    ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"], // Height
                    ["raw-html", function() {return "<button onclick='console.log(`yeet`); makeParticles(textParticle)'>'HI'</button>"}],
                    ["display-text", "Name your points!"],
                    ["text-input", "thingy"],
                    ["display-text",
                        function() {return 'I have ' + format(player.points) + ' ' + player[this.layer].thingy + ' points!'},
                        {"color": "red", "font-size": "32px", "font-family": "Comic Sans MS"}],
                    "h-line", "milestones", "blank", "upgrades", "challenges"],
                glowColor: "blue",

            },
            thingies: {
                prestigeNotify: true,
                style() {return  {'background-color': '#222222'}},
                buttonStyle() {return {'border-color': 'orange'}},
                content:[ 
                    "buyables", "blank",
                    ["row", [
                        ["toggle", ["c", "beep"]], ["blank", ["30px", "10px"]], // Width, height
                        ["display-text", function() {return "Beep"}], "blank", ["v-line", "200px"],
                        ["column", [
                            ["prestige-button", "", {'width': '150px', 'height': '80px'}],
                            ["prestige-button", "", {'width': '100px', 'height': '150px'}],
                        ]], 
                    ], {'width': '600px', 'height': '350px', 'background-color': 'green', 'border-style': 'solid'}],
                    "blank",
                    ["display-image", "discord.png"],],
            },
            jail: {
                style() {return  {'background-color': '#222222'}},

                content: [
                    ["infobox", "coolInfo"],
                    ["bar", "longBoi"], "blank",
                    ["row", [
                        ["column", [
                            ["display-text", "Sugar level:", {'color': 'teal'}],  "blank", ["bar", "tallBoi"]],
                        {'background-color': '#555555', 'padding': '15px'}],
                        "blank",
                        ["column", [
                        ["display-text", "idk"],
                        ["blank", ['0', '50px']], ["bar", "flatBoi"]
                        ]],
                    ]],
                    "blank", ["display-text", "It's jail because \"bars\"! So funny! Ha ha!"],["tree", testTree], 
                ],
            },
            illuminati: {
                unlocked() {return (hasUpgrade("c", 13))},
                content:[
                    ["raw-html", function() {return "<h1> C O N F I R M E D </h1>"}], "blank",
                    ["microtabs", "stuff", {'width': '600px', 'height': '350px', 'background-color': 'brown', 'border-style': 'solid'}],
                    ["display-text", "Adjust how many points H gives you!"],
                    ["slider", ["otherThingy", 1, 30]], "blank", ["upgrade-tree", [[11], 
                    [12, 22, 22, 11]]]
                ]
            }

        },
        style() {return {
           //'background-color': '#3325CC' 
        }},
        nodeStyle() {return { // Style on the layer node
            'color': '#3325CC',
            'text-decoration': 'underline' 
        }},
        glowColor: "orange", // If the node is highlighted, it will be this color (default is red)
        componentStyles: {
            "challenge"() {return {'height': '200px'}},
            "prestige-button"() {return {'color': '#AA66AA'}},
        },
        tooltip() { // Optional, tooltip displays when the layer is unlocked
            let tooltip = formatWhole(player[this.layer].points) + " " + this.resource
            if (player[this.layer].buyables[11].gt(0)) tooltip += "<br><i><br><br><br>" + formatWhole(player[this.layer].buyables[11]) + " Exhancers</i>"
            return tooltip
        },
        shouldNotify() { // Optional, layer will be highlighted on the tree if true.
                         // Layer will automatically highlight if an upgrade is purchasable.
            return (player.c.buyables[11] == 1)
        },
        marked: "discord.png",
        resetDescription: "Melt your points into ",
})



// This layer is mostly minimal but it uses a custom prestige type and a clickable
addLayer("f", {
    infoboxes:{
        coolInfo: {
            title: "Lore",
            titleStyle: {'color': '#FE0000'},
            body: "DEEP LORE!",
            bodyStyle: {'background-color': "#0000EE"}
        }
    },

    startData() { return {
        unlocked: false,
        points: new OmegaNum(0),
        boop: false,
        clickables: {[11]: "Start"}, // Optional default Clickable state
    }},
    color: "#FE0102",
    requires() {return new OmegaNum(10)}, 
    resource: "farm points", 
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "static",
    exponent: 0.5,
    base: 3,
    roundUpCost: true,
    canBuyMax() {return false},
    //directMult() {return new OmegaNum(player.c.otherThingy)},

    row: 1,
    layerShown() {return true}, 
    branches: ["c"], // When this layer appears, a branch will appear from this layer to any layers here. Each entry can be a pair consisting of a layer id and a color.

    tooltipLocked() { // Optional, tooltip displays when the layer is locked
        return ("This weird farmer dinosaur will only see you if you have at least " + this.requires() + " points. You only have " + formatWhole(player.points))
    },
    midsection: [
        "blank", ['display-image', 'https://images.beano.com/store/24ab3094eb95e5373bca1ccd6f330d4406db8d1f517fc4170b32e146f80d?auto=compress%2Cformat&dpr=1&w=390'],
        ["display-text", "Bork bork!"]
    ],
    // The following are only currently used for "custom" Prestige type:
    prestigeButtonText() { //Is secretly HTML
        if (!this.canBuyMax()) return "Hi! I'm a <u>weird dinosaur</u> and I'll give you a Farm Point in exchange for all of your points and lollipops! (At least " + formatWhole(tmp[this.layer].nextAt) + " points)"
        if (this.canBuyMax()) return "Hi! I'm a <u>weird dinosaur</u> and I'll give you <b>" + formatWhole(tmp[this.layer].resetGain) + "</b> Farm Points in exchange for all of your points and lollipops! (You'll get another one at " + formatWhole(tmp[this.layer].nextAtDisp) + " points)"
    },
    getResetGain() {
        return getResetGain(this.layer, useType = "static")
    },
    getNextAt(canMax=false) { //  
        return getNextAt(this.layer, canMax, useType = "static")
    },
    canReset() {
        return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
    },
    // This is also non minimal, a Clickable!
    clickables: {

        masterButtonPress() {
            if (getClickableState(this.layer, 11) == "Borkened...")
                player[this.layer].clickables[11] = "Start"
        },
        masterButtonText() {return (getClickableState(this.layer, 11) == "Borkened...") ? "Fix the clickable!" : "Does nothing"}, // Text on Respec button, optional
        11: {
            title: "Clicky clicky!", // Optional, displayed at the top in a larger font
            display() { // Everything else displayed in the buyable button after the title
                let data = getClickableState(this.layer, this.id)
                return "Current state:<br>" + data
            },
            unlocked() { return player[this.layer].unlocked }, 
            canClick() {
                return getClickableState(this.layer, this.id) !== "Borkened..."},
            onClick() { 
                switch(getClickableState(this.layer, this.id)){
                    case "Start":
                        player[this.layer].clickables[this.id] = "A new state!"
                        break;
                    case "A new state!":
                        player[this.layer].clickables[this.id] = "Keep going!"
                        break;
                    case "Keep going!":
                        player[this.layer].clickables[this.id] = "Maybe that's a bit too far..."
                        break;                        
                    case "Maybe that's a bit too far...":
                        makeParticles(coolParticle, 4)
                        player[this.layer].clickables[this.id] = "Borkened..."
                        break;
                    default:
                        player[this.layer].clickables[this.id] = "Start"
                        break;
                }
            },
            onHold(){
                console.log("Clickkkkk...")
            },
            style() {
                switch(getClickableState(this.layer, this.id)){
                    case "Start":
                        return {'background-color': 'green'}
                        break;
                    case "A new state!":
                        return {'background-color': 'yellow'}
                        break;
                    case "Keep going!":
                        return {'background-color': 'orange'}
                        break;                        
                    case "Maybe that's a bit too far...":
                        return {'background-color': 'red'}
                        break;
                    default:
                        return {}
                        break;
            }},
        },
    },

}, 
)

// A side layer with achievements, with no prestige
addLayer("a", {
        startData() { return {
            unlocked: true,
			points: new OmegaNum(0),
        }},
        color: "yellow",
        resource: "achievement power", 
        row: "side",
        tooltip() { // Optional, tooltip displays when the layer is locked
            return ("Achievements")
        },
        achievementPopups: true,
        achievements: {
            11: {
                image: "discord.png",
                name: "Get me!",
                done() {return true}, // This one is a freebie
                goalTooltip: "How did this happen?", // Shows when achievement is not completed
                doneTooltip: "You did it!", // Showed when the achievement is completed
            },
            12: {
                name: "Impossible!",
                done() {return false},
                goalTooltip: "Mwahahaha!", // Shows when achievement is not completed
                doneTooltip: "HOW????", // Showed when the achievement is completed
                textStyle: {'color': '#04e050'},
            },
            13: {
                name: "EIEIO",
                done() {return player.f.points.gte(1)},
                tooltip: "Get a farm point.\n\nReward: The dinosaur is now your friend (you can max Farm Points).", // Showed when the achievement is completed
                onComplete() {console.log("Bork bork bork!")}
            },
        },
        midsection: ["grid", "blank"],
        grid: {
            maxRows: 3,
            rows: 2,
            cols: 2,
            getStartData(id) {
                return id
            },
            getUnlocked(id) { // Default
                return true
            },
            getCanClick(data, id) {
                return player.points.eq(10)
            },
            getStyle(data, id) {
                return {'background-color': '#'+ (data*1234%999999)}
            },
            onClick(data, id) { // Don't forget onHold
                player[this.layer].grid[id]++
            },
            getTitle(data, id) {
                return "Gridable #" + id
            },
            getDisplay(data, id) {
                return data
            },
        },
    },
)

const coolParticle = {
    image:"options_wheel.png",
    spread: 20,
    gravity: 2,
    time: 3,
    rotation (id) {
        return 20 * (id - 1.5) + (Math.random() - 0.5) * 10
    },
    dir() {
        return (Math.random() - 0.5) * 10
    },
    speed() {
        return (Math.random() + 1.2) * 8 
    },
    onClick() {
        console.log("yay")
    },
    onMouseOver() {
        console.log("hi")
    },
    onMouseLeave() {
        console.log("bye")
    },
    update() {
        //this.width += 1
        //setDir(this, 135)
    },
    layer: 'f',
}

const textParticle = {
    spread: 20,
    gravity: 0,
    time: 3,
    speed: 0,
    text: function() { return "<h1 style='color:yellow'>" + format(player.points)},
    offset: 30,
    fadeInTime: 1,
}