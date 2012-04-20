function getVersion() {
	var details = chrome.app.getDetails();
	return details.version;
}

var currentVersion = getVersion();
var previousVersion = localStorage['version'];

if (previousVersion != currentVersion) { //check if extension is loaded for the first time
			localStorage['version'] = currentVersion;
			chrome.tabs.create({url: "options.html"});
}

chrome.extension.onRequest.addListener(function(request, sender, callback) {
	if (request == 'options') {
		var optionsSend = [];
			optionsSend[0] = localStorage['colorInput'];
			optionsSend[1] = localStorage['fontSizeInput'];
			optionsSend[2] = localStorage['backgroundColorInput'];
			optionsSend[3] = localStorage['borderColorInput']
			optionsSend[4] = localStorage['borderRadiusInput']
			optionsSend[5] = localStorage['showFileSize'];
			optionsSend[6] = localStorage['blockPosition'];
		callback(optionsSend);
	}
});