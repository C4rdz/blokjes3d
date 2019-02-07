<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <link type="text/css" rel="stylesheet" href="../../assets/vendor/font-awesome/css/font-awesome.min.css">
        <link type="text/css" rel="stylesheet" href="../../assets/vendor/bootstrap/dist/css/bootstrap.min.css">
        <link type="text/css" rel="stylesheet" href="../../assets/vendor/jquery-ui/themes/base/all.css">
        <link type="text/css" rel="stylesheet" href="../../assets/vendor/bootstrap-select/dist/css/bootstrap-select.min.css">
        <link type="text/css" rel="stylesheet" href="../../css/fonts.css">
        <link type="text/css" rel="stylesheet" href="css/stijl_cms.css">
        <script type='text/javascript' src="../../assets/vendor/jquery/dist/jquery.min.js"></script>
        <script type='text/javascript' src="../../assets/vendor/jquery-ui/jquery-ui.min.js"></script>
        <script type='text/javascript' src="../../assets/vendor/bootstrap/dist/js/bootstrap.min.js"></script>
        <script type='text/javascript' src="../../assets/vendor/bootstrap-select/dist/js/bootstrap-select.min.js"></script>
        <script type='text/javascript' src="../../assets/vendor/bootbox.js/bootbox.js"></script>
        <script type="text/javascript" src="../../js/generic/checker.js"></script>
        <script type='text/javascript' src="../../js/generic/app_js.js"></script>
        <script type="text/javascript" src="../../js/generic/nt2school.js"></script>
        <script type="text/javascript" src="../../js/generic/navigation.js"></script>
        <script type="text/javascript" src="../../assets/vendor/threejs/build/three.min.js"></script>
        <script type="text/javascript" src="../../assets/vendor/threejs/examples/js/controls/OrbitControls.js"></script>
        <script type="text/javascript" src="../../assets/vendor/threejs/examples/js/controls/DragControls.js"></script>
        <script type="text/javascript" src="../../assets/vendor/threejs/examples/js/libs/tween.min.js"></script>
        <script type="text/javascript" src="../../assets/vendor/threejs/examples/js/WebGL.js"></script>
        <script type="text/javascript" src="js/Blokjes3DCMS.js"></script>  
        <script type="text/javascript">
	        $(document).ready(function()
            {
	            var EX = new Blokjes3DCMS();
	        });
        </script>

    </head>

    <body>
        <div class="navigation">
            
        </div>
        <div class="container containerCustom">
            <div class="row">
                <div id="exercise" class="maxEx col-xs-12 col-sm-12 col-md-12">
                    
                    <div class="panel panel-primary">
                        <div class="panel-heading col-xs-12 col-sm-12 col-md-12">
                            <div class="col-xs-12 col-sm-10 col-md-10 text-left">
                                <h2 id="tHead"></h2>
                            </div>
                            <div class="col-md-2 col-sm-2 col-xs-2">
                                <h2>                                 
                                    <select class="form-control languageInputField" id="languageSelector" name="language" required></select>
                                </h2> 
                            </div>
                        </div>
                        <div class="panel-body">

                            <!-- <nav class="navbar" data-spy="affix" data-offset-top="197" style="margin-top: 10px;">
                                <div id="nav navbar-nav">
                                    titel opdracht: <input id="title" type="text" value="">
                                    <button id="btn_save">sla op</button>&nbsp;<button onclick="redirectToFront();">sla op en bekijk</button>
                            </nav> -->
                            
                            <nav class="navbar" data-spy="affix" data-offset-top="197">
                                <div id="nav navbar-nav">
                                    titel opdracht:<div class="input-group"><input class="form-control" id="title" placeholder="new exercise" type="text">
                                    <span class="input-group-btn"><button class="btn btn-primary" id="btn_save">sla op</button></span></div><!-- &nbsp;<button onclick="redirectToFront();">sla op en bekijk</button> -->
                                    
                                </div>
                            </nav>
                            
                            <div class="col-md-11">
                            
                            </div>
                            

                           
                        
                           <ul class="list-group" id="list">
                           </ul>
                           <a class="btn btn-primary" id="addInput"><i class="fa fa-plus" aria-hidden="true"></i></a>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <!-- <script>
            const app = new Blokjes3D({
            container: '.col-md-11',
            sceneWidth: 600,
            sceneHeight: 500
            });
        </script> -->

    </body>
</html>