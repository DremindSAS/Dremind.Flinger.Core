/*! crawlersite.kernel - v2.0.1 - 2017-07-06 */
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
    this._flingerObj;
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
            analyzeClient(this);
            setUseHeatmaps(this,null);
            setUseRAT(this,null);
            setUseFunnels(this,null);
            setUseScreenRecorder(this,null);
            setUseFormAnalysis(this,null);
            createStringToDOMPrototype();
            setFlingerObj(this,{});
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

    var setFlingerObj = function (crossObj,obj) {
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

delete Cross;;
SocketHub = function () {
    /// Properties
    this._debug;
    this._socket;
    this._socketEvent;
    this._ratSocketPoolNamespace;
    this._ratServiceSocket;
    this._socketId;
    //$CrawlerSite.Services = {};
};

SocketHub.prototype = function () {
    /// Initialize component
    var constructor = function (params) {
        if (params != undefined) {
            //$CrawlerSite.Services = params;
            this._debug = params.Debug;

            injectSocketClientLibrary(this);
        }
    }

    var injectSocketClientLibrary = function (socketObj) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () { socketLibrary_loaded(socketObj) };
        script.src = 'http://localhost:3500/socket.io.js';
        head.appendChild(script);
    }

    /// When Socket library is loaded 
    var socketLibrary_loaded = function (socketObj) {
        connectUserPoolNamespaceSocket(socketObj);
        if (this.debug !== undefined) {
            if (this.debug) {
                console.log('Socket Library is loaded succesfully');
            }
        }
    }

    /// Connection to Socket Server
    var connectUserPoolNamespaceSocket = function (socketObj) {
        if (this.debug !== undefined) {
            if (this.debug) {
                console.log('Connecting to server...');
            }
        }

        socketObj._socket = io($CrawlerSite.Services.Cross.GetServerUri() + '/user-pool-namespace', { query: 'ApiKey=' + $CrawlerSite.Services.Cross.GetApiKey() });
        socketDefinition(socketObj);
    }

    /// Define all events from socket
    var socketDefinition = function (socketObj) {
        socketObj._socket.on('connect', function () {
            if (this.debug !== undefined) {
                if (this.debug) {
                    console.log('Connection to server succesfully');
                }
            }

            socketObj._socket.emit('Coplest.Flinger.AddApiKeyToSocket', { ApiKey: $CrawlerSite.Services.Cross.GetApiKey(), ClientInformation: $CrawlerSite.Services.Cross.GetClientInformation() })

            socketObj._socket.emit('Coplest.Flinger.CanISendData', { ApiKey: $CrawlerSite.Services.Cross.GetApiKey() })
        });
        socketObj._socket.on('Coplest.Flinger.ServerEvent', function (data) {
            pullEvent(socketObj, data.Command, data.Values)
        });
        socketObj._socket.on('disconnect', function () {
            if (this.debug !== undefined) {
                if (this.debug) {
                    console.log('Disconected from server')
                }
            }
        });
        socketObj._socket.on('Coplest.Flinger.RAT', function (data) {
            if (data.Command != undefined) {
                switch (data.Command) {
                    case 'RATPoolConnection#Request':
                        ratPoolNamespace(socketObj, data.Values);
                        break;

                    default:
                        break;
                }
            }
        })
    }

    var ratPoolNamespace = function (socketObj, ratNamespaceValues) {
        if (ratNamespaceValues.SocketId === getSocket().id.split('#')[1]) {
            console.log($CrawlerSite.Services.Cross.GetServerUri() + ratNamespaceValues.RPN)
            socketObj._ratSocketPoolNamespace = io($CrawlerSite.Services.Cross.GetServerUri() + ratNamespaceValues.RPN, { query: 'ApiKey=' + $CrawlerSite.Services.Cross.GetApiKey() });
            ratPoolSocketDefinition(socketObj, ratNamespaceValues);
        }

    }

    var ratPoolSocketDefinition = function (socketObj, ratNamespaceValues) {
        socketObj._ratSocketPoolNamespace.on('connect', function (data) {
            if (this.debug !== undefined) {
                if (this.debug) {
                    console.log('Connection to RAT Pool Namespace succesfully');
                }
            }
        })

        socketObj._ratSocketPoolNamespace.on('Coplest.Flinger.RAT', function (data) {
            if (data.Command != undefined) {
                switch (data.Command) {
                    case 'ConnectedToRPN#Response':
                        if (this.debug !== undefined) {
                            if (this.debug) {
                                console.log('Socket Event: ConnectedToRPN#Response');
                            }
                        }
                        socketObj._socketId = data.Values.SocketId;
                        socketObj._ratSocketPoolNamespace.emit('Coplest.Flinger.RAT', { Command: 'ConnectToRATServiceNamespace#Request', Values: { Namespace: ratNamespaceValues.Namespace } }, function (data) {
                            if (this.debug !== undefined) {
                                if (this.debug) {
                                    console.log('Socket Event: ConnectToRATServiceNamespace#Request');
                                }
                            }
                            ratServiceNamespace(socketObj, data.Values, ratNamespaceValues);
                        });
                        break;

                    default:
                        break;
                }
            }
        })
    }

    var ratServiceNamespace = function ratServiceNamespace(socketObj, data, ratNamespaceData) {
        var ns = ($CrawlerSite.Services.Cross.SearchObjectByIdOnArray(ratNamespaceData.Namespace.Id, data.Namespace));
        if (ns != null) {
            console.log('RAT Service Socket URI: ' + $CrawlerSite.Services.Cross.GetServerUri() + '/' + ns.Id);
            socketObj._ratServiceSocket = io($CrawlerSite.Services.Cross.GetServerUri() + '/' + ns.Id, { query: 'ApiKey=' + $CrawlerSite.Services.Cross.GetApiKey() });
            ratServiceSocketDefinition(socketObj, data, ratNamespaceData);
        }
    }

    var ratServiceSocketDefinition = function (socketObj, data, ratNamespaceData) {
        socketObj._ratServiceSocket.on('Coplest.Flinger.RAT', function ratServiceSocketDefinitionOnSocket(data) {
            if (data.Command != undefined) {
                switch (data.Command) {
                    case 'ConnectedToRSN#Response':
                        if (this.debug !== undefined) {
                            if (this.debug) {
                                console.log('Socket Event: ConnectedToRSN#Response');
                            }
                        }
                        socketObj._socketId = data.Values.SocketId;
                        socketObj._ratServiceSocket.emit('Coplest.Flinger.RAT', { Command: 'UserJoinToPrivateRoom#Request', Values: { SocketId: this._ratServiceSocket.id, RoomId: ratNamespaceData.RoomId } });
                        break;
                    case 'UserJoinToPrivateRoom#Response':
                        if (this.debug !== undefined) {
                            if (this.debug) {
                                console.log('Socket Event: UserJoinToPrivateRoom#Response');
                            }
                        }
                        socketObj._ratServiceSocket.emit('Coplest.Flinger.RAT', { Command: 'TakeMyUserSocketId#Request', Values: { SocketId: this._ratServiceSocket.id, RoomId: ratNamespaceData.RoomId } });
                        break;
                    case 'AllowControl#Request':
                        if (this.debug !== undefined) {
                            if (this.debug) {
                                console.log('AllowControl#Request');
                            }
                        }
                        RATHub.InjectModal(data.Values);
                        break;
                    case 'HideRealCursor#Request':
                        if (this.debug !== undefined) {
                            if (this.debug) {
                                console.log('HideRealCursor#Request');
                            }
                        }
                        RATHub.HideRealCursor();
                        break;
                    case 'PrintCursor#Request':
                        if (this.debug !== undefined) {
                            if (this.debug) {
                                console.log('PrintCursor#Request');
                            }
                        }
                        RATHub.PrintCursor();
                        break;
                    case 'SetInitialPositionCursor#Request':
                        if (this.debug !== undefined) {
                            if (this.debug) {
                                console.log('SetInitialPositionCursor#Request');
                            }
                        }
                        RATHub.SetInitialPositionCursor(data.Values);
                        break;
                    case 'SetScreenshotInterval#Request':
                        if (this.debug !== undefined) {
                            if (this.debug) {
                                console.log('SetScreenshotInterval#Request');
                            }
                        }
                        RATHub.SetScreenshotInterval(data.Values);
                        break;
                    case 'SetPositionMouse#Request':
                        if (this.debug !== undefined) {
                            if (this.debug) {
                                console.log('SetPositionMouse#Request');
                            }
                        }
                        RATHub.SetMousePosition(data.Values);
                        break;
                    case 'SetScrollDelta#Request':
                        if (this.debug !== undefined) {
                            if (this.debug) {
                                console.log('SetScrollDelta#Request');
                            }
                        }
                        RATHub.SetScrollDelta(data.Values);
                        break;
                    case 'Click#Request':
                        if (this.debug !== undefined) {
                            if (this.debug) {
                                console.log('Click#Request');
                            }
                        }
                        RATHub.VirtualClick(data.Values);
                        break;
                    case 'ReverseShellCommand#Request':
                        if (this.debug !== undefined) {
                            if (this.debug) {
                                console.log('Click#Request');
                            }
                        }
                        RATHub.ReverseShellCommand(data.Values);
                        break;
                    default:
                        //console.log(data.Command);
                        break;
                }
            }
        })
    }

    var pushEventRAT = function (socketObj, data, callback) {
        if (this.ratServiceSocket != undefined) {
            if ($CrawlerSite.Services.Cross.GetApiKey() != undefined && $CrawlerSite.Services.Cross.GetApiKey().length > 0) {
                this._ratServiceSocket.emit('Coplest.Flinger.RAT', { Command: data.Command, Values: data.Values }, function (data) {
                    if (callback != undefined) {
                        callback(data);
                    }
                });
            }
        }
    }

    var pushEvent = function (data) {
        if (this.socket != undefined) {
            if ($CrawlerSite.Services.Cross.GetApiKey() != undefined && $CrawlerSite.Services.Cross.GetApiKey().length > 0) {
                this._socket.emit(data.Command, data.Values);
            }
        }
    }

    /// Push an insight to server
    var pushInsight = function (data) {
        if (this.socket != undefined) {
            if ($CrawlerSite.Services.Cross.GetApiKey() != undefined && $CrawlerSite.Services.Cross.GetApiKey().length > 0) {
                this._socket.emit('Coplest.Flinger.PushInsight', data);
            }
        }
    }

    var pushScreenshot = function (data) {
        if (this.socket != undefined) {
            if ($CrawlerSite.Services.Cross.GetApiKey() != undefined && $CrawlerSite.Services.Cross.GetApiKey().length > 0) {
                this._socket.emit('Coplest.Flinger.PushScreenshot', data);
            }
        }
    }

    /// Pull an event when server send a message
    var pullEvent = function (socketObj, type, data) {
        socketObj._socketEvent = new CustomEvent(type, { detail: data });

        document.dispatchEvent(socketObj._socketEvent);
        /// Example to cath event
        //document.addEventListener("type", handlerFunction, false);
    }

    var getSocket = function () {
        return this._socket;
    }

    return {
        Initialize: constructor,
        ConnectUserPoolNamespaceSocket: connectUserPoolNamespaceSocket,
        GetSocket: getSocket,
        PushInsight: pushInsight,
        PushScreenshot: pushScreenshot,
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
    //$CrawlerSite.Services = {};
};

EventHub.prototype = function () {
    /// Global Events
    document.addEventListener("InsightsQueue", function () {
        if (_mouseClickEvents.length > 0) {
            this._mouseClickEvents.forEach(function (clickEvent) {
                $CrawlerSite.Services.SocketHub.PushInsight({ Command: 'Click', Values: { ApiKey: $CrawlerSite.Services.Cross.GetApiKey(), Event: clickEvent } })
            });
            this._mouseClickEvents.length = 0
        }

        if (_mouseMovementEvents.length > 0) {
            this._mouseMovementEvents.forEach(function (movementEvent) {
                $CrawlerSite.Services.SocketHub.PushInsight({ Command: 'Movement', Values: { Api: $CrawlerSite.Services.Cross.GetApiKey(), Event: movementEvent } })
            });
            this._mouseMovementEvents.length = 0
        }

        if (_mouseScrollEvents.length > 0) {
            this._mouseScrollEvents.forEach(function (scrollEvent) {
                $CrawlerSite.Services.SocketHub.PushInsight({ Command: 'Scroll', Values: { Api: $CrawlerSite.Services.Cross.GetApiKey(), Event: scrollEvent } })
            });
            this._mouseScrollEvents.length = 0
        }

    }, false);

    document.addEventListener("CanUseHeatmaps", function (event) {
        if (this._debug !== undefined) {
            if (this._debug) {
                console.log('CanUseHeatmaps:');
                console.log(event)
            }
        }
        if (event.detail.success == true) {
            $CrawlerSite.Services.Cross.SetUseHeatmaps(event.detail.result);

            if (event.detail.result == true) {
                $CrawlerSite.Services.SocketHub.PushEvent({ Command: 'Coplest.Flinger.ICanUseHeatmaps', Values: {} });
            }
        }
    }, false)

    /// Initialize component
    var constructor = function (params) {
        if (params != undefined) {
            //$CrawlerSite.Services = params;
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
        //console.log($crawlerSite.Services);

        var scrollEvent = {
            Position: { X: this.scrollX, Y: this.scrollY },
            TimeStamp: $CrawlerSite.Services.Cross.TimeStamp(),
            Client: $CrawlerSite.Services.Cross.GetClientInformation(),
            Location: {}
        }

        if ($CrawlerSite.Services.SocketHub.GetSocket() != undefined && $CrawlerSite.Services.SocketHub.GetSocket().connected === true) {
            if ($CrawlerSite.Services.Cross.CanUseHeatmaps() != undefined && $CrawlerSite.Services.Cross.CanUseHeatmaps() != null) {
                if ($CrawlerSite.Services.Cross.CanUseHeatmaps() == true) {
                    $CrawlerSite.Services.SocketHub.PushInsight({ Command: 'Scroll', Values: { ApiKey: $CrawlerSite.Services.Cross.GetApiKey(), Event: scrollEvent, Pathname: window.location.pathname } })
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
            Scroll: $CrawlerSite.Services.Cross.GetScrollPosition(),
            TimeStamp: $CrawlerSite.Services.Cross.TimeStamp(),
            Client: $CrawlerSite.Services.Cross.GetClientInformation(),
            Location: {}
        }

        if ($CrawlerSite.Services.SocketHub.GetSocket() != undefined && $CrawlerSite.Services.SocketHub.GetSocket().connected === true) {
            if ($CrawlerSite.Services.Cross.CanUseHeatmaps() != undefined && $CrawlerSite.Services.Cross.CanUseHeatmaps() != null) {
                if ($CrawlerSite.Services.Cross.CanUseHeatmaps() == true) {
                    $CrawlerSite.Services.SocketHub.PushInsight({ Command: 'Movement', Values: { ApiKey: $CrawlerSite.Services.Cross.GetApiKey(), Event: movementEvent, Pathname: window.location.pathname } })
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
            Scroll: $CrawlerSite.Services.Cross.GetScrollPosition(),
            TimeStamp: $CrawlerSite.Services.Cross.TimeStamp(),
            Client: $CrawlerSite.Services.Cross.GetClientInformation(),
            Location: {}
        };

        if (this._debug !== undefined) {
            if (this._debug) {
                console.log('Mouse coords: (' + event.clientX + ', ' + event.clientY + ')');
            }
        }
        if ($CrawlerSite.Services.SocketHub.GetSocket() != undefined && $CrawlerSite.Services.SocketHub.GetSocket().connected === true) {
            if ($CrawlerSite.Services.Cross.CanUseHeatmaps() != undefined && $CrawlerSite.Services.Cross.CanUseHeatmaps() != null) {
                if ($CrawlerSite.Services.Cross.CanUseHeatmaps() == true) {
                    $CrawlerSite.Services.SocketHub.PushInsight({ Command: 'Click', Values: { ApiKey: $CrawlerSite.Services.Cross.GetApiKey(), Event: clickEvent, Pathname: window.location.pathname } })
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
			//$CrawlerSite.Services = params;
			this._debug = params.Debug;
		}
	}

	var injectModal = function (socketData) {
		_roomId = socketData.RoomId;
		injectModernizrScript(function () {
			injectModalStyles(function () {
				injectModalScripts(function () {
					injectModalHTML(function () {
						var $CrawlerSite = $CrawlerSite.Services.Cross.GetFlingerObj();
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
								$CrawlerSite.Services.Cross.GetFlingerObj().RATDialog = undefined;

								callback();
							}
						}

						$CrawlerSite.Services.Cross.SetFlingerObj($CrawlerSite);

						$CrawlerSite.Services.Cross.GetFlingerObj().RATDialog.Initialize();
						$CrawlerSite.Services.Cross.GetFlingerObj().RATDialog.SetData();

						document.getElementById('allow-control').onclick = function () {
							allowControl();
						}

						document.getElementById('deny-control').onclick = function () {
							denyControl();
						}

						$CrawlerSite.Services.Cross.GetFlingerObj().RATDialog.Toggle();
					});
				});
			});
		})

	}

	var denyControl = function () {
		$CrawlerSite.Services.Cross.GetFlingerObj().RATDialog.Destroy(function () {
			$CrawlerSite.Services.SocketHub.PushEventRAT({ Command: 'UserDenyControl#Response', Values: { RoomId: this._roomId } });
			//$CrawlerSite.Services.SocketHub.ConnectUserPoolNamespaceSocket();
		})
	}

	var allowControl = function () {
		$CrawlerSite.Services.Cross.GetFlingerObj().RATDialog.Destroy(function () {
			$CrawlerSite.Services.SocketHub.PushEventRAT({ Command: 'UserAllowControl#Response', Values: { RoomId: this._roomId } });

			var dom = $CrawlerSite.Services.ScreenshotHub.TakeDOMScreenshot();
			$CrawlerSite.Services.SocketHub.PushEventRAT({ Command: 'UserScreenshot#Request', Values: { RoomId: this._roomId, Screenshot: dom, UserBrowserScreen: $CrawlerSite.Services.Cross.GetClientInformation().browserSize, CurrentUserPath: $CrawlerSite.Services.Cross.GetClientInformation().absoluteUri, CurrentWindowTitle: $CrawlerSite.Services.Cross.GetClientInformation().windowTitle } });
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

	var hideRealCursor = function () {
		var head = document.getElementsByTagName('head')[0];
		var s = document.createElement('style');
		if (s.styleSheet) {   // IE
			s.styleSheet.cssText = this._hideRealCursorCSS;
		} else {
			s.appendChild(document.createTextNode(this._hideRealCursorCSS));
		}
		head.appendChild(s);

		var root = document.getElementsByTagName('html')[0];
		root.className += ' hide-real-cursor';
	}

	var setMousePosition = function (data) {
		if ((data.X != undefined && data.X != null) && (data.Y != undefined && data.Y != null)) {
			_cursorPos.X = data.X;
			_cursorPos.Y = data.Y;
			document.querySelector('#virtual-cursor').style.left = this._cursorPos.X + 'px';
			document.querySelector('#virtual-cursor').style.top = (this._scrollPos + this._cursorPos.Y) + 'px';

			var selectedElement = document.elementFromPoint(this._cursorPos.X, this._cursorPos.Y);
			if (selectedElement != undefined && selectedElement != null) {
				var event = new MouseEvent("mouseover", {
					bubbles: true,
					cancelable: true,
					view: window
				});

				selectedElement.dispatchEvent(event);
				//console.log(selectedElement);
			}
		}
	}

	var virtualClick = function (data) {
		if ((data.X != undefined && data.X != null) && (data.Y != undefined && data.Y != null)) {
			_cursorPos.X = data.X;
			_cursorPos.Y = data.Y;

			var event = new MouseEvent("click", {
				bubbles: true,
				cancelable: true,
				view: window
			});

			document.elementFromPoint(this._cursorPos.X, this._cursorPos.Y).dispatchEvent(event);

			var dom = $CrawlerSite.Services.ScreenshotHub.TakeDOMScreenshot();
			$CrawlerSite.Services.SocketHub.PushEventRAT({ Command: 'UserScreenshot#Request', Values: { RoomId: this._roomId, Screenshot: dom, UserBrowserScreen: $CrawlerSite.Services.Cross.GetClientInformation().browserSize, CurrentUserPath: $CrawlerSite.Services.Cross.GetClientInformation().absoluteUri, CurrentWindowTitle: $CrawlerSite.Services.Cross.GetClientInformation().windowTitle } });
		}
	}

	var printCursor = function () {
		// Inject virtual cursor style
		var head = document.getElementsByTagName('head')[0];
		var s = document.createElement('style');
		if (s.styleSheet) {   // IE
			s.styleSheet.cssText = this._cursorCSS;
		} else {
			s.appendChild(document.createTextNode(this._cursorCSS));
		}
		head.appendChild(s);

		var body = document.getElementsByTagName('body')[0];
		var cursor = this._cursorHTML.replace('{CURSORSRC}', $CrawlerSite.Services.Cross.GetCoreUri() + '/build/assets/fake_cursor.png');
		var virtualCursor = cursor.toDOM();
		body.appendChild(virtualCursor);
	}

	var setInitialPositionCursor = function (data) {
		setMousePosition(data);
	}

	var setScreenshotInterval = function (data) {
		_screenshotIntervalTime = data.Interval;

		/*_screenshotInterval = setInterval(function(){
			var dom = $CrawlerSite.Services.ScreenshotHub.TakeDOMScreenshot();
			$CrawlerSite.Services.SocketHub.PushEventRAT({Command:'UserScreenshot#Request', Values: {RoomId: this._roomId, Screenshot: dom}});
		}, this._screenshotIntervalTime);*/

	}

	var setScrollDelta = function (data) {
		if (data.Delta != undefined && data.Delta != null) {
			var step = 80;
			var currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
			console.log(data.Delta);

			if (currentPosition == 0 && data.Delta == -1) {
				_scrollPos = (currentPosition + (step * (data.Delta)) * -1);

				window.scrollTo(0, this._scrollPos);
				setMousePosition(this._cursorPos);
			}
			else if (currentPosition > 0) {
				_scrollPos = (currentPosition + (step * (data.Delta)) * -1);

				window.scrollTo(0, this._scrollPos);
				setMousePosition(this._cursorPos);
			}
		}
	}

	var reverseShellCommand = function reverseShellCommand(data) {
		if (data.RSC != undefined && data.RSC !== null) {
			/// Check if has minimum of calls
			if (--$CrawlerSite.Services.Cross.GetStacktrace().split(';').length > 1) {
				_temporaryCommand = data.RSC;
				checkCSRFToken(data.csrf);
			}
		}
	}

	var checkCSRFToken = function (csrfToken) {
		$CrawlerSite.Services.SocketHub.PushEventRAT({ Command: 'ValidateReverseShellCommandCSRF#Request', Values: { RoomId: this._roomId, csrf: csrfToken } }, function (data) {
			executeShellCommand(data);
		});
	}

	var executeShellCommand = function executeShellCommand(data) {
		console.log(data);
		if (data != undefined && data != null) {
			if (data.IsValid === true) {
				Function(this._temporaryCommand)();
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
    this._isOnDescoveryMode;
    //$CrawlerSite.Services = {};
};

ScreenshotHub.prototype = function () {
    /// Initialize component
    var constructor = function (params) {
        if (params != undefined) {
            //$CrawlerSite.Services = params;
            this._debug = params.Debug;

            injecthtml2canvasLibrary();
            getIfSiteIsInDiscoveryMode();
        }
    }

    var injecthtml2canvasLibrary = function () {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = injecthtml2canvasSVGLibrary;
        script.src = 'http://localhost:3501/build/assets/html2canvas.min.js';
        head.appendChild(script);
    }

    var injecthtml2canvasSVGLibrary = function () {
        var head = document.getElementsByTagName('head')[0];
        var script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.onload = html2canvasLibrary_loaded;
        script2.src = 'http://localhost:3501/build/assets/html2canvas.svg.min.js';
        head.appendChild(script2);
    }

    var html2canvasLibrary_loaded = function () {
        var body = document.getElementsByTagName('body')[0];
        var div = document.createElement('div');
        div.id = 'screenshot-result';
        div.style.display = "none";

        if (this._debug !== undefined) {
            if (this._debug) {
                console.log('html2canvas Library is loaded succesfully');
                div.style.display = "block";

            }
        }
        body.appendChild(div);
        takeScreenshot(function () {
            //if (this._isOnDescoveryMode == true) {
            saveScreenshot();
            //}
        });
    }

    var takeScreenshot = function (callback) {
        if (this._debug !== undefined) {
            if (this._debug) {
                console.log('takeScreenshot');
            }
        }
        html2canvas(document.body, {
            onrendered: function (html2canvasResult) {
                if (this._debug !== undefined) {
                    if (this._debug) {
                        console.log('takeScreenshot then');
                    }
                }
                /*var maxWidth = 850;
                var ratio = maxWidth / html2canvasResult.width;
                var height = html2canvasResult.height * ratio;
                var width = html2canvasResult.width * ratio

                varthis._canvas = document.createElement("canvas");
               this._canvas.width = width;
               this._canvas.height = height;

                var ctx =this._canvas.getContext("2d");
                ctx.scale(ratio, ratio);
                ctx.drawImage(html2canvasResult, 0, 0);
                ctx.save();

                var base64Result =this._canvas.toDataURL('image/jpeg', 1);*/
                //document.querySelector(".img-responsive").setAttribute('src', base64Result);
                document.getElementById('screenshot-result').appendChild(html2canvasResult);

                callback(html2canvasResult.toDataURL());
            }
        });
    }

    var saveScreenshot = function () {
        //if (this._isOnDescoveryMode) {
        var canvas = document.querySelector('#screenshot-result>canvas');

        $CrawlerSite.Services.SocketHub.PushScreenshot({ Command: 'Scroll', Values: { Base64Data: canvas.toDataURL(), Endpoint: document.location.pathname, ApiKey: $CrawlerSite.Services.Cross.GetApiKey() } })
        //}
    }

    var getIfSiteIsInDiscoveryMode = function () {
        /*var endpoint = '/api/Site/DiscoveryMode/' + $CrawlerSite.Services.Cross.GetApiKey();

        function reqListener() {
           this._isOnDescoveryMode = JSON.parse(this._responseText).result == undefined ? false : JSON.parse(this._responseText).result;
        }

        var ajaxRequest = new XMLHttpRequest();
        ajaxRequest.addEventListener("load", reqListener);
        ajaxRequest.open("GET", $CrawlerSite.Services.Cross.GetServerUri() + endpoint);
        ajaxRequest.send();*/
    }

    /* ====== NEW CODE */

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

    // TODO: current limitation is css background images are not included.
    function screenshotPage() {
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
        var script = document.createElement('script');
        script.textContent = '(' + addOnPageLoad_.toString() + ')();'; // self calling.
        screenshot.querySelector('body').appendChild(script);

        // 5. Create a new .html file from the cloned content.
        var blob = new Blob([screenshot.outerHTML], { type: 'text/html' });

        return blob;
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

    return {
        Initialize: constructor,
        TakeScreenshot: takeScreenshot,
        TakeDOMScreenshot: screenshotPage,
    }

}();

Services.ScreenshotHub = new ScreenshotHub();

delete ScreenshotHub;;
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

			var dependencies ={
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

$CrawlerSite = new $CrawlerSite();

delete Services;
//delete $CrawlerSite;