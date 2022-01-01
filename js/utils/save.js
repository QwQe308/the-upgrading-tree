var toReset = false
// ************ Save stuff ************
function save() {
	if(toReset) return
	localStorage.setItem(modInfo.id, unescape(encodeURIComponent("eydXRvc2F2ZSI6dHJ1ZSwibXNEaXNwbGF5IjoiYWx3YXlzIiwidGhlbWUiOm51bGwsImhxVHJlZSI6ZmFsc2UsIm9mZmxpbmVQcm9kIjp0cnVlLCJoaWRlQ2hhbGxlbmdlcyI6ZmFsc2UsInNob3dTdG9yeSI6dHJ1ZSwiZm9yY2VPbmVUYWIiOmZhbHNlLCJvbGRTdHlsZSI6ZmFsc2V9"+LZString.compressToBase64(JSON.stringify(player)))));
	localStorage.setItem(modInfo.id+"_options", unescape(encodeURIComponent(btoa(JSON.stringify(options)))));
  //ok it saved fine so the problem must be when loading
}
function startPlayerBase() {
	return {
		tab: layoutInfo.startTab,
		navTab: (layoutInfo.showTree ? layoutInfo.startNavTab : "none"),
		time: Date.now(),
		notify: {},
		versionType: modInfo.id,
		version: VERSION.num,
		beta: VERSION.beta,
		timePlayed: 0,
		keepGoing: false,
		hasNaN: false,

		points: modInfo.initialStartPoints,
		subtabs: {},
		lastSafeTab: (readData(layoutInfo.showTree) ? "none" : layoutInfo.startTab)
	};
}
function getStartPlayer() {
	playerdata = startPlayerBase();

	if (addedPlayerData) {
		extradata = addedPlayerData();
		for (thing in extradata)
			playerdata[thing] = extradata[thing];
	}

	playerdata.infoboxes = {};
	for (layer in layers) {
		playerdata[layer] = getStartLayerData(layer);

		if (layers[layer].tabFormat && !Array.isArray(layers[layer].tabFormat)) {
			playerdata.subtabs[layer] = {};
			playerdata.subtabs[layer].mainTabs = Object.keys(layers[layer].tabFormat)[0];
		}
		if (layers[layer].microtabs) {
			if (playerdata.subtabs[layer] == undefined)
				playerdata.subtabs[layer] = {};
			for (item in layers[layer].microtabs)
				playerdata.subtabs[layer][item] = Object.keys(layers[layer].microtabs[item])[0];
		}
		if (layers[layer].infoboxes) {
			if (playerdata.infoboxes[layer] == undefined)
				playerdata.infoboxes[layer] = {};
			for (item in layers[layer].infoboxes)
				playerdata.infoboxes[layer][item] = false;
		}

	}
	return playerdata;
}
function getStartLayerData(layer) {
	layerdata = {};
	if (layers[layer].startData)
		layerdata = layers[layer].startData();

	if (layerdata.unlocked === undefined)
		layerdata.unlocked = true;
	if (layerdata.total === undefined)
		layerdata.total = new ExpantaNum(0);
	if (layerdata.best === undefined)
		layerdata.best = new ExpantaNum(0);
	if (layerdata.resetTime === undefined)
		layerdata.resetTime = 0;
        if (layerdata.forceTooltip === undefined)
                layerdata.forceTooltip = false;

        layerdata.buyables = getStartBuyables(layer);
        if (layerdata.noRespecConfirm === undefined) layerdata.noRespecConfirm = false
	if (layerdata.clickables == undefined)
		layerdata.clickables = getStartClickables(layer);
	layerdata.spentOnBuyables = new ExpantaNum(0);
	layerdata.upgrades = [];
	layerdata.milestones = [];
	layerdata.lastMilestone = null;
	layerdata.achievements = [];
	layerdata.challenges = getStartChallenges(layer);
	layerdata.grid = getStartGrid(layer);
	layerdata.prevTab = ""
	return layerdata;
}
function getStartBuyables(layer) {
	let data = {};
	if (layers[layer].buyables) {
		for (id in layers[layer].buyables)
			if (isPlainObject(layers[layer].buyables[id]))
				data[id] = new ExpantaNum(0);
	}
	return data;
}
function getStartClickables(layer) {
	let data = {};
	if (layers[layer].clickables) {
		for (id in layers[layer].clickables)
			if (isPlainObject(layers[layer].clickables[id]))
				data[id] = "";
	}
	return data;
}
function getStartChallenges(layer) {
	let data = {};
	if (layers[layer].challenges) {
		for (id in layers[layer].challenges)
			if (isPlainObject(layers[layer].challenges[id]))
				data[id] = 0;
	}
	return data;
}
function fixSave() {
	defaultData = getStartPlayer();
	fixData(defaultData, player);

	for (layer in layers) {
		if (player[layer].best !== undefined)
			player[layer].best = new ExpantaNum(player[layer].best);
		if (player[layer].total !== undefined)
			player[layer].total = new ExpantaNum(player[layer].total);

		if (layers[layer].tabFormat && !Array.isArray(layers[layer].tabFormat)) {

			if (!Object.keys(layers[layer].tabFormat).includes(player.subtabs[layer].mainTabs))
				player.subtabs[layer].mainTabs = Object.keys(layers[layer].tabFormat)[0];
		}
		if (layers[layer].microtabs) {
			for (item in layers[layer].microtabs)
				if (!Object.keys(layers[layer].microtabs[item]).includes(player.subtabs[layer][item]))
					player.subtabs[layer][item] = Object.keys(layers[layer].microtabs[item])[0];
		}
	}
}
function getStartGrid(layer) {
	let data = {};
	if (! layers[layer].grid) return data
	if (layers[layer].grid.maxRows === undefined) layers[layer].grid.maxRows=layers[layer].grid.rows
	if (layers[layer].grid.maxCols === undefined) layers[layer].grid.maxCols=layers[layer].grid.cols

	for (let y = 1; y <= layers[layer].grid.maxRows; y++) {
		for (let x = 1; x <= layers[layer].grid.maxCols; x++) {
			data[100*y + x] = layers[layer].grid.getStartData(100*y + x)
		}
	}
	return data;
}
function fixData(defaultData, newData) {
	for (item in defaultData) {
		if (defaultData[item] == null) {
			if (newData[item] === undefined)
				newData[item] = null;
		}
		else if (Array.isArray(defaultData[item])) {
			if (newData[item] === undefined)
				newData[item] = defaultData[item];

			else
				fixData(defaultData[item], newData[item]);
		}
		else if (defaultData[item] instanceof ExpantaNum) { // Convert to ExpantaNum
			if (newData[item] === undefined)
				newData[item] = defaultData[item];

			else{
                let newItemThing=new ExpantaNum(0)
				newItemThing.array = newData[item].array
				newItemThing.sign = newData[item].sign
				newItemThing.layer = newData[item].layer
                newData[item] = newItemThing
            } 
		}
		else if ((!!defaultData[item]) && (typeof defaultData[item] === "object")) {
			if (newData[item] === undefined || (typeof defaultData[item] !== "object"))
				newData[item] = defaultData[item];

			else
				fixData(defaultData[item], newData[item]);
		}
		else {
			if (newData[item] === undefined)
				newData[item] = defaultData[item];
		}
	}
}
function load() {
	let get = localStorage.getItem(modInfo.id);
	if (get === null || get === undefined) {
		player = getStartPlayer();
		options = getStartOptions();
	}
	else {
		var a = LZString.decompressFromBase64(get.substr(214));
		if(a==null){a=atob(get)}
		else if(a[0]!="{"){a = atob(get)}
		if(a==null){		
			player = getStartPlayer();
			options = getStartOptions();
			if (player.offlineProd) {
				if (player.offTime === undefined){
					player.offTime = { remain: 0 }
				};
				player.offTime.remain += (Date.now() - player.time) / 1000;
			}
			player.time = Date.now();
			versionCheck();
			changeTheme();
			changeTreeQuality();
			updateLayers();
			setupModInfo();
		
			setupTemp();
			updateTemp();
			updateTemp();
			updateTabFormats();
			loadVue();
			return
		}
		if(a[0]!="{"){
			player = getStartPlayer();
			options = getStartOptions();
			if (player.offlineProd) {
				if (player.offTime === undefined){
					player.offTime = { remain: 0 }
				};
				player.offTime.remain += (Date.now() - player.time) / 1000;
			}
			player.time = Date.now();
			versionCheck();
			changeTheme();
			changeTreeQuality();
			updateLayers();
			setupModInfo();
		
			setupTemp();
			updateTemp();
			updateTemp();
			updateTabFormats();
			loadVue();
			return
		}
		a = JSON.parse(a);
		player = Object.assign(getStartPlayer(), a);
		fixSave();
		loadOptions();
	}
	if (player.offlineProd) {
		if (player.offTime === undefined){
			player.offTime = { remain: 0 }
		};
		player.offTime.remain += (Date.now() - player.time) / 1000;
	}
	player.time = Date.now();
	versionCheck();
	changeTheme();
	changeTreeQuality();
	updateLayers();
	setupModInfo();

	setupTemp();
	updateTemp();
	updateTemp();
	updateTabFormats();
	loadVue();
}
function loadOptions() {
	let get2 = localStorage.getItem(modInfo.id+"_options");
	if (get2) {
		options = Object.assign(getStartOptions(), JSON.parse(decodeURIComponent(escape(atob(get2)))));
	}
	else {
		options = getStartOptions()
	}


}
function setupModInfo() {
	modInfo.changelog = changelog;
	modInfo.winText = winText ? winText : `Congratulations! You have reached the end and beaten this game, but for now...`;

}
function exportSave() {
	let str = JSON.stringify(player);
	str = "eydXRvc2F2ZSI6dHJ1ZSwibXNEaXNwbGF5IjoiYWx3YXlzIiwidGhlbWUiOm51bGwsImhxVHJlZSI6ZmFsc2UsIm9mZmxpbmVQcm9kIjp0cnVlLCJoaWRlQ2hhbGxlbmdlcyI6ZmFsc2UsInNob3dTdG9yeSI6dHJ1ZSwiZm9yY2VPbmVUYWIiOmZhbHNlLCJvbGRTdHlsZSI6ZmFsc2V9"+LZString.compressToBase64(str);

	const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
	el.setSelectionRange(0, 99999);
	document.execCommand("copy");
	document.body.removeChild(el);
}
function importSave(imported = undefined, forced = false) {
	if (imported === undefined){
		imported = prompt("Paste your save here")
	};
	try {
		var a = LZString.decompressFromBase64(imported.substr(214));
		if(a[0] != "{"){a = atob(imported)};
		a = JSON.parse(a);
		tempPlr = Object.assign(getStartPlayer(), a);
		if (tempPlr.versionType != modInfo.id && !forced && !confirm("This save appears to be for a different mod! Are you sure you want to import?")){return};
		player = tempPlr;
		player.versionType = modInfo.id;
		fixSave();
		versionCheck();
		save();
		window.location.reload();
	} catch (e) {
		return;
	}
}
function versionCheck() {
	let setVersion = true;

	if (player.versionType === undefined || player.version === undefined) {
		player.versionType = modInfo.id;
		player.version = 0;
	}

	if (setVersion) {
		if (player.versionType == modInfo.id && VERSION.num > player.version) {
			player.keepGoing = false;
			if (fixOldSave){
				fixOldSave(player.version)
			};
		}
		player.versionType = getStartPlayer().versionType;
		player.version = VERSION.num;
		player.beta = VERSION.beta;
	}
}
var saveInterval = setInterval(function () {
	if (options.autosave){save()};
}, 500);