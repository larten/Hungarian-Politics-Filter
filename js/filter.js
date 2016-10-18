/*
 * Politics Filter - Content Script
 *
 * This is the primary JS file that manages the detection and filtration of politics from the web page.
 */

// Variables
var words = ["orbán", "jobbik", "kóka", "gyurcsány"];

var regex = new RegExp(words.join("|"), "i");
var search = regex.exec(document.body.innerText);
console.log("Regex: " + regex);

var selector = "";

for (i = 0; i < words.length; i++) {
    selector += ":contains('";
    selector += words[i];
    selector += "')";
    selector += ", ";

    selector += ":contains('";
    selector += words[i].toUpperCase();
    selector += "')";
    selector += ", ";

    selector += ":contains('";
    selector += words[i].charAt(0).toUpperCase() + words[i].slice(1);
    selector += "')";

    if (i != words.length - 1) {
        selector += ", ";
    }
}
console.log("Selector: " + selector);

// Functions
function filterMild() {
    console.log("Filtering Politics with Mild filter...");
    return $(selector).filter("h1,h2,h3,h4,h5,p,span,li");
}

function filterDefault() {
    console.log("Filtering Politics with Default filter...");
    return $(selector).filter(":only-child").closest('div');
}

function filterVindictive() {
    console.log("Filtering Politics with Vindictive filter...");
    return $(selector).filter(":not('body'):not('html')");
}

function getElements(filter) {
    if (filter == "mild") {
        return filterMild();
    } else if (filter == "vindictive") {
        return filterVindictive();
    } else if (filter == "aggro") {
        return filterDefault();
    } else {
        return filterMild();
    }
}

function filterElements(elements) {
    console.log("Elements to filter: ", elements);
    elements.fadeOut("fast");
}


// Implementation
if (search) {
    console.log("Politics found on page! - Searching for elements...");
    chrome.storage.sync.get({
        filter: 'aggro',
    }, function (items) {
        console.log("Filter setting stored is: " + items.filter);
        elements = getElements(items.filter);
        filterElements(elements);
        console.log("Logging " + elements.length + " Politicss.");
    });
    chrome.runtime.sendMessage({}, function (response) {
    });
}
