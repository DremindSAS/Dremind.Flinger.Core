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
        script.src = 'https://cdn.rawgit.com/niklasvh/html2canvas/0.5.0-alpha1/dist/html2canvas.min.js';
        head.appendChild(script);
    }

    var injecthtml2canvasSVGLibrary = function () {
        var head = document.getElementsByTagName('head')[0];
        var script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.onload = html2canvasLibrary_loaded;
        script2.src = 'https://cdn.rawgit.com/niklasvh/html2canvas/0.5.0-alpha1/dist/html2canvas.svg.min.js';
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
        takeScreenshot();
    }

    var takeScreenshot = function () {
        html2canvas(document.body).then(function (canvas) {
            document.getElementById('screenshot-result').appendChild(canvas);

            if (_isOnDescoveryMode == true) {
                saveScreenshot();
            }
        });
    }

    var saveScreenshot = function () {
        if (_isOnDescoveryMode) {
            var endpoint = '/api/Site/AddImage';
            var canvas = document.querySelector('#screenshot-result>canvas');
            var params = { Base64Data: canvas.toDataURL(), Endpoint: document.location.pathname, ApiKey: Cross.GetApiKey() };

            var req;
            if (XMLHttpRequest) {
                req = new XMLHttpRequest();

                if ('withCredentials' in req) {
                    req.open("POST", Cross.GetServerUri() + endpoint, true);
                    req.withCredentials = true;
                    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    req.send(JSON.stringify(params));
                }
            } else if (XDomainRequest) {
                req = new XDomainRequest();
                req.open("POST", Cross.GetServerUri() + endpoint);
                
                req.send(JSON.stringify(params));
            } else {
                errback(new Error('CORS not supported'));
            }

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