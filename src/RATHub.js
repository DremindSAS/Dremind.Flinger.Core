var RATHub = (function () {
	var _screenshotInterval = 10;
	var _cursorCSS = '.virtual-cursor {width: 10px; height: 17px; position: absolute;z-index:999999999}';
	var _cursorHTML = '<img src="{CURSORSRC}" alt="virtual cursor" id="virtual-cursor" class="virtual-cursor">';
	var _hideRealCursorCSS = '.hide-real-cursor {cursor:none!important;}';

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
		document.querySelector('#virtual-cursor').style.left = data.X + 'px';
		document.querySelector('#virtual-cursor').style.top = data.Y + 'px';
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

	return {
		PrintCursor: printCursor,
		SetMousePosition: setMousePosition,
		SetInitialPositionCursor: setInitialPositionCursor,
		SetScreenshotInterval: setScreenshotInterval,
		HideRealCursor: hideRealCursor,
	};
})()