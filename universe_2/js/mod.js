let modInfo = {
	name: "升级树-U2",
	nameEN: "The Upgrading Tree-U2",
	id: "The_upgrading_tree_u2",
	author: "QwQe308",
	pointsName: "米",
	pointsNameEN: "M",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (0), // Used for hard resets and new players
	
	offlineLimit: 2,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "",
}

let changelog = `<h1>更新日志(Currently not translated):</h1><br>
	<h3>v0.1</h3><br>
		- 添加内容.`

let winText = `
Congratulations! You have reached the end of this universe, but for now...(Choose “continue” is a good idea).<br>
恭喜通关该宇宙!您已经达到了这个宇宙的当前版本结局...(建议选择“继续”).
`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["autoUpdate","description","descriptionEN"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	let gain = trueDistGain
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function(){
		if(options.ch) return `速度: ${format(player.u.trueSpd,3)} m/s (实际速度:${format(trueDistGain,3)} m/s)`
		return `Speed: ${format(player.u.trueSpd,3)} m/s (Real Speed:${format(trueDistGain,3)} m/s)`
	},
	function(){
		if(options.ch) return `加速度: ${format(getAcc(),3)} m/s<sup>2</sup> (实际加速度:${format(trueSpdGain,3)} m/s<sup>2</sup>)`
		return `Acceleration: ${format(getAcc(),3)} m/s<sup>2</sup> (Real Acceleration:${format(trueSpdGain,3)} m/s<sup>2</sup>)`
	},
	function(){
		if(options.ch) return `时间速率: x${format(getTimeSpeed())}`
		return `Timespeed: x${format(getTimeSpeed())}`
	},
	function(){
		if(options.ch) return `能量: ${format(player.e.energy)}/${format(getMaxEnergy())} (-${format(layers.e.decay())}/s)`
		return `Energy: ${format(player.e.energy)}/${format(getMaxEnergy())} (-${format(layers.e.decay())}/s)`
	},
	function(){
		return (options.ch?`该宇宙当前Endgame:21升级点 + 全升级`:`Current Endgame: 21 Upgrade Points`)
	},
	function(){
		return `FPS:${format(1/trueDiff,0)}`
	},
	function(){
		if(options.ch) if(isEndgame()) return `您已超过当前版本目标,在此之后可能会受到版本软上限!`
		if(isEndgame()) return `After the endgame,there might be some softcaps to prevent inflation!`
	},
]

// Determines when the game "ends"
function isEndgame() {
	return player.u.total.gte(21)
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(7200) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
