chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.greeting === "begin intervention")

            // try removing existing time management banner
            if ($("#time-management-banner").length) {
                $("#time-management-banner").remove();
            }

        // create banner using JQuery
        $("<div>")
            .attr("id", "time-management-banner")
            .addClass("time-management")
            .html("<b>" + request.message + "</b>")
            .appendTo("body");

        // try removing existing countdown and replace to reset timer
        if ($("#time-management-timer").length) {
            $("#time-management-timer").remove();
        }

        // create timer using JQuery
        $("<div>")
            .attr("id", "time-management-timer")
            .addClass("time-management")
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

                    // create buttons
                    $("<button>")
                        .attr("id", "time-management-proceed_button")
                        .text("Proceed")
                        .addClass("time-management")
                        .on("click", function () {
                            chrome.runtime.sendMessage({ greeting: "proceed_clicked" });
                            $('.time-management').hide();
                        })
                        .appendTo("#time-management-banner");

                    $("<button>")
                        .attr("id", "time-management-exit_button")
                        .text("Exit")
                        .addClass("time-management")
                        .on("click", function () {
                            chrome.runtime.sendMessage({ greeting: "exit_clicked" });
                        })
                        .appendTo("#time-management-banner");
                }
                $("#time-management-timer").text(secondsLeft);
                $("#time-management-timer").val(secondsLeft);
                // timer.value = secondsLeft;
                secondsLeft -= 1;

            },
            timeout = 1000
        )
    }
)