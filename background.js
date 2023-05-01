import {
    getDomainWithoutSuffix,
    parse
} from './node_modules/tldts/dist/index.esm.min.js';

// load websites from options.html
let websites = [] // raw array taken via chrome.storage 
let domains = [] // converted websites to domain
const domain_proceed = {}; // dictionary to update status on domains proceed status

chrome.storage.sync.get('websites', (items) => {
    websites = items.websites
    websites.forEach((website, index) => {
        try {
            domains[index] = getDomainWithoutSuffix(website);
        } catch {}
    })
})

// set domain_proceed based on website list
if (domains.length > 0) {
    domains.forEach((domain) => {
        domain_proceed[domain] = false
    })
}

// functions
function setTrue(domain, duration) {
    domain_proceed[domain] = true;
    setTimeout(() => {
        domain_proceed[domain] = false;
    }, duration * 1000);
}

// function beginIntervention(domains, domain_proceed, tab, css_filepath)
/* domains.forEach((domain) => {
    if (parse(tab.url).isIcann) {
        if (getDomainWithoutSuffix(tab.url) == domain && !domain_proceed[domain]) {
            chrome.storage.sync.get(['timer', 'message'], (items) => {
                const timer = items.timer;
                const message = items.message;
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
            })

            try {
                chrome.scripting.removeCSS({
                    files: ["time-management.css"],
                    target: {
                        tabId: tab.id
                    },
                })
            } finally {
                chrome.scripting.insertCSS({
                    files: ["time-management.css"],
                    target: {
                        tabId: tab.id
                    },
                })
            }
        }
    }
}) */


chrome.tabs.onActivated.addListener(
    (tab) => {
        chrome.tabs.get(tab.tabId, (tab) => {
            if (tab.active) {
                domains.forEach((domain) => {
                    if (parse(tab.url).isIcann) {
                        if (getDomainWithoutSuffix(tab.url) == domain && !domain_proceed[domain]) {
                            chrome.storage.sync.get(['timer', 'message'], (items) => {
                                const timer = items.timer;
                                const message = items.message;
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
                            })

                            try {
                                chrome.scripting.removeCSS({
                                    files: ["time-management.css"],
                                    target: {
                                        tabId: tab.id
                                    },
                                })
                            } finally {
                                chrome.scripting.insertCSS({
                                    files: ["time-management.css"],
                                    target: {
                                        tabId: tab.id
                                    },
                                })
                            }
                        }
                    }
                })
            }
        })
    }
)

chrome.tabs.onUpdated.addListener(
    (tabId, changeInfo, tab) => {
        if (tab.active && changeInfo.status == "complete") {
            domains.forEach((domain) => {
                if (parse(tab.url).isIcann) {
                    if (getDomainWithoutSuffix(tab.url) == domain && !domain_proceed[domain]) {
                        chrome.storage.sync.get(['timer', 'message'], (items) => {
                            const timer = items.timer;
                            const message = items.message;
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
                        })
                        try {
                            chrome.scripting.removeCSS({
                                files: ["time-management.css"],
                                target: {
                                    tabId: tabId
                                }
                            })
                        } finally {
                            chrome.scripting.insertCSS({
                                files: ["time-management.css"],
                                target: {
                                    tabId: tabId
                                }
                            })
                        }
                    }
                }
            })
        }
    }
);

chrome.runtime.onMessage.addListener(
    function (request, sender) {
        switch (request.greeting) {
            case "proceed_clicked":
                chrome.scripting.removeCSS({
                    files: ["time-management.css"],
                    target: {
                        tabId: sender.tab.id
                    }
                })
                setTrue(getDomainWithoutSuffix(sender.tab.url), 20)
                break

            case "exit_clicked":
                chrome.tabs.remove(
                    sender.tab.id
                )
                break
        }
    }
);