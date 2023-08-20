const tabHiragana = document.getElementById("opt-1");
const tabKatakana = document.getElementById("opt-2");
var selectLang;

chrome.storage.sync.get([
    'convertTo'
], (result) => {
    selectLang = result.convertTo;
    addClassInit(selectLang);
});

onClicked(tabHiragana); 
onClicked(tabKatakana); 

function addClassInit(lang) {
    if (lang === 'hiragana') {
        tabHiragana.classList.add("is-choose");
    } else {
        tabKatakana.classList.add("is-choose");
    }
    setClassByValue(lang);
}

function onClicked(element) {
    element.addEventListener("click", () => {
        chrome.storage.sync.set({
            convertTo: element.dataset.valueTarget,
        }, () => {})
        resetClass("is-choose");
        element.classList.add("is-choose");
        resetClass("is-show");
        setClassByValue(element.dataset.valueTarget);
    });
}

function resetClass(className) {
    document.getElementsByClassName(className)[0].classList.remove(className);
}

function setClassByValue(value) {
    document.getElementById('img-' + value).classList.add("is-show");
}