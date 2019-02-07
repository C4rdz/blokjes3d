<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
        <title></title>
        <link rel="icon" href="http://dk.fcsprint2.nl/favicon.ico?v=2">
        <link type="text/css" rel="stylesheet" href="../../assets/vendor/bootstrap/dist/css/bootstrap.min.css">
        <link type="text/css" rel="stylesheet" href="../../assets/vendor/font-awesome/css/font-awesome.min.css">
        <link type="text/css" rel='stylesheet' href='../../css/fonts.css'>
        <script type="text/javascript" src="../../assets/vendor/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="../../assets/vendor/bootstrap/dist/js/bootstrap.min.js"></script>

        <script type="text/javascript" src="../../assets/vendor/threejs/build/three.min.js"></script>
        <script type="text/javascript" src="../../assets/vendor/threejs/examples/js/controls/OrbitControls.js"></script>
        <script type="text/javascript" src="../../assets/vendor/threejs/examples/js/controls/DragControls.js"></script>
        <script type="text/javascript" src="../../assets/vendor/threejs/examples/js/libs/tween.min.js"></script>
        <script type="text/javascript" src="../../assets/vendor/threejs/examples/js/WebGL.js"></script>
        <script type="text/javascript" src="js/Blokjes3D.js"></script>
    </head>
    <body>
        <div class="container"><div id="blokken">
            </div>
        </div>
        <script>
            const app = new Blokjes3D({
                container: '.container',
                sceneWidth: 800,
                sceneHeight: 700
            });
        </script>
    </body>
</html>