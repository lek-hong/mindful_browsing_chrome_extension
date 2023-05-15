chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.greeting === "begin intervention")

            // try removing existing time management banner
            if ($("#shadow-host").length) {
                $("#shadow-host").remove();
            }

        // add banner 
        var banner = $("<div>")
            .attr("id", "shadow-host")
            .appendTo("body")[0];

        var shadow = banner.attachShadow({ mode:"open"});
        
        // add bootstrap
        // Create a link element and set its href attribute to the Bootstrap CSS file
        var link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", chrome.runtime.getURL("./node_modules/bootstrap/dist/css/bootstrap.min.css"));

        // Create a script element and set its src attribute to the Bootstrap JS file
        var script = document.createElement("script");
        script.setAttribute("src", chrome.runtime.getURL("./node_modules/bootstrap/dist/js/bootstrap.min.js"));
        

        // Append the link element to the shadow root
        shadow.appendChild(link);
        shadow.appendChild(script);
        
        // create container
        $("<div>")
            .attr("id", "time-management-banner")
            .addClass("container-fluid p-5 my-5 border bg-primary")
            .appendTo(shadow);

        // add paragraph 
        $("<p>")
            .attr("id", "time-management-message")
            .addClass("h1 text-center text-bg-primary")
            .text(request.message)
            .appendTo(shadow.querySelector("#time-management-banner"));
        
        // hide certain elements on the page
        $("#shadow-host").siblings().css({"visibility": "hidden"});
        $("html, body").css("overflow", "hidden");

        // try removing existing countdown and replace to reset timer
        if (shadow.querySelector("#time-management-timer")) {
            shadow.querySelector("#time-management-timer").remove();
        }

        // create timer 
        $("<div>")
            .attr("id", "time-management-timer")
            .addClass("h2 text-center text-bg-primary")
            .appendTo(shadow.querySelector("#time-management-banner"));

        var secondsLeft = request.timer;

        var timer = setInterval(
            () => {
                // when timer runs out
                if (secondsLeft <= 0) {
                    clearInterval(timer);

                    // try removing existing buttons by id
                    if (shadow.querySelector("#time-management-proceed_button")) {
                        shadow.querySelector("#time-management-proceed_button").remove();
                        shadow.querySelector("#time-management-exit_button").remove();
                    }
                    // create columns
                    $("<div>")
                        .attr("id", "button-row")
                        .addClass("row")
                        .appendTo(shadow.querySelector("#time-management-banner"));

                    $("<div>")
                        .attr("id", "button-col1")
                        .addClass("col p-3 text-center")
                        .appendTo(shadow.querySelector("#button-row"));

                    $("<div>")
                        .attr("id", "button-col2")
                        .addClass("col p-3 text-center")
                        .appendTo(shadow.querySelector("#button-row"));

                    // create buttons
                    $("<button>")
                        .attr({id: "time-management-proceed_button", type:"button"})
                        .text("Proceed")
                        .addClass("h3 btn btn-danger")
                        .on("click", function () {
                            // $('.time-management-hidden').show();
                            $("#shadow-host").siblings().css({"visibility": "visible"});
                            $("#shadow-host").css({"visibility": "hidden"});
                            $("html, body").css("overflow", "visible");
                            chrome.runtime.sendMessage({ greeting: "proceed_clicked" });
                        })
                        .appendTo(shadow.querySelector("#button-col1"));

                    $("<button>")
                        .attr({id: "time-management-exit_button", type:"button"})
                        .text("Exit")
                        .addClass("h3 btn btn-success")
                        .on("click", function () {
                            chrome.runtime.sendMessage({ greeting: "exit_clicked" });
                        })
                        .appendTo(shadow.querySelector("#button-col2"));
                }

                shadow.querySelector("#time-management-timer").textContent = secondsLeft;
                shadow.querySelector("#time-management-timer").value = secondsLeft;
                secondsLeft -= 1;

            },
            timeout = 1000
        )
		// STYLE CODE
		$("#shadow-host").css({
			"z-index": "9999",
			"position": "fixed",
			"top": "0",
			"left": "0",
			"width": "100%",
			"height": "100%",
			"background-color": "rgba(0, 0, 0, 0.5)"
		  });
		
		  $("#time-management-banner").css({
			"position": "absolute",
			"top": "50%",
			"left": "50%",
			"transform": "translate(-50%, -50%)",
			"z-index": "10000",
			"background-color": "#ffffff",
			"padding": "10px",
			"border-radius": "5px"
		  });
		
		  $("#time-management-message").css({
			"font-size": "24px",
			"text-align": "center"
		  });
		
		  $("#time-management-timer").css({
			"font-size": "36px",
			"text-align": "center"
		  });
		
		  $("#button-row").css({
			"display": "flex",
			"justify-content": "center",
			"margin-top": "20px"
		  });
		
		  $("#button-col1, #button-col2").css({
			"flex": "1",
			"margin": "0 10px"
		  });
		
		  $("#time-management-proceed_button, #time-management-exit_button").css({
			"width": "100%",
			"font-size": "24px",
			"padding": "10px",
			"border-radius": "5px",
			"cursor": "pointer"
		  });
		
		  $("#time-management-proceed_button").css({
			"background-color": "#f44336",
			"color": "#ffffff"
		  });
		
		  $("#time-management-exit_button").css({
			"background-color": "#4caf50",
			"color": "#ffffff"
		  });
    }
)