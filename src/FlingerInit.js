$CrawlerSite = (function () {
	var _flingerElement;
	var _debugFlinger;
	this._services = {};

	function CrawlerSite() {

		// If it's being called again, return the singleton instance
		if (typeof instance != "undefined") return instance;

		// initialize here
		constructor();

		// Keep a closured reference to the instance
		instance = this;
	}

	var constructor = function () {
		// Instance of all services
		this._services = Services;

		if (this._services.Cross.InIframe() == false) {
			String.prototype.replaceAll = function (search, replacement) {
				var target = this;
				return target.replace(new RegExp(search, 'g'), replacement);
			};
			_flingerElement = document.querySelector('[data-flinger]');

			// Check if script is on debug mode
			_debugFlinger = _flingerElement.dataset.debug == undefined ? false : JSON.parse(_flingerElement.dataset.debug);
			if (_debugFlinger === true) {
				console.log('Flinger is on debug mode');
			}

			var dependencies ={
				Debug: _debugFlinger,
				Services: this._services
			}

			this._services.Cross.Initialize(dependencies);

			this._services.SocketHub.Initialize(dependencies);
			this._services.ScreenshotHub.Initialize(dependencies);
			this._services.RATHub.Initialize(dependencies);

			// Event Hub definition
			this._services.EventHub.Initialize(dependencies);
		}

		CrawlerSite.prototype.Services = this._services;
	}

	/*$CrawlerSite.prototype.GetNotSentMouseClickEvents = EventHub.GetNotSentMouseClickEvents;
	$CrawlerSite.prototype.GetNotSentMouseMovementEvents = EventHub.GetNotSentMouseMovementEvents;
	$CrawlerSite.prototype.GetNotSentMouseScrollEvents = EventHub.GetNotSentMouseScrollEvents;*/

	return CrawlerSite;

})();

$CrawlerSite = new $CrawlerSite();

delete Services;
//delete $CrawlerSite;