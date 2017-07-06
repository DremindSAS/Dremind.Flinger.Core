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
        script.src = '{BACKEND-URI}/socket.io.js';
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

delete SocketHub;