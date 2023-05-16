// retrieve elements 
const websitesList = $("#websites-list");
const addWebsiteButton = $("#add-website");
const saveButton = $("#save");

// set default values
const default_timer = 5;
const default_proceed_timer = 20;
const default_message = "Stop and take a deep breath.";

// create a list item containing a website and option to delete entry
function createWebSiteEntry(website) {
	const li = $("<li></li>")
		.css({
			display: "flex",
			justifyContent: "space-between",
			alignItems: "baseline"
		})
		.addClass("list-group-item list-group-item-info");
	const input = $("<input>")
		.addClass("form-label")
		.css("flex-grow", "1")
		.val(website);

	const deleteButton = $("<button></button>")
		.text("Remove")
		.css("flex-grow", "0")
		.on("click", () => {
			li.remove();
		});

	li.append(input);
	li.append(deleteButton);
	websitesList.append(li);
}

// create a blank input by default
addWebsiteButton.on("click", function () {
	createWebSiteEntry("");
});

// Populate fields with previously saved info stored in chrome.storage.
$(function () {
	chrome.storage.sync.get({ websites: [], timer: default_timer, proceed_timer: default_proceed_timer, message: default_message }, (items) => {
		items.websites.forEach((website) => {
			createWebSiteEntry(website);
		});

		$('#timer-duration').val(items.timer);
		$('#proceed-duration').val(items.proceed_timer);
		$('#customize-message').val(items.message);
	});
});

// Saves options to chrome.storage
saveButton.on("click", function () {
	const websites = [];
	const websiteInputs = websitesList.find("input");
	websiteInputs.each(function () {
		websites.push($(this).val());
	});

	// save either the input value or default value if empty
	var timerInput = $('#timer-duration').val() || default_timer;
	var proceedTimerInput = $('#proceed-duration').val() || default_proceed_timer;
	var messageInput = $('#customize-message').val() || default_message;

	// send updated options to background since options have to be updated live
	chrome.runtime.sendMessage({ greeting: "options_update", websites: websites, timer: timerInput, message: messageInput });

	// but store values as well so the extension can retrieve them in the next session
	chrome.storage.sync.set(
		{ websites: websites, timer: timerInput, proceed_timer: proceedTimerInput, message: messageInput }, () => {
			// Update status to let user know options were saved.
			const status = $('#status');
			status.text('Options saved.');
			setTimeout(() => {
				status.text('');
			}, 1000);
		}
	);
});
