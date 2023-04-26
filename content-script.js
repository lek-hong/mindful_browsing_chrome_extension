// content-script.js

chrome.runtime.onMessage.addListener(
    function(request) {
      if (request.greeting === "begin intervention")
        console.log("Send response from content-script.js to background.js");

        // try removing existing time management banner
        if (document.getElementById("time-management-banner")){ 
            document.getElementById("time-management-banner").  textContent = '';
            document.getElementById("time-management-banner").remove();
            console.log("time-management-banner removed");
        }
        else {console.log("time-management-banner not detected")}

        // insert all elements here to prevent repetition
        banner = document.createElement("div");
        banner.id = 'time-management-banner';
        banner.className = 'time-management';
        banner.innerHTML = "<b>Stop and take a deep breath.</b>";
        document.body.appendChild(banner);

        // try removing existing countdown and replace to reset timer
        if (document.getElementById("time-management-timer")){ 
            document.getElementById("time-management-timer").remove();
            console.log("removed timer element");
        }
        else {console.log("timer element not detected");}

        // set up timer
        const timer = document.createElement("div");
        timer.className = "time-management";
        timer.id = "time-management-timer";
        var secondsLeft = 3;
        banner.appendChild(timer);
        
        var downloadTimer = setInterval( 
            () => {
                // when timer runs out
                if (secondsLeft <= 0) {
                    clearInterval(downloadTimer);
                    
                    // try removing existing buttons by class
                    if (document.getElementsByClassName("time-management-button")){ 
                        const elements = document.getElementsByClassName("time-management-button");
                        while(elements.length>0){
                            elements[0].parentNode.removeChild(elements[0]);
                        }
                    }
                    else {console.log("buttons did not need to be removed")};
                    
                    // create buttons
                    const proceed_button = document.createElement("button");
                    const exit_button = document.createElement("button");
                    
                    // add button text
                    proceed_button.textContent = "Proceed";
                    exit_button.textContent = "Exit";
    
                    // set button class 
                    proceed_button.className = "time-management-button";
                    exit_button.className = "time-management-button";
                    
                    // add button id 
                    proceed_button.id = "time-management-proceed_button";
                    exit_button.id = "time-management-exit_button";

                    // insert buttons
                    banner.appendChild(proceed_button);
                    banner.appendChild(exit_button);

                    // add button actions 
                    proceed_button.addEventListener( // proceed: send message to background.js to removeCSS
                        "click",
                        () => {chrome.runtime.sendMessage({greeting: "proceed_clicked"});}
                    );

                    exit_button.addEventListener( // exit: send message to background.js to close tab
                        "click",
                        () => {chrome.runtime.sendMessage({greeting: "exit_clicked"});}
                    );
                    
                }
                timer.textContent = secondsLeft;
                timer.value = secondsLeft;
                secondsLeft -= 1;

            }, 
            timeout=1000 
        )
    }
)