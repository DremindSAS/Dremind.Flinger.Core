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

    /**
     * Function: Constructor
     * This function initialize this component and setting up principal members
     * @param {object} dependencies - Injected dependencies
     */
    var constructor = function (dependencies) {
        if (dependencies != undefined) {
            this._debug = dependencies.Debug;
            this._cross = dependencies.Services.Cross;
        }
    }

    /**
     * Event: GetIfLastScreenshotIsObsoleteByApiKey#Response
     * This event scrape webpage again if is obsolete or hasn't snapshot
     * @param {object} result - Get response from backend where the result member is true or false
     */
    document.addEventListener("GetIfLastScreenshotIsObsoleteByApiKey#Response", function (result) {
        if (result.detail.data != undefined && result.detail.data != null) {
            if(result.detail.data.success === true){
                if(result.detail.data.result === true){
                    $CrawlerSite.Services.ScreenshotHub.TakeAll(result.detail.context);
                }
            }
        }
    });

    /**
     * Event: SocketConnected
     * This event is emited to all services and is the flag to send data to server or Initialize components from server
     * @param {object} data - contains current context
     */
    document.addEventListener('SocketConnected', function(data){
        data.detail.context._services.ScreenshotHub.CheckIfScreenshotIsObsolete(data.detail.context);
    })

    /**
     * Function: Take
     * This function take a snapshot with all components that user see
     * @param {object} context - Current context
     * @param {function} next - Callback to anounce that task is completed
     */
    var take = function (context, next) {
        snapshot(context._services.ScreenshotHub.screenshotType.seen, function (blob) {
            saveScreenshot(context, {
                blob: blob,
                screenshotType: context._services.ScreenshotHub.screenshotType.seen
            });
        });
    }

    /**
     * Function: TakeAll
     * This function take a snapshot with all components in the page
     * @param {object} context - Current context
     * @param {function} next - Callback to anounce that task is completed
     */
    var takeAll = function (context, next) {
        snapshot(context._services.ScreenshotHub.screenshotType.allPage, context, function (blob) {
            saveScreenshot(context,{
                blob: blob,
                screenshotType: context._services.ScreenshotHub.screenshotType.allPage
            });
        });
    }

    /**
     * Function: Snapshot
     * Take a snapshot with settings as parameters, documentation is inside function
     * @param {number} screenshotType - Check if is all page or seen
     * @param {object} context - Current context
     * @param {function} next - Callback to anounce that task is completed
     */
    var snapshot = function (screenshotType, context, next) {
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
        
        if (screenshotType === _services.ScreenshotHub.screenshotType.seen) {
            var script = document.createElement('script');
            script.textContent = '(' + addOnPageLoad_.toString() + ')();'; // self calling.
            screenshot.querySelector('body').appendChild(script);
        }

        // 5. Create a new .html file from the cloned content.
        var blob = new Blob([screenshot.outerHTML], { type: 'text/html' });

        // 6. Return in a callback the clone
        next(blob);
    }

    /**
     * Function: urlsToAbsolute
     * Convert all URI's to absolute URI, e.g.: '/profile.jpg' to 'http://somepath.com/profile.jpg'
     * @param {[mixed]} nodeList - Is an array that contains all nodes to convert to absolute URI's
     */
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

    /**
     * Function SaveScreenshot
     * This function send to SocketHub all data and consequently it sends to the backend
     * @param {object} context - current context
     * @param {object} data - screenshot as blob and type of screenshot
     */
    var saveScreenshot = function (context, data) {
        $CrawlerSite.Services.SocketHub.Screenshot({
            Command: 'PushScreenshot#Request',
            Values: {
                Timestamp: context._cross.TimeStamp(),
                Screenshot: data.blob,
                Endpoint: context._cross.GetClientInformation().endpoint,
                ApiKey: context._cross.GetApiKey(),
                Type: data.screenshotType,
            }
        });
    }

    /**
     * Function CheckIfIsObsolete
     * This function send a request to backend if has current snapshot or is obsolete
     * @param {object} context - current context
     */
    var checkIfIsObsolete = function (context) {
        $CrawlerSite.Services.SocketHub.Screenshot({
            Command: 'GetIfLastScreenshotIsObsoleteByApiKey#Request',
            Values: {
                ApiKey: context._cross.GetApiKey()
            }
        });
    }

    return {
        Initialize: constructor,
        Take: take,
        TakeAll: takeAll,
        CheckIfScreenshotIsObsolete: checkIfIsObsolete,
    }

}();

Services.ScreenshotHub = new ScreenshotHub();

delete ScreenshotHub;