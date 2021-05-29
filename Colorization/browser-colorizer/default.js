"use strict";

(function () {
	var layerSelectorDrop = document.getElementById('layerSelectorDrop');
	var colorSelectorDrop = document.getElementById('colorSelectorDrop');
	layerSelectorDrop.onchange = function(e){
		validation();					
	}
	
	colorSelectorDrop.onchange = function(e){
				validation();
	}
	
	var validation = function(){
		var selectedLayerValue = layerSelectorDrop.options[layerSelectorDrop.selectedIndex].value;
		var selectedColorValue = colorSelectorDrop.options[colorSelectorDrop.selectedIndex].value;
		if(selectedColorValue == ''){
			//alert('Please select color!');
			return false;
		}
		if(selectedLayerValue == ''){
			//alert('Please Layer First!');
			return false;	
		}
		if(selectedColorValue && selectedLayerValue){
			coloriseLayer(selectedLayerValue, selectedColorValue);
		}		
	}
	
	var coloriseLayer = function(id, hexCode){
		
		var source = document.createElement('img');	
		source.onload = function(e){
		var start = new Date();
		var canvas = document.getElementById("target");
		canvas.width = source.width;
		canvas.height = source.height;
		if (!canvas.getContext) {
			log.innerHTML = "Canvas not supported. Please install a HTML5 compatible browser.";
			return;
		}

		var tempContext = canvas.getContext("2d");
		var len = canvas.width * canvas.height * 4;
		tempContext.drawImage(source, 0, 0, canvas.width, canvas.height);
		/*Check for web worker supported or not*/
		if (!window.Worker) {
			var canvasData = tempContext.getImageData(0, 0, canvas.width, canvas.height);
			var binaryData = canvasData.data;
			//processSepia(binaryData, len);
			colorize(binaryData, len, hexCode);
			tempContext.putImageData(canvasData, 0, 0);
			var pngUrl = canvas.toDataURL(); // PNG is the default
			document.getElementById(id).src = pngUrl;
			var diff = new Date() - start;
			log.innerHTML = "Process done in " + diff + " ms (no web workers)";
			return;
		}

		var workersCount = 4;
		var finished = 0;
		var segmentLength = len / workersCount;
		var blockSize = canvas.height / workersCount;

		var onWorkEnded = function (e) {
			var canvasData = e.data.result;
			var index = e.data.index;
			var id = e.data.id;

			tempContext.putImageData(canvasData, 0, blockSize * index);

			finished++;

			if (finished == workersCount) {
				var pngUrl = canvas.toDataURL(); // PNG is the default
				document.getElementById(id).src = pngUrl;
				var diff = new Date() - start;
				log.innerHTML = "Process done in " + diff + " ms";
			}
		};

		for (var index = 0; index < workersCount; index++) {
			var worker = new Worker("pictureProcessor.js");
			worker.onmessage = onWorkEnded;

			var canvasData = tempContext.getImageData(0, blockSize * index, canvas.width, blockSize);
			worker.postMessage({ data: canvasData, hexCode: hexCode, index: index, length: segmentLength, id: id });
		}
		};
		var convHsv = hex2Hsv(hexCode);
		var valuePer = convHsv.v * 100;
		var grayScaleType = null;
		if(valuePer > 75){
			console.log('Bright image!');
			//grayScaleType = '_B';
			grayScaleType = '_M';
		}
		else if(valuePer <= 75 && valuePer > 25 ){
			console.log('Middle range image!');
			grayScaleType = '_M';
			
		}
		else if(valuePer < 25){
			console.log('Dark image');
			//grayScaleType = '_D';
			grayScaleType = '_M';
		}
		var imageSrc = 'Images/' + id + grayScaleType + '.png';
		source.src = imageSrc;	
	}    
})();

