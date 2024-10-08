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


function getLanguageRedirect(languages) {
    
    console.log("page is loaded: " + document.URL + " with state " + document.readyState);
    console.log("doc: " + JSON.stringify(document.URL));
    // var languageDom = document.querySelector("#p-lang-label");
    // var languageDom = document.getElementById("p-lang-label");
    var languageDom = document.getElementById("p-lang");
    // var links_ = languageDom.value.querySelectorAll("p-lang");
    // var links_ = languageDom.querySelectorAll("a#interlanguage-link-target");
    var links_ = languageDom.querySelectorAll("a.interlanguage-link-target");
    var links = [...links_];
    var candidates = [];
    console.log(JSON.stringify(languageDom));
    console.log(links);
    links.forEach(l =>
    {
        if (languages.includes(l.lang)) {
            candidates.push(l.lang);
        }
    });
    console.log("user languages loaded: " + languages);    
    console.log("candidate languages: " + candidates);
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
