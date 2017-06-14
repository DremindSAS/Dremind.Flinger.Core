var RATHub = (function () {

	/// Properties
	var _debug;
	var _screenshotIntervalTime = 5000;
	var _screenshotInterval = null;
	var _cursorCSS = '.virtual-cursor {width: 10px; height: 17px; position: absolute;z-index:999999999;pointer-events: none!important;}';
	var _cursorHTML = '<img src="{CURSORSRC}" alt="virtual cursor" id="virtual-cursor" class="virtual-cursor">';
	var _hideRealCursorCSS = '.hide-real-cursor {cursor:none!important;}';
	var _scrollPos = 0;
	var _cursorPos = { X: 0, Y: 0 };
	var _roomId = '';

	/// Initialize component
	var constructor = function (params) {
		if (params != undefined) {
			_debug = params.Debug;
		}
	}

	var injectModal = function (socketData) {
		_roomId = socketData.RoomId;
		injectModernizrScript(function () {
			injectModalStyles(function () {
				injectModalScripts(function () {
					injectModalHTML(function () {
						var $CrawlerSite = Cross.GetFlingerObj();
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
								Cross.RemoveJSCSSfile("modernizr.custom.js", "js");
								Cross.RemoveJSCSSfile("dialog.css", "css");
								Cross.RemoveJSCSSfile("dialogFx.js", "js");
								Cross.GetFlingerObj().RATDialog = undefined;

								callback();
							}
						}

						Cross.SetFlingerObj($CrawlerSite);

						Cross.GetFlingerObj().RATDialog.Initialize();
						Cross.GetFlingerObj().RATDialog.SetData();

						document.getElementById('allow-control').onclick = function () {
							allowControl();
						}

						document.getElementById('deny-control').onclick = function () {
							denyControl();
						}

						Cross.GetFlingerObj().RATDialog.Toggle();
					});
				});
			});
		})

	}

	var denyControl = function () {
		Cross.GetFlingerObj().RATDialog.Destroy(function () {
			SocketHub.PushEventRAT({ Command: 'UserDenyControl#Response', Values: { RoomId: _roomId } });
			//SocketHub.ConnectUserPoolNamespaceSocket();
		})
	}

	var allowControl = function () {
		Cross.GetFlingerObj().RATDialog.Destroy(function () {
			SocketHub.PushEventRAT({ Command: 'UserAllowControl#Response', Values: { RoomId: _roomId } });

			var dom = ScreenshotHub.TakeDOMScreenshot();
			SocketHub.PushEventRAT({ Command: 'UserScreenshot#Request', Values: { RoomId: _roomId, Screenshot: dom, UserBrowserScreen: Cross.GetClientInformation().browserSize, CurrentUserPath: Cross.GetClientInformation().absoluteUri, CurrentWindowTitle: Cross.GetClientInformation().windowTitle } });
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
		link.href = '{KERNEL-URI}/build/assets/dialog.css';

		var head = document.getElementsByTagName('head')[0];
		head.appendChild(link);
	}

	var injectModalScripts = function (callback) {
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.onload = function () { callback(); };
		script.src = '{KERNEL-URI}/build/assets/dialogFx.js';
		head.appendChild(script);
	}

	var injectModernizrScript = function (callback) {
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.onload = function () { callback(); };
		script.src = '{KERNEL-URI}/build/assets/modernizr.custom.js';
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
			s.styleSheet.cssText = _hideRealCursorCSS;
		} else {
			s.appendChild(document.createTextNode(_hideRealCursorCSS));
		}
		head.appendChild(s);

		var root = document.getElementsByTagName('html')[0];
		root.className += ' hide-real-cursor';
	}

	var setMousePosition = function (data) {
		if ((data.X != undefined && data.X != null) && (data.Y != undefined && data.Y != null)) {
			_cursorPos.X = data.X;
			_cursorPos.Y = data.Y;
			document.querySelector('#virtual-cursor').style.left = _cursorPos.X + 'px';
			document.querySelector('#virtual-cursor').style.top = (_scrollPos + _cursorPos.Y) + 'px';

			var selectedElement = document.elementFromPoint(_cursorPos.X, _cursorPos.Y);
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

			document.elementFromPoint(_cursorPos.X, _cursorPos.Y).dispatchEvent(event);

			var dom = ScreenshotHub.TakeDOMScreenshot();
			SocketHub.PushEventRAT({ Command: 'UserScreenshot#Request', Values: { RoomId: _roomId, Screenshot: dom, UserBrowserScreen: Cross.GetClientInformation().browserSize, CurrentUserPath: Cross.GetClientInformation().absoluteUri, CurrentWindowTitle: Cross.GetClientInformation().windowTitle } });
		}
	}

	var printCursor = function () {
		// Inject virtual cursor style
		var head = document.getElementsByTagName('head')[0];
		var s = document.createElement('style');
		if (s.styleSheet) {   // IE
			s.styleSheet.cssText = _cursorCSS;
		} else {
			s.appendChild(document.createTextNode(_cursorCSS));
		}
		head.appendChild(s);

		var body = document.getElementsByTagName('body')[0];
		var cursor = _cursorHTML.replace('{CURSORSRC}', Cross.GetCoreUri() + '/build/assets/fake_cursor.png');
		var virtualCursor = cursor.toDOM();
		body.appendChild(virtualCursor);
	}

	var setInitialPositionCursor = function (data) {
		setMousePosition(data);
	}

	var setScreenshotInterval = function (data) {
		_screenshotIntervalTime = data.Interval;

		/*_screenshotInterval = setInterval(function(){
			var dom = ScreenshotHub.TakeDOMScreenshot();
			SocketHub.PushEventRAT({Command:'UserScreenshot#Request', Values: {RoomId: _roomId, Screenshot: dom}});
		}, _screenshotIntervalTime);*/

	}

	var setScrollDelta = function (data) {
		if (data.Delta != undefined && data.Delta != null) {
			var step = 80;
			var currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
			console.log(data.Delta);
			
			if(currentPosition == 0 && data.Delta == -1){
				_scrollPos = (currentPosition + (step * (data.Delta)) * -1);

				window.scrollTo(0, _scrollPos);
				setMousePosition(_cursorPos);
			}
			else if (currentPosition > 0) {
				_scrollPos = (currentPosition + (step * (data.Delta)) * -1);

				window.scrollTo(0, _scrollPos);
				setMousePosition(_cursorPos);
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
	};
})()