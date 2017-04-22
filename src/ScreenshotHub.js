var ScreenshotHub = (function () {
    /// Properties
    var _debug;
    var _isOnDescoveryMode;

    /// Initialize component
    var constructor = function (params) {
        if (params != undefined) {
            _debug = params.Debug;
        }
        injecthtml2canvasLibrary();
        getIfSiteIsInDiscoveryMode();
    }

    var injecthtml2canvasLibrary = function () {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = injecthtml2canvasSVGLibrary;
        script.src = '{KERNEL-URI}/build/assets/html2canvas.min.js';
        head.appendChild(script);
    }

    var injecthtml2canvasSVGLibrary = function () {
        var head = document.getElementsByTagName('head')[0];
        var script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.onload = html2canvasLibrary_loaded;
        script2.src = '{KERNEL-URI}/build/assets/html2canvas.svg.min.js';
        head.appendChild(script2);
    }

    var html2canvasLibrary_loaded = function () {
        var body = document.getElementsByTagName('body')[0];
        var div = document.createElement('div');
        div.id = 'screenshot-result';
        div.style.display = "none";

        if (_debug !== undefined) {
            if (_debug) {
                console.log('html2canvas Library is loaded succesfully');
                div.style.display = "block";

            }
        }
        body.appendChild(div);
        takeScreenshot(function () {
            if (_isOnDescoveryMode == true) {
                saveScreenshot();
            }
        });
    }

    var takeScreenshot = function (callback) {
        if (_debug !== undefined) {
            if (_debug) {
                console.log('takeScreenshot');
            }
        }
        html2canvas(document.body, {
            onrendered: function (html2canvasResult) {
                if (_debug !== undefined) {
                    if (_debug) {
                        console.log('takeScreenshot then');
                    }
                }
                /*var maxWidth = 850;
                var ratio = maxWidth / html2canvasResult.width;
                var height = html2canvasResult.height * ratio;
                var width = html2canvasResult.width * ratio

                var _canvas = document.createElement("canvas");
                _canvas.width = width;
                _canvas.height = height;

                var ctx = _canvas.getContext("2d");
                ctx.scale(ratio, ratio);
                ctx.drawImage(html2canvasResult, 0, 0);
                ctx.save();

                var base64Result = _canvas.toDataURL('image/jpeg', 1);*/
                //document.querySelector(".img-responsive").setAttribute('src', base64Result);
                document.getElementById('screenshot-result').appendChild(html2canvasResult);

                callback(html2canvasResult.toDataURL());
            }
        });
    }

    var saveScreenshot = function () {
        if (_isOnDescoveryMode) {
            var canvas = document.querySelector('#screenshot-result>canvas');

            SocketHub.PushScreenshot({ Command: 'Scroll', Values: { Base64Data: canvas.toDataURL(), Endpoint: document.location.pathname, ApiKey: Cross.GetApiKey() } })
        }
    }

    var getIfSiteIsInDiscoveryMode = function () {
        var endpoint = '/api/Site/DiscoveryMode/' + Cross.GetApiKey();

        function reqListener() {
            _isOnDescoveryMode = JSON.parse(this.responseText).result == undefined ? false : JSON.parse(this.responseText).result;
        }

        var ajaxRequest = new XMLHttpRequest();
        ajaxRequest.addEventListener("load", reqListener);
        ajaxRequest.open("GET", Cross.GetServerUri() + endpoint);
        ajaxRequest.send();
    }

    /* ====== NEW CODE */

    function urlsToAbsolute(nodeList) {
		if (!nodeList.length) {
			return [];
		}

		var attrName = 'href';
		if (nodeList[0].__proto__ === HTMLImageElement.prototype ||
			nodeList[0].__proto__ === HTMLScriptElement.prototype) {
			attrName = 'src';
		}

		nodeList = [].map.call(nodeList, function (el, i) {
			var attr = el.getAttribute(attrName);
			// If no src/href is present, disregard.
			if (!attr) {
				return;
			}

			var absURL = /^(https?|data):/i.test(attr);
			if (absURL) {
				return el;
			} else {
				// Set the src/href attribute to an absolute version. 
				// if (attr.indexOf('/') != 0) { // src="images/test.jpg"
				//        el.setAttribute(attrName, document.location.origin + document.location.pathname + attr);
				//      } else if (attr.match(/^\/\//)) { // src="//static.server/test.jpg"
				//        el.setAttribute(attrName, document.location.protocol + attr);
				//      } else {
				//        el.setAttribute(attrName, document.location.origin + attr);
				//      }

				// Set the src/href attribute to an absolute version. Accessing
				// el['src']/el['href], the browser will stringify an absolute URL, but
				// we still need to explicitly set the attribute on the duplicate.
				el.setAttribute(attrName, el[attrName]);
				return el;
			}
		});
		return nodeList;
	}

	// TODO: current limitation is css background images are not included.
	function screenshotPage() {
		// 1. Rewrite current doc's imgs, css, and script URLs to be absolute before
		// we duplicate. This ensures no broken links when viewing the duplicate.
		urlsToAbsolute(document.images);
		urlsToAbsolute(document.querySelectorAll("link[rel='stylesheet']"));
		urlsToAbsolute(document.scripts);

		// 2. Duplicate entire document.
		var screenshot = document.documentElement.cloneNode(true);

		// Use <base> to make anchors and other relative links absolute.
		var b = document.createElement('base');
		b.href = document.location.protocol + '//' + location.host;
		var head = screenshot.querySelector('head');
		head.insertBefore(b, head.firstChild);

		// 3. Screenshot should be readyonly, no scrolling, and no selections.
		screenshot.style.pointerEvents = 'none';
		screenshot.style.overflow = 'hidden';
		screenshot.style.webkitUserSelect = 'none';
		screenshot.style.mozUserSelect = 'none';
		screenshot.style.msUserSelect = 'none';
		screenshot.style.oUserSelect = 'none';
		screenshot.style.userSelect = 'none';

		// 4. Preserve current x,y scroll position of this page. See addOnPageLoad_().
		screenshot.dataset.scrollX = window.scrollX;
		screenshot.dataset.scrollY = window.scrollY;

		// 4.5. When the screenshot loads (e.g. as ablob URL, as iframe.src, etc.),
		// scroll it to the same location of this page. Do this by appending a
		// window.onDOMContentLoaded listener which pulls out the saved scrollX/Y
		// state from the DOM.
		var script = document.createElement('script');
		script.textContent = '(' + addOnPageLoad_.toString() + ')();'; // self calling.
		screenshot.querySelector('body').appendChild(script);

		// 5. Create a new .html file from the cloned content.
		var blob = new Blob([screenshot.outerHTML], { type: 'text/html' });

		return blob;
	}

	// NOTE: Not to be invoked directly. When the screenshot loads, it should scroll
	// to the same x,y location of this page.
	function addOnPageLoad_() {
		window.addEventListener('DOMContentLoaded', function (e) {
			var scrollX = document.documentElement.dataset.scrollX || 0;
			var scrollY = document.documentElement.dataset.scrollY || 0;
			window.scrollTo(scrollX, scrollY);
		});
	}

    return {
        Initialize: constructor,
        TakeScreenshot: takeScreenshot,
        TakeDOMScreenshot: screenshotPage,
    };
})();