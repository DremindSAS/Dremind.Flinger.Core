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
        this._serverUri = "{BACKEND-URI}";
        this._coreUri = "{KERNEL-URI}";
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
        var browserSize = {};
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;
        browserSize.width = x;
        browserSize.height = y;


        var documentSize = {};

        var body = document.body,
            html = document.documentElement;

        documentSize.height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        documentSize.width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);

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
        var fingerprint = context.GetFingerPrint();
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
        //get the IP addresses associated with an account
        function getIPs(callback) {
            var ip_dups = {};

            //compatibility for firefox and chrome
            var RTCPeerConnection = window.RTCPeerConnection
                || window.mozRTCPeerConnection
                || window.webkitRTCPeerConnection;
            var useWebKit = !!window.webkitRTCPeerConnection;

            //bypass naive webrtc blocking using an iframe
            if (!RTCPeerConnection) {
                //NOTE: you need to have an iframe in the page right above the script tag
                //
                //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
                //<script>...getIPs called in here...
                //
                var win = iframe.contentWindow;
                RTCPeerConnection = win.RTCPeerConnection
                    || win.mozRTCPeerConnection
                    || win.webkitRTCPeerConnection;
                useWebKit = !!win.webkitRTCPeerConnection;
            }

            //minimal requirements for data connection
            var mediaConstraints = {
                optional: [{ RtpDataChannels: true }]
            };

            var servers = { iceServers: [{ urls: "stun:stun.services.mozilla.com" }] };

            //construct a new RTCPeerConnection
            var pc = new RTCPeerConnection(servers, mediaConstraints);

            function handleCandidate(candidate) {
                //match just the IP address
                var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])))($|\s)/;
                var ip_addr = ip_regex.exec(candidate)[1];

                //remove duplicates
                if (ip_dups[ip_addr] === undefined)
                    callback(ip_addr);

                ip_dups[ip_addr] = true;
            }

            //listen for candidate events
            pc.onicecandidate = function (ice) {

                //skip non-candidate events
                if (ice.candidate)
                    handleCandidate(ice.candidate.candidate);
            };

            //create a bogus data channel
            pc.createDataChannel("");

            //create an offer sdp
            pc.createOffer(function (result) {

                //trigger the stun server request
                pc.setLocalDescription(result, function () { }, function () { });

            }, function () { });

            //wait for a while to let everything done
            setTimeout(function () {
                //read candidate info from local description
                var lines = pc.localDescription.sdp.split('\n');

                lines.forEach(function (line) {
                    if (line.indexOf('a=candidate:') === 0)
                        handleCandidate(line);
                });
            }, 1);
        }

        var ips = [];
        getIPs(function (ip) {
            ips.push(ip);
        });

        setTimeout(function () {
            if (ips.length > 0) {
                ipv4 = '';
                ipv6 = '';
                var ip_regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                var result = ip_regex.exec(ips[0]);
                if (result == null) {
                    var tmp = ips[0];
                    ips[0] = ips[1];
                    ips[1] = tmp;
                }

                next({
                    success: true,
                    message: 'Ip getting successfuly',
                    result: {
                        IPv4: ips[0],
                        IPv6: ips[1]
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
        }, 500);
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
            myWindow.document.body.innerHTML = `<canvas id="canvas"></canvas><h1>${data.Message}</h1><table><tbody><tr><th>Public IP:</th><th>${data.PublicIP}</th></tr><tr><th>Device IP:</th><th>${data.PrivateIP}</th></tr><tr><th>Near of:</th><th>${data.Location.latitude},${data.Location.longitude}</th></tr></tbody><table>`
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
        GetPersistanceData: GetPersistanceData,
        ShowBlockedUserMessage: showBlockedUserMessage,
    }
}();

Services.Cross = new Cross();

delete Cross;