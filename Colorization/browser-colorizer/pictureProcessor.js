importScripts("tools.js");

self.onmessage = function (e) {
    var canvasData = e.data.data;
    var binaryData = canvasData.data;
    var l = e.data.length;
    var index = e.data.index;
	var id = e.data.id;
	var hexCode = e.data.hexCode;
    //processSepia(binaryData, l);
	colorize(binaryData, l, hexCode);

    self.postMessage({ result: canvasData, index: index, id: id });
};
