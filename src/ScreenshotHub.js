var ScreenshotHub = (function () {
    /// Properties
    var _debug;
    var _isOnDescoveryMode;

    /// Initialize component
    var constructor = function (params) {
        if (params != undefined) {
            _debug = params.Debug;
        }
        injecthtml2canvasLibrary();
        getIfSiteIsInDiscoveryMode();
    }

    var injecthtml2canvasLibrary = function () {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = injecthtml2canvasSVGLibrary;
        script.src = '{KERNEL-URI}/build/assets/html2canvas.min.js';
        head.appendChild(script);
    }

    var injecthtml2canvasSVGLibrary = function () {
        var head = document.getElementsByTagName('head')[0];
        var script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.onload = html2canvasLibrary_loaded;
        script2.src = '{KERNEL-URI}/build/assets/html2canvas.svg.min.js';
        head.appendChild(script2);
    }

    var html2canvasLibrary_loaded = function () {
        var body = document.getElementsByTagName('body')[0];
        var div = document.createElement('div');
        div.id = 'screenshot-result';
        div.style.display = "none";

        if (_debug !== undefined) {
            if (_debug) {
                console.log('html2canvas Library is loaded succesfully');
                div.style.display = "block";

            }
        }
        body.appendChild(div);
        takeScreenshot(function () {
            if (_isOnDescoveryMode == true) {
                saveScreenshot();
            }
        });
    }

    var takeScreenshot = function (callback) {
        html2canvas(document.body).then(function (canvas) {
            var maxWidth = 850;
            var ratio = maxWidth / canvas.width;
            var height = canvas.height * ratio;
            var width = canvas.width * ratio

            var elm = document.querySelector('#screenshot-result');
            var element = new Image();
            //img.style.display = 'none';
            element.src = canvas.toDataURL();
            element.onload = function () {
                //context.drawImage(img, 0, 0);

                var _canvas = document.createElement("canvas");
                _canvas.width = width;
                _canvas.height = height;
                var ctx = _canvas.getContext("2d");
                ctx.scale(0.56, 0.56);
                ctx.drawImage(element, 0, 0);
                ctx.save();

                var base64 = _canvas.toDataURL('image/jpeg',1);
                document.querySelector(".img-responsive").setAttribute('src', base64);
                document.getElementById('screenshot-result').appendChild(_canvas);
            }

            /*ctx = canvas.getContext("2d");
            ctx.scale(0.5, 0.5);
            ctx.save();*/



            callback();
        });
    }

    var saveScreenshot = function () {
        if (_isOnDescoveryMode) {
            var canvas = document.querySelector('#screenshot-result>canvas');

            SocketHub.PushScreenshot({ Command: 'Scroll', Values: { Base64Data: canvas.toDataURL(), Endpoint: document.location.pathname, ApiKey: Cross.GetApiKey() } })
        }
    }

    var getIfSiteIsInDiscoveryMode = function () {
        var endpoint = '/api/Site/DiscoveryMode/' + Cross.GetApiKey();

        function reqListener() {
            _isOnDescoveryMode = JSON.parse(this.responseText).result == undefined ? false : JSON.parse(this.responseText).result;
        }

        var ajaxRequest = new XMLHttpRequest();
        ajaxRequest.addEventListener("load", reqListener);
        ajaxRequest.open("GET", Cross.GetServerUri() + endpoint);
        ajaxRequest.send();
    }

    return {
        Initialize: constructor,
        TakeScreenshot: takeScreenshot
    };
})();