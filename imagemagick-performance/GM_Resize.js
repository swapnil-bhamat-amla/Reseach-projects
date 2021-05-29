/**
 * Dependency's 
 */ 
var exec = require('child_process').exec;
var json2csv = require('json2csv');
var fs = require('fs');

/**
 * Variables
 */
var THUMBNAIL_MAX_DIM = 150;
var STANDARD_MAX_DIM = 1024; 
var IMAGE_PERFORMANCE_FIELDS = ['Image-Name', 'File-Type', 'File-Size', 'Converted-File-Size', 'Conversion-Time'];
var imagePerfomanceRecords = [];
var imageNameArr = null;
var imageOperation = null;
var performaceCsvName = 'Performace.csv';

/**
 * Core Methods
 */

var getImageNameWOExt = function(imageName){
  return imageName.split(".")[0];
}

var getImageExtension = function(imageName){
  return imageName.split(".")[1];
}

var getBasePath = function(path){
  var basePath = __dirname + path; 
  basePath = basePath.replace(/\\/g, "\\\\").replace(/\//g, "\\\\");
  return basePath;
}

var getSourceImgBasePath = function(){
  var basePath = getBasePath('/public/Images/source/'); 
  return basePath;
}

var getRGBProfileFilePath = function(){
  var filePath = getBasePath('/public/profile/AdobeRGB1998.icc'); 
  return filePath;
}

var getSourceImgSrc = function(imageName){
  var sourceBasePath = getSourceImgBasePath(); 
  return sourceBasePath+imageName;
}

var getCombinePathOfImg = function(basePath, imageName){
  var imageNameWithoutExt = getImageNameWOExt(imageName);
  var imageExtension = getImageExtension(imageName);
  var outputExt = getOutputExtension(imageExtension);
  return basePath + imageNameWithoutExt + outputExt;
}

var getThumbPathOfImg = function(imageName){
  var basePath = getBasePath('/public/Images/converted/GM/Thumbnail/');
  return getCombinePathOfImg(basePath, imageName);
}

var getStdPathOfImg = function(imageName){
  var basePath = getBasePath('/public/Images/converted/GM/Standard/');
  return getCombinePathOfImg(basePath, imageName);
}

var getOutputExtension = function(sourceExt){
      //var outputExt = (sourceExt == "jpg" || sourceExt == "jpeg") ?  ".jpg" : ".png";
      var outputExt = ".png";
      return outputExt; 
}

var runCommand = function(command, sourceImgSrc, targetImgSrc, callback){
  try{
        var processTimeStart = new Date(); 
        exec(command, function(err) {
          var processTime = new Date() - processTimeStart;
          if (err) {
            callback({ "sourceImg":sourceImgSrc, "convertedImg": targetImgSrc, "processTime" : processTime, "errorCmd" : command, "error": err});
          } 
          else{
              callback({ "sourceImg":sourceImgSrc, "convertedImg": targetImgSrc, "processTime" : processTime, "errorCmd" : null, "error": null});
          }
        }); 
  }
  catch(err){
    callback('', err);
  }
}

var getFilesizeInKiloBytes = function(filename) { 
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size;
  return (fileSizeInBytes / 1000);
}

var getPerformanceObj = function(imageName, result, err, processTimeStart){
  var performanceObj = {};
  performanceObj['Image-Name'] = imageName;
  performanceObj['File-Type'] = getImageExtension(imageName);
  performanceObj['File-Size'] = getFilesizeInKiloBytes(getSourceImgSrc(imageName));
  if(err){
    performanceObj['Converted-File-Size'] = 'Error';
    performanceObj['Conversion-Time'] = 'Error';
      //console.log('Error while resizing file which have name '+ fileName + ' ..', result);
  }else{
    performanceObj['Converted-File-Size'] = getFilesizeInKiloBytes(result);
    performanceObj['Conversion-Time'] = processTimeStart;
    //console.log('File resized succesfully..');
  }
  return performanceObj;
}

var recordPerformance = function(fields, record, fileName){
  var toCsv = {
    data: record,
    fields: fields,
    hasCSVColumnTitle: false
  };
  var newLine= "\r\n";
  fs.stat(fileName, function (err, stat) {
    if (err == null) {
        var csv = json2csv(toCsv) + newLine;
        fs.appendFile(fileName, csv, function (err) {
            if (err) throw err;
        });
    }
    else {
        //write the headers and newline
        fields= (fields + newLine);
        fs.writeFile(fileName, fields, function (err, stat) {
            if (err) throw err;   
            var csv = json2csv(toCsv) + newLine;
            fs.appendFile(fileName, csv, function (err) {
                if (err) throw err;
            }); 
        });
    }
});
}

var imageCallback = function(resultObj) {
  //{ "sourceImg":sourceImgSrc, "convertedImg": targetImgSrc, "processTime" : processTime, "errorCmd" : resizeCmd, "error": err}
    var sourceImg = resultObj.sourceImg.replace(/^.*[\\\/]/, '');
    var convertedImg = resultObj.convertedImg;
    var error = resultObj.error;
    var processTimeStart = resultObj.processTime;

    var performanceObj = getPerformanceObj(sourceImg, convertedImg, error, processTimeStart);
    imagePerfomanceRecords.push(performanceObj);
    if(imageNameArr.length > 0) {

      imageOperation(imageNameArr.shift(), imageCallback);
    }
    else {
      recordPerformance(IMAGE_PERFORMANCE_FIELDS, imagePerfomanceRecords, performaceCsvName);
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
}

var generateImage = function(){
  var sourceDir = getSourceImgBasePath();
  readFilesFromDir(sourceDir, (imageNames)=>{
    imageNameArr = imageNames;
    imageOperation(imageNameArr.shift(), imageCallback);
  });
}

/**
 * Resize Process Code 
 */

var getResizeCommand = function(sourceImgSrc, targetImgSrc, dim){
  var resizeCmd = '';
  var sourceExt = getImageExtension(sourceImgSrc);
  var resizeType = (sourceExt == 'ai' || sourceExt == 'svg' || sourceExt == 'pdf' || sourceExt == 'eps') ? "resize" : "scale";
  var quality = (sourceExt == 'jpg' || sourceExt == "jpeg") ? 80 : 20;
  var profilePath = getRGBProfileFilePath();
  resizeCmd = "gm convert -"+resizeType+" "+dim+" \""+sourceImgSrc+"\" -profile \""+profilePath+"\" -quality "+quality+" \""+targetImgSrc+"\"";
  //console.log(resizeCmd);
  //resizeCmd = "convert \""+sourceImgSrc+"\" -resize "+dim+" \""+targetImgSrc+"\"";
  return resizeCmd;
}

var resizeImageToThumbViaGM = function(imageName, callback) { 
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getThumbPathOfImg(imageName);
  var resizeCmd = getResizeCommand(sourceImgSrc, targetImgSrc, THUMBNAIL_MAX_DIM);
  runCommand(resizeCmd, sourceImgSrc, targetImgSrc, callback);
}

var resizeImageToStdViaGM = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getStdPathOfImg(imageName);
  var resizeCmd = getResizeCommand(sourceImgSrc, targetImgSrc, STANDARD_MAX_DIM);
  runCommand(resizeCmd, sourceImgSrc, targetImgSrc, callback);
}

/**
 * Resize Batch Process Code 
 */

var processBatchUsingGM = function(targetDir, sourceDir, dim, callback){
  try{
        var profilePath = getRGBProfileFilePath();
        var batchCmd = "gm mogrify -output-directory \""+targetDir+"\" -sample "+dim+" -profile \""+profilePath+"\" -quality 10 -format png *.*";
        exec(batchCmd, {cwd: sourceDir}, function(err) {
          if (err) {
            callback(batchCmd, err);
          } 
          else{
              callback('');
          }
        }); 
  }
  catch(err){
    callback('', err);
  }
}

var processThumbViaBatchGM = function(){
  var sourceDir = getSourceImgBasePath();
  var targetDir = getBasePath('/public/Images/converted/GM/Thumbnail/');
  var resizeTimeStart = new Date();  

  processBatchUsingGM(targetDir, sourceDir, THUMBNAIL_MAX_DIM, (result, err)=>{
    if(err){
      var totalResizeTime = new Date() - resizeTimeStart;
        console.log('Error while resizing file which have name ..', totalResizeTime);
    }else{
      var totalResizeTime = new Date() - resizeTimeStart;
      console.log('all File resized succesfully..', totalResizeTime);
    }
  });
}

var processStdViaBatchGM = function(){
  var sourceDir = getSourceImgBasePath();
  var targetDir = getBasePath('/public/Images/converted/GM/Standard/');
  var resizeTimeStart = new Date();  
  processBatchUsingGM(targetDir, sourceDir, STANDARD_MAX_DIM, (result, err)=>{
    if(err){
      var totalResizeTime = new Date() - resizeTimeStart;
        console.log('Error while resizing file which have name ..', totalResizeTime);
    }else{
      var totalResizeTime = new Date() - resizeTimeStart;
      console.log('all File resized succesfully..', totalResizeTime);
    }
  });
}

/**
 * Remove color effect command for images.
 */

var getRemoveColorCommand = function(sourceImgSrc, targetImgSrc){
  var command = '';
  var fuzz = 80;
  var color = "#ffffff"
  //{0} -alpha set -channel RGBA -fill none -fuzz {3}% -opaque {1} png32:{2}
  //command = "convert \""+sourceImgSrc+"\" -alpha set -channel RGBA -fill none -fuzz "+fuzz+"% -opaque \""+color+"\" png32:\""+targetImgSrc+"\"";
  command = "convert \""+sourceImgSrc+"\" -fuzz "+fuzz+"% -opaque \""+color+"\" -transparent \""+color+"\" \""+targetImgSrc+"\"";
  return command;
}

var removeColorFromImage = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getStdPathOfImg(imageName);
  var removeColorCmd = getRemoveColorCommand(sourceImgSrc, targetImgSrc);
  runCommand(removeColorCmd, sourceImgSrc, targetImgSrc, callback);
}

/**
 * Remove background effect command for images.
 */

var getRemoveBackgroundCommand = function(sourceImgSrc, targetImgSrc){
  var command = '';
  var fuzz = 80;
  var color = "#ffffff"
  //{0} -bordercolor {1} -border 1x1 -alpha set -fuzz {3}% -fill none -floodfill +0+0 {1} -shave 1x1 png32:{2}
  //command = "convert \""+sourceImgSrc+"\" -bordercolor \""+color+"\" -border 1x1 -alpha set -fuzz "+fuzz+"% -fill none -floodfill +0+0 \""+color+"\" -shave 1x1 png32:\""+targetImgSrc+"\"";
  command = "convert \""+sourceImgSrc+"\" -bordercolor \""+color+"\" -border 1x1 -fuzz "+fuzz+"% -fill none -floodfill +0+0 \""+color+"\" -shave 1x1 \""+targetImgSrc+"\"";
  return command;
}

var removeBackgroundFromImage = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getStdPathOfImg(imageName);
  var removeColorCmd = getRemoveBackgroundCommand(sourceImgSrc, targetImgSrc);
  runCommand(removeColorCmd, sourceImgSrc, targetImgSrc, callback);
}

/**
 * Add black and white to images.
 */

var getBlackAndWhiteEffectCommand = function(sourceImgSrc, targetImgSrc){
  var command = '';
  var threshold = 80;
  //convert source.jpg -negate -threshold 89% -negate png32:target.png
  command = "convert \""+sourceImgSrc+"\" -negate -threshold "+threshold+"% -negate png32:\""+targetImgSrc+"\"";
  //command = "convert \""+sourceImgSrc+"\" -colorspace gray -negate -threshold "+threshold+"% -negate \""+targetImgSrc+"\"";
  return command;
}

var addBlackWhiteEffectToImage = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getStdPathOfImg(imageName);
  var removeColorCmd = getBlackAndWhiteEffectCommand(sourceImgSrc, targetImgSrc);
  runCommand(removeColorCmd, sourceImgSrc, targetImgSrc, callback);
}

/**
 * Add tint color to images.
 */

var getTintEffectCommand = function(sourceImgSrc, targetImgSrc){
  var command = '';
  var color = '#ff0000';
  //convert source.jpg +level-colors "#ff0000" PNG32:target.png
  //command = "convert \""+sourceImgSrc+"\" +level-colors "+color+" png32:\""+targetImgSrc+"\"";
  command = "convert \""+sourceImgSrc+"\" +level-colors "+color+" \""+targetImgSrc+"\"";
  return command;
}

var addTintEffectToImage = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getStdPathOfImg(imageName);
  var tintEffectCmd = getTintEffectCommand(sourceImgSrc, targetImgSrc);
  runCommand(tintEffectCmd, sourceImgSrc, targetImgSrc, callback);
}

/**
 * Add emboss effect to images.
 */

var getEmbossEffectCommand = function(sourceImgSrc, targetImgSrc){
  var command = '';
  var clone = 0;
  var color1 = "black";
  var color2 = "rgb(251,247,245)";
  var shadow1 = "80x2+10+10";
  var shadow2 = "80x1-10-10";
  //convert source.jpg ( -clone 0 -background black -shadow 80x2+10+10 ) ( -clone 0 -background rgb(251,247,245) -shadow 80x1-10-10 ) -reverse -background none -layers merge +repage target.png
  //command = "convert \""+sourceImgSrc+"\" ( -clone "+clone+" -background "+color1+" -shadow "+shadow1+" ) ( -clone "+clone+" -background "+color2+" -shadow "+shadow2+" ) -reverse -background none -layers merge +repage \""+targetImgSrc+"\"";
  command = "convert \""+sourceImgSrc+"\" ( -clone "+clone+" -background "+color1+" -shadow "+shadow1+" ) ( -clone "+clone+" -background "+color2+" -shadow "+shadow2+" ) -reverse -background none -layers merge -quality 20 +repage \""+targetImgSrc+"\" ";
  return command;
}

var addEmbossEffectToImage = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getStdPathOfImg(imageName);
  var tintEffectCmd = getEmbossEffectCommand(sourceImgSrc, targetImgSrc);
  runCommand(tintEffectCmd, sourceImgSrc, targetImgSrc, callback);
}

/**
 * Is image is transparent.
 */

var getIsTransparentImgCommand = function(sourceImgSrc, targetImgSrc){
  //identify -format %[opaque],%A target.jpg
  var command = "identify -format %[opaque],%A \""+sourceImgSrc+"\"";
  return command;
}

var isTransparentImage = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getStdPathOfImg(imageName);
  var isTransparentCmd = getIsTransparentImgCommand(sourceImgSrc, targetImgSrc);
  runCommand(isTransparentCmd, sourceImgSrc, sourceImgSrc, callback);
}


/**
 * Image fill effect to images.
 */

var getImageFillCommand = function(sourceImgSrc, targetImgSrc){
  //convert source.jpg -fill blue -opaque black target.png
  var color = "blue";
  var opaque = "black";
  //var command = "convert \""+sourceImgSrc+"\" -fill "+color+" -opaque "+opaque+" \""+targetImgSrc+"\"" ;
  var command = "gm convert \""+sourceImgSrc+"\" -fill "+color+" -opaque "+opaque+" -quality 20 \""+targetImgSrc+"\"" ;
  return command;
}

var fillImageColor = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getStdPathOfImg(imageName);
  var imageFillCommand = getImageFillCommand(sourceImgSrc, targetImgSrc);
  runCommand(imageFillCommand, sourceImgSrc, targetImgSrc, callback);
}

/**
 * Text fill effect to images.
 */

var getTextFillCommand = function(sourceImgSrc, targetImgSrc){
  //convert source.jpg -fuzz 100% -fill blue -opaque white target.png
  var color = "blue";
  var opaque = "white";
  //var command = "convert \""+sourceImgSrc+"\" -fuzz 100% -fill "+color+" -opaque "+opaque+" \""+targetImgSrc+"\"" ;
  var command = "convert \""+sourceImgSrc+"\" -fuzz 100% -fill "+color+" -opaque "+opaque+" -quality 20 \""+targetImgSrc+"\"" ;
  return command;
}

var fillTextColor = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getStdPathOfImg(imageName);
  var textFillCommand = getTextFillCommand(sourceImgSrc, targetImgSrc);
  runCommand(textFillCommand, sourceImgSrc, targetImgSrc, callback);
}

/**
 * Embroidery inner shadow effect to images.
 */

var getEmbroideryInnerShadowCommand = function(sourceImgSrc, targetImgSrc){
  //convert source.jpg ( -clone 0 -alpha extract ) ( -clone 1 -blur 0x4 -level 20x100% ) +swap -alpha on -compose multiply -composite target.png
  var blur = "0x4";
  var level = "20";
  //var command = "convert \""+sourceImgSrc+"\" ( -clone 0 -alpha extract ) ( -clone 1 -blur "+blur+" -level "+level+"x100% ) +swap -alpha on -compose multiply -composite \""+targetImgSrc+"\"" ;
  var command = "convert \""+sourceImgSrc+"\" ( -clone 0 -alpha extract ) ( -clone 1 -blur "+blur+" -level "+level+"x100% ) -clone +swap -alpha on -compose multiply -quality 20 -composite \""+targetImgSrc+"\"" ;
  return command;
}

var addEmbroideryInnerShadowToImage = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getStdPathOfImg(imageName);
  var textFillCommand = getEmbroideryInnerShadowCommand(sourceImgSrc, targetImgSrc);
  runCommand(textFillCommand, sourceImgSrc, targetImgSrc, callback);
}

/**
 * Embroidery effect to images.
 */

var getEmbroideryCommand = function(sourceImgSrc, targetImgSrc){
  //convert source.jpg ( +clone 0 -alpha off -compose Multiply -composite ) -compose In -composite target.png
  var patternImg = getSourceImgSrc('font.png');
  //var command = "convert \""+sourceImgSrc+"\" ( +clone \""+patternImg+"\" -alpha off -compose Multiply -composite ) -compose In -composite \""+targetImgSrc+"\"" ;
  var command = "convert \""+sourceImgSrc+"\" ( +clone \""+patternImg+"\" -alpha off -compose Multiply -composite ) -compose In -quality 20 -composite \""+targetImgSrc+"\"" ;
  return command;
}

var addEmbroideryToImage = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getStdPathOfImg(imageName);
  var embroideryCommand = getEmbroideryCommand(sourceImgSrc, targetImgSrc);
  runCommand(embroideryCommand, sourceImgSrc, targetImgSrc, callback);
}

/**
 * Texture effect to images.
 */

var getTextureEffectCommand = function(sourceImgSrc, targetImgSrc){
  //convert -compose Dst_In  -gravity center source.jpg source1.jpg -alpha Set target.png
  var patternImg = getSourceImgSrc('font.png');
  //var command = "convert \""+sourceImgSrc+"\" \""+patternImg+"\" -compose Dst_In -gravity center -alpha Set -composite \""+targetImgSrc+"\"" ;
  var command = "convert \""+sourceImgSrc+"\" \""+patternImg+"\" -compose Dst_In -gravity center -alpha Set -composite -quality 20 \""+targetImgSrc+"\"" ;
  return command;
}

var addTextureEffectToImage = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getStdPathOfImg(imageName);
  var textureEffectCommand = getTextureEffectCommand(sourceImgSrc, targetImgSrc);
  runCommand(textureEffectCommand, sourceImgSrc, targetImgSrc, callback);
}

/**
 * Texture effect to images.
 */

var getEmbossDebossEffectCommand = function(sourceImgSrc, targetImgSrc){
  /*
  EffectsEmbossText
  convert source.jpg ( -clone 0 -background black -shadow 50x1-2-1 ) ( -clone 0 -background red -shadow 30x1-2-1 ) -reverse -background none -layers merge +repage target.png 

  EffectsDebossText
  convert source.jpg ( -clone 0 -background red -shadow 50x1+2+1 ) ( -clone 0 -background black -shadow 30x1-2-1 ) -reverse -background none -layers merge +repage target.png
  */ 
  var color1 = 'black';//red
  var color2 = 'red';//black
  //var command = "convert \""+sourceImgSrc+"\" ( -clone 0 -background "+color1+" -shadow 50x1-2-1 ) ( -clone 0 -background "+color2+" -shadow 30x1-2-1 ) -reverse -background none -layers merge +repage \""+targetImgSrc+"\"" ;
  var command = "convert \""+sourceImgSrc+"\" ( -clone 0 -background "+color1+" -shadow 50x1-2-1 ) ( -clone 0 -background "+color2+" -shadow 30x1-2-1 ) -reverse -background none -layers merge -quality 20 +repage \""+targetImgSrc+"\"" ;
  return command;
}

var addEmbossDebossEffectToImage = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getStdPathOfImg(imageName);
  var embossDebossEffectCommand = getEmbossDebossEffectCommand(sourceImgSrc, targetImgSrc);
  runCommand(embossDebossEffectCommand, sourceImgSrc, targetImgSrc, callback);
}

/**
 * Texture effect to images.
 */

var getTextureTrimCommand = function(sourceImgSrc, targetImgSrc){
  //convert source.jpg -trim target.png
  //var command = "convert \""+sourceImgSrc+"\" -trim \""+targetImgSrc+"\"";
  var command = "convert \""+sourceImgSrc+"\" -trim -quality 20 \""+targetImgSrc+"\"";
  return command;
}

var addTextureTrimToImage = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getStdPathOfImg(imageName);
  var textureTrimCommand = getTextureTrimCommand(sourceImgSrc, targetImgSrc);
  runCommand(textureTrimCommand, sourceImgSrc, targetImgSrc, callback);
}

 /**
 * Tint effect with dynamic colors to images.
 */

var getTintEffectWithColorCommand = function(sourceImgSrc, targetImgSrc){
  //gm convert source.jpg -modulate 100,100,255 target.png
  var command = "gm convert \""+sourceImgSrc+"\" -modulate 100,100,255 -quality 20 \""+targetImgSrc+"\"";
  return command;
}

var addTintEffectWithColorToImage = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getStdPathOfImg(imageName);
  var tintEffectWithColorCommand = getTintEffectWithColorCommand(sourceImgSrc, targetImgSrc);
  runCommand(tintEffectWithColorCommand, sourceImgSrc, targetImgSrc, callback);
}

/**
 * Grayscale effect to images.
 */

var getGrayscaleImgCommand = function(sourceImgSrc, targetImgSrc){
  //convert source.jpg -colorspace gray target.png
  //var command = "convert \""+sourceImgSrc+"\" -colorspace gray \""+targetImgSrc+"\"";
  var command = "gm convert \""+sourceImgSrc+"\" -type Grayscale -depth 8 -quality 20 \""+targetImgSrc+"\"";
  return command;
}

var addGrayscaleEffectToImage = function(imageName, callback) {
  var sourceImgSrc = getSourceImgSrc(imageName); 
  var targetImgSrc = getStdPathOfImg(imageName);
  var grayscaleImgCommand = getGrayscaleImgCommand(sourceImgSrc, targetImgSrc);
  runCommand(grayscaleImgCommand, sourceImgSrc, targetImgSrc, callback);
}
 

/**
 * Export code to command prompt.
 */

/**
* Resize Commands
*/

module.exports.generateThumbImages = function(){
  imageOperation = resizeImageToThumbViaGM;
  performaceCsvName = 'Resize_Thumbnail_Performance.csv';
  generateImage();
}

module.exports.generateStdImages = function(){
  imageOperation = resizeImageToStdViaGM;
  performaceCsvName = 'Resize_Standard_Performance.csv';
  generateImage();
}

module.exports.generateThumbInBulk = function(){
  processThumbViaBatchGM();
}

module.exports.generateStdInBulk = function(){
  processStdViaBatchGM();
}

/**
 * Remove background image.
 */

module.exports.removeColorFromImages = function(){
  imageOperation = removeColorFromImage;
  performaceCsvName = 'EffectsRemoveAll_Performance_New.csv';
  generateImage();
}

/**
 * Remove background image.
 */

module.exports.removeBackgroundFromImages = function(){
  imageOperation = removeBackgroundFromImage;
  performaceCsvName = 'EffectsRemoveBackground_Performance_New.csv';
  generateImage();
}

/**
 * Add Black and White Effect to image.
 */

module.exports.addBlackWhiteEffectToImages = function(){
  imageOperation = addBlackWhiteEffectToImage;
  performaceCsvName = 'EffectsBlackAndWhite_Standard.csv';
  generateImage();
}

/**
 * Add Tint Effect to image.
 */

module.exports.addTintEffectToImages = function(){
  imageOperation = addTintEffectToImage;
  performaceCsvName = 'EffectsTint_Standard.csv';
  generateImage();
}

/**
 * Add Emboss Effect to image.
 */

module.exports.addEmbossEffectToImages = function(){
  imageOperation = addEmbossEffectToImage;
  performaceCsvName = 'EffectsEmboss_Standard_New.csv';
  generateImage();
}

/**
 * Add Emboss Effect to image.
 */

module.exports.isTransparentImages = function(){
  imageOperation = isTransparentImage;
  performaceCsvName = 'ImageMagicIsTransparentImage_Standard.csv';
  generateImage();
}

/**
 * Add image fill to image.
 */

module.exports.fillColorToImages = function(){
  imageOperation = fillImageColor;
  performaceCsvName = 'ImageFillColor_Standard_New.csv';
  generateImage();
}

/**
 * Add text fill to image.
 */

module.exports.fillColorToText = function(){
  imageOperation = fillTextColor;
  performaceCsvName = 'TextFillColor_Standard_New.csv';
  generateImage();
}

/**
 * Add embroidery inner shadow to image.
 */

module.exports.addEmbroideryInnerShadowToImages = function(){
  imageOperation = addEmbroideryInnerShadowToImage;
  performaceCsvName = 'EmbroideryInnerShadow_Standard.csv';
  generateImage();
}

/**
 * Add embroidery to image.
 */

module.exports.addEmbroideryToImages = function(){
  imageOperation = addEmbroideryToImage;
  performaceCsvName = 'EffectEmbroidery_Standard_New.csv';
  generateImage();
}

/**
 * Add texture effect to image.
 */

module.exports.addTextureEffectToImages = function(){
  imageOperation = addTextureEffectToImage;
  performaceCsvName = 'TextureEffect_Standard_New.csv';
  generateImage();
}

/**
 * Add texture trim to image.
 */

module.exports.addTextureTrimToImages = function(){
  imageOperation = addTextureTrimToImage;
  performaceCsvName = 'TextureTrimEffect_Standard_New.csv';
  generateImage();
}

/**
 * Add texture trim to image.
 */

module.exports.addEmbossDebossEffectToImages = function(){
  imageOperation = addEmbossDebossEffectToImage;
  performaceCsvName = 'EmbossDebossEffect_Standard_New.csv';
  generateImage();
}

/**
 * Add tint effect with color to image.
 */

module.exports.addTintEffectWithColorToImages = function(){
  imageOperation = addTintEffectWithColorToImage;
  performaceCsvName = 'EffectsTintWithColorWheel_Standard_New.csv';
  generateImage();
}

/**
 * Add grayscale effect to image.
 */

module.exports.addGrayscaleEffectToImages = function(){
  imageOperation = addGrayscaleEffectToImage;
  performaceCsvName = 'EffectsGrayscale_Standard_New.csv';
  generateImage();
}







