var objectVisualizer=function(){
    var octx={};

    var canvas=document.getElementById('viewport');
    var userRotation = new THREE.Vector3();
    var userZoom = new THREE.Vector3();
    var lastMousePosition;
    var renderer;
    var scene;
    var camera;
    var userPastedImage;
    var urlparams = location.search.split('?')[1];//'shirt.json'
    if(urlparams)urlparams = urlparams.split(',');
    else urlparams=[];
    function geturlparam(index,nullv){
        return urlparams.length>index?urlparams[index]=='0'?nullv:urlparams[index]:nullv
    };

    function irnd(rng){
        return parseInt(Math.random()*rng);
    }

    var animMesh;
    var objColor = geturlparam(2)?'#'+geturlparam(2):picklet.randomSolidColor();

    function mergeObject(a,b){
        if(b)
        for(v in b)
        {a[v]=b[v];
        }
    }
    
    function clamp(val,min, max) {  
        return Math.min(Math.max(val, min?min:0), max?max:1);
    };
    function lerp(va,vb,vv){
        return va+((vb-va)*vv);
    }


    function paste_createImage(source){
        var pastedImage = new Image();
        pastedImage.onload = function() {
            userPastedImage = pastedImage;
            //ctx.drawImage(pastedImage, 0, 0);
            if(animMesh){
                animMesh.rebuildTexture();
            }		
        }
        pastedImage.src = source;
    }

    window.addEventListener("paste", pasteHandler);
    function pasteHandler(e){
        if(e.clipboardData) {
            var items = e.clipboardData.items;
            if (items){
                for (var i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                        var blob = items[i].getAsFile();
                        var URLObj = window.URL || window.webkitURL;
                        var source = URLObj.createObjectURL(blob);
                        paste_createImage(source);
                    }
                }
            }
            else{
                setTimeout(paste_check_Input, 1);
            }
        }
    }


    picklet.create(undefined,function(color){
        objColor = color;
        if(animMesh)
            animMesh.rebuildTexture();
        //initApp();
    });


    function initGraph(){

        //RENDERER
        canvas=document.getElementById('viewport');
        renderer = new THREE.WebGLRenderer({antialias:true,canvas:canvas});
        renderer.setClearColor(0xffffff);

        document.body.style.margin = 0;
        document.body.style.padding = 0;
        document.body.style.overflow = 'hidden';
        //document.body.appendChild( renderer.domElement );
        //renderer.domElement.style.position = 'absolute';

        //Set up the scene and camera
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
            35,             // Field of view
            800 / 600,      // Aspect ratio
            0.1,            // Near plane
            10000           // Far plane
        );
        camera.position.set( 0, 0, 10 );
        camera.lookAt( scene.position );

        userZoom.z = camera.position.z;

        var lightIntensity = 0.5;
        //Add 2 point lights and an ambient light...
        var lightDist = 100;
        var lightColor = 0xFFFFFF;
        
        var light = new THREE.PointLight( lightColor , lightIntensity);
        light.position.set( -lightDist*2.0, 0, lightDist );
        scene.add( light );

        light = new THREE.PointLight( lightColor , lightIntensity );
        light.position.set( lightDist*2.0, lightDist*0.25, lightDist );
        scene.add( light );

        var light = new THREE.AmbientLight( ); // soft white light
        light.color.setRGB(1.0*lightIntensity,1.0*lightIntensity,1.0*lightIntensity);
        scene.add( light );


    }

    function addEventListeners(){

        canvas.addEventListener("webglcontextlost", function(event){
            console.log("Lost GL context..");
            event.preventDefault();
            if(animRequestID){
                cancelRequestAnimation(animRequestID);
                delete animRequestID;
            }
        }, false);
        canvas.addEventListener("webglcontextrestored", function(event){
            console.log("GL context restored..");
            initApp();
        }, false);

        var mouseDown = false;
        canvas.addEventListener('mousedown',function(evt){mouseDown=true;});
        canvas.addEventListener('mouseup',function(evt){mouseDown=false;});

        canvas.addEventListener('mousemove',function(evt){
            if(!lastMousePosition)lastMousePosition = new THREE.Vector2(evt.clientX,evt.clientY);
            if(mouseDown){
                userRotation.y=clamp(userRotation.y+(evt.clientX-lastMousePosition.x)*0.01,-Math.PI*5,Math.PI*5);
                userRotation.x=clamp(userRotation.x+(evt.clientY-lastMousePosition.y)*0.01,-Math.PI*0.5,Math.PI*0.5);
            }
            lastMousePosition.set(evt.clientX,evt.clientY);
        });

        window.addEventListener('mousewheel',function(evt){
            userZoom.z=clamp(userZoom.z+evt.wheelDelta*-0.01,3,15);
        });


        var obj = canvas;//document.getElementById('id');
        var lastTouch;
        obj.addEventListener('touchmove', function(event) {
          // If there's exactly one finger inside this element
          if (event.targetTouches.length == 1) {
            var touch = event.targetTouches[0];
            // Place element where the finger is
            //obj.style.left = touch.pageX + 'px';
            //obj.style.top = touch.pageY + 'px';
            if(!lastTouch)lastTouch = new THREE.Vector2(touch.pageX,touch.pageY);
            userRotation.y=clamp(userRotation.y+(touch.pageX-lastTouch.x)*0.01,-Math.PI*5,Math.PI*5);
            userRotation.x=clamp(userRotation.x+(touch.pageY-lastTouch.y)*0.01,-Math.PI*0.5,Math.PI*0.5);

            lastTouch.set(touch.pageX,touch.pageY);
            event.preventDefault();
          }
        }, false);



    }


    function loadObject(options){
        
        var params={
            meshPath:'mug.json',
            color:0xFFFFFF,
            shininess: 600,
            texPath:"PNG_Full_Color.png"
        };
        mergeObject(params,options);

        var loader = new THREE.JSONLoader();
        loader.load(params.meshPath, function(geometry) {

            var texture = THREE.ImageUtils.loadTexture( params.texPath , THREE.UVMapping , function(){
                //texture.repeat.set( 4, 4 );
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                // DEFINING MATERIAL
                var material = new THREE.MeshPhongMaterial({ 
                    color: params.color,
                    shininess: params.shininess, 
                    side : THREE.DoubleSide
                });

                // USING TEXTURE AS CANVAS
                var cdim = 2048;
                var canvas = document.createElement('canvas');
                canvas.width = canvas.height = cdim;
                var compositeTexture = new THREE.Texture(canvas);
                compositeTexture.wrapS = compositeTexture.wrapT = THREE.RepeatWrapping;

                function rebuildTexture(){
                    var ctx = canvas.getContext('2d');

                    // ADDING COLOR
                    ctx.globalCompositeOperation = 'source-over';
                    var fcolor = objColor;
                    ctx.fillStyle = fcolor;
                    ctx.fillRect(0,0,cdim,cdim);

                    //RANDOM TEXTURE
                    // if(geturlparam(3)){
                    //     for(var i=0;i<30;i++){
                    //         var rdim = parseInt((360 * Math.random())+10);
                    //         ctx.fillStyle = picklet.randomColor();
                    //         if(irnd(10)>5)
                    //              ctx.fillRect(irnd(cdim),irnd(cdim),rdim,rdim);
                    //         else{
                    //             ctx.beginPath();
                    //             ctx.arc(irnd(cdim),irnd(cdim),rdim,rdim,2*Math.PI);
                    //             ctx.fill();
                    //         }

                    //     }
                    // }

                    //ADDING IMAGE
                    // ctx.globalCompositeOperation = "normal"; //source-in";//'multiply';//
                    // ctx.drawImage(texture.image,0,0);

                    //ADDING TEXTURE IMAGE WITH DISTANCE
                    var img = texture.image;
                    if(userPastedImage)
                        img = userPastedImage;
                    var iwid  = img.width;
                    var ihite  = img.height;
                    var max = Math.max(iwid,ihite);
                    var scl = (cdim/max)*0.38;
                    iwid*=scl;
                    ihite*=scl;
                    ctx.drawImage(img,(cdim*0.25)-(iwid*0.5),(cdim*0.5)-(ihite*0.5),iwid,ihite);
                    ctx.drawImage(img,(cdim*0.75)-(iwid*0.5),(cdim*0.5)-(ihite*0.5),iwid,ihite);
                    
                    //ADDING TEXT
                    // if(geturlparam(4)){
                    //     ctx.font="80px Georgia";
                    //     ctx.textAlign = 'center';
                    //     ctx.fillStyle = picklet.randomSolidColor();//
                    //     ctx.fillText(geturlparam(4,"Lorem Ipsum:"+irnd(33)),1500,1450);
                    // }

                    //MAPPING TEXTURE WITH MATERIAL
                    compositeTexture.needsUpdate = true;
                    material.map = compositeTexture; //texture;
                    material.needsUpdate = true;	
                }

                rebuildTexture();

                function rebuildTask(){
                    if(geturlparam(5)!='auto')return;
                    setTimeout(function(){ 
                        rebuildTexture();
                        rebuildTask();
                    }, 2000);
                }

                //rebuildTask();
                var mesh = new THREE.Mesh(geometry,material);
                mesh.rebuildTexture = rebuildTexture;
                animMesh = mesh;
                scene.add(mesh);
            });
        });
    }

    var lerpyness = 0.1;

    var animRequestID;

    function renderFrame(){
        animRequestID = window.requestAnimationFrame(renderFrame);
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize( width,height );
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
        camera.position.lerp(userZoom,lerpyness);

        if(animMesh){
            animMesh.rotation.x=lerp(animMesh.rotation.x,userRotation.x,lerpyness);
            animMesh.rotation.y=lerp(animMesh.rotation.y,userRotation.y,lerpyness);
        }
        renderer.render( scene, camera );
    }

    addEventListeners();

    octx.initApp = function initApp(){
        initGraph();
        var meshPath = geturlparam(0,'mug.json');
        var shininess = geturlparam(1,3000);
        loadObject({meshPath:meshPath,shininess:shininess});
        renderFrame();
    }
    return octx;
}();

window.onload = function() {
    objectVisualizer.initApp();
};