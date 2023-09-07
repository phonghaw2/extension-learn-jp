window.onload =  function() {
  
    const bodyWrapper = document.querySelector('body');
    //init environment var
    var mouseoverInterval = null;
    var translateX;
    var translateY;
    var translateWidth;
    var convertWidth;
    var convertTo;

    // Render Toast in bottom
    renderToast();
    renderTooltip();
    getStorage();

    $("img").on( "mouseover", function(e) {
        hideToast();
        let context = this.alt;
        if (context) {
            mouseoverInterval = window.setTimeout(async function(){
                await runTranslatorToast(context);
                await runCovert(context);
                // Show toast when ready
                showToast();
            }, 800);
        }
    });

    $("img").on( "mouseout", function(e) {
        window.clearTimeout(mouseoverInterval);
        // Hide toast
        hideToast();
    });

    // Selected text content to translate it
    bodyWrapper.addEventListener("mouseup" , (e) => {
        const selectedText = getSelectionText();
        hideToast();

        if (selectedText && selectedText.length > 0) {
            const selectedNode = getSelectionNode();
            const getRange = selectedNode.getRangeAt(0);
            const selectedRect = getRange.getBoundingClientRect();

            // runTranslatorTooltip(selectedRect, selectedText, e.clientY, e.clientX);
            // Aqua will show it =))
            runTranslatorToast(selectedText);
            runCovert(selectedText);
            showToast();
        }
    });

    function getSelectionNode() {
        let node = "";

        if (window.getSelection) {
            node = window.getSelection();
        } else if (document.getSelection) {
            node = document.getSelection();
        } else if (document.selection) {
            node = document.selection.createRange();
        }

        return node;
    }

    function getSelectionText() {
        let selectedText = "";

        if (window.getSelection) {
            selectedText = window.getSelection().toString();
        } else if (document.getSelection) {
            selectedText = document.getSelection().toString();
        } else if (document.selection) {
            selectedText = document.selection.createRange().text;
        }

        return selectedText;
    }

    function renderToast() {
        let toastInnerHTML = `
            <div id="translator-ext-toast">
                <p id="ext-translate"></p>
                <p id="ext-convert"></p>
            </div>
            <div id="aqua">
                <img src="https://images3.alphacoders.com/805/805497.png" class="aqua_images"> 
            </div>
        `;
        const toast = document.createElement('div');
        toast.id = "fixed-toast-div";
        toast.innerHTML = toastInnerHTML;
        bodyWrapper.appendChild(toast);
    }

    function renderTooltip() {
        const tooltipWrapper = document.createElement('div');
        tooltipWrapper.id = "translator-ext-tooltip";

        tooltipWrapper.style.display = "none";
        bodyWrapper.appendChild(tooltipWrapper);
    }
    
    async function runTranslatorTooltip(selectedRect, selectedText, Y, X) {
        const tooltipDiv = document.getElementById("translator-ext-tooltip");
        const {bottom,height,left,right,top,width} = selectedRect;
        
        const query = encodeURI(selectedText);
        const APIurl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=vi&dt=t&q=${query}`;
        const response = await fetch( APIurl );
        const result = await response.json();

        if (result[0][0][0]) {
            tooltipDiv.innerHTML = result[0][0][0];
            // Set style
            translateX = left + (width / 2 - tooltipDiv.offsetWidth / 2) + 'px';
            translateY = bottom + 'px';
            tooltipDiv.style.display = "block";
            tooltipDiv.style.transform = `translate(${translateX}, ${translateY})`;
        } else {
            console.log("No results returned from api https://translate.googleapis.com");
        }
    }

    async function runTranslatorToast(alt) {
        const translate = document.getElementById("ext-translate");
        const query = encodeURI(alt);
        const APIurl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=vi&dt=t&q=${query}`;
        const response = await fetch( APIurl );
        const result = await response.json();

        if (result[0][0][0]) {
            translate.innerHTML = result[0][0][0];
        } else {
            console.log("No results returned from api https://translate.googleapis.com");
        }
    }

    /*! Japanese Hiragana Conversion API
        https://labs.goo.ne.jp/api/en/hiragana-translation/
    */
    async function runCovert(alt) {
        if (!convertTo) {
            getStorage();
        }
        const convertSpan = document.getElementById("ext-convert");
        const rawResponse = await fetch('https://labs.goo.ne.jp/api/hiragana', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "app_id"        : "a5baf7452dfd059981bc587b4f4067d0a0ac85a6c08d0b3295d79bac4fd203a4",
                "request_id"    : "record003",
                "sentence"      : `${alt}`,
                "output_type"   : convertTo
            })
        });

        const response = await rawResponse.json();
        convertSpan.innerHTML = response.converted;
    }

    function hideTooltip() {
        $( "#translator-ext-tooltip" ).removeClass("is-visible");
    }

    function showTooltip() {
        $( "#translator-ext-tooltip" ).addClass("is-visible");
    }

    function hideToast() {
        $( "#ext-translate" ).html();
        $( "#ext-convert" ).html();
        $( "#translator-ext-toast" ).removeClass("is-visible");
    }

    function showToast() {
        // setWidthToastByText();
        $( "#translator-ext-toast" ).addClass("is-visible");
    }

    function setWidthToastByText() {
        translateWidth = $('#ext-translate')[0].offsetWidth;
        convertWidth = $('#ext-convert')[0].offsetWidth;

        if (translateWidth > convertWidth && translateWidth > 300) {
            $( "#translator-ext-toast" )[0].style.width = translateWidth;
        }
        if (convertWidth > translateWidth && convertWidth > 300) {
            $( "#translator-ext-toast" )[0].style.width = convertWidth;
        }
    }

    function getStorage() {
        chrome.storage.sync.get(['convertTo'], (result) => {
            if (result.convertTo) convertTo = result.convertTo;
        })
    }

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync') {
            if (changes.convertTo) {
                convertTo = changes.convertTo.newValue;
            }
        }
    })

    var chooseEle;
    $( "#aqua" ).on( "mousedown", function(e) {
        chooseEle = document.getElementById("fixed-toast-div");
        document.onmousemove = (e) => {
            if (chooseEle) {
                chooseEle.style.left = (e.clientX + 32)  + 'px';
                chooseEle.style.top = (e.clientY + 32) + 'px';
            }
        }
        document.onmouseup = (e) => {
            chooseEle = null;
        }
    });

    // Another way to move aqua =))
    
    // const div = document.querySelector('#fixed-toast-div');
    // const aqua = document.querySelector('#aqua');
    // let offsetX, offsetY;

    // const move = (e) => {
    //     div.style.left = `${e.clientX - offsetX}px`;
    //     div.style.top = `${e.clientY - offsetY}px`;
    // }
    // aqua.addEventListener("mousedown", (e) => {
    //     offsetX = e.clientX - div.offsetLeft;
    //     offsetY = e.clientY - div.offsetTop;
    //     document.addEventListener("mousemove", move);
    // });

    // document.addEventListener("mouseup", () => {
    //     document.removeEventListener("mousemove", move);
    // })

}