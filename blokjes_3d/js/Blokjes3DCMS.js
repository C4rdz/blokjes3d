class Blokjes3DCMS {
    constructor(options)
	{
		this.JSON_DATA =    {
			id:0,
			exercisetitle: "new exercise",
			language: "nl_NL",
			Application:"blokjes_3d",
			main_object:
			{
				title: "new exercise",
                language: "nl_NL",
                exercises: [{

                }]
			}
		};
        this.SOME = new RegExp(/[A-Za-zÀ-ÿ]/g);
		this.SOUND_FILES;
    	this.IMG_FILES;
    	this.JSON_DATA;
    	this.ID = this.getUrlParameter('id');
		this.LANGUAGE;
        this.TITLE;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector3();
        this.intersects;

        this.exercises = this.JSON_DATA.main_object.exercises;
        options = options || false;
        this.id = parseInt(this.getUrlParameter('id'));
        this.canvas_model = document.getElementsByTagName('canvas');
        this.bounds;
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
        this.blockpos = []
        this.blockposstringify;
        this.pointLight;
        this.blockaantal;
        this.MAX_EXERCISES = 5;
        this.blockteller = -1;
        this.options = {
            sceneWidth: 400,
            sceneHeight: 300,
            viewAngle: 45,
            aspect: (this.sceneWidth / this.sceneHeight),
            near: 0.1,
            far: 100000,
            container: '.col-md-11'
        };
        

        if (options) {
            this.setOptions(options);
        }
        this.coords = [];

        this.activeObject = {};


    	if (this.ID !== 'new')
    	{
            this.readJSONData();
        }
        else {
            this.init();
        }
    }

	getFileArray()
	{
		let s = this;
		var request = {language: s.LANGUAGE};
		$.ajax(
		{
		    url: "https://test.diglin.eu/api/media/fileList",
		    type: "post",
		    async: true,
		    data: request,
		    dataType: 'json'
		}).done(function(response)
	    {
	        s.SOUND_FILES = response.audio.files;
	        s.IMG_FILES = response.image.files;
	    }).fail(function(jqXHR, textStatus, errorThrown)
	    {
	        //console.log(jqXHR);
    		//console.log(textStatus);
    		//console.log(errorThrown);
	    });
	}

	getLanguageSelector()
	{
		var s = this;
		$.ajax({
	        url: "https://test.diglin.eu/api/languages/unique",
	        type: "post",
	        async: true,
	        dataType: 'json'
	    }).done(function(response)
	    {
	        var selector = $('#languageSelector');
	        $.each(response,function()
	        {
	            var option = (this.isoCode === s.LANGUAGE) ? $('<option selected></option>').val(this.isoCode).html(this.fullname) : $('<option></option>').val(this.isoCode).html(this.fullname);
	            $(selector).append(option);
	        });

	        $(selector).selectpicker();
	    }).fail(function(jqXHR,textStatus,errorThrown)
	    {
	        //console.log(jqXHR);
	        //console.log(textStatus);
	        //console.log(errorThrown);
	    });
	}

	getUrlParameter(sParam)
	{
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++)
        {
            sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] === sParam)
            {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    }

	readJSONData()
	{
		let s = this;
		
		var host = window.location.href.split('\/');
	    var foundID = host.indexOf('applications');
	    var app = '';
	    if(foundID > -1)
	    {
	        app = host[foundID + 1];
	    }

	    var appData = getAppData();

		$.post(setJsonApiUrl() + '/api/appexercise/get/' + appData.id, {
	        _: new Date().getTime(),
	        'id': appData.id,
	        'application': appData.app
	    }).done(function(response)
		{
            s.JSON_DATA = response.main_object;
            s.LANGUAGE = response.language;
            s.TITLE = response.exercisetitle;
            s.blockpos =  JSON.parse(response.main_object.exercise);
            $('title').html('CMS ' + s.TITLE);
            $('#title').val(s.TITLE);
            $('#tHead').html(s.TITLE);
            s.getLanguageSelector();
            s.getFileArray();
            s.ready();
            s.initedit();
        }).fail(
        	function(jqXHR,textStatus,errorThrown)
        	{	
        		//console.log(jqXHR);
        		//console.log(textStatus);
        		//console.log(errorThrown);
        	}
        );
	}

	init()
	{
        let s = this;
        s.LANGUAGE = s.JSON_DATA.language;
        s.TITLE = s.JSON_DATA.exercisetitle;
        $('title').html('CMS ' + s.TITLE);
        $('#tHead').html(s.TITLE);
        s.getLanguageSelector();
        s.getFileArray();
        s.ready();
        if (WEBGL.isWebGLAvailable() === false) {
            $('body').append(WEBGL.getWebGLErrorMessage());
        }

        
        
        s.setRenderer();
        s.setCamera();
        s.setAspect();
        s.setScene();
        s.raycaster.setFromCamera(s.mouse, s.getCamera() );

        s.box = s.getBox();
        s.pointLight = s.getPointLight();
        s.setLight();
        s.setFloor();
        s.getFloor();
        s.addObjectToScene(s.box);
        s.addObjectToScene(s.pointLight);
        s.setAnimate();
        s.drawScene();
        s.setActiveObject(s.box);
        s.grid();
        s.iconx();
        s.iconx2();
        s.iconz();
        s.iconz2();
        s.getBoxPosition()
        document.getElementsByTagName('canvas')[0].addEventListener( 'scroll', s.animate );
        $(".body").append(s.blocks);
        $('.panel-body').append(s.getMovementControls());
        s.canvas_model[0].addEventListener( 'mousedown', function(event){s.onMouseDown(event);} , false);    
    }

    initedit()
	{
        let s = this;
        s.LANGUAGE = s.JSON_DATA.language;
        s.TITLE = s.JSON_DATA.exercisetitle;
        $('title').html('CMS ' + s.TITLE);
        $('#tHead').html(s.TITLE);
        s.getLanguageSelector();
        s.getFileArray();
        if (WEBGL.isWebGLAvailable() === false) {
            $('body').append(WEBGL.getWebGLErrorMessage());
        }

        

        s.setRenderer();
        s.setCamera();
        s.setAspect();
        s.setScene();
        s.addblockedit();
        s.box = s.getBoxEdit();
        s.pointLight = s.getPointLight();
        s.setLight();
        s.floor();
        s.addObjectToScene(s.box);
        s.addObjectToScene(s.pointLight);
        s.setAnimate();
        s.drawScene();
        s.setActiveObject(s.box);
        s.grid();
        s.iconx();
        s.iconx2();
        s.iconz();
        s.iconz2();

        // s.getBoxPosition()
        document.getElementsByTagName('canvas')[0].addEventListener( 'scroll', s.animate );
        $(".body").append(s.blocks);
        $('.panel-body').append(s.getMovementControls());
    
    }

	ready()
	{
		var s = this;
		s.eventFunctions();
	}

	deleteFromArray(ar,id)
	{
		var ar2 = [];
		for(var i = 0; i < ar.length; i++)
		{
			if(i !== id)
			{
				ar2.push(ar[i]);
			}
		}

		return ar2;
	}

	eventFunctions()
	{
		let s = this;

		$(document).on('click','#addInput',function()
		{

        });

		$(document).on('change', '#languageSelector', function ()
		{
		    s.JSON_DATA = {
				"id": s.ID,
  				"exercisetitle": s.TITLE,
  				"language": $(this).val(),
  				"Application": "blokjes_3d",
  				"main_object": {
  					"title": "",
    				"language": $(this).val(),
  				}
		    };
		    s.LANGUAGE = s.JSON_DATA.language;
	        s.TITLE = s.JSON_DATA.exercisetitle;
            s.getFileArray();
            s.WORDS = [''];
            s.getSounds(s.LANGUAGE);
            s.setWords(); 
		});

		$(document).on('click','#btn_save',function()
		{
            s.blockposstringify = JSON.stringify(s.blockpos)
			var etitle = (s.SOME.test($('#title').val())) ? $('#title').val() : s.TITLE;
			var JSON_DATA = 
			{
				id: s.ID,
				title: etitle,
				language: s.LANGUAGE,
				application: "blokjes_3d",
				main_object:
				{
					title: etitle,
                    language: s.LANGUAGE,
                    exercise: s.blockposstringify 
				}
			};
		
			s.sendData(JSON_DATA);
		});
    }
    

	id(t)
	{
		var ar = $(t).attr('id').split('_');
		var ar2 = [];
		for(let i = 1; i < ar.length; i++)
		{
			ar2.push(parseInt(ar[i]));
		}
		if(ar2.length < 2)
		{
			return ar2[0];
		}
		else
		{
			return ar2;
		}
	}

	mymax(a)
	{
	    var m = -Infinity, i = 0, n = a.length;

	    for (; i != n; ++i)
	    {
	        if (a[i] > m)
	        {
	            m = a[i];
	        }
	    }

	    return m;
	}

	sendData(exObject)
	{
        let s = this;
		let editUrl = '/admin/appexercise/edit';

        $.ajax({
            url: editUrl,
            type: 'post',
            data: {'data': exObject},
            dataType: 'json'
        }).done(function (response)
        {

            window.location.href = './';
        }).fail(function (jqXHR, textStatus, errorThrown)
        {
            //console.log(jqXHR);
            //console.log(textStatus);
            //console.log(errorThrown);
        });
    }
    myUp(){
		
		let self = this;
			self.getControls().update();
			self.drawScene();
    }
    
    
    setActiveObject(cObject) {
        let self = this;
        if (self.blocks.length === 1) {
            self.activeObject = cObject;
            self.activeObject.material.emissive.setHex( 0xffa500 );
        } else {
            self.activeObject.material.emissive.setHex( 0xEE0000 );
            self.activeObject = cObject;
            self.activeObject.material.emissive.setHex( 0xffa500 );    
        }
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
        let self = this;
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

    getBoxEdit(){        
        let self = this;
        self.id = ( self.id + 1)
        let geometry = new THREE.BoxGeometry(45, 48, 45);
        let material = new THREE.MeshPhongMaterial({color: 0xEE0000});
        let box = new THREE.Mesh(geometry, material);
        box.castShadow = true;
        box.position.set(25, 0, -25);
        box.name = (self.id);
        
        if (self.blocks.length === 0) {
            console.log(self.blockteller);
            box.position.set(self.blockpos[self.blockteller].x , self.blockpos[self.blockteller].y , self.blockpos[self.blockteller].z);
        }
        else {
            console.log("begin test " + self.blockteller);
            console.log(self.blocks);
            box.position.set(self.blockpos[self.blockteller].x , self.blockpos[self.blockteller].y , self.blockpos[self.blockteller].z);
        }
        self.blocks.push(box);
        return box;
    }

    getBoxPosition() {
        let self = this;
        self.blockpos.push(self.activeObject.position);
        return;
    }


    getPointLight() {

        let pointLight = new THREE.PointLight(0xFFFFFF);
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
                    self.getBoxPosition()
                    console.log(self.mouse.x);
                }
                else {
                    cObject = self.getBox();
                    self.setActiveObject(self.blocks[self.id]);
                    self.getBoxPosition()
                    console.log(self.mouse);
                }
                self.addObjectToScene(cObject);
                self.drawScene();
            }
        }).html('<i class="fa fa-' + btnText + ' fa-fw"></i>');
        return btn;
    }

    addblockedit(){
        let s  = this;
        s.blockteller = (s.blockteller + 1);
        s.blockaantal = (s.blockpos.length - 1);
        let cObject = {};
        if (s.blockteller == s.blockaantal ) {
            console.log(s.blockpos);
            console.log(s.blockpos.length);
            console.log("blockaantal = " + s.blockaantal);
        } else {
        cObject = s.getBoxEdit();
        s.setActiveObject(s.blocks[s.blockteller]);
        // s.getBoxPosition()
        s.addObjectToScene(cObject);
        s.drawScene();
        s.addblockedit();
        }
        
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
                console.log(self.blocks)
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

    getFloor(){
        let s = this;
        return s.floor
    }

    setFloor(){
    let self = this;   
    let geometry = new THREE.BoxGeometry(500, 1, 500);
    let material = new THREE.MeshPhongMaterial({color: 0x000000});
    self.floor = new THREE.Mesh(geometry, material);
    self.floor.castShadow = true;
    self.floor.name = "floor";
    self.floor.position.set(0, -1, 0);
    self.scene.add(self.floor);
    }

    grid(){
        let self = this
        let size = 500;
        let divisions = 10;
        let gridHelper = new THREE.GridHelper(size, divisions);
        gridHelper.name = "grid";
        self.scene.add(gridHelper);
    }

    iconx(){
    let self = this;
   let texture = new THREE.TextureLoader().load('img/Xass.png');
   let geometry = new THREE.BoxBufferGeometry(500, 1, 138);
   let material = new THREE.MeshBasicMaterial({map: texture});
   let mesh = new THREE.Mesh(geometry, material);
   mesh.position.set(0, -2, 300);
   mesh.name = "xass";
   self.scene.add(mesh);
    }
    iconx2(){
    let self = this;
   let texture = new THREE.TextureLoader().load('img/Xass2.png');
   let geometry = new THREE.BoxBufferGeometry(500, 1, 138);
   let material = new THREE.MeshBasicMaterial({map: texture});
   let mesh = new THREE.Mesh(geometry, material);
   mesh.position.set(0, -2, -300);
   mesh.name = "xass2";
   self.scene.add(mesh);
    }
    iconz(){
    let self = this;
   let texture = new THREE.TextureLoader().load('img/Zass.png');
   let geometry = new THREE.BoxBufferGeometry(138, 1, 500);
   let material = new THREE.MeshBasicMaterial({map: texture});
   let mesh = new THREE.Mesh(geometry, material);
   mesh.position.set(300, -2, 0);
   mesh.name = "Zass";
   self.scene.add(mesh);
    }
    iconz2(){
    let self = this;
   let texture = new THREE.TextureLoader().load('img/Zass2.png');
   let geometry = new THREE.BoxBufferGeometry(138, 1, 500);
   let material = new THREE.MeshBasicMaterial({map: texture});
   let mesh = new THREE.Mesh(geometry, material);
   mesh.position.set(-300, -2, 0);
   mesh.name = "Zass2";
   self.scene.add(mesh);
    }

    onMouseDown(event) {
        let s = this;
        s.bounds = s.canvas_model[0].getBoundingClientRect()
        s.mouse.x = ( (event.clientX - s.bounds.left) / s.canvas_model[0].clientWidth ) * 2 - 1;
        s.mouse.y = - ( (event.clientY - s.bounds.top) / s.canvas_model[0].clientHeight ) * 2 + 1;
        s.intersects = s.raycaster.intersectObjects(s.scene.children, true);

        for ( var i = 0; i < s.intersects.length; i++){
            console.log(s.blocks)
            // s.intersects[ i ].object.material.color.set( 0xff0000 );
            console.log(s.intersects)
            // console.log(s.mouse.x);
            // console.log(s.mouse.y);

        } 
        if (s.intersects.length == 0){
            console.log(s.intersects)
            console.log(s.mouse.x)
            console.log(s.mouse.y)
        }
    }
}