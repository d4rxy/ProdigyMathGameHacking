// @ts-nocheck
import { Toast, Input } from "../utils/swal";
import { Hack, category, Toggler, dimensions } from "../index";
import { _, saveCharacter } from "../utils/util";

new Hack(category.utility, "Save Character Locally", "Saves your character locally.").setClick(async () => {
	localStorage.setItem("playerData", JSON.stringify(_.player.getUpdatedData(true)));
	await Toast.fire("Success!", "Note: Load Character will only work on this device.", "success");
});

new Hack(category.utility, "Load local character", "Loads your character locally.").setClick(async () => {
	if (!localStorage.getItem("playerData")) {
		await Toast.fire("Error", "No saved character.", "error");
	} else {
		const playerData = localStorage.getItem("playerData");
		fetch(`https://api.prodigygame.com/game-api/v3/characters/${_.player.userID}`, {
			headers: {
				accept: "*/*",
				"accept-language": "en-US,en;q=0.9",
				authorization: localStorage.JWT_TOKEN,
				"content-type": "application/json",
				"sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
				"sec-ch-ua-mobile": "?0",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-site"
			},
			referrer: "https://play.prodigygame.com/",
			referrerPolicy: "strict-origin-when-cross-origin",
			body: JSON.stringify({
				data: playerData,
				userID: _.player.userID
			}),
			method: "POST",
			mode: "cors"
		});
		await Toast.fire("Success!", "Character has been successfully loaded. Reload for the changes to take effect.", "success");
	}
});

new Hack(category.utility, "Save Character", "Helps fix bugs where not all hacks save.").setClick(async () => {
	saveCharacter();
	await Toast.fire("Success!", "Your character has been saved!", "success");
});
new Hack(category.utility, "Close all popups", "Closes all popups in Prodigy.").setClick(async () => {
	_.instance.prodigy.open.menuCloseAll();
	await Toast.fire("Closed!", "All open popups were closed.", "success");
});
new Hack(category.utility, "Update menu", "Updates menu to the latest version without needing to reload.").setClick(async () => {
	document.getElementById("cheat-menu")?.remove();
	document.getElementById("menu-toggler")?.remove();
	(async () => {
		eval(await (await fetch(`https://raw.githubusercontent.com/Prodigy-Hacking/ProdigyMathGameHacking/HEAD/willsCheatMenu/dist/bundle.js?updated=${Date.now()}`)).text()); // updated parameter is so browser ignores cached version
	})();
	await Toast.fire("Updated!", "Cheat menu was updated.", "success");
});
new Hack(category.utility, "Disable inactivity kick", "Keeps you from being logged out for inactivity.").setClick(async () => {
	_.constants.constants["GameConstants.Inactivity.LOG_OUT_TIMER_SECONDS"] = 0;
	await Toast.fire("Success!", "You now will never be logged out!", "success");
});

new Toggler(category.utility, "Enable menu resize drag (bottom right corner)", "Allows you to resize the menu via dragging.").setEnabled(async () => {
	document.getElementById("cheat-menu").style.resize = "both";
}).setDisabled(() => {
	document.getElementById("cheat-menu").style.resize = "none";
	document.getElementById("cheat-menu").style.height = dimensions.height;
	document.getElementById("cheat-menu").style.width = dimensions.width;
});

new Hack(category.utility, "Edit walkspeed").setClick(async () => {
	const walkSpeed = await Input.fire("What do you want to set your walk speed to?");
	if (!walkSpeed.value) return;
	if (!_.player._playerContainer) {
		const interval = setInterval(() => {
			if (_.player._playerContainer) {
				clearInterval(interval);
				_.player._playerContainer.walkSpeed = parseFloat(walkSpeed.value);
			}
		}, 100);
	} else _.player._playerContainer.walkSpeed = parseFloat(walkSpeed.value) || 1.5;
	await Toast.fire("Success!", `Successfully made walk speed ${parseFloat(walkSpeed.value) || 1.5}!`, "success");
});

new Toggler(category.utility, "Toggle Click Teleporting").setEnabled(async () => {
	_.player._playerContainer.walkSpeed = 500;
	await Toast.fire("Success!", "Successfully enabled teleport click.", "success");
}).setDisabled(async () => {
	_.player._playerContainer.walkSpeed = 1.5;
	await Toast.fire("Success!", "Successfully disabled teleport click.", "success");
});

new Toggler(category.utility, "Pause Game").setEnabled(async () => {
	_.network.game._paused = true;
	await Toast.fire("Success!", "Successfully paused Prodigy.", "success");
}).setDisabled(async () => {
	_.network.game._paused = false;
	await Toast.fire("Success!", "Successfully resumed Prodigy.", "success");
});
