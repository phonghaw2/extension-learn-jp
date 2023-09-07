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
        selectLang = element.dataset.valueTarget;
    });
}

function resetClass(className) {
    document.getElementsByClassName(className)[0].classList.remove(className);
}

function setClassByValue(value) {
    document.getElementById('img-' + value).classList.add("is-show");
}

// Show detail letter when click on letter tag
const boxes = document.querySelectorAll('.module-modal');
const overplay = document.getElementById('module-overlay')
boxes.forEach(box => {
    box.addEventListener('click', function handleClick(event) {
        let letter = this.dataset.letter;
        let folder = (selectLang === 'hiragana') ? 'hira' : 'kana';
        overplay.innerHTML = `<figure class="figure-detail"><img src="/images/detail/${folder}/${letter}.png" alt=""></figure>`
        overplay.classList.add("is-show");
    });
});
// Hide overplay show detail of letter
overplay.addEventListener('click', function handleClick(event) {
    const figure_detail = event.target.closest('.figure-detail');
    if (!figure_detail) {
        overplay.classList.remove("is-show");
    }
});
