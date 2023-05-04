chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.greeting === "begin intervention")

            // try removing existing time management banner
            if ($("#time-management-banner").length) {
                $("#time-management-banner").remove();
            }

        // add banner 
        $("<div>")
            .attr("id", "time-management-banner")
            .addClass("container p-5 my-5 border bg-primary")
            .appendTo("body");
        
        // add paragraph 
        $("<p>")
            .attr("id", "time-management-message")
            .addClass("h1 text-center text-bg-primary")
            .text(request.message)
            .appendTo("#time-management-banner")
        
            // hide all siblings of time-management-banner
        $('#time-management-banner').siblings().hide();
        
        // try removing existing countdown and replace to reset timer
        if ($("#time-management-timer").length) {
            $("#time-management-timer").remove();
        }

        // create timer using JQuery
        $("<div>")
            .attr("id", "time-management-timer")
            .addClass("h2 text-center text-bg-primary")
            .appendTo("#time-management-banner");

        var secondsLeft = request.timer;

        var downloadTimer = setInterval(
            () => {
                // when timer runs out
                if (secondsLeft <= 0) {
                    clearInterval(downloadTimer);

                    // try removing existing buttons by class
                    if ($("#time-management-proceed_button").length) {
                        $("#time-management-proceed_button").remove();
                        $("#time-management-exit_button").remove();
                    }
                    // create columns
                    $("<div>")
                        .attr("id", "button-row")
                        .addClass("row")
                        .appendTo("#time-management-banner");

                    $("<div>")
                        .attr("id", "button-col1")
                        .addClass("col p-3 text-center")
                        .appendTo("#button-row");

                    $("<div>")
                        .attr("id", "button-col2")
                        .addClass("col p-3 text-center")
                        .appendTo("#button-row");

                    // create buttons
                    $("<button>")
                        .attr({id: "time-management-proceed_button", type:"button"})
                        .text("Proceed")
                        .addClass("h3 btn btn-primary")
                        .on("click", function () {
                            chrome.runtime.sendMessage({ greeting: "proceed_clicked" });
                            $('body *').show();
                            $('#time-management-banner').hide();
                        })
                        .appendTo("#button-col1");

                    $("<button>")
                        .attr({id: "time-management-exit_button", type:"button"})
                        .text("Exit")
                        .addClass("h3 btn btn-outline-secondary")
                        .on("click", function () {
                            chrome.runtime.sendMessage({ greeting: "exit_clicked" });
                        })
                        .appendTo("#button-col2");
                }
                $("#time-management-timer").text(secondsLeft);
                $("#time-management-timer").val(secondsLeft);
                secondsLeft -= 1;

            },
            timeout = 1000
        )
    }
)