// import modules
'use strict';

chrome.runtime.onInstalled.addListener(
    chrome.runtime.openOptionsPage()
  )

import {
    getDomainWithoutSuffix,
    parse
} from './node_modules/tldts/dist/index.esm.min.js';

// functions
// creates domains from website array
function createDomains(websites) {
    const domains = [];
    websites.forEach((website, index) => {
        try {
            domains[index] = getDomainWithoutSuffix(website);
        } catch { }
    })
    return domains;
}

// creates an object storing status of intervention (if the user clicked on proceed)
function createDomainProceed(domains) {
    const domain_proceed = {};
    if (domains.length > 0) {
        domains.forEach((domain) => {
            domain_proceed[domain] = false
        })
    }
    return domain_proceed;
}

// updates website array and domain_proceed object based on user options
function updateOptions(websites, domain_proceed) {
    const new_domains = createDomains(websites);
    new_domains.forEach(domain => {
        if (!domain_proceed.hasOwnProperty(domain)) {
            domain_proceed[domain] = false;
        }
    });

    Object.keys(domain_proceed).forEach(key => {
        if (!new_domains.includes(key)) {
            delete domain_proceed[key];
        }
    });
    return [websites, new_domains, domain_proceed];
}

// sets domain within domain_proceed object to true for a duration if proceed button is clicked
function setTrue(domain, duration) {
    domain_proceed[domain] = true;
    setTimeout(() => {
        domain_proceed[domain] = false;
    }, duration * 1000);
}

// checks if tab URL falls in specified domain and sends info to content script to begin interventino
function beginIntervention(domains, domain_proceed, tab) {
    domains.forEach((domain) => {
        if (parse(tab.url).isIcann) {
            if (getDomainWithoutSuffix(tab.url) == domain && !domain_proceed[domain]) {
                try {
                    chrome.tabs.sendMessage(tab.id, {
                        greeting: "begin intervention",
                        message: message,
                        timer: timer
                    })
                } catch {
                    setTimeout(() => {
                        chrome.tabs.sendMessage(tab.id, {
                            greeting: "begin intervention",
                            message: message,
                            timer: timer
                        })
                    }, 3000)
                }
            }
        }
    })
}

let websites = [] // raw array taken via chrome.storage 
let domains = [] // converted websites to domain
let domain_proceed = {}; // dictionary to update status on domains proceed status
let timer = 5;
let proceed_timer = 20;
let message = "Take a deep breath.";

// get initial values for websites, domains, domain_proceed from options
chrome.storage.sync.get('websites', (items) => {
    websites = items.websites;
    if (Array.isArray(websites)) {
        websites.forEach((website, index) => {
            try {
                domains[index] = getDomainWithoutSuffix(website);
            } catch { console.log("Invalid URL, to be ignored") } // ideally this should be checked in options.js; possible future iteration
        })
        domain_proceed = createDomainProceed(domains);    
    } else {
        console.log("No websites stored.")
    }
})

// configure initial values for timer, proceed_timer and message
chrome.storage.sync.get(['timer', 'proceed_timer', 'message'], (items) => {
    timer = items.timer;
    proceed_timer = items.proceed_timer;
    message = items.message;
})

// onActivated, onUpdated and onFocusChanged event listeners to detect when to commence intervention
chrome.tabs.onActivated.addListener(
    (tab) => {
        chrome.tabs.get(tab.tabId, (tab) => {
            if (tab.active) {
                beginIntervention(domains, domain_proceed, tab)
            }
        })
    }
)

chrome.tabs.onUpdated.addListener(
    (tabId, changeInfo, tab) => {
        if (tab.active && changeInfo.status == "complete") {
            beginIntervention(domains, domain_proceed, tab)
        }
    }
);

chrome.windows.onFocusChanged.addListener(function (windowId) {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        chrome.tabs.query({ active: true, windowId: windowId }, function (tabs) {
            if (tabs && tabs.length > 0) {
                var activeTab = tabs[0];
                beginIntervention(domains, domain_proceed, activeTab);
            }
        });
    }
});

// check for incoming messages from content script and options
chrome.runtime.onMessage.addListener(
    function (request, sender) {
        switch (request.greeting) {
            case "proceed_clicked":
                setTrue(getDomainWithoutSuffix(sender.tab.url), proceed_timer)
                break

            case "exit_clicked":
                chrome.tabs.remove(sender.tab.id)
                break

            case "options_update":
                [websites, domains, domain_proceed] = updateOptions(request.websites, domain_proceed);
                timer = request.timer;
                message = request.message;
        }
    }
);