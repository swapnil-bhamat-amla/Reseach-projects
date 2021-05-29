var visibleContainer = 't-shirt';
//var visibleView = 't_shirt\\front1\\shirt.png';
var start = new Date();

$(document).ready(function () {
        setupTshirtProduct();
        attachHandlerOnDom();
        colorChangerHnd();
        //Handlers
        $('[data-prod-selector]').on('click', function (e) {
                $('#loader').show();
                $('#color2-parent').hide();
                $('[data-prod-selector]').removeClass('selected');
                $(this).addClass('selected');
                var showContainer = $(this).attr('data-prod-selector');
                visibleContainer = showContainer;
                showProduct(showContainer);
                colorChangerHnd();
        });


        $('.prod-image').on('load', function (e) {
                var currentContainer = $(e.currentTarget).attr('data-parent');
                if (visibleContainer == currentContainer) {
                        $('#loader').hide();
                        var end = new Date() - start;
                        $("#LoadingTime").html(end);
                        updateOldCapImage();
                }

        });

        $('.prod-image-old').on('load', function(e) {
                $('#loaderOld').hide();
        });

        $('[data-art-view]').on('click', function (e) {
                visibleView = $(this).attr('data-art-view');
                $('[data-art-view]').removeClass('selected');
                $(this).addClass('selected');
                colorChangerHnd();
        });


});

var showProduct = function(productName){
        $('[data-prod-viewer="prod"]').hide();
        $('#' + productName).show();
        console.log(productName);
        switch (productName) {

                case "t-shirt": {
                        setupTshirtProduct();
                        break;
                }
                case "ring": {
                        setupRingProduct();
                        break;
                }
                case "bottle": {
                        setupBagProduct();
                        break;
                }
                case "coleParmer": {
                        setupColeParmerProduct();
                        break;
                }
                case "chair": {
                        setupChairProduct();
                        break;
                }

        }
}

var attachHandlerOnDom = function () {
        $('#color1').on('input', colorChangerHnd);
        $('#color2').on('input', colorChangerHnd);
        $('#selectFormat').on('change', colorChangerHnd);
        $('#quality').on('change', colorChangerHnd);
}

var enableSwatch = function () {
        $('.swatch-clickable').tooltip();
        $('#color1Swatches .swatch-clickable').off('click');
        $('#color1Swatches .swatch-clickable').on('click', function (e) {
                $('#color1Swatches .swatch-clickable').removeClass('selected');
                $(this).addClass('selected');
                var color1 = $(this).attr('data-color');
                $('#color1').val(color1);
                colorChangerHnd();
        });
        $('#color2Swatches .swatch-clickable').off('click');
        $('#color2Swatches .swatch-clickable').on('click', function (e) {
                $('#color2Swatches .swatch-clickable').removeClass('selected');
                $(this).addClass('selected');
                var color2 = $(this).attr('data-color');
                $('#color2').val(color2);
                colorChangerHnd();
        });

        $('#color3Swatches .swatch-clickable').off('click');
        $('#color3Swatches .swatch-clickable').on('click', function (e) {
                $('#color3Swatches .swatch-clickable').removeClass('selected');
                $(this).addClass('selected');
                var color3 = $(this).attr('data-color');
                $('#color3').val(color3);
                colorChangerHnd();
        });

        $('#color4Swatches .swatch-clickable').off('click');
        $('#color4Swatches .swatch-clickable').on('click', function (e) {
                $('#color4Swatches .swatch-clickable').removeClass('selected');
                $(this).addClass('selected');
                var color4 = $(this).attr('data-color');
                $('#color4').val(color4);
                colorChangerHnd();
        });


        $('#color5Swatches .swatch-clickable').off('click');
        $('#color5Swatches .swatch-clickable').on('click', function (e) {
                $('#color5Swatches .swatch-clickable').removeClass('selected');
                $(this).addClass('selected');
                var color5 = $(this).attr('data-color');
                $('#color5').val(color5);
                colorChangerHnd();
        });
}

var colorChangerHnd = colorChangerHnd = function () {
        start = new Date();
        var color1 = encodeURIComponent($('#color1').val());
        var color2 = encodeURIComponent($('#color2').val());
        var color3 = encodeURIComponent($('#color3').val());
        var color4 = encodeURIComponent($('#color4').val());
        var color5 = encodeURIComponent($('#color5').val());
        var format = encodeURIComponent($("#selectFormat option:selected").val());
        var quality = encodeURIComponent($("#quality option:selected").val());
        $('#loader').show();
        switch (visibleContainer) {
                case "t-shirt": {
                        var maskNew = 'cap\\side\\mask.png';
                        var baseImage = 'cap\\side\\base.png';
                        $('#shirtImg').attr(
                          'src',
                          '/colorizeImage?base_image=' +
                            baseImage +
                            '&image1_mask=' +
                            maskNew +
                            '&image1_color=' +
                            color1 +
                            '&output=' +
                            format +
                            '&quality=' +
                            quality
                        );
                        break;
                }
                case "ring": {
                        var image1 = 'pen\\ink_type\\'+color3 + '.tif';
                        var baseImage = 'pen\\base\\base_image.tif';
                        $('#ringImg').attr('src', "/colorizeImage?base_image="+baseImage+"&image1_name="+image1+"&image2_mask=pen\\body\\body_mask.tif&image2_color=" + color1 + "&image3_mask=pen\\cover\\cover_mask.tif&image3_color=" + color2 + "&output=" + format + "&quality=" + quality);
                        break;
                }
                case "bottle": {
                        var baseImage = 'bag\\base\\Front.jpg';
                        $('#bottleImg').attr('src', "/colorizeImage?base_image="+baseImage+"&image1_mask=bag\\back\\bag_mask.png&image1_color=" + color1 + "&image2_name=bag\\back\\bag_handle.png&output=" + format + "&quality=" + quality);
                        break;
                }
                case "coleParmer": {

                        var baseImage = 'cole\\base\\base.jpg';
                        var image1_mask = 'cole\\body\\body.png';
                        //var image2_mask = 'cole\\trim\\trim.png';
                        var image3_mask = 'cole\\function_one\\left_function.png';
                        var image4_mask = 'cole\\function_two\\right_function.png';
                        var image5_mask = 'cole\\surface\\surface.png';
                        var image6 = 'cole\\overlay\\overlay.png';

                        // $('#coleParmerImg').attr('src',
                        // "/colorizeImage?base_image="+baseImage+
                        // "&image1_mask="+image1_mask+"&image1_color=" + color1 +
                        // "&image2_mask="+image2_mask+"&image2_color=" + color2 +
                        // "&image3_mask="+image3_mask+"&image3_color=" + color3 +
                        // "&image4_mask="+image4_mask+"&image4_color=" + color4 +
                        // "&image5_mask="+image5_mask+"&image5_color=" + color5 +
                        // "&image6_name=" + image6 +
                        // "&output=" + format +
                        // "&quality=" + quality);

                        $('#coleParmerImg').attr('src',
                        "/colorizeImage?base_image="+baseImage+
                        "&image1_mask="+image1_mask+"&image1_color=" + color1 +
                        "&image2_mask="+image3_mask+"&image2_color=" + color3 +
                        "&image3_mask="+image4_mask+"&image3_color=" + color4 +
                        "&image4_mask="+image5_mask+"&image4_color=" + color5 +
                        "&image5_name=" + image6 +
                        "&output=" + format +
                        "&quality=" + quality);

                        break;
                }
                case "chair": {
                        var visibleView = 'chair\\body\\body.png';
                        var baseImage = 'chair\\base\\base.jpg';
                        $('#chairImg').attr('src', "/colorizeImage?base_image="+baseImage+"&image1_mask="+visibleView+"&image1_color=" + color1 + "&output=" + format + "&quality=" + quality);
                        break;
                }
        }
};

var setupTshirtProduct = function () {
        $('#color3-parent').hide();
        $('#color2-parent').hide();
        $('#color4-parent').hide();
        $('#color5-parent').hide();

        $('#color1').val("#214232");
        $('#color1-name').html('Cap Color');
        //http://www.staplespromotionalproducts.com/product/Fruit%20of%20the%20Loom%20Heavy%20Cotton%20HD%20Mens%20T-Shirt/80B0R/
        var tShirtColors = {
                "Forest Green":	"#214232",
                "Gold":	"#F4AA00",
                "Kelly":	"#007A50",
                "Maroon":	"#682145",
                "Natural":	"#EEE5D4",
                "Azalea":	"#FC7CB3",
                "Light Blue":	"#68ACE5",
                "Burnt Orange":	"#D95E16",
                "Purple":	"#380982",
                "Royal":	"#0039A6",
                "Yellow":	"#FEE000",
                "White":	"#FFFFFF",
                "Ash":	"#CEC6C0",
                "Athletic Heather":	"#8996A0",
                "Black":	"#252525",
                "Black Dark":	"#000000",
                "Charcoal Gray":	"#575A5D",
                "Columbia Blue":	"#68ACE5",
                "Cyber Pink":	"#E81E75",
                "J. Navy":	"#002C5F",
                "True Red":	"#AC1A2F"
        }
        var tShirtColorHTML = getSwatchesHTML(tShirtColors);
        $('#color1Swatches').html(tShirtColorHTML);
        enableSwatch();
}

var setupRingProduct = function () {

        $('#color3-parent').show();
        $('#color2-parent').show();
        $('#color4-parent').hide();
        $('#color5-parent').hide();

        $('#color1').val("#f24f00");
        $('#color1-name').html('Barrel Color');

        $('#color2').val("#f24f00");
        $('#color2-name').html('Trim Color');

        $('#color3').val("black");
        $('#color3-name').html('Ink Type');
        //http://www.staplespromotionalproducts.com/product/BIC%20Round%20Stic%20Pen/Y1077/
        var ringColor = {
                "Orange":	"#f24f00",
                "Silver":	"#a3a2a0",
                "Cream"	: "#edebbd",
                "Purple":	"#4f008a",
                "Pink":	"#de9cd9",
                "Kelly Green":	"#54c247",
                "Navy":	"#00214d",
                "Teal":	"#4fc7b5",
                "Black":	"#000000",
                "White":	"#ffffff",
                "Red":	"#e60d2e",
                "Blue":	"#0033ab"
        }
        var gemColor = {
                "Orange":	"#f24f00",
                "Silver":	"#a3a2a0",

                "Cream"	: "#edebbd",
                "Purple":	"#4f008a",
                "Pink":	"#de9cd9",
                "Kelly Green":	"#54c247",
                "Navy":	"#00214d",
                "Teal":	"#4fc7b5",
                "Black":	"#000000",
                "White":	"#ffffff",
                "Red":	"#e60d2e",
                "Blue":	"#0033ab"
        }
        var inkColor = {

                "Black": "black",
                "Red": "red",
                "Blue": "blue",
                "Purple": "purple"

        }
        var ringColorHTML = getSwatchesHTML(ringColor);
        var gemColorHTML = getSwatchesHTML(gemColor);
        var inkColorHTML = getSwatchesHTML(inkColor);
        $('#color1Swatches').html(ringColorHTML);
        $('#color2Swatches').html(gemColorHTML);
        $('#color3Swatches').html(inkColorHTML);
        enableSwatch();
}

var setupBagProduct = function () {
        $('#color3-parent').hide();
        $('#color2-parent').hide();
        $('#color4-parent').hide();
        $('#color5-parent').hide();

        $('#color1').val("#ff1e04");
        $('#color1-name').html('Bag Color');

        var bagColor = {
                "Scarlet": "#ff1e04",
                "Orange": "#f96302",
                "Lemon": "#e5e111",
                "Apple": "#3EC141",
                "Curious Blue": "#2D92CE",
                "Grape": "#9b4f96",
                "Hot Pink": "#fc0093",
                "Cyan": "#00ffff"
        }
        var bagColorHTML = getSwatchesHTML(bagColor);
        $('#color1Swatches').html(bagColorHTML);
        enableSwatch();
}

var setupColeParmerProduct = function(){

        $('#color2-parent').show();
        $('#color3-parent').show();
        $('#color4-parent').show();
        $('#color5-parent').show();

        $('#color1').val("#756f6f");
        $('#color1-name').html('Body Color');

        $('#color2').val("#2e60a4");
        $('#color2-name').html('Trim color');

        $('#color3').val("#756f6f");
        $('#color3-name').html('Hot plate color');

        $('#color4').val("#fffdd0");
        $('#color4-name').html('Stirrer color');

        $('#color5').val("#f6f0f0");
        $('#color5-name').html('Material');

        $('#color2-parent').hide();

        var bodyColor = {
                "Dark Gray":	"#756f6f",
                "Sky Blue":	"#6383be",
                "Dark Blue"	: "#2e60a4",
                "Cream":	"#fffdd0",
                "Militry Green":	"#5b5e48",
                "Grey":	"#989898"
        };

        var trimColor = {

                "Dark Blue"	: "#2e60a4",
                "Cream":	"#fffdd0",
                "Militry Green":	"#5b5e48",
                "Grey":	"#989898",
                "Dark Gray":	"#756f6f",
                "Sky Blue":	"#6383be"
        };

        var hotPlate = {
                "Dark Gray":	"#756f6f",
                "Sky Blue":	"#6383be",
                "Dark Blue"	: "#2e60a4",
                "Cream":	"#fffdd0",
                "Militry Green":	"#5b5e48",
                "Grey":	"#989898"
        };

        var stirrer = {

                "Cream":	"#fffdd0",
                "Dark Blue"	: "#2e60a4",
                "Militry Green":	"#5b5e48",
                "Grey":	"#989898",
                "Dark Gray":	"#756f6f",
                "Sky Blue":	"#6383be"
        };

        var surfaceMaterial = {
                "Ceramic":"#f6f0f0",
                "Metal"	: "#969698"
        };

        var bodyColorHTML = getSwatchesHTML(bodyColor);
        var trimColorHTML = getSwatchesHTML(trimColor);
        var hotPlateColorHTML = getSwatchesHTML(hotPlate);
        var stirrerColorHTML = getSwatchesHTML(stirrer);
        var surfaceMaterialHTML = getSwatchesHTML(surfaceMaterial);


        $('#color1Swatches').html(bodyColorHTML);
        $('#color2Swatches').html(trimColorHTML);
        $('#color3Swatches').html(hotPlateColorHTML);
        $('#color4Swatches').html(stirrerColorHTML);
        $('#color5Swatches').html(surfaceMaterialHTML);


        enableSwatch();
}

var setupChairProduct = function () {
        $('#color3-parent').hide();
        $('#color2-parent').hide();
        $('#color4-parent').hide();
        $('#color5-parent').hide();

        $('#color1').val("#214232");
        $('#color1-name').html('Chair Color');
        //http://www.staplespromotionalproducts.com/product/Fruit%20of%20the%20Loom%20Heavy%20Cotton%20HD%20Mens%20T-Shirt/80B0R/
        var chairColors = {
                "Forest Green":	"#214232",
                "Gold":	"#F4AA00",
                "Kelly":	"#007A50",
                "Maroon":	"#682145",
                "Natural":	"#EEE5D4",
                "Azalea":	"#FC7CB3",
                "Light Blue":	"#68ACE5",
                "Burnt Orange":	"#D95E16",
                "Purple":	"#380982",
                "Royal":	"#0039A6",
                "Yellow":	"#FEE000",
                "White":	"#FFFFFF",
                "Ash":	"#CEC6C0",
                "Athletic Heather":	"#8996A0",
                "Black":	"#252525",
                "Charcoal Gray":	"#575A5D",
                "Columbia Blue":	"#68ACE5",
                "Cyber Pink":	"#E81E75",
                "J. Navy":	"#002C5F",
                "True Red":	"#AC1A2F"
        }
        var chairColorHTML = getSwatchesHTML(chairColors);
        $('#color1Swatches').html(chairColorHTML);
        enableSwatch();
}

var getSwatchesHTML = function (collection) {
        var swatchesHTML = '';
        if (!$.isEmptyObject(collection)) {
                swatchesHTML += '<ul class="swatches">';
                var first = true;

                for (var key in collection) {
                        var selectedClassName = (first) ? " selected" : "";
                        swatchesHTML += '<li><div title="' + key + '" class="swatch swatch-clickable' + selectedClassName + '" data-color="' + collection[key] + '" style="background-color:' + collection[key] + '"></div></li>';
                        first = false;
                }
                swatchesHTML += '</ul>';
        }
        return swatchesHTML;
}

var updateOldCapImage = function() {
        $('#loaderOld').show();
        var color1 = encodeURIComponent($('#color1').val());
        var format = encodeURIComponent($('#selectFormat option:selected').val());
        var quality = encodeURIComponent($('#quality option:selected').val());
        var maskOld = 'cap\\side\\mask1.png';
        var baseImage = 'cap\\side\\base1.png';
        $('#shirtImgOld').attr(
        'src',
        '/colorizeImage?base_image=' +
        baseImage +
        '&image1_mask=' +
        maskOld +
        '&image1_color=' +
        color1 +
        '&output=' +
        format +
        '&quality=' +
        quality
        );
}

