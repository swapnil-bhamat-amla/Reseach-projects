/* Dependency's */
var exec = require('child_process').exec;
var convert = require('color-convert');
var json2csv = require('json2csv');
var fs = require('fs');
var cluster = require('cluster');
// Code to run if we're in the master process
if (cluster.isMaster) {
  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length;
  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
  // Listen for dying workers
  cluster.on('exit', function(worker) {
    // Replace the dead worker, we're not sentimental
    console.log('Worker %d died :(', worker.id);
    cluster.fork();
  });

  // Code to run if we're in a worker process
} else {
  /* Setting */
  var express = require('express');
  var bodyParser = require('body-parser');
  var path = require('path');
  var PORT = 5500;
  var app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, 'public'))); //Setting public directory
  app.set('env', 'production');
  app.set('view cache', true);

  /* Main route sends our HTML file */
  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
  });

  /*
   * Colorize API to take image and color as input and return colorize output.
   * Currently supporting two level of image colorization
   */
  app.get('/colorizeImage', function(req, res) {
    var assetsCollectionObj = getAssetsCollectionObj(req.query);
    var quality = req.query && req.query.quality ? req.query.quality : 10;
    var outputImgFormat = req.query && req.query.output ? req.query.output : 'png';
    var outputImgSrc = getConvertedImgSrc(outputImgFormat);
    getColorizeImage(assetsCollectionObj, quality, outputImgSrc, function(outputImg, err) {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        res.sendFile(outputImg);
      }
    });
  });
  app.listen(PORT);
}

/**
 * This method is responsible for returning formated assets collection array from the
 * query object that have been passed.
 * @param {Object} queryStringObj
 * @return {Array} Assets array collection.
 */
var getAssetsCollectionObj = function(queryStringObj) {
  var layerLimit = 6;
  var assetsCollectionArr = [];
  var baseImage = getAssetSrc(queryStringObj['base_image']);
  for (i = 1; i <= layerLimit; i++) {
    var imageName = queryStringObj['image' + i + '_name'];
    var maskImage = queryStringObj['image' + i + '_mask'];
    if (imageName || maskImage) {
      var hexColor = queryStringObj['image' + i + '_color'];
      var layerImgSrc = imageName ? getAssetSrc(imageName) : '';
      var layerMaksSrc = hexColor ? getAssetSrc(maskImage) : '';
      var hexColor = hexColor ? hexColor : '';
      assetsCollectionArr.push({
        layerImgSrc: layerImgSrc,
        layerMaksSrc: layerMaksSrc,
        hexColor: hexColor
      });
    }
  }
  return { baseImage: baseImage, layerArr: assetsCollectionArr };
};

var recordPerformance = function(record) {
  var fields = ['Layer1-Time', 'Layer2-Time', 'Combine-Time', 'Quality', 'Format', 'Thread-Number'];
  var toCsv = {
    data: record,
    fields: fields,
    hasCSVColumnTitle: false
  };
  var newLine = '\r\n';
  fs.stat('performance.csv', function(err, stat) {
    if (err == null) {
      var csv = json2csv(toCsv) + newLine;
      fs.appendFile('performance.csv', csv, function(err) {
        if (err) throw err;
        //console.log('The "data to append" was appended to file!');
      });
    } else {
      //write the headers and newline
      fields = fields + newLine;
      fs.writeFile('performance.csv', fields, function(err, stat) {
        if (err) throw err;
        //console.log('file saved');
      });
    }
  });
};

/**
 * This method is responsible for generating colorized output image from assets given with
 * the desired quality.
 * @param {Object} assetsObj
 * @param {Number} quality
 * @param {String} outputSrc
 * @param {Function} callback
 */
var getColorizeImage = function(assetsObj, quality, outputSrc, callback) {
  try {
    var start = new Date().getTime();
    //console.log(assetsObj);
    var colorizeCommand = getColorizedCommand(assetsObj, quality, outputSrc);
    //  console.log("====================================");
    //  console.log(colorizeCommand);
    //  console.log("====================================");
    exec(colorizeCommand, function(err) {
      if (err) {
        callback('', err);
      }
      var end = new Date().getTime();
      // Now calculate and output the difference
      console.log(end - start);
      callback(outputSrc);
    });
  } catch (err) {
    callback('', err);
  }
};

var getColorizedCommand = function(assetsObj, quality, outputSrc) {
  var colorizeCommand = 'convert ' + '-contrast ' + '-respect-parentheses ';
  //'-interlace line ';
  var layerOutputImgArr = [];
  var baseImage = assetsObj.baseImage;
  baseImage = baseImage.indexOf('-clone') === -1 ? '"' + baseImage + '"' : baseImage;
  var layerArr = assetsObj.layerArr;
  var cloneIndex = 0;
  for (var i = 0; i < layerArr.length; i++) {
    var maskSrc = layerArr[i]['layerMaksSrc'];
    var layerSrc = layerArr[i]['layerImgSrc'];
    var hexColor = layerArr[i]['hexColor'];
    if (layerSrc && maskSrc && hexColor) {
      var tempMaskOutFile = '-clone ' + cloneIndex;
      var tempLayerOutFile = '-clone ' + (cloneIndex + 1);
      cloneIndex += 2;

      colorizeCommand +=
        //'( '+ maskSrc +' -background '+hexColor+' -alpha Shape ) '+
        '( "' +
        maskSrc +
        '" -background ' +
        hexColor +
        ' -channel A -combine ) ' +
        '( ' +
        layerSrc +
        ' ' +
        tempMaskOutFile +
        ' -compose Multiply -composite ) ';
      layerOutputImgArr.push(tempLayerOutFile);
    } else if (maskSrc && hexColor) {
      var tempMaskOutFile = '-clone ' + cloneIndex;
      var tempLayerOutFile = '-clone ' + (cloneIndex + 1);
      cloneIndex += 2;

      colorizeCommand +=
        '( "' +
        maskSrc +
        '" -background ' +
        hexColor +
        ' -channel A -combine ) ' +
        '( ' +
        baseImage +
        ' ' +
        tempMaskOutFile +
        ' -compose Multiply -composite ) ';
      baseImage = tempLayerOutFile;
      baseImage = baseImage.indexOf('-clone') === -1 ? '"' + baseImage + '"' : baseImage;
    } else if (layerSrc) {
      layerOutputImgArr.push('"' + layerSrc + '"');
    }
  }
  var allLayers = layerOutputImgArr.join(' ');
  colorizeCommand +=
    ' ( ' +
    baseImage +
    ' ' +
    allLayers +
    ' -flatten -quality ' +
    quality +
    ' +write "' +
    outputSrc +
    '" ) ' +
    'null:';
  return colorizeCommand;
};

/**
 * This method return rgb object from hex color code.
 * @param {String} hex color code
 * @returns {Object} rgb object
 */
var getRGBFromHex = function(hex) {
  var rgbValue = convert.hex.rgb(hex);
  var red = rgbValue[0];
  var green = rgbValue[1];
  var blue = rgbValue[2];
  return { r: red, g: green, b: blue };
};

/**
 * Image path methods.
 */
var getTargetImgBasePath = function() {
  var basePath = __dirname + '/public/Images/converted/';
  basePath = basePath.replace(/\\/g, '\\\\').replace(/\//g, '\\\\');
  return basePath;
};

var getConvertedImgSrc = function(extension) {
  var convertedBasePath = getTargetImgBasePath();
  return convertedBasePath + 'output.' + extension;
};

var getLayerImgBasePath = function() {
  var basePath = __dirname + '/public/Images/source/';
  basePath = basePath.replace(/\\/g, '\\\\').replace(/\//g, '\\\\');
  return basePath;
};

var getLayerImgMaskSrc = function(imageName) {
  var convertedBasePath = getLayerImgBasePath();
  var imageNameWithoutExt = imageName.split('.')[0];
  return convertedBasePath + imageNameWithoutExt + '_mask.png';
};

var getAssetSrc = function(imageName) {
  var sourceBasePath = getLayerImgBasePath();
  return sourceBasePath + imageName;
};
