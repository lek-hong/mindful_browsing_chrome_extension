'use strict';
// only begin intervention if message is received from background
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
            .css({
                "position": "fixed",
                "top": "0",
                "left": "0",
                "width": "100%",
            })
            .appendTo("body")[0];

        // create shadow host to isolate css style
        var shadow = banner.attachShadow({ mode: "open" });

        // add bootstrap
        var link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", chrome.runtime.getURL("./node_modules/bootstrap/dist/css/bootstrap.min.css"));
        shadow.appendChild(link);

        var script = document.createElement("script");
        script.setAttribute("src", chrome.runtime.getURL("./node_modules/bootstrap/dist/js/bootstrap.min.js"));
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

        // hide sibling elements and prevent overflow
        $("#shadow-host").siblings().css({ "visibility": "hidden" });
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
        const timeout = 1000; // Timeout value in milliseconds

        var timer = setInterval(
            () => {
                // when timer runs out
                if (secondsLeft <= 0) {
                    clearInterval(timer);

                    // create columns for buttons
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

                    // create proceed (proceed with website use) and exit (closes tab) buttons
                    $("<button>")
                        .attr({ id: "time-management-proceed_button", type: "button" })
                        .text("Proceed")
                        .addClass("h3 btn btn-danger")
                        .on("click", function () {
                            $("#shadow-host").siblings().css({ "visibility": "visible" });
                            $("#shadow-host").css({ "visibility": "hidden" });
                            $("html, body").css("overflow", "visible");
                            chrome.runtime.sendMessage({ greeting: "proceed_clicked" });
                        })
                        .appendTo(shadow.querySelector("#button-col1"));

                    $("<button>")
                        .attr({ id: "time-management-exit_button", type: "button" })
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
            timeout
        )
    }
)