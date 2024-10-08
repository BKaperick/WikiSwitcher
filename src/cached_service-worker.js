function updateLanguages(langs) { alert("Changing language settings: " + langs); }

// Watch for changes to the user's options & apply them
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.options?.newValue) {
    const languages = Array(changes.options.newValue.languages);
    console.log('enabled languages:', languages);
    updateLanguages(languages);
  }
});
