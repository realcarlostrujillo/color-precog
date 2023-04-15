// Move this to a .env file
const USER_ID = "krloslao90";
const APP_ID = "color-precog";
const MODEL_ID = "color-recognition";
const PAT = "3f8003a72aee4c9cb2c46af28832f94d";

const fetchOptions = (type, payload) => {
	if (type === "base64") {
		payload = payload.split(",")[1];
	}

	const raw = JSON.stringify({
		user_app_id: {
			user_id: USER_ID,
			app_id: APP_ID,
		},
		inputs: [
			{
				data: {
					image: {
						[type]: payload,
					},
				},
			},
		],
	});

	const requestOptions = {
		method: "POST",
		headers: {
			Accept: "application/json",
			Authorization: "Key " + PAT,
		},
		body: raw,
	};

	return requestOptions;
};

export async function fetchColors(type, payload) {
	const response = await fetch(
		"https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
		fetchOptions(type, payload)
	);
	const result = await response.json();
	return result;
}

export const generateRandomImageUrl = (width, height) => {
	const MAX = 1_000_000;
	const baseImageUrl = `https://loremflickr.com/${width}/${height}/landscape?lock=`;
	return baseImageUrl + Math.floor(Math.random() * MAX).toString();
};

export const canLoadImage = (url) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.src = url;
		img.onload = () => resolve(true);
		img.onerror = () => resolve(false);
	});
};
