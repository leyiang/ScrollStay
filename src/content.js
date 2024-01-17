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

        function isElementInViewport (el) {
            let top = el.offsetTop;
            let width = el.offsetWidth;
            let height = el.offsetHeight;
            let left = el.offsetLeft;

            while(el.offsetParent) {
                el = el.offsetParent;
                top += el.offsetTop;
                left += el.offsetLeft;
            }

            return (
                top < (window.pageYOffset + window.innerHeight) &&
                left < (window.pageXOffset + window.innerWidth) &&
                (top + height) > window.pageYOffset &&
                (left + width) > window.pageXOffset
            );
        }

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
            if( e.ctrlKey ) {
                anchor = e.target;
                updateMark();
            } else if( e.altKey ) {
                anchor = null;
                updateMark();
            }
        });

        window.addEventListener("resize", e => {
            anchor?.scrollIntoView?.();
            updateMark();
        });

        function getNextAnchor( el ) {
            if( ! el ) return;

            let newAnchor = el.nextElementSibling;

            if( ! newAnchor ) {
                const parNode = el.parentNode;

                if( parNode.nextElementSibling?.firstElementChild ) {
                    anchor = parNode.nextElementSibling?.firstElementChild;
                } else {
                    getNextAnchor( parNode );
                }
            } else {
                anchor = newAnchor;
            }
        }

        window.addEventListener("scroll", e => {
            if( anchor ) {

                // Scroll Out View
                if( ! isElementInViewport(anchor) ) {
                    getNextAnchor( anchor );
                }
            }
            updateMark();


        });
    }
});
