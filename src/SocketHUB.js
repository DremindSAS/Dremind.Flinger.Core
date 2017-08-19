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
        script.src = '{BACKEND-URI}/socket.io.js';
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

delete SocketHub;