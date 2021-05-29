
var picklet = function(){
    var actx = {};

    function irnd(rng){return parseInt(Math.random()*rng);}
    function rgba(r,g,b,a){return 'rgba('+r+','+g+','+b+','+a+')';}
    actx.randomColor = function randomColor(){return rgba(irnd(255),irnd(255),irnd(255),Math.random());}
    actx.randomSolidColor = function randomSolidColor(){return rgba(irnd(255),irnd(255),irnd(255),1);}

    var huelut=[[1,0,0],[1,1,0],[0,1,0],[0,1,1],[0,0,1],[1,0,1],[1,0,0]];
    var hblack=[0,0,0];
    var hwhite=[1,1,1];

    function clamp(val,min, max) {  return Math.min(Math.max(val, min?min:0), max?max:1);};
    function lerp(va,vb,vv){return va+((vb-va)*vv);}
    function HSVToRGB(h,s,v,a){
        var ff=255.999;
        var la = h*5.9999;
        var sa = parseInt(la);
        var ca = la-sa;
        var hsa=huelut[sa];
        var hsb=huelut[sa+1];
        var rgb=[0,0,0];
        for(var t=0;t<3;t++)rgb[t]=lerp(0,lerp(1,lerp(hsa[t],hsb[t],ca),s),v);
        return rgba(parseInt(rgb[0]*ff),parseInt(rgb[1]*ff),parseInt(rgb[2]*ff),a?a:1.0);
    }

    function vecLen(vec){return (vec.x!=0||vec.y!=0)?Math.sqrt((vec.x*vec.x)+(vec.y*vec.y)):0;}

    function vecToHSV(vec,vlen){
        vlen = clamp(vlen);
        return[(Math.atan2(vec.x,vec.y)/(Math.PI*2))+0.5,vlen>0.5?1:vlen/0.5,vlen>0.5?(1.0-vlen)*2:1];
    }
    actx.create=function (name,onpick){
        var rootCanvas=document.getElementById(name?name:'pickr');
        var pctx = rootCanvas.getContext('2d');
        var ccanvas = document.createElement('canvas');
        ccanvas.width=rootCanvas.width;
        ccanvas.height=rootCanvas.height;
        var cctx = ccanvas.getContext('2d');
        var pdim = rootCanvas.height,hdim=pdim*0.5;
        var pickedColor;
        for(var y=0;y<pdim;y++){
            for(var x=0;x<pdim;x++){
                //if(Math.random()>0.5)continue;
                var vec = {x:(x-hdim)/hdim,y:(y-hdim)/hdim};
                var vlen = vecLen(vec);
                var hsv = vecToHSV(vec,vlen);
                var alpha = 1.0;
                if(vlen>0.9)
                    alpha=clamp(1.0-((vlen-0.9)/0.1),0.01,1.0);
                cctx.fillStyle=HSVToRGB(hsv[0],hsv[1],hsv[2],alpha);
                cctx.fillRect(x,y,1,1);
            }
        }
        pctx.fillStyle = rgba(255,255,255,0.01);
        pctx.fillRect(0,0,pdim,pdim);
        pctx.drawImage(ccanvas,0,0);

        var mouseDown = false;
        function doPick(evt){
            if(!mouseDown)return;
            evt.preventDefault();
            var pdim = rootCanvas.height,hdim=pdim*0.5;
       pctx.globalCompositeOperation = "source-in";
            pctx.fillStyle = rgba(255,0,0,0.01);
            pctx.fillRect(0,0,pdim,pdim);
       pctx.globalCompositeOperation = "normal";
            pctx.drawImage(ccanvas,0,0);
            var vec={x:(evt.offsetX-hdim)/hdim,y:(evt.offsetY-hdim)/hdim};
            var vlen = vecLen(vec);
            var hsv = vecToHSV(vec,vlen);
            var color = HSVToRGB(hsv[0],hsv[1],hsv[2]);
           // if(onpick)onpick(color);
            pickedColor = color;

            pctx.fillStyle = color;
            pctx.strokeStyle='black';
            var pdim = parseInt(hdim*0.1);
            pctx.beginPath();
            var vscl = hdim*(vlen>1.0?1.0/vlen:1.0);
            pctx.arc(
//            evt.offsetX,evt.offsetY,
            (vec.x*vscl)+hdim,(vec.y*vscl)+hdim,pdim,0,2*Math.PI);
            pctx.fill();
            pctx.stroke();

        }
        rootCanvas.addEventListener('mousemove',doPick);
        rootCanvas.addEventListener('mousedown',function(evt){mouseDown=true;doPick(evt);if(onpick&&pickedColor)onpick(pickedColor);});
        rootCanvas.addEventListener('mouseup',function(evt){mouseDown=false;if(onpick&&pickedColor)onpick(pickedColor);});
        rootCanvas.addEventListener('click',doPick);
    }
    return actx;
}();