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
            console.log(xmlHttp);
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function getLanguageRedirect(languages) {
    
    console.log("page is loaded: " + document.URL + " with state " + document.readyState);
    console.log("doc: " + JSON.stringify(document.URL));

    // TODO get links via API languagelinks param instead
    var languageDom = document.getElementById("p-lang");
    var links_ = languageDom.querySelectorAll("a.interlanguage-link-target");
    var links = [...links_];
    var lang_to_url = {};
    var lang_to_content_length = {};
    console.log(JSON.stringify(languageDom));
    console.log(links);
    links.forEach(l =>
    {
        if (languages.includes(l.lang)) {
            lang_to_url[l.lang] = l.href;
        }
    });
    console.log("user languages loaded: " + languages);    
    //console.log("candidate languages: \n" + JSON.stringify(lang_to_url));
    
    const re = /https?:\/\/(www\.)?(.*)\.wikipedia\.org\/wiki\/([^#]*)#?(.*)?/;
    var info = document.URL.match(re);
    var base_url_language = info[2];
    var title = info[3];
    var section = info[4];
    
    for (const lang in lang_to_url) { 
        // TODO this is the one we want, but fails due to CORS headers in wikipedia api response
        // var wiki_api_raw_text = "https://" + lang + ".wikipedia.org/w/index.php?origin=*&title=" + title + "&action=raw&withCredentials=false"
        // This one just gives us the english-language result
        // var wiki_api_raw_text = "https://" + base_url_language + ".wikipedia.org/w/index.php?origin=*&title=" + title + "&action=raw&withCredentials=false"
        /*
        Tony_Hawk%27s_Underground:1 Access to XMLHttpRequest at 
            'https://es.wikipedia.org/w/index.php?title=Tony_Hawk%27s_Underground&action=raw&origin=*&withCredentials=false' 
            from origin 'https://en.wikipedia.org' 
            has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
        */
        // var wiki_api_raw_text = "https://" + lang + ".wikipedia.org/w/api.php?origin=*&title=" + title + "&text=" + title + "&action=parse"
        // var wiki_api_raw_text = "https://" + lang + ".wikipedia.org/w/api.php?origin=*&titles=" + title + "&action=query"
        var wiki_api_raw_text = "https://" + lang + ".wikipedia.org/w/api.php?origin=*&page=" + title + "&action=parse"
        // https://fr.wikipedia.org/w/api.php?origin=*&page=Tony_Hawk%27s_Underground&action=parse 
        console.log(lang + ": " + wiki_api_raw_text.length);
        httpGetAsync(wiki_api_raw_text, response => lang_to_content_length[lang] = response.length);
        
        // $.ajax({ url: lang_to_url[lang], success: function(data) { alert(data); } });
    }
    console.log(lang_to_content_length);
    var best_lang = undefined;
    var max_len = -1;
    for (const [lang,len] of Object.entries(lang_to_content_length)) {
        if (len > max_len) {
            max_len = len;
            best_lang = lang;
        }
    }
    var wiki_api_set_lang = "https://en.wikipedia.org/w/api.php?action=setpagelanguage&title=" + title + "&lang=" + best_lang + "&";
    console.log(best_lang + ": " + wiki_api_set_lang);

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
