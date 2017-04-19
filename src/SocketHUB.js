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
        _socket = io(Cross.GetServerUri() + '/user-pool-namespace', { query: 'ApiKey=' + Cross.GetApiKey() });
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

            _socket.emit('Coplest.Flinger.CanISendData', { ApiKey: Cross.GetApiKey() })
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

    var ratPoolNamespace = function (ratNamespaceValues) {
        console.log(Cross.GetServerUri() + ratNamespaceValues.RPN)
        _ratSocketPoolNamespace = io(Cross.GetServerUri() + ratNamespaceValues.RPN, { query: 'ApiKey=' + Cross.GetApiKey() });
        ratPoolSocketDefinition(ratNamespaceValues);
    }

    var ratPoolSocketDefinition = function (ratNamespaceValues) {
        _ratSocketPoolNamespace.on('connect', function (data) {
            if (_debug !== undefined) {
                if (_debug) {
                    console.log('Connection to RAT Pool Namespace succesfully');
                }
            }
        })

        _ratSocketPoolNamespace.on('Coplest.Flinger.RAT', function (data) {
            if (data.Command != undefined) {
                switch (data.Command) {
                    case 'ConnectedToRPN#Response':
                        if (_debug !== undefined) {
                            if (_debug) {
                                console.log('Socket Event: ConnectedToRPN#Response');
                            }
                        }
                        _socketId = data.Values.SocketId;
                        _ratSocketPoolNamespace.emit('Coplest.Flinger.RAT', { Command: 'ConnectToRATServiceNamespace#Request', Values: { Namespace: ratNamespaceValues.Namespace } }, function (data) {
                            if (_debug !== undefined) {
                                if (_debug) {
                                    console.log('Socket Event: ConnectToRATServiceNamespace#Request');
                                }
                            }
                            ratServiceNamespace(data.Values, ratNamespaceValues);
                        });
                        break;

                    default:
                        break;
                }
            }
        })
    }

    var ratServiceNamespace = function (data, ratNamespaceData) {
        var ns = (Cross.SearchObjectByIdOnArray(ratNamespaceData.Namespace.Id, data.Namespace));
        if (ns != null) {
            console.log('RAT Service Socket URI: ' + Cross.GetServerUri() + '/' + ns.Id);
            _ratServiceSocket = io(Cross.GetServerUri() + '/' + ns.Id, { query: 'ApiKey=' + Cross.GetApiKey() });
            ratServiceSocketDefinition(data, ratNamespaceData);
        }
    }

    var ratServiceSocketDefinition = function (data, ratNamespaceData) {
        _ratServiceSocket.on('Coplest.Flinger.RAT', function (data) {
            if (data.Command != undefined) {
                switch (data.Command) {
                    case 'ConnectedToRSN#Response':
                        if (_debug !== undefined) {
                            if (_debug) {
                                console.log('Socket Event: ConnectedToRSN#Response');
                            }
                        }
                        _socketId = data.Values.SocketId;
                        _ratServiceSocket.emit('Coplest.Flinger.RAT', { Command: 'UserJoinToPrivateRoom#Request', Values: { SocketId: _ratServiceSocket.id, RoomId: ratNamespaceData.RoomId } });
                        break;
                    case 'UserJoinToPrivateRoom#Response':
                        if (_debug !== undefined) {
                            if (_debug) {
                                console.log('Socket Event: UserJoinToPrivateRoom#Response');
                            }
                        }
                        _ratServiceSocket.emit('Coplest.Flinger.RAT', { Command: 'TakeMyUserSocketId#Request', Values: { SocketId: _ratServiceSocket.id, RoomId: ratNamespaceData.RoomId } });
                        break;
                    case 'AllowControl#Request':
                        if (_debug !== undefined) {
                            if (_debug) {
                                console.log('AllowControl#Request');
                            }
                        }
                        RATHub.InjectModal(data.Values);
                        break;
                    case 'HideRealCursor#Request':
                        if (_debug !== undefined) {
                            if (_debug) {
                                console.log('HideRealCursor#Request');
                            }
                        }
                        RATHub.HideRealCursor();
                        break;
                    case 'PrintCursor#Request':
                        if (_debug !== undefined) {
                            if (_debug) {
                                console.log('PrintCursor#Request');
                            }
                        }
                        RATHub.PrintCursor();
                        break;
                    case 'SetInitialPositionCursor#Request':
                        if (_debug !== undefined) {
                            if (_debug) {
                                console.log('SetInitialPositionCursor#Request');
                            }
                        }
                        RATHub.SetInitialPositionCursor(data.Values);
                        break;
                    case 'SetScreenshotInterval#Request':
                        if (_debug !== undefined) {
                            if (_debug) {
                                console.log('SetScreenshotInterval#Request');
                            }
                        }
                        RATHub.SetScreenshotInterval(data.Values);
                        break;
                    case 'SetPositionMouse#Request':
                        if (_debug !== undefined) {
                            if (_debug) {
                                console.log('SetPositionMouse#Request');
                            }
                        }
                        RATHub.SetMousePosition(data.Values);
                        break;
                    case 'SetScrollDelta#Request':
                        if (_debug !== undefined) {
                            if (_debug) {
                                console.log('SetScrollDelta#Request');
                            }
                        }
                        RATHub.SetScrollDelta(data.Values);
                        break;
                    case 'Click#Request':
                        if (_debug !== undefined) {
                            if (_debug) {
                                console.log('Click#Request');
                            }
                        }
                        RATHub.VirtualClick(data.Values);
                        break;
                    default:
                        console.log(data.Command);
                        break;
                }
            }
        })
    }

    var pushEvent = function (data) {
        if (_socket != undefined) {
            if (Cross.GetApiKey() != undefined && Cross.GetApiKey().length > 0) {
                _socket.emit(data.Command, data.Values);
            }
        }
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
        _socketEvent = new CustomEvent(type, { detail: data });

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
        PushScreenshot: pushScreenshot,
        PushEvent: pushEvent,
    };
})()