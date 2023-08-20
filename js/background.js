chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        convertTo: 'hiragana',
    }, () => {})
});

let convertTo = 'hiragana';

chrome.storage.sync.get([
    'convertTo'
], (result) => {
    convertTo = result.convertTo;
})

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        if (changes.convertTo) {
            convertTo = changes.convertTo.newValue;
        }
    }
})
