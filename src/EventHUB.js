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
            Location: {}
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
            Location: {}
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
            Location: {}
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
})()