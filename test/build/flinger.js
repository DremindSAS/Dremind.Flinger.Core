/*! coplest.flinger.core - v0.0.1 - 2016-12-30 */
var Cross = (function() {
    var _timeStamp;
    var _serverUri;
    var _clientInformation;
    var _clientStrings = [
            {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
            {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
            {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
            {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
            {s:'Windows Vista', r:/Windows NT 6.0/},
            {s:'Windows Server 2003', r:/Windows NT 5.2/},
            {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
            {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
            {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
            {s:'Windows 98', r:/(Windows 98|Win98)/},
            {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
            {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s:'Windows CE', r:/Windows CE/},
            {s:'Windows 3.11', r:/Win16/},
            {s:'Android', r:/Android/},
            {s:'Open BSD', r:/OpenBSD/},
            {s:'Sun OS', r:/SunOS/},
            {s:'Linux', r:/(Linux|X11)/},
            {s:'iOS', r:/(iPhone|iPad|iPod)/},
            {s:'Mac OS X', r:/Mac OS X/},
            {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s:'QNX', r:/QNX/},
            {s:'UNIX', r:/UNIX/},
            {s:'BeOS', r:/BeOS/},
            {s:'OS/2', r:/OS\/2/},
            {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
    var _clientLocation;
    var _apiKey;

    var constructor = function(params){
        if(params != undefined){
            _debug = params.Debug;
        }

        _timeStamp = new Date();
        _serverUri = "http://flingerbackend.cloudapp.net:3500";
        setApiKey();
        analyzeClient();
        injectUserLocationLibrary();
    }

    var setApiKey = function(){
        _flingerElement = document.querySelector('[data-flinger]');
        _apiKey = _flingerElement.dataset.flinger == undefined ? false : _flingerElement.dataset.flinger;
    }

    var timeStamp = function(){
        return _timeStamp.getTime();
    }

    var analyzeClient = function(){
        var unknown = '-';

        // screen
        var screenSize = {};
        if (screen.width) {
            width = (screen.width) ? screen.width : '';
            height = (screen.height) ? screen.height : '';
            screenSize.width = width;
            screenSize.height = height;
        }

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
        
        for (var id in _clientStrings) {
            var cs = _clientStrings[id];
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
        
        // flash (you'll need to include swfobject)
        /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
        var flashVersion = 'no check';
        if (typeof swfobject != 'undefined') {
            var fv = swfobject.getFlashPlayerVersion();
            if (fv.major > 0) {
                flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
            }
            else  {
                flashVersion = unknown;
            }
        }

        _clientInformation = {
            screen: screenSize,
            browser: browser,
            browserVersion: version,
            browserMajorVersion: majorVersion,
            mobile: mobile,
            os: os,
            osVersion: osVersion,
            cookies: cookieEnabled,
            flashVersion: flashVersion,
            fullUserAgent : navigator.userAgent
        }
    }

    var injectUserLocationLibrary = function(){
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.onload = userLocationLibrary_loaded;
        script.src = 'http://js.maxmind.com/js/apis/geoip2/v2.1/geoip2.js';
        head.appendChild(script);
    }

    var userLocationLibrary_loaded = function(){
        geoip2.city(locationSuccesfuly, locationFails);
    }

    var locationSuccesfuly = function(clientLocation){
        _clientLocation = clientLocation;
    }

    var locationFails = function(){
        _clientLocation = null;
    }

    var getScrollPosition = function(){
        return { X : window.pageXOffset, Y : window.pageYOffset}
    }

    var getServerUri = function(){
        return _serverUri;
    }

    var getClientInformation = function(){
        return _clientInformation;
    }

    var getClientLocation = function(){
        return _clientLocation;
    }

    var getApiKey = function(){
        return _apiKey;
    }

  return {
      Initialize: constructor, 
      TimeStamp: timeStamp,
      GetScrollPosition : getScrollPosition,
      GetServerUri : getServerUri,
      GetClientInformation : getClientInformation,
      GetClientLocation : getClientLocation,
      GetApiKey: getApiKey
  };
})()

Cross.Initialize();;
var SocketHub = (function () {

    /// Properties
    var _debug;
    var _socket;
    var _socketEvent;
    var _ratSocketPoolNamespace;
    var _ratServiceSocket;
    var _socketId;

    /// Initialize component
    var constructor = function (params) {
        if (params != undefined) {
            _debug = params.Debug;
        }

        injectSocketClientLibrary();
    }

    var injectSocketClientLibrary = function () {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = socketLibrary_loaded;
        script.src = 'https://cdn.socket.io/socket.io-1.4.5.js';
        head.appendChild(script);
    }

    /// When Socket library is loaded 
    var socketLibrary_loaded = function () {
        connectSocket();
        if (_debug !== undefined) {
            if (_debug) {
                console.log('Socket Library is loaded succesfully');
            }
        }
    }

    /// Connection to Socket Server
    var connectSocket = function () {
        if (_debug !== undefined) {
            if (_debug) {
                console.log('Connecting to server...');
            }
        }
        _socket = io(Cross.GetServerUri() + '/user-pool-namespace');
        socketDefinition();
    }

    /// Define all events from socket
    var socketDefinition = function () {
        _socket.on('connect', function () {
            if (_debug !== undefined) {
                if (_debug) {
                    console.log('Connection to server succesfully');
                }
            }

            _socket.emit('Coplest.Flinger.AddApiKeyToSocket', { ApiKey: Cross.GetApiKey() })

            pullEvent('SocketConnected')
        });
        _socket.on('Coplest.Flinger.ServerEvent', function (data) {
            pullEvent(data.Command, data.Values)
        });
        _socket.on('disconnect', function () {
            if (_debug !== undefined) {
                if (_debug) {
                    console.log('Disconected from server')
                }
            }
        });
        _socket.on('Coplest.Flinger.RAT', function (data) {
            if (data.Command != undefined) {
                switch (data.Command) {
                    case 'RATPoolConnection#Request':
                        ratPoolNamespace(data.Values);
                        break;

                    default:
                        break;
                }
            }
        })
    }

    var ratPoolNamespace = function (data) {
        _ratSocketPoolNamespace = io(Cross.GetServerUri() + data.RPN);
        ratPoolSocketDefinition(data);
    }

    var ratPoolSocketDefinition = function (ratNamespaceData) {
        _ratSocketPoolNamespace.on('connect', function (data) {
            if (_debug !== undefined) {
                if (_debug) {
                    console.log('Connection to RAT Service Namespace succesfully');
                }
            }
        })

        _ratSocketPoolNamespace.on('Coplest.Flinger.RAT', function (data) {
            if (data.Command != undefined) {
                switch (data.Command) {
                    case 'ConnectedToRPN#Response':
                        _socketId = data.Values.SocketId;
                        _socket.emit('Coplest.Flinger.RAT', { Message: 'ConnectToRATServiceNamespace#Request', Values: { Namespace: ratNamespaceData.Namespace } }, function (data) {
                            ratServiceNamespace(data, ratNamespaceData);
                        });
                        break;

                    default:
                        break;
                }
            }
        })
    }

    var ratServiceNamespace = function (data, ratNamespaceData) {
        _ratServiceSocket = io(Cross.GetServerUri() + data.Namespace);
        ratServiceSocketDefinition(data, ratNamespaceData);
    }

    var ratServiceSocketDefinition = function (data, ratNamespaceData) {
        _ratServiceSocket.on('Coplest.Flinger.RAT', function (data) {
            if (data.Command != undefined) {
                switch (data.Command) {
                    case 'ConnectedToRSN#Response':
                        _socketId = data.Values.SocketId;
                        _ratServiceSocket.emit('Coplest.Flinger.RAT', { Command: 'JoinToPrivateRoom#Request', Values: { SocketId: socket.id, RoomId: ratNamespaceData.RoomId } });
                        break;
                    case 'JoinToPrivateRoom#Response':
                    _ratServiceSocket.emit('Coplest.Flinger.RAT', { Command: 'TakeMyUserSocketId#Request', Values: { SocketId: socket.id, RoomId: ratNamespaceData.RoomId } });
                        break;
                    case 'PrintCursor#Request':
                        console.log('PrintCursor#Request')
                        break;
                    default:
                        break;
                }
            }
        })
    }

    /// Push an insight to server
    var pushInsight = function (data) {
        if (_socket != undefined) {
            if (Cross.GetApiKey() != undefined && Cross.GetApiKey().length > 0) {
                _socket.emit('Coplest.Flinger.PushInsight', data);
            }
        }
    }

    var pushScreenshot = function (data) {
        if (_socket != undefined) {
            if (Cross.GetApiKey() != undefined && Cross.GetApiKey().length > 0) {
                _socket.emit('Coplest.Flinger.PushScreenshot', data);
            }
        }
    }

    /// Pull an event when server send a message
    var pullEvent = function (type, data) {
        _socketEvent = new CustomEvent(type, data);

        document.dispatchEvent(_socketEvent);
        /// Example to cath event
        //document.addEventListener("type", handlerFunction, false);
    }

    var getSocket = function () {
        return _socket;
    }

    return {
        Initialize: constructor,
        GetSocket: getSocket,
        PushInsight: pushInsight,
        PushScreenshot: pushScreenshot
    };
})();
var EventHub = (function () {
    /// Properties
    var _debug;
    var _mouseClickEvents = [];
    var _mouseMovementEvents = [];
    var _mouseScrollEvents = [];

    /// Global Events
    document.addEventListener("SocketConnected", function () {
        if (_mouseClickEvents.length > 0) {
            _mouseClickEvents.forEach(function (clickEvent) {
                SocketHub.PushInsight({ Command: 'Click', Values: { ApiKey: Cross.GetApiKey(), Event: clickEvent } })
            });
            _mouseClickEvents.length = 0
        }

        if (_mouseMovementEvents.length > 0) {
            _mouseMovementEvents.forEach(function (movementEvent) {
                SocketHub.PushInsight({ Command: 'Movement', Values: { Api: Cross.GetApiKey(), Event: movementEvent } })
            });
            _mouseMovementEvents.length = 0
        }

        if (_mouseScrollEvents.length > 0) {
            _mouseScrollEvents.forEach(function (scrollEvent) {
                SocketHub.PushInsight({ Command: 'Scroll', Values: { Api: Cross.GetApiKey(), Event: scrollEvent } })
            });
            _mouseScrollEvents.length = 0
        }

    }, false);

    /// Initialize component
    var constructor = function (params) {
        if (params != undefined) {
            _debug = params.Debug;
            injectMouseDotStyle();
        }
    }

    /// Make a click listener to all document 
    var injectMouseClickEventListener = function () {
        document.addEventListener('click', getMouseClickCoords);
    }

    var injectMouseMovementEventListener = function () {
        document.onmousemove = getMouseMovementCoords;
    }

    var injectMouseScrollEventListener = function () {
        window.addEventListener("scroll", getMouseScrollCoords, false);
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
    var getMouseScrollCoords = function (event) {
        var scrollEvent = {
            Position: { X: this.scrollX, Y: this.scrollY },
            TimeStamp: Cross.TimeStamp(),
            Client: Cross.GetClientInformation(),
            Location: Cross.GetClientLocation()
        }

        if (SocketHub.GetSocket() != undefined && SocketHub.GetSocket().connected === true) {
            SocketHub.PushInsight({ Command: 'Scroll', Values: { ApiKey: Cross.GetApiKey(), Event: scrollEvent, Pathname: window.location.pathname } })
        }
        else {
            _mouseScrollEvents.push(scrollEvent);
        }
    }

    /// Catch all mouse movement
    var getMouseMovementCoords = function (event) {
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

        if (_debug !== undefined) {
            if (_debug) {
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
            Scroll: Cross.GetScrollPosition(),
            TimeStamp: Cross.TimeStamp(),
            Client: Cross.GetClientInformation(),
            Location: Cross.GetClientLocation()
        }

        if (SocketHub.GetSocket() != undefined && SocketHub.GetSocket().connected === true) {
            SocketHub.PushInsight({ Command: 'Movement', Values: { ApiKey: Cross.GetApiKey(), Event: movementEvent, Pathname: window.location.pathname } })
        }
        else {
            _mouseMovementEvents.push(movementEvent);
        }
    }

    /// Catch all mouse click
    var getMouseClickCoords = function (event) {
        var clickEvent = {
            Position: { X: event.clientX, Y: event.clientY },
            Scroll: Cross.GetScrollPosition(),
            TimeStamp: Cross.TimeStamp(),
            Client: Cross.GetClientInformation(),
            Location: Cross.GetClientLocation()
        };

        if (_debug !== undefined) {
            if (_debug) {
                console.log('Mouse coords: (' + event.clientX + ', ' + event.clientY + ')');
            }
        }
        if (SocketHub.GetSocket() != undefined && SocketHub.GetSocket().connected === true) {
            SocketHub.PushInsight({ Command: 'Click', Values: { ApiKey: Cross.GetApiKey(), Event: clickEvent, Pathname: window.location.pathname } })
        }
        else {
            _mouseClickEvents.push(clickEvent);
        }
    }

    var getNotSentMouseClickEvents = function () {
        return _mouseClickEvents;
    }

    var getNotSentMouseMovementEvents = function () {
        return _mouseMovementEvents;
    }

    var getNotSentMouseScrollEvents = function () {
        return _mouseScrollEvents;
    }

    return {
        Initialize: constructor,
        ListenMouseClick: injectMouseClickEventListener,
        ListenMouseMovement: injectMouseMovementEventListener,
        ListenMouseScroll: injectMouseScrollEventListener,
        GetNotSentMouseClickEvents: getNotSentMouseClickEvents,
        GetNotSentMouseMovementEvents: getNotSentMouseMovementEvents,
        GetNotSentMouseScrollEvents: getNotSentMouseScrollEvents
    };
})();
var FormHub = (function() {
  var privateVariable = 10;

  var privateMethod = function() {
    console.log('Inside a private method!');
    privateVariable++;
  }

  var methodToExpose = function() {
    console.log('This is a method I want to expose!');
  }

  var otherMethodIWantToExpose = function() {
    privateMethod();
  }

  return {
      first: methodToExpose,
      second: otherMethodIWantToExpose
  };
})();
var RATHub = (function() {
  var privateVariable = 10;

  var privateMethod = function() {
    console.log('Inside a private method!');
    privateVariable++;
  }

  var methodToExpose = function() {
    console.log('This is a method I want to expose!');
  }

  var otherMethodIWantToExpose = function() {
    privateMethod();
  }

  return {
      first: methodToExpose,
      second: otherMethodIWantToExpose
  };
})();
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
})();;
var SocketHub = (function () {

    /// Properties
    var _debug;
    var _socket;
    var _socketEvent;
    var _ratSocketPoolNamespace;
    var _ratServiceSocket;
    var _socketId;

    /// Initialize component
    var constructor = function (params) {
        if (params != undefined) {
            _debug = params.Debug;
        }

        injectSocketClientLibrary();
    }

    var injectSocketClientLibrary = function () {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = socketLibrary_loaded;
        script.src = 'https://cdn.socket.io/socket.io-1.4.5.js';
        head.appendChild(script);
    }

    /// When Socket library is loaded 
    var socketLibrary_loaded = function () {
        connectSocket();
        if (_debug !== undefined) {
            if (_debug) {
                console.log('Socket Library is loaded succesfully');
            }
        }
    }

    /// Connection to Socket Server
    var connectSocket = function () {
        if (_debug !== undefined) {
            if (_debug) {
                console.log('Connecting to server...');
            }
        }
        _socket = io(Cross.GetServerUri() + '/user-pool-namespace');
        socketDefinition();
    }

    /// Define all events from socket
    var socketDefinition = function () {
        _socket.on('connect', function () {
            if (_debug !== undefined) {
                if (_debug) {
                    console.log('Connection to server succesfully');
                }
            }

            _socket.emit('Coplest.Flinger.AddApiKeyToSocket', { ApiKey: Cross.GetApiKey() })

            pullEvent('SocketConnected')
        });
        _socket.on('Coplest.Flinger.ServerEvent', function (data) {
            pullEvent(data.Command, data.Values)
        });
        _socket.on('disconnect', function () {
            if (_debug !== undefined) {
                if (_debug) {
                    console.log('Disconected from server')
                }
            }
        });
        _socket.on('Coplest.Flinger.RAT', function (data) {
            if (data.Command != undefined) {
                switch (data.Command) {
                    case 'RATPoolConnection#Request':
                        ratPoolNamespace(data.Values);
                        break;

                    default:
                        break;
                }
            }
        })
    }

    var ratPoolNamespace = function (data) {
        _ratSocketPoolNamespace = io(Cross.GetServerUri() + data.RPN);
        ratPoolSocketDefinition(data);
    }

    var ratPoolSocketDefinition = function (ratNamespaceData) {
        _ratSocketPoolNamespace.on('connect', function (data) {
            if (_debug !== undefined) {
                if (_debug) {
                    console.log('Connection to RAT Service Namespace succesfully');
                }
            }
        })

        _ratSocketPoolNamespace.on('Coplest.Flinger.RAT', function (data) {
            if (data.Command != undefined) {
                switch (data.Command) {
                    case 'ConnectedToRPN#Response':
                        _socketId = data.Values.SocketId;
                        _socket.emit('Coplest.Flinger.RAT', { Message: 'ConnectToRATServiceNamespace#Request', Values: { Namespace: ratNamespaceData.Namespace } }, function (data) {
                            ratServiceNamespace(data, ratNamespaceData);
                        });
                        break;

                    default:
                        break;
                }
            }
        })
    }

    var ratServiceNamespace = function (data, ratNamespaceData) {
        _ratServiceSocket = io(Cross.GetServerUri() + data.Namespace);
        ratServiceSocketDefinition(data, ratNamespaceData);
    }

    var ratServiceSocketDefinition = function (data, ratNamespaceData) {
        _ratServiceSocket.on('Coplest.Flinger.RAT', function (data) {
            if (data.Command != undefined) {
                switch (data.Command) {
                    case 'ConnectedToRSN#Response':
                        _socketId = data.Values.SocketId;
                        _ratServiceSocket.emit('Coplest.Flinger.RAT', { Command: 'JoinToPrivateRoom#Request', Values: { SocketId: socket.id, RoomId: ratNamespaceData.RoomId } });
                        break;
                    case 'JoinToPrivateRoom#Response':
                    _ratServiceSocket.emit('Coplest.Flinger.RAT', { Command: 'TakeMyUserSocketId#Request', Values: { SocketId: socket.id, RoomId: ratNamespaceData.RoomId } });
                        break;
                    case 'PrintCursor#Request':
                        console.log('PrintCursor#Request')
                        break;
                    default:
                        break;
                }
            }
        })
    }

    /// Push an insight to server
    var pushInsight = function (data) {
        if (_socket != undefined) {
            if (Cross.GetApiKey() != undefined && Cross.GetApiKey().length > 0) {
                _socket.emit('Coplest.Flinger.PushInsight', data);
            }
        }
    }

    var pushScreenshot = function (data) {
        if (_socket != undefined) {
            if (Cross.GetApiKey() != undefined && Cross.GetApiKey().length > 0) {
                _socket.emit('Coplest.Flinger.PushScreenshot', data);
            }
        }
    }

    /// Pull an event when server send a message
    var pullEvent = function (type, data) {
        _socketEvent = new CustomEvent(type, data);

        document.dispatchEvent(_socketEvent);
        /// Example to cath event
        //document.addEventListener("type", handlerFunction, false);
    }

    var getSocket = function () {
        return _socket;
    }

    return {
        Initialize: constructor,
        GetSocket: getSocket,
        PushInsight: pushInsight,
        PushScreenshot: pushScreenshot
    };
})();
var Flinger = (function() {
  var _flingerElement;
  var _debugFlinger;

  var constructor = function() {
    _flingerElement = document.querySelector('[data-flinger]');

    // Check if script is on debug mode
    _debugFlinger = _flingerElement.dataset.debug == undefined ? false : JSON.parse(_flingerElement.dataset.debug);
    if(_debugFlinger === true){
        console.log('Flinger is on debug mode');
    }

    SocketHub.Initialize({Debug : _debugFlinger});
    ScreenshotHub.Initialize({Debug : _debugFlinger});

    // Event Hub definition
    EventHub.Initialize({Debug : _debugFlinger});
    EventHub.ListenMouseClick();
    EventHub.ListenMouseMovement();
    EventHub.ListenMouseScroll();
  }

  return {
      Initialize: constructor,
      GetNotSentMouseClickEvents : EventHub.GetNotSentMouseClickEvents,
      GetNotSentMouseMovementEvents : EventHub.GetNotSentMouseMovementEvents,
      GetNotSentMouseScrollEvents : EventHub.GetNotSentMouseScrollEvents
  };
})()

Flinger.Initialize();