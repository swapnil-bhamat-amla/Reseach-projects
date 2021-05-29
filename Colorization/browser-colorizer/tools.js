function noise() {
    return Math.random() * 0.5 + 0.5;
};

function clamp(component) {
    return Math.max(Math.min(255, component), 0);
}

function colorDistance(scale, dest, src) {
    return clamp(scale * dest + (1 - scale) * src);
};

var processBW = function (binaryData, l) {
    for (var i = 0; i < l; i += 4) {
        var r = binaryData[i];
        var g = binaryData[i + 1];
        var b = binaryData[i + 2];
        var luminance = r * 0.21 + g * 0.71 + b * 0.07;
        binaryData[i] = luminance;
        binaryData[i + 1] = luminance;
        binaryData[i + 2] = luminance;
    }
};

var processSepia = function (binaryData, l) {
    for (var i = 0; i < l; i += 4) {
        var r = binaryData[i];
        var g = binaryData[i + 1];
        var b = binaryData[i + 2];

        binaryData[i] = colorDistance(noise(), (r * 0.393) + (g * 0.769) + (b * 0.189), r);
        binaryData[i + 1] = colorDistance(noise(), (r * 0.349) + (g * 0.686) + (b * 0.168), g);
        binaryData[i + 2] = colorDistance(noise(), (r * 0.272) + (g * 0.534) + (b * 0.131), b);
    }
};

var colorize = function (binaryData, l, hexCode) {
	var rgbValue = hexToRgb(hexCode);
	var hslValue = rgb2hsl(rgbValue.r, rgbValue.g, rgbValue.b);
	var curHue = hslValue.h; 
	var curSat = hslValue.s; 
	var curLum = hslValue.l; // commented because luminance value is taken from grey scale image so it is taken as one
	//(((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
	curLum = (((curLum - 0) * (200 + 0)) / (100 - 0)) - 0;
	curLum = curLum / 100;
	//var curLum = 1;
   for (var i = 0; i < l; i += 4) {
		var r = binaryData[i];
		var g = binaryData[i + 1];
		var b = binaryData[i + 2];
		hsl = rgb2hsl (r, g, b);
		hsl.h = curHue;
		hsl.s = curSat;
		hsl.l *= curLum;
		rgb = hsl2rgb(hsl.h, hsl.s, hsl.l);
				
		binaryData[i] = rgb.r;
        binaryData[i + 1] = rgb.g;
        binaryData[i + 2] = rgb.b;
	}
}



// code taken from nichabi.com
function hsl2rgb (h, s, l) {

    var r, g, b, m, c, x

    if (!isFinite(h)) h = 0
    if (!isFinite(s)) s = 0
    if (!isFinite(l)) l = 0

    h /= 60
    if (h < 0) h = 6 - (-h % 6)
    h %= 6

    s = Math.max(0, Math.min(1, s / 100))
    l = Math.max(0, Math.min(1, l / 100))

    c = (1 - Math.abs((2 * l) - 1)) * s
    x = c * (1 - Math.abs((h % 2) - 1))

    if (h < 1) {
        r = c
        g = x
        b = 0
    } else if (h < 2) {
        r = x
        g = c
        b = 0
    } else if (h < 3) {
        r = 0
        g = c
        b = x
    } else if (h < 4) {
        r = 0
        g = x
        b = c
    } else if (h < 5) {
        r = x
        g = 0
        b = c
    } else {
        r = c
        g = 0
        b = x
    }

    m = l - c / 2
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return { r: r, g: g, b: b }
}


// code taken from nichabi.com
function rgb2hsl (r, g, b) 
{
    var max, min, h, s, l, d
    r /= 255
    g /= 255
    b /= 255
    max = Math.max(r, g, b)
    min = Math.min(r, g, b)
    l = (max + min) / 2
    if (max == min) {
        h = s = 0
    } else {
        d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }
        h /= 6
    }
    h = Math.floor(h * 360)
    s = Math.floor(s * 100)
    l = Math.floor(l * 100)
    return { h: h, s: s, l: l }
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgb2hsv (r,g,b) {
 var computedH = 0;
 var computedS = 0;
 var computedV = 0;

 //remove spaces from input RGB values, convert to int
 var r = parseInt( (''+r).replace(/\s/g,''),10 ); 
 var g = parseInt( (''+g).replace(/\s/g,''),10 ); 
 var b = parseInt( (''+b).replace(/\s/g,''),10 ); 

 if ( r==null || g==null || b==null ||
     isNaN(r) || isNaN(g)|| isNaN(b) ) {
   alert ('Please enter numeric RGB values!');
   return;
 }
 if (r<0 || g<0 || b<0 || r>255 || g>255 || b>255) {
   alert ('RGB values must be in the range 0 to 255.');
   return;
 }
 r=r/255; g=g/255; b=b/255;
 var minRGB = Math.min(r,Math.min(g,b));
 var maxRGB = Math.max(r,Math.max(g,b));

 // Black-gray-white
 if (minRGB==maxRGB) {
  computedV = minRGB;
  return [0,0,computedV];
 }

 // Colors other than black-gray-white:
 var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
 var h = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
 computedH = 60*(h - d/(maxRGB - minRGB));
 computedS = (maxRGB - minRGB)/maxRGB;
 computedV = maxRGB;
 return {h:computedH,s:computedS,v:computedV};
}

function hex2Hsv(hexCode){
	var rgbValue = hexToRgb(hexCode);
	var hsvValue = rgb2hsv(rgbValue.r, rgbValue.g, rgbValue.b);
	return hsvValue;	
}
