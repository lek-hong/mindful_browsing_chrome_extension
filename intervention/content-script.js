chrome.runtime.onMessage.addListener(
	function (request) {
		if (request.greeting === "begin intervention") {
			$('<iframe>')
				.attr({
					src: chrome.runtime.getURL('intervention/intervention.html'),
					id: 'intervention-iframe',
					frameborder: 0,
					height: '500px',
					width: '100%',
					scrolling: 'no',
				})
				.appendTo('body');

			setTimeout(() => {
				chrome.runtime.sendMessage({
					greeting: "timer_and_message",
					message: request.message,
					timer: request.timer
				}).then((response) => {
					if (response) {
						console.log('message not sent');
					} else {
						console.log('message sent');
					}
				});

			}, 100)


			$('#intervention-iframe').siblings().hide();
		}
	}
)
