// Add necessary methods to the fabric.Point class. Required to determine tangent given two points.
fabric.util.object.extend(fabric.Point.prototype, {
    /**
     * Returns the angle in degrees between this point and another one
     * @param {fabric.Point} that
     * @return {Number}
     */
    degreesBetween: function(that) {
      return fabric.util.radiansToDegrees(this.radiansBetween(that));
    },

    /**
     * Returns the angle in radians between this point and another one
     * @param {fabric.Point} that
     * @return {Number}
     */
    radiansBetween: function(that) {
      var p1 = this,
          p2 = that;
      // Angle in radians.
      return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }
});

(function (global) {
    'use strict';
    /**
     * Getting methods needed for from Util class.
     */
    var fabric = global.fabric || (global.fabric = {}),
        extend = fabric.util.object.extend,
        clone = fabric.util.object.clone,
        toFixed = fabric.util.toFixed;
    var degreesToRadians = fabric.util.degreesToRadians;
    if (fabric.PathText) {
        fabric.warn('fabric.PathText is already defined');
        return;
    }
    if (!fabric.Object) {
        fabric.warn('fabric.PathText requires fabric.Object');
        return;

    }
  	
	
	// Extend fabric.Text to include the necessary methods to render the text along a line (as opposed to, say, physically positioning some group of letters).
    fabric.PathText = fabric.util.createClass(fabric.IText, {
	
	/*
	* fabric.Path define type of object
	*/	
	type: 'PathText',
       
    /**
     * fabric.Path that the text observes
     * @type fabric.Path
     */
    textPath: null,

    /**
     * Distance along the fabric.Path in fabric.Text#textPath that the text should start at
     * @type fabric.Path
     */
    textPathDistanceOffset: null,

    /**
     * If fabric.Text#textPath exists, should letters rotate along the path or not
     * @type Boolean
     */
    wantObservePathRotation: true,

    /**
     * If fabric.Text#textPath exists, should letters be subject to collision detection to help ensure legibility or not
     * Edited :: This feature will remove extra characters when path get filled up.
     * @type Boolean
     */
    wantTextPathWithLessOverlap: false,

    /**
     * If fabric.Text#textPath exists, should a faded, untransformed version of fabric.Text#text be rendered or not
     * @type Boolean
     */
    wantTextPathResidue: false,

    /**
     * If fabric.Text#textPath exists and non-zero, the fabric.Path in fabric.Text#textPath will be approximated to this number of points; otherwise, path will be drawn as-is
     * @type Number
     */
    wantApproximationDetail: 0,

    /**
     * If true, do not destroy the fabric.Text#_boundaries object; otherwise, perform all boundary calculations every time
     * @type Boolean
     */
    isFrozen: false,

    /**
     * Edited ::
     * If true, remove extra characters  when path get filled up depends upon the angle
     * @type Boolean
     */
    removeExtraChar: true,

    /**
     * Edited ::
     * This is to maintain font size that added when widget object created first time because we are changing font size to maintain proportion.
     * @type Number
     */
	originalFontSize: 30,
	
	/**
     * Edited ::
     * This flag is used in debugging mode this flag will add border on all characters
     * @type Number
     */
	debug: false,

    /**
     * fabric.Path String on which text will be drawn
     * @type fabric.Path
     */
    pathString: 'M100,250 C198,110 400,100 261,376',

    /**
     * Edited ::
     * If true, then representing text (characters) are going out of path otherwise it will be false.
     * @type Boolean
     */
    isOutOfPath: false,
	
	lineHeight: 1,

	originX: 'center',

	originY: 'center',

	left: 1,

	top: 1,

	scaleX: 1,

	scaleY: 1,

	angle:0,

	stroke: null,

    id: 'pathText_1',

    objectCaching: false,   // Disable object caching otherwise the text is clipped inside the fabric.Text bounding box

    allowPathProp: {
        top: 1,
        left: 1,
        originX: 'center',
        originY: 'center',
        scaleX : 1,
        scaleY: 1,
        angle: 0,
        hasControls: true,
        hasRotatingPoint: true,
        lockMovementX: false,
        lockMovementY: false,
        lockRotation: false,
        lockScalingX: false,
        lockScalingY: false,
        lockUniScaling: true,
        borderColor: 'rgba(255, 255, 255, 0.9)', // e.g. white / rgba(255, 255, 255, 0.9) / #FFF
        cornerColor: 'rgba(186, 186, 186, 0.9)', // e.g. white / rgba(255, 255, 255, 0.9) / #FFF
        cornerSize: 10,
        transparentCorners: false,
        hasBorders: true,
        borderOpacityWhenMoving: 0.4,
        id: 'pathText_1_customPath',
        linkId: 'pathText_1',
        selectable: true
    },
	
	initialize: function (objects, options) {
        options || (options = {});
		options = this._createPathObject(options);
        this.callSuper('initialize', objects, options);
		this.on('added', this._addPathObject);
    },
	
	/*
	* Edited :: Added this method to create path object on client end.
	*/
	_createPathObject: function(options){
		options.pathString = (options.pathString && options.pathString != '' && options.pathString != null)? options.pathString : this.pathString;
		var pathOptions = this.mapPathProperties(options);
        /*Added custom properties for path object to link tow objects*/
        pathOptions['id'] = (typeof options['id'] !== "undefined")? options['id'] + '_customPath' : this.allowPathProp['id']  + '_customPath';
        pathOptions['linkId'] = (typeof options['id'] !== "undefined")? options['id'] : this.allowPathProp['id'];
		options.textPath = new fabric.CustomPath(options.pathString, pathOptions);
        /*Making Text Objected non selected so that custom path should have control*/
        options.selectable = false;
        return options;
	},

    /*
     * Edited :: Removed both path and text object at a time.
     */
    /**
     * Removes object from canvas to which it was added last
     * @return {fabric.Object} thisArg
     * @chainable
     */
    remove: function() {
        if(this.textPath){
            this.canvas.remove(this.textPath);
        }
        this.canvas.remove(this);
        return this;
    },

    getWidth: function () {
        return this.textPath.getWidth() + this.textPath.padding*2;
    },

    getHeight: function () {
        return this.textPath.getHeight() + this.textPath.padding*2;
    },

    mapPathProperties: function(options){
        var filterOptions = {};
        for(var propName in this.allowPathProp){
            filterOptions[propName] = (typeof options[propName] !== "undefined")? options[propName]: this.allowPathProp[propName];
        }
        return filterOptions;
    },

    _addPathObject: function(e){
		var _this = this;
		this.canvas.add(this.textPath).renderAll();
        _this._observePathObject(_this);
        this.textPath.on('modified', function(e){ _this._observePathObject(_this); });
    },
	
	_observePathObject: function(_this){
       var widget = _this.textPath;
	   var obj = _this;
        var fontSize = null;
        if(widget.scaleX == widget.scaleY){
            fontSize = obj.originalFontSize / (widget.scaleX);
        }
		var updatedProperty = {
            top: widget.top,
            left: widget.left,
            scaleX: widget.scaleX,
            scaleY: widget.scaleY,
            fontSize: fontSize,
            angle: widget.angle
        };		
		this._updatePropertyOfWidget(obj, updatedProperty); 
	},
	
	_updatePropertyOfWidget : function(widget, property){
		widget.set(property);
     	this.canvas.renderAll();
	},

	_set: function(prop, value) {
        // Dirty workaround for text alignment on new fabric.js version (1.7+)
        // The only way to make the 'center' text alignment to work is to set the
        //  originX to left. The alignment is not exactly perfect but is almost there.
        // Right text alignment still doesn't work.
        if(prop == 'textAlign') {
            if(value == 'center') {
                this.callSuper('_set', 'originX', 'left');
                this.callSuper('_set', 'originY', 'center');
            }
            else {
                this.callSuper('_set', 'originX', 'center');
                this.callSuper('_set', 'originY', 'center');
            }
        }
        if(prop == 'pathString' && typeof value != 'object' && this.canvas){
			var options = {};
            var pathOptions = this.mapPathProperties(this.textPath);
			options.textPath = new fabric.CustomPath(value, pathOptions);
			this.canvas.remove(this.textPath);
			this.canvas.add(options.textPath);
			this.textPath = options.textPath;
			this.textPath.setCoords();
			// For selecting of path update.
			if (this.textPath.selectable) {
                this.canvas.setActiveObject(this.textPath);
            }
			this.canvas.renderAll();
			var _this = this;
			this.textPath.on('modified', function(e){ _this._observePathObject(_this) });
			// Hack because does not found best solution for get key
			prop = 'textPath';
			value = this.textPath;
		}
        else if(this.textPath && typeof this.allowPathProp[prop] !== "undefined"){
            this.textPath.set(prop, value);
            if(prop != 'selectable'){
                this.callSuper('_set', prop, value);
            }
        }
		else{
		 	this.callSuper('_set', prop, value);
		}

        // Add padding to the CustomPath object half the height of the line to make the bounding box
        //  bigger
        if(this.textPath && this.canvas) {
            this.textPath.set('padding', this._getObservedTotalLineHeight(this)/2 + 1);
        }
		return this;
    },
	
	 /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     */
    _renderTextBackground: function(ctx, textLines) {
	  //console.log('_renderTextBackground',7);
      // If no text path, draw normally. Otherwise, depend on fill or stroke pass.
	  //this._addPathObject();
      if (this.textPath == null) {
        this._renderTextBoxBackground(ctx);
        this._renderTextLinesBackground(ctx, textLines);
      }
    },
	
	
	/**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     */
    _renderTextFill: function(ctx, textLines) {
	  //console.log('_renderTextFill',5);
      if (!this.fill && !this._skipFillStrokeCheck) {
        return;
      }
      if (this._boundaries == null || this.isFrozen == null || this.isFrozen === false) {
        this._boundaries = [];
      }
      this._renderTextLines("fillText", ctx, this._getTextLines());
    },


    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     */
    _setBoundaries: function(ctx, textLines) {
		//console.log('_setBoundaries',1);
	
      // Only set the boundaries if necessary.
      if (this.isFrozen == null || this.isFrozen === false) {
        // Reset boundaries.
        this._boundaries = [];
        // If fabric.Text-like object supports the ability to get the width of a line, use that instead of the ctx[method] fabric.Text#_getLineWidth defers to.
        var supportsWidthOfLine = (this._getWidthOfLine == null) ? false : true;
        for (var lineIndex = 0, len = textLines.length; lineIndex < len; lineIndex++) {
          var lineWidth = (supportsWidthOfLine) ? this._getWidthOfLine(ctx, lineIndex, textLines) : this.getLineWidth(lineIndex);
          var lineLeftOffset = this._getLineLeftOffset(lineIndex);
          this._boundaries.push({
            height: this.getHeightOfLine(lineIndex),
            width: lineWidth,
            left: lineLeftOffset
          });
        }
      } else {
        // If boundaries are already set, reset the flag to draw the residue.
        if (this.wantTextPathResidue && this._boundaries) {
          for (var lineIndex = 0, len = this._boundaries.length; lineIndex < len; lineIndex++) {
            this._boundaries[lineIndex].residueHasBeenDrawn = null;
          }
        }
      }
    },

    /**
     * Render an unjustified line of the text in fabric.Text#text by the requested context method
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Text to calculate.
     * @param {Number} left Left position of text.
     * @param {Number} top Top position of text.
     * @param {Number} lineIndex Index of the line in the text.
     */
    _renderUnjustifiedTextLine: function(method, ctx, line, left, top, lineIndex) {
		//console.log('_renderUnjustifiedTextLine',2);
      // If observing a path, go letter by letter through the line, render the character, and advance by the previous distance. Otherwise, render the characters normally.
      if (this.textPath) {
        this._renderTextLineOnTextPath(method, ctx, line, left, top, lineIndex);
      } else {
        this._renderChars(method, ctx, line, left, top, lineIndex);
      }
    },

    /**
     * Render a justified line of the text in fabric.Text#text by the requested context method
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Text to calculate.
     * @param {Number} left Left position of text.
     * @param {Number} top Top position of text.
     * @param {Number} lineIndex Index of the line in the text.
     * @param {Number} totalWidth Width to fill; depends on existence of spaces to act as expandable targets.
     */
    _renderJustifiedTextLine: function(method, ctx, line, left, top, lineIndex, totalWidth) {
		//console.log('_renderJustifiedTextLine',3);
      // Stretch the line.
      var words = line.split(/\s+/), wordsWidth = ctx.measureText(line.replace(/\s+/g, '')).width, widthDiff = totalWidth - wordsWidth, numSpaces = words.length - 1, spaceWidth = widthDiff / numSpaces, leftOffset = 0;
      // If observing a path, go letter by letter through the line, render the character, and advance by the previous distance, optionally overriding the distance to be spaceWidth for spaces. Otherwise, render the line word by word, skipping over spaces by spaceWidth.
      if (this.textPath) {
        this._renderTextLineOnTextPath(method, ctx, line, left, top, lineIndex, spaceWidth);
      } else {
        for (var i = 0, len = words.length; i < len; i++) {
          this._renderChars(method, ctx, words[i], left + leftOffset, top, lineIndex);
          leftOffset += ctx.measureText(words[i]).width + spaceWidth;
        }
      }
    },

    /**
     * Generically render a line of the text in fabric.Text#text by the requested context method
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Text to calculate.
     * @param {Number} left Left position of text.
     * @param {Number} top Top position of text.
     * @param {Number} lineIndex Index of the line in the text.
     */
    _renderTextLine: function(method, ctx, line, left, top, lineIndex) {
		//console.log('_renderTextLine',4);
      // Lift the line by a quarter of the fontSize.
      top -= this.fontSize / 4;
      // If the text isn't justified, render it without any additional tests.
      if (this.textAlign !== 'justify') {
        this._renderUnjustifiedTextLine(method, ctx, line, left, top, lineIndex);
      } else {
        // Otherwise, perform an initial justification test. If true, figure out how large spaces should actually be. Otherwise, render normally.
        var lineWidth = ctx.measureText(line).width, totalWidth = this.width;
        if (totalWidth > lineWidth) {
          this._renderJustifiedTextLine(method, ctx, line, left, top, lineIndex, totalWidth);
        } else {
          this._renderUnjustifiedTextLine(method, ctx, line, left, top, lineIndex);
        }
      }
    },

    

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     */
    _renderTextStroke: function(ctx, textLines) {
		//console.log('_renderTextStroke',6);
      if ((this.stroke == null || this.strokeWidth === 0) && !this._skipFillStrokeCheck) {
        return;
      }
      ctx.save();
      if (this.strokeDashArray) {
        // Spec requires the concatenation of two copies the dash list when the number of elements is odd
        if (1 & this.strokeDashArray.length) {
          this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray);
        }
        supportsLineDash && ctx.setLineDash(this.strokeDashArray);
      }
      ctx.beginPath();
      if (this._boundaries == null) {
        this._boundaries = [];

      }
      this._renderTextLines("strokeText", ctx, textLines);
      ctx.closePath();
      ctx.restore();
    },

  
    /**
     * Gets the text lines this fabric.Text object represents (in array format)
     * @private
     * @return {Array} Array of text lines, split at new lines.
     */
    _getTextLines: function() {
		//console.log('_getTextLines',8);
      return this.text.split(this._reNewline);
    },

    /**
     * Get the lines in order of widest to least wide
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     */
    _getOrderOfWidestLines: function(ctx, textLines) {
		//console.log('_getOrderOfWidestLines',9);
      // Ordering by line width is required by the text on path feature, which requires knowing the individual line boundaries.
      if (this._boundaries.length == 0) {
        textLines = (textLines == null) ? textLines : this._getTextLines();
        this._setBoundaries(ctx, textLines);
      }
      // Prepare a place to store the ordered indices.
      var order = [];
      // Get a copy of the boundaries.
      var objectsToOrderByWidth = this._boundaries.slice(0);
      // Do the sort by longest width.
      while (objectsToOrderByWidth.length > 0) {
        var current = objectsToOrderByWidth.shift();
        // Compare current to everything that's left.
        var foundWiderLine = false;
        for (var i = 0, len = objectsToOrderByWidth.length; i < len && !foundWiderLine; i++) {
          var comparison = objectsToOrderByWidth[i];
          // If the comparison object is wider than the current object, no further testing is needed for this pass.
          if (comparison.width > current.width) {
            // Put the current object back on the stack.
            objectsToOrderByWidth.push(current);
            // Break out.
            foundWiderLine = true;
          }
        }
        if (!foundWiderLine)
          order.push(this._boundaries.indexOf(current));
      }
      return order;
    },

    /**
     * Gets the maximum line width for the text this fabric.Text object represents
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     * @return {Number} Width of the longest text line.
     */
    _getMaximumLineWidth: function(ctx, textLines) {
		//console.log('_getMaximumLineWidth',10);
      var width = 0;
      // Maximum line width is required by the text on path feature, which requires knowing the individual line boundaries.
      if (this._boundaries.length == 0) {
        textLines = (textLines == null) ? textLines : this._getTextLines();
        this._setBoundaries(ctx, textLines);
      }
      for (var i = 0, len = this._boundaries.length; i < len; i++) {
        width = (this._boundaries[i].width > width) ? this._boundaries[i].width : width;
      }
      return width;
    },

    /**
     * Gets the line height without explicitly specifying the text lines this fabric.Text object represents
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @return {Number} Height of the text.
     */
    _getObservedTotalLineHeight: function(ctx) {
		//console.log('_getObservedTotalLineHeight',11);
      var textLines = this._getTextLines();
      return this.getHeightOfLine(0);
    },

    /**
     * Renders decorations ("underline", "line-through", "overline") found in fabric.Text#textDecoration
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     */
    _renderTextDecoration: function(ctx, textLines) {
		//console.log('_renderTextDecoration',12);
      if (!this.textDecoration) {
        return;
      }
      var doUnderline = (this.textDecoration.indexOf("underline") > -1) ? true : false;
      var doLineThrough = (this.textDecoration.indexOf("line-through") > -1) ? true : false;
      var doOverline = (this.textDecoration.indexOf("overline") > -1) ? true : false;
      // If there is no text path, draw the lines normally. Otherwise, plot the line and draw it.
      if (this.textPath == null) {
        var halfOfVerticalBox = this._getTextHeight(ctx, textLines) / 2,
          _this = this;
        /** @ignore */
        
        if (doUnderline) {
          this._renderLinesAtOffset(ctx, textLines, this.fontSize * this.lineHeight);
        }
        if (doLineThrough) {
          this._renderLinesAtOffset(ctx, textLines, this.fontSize * this.lineHeight - this.fontSize / 2);
        }
        if (doOverline) {
          this._renderLinesAtOffset(ctx, textLines, this.fontSize * this.lineHeight - this.fontSize);
        }
      } else {
        var supportsSpecificStyles = (this.getCurrentCharStyle == null) ? false : true;
        if (doUnderline || supportsSpecificStyles) {
          this._renderTextDecorationOnTextPath(ctx, "underline");
        }
        if (doLineThrough || supportsSpecificStyles) {
          this._renderTextDecorationOnTextPath(ctx, "line-through");
        }
        if (doOverline || supportsSpecificStyles) {
          this._renderTextDecorationOnTextPath(ctx, "overline");
        }
      }
    },
	
	
	/**
     * Renders line at offset  found in fabric.Text#textDecoration
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
	 * @param {int} offset of text line widget
     */
	_renderLinesAtOffset: function(ctx, textLines, offset) {
		//console.log('_renderLinesAtOffset',13);
          for (var i = 0, len = textLines.length; i < len; i++) {
            var lineWidth = _this._getLineWidth(ctx, textLines[i]),
              lineLeftOffset = _this._getLineLeftOffset(lineWidth);
            ctx.fillRect(
              _this._getLeftOffset() + lineLeftOffset,
              ~~((offset + (i * _this.getHeightOfLine(i))) - halfOfVerticalBox),
              lineWidth,
              1);
          }
       },

    /**
     * Renders decorations ("underline", "line-through", "overline") found in fabric.Text#textDecoration specifically for text on the fabric.Path located in fabric.Text#textPath
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} decoration Specific decoration; valid values: "underline", "line-through", and "overline".
     */
    _renderTextDecorationOnTextPath: function(ctx, decoration) {
		//console.log('_renderTextDecorationOnTextPath',14);
      // Create top offset.
      var runningLineHeight = 0;
      var supportsSpecificStyles = (this.getCurrentCharStyle == null) ? false : true;
      // Deal with horizontal translation from text alignment.
      var crutchX = (this.textAlign === "left" || this.textAlign === "justify") ? 0 : (this.textAlign === "center") ? (this.width / 2) : this.width;
      for (var lineIndex = 0, len = this._boundaries.length; lineIndex < len; lineIndex++) {
        var lineBoundary = this._boundaries[lineIndex];
        var verticalAdjustment = this._getTopOffset() + runningLineHeight + lineBoundary.height / 2;
        runningLineHeight += lineBoundary.height;
        // Push settings.
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.fill || this.stroke || "black";
        ctx.beginPath();
        var hadLine = false;
        for (var charIndex = 0, lineLength = lineBoundary.letters.length; charIndex < lineLength; charIndex++) {
          // Get character style. Character indices in line styles are one-index rather than zero-index.
          var style = (!supportsSpecificStyles) ? this : this.getCurrentCharStyle(lineIndex, charIndex + 1);
          var command = (style.textDecoration && style.textDecoration.indexOf(decoration) > -1) ? "lineTo" : "moveTo";
          // Get letter entry.
          var letterEntry = lineBoundary.letters[charIndex];
          // Get center point of drawing.
          var point = letterEntry.point;
          // Get delta to point (slides up or down).
          var deltaToPoint;
          // Get perpendicular angle. Default (at a 0 degree tangent) is 90 degrees. TODO: Interpolation for less harsh visual result.
          var perpendicularAngle = point.angleOfTangentInRadians + Math.PI / 2;
          var thisVerticalAdjustment = (this.type === "i-text") ? verticalAdjustment + this.fontSize / 4 : verticalAdjustment;
          var distanceToMove;
          if (decoration === "underline") {
            // Try to shift the line down.
            distanceToMove = thisVerticalAdjustment + point.halfHeightOfLetter;
          } else if (decoration === "overline") {
            // Try to shift the line up.
            distanceToMove = -1 * (-thisVerticalAdjustment + point.halfHeightOfLetter);
          } else {
            distanceToMove = thisVerticalAdjustment;
          }
          deltaToPoint = new fabric.Point(crutchX + distanceToMove * Math.cos(perpendicularAngle), distanceToMove * Math.sin(perpendicularAngle));
          // 
          if (!hadLine && command === "lineTo") {
            // If this point happens after no line (like at the start of the process), it's necessary to draw a segment from the left edge to the center.
            var deltaToStartPoint = new fabric.Point(-point.halfWidth * Math.cos(point.angleOfTangentInRadians), -point.halfWidth * Math.sin(point.angleOfTangentInRadians));
            ctx.moveTo(deltaToPoint.x + point.x + deltaToStartPoint.x, deltaToPoint.y + point.y + deltaToStartPoint.y);
            ctx[command](deltaToPoint.x + point.x, deltaToPoint.y + point.y);
          } else if (charIndex == (lineLength - 1)) {
            // If this point is the very last point, it's necessary to draw a segment from the center to the right edge.
            var deltaToEndPoint = new fabric.Point(point.halfWidth * Math.cos(point.angleOfTangentInRadians), point.halfWidth * Math.sin(point.angleOfTangentInRadians));
            ctx[command](deltaToPoint.x + point.x + deltaToEndPoint.x, deltaToPoint.y + point.y + deltaToEndPoint.y);
            } else if (command === "moveTo") {
            // In case of skipped text decoration at the character level, slide to the right edge.
            var deltaToEdgePoint = new fabric.Point(point.halfWidth * Math.cos(point.angleOfTangentInRadians), point.halfWidth * Math.sin(point.angleOfTangentInRadians));
            ctx[command](deltaToPoint.x + point.x + deltaToEdgePoint.x, deltaToPoint.y + point.y + deltaToEdgePoint.y);
          } else {
            // Point is along an existing line.
            ctx[command](deltaToPoint.x + point.x, deltaToPoint.y + point.y);
            // To help deal with skips, make a segment to the edge as well.
            var deltaToEdgePoint = new fabric.Point(point.halfWidth * Math.cos(point.angleOfTangentInRadians), point.halfWidth * Math.sin(point.angleOfTangentInRadians));
            ctx[command](deltaToPoint.x + point.x + deltaToEdgePoint.x, deltaToPoint.y + point.y + deltaToEdgePoint.y);
          }
          // Track if had line or not.
          hadLine = (command === "lineTo") ? true : false;
        }
        ctx.strokeStyle = (lineIndex % 2) ? "red" : ctx.strokeStyle;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      }
    },

    /**
     * Render an array of text lines in the requested way, ordered by widest line first
     * @private
     * @param {String} method Context method to call ("fillText", "strokeText", etc)
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Array} textLines Array of all text lines
     */
    _renderTextLines: function(method, ctx, textLines) {
		//console.log('_renderTextLines',15);
      // Order the lines by widest first. This is a step required by the text-on-path feature in order to support right, center, and justify alignments.
      var order = (!this.textPath) ? textLines.map(function (line) { return textLines.indexOf(line); }) : this._getOrderOfWidestLines(ctx, textLines);
      // To be forward compatible with fabric.IText, it's important to go the long route, even though fabric.Text doesn't require it.
      var copyOfOrder = order.slice(0);
      var lineHeights = [];
      while (copyOfOrder.length > 0) {
        var currentIndex = copyOfOrder.shift();
        var lineHeight = this.getHeightOfLine(currentIndex);
        lineHeights[currentIndex] = lineHeight;
      }
      // Render the lines in order of width.
      while (order.length > 0) {
        var currentIndex = order.shift();
        // Sum the observed line heights up to (and including) the current index.
        var summedLineHeight = lineHeights.slice(0, currentIndex + 1).reduce(function(a, b) { return a + b; }, 0);
        this._renderTextLine(
          method,
          ctx,
          textLines[currentIndex],
          this._getLeftOffset(),
          this._getTopOffset() + summedLineHeight,
          currentIndex
        );
      }
    },

    /**
     * Gets the angle of the tangent near the specified distance
     * @private
     * @param {Number} distance Distance along the fabric.Path object stored in fabric.Text#textPath
     */
    _getAngleOfTangentAtDistanceInDegrees: function(distance) {
		//console.log('_getAngleOfTangentAtDistanceInDegrees',16);
      var angle = 0;
      if (this.textPath) {
        // Get two distances to represent the tangent.
        var leftDistance = distance - 0.00075,
          rightDistance = distance + 0.00075;
        // Get two points to represent the tangent.
        var leftPoint = this.textPath.getPointAtLength(leftDistance, true);
        var rightPoint = this.textPath.getPointAtLength(rightDistance, true);
        // Calculate angle of the tangent.
        angle = leftPoint.degreesBetween(rightPoint);
      }
      // Send the angle back.
      return angle;
    },

    /**
     * Gets the distance along the path traced by fabric.Text#textPath required to show an object of size: (widthOfCharacter, halfNonTransformedHeight) @ angleInDegrees
     * @private
     * @param {Number} angleInDegrees Angle in degrees; clamped to first quadrant of unit-circle.
     * @param {Number} halfNonTransformedHeight Height of the object.
     * @param {Number} widthOfCharacter Width of the object.
     * @return {Number} Suggested parametric distance along the fabric.Text#textPath to consume for the object.
     */
    _getDistanceConsumptionGivenAngleInDegrees: function(angleInDegrees, halfNonTransformedHeight, widthOfCharacter) {
		//console.log('_getDistanceConsumptionGivenAngleInDegrees',17);
      // Circularly clamp the angle to be from 0 to 90 degrees.
      var rotationInFirstQuadrantOfUnitCircle = Math.abs(angleInDegrees) % 90;
      // Calculate the percentage of height and width this suggests (100% height at 90, 100% width at 0, 50% of both at 45).
      var percentOfHeight = rotationInFirstQuadrantOfUnitCircle / 90;
      var percentOfWidth = 1 - percentOfHeight;
      // Calculate the distance to be consumed in total.
      var requiredDistance = percentOfHeight * halfNonTransformedHeight + percentOfWidth * widthOfCharacter;
      // Send it back.
      return requiredDistance;
    },

    /**
     * Gets the maximum distance consumption along the path in fabric.Text#textPath for the text this fabric.Text object represents
     * @private
     * @return {Number} Distance consumption required by the text in fabric.Text#text.
     */
    _getMaximumConsumedDistance: function() {
		//console.log('_getMaximumConsumedDistance',18);
      if (this._boundaries.length > 0) {
        var distance;
        for (var i = 0, len = this._boundaries.length; i < len; i++) {
          var current = this._boundaries[i];
          if (!(current.consumedDistance == null)) {
            if (distance == null || current.consumedDistance > distance) {
              distance = current.consumedDistance;
            }
          }
        }
        return distance;
      }
      return undefined;
    },

    /**
     * Render a version of the text in fabric.Text#text untransformed by the fabric.Path in fabric.Text#textPath; style of text is intentionally faded out
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Text to render
     * @param {Number} left Left position of text
     * @param {Number} top Top position of text
     * @param {Number} lineIndex Index of a line in a text
     */
    _drawTextResidueIfNecessary: function(method, ctx, line, left, top, lineIndex) {
		//console.log('_drawTextResidueIfNecessary',19);
      if (this.wantTextPathResidue && this.textPath) {
        // Has the residue already been drawn?
        var residueTracker = this._boundaries[lineIndex].residueHasBeenDrawn,
            residueTrackerIsUndefined = (residueTracker == null) ? true : false,
            residueBoxNeedsToBeDrawn = (lineIndex == 0 && (residueTrackerIsUndefined || !residueTracker["bounding-box"])) ? true : false,
            isFirstPass = (residueTrackerIsUndefined || residueTracker[method] == null || !residueTracker[method]) ? true : false;
        if (isFirstPass) {
          var textPath = this.textPath;
          var globalAlpha = ctx.globalAlpha;
          this.textPath = null;
          ctx.fillStyle = "#000000";
          ctx.strokeStyle = "#000000";
          ctx.globalAlpha = 0.05;
          var crutchY = (this.type == "i-text") ? 0 : this.fontSize / 4;
          this._renderTextLine(method, ctx, line, left, top + crutchY, lineIndex);
          this.textPath = textPath;
          ctx.fillStyle = this.fill;
          ctx.strokeStyle = this.stroke;
          ctx.globalAlpha = globalAlpha;
          // Draw dashed box.
          if (residueBoxNeedsToBeDrawn) {
            // Copy data out.
            var previousBorderColor = this.borderColor;
            var hasBorders = this.hasBorders;
            var hasRotatingPoint = this.hasRotatingPoint;
            var isMoving = this.isMoving;
            var borderOpacityWhenMoving = this.borderOpacityWhenMoving;
            // Replace it.
            this.borderColor = "#000000";
            this.hasBorders = true;
            this.hasRotatingPoint = false;
            this.borderOpacityWhenMoving = 0.1;
            this.isMoving = true;
            // If the canvas matrix has been translated (center or right alignments), get the amount to slide the drawing back into place.
            var crutchX = (this.textAlign === "left" || this.textAlign === "justify") ? 0 : (this.textAlign === "center") ? (-this.width / 2) : -this.width;
            ctx.save();
            ctx.setLineDash([2, 3]);
            ctx.translate(crutchX, 0);
            this.drawBorders(ctx);
            ctx.restore();
            this.borderColor = previousBorderColor;
            this.hasBorders = hasBorders;
            this.hasRotatingPoint = hasRotatingPoint;
            this.borderOpacityWhenMoving = borderOpacityWhenMoving;
            this.isMoving = isMoving;
          }
          // Track this result.
          if (residueTrackerIsUndefined) {
            this._boundaries[lineIndex].residueHasBeenDrawn = {};
          }
          this._boundaries[lineIndex].residueHasBeenDrawn[method] = true;
          this._boundaries[lineIndex].residueHasBeenDrawn["bounding-box"] = true;
        }
      }
    },

    /**
     * Get a 4-point bounding box polygon that represents a box of size (2 * halfWidthOfLetter, 2 * halfHeightOfLetter) @ angleInDegrees
     * @private
     * @param {fabric.Point} point Represents center point of drawing.
     * @param {Number} top Offset used to provide additional vertical placement for the center point.
     * @param {Number} halfWidthOfLetter Half the width of the object.
     * @param {Number} halfHeightOfLetter Half the height of the object.
     * @param {Number} angleInDegrees Angle in degrees to transform the original bounding box points by.
     * @param {Boolean} reverseMode If the mode is reversed (in the case of fabric.Text#textAlign "right"), make it so that the edges logically match up with the indices of all the other cases (i.e. not "right").
     * @return {Array} An array of fabric.Point objects that represent the polygon.
     */
    _getMinorBoundingBoxAroundPoint: function(point, top, halfWidthOfLetter, halfHeightOfLetter, angleInDegrees, reverseMode) {
		//console.log('_getMinorBoundingBoxAroundPoint',20);
      if (reverseMode == null) {
        reverseMode = false;
      }
      // Get lines. X represents the leading edge, which is the right edge in non-right-aligned cases, and the left edge otherwise.
      var x = (!reverseMode) ? point.x - halfWidthOfLetter : point.x + halfWidthOfLetter,
          x2 = (!reverseMode) ? point.x + halfWidthOfLetter : point.x - halfWidthOfLetter;
      // Get the points that represent an unrotated box around just the letter.
      var thisUntransformedUpperLeadingPoint = new fabric.Point(x, point.y + top - halfHeightOfLetter),
          thisUntransformedLowerLeadingPoint = new fabric.Point(x, point.y + top + halfHeightOfLetter),
          thisUntransformedLowerTrailingPoint = new fabric.Point(x2, point.y + top + halfHeightOfLetter),
          thisUntransformedUpperTrailingPoint = new fabric.Point(x2, point.y + top - halfHeightOfLetter);
      // Rotate point around center.
      var radians = fabric.util.degreesToRadians(angleInDegrees);
      var thisMinorBoundingBox = [
        fabric.util.rotatePoint(thisUntransformedUpperLeadingPoint, point, radians),
        fabric.util.rotatePoint(thisUntransformedLowerLeadingPoint, point, radians),
        fabric.util.rotatePoint(thisUntransformedLowerTrailingPoint, point, radians),
        fabric.util.rotatePoint(thisUntransformedUpperTrailingPoint, point, radians)
      ];
      return thisMinorBoundingBox;
    },

    /**
     * Determine if two (4-point) bounding boxes share one and only one edge
     * @private
     * @param {Array} boundingBox Represents a reference bounding box.
     * @param {Array} otherBoundingBox Represents a comparison bounding box.
     * @return {Boolean} If the two bounding boxes only share one edge, then true. Otherwise, false.
     */
    _pointsShareOnlyOneEdge: function(boundingBox, otherBoundingBox) {
		//console.log('_pointsShareOnlyOneEdge',21);
      var sharedCount = 0;
      for (var c = 0, len = boundingBox.length; c < len; c++) {
        var firstIndex = c % len,
          secondIndex = (c + 1) % len,
          firstNotIndex = (c + 3) % len,
          secondNotIndex = (c + 2) % len;
        var p1 = boundingBox[firstIndex];
        var p2 = boundingBox[secondIndex];
        var pNot1 = otherBoundingBox[firstNotIndex];
        var pNot2 = otherBoundingBox[secondNotIndex];
        if (p1.eq(pNot1) && p2.eq(pNot2)) {
          sharedCount += 1;
        }
      }
      return (sharedCount == 1) ? true : false;
    },

    /**
     * Gets an acceptable center point for an object along the fabric.Path in fabric.Text#textPath
     * @private
     * @param {Number} runningDistance Distance along the path to start calculations.
     * @param {Number} widthOfCharacter Width of the object.
     * @param {Number} halfWidth Half of the width of the object (calculated elsewhere).
     * @param {Number} halfHeightOfLetter Half the height of the object.
     * @param {Number} halfNonTransformedHeight Half the height the object is contained in (ex. total line height).
     * @param {Number} top Vertical offset of line.
     * @param {fabric.Point} previousPoint Previous center point.
     * @param {Boolean} reverseMode If false, calculations move from left to right. Otherwise, calculations move from right to left.
     * @param {Boolean} wantLessTextPathOverlapFeature If false, consume the very least distance required by the object. Otherwise, perform collision detection on the generated bounding boxes (looks one bounding box backwards) to place discontinuities along the path function in order to more intuitively place objects along the path.
     * @return {fabric.Point} Acceptable center point on path of fabric.Text#textPath to draw object.
     */
    _getAcceptablePoint: function(runningDistance, widthOfCharacter, halfWidth, halfHeightOfLetter, halfNonTransformedHeight, top, previousPoint, reverseMode, wantLessTextPathOverlapFeature, letter) {
		//(edited)
		//console.log(runningDistance, widthOfCharacter, halfWidth, halfHeightOfLetter, halfNonTransformedHeight, top, previousPoint, reverseMode, wantLessTextPathOverlapFeature, letter);
		//console.log('_getAcceptablePoint',22);
      // If the less overlap feature is requested, provide the necessary information.
	  
      var lastDistanceToConsume, lastMinorBoundingBox;
     // Edited :: added extra check of previous point should be available before testing next point overlay or not.
	  if (previousPoint && wantLessTextPathOverlapFeature) {
        lastMinorBoundingBox = previousPoint.boundingBox;
        lastDistanceToConsume = previousPoint.distanceToConsume;
      }
      // Represents where the object would be placed if the line were completely horizontal. Use to find a tangent.
      var initialDistancePlusHalfWidth = (!reverseMode) ? runningDistance + halfWidth : runningDistance - halfWidth;
      // Prepare a place to store the angle of the tangent (may be reset to avoid rotation at request).
      var angleOfTangentInDegrees;
      // Prepare a place to store the consumable distance.
      var distanceToConsume, halfDistanceToConsume;
      // Prepare a place to store the point.
      var point, pass = 0,
        extraPassLimit = 10,
        pointIsNotAcceptable = false,
        thisDistancePlusHalfWidth = initialDistancePlusHalfWidth;
      // Placement passes. An intersection test is done between the current minor bounding box and the previous letter's minor bounding box. The iteration has the ability to run until either the two boxes no longer intersect or the pass limit has been exceeded. Currently, this is a guess and check feature.
      while (!pointIsNotAcceptable) {
        // Get the angle of the tangent in degrees.
        var angleOfTangentInDegrees = this._getAngleOfTangentAtDistanceInDegrees(thisDistancePlusHalfWidth);	
		//Edited :: 
        // If this object does not observe rotation, the width of the glyph will not accurately represent the consumed distance, so obtain something indicative of what will actually be used. Otherwise, just use the width.
        if (!this.wantObservePathRotation) {
          // Get distance on line that will be consumed by this glyph.
          distanceToConsume = this._getDistanceConsumptionGivenAngleInDegrees(angleOfTangentInDegrees, halfNonTransformedHeight, widthOfCharacter);
          // Reset angle.
          angleOfTangentInDegrees = 0;
        } else {
          distanceToConsume = widthOfCharacter;
        }
        halfDistanceToConsume = distanceToConsume / 2;
        var thisPoint = this.textPath.getPointAtLength(thisDistancePlusHalfWidth, true);
        // If there isn't a new point or if the new point is the same as the last one (in the case of hitting the end of a path), the point is acceptable.
        if (point == null || !point.eq(thisPoint)) {
          point = thisPoint;
          point.outOfPath = false; // Edited :: By default added every point as valid / on path point.
        } else {
          pointIsNotAcceptable = true;
        }
		/*Checking weather the distance between character should not be negative  */
		if(!pointIsNotAcceptable && point.distance < 0){
			point.outOfPath = true;
			pointIsNotAcceptable = true;	
		}
        // Overlapping at convex spots along a line is by design, but this can be mathematically altered if requested.
        else if (wantLessTextPathOverlapFeature && !pointIsNotAcceptable && pass < extraPassLimit)
        {
          // Get bounding box of the letter (as opposed to of the letter in the total observed line height).
          var thisMinorBoundingBox = this._getMinorBoundingBoxAroundPoint(point, top, halfWidth, halfHeightOfLetter, angleOfTangentInDegrees, reverseMode);
          // Update the bounding box.
          point.boundingBox = thisMinorBoundingBox;
          // Do an initial check to see if the bounding boxes are arranged end to end (in which case, objects are adjacent to each other already).
          var pointsShareOnlyOneEdge = this._pointsShareOnlyOneEdge(thisMinorBoundingBox, lastMinorBoundingBox);
          // If the two bounding boxes don't share only one edge, see if they intersect.
          if (!pointsShareOnlyOneEdge) {
            var intersectionTest = fabric.Intersection.intersectPolygonPolygon(thisMinorBoundingBox, lastMinorBoundingBox);
            // If intersects, get minimum distance to prevent intersection.
            if (intersectionTest.status == "Intersection" && intersectionTest.points.length >= 2) {
				
              var averageDistanceConsumedByTwoBoundingBoxes = (lastDistanceToConsume + distanceToConsume) / 2;
              // Rather than attempt to figure out where on the line actually will provide an appropriate, non-overlapping placement, just shove the character over more and more (up to five-seconds of the largest distance to consume at a time).
              var clearDistance = averageDistanceConsumedByTwoBoundingBoxes / Math.max(2.5, (10 - pass));
              // If the distance is greater than zero, go find the point at a .
              if (!(clearDistance == null) && clearDistance > 0) {
                thisDistancePlusHalfWidth += (!reverseMode) ? clearDistance : -clearDistance;
				point.outOfPath = false;  // Edited :: Added Flag as charector is on path.
              } else {
                point.outOfPath = false;
                pointIsNotAcceptable = true; // Edited :: Added Flag as charector is on path.
              }
            } else {
              point.outOfPath = false;
              pointIsNotAcceptable = true; // Edited :: Added Flag as charector is on path.
            }
          } else {
            point.outOfPath = false;
            pointIsNotAcceptable = true; // Edited :: Added Flag as charector is on path.
          }
          pass += 1;
        } else {
			//Edited :: Here we are checking whether the point / character that we want to draw is on the path or not.
			// Here logic is to check current point and new point should not be equal, If it is equal then it is out of path.  
			if(previousPoint){
				  var lastDistanceToConsume = previousPoint.distanceToConsume;
				  // Taking average of last consume distance and current distance 
				  var averageDistanceConsumedByTwoBoundingBoxes = (lastDistanceToConsume + distanceToConsume) / 2; 
				  // Taking clear distance from current characters.  
				  var clearDistance = averageDistanceConsumedByTwoBoundingBoxes / Math.max(2.5, (10 - pass));
				  if (!(clearDistance == null) && clearDistance > 0) {
					thisDistancePlusHalfWidth += (!reverseMode) ? clearDistance : -clearDistance; // adding more distance.
					 var thisPoint = this.textPath.getPointAtLength(thisDistancePlusHalfWidth, true);
					// If there isn't a new point or if the new point is the same as the last one (in the case of hitting the end of a path), the point is not acceptable or out of path.
					if (point.eq(thisPoint)) {	 
					  point.outOfPath = true
					} 
					thisDistancePlusHalfWidth -= (!reverseMode) ? clearDistance : -clearDistance; // making this as it was previously to eliminate bug in SVG and Canvas.
				  } 
			}
			else{
				point.outOfPath = false;
			}
          	pointIsNotAcceptable = true;
        }

      }

	
      // Stick information important to the rendering method (and, by proxy, the freezing process).
      if (!(point == null)) {
        point.distanceToConsume = distanceToConsume;
        point.runningDistanceAfter = (!reverseMode) ? thisDistancePlusHalfWidth + halfDistanceToConsume : thisDistancePlusHalfWidth - halfDistanceToConsume;
        point.angleOfTangentInRadians = fabric.util.degreesToRadians(angleOfTangentInDegrees);
        point.halfWidth = halfWidth;
        point.halfHeightOfLetter = halfHeightOfLetter;
        point.widthOfCharacter = widthOfCharacter;
        if (point.boundingBox == null) {
          point.boundingBox = this._getMinorBoundingBoxAroundPoint(point, top, halfWidth, halfHeightOfLetter, angleOfTangentInDegrees, reverseMode);
        }
      }
	  //console.log(point.angleOfTangentInRadians, letter, angleOfTangentInDegrees);
      // Return the point (along with its metadata).
      return point;
    },

    /**
     * Generate and render a bounding box of size (2 * halfWidth, 2 * halfBoundingBoxHeight), adjusted by verticalOffset
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Number} halfWidth Half width of the object.
     * @param {Number} halfBoundingBoxHeight Half height of the object.
     * @param {Number} verticalOffset Top position of text.
     */
    _renderBoundingBox: function(method, ctx, halfWidth, halfBoundingBoxHeight, verticalOffset) {
		//console.log('_renderBoundingBox',23);
      // Shift the drawing up as necessary. Default draws horizontally along the vertical center of the text object.
      ctx.translate(0, verticalOffset);
      // Draw expected boundary.
      ctx.beginPath();
      ctx.moveTo(-halfWidth, -halfBoundingBoxHeight);
      ctx.lineTo(halfWidth, -halfBoundingBoxHeight);
      ctx.lineTo(halfWidth, halfBoundingBoxHeight);
      ctx.lineTo(-halfWidth, halfBoundingBoxHeight);
      ctx.lineTo(-halfWidth, -halfBoundingBoxHeight);
      ctx[method](); //stroke();
      ctx.closePath();
      // Reverse the vertical shift.
      ctx.translate(0, -verticalOffset);
    },

    /**
     * Render a letter of the text in fabric.Text#text by the requested context method
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} letter Text to render.
     * @param {fabric.Point} point Center point to render text at.
     * @param {Number} top Top position of text.
     * @param {Number} lineIndex Index of the line the text is in.
     * @param {Number} halfNonTransformedHeight Half of the height the letter exists in.
     * @param {Number} summedLineHeight The inclusive sum of previous line heights.
     * @param {object} style A dictionary of style choices relevant to the context.
     * @param {Boolean} approximating If true, turn off computationally-intensive features. Otherwise, render to the best of the algorithm's ability.
     */
    _renderLetterAtPoint: function(method, ctx, letter, point, top, lineIndex, halfNonTransformedHeight, summedLineHeight, style, approximating) {
		
		//console.log('_renderLetterAtPoint',24);
      // If the center point of the letter's bounding box exists, render the letter and the bounding box (if requested) around it.
     //Edited :: Added check of is point is out of path or not or its angle is not equal to zero this are two separate condition.
        //if (point){ //Original
        //if (point && !point.outOfPath){ //Created
		//console.log(point);
        if ((point && this.wantTextPathWithLessOverlap && !point.outOfPath) || (point && this.removeExtraChar && !point.outOfPath) ) {
			//console.log(point, letter, 'wantTextPathWithLessOverlap :' + this.wantTextPathWithLessOverlap, 'removeExtraChar :' + this.removeExtraChar);
        // Push the current drawing matrix.
        ctx.save();
        // Set all the style settings.
        this._pushStyleToContext(ctx, style);
        // Reposition origin such that the drawing will occur around a horizontally sliding center point.
        ctx.translate(point.x, point.y);
        // Centrally rotate the future drawing by the angle of the tangent.
        ctx.rotate(point.angleOfTangentInRadians);
        var halfWidth = point.halfWidth,
          halfHeightOfLetter = point.halfHeightOfLetter;
        // Do background passes beneath letters. Depends on render order being: fillText -> strokeText.
        var isFirstPass = (method === "fillText" || (method === "strokeText" && style.fill == null)) ? true : false;
        if (isFirstPass && (style.textBackgroundColor || style.backgroundColor)) {
          ctx.save();
          // Determine whether a full bounding box or a minor bounding box will be drawn.
          var isFullBoundingBox = false;
          // Stroke grey for full bounding box. Stroke blue for minor bounding box.
          ctx.strokeStyle = (isFullBoundingBox) ? "#888" : "#0020c2";
          var halfBoundingBoxHeight = (isFullBoundingBox) ? halfNonTransformedHeight : halfHeightOfLetter;
          if (!isFullBoundingBox && this.type == "i-text") {
            halfBoundingBoxHeight += halfHeightOfLetter / 4;
          }
          var verticalOffset = (isFullBoundingBox) ? 0 : summedLineHeight - halfNonTransformedHeight - halfBoundingBoxHeight;
          if (style.backgroundColor) {
            ctx.fillStyle = style.backgroundColor;
            this._renderBoundingBox("fill", ctx, halfWidth, halfBoundingBoxHeight, verticalOffset);
          }
          if (style.textBackgroundColor) {
            ctx.fillStyle = style.textBackgroundColor;
            this._renderBoundingBox("fill", ctx, halfWidth, halfBoundingBoxHeight, verticalOffset);
          }
          ctx.restore();
        }
        // Refuse to render individual characters if necessary.
        var fillTextButNoFillDefinition = (method === "fillText" && style.fill == null) ? true : false;
        var strokeTextButNoStrokeDefinition = (method === "strokeText" && (style.stroke == null || style.strokeWidth === 0)) ? true : false;
        if (!fillTextButNoFillDefinition && !strokeTextButNoStrokeDefinition) {
          // Horizontally reposition result of context drawing in case of center and right.
          var adjustmentToContextDrawing = (this.textAlign === "center") ? -halfWidth : 0;
          // Determine where the local left offset is. TODO: Figure out why textPathDistanceOffset requires different left values.
          var left;
          if (this.textPathDistanceOffset == null || this.type !== "i-text") {
            left = (this.textAlign !== "center" && this.textAlign !== "right") ? -halfWidth : halfWidth;
          } else {
            left = (this.textAlign === "center") ? 0 : -halfWidth;
          }
          ctx.translate(adjustmentToContextDrawing, 0);
          // Render the character, sliding the height by the top value. WARN: Do not call this._renderChars in place of ctx[method], since an override can exist that does non-essential transforms.
          
		  // placing charector at top of every textbox changes done to match SVG. (Editor)
		  ctx[method](letter, left, 0);
		  //ctx[method](letter, left, top);
          ctx.translate(-adjustmentToContextDrawing, 0);
        }
        // TODO: Remove debugging code for pull request.
        if (this.debug) {
          // Draw a point at the center (where everything is drawn around).
          ctx.beginPath();
          ctx.fillStyle = "red";
          ctx.fillRect(-1.5, 0, 2, 2)
          ctx.closePath();
          // Determine whether a full bounding box or a minor bounding box will be drawn.
          var isFullBoundingBox = (approximating || !this.wantTextPathWithLessOverlap) ? true : false;
          // Stroke grey for full bounding box. Stroke blue for minor bounding box.
          ctx.strokeStyle = (isFullBoundingBox) ? "#888" : "#0020c2";
          var halfBoundingBoxHeight = (isFullBoundingBox) ? halfNonTransformedHeight : halfHeightOfLetter;
          if (!isFullBoundingBox && this.type == "i-text") {
            halfBoundingBoxHeight += halfHeightOfLetter / 4;
          }
          var verticalOffset = (isFullBoundingBox) ? 0 : summedLineHeight - halfNonTransformedHeight - halfBoundingBoxHeight;
          ctx.lineWidth = 1;
          this._renderBoundingBox("stroke", ctx, halfWidth, halfBoundingBoxHeight, verticalOffset);
        }
        // Pop the drawing matrix used to get the letter drawn off the stack.
        ctx.restore();
      }
	  else{
		//console.log('Characters Limit Exceed!');
		return false;  
	  }
    },

    /**
     * Render a letter of the text in fabric.Text#text by the requested context method
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Text to calculate.
     * @param {Number} left Left position of text.
     * @param {Number} top Top position of text.
     * @param {Number} lineIndex Index of the line in the text.
     * @param {Boolean} approximating If true, turn off computationally-intensive features. Otherwise, render to the best of the algorithm's ability.
     * @param {Boolean} spaceWidth If defined, width of space to use in place of measured width (specifically, for purposes of justification).
     */
	 //Imp function
    _calculateTextLineOnTextPath: function(method, ctx, line, left, top, lineIndex, approximating, spaceWidth) {
		//console.log('_calculateTextLineOnTextPath',25);
      // w/h: function(ctx, lineIndex, charIndex, lines)
      var hasSpecificWidth = (this._getWidthOfCharAt == null) ? false : true;
      var hasSpecificHeight = (this._getHeightOfCharAt == null) ? false : true;
      // For justification purposes, define the width of a space.
      var overrideSpaceWidth = (spaceWidth == null) ? false : true;
      // If the canvas matrix has been translated (center or right alignments), get the amount to slide the drawing back into place.
      var crutchX = (this.textAlign === "left" || this.textAlign === "justify") ? 0 : (this.textAlign === "center") ? (-this.width / 2) : -this.width;
      // Determine the starting distance along the observed path.
      var startingDistance, reverseMode = false;
      if (this.textAlign === "center") {
        //var maximumConsumedDistance = this._getMaximumConsumedDistance() || this._getMaximumLineWidth(ctx);
		var maximumConsumedDistance = this.textPath.getSVGPathElement().getTotalLength();
        startingDistance = (maximumConsumedDistance - this._boundaries[lineIndex].width) / 2;
      } else if (this.textAlign === "right") {
        //var maximumConsumedDistance = this._getMaximumConsumedDistance();
		var maximumConsumedDistance = this.textPath.getSVGPathElement().getTotalLength(); // Here assigning length of path as total length
        if (maximumConsumedDistance == null) {
          startingDistance = 0;
        } else {
          startingDistance = maximumConsumedDistance;
          reverseMode = true;
          // Reverse the text order.
          line = line.split("").reverse().join("");
        }
      } else {
        startingDistance = 0;
      }
      // Obtain single line height.
      var heightOfLetter = this.getHeightOfLine(lineIndex);
      var halfHeightOfLetter = heightOfLetter / 2;
      // Obtain the height of the untransformed bounding box that the unpathed text would have created.
      var nonTransformedHeightOfAllLines = this._getObservedTotalLineHeight(ctx);
      var halfNonTransformedHeight = nonTransformedHeightOfAllLines / 2;
      // Obtain the width of the untransformed bounding box that the unpathed text would have created.
      var nonTransformedMaximumLineWidth = this._getMaximumLineWidth(ctx);
      var halfNonTransformedMaximumLineWidth = nonTransformedMaximumLineWidth / 2;
      // Get the center of the object.
      var centerOfTextObject = this.getCenterPoint();
      // Get the center of what's being observed.
      var centerOfPathObject = this.textPath.getCenterPoint();
      // Find out how far away the two objects are from each other (to relatively offset the text object as a whole). 
      var distanceFromPathCenterX = centerOfPathObject.x - centerOfTextObject.x, distanceFromPathCenterY = centerOfPathObject.y - centerOfTextObject.y;
      //-(Center - Width / 2 + Horizontal Distance from Observation), -(Center - Height / 2 + Vertical Distance from Observation); equivalent to -this.left, -this.top if both objects are centered on each other, but left/top values may change during rotation (and can't be reliably used).
	  
	 //Edited :: Offset of drawing path on text object.
	// var drawingOffsetX = crutchX + -(centerOfTextObject.x - (halfNonTransformedMaximumLineWidth) + distanceFromPathCenterX);
	 //var drawingOffsetY = -(centerOfTextObject.y - halfNonTransformedHeight + distanceFromPathCenterY);
	 // Edited :: Changed the logic if offset calculation for rendering characters used Path Object rendering logic
	 // That is , Path drawing offset ex. (M 100, 200 ..) and MinX/ MinY value and Half Width/ Height of Path.
	  var drawingOffsetX = crutchX + -(centerOfTextObject.x - (halfNonTransformedMaximumLineWidth) + distanceFromPathCenterX) + this.textPath.path[0][1] - (this.textPath.minX + this.textPath.width / 2);
	  var drawingOffsetY = -(centerOfTextObject.y - halfNonTransformedHeight + distanceFromPathCenterY) + this.textPath.path[0][2] - (this.textPath.minY + this.textPath.height / 2);
	 
      // Track the distance along the line. For a horizontal line (unpathed text), this would increment by the width of the character.
      var runningDistance = !(this.textPathDistanceOffset == null) ? this.textPathDistanceOffset + startingDistance : startingDistance;
      // For the feature wantLessTextPathOverlapFeature, track a lot of the information about the point at which the previous letter was drawn at.
      var lastPoint;
      // Prepare a place to cache the points (basically required by fabric.IText needing to constantly draw because of the animated caret line). 
      this._boundaries[lineIndex].letters = [];
      // Iterate the line character by character.
      for (var charIndex = 0, len = line.length; charIndex < len; charIndex++) {
        // Letter, space, etc.
        var letter = line[charIndex];
        // If in reverse mode, complement the character index by length.
        var actualCharIndex = (!reverseMode) ? charIndex : (len - charIndex) - 1;
        // Track to see if the letter is whitespace.
        var letterIsWhitespaceDuringSpaceOverride = (overrideSpaceWidth && /\s/.test(letter)) ? true : false;
        // Prepare to get the width of the character.  Used for distance consumption if not observing rotation.
        var widthOfCharacter;
        // Get the size (width only). TODO: Should probably be cached, especially while multiple styles are not supported.
        if (!hasSpecificWidth || !hasSpecificHeight) {
          widthOfCharacter = (letterIsWhitespaceDuringSpaceOverride) ? spaceWidth : ctx.measureText(letter).width;
        } else {
          widthOfCharacter = (letterIsWhitespaceDuringSpaceOverride) ? spaceWidth : this._getWidthOfCharAt(ctx, lineIndex, actualCharIndex);
          heightOfLetter = this._getHeightOfCharAt(ctx, lineIndex, actualCharIndex);
          halfHeightOfLetter = heightOfLetter / 2;
        }
        // Halve the width. Used for centering.
        var halfWidth = widthOfCharacter / 2;
        // Determine whether this letter should be subjected to the less overlap feature or not.
		
       var wantLessTextPathOverlapFeature = (!approximating && this.wantTextPathWithLessOverlap && lastPoint && !letterIsWhitespaceDuringSpaceOverride) ? true : false;
	  
	  
	  
        // Get an acceptable center-point.
        var point = this._getAcceptablePoint(runningDistance, widthOfCharacter, halfWidth, halfHeightOfLetter, halfNonTransformedHeight, top, lastPoint, reverseMode, wantLessTextPathOverlapFeature, letter);
        // If the center point of the letter's bounding box exists, render the letter and the bounding box (if requested) around it.
        if (point) {
          // Track the forward motion along the line.
          runningDistance = point.runningDistanceAfter;
          // Adjust the point so that it represents the center of the horizontally sliding bounding box.
          point.setXY(drawingOffsetX + point.x + left, drawingOffsetY + point.y - halfNonTransformedHeight);
          // Cache the calculation. If frozen, this will be available on the next render request, and it should be much faster to just draw letters at points.
          this._boundaries[lineIndex].letters[actualCharIndex] = {
            letter: letter,
            point: point
          };
        }
        // Track last point.
        lastPoint = point;
      }
      // For purposes of alignment, store the consumed distance.
      this._boundaries[lineIndex].consumedDistance = runningDistance;
      this._lastBoundaries = this._boundaries;
    },

    /**
     * Pushes style declaration's attributes into the context
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {object} styleDeclaration Dictionary containing style directives relevant to the context.
     */
    _pushStyleToContext: function(ctx, styleDeclaration) {
		//console.log('_pushStyleToContext',26);
      if (typeof styleDeclaration.shadow === 'string') {
        styleDeclaration.shadow = new fabric.Shadow(styleDeclaration.shadow);
      }
      var fill = styleDeclaration.fill || this.fill;
      ctx.fillStyle = (fill == null) ? fill : fill.toLive
        ? fill.toLive(ctx)
        : fill;
      var validStrokeWidthExists = (!(styleDeclaration.strokeWidth == null) && styleDeclaration.strokeWidth > 0) ? true : false;
      if (styleDeclaration.stroke && (validStrokeWidthExists || styleDeclaration.strokeWidth == null)) {
        ctx.strokeStyle = (styleDeclaration.stroke && styleDeclaration.stroke.toLive)
          ? styleDeclaration.stroke.toLive(ctx)
          : styleDeclaration.stroke;
      }
      ctx.lineWidth = styleDeclaration.strokeWidth || this.strokeWidth;
      ctx.font = this._getFontDeclaration.call(styleDeclaration);
      this._setShadow.call(styleDeclaration, ctx);
    },

    /**
     * Render a line of the text in fabric.Text#text by the requested context method
     * @private
     * @param {String} method Method name ("fillText" or "strokeText")
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {String} line Text to calculate.
     * @param {Number} left Left position of text.
     * @param {Number} top Top position of text.
     * @param {Number} lineIndex Index of the line in the text.
     * @param {Boolean} spaceWidth If defined, width of space to use in place of measured width (specifically, for purposes of justification).
     */
    _renderTextLineOnTextPath: function(method, ctx, line, left, top, lineIndex, spaceWidth) {
		//console.log('_renderTextLineOnTextPath',27);
      // In the middle of approximating, turn off non-essential features.
      var approximating = (!this.textPath.wantApproximationDetail || this.textPath.wantApproximationDetail == 0) ? false : true;
      // Figure out if the letter locations need to be calculated.
      var isNotCalculated = (this._boundaries[lineIndex].letters == null) ? true : false;
      // If the letter locations need to be calculated, calculate where the letters should be drawn.
      if (isNotCalculated) {
        this._calculateTextLineOnTextPath(method, ctx, line, left, top, lineIndex, approximating, spaceWidth);
      }
      // If requested, draw the text how it would have been.
      this._drawTextResidueIfNecessary(method, ctx, line, left, top, lineIndex);
      // Get calculated line metadata.
      var thisLineMetaData = this._boundaries[lineIndex];
      // Obtain the height of the untransformed bounding box that the unpathed text would have created.
      var nonTransformedHeightOfAllLines = this._getObservedTotalLineHeight(ctx);
      var halfNonTransformedHeight = nonTransformedHeightOfAllLines / 2;
      // Get the center of the object.
      var centerOfTextObject = this.getCenterPoint();
      // Get the center of what's being observed.
      var centerOfPathObject = this.textPath.getCenterPoint();
      // Get vertical delta.
      var distanceFromPathCenterY = centerOfPathObject.y - centerOfTextObject.y;
      // Subtract out the top offset (and other offsets) to get just the summed line height. fabric.IText already does away with the 4th fontSize lift that occurs in fabric.Text.
      var summedLineHeight = (this.type == "i-text") ? top - this._getTopOffset() : top - this._getTopOffset() + this.fontSize / 4;
      // Object supports character styles.
      var supportsSpecificStyles = (this.getCurrentCharStyle == null) ? false : true;
	  var charExceed = false;
      for (var charIndex = 0, len = thisLineMetaData.letters.length; charIndex < len; charIndex++) {
        var letterEntry = thisLineMetaData.letters[charIndex];
        // Get character style. Character indices in line styles are one-index rather than zero-index.
        var style = (!supportsSpecificStyles) ? this : this.getCurrentCharStyle(lineIndex, charIndex + 1);
        // For fabric.IText, push the background color onto the style.
        if (!style.backgroundColor) {
          style.backgroundColor = this.backgroundColor;
        }
          /*Checking characters are going out of path if single characters is going of it*/
        if(!charExceed && letterEntry.point.outOfPath){
            charExceed = true;
        }
        // Draw it.
       this._renderLetterAtPoint(method, ctx, letterEntry.letter, letterEntry.point, top, lineIndex, halfNonTransformedHeight, summedLineHeight, style, approximating);
      }
        if(charExceed){
            this.isOutOfPath = true;
        }
        else{
            this.isOutOfPath = false;
        }
	  
    },
    
    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject: function(propertiesToInclude) {
		//console.log('toObject',28);
      // Point to the correct superclass method for cases where this.constructor.superclass does not point to fabric.Object (i.e. fabric.IText).
      var fn = fabric.Object.prototype["toObject"];
      fn = fn.bind(this);
      // Create the object with just the wanted data.
      var object = fabric.util.object.extend(fn(propertiesToInclude), {
        text:                        this.text,
        fontSize:                    this.fontSize,
        fontWeight:                  this.fontWeight,
        fontFamily:                  this.fontFamily,
        fontStyle:                   this.fontStyle,
        lineHeight:                  this.lineHeight,
        textDecoration:              this.textDecoration,
        textAlign:                   this.textAlign,
        path:                        this.path,
        textBackgroundColor:         this.textBackgroundColor,
        useNative:                   this.useNative,
       // textPath:                    this.textPath, // Commented because dont want path object in JSON
        textPathDistanceOffset:      this.textPathDistanceOffset,
        wantObservePathRotation:     this.wantObservePathRotation,
        wantTextPathWithLessOverlap: this.wantTextPathWithLessOverlap,
        wantTextPathResidue:         this.wantTextPathResidue,
        wantApproximationDetail:     this.wantApproximationDetail,
        //Edited:: Added original font size property in JSON import.
        originalFontSize:            this.originalFontSize,
		removeExtraChar:			 this.removeExtraChar,
        pathString:                  this.pathString,
        isOutOfPath:                 this.isOutOfPath
      });
      // Remove default values if requested.
      if (!this.includeDefaultValues) {
        this._removeDefaultValues(object);
      }
      return object;
    },

    /**
     * Returns SVG representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
		//console.log('toSVG',29);
      var markup = [ ],
          textLines = this._getTextLines(),
          offsets = this._getSVGLeftTopOffsets(textLines),
          textAndBg = this._getSVGTextAndBg(offsets.lineTop, offsets.textLeft, textLines),
          shadowSpans = this._getSVGShadows(offsets.lineTop, textLines);
      // Move top offset by font ascent in case of Cufon.
      offsets.textTop += (this._fontAscent ? ((this._fontAscent / 5) * this.lineHeight) : 0);
      // Adds a group element with a single child text object.
      this._wrapSVGTextAndBg(markup, textAndBg, shadowSpans, offsets);
      return reviver ? reviver(markup.join('')) : markup.join('');
    },

    /**
     * Returns styles-string for svg-export
     * @return {String}
     */
    getSvgStyles: function() {
		//console.log('getSvgStyles',30);
      var fill = this.fill
            ? (this.fill.toLive ? 'url(#SVGID_' + this.fill.id + ')' : this.fill)
            : 'none',
          fillRule = (this.fillRule === 'destination-over' ? 'evenodd' : this.fillRule),
          stroke = this.stroke
            ? (this.stroke.toLive ? 'url(#SVGID_' + this.stroke.id + ')' : this.stroke)
            : 'none',
          strokeWidth = this.strokeWidth ? this.strokeWidth : '0',
          strokeDashArray = this.strokeDashArray ? this.strokeDashArray.join(' ') : '',
          strokeLineCap = this.strokeLineCap ? this.strokeLineCap : 'butt',
          strokeLineJoin = this.strokeLineJoin ? this.strokeLineJoin : 'miter',
          strokeMiterLimit = this.strokeMiterLimit ? this.strokeMiterLimit : '4',
          opacity = typeof this.opacity !== 'undefined' ? this.opacity : '1',
          visibility = this.visible ? '' : ' visibility: hidden;',
          filter = this.shadow && this.type !== 'text' && this.type !== 'i-text' ? 'filter: url(#SVGID_' + this.shadow.id + ');' : '';
      return [
        'stroke: ', stroke, '; ',
        'stroke-width: ', strokeWidth, '; ',
        'stroke-dasharray: ', strokeDashArray, '; ',
        'stroke-linecap: ', strokeLineCap, '; ',
        'stroke-linejoin: ', strokeLineJoin, '; ',
        'stroke-miterlimit: ', strokeMiterLimit, '; ',
        'fill: ', fill, '; ',
        'fill-rule: ', fillRule, '; ',
        'opacity: ', opacity, ';',
        filter,
        visibility
      ].join('');
    },

    /**
     * Returns transform-string for svg-export.
     * @return {String}
     */
    getSvgTransform: function() {
		//console.log('getSvgTransform',31);
      if (this.group) return '';
      
     	 var hasTextPath = (!(this.textPath == null)) ? true : false,
		// var hasTextPath = (!(this.textPath == null)) ? false : true,
          toFixed = fabric.util.toFixed,
          angle = this.getAngle(),
          vpt = this.getViewportTransform(),
          center = fabric.util.transformPoint(this.getCenterPoint(), vpt),

          NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS,
          // Do not provide a translation if the object has a text path or if the object is a fabric.PathGroup.
          translatePart = (hasTextPath || this.type === 'path-group') ? '' : 'translate(' +
                            toFixed(center.x, NUM_FRACTION_DIGITS) +
                            ' ' +
                            toFixed(center.y, NUM_FRACTION_DIGITS) +
                          ')',

          anglePart = angle !== 0
            ? (' rotate(' + toFixed(angle, NUM_FRACTION_DIGITS) + ')')
            : '',

          scalePart = (this.scaleX === 1 && this.scaleY === 1 && vpt[0] === 1 && vpt[3] === 1)
            ? '' :
            (' scale(' +
              toFixed(this.scaleX * vpt[0], NUM_FRACTION_DIGITS) +
              ' ' +
              toFixed(this.scaleY * vpt[3], NUM_FRACTION_DIGITS) +
            ')'),
          addTranslateX = this.type === 'path-group' ? this.width * vpt[0] : 0,
          flipXPart = this.flipX ? ' matrix(-1 0 0 1 ' + addTranslateX + ' 0) ' : '',
          addTranslateY = this.type === 'path-group' ? this.height * vpt[3] : 0,
          flipYPart = this.flipY ? ' matrix(1 0 0 -1 0 ' + addTranslateY + ')' : '';


      return [
        translatePart, anglePart, scalePart, flipXPart, flipYPart
      ].join('');
    },
  
    /**
     * Create a group element with a single child text element to represent the fabric.Text-like object.
     * @private
     */
    _wrapSVGTextAndBg: function(markup, textAndBg, shadowSpans, offsets) {
		//console.log('_wrapSVGTextAndBg',32);
      // If this object has a text path to which it should adhere, define the path.
      var textPathId, addTransform = '';
      if (!(this.textPath == null)) {
        textPathId = (this.textPath.id) ? this.textPath.id : "text-path";
//        markup.push(
//          '<defs>\n',
//            '<path id="' + textPathId + '" d="' + this.textPath.getSVGData() + '"  />\n',
//          '</defs>\n'
//        );

        //Edited :: Added extra parameter in SVG path of text path so that SVG should match
          if (!(this.textPath.group && this.textPath.group.type === 'path-group')) {
              addTransform = 'translate(' + (-this.textPath.pathOffset.x) + ', ' + (-this.textPath.pathOffset.y) + ')';
          }
          markup.push(
              '<defs>\n',
              '<path id="' + textPathId,
              '" d="' + this.textPath.getSVGData(),
              '" style="', this.textPath.getSvgStyles(),
              '" transform="', this.textPath.getSvgTransform(), addTransform,
              this.textPath.getSvgTransformMatrix(), '" stroke-linecap="round" ',
              '/>\n',
              '</defs>\n'
          );

      }
      var hasTextPathId = (!(textPathId == null)) ? true : false,
          svgTransformValue = [this.getSvgTransform(), this.getSvgTransformMatrix()].join(''),
          svgTransformAttribute = (svgTransformValue !== '') ? ' transform="' + svgTransformValue + '"' : '',
          textLeft = (!hasTextPathId) ? offsets.textLeft : 0,
          textPathStartOffsetPercent = (!hasTextPathId || this.textPathDistanceOffset == null) ? 0 : (100 * this.textPathDistanceOffset / this.textPath.pathLength()) || 0;
      // Push the group element with a single child text element.
      markup.push(
        // Rewrite svg transform to ignore y when path is available.
          //Edited :: Removed rotate attribute because added this on the path on which it has been linked.
        //'<g', svgTransformAttribute, '>\n',
          '<g>\n',
          textAndBg.textBgRects.join(''),
          '<text ',
            (this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g,'\'') + '" ': ''),
          //Edited :: Used originalFontSize property instead of fontSize because font size will be scaled and SVG import will contain scaled font.
           // (this.fontSize ? 'font-size="' + this.fontSize + '" ': ''),
            (this.originalFontSize ? 'font-size="' + this.originalFontSize + '" ': ''),
            (this.fontStyle ? 'font-style="' + this.fontStyle + '" ': ''),
            (this.fontWeight ? 'font-weight="' + this.fontWeight + '" ': ''),
            (this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ': ''),
            'style="', this.getSvgStyles(), '" ',
            /* svg starts from left/bottom corner so we normalize height */
            // Rewrite text x transform to negate the group x transform when path available.
            //Edited :: Commented because don't have need of transform on linked object like path text object
            //'transform="translate(', fabric.util.toFixed(textLeft, 2), ' ', fabric.util.toFixed(offsets.textTop, 2), ')">\n',
            'transform="translate()">\n',
            (hasTextPathId) ? '<textPath xlink:href="#' + textPathId + '" startOffset="' + textPathStartOffsetPercent + '%">\n' : '',
              // Add shadow tspans.
              shadowSpans.join(''),
              // Add text and background tspans.
              textAndBg.textSpans.join(''),
            (hasTextPathId) ? '</textPath>\n' : '',
          '</text>\n',
        '</g>\n'
      );
    },

    /**
     * Get an copy of the text with an offset and a reduced fill-opacity to act as a shadow.
     * @private
     * @param {Number} lineHeight
     * @param {Array} textLines Array of all text lines
     * @return {Array}
     */
    _getSVGShadows: function(lineHeight, textLines) {
		//console.log('_getSVGShadows',33);
      // In IE 7 & 8, empty tspans are completely ignored. Using a lineTopOffsetMultiplier prevents empty tspans.
      var shadowSpans = [],
          i, len,
          lineTopOffsetMultiplier = 1;
      // Skip this step if there isn't a shadow specified or the object hasn't been rendered.
      if (!this.shadow || !this._boundaries) {
        return shadowSpans;
      }
      // Iterate the text lines, pushing a tspan with a reduced fill-opacity to act as a makeshift shadow.
      for (i = 0, len = textLines.length; i < len; i++) {
        if (textLines[i] !== '') {
          this._setSVGTextLineShadow(textLines[i], i, shadowSpans, lineHeight, lineTopOffsetMultiplier);
          lineTopOffsetMultiplier = 1;
        }
        else {
          lineTopOffsetMultiplier++;
        }
      }
      return shadowSpans;
    },

    /**
     * Push the tspan element(s) that will represent the shadow for the text line.
     * @private
     * @param {String} textLine Line of text to render.
     * @param {Number} lineIndex Line number being rendered.
     * @param {Array} shadowSpans Array to push the tspan elements into.
     * @param {Number} lineHeight Height of line being rendered.
     * @param {Number} lineTopOffsetMultiplier Misnamed adjustment to keep tspan considered non-trivial.
     */
    _setSVGTextLineShadow: function(textLine, lineIndex, shadowSpans, lineHeight, lineTopOffsetMultiplier) {
		//console.log('_setSVGTextLineShadow',34);
      var lineLeftOffset = (this._boundaries && this._boundaries[lineIndex]) ? (this._boundaries[lineIndex].left - lineTopOffsetMultiplier) : 0,
          xValue = (lineLeftOffset + lineTopOffsetMultiplier) + this.shadow.offsetX,
          yOrDeltaYAttributeName = ((lineIndex === 0 || this.useNative) ? 'y' : 'dy'),
          yOrDeltaYValue = this.useNative
          ? ((lineHeight * lineIndex) - this.height / 2 + this.shadow.offsetY)
          : (lineHeight + (lineIndex === 0 ? this.shadow.offsetY : 0)),
          shadowFillColor = (this.shadow.color && typeof this.shadow.color === 'string') ? new fabric.Color(this.shadow.color) : '';
      // Push the tspan element.
      shadowSpans.push(
        '<tspan',
          // x="x-value"
          ' ', 'x="', fabric.util.toFixed(xValue, 2), '"',
          // y="y-value" (or) dy="dy-value"
          ' ', yOrDeltaYAttributeName, '="', fabric.util.toFixed(yOrDeltaYValue, 2), '"',
          // Attributes, may include: stroke-opacity, fill-opacity, opacity, and fill.
          ' ', 'stroke-opacity="' + shadowFillColor.getAlpha() + '"', ' ', this._getFillAttributes(this.shadow.color), '>',
          // Escaped text for given line.
          fabric.util.string.escapeXml(textLine),
        '</tspan>'
      );
    },
	
	_setSVGTextLineText: function(textLine, i, textSpans, lineHeight, lineTopOffsetMultiplier) {
		var lineLeftOffset = null;
		/*Taking distance on path for first letter of string*/
		if(this.textAlign == "left" || this.textAlign == "justify"){
			lineLeftOffset = (this._boundaries && this._boundaries[i])
			? toFixed(this._boundaries[i].left, 2)
			: 0;
		}
		else if(this.textAlign == "right") {
			lineLeftOffset = (this._lastBoundaries && this._lastBoundaries[i])
			? toFixed((this._lastBoundaries[i].letters[i].point.runningDistanceAfter * this.scaleX), 2)
			: 0;
		}
		else if(this.textAlign == "center"){
			lineLeftOffset = (this._lastBoundaries && this._lastBoundaries[i])
			? toFixed(((this._lastBoundaries[i].letters[i].point.runningDistanceAfter - this._lastBoundaries[i].letters[i].point.distanceToConsume) * this.scaleX), 2)
			: 0;
		}
     
      textSpans.push(
        '<tspan dx="',
          lineLeftOffset, '" ',
          (i === 0 || this.useNative ? 'y' : 'dy'), '="',
          toFixed(this.useNative
            ? ((lineHeight * i) - this.height / 2)
            : (lineHeight * lineTopOffsetMultiplier), 2), '" ',
          // doing this on <tspan> elements since setting opacity
          // on containing <text> one doesn't work in Illustrator
          this._getFillAttributes(this.fill), '>',
          fabric.util.string.escapeXml(textLine),
        '</tspan>'
      );
    },

    /**
     * Adobe Illustrator (at least CS5) is unable to render rgba()-based fill values. Work around this by "moving" alpha channel into an "opacity" attribute and setting the "fill" attribute to a solid "rgb" (as opposed to "rgba") color. Firefox expects this value to be in the "fill-opacity" attribute
     * @private
     * @param {Any} value
     * @return {String}
     */
    _getFillAttributes: function(value) {
		//console.log('_getFillAttributes',35);
      var fillColor = (value && typeof value === 'string') ? new fabric.Color(value) : '';
      if (!fillColor || !fillColor.getSource() || fillColor.getAlpha() === 1) {
        return 'fill="' + value + '"';
      }
      return 'fill-opacity="' + fillColor.getAlpha() + '" opacity="' + fillColor.getAlpha() + '" fill="' + fillColor.setAlpha(1).toRgb() + '"';
    }
	});
	
    /**
	 * Returns fabric.Text instance from an object representation
	 * @static
	 * @memberOf fabric.Text
	 * @param {Object} object Object to create an instance from
	 * @return {fabric.Text} Instance of fabric.Text
	 */
	fabric.PathText.fromObject = function(object) {
		//console.log('fabric.PathText.fromObject',36);
	  var clonedObject = fabric.util.object.clone(object);
	  var instance = new fabric.PathText(object.text, clonedObject, function () {
            return instance && instance.canvas && instance.canvas.renderAll();
        });
      return instance;
	};


})(typeof exports != 'undefined' ? exports : this);

