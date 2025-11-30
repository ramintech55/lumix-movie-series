document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("movies-btn").addEventListener("click", () => {
        window.location.href = "movies.html";
    });
    
    document.getElementById("series-btn").addEventListener("click", () => {
        window.location.href = "series.html";
    });
    
    // Search Bar
    
    const input = document.querySelector(".search-input");
    const searchBtn = document.querySelector(".search-btn");
    
    searchBtn.addEventListener("click", () => {
        input.classList.toggle("active");

        if (searchInput.classList.contains("active")) {
            searchResults.style.display = "block";
        } else {
            searchResults.style.display = "none";
        }
    
        document.addEventListener("click", (e) => {
            if (!e.composedPath().includes(searchBtn) && !e.composedPath().includes(input)) {
                input.classList.remove("active");
            }
        });
    });
    
    // Slider
    
    let currentIndex = 0;
    let startX = 0;
    let isSwiping = false;
    
    const slider = document.querySelector(".slider");
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".prevBtn");
    const nextBtn = document.querySelector(".nextBtn");
    const lines = document.querySelectorAll(".line");
    
    function updateSliderPosition() {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        lines.forEach((line, index) => {
            if (currentIndex === index) {
                line.classList.add("active");
            } else {
                line.classList.remove("active");
            }
        });
    }
    
    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
        updateSliderPosition();
    });
    
    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
        updateSliderPosition();
    });
    
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSliderPosition();
    }, 5000);
    
    slider.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
    });
    
    slider.addEventListener("touchmove", (e) => {
        if (!isSwiping) return;
        const moveX = e.touches[0].clientX - startX;
        if (Math.abs(moveX) > 50) {
            if (moveX > 0) {
                currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
            } else {
                currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
            }
            updateSliderPosition();
            isSwiping = false;
        }
    });
    
    slider.addEventListener("touchend", () => {
        isSwiping = false;
    });
    updateSliderPosition();
    
    // Trend Movies Slide
    
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
            trendsDiv.style.transition = "none"; // geçiş olmadan hareket et
        });
    
        trendsDiv.addEventListener("touchmove", (e) => {
            if (!isSwiping) return;
            moveX = e.touches[0].clientX - startX;
            trendsDiv.style.transform = `translateX(${moveX - trendsIndex * trendWidth}px)`;
        });
    
        trendsDiv.addEventListener("touchend", () => {
            if (!isSwiping) return;
            if (Math.abs(moveX) > trendWidth / 4) { // eşiği daha kullanıcı dostu hale getir
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
        
    // New Movies Slide
    
    loadNews();
    
    async function loadNews() {
        try {
            const response = await fetch("home/news.json");
            if(!response.ok) throw new Error("No Information");
            const data = await response.json();
    
            const newscontainer = document.querySelector(".news");
    
    
            data.forEach(film => {
                const card = document.createElement("div");
                card.classList.add("new");
                card.innerHTML = `
                <div class="poster"><img src="${film.image}" alt="${film.title}"></div>
                <h4>${film.title}</h4>`
    
                const poster = card.querySelector(".poster");
                poster.addEventListener("click", () => {
                    localStorage.setItem("selectedFilm", JSON.stringify(film));
                    window.location.href = "film.html";
                });
    
                newscontainer.appendChild(card);
            });
    
            initializeSliderNews();
        } catch (error) {
            console.error("Error:", error.message);
        }
    }
    
    function initializeSliderNews() {
        const prevNewsBtn = document.querySelector(".prevNewsBtn");
        const nextNewsBtn = document.querySelector(".nextNewsBtn");
        const newsDiv = document.querySelector(".news");
        const newItems = document.querySelectorAll(".new");
    
        let newsIndex = 0;
        let newWidth = document.querySelector(".new").offsetWidth;
    
        function updateNewsPosition(withTransition = true) {
            if (withTransition) {
                newsDiv.style.transition = "transform 0.5s ease-in-out";
            } else {
                newsDiv.style.transition = "none";
            }
    
            newsDiv.style.transform = `translateX(-${newsIndex * newWidth}px)`;
    
            prevNewsBtn.style.display = (newsIndex === 0) ? "none" : "block";
            nextNewsBtn.style.display = (newsIndex === newItems.length - 1) ? "none" : "block";
        }
    
        window.addEventListener("resize", () => {
            newWidth = document.querySelector(".new").offsetWidth;
            updateNewsPosition(false);
        });
    
        prevNewsBtn.addEventListener("click", () => {
            if (newsIndex > 0) {
                newsIndex--;
                updateNewsPosition();
            }
        });
    
        nextNewsBtn.addEventListener("click", () => {
            if (newsIndex < newItems.length - 1) {
                newsIndex++;
                updateNewsPosition();
            }
        });
    
        let startX = 0;
        let moveX = 0;
        let isSwiping = false;
    
        newsDiv.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
            newsDiv.style.transition = "none";
        });
    
        newsDiv.addEventListener("touchmove", (e) => {
            if (!isSwiping) return;
            moveX = e.touches[0].clientX - startX;
            newsDiv.style.transform = `translateX(${moveX - newsIndex * newWidth}px)`;
        });
    
        newsDiv.addEventListener("touchend", () => {
            if (!isSwiping) return;
    
            if (Math.abs(moveX) > newWidth / 4) {
                if (moveX > 0 && newsIndex > 0) {
                    newsIndex--;
                } else if (moveX < 0 && newsIndex < newItems.length - 1) {
                    newsIndex++;
                }
            }
    
            updateNewsPosition(true);
            isSwiping = false;
            moveX = 0;
        });
    
        updateNewsPosition();
    }
        
    // Recently watched movies
    
    loadRecentlies();
    
    async function loadRecentlies() {
        try {
            const response = await fetch("home/recently.json");
            if(!response.ok) throw new Error("No Information");
            const data = await response.json();
    
            const recentliesContainer = document.querySelector(".recentlies");
    
    
            data.forEach(film => {
                const card = document.createElement("div");
                card.classList.add("recently");
                card.innerHTML = `
                <div class="poster"><img src="${film.image}" alt="${film.title}"></div>
                <h4>${film.title}</h4>`
    
                const poster = card.querySelector(".poster");
                poster.addEventListener("click", () => {
                    localStorage.setItem("selectedFilm", JSON.stringify(film));
                    window.location.href = "film.html";
                });
    
                recentliesContainer.appendChild(card);
            });
    
            initializeSliderRecentlies();
        } catch (error) {
            console.error("Error:", error.message);
        }
    }
    
    function initializeSliderRecentlies() {
        const prevRecentlyBtn = document.querySelector(".prevRecentlyBtn");
        const nextRecentlyBtn = document.querySelector(".nextRecentlyBtn");
        const recentliesDiv = document.querySelector(".recentlies");
        const recentlyItems = document.querySelectorAll(".recently");
    
        let recentlyIndex = 0;
        let recentlyWidth = document.querySelector(".recently").offsetWidth;
    
        function updateRecentlyPosition(withTransition = true) {
            if (withTransition) {
                recentliesDiv.style.transition = "transform 0.5s ease-in-out";
            } else {
                recentliesDiv.style.transition = "none";
            }
    
            recentliesDiv.style.transform = `translateX(-${recentlyIndex * recentlyWidth}px)`;
    
            prevRecentlyBtn.style.display = (recentlyIndex === 0) ? "none" : "block";
            nextRecentlyBtn.style.display = (recentlyIndex === recentlyItems.length - 1) ? "none" : "block";
        }
    
        window.addEventListener("resize", () => {
            recentlyWidth = document.querySelector(".recently").offsetWidth;
            updateRecentlyPosition(false);
        });
    
        prevRecentlyBtn.addEventListener("click", () => {
            if (recentlyIndex > 0) {
                recentlyIndex--;
                updateRecentlyPosition();
            }
        });
    
        nextRecentlyBtn.addEventListener("click", () => {
            if (recentlyIndex < recentlyItems.length - 1) {
                recentlyIndex++;
                updateRecentlyPosition();
            }
        });
    
        let startX = 0;
        let moveX = 0;
        let isSwiping = false;
    
        recentliesDiv.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
            recentliesDiv.style.transition = "none";
        });
    
        recentliesDiv.addEventListener("touchmove", (e) => {
            if (!isSwiping) return;
            moveX = e.touches[0].clientX - startX;
            recentliesDiv.style.transform = `translateX(${moveX - recentlyIndex * recentlyWidth}px)`;
        });
    
        recentliesDiv.addEventListener("touchend", () => {
            if (!isSwiping) return;
    
            if (Math.abs(moveX) > recentlyWidth / 4) {
                if (moveX > 0 && recentlyIndex > 0) {
                    recentlyIndex--;
                } else if (moveX < 0 && recentlyIndex < recentlyItems.length - 1) {
                    recentlyIndex++;
                }
            }
    
            updateRecentlyPosition(true);
            isSwiping = false;
            moveX = 0;
        });
    
        updateRecentlyPosition();
    }
});