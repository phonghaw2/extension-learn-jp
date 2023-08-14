

window.onload =  function() {
  
    const bodyWrapper = document.querySelector('body');
    // Render Toast in bottom
    renderToast();
    renderTooltip();

    function renderToast() {
        const toastInnerHTML = `
            <div id="ext-content" class="is-visible">
                <span id="ext-translate">example<span/>
                <br/>
                <span id="ext-convert">サンプルコンテンツ<span/>
            </div>
            <div id="aqua">
                <img src="https://images3.alphacoders.com/805/805497.png" class="aqua_images"> 
            </div>
        `;
        const toast = document.createElement('div');
        toast.id = "translator-ext-toast";
        toast.innerHTML = toastInnerHTML;
        bodyWrapper.appendChild(toast);
    }
    
    
    $("img").on( "mouseover", function(e) {
        let context = this.alt;
        if (context) {
            // runTranslatorToast(context);
            // runCovert(context);
        }
    });

    bodyWrapper.addEventListener("mouseup" , () => {
        const selectedText = getSelectionText();

        if (selectedText && selectedText.length > 0) {
            const selectedNode = getSelectionNode();
            const getRange = selectedNode.getRangeAt(0);
            const selectedRect = getRange.getBoundingClientRect();

            runTranslatorToast(selectedText);
            runCovert(selectedText);
            // runTranslatorTooltip(selectedRect, selectedText);
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

    function renderTooltip() {
        const tooltipWrapper = document.createElement('div');
        tooltipWrapper.id = "translator-ext-tooltip";

        tooltipWrapper.style.display = "none";
        bodyWrapper.appendChild(tooltipWrapper);
    }
    
    async function runTranslatorTooltip(selectedRect, selectedText) {
        const tooltipDiv = document.getElementById("translator-ext-tooltip");
        const {bottom,height,left,right,top,width} = selectedRect;
        
        const query = encodeURI(selectedText);
        const APIurl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=vi&dt=t&q=${query}`;
        const response = await fetch( APIurl );
        const result = await response.json();

        tooltipDiv.innerHTML = result[0][0][0];
        // Set style
        tooltipDiv.style.display = "block";
        tooltipDiv.style.position = "absolute";
        tooltipDiv.style.background = "black";
        tooltipDiv.style.padding = "4px";
        tooltipDiv.style.height = height + "px";
        tooltipDiv.style.top = top + 20 + "px";
        tooltipDiv.style.left = left + (width / 2 - tooltipDiv.offsetWidth / 2) + "px";

    }

    async function runTranslatorToast(alt) {
        const translate = document.getElementById("ext-translate");
        const query = encodeURI(alt);
        const APIurl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=vi&dt=t&q=${query}`;
        const response = await fetch( APIurl );
        const result = await response.json();

        translate.innerHTML = result[0][0][0];
    }

    async function runCovert(alt) {
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
                // "sentence"      : "漢字が混ざっている文章",
                "output_type"   : "hiragana"
            })
        });

        const content = await rawResponse.json();

        convertSpan.innerHTML = content.converted;
    }

}