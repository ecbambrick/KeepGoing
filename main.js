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

// Attempts to go to the next page when scrolled to the bottom and space is
// pressed.
document.addEventListener("keydown", (e) => {
    let spacePressed = (e.keyCode  || e.which) == 32;
    let modifiers     = e.ctrlKey || e.shiftKey || e.altKey;
    let position     = getPagePosition();
    let url          = tryInSequence([fromRelationship, fromText]);
    let urlExists    = url != null && url !== undefined;

    if (spacePressed && !modifiers && position.bottom && urlExists) {
        window.location.href = url
    }
}, true);
