const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

let films = [];

async function loadAllFilms() {
const urls = [
    "/movies/action.json",
    "/movies/adventure.json",
    "/movies/animation.json",
    "/movies/comedy.json",
    "/movies/documentary.json",
    "/movies/drama.json",
    "/movies/fantasy.json",
    "/movies/featured.json",
    "/movies/horror.json",
    "/movies/thriller.json",
    "/series/action.json",
    "/series/adventure.json",
    "/series/animation.json",
    "/series/comedy.json",
    "/series/documentary.json",
    "/series/drama.json",
    "/series/fantasy.json",
    "/series/featured.json",
    "/series/horror.json",
    "/series/thriller.json",
];

// Tüm dosyaları paralel olarak getir
const responses = await Promise.all(urls.map(url => fetch(url)));
const dataArrays = await Promise.all(responses.map(res => res.json()));

// Tüm JSON verilerini tek diziye birleştir
films = dataArrays.flat();
}

searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredFilms = films.filter(film =>
        film.title.toLowerCase().includes(searchTerm)
    );

    displaySearchResults(filteredFilms);
});

function displaySearchResults(filteredFilms) {
    searchResults.innerHTML = "";

    if (filteredFilms.length === 0) {
        searchResults.innerHTML = "<li>Couldn't find the film</li>";
    } else {
        filteredFilms.forEach(film => {
            const listItem = document.createElement("li");
            listItem.textContent = film.title;
            listItem.addEventListener("click", () => {
                localStorage.setItem("selectedFilm", JSON.stringify(film));
                window.location.href = "film.html";
            });
            searchResults.appendChild(listItem);
        });
    }
}

loadAllFilms();
