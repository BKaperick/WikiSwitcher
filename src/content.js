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
    const re = /https?:\/\/(www\.)?(.*)\.wikipedia\.org\/wiki\/([^#]*)#?(.*)?/;
    var info = document.URL.match(re);
    var base_url_language = info[2];
    var title = info[3];
    var section = info[4];

    var wiki_api_langlinks = "https://" + base_url_language + ".wikipedia.org/w/api.php?origin=*&prop=langlinks&llprop=url&action=query&format=json&lllimit=max&titles=" + title
    var lang_to_url = {};
    var lang_to_content_length = {};
    var lang_to_title = {};
    var page_id = undefined;
    console.log("user languages loaded: " + languages);    
    console.log(wiki_api_langlinks);
    httpGetAsync(wiki_api_langlinks, (text,response) => {
        const resp_obj = JSON.parse(response).query.pages;
        for (const [resp_page_id, langs] of Object.entries(resp_obj)) {
            page_id = resp_page_id;
            for (const resp_lang of langs.langlinks) {
                const l = resp_lang.lang;
                if (languages.includes(l)) {
                    lang_to_url[l] = resp_lang.url;
                    lang_to_title[l] = resp_lang .url.match(re)[3];
                }
            }
        }
    lang_to_url[base_url_language] = document.URL;
    lang_to_title[base_url_language] = title;
    for (const lang in lang_to_url) { 
        var lang_title = lang_to_title[lang];
        var wiki_api_raw_text = "https://" + lang + ".wikipedia.org/w/api.php?origin=*&page=" + lang_title + "&prop=wikitext&action=parse"
        console.log(lang + " raw: " + wiki_api_raw_text);
        httpGetAsync(wiki_api_raw_text, (response,_) => {
            lang_to_content_length[lang] = response.length
            
            // We use this condition to check that we're in the last api response callback among all langs
            if (Object.keys(lang_to_content_length).length === Object.keys(lang_to_url).length) {

                console.log("current language: " + base_url_language);
                console.log(lang_to_url);
                console.log(lang_to_content_length);
                var best_lang = undefined;
                var max_len = -1;
                for (const [lang,len] of Object.entries(lang_to_content_length)) {
                    console.log("considering " + lang + " and " + len)
                    if (len > max_len) {
                        max_len = len;
                        best_lang = lang;
                    }
                }
                console.log(lang_to_content_length)
                var wiki_api_set_lang = "https://" + base_url_language + ".wikipedia.org/w/api.php?action=setpagelanguage&title=" + title + "&lang=" + best_lang + "&";

                if (best_lang === base_url_language) {
                    console.log("We are currently in the best language for this article");
                } else {
                    var trad_best_lang = best_lang;
                    if (best_lang in translate_lang)
                        trad_best_lang = translate_lang[best_lang];
                    if (window.confirm("A longer article exists for this topic in " + trad_best_lang + ".\n\nWould you prefer to read that one?"))
                        window.location.href = lang_to_url[best_lang];
                    }
            }
        });
                
            }
        });
}
