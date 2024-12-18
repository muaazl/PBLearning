const joke = document.getElementById('jokeText');
const jokeBtn = document.getElementById('newJokeBtn');
const cpyBtn = document.getElementById('copyJokeBtn');

jokeBtn.addEventListener('click', jokeFn);
cpyBtn.addEventListener('click', cpyFn);

jokeFn();

function jokeFn() {
    fetch('https://official-joke-api.appspot.com/random_joke')
        .then(response => response.json())
        .then(data => {
            joke.textContent = `${data.setup} - ${data.punchline}`;
        })
        .catch(error => {
            console.error("Error fetching joke:", error);
            joke.textContent = "Failed to fetch joke. Please try again.";
        });
}

function cpyFn() {
    const textArea = document.createElement('textarea');
    textArea.value = joke.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert("Joke copied to clipboard!");
}
