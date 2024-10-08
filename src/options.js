// In-page cache of the user's options
const options = {};
const optionsForm = document.getElementById("language_selector");

//// Immediately persist options changes
//optionsForm.en.addEventListener("change", (event) => {
//  options.languages = event.target.checked; // TODO somehow store as array, maybe add event listener to each checkbox ?
//  chrome.storage.sync.set({ options });
//});

// Immediately persist options changes: en test
optionsForm.en.addEventListener("change", (event) => {
  if (options.languages === undefined) {
    options.languages = [];
    }
  if (!options.languages.includes("en") && event.target.checked){
        options.languages.push("en");
    }
  if (options.languages.includes("en") && !event.target.checked){
       options.languages = options.languages.filter(item => item !== "en")
    }
  alert("Updating local cache: " + options.languages);
  chrome.storage.sync.set({ options });
});

// Initialize the form with the user's option settings
const data = await chrome.storage.sync.get('languages');
if (data === undefined || data.languages === undefined){
    data.languages = [];
}
alert(JSON.stringify(data));
// options.languages = data;
Object.assign(options, data);
alert("Syncing from local cache: " + options.languages + "\n" + "cache: " + data.languages);
optionsForm.en.checked = Boolean(options.languages.includes("en"));// In-page cache of the user's options
