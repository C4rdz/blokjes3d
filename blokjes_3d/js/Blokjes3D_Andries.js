/*
 * FC-Sprint2 project => Blokjes3D.js
 *
 * The project "diglin.eu" is property of FC-Sprint2
 *
 * Created at:
 * 20-dec-2018 @ 10:25:41
 *
 * Created by:
 * Andries van Weeren
 * a.weeren@fcroc.nl
 */

class Blokjes3D {

    constructor(options) {
        options = options || false;
        this.id = parseInt(this.getUrlParameter('id'));
        this.scene;
        this.renderer;
        this.camera;
        this.ground;
        this.blocks = [];

        this.options = {
            sceneWidth: 400,
            sceneHeight: 300,
            viewAngle: 45,
            aspect: (this.sceneWidth / this.sceneHeight),
            near: 0.1,
            far: 100000,
            container: '.container'
        };

        if (options) {
            this.setOptions(options);
        }

        this.activeObject = {};

        this.init();
    }

    init() {

        let self = this;

        if (WEBGL.isWebGLAvailable() === false) {
            $('body').append(WEBGL.getWebGLErrorMessage());
            //document.body.appendChild(WEBGL.getWebGLErrorMessage());
        }

        self.setCamera();
        self.setRenderer();
        self.setAspect();
        self.setScene();
        self.drawScene();

        let sphere = self.getSphere();
        let pointLight = self.getPointLight();

        self.addObjectToScene(sphere);
        self.addObjectToScene(pointLight);
        self.drawScene();
        self.setActiveObject(sphere);
        //self.animate(sphere);

        $('body').prepend(self.getMovementControls());
    }

    setActiveObject(cObject) {
        let self = this;
        self.activeObject = cObject;
    }

    getActiveObject() {
        let self = this;
        return self.activeObject;
    }

    animate(cObject) {
        let self = this;

        setTimeout(function () {
            cObject.translateX(50);
            cObject.translateY(50);
            cObject.translateZ(-150);
            self.drawScene();
            self.animate(cObject);
        }, 1000)
    }

    drawScene() {
        let self = this;
        // Draw!
        self.getRenderer().render(self.getScene(), self.getCamera());
    }

    update() {
        // Draw!
        let self = this;
        self.getRenderer().render(self.getScene(), self.getCamera());

        // Schedule the next frame.
        requestAnimationFrame(self.update());
    }

    getCamera() {
        let self = this;
        return self.camera;
    }

    addObjectToScene(cObject) {

        let self = this;

        self.getScene().add(cObject);
    }

    getScene() {
        let self = this;
        return self.scene;
    }

    getSphere() {

        let self = this;
        // Set up the sphere vars
        let RADIUS = 50;
        let SEGMENTS = 16;
        let RINGS = 16;

        let sphereMaterial =
                new THREE.MeshLambertMaterial(
                        {
                            color: 0xFFFFFF
                        });
        let sphere = new THREE.Mesh(
                new THREE.SphereGeometry(
                        RADIUS,
                        SEGMENTS,
                        RINGS),
                sphereMaterial);

// Move the Sphere back in Z so we
// can see it.
        sphere.position.z = -1100;

// Finally, add the sphere to the scene.

        return sphere;

    }

    getPointLight() {

        let pointLight =
                new THREE.PointLight(0xFFFFFF);

// set its position
        pointLight.position.x = 10;
        pointLight.position.y = -50;
        pointLight.position.z = 230;

        return pointLight;
    }

    getRenderer() {

        let self = this;
        return self.renderer;
    }

    getWidth() {

        let self = this;
        return self.options.sceneWidth;
    }

    getHeight() {

        let self = this;
        return self.options.sceneHeight;
    }

    getContainer() {

        let self = this;
        return $(self.options.container);
    }

    setOptions(options) {

        let self = this;

        $.each(options, function (key, opValue) {

            self.options[key] = opValue;
        });

        self.setAspect();
    }

    setAspect() {
        let self = this;
        self.options.aspect = self.options.sceneWidth / self.options.sceneHeight;
    }

    setRenderer() {
        let self = this;
        self.renderer = new THREE.WebGLRenderer();
    }

    setCamera() {
        let self = this;
        self.camera = new THREE.PerspectiveCamera(
                self.viewAngle,
                self.aspect,
                self.near,
                self.far
                );
    }

    setScene() {
        let self = this;
        self.scene = new THREE.Scene();

        self.scene.add(self.camera);
        self.renderer.setSize(self.getWidth(), self.getHeight());
        self.getContainer().append(self.getRenderer().domElement);
    }

    getMovementControls() {
        let self = this;
        let axes = ['x', 'y', 'z'];
        let controls = $('<div>', {
            'class': 'col-md-3 col-lg-2'
        });

        $.map(axes, function (axis, i) {
            controls.append(self.getMovementControl(axis));
        });

        return controls;
    }

    getMovementControl(axis) {
        let self = this;
        let divContainer = $('<div>', {
            'class': 'col-md-12'
        });

        let btnGrp = $('<div>', {
            'class': 'btn-group'
        });

        let btnMinus = self.getMovementControlButton(axis, '-');

        let btnAxis = $('<a/>', {
            'class': 'btn btn-default'
        }).html('<strong>' + axis.toUpperCase() + '</strong>');

        let btnPlus = self.getMovementControlButton(axis, '+');

        btnGrp.append(btnMinus, btnAxis, btnPlus);
        divContainer.append(btnGrp);

        return divContainer;
    }

    getMovementControlButton(axis, direction) {
        let self = this;
        let btnColor = ((direction === '-') ? 'btn-danger' : 'btn-success');
        let btnText = ((direction === '-') ? 'minus' : 'plus');
        let movement = ((direction !== '-') ? 50 : -50);
        let btn = $('<a/>', {
            'class': 'btn ' + btnColor
        }).on('click', function () {

            if (axis === 'x') {
                self.getActiveObject().translateX(movement)
            }
            else if (axis === 'y') {
                self.getActiveObject().translateY(movement)
            }
            else {
                self.getActiveObject().translateZ(movement)
            }
            self.drawScene();

        }).html('<i class="fa fa-' + btnText + '"></i>');

        return btn;
    }

    appendBox() {

        let geometry = new THREE.BoxGeometry(50, 50, 50);
        let material = new THREE.MeshPhongMaterial({color: 0xEEF948});
        let box = new Physijs.BoxMesh(geometry, material, 0);
        box.castShadow = true;
        box.position.set(25, 25, -25);
        scene.add(box);
    }

    getUrlParameter(sParam) {
        let sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    }
}

//
//if (WEBGL.isWebGLAvailable() === false) {
//    document.body.appendChild(WEBGL.getWebGLErrorMessage());
//}
//
//Physijs.scripts.worker = 'js/physijs_worker.js';
//Physijs.scripts.ammo = 'ammo.js';
//let scene, camera, renderer, mesh, objects, ground = {}, gravity;
//init();
//animate();
//function init() {
//    //camera
//    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);
//    camera.position.set(250, 100, 0);
//    //scene
//    scene = new Physijs.Scene({fixedTimeStep: 1 / 60});
//    scene.setGravity(new THREE.Vector3(0, -50, 0));
//    scene.background = new THREE.Color(0xa0a0a0);
//    //light
//    let hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
//    hemiLight.position.set(0, 200, 0);
//    scene.add(hemiLight);
//    let directionalLight = new THREE.DirectionalLight(0xffffff);
//    directionalLight.position.set(0, 200, 100);
//    directionalLight.castShadow = true;
//    directionalLight.shadow.camera.top = 180;
//    directionalLight.shadow.camera.bottom = -100;
//    directionalLight.shadow.camera.left = -120;
//    directionalLight.shadow.camera.right = 120;
//    scene.add(directionalLight);
//    objects = [];
//
//    //floor
//    ground.material = new THREE.MeshLambertMaterial({
//        color: 0x000000
//    });
//    ground.material = Physijs.createMaterial(ground.material, 1.0, 1.0);
//    ground.geometry = new THREE.CubeGeometry(500, -1, 500);
//    ground.mesh = new Physijs.BoxMesh(ground.geometry, ground.material, 0);
//    ground.mesh.receiveShadow = true;
//    scene.add(ground.mesh);
//
//    let texture = new THREE.TextureLoader().load('img/Xass.png');
//    let geometry = new THREE.BoxBufferGeometry(500, 1, 138);
//    let material = new THREE.MeshBasicMaterial({map: texture});
//    mesh = new THREE.Mesh(geometry, material);
//    mesh.position.set(0, -2, 300);
//    scene.add(mesh);
//
//    let texture = new THREE.TextureLoader().load('img/Xass2.png');
//    let geometry = new THREE.BoxBufferGeometry(500, 1, 138);
//    let material = new THREE.MeshBasicMaterial({map: texture});
//    mesh = new THREE.Mesh(geometry, material);
//    mesh.position.set(0, -2, -300);
//    scene.add(mesh);
//
//    let texture = new THREE.TextureLoader().load('img/Zass.png');
//    let geometry = new THREE.BoxBufferGeometry(138, 1, 500);
//    let material = new THREE.MeshBasicMaterial({map: texture});
//    mesh = new THREE.Mesh(geometry, material);
//    mesh.position.set(300, -2, 0);
//    scene.add(mesh);
//
//    let texture = new THREE.TextureLoader().load('img/Zass2.png');
//    let geometry = new THREE.BoxBufferGeometry(138, 1, 500);
//    let material = new THREE.MeshBasicMaterial({map: texture});
//    mesh = new THREE.Mesh(geometry, material);
//    mesh.position.set(-300, -2, 0);
//    scene.add(mesh);
//
//    //grid
//    let size = 500;
//    let divisions = 10;
//    let gridHelper = new THREE.GridHelper(size, divisions);
//    scene.add(gridHelper);
//
//
//
//
//
//
//    //starter block
//
//    let geometry = new THREE.BoxGeometry(50, 50, 50);
//    let material = new THREE.MeshPhongMaterial({color: 0xEEF948});
//    box = new Physijs.BoxMesh(geometry, material, 0);
//    box.castShadow = true;
//    box.position.set(25, 25, -25);
//    scene.add(box);
//
//
//    //get buttons
//
//    document.getElementById("toevoegen").onclick = function () {
//        toevoegen()
//    };
//    document.getElementById("Xadd").onclick = function () {
//        add('x')
//    };
//    document.getElementById("Xremove").onclick = function () {
//        remove('x', 50)
//    };
//    document.getElementById("Yadd").onclick = function () {
//        add('y', 50)
//    };
//    document.getElementById("Yremove").onclick = function () {
//        remove('y', 50)
//    };
//    document.getElementById("Zadd").onclick = function () {
//        add('z', 50)
//    };
//    document.getElementById("Zremove").onclick = function () {
//        remove('z', 50)
//    };
//    document.getElementById("verwijderen").onclick = function () {
//        verwijderen()
//    };
//
//
//    //movement blocks
//
//    function add(axis, speed) {
//        //YU NO WORK?!
//
//        if (axis === 'x') {
//            let posx = box.position.x;
//            let posy = box.position.y;
//            let posz = box.position.z;
//            let checkposx = box.position.x;
//            if (posx > 175)
//                return;
//            console.log(posx);
//            box.translateX(50);
//            let newposx = box.position.x;
//            console.log(newposx);
//            console.log(" ")
//
//        }
//        else if (axis === "y") {
//            let posx = box.position.x;
//            let posy = box.position.y;
//            let posz = box.position.z;
//            let newposy = posy + speed;
//            scene.remove(box);
//            let geometry = new THREE.BoxGeometry(50, 50, 50);
//            let material = new THREE.MeshPhongMaterial({color: 0xEEF948});
//            box = new Physijs.BoxMesh(geometry, material, 0);
//            box.castShadow = true;
//            box.position.set(posx, newposy, posz);
//            scene.add(box);
//        }
//        else if (axis === "z") {
//            let posx = box.position.x;
//            let posy = box.position.y;
//            let posz = box.position.z;
//            let newposz = posz + speed;
//            if (posz > 175)
//                return;
//            scene.remove(box);
//            let geometry = new THREE.BoxGeometry(50, 50, 50);
//            let material = new THREE.MeshPhongMaterial({color: 0xEEF948});
//            box = new Physijs.BoxMesh(geometry, material, 0);
//            box.castShadow = true;
//            box.position.set(posx, posy, newposz);
//            scene.add(box);
//        }
//    }
//
//    function remove(axis, speed) {
//        if (axis === 'x') {
//            let posx = box.position.x;
//            let posy = box.position.y;
//            let posz = box.position.z;
//            let newposx = posx - speed;
//            if (posx < -175)
//                return;
//            scene.remove(box);
//            let geometry = new THREE.BoxGeometry(50, 50, 50);
//            let material = new THREE.MeshPhongMaterial({color: 0xEEF948});
//            box = new Physijs.BoxMesh(geometry, material, 0);
//            box.castShadow = true;
//            box.position.set(newposx, posy, posz);
//            scene.add(box);
//        }
//        else if (axis === "y") {
//            let posx = box.position.x;
//            let posy = box.position.y;
//            let posz = box.position.z;
//            let newposy = posy - speed;
//            if (posy == 25)
//                return;
//            scene.remove(box);
//            let geometry = new THREE.BoxGeometry(50, 50, 50);
//            let material = new THREE.MeshPhongMaterial({color: 0xEEF948});
//            box = new Physijs.BoxMesh(geometry, material, 0);
//            box.castShadow = true;
//            box.position.set(posx, newposy, posz);
//            scene.add(box);
//        }
//        else if (axis === "z") {
//            let posx = box.position.x;
//            let posy = box.position.y;
//            let posz = box.position.z;
//            let newposz = posz - speed;
//            if (posz < -175)
//                return;
//            scene.remove(box);
//            let geometry = new THREE.BoxGeometry(50, 50, 50);
//            let material = new THREE.MeshPhongMaterial({color: 0xEEF948});
//            box = new Physijs.BoxMesh(geometry, material, 0);
//            box.castShadow = true;
//            box.position.set(posx, posy, newposz);
//            scene.add(box);
//        }
//    }
//
//    //add new block
//    function toevoegen() {
//
//
//        let geometry = new THREE.BoxGeometry(50, 50, 50);
//        let material = new THREE.MeshPhongMaterial({color: 0xEEF948});
//        box = new Physijs.BoxMesh(geometry, material, 0);
//        box.castShadow = true;
//        box.position.set(-225, 25, -225);
//        scene.add(box);
//    }
//
//    function verwijderen() {
//        scene.remove(box);
//    }
//
//
//    //renderer
//    renderer = new THREE.WebGLRenderer({antialias: true});
//    renderer.setPixelRatio(window.devicePixelRatio);
//    renderer.setSize(window.innerWidth, window.innerHeight);
//    renderer.shadowMap.enabled = true;
//    document.body.appendChild(renderer.domElement);
//    //controlls
//    let controls = new THREE.OrbitControls(camera, renderer.domElement);
//    controls.target.set(0, 25, 0);
//    controls.enablePan = false;
//    controls.update();
//
//
//    //
//    window.addEventListener('resize', onWindowResize, false);
//}
//
//
////window size
//function onWindowResize() {
//    camera.aspect = window.innerWidth / window.innerHeight;
//    camera.updateProjectionMatrix();
//    renderer.setSize(window.innerWidth, window.innerHeight);
//}
////render frames
//function animate() {
//    box.__dirtyPosition = true;
//    scene.simulate();
//    renderer.render(scene, camera);
//    requestAnimationFrame(animate);
//
//}
////controlls for buttons
//let controls = new THREE.DragControls(objects, camera, renderer.domElement);