function myAlert(value){
 // console.log("button clicked")
 //alert('Button Clicked: ' + value);
}

// var languages_selected = [];
var languages_selected = chrome.storage.local.get('languages', function(obj) {
    if (obj === undefined) {
        return [];
    }
    // alert("Found: " + obj.value);
    return obj.value;
});
//alert(languages_selected);

function changeName(username) {
  document.getElementById("username").innerHTML = username;
}

function doSubmitAction() {
    console.log("the doc loaded")
    // document.getElementById('en').addEventListener('click', myAlert);
    var form = document.getElementById("language_selector")
    console.log(form)
    form.addEventListener('submit',function(e){
        e.preventDefault();
        const data = new FormData(e.target);
        data.values().forEach((v) => languages_selected.push(v));
        chrome.storage.local.set({'languages': languages_selected}, function() {
            // Notify that we saved.
        alert("added to the form: " + [...languages_selected]);
        });
    });
};

if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', doSubmitAction);
} else {
  // `DOMContentLoaded` has already fired
  doSubmitAction();
}
