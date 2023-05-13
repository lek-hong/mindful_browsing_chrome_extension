chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.greeting == "timer_and_message") {

            $('#time-management-message').text(request.message);

            // try removing existing countdown and replace to reset timer
            if ($("#time-management-timer-value").length) {
                $("#time-management-timer-value").remove();
            }

            // create timer using JQuery
            $("<div>")
                .attr("id", "time-management-timer-value")
                .addClass("h2 text-center text-bg-primary")
                .appendTo("#time-management-timer");

            var secondsLeft = request.timer;

            var timer = setInterval(
                () => {
                    // when timer runs out
                    if (secondsLeft <= 0) {
                        clearInterval(timer);

                        // try removing existing buttons by class
                        if ($("#time-management-proceed_button").length) {
                            $("#time-management-proceed_button").remove();
                            $("#time-management-exit_button").remove();
                        }

                        // create buttons
                        $("<button>")
                            .attr({ id: "time-management-proceed_button", type: "button" })
                            .text("Proceed")
                            .addClass("h3 btn btn-danger")
                            .on("click", function () {
                                chrome.runtime.sendMessage({ greeting: "proceed_clicked" });
                                $('body *').show();
                                $('#time-management-banner').hide();
                            })
                            .appendTo("#button-col1");

                        $("<button>")
                            .attr({ id: "time-management-exit_button", type: "button" })
                            .text("Exit")
                            .addClass("h3 btn btn-success")
                            .on("click", function () {
                                chrome.runtime.sendMessage({ greeting: "exit_clicked" });
                            })
                            .appendTo("#button-col2");
                    }
                    $("#time-management-timer-value").text(secondsLeft);
                    $("#time-management-timer-value").val(secondsLeft);
                    secondsLeft -= 1;

                },
                timeout = 1000
            )
        }
    })

