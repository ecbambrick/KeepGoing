// -------------------------------------------------------- Utility Functions //

// Gets the positional properties of the visible screen in relation to the page.
let getPagePosition = () => {
    let currentPosition = window.pageYOffset + window.innerHeight;
    let pageHeight      = document.documentElement.scrollHeight;

    return {
        top:    currentPosition <= window.innerHeight,
        bottom: currentPosition >= pageHeight
    };
};

// Calls the given function with the given value if that value is defined and
// not null.
let fmap = (f, x) => {
    if (f != null && x !== null && x !== undefined) {
        return f(x);
    } else {
        return null;
    }
};

// Calls each of the given functions until one returns a value that is defined
// and not null.
let tryInSequence = fs => {
    for (let f of fs) {
        let result = f();

        if (result !== null && result !== undefined) {
            return result;
        }
    }
};

// ---------------------------------------------------------- Link Extractors //

// Gets the first URL from a link with a relationship of "next".
let fromRelationship = () => {
    let links = document.querySelector("link[rel='next'], a[rel='next']");
    return fmap(x => x.href, links);
}

// Gets the first URL from a link that contains a parameter such as p, page, etc
// that is greater than the current page.
let fromParameter = () => {
    let regex = new RegExp(/[&?](p|page|pg|pid|start)=([0-9]+)/);
    let currentPageMatch = window.location.href.match(regex);
    let currentPage = currentPageMatch && currentPageMatch[2];

    if (currentPage == null) {
        return;
    }

    let links = Array.from(document.querySelectorAll("a"))
                     .map(x => ({ element: x, url: x.href, page: x.href.match(regex)}))
                     .filter(x => x.page && Number(x.page[2]) > Number(currentPage))
                     .filter(x => getComputedStyle(x.element).visibility != "hidden");

    if (links.length > 0) {
        return links[0].url;
    }
}

// Gets the first URL from a link with text like ">" or "next".
let fromText = () => {
    let as = Array.from(document.getElementsByTagName("a"));

    let links = as.map(a => ({
        text: a.innerHTML.replace(/\s+/g, '').toLowerCase(),
        href: a.href
    }));

    let getUrl = text => links.filter(x => text == x.text).map(x => x.href)[0];

    return getUrl("next")
        || getUrl("next page")
        || getUrl("older")
        || getUrl("&gt;")
        || getUrl("›");
};

// --------------------------------------------------------------------- Main //

// Attempts to go to the next page when "n" is pressed or when scrolled to the
// bottom and space is pressed.
document.addEventListener("keydown", (e) => {
    let nextPressed  = e.key == "n";
    let spacePressed = e.key == " ";
    let modifiers    = e.ctrlKey || e.shiftKey || e.altKey;
    let position     = getPagePosition();
    let url          = tryInSequence([fromRelationship, fromParameter, fromText]);
    let urlExists    = url != null && url !== undefined;

    if (!urlExists)                                    return;
    if (spacePressed && !modifiers && position.bottom) window.location.href = url;
    if (nextPressed  && !modifiers)                    window.location.href = url;
}, true);
