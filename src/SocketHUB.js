var SocketHub = (function() {

    /// Properties
    var _debug;
    var _socket;  
    var _socketEvent;

    /// Initialize component
    var constructor = function(params){
        if(params != undefined){
            _debug = params.Debug;
        }

        injectSocketClientLibrary();
    }

    var injectSocketClientLibrary = function() {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = socketLibrary_loaded;
        script.src = 'https://cdn.socket.io/socket.io-1.4.5.js';
        head.appendChild(script);
    }

    /// When Socket library is loaded 
    var socketLibrary_loaded = function(){
        connectSocket();
        if(_debug !== undefined){
            if(_debug){
                console.log('Socket Library is loaded succesfully');
            }
        }
    }

    /// Connection to Socket Server
    var connectSocket = function(){
        if(_debug !== undefined){
            if(_debug){
                console.log('Connecting to server...');
            }
        }
        _socket = io(Cross.GetServerUri());
        socketDefinition();
    }

    /// Define all events from socket
    var socketDefinition = function(){
        _socket.on('connect', function(){
            if(_debug !== undefined){
                if(_debug){
                    console.log('Connection to server succesfully');
                }
            }            

            pullEvent('SocketConnected')
        });
        _socket.on('Coplest.Flinger.ServerEvent', function(data){
            pullEvent(data.Command, data.Values)
        });
        _socket.on('disconnect', function(){
            if(_debug !== undefined){
                if(_debug){
                    console.log('Disconected from server')
                }
            }
        });
    }
    
    /// Push an insight to server
    var pushInsight = function(data){
        if(_socket != undefined){
            if(Cross.GetApiKey() != undefined && Cross.GetApiKey().length > 0){
                _socket.emit('Coplest.Flinger.PushInsight', data);
            }          
        }
    }

    var pushScreenshot = function(data){
        if(_socket != undefined){
            if(Cross.GetApiKey() != undefined && Cross.GetApiKey().length > 0){
                _socket.emit('Coplest.Flinger.PushScreenshot', data);
            }   
        }
    }

    /// Pull an event when server send a message
    var pullEvent = function(type, data){
        _socketEvent = new CustomEvent(type, data);

        document.dispatchEvent(_socketEvent);
        // Example to cath event
        //document.addEventListener("type", handlerFunction, false);
    }

    var getSocket = function(){
        return _socket;
    }

    return {
        Initialize : constructor,
        GetSocket : getSocket,
        PushInsight : pushInsight
    };
})()