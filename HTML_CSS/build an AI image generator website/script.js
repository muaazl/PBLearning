let generateImageForm = document.getElementById('generate-image-form');
let formInput = document.getElementById('input-value');
let imageContainerText = document.getElementById('imageContainerText');
let imageGenerated = document.getElementById('generated-image');
let imageContainer = document.getElementById('images-visible');

const STABILITY_API_KEY = "sk-SG1NUyycdos8olbXsejUPC0ZJuOUeayOGu7lohUPu0quRsQI";
const STABILITY_API_URL = "https://api.stability.ai/v2beta/stable-image/generate/sd3";

async function fetchImages(prompt) {
    try {
        // Show loading text
        imageContainerText.innerText = "Generating your image...";
        imageContainer.style.display = "block";

        // Prepare FormData payload
        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("output_format", "jpeg");

        // Send POST request to Stability AI API
        const response = await fetch(STABILITY_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${STABILITY_API_KEY}`,
                "Accept": "image/*"
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Failed with status: ${response.status}`);
        }

        // Get the response as a Blob (binary data)
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);

        // Set the generated image source
        imageGenerated.src = imageUrl;
        imageContainerText.innerText = "Here's your generated image!";

    } catch (err) {
        console.error('API Request Error:', err.message);
        imageContainerText.innerText = "Something went wrong. Try again!";
    }
}

// Form submit handler
generateImageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const enteredText = formInput.value.trim();
    if (enteredText) {
        fetchImages(enteredText);
    } else {
        imageContainerText.innerText = "Prompt field cannot be empty!";
    }
});
