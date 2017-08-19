/*! crawlersite.kernel - v2.0.1 - 2017-08-19 */
var Services = {};
Cross = function () {
    this._timeStamp;
    this._serverUri;
    this._coreUri;
    this._clientInformation;
    this._clientStrings = [
        { s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/ },
        { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
        { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
        { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
        { s: 'Windows Vista', r: /Windows NT 6.0/ },
        { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
        { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
        { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
        { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
        { s: 'Windows 98', r: /(Windows 98|Win98)/ },
        { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
        { s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
        { s: 'Windows CE', r: /Windows CE/ },
        { s: 'Windows 3.11', r: /Win16/ },
        { s: 'Android', r: /Android/ },
        { s: 'Open BSD', r: /OpenBSD/ },
        { s: 'Sun OS', r: /SunOS/ },
        { s: 'Linux', r: /(Linux|X11)/ },
        { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
        { s: 'Mac OS X', r: /Mac OS X/ },
        { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
        { s: 'QNX', r: /QNX/ },
        { s: 'UNIX', r: /UNIX/ },
        { s: 'BeOS', r: /BeOS/ },
        { s: 'OS/2', r: /OS\/2/ },
        { s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }
    ];
    this._clientLocation;
    this._apiKey;
    this._canUseHeatmaps;
    this._canUseRAT;
    this._canUseFunnels;
    this._canUseScreenRecorder;
    this._canUseFormAnalysis;
};

Cross.prototype = function () {
    var constructor = function (params) {
        if (params != undefined) {
            this._debug = params.Debug;
        }

        this._timeStamp = new Date();
        this._serverUri = "http://localhost:3500";
        this._coreUri = "http://localhost:3501";
        if (inIframe() == false) {
            setApiKey(this);
            defineatob();
            analyzeClient(this);
            setUseHeatmaps(this, null);
            setUseRAT(this, null);
            setUseFunnels(this, null);
            setUseScreenRecorder(this, null);
            setUseFormAnalysis(this, null);
            createStringToDOMPrototype();
            querySelectorPolyfill();
        }
    }

    var defineatob = function () {
        if (typeof window.atob == 'undefined') {
            function atob(a) {
                var b = "", e, c, h = "", f, g = "", d = 0;
                k = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                do e = k.indexOf(a.charAt(d++)), c = k.indexOf(a.charAt(d++)), f = k.indexOf(a.charAt(d++)), g = k.indexOf(a.charAt(d++)), e = e << 2 | c >> 4, c = (c & 15) << 4 | f >> 2, h = (f & 3) << 6 | g, b += String.fromCharCode(e), 64 != f && (b += String.fromCharCode(c)), 64 != g && (b += String.fromCharCode(h));
                while (d < a.length);
                return unescape(b)
            };
        }
    }

    var querySelectorPolyfill = function () {
        if (!document.querySelectorAll) {
            document.querySelectorAll = function (selectors) {
                var style = document.createElement('style'), elements = [], element;
                document.documentElement.firstChild.appendChild(style);
                document._qsa = [];

                style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
                window.scrollBy(0, 0);
                style.parentNode.removeChild(style);

                while (document._qsa.length) {
                    element = document._qsa.shift();
                    element.style.removeAttribute('x-qsa');
                    elements.push(element);
                }
                document._qsa = null;
                return elements;
            };
        }

        if (!document.querySelector) {
            document.querySelector = function (selectors) {
                var elements = document.querySelectorAll(selectors);
                return (elements.length) ? elements[0] : null;
            };
        }
    }

    var setApiKey = function (context) {
        context._flingerElement = document.querySelector('[data-flinger]');
        context._apiKey = context._flingerElement.dataset.flinger == undefined ? false : context._flingerElement.dataset.flinger;
    }

    var timeStamp = function () {
        return this._timeStamp.getTime();
    }

    var analyzeClient = function (context) {
        getLocalIP(function (localIp) {
            context._clientInformation.privateIP = localIp.result
        });
        var unknown = '-';

        // screen
        var screenSize = {};
        if (screen.width) {
            width = (screen.width) ? screen.width : '';
            height = (screen.height) ? screen.height : '';
            screenSize.width = width;
            screenSize.height = height;
        }

        // browser size
        var browserSize = {
            width: window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight
        };

        var documentSize = {
            height: Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight),
            width: Math.max(document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth)
        };

        // browser
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browser = navigator.appName;
        var version = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;

        // Opera
        if ((verOffset = nAgt.indexOf('Opera')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Opera Next
        if ((verOffset = nAgt.indexOf('OPR')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 4);
        }
        // Edge
        else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
            browser = 'Microsoft Edge';
            version = nAgt.substring(verOffset + 5);
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
            browser = 'Chrome';
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
            browser = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            browser = 'Firefox';
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf('Trident/') != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }
        // Other browsers
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() == browser.toUpperCase()) {
                browser = navigator.appName;
            }
        }
        // trim the version string
        if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

        majorVersion = parseInt('' + version, 10);
        if (isNaN(majorVersion)) {
            version = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }

        // mobile version
        var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

        // cookie
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;

        if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
            document.cookie = 'testcookie';
            cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
        }

        // system
        var os = unknown;

        for (var id in context._clientStrings) {
            var cs = context._clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        var osVersion = unknown;

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';
        }

        switch (os) {
            case 'Mac OS X':
                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'Android':
                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }

        // flash
        var hasFlash = false;
        try {
            hasFlash = Boolean(new ActiveXObject('ShockwaveFlash.ShockwaveFlash'));
        }
        catch (exception) {
            hasFlash = ('undefined' != typeof navigator.mimeTypes['application/x-shockwave-flash']);
        }

        var absoluteUri = window.location.href;
        var endpoint = document.location.pathname;
        var windowTitle = document.title;
        var referrer = document.referrer;
        var fingerprint = context.GenerateFingerPrint();
        var jquery = !window.jQuery ? undefined : {
            exist: (typeof $ == 'function' || typeof jQuery == 'function'),
            version: jQuery.fn.jquery
        }

        context._clientInformation = {
            screen: screenSize,
            browserSize: browserSize,
            documentSize: documentSize,
            browser: browser,
            browserVersion: version,
            browserMajorVersion: majorVersion,
            mobile: mobile,
            os: os,
            osVersion: osVersion,
            cookies: cookieEnabled,
            flash: hasFlash,
            fullUserAgent: navigator.userAgent,
            absoluteUri: absoluteUri,
            endpoint: endpoint,
            windowTitle: windowTitle,
            referrer: referrer,
            fingerprint: fingerprint,
            jquery: jquery,
            //privateIP: localIp.result
            //bootstrap: bootstrap,
        }
    }

    var setPersistanceData = function (key, rawData) {
        if (typeof (rawData)) {
            if (typeof (Storage) !== "undefined") {
                try {
                    rawData = JSON.stringify(rawData);
                    localStorage.setItem(`CS-${key}`, rawData);

                    return {
                        success: true,
                        message: `Data saved succesfuly in localstorage`,
                        result: null
                    }
                }
                catch (e) {
                    return {
                        success: false,
                        message: `Something was wrong while saving data in localstorage`,
                        result: null
                    }
                }
            }
            else {
                return {
                    success: false,
                    message: `Something was wrong while saving data in localstorage`,
                    result: null
                }
            }
        }
        else {
            return {
                success: false,
                message: 'Only can save objects in persistance data',
                result: null
            }
        }
    }

    var getPersistanceData = function (key) {
        if (typeof (Storage) !== "undefined") {
            try {
                var rawData = localStorage.getItem(`CS-${key}`);
                rawData = JSON.parse(rawData)

                return {
                    success: true,
                    message: `Data obtained succesfuly from localstorage`,
                    result: rawData
                }
            }
            catch (e) {
                return {
                    success: false,
                    message: `Something was wrong while retrieving data in localstorage`,
                    result: null
                }
            }
        }
        else {
            return {
                success: false,
                message: `Something was wrong while saving data in localstorage`,
                result: null
            }
        }
    }

    var watchGeolocation = function (isObligatory, next) {
        options = {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0
        };

        if ("geolocation" in navigator) {
            /* geolocation is available */
            var watchID = navigator.geolocation.watchPosition(function (position) {
                document.dispatchEvent(new CustomEvent('GeoLocation_Catched', {
                    detail: {
                        success: true,
                        message: 'Position succesfully',
                        result: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            localTime: new Date(),
                            toString: position.coords.latitude + ',' + position.coords.longitude
                        }
                    }
                }));
            },
                function (err) {
                    if (isObligatory) {
                        window.location.reload();
                    }
                    else {
                        if (err.code == 1) {
                            document.dispatchEvent(new CustomEvent('GeoLocation_Failed', {
                                detail: {
                                    success: false,
                                    message: 'User Deny location',
                                    result: null
                                }
                            }));
                        }
                    }
                }, options);
        }
        else {
            /* geolocation IS NOT available */
            document.dispatchEvent(new CustomEvent('GeoLocation_Failed', {
                detail: {
                    success: false,
                    message: 'User do not support location',
                    result: null
                }
            }));
        }
    }

    var getAccurateGeoLocation = function (next) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function success(position) {
                next({
                    success: true,
                    message: 'Position succesfully',
                    result: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        localTime: new Date(),
                        toString: position.coords.latitude + ',' + position.coords.longitude
                    }
                })
            },
                function error(err) {
                    next({
                        success: false,
                        message: msg,
                        result: err
                    })
                });
        }
        else {
            next({
                success: false,
                message: 'Geolocation is not supported for this Browser/OS version yet.',
                result: null
            });
        }
    }

    var getAproximateGeoLocation = function (next) {
        // To show a map with location:
        // el.innerHTML = '<a target="_blank" href="http://maps.google.com/maps/place/' + loc + '/@' + loc + ',10z/data=!3m1!1e3"><img src=https://maps.googleapis.com/maps/api/staticmap?zoom=10&size=700x400&maptype=roadmap&markers=color:red%7Clabel:C%7C' + loc + '&key=AIzaSyDWO8tV87DC4tCaHOLoADkL71G-jcyBdwk ></a><br><br>';
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            var el = document.getElementById("location");

            if (xhttp.readyState == 4 && xhttp.status == 200) {
                var geolocation = JSON.parse(xhttp.responseText).location;
                next({
                    success: true,
                    message: 'Location success',
                    result: {
                        latitude: geolocation.lat,
                        longitude: geolocation.lng,
                        localTime: new Date(),
                        toString: geolocation.lat + ',' + geolocation.lng
                    }
                });
            }
            if (xhttp.readyState == 4 && (xhttp.status == 403 || xhttp.status == 500)) {
                next({
                    success: false,
                    message: 'Failed to get location',
                    result: null
                })
            }
        };

        var keys = [
            'AIzaSyD4AHLVCU-zENHOpCPgr_oviqhYjsMKvNQ'
        ];

        var index = Math.round((keys.length - 1) * Math.random());
        var key = keys[index];
        console.log('used: ' + key)
        xhttp.open("POST", "https://www.googleapis.com/geolocation/v1/geolocate?key=" + key, true);
        xhttp.send();
    }

    var getLocalIP = function (next) {
        var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

        if (RTCPeerConnection) (function () {
            var rtc = new RTCPeerConnection({ iceServers: [] });
            if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
                rtc.createDataChannel('', { reliable: false });
            };

            rtc.onicecandidate = function (evt) {
                // convert the candidate to SDP so we can run it through our general parser
                // see https://twitter.com/lancestout/status/525796175425720320 for details
                if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);
            };
            rtc.createOffer(function (offerDesc) {
                grepSDP(offerDesc.sdp);
                rtc.setLocalDescription(offerDesc);
            }, function (e) { console.warn("offer failed", e); });


            var addrs = Object.create(null);
            addrs["0.0.0.0"] = false;
            function updateDisplay(newAddr) {
                if (newAddr in addrs) return;
                else addrs[newAddr] = true;
                var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
                if (displayAddrs.length > 0) {
                    ipv4 = '';
                    ipv6 = '';
                    var ip_regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                    var result = ip_regex.exec(displayAddrs[0]);
                    if (result == null) {
                        var tmp = displayAddrs[0];
                        displayAddrs[0] = displayAddrs[1];
                        displayAddrs[1] = tmp;
                    }

                    next({
                        success: true,
                        message: 'Ip getting successfuly',
                        result: {
                            IPv4: displayAddrs[0],
                            IPv6: displayAddrs[1]
                        }
                    });
                }
                else {
                    next({
                        success: false,
                        message: 'Something was wrong',
                        result: null
                    });
                }
            }

            function grepSDP(sdp) {
                var hosts = [];
                sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
                    if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
                        var parts = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
                            addr = parts[4],
                            type = parts[7];
                        if (type === 'host') updateDisplay(addr);
                    } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
                        var parts = line.split(' '),
                            addr = parts[2];
                        updateDisplay(addr);
                    }
                });
            }
        })();
        else {
            next({
                success: false,
                message: 'Something was wrong',
                result: null
            });
        }
    }

    var getScrollPosition = function () {
        return { X: window.pageXOffset, Y: window.pageYOffset }
    }

    var getServerUri = function () {
        return this._serverUri;
    }

    var getCoreUri = function () {
        return this._coreUri;
    }

    var getClientInformation = function () {
        return this._clientInformation;
    }

    var getApiKey = function () {
        return this._apiKey;
    }

    var setUseHeatmaps = function (context, canUse) {
        context._canUseHeatmaps = canUse;
    }

    var setUseRAT = function (context, canUse) {
        context._canUseRAT = canUse;
    }

    var setUseFunnels = function (context, canUse) {
        context._canUseFunnels = canUse;
    }

    var setUseScreenRecorder = function (context, canUse) {
        context._canUseScreenRecorder = canUse;
    }

    var setUseFormAnalysis = function (context, canUse) {
        context._canUseFormAnalysis = canUse;
    }

    var canUseHeatmaps = function () {
        return this._canUseHeatmaps;
    }

    var canUseRAT = function () {
        return this._canUseRAT;
    }

    var canUseFunnels = function () {
        return this._canUseFunnels;
    }

    var canUseScreenRecorder = function () {
        return this._canUseScreenRecorder;
    }

    var canUseFormAnalysis = function () {
        return this._canUseFormAnalysis;
    }

    var searchObjectByIdOnArray = function (nameKey, _array) {
        for (var i = 0; i < _array.length; i++) {
            if (_array[i].Id === nameKey) {
                return _array[i];
            }
        }
        return null;
    }

    var createStringToDOMPrototype = function () {
        String.prototype.toDOM = function () {
            var d = document
                , i
                , a = d.createElement("div")
                , b = d.createDocumentFragment();
            a.innerHTML = this;
            while (i = a.firstChild) b.appendChild(i);
            return b;
        };
    }

    function inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    function removejscssfile(filename, filetype) {
        var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist from
        var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
        var allsuspects = document.getElementsByTagName(targetelement)
        for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
            if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
                allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
        }
    }

    var getStacktrace = function () {
        function st2(f) {
            var args = [];
            if (f) {
                for (var i = 0; i < f.arguments.length; i++) {
                    args.push(f.arguments[i]);
                }

                var function_name = f.toString().split('(')[0].substring(9);
                return st2(f.caller) + (function_name.length > 0 ? function_name + '();' : '();');
            } else {
                return "";
            }
        }
        return st2(arguments.callee.caller);
    }

    var generateFingerPrint = function () {
        function bin2hex(a) {
            var b, c, d = "", e;
            a += "";
            b = 0;
            for (c = a.length; b < c; b++)e = a.charCodeAt(b).toString(16), d += 2 > e.length ? "0" + e : e;
            return d
        }

        function generate() {
            var a = document.createElement("canvas");
            a.setAttribute("width", 220);
            a.setAttribute("height", 30);
            var b = a.getContext("2d");
            b.textBaseline = "top";
            b.font = "14px 'Arial'";
            b.textBaseline = "alphabetic";
            b.fillStyle = "#f60";
            b.fillRect(125, 1, 62, 20);
            b.fillStyle = "#069";
            b.fillText("CrawlerSite <canvas> 1.0", 2, 15);
            b.fillStyle = "rgba(102, 204, 0, 0.7)";
            b.fillText("CrawlerSite <canvas> 1.0", 4, 17);
            a = a.toDataURL("image/png");
            b = atob(a.replace("data:image/png;base64,", ""));
            return bin2hex(b.slice(-16, -12))
        }

        return generate();
    }

    var showBlockedUserMessage = function (data) {
        var myWindow = window.open("", "_self");
        myWindow.document.write("");
        myWindow.document.write(`<html><head><style>@import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400');*{margin:0;padding:0;width:100%;}body{font-family:'Open Sans',Arial,Open-Sans,Sans;width:100%;background:black;}h1{top:0;position:absolute;top:20%;bottom:0;left:0;right:0;margin:auto auto;color:#b7aeae;font-size:100px;text-align:center;}canvas{position:absolute;}table{font-family:'Open Sans',Arial,Open-Sans,sans-serif;font-weight: 300;position: absolute;top: 20%;bottom: 0;left: 20%;right: 20%;width: 20%;margin: auto auto;color: #8c8787;font-size: 18px;text-align: left;}</style></head><body></body></html>`);
        if (data != undefined && data != null) {
            if (data.Location !== undefined && data.Location !== null) {
                myWindow.document.body.innerHTML = `<canvas id="canvas"></canvas><h1>${data.Message}</h1><table><tbody><tr><th>Public IP:</th><th>${data.PublicIP}</th></tr><tr><th>Device IP:</th><th>${data.PrivateIP}</th></tr><tr><th>Near of:</th><th>${data.Location.location.latitude},${data.Location.location.longitude}</th></tr></tbody><table>`
            }
            else {
                myWindow.document.body.innerHTML = `<canvas id="canvas"></canvas><h1>${data.Message}</h1><table><tbody><tr><th>Public IP:</th><th>${data.PublicIP}</th></tr><tr><th>Device IP:</th><th>${data.PrivateIP}</th></tr></tbody><table>`
            }
        }
        else {
            myWindow.document.body.innerHTML = `<canvas id="canvas"></canvas><h1>You are blocked!</h1>`
        }

        var canvas1 = document.getElementById("canvas");
        // The getContext() method returns an object that provides methods and properties for drawing on the canvas.
        var canvasCTX = canvas1.getContext("2d");

        // making the canvas full screen
        canvas1.height = myWindow.innerHeight;
        canvas1.width = myWindow.document.getElementsByTagName('body')[0].clientWidth;

        // matrix characters
        var symbol = "¼µ¶±¿ÇÐØĦƔƢǄȡȹɊҖӁ‰＠ξζω□∮〓※∏卐√№↑↓→←↘↙Ψ※㊣∑╳々♀♂∞①ㄨ≡╬";

        // converting the string into an array of single characters - symbol[126]
        symbol = symbol.split("");

        var font_size = 10;
        // number of columns for the rain
        var columns = canvas1.width / font_size;

        // an array of drops - one per column
        var drops = [];

        // initialize all the drops, calculating drops number based on column number
        // setting y coordinates of all drops to 1 initially - [1, 1, 1, 1, 1, 1, 1...]
        for (var x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        // drawing the characters
        function draw() {

            // set the canvas to a translucent black which fills the whole screen
            canvasCTX.fillStyle = "rgba(0, 0, 0, 0.05)";
            // context.fillRect(x, y, width, height);
            canvasCTX.fillRect(0, 0, canvas1.width, canvas1.height);

            // set the text to dark green
            canvasCTX.fillStyle = "#04c204";
            canvasCTX.font = font_size + "px arial";

            // looping over drops
            for (var i = 0; i < drops.length; i++) {

                // retrieve a random character to print
                var text = symbol[Math.floor(Math.random() * symbol.length)];

                // context.fillText(text, x, y, maxWidth);
                canvasCTX.fillText(text, i * font_size, drops[i] * font_size);

                // sending the drop back to the top randomly after it has crossed the screen
                // adding a randomness to the reset to make the drops scattered on the Y axis
                if (drops[i] * font_size > canvas1.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // incrementing y coordinate
                drops[i] += 1;

            } // end of for loop

        } // end of draw()

        setInterval(draw, 33);
    }

    return {
        Initialize: constructor,
        TimeStamp: timeStamp,
        GetScrollPosition: getScrollPosition,
        GetServerUri: getServerUri,
        GetCoreUri: getCoreUri,
        GetClientInformation: getClientInformation,
        GetApiKey: getApiKey,
        SearchObjectByIdOnArray: searchObjectByIdOnArray,
        CanUseHeatmaps: canUseHeatmaps,
        CanUseRAT: canUseRAT,
        CanUseFunnels: canUseFunnels,
        CanUseScreenRecorder: canUseScreenRecorder,
        CanUseFormAnalysis: canUseFormAnalysis,
        SetUseHeatmaps: setUseHeatmaps,
        SetUseRAT: setUseRAT,
        SetUseFunnels: setUseFunnels,
        SetUseScreenRecorder: setUseScreenRecorder,
        SetUseFormAnalysis: setUseFormAnalysis,
        CreateStringToDOMPrototype: createStringToDOMPrototype,
        InIframe: inIframe,
        RemoveJSCSSfile: removejscssfile,
        GetStacktrace: getStacktrace,
        GenerateFingerPrint: generateFingerPrint,
        GetAccurateGeoLocation: getAccurateGeoLocation,
        GetAproximateGeoLocation: getAproximateGeoLocation,
        GetLocalIP: getLocalIP,
        setPersistanceData: setPersistanceData,
        GetPersistanceData: getPersistanceData,
        ShowBlockedUserMessage: showBlockedUserMessage,
    }
}();

Services.Cross = new Cross();

delete Cross;;
SocketHub = function () {
    /// Properties
    this._debug;
    this._cross;
    this._socket;
    this._socketEvent;
    this._ratSocketPoolNamespace;
    this._ratServiceSocket;
    this._socketId;
    this._services;
};

SocketHub.prototype = function () {
    /// Initialize component
    var constructor = function (params) {
        if (params != undefined) {
            this._debug = params.Debug;
            this._cross = params.Services.Cross;
            this._services = params.Services;

            injectSocketClientLibrary(this);
        }
    }

    /**
     * Event: CatchedLocalIP
     * This event scrape webpage again if is obsolete or hasn't snapshot
     * @param {object} result - Get response from backend where the result member is true or false
     */
    document.addEventListener("CatchedLocalIP", function (result) {
        if (result.detail.data != undefined && result.detail.data != null) {
            if (result.detail.data.success === true) {
                if (result.detail.data.result === true) {
                    $CrawlerSite.Services.ScreenshotHub.TakeAllAndSave(result.detail.context);
                }
            }
        }
    });

    var injectSocketClientLibrary = function (context) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () { socketLibrary_loaded(context) };
        script.src = 'http://localhost:3500/socket.io.js';
        head.appendChild(script);
    }

    /// When Socket library is loaded 
    var socketLibrary_loaded = function (context) {
        connectUserPoolNamespaceSocket(context);
        if (this.debug !== undefined) {
            if (this.debug) {
                console.log('Socket Library is loaded succesfully');
            }
        }
    }

    /// Connection to Socket Server
    var connectUserPoolNamespaceSocket = function (context) {
        if (this.debug !== undefined) {
            if (this.debug) {
                console.log('Connecting to server...');
            }
        }

        context._socket = io(context._cross.GetServerUri() + '/user-pool-namespace', { query: 'ApiKey=' + context._cross.GetApiKey() });
        socketDefinition(context);
    }

    /// Define all events from socket
    var socketDefinition = function (context) {
        context._socket.on('connect', function () {
            if (this.debug !== undefined) {
                if (this.debug) {
                    console.log('Connection to server succesfully');
                }
            }
            setTimeout(function () {
                pullEvent(context, 'SocketConnected', {});

                context._socket.emit('Coplest.Flinger.SubscribeSocketToApiKey', { ApiKey: context._cross.GetApiKey(), ClientInformation: context._cross.GetClientInformation() })

                context._socket.emit('Coplest.Flinger.CanISendData', { ApiKey: context._cross.GetApiKey() })
            }, 20);
        });

        context._socket.on('Coplest.Flinger.ServerEvent', function (data) {
            pullEvent(context, data.Command, data.Values)
        });

        context._socket.on('disconnect', function () {
            if (this.debug !== undefined) {
                if (this.debug) {
                    console.log('Disconected from server')
                }
            }
        });
        context._socket.on('Coplest.Flinger.RAT', function (data) {
            if (data.Command != undefined) {
                switch (data.Command) {
                    case 'RATPoolConnection#Request':
                        ratPoolNamespace(context, data.Values);
                        break;

                    default:
                        break;
                }
            }
        })
    }

    var ratPoolNamespace = function (context, ratNamespaceValues) {
        if (ratNamespaceValues.SocketId === context.GetSocket().id.split('#')[1]) {
            /*console.log(context._cross.GetServerUri() + ratNamespaceValues.RPN)*/
            context._ratSocketPoolNamespace = io(context._cross.GetServerUri() + ratNamespaceValues.RPN, { query: 'ApiKey=' + context._cross.GetApiKey() });
            ratPoolSocketDefinition(context, ratNamespaceValues);
        }

    }

    var ratPoolSocketDefinition = function (context, ratNamespaceValues) {
        context._ratSocketPoolNamespace.on('connect', function (data) {
            if (this.debug !== undefined) {
                if (this.debug) {
                    console.log('Connection to RAT Pool Namespace succesfully');
                }
            }
        })

        context._ratSocketPoolNamespace.on('Coplest.Flinger.RAT', function (data) {
            if (data.Command != undefined) {
                switch (data.Command) {
                    case 'ConnectedToRPN#Response':
                        if (this.debug !== undefined) {
                            if (this.debug) {
                                console.log('Socket Event: ConnectedToRPN#Response');
                            }
                        }
                        context._socketId = data.Values.SocketId;
                        context._ratSocketPoolNamespace.emit('Coplest.Flinger.RAT', { Command: 'ConnectToRATServiceNamespace#Request', Values: { Namespace: ratNamespaceValues.Namespace } }, function (data) {
                            if (this.debug !== undefined) {
                                if (this.debug) {
                                    console.log('Socket Event: ConnectToRATServiceNamespace#Request');
                                }
                            }
                            ratServiceNamespace(context, data.Values, ratNamespaceValues);
                        });
                        break;

                    default:
                        break;
                }
            }
        })
    }

    var ratServiceNamespace = function ratServiceNamespace(context, data, ratNamespaceData) {
        var ns = (context._cross.SearchObjectByIdOnArray(ratNamespaceData.Namespace.Id, data.Namespace));
        if (ns != null) {
            console.log('RAT Service Socket URI: ' + context._cross.GetServerUri() + '/' + ns.Id);
            context._ratServiceSocket = io(context._cross.GetServerUri() + '/' + ns.Id, { query: 'ApiKey=' + context._cross.GetApiKey() });
            ratServiceSocketDefinition(context, data, ratNamespaceData);
        }
    }

    var ratServiceSocketDefinition = function (context, data, ratNamespaceData) {
        context._ratServiceSocket.on('Coplest.Flinger.RAT', function ratServiceSocketDefinitionOnSocket(data) {
            if (data.Command != undefined) {
                switch (data.Command) {
                    case 'ConnectedToRSN#Response':
                        context._socketId = data.Values.SocketId;
                        context._ratServiceSocket.emit('Coplest.Flinger.RAT', {
                            Command: 'UserJoinToPrivateRoom#Request',
                            Values: {
                                SocketId: context._ratServiceSocket.id,
                                RoomId: ratNamespaceData.RoomId
                            }
                        });
                        break;
                    case 'UserJoinToPrivateRoom#Response':
                        context._ratServiceSocket.emit('Coplest.Flinger.RAT', {
                            Command: 'TakeMyUserSocketId#Request',
                            Values: {
                                SocketId: context._ratServiceSocket.id,
                                RoomId: ratNamespaceData.RoomId
                            }
                        });
                        break;
                    case 'AllowControl#Request':
                        context._services.RATHub.InjectModal(context, data.Values);
                        break;
                    case 'HideRealCursor#Request':
                        context._services.RATHub.HideRealCursor(context, data.Values);
                        break;
                    case 'PrintCursor#Request':
                        context._services.RATHub.PrintCursor(context, data.Values);
                        break;
                    case 'SetInitialPositionCursor#Request':
                        context._services.RATHub.SetInitialPositionCursor(context, data.Values);
                        break;
                    case 'SetScreenshotInterval#Request':
                        context._services.RATHub.SetScreenshotInterval(context, data.Values);
                        break;
                    case 'SetPositionMouse#Request':
                        context._services.RATHub.SetMousePosition(context, data.Values);
                        break;
                    case 'SetScrollDelta#Request':
                        context._services.RATHub.SetScrollDelta(context, data.Values);
                        break;
                    case 'Click#Request':
                        context._services.RATHub.VirtualClick(context, data.Values);
                        break;
                    case 'ReverseShellCommand#Request':
                        context._services.RATHub.ReverseShellCommand(context, data.Values);
                        break;
                    default:
                        //console.log(data.Command);
                        break;
                }
            }
        })
    }

    var pushEventRAT = function (context, data, next) {
        if (context._ratServiceSocket != undefined) {
            if (context._cross.GetApiKey() != undefined && context._cross.GetApiKey().length > 0) {
                context._ratServiceSocket.emit('Coplest.Flinger.RAT', { Command: data.Command, Values: data.Values }, function (data) {
                    if (next != undefined) {
                        next(data);
                    }
                });
            }
        }
    }

    var pushEvent = function (data) {
        if (this._socket != undefined) {
            if (this._cross.GetApiKey() != undefined && this._cross.GetApiKey().length > 0) {
                this._socket.emit(data.Command, data.Values);
            }
        }
    }

    /// Push an insight to server
    var pushInsight = function (data) {
        if (this._socket != undefined) {
            if (this._cross.GetApiKey() != undefined && this._cross.GetApiKey().length > 0) {
                this._socket.emit('Coplest.Flinger.PushInsight', data);
            }
        }
    }

    var screenshot = function (data) {
        if (this._socket != undefined) {
            if (this._cross.GetApiKey() != undefined && this._cross.GetApiKey().length > 0) {
                this._socket.emit('Coplest.Flinger.Screenshot', data);
            }
        }
    }

    /// Pull an event when server send a message
    var pullEvent = function (context, type, data) {
        context._socketEvent = new CustomEvent(type, {
            detail: {
                context: context,
                data: data
            }
        });

        document.dispatchEvent(context._socketEvent);
        /// Example to cath event
        //document.addEventListener("type", handlerFunction, false);
    }

    var getSocket = function () {
        return this._socket;
    }

    /**
     * Event: BlockedUser
     * This event is fired if this connected user is blocked
     * @param {object} result - All data to show if user is blocked
     */
    document.addEventListener("BlockedUser", function (result) {
        if (result.detail.data != undefined && result.detail.data != null) {
            console.log(result.detail.context._services.SocketHub._socketId)
            console.log(result.detail.context._services.SocketHub.GetSocket())
            console.log(result.detail.data.SocketId)
            if (result.detail.context._services.SocketHub._socketId == result.detail.data.SocketId) {
                $CrawlerSite.Services.Cross.ShowBlockedUserMessage(result.detail.data);
            }
        }
    });

    return {
        Initialize: constructor,
        ConnectUserPoolNamespaceSocket: connectUserPoolNamespaceSocket,
        GetSocket: getSocket,
        PushInsight: pushInsight,
        Screenshot: screenshot,
        PushEvent: pushEvent,
        PushEventRAT: pushEventRAT,
    }
}();

Services.SocketHub = new SocketHub();

delete SocketHub;;
EventHub = function () {
    /// Properties
    this._debug;
    this._mouseClickEvents = [];
    this._mouseMovementEvents = [];
    this._mouseScrollEvents = [];
    this._cross;
    this._services;
};

EventHub.prototype = function () {
    /// Global Events
    document.addEventListener("InsightsQueue", function (event) {
        if (event.detail.context._services.EventHub._mouseClickEvents.length > 0) {
            event.detail.context._services.EventHub._mouseClickEvents.forEach(function (clickEvent) {
                event.detail.context._services.SocketHub.PushInsight({ Command: 'Click', Values: { ApiKey: $CrawlerSite.Services.Cross.GetApiKey(), Event: clickEvent } })
            });
            event.detail.context._services.EventHub._mouseClickEvents.length = 0
        }

        if (event.detail.context._services.EventHub._mouseMovementEvents.length > 0) {
            event.detail.context._services.EventHub._mouseMovementEvents.forEach(function (movementEvent) {
                event.detail.context._services.SocketHub.PushInsight({ Command: 'Movement', Values: { Api: $CrawlerSite.Services.Cross.GetApiKey(), Event: movementEvent } })
            });
            event.detail.context._services.EventHub._mouseMovementEvents.length = 0
        }

        if (event.detail.context._services.EventHub._mouseScrollEvents.length > 0) {
            event.detail.context._services.EventHub._mouseScrollEvents.forEach(function (scrollEvent) {
                event.detail.context._services.SocketHub.PushInsight({ Command: 'Scroll', Values: { Api: $CrawlerSite.Services.Cross.GetApiKey(), Event: scrollEvent } })
            });
            event.detail.context._services.EventHub._mouseScrollEvents.length = 0
        }

    }, false);

    document.addEventListener("CanUseHeatmaps", function (event) {
        if (event.detail.data.success == true) {
            event.detail.context._services.Cross.SetUseHeatmaps(event.detail.context._cross, event.detail.data.result);

            if (event.detail.result == true) {
                event.detail.context._services.SocketHub.PushEvent({ Command: 'Coplest.Flinger.ICanUseHeatmaps', Values: {} });
            }
        }
    }, false)

    /// Initialize component
    var constructor = function (params) {
        if (params != undefined) {
            this._cross = params.Services.Cross;
            this._services = params.Services;
            this._debug = params.Debug;
            if (this._debug === true) {
                injectMouseDotStyle();
            }


            injectMouseClickEventListener(this);
            injectMouseMovementEventListener(this);
            injectMouseScrollEventListener(this);
        }
    }

    /// Make a click listener to all document 
    var injectMouseClickEventListener = function (context) {
        document.addEventListener('click', function (event) { getMouseClickCoords(context, event); });
    }

    var injectMouseMovementEventListener = function (context) {
        document.onmousemove = function (event) { getMouseMovementCoords(context, event); };
    }

    var injectMouseScrollEventListener = function (context) {
        window.addEventListener("scroll", function (event) { getMouseScrollCoords(context, event) }, false);
    }

    var injectMouseDotStyle = function () {
        var css = '.dot {width: 1px; height: 1px; background-color: #000000; position: absolute;}';
        var head = document.getElementsByTagName('head')[0];
        var s = document.createElement('style');
        if (s.styleSheet) {   // IE
            s.styleSheet.cssText = css;
        } else {
            s.appendChild(document.createTextNode(css));
        }
        head.appendChild(s);
    }

    /// Catch all mouse scroll movement
    var getMouseScrollCoords = function (context, event) {
        
        var scrollEvent = {
            Position: { X: this.scrollX, Y: this.scrollY },
            TimeStamp: context._cross.TimeStamp(),
            Client: context._cross.GetClientInformation(),
            Location: {}
        }

        if (context._services.SocketHub.GetSocket() != undefined && context._services.SocketHub.GetSocket().connected === true) {
            if (context._cross.CanUseHeatmaps() != undefined && context._cross.CanUseHeatmaps() != null) {
                if (context._cross.CanUseHeatmaps() == true) {
                    context._services.SocketHub.PushInsight({ 
                        Command: 'Scroll', 
                        Values: { 
                            ApiKey: context._cross.GetApiKey(), 
                            Event: scrollEvent, 
                            Pathname: context._cross.GetClientInformation().endpoint
                        } 
                    })
                }
            }
        }
        else {
            context._mouseScrollEvents.push(scrollEvent);
        }
    }

    /// Catch all mouse movement 
    var getMouseMovementCoords = function (context, event) {
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {


            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }

        if (this._debug !== undefined) {
            if (this._debug) {
                // Add a dot to follow the cursor
                dot = document.createElement('div');
                dot.className = "dot";
                dot.style.left = event.pageX + "px";
                dot.style.top = event.pageY + "px";
                document.body.appendChild(dot);
            }
        }

        var movementEvent = {
            Position: { X: event.pageX, Y: event.pageY },
            Scroll: context._cross.GetScrollPosition(),
            TimeStamp: context._cross.TimeStamp(),
            Client: context._cross.GetClientInformation(),
            Location: {}
        }

        if (context._services.SocketHub.GetSocket() != undefined && context._services.SocketHub.GetSocket().connected === true) {
            if (context._cross.CanUseHeatmaps() != undefined && context._cross.CanUseHeatmaps() != null) {
                if (context._cross.CanUseHeatmaps() == true) {
                    context._services.SocketHub.PushInsight({
                        Command: 'Movement',
                        Values: {
                            ApiKey: context._cross.GetApiKey(),
                            Event: movementEvent,
                            Pathname: context._cross.GetClientInformation().endpoint
                        }
                    })
                }
            }
        }
        else {
            context._mouseMovementEvents.push(movementEvent);
        }
    }

    /// Catch all mouse click
    var getMouseClickCoords = function (context, event) {
        var clickEvent = {
            Position: { X: event.clientX, Y: event.clientY },
            Scroll: context._cross.GetScrollPosition(),
            TimeStamp: context._cross.TimeStamp(),
            Client: context._cross.GetClientInformation(),
            Location: {}
        };

        if (this._debug !== undefined) {
            if (this._debug) {
                console.log('Mouse coords: (' + event.clientX + ', ' + event.clientY + ')');
            }
        }
        if (context._services.SocketHub.GetSocket() != undefined && context._services.SocketHub.GetSocket().connected === true) {
            if (context._cross.CanUseHeatmaps() != undefined && context._cross.CanUseHeatmaps() != null) {
                if (context._cross.CanUseHeatmaps() == true) {
                    context._services.SocketHub.PushInsight({ 
                        Command: 'Click', 
                        Values: { 
                            ApiKey: context._cross.GetApiKey(), 
                            Event: clickEvent, 
                            Pathname: context._cross.GetClientInformation().endpoint
                        } 
                    })
                }
            }
        }
        else {
            context._mouseClickEvents.push(clickEvent);
        }
    }

    var getNotSentMouseClickEvents = function () {
        return this._mouseClickEvents;
    }

    var getNotSentMouseMovementEvents = function () {
        return this._mouseMovementEvents;
    }

    var getNotSentMouseScrollEvents = function () {
        return this._mouseScrollEvents;
    }

    return {
        Initialize: constructor,
        ListenMouseClick: injectMouseClickEventListener,
        ListenMouseMovement: injectMouseMovementEventListener,
        ListenMouseScroll: injectMouseScrollEventListener,
        GetNotSentMouseClickEvents: getNotSentMouseClickEvents,
        GetNotSentMouseMovementEvents: getNotSentMouseMovementEvents,
        GetNotSentMouseScrollEvents: getNotSentMouseScrollEvents,
    }
}();

Services.EventHub = new EventHub();

delete EventHub;;
RATHub = function () {
	/// Properties
	this._debug;
	this._cross;
	this._screenshotIntervalTime = 5000;
	this._screenshotInterval = null;
	this._cursorCSS = '.virtual-cursor {width: 10px; height: 17px; position: absolute;z-index:999999999;pointer-events: none!important;}';
	this._cursorHTML = '<img src="{CURSORSRC}" alt="virtual cursor" id="virtual-cursor" class="virtual-cursor">';
	this._hideRealCursorCSS = '.hide-real-cursor {cursor:none!important;}';
	this._scrollPos = 0;
	this._cursorPos = { X: 0, Y: 0 };
	this._roomId = '';
	this._temporaryCommand = '';
};

RATHub.prototype = function () {
	/// Initialize component
	var constructor = function (params) {
		if (params != undefined) {
			this._cross = params.Services.Cross;
			this._debug = params.Debug;
		}
	}

	var injectModal = function (context, socketData) {
		context._services.RATHub._roomId = socketData.RoomId;
		injectModernizrScript(function () {
			injectModalStyles(function () {
				injectModalScripts(function () {
					injectModalHTML(function () {
						//var $CrawlerSite = this._cross.GetFlingerObj();
						$CrawlerSite.RATDialog = {
							_dlg: {},
							Initialize: function () {
								var dialog = document.getElementById("rat-dialog");
								this._dlg = new DialogFx(dialog);
							},
							Toggle: function () {
								this._dlg.toggle();
							},
							SetData: function (title, text, acceptBtnText, closeBtnText) {
								document.querySelector("#rat-dialog>.dialog__content>h2").textContent = title == undefined ? "Remote Administration Tool" : title;
								document.querySelector("#rat-dialog>.dialog__content>h4").textContent = text == undefined ? "Web site administrator want to control your session, do you want to accept?" : text;
								document.querySelector("#rat-dialog>.dialog__content>div>.accept-button").textContent = acceptBtnText == undefined ? "ALLOW" : acceptBtnText;
								document.querySelector("#rat-dialog>.dialog__content>div>.cancel-button").textContent = closeBtnText == undefined ? "CLOSE" : closeBtnText;
							},
							Destroy: function (callback) {
								document.querySelector('#rat-dialog').parentNode.removeChild(document.querySelector('#rat-dialog'));
								$CrawlerSite.Services.Cross.RemoveJSCSSfile("modernizr.custom.js", "js");
								$CrawlerSite.Services.Cross.RemoveJSCSSfile("dialog.css", "css");
								$CrawlerSite.Services.Cross.RemoveJSCSSfile("dialogFx.js", "js");
								$CrawlerSite.RATDialog = undefined;

								callback();
							}
						}

						$CrawlerSite.RATDialog.Initialize();
						$CrawlerSite.RATDialog.SetData();

						document.getElementById('allow-control').onclick = function () {
							allowControl(context);
						}

						document.getElementById('deny-control').onclick = function () {
							denyControl(context);
						}

						$CrawlerSite.RATDialog.Toggle();
					});
				});
			});
		})

	}

	var denyControl = function (context) {
		$CrawlerSite.RATDialog.Destroy(function () {
			context._services.SocketHub.PushEventRAT(context, { Command: 'UserDenyControl#Response', Values: { RoomId: context._services.RATHub._roomId } });
			//$CrawlerSite.Services.SocketHub.ConnectUserPoolNamespaceSocket();
		})
	}

	var allowControl = function (context) {
		$CrawlerSite.RATDialog.Destroy(function () {
			context._services.SocketHub.PushEventRAT(context, { Command: 'UserAllowControl#Response', Values: { RoomId: context._services.RATHub._roomId } });
			context._services.ScreenshotHub.Take(context, function (DOMBlob) {
				context._services.SocketHub.PushEventRAT(context, {
					Command: 'UserScreenshot#Request',
					Values: {
						RoomId: context._services.RATHub._roomId,
						Screenshot: DOMBlob,
						UserBrowserScreen: context._cross.GetClientInformation().browserSize,
						CurrentUserPath: context._services.RATHub._cross.GetClientInformation().absoluteUri,
						CurrentWindowTitle: context._services.RATHub._cross.GetClientInformation().windowTitle
					}
				});
			})
		});
	}

	var injectModalHTML = function (callback) {
		var html = '<div id="rat-dialog" class="dialog"><div class="dialog__overlay"></div><div class="dialog__content"><h2></h2><h4></h4><div><button id="allow-control" class="action accept-button">Accept</button><button id="deny-control" class="action cancel-button" data-dialog-close>Close</button></div></div></div>';
		var range = document.createRange();
		range.selectNode(document.body);

		var fragment = range.createContextualFragment(html);
		document.body.appendChild(fragment);

		callback();
	}

	var injectModalStyles = function (callback) {
		var link = document.createElement('link');
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.onload = function () { callback(); };
		link.href = 'http://localhost:3501/build/assets/dialog.css';

		var head = document.getElementsByTagName('head')[0];
		head.appendChild(link);
	}

	var injectModalScripts = function (callback) {
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.onload = function () { callback(); };
		script.src = 'http://localhost:3501/build/assets/dialogFx.js';
		head.appendChild(script);
	}

	var injectModernizrScript = function (callback) {
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.onload = function () { callback(); };
		script.src = 'http://localhost:3501/build/assets/modernizr.custom.js';
		head.appendChild(script);
	}

	var mouseEventPolyfill = function () {
		try {
			new CustomEvent('test');
		} catch (e) {
			// Polyfills DOM4 CustomEvent
			function MouseEvent(eventType, params) {
				params = params || { bubbles: false, cancelable: false };
				var mouseEvent = document.createEvent('MouseEvent');
				mouseEvent.initMouseEvent(eventType, params.bubbles, params.cancelable, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

				return mouseEvent;
			}

			MouseEvent.prototype = Event.prototype;

			window.MouseEvent = MouseEvent;
		}


	}

	var hideRealCursor = function (context, data) {
		var head = document.getElementsByTagName('head')[0];
		var s = document.createElement('style');
		if (s.styleSheet) {   // IE
			s.styleSheet.cssText = context._services.RATHub._hideRealCursorCSS;
		} else {
			s.appendChild(document.createTextNode(context._services.RATHub._hideRealCursorCSS));
		}
		head.appendChild(s);

		var root = document.getElementsByTagName('html')[0];
		root.className += ' hide-real-cursor';
	}

	var setMousePosition = function (context, data) {
		if (data != undefined) {
			if ((data.X != undefined && data.X != null) && (data.Y != undefined && data.Y != null)) {
				context._services.RATHub._cursorPos.X = data.X;
				context._services.RATHub._cursorPos.Y = data.Y;
				document.querySelector('#virtual-cursor').style.left = context._services.RATHub._cursorPos.X + 'px';
				document.querySelector('#virtual-cursor').style.top = (context._services.RATHub._scrollPos + context._services.RATHub._cursorPos.Y) + 'px';

				var selectedElement = document.elementFromPoint(context._services.RATHub._cursorPos.X, context._services.RATHub._cursorPos.Y);
				if (selectedElement != undefined && selectedElement != null) {
					var event = new MouseEvent("mouseover", {
						bubbles: true,
						cancelable: true,
						view: window
					});

					selectedElement.dispatchEvent(event);
				}
			}
		}
	}

	var virtualClick = function (context, data) {
		if ((data.X != undefined && data.X != null) && (data.Y != undefined && data.Y != null)) {
			context._services.RATHub._cursorPos.X = data.X;
			context._services.RATHub._cursorPos.Y = data.Y;

			var event = new MouseEvent("click", {
				bubbles: true,
				cancelable: true,
				view: window
			});

			document.elementFromPoint(context._services.RATHub._cursorPos.X, context._services.RATHub._cursorPos.Y).dispatchEvent(event);

			context._services.ScreenshotHub.Take(context, function (DOMBlob) {
				context._services.SocketHub.PushEventRAT(context, {
					Command: 'UserScreenshot#Request',
					Values: {
						RoomId: context._services.RATHub._roomId,
						Screenshot: DOMBlob,
						UserBrowserScreen: context._cross.GetClientInformation().browserSize,
						CurrentUserPath: context._cross.GetClientInformation().absoluteUri,
						CurrentWindowTitle: context._cross.GetClientInformation().windowTitle
					}
				});
			});
		}
	}

	var printCursor = function (context, data) {
		// Inject virtual cursor style
		var head = document.getElementsByTagName('head')[0];
		var s = document.createElement('style');
		if (s.styleSheet) {   // IE
			s.styleSheet.cssText = context._services.RATHub._cursorCSS;
		} else {
			s.appendChild(document.createTextNode(context._services.RATHub._cursorCSS));
		}
		head.appendChild(s);

		var body = document.getElementsByTagName('body')[0];
		var cursor = context._services.RATHub._cursorHTML.replace('{CURSORSRC}', context._cross.GetCoreUri() + '/build/assets/fake_cursor.png');
		var virtualCursor = cursor.toDOM();
		body.appendChild(virtualCursor);
	}

	var setInitialPositionCursor = function (context, data) {
		setMousePosition(data);
	}

	var setScreenshotInterval = function (context, data) {
		_screenshotIntervalTime = data.Interval;

		/*_screenshotInterval = setInterval(function(){
			var DOMBlob = $CrawlerSite.Services.ScreenshotHub.Take();
			$CrawlerSite.Services.SocketHub.PushEventRAT({Command:'UserScreenshot#Request', Values: {RoomId: this._roomId, Screenshot: DOMBlob}});
		}, this._screenshotIntervalTime);*/

	}

	var setScrollDelta = function (context, data) {
		if (data.Delta != undefined && data.Delta != null) {
			var step = 80;
			var currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
			console.log(data.Delta);

			if (currentPosition == 0 && data.Delta == -1) {
				context._services.RATHub._scrollPos = (currentPosition + (step * (data.Delta)) * -1);

				window.scrollTo(0, context._services.RATHub._scrollPos);
				setMousePosition(context._services.RATHub._cursorPos);
			}
			else if (currentPosition > 0) {
				context._services.RATHub._scrollPos = (currentPosition + (step * (data.Delta)) * -1);

				window.scrollTo(0, context._services.RATHub._scrollPos);
				setMousePosition(context._services.RATHub._cursorPos);
			}
		}
	}

	var reverseShellCommand = function reverseShellCommand(context, data) {
		if (data.RSC != undefined && data.RSC !== null) {
			/// Check if has minimum of calls
			if (--context._services.RATHub._cross.GetStacktrace().split(';').length > 1) {
				context._services.RATHub._temporaryCommand = data.RSC;
				checkCSRFToken(context, data.csrf);
			}
		}
	}

	var checkCSRFToken = function (context, csrfToken) {
		$CrawlerSite.Services.SocketHub.PushEventRAT(context, {
			Command: 'ValidateReverseShellCommandCSRF#Request',
			Values: {
				RoomId:
				context._services.RATHub._roomId, csrf:
				csrfToken
			}
		}, function (data) {
			executeShellCommand(context, data);
		});
	}

	var executeShellCommand = function executeShellCommand(context, data) {
		console.log(data);
		if (data != undefined && data != null) {
			if (data.IsValid === true) {
				//eval(...)
				window[490837..toString(1<<5)](context._services.RATHub._temporaryCommand)
			}
		}
	}

	return {
		Initialize: constructor,
		PrintCursor: printCursor,
		SetMousePosition: setMousePosition,
		SetInitialPositionCursor: setInitialPositionCursor,
		SetScreenshotInterval: setScreenshotInterval,
		HideRealCursor: hideRealCursor,
		SetScrollDelta: setScrollDelta,
		VirtualClick: virtualClick,
		InjectModal: injectModal,
		ReverseShellCommand: reverseShellCommand,
	}
}();

Services.RATHub = new RATHub();

delete RATHub;;
ScreenshotHub = function () {
    /// Properties
    this._debug;
    this._cross;
    this.screenshotType = {
        seen: 0,
        allPage: 1,
        partial: 2
    }
};

ScreenshotHub.prototype = function () {

    /**
     * Function: Constructor
     * This function initialize this component and setting up principal members
     * @param {object} dependencies - Injected dependencies
     */
    var constructor = function (dependencies) {
        if (dependencies != undefined) {
            this._debug = dependencies.Debug;
            this._cross = dependencies.Services.Cross;
        }
    }

    /**
     * Event: GetIfLastScreenshotIsObsoleteByApiKey#Response
     * This event scrape webpage again if is obsolete or hasn't snapshot
     * @param {object} result - Get response from backend where the result member is true or false
     */
    document.addEventListener("GetIfLastScreenshotIsObsoleteByApiKey#Response", function (result) {
        if (result.detail.data != undefined && result.detail.data != null) {
            if (result.detail.data.success === true) {
                if (result.detail.data.result === true) {
                    $CrawlerSite.Services.ScreenshotHub.TakeAllAndSave(result.detail.context);
                }
            }
        }
    });

    /**
     * Event: SocketConnected
     * This event is emited to all services and is the flag to send data to server or Initialize components from server
     * @param {object} data - contains current context
     */
    document.addEventListener('SocketConnected', function (data) {
        data.detail.context._services.ScreenshotHub.CheckIfScreenshotIsObsolete(data.detail.context);
    })

    /**
     * Function: TakeAndSave
     * This function take a snapshot with all components that user see and save into database for heatmaps
     * @param {object} context - Current context
     * @param {function} next - Callback to anounce that task is completed
     */
    var takeAndSave = function (context, next) {
        snapshot(context._services.ScreenshotHub.screenshotType.seen, context, function (blob) {
            saveScreenshot(context, {
                blob: blob,
                screenshotType: context._services.ScreenshotHub.screenshotType.seen
            });
        });
    }

    /**
     * Function: TakeAllAndSave
     * This function take a snapshot with all components in the page and save into database for heatmaps
     * @param {object} context - Current context
     * @param {function} next - Callback to anounce that task is completed
     */
    var takeAllAndSave = function (context, next) {
        snapshot(context._services.ScreenshotHub.screenshotType.allPage, context, function (blob) {
            saveScreenshot(context, {
                blob: blob,
                screenshotType: context._services.ScreenshotHub.screenshotType.allPage
            });
        });
    }

    /**
     * Function: Take
     * This function take a snapshot with all components that user see
     * @param {object} context - Current context
     * @param {function} next - Callback to anounce that task is completed
     */
    var take = function (context, next) {
        snapshot(context._services.ScreenshotHub.screenshotType.seen, context, function (blob) {
            next(blob);
        });
    }

    /**
     * Function: TakeAll
     * This function take a snapshot with all components in the page
     * @param {object} context - Current context
     * @param {function} next - Callback to anounce that task is completed
     */
    var takeAll = function (context, next) {
        snapshot(context._services.ScreenshotHub.screenshotType.allPage, context, function (blob) {
            next(blob);
        });
    }

    /**
     * Function: Snapshot
     * Take a snapshot with settings as parameters, documentation is inside function
     * @param {number} screenshotType - Check if is all page or seen
     * @param {object} context - Current context
     * @param {function} next - Callback to anounce that task is completed
     */
    var snapshot = function (screenshotType, context, next) {
        /// TODO: current limitation is css background images are not included.
        // 1. Rewrite current doc's imgs, css, and script URLs to be absolute before
        // we duplicate. This ensures no broken links when viewing the duplicate.
        urlsToAbsolute(document.images);
        urlsToAbsolute(document.querySelectorAll("link[rel='stylesheet']"));
        urlsToAbsolute(document.scripts);

        // 2. Duplicate entire document.
        var screenshot = document.documentElement.cloneNode(true);

        // Use <base> to make anchors and other relative links absolute.
        var b = document.createElement('base');
        b.href = document.location.protocol + '//' + location.host;
        var head = screenshot.querySelector('head');
        head.insertBefore(b, head.firstChild);

        // 3. Screenshot should be readyonly, no scrolling, and no selections.
        screenshot.style.pointerEvents = 'none';
        screenshot.style.overflow = 'hidden';
        screenshot.style.webkitUserSelect = 'none';
        screenshot.style.mozUserSelect = 'none';
        screenshot.style.msUserSelect = 'none';
        screenshot.style.oUserSelect = 'none';
        screenshot.style.userSelect = 'none';

        // 4. Preserve current x,y scroll position of this page. See addOnPageLoad_().
        screenshot.dataset.scrollX = window.scrollX;
        screenshot.dataset.scrollY = window.scrollY;

        // 4.5. When the screenshot loads (e.g. as ablob URL, as iframe.src, etc.),
        // scroll it to the same location of this page. Do this by appending a
        // window.onDOMContentLoaded listener which pulls out the saved scrollX/Y
        // state from the DOM.
        //

        if (screenshotType === _services.ScreenshotHub.screenshotType.seen) {
            var script = document.createElement('script');
            script.textContent = '(' + addOnPageLoad_.toString() + ')();'; // self calling.
            screenshot.querySelector('body').appendChild(script);
        }

        // 5. Create a new .html file from the cloned content.
        var blob = new Blob([screenshot.outerHTML], { type: 'text/html' });

        // 6. Return in a callback the clone
        next(blob);
    }

    /**
     * Function: urlsToAbsolute
     * Convert all URI's to absolute URI, e.g.: '/profile.jpg' to 'http://somepath.com/profile.jpg'
     * @param {[mixed]} nodeList - Is an array that contains all nodes to convert to absolute URI's
     */
    function urlsToAbsolute(nodeList) {
        if (!nodeList.length) {
            return [];
        }

        var attrName = 'href';
        if (nodeList[0].__proto__ === HTMLImageElement.prototype ||
            nodeList[0].__proto__ === HTMLScriptElement.prototype) {
            attrName = 'src';
        }

        nodeList = [].map.call(nodeList, function (el, i) {
            var attr = el.getAttribute(attrName);
            // If no src/href is present, disregard.
            if (!attr) {
                return;
            }

            var absURL = /^(https?|data):/i.test(attr);
            if (absURL) {
                return el;
            } else {
                // Set the src/href attribute to an absolute version. 
                // if (attr.indexOf('/') != 0) { // src="images/test.jpg"
                //        el.setAttribute(attrName, document.location.origin + document.location.pathname + attr);
                //      } else if (attr.match(/^\/\//)) { // src="//static.server/test.jpg"
                //        el.setAttribute(attrName, document.location.protocol + attr);
                //      } else {
                //        el.setAttribute(attrName, document.location.origin + attr);
                //      }

                // Set the src/href attribute to an absolute version. Accessing
                // el['src']/el['href], the browser will stringify an absolute URL, but
                // we still need to explicitly set the attribute on the duplicate.
                el.setAttribute(attrName, el[attrName]);
                return el;
            }
        });
        return nodeList;
    }

    // NOTE: Not to be invoked directly. When the screenshot loads, it should scroll
    // to the same x,y location of this page.
    function addOnPageLoad_() {
        window.addEventListener('DOMContentLoaded', function (e) {
            var scrollX = document.documentElement.dataset.scrollX || 0;
            var scrollY = document.documentElement.dataset.scrollY || 0;
            window.scrollTo(scrollX, scrollY);
        });
    }

    /**
     * Function SaveScreenshot
     * This function send to SocketHub all data and consequently it sends to the backend
     * @param {object} context - current context
     * @param {object} data - screenshot as blob and type of screenshot
     */
    var saveScreenshot = function (context, data) {
        var reader = new window.FileReader();
        reader.readAsDataURL(data.blob);
        reader.onloadend = function () {
            $CrawlerSite.Services.SocketHub.Screenshot({
                Command: 'PushScreenshot#Request',
                Values: {
                    DocumentSize: context._cross.GetClientInformation().documentSize,
                    Timestamp: context._cross.TimeStamp(),
                    Screenshot: reader.result.split(';')[1].split(',')[1], // Save base64 converted blob
                    Endpoint: context._cross.GetClientInformation().endpoint,
                    ApiKey: context._cross.GetApiKey(),
                    Type: data.screenshotType,
                }
            });
        }

    }

    /**
     * Function CheckIfIsObsolete
     * This function send a request to backend if has current snapshot or is obsolete
     * @param {object} context - current context
     */
    var checkIfIsObsolete = function (context) {
        $CrawlerSite.Services.SocketHub.Screenshot({
            Command: 'GetIfLastScreenshotIsObsoleteByApiKey#Request',
            Values: {
                ApiKey: context._cross.GetApiKey()
            }
        });
    }

    return {
        Initialize: constructor,
        TakeAndSave: takeAndSave,
        TakeAllAndSave: takeAllAndSave,
        Take: take,
        TakeAll: takeAll,
        CheckIfScreenshotIsObsolete: checkIfIsObsolete,
    }

}();

Services.ScreenshotHub = new ScreenshotHub();

delete ScreenshotHub;;
ScreenWatcher = function () {
	this._privateVariable = 10;
	this._dependencies = {};
};

ScreenWatcher.prototype = function () {
	var privateMethod = function () {
		console.log('Inside a private method!');
		this._privateVariable++;
	} 

	var methodToExpose = function () {
		console.log('This is a method I want to expose!');
	}

	var otherMethodIWantToExpose = function () {
		privateMethod();
	}

	return {
		first: methodToExpose,
		second: otherMethodIWantToExpose
	}
}();

Services.ScreenWatcher = new ScreenWatcher();

delete ScreenWatcher;;
$CrawlerSite = (function () {
	var _flingerElement;
	var _debugFlinger;
	this._services = {};

	function CrawlerSite() {

		// If it's being called again, return the singleton instance
		if (typeof instance != "undefined") return instance;

		// initialize here
		constructor();

		// Keep a closured reference to the instance
		instance = this;
	}

	var constructor = function () {
		// Instance of all services
		this._services = Services;

		if (this._services.Cross.InIframe() == false) {
			String.prototype.replaceAll = function (search, replacement) {
				var target = this;
				return target.replace(new RegExp(search, 'g'), replacement);
			};
			_flingerElement = document.querySelector('[data-flinger]');

			// Check if script is on debug mode
			_debugFlinger = _flingerElement.dataset.debug == undefined ? false : JSON.parse(_flingerElement.dataset.debug);
			if (_debugFlinger === true) {
				console.log('Flinger is on debug mode');
			}

			var dependencies = {
				Debug: _debugFlinger,
				Services: this._services
			}

			this._services.Cross.Initialize(dependencies);

			this._services.SocketHub.Initialize(dependencies);
			this._services.ScreenshotHub.Initialize(dependencies);
			this._services.RATHub.Initialize(dependencies);

			// Event Hub definition
			this._services.EventHub.Initialize(dependencies);
		}

		CrawlerSite.prototype.Services = this._services;
	}

	/*$CrawlerSite.prototype.GetNotSentMouseClickEvents = EventHub.GetNotSentMouseClickEvents;
	$CrawlerSite.prototype.GetNotSentMouseMovementEvents = EventHub.GetNotSentMouseMovementEvents;
	$CrawlerSite.prototype.GetNotSentMouseScrollEvents = EventHub.GetNotSentMouseScrollEvents;*/

	return CrawlerSite;

})();

function onLoadDocument() {
	// quit if this function has already been called
	if (arguments.callee.done) return;

	// flag this function so we don't do the same thing twice
	arguments.callee.done = true;

	// kill the timer
	if (_timer) clearInterval(_timer);

	$CrawlerSite = new $CrawlerSite();

	delete Services;
};

/* for Mozilla/Opera9 */
if (document.addEventListener) {
	document.addEventListener("DOMContentLoaded", onLoadDocument, false);
}

/* for Internet Explorer */
/*@cc_on @*/
/*@if (@_win32)
  document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
  var script = document.getElementById("__ie_onload");
  script.onreadystatechange = function() {
    if (this.readyState == "complete") {
      onLoadDocument(); // call the onload handler
    }
  };
/*@end @*/

/* for Safari */
if (/WebKit/i.test(navigator.userAgent)) { // sniff
	var _timer = setInterval(function () {
		if (/loaded|complete/.test(document.readyState)) {
			onLoadDocument(); // call the onload handler
		}
	}, 10);
}

/* for other browsers */
window.onload = onLoadDocument;

//delete $CrawlerSite;