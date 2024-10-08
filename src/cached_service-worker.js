var languages = [];

// Watch for changes to the user's options & apply them
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.options?.newValue) {
    console.log(JSON.stringify(changes.options.newValue));
    languages = changes.options.newValue.languages;
    console.log("Updated languages: " + languages);
  }
});
