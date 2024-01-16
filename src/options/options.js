const mainDOM = document.querySelector("main");

let ScrollStayRules = [];

function updateRules() {
    chrome.storage.sync.set({ ScrollStayRules });
    location.reload();
}

function dom(inner) {
    const div = document.createElement("div");
    div.innerHTML = inner;
    return div.firstElementChild;
}

function createRuleDOM(config) {

    //language=HTML
    const template = `
        <form class="rule-item">
            <input type="text" class="url-input" placeholder="URL" value="${config.url}" required>
            <button class="remove-btn" type="button">Remove</button>
            <button>Update</button>
        </form>
    `;

    return dom(template);
}

chrome.storage.sync.get(["ScrollStayRules"], items => {
    ScrollStayRules = items.ScrollStayRules;

    ScrollStayRules.forEach( url => {
        const formDOM = createRuleDOM({url});
        mainDOM.appendChild( formDOM );

        const remove = formDOM.querySelector(".remove-btn");

        remove.addEventListener("click", () => {
            if( confirm("You sure to remove?") ) {
                ScrollStayRules = ScrollStayRules.filter(link => link != url);
                updateRules()
            }
        });

        formDOM.addEventListener("submit", e => {
            e.preventDefault();
            const newUrl = formDOM.querySelector(".url-input").value;

            ScrollStayRules = ScrollStayRules.filter(link => link != url);
            ScrollStayRules.push( newUrl );

            updateRules();
        });
    });
});

document.querySelector(".add-new").addEventListener("click", () => {
    const template = `
        <form class="rule-item">
            <input type="text" placeholder="URL" class="url-input" required>
            <button>Save</button>
        </form>
    `;

    const newDOM = dom(template);
    mainDOM.appendChild(newDOM);

    newDOM.addEventListener("submit", (e) => {
        e.preventDefault();
        const url = newDOM.querySelector(".url-input").value;

        ScrollStayRules.push( url );
        updateRules();
    });
});
