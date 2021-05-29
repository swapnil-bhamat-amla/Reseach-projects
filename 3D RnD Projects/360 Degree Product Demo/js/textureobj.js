Texel = function(u, v) {
    this.u = u;
    this.v = v;
};

VertexIndices = function(v, vt, vn) {
    this.v = v;
    this.vt = vt;
    this.vn = vn;
};

Material = function(name) {
    this.name = name;
    this.ka = new gx.Vector(0, 0, 0);
    this.kd = new gx.Vector(1, 1, 1);
    this.ks = new gx.Vector(0, 0, 0);
    this.mapKd = null;
};

Face = function(v0, v1, v2, material) {
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.material = material;
};

Mesh = function(vertices, normals, texels, faces) {
    this.vertices = vertices;
    this.texels = texels;
    this.normals = normals;
    this.faces = faces;	
};

var activeTexture = null;

var uOffset = 0.0;
var vOffset = 0.0;
var uScale = 1.0;
var vScale = 1.0;

function loadTexture(canvas) {
    activeTexture = null;
    activeTexture = new gx.Texture(canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height));
    forceRedraw = true;
}

function getUOffset() {
    return uOffset;
}

function setUOffset(value) {
    uOffset = value;
    forceRedraw = true;
}

function getVOffset() {
    return vOffset;
}

function setVOffset(value) {
    vOffset = value;
    forceRedraw = true;
}

function getUScale() {
    return uScale;
}

function setUScale(value) {
    uScale = value;
    forceRedraw = true;
}

function getVScale() {
    return vScale;
}

function setVScale(value) {
    vScale = value;
    forceRedraw = true;
}

var backgroundColor = 0x00000000;
var baseColor = 0xffffff;
var behindColor = 0xffffff;

function getBackgroundColor() {
    return backgroundColor;
}

function setBackgroundColor(value) {
    backgroundColor = value;
    forceRedraw = true;
}

function getBaseColor() {
    return baseColor;
}

function setBaseColor(value) {
    baseColor = value;
    forceRedraw = true;
}

var playing = false;
var forceRedraw = false;


var angleX = 0.35;
var angleY = 18.3;
var screenshotCallback = null;

function takeScreenShot(aX, aY, cback) {
    angleX = aX;
    angleY = aY;
    screenshotCallback = cback;
}





Mesh.load = function (data, scale) {
    var vertices = new Array();
    var normals = new Array();
    var texels = new Array();
    var faces = new Array();
    var materials = new Array();
    var mats = null;


    var lines = data.split("\n");
    var count = lines.length;
    for (var i = 0; i < count; i++) {
        var line = lines[i];
        var fragments = line.split(" ");
        switch (fragments[0]) {
            case 'v':
                var vx = parseFloat(fragments[1]) * scale;
                var vy = parseFloat(fragments[2]) * scale;
                var vz = parseFloat(fragments[3]) * scale;
                vertices.push(new gx.Vector(vx, vy, vz));
                break;

            case 'vn':
                var x = parseFloat(fragments[1]);
                var y = parseFloat(fragments[2]);
                var z = parseFloat(fragments[3]);
                normals.push(new gx.Vector(x, y, z));
                break;

            case 'vt':
                var u = parseFloat(fragments[1]);
                var v = parseFloat(fragments[2]);
                texels.push(new Texel(u, 1 - v));
                break;

            case 'f':
                var v0 = pullFaceData(fragments[1].split("/"));
                var v1 = pullFaceData(fragments[2].split("/"));
                var v2 = pullFaceData(fragments[3].split("/"));
                faces.push(new Face(v0, v1, v2, mats));
                break;
        }
    }

    return new Mesh(vertices, normals, texels, faces);

    function pullColorData(fragments) {
        var r = parseFloat(fragments[1]);
        var g = parseFloat(fragments[2]);
        var b = parseFloat(fragments[3]);
        return new gx.Vector(r, g, b);
    }

    function pullFaceData(triples) {
        var v = ~ ~(triples[0]) - 1;
        var vt = ~ ~(triples[1]) - 1;
        var vn = ~ ~(triples[2]) - 1;
        return new VertexIndices(v || 0, vt || 0, vn || 0)
    }
};

Demo = function (canvas) {
    var g2d = new gx.Surface(canvas);
    var g3d = new gx.Surface3D(g2d);
    var intervalId;
    var timer = new gx.StopWatch();
    var mesh = null;
    var lastAngleX;
    var lastAngleY;
    var light = new gx.Vector(0, 5, -10);
    light.normalize();
    var rendering = false;
    var oldX = 0;
    var oldY = 0;
    var interactive = false;
    var fpsElement;
    g3d.createContext(5);

    $(window).mousemove(function (e) {
        if (interactive) {
            angleY -= (e.clientX - oldX) / 80.0;
            angleX -= (e.clientY - oldY) / 80.0;
            oldX = e.clientX;
            oldY = e.clientY;
        }
    });

    $("#demo").mousedown(function (e) {
        oldX = e.clientX;
        oldY = e.clientY;
        interactive = true;
        return false;
    });

    $("#demo").mouseup(function () {
        interactive = false;
        return false;
    });

    this.load = function (modelFile, loadedCallback) {
        $.get(modelFile, function (data) {
            mesh = Mesh.load(data, 1);
            loadedCallback();
        });
    };

    this.start = function () {
        intervalId = window.setInterval(this.run, 1000 / 25.0);
    };

    this.stop = function () {
        window.clearInterval(intervalId);
    };

    this.run = function () {
        if (!rendering && activeTexture !== null) {


            if (!interactive && playing) {
                angleX += 0.00;
                angleY += 0.05;
            }

            if (lastAngleX === angleX && lastAngleY === angleY && !forceRedraw) {
                return;
            }


            forceRedraw = false;
            rendering = true;
            lastAngleX = angleX;
            lastAngleY = angleY;

            g3d.clear(backgroundColor >> 24 & 0xff, backgroundColor >> 16 & 0xff, backgroundColor >> 8 & 0xff, backgroundColor & 0xff);

            var rotation = gx.Matrix.createRotationAboutY(angleY);
            rotation.multiply(rotation, gx.Matrix.createRotationAboutX(angleX));

            var scale = 1200;
            var mx = g2d.getWidth() >> 1;
            var my = g2d.getHeight() >> 1;
            var i = mesh.faces.length;
            var x0 = new gx.Vector();
            var x1 = new gx.Vector();
            var x2 = new gx.Vector();
            var n0 = new gx.Vector();
            var n1 = new gx.Vector();
            var n2 = new gx.Vector();
            g3d.callback = shader;
            var faces = mesh.faces;
            var vertices = mesh.vertices;
            var normals = mesh.normals;
            while (i--) {
                var face = faces[i];
                var v0 = vertices[face.v0.v];
                var v1 = vertices[face.v1.v];
                var v2 = vertices[face.v2.v];
                transform(v0, x0, rotation, scale, 2, mx, my);
                transform(v1, x1, rotation, scale, 2, mx, my);
                transform(v2, x2, rotation, scale, 2, mx, my);

                if (activeTexture === null) {
                    continue;
                }

                var vt0 = mesh.texels[face.v0.vt] || 0;
                var vt1 = mesh.texels[face.v1.vt] || 0;
                var vt2 = mesh.texels[face.v2.vt] || 0;

                var vn0 = normals[face.v0.vn];
                var vn1 = normals[face.v1.vn];
                var vn2 = normals[face.v2.vn];

                n0.transform(vn0, rotation);
                n1.transform(vn1, rotation);
                n2.transform(vn2, rotation);

                g3d.setVertex(0, x0.x, x0.y, x0.z);
                g3d.setCustom(0, [n0.x, n0.y, n0.z, vt0.u, vt0.v]);

                g3d.setVertex(1, x1.x, x1.y, x1.z);
                g3d.setCustom(1, [n1.x, n1.y, n1.z, vt1.u, vt1.v]);

                g3d.setVertex(2, x2.x, x2.y, x2.z);
                g3d.setCustom(2, [n2.x, n2.y, n2.z, vt2.u, vt2.v]);

                g3d.render();
            }
            g2d.update();




            rendering = false;
            if (screenshotCallback) {
                var screenshotCallbackTmp = screenshotCallback;
                screenshotCallback = null;
                screenshotCallbackTmp(canvas.toDataURL('image/png'));
            }
        }
    };

    var shader = function (data, z) {
        var intensity = light.dot(new gx.Vector(data[0] * z, data[1] * z, data[2] * z));
        if (intensity <= 0)
            return 0;

        var u = data[3] * uScale;
        var v = data[4] * vScale;

        var textureWidth = activeTexture.getWidth();
        var textureHeight = activeTexture.getHeight();
        var textureX = ~ ~(textureWidth * u * z + uOffset * textureWidth);
        var textureY = ~ ~(textureHeight * v * z + vOffset * textureHeight);

        var rgb = activeTexture.getTexel(textureX, textureY);


        var alpha = rgb >> 24 & 0xff;


        if (textureX < 0 || textureX > textureWidth || textureY < 0 || textureY > textureHeight) {
            rgb = behindColor;
            alpha = 0xff;
        }

        return ~ ~(intensity * ((rgb >> 0x10 & 0xFF) * alpha + (baseColor >> 0x10 & 0xFF) * (0xff - alpha)) / 0xff) << 16 |
                ~ ~(intensity * ((rgb >> 0x08 & 0xFF) * alpha + (baseColor >> 0x08 & 0xFF) * (0xff - alpha)) / 0xff) << 8 |
                ~ ~(intensity * ((rgb >> 0x00 & 0xFF) * alpha + (baseColor >> 0x00 & 0xFF) * (0xff - alpha)) / 0xff);
    };

    function transform(source, target, xForm, scale, distance, originX, originY) {
        var sx = source.x;
        var sy = source.y;
        var sz = source.z;
        target.z = sx * xForm.e02 + sy * xForm.e12 + sz * xForm.e22 + distance;
        target.x = originX + (scale * (sx * xForm.e00 + sy * xForm.e10 + sz * xForm.e20) / (target.z));
        target.y = originY - (scale * (sx * xForm.e01 + sy * xForm.e11 + sz * xForm.e21) / (target.z));
    }
};