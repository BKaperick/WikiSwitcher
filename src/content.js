console.log('Bryan here 1');
chrome.storage.sync.get("options").then((l) => {
    console.log(JSON.stringify(l));
    const user_languages = l.options.languages;

//    if (document.readyState !== 'loading') {
//        console.log('document is already ready, just execute code here');
//        getLanguageRedirect(user_languages);
//    } else {
//        console.log("hi Bryan's extension is loaded.");
//        document.addEventListener("DOMContentLoaded", getLanguageRedirect(user_languages));
//    }
    document.addEventListener("DOMContentLoaded", getLanguageRedirect(user_languages));
    // document.addEventListener("load", getLanguageRedirect(user_languages));
});

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            console.log(xmlHttp.responseType);
            // console.log(xmlHttp);
            callback(xmlHttp.responseText, xmlHttp.response);
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function getLanguageRedirect(languages) {
    
    console.log("page is loaded: " + document.URL + " with state " + document.readyState);
    console.log("doc: " + JSON.stringify(document.URL));
    
    const re = /https?:\/\/(www\.)?(.*)\.wikipedia\.org\/wiki\/([^#]*)#?(.*)?/;
    var info = document.URL.match(re);
    var base_url_language = info[2];
    var title = info[3];
    var section = info[4];

    // TODO get links via API languagelinks param instead
    // var wiki_api_langlinks = "https://" + base_url_language + ".wikipedia.org/w/api.php?origin=*&title=" + title + "&text=" + title + "&action=query"
    var wiki_api_langlinks = "https://" + base_url_language + ".wikipedia.org/w/api.php?origin=*&prop=langlinks&action=query&format=json&titles=" + title
    console.log("langlinks: " + wiki_api_langlinks);
    var lang_to_title = {};
    var lang_to_url = {};
    var lang_to_content_length = {};

    httpGetAsync(wiki_api_langlinks, (text,response) => {
        const resp_obj = JSON.parse(response).query.pages;
        for (const [page_id, langs] of Object.entries(resp_obj)) {
            console.log("Page available in langs: " + JSON.stringify(langs.langlinks));
            for (const resp_lang of langs.langlinks) {
                const l = resp_lang.lang;
                if (languages.includes(l)) {
                    console.log("language supported: " + l)
                    const t = resp_lang["*"];
                    lang_to_url[l] = "https://www." + l + ".wikipedia.org/wiki/" + t;
                    lang_to_title[l] = t;
                }
            }
        }
//    var languageDom = document.getElementById("p-lang");
//    var links_ = languageDom.querySelectorAll("a.interlanguage-link-target");
//    var links = [...links_];
//    console.log(JSON.stringify(languageDom));
//    console.log(links);
//    links.forEach(l =>
//    {
//        if (languages.includes(l.lang)) {
//            lang_to_url[l.lang] = l.href;
//        }
//    });
    console.log("user languages loaded: " + languages);    
    //console.log("candidate languages: \n" + JSON.stringify(lang_to_url));
    
    for (const lang in lang_to_url) { 
        var wiki_api_raw_text = "https://" + lang + ".wikipedia.org/w/api.php?origin=*&page=" + title + "&action=parse"

        // TODO this gets the full html of the page and computes its length.  
        // We could try to extract just the content body length
        httpGetAsync(wiki_api_raw_text, (response,_) => lang_to_content_length[lang] = response.length);
    }
    console.log(lang_to_content_length);
    lang_to_content_length[base_url_language] = document.documentElement.innerHTML.length;
    var best_lang = undefined;
    var max_len = -1;
    for (const [lang,len] of Object.entries(lang_to_content_length)) {
        if (len > max_len) {
            max_len = len;
            best_lang = lang;
        }
    }
    var wiki_api_set_lang = "https://" + base_url_language + ".wikipedia.org/w/api.php?action=setpagelanguage&title=" + title + "&lang=" + best_lang + "&";
    console.log(best_lang + ": " + wiki_api_set_lang);
    });

// window.onload = function() {
//        if (changeInfo.status == 'complete' && tab.active && tab.url.includes("wikipedia.org")) {
//            console.log("page is loaded: " + tab.url);
//            var languageDom = document.getElementById("p-lang-label");
//            var links = [...languageDom.querySelectAll("a")];
//            var candidates = [];
//            links.forEach(l =>
//            {
//                if (languages.includes(l.lang)) {
//                    candidates.push(l.lang);
//                }
//            });
//            const re = /https:\/\/(\w\w)(\.wikipedia\.org\/wiki\/.*)/;
//            var info = tab.url.match(re);
//            var language = info[1];
//            var article = info[2];
//            
//            // var other = languages.filter((x) => x !== language)[0];
//            var other = candidates[0];
//            var redirect = "https://" + other + article;
//            chrome.tabs.create({
//                url: redirect
//            });
//        }
}
