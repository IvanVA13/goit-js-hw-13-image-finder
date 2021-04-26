const options = {
    BASE_URL: 'https://pixabay.com/api/',
    KEY: '21270249-2948d6894814039909ab6eb3b',
    page: 1,
    per_page: 12,
    query: '',
    last_page: 42,
}

function fetchPictures() {
    return fetch(`${options.BASE_URL}?image_type=photo&orientation=horizontal&q=${options.query}&page=${options.page}&per_page=${options.per_page}&key=${options.KEY}`).then(data => {
        if (!data.ok) {
            throw data
        }
       return data.json()
    })
}

export default {fetchPictures, options}