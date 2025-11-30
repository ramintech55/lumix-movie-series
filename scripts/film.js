document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("movies-btn").addEventListener("click", () => {
        window.location.href = "movies.html";
    });
    
    document.getElementById("series-btn").addEventListener("click", () => {
        window.location.href = "series.html";
    });
    
    document.getElementById("home-btn").addEventListener("click", () => {
        window.location.href = "home.html";
    });
    
        const film = JSON.parse(localStorage.getItem("selectedFilm"));
    
        if (film) {
            document.querySelector(".name").textContent = film.title;
            document.querySelector(".info").textContent = film.info;
            document.querySelector(".about").textContent = film.description;
            document.querySelector(".film-thumbnail").src = film.thumbnail;
        } else {
            console.error("Cannot find the movie.");
        }
    
    // Suggestions Movie Slide
    
        loadFilms();
    
    async function loadFilms() {
        try {
            const response = await fetch("home/trends.json");
            if(!response.ok) throw new Error("No Information");
            const data = await response.json();
    
            const container = document.querySelector(".trends");
    
    
            data.forEach(film => {
                const card = document.createElement("div");
                card.classList.add("trend");
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
    
            initializeSlider();
        } catch (error) {
            console.error("Error:", error.message);
        }
    }
    
    function initializeSlider() {
        const prevTrendBtn = document.querySelector(".prevTrendBtn");
        const nextTrendBtn = document.querySelector(".nextTrendBtn");
        const trendsDiv = document.querySelector(".trends");
        const trendItems = document.querySelectorAll(".trend");
    
        let trendsIndex = 0;
        let trendWidth = document.querySelector(".trend").offsetWidth;
    
        function updateTrendsPosition(withTransition = true) {
            if (withTransition) {
                trendsDiv.style.transition = "transform 0.5s ease-in-out";
            } else {
                trendsDiv.style.transition = "none";
            }
    
            trendsDiv.style.transform = `translateX(-${trendsIndex * trendWidth}px)`;
    
            prevTrendBtn.style.display = (trendsIndex === 0) ? "none" : "block";
            nextTrendBtn.style.display = (trendsIndex === trendItems.length - 1) ? "none" : "block";
        }
    
        window.addEventListener("resize", () => {
            trendWidth = document.querySelector(".trend").offsetWidth;
            updateTrendsPosition(false);
        });
    
        prevTrendBtn.addEventListener("click", () => {
            if (trendsIndex > 0) {
                trendsIndex--;
                updateTrendsPosition();
            }
        });
    
        nextTrendBtn.addEventListener("click", () => {
            if (trendsIndex < trendItems.length - 1) {
                trendsIndex++;
                updateTrendsPosition();
            }
        });
    
        let startX = 0;
        let moveX = 0;
        let isSwiping = false;
    
        trendsDiv.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
            trendsDiv.style.transition = "none";
        });
    
        trendsDiv.addEventListener("touchmove", (e) => {
            if (!isSwiping) return;
            moveX = e.touches[0].clientX - startX;
            trendsDiv.style.transform = `translateX(${moveX - trendsIndex * trendWidth}px)`;
        });
    
        trendsDiv.addEventListener("touchend", () => {
            if (!isSwiping) return;
    
            if (Math.abs(moveX) > trendWidth / 4) {
                if (moveX > 0 && trendsIndex > 0) {
                    trendsIndex--;
                } else if (moveX < 0 && trendsIndex < trendItems.length - 1) {
                    trendsIndex++;
                }
            }
    
            updateTrendsPosition(true);
            isSwiping = false;
            moveX = 0;
        });
    
        updateTrendsPosition();
    }
});