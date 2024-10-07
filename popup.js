function doSubmitAction() {
    console.log("the doc loaded")
    var form = document.getElementById("language_selector")
    console.log(form)
    form.addEventListener('submit',function(e){
        e.preventDefault()
        console.log("added to the form")
    }
  )};

if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', doSubmitAction);
} else {
  // `DOMContentLoaded` has already fired
  doSubmitAction();
}
