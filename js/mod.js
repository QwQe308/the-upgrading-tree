let modInfo = {
	name: "升级树",
	id: "The_upgrading_tree",
	author: "QwQe308",
	pointsName: "点数",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (0), // Used for hard resets and new players
	
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2",
	name: "",
}

let changelog = `<h1>更新日志:</h1><br>
	<h3>v0.2</h3><br>
		- 添加一排升级.(QwQe308:v0.2全程手机码字呜呜呜)<br><br>
	<h3>v0.1</h3><br>
		- 添加前两排升级.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return false
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints()) return new ExpantaNum(0)
	let gain = new ExpantaNum(1)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function(){
		var U1Function = `点数 = f(t) = ${format(getU1PointMult())} * t<sup>${format(getU1TimeExp())}</sup>`
		return U1Function
	},
	function(){return `t = ${format(player.u1.t)} (+ ${format(getU1TimeSpeed())} /s)`},
	function(){return `当前endgame:38升级点(也许能更多?)+c1完成`},
]

// Determines when the game "ends"
function isEndgame() {
	return player.u1.total.gte(38) && hasChallenge("u1",11)
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
