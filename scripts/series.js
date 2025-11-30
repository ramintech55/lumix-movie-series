document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("home-btn").addEventListener("click", () => {
        window.location.href = "home.html";
    });
    
    document.getElementById("movies-btn").addEventListener("click", () => {
        window.location.href = "movies.html";
    });
    
    // Trending Series
    
        loadTrending();
        loadSoon();
    
        const selectedGenre = localStorage.getItem("selectedGenre");
        if (selectedGenre) {
            const selectedButton = Array.from(document.querySelectorAll('.genre')).find(button => button.innerText === selectedGenre);
            if (selectedButton) {
                selectedButton.classList.add('selected');
                loadMovies(selectedGenre); // İlgili genre'yi yükle
            }
        } else {
            // Eğer seçilen genre yoksa, Featured olarak varsayılanı yükle
            loadTrending();
        }
    
    async function loadTrending() {
        try {
            const response = await fetch("series/featured.json");
            if(!response.ok) throw new Error("No Information");
            const data = await response.json();
    
            const container = document.querySelector(".trendings");
    
    
            data.forEach(film => {
                const card = document.createElement("div");
                card.classList.add("trending");
                card.innerHTML = `
                <div class="poster"><img src="${film.image}" alt="${film.title}"></div>
                <h4>${film.title}</h4>`
    
                const poster = card.querySelector(".poster");
                poster.addEventListener("click", () => {
                    localStorage.setItem("selectedFilm", JSON.stringify(film));
                    window.location.href = "film.html";
                });
    
                container.appendChild(card);
            });
    
            initializeTrendingSlider();
        } catch (error) {
            console.error("Error:", error.message);
        }
    }
    
    function initializeTrendingSlider() {
        const prevTrendingBtn = document.querySelector(".prevTrendingBtn");
        const nextTrendingBtn = document.querySelector(".nextTrendingBtn");
        const trendingsDiv = document.querySelector(".trendings");
        const trendingItems = document.querySelectorAll(".trending");
    
        let trendingsIndex = 0;
        let trendingWidth = document.querySelector(".trending").offsetWidth;
    
        function updateTrendingsPosition(withTransition = true) {
            if (withTransition) {
                trendingsDiv.style.transition = "transform 0.5s ease-in-out";
            } else {
                trendingsDiv.style.transition = "none";
            }
    
            trendingsDiv.style.transform = `translateX(-${trendingsIndex * trendingWidth}px)`;
    
            prevTrendingBtn.style.display = (trendingsIndex === 0) ? "none" : "block";
            nextTrendingBtn.style.display = (trendingsIndex === trendingItems.length - 1) ? "none" : "block";
        }
    
        window.addEventListener("resize", () => {
            trendingWidth = document.querySelector(".trending").offsetWidth;
            updateTrendingsPosition(false);
        });
    
        prevTrendingBtn.addEventListener("click", () => {
            if (trendingsIndex > 0) {
                trendingsIndex--;
                updateTrendingsPosition();
            }
        });
    
        nextTrendingBtn.addEventListener("click", () => {
            if (trendingsIndex < trendingItems.length - 1) {
                trendingsIndex++;
                updateTrendingsPosition();
            }
        });
    
        let startX = 0;
        let moveX = 0;
        let isSwiping = false;
    
        trendingsDiv.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
            trendingsDiv.style.transition = "none";
        });
    
        trendingsDiv.addEventListener("touchmove", (e) => {
            if (!isSwiping) return;
            moveX = e.touches[0].clientX - startX;
            trendingsDiv.style.transform = `translateX(${moveX - trendingsIndex * trendingWidth}px)`;
        });
    
        trendingsDiv.addEventListener("touchend", () => {
            if (!isSwiping) return;
    
            if (Math.abs(moveX) > trendingWidth / 4) {
                if (moveX > 0 && trendingsIndex > 0) {
                    trendingsIndex--;
                } else if (moveX < 0 && trendingsIndex < trendingItems.length - 1) {
                    trendingsIndex++;
                }
            }
    
            updateTrendingsPosition(true);
            isSwiping = false;
            moveX = 0;
        });
    
        updateTrendingsPosition();
    }
        
    // Soon Series
    
    async function loadSoon() {
        try {
            const response = await fetch("series/series-soon.json");
            if(!response.ok) throw new Error("No Information");
            const data = await response.json();
    
            const container = document.querySelector(".soons");
    
    
            data.forEach(film => {
                const card = document.createElement("div");
                card.classList.add("soon");
                card.innerHTML = `
                <div class="soon-poster">
                    <img src="${film.image}" alt="${film.title}">
                    <div class="trailer-overlay"><i class="fas fa-play"></i> Watch Trailer</div>
                </div>
                <h4>${film.title}, ${film.season} (${film.releaseDate})</h4>`
                container.appendChild(card);
            });
    
            initializeSoonSlider();
        } catch (error) {
            console.error("Error:", error.message);
        }
    }
    
    function initializeSoonSlider() {
        const prevSoonBtn = document.querySelector(".prevSoonBtn");
        const nextSoonBtn = document.querySelector(".nextSoonBtn");
        const soonsDiv = document.querySelector(".soons");
        const soonItems = document.querySelectorAll(".soon");
    
        let soonsIndex = 0;
        let soonWidth = document.querySelector(".soon").offsetWidth;
    
        function updateSoonsPosition(withTransition = true) {
            if (withTransition) {
                soonsDiv.style.transition = "transform 0.5s ease-in-out";
            } else {
                soonsDiv.style.transition = "none";
            }
    
            soonsDiv.style.transform = `translateX(-${soonsIndex * soonWidth}px)`;
    
            prevSoonBtn.style.display = (soonsIndex === 0) ? "none" : "block";
            nextSoonBtn.style.display = (soonsIndex === soonItems.length - 1) ? "none" : "block";
        }
    
        window.addEventListener("resize", () => {
            soonWidth = document.querySelector(".soon").offsetWidth;
            updateSoonsPosition(false);
        });
    
        prevSoonBtn.addEventListener("click", () => {
            if (soonsIndex > 0) {
                soonsIndex--;
                updateSoonsPosition();
            }
        });
    
        nextSoonBtn.addEventListener("click", () => {
            if (soonsIndex < soonItems.length - 1) {
                soonsIndex++;
                updateSoonsPosition();
            }
        });
    
        let startX = 0;
        let moveX = 0;
        let isSwiping = false;
    
        soonsDiv.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
            soonsDiv.style.transition = "none";
        });
    
        soonsDiv.addEventListener("touchmove", (e) => {
            if (!isSwiping) return;
            moveX = e.touches[0].clientX - startX;
            soonsDiv.style.transform = `translateX(${moveX - soonsIndex * soonWidth}px)`;
        });
    
        soonsDiv.addEventListener("touchend", () => {
            if (!isSwiping) return;
    
            if (Math.abs(moveX) > soonWidth / 4) {
                if (moveX > 0 && soonsIndex > 0) {
                    soonsIndex--;
                } else if (moveX < 0 && soonsIndex < soonItems.length - 1) {
                    soonsIndex++;
                }
            }
    
            updateSoonsPosition(true);
            isSwiping = false;
            moveX = 0;
        });
    
        updateSoonsPosition();
    }
            
    // Genres - Genre Buttons
    const genreButtons = document.querySelectorAll('.genre');
    genreButtons.forEach(button => {
        button.addEventListener('click', function() {
            genreButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
    
            localStorage.setItem("selectedGenre", this.innerText);
    
            loadMovies(this.innerText);
        });
    });
    
    // Load Movies by Genre
    async function loadMovies(genre) {
        try {
            const response = await fetch(`series/${genre.toLowerCase()}.json`);
            if (!response.ok) throw new Error("No Information");
            const data = await response.json();
    
            const container = document.querySelector(".trendings");
            container.innerHTML = ""; // Önceki filmleri temizle
    
            data.forEach(film => {
                const card = document.createElement("div");
                card.classList.add("trending");
                card.innerHTML = `
                    <div class="poster"><img src="${film.image}" alt="${film.title}"></div>
                    <h4>${film.title}</h4>`;
    
                const poster = card.querySelector(".poster");
                poster.addEventListener("click", () => {
                    localStorage.setItem("selectedFilm", JSON.stringify(film));
                    window.location.href = "film.html";
                });
                container.appendChild(card);
            });
        } catch (error) {
            console.error("Error:", error.message);
        }
    }    
});