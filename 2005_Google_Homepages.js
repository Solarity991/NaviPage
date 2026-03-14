// ==UserScript==
// @name         2005 Google - Homepages
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  2005-era reskin for Google homepages
// @author       Sola991
// @match        *://www.google.com/
// @match        *://www.google.com/webhp*
// @match        *://images.google.com/*
// @match        *://www.google.com/imghp*
// @match        *://news.google.com/*
// @match        *://www.google.com/nwshp*
// @match        *://www.google.com/news*
// @match        *://www.google.com/frghp*
// @match        *://www.google.com/froogle*
// @match        *://froogle.google.com/*
// @match        *://www.google.com/shopping*
// @match        *://local.google.com/*
// @match        *://www.google.com/lochp*
// @match        *://www.google.com/maps
// @match        *://www.google.com/maps?*
// @match        *://www.google.com/advanced_search*
// @match        *://www.google.com/Advanced_Search*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    var RETRO_ICON  = "https://retrogoogle.neocities.org/2001/favicon.png";
    var GOOGLE_LOGO = "https://retrogoogle.neocities.org/2004/logo.gif";

    var href = window.location.href;
    var host = window.location.hostname;
    var path = window.location.pathname;

    if (path.indexOf('/advanced_search') === 0 || path.indexOf('/Advanced_Search') === 0) {
        runAdvancedSearch();
    } else if (host === 'news.google.com' || path.indexOf('/nwshp') === 0 || (path.indexOf('/news') === 0 && href.indexOf('/search') === -1)) {
        runNewsHomepage();
    } else if (host === 'images.google.com' || path.indexOf('/imghp') === 0) {
        runImagesHomepage();
    } else if (host === 'froogle.google.com' || path.indexOf('/frghp') === 0 || path.indexOf('/froogle') === 0 || path.indexOf('/shopping') === 0) {
        runFroogleHomepage();
    } else if (host === 'local.google.com' || path.indexOf('/lochp') === 0 || path === '/maps' || path.indexOf('/maps?') === 0) {
        runLocalHomepage();
    } else if (path === '/' || path.indexOf('/webhp') === 0) {
        runGoogleHomepage();
    }

    // Google Homepage
    function runGoogleHomepage() {
        const removeGplex = () => {
            const gplexSelectors = [
                '.gplex-home',
                '.gplex-logo',
                '.gplex-container',
                '.gplex-header'
            ];
            gplexSelectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => el.remove());
            });
        };

        const gplexInterval = setInterval(removeGplex, 500);
        setTimeout(() => clearInterval(gplexInterval), 5000);

        function forceRetroFavicon() {
            function applyFavicon() {
                const existing = document.querySelector("link[rel*='icon']");
                if (existing && existing.href.startsWith(RETRO_ICON)) return;
                document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());
                const link = document.createElement("link");
                link.rel = "shortcut icon";
                link.type = "image/png";
                link.href = RETRO_ICON;
                document.head.appendChild(link);
            }
            applyFavicon();
            const observer = new MutationObserver(applyFavicon);
            observer.observe(document.head, { childList: true, subtree: true });
        }
        const retroHTML = `
        <center>
            <table cellspacing="0" cellpadding="0" border="0">
                <tbody>
                    <tr>
                        <td>
                            <img src="https://retrogoogle.neocities.org/2004/logo.gif"
                                 alt="Google" width="276" height="110">
                        </td>
                    </tr>
                </tbody>
            </table>
            <br>
            <form action="https://www.google.com/search?q=%s" name="f">
                <table cellspacing="0" cellpadding="4" border="0">
                    <tbody>
                        <tr>
                            <td class="q" nowrap="nowrap">
                                <font size="-1"><b><font color="#000000">Web</font></b>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <a id="1a" class="q" href="https://google.com/imghp?hl=en&tab=wi&ie=UTF-8">Images</a>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <a id="2a" class="q" href="https://google.com/grphp?hl=en&tab=wg&ie=UTF-8">Groups</a>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <a id="4a" class="q" href="https://google.com/nwshp?hl=en&tab=wn&ie=UTF-8">News</a>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <a id="5a" class="q" href="https://google.com/froogle?hl=en&tab=wf&ie=UTF-8">Froogle</a>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <b><a href="https://google.com/options/index.html" class="q">more&nbsp;»</a></b>
                                </font>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr>
                            <td width="25%">&nbsp;</td>
                            <td align="center">
                                <input name="hl" value="en" type="hidden">
                                <span id="hf"></span>
                                <input name="ie" value="ISO-8859-1" type="hidden">
                                <input maxlength="256" size="55" name="q"><br>
                                <input value="Google Search" name="btnG" type="submit">
                                <input value="I'm Feeling Lucky" name="btnI" type="submit">
                            </td>
                            <td width="25%" valign="top" nowrap="nowrap">
                                <font size="-2">
                                    &nbsp;&nbsp;<a href="https://google.com/advanced_search?hl=en">Advanced&nbsp;Search</a><br>
                                    &nbsp;&nbsp;<a href="https://google.com/preferences?hl=en">Preferences</a><br>
                                    &nbsp;&nbsp;<a href="https://google.com/language_tools?hl=en">Language Tools</a>
                                </font>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <br><br>
            <font size="-1">
                <a href="http://google.com/ads/">Advertising&nbsp;Programs</a> -
                <a href="http://google.com/services/">Business&nbsp;Solutions</a> -
                <a href="http://google.com/about.html">About Google</a>
            </font>
            <p>
                <font size="-2">©2005 Google - Searching 8,058,044,651 web pages</font>
            </p>
        </center>
        `;

        // Replace the body
        document.documentElement.innerHTML = retroHTML;

        // Set the tab title
        document.title = "Google";

        // Apply retro favicon after page replacement
        const isSearch = location.pathname.startsWith("/search");
        if (!isSearch) forceRetroFavicon();
    }

    // Images Homepage
    function runImagesHomepage() {

        function forceRetroFavicon() {
            function applyFavicon() {
                var existing = document.querySelector("link[rel*='icon']");
                if (existing && existing.href.indexOf(RETRO_ICON) !== -1) return;
                document.querySelectorAll("link[rel*='icon']").forEach(function(el) { el.remove(); });
                var link = document.createElement("link");
                link.rel = "shortcut icon";
                link.type = "image/png";
                link.href = RETRO_ICON;
                document.head.appendChild(link);
            }
            applyFavicon();
            var obs = new MutationObserver(applyFavicon);
            obs.observe(document.head, { childList: true, subtree: true });
            setTimeout(function() { obs.disconnect(); }, 5000);
        }

        function buildPage() {
            document.title = "Google Image Search";

            var html =
                "<!DOCTYPE html><html><head>" +
                "<meta http-equiv='content-type' content='text/html; charset=UTF-8'>" +
                "<title>Google Image Search</title>" +
                "<style>" +
                "body,td,a,p{font-family:arial,sans-serif;}" +
                "body{background:#ffffff;color:#000000;margin:0;}" +
                "a{color:#0000cc;text-decoration:none;}" +
                "a:visited{color:#551a8b;}" +
                "a:hover{text-decoration:underline;}" +
                ".q{color:#0000cc;}" +
                "</style>" +
                "</head>" +
                "<body bgcolor='#ffffff' text='#000000' link='#0000cc' vlink='#551a8b' alink='#ff0000' topmargin='3' marginheight='3'>" +

                "<center>" +

                "<br>" +
                "<img src='" + GOOGLE_LOGO + "' width='276' height='110' alt='Google'><br>" +
                "<font size='-1' color='#224499'><b>Images</b></font>" +
                "<br><br>" +

                "<table border='0' cellspacing='0' cellpadding='4'><tr><td nowrap>" +
                "<font size='-1'>" +
                "<a class='q' href='https://www.google.com/webhp?hl=en&tab=wi'>Web</a>" +
                "&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<b>Images</b>" +
                "&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a class='q' href='https://groups.google.com/grphp?hl=en&tab=ig'>Groups</a>" +
                "&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a class='q' href='https://www.google.com/nwshp?hl=en&tab=in'>News</a>" +
                "&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a class='q' href='https://www.google.com/frghp?hl=en&tab=if'>Froogle</a>" +
                "&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a class='q' href='https://www.google.com/lochp?hl=en&tab=il'>Local</a>" +
                "<sup><a href='https://www.google.com/lochp?hl=en&tab=il' style='text-decoration:none;'><font color='red'>New!</font></a></sup>" +
                "&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<b><a href='https://www.google.com/options/' class='q'>more&nbsp;&raquo;</a></b>" +
                "</font>" +
                "</td></tr></table>" +

                "<form action='https://www.google.com/search' name='f'>" +
                "<table border='0' cellspacing='0' cellpadding='0'><tr valign='top'>" +
                "<td width='150'>&nbsp;</td>" +
                "<td align='center'>" +
                "<input maxlength='256' size='40' name='q' value=''>" +
                "<input type='hidden' name='tbm' value='isch'>" +
                "<input type='hidden' name='hl' value='en'>" +
                "<br><br>" +
                "<input type='submit' value='Search Images' name='btnG'>" +
                "</td>" +
                "<td valign='top' nowrap>" +
                "<font size='-2'>" +
                "&nbsp;&nbsp;<a href='https://www.google.com/advanced_image_search?hl=en'>Advanced&nbsp;Image&nbsp;Search</a><br>" +
                "&nbsp;&nbsp;<a href='https://www.google.com/preferences?hl=en'>Preferences</a><br>" +
                "&nbsp;&nbsp;<a href='https://www.google.com/help/faq_images.html'>Image&nbsp;Search&nbsp;Help</a>" +
                "</font>" +
                "</td>" +
                "</tr></table>" +
                "</form>" +

                "<p><font color='#224499'><b>The most comprehensive image search on the web.</b></font></p>" +
                "<br>" +
                "<font size='-1'>" +
                "<a href='https://www.google.com/ads/'>Advertising&nbsp;Programs</a>" +
                " - " +
                "<a href='https://www.google.com/services/'>Business Solutions</a>" +
                " - " +
                "<a href='https://www.google.com/intl/en/about.html'>About Google</a>" +
                "</font>" +
                "<p><font size='-2'>&copy;2005 Google - Searching 1,187,630,000 images</font></p>" +

                "</center>" +
                "</body></html>";

            document.open();
            document.write(html);
            document.close();

            forceRetroFavicon();

            var q = document.querySelector("input[name='q']");
            if (q) setTimeout(function() { q.focus(); }, 100);
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", buildPage);
        } else {
            buildPage();
        }
    }

    // News Homepage
    function runNewsHomepage() {
        var NEWS_LOGO  = "https://retrogooglemobile.neocities.org/Google%20News_files/news.gif";
        var ENVELOPE   = "https://retrogooglemobile.neocities.org/Google%20News_files/envelope.gif";

        var SECTION_COLORS = {
            "top stories":   "#aa0033",
            "u.s.":          "#000088",
            "world":         "#ffcc00",
            "business":      "#008000",
            "sci/tech":      "#cc0000",
            "technology":    "#cc0000",
            "sports":        "#ff6600",
            "entertainment": "#663399",
            "health":        "#669999",
            "gaming":        "#cc0000",
            "mobile":        "#008000",
            "gadgets":       "#000088"
        };

        var SKIP_SECTIONS = ["local news", "picks for you", "for you", "beyond the front page", ""];

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
            var obs = new MutationObserver(applyFavicon);
            obs.observe(document.head, { childList: true, subtree: true });
        }

        function parseArticle(anchor) {
            var container = anchor.parentElement.parentElement;
            var text = container.innerText || "";
            var href = anchor.href;
            var lines = text.split("\n").map(function(l) { return l.trim(); }).filter(function(l) { return l && l !== "More"; });
            var source = lines[0] || "";
            var headline = "";
            var timeAgo = "";
            for (var i = 1; i < lines.length; i++) {
                var l = lines[i].toLowerCase();
                if (l.indexOf("ago") !== -1 || l.indexOf("yesterday") !== -1 || l.indexOf("hour") !== -1 || l.indexOf("minute") !== -1) {
                    timeAgo = lines[i];
                    headline = lines.slice(1, i).join(" ");
                    break;
                }
            }
            if (!headline) headline = lines.slice(1).join(" ");
            // Try to find a thumbnail image in the same data-n-tid container
            var imgSrc = "";
            var tidContainer = anchor.closest("[data-n-tid]");
            if (tidContainer) {
                var figImg = tidContainer.querySelector("figure img");
                if (!figImg) {
                    // Try srcset on picture elements
                    var pic = tidContainer.querySelector("img[srcset]");
                    if (pic) figImg = pic;
                }
                if (figImg && figImg.src) imgSrc = figImg.src;
                if (!imgSrc && figImg && figImg.srcset) {
                    imgSrc = figImg.srcset.split(" ")[0];
                }
            }
            return { source: source, headline: headline, timeAgo: timeAgo, href: href, imgSrc: imgSrc };
        }

        function getAnchors(scope, seenHrefs, max) {
            var all = Array.from(scope.querySelectorAll("a[href*='read/']"));
            var result = [];
            for (var i = 0; i < all.length && result.length < max; i++) {
                var href = all[i].href;
                if (!seenHrefs.has(href)) {
                    seenHrefs.add(href);
                    result.push(all[i]);
                }
            }
            return result;
        }

        function buildArticlesHTML(anchors) {
            var html = "";
            anchors.forEach(function(anchor, idx) {
                var a = parseArticle(anchor);
                if (!a.headline) return;
                var imgHTML = "";
                if (a.imgSrc) {
                    imgHTML = "<table border='0' align='right' cellpadding='5' cellspacing='0'>" +
                        "<tbody><tr><td width='80' align='center' valign='top'>" +
                        "<a href='" + a.href + "'>" +
                        "<img src='" + a.imgSrc + "' width='80' height='64' border='1' alt='' style='object-fit:cover;'>" +
                        "<br><font size='-2'>" + a.source + "</font></a>" +
                        "</td></tr></tbody></table>";
                }
                html += "<table border='0' cellpadding='2' cellspacing='0' width='100%'><tbody><tr><td valign='top'>";
                html += imgHTML;
                html += "<a href='" + a.href + "' style='color:#0000cc;font-size:14px;font-weight:bold;'>" + a.headline + "</a><br>";
                html += "<font size='-1'><font color='#6f6f6f'><b>" + a.source + "&nbsp;-</b></font> <b><nobr>" + a.timeAgo + "</nobr></b></font><br>";
                html += "</td></tr></tbody></table>";
                html += "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tbody><tr><td bgcolor='#e0e0e0' height='1' style='height:1px;font-size:0;line-height:0;padding:0;'><img width='1' height='1' alt=''></td></tr></tbody></table>";
            });
            return html;
        }

        function buildSectionBlock(title, color, anchors) {
            var articlesHTML = buildArticlesHTML(anchors);
            if (!articlesHTML) return "";
            var html = "";
            html += "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tbody>";
            html += "<tr><td colspan='2' bgcolor='" + color + "' width='100%' style='height:2px;font-size:0;line-height:0;padding:0;'><img width='1' height='2' alt=''></td></tr>";
            html += "<tr><td bgcolor='#efefef' style='padding:3px 6px;' nowrap><b>&nbsp;" + title + " &raquo;</b></td>";
            html += "<td bgcolor='#efefef' nowrap align='right'><font size='-1' color='#6f6f6f'><a href='#' style='color:#6f6f6f;font-size:11px;'>edit</a>&nbsp;</font></td></tr>";        html += "</tbody></table>";
            html += articlesHTML;
            return html;
        }

        function buildPage(topAnchors, rightColHTML, sectionBlocks, leadTitle, activeCat) {
            leadTitle = leadTitle || "Top Stories";
            activeCat = (activeCat || "").toLowerCase();

            // Inject styles
            var existing = document.getElementById("retro-news-style");
            if (existing) existing.remove();
            var style = document.createElement("style");
            style.id = "retro-news-style";
            style.textContent =
                "body{font-family:Arial,Helvetica,sans-serif!important;font-size:13px!important;margin:0!important;background:#fff!important;color:#000!important;}" +
                "a{color:#0000cc!important;text-decoration:none!important;}" +
                "a:visited{color:#551a8b!important;}" +
                "a:hover{text-decoration:underline!important;}" +
                ".rcat-table{width:100%;border-collapse:collapse;border:1px solid #ccc;}" +
                ".rcat-hd{padding:2px 4px;white-space:nowrap;}" +
                ".rcat-row td{background:#efefef!important;}" +
                ".rcat-div td{background:#fff!important;height:2px;}" +
                ".rcat-sw{width:8px;padding:2px;}" +
                ".rcat-lb{padding:2px 4px;white-space:nowrap;}" +
                ".rcat-lb a{color:#000!important;font-size:12px;font-weight:bold;}" +
                "#retro-footer{text-align:center;font-size:12px;color:#6f6f6f;padding:10px;}" +
                "#retro-footer a{color:#0000cc!important;}" +
                ".retro-footbar{background:#aa0033;height:2px;width:100%;}" +
                ".retro-editions{font-size:11px;text-align:center;padding:6px;}";
            document.head.appendChild(style);

            // Sidebar HTML
            var cats = [
                ["World",         "#ffcc00", "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen"],
                ["U.S.",          "#000088", "https://news.google.com/topics/CAAqIggKIhxDQkFTRHdvSkwyMHZNRGxqTjNjd0VnSmxiaWdBUAE?hl=en-US&gl=US&ceid=US%3Aen"],
                ["Business",      "#008000", "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen"],
                ["Sci/Tech",      "#cc0000", "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen"],
                ["Sports",        "#ff6600", "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen"],
                ["Entertainment", "#663399", "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen"],
                ["Health",        "#669999", "https://news.google.com/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRZU0FtVnVLQUFQAQ?hl=en-US&gl=US&ceid=US%3Aen"]
            ];
            var catRows = "";
            cats.forEach(function(c) {
                catRows +=
                    "<tr class='rcat-row'>" +
                    "<td class='rcat-sw' style='background:" + c[1] + "!important;'><font size='-2'>&nbsp;</font></td>" +
                    "<td class='rcat-lb' style='" + (c[0].toLowerCase() === activeCat ? "background:#ccccff!important;" : "") + "'>" +
                    "<a href='" + c[2] + "'>&nbsp;<font size='-1'><b>" + c[0] + "</b></font></a></td>" +
                    "</tr><tr class='rcat-div'><td colspan='2'></td></tr>";
            });

            var sidebar =
                "<td valign='top' style='width:108px;padding:0;vertical-align:top;'>" +
                "<table class='rcat-table'><tbody>" +
                "<tr><td class='rcat-hd' colspan='2' style='background:#aa0033;'>" +
                "<font color='#fff'><b>&gt;</b></font><font size='-1' color='#fff'><b>Top Stories</b></font></td></tr>" +
                "<tr class='rcat-div'><td colspan='2'></td></tr>" +
                catRows +
                "</tbody></table>" +
                "<br><div align='center'>" +
                "<font size='-1'><a href='https://www.google.com/alerts?hl=en'>" +
                "<img src='" + ENVELOPE + "' width='16' height='15' border='0' alt='News Alerts'></a>" +
                "&nbsp;<a href='https://www.google.com/alerts?hl=en'>News Alerts</a></font>" +
                "<p><font size='-1'><a href='https://news.google.com/intl/en_us/about_google_news.html'>About<br>Google News</a></font></p>" +
                "</div></td>";

            // Top stories section
            var topArticlesHTML = buildArticlesHTML(topAnchors);
            var now = new Date();
            var timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" });
            var dateStr = now.toLocaleDateString("en-US", { day: "numeric", month: "short" });

            var topHeader =
                "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tbody>" +
                "<tr><td colspan='3' bgcolor='#aa0033' style='height:2px;font-size:0;line-height:0;padding:0;'><img width='1' height='2' alt=''></td></tr>" +
                "<tr><td bgcolor='#efefef' style='padding:3px 6px;' width='55%' nowrap><b>&nbsp;" + leadTitle + "</b></td>" +
                "<td bgcolor='#efefef' nowrap align='right' width='45%' colspan='2'><font size='-1'>Auto-generated <b>" + dateStr + " at " + timeStr + "</b>&nbsp;</font></td></tr>" +
                "</tbody></table>";

            var inTheNews =
                "<table style='border:1px solid #000099;' bgcolor='#efefef' border='0' cellspacing='0' cellpadding='0' width='100%'><tbody>" +
                "<tr><td align='center' style='padding:4px;cursor:pointer;'>" +
                "<b>Customize&nbsp;this&nbsp;page</b><sup><font size='-1' color='red'>New!</font></sup>" +
                "</td></tr></tbody></table>" +
                "<table border='0' cellpadding='0' cellspacing='6'><tbody><tr><td>" +
                "<font size='-1'>" + rightColHTML + "</font>" +
                "</td></tr></tbody></table>" +
                "<table border='0' cellpadding='0' cellspacing='6'><tbody>" +
                "<tr><td colspan='2' bgcolor='#cccccc' height='1'><img alt='' width='1' height='1'></td></tr>" +
                "<tr><td colspan='2' nowrap><b><font size='-1'>In&nbsp;The&nbsp;News</font></b></td></tr>" +
                "<tr>" +
                "<td valign='top' nowrap><font size='-1'>" +
                "&nbsp;<a href='/search?tbm=nws&q=politics'>Politics</a><br>" +
                "&nbsp;<a href='/search?tbm=nws&q=economy'>Economy</a><br>" +
                "&nbsp;<a href='/search?tbm=nws&q=technology'>Technology</a><br>" +
                "&nbsp;<a href='/search?tbm=nws&q=science'>Science</a><br>" +
                "&nbsp;<a href='/search?tbm=nws&q=health'>Health</a>" +
                "</font></td>" +
                "<td valign='top' nowrap><font size='-1'>" +
                "&nbsp;<a href='/search?tbm=nws&q=sports'>Sports</a><br>" +
                "&nbsp;<a href='/search?tbm=nws&q=entertainment'>Entertainment</a><br>" +
                "&nbsp;<a href='/search?tbm=nws&q=world+news'>World</a><br>" +
                "&nbsp;<a href='/search?tbm=nws&q=business'>Business</a><br>" +
                "&nbsp;<a href='/search?tbm=nws&q=us+news'>U.S.</a>" +
                "</font></td>" +
                "</tr></tbody></table>";

            // Two-column section pairs
            var sectionRows = "";
            for (var i = 0; i < sectionBlocks.length; i += 2) {
                var left = sectionBlocks[i] || "&nbsp;";
                var right = i + 1 < sectionBlocks.length ? sectionBlocks[i + 1] : "&nbsp;";
                sectionRows +=
                    "<tr>" +
                    "<td width='49%' valign='top'>" + left + "</td>" +
                    "<td width='2%'>&nbsp;</td>" +
                    "<td width='49%' valign='top'>" + right + "</td>" +
                    "</tr>" +
                    "<tr><td colspan='3' height='8'></td></tr>";
            }

            var body =
                // Standard News header
                "<table border='0' cellpadding='0' width='100%'><tbody><tr>" +
                "<td nowrap align='right'><font size='-1'><b>Standard News</b> &nbsp;|&nbsp;" +
                "<a href='https://www.google.com/news?ned=tus'>Text Version</a></font>&nbsp;</td>" +
                "</tr></tbody></table>" +

                // Logo + tabs + search form
                "<table border='0' cellpadding='0' cellspacing='0' align='center'><tbody>" +
                "<tr><td rowspan='4' valign='bottom'>" +
                "<a href='https://news.google.com/home?hl=en-US&gl=US&ceid=US:en'>" +
                "<img src='" + NEWS_LOGO + "' alt='Google News' border='0' width='205' height='85'></a>" +
                "</td></tr>" +
                "<tr><td><table border='0' cellspacing='0' cellpadding='4'><tbody><tr><td nowrap>" +
                "<font size='-1'>" +
                "<a href='https://www.google.com/webhp?hl=en&tab=nw'>Web</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a href='https://www.google.com/imghp?hl=en&tab=ni'>Images</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a href='https://groups.google.com/grphp?hl=en&tab=ng'>Groups</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<b>News</b>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a href='https://www.google.com/frghp?hl=en&tab=nf'>Froogle</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a href='https://www.google.com/lochp?hl=en&tab=nl'>Local</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<b><a href='https://www.google.com/options/index.html'>more&nbsp;&raquo;</a></b>" +
                "</font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<font size='-2'><a href='https://www.google.com/advanced_news_search?hl=en'>Advanced&nbsp;News&nbsp;Search</a></font>" +
                "</td></tr></tbody></table></td></tr>" +
                "<tr><td nowrap valign='top'>" +
                "<form name='f' method='GET' action='https://www.google.com/search'>" +
                "<input type='hidden' name='hl' value='en'>" +
                "<input type='hidden' name='ned' value='us'>" +
                "<input type='hidden' name='tbm' value='nws'>" +
                "<input type='text' name='q' size='30' maxlength='2048' value=''>" +
                "<font size='-1'>&nbsp;<input type='submit' name='btnG' value='Search News'>" +
                "&nbsp;<input type='submit' name='btnmeta' value='Search the Web'></font><br>" +
                "<b><font size='-1' color='#aa0033'>Search and browse 4,500 news sources updated continuously.</font></b>" +
                "</form></td></tr></tbody></table>" +

                // Main 3-column: sidebar | divider | content
                "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tbody><tr>" +
                sidebar +
                "<td bgcolor='#cccccc' width='1' style='vertical-align:top;'><img width='1' height='1' alt=''></td>" +
                "<td width='11'>&nbsp;</td>" +
                "<td valign='top'>" +

                    // Top stories row
                    topHeader +
                    "<font size='-3'><br></font>" +
                    "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tbody><tr>" +
                    "<td width='55%' valign='top' style='max-width:55%;overflow:hidden;'>" + topArticlesHTML + "</td>" +
                    "<td width='5%'>&nbsp;</td>" +
                    "<td width='40%' valign='top'>" + inTheNews + "</td>" +
                    "</tr></tbody></table><br>" +

                    // Two-column section pairs
                    "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tbody>" +
                    sectionRows +
                    "</tbody></table>" +

                "</td></tr></tbody></table>" +

                // Editions
                "<div class='retro-editions'><font size='-1'>" +
                "<nobr><a href='https://www.google.com/news?ned=au'>Australia</a></nobr> - " +
                "<nobr><a href='https://www.google.com/news?ned=ca'>Canada English</a></nobr> - " +
                "<nobr><a href='https://www.google.com/news?ned=de'>Deutschland</a></nobr> - " +
                "<nobr><a href='https://www.google.com/news?ned=es'>Espa&ntilde;a</a></nobr> - " +
                "<nobr><a href='https://www.google.com/news?ned=fr'>France</a></nobr> - " +
                "<nobr><a href='https://www.google.com/news?ned=in'>India</a></nobr> - " +
                "<nobr><a href='https://www.google.com/news?ned=it'>Italia</a></nobr> - " +
                "<nobr><a href='https://www.google.com/news?ned=uk'>U.K.</a></nobr> - " +
                "<nobr><a href='https://www.google.com/news?ned=us'>U.S.</a></nobr>" +
                "</font></div>" +
                "<br><font size='-2'>The selection and placement of stories on this page were determined automatically by a computer program.</font>" +
                "<div class='retro-footbar'></div>" +
                "<div id='retro-footer'><font size='-1' color='#6f6f6f'>" +
                "&copy;2005 Google - " +
                "<a href='https://www.google.com/'>Google&nbsp;Home</a> - " +
                "<a href='https://www.google.com/about.html'>About Google</a> - " +
                "<a href='https://news.google.com/intl/en_us/about_google_news.html'>About Google News</a> - " +
                "<a href='https://www.google.com/privacy.html'>Privacy Policy</a>" +
                "</font></div>";

            document.body.innerHTML = body;

            // Remove all Google stylesheets from head to prevent override
            var links = document.querySelectorAll("link[rel='stylesheet']");
            for (var i = 0; i < links.length; i++) links[i].remove();
            var headStyles = document.querySelectorAll("head style:not(#retro-news-style)");
            for (var i = 0; i < headStyles.length; i++) headStyles[i].remove();

            // Kill all Google scripts to prevent re-render
            var scripts = document.querySelectorAll("script");
            for (var i = 0; i < scripts.length; i++) scripts[i].remove();

            // Force hard navigation on all same-domain links so Google SPA can't intercept
            document.body.addEventListener("click", function(e) {
                var a = e.target.closest ? e.target.closest("a") : null;
                if (!a) { var t = e.target; while (t && t.tagName !== "A") t = t.parentElement; a = t; }
                if (a && a.href && a.href.indexOf("news.google.com") !== -1) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = a.href;
                }
            }, true);
        }

        function waitForNews(callback) {
            var isTopicPage = window.location.pathname.indexOf('/topics/') !== -1;
            var fired = false;
            function check() {
                if (fired) return false;
                var h3count = document.querySelectorAll("h3").length;
                var linkcount = document.querySelectorAll("a[href*='read/']").length;
                var ready = isTopicPage ? linkcount >= 20 : (h3count >= 6 && linkcount >= 30);
                if (ready) {
                    fired = true;
                    setTimeout(callback, isTopicPage ? 2000 : 1000);
                    return true;
                }
                return false;
            }
            if (check()) return;
            var obs = new MutationObserver(function() {
                if (check()) obs.disconnect();
            });
            // Wait for body to exist before observing
            function startObserving() {
                if (document.body) {
                    obs.observe(document.body, { childList: true, subtree: true });
                } else {
                    setTimeout(startObserving, 100);
                }
            }
            startObserving();
            // Hard fallback: try every second for up to 10 seconds
            var attempts = 0;
            var interval = setInterval(function() {
                attempts++;
                if (check() || attempts >= 10) {
                    clearInterval(interval);
                    obs.disconnect();
                }
            }, 1000);
        }

        function runRetro() {
            waitForNews(function() {
                var h3Els = Array.from(document.querySelectorAll("h3"));
                var seenHrefs = new Set();
                var isTopicPage = window.location.pathname.indexOf('/topics/') !== -1;
                var topAnchors = [], rightColAnchors = [], sectionBlocks = [], leadTitle = "Top Stories";

                if (isTopicPage) {
                    var h1 = document.querySelector("h1");
                    leadTitle = h1 ? h1.innerText.trim() : "Top Stories";
                    var allAnchors = getAnchors(document, seenHrefs, 9);
                    topAnchors = allAnchors.slice(0, 4);
                    rightColAnchors = allAnchors.slice(4);
                } else {
                    for (var i = 0; i < h3Els.length; i++) {
                        if (h3Els[i].innerText.trim().toLowerCase() === "top stories") {
                            var topPP = h3Els[i].parentElement.parentElement;
                            var topScope = topPP.children.length < 3 ? topPP.parentElement : topPP.children[2];
                            var allTop = getAnchors(topScope, seenHrefs, 9);
                            topAnchors = allTop.slice(0, 4);
                            rightColAnchors = allTop.slice(4);
                            break;
                        }
                    }
                    h3Els.forEach(function(h3) {
                        var title = h3.innerText.trim();
                        if (SKIP_SECTIONS.indexOf(title.toLowerCase()) !== -1) return;
                        if (title.toLowerCase() === "top stories") return;
                        var color = SECTION_COLORS[title.toLowerCase()] || "#aa0033";
                        var pp = h3.parentElement.parentElement;
                        var scope = pp.children.length < 3 ? pp.parentElement : pp.children[2];
                        if (!scope) return;
                        var anchors = getAnchors(scope, seenHrefs, 3);
                        if (anchors.length === 0) return;
                        var block = buildSectionBlock(title, color, anchors);
                        if (block) sectionBlocks.push(block);
                    });
                }

                var rightColHTML = "";
                rightColAnchors.forEach(function(anchor) {
                    var a = parseArticle(anchor);
                    if (!a.headline) return;
                    rightColHTML +=
                        "<b><a href='" + a.href + "' style='color:#0000cc;'><font size='-1'>" + a.headline + "</font></a></b><br>" +
                        "<font size='-1' class='f'><nobr>" + a.source + "</nobr></font>" +
                        "<font size='-1'> - <a href='/search?tbm=nws&q=" + encodeURIComponent(a.headline.substring(0, 40)) + "'>all related &raquo;</a></font>" +
                        "<div style='padding-top:7px'><img width='1' height='1' alt=''></div>";
                });

                if (topAnchors.length === 0 && sectionBlocks.length === 0) return;
                var activeCat = isTopicPage ? leadTitle : "Top Stories";
                document.title = "Google News" + (isTopicPage ? " - " + leadTitle : "");
                buildPage(topAnchors, rightColHTML, sectionBlocks, leadTitle, activeCat);
                forceRetroFavicon();
            });
        }

        runRetro();

        // Re-run on bfcache restore (back/forward)
        window.addEventListener("pageshow", function(e) {
            if (e.persisted && !document.getElementById("retro-news-style")) runRetro();
        });
    }

    // Froogle Homepage
    function runFroogleHomepage() {
    var LOGO = "data:image/gif;base64,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";

        function forceRetroFavicon() {
            function applyFavicon() {
                var existing = document.querySelector("link[rel*='icon']");
                if (existing && existing.href.indexOf(RETRO_ICON) !== -1) return;
                document.querySelectorAll("link[rel*='icon']").forEach(function(el) { el.remove(); });
                var link = document.createElement("link");
                link.rel = "shortcut icon";
                link.type = "image/png";
                link.href = RETRO_ICON;
                document.head.appendChild(link);
            }
            applyFavicon();
            var obs = new MutationObserver(applyFavicon);
            obs.observe(document.head, { childList: true, subtree: true });
            setTimeout(function() { obs.disconnect(); }, 5000);
        }

        // Full pool of authentic 2005 Froogle sample items
        var ITEM_POOL = [
            // From archive capture June 2005
            "maytag refrigerator","butane fuel","sweatshirt","snakelight","prince of persia",
            "tachometer","floor cushions","cheese grater","comics","votive candles",
            "diapers","natural gas grill","drum kit","fleur de lis brooch","poster bed",
            "memory foam mattress","usb cd writer","bicycle trailer","frisbee","pitching machine",
            "beard trimmer","cd labeler","needlepoint kits","washer dryer combo","head tennis racquet",
            // From googleguide.com reference screenshots
            "necktie","disney dvd","lip gloss","godfather dvd","blow dryer",
            "mulch","waffle iron","air hockey table","nokia car charger","saxophone reeds",
            "audio mixer","ibm thinkpad t40","scrapbook paper","women's blazers","clock radio",
            "hot plate","firewood rack","kids beds","usb floppy drive","air mattress",
            "measuring cups","bark collar","digital camcorder","mouse trap","watches children"
        ];

        function shuffle(arr) {
            var a = arr.slice();
            for (var i = a.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
            }
            return a;
        }

        function buildSampleRows() {
            var items = shuffle(ITEM_POOL).slice(0, 25);
            var html = "";
            for (var row = 0; row < 5; row++) {
                html += "<tr>";
                for (var col = 0; col < 5; col++) {
                    var item = items[row * 5 + col];
                    var q = item.replace(/ /g, "+");
                    var display = item.replace(/ /g, "&nbsp;");
                    html += "<td width='20%' nowrap><font size='-1'><a href='https://www.google.com/search?tbm=shop&q=" + q + "'>" + display + "</a></font></td>";
                }
                html += "</tr>";
            }
            return html;
        }

        function buildPage() {
            document.title = "Froogle";

            var sampleRows = buildSampleRows();

            var html =
                "<html><head>" +
                "<meta http-equiv='content-type' content='text/html; charset=UTF-8'>" +
                "<title>Froogle</title>" +
                "<style>" +
                "body,td,div,a,p{font-family:arial,sans-serif;}" +
                "body{background:#ffffff;color:#000000;margin:0;}" +
                "a{color:#0000cc;text-decoration:none;}" +
                "a:visited{color:#551a8b;}" +
                "a:hover{text-decoration:underline;}" +
                ".q{color:#0000cc;}" +
                ".indent{margin-left:1em;margin-right:1em;}" +
                "</style>" +
                "</head>" +
                "<body onload='sf();' bgcolor='#ffffff' text='#000000' link='#0000cc' vlink='#551a8b' alink='#ff0000'>" +
                "<center>" +

                "<table width='100%' cellspacing='0' cellpadding='0' border='0'><tbody>" +
                "<tr><td align='right'><nobr><font size='-1'>" +
                "<a href='https://www.google.com/shopping'>My Shopping List</a>" +
                "</font></nobr></td></tr>" +
                "<tr><td valign='bottom' align='center'>" +
                "<a href='https://www.google.com/shopping'>" +
                "<img src='" + LOGO + "' alt='Froogle' width='276' height='110' border='0'>" +
                "</a></td></tr>" +
                "</tbody></table><br>" +

                "<form action='https://www.google.com/search' name='f'>" +
                "<table cellspacing='0' cellpadding='4' border='0'><tbody><tr><td nowrap>" +
                "<font size='-1'>" +
                "<a class='q' href='https://www.google.com/webhp?hl=en&tab=fw'>Web</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a class='q' href='https://www.google.com/imghp?hl=en&tab=fi'>Images</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a class='q' href='https://groups.google.com/grphp?hl=en&tab=fg'>Groups</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a class='q' href='https://www.google.com/nwshp?hl=en&tab=fn'>News</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<b>Froogle</b>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a class='q' href='https://www.google.com/lochp?hl=en&tab=fl'>Local</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<b><a href='https://www.google.com/options/' class='q'>more&nbsp;&raquo;</a></b>" +
                "</font>" +
                "</td></tr></tbody></table>" +

                "<table cellspacing='0' cellpadding='0'><tbody><tr valign='top'>" +
                "<td width='150'>&nbsp;</td>" +
                "<td align='center'>" +
                "<input maxlength='256' name='q' size='40'>" +
                "<input type='hidden' name='tbm' value='shop'>" +
                "&nbsp;<input name='btnG' type='submit' value='Search Froogle'>" +
                "</td>" +
                "<td width='150' valign='top' nowrap>" +
                "<font size='-2'>" +
                "&nbsp;&nbsp;<a href='https://www.google.com/shopping?advanced_search'>Advanced&nbsp;Froogle&nbsp;Search</a><br>" +
                "&nbsp;&nbsp;<a href='https://www.google.com/preferences?hl=en'>Preferences</a><br>" +
                "&nbsp;&nbsp;<a href='https://www.google.com/shopping/help'>Froogle&nbsp;Help</a>" +
                "</font></td>" +
                "</tr></tbody></table>" +
                "</form>" +

                "<font color='#60a63a'><b>froo&middot;gle (fru'gal) <i>n.</i> Smart shopping through Google.</b></font>" +
                "<br><br>" +

                "<table width='630' cellspacing='0' cellpadding='3' align='center'><tbody>" +
                "<tr><td colspan='5'><font size='-1'>A few of the items recently found with Froogle:</font></td></tr>" +
                "<tr><td colspan='5'><table width='100%' height='1' cellspacing='0' cellpadding='0' border='0'>" +
                "<tbody><tr><td bgcolor='#80c65a'><img alt='' width='1' height='1'></td></tr></tbody></table></td></tr>" +
                sampleRows +
                "<tr><td colspan='5'><table width='100%' height='1' cellspacing='0' cellpadding='0' border='0'>" +
                "<tbody><tr><td bgcolor='#80c65a'><img alt='' width='1' height='1'></td></tr></tbody></table></td></tr>" +
                "</tbody></table>" +

                "</center>" +

                "<center><p></p>" +
                "<table width='100%' cellspacing='0' cellpadding='2' border='0'><tbody><tr>" +
                "<td align='center'><font size='-1'>" +
                "<a href='https://www.google.com/'>Google&nbsp;Home</a> - " +
                "<a href='https://www.google.com/shopping/merchants/'>Information&nbsp;for&nbsp;Merchants</a> - " +
                "<a href='https://www.google.com/about.html'>About&nbsp;Google</a>&nbsp;" +
                "</font></td></tr></tbody></table>" +
                "<br><font size='-1'>&copy;2005 Google</font>" +
                "</center>" +

                "</body></html>";

            sampleRows = null;

            document.open();
            document.write(html);
            document.close();

            html = null;

            forceRetroFavicon();

            var q = document.querySelector("input[name='q']");
            if (q) setTimeout(function() { q.focus(); }, 100);
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", buildPage);
        } else {
            buildPage();
        }
    }

    // Local Homepage
    function runLocalHomepage() {
    var LOCAL_LOGO = "https://retrogooglemobile.neocities.org/Google%20Local_files/local_res_logo3.gif";

        function setFaviconOnce() {
            document.querySelectorAll("link[rel*='icon']").forEach(function(el) { el.remove(); });
            var link = document.createElement("link");
            link.rel  = "shortcut icon";
            link.type = "image/png";
            link.href = RETRO_ICON;
            document.head.appendChild(link);
        }

        var path = window.location.pathname;
        if (path.indexOf('/maps/search') !== -1) return;
        if (path.indexOf('/maps/place')  !== -1) return;
        if (path.indexOf('/maps/dir')    !== -1) return;
        var params = new URLSearchParams(window.location.search);
        var hasQ = params.get("q") && params.get("q").length > 0;
        if (hasQ && path.indexOf('/lochp') === -1) return;

        function buildPage() {
            var pageHTML =
                "<!DOCTYPE html><html><head>" +
                "<meta http-equiv='content-type' content='text/html; charset=UTF-8'>" +
                "<title>Google Local</title>" +
                "<style>" +
                // Body is a flex column — topbar takes natural height, page fills the rest
                "html{height:100%;margin:0;padding:0;}" +
                "body{height:100%;margin:0;padding:0;display:flex;flex-direction:column;overflow:hidden;}" +
                "body,td,a,p,div,input,font{font-family:Arial,sans-serif;font-size:small;}" +
                "body{background:#fff;color:#000;}" +
                "a:link{color:#0000cc;}" +
                "a:visited{color:#551a8b;}" +
                "a:active{color:red;}" +
                "a:hover{text-decoration:underline;}" +
                "form{margin:0;padding:0;}" +
                "input{font-size:small;}" +

                // Help link — small (not x-small) to match reference
                "#gaia{padding:2px 6px 1px 6px;text-align:right;flex-shrink:0;}" +
                "#gaia a{font-size:small;color:#0000cc;}" +

                // Header
                "#header{border-bottom:1px solid #cccccc;flex-shrink:0;}" +
                "#search{border-collapse:collapse;}" +
                "td.logo{padding:4px 6px 4px 6px;vertical-align:middle;width:162px;}" +
                "td.tabs{padding:4px 0 0 0;vertical-align:bottom;}" +
                "td.box{padding:3px 0 4px 0;vertical-align:top;}" +
                "td.helplinks{padding:3px 0 4px 8px;vertical-align:top;white-space:nowrap;}" +

                // hometabs
                "#hometabs{font-size:small;padding-bottom:2px;}" +
                "#hometabs a{color:#0000cc;text-decoration:none;}" +
                "#hometabs a:hover{text-decoration:underline;}" +
                "#hometabs b{color:#000;}" +

                // Search form
                "table.form{border-collapse:collapse;}" +
                "tr.input td{padding:0 2px 2px 0;vertical-align:middle;}" +
                "span.example{font-size:x-small;color:#666;}" +

                // helplinks
                "div.selected a{font-size:small;color:#000;text-decoration:none;font-weight:bold;}" +
                "div.selected a:hover{text-decoration:underline;}" +
                "div.unselected a{font-size:small;color:#0000cc;text-decoration:none;}" +
                "div.unselected a:hover{text-decoration:underline;}" +
                "div.selected,div.unselected{line-height:1.55;}" +

                // Titlebar — all text small except "Local" which is medium/bold
                "#titlebar{width:100%;border-collapse:collapse;flex-shrink:0;}" +
                "td.title{font-size:medium;font-weight:bold;background:#ffeac0;" +
                "  border-top:2px solid #ff9900;border-bottom:1px solid #e0c880;" +
                "  padding:3px 8px;}" +
                "td.links{background:#ffeac0;border-top:2px solid #ff9900;" +
                "  border-bottom:1px solid #e0c880;" +
                "  padding:3px 8px;text-align:right;white-space:nowrap;}" +
                // titlebar action links are small (not x-small)
                "td.links a{font-size:small;color:#0000cc;margin-left:8px;text-decoration:none;}" +
                "td.links a:hover{text-decoration:underline;}" +
                "td.links img{vertical-align:middle;margin-right:2px;}" +

                // Two-column body — flex child that fills remaining height
                "#page{flex:1;display:flex;flex-direction:row;overflow:hidden;min-height:0;}" +
                "#panel{width:322px;flex-shrink:0;overflow-y:auto;" +
                "  border-right:1px solid #cccccc;" +
                "  background:#fff;padding:6px 10px 0 8px;box-sizing:border-box;}" +
                "#map{flex:1;background:#e5e3df;position:relative;overflow:hidden;}" +

                // Panel content
                "div.hp{padding:0;}" +
                "div.promo{font-size:small;margin-bottom:8px;}" +
                "div.promo a{color:#0000cc;}" +
                "div.hdr{font-weight:bold;font-size:small;margin-bottom:4px;}" +
                "table.eg-table{border-collapse:collapse;font-size:small;}" +
                "td.subhdr{font-weight:bold;padding-top:6px;padding-bottom:2px;}" +
                "td.eg{padding-left:10px;padding-bottom:2px;}" +
                "td.eg a{color:#0000cc;}" +
                "div.tour{font-size:small;margin-top:10px;}" +
                "div.tour a{color:#0000cc;}" +

                // Map area
                "#mapbody{position:absolute;top:0;left:0;right:0;bottom:0;" +
                "  display:flex;align-items:center;justify-content:center;flex-direction:column;}" +
                "#maptabs{position:absolute;top:6px;right:8px;font-size:small;}" +
                "#maptabs a{color:#0000cc;}" +
                "</style>" +
                "</head><body>" +

                "<div id='gaia'>" +
                "<a href='https://www.google.com/support/maps/'>Help</a>" +
                "</div>" +

                "<div id='header'>" +
                "<table id='search' cellpadding='0' cellspacing='0' border='0'><tbody>" +
                "<tr>" +
                "<td class='logo' rowspan='2'>" +
                "<a href='https://www.google.com/maps'>" +
                "<img src='" + LOCAL_LOGO + "' width='150' height='55' alt='Google Local' border='0'></a>" +
                "</td>" +
                "<td class='tabs' colspan='2'>" +
                "<div id='hometabs'><font size='-1'>" +
                "<a href='https://www.google.com/'>Web</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a href='https://images.google.com/'>Images</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a href='https://groups.google.com/'>Groups</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a href='https://news.google.com/'>News</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<a href='https://www.google.com/frghp'>Froogle</a>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<b>Local</b>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<b><a href='https://www.google.com/intl/en/options/'>more&nbsp;&raquo;</a></b>" +
                "</font></div>" +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td class='box'>" +
                "<form onsubmit='return doSearch(this)'>" +
                "<table class='form' cellpadding='0' cellspacing='0'><tbody>" +
                "<tr class='input'>" +
                "<td><input id='inp_q' name='q' type='text' size='45' maxlength='2048' autocomplete='off'></td>" +
                "<td><input type='submit' name='btnG' value='Search'></td>" +
                "</tr>" +
                "<tr><td colspan='2'>" +
                "<span class='example'>e.g., &ldquo;hotels near lax&rdquo; or &ldquo;10 market st, san francisco&rdquo;</span>" +
                "</td></tr>" +
                "</tbody></table>" +
                "</form>" +
                "</td>" +
                "<td class='helplinks'>" +
                "<div class='selected'><a href='#' onclick='return false;'>Search the map</a></div>" +
                "<div class='unselected'><a href='#' onclick='return false;'>Find businesses</a></div>" +
                "<div class='unselected'><a href='#' onclick='return false;'>Get Directions</a></div>" +
                "</td>" +
                "</tr>" +
                "</tbody></table>" +
                "</div>" +

                "<table id='titlebar' cellpadding='0' cellspacing='0' border='0' width='100%'><tbody><tr>" +
                "<td class='title'>Local</td>" +
                "<td class='links'>" +
                "<a href='javascript:window.print()'>" +
                "<img src='https://retrogooglemobile.neocities.org/Google%20Local_files/bar_icon_print_2.gif' " +
                "width='11' height='11' border='0' alt=''>&nbsp;Print</a>" +
                "<a href='mailto:?subject=Google+Local&body=https://www.google.com/maps'>" +
                "<img src='https://retrogooglemobile.neocities.org/Google%20Local_files/bar_icon_email_2.gif' " +
                "width='11' height='11' border='0' alt=''>&nbsp;Email</a>" +
                "<a href='https://www.google.com/maps'>" +
                "<img src='https://retrogooglemobile.neocities.org/Google%20Local_files/bar_icon_link.gif' " +
                "width='11' height='11' border='0' alt=''>&nbsp;Link to this page</a>" +
                "</td>" +
                "</tr></tbody></table>" +

                "<div id='page'>" +

                "<div id='panel'>" +
                "<div class='hp'>" +
                "<div class='promo'>" +
                "<a href='http://www.google.com/glm/'>Download Google Local to your mobile phone.</a>" +
                "</div>" +
                "<div class='hdr'>Example searches:</div>" +
                "<table class='eg-table' cellpadding='0' cellspacing='0'><tbody>" +
                "<tr><td class='subhdr'>Go to a location</td></tr>" +
                "<tr><td class='eg'><a href='#' onclick='return goSearch(\"kansas city\")'>kansas city</a></td></tr>" +
                "<tr><td class='eg'><a href='#' onclick='return goSearch(\"10 market st, san francisco\")'>10 market st, san francisco</a></td></tr>" +
                "<tr><td class='subhdr'>Find a business</td></tr>" +
                "<tr><td class='eg'><a href='#' onclick='return goSearch(\"hotels near lax\")'>hotels near lax</a></td></tr>" +
                "<tr><td class='eg'><a href='#' onclick='return goSearch(\"pizza\")'>pizza</a></td></tr>" +
                "<tr><td class='subhdr'>Get directions</td></tr>" +
                "<tr><td class='eg'><a href='#' onclick='return goSearch(\"jfk to 350 5th ave, new york\")'>jfk to 350 5th ave, new york</a></td></tr>" +
                "<tr><td class='eg'><a href='#' onclick='return goSearch(\"seattle to 98109\")'>seattle to 98109</a></td></tr>" +
                "</tbody></table>" +
                "<div class='tour'>Drag the map with your mouse, or double-click to center.&nbsp;" +
                "<a href='https://www.google.com/help/maps/tour/'>Take a tour &raquo;</a></div>" +
                "</div>" +
                "</div>" +

                "<div id='map'>" +
                "<div id='maptabs'>Map | <a href='#'>Satellite</a> | <a href='#'>Hybrid</a></div>" +
                "<div id='mapbody'>" +
                "<img src='" + LOCAL_LOGO + "' width='120' height='44' alt='Google Local' border='0' " +
                "style='margin-bottom:10px;opacity:0.6;filter:alpha(opacity=60);'>" +
                "<div style='font-size:small;color:#888;text-align:center;'>" +
                "Enter a location or search above to explore the map." +
                "</div>" +
                "</div>" +
                "</div>" +

                "</div>" + // /page

                "<script>" +
                "function goSearch(q){" +
                "  window.location.href='https://www.google.com/maps?q='+encodeURIComponent(q);" +
                "  return false;" +
                "}" +
                "function doSearch(f){" +
                "  var q=f.q?f.q.value.trim():'';" +
                "  if(!q) return false;" +
                "  window.location.href='https://www.google.com/maps?q='+encodeURIComponent(q);" +
                "  return false;" +
                "}" +
                "document.getElementById('inp_q').focus();" +
                "<\/script>" +
                "</body></html>";

            document.documentElement.innerHTML = pageHTML;
            pageHTML = null;
            document.title = "Google Local";
            setFaviconOnce();
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", buildPage);
        } else {
            buildPage();
        }
    }

    // Advanced Search
    function runAdvancedSearch() {
    function setFaviconOnce() {
            document.querySelectorAll("link[rel*='icon']").forEach(function(el) { el.remove(); });
            var link = document.createElement("link");
            link.rel  = "shortcut icon";
            link.type = "image/png";
            link.href = RETRO_ICON;
            document.head.appendChild(link);
        }

        var urlParams = new URLSearchParams(window.location.search);
        var preQ    = (urlParams.get("q") || urlParams.get("as_q") || "").replace(/"/g, '&quot;');
        var preLang = urlParams.get("lr") || "";

        function opt(val, label, sel) {
            return "<option value='" + val + "'" + (sel === val ? " selected" : "") + ">" + label + "</option>";
        }

        function buildPage() {
            // Full language list from original
            var langOpts =
                opt("", "any language", preLang) +
                opt("lang_ar","Arabic",preLang) + opt("lang_bg","Bulgarian",preLang) +
                opt("lang_ca","Catalan",preLang) + opt("lang_zh-CN","Chinese (Simplified)",preLang) +
                opt("lang_zh-TW","Chinese (Traditional)",preLang) + opt("lang_hr","Croatian",preLang) +
                opt("lang_cs","Czech",preLang) + opt("lang_da","Danish",preLang) +
                opt("lang_nl","Dutch",preLang) + opt("lang_en","English",preLang) +
                opt("lang_et","Estonian",preLang) + opt("lang_fi","Finnish",preLang) +
                opt("lang_fr","French",preLang) + opt("lang_de","German",preLang) +
                opt("lang_el","Greek",preLang) + opt("lang_iw","Hebrew",preLang) +
                opt("lang_hu","Hungarian",preLang) + opt("lang_is","Icelandic",preLang) +
                opt("lang_id","Indonesian",preLang) + opt("lang_it","Italian",preLang) +
                opt("lang_ja","Japanese",preLang) + opt("lang_ko","Korean",preLang) +
                opt("lang_lv","Latvian",preLang) + opt("lang_lt","Lithuanian",preLang) +
                opt("lang_no","Norwegian",preLang) + opt("lang_pl","Polish",preLang) +
                opt("lang_pt","Portuguese",preLang) + opt("lang_ro","Romanian",preLang) +
                opt("lang_ru","Russian",preLang) + opt("lang_sr","Serbian",preLang) +
                opt("lang_sk","Slovak",preLang) + opt("lang_sl","Slovenian",preLang) +
                opt("lang_es","Spanish",preLang) + opt("lang_sv","Swedish",preLang) +
                opt("lang_tr","Turkish",preLang);

            var pageHTML =
                "<!DOCTYPE html><html><head>" +
                "<meta http-equiv='content-type' content='text/html; charset=UTF-8'>" +
                "<title>Google Advanced Search</title>" +
                "<style>" +
                "body,td,font,a,p,div,input,select{font-family:Arial,sans-serif;font-size:small;}" +
                "body{background:#fff;color:#000;margin:4px;padding:0;}" +
                "a:link{color:#0000cc;}" +
                "a:visited{color:#551a8b;}" +
                "a:active{color:red;}" +
                "a:hover{text-decoration:underline;}" +
                "form{margin:0;padding:0;}" +
                "input,select{font-size:small;}" +
                // Section headers — blue background row
                ".sec-hdr{background:#cbdced;padding:3px 6px;font-weight:bold;}" +
                // Label cells
                ".lbl{width:15%;vertical-align:top;padding:3px 4px;}" +
                ".lbl b{font-size:small;}" +
                ".desc{width:40%;vertical-align:top;padding:3px 4px;white-space:nowrap;}" +
                ".inp{vertical-align:top;padding:3px 4px;}" +
                // Main outer table
                ".main-tbl{width:99%;border-collapse:collapse;border-spacing:2px;}" +
                ".main-tbl td{padding:3px;}" +
                // Inner form tables
                ".form-tbl{width:100%;border-collapse:collapse;}" +
                ".form-tbl td{padding:2px 4px;vertical-align:middle;}" +
                // Section label rows (white bg inside blue container)
                ".row-white{background:#fff;}" +
                // Topic section
                ".topic-tbl td{vertical-align:top;padding:2px 0 2px 0;}" +
                ".topic-tbl a{color:#0000cc;font-size:small;}" +
                "</style>" +
                "</head><body>" +

                "<form method='GET' action='https://www.google.com/search' name='f' " +
                "onsubmit='return doAdvSearch(this)'>" +
                "<input type='hidden' name='hl' value='en'>" +

                "<table width='99%' cellspacing='2' cellpadding='0' border='0'><tbody><tr>" +
                "<td rowspan='2' width='1%'>" +
                "<a href='https://www.google.com/'>" +
                "<img src='" + GOOGLE_LOGO + "' alt='Go to Google Home' width='150' height='55' border='0' vspace='12'></a>" +
                "</td>" +
                "<td>&nbsp;</td>" +
                "<td rowspan='2'>" +
                // Blue line
                "<table width='100%' cellspacing='0' cellpadding='0' border='0'><tbody>" +
                "<tr><td bgcolor='#3366cc'><img alt='' width='1' height='1'></td></tr>" +
                "</tbody></table>" +
                // Title + tips bar
                "<table width='100%' cellspacing='0' cellpadding='0' border='0'><tbody><tr>" +
                "<td nowrap bgcolor='#e5ecf9'>" +
                "<font size='+1' color='#000000'><b>&nbsp;Advanced Search</b></font>" +
                "</td>" +
                "<td nowrap bgcolor='#e5ecf9' align='right'>" +
                "<font size='-1'>" +
                "<a href='https://www.google.com/help/refinesearch.html'>Advanced Search Tips</a>" +
                " | <a href='https://www.google.com/about.html'>About Google</a>&nbsp;" +
                "</font>" +
                "</td>" +
                "</tr></tbody></table>" +
                "<img alt='' width='1' height='8'>" +
                "</td>" +
                "</tr></tbody></table>" +

                "<table width='99%' cellspacing='0' cellpadding='3' border='0'><tbody>" +
                "<tr bgcolor='#cbdced'><td>" +
                "<table width='100%' cellspacing='0' cellpadding='0' border='0'><tbody>" +
                "<tr bgcolor='#cbdced'><td>" +
                "<table width='100%' cellspacing='0' cellpadding='2'><tbody>" +

                // Section header row: Find results
                "<tr><td width='15%' valign='top'>" +
                "<font size='-1'><br><b>Find results</b></font>" +
                "</td>" +
                "<td width='85%'>" +
                "<table width='100%' cellspacing='0' cellpadding='2'><tbody>" +

                // with ALL of the words + num/submit (rowspan 4)
                "<tr>" +
                "<td nowrap><font size='-1'>with <b>all</b> of the words</font></td>" +
                "<td><input type='text' name='as_q' size='25' value='" + preQ + "' id='as_q_inp'></td>" +
                "<td rowspan='4' valign='top'>" +
                "<font size='-1'>" +
                "<select name='num'>" +
                "<option value='10' selected>10 results</option>" +
                "<option value='20'>20 results</option>" +
                "<option value='30'>30 results</option>" +
                "<option value='50'>50 results</option>" +
                "<option value='100'>100 results</option>" +
                "</select>&nbsp;" +
                "<input type='submit' name='btnG' value='Google Search'>" +
                "</font>" +
                "</td>" +
                "</tr>" +

                // exact phrase
                "<tr>" +
                "<td nowrap><font size='-1'>with the <b>exact phrase</b></font></td>" +
                "<td><input type='text' size='25' name='as_epq'></td>" +
                "</tr>" +

                // at least one
                "<tr>" +
                "<td nowrap><font size='-1'>with <b>at least one</b> of the words</font></td>" +
                "<td><input type='text' size='25' name='as_oq'></td>" +
                "</tr>" +

                // without
                "<tr>" +
                "<td nowrap><font size='-1'><b>without</b> the words</font></td>" +
                "<td><input type='text' size='25' name='as_eq'></td>" +
                "</tr>" +

                "</tbody></table>" +
                "</td></tr>" + // end Find results section

                "</tbody></table>" +
                "</td></tr>" +

                "<tr bgcolor='#ffffff'><td>" +
                "<table width='100%' cellspacing='0' cellpadding='2'><tbody><tr>" +
                "<td width='15%'><font size='-1'><b>Language</b></font></td>" +
                "<td width='40%'><font size='-1'>Return pages written in</font></td>" +
                "<td><font size='-1'><select name='lr'>" + langOpts + "</select></font></td>" +
                "</tr></tbody></table>" +
                "</td></tr>" +

                "<tr bgcolor='#ffffff'><td>" +
                "<table width='100%' cellspacing='0' cellpadding='2'><tbody><tr>" +
                "<td width='15%'><font size='-1'><b>File Format</b></font></td>" +
                "<td width='40%' nowrap><font size='-1'>" +
                "<select name='as_ft'>" +
                "<option value='i' selected>Only</option>" +
                "<option value='e'>Don't</option>" +
                "</select>&nbsp;return results of the file format" +
                "</font></td>" +
                "<td><font size='-1'><select name='as_filetype'>" +
                "<option value='' selected>any format</option>" +
                "<option value='pdf'>Adobe Acrobat PDF (.pdf)</option>" +
                "<option value='ps'>Adobe Postscript (.ps)</option>" +
                "<option value='doc'>Microsoft Word (.doc)</option>" +
                "<option value='xls'>Microsoft Excel (.xls)</option>" +
                "<option value='ppt'>Microsoft Powerpoint (.ppt)</option>" +
                "<option value='rtf'>Rich Text Format (.rtf)</option>" +
                "</select></font></td>" +
                "</tr></tbody></table>" +
                "</td></tr>" +

                "<tr bgcolor='#ffffff'><td>" +
                "<table width='100%' cellspacing='0' cellpadding='2'><tbody><tr>" +
                "<td width='15%'><font size='-1'><b>Date</b></font></td>" +
                "<td width='40%' nowrap><font size='-1'>Return web pages updated in the</font></td>" +
                "<td><font size='-1'><select name='as_qdr'>" +
                "<option value='all' selected>anytime</option>" +
                "<option value='m3'>past 3 months</option>" +
                "<option value='m6'>past 6 months</option>" +
                "<option value='y'>past year</option>" +
                "</select></font></td>" +
                "</tr></tbody></table>" +
                "</td></tr>" +

                "<tr bgcolor='#ffffff'><td>" +
                "<table width='100%' cellspacing='0' cellpadding='2' border='0'><tbody><tr>" +
                "<td width='15%'><font size='-1'><b>Numeric Range</b></font></td>" +
                "<td nowrap><font size='-1'>Return web pages containing numbers between " +
                "<input size='5' name='as_nlo'> and <input size='5' name='as_nhi'>" +
                "</font></td>" +
                "</tr></tbody></table>" +
                "</td></tr>" +

                "<tr bgcolor='#ffffff'><td>" +
                "<table width='100%' cellspacing='0' cellpadding='2' border='0'><tbody><tr>" +
                "<td width='15%'><font size='-1'><b>Occurrences</b></font></td>" +
                "<td width='40%' nowrap><font size='-1'>Return results where my terms occur</font></td>" +
                "<td><font size='-1'><select name='as_occt'>" +
                "<option value='any' selected>anywhere in the page</option>" +
                "<option value='title'>in the title of the page</option>" +
                "<option value='body'>in the text of the page</option>" +
                "<option value='url'>in the URL of the page</option>" +
                "<option value='links'>in links to the page</option>" +
                "</select></font></td>" +
                "</tr></tbody></table>" +
                "</td></tr>" +

                "<tr bgcolor='#ffffff'><td>" +
                "<table width='100%' cellspacing='0' cellpadding='2'><tbody><tr>" +
                "<td width='15%'><font size='-1'><b>Domain</b></font></td>" +
                "<td width='40%' nowrap><font size='-1'>" +
                "<select name='as_dt'>" +
                "<option value='i' selected>Only</option>" +
                "<option value='e'>Don't</option>" +
                "</select>&nbsp;return results from the site or domain" +
                "</font></td>" +
                "<td>" +
                "<table cellspacing='0' cellpadding='0'><tbody>" +
                "<tr><td><input size='25' name='as_sitesearch'></td></tr>" +
                "<tr><td valign='top' nowrap><font size='-1'><i>e.g. google.com, .org&nbsp;&nbsp;" +
                "<a href='https://www.google.com/help/refinesearch.html#domain'>More&nbsp;info</a>" +
                "</i></font></td></tr>" +
                "</tbody></table>" +
                "</td>" +
                "</tr></tbody></table>" +
                "</td></tr>" +

                "<tr bgcolor='#ffffff'><td>" +
                "<table width='100%' cellspacing='0' cellpadding='2'><tbody><tr>" +
                "<td width='15%'><font size='-1'><b>SafeSearch</b></font></td>" +
                "<td colspan='2' nowrap><font size='-1'>" +
                "<input id='sfio' type='radio' checked value='images' name='safe'>" +
                "&nbsp;<label for='sfio'>No filtering</label>&nbsp;&nbsp;" +
                "<input id='ss' type='radio' value='active' name='safe'>" +
                "&nbsp;<label for='ss'>Filter using " +
                "<a href='https://www.google.com/help/customize.html#safe'>SafeSearch</a>" +
                "</label>" +
                "</font></td>" +
                "</tr></tbody></table>" +
                "</td></tr>" +

                "</tbody></table>" + // /main form table
                "<br>" +

                "<table cellspacing='0' cellpadding='6'><tbody><tr>" +
                "<td><b>Froogle Product Search (BETA)</b></td>" +
                "</tr></tbody></table>" +
                "<table width='99%' cellspacing='0' cellpadding='3'><tbody>" +
                "<tr bgcolor='#cbdced'><td>" +
                "<table width='100%' cellspacing='0' cellpadding='2' border='0'><tbody>" +
                "<tr bgcolor='#ffffff'>" +
                "<td width='15%'><font size='-1'><b>Products</b></font></td>" +
                "<td width='40%' nowrap><font size='-1'>Find products for sale</font></td>" +
                "<td>" +
                "<input type='text' name='froogle_q' size='30'>" +
                "&nbsp;<input type='button' value='Search' " +
                "onclick=\"window.location.href='https://www.google.com/search?tbm=shop&q='+encodeURIComponent(document.f.froogle_q.value)\">" +
                "<br><font size='-1'>To browse for products, start at the " +
                "<a href='https://www.google.com/frghp'>Froogle home page</a></font>" +
                "</td>" +
                "</tr></tbody></table>" +
                "</td></tr></tbody></table><br>" +

                "<table cellspacing='0' cellpadding='6'><tbody><tr>" +
                "<td><b>Page-Specific Search</b></td>" +
                "</tr></tbody></table>" +
                "<table width='99%' cellspacing='0' cellpadding='3'><tbody>" +
                "<tr bgcolor='#cbdced'><td>" +
                "<table width='100%' cellspacing='0' cellpadding='2' border='0'><tbody>" +
                "<tr bgcolor='#ffffff'>" +
                "<td width='15%'><font size='-1'><b>Similar</b></font></td>" +
                "<td width='40%' nowrap><font size='-1'>Find pages similar to the page</font></td>" +
                "<td><input type='text' name='as_rq' size='30'>" +
                "&nbsp;<input type='button' value='Search' " +
                "onclick=\"if(document.f.as_rq.value)window.location.href='https://www.google.com/search?q=related:'+encodeURIComponent(document.f.as_rq.value)\">" +
                "<br><font size='-1'><i>e.g. www.google.com/help.html</i></font>" +
                "</td>" +
                "</tr>" +
                "<tr bgcolor='#cbdced'><td colspan='3'><img width='1' height='1' alt=''></td></tr>" +
                "<tr bgcolor='#ffffff'>" +
                "<td width='15%'><font size='-1'><b>Links</b></font></td>" +
                "<td width='40%' nowrap><font size='-1'>Find pages that link to the page</font></td>" +
                "<td><input type='text' name='as_lq' size='30'>" +
                "&nbsp;<input type='button' value='Search' " +
                "onclick=\"if(document.f.as_lq.value)window.location.href='https://www.google.com/search?q=link:'+encodeURIComponent(document.f.as_lq.value)\">" +
                "</td>" +
                "</tr>" +
                "</tbody></table>" +
                "</td></tr></tbody></table><br>" +

                "<table cellspacing='0' cellpadding='6'><tbody><tr>" +
                "<td><b>Topic-Specific Searches</b></td>" +
                "</tr></tbody></table>" +
                "<table width='99%' cellspacing='0' cellpadding='3'><tbody>" +
                "<tr bgcolor='#cbdced'><td>" +
                "<table width='100%' cellspacing='0' cellpadding='2'><tbody>" +
                "<tr bgcolor='#ffffff'><td><blockquote><br>" +
                "<font size='-1'>" +
                "<font color='red'>New! </font>" +
                "<a href='https://www.google.com/maps'>Local</a> - Find local businesses and services on the web.<br>" +
                "<a href='https://catalogs.google.com/'>Catalogs</a> - Search and browse mail-order catalogs online<br><br>" +
                "</font>" +
                "<table width='90%' height='1' cellspacing='0' cellpadding='0'><tbody>" +
                "<tr><td bgcolor='#cbdced'><img alt='' width='1' height='1'></td></tr>" +
                "</tbody></table>" +
                "<font size='-1'><br>" +
                "<a href='https://www.google.com/mac'>Apple Macintosh</a> - Search for all things Mac<br>" +
                "<a href='https://www.google.com/bsd'>BSD Unix</a> - Search web pages about the BSD operating system<br>" +
                "<a href='https://www.google.com/linux'>Linux</a> - Search all penguin-friendly pages<br>" +
                "<a href='https://www.google.com/microsoft'>Microsoft</a> - Search Microsoft-related pages<br><br>" +
                "</font>" +
                "<table width='90%' height='1' cellspacing='0' cellpadding='0'><tbody>" +
                "<tr><td bgcolor='#cbdced'><img alt='' width='1' height='1'></td></tr>" +
                "</tbody></table>" +
                "<font size='-1'><br>" +
                "<a href='https://www.google.com/unclesam'>U.S. Government</a> - Search all .gov and .mil sites<br>" +
                "<a href='https://www.google.com/options/universities.html'>Universities</a> - Search a specific school's website<br><br>" +
                "</font>" +
                "</blockquote></td></tr>" +
                "</tbody></table>" +
                "</td></tr></tbody></table>" +

                "</form>" +

                "<script>" +
                "function doAdvSearch(f){" +
                "  var parts=[];" +
                "  var q=f.as_q.value.trim();" +
                "  var epq=f.as_epq.value.trim();" +
                "  var oq=f.as_oq.value.trim();" +
                "  var eq=f.as_eq.value.trim();" +
                "  var site=f.as_sitesearch.value.trim();" +
                "  var dt=f.as_dt.value;" +
                "  var ft=f.as_filetype.value;" +
                "  var ftype=f.as_ft.value;" +
                "  var nlo=f.as_nlo.value.trim();" +
                "  var nhi=f.as_nhi.value.trim();" +
                "  var occt=f.as_occt.value;" +
                "  if(q) parts.push(q);" +
                "  if(epq) parts.push('\"'+epq+'\"');" +
                "  if(oq){var ow=oq.split(/\\s+/);parts.push('('+ow.join(' OR ')+')');}"+
                "  if(eq){eq.split(/\\s+/).forEach(function(w){if(w)parts.push('-'+w);});}" +
                "  if(site){parts.push((dt==='e'?'-':'')+'site:'+site);}" +
                "  if(ft){parts.push((ftype==='e'?'-':'')+'filetype:'+ft);}" +
                "  if(nlo&&nhi) parts.push(nlo+'..'+nhi);" +
                "  if(occt&&occt!=='any') parts.push('in'+occt+':'+q);" +
                "  var finalQ=parts.join(' ');" +
                "  if(!finalQ) return false;" +
                "  var url='https://www.google.com/search?q='+encodeURIComponent(finalQ);" +
                "  if(f.num.value&&f.num.value!=='10') url+='&num='+f.num.value;" +
                "  if(f.lr.value) url+='&lr='+encodeURIComponent(f.lr.value);" +
                "  if(f.as_qdr.value&&f.as_qdr.value!=='all') url+='&tbs=qdr:'+f.as_qdr.value;" +
                "  var safe=document.querySelector('input[name=safe]:checked');" +
                "  if(safe&&safe.value==='active') url+='&safe=active';" +
                "  window.location.href=url;" +
                "  return false;" +
                "}" +
                "document.getElementById('as_q_inp').focus();" +
                "<\/script>" +
                "</body></html>";

            document.documentElement.innerHTML = pageHTML;
            pageHTML = null;
            document.title = "Google Advanced Search";
            setFaviconOnce();
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", buildPage);
        } else {
            buildPage();
        }
    }

})();