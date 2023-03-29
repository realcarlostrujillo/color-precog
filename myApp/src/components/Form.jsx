import React, { useState } from "react";

const MAX = 1_000_000;
const USER_ID = "krloslao90";
const APP_ID = "color-precog";
const MODEL_ID = "color-recognition";
const PAT = "3f8003a72aee4c9cb2c46af28832f94d";
const baseImageUrl = "https://loremflickr.com/1200/630/landscape?lock=";

const generateRandomImageUrl = () => baseImageUrl + Math.floor(Math.random() * MAX).toString();

const fetchOptions = (imgUrl) => {
	const raw = JSON.stringify({
		user_app_id: {
			user_id: USER_ID,
			app_id: APP_ID,
		},
		inputs: [
			{
				data: {
					image: {
						url: imgUrl,
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

function Form() {
	const [colors, setColors] = useState();
	const [imageURL, setImageUrl] = useState(generateRandomImageUrl);	
	
	const [imageLoading, setImageLoading] = useState(true);
	const [colorsLoading, setColorsLoading] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();
		setColorsLoading(true);

		fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", fetchOptions(imageURL))
			.then((response) => response.json())
			.then((result) => {
				setColors(result.outputs[0].data.colors);
				setColorsLoading(false);
			})
			.catch((error) => console.log("error", error));
	};

	const randomPhoto = (event) => {
		event.preventDefault();
		setImageLoading(true);
		setImageUrl(generateRandomImageUrl);
		setColors();
	};

	const handleImageLoad = () => {
		setImageLoading(false);
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<input type="text" value={imageURL} onChange={(event) => setImageUrl(event.target.value)} />
				<button type="submit">Submit</button>
				<button onClick={(event) => randomPhoto(event)}>Random Photo</button>
			</form>			
			<div>
				{imageLoading && <p>Loading Image...</p>}
				{imageURL && <img src={imageURL} alt="Image" key={imageURL} onLoad={handleImageLoad} />}

				{colorsLoading && <p>Loading colors...</p>}
				{(colors && !colorsLoading) &&
					colors.map((color) => {
						return (
							<div key={color.raw_hex} style={{ backgroundColor: color.w3c.hex }}>
								<p>{color.w3c.name}</p>
								<p>{color.w3c.hex}</p>
							</div>
						);
					})}
			</div>
		</>
	);
}

export default Form;
