/*======================== Path Text Code Started ===============*/
/*Global Variables*/
var canvas, textPathObj, customPathObj, sampleTextObj = null;
var pathTextCount = 0, circleTextCount = 0;
var pathStack = {
        Smiley : 'm225.66946,316.56604q84.55075,58.06915 168.9064,0m-150.58231,-114.68629c0,-8.97401 7.27917,-16.25082 16.25317,-16.25082c8.97397,0 16.25317,7.27681 16.25317,16.25082c0,8.974 -7.27921,16.24841 -16.25317,16.24841c-8.974,0 -16.25317,-7.27441 -16.25317,-16.24841m99.95654,0c0,-8.97401 7.27914,-16.25082 16.24838,-16.25082c8.97876,0 16.25317,7.27681 16.25317,16.25082c0,8.974 -7.27441,16.24841 -16.25317,16.24841c-8.96924,0 -16.24838,-7.27441 -16.24838,-16.24841m-189.7251,46.65526l0,0c0,-86.15755 69.84485,-156 155.99521,-156c86.15991,0 156.00479,69.84245 156.00479,156c0,86.15512 -69.84488,156 -156.00479,156c-86.15036,0 -155.99521,-69.84488 -155.99521,-156zm0,0l0,0c0,-86.15755 69.84485,-156 155.99521,-156c86.15991,0 156.00479,69.84245 156.00479,156c0,86.15512 -69.84488,156 -156.00479,156c-86.15036,0 -155.99521,-69.84488 -155.99521,-156z',
        Circle : 'M 432.3,245.8'+
		' c 0,96.6 -78.4,175 -175,175'+
		' s -175-78.4 -175-175'+
		' s 78.4-175, 175-175'+
		' S 432.3,149.1, 432.3,245.8'+
		' z',
        Hen : 'm280.79654,446.13446c-5.23981,-11.20593 -100.01891,2.80414 -50.42126,-11.71201c19.21365,-3.1293 58.66589,0.7952 19.44281,-7.67032c44.66537,10.61914 64.46094,-26.59573 67.34491,-51.68408c-41.57327,-9.12885 -48.77402,-43.22498 -92.58572,-52.40891c-33.38297,-18.44055 -82.31998,-17.87723 -103.50632,-46.31186c-20.1154,-25.31799 -8.75446,-56.13795 -5.42404,-83.48836c7.92492,-28.87465 24.01899,-58.09804 20.83634,-87.43832c-32.44467,13.16391 -44.30642,-16.26357 -45.04542,-25.45617c-23.8833,4.30505 -39.01214,4.49423 -13.04128,-10.47668c11.6052,-11.33986 17.36722,-36.11359 35.90482,-32.39529c4.89311,-14.99648 17.8741,6.81794 32.22749,-6.431c8.79373,4.67925 27.39478,9.89634 6.7755,18.14711c37.23222,13.23833 67.37834,33.38177 82.88721,59.12065c15.54204,26.15771 46.50548,54.42873 96.5074,47.35137c45.27478,5.47647 98.32083,-13.66774 96.26031,-45.79514c0.8779,-22.76038 32.66483,-75.91779 75.50824,-48.89909c32.10968,8.67606 69.05554,30.16939 61.48053,54.56052c-4.38635,25.15 -0.99854,50.51687 3.16461,75.8711c-26.89117,14.04822 -22.06116,38.44989 -40.84326,56.82449c15.58105,25.87071 0.57617,53.81856 -24.92703,74.82945c-25.50931,19.36511 -62.79599,36.56418 -104.11887,34.0491c-15.78937,18.52142 18.64038,34.81888 30.78848,35.85638c-31.65424,-7.15167 -27.19553,6.5607 -16.75769,21.21072c9.77695,27.43112 -20.91785,-24.43582 -40.74683,0.38055c-15.37302,10.71271 -76.83557,14.33945 -27.07483,1.49872c42.46619,-11.10391 -47.68808,-18.04498 -27.67535,6.97314c6.62177,10.43845 45.02435,15.03476 4.60049,11.05908c-17.8468,-6.61163 -27.39169,16.86304 -41.56125,12.43481zm85.19189,-48.24426c15.539,-13.32758 20.01294,-51.88617 -13.59314,-23.77457c-26.56213,15.17093 -36.16757,41.28162 13.59314,23.77457z',
        Curve1: 'M100,250 C198,110 400,100 261,376',
        Curve2: 'M365,50 C86,49 428,301 164,303',
        Curve3: 'M37,420 C86,49 448,130 463,160',
        Line1: 'M116,98 C118,98 165,156 164,156',
        Line2: 'M0 0 L40 0',
        box: 'm161.935,228.66957l369.50482,0l0,185.31041l-369.50482,0l0,-185.31041zm43.11137,-163.68958l0,142.07423l283.28209,0l0,-142.07423l-283.28209,0z',
		arc: "M 54.600950026045325 189.10065241883677 C 5.3920184978913 164.02744946281354 -14.173855374860025 103.80988155419936 10.899347581163212 54.60095002604533 C 35.972550537186464 5.3920184978913 96.19011844580062 -14.173855374860025 145.39904997395467 10.899347581163198 C 145.8284898135254 11.118158108451297 146.52160061504097 11.478968754101828 146.94715627858903 11.70524071410729",
		arc1: 'M100,250 Q253,311 328,173'
    };

$(document).on('click', '#addPathText', function(e){
    $('#circleTextProperties').hide();
    $('#pathTextProperties').show();
    var text = $('#changeText').val();
	
    var fontFamily = $('#fontFamily').val();
    var fontSize = $('#fontSize').val();
    var changeFontColor = $('#changeFontColor').val();
    /*Class specific properties*/
    var shapeType = $('#shapeType').val();
    var path = pathStack[shapeType];
    pathTextCount++;
    var id = '1024'+'_pathText_'+pathTextCount;
    var pathTextObj = new fabric.PathText(
        text, {
            pathString: path,
            top: 250,
            left:100,
            fontFamily : fontFamily,
            fontSize: fontSize,
            id:id,
            /*Constraints*/
            selectable:true,
            hasControls: true,
            hasRotatingPoint: true,
            lockMovementX: false,
            lockMovementY: false,
            lockRotation: false,
            lockScalingX: false,
            lockScalingY: false,
            lockUniScaling: true,
            borderColor: 'rgba(255, 0, 0, 0.9)', // e.g. white / rgba(255, 255, 255, 0.9) / #FFF
            cornerColor: 'rgba(0, 255, 0, 0.9)', // e.g. white / rgba(255, 255, 255, 0.9) / #FFF
            cornerSize: 10,
            transparentCorners: true,
            hasBorders: true,
            borderOpacityWhenMoving: 0.4
        }
    );
    canvas.add(pathTextObj).renderAll();
});

$(document).on('click', '#addCircleText', function(e){
    $('#circleTextProperties').show();
    $('#pathTextProperties').hide();
    var text = $('#changeText').val();
    var fontFamily = $('#fontFamily').val();
    var fontSize = $('#fontSize').val();
    var changeFontColor = $('#changeFontColor').val();
    /*Class specific properties*/
    var radius = $('#changeRadius').val();
    var startAngle = $('#startAngle').val();
    var endAngle = $('#endAngle').val();
    circleTextCount++;
    var id = '1024'+'_circleText_'+circleTextCount;
    var circleTextObj = new fabric.CircleText(
        text, {
            radius: radius,
            startAngle: startAngle,
            endAngle: endAngle,
            top: 250,
            left:100,
            fontFamily : fontFamily,
            fontSize: fontSize,
            id:id,
            /*Constraints*/
            selectable:true,
            hasControls: true,
            hasRotatingPoint: true,
            lockMovementX: false,
            lockMovementY: false,
            lockRotation: false,
            lockScalingX: false,
            lockScalingY: false,
            lockUniScaling: true,
            borderColor: 'rgba(255, 0, 0, 0.9)', // e.g. white / rgba(255, 255, 255, 0.9) / #FFF
            cornerColor: 'rgba(0, 255, 0, 0.9)', // e.g. white / rgba(255, 255, 255, 0.9) / #FFF
            cornerSize: 10,
            transparentCorners: true,
            hasBorders: true,
            borderOpacityWhenMoving: 0.4,
			textAlign:"left"
        }
    );
    canvas.add(circleTextObj).renderAll();
});

$(document).on('click', '#addText', function(e){
    $('#circleTextProperties').hide();
    $('#pathTextProperties').hide();
    /*This is textbox one*/
    var text = new fabric.Textbox('This is sample text!',{
        fill: "#000",
        fontFamily: "Arial",
        fontSize: "40",
        originalFontSize: '40', /*Actual font size on the final product(product on 100% scale)*/
        fontStyle: "normal",
        fontWeight: "normal",
        textDecoration: "underline",
        textAlign: "center",
        vAlign: 'middle',
        textTransform: "none",
        left: 0,
        top: 0,
        width: 20,
        height: 20,
        stroke: '#f00',
        strokeWidth: 3,
        lineHeight: 1
    });
    canvas.add(text).renderAll();
});
	
	
$(document).on('click', '#addAudio', function(e){
    $('#circleTextProperties').hide();
    $('#pathTextProperties').hide();
	 /*This is image widget */
	 var _widget = { width: 300, height: 300, top:50, left: 50, src: "nod32robot.png", audioSrc: ''};
	  fabric.util.loadImage(_widget.src, function (img) {
           var namedImg = new fabric.Audio(img, _widget);
			namedImg.top = canvas.width / 2;
			namedImg.left = canvas.height / 2;
			canvas.add(namedImg);
			canvas.renderAll();
     });
});

var getWidgetById = function(widgetId){
    var widget = null;
    var widgetArr = canvas.getObjects();
    for(i = 0; i<widgetArr.length; i++){
         if(widgetArr[i].id == widgetId){
             widget = widgetArr[i];
             break;
         }
    }
    return widget;
}

/*Add Other Objects Such as Image, Text, Rect, etc. in canvas*/
var addOtherObjects = function(){
var _widget = { width: 300, height: 300, top:50, left: 50, src: "nod32robot.png", audioSrc: ''};
    
	
	fabric.Image.fromURL("nod32robot.png", function (image) {
        console.log(image);
        if (image.type != "error") {
            canvas.add(image).setActiveObject(image);
            canvas.renderAll();
            loadTexture(canvas);
        }
        else {
            console.log(image.message);
        }

    }, _widget, 'anonymous'); 
	
   canvas = new fabric.Canvas('testCan');
   
	
	
	canvas.on('mouse:up', function (e) { canvas.renderAll(); loadTexture(canvas); });
	canvas.on('object:selected', function(e){
        $('#propertiesPanel').show();
        var activeObject = canvas.getActiveObject();

        if(activeObject.type =='CustomPath'){
            var widget = getWidgetById(activeObject.linkId);
            textPathObj = widget;
            if(widget.type == 'CircleText'){
                $('#circleTextProperties').show();
                $('#pathTextProperties').hide();
            }
            else if(widget.type == 'PathText'){
                $('#circleTextProperties').hide();
                $('#pathTextProperties').show();

            }

        }

    });

   

}

/* Update PathText Object Property When DOM updated */
/*Render Character Entered on keyup*/
$(document).on('keyup', '#changeText', function(e){
    var text = $(this).val();
    var obj = textPathObj;
    var updatedProperty = {
        text: text
    };
    updatePropertyOfWidget(obj, updatedProperty);    
});

$(document).on('change', '#shapeType', function(e){
   var shapeType = $(this).val();
   var shapePath = pathStack[shapeType];
   var updatedProperty = {pathString : shapePath};
   updatePropertyOfWidget(textPathObj, updatedProperty);
});

$(document).on('change', '#textAlign', function(e){
   var alignmnetType = $(this).val();
   var updatedProperty = {textAlign : alignmnetType};
   updatePropertyOfWidget(textPathObj, updatedProperty);
});

var getPathData = function(){
		
		var radius = parseFloat($('#changeRadius').val());
		var startAngle = parseFloat($('#startAngle').val());
		var endAngle = parseFloat($('#endAngle').val());
		var direction = $('#Direction').val();
		clockwise = (direction=='ClockWise')? true : false;
		var updatedProperty = {radius : radius, startAngle:startAngle, endAngle:endAngle, clockwise: clockwise };
		return updatedProperty; 
}

$(document).on('change', '#fontFamily', function(e){
    var fontFamily = $(this).val();
	var obj = textPathObj;
	var updatedProperty = {fontFamily : fontFamily};
	updatePropertyOfWidget(obj, updatedProperty);
});

$(document).on('change', '#fontSize', function(e){
    var fontSize = $(this).val();
	var obj = textPathObj;
	var updatedProperty = {fontSize : fontSize, originalFontSize : fontSize};
	updatePropertyOfWidget(obj, updatedProperty);     
});

$(document).on('change', '#changeFontColor', function(e){
    var fontColor = $(this).val();
	var obj = textPathObj;
	var updatedProperty = {fill : fontColor};
	updatePropertyOfWidget(obj, updatedProperty);     
});

$(document).on('change', '#changeFontColor', function(e){
    var fontColor = $(this).val();
	var obj = textPathObj;
	var updatedProperty = {fill : fontColor};
	updatePropertyOfWidget(obj, updatedProperty);     
});

$(document).on('keyup', '#changeRadius, #startAngle, #endAngle', function(e){
     	var updatedProperty = getPathData();
		var obj = textPathObj;
		if(isNaN(updatedProperty.radius)){
			alert('Invalid Radius!');
			return false;
		}
		if(isNaN(updatedProperty.startAngle) ||  isNaN(updatedProperty.endAngle)){
			alert('Invalid Start angle or End angle!');
			return false;
		}
        else if(updatedProperty.startAngle < 0 || updatedProperty.endAngle < 0){
            alert('Start angle and End angle should be greater than zero!');
            return false;
        }
		else if(updatedProperty.startAngle == updatedProperty.endAngle){
			alert('Start angle and end angle should not be the same!');
			return false;	
		}
		else{
			updatePropertyOfWidget(obj, updatedProperty); 
		}
});
$(document).on('change', '#Direction', function(e){
		var updatedProperty = getPathData();
		var obj = textPathObj;
		updatePropertyOfWidget(obj, updatedProperty); 
});


$(document).on('change', '#removeChar', function(e){
		var removeCharMethod = $(this).val();
		var obj = textPathObj;
		var property = {};
		if(removeCharMethod == 'removeExtraChar'){
			property = {removeExtraChar : true, wantTextPathWithLessOverlap : false };
		}
		else if(removeCharMethod == 'wantTextPathWithLessOverlap'){
			property = {removeExtraChar : false, wantTextPathWithLessOverlap : true };
		}
		var updatedProperty = property;
		updatePropertyOfWidget(obj, updatedProperty);
});



/*Canvas Methods*/
var updatePropertyOfWidget = function(widget, property){
		//console.log(widget.type, widget.id);
		widget.set(property);
     	canvas.renderAll();
}

var exportCanvasToJSON = function() {
    var objectToExport = canvas;
    var svgObject = objectToExport.toJSON();
   console.log(svgObject);
};


/* ======================= Hack Methods to download svg files ========================== */
var exportCanvasToSVG = function() {
    var objectToExport = canvas;
    // Get object containing only necessary data. xmlns:xlink necessary to reference textPath by id.
    var svgObject = objectToExport.toSVG();
    // Remove line endings.
    var potentialFilename = "";
    // Pick an appropriate name.
    var filename = (potentialFilename === "") ? "curved-text" : potentialFilename;
    // Go through the file and replace non-ASCII characters (i.e. the text) with entities.
    var encodedSvgObject = svgObject.replace(/[^\u0000-\u0080]/g, function(i) {
        return '&#' + i.charCodeAt(0) + ';';
    });
    // Make an inline file object.
    var base64String = fabric.window.btoa(encodedSvgObject);
    initiateFileDownload("data:application/octet-stream;base64," + base64String, filename + ".svg");
};

var initiateFileDownload = function(uri, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        fabric.document.body.appendChild(link); // Firefox requires the link to be in the body.
        link.download = filename;
        link.href = uri;
        link.click();
        document.body.removeChild(link); // Remove the link when done.
    } else {
        location.replace(uri);
    }
};

var logger = function()
{
    var oldConsoleLog = null;
    var pub = {};

    pub.enableLogger =  function enableLogger()
    {
        if(oldConsoleLog == null)
            return;

        window['console']['log'] = oldConsoleLog;
    };

    pub.disableLogger = function disableLogger()
    {
        oldConsoleLog = console.log;
        window['console']['log'] = function() {};
    };

    return pub;
}();

/* ======================= Hack Methods to download svg files  ========================== */