ScreenshotHub = function () {
    /// Properties
    this._debug;
    this._cross;
    this.screenshotType = {
        seen: 0,
        allPage: 1,
        partial: 2
    }
};

ScreenshotHub.prototype = function () {

    /// Initialize component
    var constructor = function (params) {
        if (params != undefined) {
            this._debug = params.Debug;
            this._cross = params.Services.Cross;
        }
    }

    var take = function (next) {
        snapshot(this.screenshotType.seen, function (blob) {
            saveScreenshot({
                blob: blob,
                screenshotType: this.screenshotType.seen
            });
        });
    }

    var takeAll = function (next) {
        snapshot(this.screenshotType.allPage, function (blob) {
            saveScreenshot({
                blob: blob,
                screenshotType: this.screenshotType.allPage
            });
        });
    }

    var snapshot = function (screenshotType, next) {
        /// TODO: current limitation is css background images are not included.
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
        //
        // if
        if (screenshotType === this.screenshotType.seen) {
            var script = document.createElement('script');
            script.textContent = '(' + addOnPageLoad_.toString() + ')();'; // self calling.
            screenshot.querySelector('body').appendChild(script);
        }


        // 5. Create a new .html file from the cloned content.
        var blob = new Blob([screenshot.outerHTML], { type: 'text/html' });

        // 6. Return in a callback the clone
        next(blob);
    }

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

    // NOTE: Not to be invoked directly. When the screenshot loads, it should scroll
    // to the same x,y location of this page.
    function addOnPageLoad_() {
        window.addEventListener('DOMContentLoaded', function (e) {
            var scrollX = document.documentElement.dataset.scrollX || 0;
            var scrollY = document.documentElement.dataset.scrollY || 0;
            window.scrollTo(scrollX, scrollY);
        });
    }

    var saveScreenshot = function (data) {
        $CrawlerSite.Services.SocketHub.PushScreenshot({
            Command: 'PushScreenshot',
            Values: {
                Timestamp: this._cross.Timestamp(),
                Screenshot: data.blob,
                Endpoint: this._cross.GetClientInformation().endpoint,
                ApiKey: this._cross.GetApiKey(),
                Type: data.screenshotType,
            }
        });
    }

    return {
        Initialize: constructor,
        Take: take,
        TakeAll: takeAll,
    }

}();

Services.ScreenshotHub = new ScreenshotHub();

delete ScreenshotHub;