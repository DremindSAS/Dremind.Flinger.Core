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

			var dependencies = {
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

function onLoadDocument() {
	// quit if this function has already been called
	if (arguments.callee.done) return;

	// flag this function so we don't do the same thing twice
	arguments.callee.done = true;

	// kill the timer
	if (_timer) clearInterval(_timer);

	$CrawlerSite = new $CrawlerSite();

	delete Services;
};

/* for Mozilla/Opera9 */
if (document.addEventListener) {
	document.addEventListener("DOMContentLoaded", onLoadDocument, false);
}

/* for Internet Explorer */
/*@cc_on @*/
/*@if (@_win32)
  document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
  var script = document.getElementById("__ie_onload");
  script.onreadystatechange = function() {
    if (this.readyState == "complete") {
      onLoadDocument(); // call the onload handler
    }
  };
/*@end @*/

/* for Safari */
if (/WebKit/i.test(navigator.userAgent)) { // sniff
	var _timer = setInterval(function () {
		if (/loaded|complete/.test(document.readyState)) {
			onLoadDocument(); // call the onload handler
		}
	}, 10);
}

/* for other browsers */
window.onload = onLoadDocument;

//delete $CrawlerSite;