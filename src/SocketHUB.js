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
})()