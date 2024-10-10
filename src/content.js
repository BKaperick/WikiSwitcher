console.log('Bryan here 1');
chrome.storage.sync.get("options").then((l) => {
    console.log(JSON.stringify(l));
    const user_languages = l.options.languages;

    document.addEventListener("DOMContentLoaded", getLanguageRedirect(user_languages));
});

translate_lang = {
    "en": "English",
    "fr": "French",
    "es": "Spanish",
    "ru": "Russian"
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            console.log(xmlHttp.responseType);
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

    //var wiki_api_langlinks = "https://" + base_url_language + ".wikipedia.org/w/api.php?origin=*&prop=info&inprop=url&action=query&format=json&titles=" + title
    //console.log("info: " + wiki_api_langlinks);
    var wiki_api_langlinks = "https://" + base_url_language + ".wikipedia.org/w/api.php?origin=*&prop=langlinks&llprop=url&action=query&format=json&titles=" + title
    console.log("langlinks: " + wiki_api_langlinks);
    var lang_to_url = {};
    var lang_to_content_length = {};

    console.log("user languages loaded: " + languages);    
    httpGetAsync(wiki_api_langlinks, (text,response) => {
        const resp_obj = JSON.parse(response).query.pages;
        for (const [page_id, langs] of Object.entries(resp_obj)) {
            for (const resp_lang of langs.langlinks) {
                const l = resp_lang.lang;
                if (languages.includes(l)) {

                    // const t = resp_lang["*"];
                    lang_to_url[l] = resp_lang.url;// "https://www." + l + ".wikipedia.org/wiki/" + t;
                    // const t = resp_lang["*"].replace("'", "%27");
                    // const t = resp_lang.title;
                    // lang_to_url[l] = resp_lang.fullurl; // "https://www." + l + ".wikipedia.org/wiki/" + t;
                }
            }
        }
    lang_to_url[base_url_language] = document.URL;
    for (const lang in lang_to_url) { 
        // var wiki_api_raw_text = "https://" + lang + ".wikipedia.org/w/api.php?origin=*&page=" + title + "&action=parse"
        var wiki_api_raw_text = "https://" + lang + ".wikipedia.org/w/api.php?origin=*&page=" + title + "&prop=wikitext&action=parse"

        // TODO this gets the full html of the page and computes its length.  
        // We could try to extract just the content body length
        httpGetAsync(wiki_api_raw_text, (response,_) => {
            lang_to_content_length[lang] = response.length
            
            if (Object.keys(lang_to_content_length).length === Object.keys(lang_to_url).length) {
                console.log("current language: " + base_url_language);
                console.log(lang_to_content_length);
                // lang_to_content_length[base_url_language] =  0 // (for testing) 
                // lang_to_content_length[base_url_language] = document.documentElement.innerHTML.length;
                var best_lang = undefined;
                var max_len = -1;
                for (const [lang,len] of Object.entries(lang_to_content_length)) {
                    console.log("considering " + lang + " and " + len)
                    if (len > max_len) {
                        max_len = len;
                        best_lang = lang;
                    }
                }
                var wiki_api_set_lang = "https://" + base_url_language + ".wikipedia.org/w/api.php?action=setpagelanguage&title=" + title + "&lang=" + best_lang + "&";

                if (best_lang === base_url_language) {
                    console.log("We are currently in the best language for this article");
                } else {
                    var trad_best_lang = best_lang;
                    if (best_lang in translate_lang)
                        trad_best_lang = translate_lang[best_lang];
                    // alert("A longer article exists for this topic in " + best_lang + " at " + lang_to_url[best_lang]);
                   if (window.confirm("A longer article exists for this topic in " + trad_best_lang + ".\n\nWould you prefer to read that one?"))
                       window.location.href = lang_to_url[best_lang];
                   }
            }
        });
                
            }

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
