// Add textbox with delete button
console.log("options.js console log");
const websitesList = document.querySelector("#websites-list");
const addWebsiteButton = document.querySelector("#add-website");
const saveButton = document.querySelector("#save");
const timerDuration = document.querySelector("#timer-duration");
const customizeMessage = document.querySelector("#customize-message");

function createWebSiteEntry(website) {
    const li = document.createElement("li");
    const input = document.createElement("input");
    input.value = website;
    
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Remove";
    deleteButton.addEventListener("click", () => {
        li.remove();
    });
    li.appendChild(input);
    li.appendChild(deleteButton);
    websitesList.appendChild(li);
};

// create a blank input by default 
addWebsiteButton.addEventListener("click", () => {
    createWebSiteEntry("");
});

// Saves options to chrome.storage
saveButton.addEventListener("click", () => {
    const websites = [];
    const websiteInputs = websitesList.querySelectorAll("input");
    websiteInputs.forEach((websiteInput) => {
        websites.push(websiteInput.value);
    });
    
    var timerInput = 5;
    if (timerDuration.value) {
      timerInput = timerDuration.value;
    }

    var messageInput = "Stop and take a deep breath.";
    if (customizeMessage.value) {
      messageInput = customizeMessage.value;
    }
    
    chrome.storage.sync.set(
      { websites:websites, timer:timerInput, message:messageInput }, () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Websites saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 750);
      }
    );
  });
  
  // Restores options to saved info stored in chrome.storage.
  document.addEventListener("DOMContentLoaded", () =>{
    chrome.storage.sync.get({ websites: [], timer:Number, message: String}, (items) => {
        items.websites.forEach((website) => {
            createWebSiteEntry(website);
        });
        timerDuration.value = items.timer;
        customizeMessage.value = items.message;
    });
  });
  
