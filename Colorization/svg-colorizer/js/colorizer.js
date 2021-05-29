String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
var svgStringObj = { front: '', back: '' };
const CONST_COLOR1 = '#F9F9F9';
const CONST_COLOR2 = '#64001E';
const CONST_COLOR3 = '#6E091B';
const CONST_FONT_FAMILY = 'ArialMT';
const TEXT1 = 'MENOMONIE';
const TEXT2 = 'MUSTANGS';

var currentSVGName = 'front';

var getSVGString = function(name, callback) {
  if (svgStringObj[name] != '') {
    callback(svgStringObj[name]);
  } else if (name == 'front') {
    jQuery.get(
      './svg/Front.svg',
      function(data) {
        svgStringObj.front = data;
        callback(svgStringObj.front);
      },
      'text'
    );
  } else if (name == 'back') {
    jQuery.get(
      './svg/Back.svg',
      function(data) {
        svgStringObj.back = data;
        callback(svgStringObj.back);
      },
      'text'
    );
  }
};

var renderSvgString = function(svgString) {
  $('#svgPreview').html(svgString);
};

var renderSVGFromName = function(svgName) {
  $('#loader').show();
  getSVGString(svgName, function(svgString) {
    $('#loader').hide();
    renderSvgString(svgString);
  });
};

var colorizeSVG = function() {
  var color1Hex = $('#color1').val();
  var color2Hex = $('#color2').val();
  var color3Hex = $('#color3').val();
  var fontFamily = $('#font-family')
    .find(':selected')
    .val();
  var text1 = $('#text-one')
    .val()
    .toUpperCase();
  var text2 = $('#text-two')
    .val()
    .toUpperCase();

  $('#loader').show();
  getSVGString(currentSVGName, function(svgString) {
    var newString = svgString.replaceAll(CONST_COLOR1, color1Hex);
    newString = newString.replaceAll(CONST_COLOR2, color2Hex);
    newString = newString.replaceAll(CONST_COLOR3, color3Hex);
    newString = newString.replaceAll(CONST_FONT_FAMILY, fontFamily);
    newString = newString.replaceAll(TEXT1, text1);
    newString = newString.replaceAll(TEXT2, text2);

    $('#loader').hide();
    renderSvgString(newString);
  });
};

$(document).ready(function(e) {
  renderSVGFromName(currentSVGName);

  $('[data-prod-selector]').click(function(e) {
    var svgName = $(this).attr('data-prod-selector');
    currentSVGName = svgName;
    renderSVGFromName(svgName);
    colorizeSVG();
  });

  $('[data-attr="color"]').change(function(e) {
    colorizeSVG();
  });

  $('[data-attr="text-box"]').keyup(function(e) {
    colorizeSVG();
  });
});

//getSVGString();
