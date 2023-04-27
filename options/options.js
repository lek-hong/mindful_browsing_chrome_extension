// Add textbox with delete button
console.log("options.js console log");
const websitesList = document.querySelector("#websites-list");
const addWebsiteButton = document.querySelector("#add-website");
const saveButton = document.querySelector("#save");
const default_timer = 5;
const default_message = "Stop and take a deep breath.";

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
    
    var timerInput = document.getElementById('timer-duration').value || default_timer;
    var messageInput = document.getElementById('customize-message').value || default_message;
    
    chrome.storage.sync.set(
      { websites:websites, timer:timerInput, message:messageInput }, () => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
          status.textContent = '';
        }, 1000);
      }
    );
  });
  
  // Restores options to saved info stored in chrome.storage.
  document.addEventListener("DOMContentLoaded", () =>{
    chrome.storage.sync.get({ websites: [], timer:default_timer, message:default_message}, (items) => {
        items.websites.forEach((website) => {
            createWebSiteEntry(website);
        });

        document.getElementById('timer-duration').value = items.timer;
        document.getElementById('customize-message').value = items.message;


    });
  });
  
