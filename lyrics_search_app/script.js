const apiURL = 'https://api.lyrics.ovh'

document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim()
    if (query) {
        showLoading()
        searchSongs(query)
    } else {
        alert("Please enter a song or artist name")
    }
})

document.getElementById('clearBtn').addEventListener('click' , () => {
    document.getElementById('searchInput').value = ''
    document.getElementById('results').innerHTML = ''
})

function searchSongs(query) {
    fetch(`${apiURL}/suggest/${query}`)
    .then(response => response.json())
    .then(data => displayResults(data))
    .catch(err => console.error(err))
    .finally(() => hideLoading())
}

function displayResults(data) {
    const resultsContainer = document.getElementById('results')
    resultsContainer.innerHTML = ''

    if (data.data.length > 0) {
        data.data.slice(0, 5).forEach(song => {
            const card = document.createElement('div')
            card.classList.add('result-card')

            card.innerHTML = `
                <h3>${song.title}</h3>
                <p>Artist: ${song.artist.name}</p>
                <button onclick="getLyrics('${song.artist.name}', '${song.title}')">Get Lyrics</button>
            `

            resultsContainer.appendChild(card)
        })
    } else {
        resultsContainer.innerHTML = '<p>No results found.</p>'
    }
}

function getLyrics(artist, title) {
    showLoading()
    fetch(`${apiURL}/v1/${artist}/${title}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = `
                <h2>${title} - ${artist}</h2>
                <pre>${data.lyrics || 'Lyrics not found!'}</pre>
                <button onclick="searchAgain()">Back</button>
            `
        })
        .catch(err => console.error(err))
        .finally(() => hideLoading())
}

function showLoading() {
    document.getElementById('loadingContainer').style.display = 'flex'
}

function hideLoading() {
    document.getElementById('loadingContainer').style.display = 'none'
}

function searchAgain() {
    document.getElementById('results').innerHTML = ''
}