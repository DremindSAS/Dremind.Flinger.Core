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
    this._flingerObj;
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
            analyzeClient(this);
            setUseHeatmaps(this, null);
            setUseRAT(this, null);
            setUseFunnels(this, null);
            setUseScreenRecorder(this, null);
            setUseFormAnalysis(this, null);
            createStringToDOMPrototype();
            setFlingerObj(this, {});
            querySelectorPolyfill();
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

    var setFlingerObj = function (crossObj, obj) {
        crossObj._flingerObj = obj;
    }

    var getFlingerObj = function () {
        return this._flingerObj;
    }

    var setApiKey = function (crossObj) {
        crossObj._flingerElement = document.querySelector('[data-flinger]');
        crossObj._apiKey = crossObj._flingerElement.dataset.flinger == undefined ? false : crossObj._flingerElement.dataset.flinger;
    }

    var timeStamp = function () {
        return this._timeStamp.getTime();
    }

    var analyzeClient = function () {
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

        for (var id in this._clientStrings) {
            var cs = this._clientStrings[id];
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
        var windowTitle = document.title;

        this._clientInformation = {
            screen: screenSize,
            browserSize: browserSize,
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
            windowTitle: windowTitle
        }
    }

    var userLocationLibrary_loaded = function () {
        geoip2.city(locationSuccesfuly, locationFails);
    }

    var locationSuccesfuly = function (clientLocation) {
        this._clientLocation = clientLocation;
    }

    var locationFails = function () {
        this._clientLocation = null;
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

    var setUseHeatmaps = function (crossObj, canUse) {
        crossObj._canUseHeatmaps = canUse;
    }

    var setUseRAT = function (crossObj, canUse) {
        crossObj._canUseRAT = canUse;
    }

    var setUseFunnels = function (crossObj, canUse) {
        crossObj._canUseFunnels = canUse;
    }

    var setUseScreenRecorder = function canUse(crossObj) {
        crossObj._canUseScreenRecorder = canUse;
    }

    var setUseFormAnalysis = function (crossObj, canUse) {
        crossObj._canUseFormAnalysis = canUse;
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
                return this._array[i];
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
        SetFlingerObj: setFlingerObj,
        GetFlingerObj: getFlingerObj,
        InIframe: inIframe,
        RemoveJSCSSfile: removejscssfile,
        GetStacktrace: getStacktrace,
    }

}();

Services.Cross = new Cross();

delete Cross;