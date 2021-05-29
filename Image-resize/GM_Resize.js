/* Dependency's */
var exec = require('child_process').exec;
var json2csv = require('json2csv');
var fs = require('fs');
var gm = require('gm');
var THUMBNAIL_MAX_DIM = 100;
var STANDARD_MAX_DIM = 1200;
var IMAGE_PERFORMANCE_FIELDS = [
  'Image-Name',
  'File-Type',
  'File-Size',
  'Converted-File-Size',
  'Conversion-Time'
];
var imagePerfomanceRecordsGM = [];

var getImageNameWOExt = function(imageName) {
  return imageName.split('.')[0];
};

var getImageExtension = function(imageName) {
  return imageName.split('.')[1];
};

var getBasePath = function(path) {
  var basePath = __dirname + path;
  basePath = basePath.replace(/\\/g, '\\\\').replace(/\//g, '\\\\');
  return basePath;
};

var getSourceImgBasePath = function() {
  var basePath = getBasePath('/public/Images/source/');
  return basePath;
};

var getRGBProfileFilePath = function() {
  var filePath = getBasePath('/public/profile/AdobeRGB1998.icc');
  return filePath;
};

var getSourceImgSrc = function(imageName) {
  var sourceBasePath = getSourceImgBasePath();
  return sourceBasePath + imageName;
};

var getCombinePathOfImg = function(basePath, imageName) {
  var imageNameWithoutExt = getImageNameWOExt(imageName);
  var imageExtension = getImageExtension(imageName);
  var outputExt = getOutputExtension(imageExtension);
  return basePath + imageNameWithoutExt + outputExt;
};

var getOutputExtension = function(sourceExt) {
  var outputExt = sourceExt == 'jpg' || sourceExt == 'jpeg' ? '.jpg' : '.png';
  return outputExt;
};

var getResizeCommand = function(sourceImgSrc, targetImgSrc, dim) {
  var resizeCmd = '';
  var sourceExt = getImageExtension(sourceImgSrc);
  var resizeType =
    sourceExt == 'ai' || sourceExt == 'svg' || sourceExt == 'pdf' || sourceExt == 'eps'
      ? 'resize'
      : 'scale';
  var quality = sourceExt == 'jpg' || sourceExt == 'jpeg' ? 80 : 100;
  var profilePath = getRGBProfileFilePath();
  resizeCmd =
    'gm convert -' +
    resizeType +
    ' ' +
    dim +
    ' "' +
    sourceImgSrc +
    '" -profile "' +
    profilePath +
    '" -quality ' +
    quality +
    ' "' +
    targetImgSrc +
    '"';
  return resizeCmd;
};

var resizeImageToDimViaGM = function(sourceImgSrc, targetImgSrc, dim, callback) {
  try {
    var resizeTimeStart = new Date();
    var resizeCmd = getResizeCommand(sourceImgSrc, targetImgSrc, dim);
    exec(resizeCmd, function(err) {
      var resizeTime = new Date() - resizeTimeStart;
      if (err) {
        callback({
          sourceImg: sourceImgSrc,
          convertedImg: targetImgSrc,
          resizeTime: resizeTime,
          errorCmd: resizeCmd,
          error: err
        });
      } else {
        callback({
          sourceImg: sourceImgSrc,
          convertedImg: targetImgSrc,
          resizeTime: resizeTime,
          errorCmd: null,
          error: null
        });
      }
    });
  } catch (err) {
    callback('', err);
  }
};

var getThumbPathForGM = function(imageName) {
  var basePath = getBasePath('/public/Images/converted/GM/Thumbnail/');
  return getCombinePathOfImg(basePath, imageName);
};

var getStdPathForGM = function(imageName) {
  var basePath = getBasePath('/public/Images/converted/GM/Standard/');
  return getCombinePathOfImg(basePath, imageName);
};

var resizeImageToThumbViaGM = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName);
  var targetImgSrc = getThumbPathForGM(imageName);
  resizeImageToDimViaGM(sourceImgSrc, targetImgSrc, THUMBNAIL_MAX_DIM, callback);
};

var resizeImageToStdViaGM = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName);
  var targetImgSrc = getStdPathForGM(imageName);
  resizeImageToDimViaGM(sourceImgSrc, targetImgSrc, STANDARD_MAX_DIM, callback);
};

var getFilesizeInKiloBytes = function(filename) {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes / 1000;
};

var getPerformanceObj = function(imageName, result, err, resizeTimeStart) {
  var performanceObj = {};
  performanceObj['Image-Name'] = imageName;
  performanceObj['File-Type'] = getImageExtension(imageName);
  performanceObj['File-Size'] = getFilesizeInKiloBytes(getSourceImgSrc(imageName));
  if (err) {
    performanceObj['Converted-File-Size'] = 'Error';
    performanceObj['Conversion-Time'] = 'Error';
    //console.log('Error while resizing file which have name '+ fileName + ' ..', result);
  } else {
    performanceObj['Converted-File-Size'] = getFilesizeInKiloBytes(result);
    performanceObj['Conversion-Time'] = resizeTimeStart;
    //console.log('File resized succesfully..');
  }
  return performanceObj;
};

var recordPerformance = function(fields, record, fileName) {
  var toCsv = {
    data: record,
    fields: fields,
    hasCSVColumnTitle: false
  };
  var newLine = '\r\n';
  fs.stat(fileName, function(err, stat) {
    if (err == null) {
      var csv = json2csv(toCsv) + newLine;
      fs.appendFile(fileName, csv, function(err) {
        if (err) throw err;
      });
    } else {
      //write the headers and newline
      fields = fields + newLine;
      fs.writeFile(fileName, fields, function(err, stat) {
        if (err) throw err;
        var csv = json2csv(toCsv) + newLine;
        fs.appendFile(fileName, csv, function(err) {
          if (err) throw err;
        });
      });
    }
  });
};

var imageNameArr = null;
var resizeImageToDim = null;
var performaceCsvName = 'Performace.csv';

function resizeCallback(resultObj) {
  //{ "sourceImg":sourceImgSrc, "convertedImg": targetImgSrc, "resizeTime" : resizeTime, "errorCmd" : resizeCmd, "error": err}
  var sourceImg = resultObj.sourceImg.replace(/^.*[\\\/]/, '');
  var convertedImg = resultObj.convertedImg;
  var error = resultObj.error;
  var resizeTimeStart = resultObj.resizeTime;

  var performanceObj = getPerformanceObj(sourceImg, convertedImg, error, resizeTimeStart);
  imagePerfomanceRecordsGM.push(performanceObj);
  if (imageNameArr.length > 0) {
    resizeImageToDim(imageNameArr.shift(), resizeCallback);
  } else {
    recordPerformance(IMAGE_PERFORMANCE_FIELDS, imagePerfomanceRecordsGM, performaceCsvName);
  }
}

var readFilesFromDir = function(dirname, onFileNames, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    onFileNames(filenames);
    return;
  });
};

var generateImage = function() {
  var sourceDir = getSourceImgBasePath();
  readFilesFromDir(sourceDir, imageNames => {
    imageNameArr = imageNames;
    resizeImageToDim(imageNameArr.shift(), resizeCallback);
  });
};
/************* Batch Process Code **************/

var processBatchUsingGM = function(targetDir, sourceDir, dim, callback) {
  try {
    var profilePath = getRGBProfileFilePath();
    var batchCmd =
      'gm mogrify -output-directory "' +
      targetDir +
      '" -sample ' +
      dim +
      ' -profile "' +
      profilePath +
      '" -quality 10 -format png *.*';
    exec(batchCmd, { cwd: sourceDir }, function(err) {
      if (err) {
        callback(batchCmd, err);
      } else {
        callback('');
      }
    });
  } catch (err) {
    callback('', err);
  }
};

var processThumbViaBatchGM = function() {
  var sourceDir = getSourceImgBasePath();
  var targetDir = getBasePath('/public/Images/converted/GM/Thumbnail/');
  var resizeTimeStart = new Date();

  processBatchUsingGM(targetDir, sourceDir, THUMBNAIL_MAX_DIM, (result, err) => {
    if (err) {
      var totalResizeTime = new Date() - resizeTimeStart;
      console.log('Error while resizing file which have name ..', totalResizeTime);
    } else {
      var totalResizeTime = new Date() - resizeTimeStart;
      console.log('all File resized succesfully..', totalResizeTime);
    }
  });
};

var processStdViaBatchGM = function() {
  var sourceDir = getSourceImgBasePath();
  var targetDir = getBasePath('/public/Images/converted/GM/Standard/');
  var resizeTimeStart = new Date();
  processBatchUsingGM(targetDir, sourceDir, STANDARD_MAX_DIM, (result, err) => {
    if (err) {
      var totalResizeTime = new Date() - resizeTimeStart;
      console.log('Error while resizing file which have name ..', totalResizeTime);
    } else {
      var totalResizeTime = new Date() - resizeTimeStart;
      console.log('all File resized succesfully..', totalResizeTime);
    }
  });
};

module.exports.generateThumbImages = function() {
  resizeImageToDim = resizeImageToThumbViaGM;
  performaceCsvName = 'Thumbnail_Performance.csv';
  generateImage();
};

module.exports.generateStdImages = function() {
  resizeImageToDim = resizeImageToStdViaGM;
  performaceCsvName = 'Standard_Performance.csv';
  generateImage();
};

module.exports.generateThumbInBulk = function() {
  processThumbViaBatchGM();
};

module.exports.generateStdInBulk = function() {
  processStdViaBatchGM();
};
