var RATHub = (function () {

	/// Properties
	var _debug;
	var _screenshotInterval = 10;
	var _cursorCSS = '.virtual-cursor {width: 10px; height: 17px; position: absolute;z-index:999999999;pointer-events: none!important;}';
	var _cursorHTML = '<img src="{CURSORSRC}" alt="virtual cursor" id="virtual-cursor" class="virtual-cursor">';
	var _hideRealCursorCSS = '.hide-real-cursor {cursor:none!important;}';
	var _scrollPos = 0;
	var _cursorPos = { X: 0, Y: 0 };

	/// Initialize component
	var constructor = function (params) {
		if (params != undefined) {
			_debug = params.Debug;
		}
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
				console.log(selectedElement);
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
		_screenshotInterval = data.Interval;
	}

	var setScrollDelta = function (data) {
		if (data.Delta != undefined && data.Delta != null) {
			var step = 80;
			var currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
			_scrollPos = (currentPosition + (step * (data.Delta)) * -1);

			window.scrollTo(0, _scrollPos);
			setMousePosition(_cursorPos);
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
	};
})()