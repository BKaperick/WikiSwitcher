function myAlert(value){
 // console.log("button clicked")
 //alert('Button Clicked: ' + value);
}

function doSubmitAction() {
    console.log("the doc loaded")
    // document.getElementById('en').addEventListener('click', myAlert);
    var form = document.getElementById("language_selector")
    console.log(form)
    form.addEventListener('submit',function(e){
        e.preventDefault();
        const data = new FormData(e.target);
        alert("added to the form: " + [...data.entries()]);
    }
    );
};

if (document.readyState === "loading") {
  // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', doSubmitAction);
} else {
  // `DOMContentLoaded` has already fired
  doSubmitAction();
}
