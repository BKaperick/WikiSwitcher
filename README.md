# WikiSwitcher chrome extension

This chrome extension intends to facilitate the user-experience of [Wikipedia](https://www.wikipedia.org) for users that read in multiple languages.  On installation, the user configures the languages they wish to see.  Then, when a wikipedia article loads, the extension queries the [MediaWiki Action API](https://www.mediawiki.org/wiki/API:Main_page) to query the length of the same article written in other languages that the user speaks.  If one is found that is *better* (i.e. longer text), then a pop-up alert will notify the user prompting the option to redirect to that article language instead.

# In Chrome Store

The v 0.0.1 of this app is still pending approval from the Google Chrome store.  The link will be added here when it is published.

Alternatively, you can install locally by:
1. Clone this repository (or download and unzip `src.crx`)
2. Navigate to `chrome://extensions/` in Google Chrome
3. In top-left corner, select "Load unpacked"
4. Select `./src` as the root directory
