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

delete EventHub;