// In-page cache of the user's options
const options = {};
const optionsForm = document.getElementById("language_selector");
const submit = document.getElementById("submit");

function updateOptionsFromForm(target) {
  var langs = [];
  for (var ind in target) {
      const elem = target.elements[ind]
      if (event.target.hasOwnProperty(ind) && elem.type === "checkbox") {
        const lang = elem.id;
        if (elem.checked){
            langs.push(lang);
        }
      }
  }
  options["languages"] = langs;
  chrome.storage.sync.set({ options });
}


// TODO doesn't work
// optionsForm.addEventListener("change", (event) => updateOptionsFromForm(event.target));

optionsForm.addEventListener("submit", (event) => updateOptionsFromForm(event.target));

// Initialize the form with the user's option settings
const data = await chrome.storage.sync.get("options");
Object.assign(options, data.options);

var boxes = [...optionsForm.querySelectorAll("input[type=checkbox]")];
boxes.forEach(cb =>
{
    cb.checked = Boolean(options.languages !== undefined && options.languages.includes(cb.id));
});
