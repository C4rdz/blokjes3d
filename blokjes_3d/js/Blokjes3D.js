class Blokjes3D {

    constructor(options) {
        options = options || false;
        
        this.id = parseInt(this.getUrlParameter('id'));
        this.scene;
        this.renderer;
        this.camera;
        this.ground;
        this.controls;
        this.blocks = [];
        this.light = [];
        this.animate;
        this.floor;
        this.box = [];
        this.id = -1;
        this.pointLight;

        this.options = {
            sceneWidth: 400,
            sceneHeight: 300,
            viewAngle: 45,
            aspect: (this.sceneWidth / this.sceneHeight),
            near: 0.1,
            far: 100000,
            container: '.col-md-8'
        };

        if (options) {
            this.setOptions(options);
        }
        this.coords = [];

        this.activeObject = {};

        this.init();
    }

    init() {

        let self = this;

        if (WEBGL.isWebGLAvailable() === false) {
            $('body').append(WEBGL.getWebGLErrorMessage());
        }

        

        self.setRenderer();
        self.setCamera();
        self.setAspect();
        self.setScene();

        self.box = self.getBox();
        self.pointLight = self.getPointLight();
        self.setLight();
        self.floor();
        self.addObjectToScene(self.box);
        self.addObjectToScene(self.pointLight);
        self.setAnimate();
        self.drawScene();
        self.setActiveObject(self.box);
        self.grid();
        self.iconx();
        self.iconx2();
        self.iconz();
        self.iconz2();
        document.getElementsByTagName('canvas')[0].addEventListener( 'scroll', self.animate );

        $(".body").append(self.blocks);
        $('.container').append(self.getMovementControls());
    }
    
    myUp(){
		
		let self = this;
			self.getControls().update();
			self.drawScene();
			
		
	}

    setActiveObject(cObject) {
        let self = this;
        self.activeObject = cObject;
    }

    getActiveObject() {
        let self = this;
        return self.activeObject;
    }
    
    setAnimate() {
		let self = this;
		self.animate = function(){
			requestAnimationFrame( self.animate );
			self.drawScene();
		}
		
		requestAnimationFrame( self.animate );
	}

    drawScene() {
        let self = this;
        self.getRenderer().render(self.getScene(), self.getCamera());
        
    }
    
    getControls(){
        let self = this;
        return self.controls;
    }
    
    getLight(){
        let self = this;
        return self.light;
    }

    setLight() {
        var self = this;
        self.hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        self.hemiLight.position.set(0, 200, 0);
        self.scene.add(self.hemiLight);
        self.directionalLight = new THREE.DirectionalLight(0xffffff);
        self.directionalLight.position.set(0, 200, 100);
        self.directionalLight.castShadow = true;
        self.directionalLight.shadow.camera.top = 180;
        self.directionalLight.shadow.camera.bottom = -100;
        self.directionalLight.shadow.camera.left = -120;
        self.directionalLight.shadow.camera.right = 120;
        self.scene.add(self.directionalLight);
        self.objects = [];
    }

    setControls(){
        var self = this;
        self.controls = new THREE.OrbitControls( self.getCamera(), self.getRenderer().domElement);
        self.controls.enableDamping = false;
        self.controls.target.set(0, 0, -10);
        self.controls.enablePan = false;
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

    getBox(coords) {
        coords = coords || {
            x: 25,
            y: 25,
            z: -25
        };
        let self = this;
        self.id = ( self.id + 1)
        let geometry = new THREE.BoxGeometry(45, 48, 45);
        let material = new THREE.MeshPhongMaterial({color: 0xEE0000});
        let box = new THREE.Mesh(geometry, material);
        box.castShadow = true;
        box.position.set(25, 0, -25);
        box.name = (self.id);
        
        if (self.blocks.length === 0) {
            box.position.set(coords.x, coords.y, coords.z);
        }
        else {
            let lastBlock = self.blocks[(self.blocks.length - 1)];
            box.position.x = (lastBlock.position.x + 50);
            box.position.y = (lastBlock.position.y + 0);
            box.position.z = (lastBlock.position.z - 50);
        }
        self.blocks.push(box);
        return box;
    }


    getPointLight() {

        let pointLight =
                new THREE.PointLight(0xFFFFFF);
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
        self.renderer = new THREE.WebGLRenderer({antialias: true});
        self.renderer.setPixelRatio(window.devicePixelRatio);
        self.renderer.setSize(window.innerWidth, window.innerHeight);
        self.renderer.shadowMap.enabled = true;
        document.body.appendChild(self.renderer.domElement);
    }

    setCamera() {
        let self = this;
        self.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1 , 1000);
		self.camera.position.set(250, 100, 0);
        self.setControls();
        self.getControls().update();
    }

    setScene() {
        let self = this;
        self.scene = new THREE.Scene();
        self.scene.background = new THREE.Color(0xa0a0a0);
        self.scene.add(self.camera);
        self.renderer.setSize(self.getWidth(), self.getHeight());
        self.getContainer().append(self.getRenderer().domElement);
    }

    getMovementControls() {
        let self = this;
        let axes = ['x', 'y', 'z'];
        let controls = $('<div>', {
            'class': 'col-md-2',
            'style': 'position: absolute'
        });
        $.map(axes, function (axis, i) {
            controls.append(self.getMovementControl(axis));
        });
        controls.append(self.getAddBlockControl());
        return controls;
    }

    getAddBlockControl() {
        let self = this;
        let divContainer = $('<div>', {
            'class': 'col-md-12'
        });
        let btnGrp = $('<div>', {
            'class': 'btn-group'
        });
        let btnMinus = self.getAddBlockButton('-');
        let btnAxis = $('<a/>', {
            'class': 'btn btn-default'
        }).html('<strong><i class="fa fa-cube fa-fw"></i></strong>');
        let btnPlus = self.getAddBlockButton('+');
        btnGrp.append(btnMinus, btnAxis, btnPlus);
        divContainer.append(btnGrp);
        return divContainer;
    }

    removeObjectFromScene(blockId) {
        let self = this;
        self.id = ( self.id - 1)
        let block = self.getScene().getObjectById(self.blocks[blockId].id, true);
        self.getScene().remove(block);
        self.blocks.splice(blockId, 1);
        self.setActiveObject(self.blocks[self.id]);
        self.drawScene();
    }

    getAddBlockButton(direction) {
        let self = this;
        let btnColor = ((direction === '-') ? 'btn-danger' : 'btn-success');
        let btnText = ((direction === '-') ? 'minus' : 'plus');
        let btn = $('<a/>', {
            'class': 'btn ' + btnColor
        }).on('click', function () {
            if (direction === '-') {
                self.removeObjectFromScene((self.blocks.length - 1));
            }
            else {
                let cObject = {};
                if ((self.blocks.length % 2) === 0) {
                    cObject = self.getBox();
                    self.setActiveObject(self.blocks[self.id]);
                }
                else {
                    cObject = self.getBox();
                    self.setActiveObject(self.blocks[self.id]);
                }
                self.addObjectToScene(cObject);
                self.drawScene();
            }
        }).html('<i class="fa fa-' + btnText + ' fa-fw"></i>');
        return btn;
    }

    getMovementControl(axis) {
        let self = this;
        let divContainer = $('<div>', {
            'class': 'col-md-12'
        }).css({'margin-bottom': '5px'});
        let btnGrp = $('<div>', {
            'class': 'btn-group'
        });
        let btnMinus = self.getMovementControlButton(axis, '-');
        let btnAxis = $('<a/>', {
            'class': 'btn btn-default'
        }).css({width: '44px'}).html('<strong style="width: 1.28em">' + axis.toUpperCase() + '</strong>');
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
                let posx = self.blocks[self.id].position.x;
                if (posx == -225){
                    self.getActiveObject().translateX(50);
                return;
                }
                if (posx == 225){
                    self.getActiveObject().translateX(-50);
                return;
                }
                self.getActiveObject().translateX(movement);
            }
            else if (axis === 'y') {
                let posy = self.blocks[self.id].position.y;
                if (posy == 25 ){
                    self.getActiveObject().translateY(50);
                return;
                }
                self.getActiveObject().translateY(movement)
            }
            else {
                let posz = self.blocks[self.id].position.z;
                if (posz == -225){
                    self.getActiveObject().translateZ(50);
                return;
                }
                if (posz == 225){
                    self.getActiveObject().translateZ(-50);
                return;
                }
                self.getActiveObject().translateZ(movement)
            }
            self.drawScene();
        }).html('<i class="fa fa-' + btnText + ' fa-fw"></i>');
        return btn;
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

    floor(){
    let self = this;   
    let geometry = new THREE.BoxGeometry(500, 1, 500);
    let material = new THREE.MeshPhongMaterial({color: 0x000000});
    self.floor = new THREE.Mesh(geometry, material);
    self.floor.castShadow = true;
    self.floor.position.set(0, -1, 0);
    self.scene.add(self.floor);
    }

    grid(){
        let self = this
        let size = 500;
        let divisions = 10;
        let gridHelper = new THREE.GridHelper(size, divisions);
        self.scene.add(gridHelper);
    }

    iconx(){
    let self = this;
   let texture = new THREE.TextureLoader().load('img/Xass.png');
   let geometry = new THREE.BoxBufferGeometry(500, 1, 138);
   let material = new THREE.MeshBasicMaterial({map: texture});
   let mesh = new THREE.Mesh(geometry, material);
   mesh.position.set(0, -2, 300);
   self.scene.add(mesh);
    }
    iconx2(){
    let self = this;
   let texture = new THREE.TextureLoader().load('img/Xass2.png');
   let geometry = new THREE.BoxBufferGeometry(500, 1, 138);
   let material = new THREE.MeshBasicMaterial({map: texture});
   let mesh = new THREE.Mesh(geometry, material);
   mesh.position.set(0, -2, -300);
   self.scene.add(mesh);
    }
    iconz(){
    let self = this;
   let texture = new THREE.TextureLoader().load('img/Zass.png');
   let geometry = new THREE.BoxBufferGeometry(138, 1, 500);
   let material = new THREE.MeshBasicMaterial({map: texture});
   let mesh = new THREE.Mesh(geometry, material);
   mesh.position.set(300, -2, 0);
   self.scene.add(mesh);
    }
    iconz2(){
    let self = this;
   let texture = new THREE.TextureLoader().load('img/Zass2.png');
   let geometry = new THREE.BoxBufferGeometry(138, 1, 500);
   let material = new THREE.MeshBasicMaterial({map: texture});
   let mesh = new THREE.Mesh(geometry, material);
   mesh.position.set(-300, -2, 0);
   self.scene.add(mesh);
    }
}