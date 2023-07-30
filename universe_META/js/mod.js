let modInfo = {
	name: "升级树-元",
	nameEN: "The Upgrading Tree-META",
	id: "The_upgrading_tree_meta",
	author: "QwQe308",
	pointsName: "时间",
	pointsNameEN: "Time",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (0), // Used for hard resets and new players
	
	offlineLimit: 24,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.01",
	name: "新的旅途? - New Journey?",
}

let changelog = `<h1>更新日志(Currently not translated):</h1><br>
	<h3>v1.01</h3><br>
		- 添加元宇宙和宇宙2的英文.<br>
	<h3>v1.0</h3><br>
		- HELLO WORLD.<br>
		- Tips:每个新版本都有可能会降低上一版本难度,以防止卡关.<br>(Each new version might make the previous version easier,to prevent some players from stuck).
`

let winText = `
Congratulations! You have reached the end of this universe, but for now...(Choose “Continue” is a good idea).<br>
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
	let gain = getTimeSpeed()
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function(){
		if(options.ch) return `其他宇宙的数据每秒更新一次.`
		return `The data of the other universes update once per second.`
	},
	function(){
		if(options.ch) return `元宇宙的时间速率加成所有宇宙,每个宇宙里的强度都不相同.`
		return `Meta-Timespeed boosts all universes' timespeed, but works differently in different universe.`
	},
	function(){
		if(options.ch) return `本轮U重置用了${formatTime(player.u.resetTime)}.`
		return `You've spent ${formatTime(player.u.resetTime)} in this U reset.`
	},
	function(){
		if(options.ch) return `在右侧选择你要游玩的树,然后点击“进入该宇宙”游玩!`
		return `Select a universe on the right, then press "Enter The Universe" to play it!`
	},
	function(){
		if(options.ch) return `当前宇宙Endgame:16元升级点.`
		return `Current Endgame in This Universe: 16 Meta-Upgrade Points.`
	},
	function(){
		if(options.ch) if(isEndgame()) return `您已超过当前版本目标,在此之后可能会受到版本软上限!`
		if(isEndgame()) return `After the endgame,there might be some softcaps to prevent inflation!`
	},
    function(){
		return `在元宇宙的设置中可以更换语言 - You can change language in the setting in meta universe`
	},
]

// Determines when the game "ends"
function isEndgame() {
	return player.u.total.gte(16)
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(7200) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){}