chrome.storage.sync.get(["ScrollStayRules"], items => {
    const ScrollStayRules = items.ScrollStayRules;

    if( ScrollStayRules.includes( window.location.host) ) {
        let anchor = null;
        const anchorMark = document.createElement("div");

        anchorMark.style.cssText = `
            position: fixed;
            background: #e2c155;
            opacity: .3;
            pointer-events: none;
            display: none;
        `;

        document.body.appendChild( anchorMark );

        function updateMark() {
            if( anchor ) {
                const rect = anchor.getBoundingClientRect();

                anchorMark.style.top = rect.y + "px";
                anchorMark.style.left = rect.x + "px";

                anchorMark.style.width = rect.width + "px";
                anchorMark.style.height = rect.height + "px";

                anchorMark.style.display = "";
            } else {
                anchorMark.style.display = "none";
            }
        }


        window.addEventListener("mousedown", e => {
            anchor = e.target;
            updateMark();
        });

        window.addEventListener("resize", e => {
            anchor?.scrollIntoView?.();
            updateMark();
        });

        window.addEventListener("scroll", e => {
            updateMark();
        });
    }
});
