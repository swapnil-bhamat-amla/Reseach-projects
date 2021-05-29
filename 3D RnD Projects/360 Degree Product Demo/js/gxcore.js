var gx = gx || {};

if (!window.Int32Array) {
    window.Int32Array = Array;
    window.Float32Array = Array;
}

gx.loadImage = function(src, callback) {
    var img = new Image();
    img.onload = function() {
        callback(img);
    };
    img.src = src;
    return img;
};

gx.extractUrlParameters = function () {
    var map = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        map[key] = value;
        alert("rr");
    });
    return map;
};

gx.StopWatch = function() {
    var dt1 = 0;
    var dt2 = 0;

    this.start = function() {
        dt1 = new Date().getTime();
    };

    this.stop = function() {
        dt2 = new Date().getTime();
    };

    this.getDuration = function() {
        return dt2 - dt1;
    }
};

gx.Vector = function(x, y, z) {
    this.set(x || 0, y || 0, z || 0);
};

gx.Vector.prototype = {

    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },

    set: function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    },

    copy: function(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    },

    negate: function() {
        this.scale(-1.0);
        return this;
    },

    normalize: function() {
        return this.scale(1.0 / this.length());
    },

    scale: function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    },

    add: function(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    },

    sub: function(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    },

    dot: function(other) {
        return (this.x * other.x) + (this.y * other.y) + (this.z * other.z);
    },

    cross: function(other) {
        return new gx.Vector((this.y * other.z) - (this.z * other.y),
                (this.z * other.x) - (this.x * other.z),
                (this.x * other.y) - (this.y * other.x));
    },

    transform: function(v, m) {
        var nx = (v.x * m.e00) + (v.y * m.e10) + (v.z * m.e20) + m.e30;
        var ny = (v.x * m.e01) + (v.y * m.e11) + (v.z * m.e21) + m.e31;
        var nz = (v.x * m.e02) + (v.y * m.e12) + (v.z * m.e22) + m.e32;
        this.x = nx;
        this.y = ny;
        this.z = nz;
        return this;
    }
};

gx.Matrix = function(e00, e01, e02, e03, e10, e11, e12, e13, e20, e21, e22, e23, e30, e31, e32, e33) {
    this.set(e00 || 1, e01 || 0, e02 || 0, e03 || 0,
            e10 || 0, e11 || 1, e12 || 0, e13 || 0,
            e20 || 0, e21 || 0, e22 || 1, e23 || 0,
            e30 || 0, e31 || 0, e32 || 0, e33 || 1);
};

gx.Matrix.prototype = {

    set: function(e00, e01, e02, e03, e10, e11, e12, e13, e20, e21, e22, e23, e30, e31, e32, e33) {
        this.e00 = e00;
        this.e01 = e01;
        this.e02 = e02;
        this.e03 = e03;
        this.e10 = e10;
        this.e11 = e11;
        this.e12 = e12;
        this.e13 = e13;
        this.e20 = e20;
        this.e21 = e21;
        this.e22 = e22;
        this.e23 = e23;
        this.e30 = e30;
        this.e31 = e31;
        this.e32 = e32;
        this.e33 = e33;
        return this;
    },

    multiply: function(m1, m2) {
        var m00 = m1.e00 * m2.e00 + m1.e01 * m2.e10 + m1.e02 * m2.e20 + m1.e03 * m2.e30;
        var m01 = m1.e00 * m2.e01 + m1.e01 * m2.e11 + m1.e02 * m2.e21 + m1.e03 * m2.e31;
        var m02 = m1.e00 * m2.e02 + m1.e01 * m2.e12 + m1.e02 * m2.e22 + m1.e03 * m2.e32;
        var m03 = m1.e00 * m2.e03 + m1.e01 * m2.e13 + m1.e02 * m2.e23 + m1.e03 * m2.e33;
        var m10 = m1.e10 * m2.e00 + m1.e11 * m2.e10 + m1.e12 * m2.e20 + m1.e13 * m2.e30;
        var m11 = m1.e10 * m2.e01 + m1.e11 * m2.e11 + m1.e12 * m2.e21 + m1.e13 * m2.e31;
        var m12 = m1.e10 * m2.e02 + m1.e11 * m2.e12 + m1.e12 * m2.e22 + m1.e13 * m2.e32;
        var m13 = m1.e10 * m2.e03 + m1.e11 * m2.e13 + m1.e12 * m2.e23 + m1.e13 * m2.e33;
        var m20 = m1.e20 * m2.e00 + m1.e21 * m2.e10 + m1.e22 * m2.e20 + m1.e23 * m2.e30;
        var m21 = m1.e20 * m2.e01 + m1.e21 * m2.e11 + m1.e22 * m2.e21 + m1.e23 * m2.e31;
        var m22 = m1.e20 * m2.e02 + m1.e21 * m2.e12 + m1.e22 * m2.e22 + m1.e23 * m2.e32;
        var m23 = m1.e20 * m2.e03 + m1.e21 * m2.e13 + m1.e22 * m2.e23 + m1.e23 * m2.e33;
        var m30 = m1.e30 * m2.e00 + m1.e31 * m2.e10 + m1.e32 * m2.e20 + m1.e33 * m2.e30;
        var m31 = m1.e30 * m2.e01 + m1.e31 * m2.e11 + m1.e32 * m2.e21 + m1.e33 * m2.e31;
        var m32 = m1.e30 * m2.e02 + m1.e31 * m2.e12 + m1.e32 * m2.e22 + m1.e33 * m2.e32;
        var m33 = m1.e30 * m2.e03 + m1.e31 * m2.e13 + m1.e32 * m2.e23 + m1.e33 * m2.e33;
        this.e00 = m00;
        this.e01 = m01;
        this.e02 = m02;
        this.e03 = m03;
        this.e10 = m10;
        this.e11 = m11;
        this.e12 = m12;
        this.e13 = m13;
        this.e20 = m20;
        this.e21 = m21;
        this.e22 = m22;
        this.e23 = m23;
        this.e30 = m30;
        this.e31 = m31;
        this.e32 = m32;
        this.e33 = m33;
        return this;
    }
};

gx.Matrix.createIdentity = function() {
    return new gx.Matrix(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
};

gx.Matrix.createRotationAboutX = function(a) {
    var c = Math.cos(a);
    var s = Math.sin(a);
    return new gx.Matrix(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1);
};

gx.Matrix.createRotationAboutY = function(a) {
    var c = Math.cos(a);
    var s = Math.sin(a);
    return new gx.Matrix(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1);
};

gx.Matrix.createRotationAboutZ = function(a) {
    var c = Math.cos(a);
    var s = Math.sin(a);
    return new gx.Matrix(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
};

gx.Texture = function (imageData) {
    /*var canvas = document.createElement("canvas");
    var width = canvas.width = image.width;
    var height = canvas.height = image.height;
    var ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0);
    */
    var width = imageData.width;
    var height = imageData.height;
    var pixs = imageData.data;
    var data = new Int32Array(width * height);
    for (var i = 0; i < pixs.length; i += 4) {
        data[i >> 2] = pixs[i + 3] << 24 | pixs[i] << 16 | pixs[i + 1] << 8 | pixs[i + 2];
    }

    this.getWidth = function () {
        return width;
    };

    this.getHeight = function () {
        return height;
    };

    this.getTexel = function (x, y) {
        return data[y * width + x];
    };

    this.getTexelAt = function (index) {
        return data[index];
    }

    this.pasteCanvasContent = function (image, can, dx, dy, dw, dh) {
        var canvas = document.createElement("canvas");
        var width = canvas.width = image.width;
        var height = canvas.height = image.height;
        var ctx = canvas.getContext("2d");

        ctx.drawImage(image, 0, 0);
        ctx.drawImage(can, dx, dy, dw, dh);

        var pixs = ctx.getImageData(0, 0, width, height).data;
        for (var i = 0; i < pixs.length; i += 4) {
            data[i >> 2] = pixs[i + 3] << 24 | pixs[i] << 16 | pixs[i + 1] << 8 | pixs[i + 2];
        }
    }
};

gx.Surface = function (canvas) {
    var width = canvas.width;
    var height = canvas.height;
    var context = canvas.getContext("2d");
    var imageData = context.createImageData(width, height);
    var data = imageData.data;
    var length = data.length;

    for (var i = 0; i < length; i++) {
        data[i] = 0xFF;
    }

    this.getWidth = function () {
        return width;
    };

    this.getHeight = function () {
        return height;
    };

    this.clear = function (red, green, blue, alpha) {
        var i = length;
        while (i) {
            data[--i] = 0xFF & alpha;
            data[--i] = 0xFF & blue;
            data[--i] = 0xFF & green;
            data[--i] = 0xFF & red;
        }
    };

    this.setPixel = function (x, y, red, green, blue) {
        var offset = (y * width + x) << 2;
        data[offset] = red;
        data[offset + 1] = green;
        data[offset + 2] = blue;
        data[offset + 3] = 0xff;
    };

    this.setPixelAt = function (index, red, green, blue) {
        index <<= 2;
        data[index] = red;
        data[index + 1] = green;
        data[index + 2] = blue;
        data[index + 3] = 0xff;
    };

    this.update = function () {
        context.putImageData(imageData, 0, 0);
    };
};

gx.Surface3D = function(surface) {

    var Edge = function() {
        this.x = 0;
        this.y = 0;
        this.height = 0;
        this.xStep = 0;
        this.oneOverZ = 0;
        this.oneOverZStep = 0;

        this.set = function(x, y, height, xStep, oneOverZ, oneOverZStep) {
            this.x = x;
            this.y = y;
            this.height = height;
            this.xStep = xStep;
            this.oneOverZ = oneOverZ;
            this.oneOverZStep = oneOverZStep;
        };

        this.step = function() {
            this.x += this.xStep;
            this.y++;
            this.oneOverZ += this.oneOverZStep;
        }
    };

    var Context = function(elementCount) {
        var dataBuffer = new Float32Array(3 * elementCount);
        var overZBuffer = new Float32Array(3 * elementCount);
        var edgeOverZ = new Float32Array(3 * elementCount);
        var edgeOverZStep = new Float32Array(3 * elementCount);
        var gradients = new Array(elementCount);
        var vertices = [new gx.Vector(), new gx.Vector(), new gx.Vector()];
        var edges = [new Edge(), new Edge(), new Edge()];
        var currentLeft;
        var currentRight;
        var middleIsLeft;
        var dOneOverZdX;
        var dOneOverZdY;
        var startY;
        var interpolatedData;

        for (var i = 0; i < elementCount; i++) {
            gradients[i] = new gx.Vector();
        }

        this.getStartY = function() {
            return startY;
        };

        this.getTotalHeight = function() {
            return edges[0].height;
        };

        this.getTopToMiddleHeight = function() {
            return edges[1].height;
        };

        this.getMiddleToBottomHeight = function() {
            return edges[2].height;
        };

        this.computeOverZ = function(index, z) {
            var i = elementCount;
            var offset = index * elementCount;
            while (i--) {
                overZBuffer[offset] = dataBuffer[offset++] * z;
            }
        };

        this.stepData = function() {
            var i = elementCount;
            while (i--) {
                interpolatedData[i] += gradients[i].x;
            }
        };

        this.area = function() {
            return (vertices[1].x - vertices[0].x) * (vertices[2].y - vertices[0].y) -
                    (vertices[2].x - vertices[0].x) * (vertices[1].y - vertices[0].y);
        };

        this.resolve = function(targetData) {
            interpolatedData = targetData;
            var y0 = vertices[0].y;
            var y1 = vertices[1].y;
            var y2 = vertices[2].y;

            var top;
            var middle;
            var bottom;
            var middleForCompare;
            var bottomForCompare;

            if (y0 < y1) {
                if (y2 < y0) {
                    top = 2;
                    middle = 0;
                    bottom = 1;
                    middleForCompare = 0;
                    bottomForCompare = 1;
                }
                else {
                    top = 0;
                    if (y1 < y2) {
                        middle = 1;
                        bottom = 2;
                        middleForCompare = 1;
                        bottomForCompare = 2;
                    }
                    else {
                        middle = 2;
                        bottom = 1;
                        middleForCompare = 2;
                        bottomForCompare = 1;
                    }
                }
            }
            else {
                if (y2 < y1) {
                    top = 2;
                    middle = 1;
                    bottom = 0;
                    middleForCompare = 1;
                    bottomForCompare = 0;
                }
                else {
                    top = 1;
                    if (y0 < y2) {
                        middle = 0;
                        bottom = 2;
                        middleForCompare = 3;
                        bottomForCompare = 2;
                    }
                    else {
                        middle = 2;
                        bottom = 0;
                        middleForCompare = 2;
                        bottomForCompare = 3;
                    }
                }
            }

            var oneOverZ0 = 1.0 / vertices[0].z;
            var oneOverZ1 = 1.0 / vertices[1].z;
            var oneOverZ2 = 1.0 / vertices[2].z;

            var v0x2x = vertices[0].x - vertices[2].x;
            var v1x2x = vertices[1].x - vertices[2].x;
            var v0y2y = vertices[0].y - vertices[2].y;
            var v1y2y = vertices[1].y - vertices[2].y;

            var OneOverdX = 1.0 / (v1x2x * v0y2y - v0x2x * v1y2y);
            var OneOverdY = -OneOverdX;

            dOneOverZdX = OneOverdX * ((oneOverZ1 - oneOverZ2) * v0y2y - (oneOverZ0 - oneOverZ2) * v1y2y);
            dOneOverZdY = OneOverdY * ((oneOverZ1 - oneOverZ2) * v0x2x - (oneOverZ0 - oneOverZ2) * v1x2x);

            this.computeOverZ(0, oneOverZ0);
            this.computeOverZ(1, oneOverZ1);
            this.computeOverZ(2, oneOverZ2);

            var tx0 = OneOverdX * v0y2y;
            var tx1 = OneOverdX * v1y2y;
            var ty0 = OneOverdY * v0x2x;
            var ty1 = OneOverdY * v1x2x;
            var i = elementCount;
            while (i--) {
                var overZ2 = overZBuffer[elementCount + elementCount + i];
                var overZ0 = overZBuffer[i] - overZ2;
                var overZ1 = overZBuffer[i + elementCount] - overZ2;
                gradients[i].x = overZ1 * tx0 - overZ0 * tx1;
                gradients[i].y = overZ1 * ty0 - overZ0 * ty1;
            }

            this.computeEdge(0, top, bottom, oneOverZ0, oneOverZ1, oneOverZ2);
            this.computeEdge(1, top, middle, oneOverZ0, oneOverZ1, oneOverZ2);
            this.computeEdge(2, middle, bottom, oneOverZ0, oneOverZ1, oneOverZ2);

            startY = edges[0].y;

            middleIsLeft = bottomForCompare < middleForCompare;
            currentLeft = middleIsLeft ? 1 : 0;
            currentRight = middleIsLeft ? 0 : 1;

            return dOneOverZdX;
        };

        this.computeEdge = function(index, top, bottom, oneOverZ0, oneOverZ1, oneOverZ2) {
            var y = ~ ~vertices[top].y + 1;
            var height = (~ ~vertices[bottom].y + 1) - y;

            var realHeight = vertices[bottom].y - vertices[top].y;
            var realWidth = vertices[bottom].x - vertices[top].x;
            var yPreStep = y - vertices[top].y;
            var x = ((realWidth * yPreStep) / realHeight) + vertices[top].x;
            var xStep = realWidth / realHeight;
            var xPreStep = x - vertices[top].x;

            var offset = index * elementCount;
            var topOffset = top * elementCount;
            var i = elementCount;
            while (i-- > 0) {
                edgeOverZ[offset + i] = overZBuffer[topOffset + i] + yPreStep * gradients[i].y + xPreStep * gradients[i].x;
                edgeOverZStep[offset + i] = xStep * gradients[i].x + gradients[i].y;
            }

            var oneOverZStep = xStep * dOneOverZdX + dOneOverZdY;
            var oneOverZ = yPreStep * dOneOverZdY + xPreStep * dOneOverZdX;
            switch (top) {
                case 0:
                    oneOverZ += oneOverZ0;
                    break;

                case 1:
                    oneOverZ += oneOverZ1;
                    break;

                case 2:
                    oneOverZ += oneOverZ2;
                    break;
            }

            edges[index].set(x, y, height, xStep, oneOverZ, oneOverZStep);
        };

        this.initialize = function(outParams) {
            var elemCount = elementCount;
            var xStart = ~ ~edges[currentLeft].x + 1;
            var xPrestep = xStart - edges[currentLeft].x;
            var offset = currentLeft * elemCount;
            var i = 0;
            while (elemCount--) {
                interpolatedData[i] = edgeOverZ[offset++] + xPrestep * gradients[i++].x;
            }
            var oneOverZ = edges[currentLeft].oneOverZ + xPrestep * dOneOverZdX;
            outParams.outXStart = xStart;
            outParams.outOneOverZ = oneOverZ;
            return (~ ~edges[currentRight].x + 1) - xStart;
        };

        this.stepEdges = function() {
            edges[currentLeft].step();
            edges[currentRight].step();
            var elemCount = elementCount;
            var leftOffset = currentLeft * elemCount;
            var rightOffset = currentRight * elemCount;
            while (elemCount--) {
                edgeOverZ[leftOffset] += edgeOverZStep[leftOffset++];
                edgeOverZ[rightOffset] += edgeOverZStep[rightOffset++];
            }
        };

        this.nextStage = function() {
            if (currentLeft == 1) {
                currentLeft = 2;
            }
            else {
                currentRight = 2;
            }
        };

        this.setVertexData = function(index, x, y, z) {
            vertices[index].set(x, y, z);
        };

        this.setCustomData = function(index, data) {
            var i = data.length;
            var offset = index * elementCount + i;
            do {
                dataBuffer[--offset] = data[--i];
            }
            while (i);
        }
    };

    this.callback = function() {
        return 0x000000;
    };

    var context = new Context(0);
    var interpolatedData = new Float32Array(0);
    var zbuffer = new Float32Array(surface.getWidth() * surface.getHeight());

    this.getWidth = surface.getWidth;
    this.getHeight = surface.getHeight;
    this.update = surface.update;

    this.clear = function(red, green, blue, alpha) {
        var i = zbuffer.length;
        var posinf = Number.POSITIVE_INFINITY;
        while (--i) {
            zbuffer[i] = posinf;
        }
        surface.clear(red, green, blue, alpha);
    };

    this.createContext = function(elementCount) {
        context = new Context(elementCount);
        interpolatedData = new Float32Array(elementCount);
    };

    this.setVertex = function(index, x, y, z) {
        context.setVertexData(index, x, y, z);
    };

    this.setCustom = function(index, data) {
        context.setCustomData(index, data);
    };

    this.render = function() {
        if (context.area() > 0) {
            var outParams = new Object();
            outParams.outXStart = 0;
            outParams.outOneOverZ = 0;
            var oneOverZdX = context.resolve(interpolatedData);
            var height = context.getTopToMiddleHeight();
            var total = context.getTotalHeight();
            var y = context.getStartY() * surface.getWidth();
            while (total > 0) {
                total -= height;
                if (height > 0) {
                    while (height--) {
                        var width = context.initialize(outParams);
                        if (width > 0) {
                            var xStart = outParams.outXStart;
                            var oneOverZ = outParams.outOneOverZ;
                            var mem = y + xStart;
                            while (width--) {
                                var Z = 1.0 / oneOverZ;
                                if (Z < zbuffer[mem]) {
                                    zbuffer[mem] = Z;
                                    var rgb = this.callback(interpolatedData, Z);
                                    surface.setPixelAt(mem, 0xFF & rgb >> 16, 0xFF & rgb >> 8, 0xFF & rgb);
                                }							
                                context.stepData();
                                oneOverZ += oneOverZdX;
                                mem++;
                            }
                        }
                        context.stepEdges();
                        y += surface.getWidth();
                    }
                }
                height = context.getMiddleToBottomHeight();
                context.nextStage();
            }
        }
    }
};