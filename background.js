// import
import {
    getDomainWithoutSuffix,
    parse
} from './node_modules/tldts/dist/index.esm.min.js';

// functions

function createDomains(websites) {
    const domains = [];
    websites.forEach((website, index) => {
        try {
            domains[index] = getDomainWithoutSuffix(website);
        } catch { }
    })
    return domains;
}

function createDomainProceed(domains) {
    const domain_proceed = {};
    if (domains.length > 0) {
        domains.forEach((domain) => {
            domain_proceed[domain] = false
        })
    }
    return domain_proceed;
}

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

function setTrue(domain, duration) {
    domain_proceed[domain] = true;
    setTimeout(() => {
        domain_proceed[domain] = false;
    }, duration * 1000);
}

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

// initial configuration

// load websites from options.html
let websites = [] // raw array taken via chrome.storage 
let domains = [] // converted websites to domain
let domain_proceed = {}; // dictionary to update status on domains proceed status
let timer = 5;
let message = "Take a deep breath.";

// configure initial values for websites, domains, domain_proceed
chrome.storage.sync.get('websites', (items) => {
    websites = items.websites;
    websites.forEach((website, index) => {
        try {
            domains[index] = getDomainWithoutSuffix(website);
        } catch { }
    })
    domain_proceed = createDomainProceed(domains);
})

// configure initial values for timer and message
chrome.storage.sync.get(['timer', 'message'], (items) => {
    timer = items.timer;
    message = items.message;
})

// onActivated, onUpdated and onFocusChanged event listeners
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

chrome.windows.onFocusChanged.addListener(function(windowId) {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
      chrome.tabs.query({ active: true, windowId: windowId }, function(tabs) {
        if (tabs && tabs.length > 0) {
          var activeTab = tabs[0];
          beginIntervention(domains, domain_proceed, activeTab);
        }
      });
    }
  });  

chrome.runtime.onMessage.addListener(
    function (request, sender) {
        switch (request.greeting) {
            case "proceed_clicked":
                setTrue(getDomainWithoutSuffix(sender.tab.url), 20)
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