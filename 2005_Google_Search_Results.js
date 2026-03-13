// ==UserScript==
// @name         2005 Google - Search Results
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  2005-era reskin for Google search results pages
// @author       Sola991
// @match        *://www.google.com/search*
// @match        *://www.google.com/maps/search/*
// @match        *://www.google.com/maps/place/*
// @match        *://www.google.com/maps/dir/*
// @match        *://www.google.com/maps?*
// @match        *://www.google.com/local*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    var RETRO_ICON  = "https://retrogoogle.neocities.org/2001/favicon.png";
    var GOOGLE_LOGO = "https://retrogoogle.neocities.org/2004/logo.gif";

    var path = window.location.pathname;
    var params = new URLSearchParams(window.location.search);
    var tbm = params.get('tbm') || '';
    var udm = params.get('udm') || '';

    if (path.indexOf('/maps') === 0 || path.indexOf('/local') === 0) {
        runLocalResults();
    } else if (tbm === 'isch' || udm === '2') {
        runImagesResults();
    } else if (tbm === 'nws' || udm === '14') {
        runNewsResults();
    } else if (tbm === 'shop' || udm === '28') {
        runFroogleResults();
    } else {
        runGoogleResults();
    }

    // Google Search Results
    function runGoogleResults() {
        function setFaviconOnce() {
            document.querySelectorAll("link[rel*='icon']").forEach(function(el) { el.remove(); });
            var link = document.createElement("link");
            link.rel = "shortcut icon";
            link.type = "image/png";
            link.href = RETRO_ICON;
            document.head.appendChild(link);
        }

        var searchParams = new URLSearchParams(location.search);

        var pollInterval = null;

        function scrapeAndRender() {
            if (pollInterval !== null) {
                clearInterval(pollInterval);
                pollInterval = null;
            }

            var query = searchParams.get("q") || "";

            // Scrape result stats
            var statsNode = document.querySelector("#result-stats");
            var resultCountText = statsNode ? statsNode.innerText : "";

            // Scrape all organic results NOW, before document.open destroys them
            var results = [];
            var titles = document.querySelectorAll("h3.LC20lb");
            titles.forEach(function(h3) {
                var link = h3.closest("a");
                if (!link || !link.href.startsWith("http")) return;

                var wrapper = h3.closest("div.MjjYud");
                var snippet = "";
                if (wrapper) {
                    var snippetNode = wrapper.querySelector("div.VwiC3b");
                    if (snippetNode) snippet = snippetNode.innerText.trim();
                }

                var hostname = "";
                try { hostname = new URL(link.href).hostname.replace(/^www\./, ''); } catch(e) {}

                results.push({
                    href: link.href,
                    title: h3.innerText.trim(),
                    snippet: snippet,
                    url: hostname
                });
            });

            // Pagination
            var currentStart = parseInt(searchParams.get("start")) || 0;
            var currentPage = Math.floor(currentStart / 10) + 1;
            var q = encodeURIComponent(query);

            var paginationHTML = "<div style='font-size:20px;letter-spacing:2px;color:#00c;'>Goooooooooogle</div><br>";
            for (var i = 1; i <= 10; i++) {
                var start = (i - 1) * 10;
                if (i === currentPage) {
                    paginationHTML += "<strong>" + i + "</strong> ";
                } else {
                    paginationHTML += "<a href='/search?q=" + q + "&start=" + start + "'>" + i + "</a> ";
                }
            }
            paginationHTML += "<a href='/search?q=" + q + "&start=" + (currentStart + 10) + "'>Next</a>";

            var resultsHTML = "";
            results.forEach(function(r) {
                var safeTitle   = r.title.replace(/</g,"&lt;").replace(/>/g,"&gt;");
                var safeSnippet = r.snippet.replace(/</g,"&lt;").replace(/>/g,"&gt;");
                var safeURL     = r.url.replace(/</g,"&lt;").replace(/>/g,"&gt;");
                var cacheHref   = "https://webcache.googleusercontent.com/search?q=cache:" + encodeURIComponent(r.href);
                var relatedHref = "/search?q=related:" + encodeURIComponent(r.href);
                resultsHTML +=
                    "<div class='result'>" +
                    "<a href='" + r.href + "' class='title'>" + safeTitle + "</a><br>" +
                    "<span class='snippet'>" + safeSnippet + "</span><br>" +
                    "<span class='url'>" + safeURL + "</span><br>" +
                    "<div class='result-links'>" +
                    "<a href='" + cacheHref + "'>Cached</a> - " +
                    "<a href='" + relatedHref + "'>Similar pages</a>" +
                    "</div></div>";
            });

            var pageHTML =
                "<!DOCTYPE html><html><head>" +
                "<title>" + query.replace(/</g,"&lt;") + " - Google Search</title>" +
                "<style>" +
                "body{font-family:Arial,Helvetica,sans-serif;font-size:13px;margin:0;background:#fff;color:#000;}" +
                "a{color:#0000cc;text-decoration:none;}" +
                "a:hover{text-decoration:underline;}" +
                "a:visited{color:#551a8b;}" +
                "#topbar{padding:10px;border-bottom:1px solid #ccc;}" +
                "#sidebar{width:150px;padding:15px;border-right:1px solid #ddd;float:left;}" +
                "#sidebar a{display:block;margin-bottom:6px;}" +
                "#main{margin-left:180px;padding:20px;}" +
                ".result{margin-bottom:20px;}" +
                ".title{font-size:16px;}" +
                ".url{color:#008000;font-size:13px;}" +
                ".snippet{font-size:13px;}" +
                ".result-links{font-size:13px;}" +
                ".stats{font-size:13px;margin-bottom:15px;color:#666;}" +
                ".pagination{text-align:center;margin-top:30px;font-size:14px;}" +
                ".pagination a{margin:0 4px;}" +
                "</style></head><body>" +

                "<div id='topbar'>" +
                "<img src='https://retrogoogle.neocities.org/2004/logo.gif' width='120' style='vertical-align:middle;'>" +
                " <form style='display:inline;' action='/search' method='GET'>" +
                "<input name='q' value='" + query.replace(/'/g,"&#39;") + "' size='40'>" +
                "<input type='submit' value='Search'>" +
                "</form></div>" +

                "<div id='sidebar'>" +
                "<a href='/search?q=" + q + "'><b>Web</b></a>" +
                "<a href='/search?udm=2&q=" + q + "'>Images</a>" +
                "<a href='/search?tbm=nws&q=" + q + "'>News</a>" +
                "<a href='https://groups.google.com/groups?q=" + q + "'>Groups</a>" +
                "<a href='https://www.google.com/search?tbm=shop&q=" + q + "'>Froogle</a>" +
                "<br>" +
                "<a href='https://www.google.com/advanced_search?q=" + q + "'>Advanced Search</a>" +
                "<a href='https://www.google.com/preferences?hl=en'>Preferences</a>" +
                "</div>" +

                "<div id='main'>" +
                "<div class='stats'>" + resultCountText + "</div>" +
                resultsHTML +
                "<div class='pagination'>" + paginationHTML + "</div>" +
                "</div>" +

                "</body></html>";

            // Null out large variables before document.open
            results = null;
            resultsHTML = null;
            titles = null;

            document.open();
            document.write(pageHTML);
            document.close();

            pageHTML = null;

            setFaviconOnce();
        }

        // Poll until #search exists, with a hard 10s timeout
        var pollCount = 0;
        pollInterval = setInterval(function() {
            pollCount++;
            if (document.querySelector("#search")) {
                scrapeAndRender();
            } else if (pollCount > 40) {
                // 40 * 250ms = 10 seconds, give up
                clearInterval(pollInterval);
                pollInterval = null;
            }
        }, 250);
    }

    // Images Search Results
    function runImagesResults() {
    var searchParams = new URLSearchParams(location.search);

        function forceRetroFavicon() {
            function applyFavicon() {
                var existing = document.querySelector("link[rel*='icon']");
                if (existing && existing.href.startsWith(RETRO_ICON)) return;
                document.querySelectorAll("link[rel*='icon']").forEach(function(el) { el.remove(); });
                var link = document.createElement("link");
                link.rel = "shortcut icon";
                link.type = "image/png";
                link.href = RETRO_ICON;
                document.head.appendChild(link);
            }
            applyFavicon();
            var obs2 = new MutationObserver(applyFavicon);
            obs2.observe(document.head, { childList: true, subtree: true });
        }

        function waitForImages(callback) {
            // If already present, fire immediately
            if (document.querySelectorAll("div[data-lpage]").length > 0) {
                callback();
                return;
            }
            // Otherwise watch for div[data-lpage] elements to appear
            var obs = new MutationObserver(function() {
                if (document.querySelectorAll("div[data-lpage]").length > 0) {
                    obs.disconnect();
                    callback();
                }
            });
            obs.observe(document.body, { childList: true, subtree: true });
        }

        waitForImages(function() {

            var query = searchParams.get("q") || "";
            var currentStart = parseInt(searchParams.get("start")) || 0;
            var currentPage = Math.floor(currentStart / 20) + 1;

            // Grab image results before rewriting
            var imageResults = Array.from(document.querySelectorAll("div[data-lpage]"));

            var statsNode = document.querySelector("#result-stats");
            var resultCountText = statsNode ? statsNode.innerText : "";

            document.open();
            document.write(`
            <html>
            <head>
                <title>Google Image Search</title>
                <style>
                    body {
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 13px;
                        margin: 0;
                        background: #fff;
                        color: #000;
                    }
                    a { color: #0000cc; text-decoration: none; }
                    a:visited { color: #551a8b; }
                    a:hover { text-decoration: underline; }

                    /* ---- TOP BAR ---- */
                    #topbar {
                        padding: 6px 10px;
                        border-bottom: 1px solid #ccc;
                        display: flex;
                        align-items: center;
                        gap: 16px;
                    }
                    #topbar-logo {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        line-height: 1;
                    }
                    #topbar-logo span {
                        font-size: 13px;
                        color: #0000cc;
                        font-weight: bold;
                        margin-top: 2px;
                        margin-left: 2px;
                    }
                    #topbar-right {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                    }
                    #topbar-tabs {
                        font-size: 13px;
                    }
                    #topbar-tabs a {
                        margin-right: 14px;
                        color: #0000cc;
                    }
                    #topbar-tabs .active {
                        font-weight: bold;
                        color: #000;
                        text-decoration: underline;
                    }
                    #topbar-search {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }
                    #topbar-search input[type="text"] {
                        width: 280px;
                        font-size: 13px;
                    }
                    #topbar-search input[type="submit"] {
                        font-size: 13px;
                    }
                    #topbar-links {
                        font-size: 12px;
                    }
                    #topbar-links a { margin-right: 10px; }
                    #safesearch {
                        font-size: 12px;
                        margin-top: 2px;
                    }

                    /* ---- RESULTS HEADER BAR ---- */
                    #results-header {
                        background: #e5ecf9;
                        border-top: 1px solid #aac;
                        border-bottom: 1px solid #aac;
                        padding: 5px 10px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 13px;
                    }
                    #results-header .left {
                        font-size: 15px;
                        font-weight: bold;
                    }
                    #results-header .right {
                        font-size: 12px;
                        text-align: right;
                    }
                    #results-header .right a { color: #0000cc; }
                    #results-header .right strong { font-weight: bold; }

                    /* ---- IMAGE GRID ---- */
                    #image-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 30px 20px;
                        padding: 20px 30px;
                    }
                    .img-item {
                        text-align: center;
                        font-size: 12px;
                        line-height: 1.5;
                    }
                    .img-item a img {
                        border: 2px solid #0033cc;
                        padding: 2px;
                        background: white;
                        max-width: 150px;
                        max-height: 120px;
                    }
                    .img-item .img-filename {
                        font-weight: bold;
                    }
                    .img-item .img-dims {
                        color: #000;
                    }
                    .img-item .img-domain {
                        color: #008000;
                    }

                    /* ---- PAGINATION ---- */
                    #pagination {
                        text-align: center;
                        margin: 20px 0 10px 0;
                        font-size: 14px;
                    }
                    #pagination .goog-text {
                        font-size: 22px;
                        letter-spacing: 1px;
                    }
                    #pagination .result-page-label {
                        font-size: 13px;
                        margin-right: 4px;
                    }
                    #pagination a { color: #cc0000; margin: 0 2px; }
                    #pagination strong { color: #cc0000; margin: 0 2px; }
                    #pagination .next-link {
                        color: #0000cc;
                        font-size: 14px;
                        margin-left: 6px;
                        font-weight: bold;
                    }

                    /* ---- BOTTOM SEARCH BAR ---- */
                    #bottom-search {
                        background: #e5ecf9;
                        border-top: 1px solid #aac;
                        border-bottom: 1px solid #aac;
                        padding: 12px;
                        text-align: center;
                        margin-top: 10px;
                    }
                    #bottom-search input[type="text"] {
                        width: 280px;
                        font-size: 13px;
                    }
                    #bottom-search input[type="submit"] {
                        font-size: 13px;
                    }
                    #bottom-search-links {
                        margin-top: 6px;
                        font-size: 12px;
                    }
                    #bottom-search-links a { color: #0000cc; }

                    /* ---- FOOTER ---- */
                    #footer {
                        text-align: center;
                        padding: 16px;
                        font-size: 12px;
                        color: #000;
                    }
                    #footer a { color: #0000cc; margin: 0 4px; }
                </style>
            </head>
            <body>

            <!-- TOP BAR -->
            <div id="topbar">
                <div id="topbar-logo">
                    <img src="https://retrogoogle.neocities.org/2004/logo.gif" width="80" alt="Google">
                    <span>Images</span>
                </div>
                <div id="topbar-right">
                    <div id="topbar-tabs">
                        <a href="/webhp?hl=en&tab=iw">Web</a>
                        <span class="active">Images</span>
                        <a href="https://groups.google.com/grphp?hl=en&tab=ig">Groups</a>
                        <a href="/nwshp?hl=en&tab=in">News</a>
                        <a href="/frghp?hl=en&tab=if">Froogle</a>
                        <a href="/desktophere?hl=en&tab=id">Desktop</a>
                        <a href="/options/"><b>more »</b></a>
                    </div>
                    <div id="topbar-search">
                        <form action="/search" method="GET" style="display:inline;">
                            <input type="hidden" name="tbm" value="isch">
                            <input type="hidden" name="hl" value="en">
                            <input type="text" name="q" value="${query}">
                            <input type="submit" value="Search">
                        </form>
                        <div id="topbar-links">
                            <a href="/advanced_image_search?hl=en">Advanced Image Search</a>
                            &nbsp;&nbsp;
                            <a href="/preferences?hl=en">Preferences</a>
                        </div>
                    </div>
                    <div id="safesearch">
                        <a href="/search?tbm=isch&q=${encodeURIComponent(query)}&safe=active">SafeSearch is off</a>
                    </div>
                </div>
            </div>

            <!-- RESULTS HEADER -->
            <div id="results-header">
                <div class="left">Images</div>
                <div class="right">
                    ${resultCountText}<br>
                    Show: <strong>All sizes</strong> -
                    <a href="/search?tbm=isch&q=${encodeURIComponent(query)}&imgsz=large">Large</a> -
                    <a href="/search?tbm=isch&q=${encodeURIComponent(query)}&imgsz=medium">Medium</a> -
                    <a href="/search?tbm=isch&q=${encodeURIComponent(query)}&imgsz=small">Small</a>
                </div>
            </div>

            <!-- IMAGE GRID -->
            <div id="image-grid"></div>

            <!-- PAGINATION -->
            <div id="pagination"></div>

            <!-- BOTTOM SEARCH BAR -->
            <div id="bottom-search">
                <form action="/search" method="GET">
                    <input type="hidden" name="tbm" value="isch">
                    <input type="hidden" name="hl" value="en">
                    <input type="text" name="q" value="${query}" size="40">
                    <input type="submit" value="Search">
                </form>
                <div id="bottom-search-links">
                    <a href="/search?tbm=isch&q=${encodeURIComponent(query)}&swin=1">Search within results</a>
                    &nbsp;|&nbsp;
                    <a href="/help/faq_images.html">Image Search Help</a>
                </div>
            </div>

            <!-- FOOTER -->
            <div id="footer">
                <a href="https://www.google.com/">Google Home</a> -
                <a href="/ads/">Advertising Programs</a> -
                <a href="/services/">Business Solutions</a> -
                <a href="/intl/en/about.html">About Google</a>
                <br><br>
                <font size="-2">©2005 Google</font>
            </div>

            </body>
            </html>
            `);
            document.close();

            forceRetroFavicon();

            /* ---- POPULATE IMAGE GRID ---- */
            var grid = document.getElementById("image-grid");

            imageResults.forEach(function(container) {
                var img = container.querySelector("img");
                if (!img || !img.src) return;

                var destUrl = container.getAttribute("data-lpage") || "#";
                var altText = img.alt || "image";

                var fullPath = "";
                var filename = altText;

                try {
                    var u = new URL(destUrl);
                    var domain = u.hostname.replace(/^www\./, '');
                    var imgpath = u.pathname;
                    fullPath = domain + imgpath;
                    if (fullPath.length > 35) fullPath = domain + "/.../" + imgpath.split("/").pop();
                } catch(e) {}

                var item = document.createElement("div");
                item.className = "img-item";
                item.innerHTML = `
                    <a href="${destUrl}">
                        <img src="${img.src}" alt="${altText}">
                    </a>
                    <div>
                        <span class="img-filename">${filename}</span><br>
                        <span class="img-dims">Unknown size - ?k</span><br>
                        <span class="img-domain">${fullPath}</span>
                    </div>
                `;
                grid.appendChild(item);
            });

            /* ---- PAGINATION ---- */
            var pagination = document.getElementById("pagination");

            var googText = '<span class="goog-text">' +
                '<font color="#3366cc">G</font><font color="#cc0000">o</font><font color="#ffcc00">o</font><font color="#3366cc">o</font><font color="#33cc33">o</font><font color="#cc0000">o</font><font color="#ffcc00">o</font><font color="#3366cc">o</font><font color="#33cc33">o</font><font color="#cc0000">o</font><font color="#ffcc00">g</font><font color="#3366cc">l</font><font color="#33cc33">e</font>' +
                '</span> &#9658;';

            var pageLinks = '<span class="result-page-label">Result Page:</span>';
            for (var i = 1; i <= 10; i++) {
                var start = (i - 1) * 20;
                if (i === currentPage) {
                    pageLinks += "<strong>" + i + "</strong>";
                } else {
                    pageLinks += "<a href='/search?tbm=isch&q=" + encodeURIComponent(query) + "&start=" + start + "'>" + i + "</a>";
                }
            }
            pageLinks += "<a class='next-link' href='/search?tbm=isch&q=" + encodeURIComponent(query) + "&start=" + (currentStart + 20) + "'>Next</a>";

            pagination.innerHTML = googText + "<br>" + pageLinks;

        });
    }

    // News Search Results
    function runNewsResults() {
        var params = new URLSearchParams(location.search);
        var NEWS_LOGO  = "https://retrogooglemobile.neocities.org/Google%20News_files/news.gif";

        function forceRetroFavicon() {
            function applyFavicon() {
                document.querySelectorAll("link[rel*='icon']").forEach(function(el) { el.remove(); });
                var link = document.createElement("link");
                link.rel = "shortcut icon";
                link.type = "image/png";
                link.href = RETRO_ICON;
                document.head.appendChild(link);
            }
            applyFavicon();
            var observer = new MutationObserver(applyFavicon);
            obs2.observe(document.head, { childList: true, subtree: true });
            setTimeout(function() { observer.disconnect(); }, 5000);
        }

        function getNewsContainers() {
            // try multiple selectors — Google changes these
            var c = document.querySelectorAll("[data-news-doc-id]");
            if (c.length) return c;
            c = document.querySelectorAll("div.SoaBEf, div.ftSUBd");
            if (c.length) return c;
            c = document.querySelectorAll("article, div[data-hveid] a.WlydOe");
            if (c.length) return c;
            return [];
        }

        function waitForResults(callback) {
            var fired = false;
            var attempts = 0;
            var interval = setInterval(function() {
                attempts++;
                var containers = getNewsContainers();
                if (containers.length >= 1 || attempts >= 40) {
                    clearInterval(interval);
                    interval = null;
                    if (!fired && containers.length > 0) {
                        fired = true;
                        setTimeout(callback, 800);
                    }
                }
            }, 500);
        }

        waitForResults(function() {
            // Kill Google's scripts immediately to free memory before we scrape
            document.querySelectorAll("script").forEach(function(s) { s.remove(); });

            var query = params.get("q") || "";
            var start = parseInt(params.get("start") || "0");

            // Scrape result stats
            var statsNode = document.querySelector("#result-stats");
            var resultCountText = statsNode ? statsNode.innerText.replace(/\(.*?\)/, "").trim() : "";

            // Scrape all news results
            var containers = getNewsContainers();
            var results = [];
            containers.forEach(function(container) {
                var anchor = container.querySelector("a.WlydOe");
                if (!anchor || !anchor.href) return;
                var href = anchor.href;

                var sourceEl = container.querySelector(".NUnG9d");
                var source = sourceEl ? sourceEl.innerText.trim() : "";

                var timeEl = container.querySelector(".OSrXXb, .ZE0LJd, .UOVeFe");
                var time = timeEl ? timeEl.innerText.trim() : "";

                // Snippet: full anchor text minus source prefix
                var fullText = anchor.innerText.trim();
                var title = fullText;
                if (source && fullText.startsWith(source)) {
                    title = fullText.substring(source.length).trim();
                }
                // Trim off trailing snippet if it bleeds in
                var snippetEl = container.querySelector(".lSfe4c, .GI74Re");
                var snippet = snippetEl ? snippetEl.innerText.trim() : "";
                if (snippet.startsWith(source)) snippet = snippet.substring(source.length).trim();
                if (snippet.startsWith(title)) snippet = snippet.substring(title.length).trim();
                snippet = snippet.replace(/^[\s\-]+/, "").trim();

                // Store image but cap at 20KB to avoid memory crash
                var imgEl = container.querySelector("img");
                var imgSrc = "";
                if (imgEl && imgEl.src && imgEl.src.length < 15000) imgSrc = imgEl.src;
                imgEl = null;

                results.push({ href: href, title: title, source: source, time: time, snippet: snippet, imgSrc: imgSrc });
            });

            // Scrape top stories from sidebar if present
            var topStoriesLinks = [];
            document.querySelectorAll("a.WlydOe").forEach(function(a) {
                if (topStoriesLinks.length >= 8) return;
                var src = a.closest("[data-news-doc-id]");
                if (!src) return;
                var srcName = src.querySelector(".NUnG9d");
                topStoriesLinks.push({
                    href: a.href,
                    text: (a.innerText || "").split("\n")[0].trim().substring(0, 60)
                });
            });

            // Build pagination
            var prevLink = start >= 10 ?
                "<a href='/search?tbm=nws&q=" + encodeURIComponent(query) + "&start=" + (start - 10) + "'>&lt; Previous</a>" : "";
            var nextLink = results.length >= 8 ?
                "<a href='/search?tbm=nws&q=" + encodeURIComponent(query) + "&start=" + (start + 10) + "'>Next &gt;</a>" : "";
            var pageNum = Math.floor(start / 10) + 1;
            var paginationNums = "";
            var minPage = Math.max(1, pageNum - 2);
            var maxPage = minPage + 9;
            for (var p = minPage; p <= maxPage; p++) {
                var pStart = (p - 1) * 10;
                if (p === pageNum) {
                    paginationNums += "<b>" + p + "</b> ";
                } else {
                    paginationNums += "<a href='/search?tbm=nws&q=" + encodeURIComponent(query) + "&start=" + pStart + "'>" + p + "</a> ";
                }
            }

            // Build results HTML
            var resultsHTML = "";
            results.forEach(function(r) {
                // Only use base64 images under ~15KB (short src strings)
                var imgHTML = "";
                if (r.imgSrc && r.imgSrc.length > 0 && r.imgSrc.length < 20000) {
                    imgHTML = "<img src='" + r.imgSrc + "' width='64' height='48' style='float:right;margin:0 0 4px 8px;border:1px solid #ccc;'>";
                }
                resultsHTML +=
                    "<div style='margin-bottom:16px;overflow:hidden;border-bottom:1px solid #efefef;padding-bottom:12px;'>" +
                    imgHTML +
                    "<a href='" + r.href + "' style='font-size:15px;font-weight:bold;color:#0000cc;text-decoration:none;'>" + r.title + "</a><br>" +
                    "<span style='color:#008000;font-size:12px;'>" + r.source + "</span>" +
                    (r.time ? " <span style='color:#666;font-size:12px;'>- " + r.time + "</span>" : "") + "<br>" +
                    (r.snippet ? "<span style='font-size:13px;'>" + r.snippet + "</span><br>" : "") +
                    "<span style='font-size:12px;'>" +
                    "<a href='/search?tbm=nws&q=" + encodeURIComponent(r.title.substring(0, 50)) + "'>All " + r.source + " articles &raquo;</a>" +
                    "</span>" +
                    "</div>";
            });

            results = null;

            // Build sidebar - top stories + category links
            var sidebarStories = "";
            topStoriesLinks.slice(0, 6).forEach(function(s) {
                sidebarStories += "<div style='margin-bottom:5px;font-size:12px;'><a href='" + s.href + "'>" + s.text + "</a></div>";
            });

            topStoriesLinks = null;

            var topCat = [
                ["Top Stories", "rgb(102,137,203)", "https://news.google.com/home?hl=en-US&gl=US&ceid=US:en", ""],
            ];
            var restCats = [
                ["Starred",      "rgb(25,85,143)",  "https://news.google.com/home?hl=en-US&gl=US&ceid=US:en", "&#9733; "],
                ["World",        "#ffcc00",         "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen", ""],
                ["General New York", "#999999",     "https://news.google.com/home?hl=en-US&gl=US&ceid=US:en", ""],
                ["U.S.",         "#000088",         "https://news.google.com/topics/CAAqIggKIhxDQkFTRHdvSkwyMHZNRGxqTjNjd0VnSmxiaWdBUAE?hl=en-US&gl=US&ceid=US%3Aen", ""],
                ["Business",     "#008000",         "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen", ""],
                ["Sci/Tech",     "#cc0000",         "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen", ""],
                ["Entertainment","#663399",         "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen", ""],
                ["Health",       "#669999",         "https://news.google.com/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRZU0FtVnVLQUFQAQ?hl=en-US&gl=US&ceid=US%3Aen", ""],
            ];

            function buildCatHTML(cats) {
                var html = "";
                cats.forEach(function(c) {
                    html +=
                        "<div style='display:flex;align-items:center;margin-bottom:3px;'>" +
                        "<div style='width:6px;height:14px;background:" + c[1] + ";margin-right:4px;flex-shrink:0;'></div>" +
                        "<a href='" + c[2] + "' style='font-size:12px;color:#000;font-weight:bold;'>" + c[3] + c[0] + "</a>" +
                        "</div>";
                });
                return html;
            }
            var catTopStories = buildCatHTML(topCat);
            var catRest = buildCatHTML(restCats);
            var catHTML = catTopStories + catRest; // for nulling later

            // Write the page
            document.open();
            document.write(
                "<!DOCTYPE html><html><head><title>Google News - " + query + "</title>" +
                "<meta charset='utf-8'>" +
                "<style>" +
                "body{font-family:Arial,Helvetica,sans-serif;font-size:13px;margin:0;background:#fff;color:#000;}" +
                "a{color:#0000cc;text-decoration:none;}" +
                "a:hover{text-decoration:underline;}" +
                "a:visited{color:#551a8b;}" +
                "#topbar{background:#fff;padding:4px 8px;border-bottom:2px solid #aa0033;}" +
                "#topbar-nav{font-size:13px;padding:2px 0 2px 140px;}" +
                "#topbar-nav a{margin-right:12px;color:#000;}" +
                "#topbar-nav a.active{color:#aa0033;font-weight:bold;text-decoration:underline;}" +
                "#layout{display:flex;}" +
                "#sidebar{width:140px;min-width:140px;padding:8px;border-right:1px solid #ccc;font-size:12px;}" +
                "#main{flex:1;padding:10px 16px;max-width:680px;}" +
                ".section-hd{display:none;}" +
                "</style>" +
                "</head><body>" +

                // Top bar
                "<div id='topbar'>" +
                "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr>" +
                "<td width='140' valign='middle' rowspan='2'>" +
                "<a href='https://news.google.com/home?hl=en-US&gl=US&ceid=US:en'>" +
                "<img src='" + NEWS_LOGO + "' alt='Google News' border='0' width='140' height='58'></a></td>" +
                "<td valign='bottom' style='padding-left:10px;'>" +
                "<table border='0' cellpadding='0' cellspacing='0'><tr>" +
                "<td><a href='https://www.google.com/'>Web</a>&nbsp;&nbsp;</td>" +
                "<td><a href='/search?tbm=isch&q=" + encodeURIComponent(query) + "'>Images</a>&nbsp;&nbsp;</td>" +
                "<td><a href='https://groups.google.com/groups?q=" + encodeURIComponent(query) + "'>Groups</a>&nbsp;&nbsp;</td>" +
                "<td><b><u>News</u></b>&nbsp;&nbsp;</td>" +
                "<td><a href='https://www.google.com/search?tbm=shop&q=" + encodeURIComponent(query) + "'>Froogle</a>&nbsp;&nbsp;</td>" +
                "<td><a href='https://www.google.com/search?q=" + encodeURIComponent(query) + "&tbm=lcl'>Local</a>&nbsp;&nbsp;</td>" +
                "<td><a href='https://www.google.com/search?q=" + encodeURIComponent(query) + "&num=100'>more &raquo;</a></td>" +
                "</tr></table></td>" +
                "<td align='right' valign='bottom' style='padding-right:8px;'>" +
                "<a href='/search?tbm=nws&q=" + encodeURIComponent(query) + "&as_qdr=d'>Advanced News Search</a>" +
                "</td></tr>" +
                "<tr><td colspan='2' style='padding-left:10px;padding-top:4px;'>" +
                "<form action='/search' method='GET'>" +
                "<input type='hidden' name='tbm' value='nws'>" +
                "<input type='text' name='q' value='" + query.replace(/'/g, "&#39;") + "' size='40' style='font-size:13px;'>" +
                "&nbsp;<input type='submit' value='Search News' style='font-size:12px;'>" +
                "&nbsp;<input type='submit' name='btnG' value='Search the Web' style='font-size:12px;' onclick=\"this.form.tbm.value=''\">" +
                "</form></td><td></td></tr>" +
                "<tr><td colspan='3' style='padding-left:150px;'>" +
                "<font size='-1' color='#aa0033'><b>Search and browse 4,500 news sources updated continuously.</b></font>" +
                "</td></tr>" +
                "</table></div>" +

                // Layout
                "<div id='layout'>" +

                // Sidebar
                "<div id='sidebar'>" +
                catTopStories +
                "<br>" +
                sidebarStories +
                "<br>" +
                catRest +
                "<br><div style='border-top:1px solid #ccc;padding-top:6px;'>" +
                "<a href='https://news.google.com/home?hl=en-US&gl=US&ceid=US:en' style='font-size:12px;'>Google News Home</a>" +
                "</div></div>" +

                // Main results
                "<div id='main'>" +
                "<table width='100%' border='0' cellpadding='0' cellspacing='0'><tr>" +
                "<td><b style='font-size:16px;'>News results for <i>" + query + "</i></b></td>" +
                "<td align='right' nowrap><font size='-1' color='#666'>" + resultCountText + "</font></td>" +
                "</tr></table>" +
                "<hr size='1' color='#ccc' style='margin:4px 0 10px 0;'>" +
                resultsHTML +

                // Pagination
                "<div style='text-align:center;margin-top:16px;font-size:13px;'>" +
                prevLink + " " + paginationNums + " " + nextLink +
                "</div>" +
                "</div></div>" + // end main, layout

                "<div style='text-align:center;padding:10px;font-size:11px;color:#666;border-top:1px solid #ccc;margin-top:10px;'>" +
                "&copy;2005 Google - <a href='https://www.google.com/'>Google Home</a> - " +
                "<a href='https://www.google.com/about.html'>About Google</a> - " +
                "<a href='https://news.google.com/intl/en_us/about_google_news.html'>About Google News</a>" +
                "</div>" +
                "</body></html>"
            );
            document.close();
            // Free memory
            results = null;
            topStoriesLinks = null;
            resultsHTML = null;
            sidebarStories = null;
            catHTML = null;
            forceRetroFavicon();
        });
    }

    // Froogle Search Results
    function runFroogleResults() {
        var searchParams = new URLSearchParams(location.search);
        var FROOGLE_LOGO = "data:image/gif;base64,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";

        function setFaviconOnce() {
            document.querySelectorAll("link[rel*='icon']").forEach(function(el) { el.remove(); });
            var link = document.createElement("link");
            link.rel = "shortcut icon";
            link.type = "image/png";
            link.href = RETRO_ICON;
            document.head.appendChild(link);
        }

        var pollInterval = null;
        var pollCount = 0;

        function detectResults() {
            return document.querySelectorAll("div.pla-unit-container").length > 0 &&
                   document.querySelectorAll("a.plantl").length > 0;
        }

        function scrapeAndRender() {
            if (pollInterval !== null) {
                clearInterval(pollInterval);
                pollInterval = null;
            }

            if (!document.querySelector("div.pla-unit-container")) return;

            var query = searchParams.get("q") || "";
            var currentStart = parseInt(searchParams.get("start")) || 0;
            var currentPage = Math.floor(currentStart / 20) + 1;

            // Scrape result stats
            var statsText = "";
            var statsNode = document.querySelector("#result-stats, .HypWnf, .LHJvCe");
            if (statsNode) statsText = statsNode.textContent.trim();

            // Scrape product cards
            var cards = document.querySelectorAll("div.pla-unit-container");
            var products = [];

            cards.forEach(function(card) {
                var linkEl = card.querySelector("a.plantl");
                var href = linkEl ? linkEl.href : "#";
                var titleEl = card.querySelector("div.bXPcId div");
                var title = titleEl ? (titleEl.textContent || "").trim() : "";
                if (!title) return;

                var priceEl = card.querySelector("span.VbBaOe");
                var price = priceEl ? (priceEl.textContent || "").trim() : "";

                var storeEl = card.querySelector("div.UsGWMe");
                var store = storeEl ? (storeEl.textContent || "").trim() : "";

                // Try multiple spec sources
                var desc = "";
                // Try aria-label on the card link for full description
                var ariaEl = card.querySelector("[aria-label]");
                if (ariaEl) {
                    var aria = ariaEl.getAttribute("aria-label") || "";
                    if (aria.length > 10) desc = aria.slice(0, 120);
                }
                // Fallback: unclassed spans
                if (!desc) {
                    var specSpans = card.querySelectorAll("span:not([class])");
                    var specs = [];
                    specSpans.forEach(function(s) {
                        var t = (s.textContent || "").trim();
                        if (t && t !== "·" && t.length > 2) specs.push(t);
                    });
                    desc = specs.slice(0, 4).join(" · ");
                }

                var imgSrc = "";
                var imgEl = card.querySelector("img");
                if (imgEl) {
                    var src = imgEl.src || imgEl.getAttribute("data-src") || "";
                    if (src.indexOf("data:") === 0) {
                        if (src.length < 15000) imgSrc = src;
                    } else {
                        imgSrc = src;
                    }
                }

                products.push({ title: title, href: href, price: price, store: store, desc: desc, img: imgSrc });
            });

            // Build pagination URLs preserving all session params
            function pageLink(label, start) {
                var p = new URLSearchParams(location.search);
                p.set("start", start);
                var url = "https://www.google.com/search?" + p.toString();
                return "<a href='" + url + "'>" + label + "</a>";
            }

            var q = encodeURIComponent(query);

            function sidebarSection(label) {
                return "<table width='100%' cellspacing='0' cellpadding='2' border='0' style='margin-right:-1px;'><tbody>" +
                       "<tr><td bgcolor='#e5ecf9' width='100%'><font size='-1'><b>" + label + "</b></font></td></tr>" +
                       "</tbody></table>";
            }

            var sidebarHTML =
                sidebarSection("View") +
                "<font size='-2'>&nbsp;&gt; <b>List view</b><br>" +
                "&nbsp;&nbsp;&nbsp;<a href='https://www.google.com/search?udm=28&q=" + q + "'>Grid view</a></font><br><br>" +
                sidebarSection("Sort By") +
                "<font size='-2'>&nbsp;&gt; <b>Best match</b><br>" +
                "&nbsp;&nbsp;&nbsp;<a href='https://www.google.com/search?udm=28&q=" + q + "&tbs=p_ord:p'>Price: low to high</a><br>" +
                "&nbsp;&nbsp;&nbsp;<a href='https://www.google.com/search?udm=28&q=" + q + "&tbs=p_ord:pd'>Price: high to low</a></font><br><br>" +
                sidebarSection("Price Range") +
                "<font size='-2'>" +
                "<form action='https://www.google.com/search' method='GET' style='margin:0;padding:2px 0;'>" +
                "<input type='hidden' name='udm' value='28'>" +
                "<input type='hidden' name='q' value='" + query.replace(/'/g,"&#39;") + "'>" +
                "$ <input type='text' name='min_price' size='5' style='width:40px;'><br>" +
                "to $ <input type='text' name='max_price' size='5' style='width:40px;'><br>" +
                "<input type='submit' value='Go' style='font-size:10px;margin-top:2px;'>" +
                "</form></font><br>" +
                sidebarSection("Group By") +
                "<font size='-2'>&nbsp;&gt; <b>Store</b><br>" +
                "&nbsp;&nbsp;&nbsp;<a href='https://www.google.com/search?udm=28&q=" + q + "'>Show All Products</a></font><br><br>" +
                sidebarSection("Search within") +
                "<font size='-2'>&nbsp;&gt; <a href='https://www.google.com/search?udm=28&q=" + q + "'>All Categories</a></font>";

            var resultsHTML = "";
            if (products.length === 0) {
                resultsHTML = "<font size='-1'>No products found. <a href='https://www.google.com/search?udm=28&q=" + q + "'>Try again</a>.</font>";
            } else {
                products.forEach(function(p) {
                    var safeTitle = p.title.replace(/</g,"&lt;").replace(/>/g,"&gt;");
                    var safePrice = p.price.replace(/</g,"&lt;").replace(/>/g,"&gt;");
                    var safeStore = p.store.replace(/</g,"&lt;").replace(/>/g,"&gt;");
                    var safeDesc  = p.desc.replace(/</g,"&lt;").replace(/>/g,"&gt;");
                    var safeHref  = p.href.replace(/'/g, "%27");

                    var imgCell = p.img
                        ? "<td width='70' valign='top' style='padding-right:8px;'>" +
                          "<img src='" + p.img + "' width='60' style='border:1px solid #cccccc;max-height:60px;'></td>"
                        : "<td width='70' valign='top' style='padding-right:8px;'>" +
                          "<table width='60' height='60' cellspacing='0' cellpadding='0' border='1' bordercolor='#cccccc'>" +
                          "<tbody><tr><td align='center' valign='middle'><font size='-2' color='#999999'>image<br>not<br>available</font></td></tr>" +
                          "</tbody></table></td>";

                    resultsHTML +=
                        "<table width='100%' cellspacing='0' cellpadding='4' border='0'><tbody><tr>" +
                        imgCell +
                        "<td valign='top'>" +
                        "<a href='" + safeHref + "' style='color:#0000cc;'><b>" + safeTitle + "</b></a><br>" +
                        (safePrice ? "<font color='#009933'><b>" + safePrice + "</b></font>" : "") +
                        (safeStore ? " - <font size='-1' color='#000000'>" + safeStore + "</font>" : "") + "<br>" +
                        (safeDesc  ? "<font size='-1'>" + safeDesc + "</font><br>" : "") +
                        (safeStore ? "<font size='-2'>[ <a href='https://www.google.com/search?udm=28&q=" + encodeURIComponent(p.store) + "&seller=" + encodeURIComponent(p.store) + "' style='color:#008000;'>More from " + safeStore + "</a> ]</font>" : "") +
                        "</td></tr></tbody></table>" +
                        "<hr size='1' color='#eeeeee' style='margin:0;'>";
                });
            }

            var paginationHTML = "<center><font size='-1'>";
            if (currentPage > 1) {
                paginationHTML += pageLink("&lt; Previous", (currentPage - 2) * 20) + " &nbsp;";
            }
            for (var i = 1; i <= 10; i++) {
                var s = (i - 1) * 20;
                if (i === currentPage) {
                    paginationHTML += "<b>" + i + "</b> ";
                } else {
                    paginationHTML += pageLink(i, s) + " ";
                }
            }
            paginationHTML += "&nbsp;" + pageLink("Next &gt;", currentPage * 20);
            paginationHTML += "</font></center>";

            var pageHTML =
                "<!DOCTYPE html><html><head>" +
                "<meta http-equiv='content-type' content='text/html; charset=UTF-8'>" +
                "<title>" + query.replace(/</g,"&lt;") + " - Froogle Search</title>" +
                "<style>" +
                "body,td,div,a,p,font{font-family:arial,sans-serif;}" +
                "body{background:#ffffff;color:#000000;margin:0;font-size:13px;}" +
                "a{color:#0000cc;text-decoration:none;}" +
                "a:visited{color:#551a8b;}" +
                "a:hover{text-decoration:underline;}" +
                "input{font-family:arial,sans-serif;font-size:11px;}" +
                "</style>" +
                "</head><body>" +

                "<table width='100%' cellspacing='0' cellpadding='4' bgcolor='#ffffff' border='0'><tbody><tr>" +
                "<td valign='middle' nowrap>" +
                "<a href='https://www.google.com/shopping'>" +
                "<img src='" + FROOGLE_LOGO + "' width='138' height='55' border='0' alt='Froogle'>" +
                "</a></td>" +
                "<td valign='middle'>" +
                "<form action='https://www.google.com/search' method='GET' style='margin:0;'>" +
                "<input type='hidden' name='udm' value='28'>" +
                "<input name='q' value='" + query.replace(/'/g,"&#39;") + "' size='40' maxlength='256'>" +
                " <input type='submit' value='Search Froogle'>" +
                " <input type='submit' name='btnWeb' value='Search the Web' onclick=\"this.form.elements['udm'].value='';\">" +
                "</form></td>" +
                "<td align='right' valign='top' nowrap>" +
                "<font size='-2'><a href='https://www.google.com/shopping?advanced_search'>Advanced Froogle Search</a><br>" +
                "<a href='https://www.google.com/preferences?hl=en'>Preferences</a></font>" +
                "</td></tr></tbody></table>" +

                "<table width='100%' cellspacing='0' cellpadding='0' border='0'><tbody><tr>" +
                "<td><table cellspacing='0' cellpadding='4' border='0'><tbody><tr>" +
                "<td><font size='-1'><a href='https://www.google.com/search?q=" + q + "'>Web</a></font></td>" +
                "<td><font size='-1'><a href='https://www.google.com/search?tbm=isch&q=" + q + "'>Images</a></font></td>" +
                "<td><font size='-1'><a href='https://groups.google.com/groups?q=" + q + "'>Groups</a></font></td>" +
                "<td><font size='-1'><a href='https://www.google.com/search?tbm=nws&q=" + q + "'>News</a></font></td>" +
                "<td style='border-top:2px solid #3366cc;padding:4px;'><font size='-1'><b>Froogle</b></font></td>" +
                "<td><font size='-1'><a href='https://www.google.com/maps?q=" + q + "'>Local</a>&nbsp;<font color='red' size='-2'><b>New!</b></font></font></td>" +
                "</tr></tbody></table></td>" +
                "</tr></tbody></table>" +

                "<table width='100%' height='3' cellspacing='0' cellpadding='0' border='0'>" +
                "<tbody><tr><td bgcolor='#8cb254'></td></tr></tbody></table>" +

                "<table width='100%' cellspacing='0' cellpadding='3' border='0'>" +
                "<tbody><tr><td bgcolor='#daf6cb'><font size='-1'><b>&nbsp;Froogle</b></font></td></tr></tbody></table>" +

                "<table width='100%' cellspacing='0' cellpadding='0' border='0'><tbody><tr>" +
                "<td width='150' valign='top' style='padding:8px 0 8px 8px;border-right:2px solid #b7f394;'>" +
                sidebarHTML + "</td>" +
                "<td valign='top' style='padding:10px;'>" +
                (function() {
                    var startNum = currentStart + 1;
                    var endNum = currentStart + products.length;
                    // Extract just the number from statsText e.g. "About 50,000 results" -> "50,000"
                    var totalStr = "";
                    if (statsText) {
                        var m = statsText.match(/([\d,]+)/);
                        if (m) totalStr = m[1];
                    }
                    var secs = (Math.random() * 0.4 + 0.1).toFixed(2);
                    return "<font size='-1'>Results <b>" + startNum + "</b> - <b>" + endNum + "</b>" +
                        (totalStr ? " of about <b>" + totalStr + "</b>" : "") +
                        " for <b>" + query.replace(/</g,"&lt;") + "</b>. (" + secs + " seconds)</font><br><br>";
                })() +
                resultsHTML +
                "<br>" + paginationHTML + "</td>" +
                "<td width='200' valign='top' style='padding:8px;border-left:1px solid #dddddd;padding-top:0;'>" +
                "<table width='100%' cellspacing='0' cellpadding='2' border='0'><tbody>" +
                "<tr><td height='28'></td></tr>" +
                "<tr><td bgcolor='#e5ecf9'><font size='-2'><b>Sponsored Links</b></font></td></tr>" +
                "<tr><td><font size='-2'><br>" +
                "<a href='https://www.google.com/search?udm=28&q=" + q + "'><b>Shop for " + query.replace(/</g,"&lt;") + "</b></a><br>" +
                "Compare prices from hundreds<br>of stores in one place.<br>" +
                "<font color='#008000'>www.google.com/shopping</font>" +
                "</font></td></tr></tbody></table></td>" +
                "</tr></tbody></table>" +

                "<center><br><font size='-2'>" +
                "<a href='https://www.google.com/'>Google Home</a> - " +
                "<a href='https://www.google.com/shopping/merchants/'>Information for Merchants</a> - " +
                "<a href='https://www.google.com/about.html'>About Google</a><br>" +
                "&copy;2005 Google</font></center>" +
                "</body></html>";

            products = null;
            resultsHTML = null;
            sidebarHTML = null;

            document.documentElement.innerHTML = pageHTML;
            pageHTML = null;
            setFaviconOnce();
        }

        pollInterval = setInterval(function() {
            pollCount++;
            if (detectResults()) {
                clearInterval(pollInterval);
                pollInterval = null;
                setTimeout(scrapeAndRender, 500);
            } else if (pollCount > 80) {
                clearInterval(pollInterval);
                pollInterval = null;
            }
        }, 250);
    }

    // Local Search Results
    function runLocalResults() {
    var LOCAL_LOGO = "https://retrogooglemobile.neocities.org/Google%20Local_files/local_res_logo3.gif";
        // Map compass icon used in 2005 layout (small image above "See results on map")
        var MAP_ICON   = "https://retrogooglemobile.neocities.org/Google%20Local_files/map_icon.gif";

        function setFaviconOnce() {
            document.querySelectorAll("link[rel*='icon']").forEach(function(el) { el.remove(); });
            var link = document.createElement("link");
            link.rel = "shortcut icon";
            link.type = "image/png";
            link.href = RETRO_ICON;
            document.head.appendChild(link);
        }

        var path = window.location.pathname;
        var isPlace = path.indexOf('/maps/place/') !== -1;
        var isDir   = path.indexOf('/maps/dir/')   !== -1;
        var isQParam = !isPlace && !isDir && path === '/maps';
        var query   = "";

        // ?q= param URLs (e.g. google.com/maps?q=Syracuse)
        if (isQParam) {
            var urlParamsQ = new URLSearchParams(window.location.search);
            query = urlParamsQ.get("q") || "";
            if (!query) return;
        }

        if (isPlace) {
            var placeMatch = path.match(/\/maps\/place\/([^@\/]+)/);
            if (placeMatch) {
                query = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
            }
        } else if (isDir) {
            var dirMatch = path.match(/\/maps\/dir\/([^\/]*)\/?(.*)/);
            if (dirMatch) {
                var fromStr = decodeURIComponent(dirMatch[1] || '').replace(/\+/g, ' ').trim();
                var toStr   = decodeURIComponent((dirMatch[2] || '').split('/')[0] || '').replace(/\+/g, ' ').trim();
                query = (fromStr && toStr) ? fromStr + ' to ' + toStr : (toStr || fromStr);
            }
        } else if (!isQParam) {
            var searchMatch = path.match(/\/maps\/search\/(.+)/);
            if (searchMatch) {
                query = decodeURIComponent(searchMatch[1]).replace(/\+/g, ' ');
            } else {
                var urlParamsFb = new URLSearchParams(window.location.search);
                query = urlParamsFb.get("q") || urlParamsFb.get("query") || "";
            }
        }

        if (!query) return;

        if (isPlace) {
            var placeSegMatch = path.match(/\/maps\/place\/([^@\/]+)/);
            var placeRaw = placeSegMatch ? decodeURIComponent(placeSegMatch[1]).replace(/\+/g, ' ') : query;
            var parts = placeRaw.split(',');
            var placeName = parts[0].trim();
            var placeAddr = parts.slice(1).join(',').trim();
            query = placeRaw;
            buildPage([{
                label: 'A',
                name: placeName,
                addr: placeAddr,
                phone: '',
                category: '',
                href: window.location.href,
                searchQ: query
            }]);
            return;
        }

        var POLL_MS  = 300;
        var POLL_MAX = 120; // 36s — Mypal is slow
        var pollCount = 0;
        var pollInterval = null;

        function detectResults() {
            return document.querySelectorAll('div.Nv2PK').length > 0;
        }

        function safeText(s) {
            return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        }

        function textOf(el) {
            return el ? (el.textContent || el.innerText || '').trim() : '';
        }

        function scrapeListPage() {
            var results = [];
            var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var cards = document.querySelectorAll('div.Nv2PK');
            cards.forEach(function(card, idx) {
                if (idx >= 10) return;

                var name = '';
                var nameEl = card.querySelector('div.qBF1Pd') ||
                             card.querySelector('span.fontHeadlineSmall') ||
                             card.querySelector('div.fontHeadlineSmall');
                if (nameEl) name = textOf(nameEl);
                if (!name) {
                    var spans = card.querySelectorAll('span');
                    for (var si = 0; si < spans.length; si++) {
                        var st = textOf(spans[si]);
                        if (st.length > 2 && st.length < 80) { name = st; break; }
                    }
                }
                if (!name) return;

                var addr = '';
                var infoSpans = card.querySelectorAll('div.W4Efsd span,div.W4Efsd');
                infoSpans.forEach(function(s) {
                    if (addr) return;
                    var t = textOf(s);
                    if (t.match(/^\d/) || t.match(/\b(St|Ave|Blvd|Dr|Rd|Ln|Way|Ct|Pl|Hwy|Pkwy)\b/i)) {
                        addr = t;
                    }
                });

                var phone = '';
                var telEl = card.querySelector('a[href^="tel:"]');
                if (telEl) phone = textOf(telEl);

                var category = '';
                var catEl = card.querySelector('span.DkEaL');
                if (catEl) category = textOf(catEl);

                var href = '';
                var linkEl = card.querySelector('a[href*="maps/place"]') || card.querySelector('a');
                if (linkEl) href = linkEl.href || '';

                // Build a plausible "Related Web Pages" search query
                var searchQ = name + (addr ? ' ' + addr : '');

                results.push({
                    label: labels[idx] || String(idx + 1),
                    name: name,
                    addr: addr,
                    phone: phone,
                    category: category,
                    href: href,
                    searchQ: searchQ
                });
            });
            return results;
        }

        function buildPage(results) {
            var q    = safeText(query);
            var qEnc = encodeURIComponent(query);

            // Parse "WHAT near WHERE" for display in the yellow bar
            var nearMatch = query.match(/^(.+?)\s+near\s+(.+)$/i);
            var whatPart = nearMatch ? nearMatch[1].trim() : query;
            var nearPart = nearMatch ? nearMatch[2].trim() : '';
            var qDisplay = nearPart
                ? "Searched the web for <b>" + safeText(whatPart) + "</b> near <b>" + safeText(nearPart) + "</b>."
                : "Searched the web for <b>" + q + "</b>.";

            // Results rows — 3-column layout: Name+phone, Address, Related Web Pages
            var rowsHTML = '';
            if (results.length === 0) {
                rowsHTML =
                    "<tr><td colspan='3' style='padding:8px 4px;font-size:small;'>" +
                    "<p>Your search &mdash; <b>" + q + "</b> &mdash; did not match any local results.</p>" +
                    "<p><b>Suggestions:</b><br>" +
                    "&bull; Make sure all words are spelled correctly.<br>" +
                    "&bull; Try different keywords.<br>" +
                    "&bull; Try a more general search.</p>" +
                    "</td></tr>";
            } else {
                results.forEach(function(r, i) {
                    var rowBg = (i % 2 === 0) ? "#fff" : "#f9f9f9";
                    var nameCell =
                        "<a href='" + r.href.replace(/'/g,'%27') + "' style='font-weight:bold;'>" +
                        safeText(r.name) + "</a>";
                    if (r.phone) nameCell += "<br>" + safeText(r.phone);
                    if (r.category) nameCell += "<br><span style='color:#666;font-size:x-small;'>" + safeText(r.category) + "</span>";

                    var addrCell = safeText(r.addr);
                    if (r.addr) {
                        addrCell += "<br><a href='https://www.google.com/maps/dir//" +
                            encodeURIComponent(r.name + (r.addr ? ', ' + r.addr : '')) +
                            "' style='color:#0000cc;font-size:x-small;'>Directions</a>";
                    }

                    // Related web pages — link to Google web search for this business
                    var relEnc = encodeURIComponent(r.searchQ || r.name);
                    var relCell =
                        "<a href='https://www.google.com/search?q=" + relEnc + "'>" +
                        "How to find <b>" + safeText(r.name) + "</b></a><br>" +
                        "<span style='color:#666;font-size:x-small;'>" +
                        "... find info about <b>" + safeText(r.name) + "</b> " +
                        "and <a href='https://www.google.com/search?q=" + relEnc + "' style='color:#0000cc;'>more related pages &raquo;</a>" +
                        "</span>";

                    rowsHTML +=
                        "<tr bgcolor='" + rowBg + "' valign='top'>" +
                        // Marker letter
                        "<td width='18' align='center' style='padding:5px 3px 5px 4px;'>" +
                        "<table width='16' height='16' cellpadding='0' cellspacing='0' " +
                        "style='border:1px solid #666;background:#c53929;'>" +
                        "<tr><td align='center' valign='middle'>" +
                        "<font color='#fff' size='-2'><b>" + r.label + "</b></font>" +
                        "</td></tr></table>" +
                        "</td>" +
                        "<td style='padding:5px 12px 8px 2px;border-bottom:1px solid #ebebeb;' width='200'>" +
                        nameCell +
                        "</td>" +
                        "<td style='padding:5px 12px 8px 2px;border-bottom:1px solid #ebebeb;' width='200'>" +
                        addrCell +
                        "</td>" +
                        "<td style='padding:5px 8px 8px 2px;border-bottom:1px solid #ebebeb;'>" +
                        relCell +
                        "</td>" +
                        "</tr>";
                });
            }

            var mapsLink = "https://www.google.com/maps/search/" + qEnc;

            var pageHTML =
                "<!DOCTYPE html><html><head>" +
                "<meta http-equiv='content-type' content='text/html; charset=UTF-8'>" +
                "<title>" + q + " - Google Local</title>" +
                "<style>" +
                "body,td,a,p,div,input{font-family:Arial,sans-serif;font-size:small;}" +
                "body{background:#fff;color:#000;margin:0;padding:0;}" +
                "a:link{color:#0000cc;}" +
                "a:visited{color:#551a8b;}" +
                "a:active{color:red;}" +
                "a:hover{text-decoration:underline;}" +
                "form{margin:0;padding:0;}" +
                "input{font-size:small;}" +

                // Top nav bar
                "#topnav{background:#fff;padding:2px 4px;border-bottom:1px solid #6f6f6f;" +
                "  font-size:x-small;text-align:right;}" +
                "#topnav a{color:#0000cc;margin-left:6px;}" +

                // Logo + search bar row
                "#searchbar{padding:4px 8px;border-bottom:1px solid #cccccc;background:#fff;}" +
                "#searchbar table{border-collapse:collapse;}" +

                // Tab bar (Web Images Groups News Froogle Local more)
                "#tabbar{border-bottom:1px solid #cccccc;padding:0 8px;background:#fff;}" +
                ".gtab{display:inline-block;padding:3px 8px 4px 8px;font-size:small;" +
                "  border:1px solid transparent;vertical-align:bottom;margin-bottom:-1px;" +
                "  white-space:nowrap;}" +
                ".gtab-sel{border-color:#cccccc;border-bottom-color:#fff;background:#fff;font-weight:bold;color:#000;}" +
                ".gtab-unsel a{color:#0000cc;text-decoration:none;}" +
                ".gtab-unsel a:hover{text-decoration:underline;}" +

                // Yellow titlebar
                "#titlebar{border-top:2px solid #ff9900;background:#ffeac0;" +
                "  padding:3px 8px;font-size:small;}" +
                "#titlebar a{color:#0000cc;}" +
                "#rad-links a{color:#0000cc;font-size:x-small;}" +

                // Map link row
                "#maprow{padding:5px 8px;font-size:small;border-bottom:1px solid #e0e0e0;" +
                "  background:#fff;}" +
                "#maprow a{color:#0000cc;}" +

                // Results table header
                ".res-hdr{font-size:x-small;font-weight:bold;color:#000;padding:3px 12px 3px 0;" +
                "  border-bottom:2px solid #cccccc;background:#e5ecf9;}" +

                // Footer
                "#footer{margin-top:16px;padding:4px 8px;font-size:x-small;color:#666;" +
                "  border-top:1px solid #e0e0e0;text-align:center;}" +
                "#footer a{color:#0000cc;}" +
                "</style>" +
                "</head><body>" +

                "<div id='topnav'>" +
                "<a href='https://www.google.com/help/maps/'>Local Search Help</a>" +
                "</div>" +

                "<div id='searchbar'>" +
                "<table cellpadding='0' cellspacing='0'><tbody><tr valign='middle'>" +
                // Logo
                "<td style='padding-right:12px;'>" +
                "<a href='https://www.google.com/maps'>" +
                "<img src='" + LOCAL_LOGO + "' width='100' height='37' alt='Google Local' border='0'></a>" +
                "</td>" +
                // Search inputs
                "<td>" +
                "<form onsubmit='return doSearch(this)'>" +
                "<table cellpadding='0' cellspacing='0'><tbody>" +
                "<tr valign='bottom'>" +
                "<td><input name='q' type='text' size='20' value='" + safeText(whatPart).replace(/'/g,'&#39;') + "' maxlength='2048'></td>" +
                "<td width='4'></td>" +
                "<td><input name='near' type='text' size='16' value='" + safeText(nearPart).replace(/'/g,'&#39;') + "' maxlength='2048'></td>" +
                "<td width='4'></td>" +
                "<td><input type='submit' value='Google Search'></td>" +
                "<td style='padding-left:10px;font-size:x-small;'>" +
                "<a href='" + mapsLink + "'>See this on Google Maps</a>" +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td><span style='font-size:x-small;color:#666;'>Search terms</span></td>" +
                "<td></td>" +
                "<td><span style='font-size:x-small;color:#666;'>US address, city &amp; state, or zip</span></td>" +
                "<td></td><td></td>" +
                "<td><label style='font-size:x-small;'><input type='checkbox' name='saveloc'> Save location</label></td>" +
                "</tr>" +
                "</tbody></table>" +
                "</form>" +
                "</td>" +
                "</tr></tbody></table>" +
                "</div>" +

                "<div id='tabbar'>" +
                "<span class='gtab gtab-unsel'><a href='https://www.google.com/search?q=" + qEnc + "'>Web</a></span>" +
                "<span class='gtab gtab-unsel'><a href='https://www.google.com/search?tbm=isch&q=" + qEnc + "'>Images</a></span>" +
                "<span class='gtab gtab-unsel'><a href='https://groups.google.com/groups?q=" + qEnc + "'>Groups</a></span>" +
                "<span class='gtab gtab-unsel'><a href='https://www.google.com/search?tbm=nws&q=" + qEnc + "'>News</a></span>" +
                "<span class='gtab gtab-unsel'><a href='https://www.google.com/search?tbm=shop&q=" + qEnc + "'>Froogle</a></span>" +
                "<span class='gtab gtab-sel'>Local</span>" +
                "<span class='gtab gtab-unsel'><a href='https://www.google.com/search?q=" + qEnc + "'>more &raquo;</a></span>" +
                "</div>" +

                "<div id='titlebar'>" +
                "<table width='100%' cellpadding='0' cellspacing='0'><tr>" +
                "<td>" + qDisplay + "&nbsp;&nbsp;" +
                "<span id='rad-links'>Search within: " +
                "<a href='" + mapsLink + "'>1 mile</a> &ndash; " +
                "<a href='" + mapsLink + "'>5 miles</a> &ndash; " +
                "<a href='" + mapsLink + "'>15 miles</a> &ndash; " +
                "<a href='" + mapsLink + "'>45 miles</a>" +
                "</span>" +
                "</td>" +
                "</tr></table>" +
                "</div>" +

                (results.length > 0
                    ? "<div id='maprow'>" +
                      "<a href='" + mapsLink + "'>" +
                      "<img src='https://www.google.com/images/icons/product/maps-16.png' " +
                      "width='16' height='16' border='0' alt='' style='vertical-align:middle;margin-right:4px;'>" +
                      "See these results on a map of this region</a>" +
                      "</div>"
                    : "") +

                "<div style='padding:0 8px;'>" +
                "<table width='100%' cellpadding='0' cellspacing='0' border='0'>" +
                "<thead><tr>" +
                "<td class='res-hdr' width='18'></td>" +
                "<td class='res-hdr' width='200'>Name</td>" +
                "<td class='res-hdr' width='200'>Address</td>" +
                "<td class='res-hdr'>Related Web Pages</td>" +
                "</tr></thead>" +
                "<tbody>" + rowsHTML + "</tbody>" +
                "</table>" +
                "</div>" +

                "<div id='footer'>" +
                "&copy;2005 Google &ndash; " +
                "<a href='https://www.google.com/maps'>Google Local</a> &ndash; " +
                "<a href='https://www.google.com/intl/en_us/help/terms_local.html'>Terms of Use</a> &ndash; " +
                "<a href='https://www.google.com/privacy.html'>Privacy Policy</a>" +
                "</div>" +

                "<script>" +
                "function doSearch(f){" +
                "  var q=f.q?f.q.value.trim():'';" +
                "  var nr=f.near?f.near.value.trim():'';" +
                "  if(!q&&!nr) return false;" +
                "  var combined = nr ? q+' near '+nr : q;" +
                "  window.location.href='https://www.google.com/maps?q='+encodeURIComponent(combined);" +
                "  return false;" +
                "}" +
                "<\/script>" +
                "</body></html>";

            results = null;
            rowsHTML = null;

            document.documentElement.innerHTML = pageHTML;
            pageHTML = null;
            document.title = query + " - Google Local";
            setFaviconOnce();
        }

        pollInterval = setInterval(function() {
            pollCount++;
            if (detectResults()) {
                clearInterval(pollInterval);
                pollInterval = null;
                setTimeout(function() {
                    var results = scrapeListPage();
                    buildPage(results);
                }, 600);
            } else if (pollCount > POLL_MAX) {
                clearInterval(pollInterval);
                pollInterval = null;
                buildPage([]);
            }
        }, POLL_MS);
    }

})();