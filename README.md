# NaviPage

A Tampermonkey userscript project that replaces modern Google pages with accurate recreations of their 2005-era layouts. Built and tested on Mypal browser running on Windows XP.

## Overview

NaviPage rewrites Google's current web interface in real time, restoring the visual design, layout, and typography of Google as it appeared in 2005. Every page is reconstructed from archived references and Wayback Machine snapshots to be as accurate as possible. This is not a theme - the pages are fully rebuilt from scratch on load.

## Features

- Accurate 2005-era layouts reconstructed from archived sources
- Covers Google Search, Google Images, Google News, Froogle, Google Local, and Google Advanced Search
- Both homepages and search results pages are supported
- Functional search - all forms submit to real Google backends
- Retro favicon and Google logo restored
- Designed around the memory and rendering constraints of older browsers

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser
2. Install the following two scripts:
   - `2005_Google_Homepages.js`
   - `2005_Google_Search_Results.js`
3. Navigate to any supported Google page

## Supported Pages

| Page | URL |
|------|-----|
| Google Homepage | `google.com/` |
| Google Search Results | `google.com/search` |
| Google Images Homepage | `images.google.com` |
| Google Images Search Results | `google.com/search?tbm=isch` |
| Google News Homepage | `news.google.com` |
| Google News Search Results | `google.com/search?tbm=nws` |
| Froogle Homepage | `froogle.google.com` |
| Froogle Search Results | `google.com/search?tbm=shop` |
| Google Local Homepage | `local.google.com` / `google.com/maps` |
| Google Local Search Results | `google.com/maps/search` |
| Google Advanced Search | `google.com/advanced_search` |

## Compatibility

Primarily developed and tested on **Mypal** (Windows XP). Should work on any browser with Tampermonkey support, though some rendering differences may appear on modern browsers due to differences in how older CSS table layouts are handled.

The scripts are written in ES5-compatible JavaScript with no optional chaining or modern syntax, specifically to support older Gecko-based browsers.

## Notes

- Map tile rendering on Google Local pages is not implemented. A placeholder is shown in place of the map.
- The Google Accounts sign-in page is not included in this release. It is planned for a future update.
- Froogle search results require a Google account login on some queries.

## Known Issues

- Google Groups homepage does not fire correctly due to redirect behavior.
- News search results may occasionally load empty on first visit. Refreshing the page resolves this.

## License

MIT License

Copyright (c) 2025 Sola991

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
