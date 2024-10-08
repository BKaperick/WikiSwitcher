// In-page cache of the user's options
const options = {'languages': []};
const optionsForm = document.getElementById("language_selector");

//// Immediately persist options changes
//optionsForm.en.addEventListener("change", (event) => {
//  options.languages = event.target.checked; // TODO somehow store as array, maybe add event listener to each checkbox ?
//  chrome.storage.local.set({ options });
//});

// Immediately persist options changes
optionsForm.en.addEventListener("change", (event) => {
  if (!options.languages.includes("en") && event.target.checked){
        options.languages.push("en");
    }
  if (options.languages.includes("en") && !event.target.checked){
       options.languages = options.languages.filter(item => item !== "en")
    }
  chrome.storage.local.set({ options });
});

// Initialize the form with the user's option settings
const data = await chrome.storage.local.get("languages");
Object.assign(options, data.options);
optionsForm.en.checked = Boolean(options.languages.includes("en"));// In-page cache of the user's options
